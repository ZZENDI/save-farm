import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Filter, ChevronDown, Calendar, AlertTriangle } from 'lucide-react-native';
import * as Font from "expo-font";
import { setCustomText } from 'react-native-global-props';


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
        //   fontFamily: 'fonts4'
        }
      };
  
      setCustomText(customTextProps);
  
      loadFonts();
    }, []);
    
};

const MapBasedDamageVisualization = () => {
  const [selectedFilter, setSelectedFilter] = useState<'crop' | 'disaster' | 'period'>('crop');

  const filterOptions: { [key in 'crop' | 'disaster' | 'period']: string[] } = {
    crop: ['벼', '밀', '옥수수', '감자'],
    disaster: ['홍수', '가뭄', '병충해', '태풍'],
    period: ['최근 1개월', '최근 3개월', '최근 6개월', '1년']
  };

  const renderFilterOptions = () => (
    <FlatList
      data={filterOptions[selectedFilter]}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.filterOption}>
          <Text style={styles.filterOptionText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const RecentUpdates = () => (
    <View style={styles.recentUpdatesContainer}>
      <Text style={styles.recentUpdatesTitle}>최근 업데이트</Text>
      <View style={styles.updateItem}>
        <AlertTriangle color="#FF6B6B" size={20} />
        <Text style={styles.updateText}>경기도 고양시 홍수 피해 증가 (30분 전)</Text>
      </View>
      <View style={styles.updateItem}>
        <AlertTriangle color="#FF6B6B" size={20} />
        <Text style={styles.updateText}>제주도 서귀포시 태풍 피해 보고 (2시간 전)</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>농작물 피해 지도</Text>
          <TouchableOpacity style={styles.locationSelect}>
            <Text style={styles.locationSelectText}>지역선택</Text>
            <ChevronDown color="#1d6533" size={16} />
          </TouchableOpacity>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapContainer}>
          <Image
            source={require('./img/map2.png')}
            style={styles.map}
          />
          <TouchableOpacity style={styles.mapButton}>
            <MapPin color="#ffffff" size={20} />
            <Text style={styles.mapButtonText}>전체 지도 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 필터 섹션 */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>필터</Text>
          <View style={styles.filterButtons}>
            {['crop', 'disaster', 'period'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
                onPress={() => setSelectedFilter(filter as 'crop' | 'disaster' | 'period')}
              >
                <Text style={[styles.filterButtonText, selectedFilter === filter && styles.filterButtonTextActive]}>
                  {filter === 'crop' ? '농작물' : filter === 'disaster' ? '재해 유형' : '기간'}
                </Text>
                <ChevronDown color={selectedFilter === filter ? "#ffffff" : "#000000"} size={16} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.filterOptionsContainer}>
            {renderFilterOptions()}
          </View>
        </View>

        {/* 최근 업데이트 섹션 */}
        <RecentUpdates />

        {/* 통계 섹션 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>주요 통계</Text>
          <View style={styles.statCards}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2,345 ha</Text>
              <Text style={styles.statLabel}>총 피해 면적</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>￦1,234 M</Text>
              <Text style={styles.statLabel}>추정 피해액</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding:5,
    fontFamily: "fonts1",
    color: '#2f4d3d',
  },
  locationSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: "#20342a",
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
  },
  locationSelectText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginRight: 5,
    padding: 3,
  },
  mapContainer: {
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  mapButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(32,52,42, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  filterContainer: {
    margin: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 10,
    marginLeft: 5
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
  },
  filterButtonActive: {
    backgroundColor: '#4e7b60',
  },
  filterButtonText: {
    color: '#2C2C2C',
    marginRight: 5,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterOptionsContainer: {
    marginTop: 10,
  },
  filterOption: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#20342a",
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  recentUpdatesContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#20342a",
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
  },
  recentUpdatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 10,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  updateText: {
    color: '#2C2C2C',
    marginLeft: 10,
  },
  statsContainer: {
    margin: 15,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    padding: 5,
    marginBottom: 5,
  },
  statCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: "#20342a",
    shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F4D3D',
  },
  statLabel: {
    fontSize: 14,
    color: '#2C2C2C',
  },
});

export default MapBasedDamageVisualization;
