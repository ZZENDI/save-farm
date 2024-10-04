import React, { ChangeEvent, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  StyleSheet, 
  SafeAreaView,
  useColorScheme,
  ImageSourcePropType,
  ImageBackground,
  Button
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import * as Font from "expo-font";
import { setCustomText } from 'react-native-global-props';
import { Ionicons } from '@expo/vector-icons';
import MapBasedDamageVisualization from './mapBasedDamageVisualization';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useCookies } from 'react-cookie';
import { SignInResponseDto } from '@/apis/dto/response/auth';
import { ResponseDto } from '@/apis/dto/response';
import { getSignInRequest, idCheckRequest, signInRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from '@/apis';
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from '@/apis/dto/request/auth';
import InputBox from '@/components/InputBox';
import { NativeRouter, useNavigate, useSearchParams } from 'react-router-native';
import { ACCESS_TOKEN, AUTH_ABSOLUTE_PATH, CS_ABSOLUTE_PATH, ROOT_PATH } from '@/constants';
import { useSignInUserStore } from '@/stores';
import GetSignInResponseDto from '@/apis/dto/response/auth/get-sign-in.response.dto';

const Stack = createStackNavigator();

type AuthPath = '회원가입' | '로그인';

const SnsContainer = ({ type }: { type: AuthPath }) => {
    const onSnsButtonClickHandler = (sns: 'kakao' | 'naver') => {
        window.location.href = `http://localhost:8000/api/v1/auth/sns-sign-in/${sns}`;
    };

    return (
        <View style={styles.snsContainer}>
            {/* <Text style={styles.snsTitle}>SNS {type}</Text> */}
            <View style={styles.snsButtonContainer}>
                <TouchableOpacity onPress={() => onSnsButtonClickHandler('kakao')} style={styles.snsButton}>
                  <Image source={require('./kakao_logo.png')} style={styles.socialLogo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSnsButtonClickHandler('naver')} style={styles.snsButton}>
                  <Image source={require('./naver_logo.png')} style={styles.socialLogo} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

interface AuthComponentProps {
  onPathChange: (path: AuthPath) => void;
};

// component: 인증 화면 컴포넌트 //
export function Auth() {

  // state: Query Parameter 상태 //
  const [queryParam] = useSearchParams();
  const snsId = queryParam.get('snsId');
  const joinPath = queryParam.get('joinPath');
  // state: 선택 화면 상태 //
  const [path, setPath] = useState<AuthPath>('로그인');

  // event handler: 화면 변경 이벤트 처리 //
  const onPathChangeHandler = (path: AuthPath) => {
      setPath(path);
  }

  // effect: 첫 로드 시에 Query Param의 snsId와 joinPath가 존재 시 회원가입 화면전환 함수 //
  useEffect(() => {
      if (snsId && joinPath) setPath('회원가입');
  }, []);

  // render: 인증 화면 컴포넌트 렌더링 //
  return (
    
    <NativeRouter>
      <div id="auth-wrapper">
          <div className="auth-image"></div>
          <div className="auth-container">
              {path === '로그인' ?
                  <SignInPage onPathChange={onPathChangeHandler} /> :
                  <SignUpPage onPathChange={onPathChangeHandler} />
              }
          </div>
      </div>
      </NativeRouter>

  );
};

// -------------------------------------------------------------------------------------------------------- //


// component: root path 컴포넌트 //
function Index() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 마운트 시 경로 이동 effect //
  useEffect(() => {
    if (cookies[ACCESS_TOKEN]) navigator(CS_ABSOLUTE_PATH);
    else navigator(AUTH_ABSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //

  return (
    <></>
  );
}

// component: Sns Success 컴포넌트 //
function SnsSuccess() {

  // state: Query Parameter 상태 //
  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: Sns Success 컴포넌트 로드 시 accessToken과 expiration을 확인하여 로그인 처리 함수 //
  useEffect(() => {
    if (accessToken && expiration) {
      const expires = new Date(Date.now() + (Number(expiration) * 1000));
      setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

      navigator(CS_ABSOLUTE_PATH);

    } else navigator(AUTH_ABSOLUTE_PATH);
  }, []);

  // render: Sns Succcess 컴포넌트 렌더링 //
  return <></>
}



// -------------------------------------------------------------------------------------------------------- //

const Header = () => {

  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  return (
    <LinearGradient style={styles.gradient} colors={['#5f0d80', '#7c22a1', '#c487de']}>
    <View style={[styles.header, colorScheme !==  'dark' ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.logo]}>농작물 지킴이</Text>
      <View style={styles.authButtons}>
        <TouchableOpacity style={styles.authButton}>
          <Text style={[styles.authButtonText, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]} onPress={() => navigation.navigate('SignIn')} >로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton}>
          <Text style={[styles.authButtonText, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]} onPress={() => navigation.navigate('SignUp')}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
};

const Basic = () => {
  const colorScheme = useColorScheme();
  return (
    <ImageBackground source={{ uri: 'https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F0e%2F79%2Fbc%2F0e79bc6746fa502f16a0482014b2b817.jpg&type=ofullfill340_600_png' }} imageStyle={styles.imageStyle} style={[styles.mainCard, styles.mainBanner, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.weatherMainDescription, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>지금 부산광역시 강서구는</Text>
      <Text style={[styles.mainTitle, colorScheme !==  'dark' ? styles.darkTextMax : styles.lightTextMax]}>27 °</Text>
      <Text style={[styles.mainDescription, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>최고 32° 최저 24°<br/>농작물에 피해를 줄 재해 예측은 없어요!</Text>
      <TouchableOpacity style={styles.readMoreButton}>
        <Text style={styles.readMoreButtonText}>자세히 보기<br/>지역 변경하기</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const ServiceIntroduction = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.card, styles.section, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.sectionTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>재해 예측 시스템이란?</Text>
      <Text style={[styles.sectionDescription, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>기상 데이터를 실시간으로 분석하여 폭염, 가뭄, 홍수, 태풍, 한파 등 다양한 자연 재해를 사전에 예측합니다. 농민들이 재해 발생 가능성을 미리 인지하고 준비할 수 있도록 돕는 AI 기반 서비스입니다.</Text>
      <Image source={require('./img/picture.png')} style={styles.image} />
    </View>
  );
};

type FeatureItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.featureItem, colorScheme !==  'dark' ? styles.darkFeatureItem : styles.lightFeatureItem]}>
      <Ionicons name={icon} size={30} color={colorScheme !==  'dark' ? '#ffffff' : '#273e32'} style={styles.featureIcon} />
      <Text style={[styles.featureTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>{title}</Text>
      <Text style={[styles.featureDescription, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>{description}</Text>
    </View>
  );
};

const Features = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.card, styles.section, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.sectionTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>주요 기능</Text>
      <View style={styles.featureGrid}>
        <FeatureItem icon="cloud-outline" title="실시간 기상 데이터 분석" description="최신 기상 데이터를 분석하여 자연 재해 예측" />
        <FeatureItem icon="warning-outline" title="재해 발생 가능성 알림" description="재해가 예상되는 경우 즉각적인 알림 발송" />
        <FeatureItem icon="bar-chart-outline" title="맞춤형 대응 전략 제공" description="각 농장에 최적화된 대응 방법 추천" />
        <FeatureItem icon="calendar-outline" title="과거 데이터 분석" description="과거 재해 데이터를 활용해 미래 위험 분석" />
      </View>
    </View>
  );
};

const SuccessCases = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.card, styles.section, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.sectionTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>성공 사례</Text>
      <Text style={[styles.sectionDescription, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>재해 예측 시스템을 통해 농작물 피해를 최소화한 농민들의 실제 사례를 확인하세요.</Text>
      <View style={styles.successCases}>
        <CaseItem 
          image={require('./famer.png')} 
          title="김철수 농부님의 사례" 
          description='"태풍 예측 덕분에 미리 대비할 수 있었어요. 작년에 비해 피해가 절반 이상 줄었습니다."' 
        />
        <CaseItem 
          image={require('./dd.png')} 
          title="전후 비교" 
          description="재해 예측 시스템 도입 후, 농작물 피해율이 60% 감소했습니다." 
        />
      </View>
    </View>
  );
};

type CaseItemProps = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const CaseItem: React.FC<CaseItemProps> = ({ image, title, description }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.caseItem}>
      <Image source={image} style={styles.caseImage} />
      <Text style={[styles.caseTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>{title}</Text>
      <Text style={[styles.caseDescription, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>{description}</Text>
    </View>
  );
};

const CallToAction = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.card, styles.ctaSection, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.ctaTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>실시간 알림을 받아보고 싶은가요?</Text>
      <Text style={[styles.ctaDescription, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>지금 바로 재해 예측 시스템을 사용해보세요.</Text>
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>지금 가입하고 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const ContactForm = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.card, styles.section, colorScheme !==  'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.sectionTitle, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>궁금한 점이 있으신가요?</Text>
      <Text style={[styles.sectionDescription, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>문의를 남겨주시면 신속하게 답변해 드리겠습니다.</Text>
      <TextInput style={[styles.input, colorScheme !==  'dark' ? styles.darkInput : styles.lightInput]} placeholder="이름" placeholderTextColor={colorScheme !==  'dark' ? '#999' : '#666'} />
      <TextInput style={[styles.input, colorScheme !==  'dark' ? styles.darkInput : styles.lightInput]} placeholder="이메일" keyboardType="email-address" placeholderTextColor={colorScheme !==  'dark' ? '#999' : '#666'} />
      <TextInput style={[styles.input, colorScheme !==  'dark' ? styles.darkInput : styles.lightInput]} placeholder="메시지" multiline numberOfLines={4} placeholderTextColor={colorScheme !==  'dark' ? '#999' : '#666'} />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>보내기</Text>
      </TouchableOpacity>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactInfoText, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>전화: 123-456-7890</Text>
        <Text style={[styles.contactInfoText, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>이메일: info@농작물지킴이.com</Text>
        <Text style={[styles.contactInfoText, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>카카오톡: @농작물지킴이</Text>
      </View>
    </View>
  );
};

const Footer = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.footer, colorScheme !==  'dark' ? styles.darkBg : styles.lightBg]}>
      <TouchableOpacity><Text style={[styles.footerLink, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>회사 소개</Text></TouchableOpacity>
      <TouchableOpacity><Text style={[styles.footerLink, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>서비스 약관</Text></TouchableOpacity>
      <TouchableOpacity><Text style={[styles.footerLink, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>개인정보 처리방침</Text></TouchableOpacity>
      <View style={styles.socialMedia}>
        {/* <TouchableOpacity><Ionicons name="logo-facebook" size={24} color={colorScheme !==  'dark' ? '#ffffff' : '#007AFF'} /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="logo-instagram" size={24} color={colorScheme !==  'dark' ? '#ffffff' : '#007AFF'} /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="logo-twitter" size={24} color={colorScheme !==  'dark' ? '#ffffff' : '#007AFF'} /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="logo-youtube" size={24} color={colorScheme !==  'dark' ? '#ffffff' : '#007AFF'} /></TouchableOpacity> */}
      </View>
      <Text style={[styles.copyright, colorScheme !==  'dark' ? styles.darkText : styles.lightText]}>© 2024 농작물 지킴이</Text>
    </View>
  );
};

const HomeScreen = () => {
  
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  return (
    <ScrollView style={[styles.container, colorScheme !==  'dark' ? styles.darkBg : styles.lightBg]}>
      <Header />
      <Basic />
      <CallToAction />
      {/* <MainBanner /> */}
      <ServiceIntroduction />
      <Features />
      <SuccessCases />
      <ContactForm />
      <Footer />
    </ScrollView>
  );
};

// 로그인 페이지
const SignInPage = ({ onPathChange }: AuthComponentProps) => {
  const [cookies, setCookie] = useCookies();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigation = useNavigation<any>();

  
  const onGoToSignUp = () => {
    navigation.navigate('SignUp');
  }

  const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      const errorMessage =
          !responseBody ? '서버에 문제가 있습니다.' :
          responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
          responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccessed) {
          setMessage(errorMessage);
          return;
      }

      const { accessToken, expiration } = responseBody as SignInResponseDto;
      const expires = new Date(Date.now() + (expiration * 1000));
      setCookie('ACCESS_TOKEN', accessToken, { path: '/', expires });
      navigation.navigate('Home');
  };

  const onSignInButtonHandler = () => {
      if (!id || !password) return;

      const requestBody = { userId: id, password };
      signInRequest(requestBody).then(signInResponse);
  };

  return (
      <View style={styles.authBox}>
          <Text style={styles.title}>농작물 지킴이</Text>
          <SnsContainer type='로그인' />
          <TextInput
              style={styles.SignInSignUpInput}
              value={id}
              onChangeText={setId}
              placeholder='아이디를 입력해주세요.'
              placeholderTextColor='#888'
          />
          <TextInput
              style={styles.SignInSignUpInput}
              value={password}
              onChangeText={setPassword}
              placeholder='비밀번호를 입력해주세요.'
              placeholderTextColor='#888'
              secureTextEntry
          />
          <div style={styles.SignInSignUpButtons} >
          {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
          <button style={styles.LogInButton} onClick={onSignInButtonHandler}>로그인</button>
          {/* <TouchableOpacity onPress={() => onPathChange('회원가입')}> */}
              <button style={styles.link} onClick={onGoToSignUp}>회원가입</button>
          {/* </TouchableOpacity> */}
          </div>
      </View>
  );
};


// component: 회원가입 페이지
const SignUpPage: React.FC<{ onPathChange: (path: AuthPath) => void }> = ({ onPathChange }) => {

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');

    // state: 유저 입력 정보 상태 //
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    // state: 유저 입력 메세지 상태 //
    const [nameMessage, setNameMessage] = useState<string>('');
    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    // state: 유저 정보 메세지 에러 상태 //
    const [nameMessageError, setNameMessageError] = useState<boolean>(false);
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [passwordCheckMessageError, setPasswordCheckMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    // variable: SNS 회원가입 여부 //
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // variable: 회원가입 가능 여부 //
    const isComplete = name && id && isCheckedId && password && passwordCheck && isMatchedPassword && isCheckedPassword && telNumber && isSend && authNumber && isCheckedAuthNumber;


  const idCheckResponse = (responseBody: ResponseDto | null) => {

    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
          responseBody.code === 'DI' ? '이미 사용 중인 아이디입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
              responseBody.code === 'SU' ? '사용 가능한 아이디입니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    setIdMessage(message);
    setIdMessageError(!isSuccessed);
    setCheckedId(isSuccessed);
  };

    // function: 전화번호 인증 Reponse 처리 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {

      const message =
          !responseBody ? '서버에 문제가 있습니다.':
          responseBody.code === 'VF' ? '숫자 11자 입력해주세요.' :
          responseBody.code === 'DT' ? '중복된 전화번호입니다.':
          responseBody.code === 'TF' ? '서버에 문제가 있습니다.':
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.':
          responseBody.code === 'SU' ? '인증번호가 전송되었습니다.': '';
          
      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      setTelNumberMessage(message);
      setTelNumberMessageError(!isSuccessed);
      setSend(isSuccessed);
  };

  
    // function: 전화번호 인증 확인 Response 처리 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {

      const message =
      !responseBody ? "서버에 문제가 있습니다.":
      responseBody.code === 'VF' ? "올바른 데이터가 아닙니다.":
      responseBody.code === 'TAF' ? "인증번호가 일치하기 안습니다.":
      responseBody.code === 'DBE' ? "서버에 문제가 있습니다.":
      responseBody.code === 'SU' ? "인증번호가 확인되었습니다.": '';

      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      setAuthNumberMessage(message);
      setAuthNumberMessageError(!isSuccessed);
      setCheckedAuthNumber(isSuccessed);
      
  };

    // function: 회원가입 Response 처리 함수 //
    const signUpResponse = (responseBody: ResponseDto | null) => {

      const message =
      !responseBody ? "서버에 문제가 있습니다.":
      responseBody.code === 'VF' ? "올바른 데이터가 아닙니다.":
      responseBody.code === 'DI' ? '중복된 아이디입니다.':
      responseBody.code === 'DT' ? '중복된 전화번호입니다.':
      responseBody.code === 'TAF' ? "인증번호가 일치하기 안습니다.":
      responseBody.code === 'DBE' ? "서버에 문제가 있습니다.": '';

      const isSuccessed = responseBody !== null && responseBody.code === 'SU';
      if(!isSuccessed) {
          alert(message)
          return;
      } 
      onPathChange('로그인');
  };

    // event handler: 이름 변경 이벤트 처리 //
    const onNameChangeHandler = (text: string) => {
      
      setName(text);
  };

  // event handler: 아이디 변경 이벤트 처리 //
  const onIdChangeHandler = (text: string) => {
      setId(text);
      setCheckedId(false);
      setIdMessage('');
  };

  // event handler: 비밀번호 변경 이벤트 처리 //
  const onPasswordChangeHandler = (text: string) => {
      
      setPassword(text);

      const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
      const isMatched = pattern.test(text);

      const message = (isMatched || !text) ? '' : '영문, 숫자를 혼용하여 8 - 13자 입력해주세요';
      setPasswordMessage(message);
      setPasswordMessageError(!isMatched);
      setMatchedPassword(isMatched);
  };

  // event handler: 비밀번호 변경 확인 이벤트 처리 //
  const onPasswordCheckChangeHandler = (text: string) => {
      setPasswordCheck(text);
  };

  //  event handler: 전화번호 변경 이벤트 처리 //
  const onTelNumberChangeHandler = (text: string) => {
      setTelNumber(text);
      setSend(false);
      setTelNumberMessage('');
  };

  // event handler: 인증번호 변경 이벤트 처리 //
  const onAuthNumberChangeHandler = (text: string) => {
      setAuthNumber(text);
      setCheckedAuthNumber(false);
      setAuthNumberMessage('');
  }

  // event handler: 중복 확인 버튼 클릭 이벤트 처리 //
  const onIdCheckClickHandler = () => {
      if (!id) return;
      const requestBody: IdCheckRequestDto = {
          userId: id
      };
      idCheckRequest(requestBody).then(idCheckResponse);

  };

  //  event handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
  const onTelNumberSandClickHandler = () => {
      if (!telNumber) return;
      const pattern = /^[0-9]{11}$/;
      const isMatched = pattern.test(telNumber);

      if (!isMatched) {
          setTelNumberMessage('숫자 11자 입력해주세요.');
          setTelNumberMessageError(true);
          return;
      }

      const requestBody: TelAuthRequestDto = { telNumber };
      telAuthRequest(requestBody).then(telAuthResponse);
  };

  // event handler: 인증 확인 버튼 클릭 이벤트 처리 //
  const onAuthNumberCheckClickHandler = () => {
      if (!authNumber) return;
      const requestBody: TelAuthCheckRequestDto = {
          telNumber, authNumber
      }
      telAuthCheckRequest(requestBody).then(telAuthCheckResponse);
  }

  //  event handler: 회원가입 버튼 클릭 이벤트 처리 //
  const onSignUpButtonHandler = () => {
      if (!isComplete) return;

      const requestBody: SignUpRequestDto = {
          name,
          userId: id,
          password,
          telNumber,
          authNumber,
          joinPath: joinPath ? joinPath : 'home',
          snsId
      };
      signUpRequest(requestBody).then(signUpResponse);
  };

  const onGoToSignIn = () => {
    navigation.navigate('SignIn');
  }

  
    // effect: 비밀번호 및 비밀번호 확인 변경 시 실행할 함수 //
    useEffect(() => {
      if (!password || !passwordCheck) return;      // password가 존재하지 않으면 아래 작업을 수행하지 않고 종료

      const isEqual = password === passwordCheck;
      const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
      setPasswordCheckMessage(message);
      setPasswordCheckMessageError(!isEqual);
      setCheckedPassword(isEqual);
  }, [password, passwordCheck]);

      // render: 회원가입 화면 컴포넌트 렌더링 //
      return (
        <div className="auth-box">
            <div className="title-box">
                <div style={styles.title} className="title">농작물 지킴이</div>
                <div className="logo"></div>
            </div>
            {!isSnsSignUp && <SnsContainer type='회원가입' />}
            <div style={{ width: '64px' }} className="divider"></div>

            <div style={styles.SignUpInputs} className="input-container">
              {/* <Text style={styles.signUpInputTitle}>이름</Text> */}
                <InputBox messageError={nameMessageError} message={nameMessage} value={name} label='이름' type='text' placeholder='이름을 입력해주세요.' onChange={onNameChangeHandler} />
                <InputBox messageError={idMessageError} message={idMessage} value={id} label='아이디' type='text' placeholder='아이디를 입력해주세요.' buttonName='중복 확인' onChange={onIdChangeHandler} onButtonClick={onIdCheckClickHandler} />
                <InputBox messageError={passwordMessageError} message={passwordMessage} value={password} label='비밀번호' type='text' placeholder='비밀번호를 입력해주세요.' onChange={onPasswordChangeHandler} />
                <InputBox messageError={passwordCheckMessageError} message={passwordCheckMessage} value={passwordCheck} label='비밀번호 확인' type='password' placeholder='비밀번호를 입력해주세요.' onChange={onPasswordCheckChangeHandler} />
                <InputBox messageError={telNumberMessageError} message={telNumberMessage} value={telNumber} label='전화번호' type='text' placeholder='-빼고 입력해주세요.' buttonName='전화번호 인증' onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSandClickHandler} />
                {isSend &&      //isSend가 true이면 중괄호 안 코드 실행
                    <InputBox messageError={authNumberMessageError} message={authNumberMessage} value={authNumber} label='인증번호' type='text' placeholder='인증번호 4자리를 입력해주세요.' buttonName='인증 확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />
                }
            </div>

            <div style={styles.SignInSignUpButtons} className="button-container">
              <div>
                <button style={styles.SignUpButton}  onClick={onSignUpButtonHandler}>가입하기</button>
              </div>
              <div>
                  <button style={styles.SignInButton} className="link"  onClick={onGoToSignIn}>로그인</button>
              </div>
            </div>
        </div>
    )
};


const App = () => {
  const [isReady, setIsReady] = useState(false);
  
  // state: 로그인 유저 정보 상태 //
  const { signInUser, setSignInUser } = useSignInUserStore();

  // state: cookie 상태 //
  const [cookies, setCookie, removeCookie] = useCookies();    // 잘못된 토큰은 저장해둘 수 없고, 삭제해야 되니 remove도 불러옴

  //function: 네비게이터 함수 //
  const navigator = useNavigation<any>();

  // function: get sign in Response 처리 함수 //
  const getSignInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {

    const message = 
    !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
    responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
    responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
    responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccessed) {
      alert(message);
      removeCookie(ACCESS_TOKEN, {path: ROOT_PATH});
      setSignInUser(null);
      navigator(AUTH_ABSOLUTE_PATH);
      return;
    }

    const {userId, name, telNumber} = responseBody as GetSignInResponseDto;
    setSignInUser({ userId, name, telNumber });

  };

  // effect: cookie의 accessToken이 변경될 떄마다 로그인 유저 정보 요청 함수 //
  useEffect(() => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (accessToken) getSignInRequest(accessToken).then(getSignInResponse);
    else setSignInUser(null);

  }, [cookies[ACCESS_TOKEN]]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "fonts1": require("../../assets/fonts/fonts1.ttf"),
        "fonts2": require("../../assets/fonts/WantedSans-ExtraBlack.ttf"),
        "fonts3": require("../../assets/fonts/KakaoRegular.ttf"),
        "fonts4": require("../../assets/fonts/Apple.ttf")
      });
      setIsReady(true);
    };

    const customTextProps = {
      style: {
        fontFamily: 'fonts4'
      }
    };

    setCustomText(customTextProps);

    loadFonts();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NativeRouter>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={(props: StackScreenProps<ParamListBase, 'SignIn'>) => <SignInPage onPathChange={function (path: AuthPath): void {
          throw new Error('에러 처리 미완료');
        } } {...props} />} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={(props: StackScreenProps<ParamListBase, 'SignUp'>) => <SignUpPage onPathChange={function (path: AuthPath): void {
          throw new Error('에러 처리 미완료');
        } } {...props} />} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={MapBasedDamageVisualization}/>
        <Stack.Screen name="index" component={Index} options={{ headerShown: false }} />
        <Stack.Screen name="snsSuccess" component={SnsSuccess} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  authBox: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
},
SignInSignUpInput: {
  marginTop:10,
  flex: 1,
  backgroundColor: '#fff',
  padding: 11,
  fontSize: 14,
  width: '80%',
  borderRadius: 20,
  paddingHorizontal: 12,
  marginBottom: 10,
  gap: 2,
},
SignUpInputs: {
  marginTop: 20
},
SignInSignUpButtons: {
  display: 'flex',
  gap: 10,
  marginTop: 20,
  textAlign: 'center',
  justifyContent:'center',
  alignContent: 'center'
},
SignUpButton: {
  backgroundColor: '#4e7b60',
  fontSize: 14,
  fontWeight: '400',
  color: '#fff',
  borderRadius: 6,
  paddingVertical: 4,
  width: 100,
  height: 40,
  border: 'none',
},
LogInButton: {
  backgroundColor: '#4e7b60',
  fontSize: 14,
  fontWeight: '400',
  color: '#fff',
  borderRadius: 6,
  paddingVertical: 4,
  width: 100,
  height: 40,
  border: 'none',
},
SignInButton: {
  backgroundColor: '#d3d3d3',
  fontSize: 14,
  fontWeight: '400',
  color: '#fff',
  borderRadius: 6,
  paddingVertical: 4,
  width: 100,
  height: 40,
  border: 'none',
},
title: {
  marginTop:30,
  padding:20,
  fontSize: 35,
  fontWeight: 'bold',
  fontFamily: "fonts1",
  color: '#2f4d3d',
  textAlign: 'center'
},
link: {
  backgroundColor: '#d3d3d3',
  fontSize: 14,
  fontWeight: '400',
  color: '#fff',
  borderRadius: 6,
  paddingVertical: 4,
  width: 100,
  height: 40,
  border: 'none',
},
errorMessage: {
  color: 'rgba(255, 84, 64, 1)',
    marginBottom: 12,
},
snsContainer: {
  flexDirection: 'column',
  alignItems: 'center',
},
snsTitle: {
  fontSize: 16,
  fontWeight: '400',
  color: '#666',
},
snsButtonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 30,
},
snsButton: {
  flexDirection: 'row',
  marginBottom: 10,
  justifyContent: 'center',
},
socialLogo: {
  width: 50,
  height: 50,
},
  container: {
    flex: 1,
  },
  gradient: {

  },
  darkBg: {
    backgroundColor: '#f2f7f4',
  },
  lightBg: {
    backgroundColor: '#F5F5F5',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkTextMax: {
    color: '#FFFFFF',
    fontSize: 60
  },

  darkTextFontSize: {
    color: '#FFFFFF',
    fontSize: 13
  },

  lightText: {
    color: '#000000',
  },

  lightTextMax: {
    color: '#000000',
    fontSize: 60,
    padding: 20
  },
  

  lightTextFontSize: {
    color: '#000000',
    fontSize: 13
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    padding:5,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: "fonts1",
    color: '#2f4d3d',
  },
  signInLogo: {
    marginTop:30,
    padding:20,
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: "fonts1",
    color: '#2f4d3d',
  },
  authButtons: {
    flexDirection: 'row',
  },
  authButton: {
    marginLeft: 10,
  },
  authButtonText: {
    color: '#007AFF',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: "#20342a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: "#20342a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  imageStyle: {
    borderRadius: 10,
    resizeMode: 'cover',
  },
  darkCard: {
    backgroundColor: '#FFFFFF',
    
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  mainBanner: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mainDescription: {
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherMainDescription: {
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  ctaButton: {
    backgroundColor: '#4e7b60',
    padding: 10,
    borderRadius: 5,
  },
  ctaButtonText: {
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  readMoreButton: {
    borderColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  readMoreButtonText: {
    lineHeight: 30,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionDescription: {
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  darkFeatureItem: {
    backgroundColor: '##FFFFFF',
    shadowColor: '#20342a',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lightFeatureItem: {
    backgroundColor: '#f2f7f4',
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  successCases: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseItem: {
    width: '48%',
  },
  caseImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  caseTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caseDescription: {
    fontSize: 14,
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaDescription: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  darkInput: {
    borderColor: '#444',
    color: '#FFFFFF',
  },
  lightInput: {
    borderColor: '#ddd',
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#4e7b60',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 20,
  },
  contactInfoText: {
    marginBottom: 5,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 10,
    marginBottom: 10,
  },
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  copyright: {
    marginTop: 10,
  },
  'sign-in-container': {
    flex: 1,
    padding: 20,
  },
  'sign-in-id': {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5,
  },
  'sign-in-password': {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  'sign-in-inputContainer': {
    marginBottom: 20,
  },
  'sign-in-input': {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  'sign-in-darkBg': {
    backgroundColor: '#333',
  },
  'sign-in-lightBg': {
    backgroundColor: '#fff',
  },
  'sign-in-link': {
    marginTop: 20,
    color: '#20342a',
    textAlign: 'center',
  },
  'social-login-container': {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 40,
    marginBottom: 20,
  },
  'social-button': {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  'social-logo': {
    width: '100%',
    height:'100%',
    resizeMode: 'contain',
  },
  'sign-up-container': {
    flex: 1,
    padding: 20,
  },
  'sign-up-inputContainer': {
    marginBottom: 20,
  },
  'sign-up-input': {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  'sign-up-name': {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
    marginLeft:10
  },
  'sign-up-id': {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
    marginLeft:10
  },
  'sign-up-password': {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
    marginLeft:10
  },
});

export default App;

// 원래 쓰던 파일