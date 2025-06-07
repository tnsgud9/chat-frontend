import { MessageSquare } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router";

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
  return (
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <NavLink to={roomId}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="flex aspect-square size-8 items-center justify-center rounded-full shrink-0">
              <MessageSquare className="size-4" />
            </div>
            <div className="flex flex-col overflow-hidden text-left text-sm leading-tight">
              <span className="truncate font-medium">{roomname}</span>
              <span className="truncate text-xs">{lastMessage}</span>
            </div>
          </div>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
export default ChatRoomElement;
