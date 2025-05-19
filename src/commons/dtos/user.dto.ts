import type { UserInfoDto } from "./userinfo.dto";

export interface UserSearchQueryRequestDto {
  nickname: string;
}

export interface UserSearchResponseDto {
  userInfos: UserInfoDto[];
}
