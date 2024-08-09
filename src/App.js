import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Main from "./pages/Main";
import CreateRoom from "./pages/CreateRoom";
import AvailableRooms from "./pages/AvailableRooms";
import ChatRoom from "./pages/ChatRoom";
import DmRoom from "./pages/DmRoom";
import CreateDmRoom from "./pages/CreateDmRoom";
import MyProfile from "./pages/MyProfile";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Friends from "./pages/Friends";
import Navbar from "./components/Navbar";
import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("user") != null
  );
  console.log(isAuthenticated);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/home" /> : <Main />}
            />
            <Route
              path="/home"
              element={!isAuthenticated ? <Navigate to="/" /> : <Home />}
            />

            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />

            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />

            <Route
              path="/create-room"
              element={!isAuthenticated ? <Navigate to="/" /> : <CreateRoom />}
            />

            <Route
              path="/available-rooms"
              element={
                !isAuthenticated ? <Navigate to="/" /> : <AvailableRooms />
              }
            />

            <Route
              path="/room"
              element={!isAuthenticated ? <Navigate to="/" /> : <ChatRoom />}
            />

            <Route
              path="/dm-room"
              element={!isAuthenticated ? <Navigate to="/" /> : <DmRoom />}
            />

            <Route
              path="/create-dm-room"
              element={
                !isAuthenticated ? <Navigate to="/" /> : <CreateDmRoom />
              }
            />

            <Route
              path="/my-profile"
              element={!isAuthenticated ? <Navigate to="/" /> : <MyProfile />}
            />

            <Route
              path="/profile"
              element={!isAuthenticated ? <Navigate to="/" /> : <Profile />}
            />

            <Route
              path="/notifications"
              element={
                !isAuthenticated ? <Navigate to="/" /> : <Notifications />
              }
            />

            <Route
              path="/friends"
              element={!isAuthenticated ? <Navigate to="/" /> : <Friends />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
