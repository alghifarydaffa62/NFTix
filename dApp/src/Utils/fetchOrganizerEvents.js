import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import { Contract, ethers } from "ethers"

export default async function fetchOrganizerEvents(userAddress) {
    try {
        const contractAddress = "0xDF82389BD2C9Abd2a15C099bd237C63D7C6A0d47"        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            signer
        )

        const organizerEvents = await eventFactory.getEventsByOrganizer(userAddress)

        const formattedEvents = organizerEvents.map(event => ({
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
        }));

        return formattedEvents;
        
    } catch (error) {
        console.error('❌ Error in fetchOrganizerEvents:', error);
        throw error;
    }
}

export function ipfsToHttp(ipfsURI) {
    if (!ipfsURI || !ipfsURI.startsWith("ipfs://")) {
        return ""; 
    }
  
    const hash = ipfsURI.replace("ipfs://", "");

    return `https://rose-blank-vicuna-66.mypinata.cloud/ipfs/${hash}`;
}

export function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isEventActive(event) {
    const now = Math.floor(Date.now() / 1000);
    return (
        event.active &&
        now < event.deadline &&
        now < event.date
    );
}