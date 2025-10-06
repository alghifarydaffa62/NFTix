import { useEffect, useState } from "react"
import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";

export default function BuyerPage() {
    const { address, isConnected } = useAppKitAccount()
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
            <Sidebar/>

            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Welcome Buyer! {address}
                </h1>
            </main>
        </div>
    )
}