import { createContext, useState } from "react";

export const AuthContext= createContext()


export const AuthContextProvider=({children})=>{
    const [loginStatus, setLoginStatus]= useState(()=>{
        const token= localStorage.getItem('token');
        const userName= localStorage.getItem('userName');
        const role = localStorage.getItem('role')
        const id = localStorage.getItem('id')

        return{
            isLoggedIn: !!token,
            token: token,
            userName: userName,
            role: role,
            id: id
        }
    })

    const userLogin=(token, userName, role, id)=>{
        localStorage.setItem("token", token)
        localStorage.setItem("userName", userName)
        localStorage.setItem("role", role)
        localStorage.setItem("id", id)

        setLoginStatus({
            isLoggedIn: true,
            token: token,
            userName: userName,
            role: role,
            id: id
        })
    }

    const userLogout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("userName")
        localStorage.removeItem("role")
        localStorage.removeItem("id")
        setLoginStatus({
            isLoggedIn:false,
            token: null,
            userName: null,
            role: null,
            id: null
        })
    }
    return(
        <AuthContext.Provider value={{loginStatus, userLogin, userLogout}}>
            {children}
        </AuthContext.Provider>
    )
}