import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "@/commons/types/userinfo.type";

type UserStore = {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo) => void;
  clearUserInfo: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => set({ userInfo: user }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "userinfo", // localStorage에 저장될 키
      partialize: (state) => ({ userInfo: state.userInfo }), // 저장할 필드 선택
    },
  ),
);
