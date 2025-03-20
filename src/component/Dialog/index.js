import React from 'react';

const Dialog = ({isOpen, onClose, title, children, hideCloseButton = false}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-auto overflow-auto max-h-screen">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                {!hideCloseButton && < div className="flex justify-end">
                    <button
                        className='bg-black px-5 py-2 text-white rounded'
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default Dialog;
