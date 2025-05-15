import { createContext, useState } from "react";

export const AuthContext= createContext()


export const AuthContextProvider=({children})=>{
    const [loginStatus, setLoginStatus]= useState(()=>{
        const token= localStorage.getItem('token');
        const userName= localStorage.getItem('userName');
        const role = localStorage.getItem('role')

        return{
            isLoggedIn: !!token,
            token: token,
            userName: userName,
            role: role
        }
    })

    const userLogin=(token, userName, role)=>{
        localStorage.setItem("token", token)
        localStorage.setItem("userName", userName)
        localStorage.setItem("role", role)

        setLoginStatus({
            isLoggedIn: true,
            token: token,
            userName: userName,
            role: role
        })
    }

    const userLogout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("userName")
        localStorage.removeItem("role")
        setLoginStatus({
            isLoggedIn:false,
            token: null,
            userName: null,
            role: null
        })
    }
    return(
        <AuthContext.Provider value={{loginStatus, userLogin, userLogout}}>
            {children}
        </AuthContext.Provider>
    )
}