# DevSetting


<h2 style="padding: 10px; border-radius: 10px; border: 1px solid #000000; background-color: rgb(103, 106, 119);"> - Oracle Cloud DB - Mysql 연동 - </h2>


<div style="display: flex; justify-content: center; text-align: center;">

| 번호 | 항목                             |
|:----:|:----------------------------------:|
|  1   | [회원가입 및 로그인](#회원가입-및-로그인)      |
|  2   | [인스턴스 생성](#인스턴스-생성)         |
|  3   | [Oracle VM 초기 구축](#oracle-vm-초기-구축)  |
|  4   | [데이터베이스 DB 시스템 생성](#데이터베이스-db-시스템-생성) |
|  5   | [자율운영 데이터베이스 생성](#자율운영-데이터베이스-생성) |

</div>


<h3> 1. Oracle Cloud 회원가입 및 로그인</h3>



![OracleSignUp1](https://github.com/user-attachments/assets/9e5ed8f3-767d-4176-8a73-dd0c9216a9d2)


"Start for free" 클릭
이후 쭉 진행
---
<img  margin-bottom="10px" width="1423" alt="OracleSignUp2" src="https://github.com/user-attachments/assets/42e76e03-982e-403f-b165-195a37b27fa4">


<img margin-bottom="10px" width="1426" alt="OracleSignUp3" src="https://github.com/user-attachments/assets/43a901b4-69d5-436f-8c2a-3c06503c32ea">



![OracleSignUp4](https://github.com/user-attachments/assets/af7dcc20-b608-4f81-985e-4f03b44cda96)


<div style="display: flex; justify-content: center; margin-bottom:10px;">
<img width="634" alt="OracleSignUp5" src="https://github.com/user-attachments/assets/3bcf80eb-46ec-4f7b-a121-0468f3f2fece">
</div>

<div style="display: flex; justify-content: center; margin-bottom:10px;">
<img width="628" alt="OracleSignUp6" src="https://github.com/user-attachments/assets/a56c6c6d-3d89-432b-8e6a-7c9361070716">
</div>


![Login](https://github.com/user-attachments/assets/b7faa210-fd5a-44f9-967b-06d6a1adc03b)

<h3> 2. Oracle Instance 생성</h3>

로그인 후 Oracle 메인화면에서 왼쪽 위 버튼 클릭

![OracleMain1](https://github.com/user-attachments/assets/19ef571a-acff-4b46-9fa7-f0b055ce589e)

이후 컴퓨트 - 인스턴스

인스턴스 생성

![Instance1](https://github.com/user-attachments/assets/6b93b41d-3c83-4617-b404-23fda3481e7f)

![image](https://github.com/user-attachments/assets/d3d22ecc-8310-4d1d-bb6e-2c89ac83c163)

에서 편집 클릭

![image-1](https://github.com/user-attachments/assets/fb44e7bb-c3ab-40e8-b827-bbb4157483fc)

이미지 변경 클릭

![image-2](https://github.com/user-attachments/assets/e6d77567-4afd-4926-935e-0eb699439bf9)

CentOS -> CentOS 8 Stream 

Shape - VM.Standard.E2.1.Micro

![image-3](https://github.com/user-attachments/assets/28d524b0-d439-4d38-b6df-03d0db62330d)

<h4>SSH 키 저장[프라이빗, 퍼블릭 둘 다] (따로 SSH키를 발급받아 붙여넣어도 됨.)</h4>

<h3> 3. Oracle VM 구축</h3>

![image-4](https://github.com/user-attachments/assets/084ba402-84aa-4da1-b80a-b85fee599f91)


왼쪽 위 메뉴 버튼 -> 네트워킹 -> 가상 클라우드 네트워크

![image-6](https://github.com/user-attachments/assets/165624ba-a35a-491c-98ba-70c31e68e8ae)

이름 링크 클릭

![image-7](https://github.com/user-attachments/assets/d356da27-87e3-465f-9c0f-b926753b38cb)

서브넷 링크 클릭

![image-8](https://github.com/user-attachments/assets/7fc17fc6-3964-4c52-9665-88717ee80a2d)


보안목록 링크 클릭

수신 규칙 2개 추가


![image-9](https://github.com/user-attachments/assets/24daad19-17df-4a49-b481-c5a20241bd53)


수신 규칙 설정


수선 규칙 1

| 소스 유형 | 소스 CIDR    | IP 프로토콜 | 소스 포트 범위 (Optional) | 대상 포트 범위(Optional) | 설명(Optional)    |
|:-----------:|:---------------:|:--------------:|:----------------------------:|:-----------:|:---------------:|
| CIDR      | 0.0.0.0/0    | TCP          | 모두 (BLANK)               | 33060      | BLANK               |


수선 규칙 2

| 소스 유형 | 소스 CIDR    | IP 프로토콜 | 소스 포트 범위 (Optional) | 대상 포트 범위(Optional) | 설명(Optional)    |
|:-----------:|:---------------:|:--------------:|:----------------------------:|:-----------:|:---------------:|
| CIDR      | 0.0.0.0/0    | TCP          | 모두 (BLANK)               | 3306      | BLANK               |

<h3> 4. DB 시스템 생성 </h3>

![image-10](https://github.com/user-attachments/assets/4b336cc9-2796-4bd2-950a-2ee6eb3b3188)


왼쪽 위 메뉴 클릭 -> 데이터베이스 -> DB 시스템 클릭

![image-11](https://github.com/user-attachments/assets/1032393d-d9d7-45da-bef4-aa65180b0db4)

DB 시스템 생성 클릭

![image-12](https://github.com/user-attachments/assets/a588f1bc-9817-4d81-8fb7-7a234f62ce4d)


Always Free 클릭


![image-13](https://github.com/user-attachments/assets/525b92c8-d2f7-403f-995f-cd0a3d3ceec9)

관리자 인증서 생성 기입

![image-14](https://github.com/user-attachments/assets/2929f7f4-0a1a-40c1-b730-61832b2b6539)


독립형 시스템으로 설정


<h3> 5. 자율 운영 데이터베이스 생성</h3>

![image-15](https://github.com/user-attachments/assets/00a3a30b-8cc5-48df-86d0-857b06bec629)


왼쪽 위 버튼 클릭 -> Oracle Database -> 자율운영 데이터베이스 

![image-16](https://github.com/user-attachments/assets/d07f8e8b-1b12-4e0d-a3e5-90a21db8e77a)


자율운영 데이터베이스 생성 클릭

![image-17](https://github.com/user-attachments/assets/24070356-5ff0-4f93-bcb3-5d7b0b6a0298)


트랜잭션 처리 선택

![image-18](https://github.com/user-attachments/assets/2b21b347-6937-4515-bedd-caa58d6e5d31)


관리자 인증서 기입

<h2>- Oracle 서버 세팅 끝 -</h2>

<h2 style="padding: 10px; border-radius: 10px; border: 1px solid #000000; background-color: rgb(103, 106, 119);">- Linux 환경에서 Oracle Cloud와 MySQL 연동과정 -</h2>

<h3> 6. Putty 연결</h3>
서버와 SSH 통신을 위해 Windows 경우 Putty 등 방법을 사용. Mac은 터미널에서 가능.


<h4> 6-1. 필수 파일 설치</h4>

Puttygen (Putty Key 생성)
- 32bit: https://the.earth.li/~sgtatham/putty/latest/w32/puttygen.exe
- 64bit: https://the.earth.li/~sgtatham/putty/latest/w64/puttygen.exe

Putty (SSH 연결 지원)
- 32bit: https://the.earth.li/~sgtatham/putty/latest/w32/putty.exe
- 64bit: https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe

<h4> 6-2. putty gen 실행</h4>


putty gen에서 아까 발급 받은 SSH 키를 모든 파일 선택 후 "Load" 눌러서 불러오기.
이후에 "Save primary key" 으로 생성된 ppk 파일 저장.(경로에 한글x | 본인은 텍스트 파일로 생성 후 확장자 변경함) 



![image-3](https://github.com/user-attachments/assets/31f8e969-9129-4e81-8d89-6fb335d6c4ce)


<h4> 6-3. putty 실행</h4>

![image](https://github.com/user-attachments/assets/ef9d3328-8b9b-45b6-91d8-0244b9c2f506)


Host Name (or IP address)에 인스턴스에 있는 "인스턴스 엑세스" 부분에서
퍼블릭 IP주소 기입하고 "Saved Sessions"에 원하는 이름 기입(사용자 이름도 기억)

이후에 Category에서 SSH - Auth - Credentials로 이동, Private key file for authentication에 아까 생성한 ppk 파일 넣기.

![image-1](https://github.com/user-attachments/assets/ed296076-73e9-4dd4-8200-281ab36b9fe6)


만약 아래 창이 나타나면 "Connect Once" 클릭

![image-2](https://github.com/user-attachments/assets/a4b5b11a-cf01-4958-9b70-456266f044fa)



아래 창이 나타나면 인스턴스에 있던 사용자 이름 기입

![image-4](https://github.com/user-attachments/assets/ccf60ff0-dc69-4907-bbea-f2548a961ce8)


<h2 style="padding: 10px; border-radius: 10px; border: 1px solid #000000; background-color: rgb(103, 106, 119);">- 7. MySql 설치 시작 -</h2>

<h3>7.1 루트 권한 얻기 </h3>

    sudo -s

---    
<h3>7.2 MySQL 설치</h3>

    wget http://repo.mysql.com/mysql80-community-release-el7-1.noarch.rpm

    sudo rpm -ivh mysql80-community-release-el7-1.noarch.rpm

    rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

    sudo yum install mysql-server

    
아래 화면처럼 나오면 성공


    ================================================================================
    Package                Arch   Version                          Repo       Size
    ================================================================================
    Installing:
    mysql-server           x86_64 8.0.26-1.module_el8.4.0+915+de215114
                                                                    appstream  25 M
    Installing dependencies:
    mariadb-connector-c-config
                            noarch 3.1.11-2.el8_3                   appstream  15 k
    mecab                  x86_64 0.996-1.module_el8.4.0+589+11e12751.9
                                                                    appstream 393 k
    mysql                  x86_64 8.0.26-1.module_el8.4.0+915+de215114
                                                                    appstream  12 M
    mysql-common           x86_64 8.0.26-1.module_el8.4.0+915+de215114
                                                                    appstream 134 k
    mysql-errmsg           x86_64 8.0.26-1.module_el8.4.0+915+de215114
    .
    .
    .

<h3>7.3 MySql 실행 및 상태 확인</h3>

    systemctl start mysqld

    systemctl status mysqld

성공 시 **active (running)** 출력.

    mysqld.service - MySQL 8.0 database server
    Loaded: loaded (/usr/lib/systemd/system/mysqld.service; disabled; vendor pre>
    Active: active (running) since Mon 2024-09-30 11:18:29 KST; 5s ago
    Process: 75514 ExecStartPost=/usr/libexec/mysql-check-upgrade (code=exited, s>
    Process: 75387 ExecStartPre=/usr/libexec/mysql-prepare-db-dir mysqld.service >
    Process: 75362 ExecStartPre=/usr/libexec/mysql-check-socket (code=exited, sta>
    Main PID: 75468 (mysqld)
    Status: "Server is operational"
        Tasks: 38 (limit: 4168)
    Memory: 424.0M
    CGroup: /system.slice/mysqld.service
            └─75468 /usr/libexec/mysqld --basedir=/usr

<h3>7.4 임시 비밀번호 확인</h3>

    grep 'temporary password' /var/log/mysqld.log

위 코드 입력 시 임시 비밀번호 출력.
안나와도 아래 과정 진행에 문제x(blank password)

<h3>7.5 MySql 보안설정</h3>

    /usr/bin/mysql_secure_installation

---

    Securing the MySQL server deployment.

입력 시 보안 관련 설정 진행.

- Enter current password for root (enter for none): 임시 비밀번호를 입력합니다.
    - LOW: 최소 8자 이상.
    - MEDIUM: 최소 8자 이상, 숫자, 대문자와 소문자 혼합, 특수 문자 포함.
    - STRONG: 최소 8자 이상, 숫자, 대문자와 소문자 혼합, 특수 문자 포함, 사전 단어 사용 금지.
- Set root password? [Y/n]: root 비밀번호 설정 여부. -> Y
- New password: 설정할 비밀번호 입력.
- Re-enter new password: 다시 입력.
- Do you wish to continue with the password provided?: 제공된 비밀번호로 계속 진행 여부. -> Y
- Remove anonymous users? [Y/n]: 익명 사용자 로그인 차단 여부. -> Y
- Disallow root login remotely? [Y/n]: root 사용자 원격 접속 차단 여부. -> Y
- Remove test database and access to it? : Test DB를 삭제. -> Y

<h3>7.6 방화벽 설정 여부</h3>

    firewall-cmd --zone=public --permanent --add-service=mysql

    systemctl restart firewalld.service

<h3>7.7 Mysql root 계정 접속</h3>

    mysql -uroot -p

<h3>7.8 사용자, Database 생성</h3>

    -- testdb 생성
    CREATE DATABASE testdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    -- test 계정 생성
    CREATE USER 'tester99'@'%' IDENTIFIED BY 'myTestUser486!';

    -- testdb에 대한 권한 부여
    GRANT ALL PRIVILEGES ON testdb.* TO 'tester99'@'%' WITH GRANT OPTION;
    
    -- 권한 새로고침
    flush privileges;

<h2>참고</h2>

- <https://sunshower99.tistory.com/20?category=1039296>
- <https://sunshower99.tistory.com/21>
- <https://taewan.kim/cloud/oci_user/> [사용자생성 참고]

---
<h2>Linux 환경 오류(CentOS에서 발생한 오류)</h2>


CentOS 8 Stream 서비스 종료

CentOS 8 에서 Stream버전으로 업그레이드(마이그레이션)하면 되지만

각종 서비스 중인 서버 운영체제를 맘대로 업그레이드 해버리면 서비스가 안될 가능성도 존재

<h3>Failed loading plugin "osmplugin": No module named 'librepo'</h3>

    Failed loading plugin "osmplugin": No module named 'librepo'
    Error: Failed to download metadata for repo 'appstream': Cannot prepare internal mirrorlist: No URLs in mirrorlist

repo 폴더 이동

    [root@localhost etc]# cd yum.repos.d
    [root@localhost yum.repos.d]# ll
    total 84
    -rw-r--r--. 1 root root  715 Sep 29 12:26 CentOS-Base.repo
    -rw-r--r--. 1 root root  723 Sep 29 12:26 CentOS-Stream-AppStream.repo
    -rw-r--r--. 1 root root  708 Sep 29 12:26 CentOS-Stream-BaseOS.repo
    -rw-r--r--. 1 root root  316 Sep 29 12:26 CentOS-Stream-Debuginfo.repo
    -rw-r--r--. 1 root root  754 Sep 29 12:26 CentOS-Stream-Extras-common.repo
    -rw-r--r--. 1 root root  710 Sep 29 12:26 CentOS-Stream-Extras.repo
    -rw-r--r--. 1 root root  744 Sep 29 12:26 CentOS-Stream-HighAvailability.repo
    -rw-r--r--. 1 root root  696 Sep 29 12:26 CentOS-Stream-Media.repo
    -rw-r--r--. 1 root root  693 Sep 29 12:26 CentOS-Stream-NFV.repo
    -rw-r--r--. 1 root root  728 Sep 29 12:26 CentOS-Stream-PowerTools.repo
    -rw-r--r--. 1 root root  700 Sep 29 12:26 CentOS-Stream-RealTime.repo
    -rw-r--r--. 1 root root  758 Sep 29 12:26 CentOS-Stream-ResilientStorage.repo
    -rw-r--r--. 1 root root 1771 Sep 29 12:26 CentOS-Stream-Sources.repo
    -rw-r--r--. 1 root root 1680 Aug 31 05:48 epel-modular.repo
    -rw-r--r--. 1 root root 1332 Aug 31 05:48 epel.repo
    -rw-r--r--. 1 root root 1779 Aug 31 05:48 epel-testing-modular.repo
    -rw-r--r--. 1 root root 1431 Aug 31 05:48 epel-testing.repo
    -rw-r--r--. 1 root root 2325 Oct 24  2023 mysql-community-debuginfo.repo
    -rw-r--r--. 1 root root 3361 Oct 24  2023 mysql-community.repo
    -rw-r--r--. 1 root root 3466 Oct 24  2023 mysql-community-source.repo
    -rw-r--r--. 1 root root  100 Sep 29 10:16 nginx.repo

내용 확인(없다면 채워넣기)

a를 누르면 insert 모드, esc를 누르면 맨 아래로 이동, 이후 ":wq!" 나 ":qa!"로 나갈 수 있음.

    [root@localhost yum.repos.d]# vi CentOS-Base.repo


    # CentOS-Base.repo
    #
    # The mirror system uses the connecting IP address of the client and the
    # update status of each mirror to pick mirrors that are updated to and
    # geographically close to the client.  You should use this for CentOS updates
    # unless you are manually picking other mirrors.
    #
    # If the mirrorlist= does not work for you, as a fall back you can try the
    # remarked out baseurl= line instead.
    #
    #

    [BaseOS]
    name=CentOS-$releasever - Base
    mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=BaseOS&infra=$infra
    #baseurl=http://mirror.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
    gpgcheck=1
    enabled=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial


    :q!

아래 두 줄 입력(반응X)

mirrorlist= 를 주석처리 하고

아래 baseurl 주석을 제외시키고 mirror.centos.org에서 vault.centos.org로 변경하는 코드

    [root@localhost yum.repos.d]# sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*

    [root@localhost yum.repos.d]# sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

변경 되었는 지 확인

    [root@localhost yum.repos.d]# vi CentOS-Base.repo

    [BaseOS]
    name=CentOS-$releasever - Base
    #mirrorlist=http://#mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=BaseOS&infra=$infra
    baseurl=http://vault.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
    gpgcheck=1
    enabled=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial

패키지 저장소 불러오기

    [root@localhost yum.repos.d]# dnf repolist
    CentOS-8 - AppStream                                                                                         8.2 MB/s | 8.4 MB     00:01
    CentOS-8 - Base                                                                                              9.1 MB/s | 4.6 MB     00:00
    CentOS-8 - Extras                                                                                            9.2 kB/s |  10 kB     00:01
    repo id                                                       repo name                                                                status
    AppStream                                                     CentOS-8 - AppStream                                                     5,596
    BaseOS                                                        CentOS-8 - Base                                                          1,896
    extras                                                        CentOS-8 - Extras                                                           38

CentOS 기본 패키지 설치    

    [root@localhost yum.repos.d]# dnf -y install epel-release
    마지막 메타 데이터 만료 확인 : 0:00:25 전에 2023년 04월 25일 (화) 오전 11시 06분 02초.
    Dependencies resolved.
    =============================================================================================================================================
    Package                              Architecture                   Version                            Repository                      Size
    =============================================================================================================================================
    Installing:
    epel-release                         noarch                         8-11.el8                           extras                          24 k

    Transaction Summary
    =============================================================================================================================================
    설치  1 Package

    Total download size: 24 k
    Installed size: 35 k
    패키지 다운로드중:
    epel-release-8-11.el8.noarch.rpm                                                                             328 kB/s |  24 kB     00:00
    ---------------------------------------------------------------------------------------------------------------------------------------------
    합계                                                                                                         322 kB/s |  24 kB     00:00
    경고: /var/cache/dnf/extras-841cbf2e55745cba/packages/epel-release-8-11.el8.noarch.rpm: Header V3 RSA/SHA256 Signature, key ID 8483c65d: NOKEY
    CentOS-8 - Extras                                                                                            1.6 MB/s | 1.6 kB     00:00
    GPG키 0x8483C65D를 불러옵니다:
    사용자     : "CentOS (CentOS Official Signing Key) <security@centos.org>"
    .
    .
    .

yum update 명령어로 설치되어 있는 패키지 최신 업데이트(약 10분 소요)

    [root@localhost /]# yum -y update
    Extra Packages for Enterprise Linux Modular 8 - x86_64                                                       175 kB/s | 733 kB     00:04
    Extra Packages for Enterprise Linux 8 - x86_64                                                               6.0 MB/s |  14 MB     00:02
    마지막 메타 데이터 만료 확인 : 0:00:01 전에 2023년 04월 25일 (화) 오전 11시 07분 17초.
    Dependencies resolved.
    =============================================================================================================================================
    Package                                           Architecture Version                                                Repository       Size
    =============================================================================================================================================
    Installing:
    centos-linux-release                              noarch       8.5-1.2111.el8                                         BaseOS           22 k
        replacing  centos-release.x86_64 8.1-1.1911.0.8.el8
        replacing  centos-repos.x86_64 8.1-1.1911.0.8.el8
    kernel                                            x86_64       4.18.0-348.7.1.el8_5                                   BaseOS          7.0 M
    .
    .
    .

두 줄 입력(반응X)

    [root@localhost yum.repos.d]# sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*

    [root@localhost yum.repos.d]# sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

정상작동(오류 해결).

<h2>Stream 버전으로 업그레이드(마이그레이션)</h2>

아래 코드를 차례대로 입력.

    [root@localhost /]#  sudo dnf install centos-release-stream -y

    [root@localhost /]#  sudo dnf swap centos-{linux,stream}-repos -y

    [root@localhost /]#  sudo dnf distro-sync -y

버전 확인

    [root@localhost /]# cat /etc/redhat-release
    CentOS Stream release 8

---
참고 

- <https://sparetime.kr/entry/CentOS-8-repo-%EC%98%A4%EB%A5%98>
---

끝.