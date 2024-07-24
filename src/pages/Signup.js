import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const navigate = useNavigate();
  // const { dispatch } = useAuthContext();

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
    <form className="signup">
      <h3>Sign Up</h3>

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

      <button className="signup-button2" onClick={handleSignup}>
        Sign up
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
