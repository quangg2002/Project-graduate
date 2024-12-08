package com.example.bejob.service;

import com.example.bejob.dto.JobRecommendDto;
import com.example.bejob.dto.UserRecommendDto;
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

    // Hàm tính điểm tương đồng giữa User và Job
    public double calculateSimilarity(UserRecommendDto user, JobRecommendDto job) {
        String userDescription = user.getPositionWorkEmployee() + " " +
                user.getSkillsEmployee().stream().map(Skill::getName).collect(Collectors.joining(" "));
        System.out.println("userDescription" + userDescription);
        String jobDescription = job.getPositionWorkJob() + " " +
                job.getSkillsJob().stream().map(Skill::getName).collect(Collectors.joining(" "));
        System.out.println("jobDescription" + jobDescription);
        return cosineSimilarity(tokenize(userDescription), tokenize(jobDescription));
    }

    // Tính Cosine Similarity giữa hai vector
    private double cosineSimilarity(Map<CharSequence, Integer> vectorA, Map<CharSequence, Integer> vectorB) {
        Set<CharSequence> allKeys = new HashSet<>(vectorA.keySet());
        allKeys.addAll(vectorB.keySet());

        double dotProduct = 0.0;
        double magnitudeA = 0.0;
        double magnitudeB = 0.0;

        for (CharSequence key : allKeys) {
            int valueA = vectorA.getOrDefault(key, 0);
            int valueB = vectorB.getOrDefault(key, 0);

            dotProduct += valueA * valueB;
            magnitudeA += Math.pow(valueA, 2);
            magnitudeB += Math.pow(valueB, 2);
        }

        return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
    }

    // Tokenize văn bản thành vector tần suất từ
    private Map<CharSequence, Integer> tokenize(String text) {
        Map<CharSequence, Integer> frequencyMap = new HashMap<>();
        for (String word : text.toLowerCase().split("\\s+")) {
            frequencyMap.put(word, frequencyMap.getOrDefault(word, 0) + 1);
        }
        System.out.println("frequencyMap" + frequencyMap);
        return frequencyMap;
    }

    // Gợi ý danh sách công việc
    public List<JobRecommendDto> recommendJobs(UserRecommendDto user, List<JobRecommendDto> jobs) {
        return jobs.stream()
                .map(job -> {
                    double similarity = calculateSimilarity(user, job);
                    job.setSimilarity(similarity);
                    return job;
                })
                .sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity())) // Sắp xếp theo độ tương đồng
                .limit(5)
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

    public List<JobRecommendDto> recommendJob(){
        return recommendJobs(userRecommend(), jobRecommendDto());
    }
}
