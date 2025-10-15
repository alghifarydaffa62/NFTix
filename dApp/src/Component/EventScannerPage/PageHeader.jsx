import { useNavigate } from "react-router-dom";
export default function PageHeader({ event, setUseDeveloperMode, useDeveloperMode }) {
    const navigate = useNavigate()

    return(
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Scanner</h1>
            <p className="text-gray-600">Event: {event.name}</p>
            <p className="text-sm text-gray-500">Venue: {event.venue}</p>

            <div className="mt-4 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useDeveloperMode}
                        onChange={(e) => setUseDeveloperMode(e.target.checked)}
                        className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">Developer Mode (Manual Input)</span>
                </label>
            </div>
        </div>
    )
}