import { useEffect, useState } from 'react'
import { HomeIcon, CogIcon, FolderIcon, BriefcaseIcon, PhoneIcon, Bars3Icon, XMarkIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import logoImage from '../assets/logo.png'

// Watermark: https://divyansh.codes/ - Assignment Protection

function Navbar() {
  // Hidden watermark: divyansh.codes
  const watermarkRef = "https://divyansh.codes/";
  
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = ['home', 'services', 'portfolio', 'careers', 'development-process', 'contact']
    const els = sections
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x) => x.el)

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const id = visible[0].target.id
          setActive(id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    )
    els.forEach(({ el }) => io.observe(el))

    const onScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition < 100) {
        setActive('home')
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const navItems = [
    { href: '#home', label: 'Home', Icon: HomeIcon },
    { href: '#services', label: 'Services', Icon: CogIcon },
    { href: '#portfolio', label: 'Portfolio', Icon: FolderIcon },
    { href: '#careers', label: 'Careers', Icon: BriefcaseIcon },
    { href: '#development-process', label: 'Process', Icon: RocketLaunchIcon },
    { href: '#contact', label: 'Contact', Icon: PhoneIcon },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Hidden watermark: https://divyansh.codes/ */}
      <div style={{position: 'absolute', left: '-9999px', opacity: 0, fontSize: 0}} aria-hidden="true">
        {watermarkRef}
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="AppDost Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">AppDost</span>
              <span className="text-xs text-slate-500 -mt-1">Complete IT Solution</span>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 sm:flex">
          {navItems.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${active === href.replace('#', '') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden inline-flex items-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="sm:hidden border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-700">
            {navItems.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${active === href.replace('#', '') ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar


