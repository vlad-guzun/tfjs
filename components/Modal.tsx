// Modal.tsx
import React from "react";

const Modal = ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black border border-white p-6 rounded-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default Modal;
