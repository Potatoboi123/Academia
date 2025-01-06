"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import type { SignupCredentials } from "@/types/auth";
import GoogleSvg from "@/components/icons/GoogleSvg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";


const SignupPage: React.FC = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const [loading, setLoading] = useState(false);
  const router=useRouter()

  const dispatch=useDispatch()

  // To prevent hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
 
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      axios.post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/auth/signup`,
        credentials,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
      "_blank",
      "width=500,height=600"
    );
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) return; // Validate the origin

      const data = event.data; // Extract token from the message
      if (data) {

        dispatch(
          login({
            id: data.id,
            accessToken: data.accessToken,
            role: data.role,
            userName: data.userName,
          })
        );

        router.push("/home");
      }

      // Clean up the listener
      window.removeEventListener("message", receiveMessage);
    };

    // Attach the event listener
    window.addEventListener("message", receiveMessage);
    setLoading(false)
  };
  return (<>
    <div className="min-h-full bg-black text-white flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-5 bg-gray-900 p-5 rounded-xl"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-gray-400">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your name"
                value={credentials.name}
                onChange={(e) =>
                  setCredentials({ ...credentials, name: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Create a password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Confirm your password"
                  value={credentials.confirmPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
            >
              Create account
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <GoogleSvg />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default SignupPage;
