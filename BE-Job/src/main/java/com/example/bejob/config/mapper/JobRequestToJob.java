package com.example.bejob.config.mapper;

import com.example.bejob.dto.request.JobRequest;
import com.example.bejob.entity.Job;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;

@Component
public class JobRequestToJob extends PropertyMap<JobRequest, Job> {

    @Override
    protected void configure() {
        skip(destination.getId());
        skip(destination.getEmployer());
        map().setCityId(source.getCity());
        map().setDistrictId(source.getDistrict());
        map().setEducationLevelId(source.getEducation());
        map().setIndustryId(source.getIndustry());
        map().setJobTypeId(source.getJobType());
        map().setPositionId(source.getPosition());
        map().setContractTypeId(source.getContractType());
    }
}