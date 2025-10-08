import { useEffect, useState } from "react"
import fetchAllEvents from "../Utils/fetchAllEvents"
import EventCard from "./EventCard"

export default function ShowAllEvents() {
    const [events, setEvents] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const getAllEvents = async () => {
            try {
                setError("")
                
                const allEvents = await fetchAllEvents()
                setEvents(allEvents)
            } catch(error) {
                console.error("getAllEvents failed: ", error)
                setError()
                setEvents([])
            }
        }

        getAllEvents()
    }, [])

    return(
        <div>
            {events.length === 0 ? (
                <div>
                    <h1 className="text-3xl text-center font-semibold">No Events</h1>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event}/>
                    ))}
                </div>
            )}
        </div>
    )
}