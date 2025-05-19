import type { ChatRoomsResponseDto } from "@/commons/dtos/chat.dto";
import type { ChatRoomDto } from "@/commons/dtos/chatroom.dto";
import config from "@/config";
import axios from "axios";

export const chatrooms = async (): Promise<ChatRoomDto[]> => {
  try {
    const response = await axios.get(`${config.SERVER_URI}/chat/rooms`, {
      withCredentials: true,
    });
    const { chatrooms } = response.data as ChatRoomsResponseDto;
    return chatrooms;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};
