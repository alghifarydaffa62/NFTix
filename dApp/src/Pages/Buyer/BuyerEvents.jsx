import { useAppKitAccount } from "@reown/appkit/react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../Component/Sidebar";
import FetchUserTicket from "../../Utils/fetchUserTicket";
import GenerateQR from "../../Utils/generateQR"
import QRModal from "../../Component/BuyerEventsPage/QRModal";
import PageHeader from "../../Component/BuyerEventsPage/PageHeader";
import TicketList from "../../Component/BuyerEventsPage/TicketList";

const InitialLoader = () => (
    <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading...</p>
        </div>
    </div>
);

export default function BuyerEvents() {
    const { address, isConnected } = useAppKitAccount()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showQRModal, setShowQRModal] = useState(false)
    const [generatingQR, setGeneratingQR] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isChecking && !isConnected) {
            navigate("/connect")
        }
    }, [isChecking, isConnected, navigate])

    useEffect(() => {
        if (isConnected && address) {
            const timer = setTimeout(() => {
                loadTickets()
            })

            return() => clearTimeout(timer)
        }
    }, [isConnected, address])

    if(!isConnected) {
        navigate('/connect')
    }

    console.log("Apakah connect ?", isConnected)
    console.log("address: ", address)

    const loadTickets = async () => {
        setLoading(true)
        try {
            const result = await FetchUserTicket(address)
            
            if (result.success) {
                const now = Math.floor(Date.now() / 1000) 
                const activeTickets = result.tickets.filter(ticket => {
                    const eventDate = Number(ticket.eventDate)
                    return eventDate > now && !ticket.used
                })
                setTickets(activeTickets)
            } else {
                console.error("Failed to fetch tickets:", result.error)
            }
        } catch (error) {
            console.error("Failed to load tickets:", error)
            setTickets([])
        } finally {
            setLoading(false)
        }
    }

    const handleShowQR = async (ticket) => {
        setSelectedTicket(ticket)
        if (ticket.qrCode) {
            setShowQRModal(true)
            return
        }

        setGeneratingQR(true)
        try {
            const qrResult = await GenerateQR({
                tokenId: ticket.tokenId,
                contractAddress: ticket.contractAddress,
                ownerAddress: address,
                eventId: ticket.eventId
            })

            if (qrResult.success) {
                const updatedTicket = {
                    ...ticket,
                    qrCode: qrResult.qrCodeImage
                }
                setSelectedTicket(updatedTicket)

                setTickets(prevTickets => 
                    prevTickets.map(t => 
                        t.tokenId === ticket.tokenId && t.contractAddress === ticket.contractAddress
                            ? updatedTicket
                            : t
                    )
                )
            } else {
                console.error("QR generation failed:", qrResult.error)
                return
            }
        } catch (error) {
            console.error("Error generating QR:", error)
            return
        } finally {
            setGeneratingQR(false)
        }

        setShowQRModal(true)
    }

    if (isChecking) {
        return (
            <InitialLoader/>
        )
    }

    return(
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>
            <main className="flex-1 p-8 overflow-y-scroll">
                <PageHeader onRefresh={loadTickets} loading={loading}/>
                <TicketList tickets={tickets} loading={loading} onShowQR={handleShowQR} generatingQR={generatingQR} selectedTicket={selectedTicket}/>
                <QRModal showQRModal={showQRModal} selectedTicket={selectedTicket} setShowQRModal={setShowQRModal}/>
            </main>
        </div>
    )
}