import { ethers, Contract } from "ethers";
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"

export default async function fetchAllEvents() {
    try {
        const contractAddress = import.meta.env.VITE_EVENTFACTORY
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            signer
        )

        const allEvents = await eventFactory.getAllEvents()

        const userEvents = allEvents.map(event => ({
            id: event.id.toString(),
            name: event.name,
            desc: event.desc,
            imageURI: event.imageURI,
            date: Number(event.date),
            venue: event.venue,
            organizer: event.organizer,
            maxParticipants: Number(event.maxParticipant),
            deadline: Number(event.deadline),
            totalRevenue: event.totalRevenue.toString(),
            active: event.active,
            ticketContract: event.ticketContract
        }))

        return userEvents
    } catch(error) {
        console.error("Failed fetching all events: ", error)
    }
}