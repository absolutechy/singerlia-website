import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import { X } from "lucide-react";
import { Button } from "@/components/common";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
};

const MessageModal: React.FC<Props> = ({ open, onClose, name }) => {
  const [messageText, setMessageText] = useState("");

  return (
    <Modal open={open} onClose={onClose} panelClassName="max-w-2xl w-full p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#1C1C1C]">Write a message to {name}</h3>
          <p className="text-sm text-[#6F5D9E] mt-1">
            You can also add booking details for them to review.
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
          <X size={16} />
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-[#1C1C1C]">Write message</label>
        <div className="mt-2 rounded-2xl border border-[#E7DEFF] bg-white p-1 shadow-sm">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            // onChange={(e) => setMessageText(e.target.value.slice(0, 100))}
            placeholder={
              'Example" Hi! I\'m planning a my birthday and was wondering if you\'re available the weekend of January 01 for 200 people ready to experience your singing.'
            }
            className="w-full min-h-40 resize-none rounded-2xl px-4 py-3 outline-none text-sm text-[#1C1C1C] placeholder:text-[#A1A1A1]"
          />
        </div>
        <div className="mt-1 text-right text-xs text-[#6F5D9E]">
          {messageText.length} out of 100 required characters
        </div>
      </div>

      <div className="mt-6">
        <Button variant="primary" className="w-full" disabled={messageText.length < 100}>
          Send message
        </Button>
      </div>
    </Modal>
  );
};

export default MessageModal;

