package com.saveFarm.server.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class mainServiceImpl implements mainService {

	private final ObjectMapper objectMapper;

	@Override
	public String sendData() throws Exception {

//		URL url = new URL(
//				"http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=WC5XpS9Z5%2Fq8kuRR5uK2c6iQJiPgyJ20qq3vgltsAimszIOCTDRATGJF4HJPbKxMMdVY7tdvp5kXIrUnNAY5HQ%3D%3D&numOfRows=10&pageNo=1&base_date=20240930&base_time=0600&nx=55&ny=127");
//		HttpURLConnection con = (HttpURLConnection) url.openConnection();
//		con.setRequestMethod("GET");
//		con.setRequestProperty("Content-Type", "application/json");
//		con.setDoOutput(true);
//
//		try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
//			StringBuilder response = new StringBuilder();
//			String responseLine = null;
//			while ((responseLine = br.readLine()) != null) {
//				response.append(responseLine.trim());
//			}
//
//			// JSON 파싱 및 "response" 키의 값 추출
//			JsonNode jsonNode = objectMapper.readTree(response.toString());
//			String responseText = jsonNode.get("response").asText();
//			System.out.println(responseText.toString());
//			return responseText.toString();
		return "good";

//		}

	}

}
