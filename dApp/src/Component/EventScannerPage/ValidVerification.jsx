
export default function ValidVerification({ verificationResult, onScanAgain }) {
    return(
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-green-900">VALID TICKET</h3>
                    <p className="text-green-700">Entry Approved ✅</p>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Token ID:</span>
                    <span className="font-mono font-bold text-gray-900">#{verificationResult.tokenId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tier:</span>
                    <span className="font-semibold text-gray-900">{verificationResult.tier}</span>
                </div>
                {verificationResult.seatNumber !== "N/A" && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Seat:</span>
                        <span className="font-semibold text-gray-900">{verificationResult.seatNumber}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-gray-600">Wallet</span>
                    <span className="font-semibold text-gray-900">{verificationResult.owner}</span>
                </div>
            </div>

            <button
                onClick={onScanAgain}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
            >
                Scan Next Ticket
            </button>
        </div>
    )
}