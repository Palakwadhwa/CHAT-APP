import { create } from "zustand";
import axiosInstance  from "../lib/axios"
import toast from "react-hot-toast";

import useAuthhook from "./useAuthhook";

export const useChathook = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  pinVerified: false,

  getUserForSideBar: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {

  const { selectedUser } = get();

  if (!selectedUser) return;

  const socket = useAuthhook.getState().socket;

  // New Messages
  socket.on("newMessage", (newMessage) => {

    const isMessageSentFromSelectedUser =
      newMessage.senderId === selectedUser._id;

    if (!isMessageSentFromSelectedUser) return;

    set({
      messages: [...get().messages, newMessage],
    });

  });

  // Message Reactions
 socket.on("messageReaction", ({ updatedMessage, reaction }) => {

  set({
    messages: get().messages.map((msg) =>
      msg._id === updatedMessage._id
        ? updatedMessage
        : msg
    ),
  });

  // trigger floating animation
  window.dispatchEvent(
    new CustomEvent("floatingReaction", {
      detail: reaction,
    })
  );

});

},
  unsubscribeFromMessages: () => {     // call when we will close the message window 
    const socket = useAuthhook.getState().socket;
    socket.off("newMessage");
  },
  reactToMessage: async (messageId, reaction) => {

  try {

    const res = await axiosInstance.put(
      `/messages/react/${messageId}`,
      { reaction }
    );

    set({
      messages: get().messages.map((msg) =>
        msg._id === messageId
          ? res.data
          : msg
      ),
    });

  } catch (error) {

    toast.error("Reaction failed");

  }

},

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setPinVerified: (status) => set({ pinVerified: status }),
}));