import { useState } from "react"

export default function CreateTicket({ onTiersChange }) {
    const [tiers, setTiers] = useState([])
    const [tierName, setTierName] = useState("")
    const [tierPrice, setTierPrice] = useState("")
    const [tierMaxSupply, setTierMaxSupply] = useState("")
    
    const handleAddTier = (e) => {
        e.preventDefault()

        const newTier = {
            name: tierName,
            price: tierPrice,
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
        <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Ticket Tiers</h1>

            <form onSubmit={handleAddTier} className="flex flex-col gap-5 border-b pb-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierName" className="font-medium text-gray-700 text-sm">
                            Tier Name
                        </label>
                        <input 
                            id="tierName" 
                            type="text" 
                            value={tierName} 
                            onChange={(e) => setTierName(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., VIP, Regular"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierPrice" className="font-medium text-gray-700 text-sm">
                            Price (in ETH)
                        </label>
                        <input 
                            id="tierPrice" 
                            type="number"
                            step="0.001"
                            min="0"
                            value={tierPrice} 
                            onChange={(e) => setTierPrice(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 0.1"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tierMaxSupply" className="font-medium text-gray-700 text-sm">
                            Max Supply
                        </label>
                        <input 
                            id="tierMaxSupply" 
                            type="number"
                            min="0"
                            value={tierMaxSupply} 
                            onChange={(e) => setTierMaxSupply(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 100"
                        />
                    </div>
                </div>
                
                <button 
                    type="submit"
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition w-full md:w-auto self-end"
                >
                    Add Tier
                </button>
            </form>

            <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Added Tiers</h2>
                {tiers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tiers added yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {tiers.map((tier, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border">
                                <div>
                                    <span className="font-bold text-gray-800">{tier.name}</span>
                                    <span className="text-gray-600 text-sm ml-4">{tier.price} ETH</span>
                                    <span className="text-gray-600 text-sm ml-4">({tier.maxSupply} tickets)</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveTier(index)}
                                    className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}