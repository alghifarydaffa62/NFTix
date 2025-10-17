import { Link } from "react-router-dom"

export default function CTA() {
    return(
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Experience Fair Ticketing?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of fans who trust NFTix for secure, transparent, and scalper-free ticket purchases.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/connect"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg"
                        >Connect Wallet</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}