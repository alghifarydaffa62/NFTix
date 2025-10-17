// src/Utils/getProvider.js

import { BrowserProvider, JsonRpcProvider } from "ethers"

/**
 * Get provider for reading blockchain data
 * Supports: AppKit, MetaMask, Fallback RPC
 */
export async function getReadProvider() {
    try {
        // Method 1: Try AppKit provider first (Reown)
        if (window.wagmi?.core?.provider) {
            try {
                const appKitProvider = window.wagmi.core.provider
                const provider = new BrowserProvider(appKitProvider)
                await provider.getNetwork()
                console.log("✅ Using AppKit provider (read)")
                return provider
            } catch (error) {
                console.warn("⚠️ AppKit provider failed:", error.message)
            }
        }

        // Method 2: Try window.ethereum (MetaMask/standard)
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum)
                await provider.getNetwork()
                console.log("✅ Using window.ethereum provider (read)")
                return provider
            } catch (error) {
                console.warn("⚠️ window.ethereum failed:", error.message)
            }
        }

        // Method 3: Fallback to public RPC
        const rpcUrl = import.meta.env.VITE_RPC_URL || "https://rpc-amoy.polygon.technology/"
        const provider = new JsonRpcProvider(rpcUrl)
        
        await provider.getNetwork()
        console.log("✅ Using public RPC provider:", rpcUrl)
        return provider

    } catch (error) {
        console.error("❌ All provider methods failed:", error)
        throw new Error("Cannot connect to blockchain. Please check your network.")
    }
}

/**
 * Get provider with signer for transactions
 */
export async function getSignerProvider() {
    // Try AppKit provider first
    if (window.wagmi?.core?.provider) {
        try {
            const appKitProvider = window.wagmi.core.provider
            const provider = new BrowserProvider(appKitProvider)
            const signer = await provider.getSigner()
            console.log("✅ Using AppKit signer")
            return { provider, signer }
        } catch (error) {
            console.warn("⚠️ AppKit signer failed:", error.message)
        }
    }

    // Fallback to window.ethereum
    if (!window.ethereum) {
        throw new Error("No wallet detected. Please connect your wallet.")
    }

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    
    console.log("✅ Using window.ethereum signer")
    return { provider, signer }
}