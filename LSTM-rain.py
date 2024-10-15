import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
import matplotlib.pyplot as plt
from sklearn.utils import resample
from sklearn.utils import class_weight

# 1. 데이터 불러오기 (CSV 형식)
data = pd.read_csv('강수량.csv', encoding='EUC-KR')  # 엑셀 파일 경로
data['일시'] = pd.to_datetime(data['일시'])  # '일시' 열 변환
data.set_index('일시', inplace=True)  # '일시'를 인덱스로 설정
data = data.resample('h').sum()  # 시간당 데이터로 리샘플링

# 2. 누적 강수량 계산
data['3h_accumulated'] = data['강수량(mm)'].rolling(window=3).sum()
data['12h_accumulated'] = data['강수량(mm)'].rolling(window=12).sum()

# 3. 주의보 및 경보 기준 설정
data['warning'] = np.where((data['3h_accumulated'] >= 60) | (data['12h_accumulated'] >= 110), 1, 0)
data['alert'] = np.where((data['3h_accumulated'] >= 90) | (data['12h_accumulated'] >= 180), 1, 0)

# 4. 정규화
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data[['강수량(mm)', '3h_accumulated', '12h_accumulated']])

# 5. 결측값 확인 및 처리
scaled_data = pd.DataFrame(scaled_data)
scaled_data.dropna(inplace=True)

# 6. 시퀀스 데이터 생성
def create_dataset(data, time_step=1):
    X, y_warning, y_alert = [], [], []
    for i in range(len(data) - time_step - 1):
        X.append(data[i:(i + time_step), :])
        y_warning.append(data[i + time_step, 1])  # warning
        y_alert.append(data[i + time_step, 2])  # alert
    return np.array(X), np.array(y_warning), np.array(y_alert)

# 7. 데이터 분할
X, y_warning, y_alert = create_dataset(scaled_data.to_numpy(), time_step=24)

# 8. 데이터셋 분할 (훈련/검증)
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_warning_train, y_warning_test = y_warning[:train_size], y_warning[train_size:]
y_alert_train, y_alert_test = y_alert[:train_size], y_alert[train_size:]

# 9. 레이블 확인
print("y_warning_train unique values:", np.unique(y_warning_train))
print("y_alert_train unique values:", np.unique(y_alert_train))

# 10. Under-sampling 방법
def under_sample(X, y):
    # 다수 클래스와 소수 클래스 분리
    df = pd.DataFrame(X.reshape(X.shape[0], -1))
    df['target'] = y
    majority = df[df['target'] == 0]
    minority = df[df['target'] == 1]

    # 소수 클래스가 존재하는지 확인
    if len(minority) > 0:
        # 소수 클래스의 수를 다수 클래스와 같게 조정
        majority_downsampled = resample(majority,
                                         replace=False,     # 복원 추출 아님
                                         n_samples=len(minority),  # 소수 클래스의 수와 같게
                                         random_state=42)   # 재현성을 위한 랜덤 상태 설정

        # 결합
        downsampled = pd.concat([majority_downsampled, minority])

        # X와 y로 분리
        return downsampled.iloc[:, :-1].to_numpy().reshape(-1, 24, 3), downsampled['target'].values
    else:
        # 소수 클래스가 없는 경우 원본 데이터 반환
        return X, y

# 11. 데이터 불균형 해결
X_train_balanced, y_warning_train_balanced = under_sample(X_train, y_warning_train)

# 12. Class Weights 설정
class_weights = class_weight.compute_class_weight('balanced', classes=np.unique(y_warning_train), y=y_warning_train)

# 13. LSTM 모델 구축
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train_balanced.shape[1], 3)))
model.add(Dropout(0.2))
model.add(LSTM(units=50, return_sequences=False))
model.add(Dropout(0.2))
model.add(Dense(units=1, activation='sigmoid'))  # 주의보 예측을 위한 단일 출력

# 14. 모델 컴파일
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 15. 모델 학습 시 Class Weights 사용
model.fit(X_train_balanced,
          y_warning_train_balanced,
          epochs=100,
          batch_size=32,
          class_weight={0: class_weights[0], 1: class_weights[1]})

# 16. 예측 수행
predictions = model.predict(X_test)

# 17. 예측 결과 이진화
predicted_warning = (predictions > 0.5).astype(int)

# 18. 결과 시각화
plt.figure(figsize=(15, 5))
plt.subplot(1, 1, 1)
plt.plot(y_warning_test, label='True Warning', alpha=0.7)
plt.plot(predicted_warning, label='Predicted Warning', alpha=0.7)
plt.title('Warning Prediction')
plt.legend()

plt.show()
