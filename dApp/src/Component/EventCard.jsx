import { ipfsToHttp, formatDate } from "../Utils/fetchOrganizerEvents";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const imageUrl = ipfsToHttp(event.imageURI);
  const navigate = useNavigate()

  const hasTicketContract = event.ticketContract !== "0x0000000000000000000000000000000000000000";
  const handleShowDetailPage = () => {
      navigate(`/buyer/event/${event.id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-300">
                  <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>

        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                {event.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {event.description}
            </p>

            <div className="space-y-2 text-sm">

                <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.venue}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Max: {event.maxParticipants} participants</span>
                </div>

                <div className="flex items-center gap-2">
                    {hasTicketContract ? (
                        <button onClick={handleShowDetailPage} className="cursor-pointer mt-2 px-4 py-2 rounded-md bg-blue-700 text-white font-semibold">Buy Ticket</button>
                    ) : (
                        <span className="text-orange-600 text-xs font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Tickets Not Setup
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}