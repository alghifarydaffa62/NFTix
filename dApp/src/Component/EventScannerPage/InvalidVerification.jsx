
export default function InvalidVerification({ verificationResult, onScanAgain }) {
    return(
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-red-900">INVALID TICKET</h3>
                    <p className="text-red-700">Entry Denied ❌</p>
                </div>
            </div>

            <div className="bg-red-100 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-900 mb-1">Reason:</p>
                <p className="text-red-800">{verificationResult.reason}</p>
            </div>

            <button
                onClick={onScanAgain}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
                Try Again
            </button>
        </div>
    )
}