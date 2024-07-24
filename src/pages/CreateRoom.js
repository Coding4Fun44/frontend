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
  const navigate = useNavigate();

  const handleCreate = async (event) => {
    event.preventDefault();

    const message = { sender: username, text: messages };
    const room = {
      name,
      description,
      userName: username,
      messages: message,
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
    if (response.ok) {
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
        onChange={(event) => setName(event.target.value)}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Room Description:</label>
      <input
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className={emptyFields.includes("description") ? "error" : ""}
      />

      <label>First Message:</label>
      <input
        type="text"
        value={messages}
        onChange={(event) => setMessages(event.target.value)}
        className={emptyFields.includes("messages") ? "error" : ""}
      />

      <button className="create" onClick={handleCreate}>
        Create Room
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CreateRoom;
