import { useState } from "react"

export default function CreateEvent() {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [eventIMG, setEventIMG] = useState(null)
    const [date, setDate] = useState(null)
    const [venue, setVenue] = useState("")
    const [maxParticipants, setMaxParticipants] = useState(null)
    const [deadline, setDeadline] = useState(null)
    
    return(
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Fill in the Required Form
            </h1>

            <form className="flex flex-col gap-5">
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
                        onChange={(e) => setEventIMG(e.target.files[0])}
                        className="border border-gray-300 rounded-md p-2"
                    />
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
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                    Create Event
                </button>
            </form>
        </div>
    )
}