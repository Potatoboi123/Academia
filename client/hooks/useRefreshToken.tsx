"use client";
import { axiosPrivate } from "@/lib/axios";
import { setAccessToken } from "@/lib/features/auth/authSlice";

import { useDispatch } from "react-redux";

export default function useRefreshToken() {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axiosPrivate.post("/api/auth/refresh");
      console.log(response.data);
      dispatch(setAccessToken(response.data.accessToken)); // add the access token to the redux store
      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };
  return refresh;
}
