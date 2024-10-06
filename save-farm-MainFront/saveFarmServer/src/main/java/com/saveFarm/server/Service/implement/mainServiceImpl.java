package com.saveFarm.server.Service.implement;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.saveFarm.server.Service.mainService;

@Service
public class mainServiceImpl implements mainService {

	@Override
	public HttpURLConnection getHttpURLcConnection(String strUrl, String method) throws Exception {

		URL url;
		HttpURLConnection con = null;
		try {
			url = new URL(strUrl);
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod(method);
			con.setRequestProperty("Content-Type", "application/json");
			con.setDoOutput(true);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return con;
	}

	@Override
	public String getHttpResponse(HttpURLConnection con) throws Exception {
		StringBuilder sb = null;

		try {
			if (con.getResponseCode() == 200) {
				sb = readRespData(con.getInputStream());
			} else {
				System.out.println(con.getResponseCode());
				System.out.println(con.getResponseMessage());
				// 오류정보
				sb = readRespData(con.getErrorStream());
				System.out.println("error: " + sb);
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			con.disconnect();
		}
		;
		if (sb == null)
			return null;
		return sb.toString();
	}

	@Override
	public StringBuilder readRespData(InputStream in) throws Exception {
		if (in == null)
			return null;

		StringBuilder sb = new StringBuilder();
		String line = "";

		try (InputStreamReader ir = new InputStreamReader(in); BufferedReader br = new BufferedReader(ir)) {
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb;
	}

	@Override
	public Object convertXmlToJson(String xmlResp) throws Exception {
		Object json = null;
		try {
			JSONObject jsonobject = XML.toJSONObject(xmlResp);
			ObjectMapper objectmapper = new ObjectMapper();
			objectmapper.enable(SerializationFeature.INDENT_OUTPUT);
			json = objectmapper.readValue(jsonobject.toString(), Object.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return json;
	}

	private static final double RE = 6371.00877; // 지구 반경(km)
	private static final double GRID = 5.0; // 격자 간격(km)
	private static final double SLAT1 = 30.0; // 투영 위도1(degree)
	private static final double SLAT2 = 60.0; // 투영 위도2(degree)
	private static final double OLON = 126.0; // 기준점 경도(degree)
	private static final double OLAT = 38.0; // 기준점 위도(degree)
	private static final double XO = 43; // 기준점 X좌표(GRID)
	private static final double YO = 136; // 기준점 Y좌표(GRID)

	@Override
	public int[] convertCoords(double lat, double lon) throws Exception {
		double DEGRAD = Math.PI / 180.0;
		double re = RE / GRID;
		double slat1 = SLAT1 * DEGRAD;
		double slat2 = SLAT2 * DEGRAD;
		double olon = OLON * DEGRAD;
		double olat = OLAT * DEGRAD;

		double sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
		sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
		double sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
		sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
		double ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
		ro = re * sf / Math.pow(ro, sn);

		double ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
		ra = re * sf / Math.pow(ra, sn);
		double theta = lon * DEGRAD - olon;
		if (theta > Math.PI)
			theta -= 2.0 * Math.PI;
		if (theta < -Math.PI)
			theta += 2.0 * Math.PI;
		theta *= sn;

		int x = (int) Math.round(ra * Math.sin(theta) + XO);
		int y = (int) Math.round(ro - ra * Math.cos(theta) + YO);

		// 좌표 범위 검증 및 보정
		x = Math.max(1, Math.min(x, 149));
		y = Math.max(1, Math.min(y, 253));

//	    System.out.println("변환된 좌표 - x: " + x + ", y: " + y);
		return new int[] { x, y };
	}

	@Override
	public String optDate(String currentDate, String currentTime) throws Exception {

		int hour = Integer.parseInt(currentTime.substring(0, 2)); // 앞자리 두개 ex) 14
		int minute = Integer.parseInt(currentTime.substring(2, 4)); // 뒷자리 두 개 ex) 12
		
		if(hour <= 2 && minute <= 10) {
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd"); // 포맷터 설정
	        LocalDate date = LocalDate.parse(currentDate, formatter);
	        LocalDate newDate = date.minusDays(1);
	        String newDateString = newDate.format(formatter);
			return newDateString;
		}else {
			return currentDate;
		}
		
	}
	
	@Override
	public String optTime(String currentTime) throws Exception {

		if (currentTime.length() != 4) {
			return "Invalid time";
		}

		int hour = Integer.parseInt(currentTime.substring(0, 2)); // 앞자리 두개 ex) 14
		int minute = Integer.parseInt(currentTime.substring(2, 4)); // 뒷자리 두 개 ex) 12
		

		switch (hour) {
		case 0:
		case 1:
			return "2300";
		case 2:
			if(minute <= 10) return "2300";
			else return "0200";
		case 3:
		case 4:
			return "0200";
		case 5:
			if(minute <= 10) return "0200";
			else return "0500";
		case 6:
		case 7:
			return "0500";
		case 8:
			if(minute <= 10) return "0500";
			else return "0800";
		case 9:
		case 10:
			return "0800";
		case 11:
			if(minute <= 10) return "0800";
			else return "1100";
		case 12:
		case 13:
			return "1100";
		case 14:
			if(minute <= 10) return"1100";
			else return "1400";
		case 15:
		case 16:
			return "1400";
		case 17:
			if(minute <= 10) return "1400";
			else return "1700";
		case 18:
		case 19:
			return "1700";
		case 20:
			if(minute <= 10) return "1700";
			else return "2000";
		case 21:
		case 22:
			return "2000";
		case 23:
			if(minute <= 10) return "2000";
			else return "2300";
		default:
			return "Invalid time";
		}
	}
	
	public String getAddressFromCoords(double lat, double lng) throws Exception {
		String KAKAO_API_KEY = "9b37b76c308276ba0d22a1b4fd996308";
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" + lng + "&y=" + lat;
        try {
            // API 요청을 위한 URL 설정
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "KakaoAK " + KAKAO_API_KEY);
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) { // 요청 성공
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // JSON 응답 파싱
                JSONObject jsonResponse = new JSONObject(response.toString());
                JSONArray documents = jsonResponse.getJSONArray("documents");
                System.out.println("lat : " + lat + "lng : " + lng);
                if (documents.length() > 0) {
                    JSONObject addressInfo = documents.getJSONObject(0).getJSONObject("address");
                    
                    // 시, 구 정보만 추출
                    String region1 = addressInfo.getString("region_1depth_name"); // 시 정보 (예: 부산광역시)
                    String region2 = addressInfo.getString("region_2depth_name"); // 구 정보 (예: 부산진구)
                    String region3 = addressInfo.getString("region_3depth_name"); // 구 정보 (예: 부산진구)

                    // 시, 구 정보만 반환
                    return region1 + " " + region2 + " " + region3; // 여기서 region1이 부산광역시여야 합니다.
                } else {
                    return "주소 정보를 찾을 수 없습니다.";
                }
            } else {
                return "API 요청 실패: 응답 코드 " + responseCode;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "오류가 발생했습니다: " + e.getMessage();
        }
    }
}
