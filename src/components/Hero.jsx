import { ArrowRightIcon, PhoneIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, BoltIcon, CheckBadgeIcon, ShieldCheckIcon, ClockIcon, CloudIcon, CogIcon, CodeBracketIcon, PaintBrushIcon, ServerIcon, CpuChipIcon, SparklesIcon, UserGroupIcon, RocketLaunchIcon, StarIcon } from '@heroicons/react/24/outline'
import { InfiniteMovingCards } from './ui/infinite-moving-cards'
import { motion } from 'framer-motion'
import logoImage from '../assets/logo.png'

// Watermark: https://divyansh.codes/ - Assignment Protection

function Hero({ onCTAClick }) {
  // Hidden watermark: divyansh.codes
  const watermarkRef = "https://divyansh.codes/";
  
  const stats = [
    {
      title: 'Web Development',
      description: 'Modern websites and web apps',
      features: ['React & Next.js', 'Node.js', 'E-commerce', 'CMS'],
      icon: ComputerDesktopIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-50',
      textColor: 'text-slate-700'
    },
    {
      title: 'Mobile App Development',
      description: 'iOS & Android apps',
      features: ['React Native', 'Flutter', 'iOS', 'Android'],
      icon: DevicePhoneMobileIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-50',
      textColor: 'text-slate-700'
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable infrastructure',
      features: ['AWS/Azure', 'DevOps', 'Microservices', 'Serverless'],
      icon: CloudIcon,
      color: 'from-sky-500 to-sky-600',
      bgColor: 'from-sky-50 to-sky-50',
      textColor: 'text-slate-700'
    },
    {
      title: 'IT Consulting',
      description: 'Technology strategy',
      features: ['Tech Strategy', 'Architecture', 'Performance', 'Security'],
      icon: CpuChipIcon,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-50',
      textColor: 'text-slate-700'
    },
    {
      title: 'Custom Software',
      description: 'Tailored solutions',
      features: ['Enterprise Apps', 'API', 'Database', 'Integration'],
      icon: CodeBracketIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-50',
      textColor: 'text-slate-700'
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful interfaces',
      features: ['Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      icon: PaintBrushIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-50',
      textColor: 'text-slate-700'
    }
  ]

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-white">
      {/* Hidden watermark: https://divyansh.codes/ */}
      <div style={{position: 'absolute', left: '-9999px', opacity: 0, fontSize: 0}} aria-hidden="true">
        {watermarkRef}
      </div>
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50/30 via-white to-blue-50/30" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-[#6A11CB]/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-[#2575FC]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content - Premium Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-100 to-blue-100 px-4 py-2 text-sm font-medium text-violet-700 backdrop-blur-sm border border-violet-200/50 shadow-sm"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Complete IT Solution Provider Since 2025</span>
            </motion.div>

            {/* Main Heading with Premium Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
              <span className="block text-slate-900">Transform Your</span>
              <span className="block bg-linear-to-r from-[#6A11CB] via-[#7E3AF2] to-[#2575FC] bg-clip-text text-transparent">
                Ideas Into Digital
              </span>
              <span className="block text-slate-900">Reality</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
              Your trusted partner for comprehensive IT solutions — from mobile apps to enterprise software. We bring innovation and excellence to every project.
            </p>

            {/* Badges / Highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-200/50 shadow-sm backdrop-blur-sm">
                <StarIcon className="h-4 w-4" />
                100% Client Satisfaction
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200/50 shadow-sm backdrop-blur-sm">
                <ShieldCheckIcon className="h-4 w-4" />
                Secure & Scalable
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 border border-violet-200/50 shadow-sm backdrop-blur-sm">
                <ClockIcon className="h-4 w-4" />
                24/7 Support
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#6A11CB] to-[#2575FC] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40"
              >
                <RocketLaunchIcon className="h-5 w-5" />
                Explore Our Services
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-purple-300 hover:bg-linear-to-r hover:from-violet-50 hover:to-blue-50"
              >
                <PhoneIcon className="h-5 w-5" />
                Get Free Consultation
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center h-[500px] lg:h-[600px]"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-200/20 to-blue-200/20 rounded-3xl blur-3xl" />
            
            {/* Floating Cards Container */}
            <div className="relative w-full h-full max-w-lg">
              {/* Center Logo with Glassmorphism */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50">
                <img src={logoImage} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>

              {/* Desktop Circular Cards */}
              <div className="hidden lg:block relative w-full h-full">
                {/* Top Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                >
                  <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <ComputerDesktopIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Web Development</p>
                        <p className="text-sm text-blue-600 font-medium">10+ Projects</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Card */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-20 right-0"
                >
                  <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Mobile Apps</p>
                        <p className="text-sm text-purple-600 font-medium">4+ Apps</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Right Card */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 right-0"
                >
                  <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <CheckBadgeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Client Satisfaction</p>
                        <p className="text-sm text-emerald-600 font-medium">100%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                >
                  <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <BoltIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Fast Delivery</p>
                        <p className="text-sm text-orange-600 font-medium">On Time</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Left Card */}
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 left-0"
                >
                  <div className="glass-card bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <ClockIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Support</p>
                        <p className="text-sm text-cyan-600 font-medium">24/7</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Grid Layout */}
              <div className="lg:hidden grid grid-cols-2 gap-4">
                {/* Mobile cards with same glassmorphism effect */}
                {[
                  { icon: ComputerDesktopIcon, title: 'Web Dev', subtitle: '10+ Projects', color: 'from-blue-500 to-blue-600' },
                  { icon: DevicePhoneMobileIcon, title: 'Mobile', subtitle: '4+ Apps', color: 'from-purple-500 to-purple-600' },
                  { icon: CheckBadgeIcon, title: '100%', subtitle: 'Satisfaction', color: 'from-emerald-500 to-emerald-600' },
                  { icon: BoltIcon, title: 'Fast', subtitle: 'Delivery', color: 'from-orange-500 to-orange-600' },
                  { icon: ClockIcon, title: '24/7', subtitle: 'Support', color: 'from-cyan-500 to-cyan-600', span: 'col-span-2' }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`glass-card bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_32px_rgba(106,17,203,0.15)] transition-all duration-300 hover:scale-105 ${item.span || ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                          <p className="text-xs text-slate-600">{item.subtitle}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Moving Cards - Desktop */}
      <div className="relative w-full -mx-6 lg:-mx-8 hidden md:block">
        <InfiniteMovingCards
          items={stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm w-full h-full flex flex-col">
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${stat.bgColor} ring-1 ring-slate-200/50 shadow-lg shrink-0`}>
                      <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${stat.textColor} mb-2`}>
                        {stat.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stat.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className={`inline-flex items-center gap-1 rounded-full bg-linear-to-r ${stat.bgColor} px-2 py-1 text-xs font-medium ${stat.textColor} ring-1 ring-slate-200/50`}
                      >
                        <CheckBadgeIcon className="h-3 w-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
          direction="left"
          speed="slow"
          cardWidth="w-80"
          gapSize="gap-6"
          className="h-[220px]"
        />
      </div>

      {/* Infinite Moving Cards - Mobile */}
      <div className="relative w-full -mx-6 lg:-mx-8 block md:hidden">
        <InfiniteMovingCards
          items={stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div className="bg-white rounded-2xl p-4 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm w-full h-full flex flex-col">
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${stat.bgColor} ring-1 ring-slate-200/50 shadow-lg shrink-0`}>
                      <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-bold ${stat.textColor} mb-1`}>
                        {stat.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stat.features.slice(0, 2).map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className={`inline-flex items-center gap-1 rounded-full bg-linear-to-r ${stat.bgColor} px-1.5 py-0.5 text-xs font-medium ${stat.textColor} ring-1 ring-slate-200/50`}
                      >
                        <CheckBadgeIcon className="h-2 w-2" />
                        {feature}
                      </span>
                    ))}
                    {stat.features.length > 2 && (
                      <span className={`inline-flex items-center gap-1 rounded-full bg-linear-to-r ${stat.bgColor} px-1.5 py-0.5 text-xs font-medium ${stat.textColor} ring-1 ring-slate-200/50`}>
                        +{stat.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          direction="left"
          speed="slow"
          cardWidth="w-64"
          gapSize="gap-4"
          className="h-[180px]"
        />
      </div>

      {/* WhatsApp floating button */}
              <div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50"
      >
        <a
          href="#contact"
          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors hover:scale-110"
        >
          <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
          </svg>
        </a>
              </div>
    </section>
  )
}

export default Hero


