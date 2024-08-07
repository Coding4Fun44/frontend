import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*  headers: {
                'Authorization': `Bearer ${}`
            } */
const CreateRoom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [messages, setMessages] = useState("");
  const username = sessionStorage.getItem("user");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [password, setPassword] = useState("");
  const [clicked, setClicked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (event) => {
    event.preventDefault();

    const message = { sender: username, text: messages };
    const room = {
      name,
      description,
      userName: username,
      messages: message,
      password: password,
    };

    const response = await fetch("/chat-api/", {
      method: "POST",
      body: JSON.stringify(room),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (clicked && password === "") {
      setPasswordError(true);
    } else if (response.ok) {
      navigate("/home");
    }
  };

  return (
    <form className="create-room">
      <h3>Create a New Room</h3>

      <label>Room Name:</label>
      <input
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setEmptyFields([]);
        }}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Room Description:</label>
      <input
        type="text"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          setError(null);
          setEmptyFields([]);
        }}
        className={emptyFields.includes("description") ? "error" : ""}
      />

      <label>First Message:</label>
      <input
        type="text"
        value={messages}
        onChange={(event) => {
          setMessages(event.target.value);
          setError(null);
          setEmptyFields([]);
        }}
        className={emptyFields.includes("messages") ? "error" : ""}
      />
      {clicked === false ? (
        <button className="private" onClick={() => setClicked(true)}>
          Make Private
        </button>
      ) : (
        <>
          <label>Enter Password:</label>
          <input
            type="text"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(false);
            }}
            className={passwordError ? "error" : ""}
          />
          <button
            className="private-cancel"
            onClick={() => {
              setClicked(false);
              setPassword("");
              setPasswordError(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
      <div className="create-container">
        <button className="create" onClick={handleCreate}>
          <strong>Create Room</strong>
        </button>
      </div>

      {(error || passwordError) && (
        <div className="error">
          {error ? error : "Please fill in all the fields"}
        </div>
      )}
    </form>
  );
};

export default CreateRoom;
