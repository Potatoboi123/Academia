"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const UserNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const path = usePathname();

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };
  function handleLogout() {}
  const loggedInRoutes = [
    ["/home", "Home"],
    ["/instructor", "Instructor"],
    ["/courses", "Courses"],
    ["/events", "Events"],
    ["/my-learning", "My Learning"],
    ["/cart", "Cart"],
    ["/profile", "Profile"],
  ];

  return (
    <nav className="bg-black text-white w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              return accessToken ? router.push("/home") : router.push("/");
            }}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded"></div>
              <span className="text-xl font-bold">Academia</span>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          {!accessToken && (
            <div className="hidden md:flex items-center space-x-5">
              <Link
                href="/signUp"
                className="hover:bg-indigo-900 bg-indigo-700 p-1 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="hover:text-indigo-400 transition-colors"
              >
                Log In
              </Link>
            </div>
          )}

          {accessToken && (
            <div className="hidden md:flex items-center space-x-5">
              {loggedInRoutes.map((route, index) => (
                <Link
                  key={index}
                  href={route[0]}
                  className={`${
                    path.startsWith(route[0])
                      ? "text-indigo-400 transition-colors"
                      : "hover:text-indigo-400 transition-colors"
                  } `}
                >
                  {route[1]}
                </Link>
              ))}
              <button
                className="block px-3 py-2 rounded-md text-base text-red-500 hover:text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-black">
              {!accessToken && (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signUp"
                    className="block px-3 py-2 rounded-md text-base hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {accessToken && (
                <>
                  {loggedInRoutes.map((route, index) => (
                    <Link
                      key={index}
                      href={route[0]}
                      className={`${
                        path.startsWith(route[0])
                          ? "text-indigo-400 bg-indigo-700/20"
                          : undefined
                      } block px-3 py-2 rounded-md text-base hover:text-indigo-400 hover:bg-indigo-700/20 transition-colors`}
                    >
                      {route[1]}
                    </Link>
                  ))}
                  <button
                    className="block px-3 py-2 rounded-md text-base text-red-500 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserNavbar;
