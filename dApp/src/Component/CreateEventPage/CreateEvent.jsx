import { useState } from "react"
import CreateNewEvent from "../../Utils/CreateNewEvent"

export default function CreateEvent({ tiers }) {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [eventIMG, setEventIMG] = useState(null)
    const [date, setDate] = useState("")
    const [venue, setVenue] = useState("")
    const [maxParticipants, setMaxParticipants] = useState("")
    const [deadline, setDeadline] = useState("")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [eventId, setEventId] = useState(null);
    const [ticketContract, setTicketContract] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setEventIMG(file)

        if(file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        if (!name.trim()) return "Event name is required";
        if (desc.length < 10) return "Description must be at least 10 characters";
        if (!eventIMG) return "Event image is required";
        if (!date) return "Event date is required";
        if (!venue.trim()) return "Venue is required";
        if (!maxParticipants || maxParticipants <= 0) return "Max participants must be greater than 0";
        if (!deadline) return "Deadline is required";

        const eventDate = new Date(date);
        const deadlineDate = new Date(deadline);
        const now = new Date();
        
        if (eventDate <= now) return "Event date must be in the future";
        if (deadlineDate >= eventDate) return "Deadline must be before event date";
        if (deadlineDate <= now) return "Deadline must be in the future";

        if (tiers.length === 0) return "At least one ticket tier is required"

        for (const tier of tiers) {
            if (!tier.name || !tier.price || !tier.maxSupply) {
                return "All tier fields must be filled"
            }
            if (parseFloat(tier.price) <= 0) {
                return "Tier price must be greater than 0"
            }
            if (parseInt(tier.maxSupply) <= 0) {
                return "Tier max supply must be greater than 0"
            }
        }
        
        return null;
    };

    const handleCreate = async(e) => {
        e.preventDefault()

        setError("")
        setSuccess(false)

        const validationError = validateForm()

        if(validationError) {
            setError(validationError)
            return
        }

        setLoading(true)

        try {
            const result = await CreateNewEvent({
                name, 
                desc,
                eventIMG,
                date,
                venue,
                maxParticipants,
                deadline,
                tiers
            })

            if(result.success) {
                setSuccess(true)
                setEventId(result.eventId)
                setTicketContract(result.ticketContract)

                setName("")
                setDesc("")
                setEventIMG(null)
                setDate("")
                setVenue("")
                setMaxParticipants("")
                setDeadline("")
                setImagePreview(null)
            } else {
                setError(result.error)
            }

        } catch(error) {
            setError(error.message || "An unexpected error occured")
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-[hsla(179,64%,26%,1)]">
                Create New Event
            </h1>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <strong>Success!</strong>
                    </div>
                    <div className="mt-2 text-sm">
                        <p>Event created with ID: <strong>{eventId}</strong></p>
                        {ticketContract && (
                            <p className="mt-1">
                                Ticket Contract: 
                                <code className="bg-green-200 px-1 rounded text-xs ml-1">
                                    {ticketContract.slice(0, 6)}...{ticketContract.slice(-4)}
                                </code>
                            </p>
                        )}
                        <p className="mt-2">Your event is now live and accepting ticket purchases! 🎉</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <strong>Error:</strong>
                    </div>
                    <p className="mt-1">{error}</p>
                </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-6">
                {/* Event Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-medium text-gray-700">
                        Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter event name"
                        disabled={loading}
                        required
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="desc" className="font-medium text-gray-700">
                        Event Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Describe your event... (min 10 characters)"
                        rows="4"
                        disabled={loading}
                        required
                    />
                    <span className="text-sm text-gray-500">
                        {desc.length}/10 characters
                    </span>
                </div>

                {/* Image */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="font-medium text-gray-700">
                        Upload Event Image <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="border border-[hsla(179,64%,26%,1)] rounded-md p-2"
                        disabled={loading}
                        required
                    />

                    {imagePreview && (
                        <div className="mt-2">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="date" className="font-medium text-gray-700">
                            Event Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="deadline" className="font-medium text-gray-700">
                            Registration Deadline <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {/* Venue & Max Participants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Venue */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="venue" className="font-medium text-gray-700">
                            Event Venue <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="venue"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter event location"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Max Participants */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maxParticipant" className="font-medium text-gray-700">
                            Maximum Participants <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="maxParticipant"
                            value={maxParticipants}
                            onChange={(e) => setMaxParticipants(e.target.value)}
                            className="border border-[hsla(179,64%,26%,1)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g., 1000"
                            min="1"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {tiers && tiers.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center gap-2 text-green-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <strong>{tiers.length} tier(s) added</strong>
                        </div>
                    </div>
                )}
                

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || tiers.length === 0}
                    className={`cursor-pointer py-3 rounded-md text-white font-medium transition ${
                        loading || tiers.length === 0
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg 
                                className="animate-spin h-5 w-5" 
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
                            Creating Event...
                        </span>
                    ) : tiers.length === 0 ? (
                        'Add at least 1 tier to continue'
                    ) : (
                        `Create Event with ${tiers.length} tier(s)`
                    )}
                </button>
            </form>
        </div>
    )
}