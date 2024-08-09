import { Link } from "react-router-dom";

const Main = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("chatId");
  localStorage.removeItem("online");
  return (
    <div className="main">
      <div className="container">
        <div>
          <h1 className="main-header">
            Chat Online with People from Around the World!
          </h1>
        </div>
        <div>
          <div className="login-signup-container">
            <Link to="/login">
              <button className="login-button">Log in</button>
            </Link>
            <div className="signup-container">
              <Link to="/signup">
                <button className="signup-button">Sign up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
