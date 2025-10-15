import { useNavigate, useLocation } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react"
import grid from "../assets/grid.png"
import plus from "../assets/plus.png"
import myevent from "../assets/myevent.png"

export default function SidebarOrganizer() {
    const { disconnect } = useDisconnect()
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleDisconnect = async () => {
        await disconnect() 
        localStorage.removeItem("userWallet")
        navigate("/connect")
    }
    
    const isActive = (path) => location.pathname === path

    return(
        <aside className="w-64 bg-[hsla(163,70%,34%,1)] text-white flex flex-col justify-between">
            <div>
                <div className="p-4 text-center font-bold text-xl">
                    NFTix Dashboard
                </div>
                <ul className="p-4 space-y-3">
                    <li>
                        <a 
                            href="/organizer" 
                            className={`flex gap-4 items-center font-semibold p-2 rounded transition ${
                                isActive("/organizer")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >
                            <img src={grid} alt="" className="w-5"/>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a 
                            href="/organizer/create" 
                            className={`flex gap-4 items-center font-semibold p-2 rounded transition ${
                                isActive("/organizer/create")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >
                            <img src={plus} alt="" className="w-5"/>
                            Create Event
                        </a>
                    </li>
                    <li>
                        <a 
                            href="/organizer/MyEvents" 
                            className={`flex gap-4 items-center font-semibold p-2 rounded transition ${
                                isActive("/organizer/MyEvents")
                                ? "bg-[hsla(163,70%,25%,1)]"
                                : "hover:bg-green-800"
                            }`}
                        >
                            <img src={myevent} alt="" className="w-5"/>
                            MyEvent
                        </a>
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