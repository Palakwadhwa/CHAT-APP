import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const useAuthhook = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  // ================= CHECK AUTH =================
  checkauth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ================= SIGNUP =================
    // ================= SIGNUP =================
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      console.log("Signup Data Sent:", data);

      const res = await axiosInstance.post("/auth/signup", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        location: data.location,
      });

      set({ authUser: res.data });

      toast.success("Account created successfully");

      get().connectSocket();

    } catch (error) {
      console.log("Signup Error:", error);

      toast.error(
        error?.response?.data?.message || "Signup failed. Try again."
      );

    } finally {
      set({ isSigningUp: false });
    }
  },
  // ================= LOGIN =================
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });

      toast.success("Logged out successfully");

      get().disconnectSocket();

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed"
      );
    }
  },

  // ================= UPDATE PROFILE =================
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);

      set({ authUser: res.data });

      toast.success("Profile updated successfully");

    } catch (error) {
      console.log("Error updating profile:", error);

      toast.error(
        error?.response?.data?.message || "Profile update failed"
      );

    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ================= CONNECT SOCKET =================
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io("http://localhost:5000", {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ================= DISCONNECT SOCKET =================
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },

}));

export default useAuthhook;