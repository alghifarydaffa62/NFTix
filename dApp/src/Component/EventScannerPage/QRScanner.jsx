import { useEffect, useRef} from 'react'
import { Html5QrcodeScanner} from 'html5-qrcode'

export default function QRScanner({ onScan, onError, scanning }) {
    const scannerRef = useRef(null)

    useEffect(() => {
        if (!scannerRef.current && scanning) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    disableFlip: false
                },
                false
            )

            scanner.render(
                (decodedText) => {
                    console.log("QR Code scanned:", decodedText)
                    scanner.clear()
                    onScan(decodedText)
                },
                (errorMessage) => {
                    if (!errorMessage.includes("NotFoundException")) {
                        console.warn("QR Scan error:", errorMessage)
                        if (onError) onError(errorMessage)
                    }
                }
            )

            scannerRef.current = scanner
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Cleanup error:", err))
                scannerRef.current = null
            }
        }
    }, [scanning]) 

    return (
        <div>
            <div id="qr-reader" className="w-full"></div>
            <p className="text-sm text-gray-600 text-center mt-4">
                Position QR code within the frame
            </p>
        </div>
    )
}