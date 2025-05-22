import type { ChatRoomSendMessageRequestDto } from "@/commons/dtos/chat.dto";
import type { ChatRoomDto } from "@/commons/dtos/chatroom.dto";
import type { MessageDto } from "@/commons/dtos/message.dto";
import type { UserInfo } from "@/commons/types/userinfo.type";
import { hybridDecrypt, hybridEncrypt } from "@/commons/utils/crypto-helper";
import config from "@/config";
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;
  private chatroomPublicKey: string = "";
  private chatroomPrivateKey: string = "";
  constructor() {
    // 인스턴스는 생성하되, 연결은 나중에
    this.socket = io(config.SERVER_URI, {
      withCredentials: true,
    });
  }

  connect(
    roomId: string,
    { privateKey }: UserInfo,
    { encryptedPrivateKey, publicKey }: ChatRoomDto,
  ) {
    if (!this.socket.connected) {
      this.socket.io.opts.query = { room: roomId }; // 동적 쿼리
      this.chatroomPublicKey = publicKey;
      this.chatroomPrivateKey = hybridDecrypt(privateKey, encryptedPrivateKey);
      this.socket.connect();
      console.log("conntected");
    }
  }

  onReceiveMessage(handler: (message: MessageDto) => void) {
    this.socket.on("message", (message: MessageDto) => {
      message.content = hybridDecrypt(this.chatroomPrivateKey, message.content);
      handler(message);
    });
  }

  sendMessage(message: ChatRoomSendMessageRequestDto) {
    message.content = hybridEncrypt(this.chatroomPublicKey, message.content);
    this.socket.emit("message", message);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService();
