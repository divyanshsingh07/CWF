import { InfiniteMovingCards } from './ui/infinite-moving-cards'
import { 
  SiReact, 
  SiNodedotjs, 
  SiPython, 
  SiMongodb, 
  SiDocker,
  SiKotlin,
  SiTypescript,
  SiNextdotjs,
  SiGraphql,
  SiPostgresql,
  SiFlutter,
  SiRuby,
  SiVuedotjs,
  SiSwift,
  SiKubernetes
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

function Technologies() {
  const technologies = [
    { icon: SiReact, name: 'React', color: '#61DAFB' },
    { icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
    { icon: SiPython, name: 'Python', color: '#3776AB' },
    { icon: SiMongodb, name: 'MongoDB', color: '#47A248' },
    { icon: FaAws, name: 'AWS', color: '#FF9900' },
    { icon: SiDocker, name: 'Docker', color: '#2496ED' },
    { icon: SiKotlin, name: 'Kotlin', color: '#7F52FF' },
    { icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    { icon: SiNextdotjs, name: 'Next.js', color: '#000000' },
    { icon: SiGraphql, name: 'GraphQL', color: '#E10098' },
    { icon: SiPostgresql, name: 'PostgreSQL', color: '#4169E1' },
    { icon: SiFlutter, name: 'Flutter', color: '#02569B' },
    { icon: SiRuby, name: 'Ruby', color: '#CC342D' },
    { icon: SiVuedotjs, name: 'Vue.js', color: '#4FC08D' },
    { icon: SiSwift, name: 'Swift', color: '#FA7343' },
    { icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
  ]

  return (
    <section id="technologies" className="py-20 bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Technologies We Master
          </h2>
          <p className="text-lg leading-8 text-slate-600">
            We leverage cutting-edge technologies to build robust, scalable, and innovative solutions
          </p>
        </div>

        {/* Technologies Cards */}
        <div className="relative overflow-hidden">
          <InfiniteMovingCards
            items={technologies.map((tech, index) => {
              const IconComponent = tech.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-sm flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="mb-3">
                    <IconComponent className="text-5xl" style={{ color: tech.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{tech.name}</h3>
                </div>
              )
            })}
            direction="left"
            speed="slow"
            cardWidth="w-40"
            gapSize="gap-6"
            className="h-[180px]"
          />
        </div>
      </div>
    </section>
  )
}

export default Technologies
