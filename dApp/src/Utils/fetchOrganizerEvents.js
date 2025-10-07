import { BrowserProvider, Contract } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import { ethers } from "ethers"

export default async function fetchOrganizerEvents(userAddress) {
    const contractAddress = "0xDEB53a5484de3B6eacC691D9552f189FeAf98141"
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const eventFactory = new Contract(
        contractAddress,
        EventFactoryABI.abi,
        signer
    )
    
    const organizerEventIds = await eventFactory.getOrganizerEvent(userAddress)

    return organizerEventIds
}