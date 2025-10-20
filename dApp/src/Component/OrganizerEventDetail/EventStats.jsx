// src/Component/OrganizerEventDetail/EventStats.jsx

export default function EventStats({ stats, loading, error, onRefresh }) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading stats...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-red-900">Error Loading Stats</h3>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (!stats.hasTicketContract) {
        return (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-yellow-900 mb-2">No Ticket Sales Yet</h3>
                <p className="text-yellow-700">This event hasn't deployed a ticket contract yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tickets Sold */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 font-medium">Tickets Sold</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalTicketsSold}</p>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {parseFloat(stats.totalRevenueETH)} ETH
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end">
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Stats
                </button>
            </div>
        </div>
    )
}