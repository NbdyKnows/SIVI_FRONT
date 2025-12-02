import React, { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2 } from "lucide-react";
import roblecito from "../assets/roblecito.png";
import { getChatResponse } from "../services/ChatIA";
import { useAuth } from "../contexts/AuthContext";
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="text-sm leading-relaxed">
      {lines.map((line, i) => {
        const isListItem = line.trim().startsWith('*') || line.trim().startsWith('-');
        
        return (
          <div key={i} className={`${isListItem ? 'pl-2 mb-1' : 'mb-2'} min-h-[1rem]`}>
            {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      text: "¡Hola! Soy Roblecito, tu asistente virtual del sistema SIVI. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const messagesContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const { isAuthenticated } = useAuth();

  const isNearBottom = (container) => {
    if (!container) return true;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (shouldAutoScrollRef.current && isNearBottom(container)) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages, loading]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    shouldAutoScrollRef.current = isNearBottom(container);
  };

  const handleToggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!isAuthenticated) {
      console.error("ChatAssistant: Usuario no autenticado.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Tu sesión ha expirado o no has iniciado sesión. Por favor, ingresa al sistema para hablar conmigo.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
      return; 
    }

    const newMessage = {
      id: crypto.randomUUID(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setLoading(true);
    shouldAutoScrollRef.current = true;

    try {
      const replyText = await getChatResponse(message);

      const botResponse = {
        id: crypto.randomUUID(),
        text: replyText,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error al conectar con el asistente:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "No pude conectarme con Roblecito en este momento. Por favor, inténtalo más tarde.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          isOpen ? "scale-110" : "scale-100 hover:scale-105"
        }`}
      >
        <button
          onClick={handleToggleChat}
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group border-2"
          style={{
            backgroundColor: "#3F7416",
            borderColor: "#3F7416DB",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-700 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2"
            style={{ borderColor: "#3F7416DB" }}
          >
            <img
              src={roblecito}
              alt="Roblecito"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: "#3F7416DB" }}
          ></div>
        </button>
      </div>

      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-500 transform ${
            isMinimized
              ? "scale-95 opacity-0 pointer-events-none"
              : "scale-100 opacity-100 animate-slide-up-chat"
          }`}
          style={{ height: isMinimized ? "0" : "450px" }}
        >
          <div
            className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-2xl"
            style={{ backgroundColor: "#3F7416" }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={roblecito}
                    alt="Roblecito"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Roblecito</h3>
                <p className="text-green-100 text-xs">Asistente Virtual</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="text-white hover:text-green-200 transition-colors duration-200"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-green-200 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto"
            style={{
              height: "calc(100% - 130px)",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      msg.isBot
                        ? "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                        : "text-white rounded-br-none"
                    }`}
                    style={!msg.isBot ? { backgroundColor: "#3F7416" } : {}}
                  >
                    {/* Usamos el helper para renderizar con formato */}
                    {msg.isBot ? <FormattedMessage text={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 text-gray-400 px-4 py-2 rounded-2xl text-xs italic flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 absolute bottom-0 w-full bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="p-2 rounded-full text-white hover:opacity-90 transition-all transform active:scale-95"
                style={{ backgroundColor: "#3F7416" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;

// Estilos CSS en JS
const styles = `
@keyframes slide-up-chat {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-slide-up-chat {
  animation: slide-up-chat 0.3s ease-out;
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}