import type { ChatRoomDto } from "@/commons/dtos/chatroom.dto";
import type { MessageDto } from "@/commons/dtos/message.dto";
import type { UserInfoDto } from "@/commons/dtos/userinfo.dto";
import { ContentType } from "@/commons/enums/content.enum";
import Message from "@/components/chat/Message";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getMessages } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import { useChatRoomStore } from "@/stores/chatroomStore";
import { useUserStore } from "@/stores/UserStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [participants, setParticipants] = useState<UserInfoDto[]>([]);

  const { chatRooms } = useChatRoomStore();
  const { userInfo } = useUserStore();

  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomDto | undefined>();
  const [inputMessage, setInputMessage] = useState<string>("");

  const messageEndRef = useRef<HTMLDivElement | null>(null); // 메시지 하단을 감지할 ref
  const scrollContainerRef = useRef<HTMLDivElement | null>(null); // 메시지 영역 ref

  useEffect(() => {
    (async () => {
      const chatRoomInfo = chatRooms.find((it) => it.id == roomId!);
      setChatRoomInfo(chatRoomInfo);
      const { messages, participants } = await getMessages(
        chatRoomInfo!,
        userInfo!,
      );
      setParticipants(participants);
      setMessages(messages);
      socketService.disconnect();
      socketService.connect(roomId!, userInfo!, chatRoomInfo!);
      socketService.onReceiveMessage((message) => {
        const container = scrollContainerRef.current;
        const isScrolledToBottom = container
          ? container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            10
          : false;

        setMessages((prev) => {
          const newMessages = [...prev, message];

          if (isScrolledToBottom) {
            // DOM 업데이트 이후 실행
            setTimeout(() => {
              messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
          }

          return newMessages;
        });
      });
    })();
  }, [roomId]);
  return (
    <div className="relative h-[calc(100vh_-_calc(var(--spacing)_*_4))] flex flex-col">
      {/* 헤더 */}
      <header className="h-16 shrink-0 flex items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{chatRoomInfo?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 메시지 영역 */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
        ref={scrollContainerRef}
      >
        {messages?.map(({ sender, content, createdAt }) => (
          <Message
            key={`${sender}-${createdAt}`}
            nickname={
              participants?.find((it) => it.id === sender)?.nickname ??
              "unknown"
            }
            createdAt={createdAt}
            content={content}
            isSender={sender === userInfo?.id}
          />
        ))}
        <div ref={messageEndRef} /> {/* 하단 스크롤용 앵커 */}
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t p-4 flex items-center gap-2 bg-white">
        <Input
          value={inputMessage}
          placeholder="Type your message..."
          className="flex-1"
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && inputMessage.length !== 0) {
              e.preventDefault();
              socketService.sendMessage({
                content: inputMessage,
                contentType: ContentType.MESSAGE,
              });
              setInputMessage("");
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={inputMessage.length === 0}
          onClick={() => {
            socketService.sendMessage({
              content: inputMessage,
              contentType: ContentType.MESSAGE,
            });
            setInputMessage("");
          }}
        >
          <Send />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
};
export default Chat;
