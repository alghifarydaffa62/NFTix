import TicketBox from './TicketBox';
import { useNavigate } from 'react-router-dom';

const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
        <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading tickets from blockchain...</p>
        </div>
    </div>
);

const EmptyState = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Active Tickets</h3>
            <p className="text-gray-500 mb-6">You don't have any active tickets for upcoming events.</p>
            <button
                onClick={() => navigate("/buyer")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
                Browse Events
            </button>
        </div>
    );
};

export default function TicketList({ tickets, loading, ...props }) {
    if (loading) {
        return <LoadingState />;
    }

    if (tickets.length === 0) {
        return <EmptyState/>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
                <TicketBox key={`${ticket.contractAddress}-${ticket.tokenId}`} ticket={ticket} {...props} />
            ))}
        </div>
    );
}