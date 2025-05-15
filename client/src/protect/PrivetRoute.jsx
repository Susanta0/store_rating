import { useContext } from "react"
import { AuthContext } from "../context/AuthContextProvider"
import { Navigate } from "react-router-dom"

export const PrivetRoute=({children, allowedRoles})=>{
 const {loginStatus}=useContext(AuthContext)

 if(!loginStatus.isLoggedIn){
    return <Navigate to="/login"/>
 }

 if (allowedRoles && !allowedRoles.includes(loginStatus.role)) {
   return <Navigate to={loginStatus.role === 'system_administrator' ? '/admin' : '/stores'} />;
 }

 if (allowedRoles && !allowedRoles.includes(loginStatus.role)) {
   return <Navigate to={loginStatus.role === 'store_owner' ? '/store_owner' : '/stores'} />;
 }
 return children
}