import pandas as pd
import folium
import aiohttp
import asyncio
import nest_asyncio

# Google Geocoding API 키 입력
api_key = 'AIzaSyBtIeeOMdSpsh1f2k2g5L1ySWYBfFQBJlo'  # API 키 입력

# Geocoding API 호출 함수
cache = {}

async def get_lat_lon(session, address):
    if address in cache:
        return cache[address]

    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        'address': address,
        'key': api_key
    }
    try:
        async with session.get(base_url, params=params) as response:
            if response.status == 200:
                results = await response.json()
                if results['results']:
                    lat = results['results'][0]['geometry']['location']['lat']
                    lon = results['results'][0]['geometry']['location']['lng']
                    cache[address] = (lat, lon)
                    return lat, lon
    except Exception as e:
        print(f"Error fetching geocode for {address}: {e}")
    return None, None

# CSV 파일 경로
csv_file_path = '농지 면적.csv'  # 경로 수정

# CSV 파일 읽기 (인코딩 방식 지정)
data = pd.read_csv(csv_file_path, encoding='cp949')

# 지도의 중심 좌표 설정
latitude = 36.5
longitude = 127.5

# Folium 지도 생성
m = folium.Map(location=[latitude, longitude], zoom_start=7)

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [get_lat_lon(session, row['주소(텍스트)']) for _, row in data.iterrows()]
        results = await asyncio.gather(*tasks)

        # 결과를 바탕으로 지도에 농경지 외곽선(폴리곤) 추가
        for i, (lat, lon) in enumerate(results):
            if lat and lon:
                row = data.iloc[i]  # 인덱스를 사용하여 원본 데이터프레임에서 행 가져오기
                polygon_coords = [
                    [lat, lon],
                    [lat + 0.001, lon],
                    [lat + 0.001, lon + 0.001],
                    [lat, lon + 0.001],
                    [lat, lon]  # 폴리곤을 닫는 좌표
                ]

                folium.Polygon(
                    locations=polygon_coords,
                    color='blue',
                    fill=True,
                    fill_opacity=0.4,
                    popup=f'주소: {row["주소(텍스트)"]}<br>면적: {row["면적(제곱미터)"]}㎡'
                ).add_to(m)

# nest_asyncio를 사용하여 이벤트 루프 중첩 허용
nest_asyncio.apply()

# 비동기 함수 실행
await main()

# 지도를 HTML 파일로 저장
m.save('농경지_지도_폴리곤.html')

# 지도를 Colab에서 출력
m
