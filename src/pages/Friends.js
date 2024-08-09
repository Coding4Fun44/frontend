import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Friends = () => {
  const [error, setError] = useState(null);
  const username = localStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineLoading, setOnlineLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(null);

  const getUser = async () => {
    const response = await fetch("/user-api/" + username);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setUser(json);
      setLoading(false);
    }
  };

  const getOnlineUsers = async () => {
    const response = await fetch("/online-users");
    const json = await response.json();

    if (response.ok) {
      setOnlineUsers(json);
      console.log(json);
      setOnlineLoading(false);
    }
  };

  const userClick = (username) => {
    localStorage.setItem("clickedUser", username);
  };

  const removeFriend = async (name) => {
    const response = await fetch(
      "/user-api/remove-friend/" + name + "/" + username,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response2 = await fetch(
      "/user-api/remove-friend/" + username + "/" + name,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = response.json();
    const json2 = response2.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (!response2.ok) {
      setError(json2.error);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    getOnlineUsers();
  }, [onlineUsers]);

  return (
    <div className="main">
      <div className="container">
        <h1>My Friends</h1>
        {loading || onlineLoading ? (
          <h2>Loading...</h2>
        ) : user && user.friendList.length > 0 ? (
          <div>
            {user &&
              user.friendList &&
              user.friendList.map((friend, index) => (
                <div key={index} className="friends2">
                  {onlineUsers && onlineUsers.includes(friend) ? (
                    <>
                      <div className="friends-flex">
                        <Link
                          key={index}
                          to="/profile"
                          style={{ textDecoration: "none", color: "black" }}
                          onClick={() => userClick(friend)}
                        >
                          <h2 className="username">{friend}</h2>
                        </Link>
                        <h3 className="online">
                          <strong>online</strong>
                        </h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="friends-flex">
                        <Link
                          key={index}
                          to="/profile"
                          style={{ textDecoration: "none" }}
                          onClick={() => userClick(friend)}
                        >
                          <h2>{friend}</h2>
                        </Link>
                        <h3 className="offline">
                          <strong>offline</strong>
                        </h3>
                      </div>
                    </>
                  )}
                  <button
                    className="remove-friend"
                    onClick={() => removeFriend(friend)}
                  >
                    Remove Friend
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <h2>You have no friends yet!</h2>
        )}
      </div>
    </div>
  );
};

export default Friends;
