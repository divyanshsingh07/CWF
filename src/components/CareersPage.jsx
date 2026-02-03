import { BriefcaseIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon, HeartIcon, ArrowLeftIcon, ArrowRightIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import Footer from './Footer'

function CareersPage() {
  const jobs = [
    {
      title: 'Senior React Developer',
      department: 'Frontend Development',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $120k',
      description: 'Join our team to build amazing user interfaces with React and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Modern CSS frameworks', 'API integration'],
      benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work']
    },
    {
      title: 'Node.js Backend Developer',
      department: 'Backend Development',
      location: 'Remote',
      type: 'Full-time',
      salary: '$75k - $110k',
      description: 'Develop scalable backend systems and APIs using Node.js and modern frameworks.',
      requirements: ['4+ years Node.js experience', 'Database design', 'RESTful APIs', 'Cloud platforms'],
      benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work']
    },
    {
      title: 'Full Stack Developer',
      department: 'Development',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70k - $100k',
      description: 'Work on both frontend and backend technologies to deliver complete solutions.',
      requirements: ['3+ years full-stack experience', 'React & Node.js', 'Database management', 'DevOps knowledge'],
      benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work']
    },
    {
      title: 'Mobile App Developer',
      department: 'Mobile Development',
      location: 'Remote',
      type: 'Full-time',
      salary: '$65k - $95k',
      description: 'Create native and cross-platform mobile applications for iOS and Android.',
      requirements: ['3+ years mobile development', 'React Native/Flutter', 'iOS/Android knowledge', 'App Store experience'],
      benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work']
    },
    {
      title: 'Frontend Developer Intern',
      department: 'Frontend Development',
      location: 'Remote',
      type: 'Internship',
      salary: '$20 - $25/hour',
      description: 'Gain hands-on experience building modern web applications with React and TypeScript.',
      requirements: ['React basics', 'JavaScript/TypeScript', 'CSS/HTML', 'Git version control'],
      benefits: ['Mentorship program', 'Learning budget', 'Flexible schedule', 'Potential full-time offer']
    },
    {
      title: 'Backend Developer Intern',
      department: 'Backend Development',
      location: 'Remote',
      type: 'Internship',
      salary: '$20 - $25/hour',
      description: 'Learn to build scalable APIs and backend services using Node.js and modern frameworks.',
      requirements: ['JavaScript/Node.js basics', 'Database concepts', 'API design', 'Git version control'],
      benefits: ['Mentorship program', 'Learning budget', 'Flexible schedule', 'Potential full-time offer']
    }
  ]

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
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning Budget',
      description: 'Annual budget for courses and conferences'
    },
    {
      icon: SparklesIcon,
      title: 'Innovation Time',
      description: 'Dedicated time for personal projects'
    }
  ]

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'text-green-600 bg-green-50 border-green-200'
      case 'Internship': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-16 sm:py-20 lg:py-24 bg-linear-to-br from-white via-slate-50/30 to-blue-50/30 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Home
              </button>
            </div>

            {/* Header */}
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                Join Our Team
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Career{' '}
                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Opportunities
                </span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
                Be part of a dynamic team that's shaping the future of technology. Explore our open positions and internship opportunities.
              </p>
            </div>

            {/* Benefits */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:ring-blue-200/60"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-white mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Job Openings */}
            <div className="mx-auto mt-20 max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Open Positions</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Discover exciting career opportunities and internship programs designed to help you grow and succeed
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {jobs.map((job, index) => (
                  <div
                    key={job.title}
                    className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:ring-blue-200/60"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getJobTypeColor(job.type)}`}>
                            {job.type}
                          </span>
                        </div>
                        <p className="text-blue-600 font-medium mb-2">{job.department}</p>
                        <p className="text-slate-600 mb-4">{job.description}</p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPinIcon className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ClockIcon className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, benefitIndex) => (
                          <span
                            key={benefitIndex}
                            className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button className="w-full group/btn inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md">
                      <span>Apply Now</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mx-auto mt-20 max-w-4xl text-center">
              <div className="rounded-3xl bg-linear-to-br from-blue-50 via-white to-purple-50 p-8 sm:p-12 ring-1 ring-slate-200/50 shadow-lg">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                  Don't See Your Role?
                </div>
                <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                  We're Always Looking for{' '}
                  <span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Talented People
                  </span>
                </h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Send us your resume and let us know how you can contribute to our team. We'd love to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                  >
                    Send Your Resume
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                  >
                    Learn About Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CareersPage
