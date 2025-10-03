import { useState } from "react"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import buyer from "../assets/Buyer.png"
import organizer from "../assets/Organizer.png"
import Navbar from "../Component/Navbar"

export default function ConnectPage() {
    const [userWallet, SetUserWallet] = useState(null)
    const navigate = useNavigate()

    const HandleConnect = async (role) => {
        try {
            if(!window.ethereum) throw new Error("Metamask is not installed!")

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const address = await signer.getAddress()

            SetUserWallet(address);
            localStorage.setItem("userWallet", address);

            if(role == "buyer") navigate("/buyer")
            if(role == "organizer") navigate("/organizer")
        } catch(error) {
            console.error("Wallet connect failed: ", error);
        }
    }

    return(
        <div className="">
            <Navbar/>
            <div className="flex justify-center gap-12">
                    {/* Buyer */}
                    <div
                        onClick={() => HandleConnect("buyer")}
                        className="p-8 bg-cyan-700 rounded-2xl shadow-md cursor-pointer hover:bg-cyan-600 hover:scale-105 transition transform duration-200 text-center"
                    >
                        <img
                            src={buyer}
                            alt="Buyer"
                            className=" mx-auto"
                        />
                        <h1 className="text-lg font-semibold">Log In as Buyer</h1>
                    </div>

                    {/* Organizer */}
                    <div
                        onClick={() => HandleConnect("organizer")}
                        className="p-8 bg-purple-700 rounded-2xl shadow-md cursor-pointer hover:bg-purple-600 hover:scale-105 transition transform duration-200 text-center"
                    >
                        <img
                            src={organizer}
                            alt="Organizer"
                            className="mx-auto"
                        />
                        <h1 className="text-lg font-semibold">Log In as Organizer</h1>
                    </div>
            </div>
        </div>
    )
}