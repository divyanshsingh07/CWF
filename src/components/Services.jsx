import { ComputerDesktopIcon, DevicePhoneMobileIcon, CloudIcon, CogIcon, CodeBracketIcon, PaintBrushIcon } from '@heroicons/react/24/outline'

// Watermark: https://divyansh.codes/ - Assignment Protection

function Services() {
  // Hidden watermark: divyansh.codes
  const watermarkRef = "https://divyansh.codes/";
  
  const services = [
    {
      icon: ComputerDesktopIcon,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
      features: ['React & Next.js', 'Node.js Backend', 'E-commerce Solutions', 'CMS Development']
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      features: ['React Native', 'Flutter', 'iOS Development', 'Android Development']
    },
    {
      icon: CloudIcon,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment services',
      features: ['AWS/Azure', 'DevOps', 'Microservices', 'Serverless']
    },
    {
      icon: CogIcon,
      title: 'IT Consulting',
      description: 'Strategic technology consulting and digital transformation',
      features: ['Tech Strategy', 'Architecture Design', 'Performance Optimization', 'Security Audit']
    },
    {
      icon: CodeBracketIcon,
      title: 'Custom Software',
      description: 'Tailored software solutions for unique business needs',
      features: ['Enterprise Apps', 'API Development', 'Database Design', 'Integration Services']
    },
    {
      icon: PaintBrushIcon,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces and experiences',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    }
  ]

  return (
    <section id="services" className="py-12 sm:py-16 bg-linear-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Comprehensive IT solutions tailored to transform your business and accelerate growth
          </p>
        </div>

        {/* About AppDost Section */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-white to-purple-50 p-8 sm:p-12 ring-1 ring-blue-200/50 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center mb-4">
                About AppDost
              </h3>
              <p className="text-xl font-semibold text-blue-700 text-center mb-6">
                Your Trusted Partner for Complete Digital Transformation
              </p>
              <div className="h-1 w-24 bg-linear-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
              <p className="text-lg leading-relaxed text-slate-600 text-center max-w-3xl mx-auto">
                AppDost is your trusted partner for complete digital transformation. We are a dynamic, innovation-driven IT solutions provider specializing in turning visionary ideas into powerful, market-ready products. Our mission is to empower businesses with cutting-edge technology solutions that drive growth, enhance user experiences, and create lasting digital impact.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="group relative rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-lg hover:ring-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                </div>
                <p className="mt-4 text-slate-600">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="h-1 w-1 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold text-slate-900">Ready to Start Your Project?</h3>
          <p className="mt-4 text-slate-600">
            Let's discuss how we can help transform your ideas into reality
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              Get Free Consultation
            </button>
            <button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-3 text-slate-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
            >
              View Our Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
