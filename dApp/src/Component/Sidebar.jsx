import { useLocation, useNavigate } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react"

export default function Sidebar() {
    const { disconnect } = useDisconnect()
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleDisconnect = async () => {
        await disconnect() 
        localStorage.removeItem("userWallet")
        navigate("/connect")
    }

    const isActive = (path) => location.pathname == path

    return(
        <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
            <div>
                <div className="p-4 text-center font-bold text-xl border-b border-blue-700">
                    NFTix Dashboard
                </div>
                <ul className="p-4 space-y-3">
                    <li>
                        <a 
                            href="/buyer" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer")
                                ? "bg-blue-500 font-semibold"
                                : "hover:bg-blue-800"
                            }`}
                        >Event</a>
                    </li>
                    <li>
                        <a 
                            href="/buyer/MyEvents" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer/MyEvents")
                                ? "bg-blue-500 font-semibold"
                                : "hover:bg-blue-800"
                            }`}
                        >Active Events</a>
                    </li>
                    <li>
                        <a 
                            href="/buyer/history" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer/history")
                                ? "bg-blue-500 font-semibold"
                                : "hover:bg-blue-800"
                            }`}
                        >History</a>
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