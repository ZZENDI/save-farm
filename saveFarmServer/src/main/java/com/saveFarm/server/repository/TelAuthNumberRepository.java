package com.saveFarm.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saveFarm.server.entity.TelAuthNumberEntity;

@Repository
public interface TelAuthNumberRepository extends JpaRepository<TelAuthNumberEntity, String> {
    
    boolean existsByTelNumberAndAuthNumber(String telNumber, String authNumber);

}
