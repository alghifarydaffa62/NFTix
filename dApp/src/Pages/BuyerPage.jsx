import { useAppKitAccount } from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../Component/Sidebar";
import ShowAllEvents from "../Component/BuyerPage/ShowAllEvents";
import organizer from "../assets/Organizer.png";

export default function BuyerPage() {
  const { address, isConnected } = useAppKitAccount();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsChecking(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && !isConnected) navigate("/connect");
  }, [isChecking, isConnected, navigate]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[hsla(163,70%,34%,1)] text-white p-2 rounded-md shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-scroll">
        <div className="gap-3 bg-[linear-gradient(to_right,hsla(160,46%,34%,1),hsla(183,70%,25%,1))] flex items-center px-5 py-3 text-white">
          <div className="p-3 bg-[hsla(0,0%,100%,0.5)] rounded-full">
            <img src={organizer} alt="" className="w-6" />
          </div>
          <h1>
            Connected:{" "}
            <span className="text-blue-200">
              {address?.slice(0, 8)}...{address?.slice(-8)}
            </span>
          </h1>
        </div>

        <div className="p-8">
          <h1 className="text-[hsla(179,64%,26%,1)] text-2xl font-semibold mb-2">
            All Active Events
          </h1>
          <ShowAllEvents />
        </div>
      </main>
    </div>
  );
}