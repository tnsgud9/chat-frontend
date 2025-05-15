import ChatSideBar from "@/components/chat/ChatSideBar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";

const Chat = () => {
  return (
    <SidebarProvider>
      <ChatSideBar title={"EE2E Chat"} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>RoomName</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* 채팅창 구현 구간 */}
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="space-y-3"></div>
          </ScrollArea>
        </CardContent>

        <div className="flex items-center gap-2 border-t p-4">
          <Input placeholder="Type your message..." />
          <Button type="submit">Send</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default Chat;
