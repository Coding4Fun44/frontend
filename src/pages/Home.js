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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dmLoading, setDmLoading] = useState(true);

  const fetchDmRooms = async () => {
    const response = await fetch("/dm-api/" + username);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setDmRooms(json);
      setDmLoading(false);
    }
  };

  const fetchJoinedRooms = async () => {
    const response = await fetch("/chat-api/joined/" + username);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.log(json);
    }
    if (response.ok) {
      setRooms(json);
      setLoading(false);
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
            {loading ? (
              <h2>Loading...</h2>
            ) : rooms.length > 0 ? (
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
                    <div className="info">
                      <span className="material-symbols-outlined">info</span>
                      <div className="info-content">
                        <p>
                          <strong>Description:</strong>
                        </p>
                        <p>{room.description}</p>
                        <p>
                          <strong>Number of members: </strong>
                          {room.userName && room.userName.length}
                        </p>
                      </div>
                    </div>
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
            {dmLoading ? (
              <h2>Loading...</h2>
            ) : dmRooms.length > 0 ? (
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
    </div>
  );
};

export default Home;
