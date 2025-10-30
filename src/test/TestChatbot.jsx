import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TestChatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const memberId = 1;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chatbot/${memberId}`
      );

      console.log(response);
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const connectSocket = (callback) => {
      const client = new Client({
        brokerURL: "ws://localhost:8080/api/ws",
        connectHeaders: {},
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("Connected to WebSocket");
          client.subscribe(`/topic/chatbot/${memberId}`, (message) => {
            callback(message.body);
          });
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
        },
      });
      client.activate();
      return client;
    };

    const handleData = (data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      setMessages((prevMessages) => [...prevMessages, parsedData]);
    };

    const client = connectSocket(handleData);
    clientRef.current = client;

    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, []);

  const handleSendMessage = (memberId, message) => {
    if (!message.trim()) return;

    console.log(memberId, message);

    // Add user message immediately to UI
    const userMessage = {
      messageType: "USER",
      metadata: { messageType: "USER" },
      media: [],
      text: message,
    };
    setMessages((prev) => [...prev, userMessage]);

    const client = new Client({
      brokerURL: "ws://localhost:8080/api/ws",
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.publish({
          destination: "/app/chatbot",
          body: JSON.stringify({
            memberId: memberId,
            message: message,
          }),
        });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();

    setMessage(""); // Clear input after sending
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(memberId, message);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <Bot className="h-12 w-12 mx-auto opacity-50" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.messageType === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.messageType === "ASSISTANT" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.messageType === "USER"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>

                {msg.messageType === "USER" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500">
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="min-h-[60px] max-h-[120px] resize-none"
              rows={2}
            />
            <Button
              onClick={() => handleSendMessage(memberId, message)}
              disabled={!message.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestChatbot;
