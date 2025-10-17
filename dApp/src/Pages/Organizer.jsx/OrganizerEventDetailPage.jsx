// src/Pages/Organizer/OrganizerEventDetailPage.jsx

import { useAppKitAccount } from "@reown/appkit/react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Contract } from "ethers"
import EventFactoryABI from "../../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import { getReadProvider } from "../../Utils/getProvider"
import fetchEventStats from "../../Utils/fetchEventStats"
import EventHeader from "../../Component/OrganizerEventDetail/EventHeader"
import EventInfo from "../../Component/OrganizerEventDetail/EventInfo"
import EventStats from "../../Component/OrganizerEventDetail/EventStats"
import TierSalesBreakdown from "../../Component/OrganizerEventDetail/TierSalesBreakdown"

export default function OrganizerEventDetailPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const { address, isConnected } = useAppKitAccount()
    
    const [isChecking, setIsChecking] = useState(true)
    const [event, setEvent] = useState(null)
    const [loadingEvent, setLoadingEvent] = useState(true)
    const [eventError, setEventError] = useState("")
    
    const [stats, setStats] = useState(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [statsError, setStatsError] = useState("")

    // Check connection
    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const delay = isMobile ? 3000 : 2000

        const timer = setTimeout(() => {
            setIsChecking(false)
        }, delay)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isChecking && !isConnected) {
            navigate("/connect")
        }
    }, [isChecking, isConnected, navigate])

    // Load event details
    useEffect(() => {
        if (isConnected && address && !isChecking && eventId) {
            loadEventDetails()
        }
    }, [isConnected, address, isChecking, eventId])

    useEffect(() => {
        if (event && !loadingEvent) {
            loadStats()
        }
    }, [event, loadingEvent])

    const loadEventDetails = async () => {
        setLoadingEvent(true)
        setEventError("")

        try {
            const provider = await getReadProvider()
            const factoryAddress = import.meta.env.VITE_EVENTFACTORY

            const factory = new Contract(
                factoryAddress,
                EventFactoryABI.abi,
                provider
            )

            let allEvents
            try {
                allEvents = await factory.getAllEvents()
            } catch (error) {
                allEvents = await factory.getAllEvents.staticCall()
            }

            const eventData = allEvents.find(e => e.id.toString() === eventId)

            if (!eventData) {
                throw new Error("Event not found")
            }

            if (eventData.organizer.toLowerCase() !== address.toLowerCase()) {
                throw new Error("You are not the organizer of this event")
            }

            const formattedEvent = {
                id: eventData.id.toString(),
                name: eventData.name,
                description: eventData.description || "",
                imageURI: eventData.imageURI,
                date: eventData.date.toString(),
                venue: eventData.venue,
                organizer: eventData.organizer,
                deadline: eventData.deadline.toString(),
                active: eventData.active,
                ticketContract: eventData.ticketContract
            }

            console.log("✅ Event loaded:", formattedEvent.name)
            setEvent(formattedEvent)

        } catch (error) {
            console.error("❌ Error loading event:", error)
            setEventError(error.message || "Failed to load event")
        } finally {
            setLoadingEvent(false)
        }
    }

    const loadStats = async () => {
        setLoadingStats(true)
        setStatsError("")

        try {
            const result = await fetchEventStats(eventId)

            if (result.success) {
                console.log("✅ Stats loaded")
                setStats(result.stats)
            } else {
                console.error("❌ Stats load failed:", result.error)
                setStatsError(result.error)
            }
        } catch (error) {
            console.error("❌ Exception loading stats:", error)
            setStatsError(error.message || "Failed to load statistics")
        } finally {
            setLoadingStats(false)
        }
    }

    if (isChecking || loadingEvent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        )
    }

    if (eventError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                        <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Event</h2>
                        <p className="text-red-700 mb-6">{eventError}</p>
                        <button
                            onClick={() => navigate("/organizer/my-events")}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                        >
                            Back to My Events
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <EventHeader event={event} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <EventInfo event={event} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <EventStats 
                            stats={stats}
                            loading={loadingStats}
                            error={statsError}
                            onRefresh={loadStats}
                        />

                        {stats && stats.tierBreakdown && (
                            <TierSalesBreakdown tierBreakdown={stats.tierBreakdown} />
                        )}        
                    </div>
                </div>
            </div>
        </div>
    )
}   