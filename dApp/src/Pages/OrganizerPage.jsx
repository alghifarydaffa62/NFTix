import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount} from "@reown/appkit/react"
import SidebarOrganizer from "../Component/SidebarOrganizer";
import fetchOrganizerEvents from "../Utils/fetchOrganizerEvents";

export default function OrganizerPage() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    const [totalEvents, setTotalEvents] = useState(0)
    const [isLoadingEvents, setIsLoadingEvents] = useState(true)

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

    useEffect(() => {
        const loadTotalEvents = async () => {
            try {
                setIsLoadingEvents(true)
                const eventIds = await fetchOrganizerEvents(address)
                setTotalEvents(eventIds.length)
            } catch(error) {
                console.error("Failed: ", error)
                setTotalEvents(0)
            } finally {
                setIsLoadingEvents(false)
            }
        }

        if (address && isConnected) {
            loadTotalEvents();
        } else {
            setIsLoadingEvents(false);
            setTotalEvents(0);
        }
    }, [address, isConnected])

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
        <div className="flex min-h-screen bg-gray-100">
            <SidebarOrganizer/>
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Welcome organizer! {address}
                </h1>

                <div className="p-5 bg-blue-800 w-fit text-white rounded-md">
                    <h1>Total Events Created</h1>

                    {isLoadingEvents ? (
                        <p>Loading total...</p>
                    ) : (
                        <p className="text-3xl font-bold">{totalEvents}</p>
                    )}
                </div>
            </main>
        </div>
    )
}