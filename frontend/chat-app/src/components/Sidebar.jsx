import { useEffect, useState } from "react";
import { useChathook } from "../hooks/useChathook";
import useAuthhook from "../hooks/useAuthhook";
import SidebarSkeleton from "./skeleton/SidebarSkele";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUserForSideBar,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChathook();

  const { onlineUsers, authUser } = useAuthhook();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUserForSideBar();
  }, [getUserForSideBar]);

  // ✅ Correct filtering logic
  const filteredUsers = showOnlineOnly
    ? users.filter(
        (user) =>
          onlineUsers.includes(user._id) && user._id !== authUser?._id
      )
    : users.filter((user) => user._id !== authUser?._id);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
  <aside
    className="
      h-full
      w-[90px]
      lg:w-[320px]
     bg-base-100/70
      backdrop-blur-xl
      rounded-3xl
      shadow-xl
      border
      border-white/20
      overflow-hidden
      flex
      flex-col
      transition-all
      duration-300
    "
  >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online Filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>

          {/* ✅ Correct online counter */}
          <span className="text-xs text-zinc-500">
            ({onlineUsers.filter(id => id !== authUser?._id).length} online)
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />

              {/* Online indicator */}
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Info */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-xs text-zinc-400 truncate">
                {user.email}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;