import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);
  const [enteredMessage, setEnteredMessage] = useState("");
  const [room, setRoom] = useState(null);
  const username = sessionStorage.getItem("user");
  const chatRoomId = sessionStorage.getItem("chatId");
  const messagesEndRef = useRef(null);
  const [oldLength, setOldLength] = useState(0);
  const [newLength, setNewLength] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const online = sessionStorage.getItem("online");
  const navigate = useNavigate();

  const leaveRoom = async () => {
    const user = { userName: username };
    const response = await fetch("/chat-api/leave/" + chatRoomId, {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/home");
  };

  const getOnlineUsers = async () => {
    const response = await fetch("/online-users");
    const json = await response.json();

    if (response.ok) {
      setOnlineUsers(json);
      console.log(json);
    }
  };

  const getRoomUsers = async () => {
    const response = await fetch("/chat-api/chat-room/" + chatRoomId);
    const json = await response.json();

    if (response.ok) {
      setRoom(json);
    }
  };

  const getMessages = async () => {
    const response = await fetch("/chat-api/messages/" + chatRoomId);
    const json = await response.json();

    /*  if (!response.ok) {
      setError(json.error);
    } */
    if (response.ok) {
      setMessages(json);
      setNewLength(json.length);
    }
  };

  const sendMessage = async () => {
    const text = { sender: username, text: enteredMessage };

    const response = await fetch("/chat-api/" + chatRoomId, {
      method: "POST",
      body: JSON.stringify(text),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      getMessages();
      setEnteredMessage("");
    }
  };

  const userClick = (username) => {
    sessionStorage.setItem("clickedUser", username);
  };

  useEffect(() => {
    getMessages();
  }, [messages]);

  useEffect(() => {
    getRoomUsers();
  }, [room && room.userName]);

  useEffect(() => {
    getOnlineUsers();
  }, [onlineUsers]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (newLength > oldLength) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setOldLength(newLength);
    }
  }, [messages]);

  return (
    <div className="chat-room">
      <div className="chat-left">
        <div className="messages-header">
          {room && room.name && <h3>{room.name}</h3>}
        </div>
        <div className="messages">
          {messages &&
            messages.map((message) => (
              <div key={message._id} className="message">
                <h4>{message.sender}</h4>
                <div className="text-time-container">
                  <h3>{message.text}</h3>
                  <p>{`${format(
                    new Date(message.createdAt),
                    "MMMM dd, yyyy"
                  )} at ${format(new Date(message.createdAt), "hh:mm a")}`}</p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
        </div>
        <div className="enter-message">
          <input
            value={enteredMessage}
            onChange={(event) => setEnteredMessage(event.target.value)}
            placeholder="Enter Message"
            type="text"
          />

          <button
            className={enteredMessage.length === 0 ? "disabled-button" : ""}
            disabled={enteredMessage.length === 0}
            onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>
      </div>

      <div className="chat-right">
        <div className="users-header">
          <h3>Members</h3>
        </div>
        <div className="users">
          {room &&
            room.userName &&
            room.userName.map((username, index) => (
              <div key={index} className="user">
                {onlineUsers.includes(username) ? (
                  <>
                    <div className="users-flex">
                      <Link
                        key={index}
                        to="/profile"
                        style={{ textDecoration: "none" }}
                        onClick={() => userClick(username)}
                      >
                        <div className="user">
                          <h2>{username}</h2>
                        </div>
                      </Link>
                      <p className="online">
                        <strong>online</strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="users-flex">
                      <Link
                        key={index}
                        to="/profile"
                        style={{ textDecoration: "none" }}
                        onClick={() => userClick(username)}
                      >
                        <h2>{username}</h2>
                      </Link>
                      <p className="offline">
                        <strong>offline</strong>
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
        <div className="leave-room">
          <button className="leave-room-button" onClick={() => leaveRoom()}>
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
