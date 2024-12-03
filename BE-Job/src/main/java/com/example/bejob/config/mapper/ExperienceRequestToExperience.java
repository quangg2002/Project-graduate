package com.example.bejob.config.mapper;

import com.example.bejob.dto.request.ExperienceRequest;
import com.example.bejob.entity.Experience;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;

@Component
public class ExperienceRequestToExperience extends PropertyMap<ExperienceRequest, Experience> {

    @Override
    protected void configure() {
        skip(destination.getId());
        skip(destination.getEmployeeId());
    }
}
