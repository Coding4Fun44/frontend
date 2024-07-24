import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AvailableRooms = () => {
  const [allRooms, setAllRooms] = useState(null);
  const [error, setError] = useState(null);
  const username = sessionStorage.getItem("user");
  const navigate = useNavigate();

  const getRooms = async () => {
    const response = await fetch("/chat-api/not-joined/" + username);
    const json = await response.json();

    if (response.ok) {
      setAllRooms(json);
    }
  };

  const handleClick = async (roomId) => {
    const userName = { userName: username };
    const response = await fetch("/chat-api/" + roomId, {
      method: "PATCH",
      body: JSON.stringify(userName),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      navigate("/home");
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="available-rooms">
      <h1 className="new-room-header">Join a New Room</h1>
      <div className="new-rooms">
        {allRooms &&
          allRooms.map((room) => (
            <div className="new-rooms2" key={room._id}>
              <h4>{room.name}</h4>
              <button className="join" onClick={() => handleClick(room._id)}>
                Join Room
              </button>
            </div>
          ))}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AvailableRooms;
