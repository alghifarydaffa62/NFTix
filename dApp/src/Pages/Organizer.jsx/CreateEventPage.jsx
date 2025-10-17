import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarOrganizer from "../../Component/SidebarOrganizer";
import CreateEvent from "../../Component/CreateEventPage/CreateEvent";
import CreateTicket from "../../Component/CreateEventPage/CreateTicket";

export default function CreateEventPage() {
    const { isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    const [tiers, setTiers] = useState([])

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

    const handleTiersChange = (updatedTiers) => {
        setTiers(updatedTiers)
    }

    return(
        <div className="flex h-screen bg-gray-100">
            <SidebarOrganizer/>

            <main className="flex-1 p-8 overflow-y-scroll">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create Your Event
                </h1>

                <div>
                    <div className="">
                        <CreateEvent tiers={tiers} />
                    </div>
                    <div className="mt-8">
                        <CreateTicket 
                            onTiersChange={handleTiersChange}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}