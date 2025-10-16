import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarOrganizer from "../../Component/SidebarOrganizer";
import OrganizerMyEvent from "../../Component/OrganizerEventsPage/OrganizerMyEvent";

export default function OrganizerEvents() {
    const { isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

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

    const userAddress = localStorage.getItem("userWallet")

    return(
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="md:w-64 w-full md:h-auto">
                <SidebarOrganizer />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                    This is all your events.
                </h1>
                <OrganizerMyEvent userAddress={userAddress} />
            </main>
        </div>
    )
}