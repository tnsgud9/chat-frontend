import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ChatRoomElementProps } from "./ChatRoomElement";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { chatrooms } from "@/services/chat.service";
import ChatRoomElement from "./ChatRoomElement";
import { useChatRoomStore } from "@/stores/chatroomStore";

const ChatRoomList = () => {
  const [rooms, setRooms] = useState<ChatRoomElementProps[]>([]);
  const { chatRooms: chatStore, setChatRooms } = useChatRoomStore();

  // 최초 데이터 불러오기
  useEffect(() => {
    (async () => {
      const chatRoomDtos = await chatrooms();
      setChatRooms(chatRoomDtos);
    })();
  }, [setChatRooms]);

  // chatStore 값이 변경될 때마다 rooms 상태 갱신
  useEffect(() => {
    const chatRoomList: ChatRoomElementProps[] = chatStore.map(
      ({ name, id }): ChatRoomElementProps => ({
        roomname: name,
        lastMessage: "",
        roomId: id,
      }),
    );
    setRooms(chatRoomList);
  }, [chatStore]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Messages</SidebarGroupLabel>
      <SidebarMenu>
        {/* 메시지, 채팅방 검색 */}
        <SidebarMenuItem>
          <Input type="text" placeholder="Search" />
        </SidebarMenuItem>

        {/* 채팅방 리스트 */}
        {rooms.map(
          ({ lastMessage, roomname, roomId }: ChatRoomElementProps) => (
            <ChatRoomElement
              lastMessage={lastMessage}
              roomname={roomname}
              roomId={roomId}
            />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default ChatRoomList;
