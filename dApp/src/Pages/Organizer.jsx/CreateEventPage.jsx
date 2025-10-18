import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarOrganizer from "../../Component/SidebarOrganizer";
import CreateEvent from "../../Component/CreateEventPage/CreateEvent";
import CreateTicket from "../../Component/CreateEventPage/CreateTicket";
import organizer from "../../assets/Organizer.png"

export default function CreateEventPage() {
    const { address, isConnected } = useAppKitAccount()
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

            <main className="flex-1 overflow-y-scroll">
                <div className="gap-3 bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))] flex items-center px-5 py-3 text-white">
                    <div className="p-3 bg-[hsla(0,0%,100%,0.5)] rounded-full">
                        <img src={organizer} alt="" className="w-6"/>
                    </div>
                
                    <h1>Connected: <span className="text-blue-200">{address?.slice(0, 8)}...{address?.slice(-8)}</span></h1>
                </div>

                <div >
                    <div className="mt-5">
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