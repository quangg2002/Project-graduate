    package com.example.bejob.entity;

    import com.example.bejob.base.Auditable;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Entity
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Table(name = "cv")
    public class CvEmployee extends Auditable{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private Long cvId;

        private Long employeeId;

        private String nameCv;

        private String name;

        private String position;

        private String phone;

        private String email;

        private String address;

        private String dob;

        private String avatar;

        @Column(columnDefinition = "TEXT")
        private String target;

        private Long education;

        private Long certificate;

        private Long hobby;

        private Long project;
    }
