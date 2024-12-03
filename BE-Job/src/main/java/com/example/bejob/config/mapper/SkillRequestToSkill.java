package com.example.bejob.config.mapper;

import com.example.bejob.dto.request.SkillRequest;
import com.example.bejob.entity.Skill;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;

@Component
public class SkillRequestToSkill extends PropertyMap<SkillRequest, Skill> {

    @Override
    protected void configure() {
        skip(destination.getId());
    }
}
