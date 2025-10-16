import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount} from "@reown/appkit/react"
import SidebarOrganizer from "../Component/SidebarOrganizer";
import fetchOrganizerEvents from "../Utils/fetchOrganizerEvents";
import total from "../assets/total.png"

export default function OrganizerPage() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    const [totalEvents, setTotalEvents] = useState(0)
    const [isLoadingEvents, setIsLoadingEvents] = useState(true)

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
        <div className="flex h-screen bg-gray-100">
            <SidebarOrganizer/>
            {/* Main Content */}
            <main className="flex-1">
                <div className="bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))]">
                    <h1 className="text-lg font-semibold text-white mb-4 p-4">
                        Organizer Connected: {address}
                    </h1>
                </div>
                
                <div className="px-6">
                    <h1 className="text-[hsla(179,64%,26%,1)] font-bold tracking-wider text-3xl">DASHBOARD</h1>
                    <h1 className="text-gray-500 font-semibold text-lg mt-1">Welcome Back, Organizer!</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <img src={total} alt="Total Events" />
                            </div>

                            <div className="flex-1">
                                <h1>Total Events</h1>
                                {isLoadingEvents ? (
                                    <p>Loading total...</p>
                                ) : (
                                    <p className="text-xl font-semibold">{totalEvents} Events</p>
                                )}
                            </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <img src={total} alt="Tickets Sold" />
                            </div>

                            <div className="flex-1">
                                <h1>Tickets Sold</h1>
                                <p className="text-xl font-semibold">1 Tickets</p>
                            </div>
                        </div>

                        {/* CARD 3 */}
                        <div className="flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <img src={total} alt="Total Revenue" />
                            </div>

                            <div className="flex-1">
                                <h1>Total Revenue</h1>
                                <p className="text-xl font-semibold">0.23142 ETH</p>
                            </div>
                        </div>

                        {/* CARD 4 */}
                        <div onClick={() => navigate('/organizer/create')} className="cursor-pointer flex gap-5 items-center p-5 bg-white shadow-[0_4px_4px_hsla(0,0%,0%,0.25)] text-[hsla(182,67%,25%,1)] font-bold text-xl rounded-md">
                            <div className="p-3 rounded-md bg-[hsla(182,67%,25%,1)]">
                                <img src={total} alt="Another Stat" />
                            </div>

                            <div>
                                <h1>Create New Event</h1>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}