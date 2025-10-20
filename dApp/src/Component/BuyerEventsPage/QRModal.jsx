export default function QRModal({ showQRModal, selectedTicket, setShowQRModal }) {
    if (!showQRModal || !selectedTicket) return null

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRModal(false)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Ticket QR Code</h3>
                            <p className="text-gray-600 text-sm line-clamp-1">{selectedTicket.eventName}</p>
                            <p className="text-gray-500 text-xs mt-1">Token ID: #{selectedTicket.tokenId}</p>
                        </div>

                        <button
                            onClick={() => setShowQRModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition ml-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6">
                    {selectedTicket.qrCode ? (
                        <>
                            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-center">
                                <div className="max-w-xs w-full">
                                    <img 
                                        src={selectedTicket.qrCode} 
                                        alt="Ticket QR Code"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Ticket Information
                                </h4>
                                <div className="space-y-2 text-sm text-blue-800">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Tier:</span>
                                        <span className="font-semibold">{selectedTicket.tier}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Venue:</span>
                                        <span className="font-semibold line-clamp-1">{selectedTicket.venue}</span>
                                    </div>
                                    {selectedTicket.seatNumber && selectedTicket.seatNumber !== "N/A" && (
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Seat:</span>
                                            <span className="font-semibold">{selectedTicket.seatNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-semibold text-yellow-900 text-sm mb-1">At the Venue</p>
                                        <p className="text-yellow-800 text-xs">
                                            Show this QR code to staff at the entrance. Keep your phone screen brightness high for easy scanning.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-900 text-sm mb-1">Check-in Window</p>
                                        <p className="text-green-800 text-xs">
                                            Available from <strong>4 hours before</strong> until <strong>4 hours after</strong> event starts
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-red-900 mb-2">QR Code Not Available</p>
                            <p className="text-red-700 text-sm">
                                Failed to generate QR code. Please try refreshing the page or contact support.
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                    <button
                        onClick={() => setShowQRModal(false)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}