
export default function HistoryCard({ item }) {
    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPurchaseDate = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden transition ${
            item.isPastEvent ? 'opacity-75' : ''
        }`}>
            {/* Event Image */}
            <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                {item.eventImageURI ? (
                    <img 
                        src={item.eventImageURI.replace("ipfs://", "https://ipfs.io/ipfs/")}
                        alt={item.eventName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    {item.used ? (
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Used
                        </span>
                    ) : item.isPastEvent ? (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Expired
                        </span>
                    ) : (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                        </span>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.eventName}
                </h3>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(item.eventDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{item.venue}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tier</span>
                        <span className="font-semibold text-gray-900">{item.tier}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Token ID</span>
                        <span className="font-mono font-semibold text-gray-900">#{item.tokenId}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price Paid</span>
                        <span className="font-bold text-blue-600">
                            {parseFloat(item.originalPriceETH)} ETH
                        </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Purchased</span>
                        <span className="text-gray-900">{formatPurchaseDate(item.purchaseTimestamp)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}