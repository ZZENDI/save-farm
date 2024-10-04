import React, { useEffect, useState } from 'react';
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
  ImageBackground
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from "expo-font";
import { setCustomText } from 'react-native-global-props';
import { Ionicons } from '@expo/vector-icons';
import MapBasedDamageVisualization from './mapBasedDamageVisualization';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useLocation } from './useLocation';

const Stack = createStackNavigator();

const Header = () => {
  const colorScheme = useColorScheme();
  return (
    <LinearGradient style={styles.gradient} colors={['#5f0d80', '#7c22a1', '#c487de']}>
    <View style={[styles.header, colorScheme !==  'dark' ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.logo]}>농작물 지킴이</Text>
      <View style={styles.authButtons}>
        <TouchableOpacity style={styles.authButton}>
          <Text style={[styles.authButtonText, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton}>
          <Text style={[styles.authButtonText, colorScheme !==  'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
};

const Basic = () => {
  const colorScheme = useColorScheme();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [yestWeatherData, setYestWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { location, error: locationError } = useLocation();
  const [address, setAddress] = useState<any>(null);
  // 현재 날짜와 시간 설정
  const now = new Date();
  const nowFormattedDate = Number(
    `${now.getFullYear().toString()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
  );
  const nowFormattedTime = `${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

  // 오전 2시 10분 이후인지 체크
  const isAfterMorning210 =
    now.getHours() > 2 || (now.getHours() === 2 && now.getMinutes() >= 10);

  // 어제 날짜 설정
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayFormattedDate = Number(
    `${yesterday.getFullYear().toString()}${(yesterday.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${yesterday.getDate().toString().padStart(2, '0')}`
  );

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      try {
        // 오늘의 TMP 데이터를 가져옴
        const todayResponse = await axios.post('http://localhost:8000/c1/main/temp', {
          baseDate: nowFormattedDate,
          baseTime: nowFormattedTime,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        setWeatherData(todayResponse.data);
        setAddress(todayResponse.data.address);
        // TMX, TMN 값을 추출하기 위한 로직
        if (!isAfterMorning210) {
          // 오전 2시 10분 이전이라면 어제의 TMX, TMN 데이터를 가져옴
          const yestResponse = await axios.post('http://localhost:8000/c1/main/temp', {
            baseDate: yesterdayFormattedDate,
            baseTime: '2300', // 어제 23시에 발표된 데이터
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setYestWeatherData(yestResponse.data);
        } else {
          // 오전 2시 10분 이후라면 오늘의 TMX, TMN 데이터를 가져옴
          const tmxTmnResponse = await axios.post('http://localhost:8000/c1/main/temp', {
            baseDate: nowFormattedDate,
            baseTime: '0210', // 오늘 오전 2시 10분에 발표된 데이터
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setWeatherData((prev: any) => ({
            ...prev,
            tmxTmn: tmxTmnResponse.data,
          }));
        }
        setLoading(false);
      } catch (err) {
        setError('날씨 데이터를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, nowFormattedDate, nowFormattedTime, yesterdayFormattedDate, isAfterMorning210]);

  const renderWeatherInfo = () => {
    if (loading) {
      return (
        <Text style={[styles.mainTitle, colorScheme !== 'dark' ? styles.darkTextMax : styles.lightTextMax]}>
          로딩 중...
        </Text>
      );
    }

    if (error || locationError) {
      return (
        <Text style={[styles.mainTitle, colorScheme !== 'dark' ? styles.darkTextMax : styles.lightTextMax]}>
          오류 발생
        </Text>
      );
    }

    if (weatherData) {
      
      console.log(weatherData);
      console.log();
      // TMP, TMX, TMN 값 필터링
      const dayNowTemp = weatherData.data.response.body.items.item
        .filter((item: { category: string }) => item.category === 'TMP')
        .sort((a: { fcstTime: string | number }, b: { fcstTime: string | number }) =>
          a.fcstTime.toString().localeCompare(b.fcstTime.toString())
        )
        .pop();

      const dayLowTemp = (isAfterMorning210 ? weatherData : yestWeatherData)?.data.response.body.items.item
        .filter((item: { category: string }) => item.category === 'TMN')
        .sort((a: { fcstTime: string | number }, b: { fcstTime: string | number }) =>
          a.fcstTime.toString().localeCompare(b.fcstTime.toString())
        )
        .pop();

      const dayHighTemp = (isAfterMorning210 ? weatherData : yestWeatherData)?.data.response.body.items.item
        .filter((item: { category: string }) => item.category === 'TMX')
        .sort((a: { fcstTime: string | number }, b: { fcstTime: string | number }) =>
          a.fcstTime.toString().localeCompare(b.fcstTime.toString())
        )
        .pop();

      return (
        <>
          <Text style={[styles.mainTitle, colorScheme !== 'dark' ? styles.darkTextMax : styles.lightTextMax]}>
            {dayNowTemp ? `${dayNowTemp.fcstValue}°` : 'N/A'}
          </Text>
          <Text style={[styles.mainDescription, colorScheme !== 'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>
            최고 {dayHighTemp ? `${dayHighTemp.fcstValue}°` : 'N/A'} 최저 {dayLowTemp ? `${dayLowTemp.fcstValue}°` : 'N/A'}
          </Text>
        </>
      );
    }

    return null;
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F0e%2F79%2Fbc%2F0e79bc6746fa502f16a0482014b2b817.jpg&type=ofullfill340_600_png',
      }}
      imageStyle={styles.imageStyle}
      style={[styles.mainCard, styles.mainBanner, colorScheme !== 'dark' ? styles.darkCard : styles.lightCard]}
    >
      <Text style={[styles.weatherMainDescription, colorScheme !== 'dark' ? styles.darkTextFontSize : styles.lightTextFontSize]}>
        {location ? `${address}` : '위치 정보를 가져오는 중...'}
      </Text>
      {renderWeatherInfo()}
      <TouchableOpacity style={styles.readMoreButton}>
        <Text style={styles.readMoreButtonText}>자세히 보기{'\n'}지역 변경하기</Text>
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
  icon: keyof typeof Ionicons.glyphMap; // Ionicons에서 제공하는 아이콘 이름으로 타입 제한
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

const App = () => {
  const [isReady, setIsReady] = useState(false);

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
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={MapBasedDamageVisualization}/>
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // fontSize: 12
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
    borderRadius: 10, // 모서리 기울기
    resizeMode: 'cover', // 이미지 크기 조절
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
    // backgroundColor: '#fff',
    borderColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  readMoreButtonText: {
    lineHeight: 30,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    // fontWeight: 'bold',
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
});

export default App;