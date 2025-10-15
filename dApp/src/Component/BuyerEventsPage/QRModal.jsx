
export default function QRModal({ showQRModal, selectedTicket, setShowQRModal }) {
    return(
        <div>
        {showQRModal && selectedTicket && (
                <div 
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowQRModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Ticket QR Code</h3>
                            <p className="text-gray-600 text-sm">{selectedTicket.eventName}</p>
                            <p className="text-gray-500 text-xs mt-1">Token ID: #{selectedTicket.tokenId}</p>
                        </div>

                        {selectedTicket.qrCode ? (
                            <>
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <img 
                                        src={selectedTicket.qrCode} 
                                        alt="Ticket QR Code"
                                        className="w-full h-auto mx-auto"
                                    />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <p className="text-yellow-800 text-sm text-center">
                                        ⚠️ Show this QR code at the venue entrance for verification
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm text-center">
                                    QR code not available. Please try again.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setShowQRModal(false)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}