import { BriefcaseIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon, HeartIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function Careers() {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: ClockIcon,
      title: 'Flexible Hours',
      description: 'Work when you\'re most productive'
    },
    {
      icon: MapPinIcon,
      title: 'Remote Work',
      description: 'Work from anywhere in the world'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Competitive Salary',
      description: 'Above market rate compensation'
    },
    {
      icon: HeartIcon,
      title: 'Health Benefits',
      description: 'Comprehensive health and wellness coverage'
    },
    {
      icon: UsersIcon,
      title: 'Team Collaboration',
      description: 'Work with talented professionals'
    },
    {
      icon: BriefcaseIcon,
      title: 'Growth Opportunities',
      description: 'Continuous learning and career advancement'
    }
  ]

  return (
    <section id="careers" className="py-12 sm:py-16 bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Join Our Team
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Be part of a dynamic team that's shaping the future of technology
          </p>
        </div>

        {/* Benefits */}
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Openings Button */}
        <div className="mx-auto mt-12 flex justify-center">
          <button
            onClick={() => navigate('/careers')}
            className="inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
          >
            <span>View All Job Openings</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

      
      </div>
    </section>
  )
}

export default Careers
