import { useState, useEffect, useRef } from "react";
import { Input, Button } from "@/components/ui";
import { Loader } from "@/components/shared";

// Message type definition
export type Message = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

// Define the props for the Messaging component
export type MessagingProps = {
  currentUser: string;  // Logged-in user
  otherUser: string;    // User they are chatting with
  otherUserProfileImage: string; // Profile image for the chat header
};

// Fetch messages from the server for a chat
const fetchMessages = async (currentUser: string, otherUser: string) => {
  try {
    const response = await fetch(`/api/messages?sender=${currentUser}&receiver=${otherUser}`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// The main MessagingPage component
const MessagingPage = ({ currentUser, otherUser, otherUserProfileImage }: MessagingProps) => {
  const [messages, setMessages] = useState<Message[]>([]);  // State for the list of messages
  const [messageValue, setMessageValue] = useState("");     // State for the input message
  const [isFetching, setIsFetching] = useState(true);       // State to track loading messages
  const messageListRef = useRef<HTMLDivElement>(null);       // Ref to control scrolling in the chat

  // Function to fetch and load messages
  const loadMessages = async () => {
    setIsFetching(true);
    const data = await fetchMessages(currentUser, otherUser);
    setMessages(data);
    setIsFetching(false);
  };

  // Fetch messages when component mounts or the otherUser changes
  useEffect(() => {
    loadMessages();
  }, [otherUser]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Custom function to send a new message
  const handleSendMessage = async () => {
    if (messageValue.trim() === "") return;  // Do not send empty messages

    try {
      const newMessage = {
        sender: currentUser,
        receiver: otherUser,
        content: messageValue,
      };

      // Replace this with your actual API call to send the message
      await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      // Clear input after sending the message
      setMessageValue("");

      // Optionally reload messages after sending
      loadMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Display a loader while messages are being fetched
  if (isFetching)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="messaging-page flex flex-col h-full bg-dark-1 text-white">
      {/* Chat Header */}
      <div className="messaging-header flex-between p-4 bg-dark-2">
        <button className="back-button">
          <img
            src="/assets/icons/back-arrow.svg"
            alt="Back"
            width={24}
            height={24}
            className="invert-white"
          />
        </button>
        <div className="chat-info flex items-center gap-4">
          <img
            src={otherUserProfileImage}
            alt={`${otherUser} profile`}
            className="chat-profile-img w-10 h-10 rounded-full"
          />
          <h2 className="h2-bold">{otherUser}</h2>
        </div>
      </div>

      {/* Message List */}
      <div className="message-list flex-grow p-4 overflow-y-auto custom-scrollbar bg-dark-3" ref={messageListRef}>
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`message-item ${
              message.sender === currentUser ? "sent bg-primary-500" : "received bg-dark-4"
            } p-4 rounded-lg max-w-[70%] mb-4`}
          >
            <p className="text-light-1">{message.content}</p>
            <small className="text-light-4 text-right block mt-1 text-xs">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="message-input-container flex items-center p-4 bg-dark-2">
        <Input
          type="text"
          placeholder="Message..."
          className="shad-input flex-grow mr-3"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button onClick={handleSendMessage} className="shad-button_primary">
          <img src="/assets/icons/send.svg" alt="Send" />
        </Button>
      </div>
    </div>
  );
};

export default MessagingPage;