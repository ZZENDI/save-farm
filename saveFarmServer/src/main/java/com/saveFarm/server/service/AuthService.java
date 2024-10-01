package com.saveFarm.server.service;

import org.springframework.http.ResponseEntity;

import com.saveFarm.server.dto.request.auth.IdCheckRequestDto;
import com.saveFarm.server.dto.request.auth.SignInRequestDto;
import com.saveFarm.server.dto.request.auth.SignUpRequestDto;
import com.saveFarm.server.dto.request.auth.TelAuthCheckRequestDto;
import com.saveFarm.server.dto.request.auth.TelAuthRequestDto;
import com.saveFarm.server.dto.response.ResponseDto;
import com.saveFarm.server.dto.response.auth.SignInResponseDto;

public interface AuthService {
    ResponseEntity<ResponseDto> idCheck(IdCheckRequestDto dto);
    ResponseEntity<ResponseDto> telAuth(TelAuthRequestDto dto);
    ResponseEntity<ResponseDto> telAuthCheck(TelAuthCheckRequestDto dto);
    ResponseEntity<ResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}
