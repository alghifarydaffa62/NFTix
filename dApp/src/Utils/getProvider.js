import { BrowserProvider, JsonRpcProvider } from "ethers"

export async function getReadProvider() {
    try {
        if (window.wagmi?.core?.provider) {
            try {
                const appKitProvider = window.wagmi.core.provider
                const provider = new BrowserProvider(appKitProvider)
                await provider.getNetwork()

                return provider
            } catch (error) {
                console.warn("⚠️ AppKit provider failed:", error.message)
            }
        }

        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum)
                await provider.getNetwork()

                return provider
            } catch (error) {
                console.warn("⚠️ window.ethereum failed:", error.message)
            }
        }

        const rpcUrl = import.meta.env.VITE_RPC_URL || "https://rpc-amoy.polygon.technology/"
        const provider = new JsonRpcProvider(rpcUrl)
        
        await provider.getNetwork()

        return provider

    } catch (error) {
        console.error("❌ All provider methods failed:", error)
        throw new Error("Cannot connect to blockchain. Please check your network.")
    }
}

export async function getSignerProvider() {
    if (window.wagmi?.core?.provider) {
        try {
            const appKitProvider = window.wagmi.core.provider
            const provider = new BrowserProvider(appKitProvider)
            const signer = await provider.getSigner()

            return { provider, signer }
        } catch (error) {
            console.warn("⚠️ AppKit signer failed:", error.message)
        }
    }

    if (!window.ethereum) {
        throw new Error("No wallet detected. Please connect your wallet.")
    }

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    return { provider, signer }
}