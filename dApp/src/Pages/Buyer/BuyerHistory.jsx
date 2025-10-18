import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../Component/Sidebar";
import fetchBuyerHistory from "../../Utils/fetchBuyerHistory";
import HistoryCard from "../../Component/HistoryCard";
import organizer from "../../assets/Organizer.png"

export default function BuyerHistory() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isChecking && !isConnected) {
            navigate("/connect")
        }
    }, [isChecking, isConnected, navigate])

    useEffect(() => {
        if (isConnected && address && !isChecking) {
            loadHistory()
        }
    }, [isConnected, address, isChecking])

    const loadHistory = async () => {
        if (!address) return

        setLoading(true)
        setError("")

        try {
            console.log("📜 Loading purchase history...")

            const result = await fetchBuyerHistory(address)

            if (result.success) {
                console.log(`✅ Loaded ${result.history.length} history items`)
                setHistory(result.history)
            } else {
                console.error("❌ Failed to load history:", result.error)
                setError(result.error)
            }
        } catch (error) {
            console.error("❌ Exception loading history:", error)
            setError(error.message || "Failed to load history")
        } finally {
            setLoading(false)
        }
    }

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }
    return(
        <div className="flex h-screen bg-gray-100">
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-[hsla(163,70%,34%,1)] text-white p-2 rounded-md shadow"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
            ☰
            </button>

            {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            <main className="flex-1 overflow-y-scroll">
                {/* Header */}
                <div className="gap-3 bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))] flex items-center px-5 py-3 text-white">
                    <div className="p-3 bg-[hsla(0,0%,100%,0.5)] rounded-full">
                        <img src={organizer} alt="" className="w-6"/>
                    </div>
                
                    <h1>Connected: <span className="text-blue-200">{address?.slice(0, 8)}...{address?.slice(-8)}</span></h1>
                </div>
                
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Purchase History</h1>
                        <p className="text-gray-600 mt-2">All your ticket purchases in one place</p>
                    </div>

                    <button
                        onClick={loadHistory}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-900">Error Loading History</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your purchase history...</p>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Purchase History</h3>
                            <p className="text-gray-500 mb-6">
                                You haven't purchased any tickets yet.
                            </p>
                            <button
                                onClick={() => navigate("/buyer")}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Browse Events
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item, index) => (
                                <HistoryCard key={`${item.contractAddress}-${item.tokenId}`} item={item} />
                            ))}
                        </div>
                    )}
                </div>
                
            </main>
        </div>
    )
}