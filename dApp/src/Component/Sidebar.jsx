import { useLocation, useNavigate } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react";
import events from "../assets/events.png"
import active from "../assets/active.png"
import history from "../assets/myevent.png"

export default function Sidebar({ isOpen, setIsOpen }) {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDisconnect = async () => {
    await disconnect();
    localStorage.removeItem("userWallet");
    navigate("/connect");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-full w-64 bg-[hsla(163,70%,34%,1)] text-white flex flex-col justify-between transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
        <div>
            <div className="relative p-4 text-center font-bold text-xl">
                NFTix Dashboard
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl font-bold"
                >
                    ×
                </button>
            </div>

            <ul className="p-4 space-y-3">
                <li>
                    <a
                    href="/buyer"
                    className={`flex gap-3 items-center rounded p-2 font-semibold transition ${
                        isActive("/buyer")
                        ? "bg-[hsla(163,70%,25%,1)]"
                        : "hover:bg-green-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                    >
                        <img src={events} alt="" className="w-5"/>
                        Event
                    </a>
                </li>
            <li>
                <a
                    href="/buyer/MyEvents"
                    className={`flex gap-3 items-center p-2 rounded font-semibold transition ${
                        isActive("/buyer/MyEvents")
                        ? "bg-[hsla(163,70%,25%,1)]"
                        : "hover:bg-green-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                >
                    <img src={active} alt="" className="w-5"/>
                    Active Events
                </a>
            </li>
            <li>
                <a
                    href="/buyer/history"
                    className={`flex gap-3 items-center p-2 rounded font-semibold transition ${
                        isActive("/buyer/history")
                        ? "bg-[hsla(163,70%,25%,1)]"
                        : "hover:bg-green-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                >
                    <img src={history} alt="" className="w-5"/>
                    History
                </a>
            </li>
            </ul>
        </div>

        <div className="p-4">
            <button
            onClick={handleDisconnect}
            className="cursor-pointer w-full bg-[hsla(0,0%,93%,1)] text-[hsla(179,64%,26%,1)] py-2 rounded font-bold transition hover:bg-gray-300"
            >
            Disconnect
            </button>
        </div>
    </aside>
  );
}