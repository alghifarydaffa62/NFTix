import { ipfsToHttp } from "../Utils/fetchOrganizerEvents";

const DetailItem = ({ icon, label, value, subValue }) => (
    <div className="flex items-start gap-3">
        <div className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-semibold text-gray-900">{value}</p>
            {subValue && <p className="text-sm text-gray-600">{subValue}</p>}
        </div>
    </div>
);

export default function EventDetails({ event }) {
    const eventDate = new Date(Number(event.date) * 1000);
    const deadline = new Date(Number(event.deadline) * 1000);
    const isEventPassed = eventDate < new Date()
    const isDeadlinePassed = deadline < new Date()

    return(
        <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <img 
                    src={ipfsToHttp(event.imageURI)}
                    alt={event.name}
                    className="w-full h-96 object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/1200x600/e2e8f0/64748b?text=Event+Image"; }}
                />
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DetailItem 
                            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                            label="Event Date"
                            value={eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            subValue={eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        />
                        <DetailItem 
                            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            label="Venue"
                            value={event.venue}
                        />
                        <DetailItem 
                            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Registration Deadline"
                            value={deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        />
                        <DetailItem 
                            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            label="Max Participants"
                            value={`${event.maxParticipant.toString()} people`}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{event.desc}</p>
                    </div>    
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {event.active ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            Inactive
                        </span>
                    )}
                    
                    {isDeadlinePassed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Registration Closed
                        </span>
                    )}
                    
                    {isEventPassed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            Event Ended
                        </span>
                    )}
                </div>
            </div>            
        </div>
    )
}