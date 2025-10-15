
export default function ScannedTickets({ scannedTickets }) {
    return(
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {scannedTickets.map((ticket, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-mono font-bold text-green-900">#{ticket.tokenId}</span>
                        <span className="text-xs text-green-700">{ticket.timestamp}</span>
                    </div>
                    <div className="text-sm space-y-1">
                        <p className="text-gray-700"><span className="font-semibold">Tier:</span> {ticket.tier}</p>
                        <p className="text-gray-700"><span className="font-semibold">Name:</span> {ticket.buyerName}</p>
                        {ticket.seatNumber !== "N/A" && (
                            <p className="text-gray-700"><span className="font-semibold">Seat:</span> {ticket.seatNumber}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}