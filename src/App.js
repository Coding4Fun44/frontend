import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Main from "./pages/Main";
import CreateRoom from "./pages/CreateRoom";
import AvailableRooms from "./pages/AvailableRooms";
import ChatRoom from "./pages/ChatRoom";
import DmRoom from "./pages/DmRoom";
import CreateDmRoom from "./pages/CreateDmRoom";
import Navbar from "./components/Navbar";
import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [userName, setUserName] = useState("");
  const [chatRoomId, setChatRoomId] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Navbar />
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
          <Routes>
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Routes>
            <Route path="/create-room" element={<CreateRoom />} />
          </Routes>
          <Routes>
            <Route path="/available-rooms" element={<AvailableRooms />} />
          </Routes>
          <Routes>
            <Route path="/room" element={<ChatRoom />} />
          </Routes>
          <Routes>
            <Route path="/dm-room" element={<DmRoom />} />
          </Routes>
          <Routes>
            <Route path="/create-dm-room" element={<CreateDmRoom />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
