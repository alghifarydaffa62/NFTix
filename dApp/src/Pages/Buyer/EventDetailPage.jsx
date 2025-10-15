import EventFactoryABI from "../../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import TicketNFTABI from "../../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Contract, BrowserProvider, formatEther } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import BuyTicketModal from "../../Component/EventDetailPage/BuyTicketModal"
import EventDetails from "../../Component/EventDetailPage/EventDetails"
import TicketTiers from "../../Component/EventDetailPage/TicketTiers"

export default function EventDetailPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const { isConnected } = useAppKitAccount()

    const [event, setEvent] = useState(null)
    const [tiers, setTiers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [selectedTier, setSelectedTier] = useState(null)

    useEffect(() => {
        fetchEventDetails()
    }, [eventId])

    const fetchEventDetails = async () => {
        try {
            setLoading(true)
            setError("")

            if (!window.ethereum) {
                throw new Error("MetaMask not installed")
            }

            const provider = new BrowserProvider(window.ethereum)
            const factoryAddress = import.meta.env.VITE_EVENTFACTORY

            const factory = new Contract(
                factoryAddress,
                EventFactoryABI.abi,
                provider
            )

            const allEvents = await factory.getAllEvents()
            const eventData = allEvents.find(e => e.id.toString() === eventId)

            setEvent(eventData)

            if (eventData.ticketContract === "0x0000000000000000000000000000000000000000") {
                setTiers([]); 
            } else {
                const ticketContract = new Contract(eventData.ticketContract, TicketNFTABI.abi, provider);
                const tiersData = await ticketContract.getAllTiers();

                const formattedTiers = tiersData.map(tier => ({
                    name: tier.name,
                    price: tier.price, 
                    priceInEth: formatEther(tier.price), 
                    maxSupply: Number(tier.maxSupply),
                    sold: Number(tier.sold)
                }));
                
                setTiers(formattedTiers);
            }
        } catch(err) {
            setError(err.message || "Failed to load event details")
        } finally {
            setLoading(false)
        }
    }

    const handleBuyTicket = (tier, tierIndex) => {
        if(!isConnected) {
            navigate("/connect")
            return
        }

        setSelectedTier({...tier, tierIndex})
        setShowBuyModal(true)
    }

    const handleBuySuccess = () => {
        setShowBuyModal(false)
        fetchEventDetails() 
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
                    <h3 className="font-bold mb-2">Error</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    if (!event) return null

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="cursor-pointer mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <EventDetails event={event}/>
                    <TicketTiers tiers={tiers} event={event} onBuyTicket={handleBuyTicket}/>
                </div>
            </div>

            {/* Buy Ticket Modal */}
            {showBuyModal && selectedTier && (
                <BuyTicketModal
                    event={event}
                    tier={selectedTier}
                    onClose={() => setShowBuyModal(false)}
                    onSuccess={handleBuySuccess}
                />
            )}
        </div>
    )
}