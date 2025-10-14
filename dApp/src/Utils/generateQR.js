
import QRCode from "qrcode"
import { BrowserProvider } from "ethers"

export default async function GenerateQR({ tokenId, contractAddress, ownerAddress, eventId }) {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed");
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const qrPayload = {
            ticketId: tokenId,
            contractAddress: contractAddress,
            ownerAddress: ownerAddress,
            eventId: eventId || "",
            timestamp: Date.now()
        }

        const message = JSON.stringify({
            ticketId: tokenId,
            contractAddress: contractAddress,
            ownerAddress: ownerAddress,
            timestamp: qrPayload.timestamp
        })

        const signature = await signer.signMessage(message)

        const signedPayload = {
            ...qrPayload,
            signature: signature
        }

        const qrDataString = JSON.stringify(signedPayload)

        const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
            errorCorrectionLevel: 'H',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })

        return {
            success: true,
            qrCodeImage: qrCodeDataURL,
            qrData: signedPayload
        }
        
    } catch (error) {
        console.error("QR Generation failed:", error);
        return {
            success: false,
            error: error.message || "Failed to generate QR code"
        };
    }
}