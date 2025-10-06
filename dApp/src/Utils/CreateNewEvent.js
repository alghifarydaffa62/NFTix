import { BrowserProvider, Contract } from "ethers"
import EventFactory from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"

const contractAddress = ""

export default async function CreateNewEvent(
    _name, 
    _desc, 
    _eventIMG, 
    _date, 
    _venue, 
    _maxParticipant, 
    _deadline 
) {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const EventFactory = new Contract(
        contractAddress,
        EventFactory.abi,
        signer
    )

    const tx = await EventFactory.createEvent(_name, _desc, _eventIMG, _date, _venue, _maxParticipant, _deadline)
    await tx.wait()

    return {
        
    }
}