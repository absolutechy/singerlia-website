import React, { useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import {
  Copy,
  Facebook,
  Mail,
  MessageCircle,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
const WhatsApp = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.9852 16.9453C18.696 17.764 17.5464 18.4412 16.6296 18.6393C16.002 18.7725 15.1836 18.8779 12.426 17.7352C9.3288 16.452 5.028 11.8812 5.028 8.83945C5.028 7.29099 5.9208 5.48789 7.482 5.48789C8.2332 5.48789 8.3988 5.50254 8.646 6.09551C8.9352 6.79412 9.64081 8.51535 9.7248 8.6918C10.0716 9.41561 9.37199 9.83934 8.86439 10.4695C8.70239 10.6592 8.51881 10.8643 8.72401 11.2172C8.92801 11.5629 9.6336 12.7129 10.6704 13.6359C12.0096 14.8291 13.0956 15.21 13.4844 15.3721C13.7736 15.4921 14.1192 15.4641 14.3304 15.2385C14.598 14.9492 14.9304 14.4692 15.2688 13.9963C15.5076 13.6578 15.8112 13.6155 16.1292 13.7355C16.344 13.81 19.074 15.0778 19.1892 15.2807C19.2744 15.4283 19.2744 16.1267 18.9852 16.9453ZM12.0024 0H11.9964C5.38079 0 0 5.38242 0 12C0 14.624 0.846008 17.0584 2.28481 19.033L0.789606 23.492L5.40121 22.0184C7.29841 23.2739 9.5628 24 12.0024 24C18.618 24 24 18.6176 24 12C24 5.38242 18.618 0 12.0024 0Z"
        fill="black"
      />
    </svg>
  );
};

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  profileUrl?: string;
};

const ShareModal: React.FC<Props> = ({ open, onClose, name, profileUrl }) => {
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => profileUrl || window.location.href, [profileUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const ActionBtn: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-[#000] bg-white px-4 py-3 text-[#1C1C1C] shadow-sm hover:bg-gray-50"
    >
      {icon}
      <span className="font-medium text-base">{label}</span>
    </button>
  );

  return (
    <Modal open={open} onClose={onClose} panelClassName="max-w-2xl w-full p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-xl font-bold text-[#2E1B4D]">
          Share this experience
        </h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6">
        {/* Purple profile banner */}
        <div className="rounded-xl bg-[#2E1B4D] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={singer1}
              alt={name}
              className="h-24 w-24 rounded-lg object-cover"
            />
            <div className="font-semibold">{name}</div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span>5.0</span>
            <span>Reviews</span>
            <a className="underline" href="#">
              3 reviews
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <ActionBtn
              icon={<Copy size={18} />}
              label="Copy link"
              onClick={handleCopy}
            />
            {copied && (
              <div className="absolute -top-9 left-3 rounded-lg bg-white text-[#1C1C1C] px-3 py-1 shadow flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Link Copied
              </div>
            )}
          </div>
          <ActionBtn icon={<Mail size={18} />} label="Email" />
          <ActionBtn icon={<WhatsApp />} label="WhatsApp" />
          <ActionBtn icon={<Facebook size={18} />} label="Facebook" />
          <ActionBtn icon={<MessageSquare size={18} />} label="Messages" />
          <ActionBtn icon={<MessageCircle size={18} />} label="Messenger" />
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
