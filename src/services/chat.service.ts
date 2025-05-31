import type {
  ChatRoomCreateRequestDto,
  ChatRoomCreateResponseDto,
  ChatRoomInfoResponseDto,
  ChatRoomsResponseDto,
} from "@/commons/dtos/chat.dto";
import type { ChatRoomDto } from "@/commons/dtos/chatroom.dto";
import type { MessageDto } from "@/commons/dtos/message.dto";
import type { UserInfoDto } from "@/commons/dtos/userinfo.dto";
import type { UserInfo } from "@/commons/types/userinfo.type";
import { hybridDecrypt } from "@/commons/utils/crypto-helper";
import { localStorageUtil } from "@/commons/utils/local-storage";
import config from "@/config";
import axios from "axios";

// 회원가입 성공 시 호출될 콜백 타입 정의
export type SuccessCreateChatroomCallback = (
  data: ChatRoomCreateResponseDto,
) => void;
// 실패 시 호출될 콜백 타입 정의
export type FailureCallback = (error: Error) => void;

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

export const createChatroom = (
  participants: UserInfoDto[],
  onSuccess: SuccessCreateChatroomCallback,
  onFailure: FailureCallback,
): void => {
  axios
    .post(
      `${config.SERVER_URI}/chat/rooms/create`,
      {
        participantIds: participants.map((participant) => participant.id),
      } as ChatRoomCreateRequestDto,
      { withCredentials: true },
    )
    .then((response) => {
      const data = response.data as ChatRoomCreateResponseDto;
      onSuccess(data);
    })
    .catch((err) => {
      // 에러 메시지 추출 및 실패 콜백 실행
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "failed";
      onFailure(new Error(message));
    });
};

export const getChatRoomInfo = async (roomId: string) => {
  // 1. 채팅방 목록을 가져오기
  const chatRoomDtos = await chatrooms();
  // 2. 채팅방 목록 중 해당 방 ID 검색
  const chatroomInfo = chatRoomDtos.find((dto) => dto.id === roomId);
  return chatroomInfo; // 채팅 내용 반환
};

export const getMessages = async (
  roomId: string,
): Promise<{ participants: UserInfoDto[]; messages: MessageDto[] }> => {
  const userInfo = localStorageUtil.getItem<UserInfo>("user")!;

  const chatroomInfo = await getChatRoomInfo(roomId);
  if (!chatroomInfo) return { messages: [], participants: [] };

  // 3. 채팅방 개인키 복호화
  const privateKey = hybridDecrypt(
    userInfo.privateKey,
    chatroomInfo.encryptedPrivateKey,
  );

  let messages: MessageDto[];
  let participants: UserInfoDto[];
  // 4. 채팅방에서 메시지 가져오기
  try {
    const response = await axios.get(
      `${config.SERVER_URI}/chat/rooms/${roomId}`,
      {
        withCredentials: true,
      },
    );
    const responseData = response.data as ChatRoomInfoResponseDto;
    participants = responseData.participants;
    messages = responseData.messages;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { messages: [], participants: [] }; // 에러 발생 시 빈 배열 반환
  }

  // 5. 복호화 진행
  for (const msg of messages) {
    try {
      msg.content = hybridDecrypt(privateKey, msg.content);
    } catch {
      console.error("Error hybridDecrypt:", msg.content);
    }
  }

  return { participants, messages };
};
