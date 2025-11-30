import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const DEMO_USER = {
  txid: 'eed28d9adeb3e9f8b2663f5bed30cd03a12f09f8f3048cf27e07ca68dd537e06',
  dni: '12345678X',
  fullName: 'María García López',
  disabilityType: 'visual',
  disabilityPercentage: 85,
  disabilityDetail: 'Ceguera total',
  expediente: 'ONCE-2024-VIS8529'
}

const TRAMITES_DATA: any = {
  2: {
    id: 2,
    name: 'Descuento en Transporte Público',
    description: 'Reducción del 50% en el abono mensual de transporte público de la Comunidad de Madrid',
    institution: 'Consorcio Regional de Transportes',
    amount: 27.35,
    frequency: 'monthly',
    requirements: [{ type: 'visual', minPercentage: 33 }]
  },
  3: {
    id: 3,
    name: 'Ayudas Técnicas para Discapacidad Visual',
    description: 'Subvención para la adquisición de ayudas técnicas como magnificadores, líneas braille y dispositivos de apoyo',
    institution: 'ONCE y Comunidad de Madrid',
    amount: 600,
    frequency: 'one-time',
    requirements: [{ type: 'visual', minPercentage: 33 }]
  },
  7: {
    id: 7,
    name: 'Deducción Fiscal por Discapacidad Severa',
    description: 'Deducción fiscal anual de 3.000€ en la declaración de la renta para personas con discapacidad igual o superior al 65%',
    institution: 'Agencia Tributaria',
    amount: 3000,
    frequency: 'annual',
    requirements: [{ type: 'visual', minPercentage: 65 }]
  }
}

