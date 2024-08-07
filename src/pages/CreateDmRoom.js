import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*  headers: {
                'Authorization': `Bearer ${}`
            } */
const CreateDmRoom = () => {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState("");
  const username = sessionStorage.getItem("user");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const navigate = useNavigate();

  const handleCreate = async (event) => {
    event.preventDefault();

    const message = { sender: username, text: messages };
    const room = {
      name,
      userName: username,
      messages: message,
    };

    const response = await fetch("/dm-api/", {
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
    if (response.ok) {
      navigate("/home");
    }
  };

  return (
    <form className="create-room">
      <h3>Send a new DM</h3>

      <label>Send To:</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>First Message:</label>
      <input
        type="text"
        value={messages}
        onChange={(event) => setMessages(event.target.value)}
        className={emptyFields.includes("messages") ? "error" : ""}
      />
      <div className="create-container">
        <button className="create-dm" onClick={handleCreate}>
          <strong>Create DM</strong>
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CreateDmRoom;
