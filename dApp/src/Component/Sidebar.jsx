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
        <aside className="w-64 bg-[hsla(163,70%,34%,1)] text-white flex flex-col justify-between">
            <div>
                <div className="p-4 text-center font-bold text-xl">
                    NFTix Dashboard
                </div>
                <ul className="p-4 space-y-3">
                    <li>
                        <a 
                            href="/buyer" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >Event</a>
                    </li>
                    <li>
                        <a 
                            href="/buyer/MyEvents" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer/MyEvents")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >Active Events</a>
                    </li>
                    <li>
                        <a 
                            href="/buyer/history" 
                            className={`block p-2 rounded transition ${
                                isActive("/buyer/history")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >History</a>
                    </li>
                </ul>
            </div>

            <div className="p-4">
                <button
                    onClick={handleDisconnect}
                    className="cursor-pointer w-full bg-[hsla(0,0%,93%,1)] text-[hsla(179,64%,26%,1)] py-2 rounded font-bold transition"
                >
                    Disconnect
                </button>
            </div>
        </aside>
    )
}