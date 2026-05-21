import { X } from "lucide-react";
import useAuthhook from "../hooks/useAuthhook";
import { useChathook } from "../hooks/useChathook";

import { useState } from "react";
import axios from "axios";

const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChathook();
  const { onlineUsers } = useAuthhook();

  // AI States
  const [showAI, setShowAI] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiReply, setAiReply] = useState("");

  // Ask AI Function
  const handleAskAI = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/ai/ask",
        {
          prompt,
        }
      );

      setAiReply(res.data.reply);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <>

      {/* AI Popup */}
      {showAI && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-base-100 p-6 rounded-2xl w-[400px] space-y-4 shadow-2xl">

            <h2 className="text-xl font-bold">
              🤖 Ask AI
            </h2>

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Ask AI anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              className="btn btn-primary w-full"
              onClick={handleAskAI}
            >
              Ask AI
            </button>

            {aiReply && (
              <div className="bg-base-200 p-3 rounded-xl max-h-60 overflow-y-auto whitespace-pre-wrap">
                {aiReply}
              </div>
            )}

            <button
              className="btn btn-sm w-full"
              onClick={() => setShowAI(false)}
            >
              Close
            </button>

          </div>

        </div>

      )}

      <div className="p-2.5 border-b border-base-300">

        <div className="flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="avatar">

              <div className="size-10 rounded-full relative">

                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                />

              </div>

            </div>

            {/* User Info */}
            <div>

              <h3 className="font-medium">
                {selectedUser.fullName}
              </h3>

              <p className="text-sm text-base-content/70">

                {onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}

              </p>

            </div>

          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">

            {/* AI Button */}
            <button
              className="btn btn-sm btn-circle"
              onClick={() => setShowAI(true)}
            >
              🤖
            </button>

            {/* Close Button */}
            <button onClick={() => setSelectedUser(null)}>
              <X />
            </button>

          </div>

        </div>

      </div>

    </>

  );

};

export default ChatHeader;