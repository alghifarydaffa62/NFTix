import { ethers, Contract } from "ethers";
import EventFactoryABI from "../abi/EventFactory.json"

export default async function fetchAllEvents() {
    try {
        const contractAddress = import.meta.env.VITE_EVENTFACTORY;
        
        if (!contractAddress) {
            throw new Error("EventFactory address not configured in .env");
        }

        let provider;

        if (window.ethereum) {
            try {
                provider = new ethers.BrowserProvider(window.ethereum);
                await provider.getNetwork(); 
                console.log("Using wallet provider");
            } catch (error) {
                console.warn("Wallet provider failed, using public RPC");
                provider = null;
            }
        }

        if (!provider) {
            const rpcUrl = import.meta.env.VITE_RPC_URL;
            provider = new ethers.JsonRpcProvider(rpcUrl);
            console.log("Using public RPC provider:", rpcUrl);
        }

        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            provider 
        );

        console.log("Fetching events from contract:", contractAddress);

        const allEvents = await eventFactory.getAllEvents();
        
        console.log(`Raw events from blockchain: ${allEvents.length} events`);

        const now = Math.floor(Date.now() / 1000);
        
        const formattedEvents = allEvents
            .filter(event => {
                const eventDate = Number(event.date);
                const deadline = Number(event.deadline);
                return event.active && deadline > now && eventDate > now;
            })
            .map(event => ({
                id: event.id.toString(),
                name: event.name,
                description: event.description || event.desc || "", 
                imageURI: event.imageURI || "",
                date: event.date.toString(),
                venue: event.venue,
                organizer: event.organizer,
                deadline: event.deadline.toString(),
                active: event.active,
                ticketContract: event.ticketContract
            }));

        console.log(`Returning ${formattedEvents.length} active events`);

        return {
            success: true,
            events: formattedEvents
        };

    } catch(error) {
        console.error("Failed fetching all events:", error);

        return {
            success: false,
            error: error.message || "Failed to fetch events",
            events: []
        };
    }
}