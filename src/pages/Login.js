import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const login = { userName, password };

    const response = await fetch("/user-api/login", {
      method: "POST",
      body: JSON.stringify(login),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      // save the user to local storage
      sessionStorage.setItem("user", json.userName);
      navigate("/home");
      // update the auth context
      // dispatch({ type: "LOGIN", payload: json });
    }
  };

  return (
    <form className="login">
      <h3>Log in to Your Account</h3>

      <label>Username:</label>
      <input
        type="text"
        value={userName}
        onChange={(event) => setUsername(event.target.value)}
        className={emptyFields.includes("userName") ? "error" : ""}
      />

      <label>Password:</label>
      <input
        type="text"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={emptyFields.includes("password") ? "error" : ""}
      />

      <button className="login-button2" onClick={handleLogin}>
        Log in
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
