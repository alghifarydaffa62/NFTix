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

    return(
        <div className="flex max-h-screen bg-gray-100">
            <SidebarOrganizer/>
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-scroll">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Create Your Event
                </h1>

                <CreateEvent/>

                <div className="mt-4">
                    <CreateTicket/>
                </div>
            </main>
        </div>
    )
}