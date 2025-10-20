export default function TierSalesBreakdown({ tierBreakdown }) {
    if (!tierBreakdown || tierBreakdown.length === 0) {
        return null
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tier Sales Breakdown</h2>

            <div className="space-y-4">
                {tierBreakdown.map((tier, index) => {
                    const soldPercentage = (tier.sold / tier.maxSupply) * 100

                    return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {tier.priceETH} ETH per ticket
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">{tier.sold}</p>
                                    <p className="text-sm text-gray-600">/ {tier.maxSupply} sold</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${soldPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    {soldPercentage.toFixed(1)}% sold
                                </p>
                            </div>

                            {/* Revenue */}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-600">Revenue from this tier:</span>
                                <span className="text-lg font-bold text-green-600">
                                    {parseFloat(tier.revenueETH)} ETH
                                </span>
                            </div>

                            {/* Availability Status */}
                            <div className="mt-2">
                                {tier.available > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {tier.available} tickets available
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        SOLD OUT
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}