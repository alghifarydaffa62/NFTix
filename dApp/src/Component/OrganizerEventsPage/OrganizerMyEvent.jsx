import fetchOrganizerEvents from "../../Utils/fetchOrganizerEvents"
import OrganizerEventCard from "../OrganizerEventCard"
import { useState, useEffect } from "react"

export default function OrganizerMyEvent({userAddress}) {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const getEvents = async () => {
            try {
                setIsLoading(true)
                setError("")

                const fetchedEvents = await fetchOrganizerEvents(userAddress)
                setEvents(fetchedEvents)
            } catch(error) {
                console.error("failed to fetch events", error)
                setError(error.message)
                setEvents([])
            } finally {
                setIsLoading(false)
            }
        }

        if (userAddress) {
            getEvents();
        } else {
            setIsLoading(false);
            setEvents([]);
        }
    }, [userAddress])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your events...</p>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
                <svg 
                    className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Events Yet
                </h3>
                <p className="text-gray-500 mb-6">
                    You haven't created any events. Start by creating your first event!
                </p>
                <a 
                    href="/organizer/create" 
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Create Your First Event
                </a>
            </div>
        )
    }

    return(
        <div className="space-y-6">
            <h1>All of this address events:</h1>
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
                    <p className="text-gray-600">
                        {events.length} event{events.length !== 1 ? "s" : ""} total
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No events found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <OrganizerEventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    )
}