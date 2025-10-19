import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QRScanner({ onScan, onError }) {
    const scannerRef = useRef(null)
    const containerRef = useRef(null)
    const [isInitializing, setIsInitializing] = useState(true)
    const hasScannedRef = useRef(false)

    useEffect(() => {
        let scanner = null
        let isMounted = true

        const initScanner = async () => {
            if (scannerRef.current || !containerRef.current) {
                return
            }

            try {
                setIsInitializing(true)
                hasScannedRef.current = false

                console.log("🎥 Initializing QR scanner...")

                scanner = new Html5QrcodeScanner(
                    "qr-reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        disableFlip: false,
                        showTorchButtonIfSupported: true,
                        showZoomSliderIfSupported: true
                    },
                    false 
                )

                const onScanSuccess = (decodedText, decodedResult) => {
                    if (hasScannedRef.current) {
                        console.log("⚠️ Already scanned, ignoring duplicate")
                        return
                    }

                    hasScannedRef.current = true
                    console.log("✅ QR Code scanned:", decodedText)

                    if (scanner && isMounted) {
                        scanner.clear()
                            .then(() => {
                                scannerRef.current = null
                                if (isMounted) {
                                    onScan(decodedText)
                                }
                            })
                            .catch(err => {
                                console.error("❌ Error clearing scanner:", err)
                                scannerRef.current = null
                                if (isMounted) {
                                    onScan(decodedText)
                                }
                            })
                    }
                }

                const onScanError = (errorMessage) => {
                    if (
                        errorMessage.includes("NotFoundException") ||
                        errorMessage.includes("No MultiFormat Readers") ||
                        errorMessage.includes("QR code parse error")
                    ) {

                        return
                    }

                    console.warn("⚠️ QR Scan warning:", errorMessage)
                }

                await scanner.render(onScanSuccess, onScanError)

                if (isMounted) {
                    scannerRef.current = scanner
                    setIsInitializing(false)
                    console.log("✅ Scanner initialized successfully")
                }

            } catch (error) {
                console.error("❌ Failed to initialize scanner:", error)
                
                if (isMounted) {
                    setIsInitializing(false)

                    if (onError) {
                        onError(error.message || "Failed to start camera")
                    }
                }
            }
        }

        const timer = setTimeout(() => {
            if (isMounted) {
                initScanner()
            }
        }, 100)

        return () => {
            isMounted = false
            clearTimeout(timer)

            if (scannerRef.current) {
                console.log("🧹 Cleaning up scanner...")
                
                scannerRef.current.clear()
                    .then(() => {
                        console.log("✅ Scanner cleaned up")
                        scannerRef.current = null
                    })
                    .catch(err => {
                        console.error("❌ Cleanup error:", err)
                        scannerRef.current = null
                    })
            }
        }
    }, []) 

    return (
        <div ref={containerRef}>
            {isInitializing && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-600">Starting camera...</p>
                    </div>
                </div>
            )}

            <div id="qr-reader" className="w-full"></div>
            
            <p className="text-sm text-gray-600 text-center mt-4">
                📱 Position QR code within the frame
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800 text-center">
                    💡 Hold steady for 1-2 seconds for best results
                </p>
            </div>
        </div>
    )
}