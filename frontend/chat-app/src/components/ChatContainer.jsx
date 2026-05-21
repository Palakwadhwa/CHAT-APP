import { useChathook } from "../hooks/useChathook";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { detectSentiment } from "../utils/sentiment";
import { getMoodTheme } from "../utils/moodTheme";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkele";

import useAuthhook from "../hooks/useAuthhook";
import { formatMessageTime } from "../lib/utils";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ChatContainer = () => {

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    reactToMessage,
  } = useChathook();

  const { authUser, socket } = useAuthhook();

  const messageEndRef = useRef(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [floatingEmoji, setFloatingEmoji] = useState(null);

  // Floating reaction animation
  useEffect(() => {

    const handleFloatingReaction = (e) => {
      setFloatingEmoji(e.detail);
    };

    window.addEventListener(
      "floatingReaction",
      handleFloatingReaction
    );

    return () => {

      window.removeEventListener(
        "floatingReaction",
        handleFloatingReaction
      );

    };

  }, []);

  // Verify password
  const handleVerify = async () => {

    try {

      await axiosInstance.post(
        "/auth/verify-password",
        {
          password: passwordInput,
        }
      );

      setVerified(true);

    } catch (error) {

      toast.error("Incorrect password");

    }

  };

  // Load messages
  useEffect(() => {

    if (!selectedUser?._id || !verified) return;

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();

  }, [selectedUser?._id, verified]);

  // Typing socket
  useEffect(() => {

    if (!socket) return;

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stopTyping", () => {
      setIsTyping(false);
    });

    return () => {

      socket.off("typing");
      socket.off("stopTyping");

    };

  }, [socket]);

  // Auto scroll
  useEffect(() => {

    if (messageEndRef.current && messages) {

      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });

    }

  }, [messages]);

  // Overall mood
  const overallMood = messages.length
    ? detectSentiment(
        messages[messages.length - 1]?.text || ""
      )
    : "neutral";

  const theme = getMoodTheme(overallMood);

  // Password Screen
  if (!verified) {

    return (

      <div className="flex-1 flex flex-col overflow-auto">

        <ChatHeader />

        <div className="flex-1 flex items-center justify-center p-6">

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm w-full max-w-md">

            <div className="text-center mb-6">

              <h2 className="text-2xl font-semibold text-gray-700">

                🔒 Private Chat

              </h2>

              <p className="text-sm text-gray-400 mt-2">

                Enter password to continue

              </p>

            </div>

            <div className="flex gap-2">

              <input
                type="password"
                className="input input-bordered w-full rounded-2xl"
                placeholder="Enter Password"
                value={passwordInput}
                onChange={(e) =>
                  setPasswordInput(e.target.value)
                }
              />

              <button
                onClick={handleVerify}
                className="btn rounded-2xl"
              >
                Verify
              </button>

            </div>

          </div>

        </div>

      </div>

    );
  }

  // Loading Screen
  if (isMessagesLoading) {

    return (

      <div className="flex-1 flex flex-col overflow-auto">

        <ChatHeader />

        <MessageSkeleton />

        <MessageInput />

      </div>

    );
  }

  // Main UI
  return (

    <div
      className={`

      relative
      flex-1
      flex
      flex-col
      overflow-auto

      bg-gradient-to-br

      ${theme.bg}

      transition-all
      duration-300

      `}
    >

      <ChatHeader />

      {/* Floating Background Emojis */}

      {overallMood === "happy" && (

        <>
          <div className="absolute top-20 left-10 text-4xl opacity-10 animate-bounce pointer-events-none">
            😊
          </div>

          <div className="absolute bottom-32 right-16 text-5xl opacity-10 animate-pulse pointer-events-none">
            🌞
          </div>

          <div className="absolute top-1/2 left-1/3 text-3xl opacity-10 animate-bounce pointer-events-none">
            ✨
          </div>
        </>

      )}

      {overallMood === "sad" && (

        <>
          <div className="absolute top-24 right-12 text-4xl opacity-10 animate-pulse pointer-events-none">
            🌧
          </div>

          <div className="absolute bottom-40 left-10 text-5xl opacity-10 pointer-events-none">
            😢
          </div>

          <div className="absolute top-1/2 right-1/3 text-3xl opacity-10 animate-bounce pointer-events-none">
            ☁️
          </div>
        </>

      )}

      {overallMood === "angry" && (

        <>
          <div className="absolute top-24 left-10 text-5xl opacity-10 animate-pulse pointer-events-none">
            🔥
          </div>

          <div className="absolute bottom-32 right-16 text-4xl opacity-10 animate-bounce pointer-events-none">
            😡
          </div>

          <div className="absolute top-1/2 left-1/2 text-3xl opacity-10 pointer-events-none">
            ⚡
          </div>
        </>

      )}

      {overallMood === "romantic" && (

        <>
          <div className="absolute top-24 right-12 text-5xl opacity-10 animate-pulse pointer-events-none">
            💜
          </div>

          <div className="absolute bottom-40 left-10 text-4xl opacity-10 animate-bounce pointer-events-none">
            💖
          </div>

          <div className="absolute top-1/2 right-1/3 text-3xl opacity-10 pointer-events-none">
            🌸
          </div>
        </>

      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 z-10">

        {messages.map((message) => {

          const mood = detectSentiment(
            message.text || ""
          );

          return (

            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id
                  ? "chat-end"
                  : "chat-start"
              }`}
              ref={messageEndRef}
            >

              {/* Avatar */}
              <div className="chat-image avatar">

                <div className="w-10 rounded-full border border-white shadow-sm">

                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />

                </div>

              </div>

              {/* Time */}
              <div className="chat-header mb-1 px-1">

                <time className="text-[11px] text-gray-400">

                  {formatMessageTime(message.createdAt)}

                </time>

              </div>

              {/* Chat Bubble */}
              <div
                className={`

                max-w-[78%]

                rounded-[22px]

                px-4
                py-3

                border

                shadow-sm

                flex
                flex-col

                transition-all
                duration-200

                hover:-translate-y-[1px]
                hover:shadow-md

                ${
                  mood === "happy"
                    ? "bg-yellow-100 border-yellow-200"

                    : mood === "sad"
                    ? "bg-blue-100 border-blue-200"

                    : mood === "angry"
                    ? "bg-rose-100 border-rose-200"

                    : mood === "romantic"
                    ? "bg-pink-100 border-pink-200"

                    : "bg-white border-gray-200"
                }

                `}
              >

                {/* Image */}
                {message.image && (

                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[220px] rounded-2xl mb-2"
                  />

                )}

                {/* Text */}
                {message.text && (

                  <>
                    <p className="leading-relaxed text-[15px] text-gray-700">

                      {message.text}

                    </p>

                    {/* Mood Indicator */}
                    <div className="mt-2 flex items-center gap-1.5">

                      <span className="text-sm leading-none">

                        {mood === "happy" && "😊"}

                        {mood === "sad" && "😢"}

                        {mood === "angry" && "😡"}

                        {mood === "romantic" && "💜"}

                        {mood === "neutral" && "😐"}

                      </span>

                      <span className="text-[11px] text-gray-500 capitalize">

                        {mood}

                      </span>

                    </div>

                  </>

                )}

                {/* Reactions */}
                {message.reaction && (

                  <div className="mt-2 flex justify-end">

                    <div className="bg-white border border-gray-200 px-2 py-1 rounded-full text-base shadow-sm w-fit">

                      {message.reaction}

                    </div>

                  </div>

                )}

                {/* Emoji Bar */}
                <div className="opacity-0 hover:opacity-100 transition-all duration-300 mt-3 flex justify-end">

                  <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex gap-2 shadow-sm">

                    {[
                      "❤️",
                      "😂",
                      "🔥",
                      "😍",
                      "😎",
                    ].map((emoji) => (

                      <button
                        key={emoji}
                        onClick={() => {

                          setFloatingEmoji(emoji);

                          reactToMessage(
                            message._id,
                            emoji
                          );

                        }}
                        className="hover:scale-125 transition-all duration-200 text-lg"
                      >

                        {emoji}

                      </button>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          );

        })}

        {/* Typing */}
        {isTyping && (

          <div className="px-2">

            <p className="text-sm text-gray-400 animate-pulse">

              {selectedUser.fullName} is typing...

            </p>

          </div>

        )}

      </div>

      {/* Floating Reaction Animation */}
      <AnimatePresence>

        {floatingEmoji && (

          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              y: -180,
              scale: 1.4,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1.3,
              ease: "easeOut",
            }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 text-6xl pointer-events-none z-50"
            onAnimationComplete={() =>
              setFloatingEmoji(null)
            }
          >

            {floatingEmoji}

          </motion.div>

        )}

      </AnimatePresence>

      <MessageInput />

    </div>

  );

};

export default ChatContainer;