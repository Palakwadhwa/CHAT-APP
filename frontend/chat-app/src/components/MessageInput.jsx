import { useRef, useState } from "react";
import { useChathook } from "../hooks/useChathook";
import useAuthhook from "../hooks/useAuthhook";
import { Image, Send, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const { sendMessage, selectedUser } = useChathook();
  const { socket } = useAuthhook();

  const typingTimeoutRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socket) return;

    socket.emit("typing", {
      receiverId: selectedUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedUser._id,
      });
    }, 1000);
  };

 const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setImagePreview(reader.result);
  };

  reader.readAsDataURL(file);
};
const removeImage = () => {
  setImagePreview(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  const handleSendMessage = async (e) => {
  e.preventDefault();

  console.log("Send button clicked");

  if (!text.trim() && !imagePreview) {
    toast.error("Message is empty");
    return;
  }

  try {
    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    console.log("Message sent");

    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (error) {
    console.error("Failed to send message:", error);
    toast.error("Failed to send message");
  }
};

  return (
    <div className="p-4 w-full">

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>

          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">

        <div className="flex-1 flex gap-2 items-center">

          <div className="relative">

            <button
              type="button"
              className="btn btn-circle btn-sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">

                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  searchDisabled={true}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false,
                  }}
                />

              </div>
            )}

          </div>

          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

        </div>

        <button
  type="button"
  onClick={handleSendMessage}
  className="btn btn-sm btn-circle"
>
  <Send size={22} />
</button>
      </form>
    </div>
  );
};

export default MessageInput;