import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthSignupRequestDto,
  AuthSignupResponseDto,
} from "@/commons/dtos/auth.dto";
import type { UserSession } from "@/commons/types/user-session.type";
import { decryptAES } from "@/commons/utils/crypto-helper";
import { sessionStorageUtil } from "@/commons/utils/session-storage";
import config from "@/config";
import axios from "axios";
import { Cookies } from "react-cookie";
import { redirect, useNavigate, type NavigateFunction } from "react-router";

export type SuccessLoginCallback = (data: AuthLoginResponseDto) => void;
export type SuccessSignupCallback = (data: AuthSignupResponseDto) => void;
export type FailureCallback = (error: Error) => void;

export const login = (
  body: AuthLoginRequestDto,
  onSuccess: SuccessLoginCallback,
  onFailure: FailureCallback,
): void => {
  axios
    .post(`${config.SERVER_URI}/auth/login`, body, {
      withCredentials: true,
    })
    .then((response) => {
      const data = response.data as AuthLoginResponseDto;
      const { id, nickname, publicKey, encryptedPrivateKey } = data;

      // 세션 스토리지에 값을 설정한다.
      sessionStorageUtil.setItem<UserSession>("user", {
        id,
        nickname,
        publicKey,
        privateKey: decryptAES(body.password, encryptedPrivateKey), // 비밀번호로 복호화한다.
      });
      onSuccess(data);
    })
    .catch((err) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Login failed";

      onFailure(new Error(message));
    });
};

export const signup = (
  body: AuthSignupRequestDto,
  onSuccess: SuccessSignupCallback,
  onFailure: FailureCallback,
): void => {
  axios
    .post(`${config.SERVER_URI}/auth/signup`, body, {
      withCredentials: true,
    })
    .then((response) => {
      const data = response.data as AuthSignupResponseDto;
      onSuccess(data);
    })
    .catch((err) => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Login failed";

      onFailure(new Error(message));
    });
};
export const logout = (navigate: NavigateFunction) => {
  const cookies = new Cookies();
  cookies.remove("access_token");
  sessionStorageUtil.removeItem("user");

  // 로그아웃 후 로그인 페이지로 이동
  navigate("/auth/login");
};
