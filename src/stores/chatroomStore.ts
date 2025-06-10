import type { ChatRoomDto } from "@/commons/dtos/chatroom.dto";
import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ChatRoomStore = {
  chatRooms: ChatRoomDto[];
  setChatRooms: (rooms: ChatRoomDto[]) => void;
  addChatRoom: (room: ChatRoomDto) => void;
  updateChatRoom: (id: string, updatedRoom: Partial<ChatRoomDto>) => void;
  removeChatRoom: (id: string) => void;
  clearChatRooms: () => void;
};

const createChatRoomStore: StateCreator<ChatRoomStore> = (set) => ({
  chatRooms: [],

  setChatRooms: (rooms) => set({ chatRooms: rooms }),

  addChatRoom: (room) =>
    set((state) => ({
      chatRooms: [...state.chatRooms, room],
    })),

  updateChatRoom: (id, updatedRoom) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === id ? { ...room, ...updatedRoom } : room,
      ),
    })),

  removeChatRoom: (id) =>
    set((state) => ({
      chatRooms: state.chatRooms.filter((room) => room.id !== id),
    })),

  clearChatRooms: () =>
    set(() => ({
      chatRooms: [],
    })),
});

export const useChatRoomStore = create<ChatRoomStore>()(
  persist(createChatRoomStore, {
    name: "chat-rooms-storage",
    storage: createJSONStorage(() => sessionStorage),
  }),
);
