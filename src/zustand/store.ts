import create from "zustand";

interface Participant {
  id: number;
  username: string;
  image: string;
  aboutMe: string;
}

interface Message {
  user: {
    usernameTag: string;
    image?: string;
  };
  messageContent: string;
  date: Date;
  id: number;
}

interface ChatState {
  currentChat: number;
  changeCurrentChat: (chatId: number) => void;

  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;

  admins: Participant[];
  setAdmins: (admins: Participant[]) => void;

  latestMessages: Message[];
  addLatestMessages: (message: Message) => void;

  loggedIn: boolean | undefined;
  setLoggedIn: (value: boolean) => void;

  viewRoomInfo: boolean;
  setViewRoomInfo: (value: boolean) => void;

  isCreateRoomVisible: boolean;
  setIsCreateRoomVisible: (value: boolean) => void;

  currentUsernameTag: string | null;
  setCurrentUsernameTag: (value: string) => void;
}

const useStore = create<ChatState>((set) => ({
  currentChat: 0,
  changeCurrentChat: (chatId) => {
    set({ currentChat: chatId });
  },

  participants: [],
  setParticipants: (participantsInput) =>
    set((state) => ({ participants: participantsInput })),

  admins: [],
  setAdmins: (adminInput) => set((state) => ({ admins: adminInput })),

  latestMessages: [],
  addLatestMessages: (message) =>
    set((state) => ({ latestMessages: [...state.latestMessages, message] })),

  loggedIn: undefined,
  setLoggedIn: (value) => set((state) => ({ loggedIn: value })),

  viewRoomInfo: false,
  setViewRoomInfo: (value) => set((state) => ({ viewRoomInfo: value })),

  isCreateRoomVisible: false,
  setIsCreateRoomVisible: (value) =>
    set((state) => ({ isCreateRoomVisible: value })),

  currentUsernameTag: null,
  setCurrentUsernameTag: (value) =>
    set((state) => ({ currentUsernameTag: value })),
}));

export default useStore;
