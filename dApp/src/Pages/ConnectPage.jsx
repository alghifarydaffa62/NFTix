import { useState } from "react"
import { ethers } from "ethers"
import Navbar from "../Component/Navbar"

export default function ConnectPage() {
    const [userWallet, SetUserWallet] = useState(null)

    const HandleConnect = async() => {
        try {
            if(!window.ethereum) throw new Error("Metamask is not installed!")

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const address = await signer.getAddress()

            SetUserWallet(address);
        } catch(error) {
            console.error("Wallet connect failed: ", error);
        }
    }
    return(
        <div className="">
            <Navbar/>

            <div className="flex justify-center my-6">
                {userWallet ? (
                    <h1 className="p-4 bg-blue-800 rounded-lg text-white font-medium">Connected Wallet: {userWallet}</h1>
                ) : (
                    <button onClick={HandleConnect} className="cursor-pointer p-3 font-semibold rounded-lg bg-blue-950 text-white">Connect Metamask</button>
                )}
            </div>
            
        </div>
    )
}