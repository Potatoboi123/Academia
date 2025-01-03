"use client"
import { axiosPrivate } from "@/lib/axios";
import { setAccessToken } from "@/lib/features/auth/authSlice";

import {useDispatch } from 'react-redux'


export default function useRefreshToken(){

  const dispatch = useDispatch()
    const refresh=async ()=>{
        const response=await axiosPrivate.post("/api/users/refresh",{
            withCredentials:true
        });
        dispatch(setAccessToken(response.data.accessToken)) // add the access token to the redux store
        return response.data.accessToken
    }
    return refresh
}
