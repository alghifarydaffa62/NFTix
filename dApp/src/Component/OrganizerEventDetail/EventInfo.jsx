// src/Component/OrganizerEventDetail/EventInfo.jsx

export default function EventInfo({ event }) {
    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Information</h2>

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Event Date</p>
                        <p className="text-lg font-semibold text-gray-900">{formatDate(event.date)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Venue</p>
                        <p className="text-lg font-semibold text-gray-900">{event.venue}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Sales Deadline</p>
                        <p className="text-lg font-semibold text-gray-900">{formatDate(event.deadline)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            event.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {event.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {event.ticketContract && event.ticketContract !== "0x0000000000000000000000000000000000000000" && (
                    <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                        <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Ticket Contract</p>
                            <p className="text-xs font-mono text-gray-900 bg-gray-100 p-2 rounded break-all">
                                {event.ticketContract}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}