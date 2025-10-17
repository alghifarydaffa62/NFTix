import { useEffect, useState } from "react"
import fetchAllEvents from "../../Utils/fetchAllEvents"
import EventCard from "../EventCard"

export default function ShowAllEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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
            
            console.log("ShowAllEvents: Starting fetch...")
            
            const result = await fetchAllEvents()
            
            console.log("ShowAllEvents: Fetch result:", result)
            
            if (!result) {
                throw new Error("No result returned from fetchAllEvents")
            }
            
            if (result.success) {
                console.log("ShowAllEvents: Success! Events:", result.events.length)
                setEvents(result.events)
                
                if (result.events.length === 0) {
                    setError("No active events available at the moment.")
                }
            } else {
                console.error("ShowAllEvents: Fetch failed:", result.error)
                setError(result.error || "Failed to load events")
                setEvents([])
            }
            
        } catch(error) {
            console.error("ShowAllEvents: Exception caught:", error)
            setError(error.message || "An unexpected error occurred while loading events.")
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    // ✅ Loading State
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

    // ✅ Error State
    if (error && events.length === 0) {
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

    // ✅ Empty State
    if (events.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-12 text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-3xl font-bold text-gray-700 mb-3">No Events Available</h3>
                    <p className="text-gray-500 text-lg mb-6">There are no active events at the moment.</p>
                    <button
                        onClick={() => getAllEvents()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    // ✅ Success State - Display Events
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                    Found <span className="font-bold text-blue-600">{events.length}</span> active event{events.length !== 1 ? 's' : ''}
                </p>
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
                {events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </div>
    )
}