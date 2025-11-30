import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-xl font-medium text-slate-900">
            Comunidad de Madrid
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Portal de Servicios Públicos
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl">
            Accede a beneficios y ayudas de forma rápida y segura con verificación digital
          </p>
          
          {/* Quick Access Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/tramites">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                Beneficios por discapacidad
              </button>
            </Link>
            
            <button className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
              Cita sanitaria
            </button>
            
            <button className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
              Educación
            </button>
            
            <button className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
              Transporte
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
            {[
              { label: 'Salud', active: false },
              { label: 'Educación', active: false },
              { label: 'Servicios sociales', active: true },
              { label: 'Empleo', active: false },
              { label: 'Justicia', active: false },
              { label: 'Transporte', active: false }
            ].map((service, i) => (
              <Link 
                key={i} 
                href={service.active ? '/tramites' : '#'}
                className={`${service.active ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              >
                <div className={`text-sm font-medium ${service.active ? 'text-slate-900 hover:text-blue-600' : 'text-slate-500'} transition-colors`}>
                  {service.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">
            Servicios destacados
          </h2>
          <p className="text-slate-600">
            Accede a los servicios más solicitados
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Beneficios por Discapacidad - ACTIVA */}
          <Link href="/tramites">
            <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
              
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-700"></div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
                    Nuevo
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Beneficios por Discapacidad
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
                  Acceso automático a ayudas y descuentos mediante credencial digital verificada
                </p>
                <div className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  Acceder →
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Sanidad - PRÓXIMAMENTE */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden opacity-60 h-full flex flex-col">
            <div className="h-48 bg-slate-100"></div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-slate-200 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
                  Próximamente
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-3">
                Cita Previa Sanitaria
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Solicita cita con tu médico de atención primaria o especialista
              </p>
            </div>
          </div>

          {/* Card 3: Educación - PRÓXIMAMENTE */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden opacity-60 h-full flex flex-col">
            <div className="h-48 bg-slate-100"></div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-slate-200 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
                  Próximamente
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-3">
                Admisión Escolar
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Proceso de escolarización y admisión en centros educativos
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Comunidad de Madrid
              </h4>
              <p className="text-sm">
                Portal de servicios e información
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Enlaces
              </h4>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white transition-colors cursor-pointer">Aviso legal</div>
                <div className="hover:text-white transition-colors cursor-pointer">Accesibilidad</div>
                <div className="hover:text-white transition-colors cursor-pointer">Mapa web</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Contacto
              </h4>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white transition-colors cursor-pointer">Atención al ciudadano</div>
                <div className="hover:text-white transition-colors cursor-pointer">Oficinas de información</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2024 Comunidad de Madrid · Mockup de demostración del sistema Nexo
          </div>
        </div>
      </footer>
    </div>
  )
}