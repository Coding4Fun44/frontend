import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/*  headers: {
                'Authorization': `Bearer ${}`
            } */
const Home = () => {
  const [rooms, setRooms] = useState(null);
  const [dmRooms, setDmRooms] = useState(null);
  const [error, setError] = useState(null);
  const username = sessionStorage.getItem("user");

  const fetchDmRooms = async () => {
    const response = await fetch("/dm-api/" + username);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok && json.length !== 0) {
      setDmRooms(json);
    }
  };

  const fetchJoinedRooms = async () => {
    const response = await fetch("/chat-api/joined/" + username);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok && json.length !== 0) {
      setRooms(json);
    }
  };

  useEffect(() => {
    fetchJoinedRooms();
  }, [rooms]);

  useEffect(() => {
    fetchDmRooms();
  }, [dmRooms]);

  const chatClick = (roomId) => {
    sessionStorage.setItem("chatId", roomId);
  };

  const dmClick = (roomId) => {
    sessionStorage.setItem("dmId", roomId);
  };

  return (
    <div className="home">
      <div className="top-container">
        <h1 className="Welcome">Welcome, {username}!</h1>
      </div>
      <div className="grid">
        <div className="chat-room-container">
          <h3>Your Chat Rooms:</h3>
          <div className="rooms">
            {rooms ? (
              rooms.map((room) => (
                <Link
                  key={room._id}
                  to="/room"
                  style={{ textDecoration: "none" }}
                  onClick={() => chatClick(room._id)}
                >
                  <div className="rooms2">
                    <h4>{room.name}</h4>
                    <p>
                      <strong>
                        {room.messages[room.messages.length - 1].sender}:{" "}
                        {room.messages[room.messages.length - 1].text}
                      </strong>
                    </p>
                    <span className="material-symbols-outlined">info</span>
                  </div>
                </Link>
              ))
            ) : (
              <h2>You haven't joined any rooms yet!</h2>
            )}
          </div>
        </div>
        {/* <div className="create-available-container">
        <Link to="/create-room">
          <button className="create-button">Create Room</button>
        </Link>
        <div className="available-container">
          <Link to="/available-rooms">
            <button className="available-button">Join New Room</button>
          </Link>
        </div>
      </div> */}
        <div className="dm-room-container">
          <h3>Your DMs:</h3>
          <div className="dm-rooms">
            {dmRooms ? (
              dmRooms.map((room) => (
                <Link
                  key={room._id}
                  to="/dm-room"
                  style={{ textDecoration: "none" }}
                  onClick={() => dmClick(room._id)}
                >
                  <div className="dm-rooms2">
                    {room.userName &&
                      room.userName.map(
                        (name) => name !== username && <h4>{name}</h4>
                      )}
                    <p>
                      <strong>
                        {room.messages[room.messages.length - 1].sender}:{" "}
                        {room.messages[room.messages.length - 1].text}
                      </strong>
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <h2>You don't have any DMs yet!</h2>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Home;
