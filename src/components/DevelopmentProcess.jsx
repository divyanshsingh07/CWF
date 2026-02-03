import { MagnifyingGlassIcon, PencilSquareIcon, CodeBracketIcon, RocketLaunchIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

function DevelopmentProcess() {
  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We deep dive into your requirements, understand your business goals, analyze competitors, and create a comprehensive project roadmap with clear milestones.',
      icon: MagnifyingGlassIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Design & Prototype',
      description: 'Our design team creates intuitive wireframes, stunning UI mockups, and interactive prototypes that bring your vision to life before development begins.',
      icon: PencilSquareIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Expert developers write clean, scalable code while our QA team performs rigorous testing to ensure flawless functionality across all devices and platforms.',
      icon: CodeBracketIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'We handle the complete deployment process and provide ongoing maintenance, updates, and 24/7 technical support to keep your solution running smoothly.',
      icon: RocketLaunchIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <section id="development-process" className="py-20 sm:py-24 lg:py-28 bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Our Process
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight mb-6">
            How We{' '}
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-8 text-slate-600">
            A streamlined approach that delivers results through collaboration, expertise, and attention to detail
          </p>
        </div>

        {/* Process Flow - Vertical Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-6 sm:left-7 lg:left-8 top-6 sm:top-7 lg:top-8 bottom-6 sm:bottom-7 lg:bottom-8 w-0.5 bg-linear-to-b from-blue-200 via-purple-200 to-blue-200"></div>
          
          {/* Process Steps */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative flex items-start gap-4 sm:gap-6 lg:gap-8">
                  {/* Timeline Icon */}
                  <div className="shrink-0 relative z-10">
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-linear-to-br ${step.gradient} shadow-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <span className="text-xs sm:text-xs lg:text-sm font-bold text-slate-700">{step.step}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:ring-blue-200/60">
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                        <div className="flex-1 mb-2 sm:mb-0">
                          <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 ${step.color}`}>
                            {step.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/50">
                              Phase {step.step}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                              {index === 0 ? 'Planning' : index === 1 ? 'Design' : index === 2 ? 'Development' : 'Launch'}
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Duration</div>
                          <div className={`text-sm sm:text-lg font-bold ${step.color}`}>
                            {index === 0 ? '1-2 weeks' : index === 1 ? '2-3 weeks' : index === 2 ? '4-8 weeks' : 'Ongoing'}
                          </div>
                        </div>
                      </div>

                      {/* Key Activities */}
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 sm:mb-3">Key Activities</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {index === 0 && ['Requirements', 'Research', 'Planning', 'Timeline'].map((activity, actIndex) => (
                            <span
                              key={actIndex}
                              className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                            >
                              {activity}
                            </span>
                          ))}
                          {index === 1 && ['Wireframes', 'UI Design', 'Prototype', 'Review'].map((activity, actIndex) => (
                            <span
                              key={actIndex}
                              className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                            >
                              {activity}
                            </span>
                          ))}
                          {index === 2 && ['Frontend', 'Backend', 'Testing', 'QA'].map((activity, actIndex) => (
                            <span
                              key={actIndex}
                              className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                            >
                              {activity}
                            </span>
                          ))}
                          {index === 3 && ['Deploy', 'Monitor', 'Maintain', 'Support'].map((activity, actIndex) => (
                            <span
                              key={actIndex}
                              className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Process Timeline */}
       

      </div>
    </section>
  )
}

export default DevelopmentProcess
