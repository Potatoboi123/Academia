"use client";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";

interface ProtectedRouteProps {
  role: string;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user.role !== role) {

      router.push(role === "admin" ? "/adminLogin" : "/login");
    }
  }, [user.role, role, router]);

  // Render children only if the role matches
  if (user.role === role) {
    return <>{children}</>;
  }

  // Return null or a loading state while redirecting
  return <LoadingPage />;
}
