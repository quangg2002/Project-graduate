package com.example.bejob.websocket.dto;

import com.example.bejob.enums.MessageType;
import com.example.bejob.enums.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class MessageDto {
    private UUID id;
    private String sender;
    private String receiver;
    private String message;

    @JsonFormat(pattern = "M/d/yyyy, h:mm:ss a") // Định dạng khớp với chuỗi JSON
    private LocalDateTime sentTime;

    private Status status;
    private MessageType type;
    private String fileUrl;
}