import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Portfolio from './components/Portfolio.jsx'
import Careers from './components/Careers.jsx'
import Technologies from './components/Technologies.jsx'
import DevelopmentProcess from './components/DevelopmentProcess.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ProjectsPage from './components/ProjectsPage.jsx'
import CareersPage from './components/CareersPage.jsx'
import { AnimatedTestimonials } from './components/ui/animated-testimonials'

// Watermark: https://divyansh.codes/ - Assignment Protection

function HomePage() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hidden watermark: https://divyansh.codes/ */}
      <div className="watermark-protection" aria-hidden="true" style={{display: 'none'}}>
        https://divyansh.codes/
      </div>
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Careers />
      <Technologies />
      <DevelopmentProcess />
      <Contact />
      <AnimatedTestimonials testimonials={testimonials} />
      <Footer />
    </div>
  )
}

function App() {
  // Watermark protection: divyansh.codes
  const watermarkRef = "https://divyansh.codes/";
  
  // Hidden console watermark
  if (typeof window !== 'undefined') {
    console.log('%cProtected Assignment - https://divyansh.codes/', 'color: transparent; font-size: 0px;');
  }
  
  return (
    <Router>
      {/* Hidden watermark element */}
      <div style={{position: 'absolute', left: '-9999px', opacity: 0}} aria-hidden="true">
        {watermarkRef}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/careers" element={<CareersPage />} />
      </Routes>
    </Router>
  )
}

export default App


