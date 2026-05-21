import { Link } from "react-router-dom";
import useAuthhook from "../hooks/useAuthhook";

import {
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";

import { useEffect, useState } from "react";

const Navbar = () => {

  const { logout, authUser } = useAuthhook();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="p-4 pb-0">

      <header
        className="
          h-20
          px-10
          flex
          items-center
          justify-between
          bg-base-100/70
          backdrop-blur-xl
          border
          border-base-300
          rounded-[2rem]
          sticky
          top-0
          z-50
          shadow-xl
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-4"
          >

            <div
              className="
                w-14
                h-14
                rounded-3xl
                bg-gradient-to-r
                from-sky-500
                to-cyan-400
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <span className="text-white text-2xl">
                💬
              </span>
            </div>

            {/* BRAND */}
            <div className="flex flex-col">

              <h1
                className="
                  text-base-content
                  font-bold
                  text-4xl
                  leading-none
                "
              >
                BuzzChat
              </h1>

              <span className="text-base-content/60 text-sm">
                AI Messaging Platform
              </span>

            </div>

          </Link>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* THEME BUTTON */}
          <button
            className="
              w-12
              h-12
              rounded-3xl
              bg-base-200
              hover:bg-base-300
              flex
              items-center
              justify-center
              text-base-content
              transition-all
              duration-300
            "
            onClick={() =>
              setTheme(
                theme === "light"
                  ? "dark"
                  : "light"
              )
            }
          >
            {theme === "light" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>

          {authUser && (
            <>
              {/* PROFILE */}
              <Link
                to="/profile"
                className="
                  px-5
                  h-12
                  rounded-3xl
                  bg-base-200
                  hover:bg-base-300
                  text-base-content
                  font-medium
                  transition-all
                  duration-300
                  flex
                  items-center
                  gap-2
                "
              >
                <User size={18} />

                <span>
                  Profile
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                className="
                  px-6
                  h-12
                  rounded-3xl
                  bg-gradient-to-r
                  from-sky-500
                  to-cyan-400
                  text-white
                  font-semibold
                  shadow-lg
                  hover:scale-105
                  hover:brightness-110
                  transition-all
                  duration-300
                  flex
                  items-center
                  gap-2
                "
                onClick={logout}
              >
                <LogOut size={18} />

                <span>
                  Logout
                </span>
              </button>
            </>
          )}

        </div>

      </header>

    </div>
  );
};

export default Navbar;