import Navbar from "../Component/Navbar"
import Hero from "../Component/Hero"
import Features from "../Component/Features"
import HowItWorks from "../Component/HowItWorks"
import Statistics from "../Component/Statistics"
import CTA from "../Component/CTA"

export default function Home() {
    return(
        <div>
            <Navbar/>
            <Hero/>
            <Features/>
            <HowItWorks/>
            <Statistics/>
            <CTA/>
        </div>
    )
}