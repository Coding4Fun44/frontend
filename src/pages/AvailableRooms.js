import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AvailableRooms = () => {
  const [allRooms, setAllRooms] = useState(null);
  const [error, setError] = useState(null);
  const username = sessionStorage.getItem("user");
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [room_Id, setRoom_Id] = useState(null);
  const navigate = useNavigate();

  const getRooms = async () => {
    const response = await fetch("/chat-api/not-joined/" + username);
    const json = await response.json();

    if (response.ok) {
      setAllRooms(json);
      setLoading(false);
    }
  };

  const joinRoom = async (roomId) => {
    const userName = { userName: username };
    const response = await fetch("/chat-api/" + roomId, {
      method: "PATCH",
      body: JSON.stringify(userName),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      navigate("/home");
    }
  };

  const enterPassword = (roomId) => {
    setPassword("");
    setPasswordRequired(true);
    setRoom_Id(roomId);
  };

  const joinPasswordRoom = async (event, roomId) => {
    event.preventDefault();

    const input = { userName: username, password: password };
    const response = await fetch("/chat-api/private/" + roomId, {
      method: "PATCH",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setPasswordRequired(false);
      navigate("/home");
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    if (passwordRequired) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [passwordRequired]);

  return (
    <div className="available-rooms">
      <h1 className="new-room-header">Join a New Room</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : allRooms.length > 0 ? (
        <div className="new-rooms">
          {allRooms &&
            allRooms.map((room) => (
              <div className="new-rooms2" key={room._id}>
                <div className="room-info">
                  <div className="room-name">
                    <h2>{room.name}</h2>
                    {room.password && (
                      <span class="material-symbols-outlined">lock</span>
                    )}
                  </div>
                  <p>
                    <strong>Description: </strong>
                    {room.description}
                  </p>
                  <p>
                    <strong>Number of Members: </strong>
                    {room.userName.length}
                  </p>
                </div>
                <div>
                  <button
                    className="join"
                    onClick={() =>
                      room.password
                        ? enterPassword(room._id)
                        : joinRoom(room._id)
                    }
                  >
                    <strong>Join Room</strong>
                  </button>
                </div>
              </div>
            ))}
          {passwordRequired && (
            <>
              <div className="backdrop"></div>
              <form className="password-required">
                <label>
                  <strong>Enter Password:</strong>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  className={error ? "error" : ""}
                />

                <div className="password-buttons">
                  <button
                    className="join-room2"
                    onClick={(event) => joinPasswordRoom(event, room_Id)}
                  >
                    Join Room
                  </button>
                  <button
                    className="cancel2"
                    onClick={() => {
                      setPasswordRequired(false);
                      setPassword("");
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {error && <div className="error">{error}</div>}
              </form>
            </>
          )}
        </div>
      ) : (
        <h2>You have joined all available rooms!</h2>
      )}
    </div>
  );
};

export default AvailableRooms;
