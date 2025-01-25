import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShape from "./components/floatingShape"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage"
import EmailVerficationPage from "./pages/EmailVerficationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"

//protect routes that require authentication
const ProtectedRoutes = ({children}) => {
  const {isAuthenticated,user} = useAuthStore();
  if(!isAuthenticated){
    return <Navigate to='/login' replace/>
  }

  if(!user.isVerified){
    return <Navigate to='/verify-email' replace/>
  }

  return children;
}


//redirect authenticated users to home page
const RedirectAuthenticatedUsers = ({children}) => {
const {isAuthenticated,user} = useAuthStore();

if(isAuthenticated && user.isVerified){
  return <Navigate to='/' replace/>

}
return children;
}

function App() {

  const {isCheckingAuth, checkAuth}=useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

 if(isCheckingAuth) return <LoadingSpinner/>

  

  return (
    <div className="min-h-screen 
    bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
    <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
    <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

    <Routes>
      <Route path="/" element={
        <ProtectedRoutes>
          <DashboardPage/>
        </ProtectedRoutes>
      } />
      <Route path="/signup" element={
        <RedirectAuthenticatedUsers>
        <SignUpPage/>
        </RedirectAuthenticatedUsers>
      }
       />
      <Route path="/login" element={
         <RedirectAuthenticatedUsers>
         <LoginPage/>
         </RedirectAuthenticatedUsers>
      } />
      <Route path="/verify-email" element={<EmailVerficationPage />} />
      <Route path="/forgot-password" element={
        <RedirectAuthenticatedUsers>
        <ForgotPasswordPage/>
        </RedirectAuthenticatedUsers>
      } />
      <Route
      path="/reset-password/:token"
      element={
        <RedirectAuthenticatedUsers>
        <ResetPasswordPage/>
        </RedirectAuthenticatedUsers>
      }
      />
      // catch all routes
      <Route
      path="*"
      element={
        <Navigate to='/' replace/>
      }
      />
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App
