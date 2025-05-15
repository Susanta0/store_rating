import { Route, Routes } from "react-router-dom"
import StoreList from "../components/store/StoreList"
import { PrivetRoute } from "../protect/PrivetRoute"
import LoginForm from "../components/auth/LoginForm"
import SignupForm from "../components/auth/SignupForm"
import UpdatePassword from "../components/user/UpdatePassword"
import SystemAdministrator from "../components/systemAdministrator/SystemAdministrator"
import { StoreOwner } from "../components/storeOwner/StoreOwner"

export const AllRoutes=()=>{
    return (
        <Routes>
            <Route path="/" element={<LoginForm/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/signup" element={<SignupForm/>}/>
            <Route path="/stores" element={
                <PrivetRoute allowedRoles={['user']}>
                    <StoreList/>
                </PrivetRoute>
            }/>
            <Route path="/update-password" element={
                <PrivetRoute allowedRoles={['user', 'store_owner', 'system_administrator']}>
                    <UpdatePassword/>
                </PrivetRoute>
            }/>
            <Route
            path="/admin"
            element={
          <PrivetRoute allowedRoles={['system_administrator']}>
            <SystemAdministrator/>
          </PrivetRoute>
        }
      />
            <Route
            path="/store_owner"
            element={
          <PrivetRoute allowedRoles={['store_owner']}>
            <StoreOwner/>
          </PrivetRoute>
        }
      />
        </Routes>
    )
}