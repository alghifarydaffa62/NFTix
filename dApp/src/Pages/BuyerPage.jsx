import { useEffect } from "react"
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";

export default function BuyerPage() {
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
            <h1 className="text-center text-2xl">Welcome Buyer! {address}</h1>

            <button className="cursor-pointer flex justify-center p-3 bg-red-700 text-white font-semibold rounded-md" onClick={handleDisconnect}>Disconnect</button>
        </div>
    )
}