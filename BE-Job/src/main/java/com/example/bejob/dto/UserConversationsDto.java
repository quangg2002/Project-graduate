package com.example.bejob.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserConversationsDto {
    private Long userId;
    private String name;
    private String avtUrl;
    private List<MessageDto> last10Messages;
}
