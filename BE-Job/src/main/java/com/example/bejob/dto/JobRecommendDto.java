package com.example.bejob.dto;

import com.example.bejob.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRecommendDto {
    private Long idJob;

    private String positionWorkJob;

    private List<Skill> skillsJob;

    private double similarity;
}
