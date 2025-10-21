import { Contract, formatEther } from "ethers"
import { getReadProvider } from "./getProvider"
import EventFactoryABI from "../abi/EventFactory.json"
import TicketNFTABI from "../abi/TicketNFT.json"

export default async function fetchBuyerHistory(userAddress) {
    try {
        if (!userAddress) {
            throw new Error("User address required")
        }

        const provider = await getReadProvider()
        
        const factoryAddress = import.meta.env.VITE_EVENTFACTORY
        if (!factoryAddress) {
            throw new Error("EventFactory address not configured")
        }

        const factory = new Contract(
            factoryAddress,
            EventFactoryABI.abi,
            provider
        )

        let allEvents
        try {
            allEvents = await factory.getAllEvents()
        } catch (error) {
            console.error("error fetching all events: ", error)
            allEvents = await factory.getAllEvents.staticCall()
        }

        const userHistory = []

        for (const event of allEvents) {
            if (event.ticketContract === "0x0000000000000000000000000000000000000000") {
                continue
            }

            try {
                const ticketContract = new Contract(
                    event.ticketContract,
                    TicketNFTABI.abi,
                    provider
                )

                const balance = await ticketContract.balanceOf(userAddress)
                const balanceNumber = Number(balance)

                if (balanceNumber === 0) continue

                for (let i = 0; i < balanceNumber; i++) {
                    try {
                        const tokenId = await ticketContract.tokenOfOwnerByIndex(userAddress, i)
                        const tokenIdStr = tokenId.toString()

                        const ticketData = await ticketContract.tickets(tokenId)

                        const historyItem = {
                            // Token info
                            tokenId: tokenIdStr,
                            contractAddress: event.ticketContract,
                            
                            // Event info
                            eventId: event.id.toString(),
                            eventName: event.name,
                            eventDescription: event.description || "",
                            eventDate: event.date.toString(),
                            venue: event.venue,
                            eventImageURI: event.imageURI,
                            
                            // Ticket info
                            tier: ticketData.tier,
                            originalPrice: ticketData.originalPrice,
                            originalPriceETH: formatEther(ticketData.originalPrice),
                            purchaseTimestamp: ticketData.purchaseTimestamp,
                            
                            // Status
                            used: ticketData.used,
                            
                            // Owner
                            ownerAddress: userAddress,

                            isPastEvent: Number(event.date) < Math.floor(Date.now() / 1000)
                        }

                        userHistory.push(historyItem)

                    } catch (tokenError) {
                        console.error(`❌ Error fetching token ${i}:`, tokenError)
                    }
                }

            } catch (contractError) {
                console.error(`❌ Error with contract ${event.ticketContract}:`, contractError)
            }
        }

        userHistory.sort((a, b) => Number(b.purchaseTimestamp) - Number(a.purchaseTimestamp))

        return {
            success: true,
            history: userHistory
        }

    } catch (error) {
        console.error("❌ fetchUserHistory failed:", error)
        return {
            success: false,
            error: error.message || "Failed to fetch history",
            history: []
        }
    }
}