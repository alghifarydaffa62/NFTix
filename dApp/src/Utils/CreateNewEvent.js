import { BrowserProvider, Contract, parseUnits } from "ethers"
import EventFactoryABI from "../../../artifacts/contracts/EventFactory.sol/EventFactory.json"

async function uploadToIPFS(file) {
    const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
    const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET

    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_api_secret': PINATA_API_SECRET
            },
            body: FormData
        })

        const data = await response.json()
        return  `ipfs://${data.IpfsHash}`
    } catch (error) {
        console.error("IPFS upload failed: ", error)

        return "ipfs://QmTest123"
    }
}

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
        if(!window.ethereu) throw new Error("Metamask is not installed!")
        
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contractAddress = "0xDEB53a5484de3B6eacC691D9552f189FeAf98141"
        
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