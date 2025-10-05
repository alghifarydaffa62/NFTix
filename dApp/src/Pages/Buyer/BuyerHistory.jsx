import { useDisconnect, useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BuyerHistory() {
    const { address, isConnected } = useAppKitAccount()
    const { disconnect } = useDisconnect()
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

    const handleDisconnect = async () => {
        await disconnect() 
        localStorage.removeItem("userWallet")
        navigate("/connect")
    }

    return(
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
                <div>
                    <div className="p-4 text-center font-bold text-xl border-b border-blue-700">
                        NFTix Dashboard
                    </div>
                    <ul className="p-4 space-y-3">
                        <li>
                            <a href="/buyer" className="block p-2 rounded hover:bg-blue-800 transition">Events</a>
                        </li>
                        <li>
                            <a href="/buyer/MyEvents" className="block p-2 rounded hover:bg-blue-800 transition">Active Events</a>
                        </li>
                        <li>
                            <a href="/buyer/history" className="block p-2 rounded bg-blue-800">History</a>
                        </li>
                    </ul>
                </div>

                <div className="p-4 border-t border-blue-700">
                    <button
                        onClick={handleDisconnect}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
                    >
                        Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    This is your history buying tickets now.
                </h1>

            </main>
        </div>
    )
}