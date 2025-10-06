import { useState } from "react"
import CreateNewEvent from "../Utils/CreateNewEvent"

export default function CreateEvent() {
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
            const result = await CreateNewEvent(
                name, 
                desc,
                eventIMG,
                date,
                venue,
                maxParticipants,
                deadline
            )

            if(result.success) {
                setSuccess(true)
                setEventId(result.eventId)

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
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Create New Event
            </h1>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <strong>Success!</strong> Event created with ID: {eventId}
                    <br />
                    <a 
                        href={`/event/${eventId}`} 
                        className="underline"
                    >
                        View Event
                    </a>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
                {/* Event Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-medium text-gray-700">
                        Event Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter event name"
                        required
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="desc" className="font-medium text-gray-700">
                        Event Description
                    </label>
                    <textarea
                        id="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Describe your event..."
                        rows="3"
                        required
                    />
                </div>

                {/* Image */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="font-medium text-gray-700">
                        Upload Event Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="border border-gray-300 rounded-md p-2"
                        required
                    />

                    {imagePreview && (
                        <div className="mt-2">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="font-medium text-gray-700">
                        Event Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Venue */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="venue" className="font-medium text-gray-700">
                        Event Venue
                    </label>
                    <input
                        type="text"
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter event location"
                        required
                    />
                </div>

                {/* Max Participants */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="maxParticipant" className="font-medium text-gray-700">
                        Maximum Participants
                    </label>
                    <input
                        type="number"
                        id="maxParticipant"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g., 100"
                        required
                    />
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="deadline" className="font-medium text-gray-700">
                        Event Registration Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`cursor-pointer py-2 rounded-md text-white font-medium transition ${
                        loading 
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
                    ) : (
                        'Create Event'
                    )}
                </button>
            </form>
        </div>
    )
}