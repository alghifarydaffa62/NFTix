import { useNavigate } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react"

export default function SidebarOrganizer() {
    const { disconnect } = useDisconnect()
    const navigate = useNavigate()
    
    const handleDisconnect = async () => {
        await disconnect() 
        localStorage.removeItem("userWallet")
        navigate("/connect")
    }

    return(
        <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
            <div>
                <div className="p-4 text-center font-bold text-xl border-b border-blue-700">
                    NFTix Dashboard
                </div>
                <ul className="p-4 space-y-3">
                    <li>
                        <a href="/organizer" className="block p-2 rounded bg-blue-800">Dashboard</a>
                    </li>
                    <li>
                        <a href="/organizer/create" className="block p-2 rounded hover:bg-blue-800 transition">Create Event</a>
                    </li>
                    <li>
                        <a href="/organizer/MyEvents" className="block p-2 rounded hover:bg-blue-800 transition">MyEvent</a>
                    </li>
                </ul>
            </div>

            <div className="p-4 border-t border-blue-700">
                <button
                    onClick={handleDisconnect}
                    className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
                >
                    Disconnect
                </button>
            </div>
        </aside>
    )
}