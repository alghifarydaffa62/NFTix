import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

export default function Navbar() {
    return( 
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <img src={logo} alt="NFTix Logo" className="rounded-lg" /> 
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        NFTix
                    </span>
                </Link>

                <ul className="hidden md:flex gap-8 text-lg font-medium text-gray-700">
                    <li>
                        <a href="/" className="hover:text-blue-600 transition">Home</a>
                    </li>
                    <li>
                        <a href="/#features" className="hover:text-blue-600 transition">Features</a>
                    </li>
                    <li>
                        <a href="/#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
                    </li>
                </ul>

                <Link 
                    to="/connect" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                    Connect Wallet
                </Link>
            </div>
        </nav>
    )
}