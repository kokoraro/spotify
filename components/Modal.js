// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00200086]" onClick={handleBackdropClick}>
            <div className="bg-black border border-slate-800 p-5 rounded-md shadow-lg relative">
                {children}
            </div>
        </div>
    );
};

export default Modal;