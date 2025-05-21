import type { MessageDto } from "@/commons/dtos/message.dto";
import type { UserInfoDto } from "@/commons/dtos/userinfo.dto";
import { UserInfo } from "@/commons/types/userinfo.type";
import { localStorageUtil } from "@/commons/utils/local-storage";
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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<MessageDto[]>();
  const [participants, setParticipants] = useState<UserInfoDto[]>();
  const userinfo = localStorageUtil.getItem<UserInfo>("user");
  useEffect(() => {
    (async () => {
      const { messages, participants } = await getMessages(roomId!);
      setMessages(messages);
      setParticipants(participants);
    })();
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>DUMMY</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* 채팅 내역 출력 구간 */}
      <CardContent className="flex-1 p-4 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messages?.map(({ sender, content, createdAt }) => (
              <Message
                nickname={
                  participants?.find((it) => it.id == sender)?.nickname ??
                  "unknown"
                }
                createdAt={createdAt}
                content={content}
                isSender={sender === userinfo?.id}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="flex items-center gap-2 border-t p-4">
        <Input placeholder="Type your message..." className="flex-1" />
        <Button type="submit" size="icon">
          <Send />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </>
  );
};
export default Chat;
