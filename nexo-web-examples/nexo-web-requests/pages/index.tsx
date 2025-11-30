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
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Portal de Servicios Públicos
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl">
            Accede a beneficios y ayudas de forma rápida y segura con verificación digital
          </p>
          
          {/* Quick Access Buttons */}
          <nav aria-label="Acceso rápido a servicios">
            <div className="flex flex-wrap gap-4">
              <Link href="/tramites">
                <button 
                  className="bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors min-h-[44px] focus:outline-none focus:ring-4 focus:ring-slate-400"
                  aria-label="Acceder a beneficios por discapacidad"
                >
                  Beneficios por discapacidad
                </button>
              </Link>
              
              <button 
                disabled
                aria-disabled="true"
                className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed min-h-[44px]"
              >
                Cita sanitaria
                <span className="sr-only">(Próximamente disponible)</span>
              </button>
              
              <button 
                disabled
                aria-disabled="true"
                className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed min-h-[44px]"
              >
                Educación
                <span className="sr-only">(Próximamente disponible)</span>
              </button>
              
              <button 
                disabled
                aria-disabled="true"
                className="bg-slate-700 text-slate-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed min-h-[44px]"
              >
                Transporte
                <span className="sr-only">(Próximamente disponible)</span>
              </button>
            </div>
          </nav>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-50 border-b border-slate-200" aria-labelledby="services-nav-title">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 id="services-nav-title" className="sr-only">Navegación por categorías de servicios</h2>
          <nav aria-label="Categorías de servicios">
            <ul className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
              {[
                { label: 'Salud', active: false },
                { label: 'Educación', active: false },
                { label: 'Servicios sociales', active: true },
                { label: 'Empleo', active: false },
                { label: 'Justicia', active: false },
                { label: 'Transporte', active: false }
              ].map((service, i) => (
                <li key={i}>
                  {service.active ? (
                    <Link 
                      href="/tramites"
                      className="block text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-h-[44px] flex items-center justify-center"
                      aria-label={`Ir a ${service.label}`}
                    >
                      {service.label}
                    </Link>
                  ) : (
                    <span 
                      className="block text-sm font-medium text-slate-500 opacity-60 px-2 py-1 min-h-[44px] flex items-center justify-center"
                      aria-label={`${service.label} (No disponible)`}
                    >
                      {service.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Section Title */}
        <header className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">
            Servicios destacados
          </h2>
          <p className="text-slate-700">
            Accede a los servicios más solicitados
          </p>
        </header>

        {/* Cards Grid */}
        <section aria-label="Lista de servicios destacados">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Beneficios por Discapacidad - ACTIVA */}
            <article className="h-full flex flex-col">
              <Link 
                href="/tramites"
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 h-full flex flex-col focus:outline-none focus:ring-4 focus:ring-blue-400"
                aria-label="Acceder a Beneficios por Discapacidad - Servicio nuevo"
              >
                <div 
                  className="h-48 bg-gradient-to-br from-blue-600 to-blue-700"
                  aria-hidden="true"
                ></div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span 
                      className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide"
                      aria-label="Estado: Nuevo"
                    >
                      Nuevo
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Beneficios por Discapacidad
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-4 flex-grow">
                    Acceso automático a ayudas y descuentos mediante credencial digital verificada
                  </p>
                  <div 
                    className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  >
                    Acceder →
                  </div>
                </div>
              </Link>
            </article>

            {/* Card 2: Sanidad - PRÓXIMAMENTE */}
            <article className="h-full flex flex-col">
              <div 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden opacity-60 h-full flex flex-col"
                role="article"
                aria-label="Cita Previa Sanitaria - Próximamente disponible"
              >
                <div 
                  className="h-48 bg-slate-100"
                  aria-hidden="true"
                ></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span 
                      className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide"
                      aria-label="Estado: Próximamente"
                    >
                      Próximamente
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Cita Previa Sanitaria
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Solicita cita con tu médico de atención primaria o especialista
                  </p>
                </div>
              </div>
            </article>

            {/* Card 3: Educación - PRÓXIMAMENTE */}
            <article className="h-full flex flex-col">
              <div 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden opacity-60 h-full flex flex-col"
                role="article"
                aria-label="Admisión Escolar - Próximamente disponible"
              >
                <div 
                  className="h-48 bg-slate-100"
                  aria-hidden="true"
                ></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span 
                      className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide"
                      aria-label="Estado: Próximamente"
                    >
                      Próximamente
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Admisión Escolar
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Proceso de escolarización y admisión en centros educativos
                  </p>
                </div>
              </div>
            </article>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <section aria-labelledby="footer-about">
              <h2 id="footer-about" className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Comunidad de Madrid
              </h2>
              <p className="text-sm text-slate-300">
                Portal de servicios e información
              </p>
            </section>
            <nav aria-labelledby="footer-links">
              <h2 id="footer-links" className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Enlaces
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    Aviso legal
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    Accesibilidad
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    Mapa web
                  </a>
                </li>
              </ul>
            </nav>
            <nav aria-labelledby="footer-contact">
              <h2 id="footer-contact" className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Contacto
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    Atención al ciudadano
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    Oficinas de información
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-300">
            <p>© 2024 Comunidad de Madrid · Mockup de demostración del sistema Nexo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}