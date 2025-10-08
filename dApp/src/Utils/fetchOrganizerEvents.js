import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import { Contract, ethers } from "ethers"

export default async function fetchOrganizerEvents(userAddress) {

    try {
        const contractAddress = "0xDEB53a5484de3B6eacC691D9552f189FeAf98141"
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            signer
        )
        
        const organizerEventIds = await eventFactory.getOrganizerEvent(userAddress)

        const eventDetailsPromises = organizerEventIds.map(async (eventId) => {
            try {
                const event = eventFactory.getEvent(eventId)

                return {
                    id: eventId.toString(),
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
                }
            } catch(error) {
                console.error(`Failed to fetch details for event ID ${eventId}:`, error);
                return null;
            }
        })

        const events = await Promise.all(eventDetailsPromises)

        const validEvents = events.filter(event => event !== null)
        return validEvents
    } catch (error) {
        console.error('Failed: ', error)
    }
}

export function ipfsToHttp(ipfsURI) {
    if (!ipfsURI) return "";
  
    if (ipfsURI.startsWith("ipfs://")) {
        const hash = ipfsURI.replace("ipfs://", "");
        return `https://ipfs.io/ipfs/${hash}`;
    }
    
    return ipfsURI;
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