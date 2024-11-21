package com.example.bejob.websocket.controller;

import com.example.bejob.entity.User;
import com.example.bejob.enums.Status;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.websocket.dto.MessageDto;
import com.example.bejob.websocket.dto.UserConversationsDto;
import com.example.bejob.websocket.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@CrossOrigin
@Slf4j
@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @ResponseBody
    @GetMapping("/")
    public String index() {
        return "WS IS RUNNING.";
    }

    @ResponseBody
    @GetMapping("/conversations")
    public ResponseEntity<ResponseDto<List<UserConversationsDto>>> getUserConversations(@AuthenticationPrincipal User user) {
        List<UserConversationsDto> conversations = messageService.getUserConversations(user.getId());
        return ResponseBuilder.okResponse("Query success", conversations, StatusCodeEnum.MESSAGE1000);
    }

    @MessageMapping("/getConversations") // Đây là endpoint mà client sẽ gửi tin nhắn tới
    public void sendConversationsToUser(@AuthenticationPrincipal User user) {
        // Lấy danh sách cuộc trò chuyện
        List<UserConversationsDto> conversations = messageService.getUserConversations(user.getId());

        // Gửi dữ liệu đến một user cụ thể qua WebSocket (với định danh của người nhận)
        simpMessagingTemplate.convertAndSendToUser(user.getId().toString(), "/queue/conversations", conversations);
    }

    @MessageMapping("/private-message")
    public void processPrivateMessage(@Payload MessageDto messageDto) {
        log.info("Private message from {} to {}: {}", messageDto.getSender(), messageDto.getReceiver(), messageDto.getMessage());
        if (messageDto.getStatus() != Status.JOIN) {
            messageService.saveMessage(messageDto);
        }
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(messageDto.getReceiver()), "/private", messageDto);
    }
}