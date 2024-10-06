package com.saveFarm.server.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.saveFarm.server.dto.response.ResponseDto;

// 예외 대처를 위한 REST API 처리

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        MethodArgumentNotValidException.class
    })
    public ResponseEntity<ResponseDto> validExceptionHandler(Exception exception) {
        exception.printStackTrace();
        return ResponseDto.validationFail();
    }

}
