"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useDispatch } from 'react-redux'
import { login } from "@/lib/features/auth/authSlice";

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import GoogleSvg from "@/components/icons/GoogleSvg";
import Navbar from "@/components/navbar/Navbar";

import { axiosPrivate } from "@/lib/axios";

import { AxiosError } from "axios";
import type { UserCredentials } from "@/types/auth";


interface authErrors {
  email?: string;
  password?: string;
  common?: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<authErrors>({});
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side mount
  const dispatch=useDispatch()

  const router = useRouter();

  // Only run this code on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error = false;
    setErrors({});

    if (!credentials.email.trim()) {
      error = true;
      setErrors((prevError: authErrors) => {
        return { ...prevError, email: "Email cannot be empty" };
      });
    }
    if (!credentials.password.trim()) {
      error = true;
      setErrors((prevError: authErrors) => {
        return { ...prevError, password: "Password cannot be empty" };
      });
    }
    if (error) return;

    try {
  
      const response = await axiosPrivate.post("/api/users/signin",credentials);
      const {id,accessToken,name,role}=response.data
      dispatch(login({id,accessToken,role,userName:name}))
      
      router.push("/home");

    } catch (err) {
      if (err instanceof AxiosError) {
        setErrors({ common: err.response?.data?.message || "Login failed" });
      } else {
        setErrors({ common: "An unexpected error occurred" });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    console.log("Google Sign In");
  };
  if (!isClient) {
    // Prevent rendering client-side code during SSR
    return null;
  }
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl my-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-gray-400">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {errors.common && <p className="text-red-600">{errors.common}</p>}
            <div className="space-y-4">
              <div>
                {errors.email && <p className="text-red-600">{errors.email}</p>}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
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
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
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
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
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
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleSvg />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signUp"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </>
  );
};

export default LoginPage;
