"use client"
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface PersistLoginProps {
  children: React.ReactNode;
}

const PersistLogin: React.FC<PersistLoginProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  const { accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const persist=useRef(false);
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
    const storedValue=localStorage.getItem("persist");
    persist.current=storedValue ? JSON.parse(storedValue) : false;

    if (!accessToken && persist.current) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!persist) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

export default PersistLogin;
