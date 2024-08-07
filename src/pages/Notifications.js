import { useEffect, useState } from "react";

const Notifications = () => {
  const [error, setError] = useState(null);
  const username = sessionStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const acceptRequest = async (name) => {
    const response = await fetch("/user-api/list/" + name + "/" + username, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response2 = await fetch("/user-api/list/" + username + "/" + name, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = response.json();
    const json2 = response2.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (!response2.ok) {
      setError(json2.error);
    }
  };

  const removeRequest = async (name) => {
    const response = await fetch(
      "/user-api/remove-request/" + name + "/" + username,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = response.json();
    if (!response.ok) {
      setError(json.error);
    }
  };

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

  useEffect(() => {
    getUser();
  }, [user]);

  return (
    <div className="requests">
      <h1>Notifications</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : user && user.friendRequest.length > 0 ? (
        <div>
          {user &&
            user.friendRequest &&
            user.friendRequest.map((name, index) => (
              <div key={index} className="requests2">
                <div className="request-containter">
                  <h2>{name} sent you a friend request.</h2>
                </div>
                <div className="accept-decline">
                  <button
                    className="accept"
                    onClick={() => {
                      acceptRequest(name);
                      removeRequest(name);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="decline"
                    onClick={() => removeRequest(name)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <h2>You have no notifications!</h2>
      )}
    </div>
  );
};

export default Notifications;
