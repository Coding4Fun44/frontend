import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const username = localStorage.getItem("user");
  const clickedUser = localStorage.getItem("clickedUser");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const sendFriendRequest = async () => {
    const response = await fetch(
      "user-api/request/" + username + "/" + clickedUser,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
  };

  const getUser = async () => {
    const response = await fetch("/user-api/" + clickedUser);
    const json = await response.json();

    if (response.ok) {
      setUser(json);
      setLoading(false);
      console.log(json);
    } else {
      setError(json.error);
    }
  };

  const getMutualChatRooms = async () => {
    const response = await fetch("/chat-api/" + username + "/" + clickedUser);
    const json = await response.json();
    if (response.ok) {
      setRooms(json);
      console.log(json);
    } else {
      setError(json.error);
    }
  };

  const getMutualFriends = async () => {
    const response = await fetch("/user-api/" + username + "/" + clickedUser);
    const json = await response.json();
    if (response.ok) {
      setUsers(json);
      console.log(json);
    } else {
      setError(json.error);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    getMutualChatRooms();
  }, []);

  useEffect(() => {
    getMutualFriends();
  }, []);

  return (
    <div className="main">
      <div className="container">
        <div className="profile">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <h3>{user && user.userName}</h3>
              {user && (!user.bio || user.bio.trim() === "") ? (
                <p>
                  <strong>The user does not have a bio.</strong>
                </p>
              ) : (
                <p>{user && user.bio}</p>
              )}
              {username !== clickedUser ? (
                <h3>Mutual Chat Rooms:</h3>
              ) : (
                <h3>My Chat Rooms:</h3>
              )}
              {rooms && rooms.length === 0 ? (
                <p>You don't any mutual chat rooms with this user.</p>
              ) : (
                rooms && rooms.map((room) => <p>{room.name}</p>)
              )}
              {username !== clickedUser ? (
                <h3>Mutual Friends:</h3>
              ) : (
                <h3>My Friends:</h3>
              )}
              {users && users.length === 0 ? (
                <p>You don't any mutual friends with this user.</p>
              ) : (
                users && users.map((user) => <p>{user.userName}</p>)
              )}
              {username !== clickedUser &&
              user &&
              user.friendList &&
              !user.friendList.includes(username) ? (
                !user.friendRequest.includes(username) ? (
                  <button
                    className="send-request"
                    onClick={() => sendFriendRequest()}
                  >
                    Send Friend Request
                  </button>
                ) : (
                  <h4>Friend Request Pending</h4>
                )
              ) : (
                <h2></h2>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
