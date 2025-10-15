
export default function DeveloperMode({ manualTokenId, setManualTokenId, handleManualVerify }) {
    return(
        <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    🛠️ Developer Mode: Enter Token ID manually for testing
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token ID
                </label>
                <input
                    type="text"
                    value={manualTokenId}
                    onChange={(e) => setManualTokenId(e.target.value)}
                    placeholder="Enter token ID (e.g., 0, 1, 2)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <button
                onClick={handleManualVerify}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Ticket
            </button>
        </div>
    )
}