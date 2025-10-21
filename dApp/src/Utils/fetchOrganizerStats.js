import { Contract, formatEther } from "ethers"
import { getReadProvider } from "./getProvider"
import EventFactoryABI from "../abi/EventFactory.json"
import TicketNFTABI from "../abi/TicketNFT.json"

export default async function fetchOrganizerStats(organizerAddress) {
    try {
        if (!organizerAddress) {
            throw new Error("Organizer address required")
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

        let organizerEvents
        try {
            organizerEvents = await factory.getEventsByOrganizer(organizerAddress)
        } catch (error) {
            console.log("Error fetch organizer events: ", error)
            organizerEvents = await factory.getEventsByOrganizer.staticCall(organizerAddress)
        }

        let totalTicketsSold = 0
        let totalRevenueWei = BigInt(0)
        const eventStats = []

        for (const event of organizerEvents) {
            try {
                if (event.ticketContract === "0x0000000000000000000000000000000000000000") {
                    eventStats.push({
                        eventId: event.id.toString(),
                        eventName: event.name,
                        ticketsSold: 0,
                        revenue: "0"
                    })
                    continue
                }

                const ticketContract = new Contract(
                    event.ticketContract,
                    TicketNFTABI.abi,
                    provider
                )

                const totalSupply = await ticketContract.totalSupply()
                const ticketCount = Number(totalSupply)

                let eventRevenue = BigInt(0)

                try {
                    const balance = await provider.getBalance(event.ticketContract)
                    eventRevenue = balance
                } catch (error) {
                    console.warn(` Error fetching balance of ${event.ticketContract}`, error)
                }

                if (eventRevenue === BigInt(0) && ticketCount > 0) {
                    try {
                        for (let i = 0; i < Math.min(ticketCount, 5); i++) {
                            try {
                                const tokenId = await ticketContract.tokenByIndex(i)
                                const ticket = await ticketContract.tickets(tokenId)
                                
                                if (ticket.originalPrice > 0) {
                                    eventRevenue = ticket.originalPrice * BigInt(ticketCount)
                                    console.log(`  → Estimated from ticket price: ${formatEther(eventRevenue)} ETH`)
                                    break
                                }
                            } catch (err) {
                                // Skip if can't get token
                            }
                        }
                    } catch (error) {
                        console.error("Calculation error: ", error)
                    }
                }

                totalTicketsSold += ticketCount
                totalRevenueWei += eventRevenue

                eventStats.push({
                    eventId: event.id.toString(),
                    eventName: event.name,
                    ticketsSold: ticketCount,
                    revenue: eventRevenue.toString(),
                    revenueETH: formatEther(eventRevenue)
                })

            } catch (error) {
                console.error(`❌ Error processing event ${event.name}:`, error)
                eventStats.push({
                    eventId: event.id.toString(),
                    eventName: event.name,
                    ticketsSold: 0,
                    revenue: "0",
                    error: error.message
                })
            }
        }

        const totalRevenueETH = formatEther(totalRevenueWei)

        return {
            success: true,
            stats: {
                totalEvents: organizerEvents.length,
                totalTicketsSold: totalTicketsSold,
                totalRevenue: totalRevenueWei.toString(),
                totalRevenueETH: totalRevenueETH,
                eventStats: eventStats
            }
        }
    } catch(error) {
        console.error("❌ fetchOrganizerStats failed:", error)
        return {
            success: false,
            error: error.message || "Failed to fetch organizer stats",
            stats: {
                totalEvents: 0,
                totalTicketsSold: 0,
                totalRevenue: "0",
                totalRevenueETH: "0",
                eventStats: []
            }
        }
    }
}