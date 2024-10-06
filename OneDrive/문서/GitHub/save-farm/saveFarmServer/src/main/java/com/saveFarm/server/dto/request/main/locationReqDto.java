package com.saveFarm.server.dto.request.main;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class locationReqDto {

	private double latitude;
	private double longitude;
	private String baseDate;
	private String baseTime;
}
