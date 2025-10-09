
export default async function uploadToIPFS(file) {
    const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`
            },
            body: formData
        })

        const data = await response.json()

        console.log("Successfully uploaded to IPFS. Hash:", data.IpfsHash);
        return `ipfs://${data.IpfsHash}`;
    } catch (error) {
        console.error("IPFS upload failed: ", error)

        return null
    }
}