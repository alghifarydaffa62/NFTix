import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarOrganizer from "../../Component/SidebarOrganizer";
import OrganizerMyEvent from "../../Component/OrganizerEventsPage/OrganizerMyEvent";
import organizer from "../../assets/Organizer.png"

export default function OrganizerEvents() {
    const { address, isConnected } = useAppKitAccount()
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
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="md:w-64 w-full md:h-auto">
                <SidebarOrganizer />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-scroll">                    
                <div className="gap-3 bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))] flex items-center px-5 py-3 text-white">
                    <div className="p-3 bg-[hsla(0,0%,100%,0.5)] rounded-full">
                        <img src={organizer} alt="" className="w-6"/>
                    </div>
                
                    <h1>Connected: <span className="text-blue-200">{address?.slice(0, 8)}...{address?.slice(-8)}</span></h1>
                </div>
                
                <div className="p-8">
                    <div className="mb-5">
                        <h1 className="text-2xl md:text-3xl font-bold text-[hsla(179,64%,26%,1)] ">
                            EVENT
                        </h1>
                        <p className="text-lg mt-2">All of your events are here</p>
                    </div>
                    
                    <OrganizerMyEvent userAddress={userAddress} />
                </div>
                
            </main>
        </div>
    )
}