import { Contract, formatEther } from "ethers"
import { getReadProvider } from "./getProvider"
import EventFactoryABI from "../abi/EventFactory.json"
import TicketNFTABI from "../abi/TicketNFT.json"

export default async function fetchEventStats(eventId) {
    try {
        if (!eventId) {
            throw new Error("Event ID required")
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
            console.error("Error fetching all events: ", error)
            allEvents = await factory.getAllEvents.staticCall()
        }

        const event = allEvents.find(e => e.id.toString() === eventId.toString())
        
        if (!event) {
            throw new Error("Event not found")
        }

        if (event.ticketContract === "0x0000000000000000000000000000000000000000") {
            return {
                success: true,
                stats: {
                    eventName: event.name,
                    totalTicketsSold: 0,
                    totalRevenue: "0",
                    totalRevenueETH: "0",
                    tierBreakdown: [],
                    hasTicketContract: false
                }
            }
        }

        const ticketContract = new Contract(
            event.ticketContract,
            TicketNFTABI.abi,
            provider
        )


        const totalSupply = await ticketContract.totalSupply()
        const totalTicketsSold = Number(totalSupply)

        const tierCount = await ticketContract.getAllTiers()

        const tierBreakdown = []
        let totalRevenueWei = BigInt(0)

        for (let i = 0; i < tierCount.length; i++) {
            try {
                const tier = await ticketContract.tiers(i)
                
                const tierData = {
                    tierIndex: i,
                    name: tier.name,
                    price: tier.price.toString(),
                    priceETH: formatEther(tier.price),
                    maxSupply: Number(tier.maxSupply),
                    sold: Number(tier.sold),
                    available: Number(tier.maxSupply) - Number(tier.sold)
                }

                const tierRevenue = tier.price * BigInt(tier.sold)
                tierData.revenue = tierRevenue.toString()
                tierData.revenueETH = formatEther(tierRevenue)

                totalRevenueWei += tierRevenue

                tierBreakdown.push(tierData)
            } catch (error) {
                console.error(`  ❌ Error fetching tier ${i}:`, error)
            }
        }

        let actualBalance = BigInt(0)
        try {
            actualBalance = await provider.getBalance(event.ticketContract)
        } catch (error) {
            console.error("error fetching contract balance: ", error)
        }

        const finalRevenue = actualBalance > 0 ? actualBalance : totalRevenueWei
        const finalRevenueETH = formatEther(finalRevenue)

        return {
            success: true,
            stats: {
                eventId: eventId.toString(),
                eventName: event.name,
                eventDescription: event.description || "",
                eventDate: event.date.toString(),
                eventVenue: event.venue,
                ticketContractAddress: event.ticketContract,
                totalTicketsSold: totalTicketsSold,
                totalRevenue: finalRevenue.toString(),
                totalRevenueETH: finalRevenueETH,
                tierBreakdown: tierBreakdown,
                hasTicketContract: true
            }
        }
    } catch(error) {
        console.error("❌ fetchEventStats failed:", error)
        return {
            success: false,
            error: error.message || "Failed to fetch event stats",
            stats: {
                totalTicketsSold: 0,
                totalRevenue: "0",
                totalRevenueETH: "0",
                tierBreakdown: [],
                hasTicketContract: false
            }
        }
    }
}