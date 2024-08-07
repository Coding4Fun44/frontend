import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [weakPassword, setWeakPassword] = useState([]);
  const navigate = useNavigate();
  // const { dispatch } = useAuthContext();

  const addOnlineUser = async (username) => {
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

  const handleSignup = async (event) => {
    event.preventDefault();
    const signup = { userName, password };

    const response = await fetch("/user-api/signup", {
      method: "POST",
      body: JSON.stringify(signup),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      if (json.emptyFields) {
        setEmptyFields(json.emptyFields);
      } else if (json.weakPassword) {
        setWeakPassword(json.weakPassword);
      }
    }
    if (response.ok) {
      // save the user to local storage
      sessionStorage.setItem("user", json.userName);
      addOnlineUser(json.userName);
      setIsAuthenticated(true);
      navigate("/home");
      // update the auth context
      // dispatch({ type: "LOGIN", payload: json });
    }
  };

  return (
    <form className="signup">
      <h3>Sign Up</h3>

      <label>Username:</label>
      <input
        type="text"
        value={userName}
        onChange={(event) => {
          setUsername(event.target.value);
          setEmptyFields([]);
          setError(null);
        }}
        className={emptyFields.includes("userName") ? "error" : ""}
      />

      <label>Password:</label>
      <input
        type="text"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setEmptyFields([]);
          setWeakPassword([]);
          setError(null);
        }}
        className={
          emptyFields.includes("password") || weakPassword.length > 0
            ? "error"
            : ""
        }
      />
      <div className="signup-container2">
        <button className="signup-button2" onClick={handleSignup}>
          Sign up
        </button>
      </div>

      {weakPassword.length > 0 ? (
        <>
          <div className="error">
            <p>
              <strong>Your password does not meet these requirements:</strong>
            </p>
            {weakPassword.map((item) => (
              <p>• {item}</p>
            ))}
          </div>
        </>
      ) : (
        error && <div className="error">{error}</div>
      )}
    </form>
  );
};

export default Signup;
