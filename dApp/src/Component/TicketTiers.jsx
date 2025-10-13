import TierCard from "./TierCard"

export default function TicketTiers({ tiers, event, onBuyTicket }) {
    const eventDate = new Date(Number(event.date) * 1000);
    const deadline = new Date(Number(event.deadline) * 1000);
    const isEventPassed = eventDate < new Date();
    const isDeadlinePassed = deadline < new Date();

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
                {tiers.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No ticket tiers for this event.</p>
                ) : (
                    <div className="space-y-4">
                        {tiers.map((tier, index) => {
                            const available = tier.maxSupply - tier.sold;
                            const isSoldOut = available === 0;
                            const canBuy = event.active && !isDeadlinePassed && !isEventPassed && !isSoldOut;

                            return (
                                <TierCard 
                                    key={index}
                                    tier={tier}
                                    index={index}
                                    onBuyTicket={onBuyTicket}
                                    canBuy={canBuy}
                                    isSoldOut={isSoldOut}
                                />
                            );
                        })}
                    </div>
                )}
                 <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        Anti-Scalping Protection
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Maximum 3 tickets per wallet</li>
                        <li>• 48-hour transfer lock</li>
                        <li>• Verified on blockchain</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}