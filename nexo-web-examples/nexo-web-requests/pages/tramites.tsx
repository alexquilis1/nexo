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

  useEffect(() => {
    loadTramites()
  }, [])

  async function loadTramites() {
    setLoading(true)
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
  }

  const filteredTramites = selectedCategory
    ? tramites.filter(t => t.category === selectedCategory)
    : tramites

  function getAmountText(amount: number, frequency: string) {
    if (amount === 0) return 'Gratuito'
    const suffix = frequency === 'monthly' ? '/mes' : frequency === 'annual' ? '/año' : ''
    return `${amount}€${suffix}`
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
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link href="/" className="inline-block">
            <h1 className="text-xl font-medium text-slate-900 hover:text-slate-700 transition-colors">
              Comunidad de Madrid
            </h1>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="text-sm text-slate-600">
            <Link href="/" className="text-slate-900 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-900">Beneficios por Discapacidad</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Page Title */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            Beneficios por Discapacidad
          </h2>
          <p className="text-slate-600 text-lg">
            Solicita ayudas y descuentos con verificación automática mediante credencial Nexo
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
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
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === key
                      ? `bg-white ${textClasses} border-2 ${borderClasses}`
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {info.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-slate-900"></div>
            <p className="mt-4 text-slate-600">Cargando...</p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {filteredTramites.map(tramite => {
                const categoryInfo = CATEGORY_INFO[tramite.category as keyof typeof CATEGORY_INFO]
                const bgClasses = getCategoryColorClasses(categoryInfo.color, 'bg')
                const textClasses = getCategoryColorClasses(categoryInfo.color, 'text')
                const borderClasses = getCategoryColorClasses(categoryInfo.color, 'border')
                
                return (
                  <Link
                    key={tramite.id}
                    href={`/apply-tramite?id=${tramite.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-8 h-full flex flex-col transition-all duration-200 hover:shadow-lg">
                      
                      {/* Category Badge */}
                      <div className="mb-5">
                        <span className={`inline-block ${bgClasses} ${textClasses} px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide`}>
                          {categoryInfo.name}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {tramite.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 mb-5 leading-relaxed flex-grow">
                        {tramite.description}
                      </p>

                      {/* Institution */}
                      <p className="text-sm text-slate-500 mb-6">
                        {tramite.institution}
                      </p>

                      {/* Requirements */}
                      <div className="mb-6 pb-6 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Requisitos
                        </p>
                        <div className="text-sm text-slate-700">
                          Discapacidad tipo <span className="font-medium">{tramite.requirements[0].type}</span> ≥ <span className="font-medium">{tramite.requirements[0].minPercentage}%</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-slate-900">
                          {getAmountText(tramite.amount, tramite.frequency)}
                        </div>
                        <div className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                          Solicitar →
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Info Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                ¿Cómo funciona?
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3">
                    1
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Selecciona el beneficio que deseas solicitar
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3">
                    2
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Inicia sesión con tu credencial Nexo
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3">
                    3
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Verificación automática de requisitos
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold mb-3">
                    4
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Resolución instantánea en blockchain
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-sm text-center">
            © 2024 Comunidad de Madrid
          </div>
        </div>
      </footer>
    </div>
  )
}