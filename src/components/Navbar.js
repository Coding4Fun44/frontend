import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("user");

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

  const handleLogout = () => {
    removeOnlineUser();
    localStorage.removeItem("user");
    localStorage.removeItem("chatId");
    localStorage.removeItem("dmId");
    localStorage.removeItem("clickedUser");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header>
      <div className="navbar-container">
        <div className="app-home-container">
          <h1>ChatNexus</h1>
          <nav className="nav1">
            {localStorage.length != 0 && (
              <Link to="/home">
                <h3 className="home-link">Home</h3>
              </Link>
            )}
            {localStorage.length != 0 && (
              <div class="dropdown">
                <h3>Create Room</h3>
                <div class="dropdown-content">
                  <Link to="/create-room" className="link">
                    <p>
                      <strong>Create Chat Room</strong>
                    </p>
                  </Link>
                  <Link to="/create-dm-room" className="link">
                    <p>
                      <strong>Create DM</strong>
                    </p>
                  </Link>
                </div>
              </div>
            )}
            {localStorage.length != 0 && (
              <Link to="/available-rooms">
                <h3 className="available-link">Join Room</h3>
              </Link>
            )}
          </nav>
        </div>

        <nav className="nav2">
          {localStorage.length != 0 && (
            <div>
              <Link to="/friends">
                <span
                  class="material-symbols-outlined"
                  style={{ fontSize: "30px", marginTop: "5px" }}
                >
                  group
                </span>
              </Link>
            </div>
          )}
          {localStorage.length != 0 && (
            <div>
              <Link to="/notifications">
                <span
                  class="material-symbols-outlined"
                  style={{ fontSize: "30px", marginTop: "5px" }}
                >
                  notifications
                </span>
              </Link>
            </div>
          )}

          {localStorage.length != 0 && (
            <div>
              <p>
                <strong>
                  Signed in as: <Link to="/my-profile">{username}</Link>
                </strong>
              </p>
            </div>
          )}
          {localStorage.length != 0 && (
            <div>
              <button className="log-out" onClick={handleLogout}>
                <strong>Log out</strong>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
