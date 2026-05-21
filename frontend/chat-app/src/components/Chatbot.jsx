import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useChathook } from "../hooks/useChathook";

const Chatbot = () => {
  const [qaList, setQaList] = useState([]);
  const [visibleQAs, setVisibleQAs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [qaIndex, setQaIndex] = useState(0);
  const [typing, setTyping] = useState(false);

  const messageEndRef = useRef(null);

  const { users, selectedUser, setSelectedUser } = useChathook();

  useEffect(() => {
    axios
      .get('https://linkup-e4dw.onrender.com/api/questions')
      .then((res) => {
        setQaList(res.data);
        setVisibleQAs(res.data.slice(0, 3));
        setQaIndex(3);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const handleQuestionClick = (qa, idx) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: qa.question,
      },
    ]);

    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: qa.answer,
        },
      ]);

      setTyping(false);
    }, 1000);

    const updatedQAs = [...visibleQAs];
    const nextQuestion = qaList[qaIndex];

    if (nextQuestion) {
      updatedQAs[idx] = nextQuestion;
      setQaIndex((prev) => prev + 1);
    } else {
      updatedQAs.splice(idx, 1);
    }

    setVisibleQAs(updatedQAs);
  };

  return (
    <div
      className="
        flex-1
        bg-base-100/20
        backdrop-blur-xl
        rounded-3xl
        shadow-2xl
        border border-base-300
        p-8
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">
          🤖
        </div>

        <h1 className="text-4xl font-bold text-primary">
          FAQs Bot
        </h1>

        <p className="text-base-content/70 mt-2">
          Ask anything instantly
        </p>
      </div>

      {/* QUESTIONS */}
      <div className="mb-6">
        <p className="text-base font-semibold text-base-content mb-4">
          Choose a question:
        </p>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {visibleQAs.map((qa, idx) => (
              <motion.button
                key={qa.question}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => handleQuestionClick(qa, idx)}
                className="
                  w-full
                  text-left
                  px-6
                  py-4
                  rounded-2xl
                  bg-base-100
                  hover:bg-base-200
                  transition-all
                  duration-300
                  shadow-md
                  text-base-content
                  font-medium
                  border border-base-300
                "
              >
                {qa.question}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className="
          flex-1
          overflow-y-auto
          text-base-content
          bg-base-200/60
          rounded-2xl
          p-4
          pr-2
          space-y-4
        "
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`
                px-5
                py-4
                rounded-2xl
                shadow-md
                max-w-[95%]
                text-sm
                break-words
                ${
                  msg.type === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-100 text-base-content border border-base-300"
                }
              `}
            >
              {msg.text}
            </motion.div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div
              className="
                bg-base-100
                text-base-content/70
                border border-base-300
                px-5
                py-3
                rounded-2xl
                shadow-md
                animate-pulse
              "
            >
              Typing...
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* AGENT SECTION */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-base-content mb-4 text-center">
          Need more help? Contact a live agent
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {users
            .filter((user) =>
              [
                "Technical Support",
                "Pre-Sales Consultation",
                "Sales And Billing",
              ].includes(user.fullName)
            )
            .map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  px-6
                  py-6
                  min-h-[80px]
                  rounded-2xl
                  bg-base-100
                  hover:bg-base-200
                  shadow-md
                  transition-all
                  duration-300
                  font-medium
                  text-base-content
                  border border-base-300
                  ${
                    selectedUser?._id === user._id
                      ? "ring-2 ring-primary"
                      : ""
                  }
                `}
              >
                {user.fullName}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;