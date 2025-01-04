package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyBoardResponse {
    private int jobQuantity;
    private long cvQuantity;
    private long cvQuantityNew;
}
