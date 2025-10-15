const formatEventDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function TicketBox({ ticket, onShowQR, generatingQR, selectedTicket }) {
    const eventDate = new Date(Number(ticket.eventDate) * 1000);
    const isUpcoming = eventDate > new Date();

    return (
        <div key={`${ticket.contractAddress}-${ticket.tokenId}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{ticket.eventName}</h3>
                <p className="text-sm opacity-90">{ticket.venue}</p>
                <p className="text-xs opacity-75 mt-2">
                📅 {formatEventDate(ticket.eventDate)}
                </p>
            </div>
            <div className="p-6">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ticket Type</span>
                        <span className="font-semibold text-gray-900">{ticket.tier}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Token ID</span>
                        <span className="font-mono font-semibold text-gray-900">#{ticket.tokenId}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`inline-flex items-center gap-1 font-semibold ${ticket.used ? 'text-gray-400' : isUpcoming ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {ticket.used ? 'Used' : isUpcoming ? 'Active' : 'Expired'}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => onShowQR(ticket)}
                    disabled={!isUpcoming || ticket.used || generatingQR}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isUpcoming && !ticket.used ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    {generatingQR && selectedTicket?.tokenId === ticket.tokenId ? (
                        <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating QR...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            {ticket.used ? 'Ticket Used' : isUpcoming ? 'View QR Code' : 'Event Ended'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}