package com.saveFarm.server.controller;

import java.net.HttpURLConnection;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saveFarm.server.Service.implement.mainServiceImpl;
import com.saveFarm.server.dto.CMRespDto;
import com.saveFarm.server.dto.request.main.locationReqDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/c1/main")
public class MainController {
	
	private final mainServiceImpl mainServiceImpl;
	
	@PostMapping("/temp")
	public ResponseEntity<?> showTemp(@RequestBody locationReqDto userInfo){
		
        String serviceKey = "WC5XpS9Z5%2Fq8kuRR5uK2c6iQJiPgyJ20qq3vgltsAimszIOCTDRATGJF4HJPbKxMMdVY7tdvp5kXIrUnNAY5HQ%3D%3D";
		
		String method = "GET";
		boolean status;
		Object jsonResponse = null;
		try {
			int[] xy = mainServiceImpl.convertCoords(userInfo.getLatitude(), userInfo.getLongitude());
			int nx = xy[0];
			int ny = xy[1];
			String Address = mainServiceImpl.getAddressFromCoords(userInfo.getLatitude(), userInfo.getLongitude());
	        String optBaseDate = mainServiceImpl.optDate(userInfo.getBaseDate(),userInfo.getBaseTime());
	        String optBaseTime = mainServiceImpl.optTime(userInfo.getBaseTime());
	        if(optBaseTime == null) {
	        	status = false;
				return ResponseEntity.ok().body(new CMRespDto<>(status,"실패",null,null));
	        }
	        System.out.println("Address : " + Address);
			String url = String.format("http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=%s&numOfRows=%d&pageNo=1&base_date=%s&base_time=%s&nx=%d&ny=%d",
					serviceKey,1000, optBaseDate, optBaseTime, nx, ny);
			// HttpURLConnection 객체 생성
            HttpURLConnection conn = mainServiceImpl.getHttpURLcConnection(url, method);
            // HTTP 응답을 읽기
            String resp = mainServiceImpl.getHttpResponse(conn);
            jsonResponse = mainServiceImpl.convertXmlToJson(resp);
            status = jsonResponse != null; // 응답이 null이 아니면 성공
			return ResponseEntity.ok().body(new CMRespDto<>(status,"성공",jsonResponse,Address));
		} catch (Exception e) {
			System.out.println("실패!");
			status = false;
			return ResponseEntity.ok().body(new CMRespDto<>(status,"실패",null,null));
		}
		
	}
	
}
