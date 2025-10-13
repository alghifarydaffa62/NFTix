
const TierCard = ({ tier, index, onBuyTicket, canBuy, isSoldOut }) => {
    const available = tier.maxSupply - tier.sold;

    return (
        <div className={`border rounded-lg p-4 ${isSoldOut ? 'bg-gray-50 border-gray-300' : 'border-blue-200 hover:border-blue-400 transition'}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-600">{available} / {tier.maxSupply} available</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{tier.priceInEth} ETH</p>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                    className={`h-2 rounded-full ${isSoldOut ? 'bg-gray-400' : 'bg-blue-600'}`}
                    style={{ width: `${(tier.sold / tier.maxSupply) * 100}%` }}
                ></div>
            </div>

            <button
                onClick={() => onBuyTicket(tier, index)}
                disabled={!canBuy}
                className={`w-full py-2 px-4 rounded-md font-semibold transition ${canBuy ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                {isSoldOut ? 'Sold Out' : (canBuy ? 'Buy Ticket' : 'Sale Ended')}
            </button>
        </div>
    );
};

export default TierCard