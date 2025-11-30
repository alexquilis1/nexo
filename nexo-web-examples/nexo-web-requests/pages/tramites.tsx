import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Tramite {
  id: number
  name: string
  description: string
  institution: string
  amount: number
  frequency: string
  category: string
  requirements: {
    type: string
    minPercentage: number
  }[]
}

const CATEGORY_INFO = {
  transporte: { name: 'Transporte', color: 'blue' },
  sanitario: { name: 'Sanitario', color: 'rose' },
  fiscal: { name: 'Fiscal', color: 'teal' }
}

export default function TramitesPage() {
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    loadTramites()
  }, [])

  useEffect(() => {
    if (selectedCategory === null) {
      setAnnouncement(`Mostrando todos los beneficios: ${tramites.length} resultados`)
    } else {
      const count = filteredTramites.length
      const categoryName = CATEGORY_INFO[selectedCategory as keyof typeof CATEGORY_INFO]?.name
      setAnnouncement(`Filtrado por ${categoryName}: ${count} resultados`)
    }
  }, [selectedCategory, tramites])

  async function loadTramites() {
    setLoading(true)
    setAnnouncement('Cargando beneficios disponibles')
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockTramites: Tramite[] = [
      {
        id: 2,
        name: 'Descuento en Transporte Público',
        description: 'Reducción del 50% en el abono mensual de transporte público de la Comunidad de Madrid',
        institution: 'Consorcio Regional de Transportes',
        amount: 27.35,
        frequency: 'monthly',
        category: 'transporte',
        requirements: [{ type: 'visual', minPercentage: 33 }]
      },
      {
        id: 3,
        name: 'Ayudas Técnicas para Discapacidad Visual',
        description: 'Subvención para la adquisición de ayudas técnicas como magnificadores, líneas braille y dispositivos de apoyo',
        institution: 'ONCE y Comunidad de Madrid',
        amount: 600,
        frequency: 'one-time',
        category: 'sanitario',
        requirements: [{ type: 'visual', minPercentage: 33 }]
      },
      {
        id: 7,
        name: 'Deducción Fiscal por Discapacidad Severa',
        description: 'Deducción fiscal anual de 3.000€ en la declaración de la renta para personas con discapacidad igual o superior al 65%',
        institution: 'Agencia Tributaria',
        amount: 3000,
        frequency: 'annual',
        category: 'fiscal',
        requirements: [{ type: 'visual', minPercentage: 65 }]
      }
    ]
    
    setTramites(mockTramites)
    setLoading(false)
    setAnnouncement(`Carga completada: ${mockTramites.length} beneficios disponibles`)
  }

  const filteredTramites = selectedCategory
    ? tramites.filter(t => t.category === selectedCategory)
    : tramites

  function getAmountText(amount: number, frequency: string) {
    if (amount === 0) return 'Gratuito'
    const suffix = frequency === 'monthly' ? ' al mes' : frequency === 'annual' ? ' al año' : ''
    return `${amount} euros${suffix}`
  }

  function getCategoryColorClasses(color: string, variant: 'bg' | 'text' | 'border' | 'shadow') {
    const colors = {
      blue: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-500', 
        shadow: 'shadow-blue-500/20' 
      },
      rose: { 
        bg: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-500', 
        shadow: 'shadow-rose-500/20' 
      },
      teal: { 
        bg: 'bg-teal-50', 
        text: 'text-teal-700', 
        border: 'border-teal-500', 
        shadow: 'shadow-teal-500/20' 
      },
    }
    return colors[color as keyof typeof colors]?.[variant] || ''
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Live Region para anuncios */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link 
            href="/" 
            className="inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <h1 className="text-xl font-medium text-slate-900 hover:text-slate-700 transition-colors">
              Comunidad de Madrid
            </h1>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-slate-100" aria-label="Ruta de navegación">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <ol className="text-sm text-slate-600 flex items-center">
            <li>
              <Link 
                href="/" 
                className="text-slate-900 hover:text-blue-600 transition-colors focus:outline-none focus:underline"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2 text-slate-400">/</li>
            <li aria-current="page">
              <span className="text-slate-900">Beneficios por Discapacidad</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Page Title */}
        <header className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            Beneficios por Discapacidad
          </h2>
          <p className="text-slate-700 text-lg">
            Solicita ayudas y descuentos con verificación automática mediante credencial Nexo
          </p>
        </header>

        {/* Category Filters */}
        <section className="mb-12" aria-labelledby="filter-title">
          <h3 id="filter-title" className="sr-only">Filtrar beneficios por categoría</h3>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Filtros de categoría">
            <button
              onClick={() => setSelectedCategory(null)}
              aria-pressed={selectedCategory === null}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all min-h-[44px] focus:outline-none focus:ring-4 focus:ring-slate-400 ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todos ({tramites.length})
            </button>
            
            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
              const count = tramites.filter(t => t.category === key).length
              if (count === 0) return null
              
              const textClasses = getCategoryColorClasses(info.color, 'text')
              const borderClasses = getCategoryColorClasses(info.color, 'border')
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  aria-pressed={selectedCategory === key}
                  aria-label={`Filtrar por ${info.name}, ${count} resultados`}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all min-h-[44px] focus:outline-none focus:ring-4 ${
                    selectedCategory === key
                      ? `bg-white ${textClasses} border-2 ${borderClasses} focus:ring-${info.color}-400`
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 focus:ring-slate-400'
                  }`}
                >
                  {info.name} ({count})
                </button>
              )
            })}
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <div 
            className="text-center py-20" 
            role="status" 
            aria-live="polite"
          >
            <div 
              className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-slate-900"
              aria-hidden="true"
            ></div>
            <p className="mt-4 text-slate-700">Cargando beneficios disponibles...</p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <section aria-label="Lista de beneficios disponibles">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                {filteredTramites.map(tramite => {
                  const categoryInfo = CATEGORY_INFO[tramite.category as keyof typeof CATEGORY_INFO]
                  const bgClasses = getCategoryColorClasses(categoryInfo.color, 'bg')
                  const textClasses = getCategoryColorClasses(categoryInfo.color, 'text')
                  
                  return (
                    <article key={tramite.id}>
                      <Link
                        href={`/apply-tramite?id=${tramite.id}`}
                        className="group block focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-xl"
                        aria-label={`Solicitar ${tramite.name}, ${getAmountText(tramite.amount, tramite.frequency)}`}
                      >
                        <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-8 h-full flex flex-col transition-all duration-200 hover:shadow-lg">
                          
                          {/* Category Badge */}
                          <div className="mb-5">
                            <span 
                              className={`inline-block ${bgClasses} ${textClasses} px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide`}
                              aria-label={`Categoría: ${categoryInfo.name}`}
                            >
                              {categoryInfo.name}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {tramite.name}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-700 mb-5 leading-relaxed flex-grow">
                            {tramite.description}
                          </p>

                          {/* Institution */}
                          <p className="text-sm text-slate-600 mb-6">
                            {tramite.institution}
                          </p>

                          {/* Requirements */}
                          <div className="mb-6 pb-6 border-b border-slate-100">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                              Requisitos
                            </p>
                            <p className="text-sm text-slate-800">
                              Discapacidad tipo <strong>{tramite.requirements[0].type}</strong>, porcentaje mínimo <strong>{tramite.requirements[0].minPercentage}%</strong>
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-slate-900">
                              {tramite.amount === 0 ? 'Gratuito' : `${tramite.amount}€`}
                              {tramite.frequency === 'monthly' && <span className="text-base font-normal text-slate-600">/mes</span>}
                              {tramite.frequency === 'annual' && <span className="text-base font-normal text-slate-600">/año</span>}
                            </div>
                            <div 
                              className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform"
                              aria-hidden="true"
                            >
                              Solicitar →
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* Info Section */}
            <section 
              className="bg-white border border-slate-200 rounded-xl p-8"
              aria-labelledby="how-it-works-title"
            >
              <h3 id="how-it-works-title" className="text-xl font-semibold text-slate-900 mb-6">
                ¿Cómo funciona?
              </h3>
              <ol className="grid md:grid-cols-4 gap-6">
                <li>
                  <div 
                    className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3"
                    aria-hidden="true"
                  >
                    1
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>Paso 1:</strong> Selecciona el beneficio que deseas solicitar
                  </p>
                </li>
                <li>
                  <div 
                    className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3"
                    aria-hidden="true"
                  >
                    2
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>Paso 2:</strong> Inicia sesión con tu credencial Nexo
                  </p>
                </li>
                <li>
                  <div 
                    className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3"
                    aria-hidden="true"
                  >
                    3
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>Paso 3:</strong> Verificación automática de requisitos
                  </p>
                </li>
                <li>
                  <div 
                    className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3"
                    aria-hidden="true"
                  >
                    4
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>Paso 4:</strong> Resolución instantánea en blockchain
                  </p>
                </li>
              </ol>
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-center">
            © 2024 Comunidad de Madrid
          </p>
        </div>
      </footer>
    </div>
  )
}