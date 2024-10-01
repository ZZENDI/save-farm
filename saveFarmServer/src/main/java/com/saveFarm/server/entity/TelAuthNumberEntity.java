package com.saveFarm.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "telAuthNumber")
@Table(name = "tel_auth_number")
public class TelAuthNumberEntity {
    
    @Id
    @NotBlank
    private String telNumber;
    
    @NotBlank
    private String authNumber;

}