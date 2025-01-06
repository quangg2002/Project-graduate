package com.example.bejob.service;

import com.example.bejob.dto.request.CvRequest;
import com.example.bejob.dto.response.CvEmployeeResponse;
import com.example.bejob.dto.response.CvListResponse;
import com.example.bejob.entity.*;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.repository.*;
import com.example.bejob.security.service.AuthenticationService;
import com.itextpdf.html2pdf.HtmlConverter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.io.ByteArrayOutputStream;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvService {
    private final CertificateRepository certificateRepository;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;
    private final EducationRepository educationRepository;
    private final FileService fileService;
    @Value("${minio.url.public}")
    private String publicUrl;

    private static final String TEMPLATE_NAME = "cv-template";
    private static final String TEMPLATE_PREFIX = "/templates/";
    private static final String TEMPLATE_SUFFIX = ".html";
    private static final String UTF_8 = "UTF-8";

    private final SpringTemplateEngine templateEngine;

    private final UserRepository userRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final EmployeeRepository employeeRepository;
    private final CvEmployeeRepository cvEmployeeRepository;
    private final HobbyRepository hobbyRepository;
    private static final Logger logger = LoggerFactory.getLogger(CvService.class);

    private ITemplateResolver htmlTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setPrefix(TEMPLATE_PREFIX);
        templateResolver.setSuffix(TEMPLATE_SUFFIX);
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding(UTF_8);
        return templateResolver;
    }

    public String getContent(@NotNull String templateName, List<Pair<String, Object>> contextVariables) {
        Context context = new Context();
        if (contextVariables != null) {
            contextVariables.forEach(var -> {
                context.setVariable(var.getFirst(), var.getSecond());
            });
        }
        return templateEngine.process(templateName, context);
    }

    public byte[] generateCv(String layout) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            String html = getContent(layout);
            HtmlConverter.convertToPdf(html, outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("hihihihihi", e);
            return new byte[0];
        }
    }

    public String getContent(String layout) throws UnknownHostException {
        List<Pair<String, Object>> vars = new ArrayList<>();
        CvEmployeeResponse cvEmployeeResponse = getCv(Long.valueOf(layout));
        if(cvEmployeeResponse != null) {
            vars.add(Pair.of("cv", cvEmployeeResponse));
        }
        return getContent(TEMPLATE_NAME + layout, vars);
    }

    public CvEmployeeResponse getCv(Long cvId) {
        try {
            String userName = authenticationService.getUserFromContext();

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                logger.warn("User not found with username: {}", userName);
                return null;
            }

            User user = optionalUser.get();

            Employee employee = employeeRepository.findByUserId(user.getId());
            if (employee == null) {
                logger.warn("Employee not found for user ID: {}", user.getId());
                return null;
            }

            CvEmployee cvEmployee = cvEmployeeRepository.findByCvIdAndEmployeeId(cvId, employee.getId())
                    .orElseGet(() -> {
                        CvEmployee newCvEmployee = new CvEmployee();
                        newCvEmployee.setCvId(cvId);
                        newCvEmployee.setEmployeeId(employee.getId());
                        return cvEmployeeRepository.save(newCvEmployee);
                    });


            List<Hobby> hobbyList = hobbyRepository.findByCvIdAndEmployeeId(cvEmployee.getCvId(), employee.getId());

            List<Education> educationList = educationRepository.findByCvIdAndEmployeeId(cvEmployee.getCvId(), employee.getId());

            List<Certificate> certificateList = certificateRepository.findByCvIdAndEmployeeId(cvEmployee.getCvId(), employee.getId());

            List<Project> projectList = projectRepository.findByCvIdAndEmployeeId(cvEmployee.getCvId(), employee.getId());

            CvEmployeeResponse cvEmployeeResponse = modelMapper.map(cvEmployee, CvEmployeeResponse.class);
            cvEmployeeResponse.setCertificates(certificateList);
            cvEmployeeResponse.setHobbies(hobbyList);
            cvEmployeeResponse.setProjects(projectList);
            cvEmployeeResponse.setEducations(educationList);

            return cvEmployeeResponse;
        } catch (Exception e) {
            logger.error("Error while fetching CV: ", e);
            return null;
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateCv(CvRequest cvRequest) {
        try {
            String userName = authenticationService.getUserFromContext();

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.not.found"),
                        StatusCodeEnum.AUTH0016
                );
            }

            User user = optionalUser.get();

            Employee employee = employeeRepository.findByUserId(user.getId());
            if (employee == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.employee"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            Optional<CvEmployee> cv = cvEmployeeRepository.findByCvIdAndEmployeeId(cvRequest.getLayout(), employee.getId());
            String img = null;
            if (cv.isPresent()) {
                img = cv.get().getAvatar();
                cvEmployeeRepository.deleteById(cv.get().getId());

                List<Hobby> hobbyList = hobbyRepository.findByCvIdAndEmployeeId(cvRequest.getLayout(), employee.getId());
                if (!hobbyList.isEmpty()) {
                    for (Hobby hobby : hobbyList) {
                        hobbyRepository.deleteById(hobby.getId());
                    }
                }

                List<Certificate> certificateList = certificateRepository.findByCvIdAndEmployeeId(cvRequest.getLayout(), employee.getId());
                if (!certificateList.isEmpty()) {
                    for (Certificate certificate : certificateList) {
                        certificateRepository.deleteById(certificate.getId());
                    }
                }

                List<Education> educationList = educationRepository.findByCvIdAndEmployeeId(cvRequest.getLayout(), employee.getId());
                if (!educationList.isEmpty()) {
                    for (Education education : educationList) {
                        educationRepository.deleteById(education.getId());
                    }
                }

                List<Project> projectList = projectRepository.findByCvIdAndEmployeeId(cvRequest.getLayout(), employee.getId());
                if (!projectList.isEmpty()) {
                    for (Project project : projectList) {
                        projectRepository.deleteById(project.getId());
                    }
                }
            }

            CvEmployee cvEmployee = CvEmployee.builder()
                    .employeeId(employee.getId())
                    .nameCv(cvRequest.getNameCv())
                    .name(cvRequest.getName())
                    .email(cvRequest.getEmail())
                    .dob(cvRequest.getDob())
                    .address(cvRequest.getAddress())
                    .position(cvRequest.getPosition())
                    .phone(cvRequest.getPhone())
                    .target(cvRequest.getTarget())
                    .cvId(cvRequest.getLayout())
                    .certificate(cvRequest.getLayout())
                    .education(cvRequest.getLayout())
                    .project(cvRequest.getLayout())
                    .hobby(cvRequest.getLayout())
                    .build();
            cvEmployee.setAvatar(img);
            cvEmployeeRepository.save(cvEmployee);

            for (Certificate cert : cvRequest.getCertificates()) {
                Certificate certificate = Certificate.builder()
                        .name(cert.getName())
                        .cvId(cvRequest.getLayout())
                        .employeeId(employee.getId())
                        .build();
                certificateRepository.save(certificate);
            }

            for (Hobby hobby : cvRequest.getHobbies()) {
                Hobby hob = Hobby.builder()
                        .name(hobby.getName())
                        .cvId(cvRequest.getLayout())
                        .employeeId(employee.getId())
                        .build();
                hobbyRepository.save(hob);
            }

            for (Education edu : cvRequest.getEducations()) {
                Education education = Education.builder()
                        .universityName(edu.getUniversityName())
                        .expertise(edu.getExpertise())
                        .endDate(edu.getEndDate())
                        .startDate(edu.getStartDate())
                        .description(edu.getDescription())
                        .cvId(cvRequest.getLayout())
                        .employeeId(employee.getId())
                        .build();
                educationRepository.save(education);
            }

            for (Project pro : cvRequest.getProjects()) {
                Project project = Project.builder()
                        .name(pro.getName())
                        .github(pro.getGithub())
                        .startDate(pro.getStartDate())
                        .endDate(pro.getEndDate())
                        .description(pro.getDescription())
                        .quantity(pro.getQuantity())
                        .cvId(cvRequest.getLayout())
                        .employeeId(employee.getId())
                        .build();
                projectRepository.save(project);
            }

            return ResponseBuilder.okResponse(
                    "success",
                    cvEmployee,
                    StatusCodeEnum.SUCCESS
            );
        }
        catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "fails",
                    StatusCodeEnum.FAIlS
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateAvtCv(MultipartFile avatar, Long idCv){
        try {
            String userName = authenticationService.getUserFromContext();

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.not.found"),
                        StatusCodeEnum.AUTH0016
                );
            }

            User user = optionalUser.get();

            Employee employee = employeeRepository.findByUserId(user.getId());
            if (employee == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.employee"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            Optional<CvEmployee> cv = cvEmployeeRepository.findByCvIdAndEmployeeId(idCv, employee.getId());

            if (avatar != null && !avatar.isEmpty()) {
                String avt = fileService.uploadImageFile(avatar, cv.get().getAvatar(), "AVATAR");
                if (avt == null) {
                    log.error("Upload file image avatar failed");
                    return ResponseBuilder.badRequestResponse(
                            languageService.getMessage("upload.file.avatar.failed"),
                            StatusCodeEnum.UPLOADFILE0001
                    );
                } else {
                    cv.get().setAvatar(publicUrl + "/" + avt);
                }
            }

            cvEmployeeRepository.save(cv.get());

            return ResponseBuilder.okResponse(
                    "success",
                    cv,
                    StatusCodeEnum.SUCCESS
            );
        }
        catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "Fails",
                    StatusCodeEnum.FAIlS
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getListCv(){
        try {
            String userName = authenticationService.getUserFromContext();

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.not.found"),
                        StatusCodeEnum.AUTH0016
                );
            }

            User user = optionalUser.get();

            Employee employee = employeeRepository.findByUserId(user.getId());
            if (employee == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.employee"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            List <CvEmployee> cvEmployeeList = cvEmployeeRepository.findByEmployeeId(employee.getId());

            List<CvListResponse> cvListResponses = cvEmployeeList.stream()
                    .map(cvEmployee -> new CvListResponse(
                            cvEmployee.getCvId(),
                            cvEmployee.getNameCv(),
                            cvEmployee.getUpdatedAt()
                    ))
                    .collect(Collectors.toList());

            return ResponseBuilder.okResponse(
                    "success",
                    cvListResponses,
                    StatusCodeEnum.SUCCESS
            );
        }
        catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "Fails",
                    StatusCodeEnum.FAIlS
            );
        }
    }
}
