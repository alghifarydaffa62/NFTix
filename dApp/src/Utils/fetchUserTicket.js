import { BrowserProvider, Contract } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import TicketNFTABI from "../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"

export default async function FetchUserTicket(userAddress) {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed");
        }

        if (!userAddress) {
            throw new Error("User address required");
        }

        const provider = new BrowserProvider(window.ethereum);
        const factoryAddress = import.meta.env.VITE_EVENTFACTORY;

        if (!factoryAddress) {
            throw new Error("EventFactory address not configured");
        }

        const factory = new Contract(
            factoryAddress,
            EventFactoryABI.abi,
            provider
        );

        const allEvents = await factory.getAllEvents();
        console.log("Total events:", allEvents.length);

        const userTickets = [];

        for (const event of allEvents) {
            // Skip events without ticket contract
            if (event.ticketContract === "0x0000000000000000000000000000000000000000") {
                continue;
            }

            try {
                // Connect to TicketNFT contract
                const ticketContract = new Contract(
                    event.ticketContract,
                    TicketNFTABI.abi,
                    provider
                );

                // Get user's balance for this event
                const balance = await ticketContract.balanceOf(userAddress);
                const balanceNumber = Number(balance);

                console.log(`Event: ${event.name}, User balance: ${balanceNumber}`);

                if (balanceNumber === 0) continue;

                for (let i = 0; i < balanceNumber; i++) {
                    try {
                        const tokenId = await ticketContract.tokenOfOwnerByIndex(userAddress, i);
                        const tokenIdStr = tokenId.toString();

                        const ticketData = await ticketContract.tickets(tokenId);

                        let tokenURI = "";

                        try {
                            tokenURI = await ticketContract.tokenURI(tokenId);
                        } catch (err) {
                            console.log("No tokenURI for token:", tokenIdStr);
                            console.error("Error in fetching: ", err)
                        }

                        const ticket = {
                            // Token info
                            tokenId: tokenIdStr,
                            contractAddress: event.ticketContract,
                            
                            // Event info
                            eventId: event.id.toString(),
                            eventName: event.name,
                            eventDate: event.date.toString(),
                            venue: event.venue,
                            eventDescription: event.description,
                            
                            // Ticket info
                            tier: ticketData.tier,
                            seatNumber: ticketData.seatNumber || "N/A",
                            buyerName: ticketData.buyerName || "Anonymous",
                            originalPrice: ticketData.originalPrice,
                            purchaseTimestamp: ticketData.purchaseTimestamp,
                            
                            // Status
                            used: ticketData.used,
                            transferLockUntil: ticketData.transferLockUntil,
                            
                            // Metadata
                            tokenURI: tokenURI,
                            
                            // Owner
                            ownerAddress: userAddress
                        };

                        userTickets.push(ticket);
                        console.log("Fetched ticket:", ticket);

                    } catch (tokenError) {
                        console.error(`Error fetching token ${i}:`, tokenError);
                    }
                }

            } catch (contractError) {
                console.error(`Error with contract ${event.ticketContract}:`, contractError);
            }
        }

        console.log("Total tickets fetched:", userTickets.length);

        return {
            success: true,
            tickets: userTickets
        };
    } catch(err) {
        console.error("FetchUserTickets failed:", err);
        return {
            success: false,
            error: err.message || "Failed to fetch tickets",
            tickets: []
        };
    }
}