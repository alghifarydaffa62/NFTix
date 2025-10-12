import { useState } from "react"

export default function CreateTicket({ onTiersChange, disabled = false }) {
    const [tiers, setTiers] = useState([])
    const [tierName, setTierName] = useState("")
    const [tierPrice, setTierPrice] = useState("")
    const [tierMaxSupply, setTierMaxSupply] = useState("")
    const [error, setError] = useState("")
    
    const handleAddTier = (e) => {
        e.preventDefault()

        if (!tierName.trim()) {
            setError("Tier name is required")
            return
        }

        if (!tierPrice || parseFloat(tierPrice) <= 0) {
            setError("Tier price must be greater than 0")
            return
        }

        if (!tierMaxSupply || parseInt(tierMaxSupply) <= 0) {
            setError("Max supply must be greater than 0")
            return
        }

        if (tiers.some(t => t.name.toLowerCase() === tierName.trim().toLowerCase())) {
            setError("Tier name already exists")
            return
        }

        const newTier = {
            name: tierName.trim(),
            price: parseFloat(tierPrice),
            maxSupply: parseInt(tierMaxSupply, 10)
        }

        const updatedTiers = [...tiers, newTier]
        setTiers(updatedTiers)

        onTiersChange(updatedTiers)

        setTierName("");
        setTierPrice("");
        setTierMaxSupply("");
    }

    const handleRemoveTier = (indexRemove) => {
        const updatedTiers = tiers.filter((_, index) => index !== indexRemove)
        setTiers(updatedTiers)

        onTiersChange(updatedTiers)
    }

    return(
        <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <h1 className="text-xl font-bold text-gray-800">
                    Ticket Tiers <span className="text-red-500">*</span>
                </h1>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Add at least one ticket tier. You can create multiple tiers with different prices and quantities.
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleAddTier} className="flex flex-col gap-4 border-b pb-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tier Name */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierName" className="font-medium text-gray-700 text-sm">
                            Tier Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="tierName" 
                            type="text" 
                            value={tierName} 
                            onChange={(e) => setTierName(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., VIP, Regular"
                            disabled={disabled}
                            required
                        />
                    </div>

                    {/* Tier Price */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierPrice" className="font-medium text-gray-700 text-sm">
                            Price (in ETH) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="tierPrice" 
                            type="number"
                            step="0.001"
                            min="0.001"
                            value={tierPrice} 
                            onChange={(e) => setTierPrice(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 0.1"
                            disabled={disabled}
                            required
                        />
                    </div>

                    {/* Max Supply */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierMaxSupply" className="font-medium text-gray-700 text-sm">
                            Max Supply <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="tierMaxSupply" 
                            type="number"
                            min="1"
                            value={tierMaxSupply} 
                            onChange={(e) => setTierMaxSupply(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 100"
                            disabled={disabled}
                            required
                        />
                    </div>
                </div>
                
                <button 
                    type="submit"
                    onClick={handleAddTier}
                    className={`font-semibold py-2 px-4 rounded-md transition w-full md:w-auto self-end ${
                        disabled
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    + Add Tier
                </button>
            </form>

            {/* Tier List */}
            <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                    Added Tiers ({tiers.length})
                </h2>
                {tiers.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-md border border-dashed border-gray-300">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No tiers added yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add your first tier above to get started</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {tiers.map((tier, index) => (
                            <li 
                                key={index} 
                                className="flex justify-between items-center bg-white p-4 rounded-md border hover:shadow-sm transition"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-800 text-lg">
                                            {tier.name}
                                        </span>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                            Tier {index + 1}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                            </svg>
                                            <strong>{tier.price}</strong> ETH
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                            </svg>
                                            <strong>{tier.maxSupply}</strong> tickets
                                        </span>
                                        <span className="text-gray-500">
                                            Total: <strong>{(tier.price * tier.maxSupply).toFixed(3)}</strong> ETH
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveTier(index)}
                                    disabled={disabled}
                                    className={`text-xs font-bold py-2 px-3 rounded transition flex items-center gap-1 ${
                                        disabled
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Total Summary */}
                {tiers.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            Tiers Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-blue-700 font-medium mb-1">Total Tiers</p>
                                <p className="text-2xl font-bold text-blue-900">{tiers.length}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-blue-700 font-medium mb-1">Total Tickets</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {tiers.reduce((sum, t) => sum + t.maxSupply, 0)}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-blue-700 font-medium mb-1">Price Range</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {Math.min(...tiers.map(t => t.price)).toFixed(3)} - {Math.max(...tiers.map(t => t.price)).toFixed(3)} ETH
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-blue-700 font-medium mb-1">Max Revenue</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {tiers.reduce((sum, t) => sum + (t.price * t.maxSupply), 0).toFixed(3)} ETH
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}