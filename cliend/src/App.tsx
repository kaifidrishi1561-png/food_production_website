// import css from './App.css'
import Login from './auth/Login'
import Signin from './auth/Signup'
import ForgotPassword from "./auth/ForgotPassword"
import MainLayout from './layout/MainLayout'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from './auth/VerifyEmail'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'
import Profile from './components/Profile'

import SearchPage from './components/SearchPage'
import RestaurantDetails from './components/RestaurantDetails'
import Card from './components/Card'
import Restaurant from './admin/Restaurant'
import AddMenu from './admin/AddMenu'

import Orders from './admin/Orders'
import Success from './components/Success'
import { useUserStore } from './store/useUserStore'
import Signup from './auth/Signup'
import { useEffect } from 'react'
import Loading from './components/Loading'
import { useThemeStore } from './store/useThemeStore'
const ProtectedRoutes = ({children}:{children:React.ReactNode})=>{
const {isAuthenticated,user} = useUserStore()
if(!isAuthenticated){
  return <Navigate to={"/login"} replace/>
}
if(!user?.isVerified){
  return <Navigate to={'/verify-email'}replace/>
}
return children
}
const AuthenticatedUser = ({children}:{children:React.ReactNode})=>{
  const {isAuthenticated,user} = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to={'/'} replace/>
  }
  return children
}
const AdminRoute = ({children}:{children:React.ReactNode})=>{
  const {user,isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to={'/login'} replace/>
  }
  if(!user?.admin){
    return <Navigate to={'/'}replace/>
  }
return children
}
const appRouter = createBrowserRouter([
  {
    path: '/',
    element:(<ProtectedRoutes><MainLayout/></ProtectedRoutes> ),
    children:[
      {
        path:"/",
        element:<HeroSection/>
      }
      ,{
        path:"/profile",
        element:<Profile/>
      }
      ,{
        path:"/search/:text",
        element:<SearchPage/>
      }
      ,{
        path:"/restaurant/:id",
        element:<RestaurantDetails/>
      }
      ,{
        path:"/cart",
        element:<Card/>
      }
      //admin service start
  ,{
    path: "/admin/restaurant",
    element: <AdminRoute><Restaurant /></AdminRoute>
  }
  ,{
    path: "/admin/menu",
    element: <AdminRoute><AddMenu /></AdminRoute>
  }
  ,{
    path: "/admin/orders",
    element:<AdminRoute><Orders />  </AdminRoute> 
  }
  ,{
    path: "/order/status",
    element: <Success />
  }
    ]
  },
  {
    path: "/Login",
    element:<AuthenticatedUser><Login/></AuthenticatedUser> ,
  },
  {
    path: "/Signup",
    element: <AuthenticatedUser><Signup/></AuthenticatedUser>,
  },
  {
    path: "/ForgotPassword",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser> ,
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword />
  }
  ,{
    path: "/verify-email",
    element: <VerifyEmail />
  }
  

]);


function App() {
  const initializeTheme=useThemeStore((state:any)=>state.initializeTheme)
const {checkAuthentication, isCheckingAuth} = useUserStore() 
// checking auth every time when reload the paged
useEffect(()=>{
  checkAuthentication()
  initializeTheme()
},[checkAuthentication])
if(isCheckingAuth)return <Loading/>

  return (
    <>
    <RouterProvider router={appRouter}>  

    </RouterProvider>
    
     </>
  )
}

export default App
