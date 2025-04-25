import React from 'react';

const Loading = ({ title = "Loading" }) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="loader">
                <div className="spinner"></div>
                <p className="mt-2 text-lg">{title}</p>
            </div>
            <style jsx>{`
                .loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .spinner {
                    border: 8px solid rgba(255, 255, 255, 0.3);
                    border-top: 8px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;