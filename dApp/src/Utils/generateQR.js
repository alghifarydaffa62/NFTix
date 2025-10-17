// src/Utils/generateQR.js

import QRCode from "qrcode"
import { getSignerProvider } from "./getProvider"

export default async function GenerateQR({ tokenId, contractAddress, ownerAddress, eventId }) {
    try {
        console.log("🔐 GenerateQR: Getting signer provider...")

        const { provider, signer } = await getSignerProvider()

        console.log("📝 GenerateQR: Creating QR payload...")

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

        console.log("✍️ GenerateQR: Signing message...")

        const signature = await signer.signMessage(message)

        console.log("✅ GenerateQR: Message signed")

        const signedPayload = {
            ...qrPayload,
            signature: signature
        }

        const qrDataString = JSON.stringify(signedPayload)

        console.log("🎨 GenerateQR: Generating QR code image...")

        const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
            errorCorrectionLevel: 'H',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })

        console.log("✅ GenerateQR: QR code generated successfully")

        return {
            success: true,
            qrCodeImage: qrCodeDataURL,
            qrData: signedPayload
        }
        
    } catch (error) {
        console.error("❌ GenerateQR failed:", error)
        
        // Better error messages
        let errorMessage = "Failed to generate QR code"
        
        if (error.message.includes("user rejected")) {
            errorMessage = "Signature request was rejected. Please approve the signature request."
        } else if (error.message.includes("No wallet")) {
            errorMessage = "No wallet connected. Please connect your wallet first."
        } else if (error.message) {
            errorMessage = error.message
        }
        
        return {
            success: false,
            error: errorMessage
        }
    }
}