
export async function uploadMetadataToIpfs(metadata) {
    try {
        const JWT = import.meta.env.VITE_PINATA_JWT
        console.log("📤 Uploading metadata to IPFS via Pinata...")
        const response = await fetch(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT}`
                },
                body: JSON.stringify(metadata)   
            }   
        )

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Pinata API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        const ipfsHash = data.IpfsHash
        console.log("✅ Metadata uploaded to IPFS:", ipfsHash)

        if (!ipfsHash) {
            throw new Error("No IPFS hash returned from Pinata")
        }

        return ipfsHash
    } catch(error) {
        console.error("IPFS Metadata upload failed: ", error)
    }
}

export function generateTicketMetadata(ticketInfo) {
    const {
        tokenId,
        eventName,
        eventDescription,
        eventDate,
        venue,
        tier,
        originalPrice,
        contractAddress,
        eventImageURI
    } = ticketInfo

    const date = new Date(Number(eventDate) * 1000)
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const metadata = {
        name: `${eventName} - ${tier} #${tokenId}`,
        description: `Ticket for ${eventName} at ${venue}. ${eventDescription || ''}`,
        image: eventImageURI || "", 
        attributes: [
            {
                trait_type: "Event",
                value: eventName
            },
            {
                trait_type: "Venue",
                value: venue
            },
            {
                trait_type: "Date",
                value: formattedDate
            },
            {
                trait_type: "Tier",
                value: tier
            },
            {
                trait_type: "Token ID",
                value: tokenId.toString()
            },
            {
                trait_type: "Contract Address",
                value: contractAddress
            },
            {
                trait_type: "Original Price (Wei)",
                value: originalPrice.toString()
            }
        ]
    }

    return metadata
}