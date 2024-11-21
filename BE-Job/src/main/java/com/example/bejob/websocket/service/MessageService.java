package com.example.bejob.websocket.service;

import com.example.bejob.entity.Message;
import com.example.bejob.repository.UserRepository;
import com.example.bejob.websocket.dto.UserConversationsDto;
import com.example.bejob.websocket.repository.MessageRepository;
import com.example.bejob.websocket.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    @Autowired
    private final MessageRepository messageRepository;


    @Autowired
    private final UserRepository userRepository;

    public List<UserConversationsDto> getUserConversations(Long userId) {
        List<Message> messages = messageRepository.findTop10BySenderIdOrReceiverIdOrderBySentTimeDesc(userId, userId);

        return messages.stream()
                .collect(Collectors.groupingBy(message -> message.getSenderId() == userId ? message.getReceiverId() : message.getSenderId()))
                .entrySet()
                .stream()
                .map(entry -> {
                    Long otherUserId = entry.getKey();
                    List<MessageDto> last10Messages = entry.getValue().stream()
                            .sorted(Comparator.comparing(Message::getSentTime))
                            .map(message -> new MessageDto(
                                    message.getId(),
                                    String.valueOf(message.getSenderId()),
                                    String.valueOf(message.getReceiverId()),
                                    message.getMessage(),
                                    message.getSentTime(),
                                    message.getStatus(),
                                    message.getType(),
                                    message.getFileUrl()
                            ))
                            .collect(Collectors.toList());

                    return userRepository.findById(otherUserId)
                            .map(otherUser -> {
                                String name = otherUser.getUsername();
                                String avatar = otherUser.getAvatar();
                                return new UserConversationsDto(otherUserId, name, avatar, last10Messages);
                            }).orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void saveMessage(MessageDto messageDto) {
        Message message = new Message();
        message.setMessage(messageDto.getMessage());
        message.setType(messageDto.getType());
        message.setStatus(messageDto.getStatus());
        message.setSentTime(messageDto.getSentTime());
        message.setSenderId(Long.valueOf(messageDto.getSender()));
        message.setReceiverId(Long.valueOf(messageDto.getReceiver()));
        message.setFileUrl(messageDto.getFileUrl());
        messageRepository.save(message);
    }
}
