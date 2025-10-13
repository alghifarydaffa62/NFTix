import { BrowserProvider, Contract } from "ethers"
import TicketNFTABI from "../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"

export default async function BuyTicket({ ticketContractAddress, tierIndex, quantity }) {
    try {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const user = signer.getAddress()

        if (!ticketContractAddress || ticketContractAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid ticket contract address")
        }

        if (tierIndex < 0) {
            throw new Error("Invalid tier index")
        }

        if (quantity <= 0 || quantity > 3) {
            throw new Error("Quantity must be between 1 and 3")
        }

        const ticketContract = new Contract (
            ticketContractAddress,
            TicketNFTABI.abi,
            signer
        )

        const tier = ticketContract.getTier(tierIndex)
        const price = tier.price
        const totalPrice = price * BigInt(quantity)

        const available = tier.maxSupply - tier.sold
        if (available < BigInt(quantity)) {
            throw new Error(`Only ${available.toString()} tickets available in this tier`)
        }

        const purchasedCount = await ticketContract.purchasedCount(user)
        if (purchasedCount + BigInt(quantity) > 3n) {
            throw new Error(`You can only buy maximum 3 tickets. You already have ${purchasedCount.toString()}.`)
        }

        const saleActive = await ticketContract.saleActive()
        if (!saleActive) {
            throw new Error("Ticket sales are not active")
        }

        const eventDate = await ticketContract.eventDate()
        const now = Math.floor(Date.now() / 1000)
        if (now >= Number(eventDate)) {
            throw new Error("Event has already started or ended")
        }

        const tx = await ticketContract.buyTicket(
            tierIndex,
            quantity,
            {
                value: totalPrice
            }
        )

        const receipt = await tx.wait()

        let tokenIds = []

        for (const log of receipt.logs) {
            try {
                const parsed = ticketContract.interface.parseLog({
                    topics: log.topics,
                    data: log.data
                })

                if (parsed && parsed.name === 'TicketsPurchased') {
                    tokenIds = parsed.args.tokenIds.map(id => id.toString())
                    console.log("✅ Token IDs minted:", tokenIds)
                    break
                }
            } catch (parseError) {
                continue
            }
        }

        return {
            success: true,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            tokenIds: tokenIds,
            quantity: quantity,
            totalPrice: (Number(totalPrice) / 1e18).toFixed(4) + " ETH",
            gasUsed: receipt.gasUsed.toString(),
            message: `Successfully purchased ${quantity} ticket(s)!`
        }
    } catch(error) {
        let errorMessage = "An unexpected error occurred"

        if (error.message) {
            if (error.message.includes("Exceed ticket buy limit")) {
                errorMessage = "You've reached the maximum purchase limit (3 tickets per wallet)"
            }
            else if (error.message.includes("Invalid tier")) {
                errorMessage = "Invalid ticket tier selected"
            }
            else if (error.message.includes("Tier sold out")) {
                errorMessage = "This ticket tier is sold out"
            }
            else if (error.message.includes("Insufficient payment")) {
                errorMessage = "Insufficient payment amount"
            }
            else if (error.message.includes("sale not active")) {
                errorMessage = "Ticket sales are not active"
            }
            else if (error.message.includes("Event closed")) {
                errorMessage = "Event registration has closed"
            }
            else if (error.message.includes("Tickets are not ready")) {
                errorMessage = "Tickets are not ready for sale yet"
            }
            else if (error.message.includes("revert")) {
                const revertMatch = error.message.match(/revert (.+?)["'\n]/i)
                if (revertMatch) {
                    errorMessage = `Contract error: ${revertMatch[1]}`
                } else {
                    errorMessage = "Transaction reverted. Please try again."
                }
            }
            else {
                errorMessage = error.message
            }
        }

        return {
            success: false,
            error: errorMessage,
            details: {
                code: error.code,
                message: error.message
            }
        }   
    }
}