import fetchOrganizerEvents from "../Utils/fetchOrganizerEvents"
import { useState, useEffect } from "react"

export default function OrganizerMyEvent({userAddress}) {
    const [eventIds, setEventIds] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getEvents = async () => {
            try {
                setIsLoading(true)

                const ids = await fetchOrganizerEvents(userAddress)

                const formatted = ids.map(id => id.toString())
                setEventIds(formatted)
            } catch(error) {
                console.error("Failed: ", error)
                setEventIds([])
            } finally {
                setIsLoading(false)
            }
        }

        if (userAddress) {
            getEvents();
        } else {
            setIsLoading(false);
            setEventIds([]);
        }
    }, [userAddress])

    return(
        <div>
            <h1>All of this address events:</h1>
            {isLoading ? (
                <p>Loading event IDs...</p>
            ) : (
                <p>
                    IDs: {eventIds.length > 0 ? eventIds.join(', ') : 'No events found.'}
                </p>
            )}
        </div>
    )
}