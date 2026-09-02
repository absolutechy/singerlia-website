import { io, Socket } from "socket.io-client";

// Minimal client for the "send a message from a singer's profile" flow — mirrors the contract
// singerlia-admin's chat already uses against the same backend (services/socket/sockitInit.js),
// trimmed to just connect/send/disconnect since the website has no conversation view to hydrate.
interface SendMessagePayload {
  from: string;
  to: string;
  message: string;
  chatKey?: string;
  // Used only by the singer-profile "first contact" inquiry flow — see MessageModal.tsx. Rejects
  // the send (via a `messageBlocked` event) if the sender's last message in this chat hasn't
  // been replied to yet. Ordinary chat never sets this and is never rate-limited.
  enforceReplyGate?: boolean;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

interface ChatRecord {
  messages: ChatMessage[];
  chatBetween: string[];
  prevCount: number;
  currCount: number;
}

interface ChatMessagesData {
  chatKey: string;
  // The backend returns `[]` (not an object) when no chat exists yet for this pair.
  chat: ChatRecord | [];
}

interface MessageBlockedData {
  chatKey: string;
  reason: string;
}

interface MessageSentData {
  chatKey: string;
  timestamp: number;
}

class SocketService {
  private socket: Socket | null = null;

  connect(userToken: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
    const socketUrl = import.meta.env.VITE_SOCKET_URL || apiBaseUrl.replace(/\/api\/?$/, "");

    this.socket = io(socketUrl, {
      path: "/socket.io",
      auth: { token: userToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    return this.socket;
  }

  sendMessage(
    from: string,
    to: string,
    message: string,
    chatKey = "",
    enforceReplyGate = false
  ): void {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    const payload: SendMessagePayload = { from, to, message, chatKey, enforceReplyGate };
    this.socket.emit("sendMessage", payload);
  }

  getChatMessages(chatKey: string): void {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }
    this.socket.emit("getChatMessages", { chatKey });
  }

  onChatMessages(callback: (data: ChatMessagesData) => void): void {
    if (!this.socket) return;
    this.socket.off("chatMessages");
    this.socket.on("chatMessages", callback);
  }

  onMessageBlocked(callback: (data: MessageBlockedData) => void): void {
    if (!this.socket) return;
    this.socket.off("messageBlocked");
    this.socket.on("messageBlocked", callback);
  }

  onMessageSent(callback: (data: MessageSentData) => void): void {
    if (!this.socket) return;
    this.socket.off("messageSent");
    this.socket.on("messageSent", callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.off("chatMessages");
      this.socket.off("messageBlocked");
      this.socket.off("messageSent");
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
export type { ChatMessagesData, ChatRecord, MessageBlockedData, MessageSentData };
