import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.utils import resample, class_weight
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# 1. 데이터 불러오기 (CSV 형식)
data = pd.read_csv('강수량.csv', encoding='EUC-KR')
data['일시'] = pd.to_datetime(data['일시'])
data.set_index('일시', inplace=True)
data = data.resample('h').sum()

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
    df = pd.DataFrame(X.reshape(X.shape[0], -1))
    df['target'] = y
    majority = df[df['target'] == 0]
    minority = df[df['target'] == 1]

    if len(minority) > 0:
        majority_downsampled = resample(majority,
                                         replace=False,
                                         n_samples=len(minority),
                                         random_state=42)
        downsampled = pd.concat([majority_downsampled, minority])
        return downsampled.iloc[:, :-1].to_numpy().reshape(-1, 24, 3), downsampled['target'].values
    else:
        return X, y

# 11. 데이터 불균형 해결
X_train_balanced, y_warning_train_balanced = under_sample(X_train, y_warning_train)

# 12. Class Weights 설정
class_weights = class_weight.compute_class_weight('balanced', classes=np.unique(y_warning_train), y=y_warning_train)

# 13. Transformer 모델 정의
def create_transformer_model(input_shape):
    inputs = layers.Input(shape=input_shape)
    x = layers.Conv1D(filters=64, kernel_size=1)(inputs)
    x = layers.LayerNormalization(epsilon=1e-6)(x)
    x = layers.MultiHeadAttention(num_heads=4, key_dim=64)(x, x)
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dense(64, activation="relu")(x)
    outputs = layers.Dense(1, activation="sigmoid")(x)  # 주의보 예측을 위한 단일 출력
    model = keras.Model(inputs, outputs)
    return model

# 14. 모델 생성 및 컴파일
model = create_transformer_model(input_shape=(X_train_balanced.shape[1], 3))
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
