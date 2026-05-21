import { MessageSquare } from "lucide-react";
// import { useChathook } from "../hooks/useChathook";

const NoChatSelected = () => {
  // const {selectedUser,setSelectedUser,users} =useChathook();


  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Auton8 Chat Support!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
        {/* <div className="flex gap-2 overflow-y-auto w-3xl py-3">
  {users
    .filter((user) =>
      ["Technical Support", "Pre-Sales Consultation", "Sales And Billing"].includes(user.fullName)
    )
    .map((user) => (
      <button
        key={user._id}
        onClick={() => setSelectedUser(user)}
        className={`btn btn-soft btn-primary justify-start ${
          selectedUser?._id === user._id ? "ring ring-offset-2 ring-primary" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">{user.fullName}</span>
        </div>
      </button>
    ))}
</div> */}

        
{/* <button className="btn btn-soft btn-secondary">Sales and Billing</button> */}
{/* <button className="btn btn-soft btn-info">Pre-Sales Consultation</button> */}
          {/* <button className="btn btn-soft">Default</button> */}
{/* <button className="btn btn-soft btn-primary">Pre-Sales Consultation</button> */}
{/* <button className="btn btn-soft btn-accent">Accent</button> */}
{/* <button className="btn btn-soft btn-success">Success</button> */}
{/* <button className="btn btn-soft btn-error">Error</button> */}
      </div>
    </div>
  );
};

export default NoChatSelected;