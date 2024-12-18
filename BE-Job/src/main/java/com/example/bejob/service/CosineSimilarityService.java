package com.example.bejob.service;

import com.example.bejob.dto.JobRecommendDto;
import com.example.bejob.dto.UserRecommendDto;
import com.example.bejob.dto.response.JobRecommendResponse;
import com.example.bejob.entity.*;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.repository.*;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CosineSimilarityService {
    private final AuthenticationService authenticationService;

    private final EmployeeRepository employeeRepository;
    private final LanguageService languageService;
    private final UserRepository userRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final PositionRepository positionRepository;
    private final JobSkillRepository jobSkillRepository;
    private final CompanyRepository companyRepository;
    private final EmployerRepository employerRepository;
    private final CityRepository cityRepository;

    // Hàm tính điểm tương đồng giữa User và Job
    public double calculateSimilarity(UserRecommendDto user, JobRecommendDto job) {
        List<String> userTokens = tokenizePositionAndSkills(
                user.getPositionWorkEmployee(),
                user.getSkillsEmployee()
        );
        System.out.println("userTokens: " + userTokens);
        List<String> jobTokens = tokenizePositionAndSkills(
                job.getPositionWorkJob(),
                job.getSkillsJob()
        );

        System.out.println("jobTokens: " + jobTokens);

        return cosineSimilarity(tokenize(userTokens), tokenize(jobTokens));
    }

    // Kết hợp các từ từ positionWork và skill.getName()
    private List<String> tokenizePositionAndSkills(String position, List<Skill> skills) {
        List<String> tokens = new ArrayList<>();
        tokens.addAll(Arrays.asList(position.split("\\s+")));
        tokens.addAll(skills.stream().map(Skill::getName).collect(Collectors.toList()));
        return tokens;
    }

    // Tính Cosine Similarity giữa hai vector
    private double cosineSimilarity(Map<String, Integer> vectorA, Map<String, Integer> vectorB) {
        Set<String> allKeys = new HashSet<>(vectorA.keySet());
        allKeys.addAll(vectorB.keySet());

        double dotProduct = 0.0;
        double magnitudeA = 0.0;
        double magnitudeB = 0.0;

        for (String key : allKeys) {
            int valueA = vectorA.getOrDefault(key, 0);
            System.out.println("valueA: " + valueA);
            int valueB = vectorB.getOrDefault(key, 0);
            System.out.println("valueB: " + valueB);

            dotProduct += valueA * valueB;
            magnitudeA += Math.pow(valueA, 2);
            magnitudeB += Math.pow(valueB, 2);
        }

        return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
    }

    // Chuyển danh sách từ thành vector tần suất từ
    private Map<String, Integer> tokenize(List<String> tokens) {
        Map<String, Integer> frequencyMap = new HashMap<>();
        for (String word : tokens) {
            frequencyMap.put(word.toLowerCase(), frequencyMap.getOrDefault(word.toLowerCase(), 0) + 1);
        }
        System.out.println("frequencyMap: " + frequencyMap);
        return frequencyMap;
    }

    // Gợi ý danh sách công việc và trả về tối đa 5 công việc
    public List<JobRecommendDto> recommendJobs(UserRecommendDto user, List<JobRecommendDto> jobs) {
        return jobs.stream()
                .map(job -> {
                    double similarity = calculateSimilarity(user, job);
                    job.setSimilarity(similarity);
                    return job;
                })
                .sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity())) // Sắp xếp theo độ tương đồng giảm dần
                .limit(4) // Giới hạn 5 công việc cao nhất
                .collect(Collectors.toList());
    }

    public UserRecommendDto userRecommend() {
        String userName = authenticationService.getUserFromContext();

        Optional<User> user = userRepository.findByUsername(userName);

        if (user.isEmpty()) return null;

        Employee employee = employeeRepository.findByUserId(user.get().getId());

        if (employee == null) return null;

        List <EmployeeSkill> employeeSkills = employeeSkillRepository.findByEmployeeId(employee.getId());

        List<Long> skillIds = employeeSkills.stream()
                .map(EmployeeSkill::getSkillId)
                .collect(Collectors.toList());

        List<Skill> skillList = skillRepository.findAllById(skillIds);

        UserRecommendDto userRecommendDto = UserRecommendDto.builder()
                .positionWorkEmployee(employee.getCareer())
                .skillsEmployee(skillList)
                .build();

        return userRecommendDto;
    }

    public List<JobRecommendDto> jobRecommendDto(){
        List<Job> jobs = jobRepository.findAll();

        List<JobRecommendDto>jobRecommendDtos = jobs.stream()
                .map(job -> {
                    String position = positionRepository.findById(job.getPositionId())
                            .map(Position::getName)
                            .orElse(null);

                    List<JobSkill> jobSkills = jobSkillRepository.findByJobId(job.getId());

                    List<Long> skillIds = jobSkills.stream()
                            .map(JobSkill::getSkillId)
                            .collect(Collectors.toList());

                    List<Skill> skillList = skillRepository.findAllById(skillIds);

                    JobRecommendDto jobRecommendDto = JobRecommendDto.builder()
                            .idJob(job.getId())
                            .positionWorkJob(position)
                            .skillsJob(skillList)
                            .build();

                    return jobRecommendDto;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return jobRecommendDtos;
    }

    public List<JobRecommendResponse> jobRecommendResponses(){
        List<JobRecommendDto> jobRecommendDtos = recommendJobs(userRecommend(), jobRecommendDto());

        List<JobRecommendResponse> jobRecommendResponses = jobRecommendDtos.stream()
                .map(jobRecommendDto -> {
                    Job job = jobRepository.findById(jobRecommendDto.getIdJob()).orElse(null);

                    Employer employer = employerRepository.findById(job.getEmployer()).orElse(null);

                    Company company = companyRepository.findById(employer.getCompany()).orElse(null);

                    JobRecommendResponse jobRecommendResponse = JobRecommendResponse.builder()
                            .jobId(job.getId())
                            .companyId(company.getId())
                            .companyLogo(company.getLogo())
                            .companyCity(cityRepository.findById(company.getCity())
                                    .map(City::getName)
                                    .orElse(null)
                            )
                            .companyName(company.getCompanyName())
                            .jobDeadline(job.getDeadline())
                            .jobSalary(job.getSalary())
                            .jobDescription(job.getDescription())
                            .jobTitle(job.getTitle())
                            .nameSkill(jobRecommendDto.getSkillsJob().stream()
                                    .map(Skill::getName)
                                    .collect(Collectors.toList())
                            )
                            .similarity(jobRecommendDto.getSimilarity())
                            .build();
                    return jobRecommendResponse;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return jobRecommendResponses;
    }
}
