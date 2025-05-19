import { MessageSquare } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useNavigate } from "react-router";

export interface ChatRoomElementProps {
  roomname: string;
  lastMessage: string;
  roomId: string;
}

const ChatRoomElement = ({
  roomname,
  lastMessage,
  roomId,
}: ChatRoomElementProps) => {
  const navigate = useNavigate();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        asChild
        onClick={() => {
          navigate(roomId);
        }}
      >
        <div>
          <div className="flex aspect-square size-8 items-center justify-center rounded-full">
            <MessageSquare className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{roomname}</span>
            <span className="truncate text-xs">{lastMessage}</span>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
export default ChatRoomElement;
