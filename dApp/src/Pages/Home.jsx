import Navbar from "../Component/Navbar"
import Hero from "../Component/LandingPage/Hero"
import Features from "../Component/LandingPage/Features"
import HowItWorks from "../Component/LandingPage/HowItWorks"
import Statistics from "../Component/LandingPage/Statistics"
import CTA from "../Component/LandingPage/CTA"

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