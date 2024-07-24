import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("user");

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("chatId");
    sessionStorage.removeItem("dmId");
    navigate("/");
  };

  return (
    <header>
      <div className="navbar-container">
        <div className="app-home-container">
          <h1>ChatNexus</h1>
          <nav className="nav1">
            {sessionStorage.length != 0 && (
              <Link to="/home">
                <h3 className="home-link">Home</h3>
              </Link>
            )}
            {sessionStorage.length != 0 && (
              <div class="dropdown">
                <h3>Create Room</h3>
                <div class="dropdown-content">
                  <Link to="/create-room">
                    <p>
                      <strong>Create Chat Room</strong>
                    </p>
                  </Link>
                  <Link to="/create-dm-room">
                    <p>
                      <strong>Create DM</strong>
                    </p>
                  </Link>
                </div>
              </div>
            )}
            {sessionStorage.length != 0 && (
              <Link to="/available-rooms">
                <h3 className="available-link">Join Room</h3>
              </Link>
            )}
          </nav>
        </div>

        <nav className="nav2">
          {sessionStorage.length != 0 && (
            <div>
              <p>
                <strong>Signed in as: {username}</strong>
              </p>
            </div>
          )}
          {sessionStorage.length != 0 && (
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
