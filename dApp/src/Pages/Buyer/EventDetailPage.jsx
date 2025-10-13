import EventFactoryABI from "../../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import TicketNFTABI from "../../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Contract, BrowserProvider, formatEther } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import BuyTicketModal from "../../Component/BuyTicketModal"

export default function EventDetailPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const { isConnected, address } = useAppKitAccount()

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

    const eventDate = new Date(Number(event.date) * 1000)
    const deadline = new Date(Number(event.deadline) * 1000)
    const isEventPassed = eventDate < new Date()
    const isDeadlinePassed = deadline < new Date()

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
                    {/* Left: Event Details */}
                    <div className="lg:col-span-2">
                        {/* Event Image */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                            <img 
                                src={event.imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                alt={event.name}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/1200x600?text=Event+Image"
                                }}
                            />
                        </div>

                        {/* Event Info */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {event.name}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Date */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Event Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {eventDate.toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {eventDate.toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Venue</p>
                                        <p className="font-semibold text-gray-900">{event.venue}</p>
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Registration Deadline</p>
                                        <p className="font-semibold text-gray-900">
                                            {deadline.toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Max Participants</p>
                                        <p className="font-semibold text-gray-900">
                                            {event.maxParticipant.toString()} people
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{event.desc}</p>
                            </div>

                            {/* Status Badges */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {event.active ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        Inactive
                                    </span>
                                )}
                                
                                {isDeadlinePassed && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Registration Closed
                                    </span>
                                )}
                                
                                {isEventPassed && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        Event Ended
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Organizer Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Organizer</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {event.organizer.slice(2, 4).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-mono text-sm text-gray-600">
                                        {event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}
                                    </p>
                                    <a 
                                        href={`https://etherscan.io/address/${event.organizer}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View on Explorer →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Ticket Tiers */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Available Tickets
                            </h2>

                            {tiers.length === 0 ? (
                                <p className="text-gray-600">No tickets available</p>
                            ) : (
                                <div className="space-y-4">
                                    {tiers.map((tier, index) => {
                                        const available = Number(tier.maxSupply) - Number(tier.sold)
                                        const isSoldOut = available === 0
                                        const canBuy = event.active && !isDeadlinePassed && !isEventPassed && !isSoldOut

                                        return (
                                            <div 
                                                key={index}
                                                className={`border rounded-lg p-4 ${
                                                    isSoldOut ? 'bg-gray-50 border-gray-300' : 'border-blue-200 hover:border-blue-400 transition'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {tier.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {available} / {tier.maxSupply.toString()} available
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {(Number(tier.price) / 1e18)} ETH
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${
                                                                isSoldOut ? 'bg-gray-400' : 'bg-blue-600'
                                                            }`}
                                                            style={{ 
                                                                width: `${(Number(tier.sold) / Number(tier.maxSupply)) * 100}%` 
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Buy Button */}
                                                <button
                                                    onClick={() => handleBuyTicket(tier, index)}
                                                    disabled={!canBuy}
                                                    className={`cursor-pointer w-full py-2 px-4 rounded-md font-semibold transition ${
                                                        canBuy
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isSoldOut ? 'Sold Out' :
                                                     !event.active ? 'Event Inactive' :
                                                     isDeadlinePassed ? 'Registration Closed' :
                                                     isEventPassed ? 'Event Ended' :
                                                     'Buy Ticket'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Anti-Scalping Info */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
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