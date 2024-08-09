import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const username = localStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentbio, setCurrentBio] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const removeOnlineUser = async () => {
    const user = { username };

    const response = await fetch("/online-users", {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
  };

  const getUser = async () => {
    const response = await fetch("/user-api/" + username);
    const json = await response.json();

    if (response.ok) {
      setUser(json);
      setCurrentBio(json.bio);
      setLoading(false);
      console.log(json);
    } else {
      setError(json.error);
    }
  };

  const updateBio = async (bio) => {
    setClicked(false);
    const input = { bio };
    await fetch("/user-api/" + username, {
      method: "PATCH",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const removeUserFromChatRooms = async () => {
    await fetch("/chat-api/user/" + username, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const removeUserFromDMRooms = async () => {
    await fetch("/dm-api/" + username, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const deleteUser = async (event) => {
    event.preventDefault();

    await fetch("/user-api/" + username, {
      method: "DELETE",
    });
    removeOnlineUser();
    removeUserFromChatRooms();
    removeUserFromDMRooms();
    localStorage.removeItem("user");
    localStorage.removeItem("chatId");
    localStorage.removeItem("dmId");
    navigate("/");
  };

  useEffect(() => {
    getUser();
  }, [clicked]);

  return (
    <div className="main">
      <div className="container">
        <form className="my-profile">
          {!loading ? (
            <>
              <h2>My Profile</h2>
              <h3 className="h3-1">Username:</h3>
              <p>{user && user.userName}</p>
              <h3 className="h3-2">Bio:</h3>
              {clicked === false ? (
                <>
                  <div className="bio-flex">
                    {user && (!user.bio || user.bio.trim() === "") ? (
                      <p>You don't have a bio yet.</p>
                    ) : (
                      <p>{user && user.bio}</p>
                    )}
                    <span
                      className="material-symbols-outlined"
                      onClick={() => setClicked(true)}
                    >
                      edit
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={currentbio}
                    onChange={(event) => setCurrentBio(event.target.value)}
                    className="enter-bio"
                  />
                  <div className="update-cancel-container">
                    <button
                      className="update-bio"
                      onClick={() => updateBio(currentbio)}
                    >
                      Update
                    </button>
                    <button
                      className="cancel-bio"
                      onClick={() => setClicked(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
              <div className="delete-user">
                <button className="delete-user-button" onClick={deleteUser}>
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
