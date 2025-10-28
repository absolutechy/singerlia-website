import React, { useEffect, type PropsWithChildren } from "react";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  panelClassName?: string;
  backdropClassName?: string;
  containerClassName?: string;
}>;

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  panelClassName = "",
  backdropClassName = "",
  containerClassName = "",
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${containerClassName}`}>
      <div
        className={`absolute inset-0 bg-black/60 ${backdropClassName}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-white rounded-3xl shadow-xl border border-black/10 w-full ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

