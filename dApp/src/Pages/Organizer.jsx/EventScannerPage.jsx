import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract } from "ethers";
import QRScanner from "../../Component/EventScannerPage/QRScanner";
import EventFactoryABI from "../../../../artifacts/contracts/EventFactory.sol/EventFactory.json"
import TicketNFTABI from "../../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"
import PageHeader from "../../Component/EventScannerPage/PageHeader";
import StartScanner from "../../Component/EventScannerPage/StartScanner";
import ValidVerification from "../../Component/EventScannerPage/ValidVerification";
import InvalidVerification from "../../Component/EventScannerPage/InvalidVerification";
import ScannedTickets from "../../Component/EventScannerPage/ScannedTickets";
import Loading from "../../Component/Loading";

export default function EventScannerPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const { address, isConnected } = useAppKitAccount()
    
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [scanning, setScanning] = useState(false)
    const [verificationResult, setVerificationResult] = useState(null)
    const [scannedTickets, setScannedTickets] = useState([])

    useEffect(() => {
        if (!isConnected) {
            navigate("/connect")
            return
        }

        fetchEventDetails()
    }, [eventId, isConnected])

    const fetchEventDetails = async () => {
        try {
            setLoading(true)
            
            if (!window.ethereum) {
                throw new Error("MetaMask not installed")
            }

            const provider = new BrowserProvider(window.ethereum)
            const factoryAddress = import.meta.env.VITE_EVENTFACTORY
            
            const factory = new Contract(
                factoryAddress,
                EventFactoryABI.abi,
                provider
            )

            const allEvents = await factory.getAllEvents()
            const eventData = allEvents.find(e => e.id.toString() === eventId)

            if (!eventData) {
                throw new Error("Event not found")
            }

            if (eventData.organizer.toLowerCase() !== address.toLowerCase()) {
                throw new Error("You are not the organizer of this event")
            }

            setEvent(eventData)

        } catch (error) {
            console.error("Failed to fetch event:", error)
            alert(error.message)
            navigate("/organizer/my-events")
        } finally {
            setLoading(false)
        }
    }

    const handleQRScanned = async (qrData) => {
        console.log("📋 QR Scanned, stopping scanner...")
        setScanning(false) 

        setTimeout(async () => {
            await verifyTicket(qrData)
        }, 300)
    }

    const handleScanError = (error) => {
        console.error("❌ Scanner error:", error)
        alert(`Scanner error: ${error}\n\nPlease try again or use Developer Mode.`)
        setScanning(false)
    }

    const verifyTicket = async (qrData) => {
        setVerificationResult({ status: "verifying" })

        try {
            let ticketData
            if (typeof qrData === 'string') {
                ticketData = JSON.parse(qrData)
            } else {
                ticketData = qrData
            }


            if (!ticketData.ticketId || !ticketData.contractAddress) {
                throw new Error("Invalid QR code format")
            }

            const provider = new BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            
            const ticketContract = new Contract(
                event.ticketContract,
                TicketNFTABI.abi,
                signer
            )

            let ticketInfo
            try {
                ticketInfo = await ticketContract.tickets(ticketData.ticketId)
            } catch (error) {
                console.error("Error fetching ticket: ", error)
                throw new Error("Ticket does not exist")
            }

            const currentOwner = await ticketContract.ownerOf(ticketData.ticketId)

            if (ticketData.ownerAddress && ticketData.ownerAddress !== "0x0000000000000000000000000000000000000000") {
                if (currentOwner.toLowerCase() !== ticketData.ownerAddress.toLowerCase()) {
                    throw new Error("Owner mismatch")
                }
            }

            if (ticketInfo.used) {
                throw new Error("Ticket already used")
            }

            if (ticketData.eventId && ticketData.eventId !== eventId) {
                throw new Error("Ticket is for a different event")
            }

            try {
                const tx = await ticketContract.markAsUsed(ticketData.ticketId)
                await tx.wait()
            } catch (markError) {
                console.error("❌ markAsUsed failed:", markError)

                let errorReason = "Failed to mark ticket as used"
                
                if (markError.message.includes("Too early")) {
                    errorReason = "Check-in Too Early"
                } else if (markError.message.includes("Too late")) {
                    errorReason = "Check-in Too Late"
                } else if (markError.message.includes("already used")) {
                    errorReason = "Ticket Already Used"
                } else if (markError.reason) {
                    errorReason = markError.reason
                } else if (markError.message) {
                    errorReason = markError.message
                }
                
                throw new Error(errorReason)
            }

            const result = {
                status: "valid",
                tokenId: ticketData.ticketId,
                tier: ticketInfo.tier,
                owner: currentOwner,
                timestamp: new Date().toLocaleString()
            }

            setVerificationResult(result)
            setScannedTickets(prev => [result, ...prev])
        } catch (error) {
            console.error("❌ Verification failed:", error)

            let displayReason = error.message || "Verification failed"

            if (displayReason.includes("execution reverted:")) {
                displayReason = displayReason.split("execution reverted:")[1].trim()
            }

            setVerificationResult({
                status: "invalid",
                reason: displayReason
            })
        }
    }

    const handleScanAgain = () => {
        setVerificationResult(null)
        setScanning(true) 
    }

    if (loading) {
        return <Loading type="scanner"/>
    }

    return(
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                
                <PageHeader 
                    event={event} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Scanner */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Scan Ticket</h2>

                        {   scanning ? (
                                <div key={Date.now()}>
                                    <QRScanner
                                        onScan={handleQRScanned}
                                        onError={handleScanError}
                                    />

                                    <button
                                        onClick={() => {
                                            console.log("🛑 User cancelled scan")
                                            setScanning(false)
                                        }}
                                        className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Cancel Scanning
                                    </button>
                                </div>
                            ) : (
                                <StartScanner setScanning={setScanning}/>
                            )}

                        {verificationResult && (
                            <div className="mt-6">
                                {verificationResult.status === "verifying" && (
                                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                                        <svg className="animate-spin h-12 w-12 mx-auto text-yellow-600 mb-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <p className="font-semibold text-yellow-900">Verifying...</p>
                                    </div>
                                )}

                                {verificationResult.status === "valid" && (
                                    <ValidVerification 
                                        verificationResult={verificationResult} 
                                        setVerificationResult={setVerificationResult}
                                        onScanAgain={handleScanAgain}
                                    />
                                )}

                                {verificationResult.status === "invalid" && (
                                    <InvalidVerification
                                        verificationResult={verificationResult} 
                                        setVerificationResult={setVerificationResult}
                                        onScanAgain={handleScanAgain}
                                    />  
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Entry Log ({scannedTickets.length})
                        </h2>

                        {scannedTickets.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No tickets scanned yet</p>
                        ) : (
                            <ScannedTickets scannedTickets={scannedTickets}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}