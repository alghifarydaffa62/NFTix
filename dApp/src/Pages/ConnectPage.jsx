import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import buyer from "../assets/Buyer.png"
import organizer from "../assets/Organizer.png"
import Navbar from "../Component/Navbar"

export default function ConnectPage() {
    const { open } = useAppKit()
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [pendingRole, setPendingRole] = useState(null)

    useEffect(() => {
        if(isConnected && address && pendingRole) {
            localStorage.setItem("userWallet", address)

            if(pendingRole == "buyer") navigate('/buyer')
            if(pendingRole == "organizer") navigate('/organizer')

            setPendingRole(null)
        }
    }, [isConnected, address, pendingRole, navigate])

    const HandleConnect = async (role) => {
        setPendingRole(role)
        open()
    }

    return(
        <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Navbar />

            <div className="absolute top-24 right-24 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-24 left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center flex-1 relative z-10 px-6 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                    Connect Your Wallet
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-12">
                    Choose your role and connect your crypto wallet to continue.
                </p>

                <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                    {/* Buyer */}
                    <div
                    onClick={() => HandleConnect("buyer")}
                    className="w-65 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <img src={buyer} alt="Buyer" className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Log In as Buyer
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Browse and buy tickets directly from verified organizers.
                        </p>
                    </div>

                    {/* Organizer */}
                    <div
                    onClick={() => HandleConnect("organizer")}
                    className="w-64 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <img src={organizer} alt="Organizer" className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Log In as Organizer
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Create, manage, and sell event tickets securely on-chain.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}