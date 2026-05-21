import { useChathook } from "../hooks/useChathook";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import Chatbot from "../components/Chatbot";
import useAuthhook from "../hooks/useAuthhook";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChathook();
  const { authUser } = useAuthhook();

  const agentNames = [
    "Technical Support",
    "Pre-Sales Consultation",
    "Sales And Billing",
  ];

  const isAgent = agentNames.includes(authUser.fullName);

  return (
    <div
      className="
        h-[calc(100vh-70px)]
        flex
        items-center
        justify-center
        p-4
        
        overflow-hidden
      "
    >
      <div
        className="
          w-full
          max-w-7xl
          h-full
          bg-base-100
          rounded-3xl
          shadow-2xl
          overflow-hidden
          flex
          gap-4
          p-4
        "
      >
        {/* SIDEBAR */}
        <Sidebar />

        {/* CHAT AREA */}
        <div className="flex-1 flex overflow-hidden rounded-2xl bg-base-200">
          {!isAgent ? (
            !selectedUser ? (
              <Chatbot setSelectedUser={setSelectedUser} />
            ) : (
              <ChatContainer selectedUser={selectedUser} />
            )
          ) : !selectedUser ? (
            <NoChatSelected />
          ) : (
            <ChatContainer selectedUser={selectedUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;