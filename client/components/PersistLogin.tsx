"use client"
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import LoadingPage from "./LoadingPage";

interface PersistLoginProps {
  children: React.ReactNode;
}

const PersistLogin: React.FC<PersistLoginProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  const { persist, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (!accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!persist) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default PersistLogin;
