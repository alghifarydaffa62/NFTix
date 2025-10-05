import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react"

export default function OrganizerPage() {
    const { address, isConnected } = useAppKitAccount()
    const { disconnect } = useDisconnect()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isConnected) {
            navigate("/connect")
        }
    }, [isConnected, navigate])

    const handleDisconnect = async () => {
        await disconnect() 
        localStorage.removeItem("userWallet")
        navigate("/connect")
    }

    return(
        <div>
            <h1 className="text-center text-2xl">Welcome Organizer! {address}</h1>

            <button className="cursor-pointer flex justify-center p-3 bg-red-700 text-white font-semibold rounded-md" onClick={handleDisconnect}>Disconnect Wallet</button>
        </div>
    )
}