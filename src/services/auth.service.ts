import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthSignupRequestDto,
} from "@/commons/dtos/auth.dto";
import type { UserSession } from "@/commons/types/user-session.type";
import { decryptAES } from "@/commons/utils/crypto-helper";
import { sessionStorageUtil } from "@/commons/utils/session-storage";
import config from "@/config";
import axios from "axios";

export type SuccessCallback = (data: AuthLoginResponseDto) => void;
export type FailureCallback = (error: Error) => void;

export const login = (
  body: AuthLoginRequestDto,
  onSuccess: SuccessCallback,
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

export const signup = async (dto: AuthSignupRequestDto) => {
  const response = await axios.post(`${config.SERVER_URI}/auth/signup`, dto, {
    withCredentials: true,
  });
  return response.data;
};
