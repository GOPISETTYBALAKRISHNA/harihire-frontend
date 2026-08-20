
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";

function Messages() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {

      const response = await api.get(
        `/messages/inbox/${user.id}`
      );

      setMessages(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "30px auto"
      }}
    >

      <h2>Messages</h2>

      {/* =========================
          Advertisement
      ========================= */}

      <AdBanner />

      {/* =========================
          Messages
      ========================= */}

      {messages.length === 0 ? (

        <p>No Messages</p>

      ) : (

        messages.map((msg) => (

          <div
            key={msg.id}
            onClick={() =>
              navigate(
                `/chat?receiverId=${
                  msg.senderId === user.id
                    ? msg.receiverId
                    : msg.senderId
                }`
              )
            }
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >

            <b>
              {msg.senderId === user.id
                ? `User ${msg.receiverId}`
                : `User ${msg.senderId}`}
            </b>

            <p>{msg.message}</p>

          </div>

        ))
      )}

      {/* =========================
          Bottom Advertisement
      ========================= */}

      <AdBanner />

    </div>
  );
}

export default Messages;
