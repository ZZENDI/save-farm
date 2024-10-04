import axios, { AxiosResponse } from "axios";
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import { ResponseDto } from "./dto/response";
import { SignInResponseDto } from "./dto/response/auth";
import GetSignInResponseDto from "./dto/response/auth/get-sign-in.response.dto";

// variable: API URL 상수
const SAVEFARM_API_DOMAIN = 'http://localhost:8000'; // 실제 API URL로 수정 필요

const AUTH_MODULE_URL = `${SAVEFARM_API_DOMAIN}/api/v1/auth`;
const USER_MODUEL_URL = `${SAVEFARM_API_DOMAIN}/api/v1/user`;
const GET_SIGN_IN_API_URL = `${USER_MODUEL_URL}/sign-in`;

// function: Authorization Bearer 헤더
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } });

// function: response data 처리 함수
const responseDataHandler = <T>(response: AxiosResponse<T>) => {
    const { data } = response;
    return data;
};

// function: response error 처리 함수
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// API 요청 함수들

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    try {
        const response = await axios.post(`${AUTH_MODULE_URL}/id-check`, requestBody);
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        return responseErrorHandler(error);
    }
};

export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    try {
        const response = await axios.post(`${AUTH_MODULE_URL}/tel-auth`, requestBody);
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        return responseErrorHandler(error);
    }
};

export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    try {
        const response = await axios.post(`${AUTH_MODULE_URL}/tel-auth-check`, requestBody);
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        return responseErrorHandler(error);
    }
};

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    try {
        const response = await axios.post(`${AUTH_MODULE_URL}/sign-up`, requestBody);
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        return responseErrorHandler(error);
    }
};

export const signInRequest = async (requestBody: SignInRequestDto) => {
    try {
        const response = await axios.post(`${AUTH_MODULE_URL}/sign-in`, requestBody);
        return responseDataHandler<SignInResponseDto>(response);
    } catch (error) {
        return responseErrorHandler(error);
    }
};