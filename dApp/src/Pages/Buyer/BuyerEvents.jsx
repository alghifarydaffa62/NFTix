import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../Component/Sidebar";

export default function BuyerEvents() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)
    const [tickets, setTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showQRModal, setShowQRModal] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isChecking && !isConnected) {
            navigate("/connect")
        }
    }, [isChecking, isConnected, navigate])

    const loadTickets = () => {
        const storedTickets = JSON.parse(localStorage.getItem('myTickets') || '[]')

        const userTickets = storedTickets.filter(ticket => 
            ticket.contractAddress && address
        )
        
        setTickets(userTickets)
    }

    const handleShowQR = (ticket) => {
        setSelectedTicket(ticket)
        setShowQRModal(true)
    }

    return(
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar/>
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Tickets</h1>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Tickets Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't purchased any tickets yet.</p>
                        <button
                            onClick={() => navigate("/buyer")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">{ticket.eventName}</h3>
                                    <p className="text-sm opacity-90">{ticket.venue}</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Ticket Type</span>
                                            <span className="font-semibold text-gray-900">{ticket.tier}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Token ID</span>
                                            <span className="font-mono font-semibold text-gray-900">#{ticket.tokenId}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Status</span>
                                            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Valid
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleShowQR(ticket)}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        View QR Code
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showQRModal && selectedTicket && (
                <div 
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowQRModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Ticket QR Code</h3>
                            <p className="text-gray-600 text-sm">{selectedTicket.eventName}</p>
                            <p className="text-gray-500 text-xs mt-1">Token ID: #{selectedTicket.tokenId}</p>
                        </div>

                        {/* QR Code Display */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <img 
                                src={selectedTicket.qrCode} 
                                alt="Ticket QR Code"
                                className="w-full h-auto mx-auto"
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-800 text-sm text-center">
                                ⚠️ Show this QR code at the venue entrance for verification
                            </p>
                        </div>

                        <button
                            onClick={() => setShowQRModal(false)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            </main>
        </div>
    )
}