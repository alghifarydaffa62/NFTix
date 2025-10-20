import { BrowserProvider, Contract } from "ethers"
import TicketNFTABI from "../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"

export default async function BuyTicket({ ticketContractAddress, tierIndex, quantity, priceInWei }) {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed!");
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        if (!ticketContractAddress) {
            throw new Error("Invalid ticket contract address");
        }

        if (priceInWei === undefined || priceInWei === null) {
            throw new Error("Ticket price is missing.");
        }

        const ticketContract = new Contract(
            ticketContractAddress,
            TicketNFTABI.abi,
            signer
        );

        const quantityBigInt = BigInt(quantity);
        const pricePerTicketBigInt = BigInt(priceInWei);

        const totalPriceInWei = pricePerTicketBigInt * quantityBigInt;

        const tx = await ticketContract.buyTicket(
            tierIndex,
            quantity,
            {
                value: totalPriceInWei
            }
        );

        const receipt = await tx.wait();

        const tokenIds = [];

        const transferEvents = receipt.logs.filter(log => {
            try {
                const parsed = ticketContract.interface.parseLog(log);
                return parsed && parsed.name === 'Transfer';
            } catch {
                return false;
            }
        });

        for (const event of transferEvents) {
            const parsed = ticketContract.interface.parseLog(event);
            if (parsed && parsed.args.tokenId) {
                tokenIds.push(parsed.args.tokenId.toString());
            }
        }

        return {
            success: true,
            transactionHash: receipt.hash,
            tokenIds: tokenIds,
            contractAddress: ticketContractAddress,
            message: `Successfully purchased ${quantity} ticket(s)!`
        };

    } catch (error) {
        console.error("BuyTicket failed:", error);
        
        let errorMessage = "An unexpected error occurred.";

        if (error.code === 'INSUFFICIENT_FUNDS') {
            errorMessage = "Insufficient funds in your wallet to cover the ticket price plus gas fees. Please top up your ETH balance.";
        } 

        else if (error.reason) { 
            errorMessage = error.reason;
        } 

        else if (typeof error.message === 'string') {
             if (error.message.includes("user rejected transaction")) {
                errorMessage = "Transaction rejected in your wallet.";
            } else {
                errorMessage = error.message;
            }
        }
        
        return {
            success: false,
            error: errorMessage
        };
    }
}