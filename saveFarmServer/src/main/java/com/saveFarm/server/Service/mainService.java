package com.saveFarm.server.Service;

import java.io.InputStream;
import java.net.HttpURLConnection;

public interface mainService {
	public HttpURLConnection getHttpURLcConnection(String strUrl, String method) throws Exception;
	public String getHttpResponse(HttpURLConnection con) throws Exception;
	public StringBuilder readRespData(InputStream in) throws Exception;
	public Object convertXmlToJson(String xmlResp) throws Exception;
	public int[] convertCoords(double lat, double lon) throws Exception;
	public String optDate(String currentDate, String currentTime) throws Exception;
	public String optTime(String currentTime) throws Exception;
	public String getAddressFromCoords(double lat, double lng) throws Exception;
}
