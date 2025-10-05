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
        <div className="">
            <Navbar/>
            <div className="flex justify-center gap-12">
                    {/* Buyer */}
                    <div
                        onClick={() => HandleConnect("buyer")}
                        className="p-8 bg-cyan-700 rounded-2xl shadow-md cursor-pointer hover:bg-cyan-600 hover:scale-105 transition transform duration-200 text-center"
                    >
                        <img
                            src={buyer}
                            alt="Buyer"
                            className=" mx-auto"
                        />
                        <h1 className="text-lg font-semibold">Log In as Buyer</h1>
                    </div>

                    {/* Organizer */}
                    <div
                        onClick={() => HandleConnect("organizer")}
                        className="p-8 bg-purple-700 rounded-2xl shadow-md cursor-pointer hover:bg-purple-600 hover:scale-105 transition transform duration-200 text-center"
                    >
                        <img
                            src={organizer}
                            alt="Organizer"
                            className="mx-auto"
                        />
                        <h1 className="text-lg font-semibold">Log In as Organizer</h1>
                    </div>
            </div>
        </div>
    )
}