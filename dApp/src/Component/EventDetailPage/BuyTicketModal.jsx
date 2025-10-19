import { useState } from "react"
import { useAppKitAccount } from "@reown/appkit/react"
import { Contract } from "ethers"
import { generateTicketMetadata, uploadMetadataToIpfs } from "../../Utils/uploadMetadataToIPFS"
import BuyTicket from "../../Utils/BuyTicket"
import GenerateQR from "../../Utils/generateQR"
import { getSignerProvider } from "../../Utils/getProvider"
import TicketNFTABI from "../../../../artifacts/contracts/TicketNFT.sol/TicketNFT.json"

export default function BuyTicketModal({ event, tier, onClose, onSuccess }) {
    const { address } = useAppKitAccount()
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [txHash, setTxHash] = useState("")
    const [tokenIds, setTokenIds] = useState([])
    const [uploadingMetadata, setUploadingMetadata] = useState(false)

    const pricePerTicket = parseFloat(tier.priceInEth)
    const totalPrice = pricePerTicket * quantity
    const displayTotalPrice = totalPrice

    const handleBuy = async () => {
        setError("")
        setLoading(true)

        try {
            console.log("🎫 Step 1: Buying tickets...")

            const result = await BuyTicket({
                ticketContractAddress: event.ticketContract,
                tierIndex: tier.tierIndex,
                quantity: quantity,
                priceInWei: tier.price
            })

            if (!result.success) {
                throw new Error(result.error || "Purchase failed")
            }

            console.log("✅ Tickets purchased, TokenIDs:", result.tokenIds)

            setSuccess(true)
            setTxHash(result.transactionHash)
            setTokenIds(result.tokenIds)

            console.log("🔐 Step 2: Generating QR codes...")

            const qrGenerationPromises = result.tokenIds.map(tokenId =>
                GenerateQR({
                    tokenId: tokenId,
                    contractAddress: event.ticketContract,
                    ownerAddress: address,
                    eventId: event.id.toString()
                })
            )

            const qrResults = await Promise.all(qrGenerationPromises)
            console.log("✅ QR codes generated")

            console.log("📤 Step 3: Uploading metadata to IPFS...")
            setUploadingMetadata(true)

            const { provider, signer } = await getSignerProvider()
            const ticketContract = new Contract(
                event.ticketContract,
                TicketNFTABI.abi,
                signer
            )

            for (let i = 0; i < result.tokenIds.length; i++) {
                try {
                    const tokenId = result.tokenIds[i]

                    const ticketData = await ticketContract.tickets(tokenId)

                    const metadata = generateTicketMetadata({
                        tokenId: tokenId.toString(),
                        eventName: event.name,
                        eventDescription: event.description,
                        eventDate: event.date,
                        venue: event.venue,
                        tier: tier.name,
                        originalPrice: ticketData.originalPrice,
                        contractAddress: event.ticketContract,
                        eventImageURI: event.imageURI
                    })

                    console.log(`📝 Metadata for Token #${tokenId}:`, metadata)

                    const ipfsHash = await uploadMetadataToIpfs(metadata)
                    const tokenURI = `ipfs://${ipfsHash}`

                    console.log(`✅ Token #${tokenId} metadata uploaded: ${tokenURI}`)

                    // STEP 4: Set tokenURI on-chain
                    console.log(`🔗 Setting tokenURI for Token #${tokenId}...`)
                    
                    const setURITx = await ticketContract.setTokenURI(tokenId, tokenURI)
                    await setURITx.wait()

                    console.log(`✅ TokenURI set for Token #${tokenId}`)

                } catch (metadataError) {
                    console.error(`❌ Error processing metadata for token ${i}:`, metadataError)
                }
            }

            setUploadingMetadata(false)
            console.log("✅ All metadata uploaded and set!")

            const existingTickets = JSON.parse(localStorage.getItem('myTickets') || '[]')
            
            qrResults.forEach((qr, index) => {
                if (qr.success) {
                    existingTickets.push({
                        tokenId: result.tokenIds[index].toString(),
                        contractAddress: event.ticketContract,
                        eventName: event.name,
                        eventDate: event.date.toString(),
                        venue: event.venue,
                        tier: tier.name,
                        priceInWei: tier.price.toString(),
                        qrCode: qr.qrCodeImage,
                        purchaseDate: Date.now(),
                        txHash: result.transactionHash,
                        ownerAddress: address
                    })
                }
            })

            localStorage.setItem('myTickets', JSON.stringify(existingTickets))

            setTimeout(() => {
                onSuccess()
            }, 2000)

        } catch (err) {
            console.error("❌ Purchase flow failed:", err)
            setError(err.message || "An unexpected error occurred")
            setSuccess(false)
        } finally {
            setLoading(false)
            setUploadingMetadata(false)
        }
    }
    
    return(
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose()
                }
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {success ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            Purchase Successful! 🎉
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your {quantity} ticket{quantity > 1 ? 's' : ''} ha{quantity > 1 ? 've' : 's'} been successfully purchased!
                        </p>

                        {uploadingMetadata && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-blue-900">Uploading metadata to IPFS...</p>
                                        <p className="text-xs text-blue-700">This may take a few moments</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {txHash && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600 mb-2">Transaction Hash</p>
                                <p className="font-mono text-xs text-gray-800 break-all mb-3">
                                    {txHash}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Buy Ticket
                            </h2>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-6">
                            {/* Event Info Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-sm font-medium text-gray-600 mb-1">Event</p>
                                <p className="text-lg font-bold text-gray-900">{event.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.venue}
                                </div>
                            </div>

                            {/* Tier Selection */}
                            <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Ticket Type</p>
                                        <p className="text-xl font-bold text-gray-900">{tier.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Price</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {pricePerTicket} {/* ✅ Fixed */}
                                        </p>
                                        <p className="text-xs text-gray-500">ETH per ticket</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={loading || quantity <= 1}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    
                                    <div className="w-24 h-16 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center justify-center">
                                        <input
                                            type="number"
                                            min="1"
                                            max="3"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                                            disabled={loading}
                                            className="w-full text-center text-3xl font-bold bg-transparent border-none focus:outline-none"
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={() => setQuantity(Math.min(3, quantity + 1))}
                                        disabled={loading || quantity >= 3}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    Maximum 3 tickets per wallet
                                </p>
                            </div>

                            {/* Total Price */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm opacity-90 mb-1">Total Price</p>
                                        <p className="text-4xl font-bold">
                                            {displayTotalPrice} ETH {/* ✅ Fixed */}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm opacity-90">
                                        <p>{quantity} ticket{quantity > 1 ? 's' : ''}</p>
                                        <p className="mt-1">+ Gas fees</p>
                                    </div>
                                </div>
                            </div>

                            {/* Connected Wallet */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-medium text-gray-600 mb-2">Purchasing with wallet</p>
                                <p className="font-mono text-sm text-gray-900 font-semibold">
                                    {address?.slice(0, 10)}...{address?.slice(-8)}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold text-red-900 text-sm">Purchase Failed</p>
                                            <p className="text-red-700 text-sm mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Anti-Scalping Info */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-semibold text-yellow-900 text-sm">Anti-Scalping Protection</p>
                                        <p className="text-yellow-800 text-xs mt-1">
                                            Your ticket will be locked for 48 hours after purchase to prevent reselling.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBuy}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirm Purchase
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
    
