import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount} from "@reown/appkit/react"
import SidebarOrganizer from "../Component/SidebarOrganizer";
import fetchOrganizerStats from "../Utils/fetchOrganizerStats";
import total from "../assets/total.png"
import organizer from "../assets/Organizer.png"

export default function OrganizerPage() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [stats, setStats] = useState({
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenueETH: "0"
    })
    const [isLoadingStats, setIsLoadingStats] = useState(true)
    const [statsError, setStatsError] = useState("")
    
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
            loadStats()
        }
    }, [isConnected, address, isChecking])

    const loadStats = async () => {
        if (!address) return

        setIsLoadingStats(true)
        setStatsError("")

        try {
            const result = await fetchOrganizerStats(address)

            if (result.success) {
                setStats({
                    totalEvents: result.stats.totalEvents,
                    totalTicketsSold: result.stats.totalTicketsSold,
                    totalRevenueETH: result.stats.totalRevenueETH
                })

            } else {
                console.error("❌ Failed to load stats:", result.error)
                setStatsError(result.error)
            }
        } catch (error) {
            console.error("❌ Exception loading stats:", error)
            setStatsError(error.message || "Failed to load statistics")
        } finally {
            setIsLoadingStats(false)
        }
    }

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return(
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed z-40 inset-y-0 left-0 transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
            >
                <SidebarOrganizer />
            </div>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-opacity-40 z-30 md:hidden"
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))] flex items-center gap-4 p-4 text-white">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden text-white focus:outline-none"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="p-3 bg-[hsla(0,0%,100%,0.5)] rounded-full">
                        <img src={organizer} alt="" className="w-6"/>
                    </div>
                
                    <h1>Connected: <span className="text-blue-200">{address?.slice(0, 8)}...{address?.slice(-8)}</span></h1>

                    <div className="w-7 h-7 md:hidden"></div>
                </div>

                {/* Dashboard content */}
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-[hsla(179,64%,26%,1)] font-bold tracking-wider text-3xl">
                                DASHBOARD
                            </h1>
                            <h2 className="text-gray-500 font-semibold text-lg mt-1">
                                Welcome Back, Organizer!
                            </h2>
                        </div>

                        <button
                            onClick={loadStats}
                            disabled={isLoadingStats}
                            className="flex items-center gap-2 bg-[hsla(182,67%,25%,1)] text-white px-4 py-2 rounded-lg hover:bg-[hsla(182,67%,20%,1)] transition disabled:opacity-50"
                        >
                            <svg className={`w-5 h-5 ${isLoadingStats ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isLoadingStats ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {statsError && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-800 text-sm">{statsError}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Total Events */}
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <img src={total} alt="Total Events" className="w-8 h-8" />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-sm font-semibold text-gray-600">Total Events</h1>
                                {isLoadingStats ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsla(182,67%,25%,1)]"></div>
                                        <p className="text-sm text-gray-500">Loading...</p>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold mt-1">{stats.totalEvents}</p>
                                )}
                            </div>
                        </div>

                        {/* Total Tickets Sold */}
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-sm font-semibold text-gray-600">Tickets Sold</h1>
                                {isLoadingStats ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsla(182,67%,25%,1)]"></div>
                                        <p className="text-sm text-gray-500">Loading...</p>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold mt-1">{stats.totalTicketsSold}</p>
                                )}
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-sm font-semibold text-gray-600">Total Revenue</h1>
                                {isLoadingStats ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsla(182,67%,25%,1)]"></div>
                                        <p className="text-sm text-gray-500">Loading...</p>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold mt-1">
                                        {parseFloat(stats.totalRevenueETH).toFixed(4)} ETH
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Create New Event */}
                        <div
                            onClick={() => navigate("/organizer/create")}
                            className="cursor-pointer flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md hover:shadow-lg transition hover:scale-105"
                        >
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>

                            <div>
                                <h1 className="text-base">Create New Event</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}