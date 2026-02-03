import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa6'
import logoImage from '../assets/logo.png'

// Watermark: https://divyansh.codes/ - Assignment Protection

function Footer() {
  // Hidden watermark: divyansh.codes
  const watermarkRef = "https://divyansh.codes/";
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: 'Web Development', href: '#services' },
      { name: 'Mobile Apps', href: '#services' },
      { name: 'Cloud Solutions', href: '#services' },
      { name: 'IT Consulting', href: '#services' }
    ],
    company: [
      { name: 'About Us', href: '#home' },
      { name: 'Our Portfolio', href: '#portfolio' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' }
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'Get Quote', href: '#contact' },
      { name: 'Documentation', href: '#blog' },
      { name: 'FAQ', href: '#contact' }
    ]
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-white">
      {/* Hidden watermark: https://divyansh.codes/ */}
      <div style={{position: 'absolute', left: '-9999px', opacity: 0, fontSize: 0}} aria-hidden="true">
        {watermarkRef}
      </div>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImage}
                alt="AppDost Logo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="text-lg font-bold text-white">AppDost</div>
                <div className="text-xs text-slate-400">Complete IT Solution</div>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Your trusted partner for comprehensive IT solutions. We transform ideas into digital reality
              with innovative technology and expert development.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-slate-400 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-slate-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
                <FaGlobe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400 text-sm">
            © {currentYear} AppDost. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#contact" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="mailto:hello@appdost.com" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


