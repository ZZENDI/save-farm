package com.saveFarm.server.App.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saveFarm.server.App.Dto.CMRespDto;
import com.saveFarm.server.Service.mainServiceImpl;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/saveFarm/main")
public class mainController {
	
	private final mainServiceImpl mainServiceImpl;
	
	@GetMapping("/temp")
	public ResponseEntity<?> getTemp() {
		
		int status = 0;
		System.out.println("start");
		String str = "";
		try {
			str = mainServiceImpl.sendData();
			System.out.println(str);
			status = 1;
			return ResponseEntity.ok().body(new CMRespDto<>(status,"성공",str));
		} catch (Exception e) {
			status = 0;
			return ResponseEntity.ok().body(new CMRespDto<>(status,"실패",str));
		}
				

	}
	
}