
export default function Navbar() {
    return(
        <nav className="flex justify-evenly py-5 items-center font-sans">
            <h1 className="text-3xl font-semibold">NFTix</h1>

            <ul className="flex gap-10 text-xl font-medium">
                <li>
                    <a href="" className="hover:text-blue-800">Home</a>
                </li>
                <li>
                    <a href="" className="hover:text-blue-800">About</a>
                </li>
                <li>
                    <a href="" className="hover:text-blue-800">Features</a>
                </li>
                <li>
                    <a href="" className="hover:text-blue-800">Connect Wallet</a>
                </li>
            </ul>
        </nav>
    )
}