import { useEffect, useState } from "react"
import fetchAllEvents from "../../Utils/fetchAllEvents"
import EventCard from "../EventCard"

export default function ShowAllEvents() {
    const [allEvents, setAllEvents] = useState([]) 
    const [activeEvents, setActiveEvents] = useState([])
    const [pastEvents, setPastEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showPastEvents, setShowPastEvents] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            getAllEvents()
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const getAllEvents = async () => {
        try {
            setLoading(true)
            setError("")

            const result = await fetchAllEvents()
            
            if (!result) {
                throw new Error("No result returned from fetchAllEvents")
            }
            
            if (!result.success) {
                console.error("❌ Fetch failed:", result.error)
                setError(result.error || "Failed to load events")
                setAllEvents([])
                setActiveEvents([])
                setPastEvents([])
                return
            }

            const now = Math.floor(Date.now() / 1000)
            
            const active = result.events.filter(event => {
                const eventDate = Number(event.date)
                const deadline = Number(event.deadline)
                return event.active && deadline > now && eventDate > now
            })

            const past = result.events.filter(event => {
                const eventDate = Number(event.date)
                const deadline = Number(event.deadline)
                return !event.active || deadline <= now || eventDate <= now
            })

            setAllEvents(result.events)
            setActiveEvents(active)
            setPastEvents(past)

            if (active.length === 0 && past.length > 0) {
                setError("No active events at the moment. Check past events below.")
            } else if (active.length === 0 && past.length === 0) {
                setError("No events available.")
            }
            
        } catch(error) {
            console.error("❌ Exception:", error)
            setError(error.message || "An unexpected error occurred while loading events.")
            setAllEvents([])
            setActiveEvents([])
            setPastEvents([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <svg className="animate-spin h-16 w-16 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-xl text-gray-600 font-medium">Loading events...</p>
                </div>
            </div>
        )
    }

    if (error && allEvents.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-red-900 mb-3">Failed to Load Events</h3>
                    <p className="text-red-700 mb-6">{error}</p>
                    <button
                        onClick={() => getAllEvents()}
                        className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (activeEvents.length === 0) {
        return (
            <div>

                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
                        <svg className="w-20 h-20 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-3xl font-bold text-gray-800 mb-3">No Active Events</h3>
                        <p className="text-gray-600 text-lg mb-4">
                            All current events have ended or are no longer accepting ticket sales.
                        </p>
                        <button
                            onClick={() => getAllEvents()}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check for New Events
                        </button>
                    </div>
                </div>

                {pastEvents.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
                                <p className="text-gray-600 mt-1">
                                    {pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''} ended or inactive
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPastEvents(!showPastEvents)}
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                {showPastEvents ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                        Hide Past Events
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Show Past Events
                                    </>
                                )}
                            </button>
                        </div>

                        {showPastEvents && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                                {pastEvents.map((event) => (
                                    <div key={event.id} className="relative">
                                        <div className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Ended
                                        </div>
                                        <EventCard event={event} isPast={true} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            {/* Active Events Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-600 mt-1">
                            <span className="font-bold text-blue-600">{activeEvents.length}</span> active event{activeEvents.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                    <button
                        onClick={() => getAllEvents()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeEvents.map((event) => (
                        <EventCard key={event.id} event={event} isPast={false} />
                    ))}
                </div>
            </div>
        </div>
    )
}