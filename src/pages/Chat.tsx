import ChatSideBar from "@/components/chat/ChatSideBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

        {/* 채팅 내역 출력 구간 */}
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* 받은 메시지 */}
              <div className="flex items-start gap-2">
                <Avatar>
                  <AvatarFallback>PD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Alice · 2025-05-16 10:32
                  </div>
                  <div className="mt-1 max-w-xs rounded-2xl bg-muted px-4 py-2 text-sm text-muted-foreground shadow">
                    안녕하세요!
                  </div>
                </div>
              </div>

              {/* 보낸 메시지 */}
              <div className="flex items-start justify-end gap-2">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    You · 2025-05-16 10:33
                  </div>
                  <div className="mt-1 max-w-xs rounded-2xl bg-sidebar-primary px-4 py-2 text-sm text-white shadow">
                    안녕하세요, 반갑습니다.
                  </div>
                </div>
              </div>
            </div>
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