export default function ApplyTramitePage() {
  const searchParams = useSearchParams()
  const [tramite, setTramite] = useState<any>(null)
  const [step, setStep] = useState<'login' | 'verify' | 'confirm' | 'result'>('login')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id && TRAMITES_DATA[id]) {
      setTramite(TRAMITES_DATA[id])
    }
  }, [searchParams])

  // Anunciar cambios de paso
  useEffect(() => {
    const messages = {
      login: 'Paso 1 de 3: Solicitar Beneficio',
      verify: 'Paso 2 de 3: Verificación de Elegibilidad. Sesión iniciada correctamente.',
      confirm: 'Paso 3 de 3: Confirmar Solicitud. Requisitos cumplidos.',
      result: result?.success 
        ? 'Solicitud Aprobada exitosamente' 
        : 'Solicitud Rechazada. No cumples los requisitos.'
    }
    setAnnouncement(messages[step] || '')
  }, [step, result])

  function handleAutoLogin() {
    setProcessing(true)
    setAnnouncement('Iniciando sesión, por favor espera')
    setTimeout(() => {
      setStep('verify')
      setProcessing(false)
    }, 800)
  }

  function handleVerifyEligibility() {
    setProcessing(true)
    setAnnouncement('Verificando requisitos, por favor espera')

    setTimeout(() => {
      const req = tramite.requirements[0]
      const t = DEMO_USER.disabilityType === req.type
      const p = DEMO_USER.disabilityPercentage >= req.minPercentage

      if (t && p) {
        setStep('confirm')
      } else {
        setResult({
          success: false,
          eligible: false,
          reason: !t
            ? `Se requiere discapacidad de tipo '${req.type}'.`
            : `Se requiere un porcentaje mínimo de ${req.minPercentage}%. Tu porcentaje actual es ${DEMO_USER.disabilityPercentage}%.`
        })
        setStep('result')
      }
      setProcessing(false)
    }, 1200)
  }

  function handleSubmitApplication() {
    setProcessing(true)
    setAnnouncement('Enviando solicitud, por favor espera')

    setTimeout(() => {
      const mockTxid = crypto.randomUUID().replace(/-/g, '')
      setResult({
        success: true,
        eligible: true,
        txid: mockTxid,
        applicationId: `APP-${Date.now()}`,
        approvedAt: new Date().toISOString(),
        amount: tramite.amount,
        frequency: tramite.frequency
      })
      setStep('result')
      setProcessing(false)
    }, 1500)
  }

  // ================================================
  // PASO 1: LOGIN
  // ================================================
  if (!tramite || step === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        {/* Live Region para anuncios */}
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <main className="w-full max-w-2xl">
          <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <header className="bg-slate-900 px-8 py-6 text-white">
              <p className="text-sm font-medium text-slate-300 mb-1" aria-label="Progreso">
                Paso 1 de 3
              </p>
              <h1 className="text-2xl font-semibold">Solicitar Beneficio</h1>
            </header>

            {/* Content */}
            <div className="p-8">
              
              {/* Tramite Info */}
              <section 
                className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200"
                aria-labelledby="tramite-title"
              >
                <h2 id="tramite-title" className="text-lg font-semibold text-slate-900 mb-3">
                  {tramite?.name}
                </h2>
                <p className="text-slate-700 mb-4">{tramite?.description}</p>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-600">Institución</dt>
                    <dd className="font-medium text-slate-900">{tramite?.institution}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Importe</dt>
                    <dd className="font-medium text-slate-900">
                      {tramite?.amount === 0 ? 'Gratuito' : `${tramite?.amount} euros`}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Requirements */}
              <section 
                className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-200"
                aria-labelledby="requisitos-title"
              >
                <h3 id="requisitos-title" className="font-semibold text-slate-900 mb-3">
                  Requisitos
                </h3>
                <ul className="space-y-2">
                  {tramite?.requirements?.map((r: any, i: number) => (
                    <li key={i} className="text-slate-800 text-sm">
                      Tipo de discapacidad: <strong>{r.type}</strong>. 
                      Porcentaje mínimo: <strong>{r.minPercentage}%</strong>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Actions */}
              <button
                onClick={handleAutoLogin}
                disabled={processing}
                aria-busy={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all min-h-[44px] ${
                  processing
                    ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-400'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span 
                      className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Iniciando sesión...</span>
                  </span>
                ) : (
                  'Iniciar Sesión con Nexo'
                )}
              </button>

              <Link href="/tramites">
                <button 
                  className="w-full mt-3 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-lg font-medium border border-slate-300 transition-colors min-h-[44px] focus:outline-none focus:ring-4 focus:ring-slate-400"
                  aria-label="Volver a la lista de beneficios"
                >
                  Volver
                </button>
              </Link>
            </div>
          </article>
        </main>
      </div>
    )
  }

  // ================================================
  // PASO 2: VERIFICAR
  // ================================================

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <main className="w-full max-w-2xl">
          <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <header className="bg-slate-900 px-8 py-6 text-white">
              <p className="text-sm font-medium text-slate-300 mb-1" aria-label="Progreso">
                Paso 2 de 3
              </p>
              <h1 className="text-2xl font-semibold">Verificación de Elegibilidad</h1>
            </header>

            {/* Content */}
            <div className="p-8">
              
              {/* Success Message */}
              <section 
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6"
                role="status"
                aria-label="Estado de sesión"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900">Sesión iniciada correctamente</p>
                    <p className="text-sm text-emerald-800">Credencial Nexo verificada</p>
                  </div>
                </div>
              </section>
              
              {/* User Info */}
              <section 
                className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200"
                aria-labelledby="user-info-title"
              >
                <h2 id="user-info-title" className="font-semibold text-slate-900 mb-4">
                  Datos del usuario
                </h2>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-600 mb-1">Nombre completo</dt>
                    <dd className="font-semibold text-slate-900">{DEMO_USER.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600 mb-1">DNI</dt>
                    <dd className="font-semibold text-slate-900">{DEMO_USER.dni}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600 mb-1">Tipo de discapacidad</dt>
                    <dd className="font-semibold text-slate-900 capitalize">{DEMO_USER.disabilityType}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600 mb-1">Porcentaje</dt>
                    <dd className="font-semibold text-slate-900">{DEMO_USER.disabilityPercentage}%</dd>
                  </div>
                </dl>
              </section>

              {/* Action */}
              <button
                onClick={handleVerifyEligibility}
                disabled={processing}
                aria-busy={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all min-h-[44px] ${
                  processing
                    ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-400'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span 
                      className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Verificando requisitos...</span>
                  </span>
                ) : (
                  'Verificar y Continuar'
                )}
              </button>
            </div>
          </article>
        </main>
      </div>
    )
  }

  // ================================================
  // PASO 3: CONFIRMAR SOLICITUD
  // ================================================

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <main className="w-full max-w-2xl">
          <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <header className="bg-slate-900 px-8 py-6 text-white">
              <p className="text-sm font-medium text-slate-300 mb-1" aria-label="Progreso">
                Paso 3 de 3
              </p>
              <h1 className="text-2xl font-semibold">Confirmar Solicitud</h1>
            </header>

            {/* Content */}
            <div className="p-8">
              
              {/* Success Check */}
              <section 
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8"
                role="status"
                aria-label="Estado de verificación"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0"
                    aria-hidden="true"
                  >
                    ✓
                  </div>
                  <div>
                    <h2 className="font-semibold text-emerald-900 text-lg mb-2">
                      Requisitos cumplidos
                    </h2>
                    <p className="text-emerald-800 mb-4">
                      Has sido verificado exitosamente. Estás a punto de solicitar el siguiente beneficio:
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-emerald-100">
                      <p className="font-semibold text-slate-900 mb-1">{tramite.name}</p>
                      <p className="text-sm text-slate-700">{tramite.description}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action */}
              <button
                onClick={handleSubmitApplication}
                disabled={processing}
                aria-busy={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all min-h-[44px] ${
                  processing
                    ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-400'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span 
                      className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Enviando solicitud...</span>
                  </span>
                ) : (
                  'Confirmar y Enviar Solicitud'
                )}
              </button>
            </div>
          </article>
        </main>
      </div>
    )
  }

  // ================================================
  // PASO 4: RESULTADO
  // ================================================

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        <main className="w-full max-w-2xl">
          <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <header className={`px-8 py-6 text-white ${
              result.success ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <h1 className="text-2xl font-semibold">
                {result.success ? 'Solicitud Aprobada' : 'Solicitud Rechazada'}
              </h1>
            </header>

            {/* Content */}
            <div className="p-8">
              
              {/* ERROR */}
              {!result.success && (
                <section 
                  className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-6"
                  role="alert"
                  aria-labelledby="error-title"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0"
                      aria-hidden="true"
                    >
                      ✕
                    </div>
                    <div>
                      <h2 id="error-title" className="font-semibold text-rose-900 text-lg mb-2">
                        No cumples los requisitos
                      </h2>
                      <p className="text-rose-800">{result.reason}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* ÉXITO */}
              {result.success && (
                <section 
                  className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6"
                  role="status"
                  aria-labelledby="success-title"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0"
                      aria-hidden="true"
                    >
                      ✓
                    </div>
                    <div className="flex-grow">
                      <h2 id="success-title" className="font-semibold text-emerald-900 text-xl mb-4">
                        Solicitud procesada con éxito
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-600 mb-1" id="app-id-label">
                            ID de Aplicación
                          </p>
                          <p 
                            className="font-mono font-semibold text-slate-900"
                            aria-labelledby="app-id-label"
                          >
                            {result.applicationId}
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-600 mb-1" id="txid-label">
                            Transaction ID (Blockchain BSV)
                          </p>
                          <p 
                            className="font-mono text-xs text-slate-900 break-all"
                            aria-labelledby="txid-label"
                          >
                            {result.txid}
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-600 mb-1" id="date-label">
                            Fecha de aprobación
                          </p>
                          <p 
                            className="font-semibold text-slate-900"
                            aria-labelledby="date-label"
                          >
                            {new Date(result.approvedAt).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Action */}
              <Link href="/tramites">
                <button 
                  className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors min-h-[44px] focus:outline-none focus:ring-4 focus:ring-slate-400"
                  aria-label="Volver a la lista de beneficios"
                >
                  Volver a Beneficios
                </button>
              </Link>
            </div>
          </article>
        </main>
      </div>
    )
  }
}