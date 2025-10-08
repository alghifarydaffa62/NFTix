import { BrowserProvider, Contract, parseUnits } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import uploadToIPFS from "./uploadToIPFS"

function dateToTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000)
}

export default async function CreateNewEvent(
    _name, 
    _desc, 
    _eventIMG, 
    _date, 
    _venue, 
    _maxParticipant, 
    _deadline 
) {
    try {
        if(!window.ethereum) throw new Error("Metamask is not installed!")
        
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contractAddress = "0xDF82389BD2C9Abd2a15C099bd237C63D7C6A0d47"
        
        const eventFactory = new Contract(
            contractAddress,
            EventFactoryABI.abi,
            signer
        )

        console.log("Uploading image to IPFS...")
        const imageURI = await uploadToIPFS(_eventIMG)
        console.log("Image URI: ", imageURI)

        const eventTimestamp = dateToTimestamp(_date)
        const deadlineTimestamp = dateToTimestamp(_deadline)

        if (eventTimestamp <= Math.floor(Date.now() / 1000)) {
            throw new Error("Event date must be in the future");
        }
        
        if (deadlineTimestamp >= eventTimestamp) {
            throw new Error("Deadline must be before event date");
        }

        console.log("Creating event on blockchain...");

        const tx = await eventFactory.createEvent(
            _name, 
            _desc, 
            imageURI, 
            eventTimestamp, 
            _venue, 
            parseInt(_maxParticipant), 
            deadlineTimestamp
        )

        console.log("Transaction confirmed: ", tx.hash)

        const receipt = await tx.wait()

        const eventCreatedSuccess = receipt.logs.find(
            log => log.fragment?.name === 'EventCreated'
        )

        const eventId =  eventCreatedSuccess ? eventCreatedSuccess.args[0] : null

        console.log("Event created with ID:", eventId?.toString());

        return {
            success: true,
            eventId: eventId?.toString(),
            transactionHash: tx.hash,
            message: "Event Created Successfully!"
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