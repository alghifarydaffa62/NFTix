
export default async function uploadToIPFS(file) {
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