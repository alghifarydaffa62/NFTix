import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QRScanner({ onScan, onError }) {
    const scannerRef = useRef(null)
    const [scanning, setScanning] = useState(false)

    useEffect(() => {
        if (!scannerRef.current || scanning) return

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                },
                aspectRatio: 1.0,
                disableFlip: false
            },
            false
        )

        scanner.render(
            (decodedText, decodedResult) => {
                console.log("QR Code scanned:", decodedText)
                scanner.clear()
                onScan(decodedText)
            },
            (errorMessage) => {
                if (!errorMessage.includes("NotFoundException")) {
                    console.warn("QR Scan error:", errorMessage)
                }
            }
        )

        setScanning(true)
        scannerRef.current = scanner

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Scanner cleanup error:", err))
            }
        }
    }, [])

    return (
        <div>
            <div id="qr-reader" className="w-full"></div>
            <p className="text-sm text-gray-600 text-center mt-4">
                Position QR code within the frame
            </p>
        </div>
    )
}