import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../axiosConfig";

function Chat() {

  const [searchParams] = useSearchParams();

  const receiverId = searchParams.get("receiverId");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const senderId = `user?.id`;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const chatBoxRef = useRef(null);


  // =====================================================
  // LOAD CHAT
  // =====================================================

  useEffect(() => {

    if (!senderId || !receiverId) {
      return;
    }

    loadChat();

    const interval = setInterval(() => {
      loadChat();
    }, 2000);

    return () => {
      clearInterval(interval);
    };

  }, [receiverId, senderId]);


  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  const loadChat = async () => {

    try {

      const response = await api.get(
        `/messages/chat?senderId=${senderId}&receiverId=${receiverId}`
      );

      setMessages(response.data || []);

    } catch (error) {

      console.error(
        "Chat loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // AUTO SCROLL TO LATEST MESSAGE
  // =====================================================

  useEffect(() => {

    if (chatBoxRef.current) {

      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;

    }

  }, [messages]);


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!senderId || !receiverId) {

      alert(
        "Unable to identify chat users."
      );

      return;
    }

    try {

      setSending(true);

      await api.post(
        "/messages/send",
        {
          senderId: senderId,
          receiverId: receiverId,
          message: trimmedMessage
        }
      );

      setMessage("");

      await loadChat();

    } catch (error) {

      console.error(
        "Send message error:",
        error
      );

      alert(
        "Unable to send message."
      );

    } finally {

      setSending(false);

    }
  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

      event.preventDefault();

      sendMessage();

    }

  };


  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {

    return (

      <div style={styles.center}>

        <h2>
          Please login to use chat.
        </h2>

      </div>

    );

  }


  // =====================================================
  // NO RECEIVER
  // =====================================================

  if (!receiverId) {

    return (

      <div style={styles.center}>

        <h2>
          Chat user not found.
        </h2>

        <p>
          Please select a user to start chatting.
        </p>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div style={styles.page}>

      <div style={styles.chatContainer}>

        {/* =================================================
            CHAT HEADER
        ================================================= */}

        <div style={styles.header}>

          <div style={styles.avatar}>
            👤
          </div>

          <div>

            <h2 style={styles.headerTitle}>
              Chat
            </h2>

            <p style={styles.headerSubtitle}>
              Conversation
            </p>

          </div>

        </div>


        {/* =================================================
            CHAT MESSAGES
        ================================================= */}

        <div
          ref={chatBoxRef}
          style={styles.messagesContainer}
        >

          {loading ? (

            <div style={styles.emptyMessage}>

              <p>
                Loading messages...
              </p>

            </div>

          ) : messages.length === 0 ? (

            <div style={styles.emptyMessage}>

              <div style={styles.emptyIcon}>
                💬
              </div>

              <h3>
                No messages yet
              </h3>

              <p>
                Start the conversation by sending
                a message.
              </p>

            </div>

          ) : (

            messages.map((msg) => {

              const isMine =
                Number(msg.senderId) ===
                Number(senderId);

              return (

                <div
                  key={msg.id}
                  style={{
                    ...styles.messageRow,

                    justifyContent:
                      isMine
                        ? "flex-end"
                        : "flex-start"
                  }}
                >

                  <div
                    style={{
                      ...styles.messageBubble,

                      backgroundColor:
                        isMine
                          ? "#1976d2"
                          : "#ffffff",

                      color:
                        isMine
                          ? "#ffffff"
                          : "#222222",

                      border:
                        isMine
                          ? "none"
                          : "1px solid #e0e0e0",

                      borderRadius:
                        isMine
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px"
                    }}
                  >

                    <div
                      style={{
                        fontSize: "15px",
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                      }}
                    >
                      {msg.message}
                    </div>

                  </div>

                </div>

              );

            })

          )}

        </div>


        {/* =================================================
            MESSAGE INPUT
        ================================================= */}

        <div style={styles.inputArea}>

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending}
            style={styles.input}
          />

          <button
            onClick={sendMessage}
            disabled={
              sending ||
              !message.trim()
            }
            style={{
              ...styles.sendButton,

              opacity:
                sending ||
                !message.trim()
                  ? 0.6
                  : 1,

              cursor:
                sending ||
                !message.trim()
                  ? "not-allowed"
                  : "pointer"
            }}
          >

            {sending
              ? "Sending..."
              : "Send"}

          </button>

        </div>

      </div>

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {

    minHeight: "100vh",

    backgroundColor: "#f5f7fb",

    padding: "30px 20px",

    boxSizing: "border-box"

  },


  chatContainer: {

    width: "100%",

    maxWidth: "800px",

    height: "650px",

    margin: "0 auto",

    backgroundColor: "#ffffff",

    borderRadius: "12px",

    boxShadow:
      "0 4px 18px rgba(0,0,0,0.10)",

    overflow: "hidden",

    display: "flex",

    flexDirection: "column"

  },


  // ===================================================
  // HEADER
  // ===================================================

  header: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "16px 20px",

    backgroundColor: "#1976d2",

    color: "#ffffff"

  },


  avatar: {

    width: "42px",

    height: "42px",

    borderRadius: "50%",

    backgroundColor: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "21px"

  },


  headerTitle: {

    margin: 0,

    fontSize: "19px"

  },


  headerSubtitle: {

    margin: "3px 0 0",

    fontSize: "12px",

    opacity: 0.9

  },


  // ===================================================
  // MESSAGES
  // ===================================================

  messagesContainer: {

    flex: 1,

    overflowY: "auto",

    padding: "20px",

    backgroundColor: "#f8f9fb",

    boxSizing: "border-box"

  },


  messageRow: {

    display: "flex",

    width: "100%",

    marginBottom: "10px"

  },


  messageBubble: {

    maxWidth: "70%",

    padding: "10px 14px",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.08)",

    fontSize: "15px"

  },


  // ===================================================
  // EMPTY CHAT
  // ===================================================

  emptyMessage: {

    height: "100%",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    color: "#777"

  },


  emptyIcon: {

    fontSize: "42px",

    marginBottom: "10px"

  },


  // ===================================================
  // INPUT
  // ===================================================

  inputArea: {

    display: "flex",

    gap: "10px",

    padding: "15px",

    borderTop: "1px solid #eeeeee",

    backgroundColor: "#ffffff"

  },


  input: {

    flex: 1,

    minWidth: 0,

    padding: "12px 14px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box"

  },


  sendButton: {

    backgroundColor: "#1976d2",

    color: "#ffffff",

    border: "none",

    padding: "0 22px",

    borderRadius: "8px",

    fontSize: "15px",

    fontWeight: "600",

    cursor: "pointer"

  },


  // ===================================================
  // CENTER
  // ===================================================

  center: {

    minHeight: "70vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    padding: "20px"

  }

};


export default Chat;