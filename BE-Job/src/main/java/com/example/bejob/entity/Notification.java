package com.example.bejob.entity;

import com.example.bejob.base.Auditable;
import com.example.bejob.base.HashMapConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long toUserId;

    @Column(nullable = false)
    private Long patternId;

    @Convert(converter = HashMapConverter.class)
    private HashMap<String, String> lstParams = new HashMap<>();
}
