// src/Utils/fetchUserTicket.js

import { Contract } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import TicketNFTABI from "../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"
import { getReadProvider } from "./getProvider"

export default async function FetchUserTicket(userAddress) {
    try {
        if (!userAddress) {
            throw new Error("User address required");
        }

        const provider = await getReadProvider()

        const factoryAddress = import.meta.env.VITE_EVENTFACTORY;

        if (!factoryAddress) {
            throw new Error("EventFactory address not configured");
        }

        const factory = new Contract(
            factoryAddress,
            EventFactoryABI.abi,
            provider
        );

        let allEvents
        try {
            allEvents = await factory.getAllEvents()
        } catch (error) {
            console.log("⚠️ Normal call failed, trying staticCall...")
            allEvents = await factory.getAllEvents.staticCall()
        }

        const userTickets = [];

        for (const event of allEvents) {
            if (event.ticketContract === "0x0000000000000000000000000000000000000000") {
                console.log(`⏭️ Skipping ${event.name}: No ticket contract`)
                continue;
            }

            try {

                const ticketContract = new Contract(
                    event.ticketContract,
                    TicketNFTABI.abi,
                    provider
                );

                const balance = await ticketContract.balanceOf(userAddress);
                const balanceNumber = Number(balance);

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
                            console.log(`    ⚠️ No tokenURI for token ${tokenIdStr}`)
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

                    } catch (tokenError) {
                        console.error(`    ❌ Error fetching token ${i}:`, tokenError);
                    }
                }

            } catch (contractError) {
                console.error(`❌ Error with contract ${event.ticketContract}:`, contractError);
            }
        }

        return {
            success: true,
            tickets: userTickets
        };

    } catch(err) {
        console.error("❌ FetchUserTicket failed:", err);
        return {
            success: false,
            error: err.message || "Failed to fetch tickets",
            tickets: []
        };
    }
}