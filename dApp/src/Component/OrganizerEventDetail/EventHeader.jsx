import { useNavigate } from "react-router-dom"
import { ipfsToHttp } from "../../Utils/fetchOrganizerEvents"

export default function EventHeader({ event }) {
    const navigate = useNavigate()

    return (
        <div className="mb-8">
            <button 
                onClick={() => navigate('/organizer/MyEvents')}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to My Events
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Gambar Event */}
                    <div className="h-80 bg-gradient-to-br from-blue-600 to-indigo-600 relative">
                    {event.imageURI ? (
                        <img
                        src={ipfsToHttp(event.imageURI)}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-24 h-24 text-white opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                    </div>

                    {/* Judul & Deskripsi Event */}
                    <div className="p-6">
                        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                            {event.name}
                        </h1>
                        <p className="text-gray-600">{event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}