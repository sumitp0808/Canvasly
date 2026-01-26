import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Room from "./pages/Room";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import {Toaster} from "react-hot-toast";
import { Navigate } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import {useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import api from "./utils/api";
import {setUser, logout} from "./auth/authSlice";


function App() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!token) return;

    api.get("/auth/me")
      .then((res) => {
        console.log("ME RESPONSE", res.data);
        dispatch(setUser(res.data));
      })
      .catch(() => {dispatch(logout())});
  }, [token]);

  return (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      {/* Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } 
        />

        {/* Board or Room */}
        <Route path="/room/:roomId" element={
          <RequireAuth>
            <Room />
          </RequireAuth>
          } 
        />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
  );
}


export default App
