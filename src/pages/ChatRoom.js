import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { format } from "date-fns";

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
  const online = sessionStorage.getItem("online");

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

  useEffect(() => {
    getMessages();
  }, [messages]);

  useEffect(() => {
    getRoomUsers();
  }, []);

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
                <h2>{username}</h2>
              </div>
            ))}
        </div>
        {online === "true" && <h3>Online</h3>}
      </div>
    </div>
  );
};

export default ChatRoom;
