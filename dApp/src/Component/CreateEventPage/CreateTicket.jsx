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
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
                </svg>
                <h1 className="text-lg sm:text-xl font-bold text-[hsla(179,64%,26%,1)]">
                    Ticket Tiers <span className="text-red-500">*</span>
                </h1>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Add at least one ticket tier. You can create multiple tiers with different prices and quantities.
            </p>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {error}
                </div>
            )}

            {/* Form Section */}
            <form
                onSubmit={handleAddTier}
                className="flex flex-col gap-4 border-b pb-6 mb-6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 0.1"
                            disabled={disabled}
                            required
                        />
                    </div>

                    {/* Max Supply */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="tierMaxSupply"
                            className="font-medium text-gray-700 text-sm"
                        >
                        Max Supply <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="tierMaxSupply"
                            type="number"
                            min="1"
                            value={tierMaxSupply}
                            onChange={(e) => setTierMaxSupply(e.target.value)}
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 100"
                            disabled={disabled}
                            required
                        />
                    </div>
                </div>

                {/* Add Tier Button */}
                <button
                    type="submit"
                    className={`font-semibold py-2 px-4 rounded-md transition w-full sm:w-auto self-end ${
                        disabled
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
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
                    <svg
                        className="w-12 h-12 mx-auto text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                    </svg>
                    <p className="text-gray-500 font-medium">No tiers added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add your first tier above to get started
                    </p>
                </div>
                ) : (
                <ul className="space-y-3">
                    {tiers.map((tier, index) => (
                    <li
                        key={index}
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-md border hover:shadow-sm transition"
                    >
                        {/* Tier Info */}
                        <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-800 text-base sm:text-lg">
                            {tier.name}
                            </span>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                            Tier {index + 1}
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                            💰 <strong>{tier.price}</strong> ETH
                            </span>
                            <span className="flex items-center gap-1">
                            🎟 <strong>{tier.maxSupply}</strong> tickets
                            </span>
                            <span className="text-gray-500">
                            Total: <strong>{(tier.price * tier.maxSupply)}</strong> ETH
                            </span>
                        </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveTier(index)}
                            disabled={disabled}
                            className={`text-xs font-bold py-2 px-3 rounded transition flex items-center justify-center gap-1 w-full sm:w-auto ${
                                disabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            🗑 Remove
                        </button>
                    </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    )
}