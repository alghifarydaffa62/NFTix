import { useEffect, useState } from "react"
import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import ShowAllEvents from "../Component/BuyerPage/ShowAllEvents";

export default function BuyerPage() {
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
            <Sidebar/>

            <main className="flex-1 overflow-y-scroll">
                <div className="bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))]">
                    <h1 className="text-md font-semibold text-white h-14 p-4">
                        Organizer Connected: {address}
                    </h1>
                </div>

                <div className="p-6">
                    <h1 className="text-xl font-semibold">All Active Events</h1>
                    <div className="mt-8">
                        <ShowAllEvents/>
                    </div>
                </div>
            </main>
        </div>
    )
}