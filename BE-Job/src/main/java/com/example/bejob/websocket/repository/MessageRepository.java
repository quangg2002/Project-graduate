package com.example.bejob.websocket.repository;

import com.example.bejob.entity.Message;
import com.example.bejob.websocket.dto.MessageDto;
import com.example.bejob.websocket.dto.UserConversationsDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findTop100BySenderIdOrReceiverIdOrderBySentTimeDesc(Long userId1, Long userId2);
}
