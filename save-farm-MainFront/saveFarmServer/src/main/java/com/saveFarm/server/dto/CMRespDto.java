package com.saveFarm.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CMRespDto<T> {
	
	private boolean status;
	private String message;
	private T data;
	private T address;
}
