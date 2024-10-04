import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    message?: string; // Optional로 변경
    messageError?: boolean; // Optional로 변경
    secureTextEntry?: boolean; // secureTextEntry 속성 추가

    buttonName?: string;

    onChange: (text: string) => void;
    onButtonClick?: () => void;
}

const InputBox: React.FC<Props> = ({
    label,
    type,
    placeholder,
    value,
    buttonName,
    message,
    messageError = false, // 기본값 설정
    onChange,
    onButtonClick,
    secureTextEntry = false, // 기본값 설정
}) => {
    return (
        <View style={styles.inputBox}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputArea}>
                <TextInput
                    value={value}
                    secureTextEntry={type === 'password'}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    style={styles.input}
                />
                {buttonName && (
                    <TouchableOpacity
                        style={[styles.inputButton, value ? styles.active : styles.disable]}
                        onPress={onButtonClick}
                    >
                        <Text style={styles.buttonText}>{buttonName}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {message && (
                <Text style={[styles.message, messageError ? styles.error : styles.primary]}>
                    {message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputBox: {
        flexDirection: 'column',
        gap: 2,
        marginLeft: 30,
        marginRight: 30,
        
    },
    label: {
        fontSize: 14,
        marginTop: 10,
        // marginLeft:4,
        fontWeight: '400',
        color: '#101010', // var(--gray-color) 대신 사용할 색상
    },
    inputArea: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff', // 배경색
        // borderWidth: 1,
        padding: 8,
        fontSize: 14,
        height: 40,
        // borderColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 12,
        marginBottom: 10,
        // color: '#000', // var(--default-color) 대신 사용할 색상
        placeholderTextColor: '#888'
    },
    inputButton: {
        borderRadius: 20,
        paddingVertical: 4,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disable: {
        backgroundColor: '#d3d3d3', // 비활성화 상태 색상
    },
    active: {
        backgroundColor: '#4e7b60', // 활성화 상태 색상
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff', // var(--gray-color) 대신 사용할 색상
    },
    message: {
        marginTop: -4,
        height: 16,
        fontSize: 12,
        fontWeight: '400',
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
    primary: {
        color: '#000', // 기본 색상
    },
});

export default InputBox;
