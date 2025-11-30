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

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id && TRAMITES_DATA[id]) {
      setTramite(TRAMITES_DATA[id])
    }
  }, [searchParams])

  function handleAutoLogin() {
    setProcessing(true)
    setTimeout(() => {
      setStep('verify')
      setProcessing(false)
    }, 800)
  }

  function handleVerifyEligibility() {
    setProcessing(true)

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
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6 text-white">
              <div className="text-sm font-medium text-slate-400 mb-1">Paso 1 de 3</div>
              <h1 className="text-2xl font-semibold">Solicitar Beneficio</h1>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Tramite Info */}
              <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  {tramite?.name}
                </h2>
                <p className="text-slate-600 mb-4">{tramite?.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Institución</span>
                    <p className="font-medium text-slate-900">{tramite?.institution}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Importe</span>
                    <p className="font-medium text-slate-900">
                      {tramite?.amount === 0 ? 'Gratuito' : `${tramite?.amount}€`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-200">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Requisitos
                </h3>
                <ul className="space-y-2">
                  {tramite?.requirements?.map((r: any, i: number) => (
                    <li key={i} className="text-slate-700 text-sm">
                      • Tipo de discapacidad: <strong>{r.type}</strong> — Porcentaje mínimo: <strong>{r.minPercentage}%</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <button
                onClick={handleAutoLogin}
                disabled={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all ${
                  processing
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión con Nexo'
                )}
              </button>

              <Link href="/tramites">
                <button className="w-full mt-3 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium border border-slate-200 transition-colors">
                  Volver
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================================================
  // PASO 2: VERIFICAR
  // ================================================

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6 text-white">
              <div className="text-sm font-medium text-slate-400 mb-1">Paso 2 de 3</div>
              <h1 className="text-2xl font-semibold">Verificación de Elegibilidad</h1>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Success Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900">Sesión iniciada correctamente</p>
                    <p className="text-sm text-emerald-700">Credencial Nexo verificada</p>
                  </div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Datos del usuario</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Nombre completo</p>
                    <p className="font-semibold text-slate-900">{DEMO_USER.fullName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">DNI</p>
                    <p className="font-semibold text-slate-900">{DEMO_USER.dni}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Tipo de discapacidad</p>
                    <p className="font-semibold text-slate-900 capitalize">{DEMO_USER.disabilityType}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Porcentaje</p>
                    <p className="font-semibold text-slate-900">{DEMO_USER.disabilityPercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleVerifyEligibility}
                disabled={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all ${
                  processing
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Verificando requisitos...
                  </span>
                ) : (
                  'Verificar y Continuar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================================================
  // PASO 3: CONFIRMAR SOLICITUD
  // ================================================

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-900 px-8 py-6 text-white">
              <div className="text-sm font-medium text-slate-400 mb-1">Paso 3 de 3</div>
              <h1 className="text-2xl font-semibold">Confirmar Solicitud</h1>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Success Check */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-lg mb-2">
                      Requisitos cumplidos
                    </h3>
                    <p className="text-emerald-700 mb-4">
                      Has sido verificado exitosamente. Estás a punto de solicitar el siguiente beneficio:
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-emerald-100">
                      <p className="font-semibold text-slate-900 mb-1">{tramite.name}</p>
                      <p className="text-sm text-slate-600">{tramite.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleSubmitApplication}
                disabled={processing}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all ${
                  processing
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Enviando solicitud...
                  </span>
                ) : (
                  'Confirmar y Enviar Solicitud'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================================================
  // PASO 4: RESULTADO
  // ================================================

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className={`px-8 py-6 text-white ${
              result.success ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <h1 className="text-2xl font-semibold">
                {result.success ? 'Solicitud Aprobada' : 'Solicitud Rechazada'}
              </h1>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* ERROR */}
              {!result.success && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      ✕
                    </div>
                    <div>
                      <h3 className="font-semibold text-rose-900 text-lg mb-2">
                        No cumples los requisitos
                      </h3>
                      <p className="text-rose-700">{result.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉXITO */}
              {result.success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-emerald-900 text-xl mb-4">
                        Solicitud procesada con éxito
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-500 mb-1">ID de Aplicación</p>
                          <p className="font-mono font-semibold text-slate-900">{result.applicationId}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-500 mb-1">Transaction ID (Blockchain BSV)</p>
                          <p className="font-mono text-xs text-slate-900 break-all">{result.txid}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-slate-500 mb-1">Fecha de aprobación</p>
                          <p className="font-semibold text-slate-900">
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
                </div>
              )}

              {/* Action */}
              <Link href="/tramites">
                <button className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                  Volver a Beneficios
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}