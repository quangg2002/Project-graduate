package com.example.bejob.service;

import com.itextpdf.html2pdf.HtmlConverter;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.io.ByteArrayOutputStream;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CvService {

    private static final String TEMPLATE_NAME = "cv-template";
    private static final String TEMPLATE_PREFIX = "/templates/";
    private static final String TEMPLATE_SUFFIX = ".html";
    private static final String UTF_8 = "UTF-8";

    private final SpringTemplateEngine templateEngine;

    public CvService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
        this.templateEngine.setEnableSpringELCompiler(true);
        this.templateEngine.setTemplateResolver(htmlTemplateResolver());
    }

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
        vars.add(Pair.of("name", "Quangancut"));
        return getContent(TEMPLATE_NAME + layout, vars);
    }
}
