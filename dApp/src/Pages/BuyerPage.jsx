import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../Component/Sidebar";
import ShowAllEvents from "../Component/BuyerPage/ShowAllEvents";

export default function BuyerPage() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isChecking && !isConnected) {
            navigate("/connect")
        }
    }, [isChecking, isConnected, navigate])

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return(
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>
            <main className="flex-1 p-8 overflow-y-scroll">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">DASHBOARD</h1>
                        <h1>Selamat datang kembali</h1>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        Connected: <span className="font-mono font-semibold text-blue-600">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                    </div>
                </div>

                <ShowAllEvents />
            </main>
        </div>
    )
}