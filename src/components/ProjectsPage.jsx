import { useState } from 'react'
import { EyeIcon, CodeBracketIcon, GlobeAltIcon, DevicePhoneMobileIcon, ArrowRightIcon, CheckBadgeIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Navbar from './Navbar'
import Footer from './Footer'

function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern UI/UX, secure payments, and admin dashboard',
      image: '🛒',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
      features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration', 'Admin Dashboard'],
      status: 'Completed',
      year: '2024',
      link: '#'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates and team collaboration features',
      image: '📋',
      category: 'Web Development',
      technologies: ['Next.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS', 'TypeScript'],
      features: ['Real-time Updates', 'Team Collaboration', 'File Sharing', 'Progress Tracking', 'Notifications'],
      status: 'Completed',
      year: '2024',
      link: '#'
    },
    {
      title: 'Fitness Tracker Mobile App',
      description: 'Cross-platform fitness tracking app with social features and health integration',
      image: '💪',
      category: 'Mobile App',
      technologies: ['React Native', 'Firebase', 'Redux', 'HealthKit', 'Google Fit'],
      features: ['Activity Tracking', 'Social Features', 'Health Integration', 'Progress Analytics', 'Goal Setting'],
      status: 'Completed',
      year: '2024',
      link: '#'
    },
    {
      title: 'Restaurant POS System',
      description: 'Complete point of sale system for restaurant management with inventory and reporting',
      image: '🍽️',
      category: 'Custom Software',
      technologies: ['Electron', 'SQLite', 'Express', 'React', 'Node.js'],
      features: ['Order Management', 'Inventory Tracking', 'Sales Reports', 'Employee Management', 'Customer Database'],
      status: 'Completed',
      year: '2023',
      link: '#'
    },
    {
      title: 'Healthcare Dashboard',
      description: 'Medical data visualization and patient management system for healthcare providers',
      image: '🏥',
      category: 'Web Development',
      technologies: ['Vue.js', 'Python', 'FastAPI', 'D3.js', 'PostgreSQL'],
      features: ['Data Visualization', 'Patient Management', 'Appointment Scheduling', 'Medical Records', 'Analytics Dashboard'],
      status: 'In Progress',
      year: '2024',
      link: '#'
    },
    {
      title: 'Learning Management System',
      description: 'Educational platform with course creation, progress tracking, and interactive learning',
      image: '📚',
      category: 'Web Development',
      technologies: ['Angular', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      features: ['Course Creation', 'Progress Tracking', 'Interactive Quizzes', 'Video Streaming', 'Certification'],
      status: 'Completed',
      year: '2023',
      link: '#'
    },
    {
      title: 'Cloud Infrastructure Setup',
      description: 'Scalable cloud infrastructure deployment with automated CI/CD pipelines',
      image: '☁️',
      category: 'Cloud Solutions',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
      features: ['Auto Scaling', 'Load Balancing', 'CI/CD Pipelines', 'Monitoring', 'Security'],
      status: 'Completed',
      year: '2024',
      link: '#'
    },
    {
      title: 'CRM System',
      description: 'Customer relationship management system with lead tracking and sales automation',
      image: '👥',
      category: 'Custom Software',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redis'],
      features: ['Lead Management', 'Sales Pipeline', 'Customer Database', 'Email Integration', 'Reporting'],
      status: 'Completed',
      year: '2023',
      link: '#'
    }
  ]

  const categories = ['All', 'Web Development', 'Mobile App', 'Custom Software', 'Cloud Solutions']

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200'
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
                All Projects
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Our Complete{' '}
                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Project Portfolio
                </span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
                Explore our comprehensive collection of projects and see how we've helped businesses transform their ideas into successful digital solutions
              </p>
            </div>

            {/* Category Filter */}
            <div className="mx-auto mt-12 flex justify-center">
              <div className="flex flex-wrap gap-2 rounded-2xl bg-white/80 backdrop-blur-sm p-1 shadow-lg ring-1 ring-slate-200/50">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid - 3 columns */}
            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.title}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:ring-blue-200/60"
                >
                  {/* Project Image */}
                  <div className="relative aspect-[4/3] bg-linear-to-br from-blue-100 via-purple-50 to-blue-100 p-6 flex items-center justify-center text-5xl sm:text-6xl overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10"></div>
                    {project.image}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        {project.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-slate-600">
                        <ClockIcon className="h-3 w-3" />
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                        {project.category}
                      </span>
                      <EyeIcon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-600" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.features.slice(0, 3).map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                          >
                            <CheckBadgeIcon className="h-2.5 w-2.5 text-green-500" />
                            {feature}
                          </span>
                        ))}
                        {project.features.length > 3 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            +{project.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-linear-to-r from-slate-50 to-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="rounded-md bg-linear-to-r from-blue-50 to-purple-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Project Button */}
                    <button className="w-full group/btn inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md">
                      <span>View Project</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mx-auto mt-20 max-w-4xl text-center">
              <div className="rounded-3xl bg-linear-to-br from-blue-50 via-white to-purple-50 p-8 sm:p-12 ring-1 ring-slate-200/50">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                  Ready to Start?
                </div>
                <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                  Have a Project in Mind?
                </h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Let's work together to bring your vision to life with our expertise in modern technologies and innovative solutions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                  >
                    Start Your Project
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                  >
                    View Services
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

export default ProjectsPage
