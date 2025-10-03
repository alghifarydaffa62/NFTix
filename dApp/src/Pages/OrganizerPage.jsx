import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrganizerPage() {
    const [userWallet, SetUserWallet] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        const savedWallet = localStorage.getItem("userWallet");
        if(savedWallet) {
            SetUserWallet(savedWallet);
        }
    }, []);

    const handleDisconnect = async () => {
        SetUserWallet(null);                  
        localStorage.removeItem("userWallet");
        navigate("/connect")
    }
    return(
        <div>
            <h1 className="text-center text-2xl">Welcome Organizer! {userWallet}</h1>

            <button className="cursor-pointer flex justify-center p-3 bg-red-700 text-white font-semibold rounded-md" onClick={handleDisconnect}>Disconnect</button>
        </div>
    )
}