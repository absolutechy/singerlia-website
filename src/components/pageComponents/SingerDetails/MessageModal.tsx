import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Modal from "@/components/common/Modal";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common";
import { toast } from "sonner";
import authService from "@/api/services/authService";
import socketService from "@/services/socketService";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  singerId: string;
};

// A customer can have at most one message to a singer awaiting a reply at a time — this is a
// first-contact inquiry channel (e.g. "Do you sing at weddings?"), not an open chat, so it's
// throttled to prevent spam while still allowing a real follow-up once the singer responds.
// Enforced server-side too (see sockitInit.js's enforceReplyGate) — this client-side check just
// renders the right state, it isn't the actual gate.
type ModalStatus = "checking" | "not_authenticated" | "awaiting_reply" | "composing";

const MessageModal: React.FC<Props> = ({ open, onClose, name, singerId }) => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<ModalStatus>("checking");

  // Check, each time the modal opens, whether this customer already has an unanswered message
  // to this singer — determines whether to show the composer or the "awaiting reply" state.
  useEffect(() => {
    if (!open) return;

    if (!authService.isAuthenticated()) {
      setStatus("not_authenticated");
      return;
    }

    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (!currentUser?.userId || !token) {
      setStatus("not_authenticated");
      return;
    }

    setStatus("checking");
    const chatKey = [currentUser.userId, singerId].sort().join("_");
    const socket = socketService.connect(token);

    const checkStatus = () => {
      socketService.onChatMessages((data) => {
        if (data.chatKey !== chatKey) return;
        const chat = Array.isArray(data.chat) ? null : data.chat;
        const lastMessage = chat?.messages[chat.messages.length - 1];
        setStatus(lastMessage?.sender === currentUser.userId ? "awaiting_reply" : "composing");
      });
      socketService.getChatMessages(chatKey);
    };

    if (socket.connected) {
      checkStatus();
    } else {
      socket.once("connect", checkStatus);
    }

    return () => {
      socketService.disconnect();
    };
  }, [open, singerId]);

  const handleClose = () => {
    if (sending) return;
    setMessageText("");
    onClose();
  };

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed || status !== "composing") return;

    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (!authService.isAuthenticated() || !currentUser?.userId || !token) {
      setStatus("not_authenticated");
      return;
    }

    setSending(true);
    try {
      const socket = socketService.connect(token);
      const chatKey = [currentUser.userId, singerId].sort().join("_");

      socketService.onMessageSent(() => {
        setSending(false);
        setMessageText("");
        toast.success("Message sent!");
        onClose();
      });
      socketService.onMessageBlocked(() => {
        setSending(false);
        setStatus("awaiting_reply");
        toast.error("You already have a message awaiting a reply from this singer.");
      });

      const emitSend = () =>
        socketService.sendMessage(currentUser.userId, singerId, trimmed, chatKey, true);

      if (socket.connected) {
        emitSend();
      } else {
        socket.once("connect", emitSend);
        socket.once("connect_error", () => {
          setSending(false);
          toast.error("Failed to send message. Please try again.");
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setSending(false);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} panelClassName="max-w-2xl w-full p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#1C1C1C]">Write a message to {name}</h3>
          <p className="text-sm text-[#6F5D9E] mt-1">
            You can also add booking details for them to review.
          </p>
        </div>
        <button onClick={handleClose} aria-label="Close" className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
          <X size={16} />
        </button>
      </div>

      {status === "checking" && (
        <div className="mt-6 flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {status === "not_authenticated" && (
        <div className="mt-6 rounded-2xl border border-[#E7DEFF] bg-[#F9F7FF] p-6 text-center">
          <p className="text-sm text-[#1C1C1C]">Please log in to send a message to {name}.</p>
          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => navigate("/auth/login")}
          >
            Log in
          </Button>
        </div>
      )}

      {status === "awaiting_reply" && (
        <div className="mt-6 rounded-2xl border border-[#E7DEFF] bg-[#F9F7FF] p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1C1C1C]">Message sent</p>
          <p className="text-sm text-[#6F5D9E] mt-1">
            You've already sent {name} a message. We'll let you know here once they reply — you
            can send another message after that.
          </p>
          <Button variant="primary" className="w-full mt-4" disabled>
            Awaiting reply
          </Button>
        </div>
      )}

      {status === "composing" && (
        <>
          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#1C1C1C]">Write message</label>
            <div className="mt-2 rounded-2xl border border-[#E7DEFF] bg-white p-1 shadow-sm">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                maxLength={100}
                disabled={sending}
                placeholder={
                  'Example" Hi! I\'m planning a my birthday and was wondering if you\'re available the weekend of January 01 for 200 people ready to experience your singing.'
                }
                className="w-full min-h-40 resize-none rounded-2xl px-4 py-3 outline-none text-sm text-[#1C1C1C] placeholder:text-[#A1A1A1]"
              />
            </div>
            <div className="mt-1 text-right text-xs text-[#6F5D9E]">
              {messageText.length} / 100 characters
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              className="w-full gap-2"
              disabled={messageText.trim().length === 0 || sending}
              onClick={handleSend}
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              {sending ? "Sending..." : "Send message"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default MessageModal;
