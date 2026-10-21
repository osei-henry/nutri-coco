import Hero from '../Components/Hero'
import Services from '../Components/Services'
import Testimonials from '../Components/Testimonials'
import Gallery from '../Components/Gallery'
import LatestPosts from '../Components/LatestPosts'
import FAQ from '../Components/FAQ'
import Booking from '../Components/Booking'
import Contact from '../Components/Contact'
import { clinic } from '../Data/clinic'

export default function Home() {
  return (
    <>
      <title>{`${clinic.name} | Fresh coconuts in Airport City`}</title>
      <Hero />
      <Services />
      <Testimonials />
      <Gallery />
      <LatestPosts />
      <FAQ />
      <Booking />
      <Contact />
    </>
  )
}
