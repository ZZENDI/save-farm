# DevSetting


<h2 backgroundColor: blue> - Oracle Cloud DB - Mysql 연동 - </h2>
 

### 1. Oracle Cloud 회원가입 및 로그인

### 2. Oracle Instance 생성
#### 2-1. 이름, Image - CentOS 8 Stream, Shape - VM.Standard.E2.1.Micro, SSH 키 저장(프라이빗, 퍼블릭)


### 3. Oracle VM 생성
#### 3-1. Always Free, 이름, 관리자 인증서 생성(전부), 독립형 설정


### 4. 네트워킹 -> 가상 클라우드 네트워크 -> VCN LINK -> 서브넷 -> 보안목록 -> 수신 규칙 추가
#### 4-1.
소스 유형 - CIDR | 소스 CIDR - 0.0.0.0/0 | IP 프로토콜 - TCP
소스 포트 범위(Optional) - 모두(BLANK) | 대상 포트 범위(Optional) - 33060
설명(Optional) - BLANK


####4-2.
소스 유형 - CIDR | 소스 CIDR - 0.0.0.0/0 | IP 프로토콜 - TCP
소스 포트 범위(Optional) - 모두(BLANK) | 대상 포트 범위(Optional) - 3306
설명(Optional) - BLANK

### 5. 자율 운영 데이터베이스 생성
#### 5-1. 표시 이름, 데이터베이스 이름, 트랜잭션 처리(필수), 서버 미사용, 항상 무료 옵션만 표시, 사용자이름 : ADMIN, 비밀번호(필수), 모든 곳에서 보안 액세스, 이메일

### 6. Putty 연결
서버와 SSH 통신을 위해 Windows 경우 Putty 등 방법을 사용. Mac은 터미널에서 가능.


#### 6-1. 필수 파일 설치


- Puttygen (Putty Key 생성)
32bit: https://the.earth.li/~sgtatham/putty/latest/w32/puttygen.exe
64bit: https://the.earth.li/~sgtatham/putty/latest/w64/puttygen.exe


- Putty (SSH 연결 지원)
32bit: https://the.earth.li/~sgtatham/putty/latest/w32/putty.exe
64bit: https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe


  
