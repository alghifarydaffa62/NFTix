import { BrowserProvider, Contract, parseEther } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import uploadToIPFS from "./uploadToIPFS"

function dateToTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000)
}

export default async function CreateNewEvent(eventData) {
    const {
        name,
        desc,
        eventIMG,
        date,
        venue,
        maxParticipants,
        deadline,
        tiers
    } = eventData

    try {
        if(!window.ethereum) throw new Error("Metamask is not installed!")
        
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contractAddress = import.meta.env.VITE_EVENTFACTORY
        
        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            signer
        )

        console.log("Uploading image to IPFS...")
        const imageURI = await uploadToIPFS(eventIMG)
        console.log("Image URI: ", imageURI)

        const eventTimestamp = dateToTimestamp(date)
        const deadlineTimestamp = dateToTimestamp(deadline)
        const now = Math.floor(Date.now() / 1000)

        if (eventTimestamp <= now) {
            throw new Error("Event date must be in the future")
        }

        if (deadlineTimestamp >= eventTimestamp) {
            throw new Error("Deadline must be before event date")
        }

        if (deadlineTimestamp <= now) {
            throw new Error("Deadline must be in the future")
        }

        if (!tiers || tiers.length === 0) {
            throw new Error("At least one tier is required")
        }

        const formattedTiers = tiers.map((tier, index) => {
            console.log(`  Tier ${index + 1}: ${tier.name} - ${tier.price} ETH - ${tier.maxSupply} tickets`)
            
            return {
                name: tier.name,
                price: parseEther(tier.price.toString()), 
                maxSupply: BigInt(tier.maxSupply),
                sold: BigInt(0)
            }
        })

        const params = {
            name: name,
            desc: desc,
            imageURI: imageURI,
            date: BigInt(eventTimestamp),
            venue: venue,
            maxParticipant: BigInt(parseInt(maxParticipants)),
            deadline: BigInt(deadlineTimestamp),
            tiers: formattedTiers
        }
        
        const tx = await eventFactory.createEvent(params)
        const receipt = await tx.wait()

        let eventId = null
        let ticketContract = null

        for (const log of receipt.logs) {
            try {
                const parsed = eventFactory.interface.parseLog({
                    topics: log.topics,
                    data: log.data
                })

                if (parsed && parsed.name === 'EventCreated') {
                    eventId = parsed.args[0] 
                    ticketContract = parsed.args[4]  
                    
                    console.log("✅ Event created successfully!")
                    console.log("   Event ID:", eventId.toString())
                    console.log("   Ticket Contract:", ticketContract)
                    break
                }
            } catch (parseError) {
                continue
            }
        }

        if (!eventId) {
            console.warn("⚠️ Could not parse EventCreated from logs")
            console.log("   Fetching event ID from contract state...")
            
            try {
                const allEvents = await eventFactory.getAllEvents()
                const latestEvent = allEvents[allEvents.length - 1]
                eventId = latestEvent.id
                ticketContract = latestEvent.ticketContract
                
                console.log("✅ Event ID from contract:", eventId.toString())
            } catch (fallbackError) {
                console.error("❌ Could not fetch event ID:", fallbackError)
            }
        }

        return {
            success: true,
            eventId: eventId ? eventId.toString() : null,
            ticketContract: ticketContract || null,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString(),
            message: "Event created successfully!"
        }

    } catch(error) {
        console.error("Event creating failed!: ", error)

        let errorMessage = error.message

        return {
            success: false,
            error: errorMessage
        }
    }
}