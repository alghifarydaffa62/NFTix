import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarOrganizer from "../../Component/SidebarOrganizer";
import CreateEvent from "../../Component/CreateEvent";
import CreateTicket from "../../Component/CreateTicket";

export default function CreateEventPage() {
    const { isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    const [tiers, setTiers] = useState([])

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

    const handleTiersChange = (updatedTiers) => {
        setTiers(updatedTiers)
    }

    return(
        <div className="flex min-h-screen bg-gray-100">
            <SidebarOrganizer/>

            <main className="flex-1 p-8 overflow-y-scroll">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create Your Event
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CreateEvent tiers={tiers} />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <CreateTicket 
                                onTiersChange={handleTiersChange}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}