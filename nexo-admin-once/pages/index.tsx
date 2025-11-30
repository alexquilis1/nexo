'use client'
import { useWallet } from '@/lib/wallet'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const { wallet } = useWallet()
  const [loading, setLoading] = useState(false)

  const isWalletConnected = !!wallet

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#FFD700] text-black font-bold text-4xl px-8 py-3 mb-6">
            ONCE
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Sistema de Acreditación Digital
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Fundación ONCE - Portal de Registro y Acreditación Oficial
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Registro Oficial de Personas con Discapacidad
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Este portal permite al personal autorizado de la Fundación ONCE registrar y
            acreditar oficialmente a personas con discapacidad en la blockchain BSV,
            creando un registro inmutable y verificable con{" "}
            <strong>cifrado de extremo a extremo</strong>.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Acreditación oficial y permanente en blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Datos cifrados con AES-256 para máxima seguridad</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Registro inmutable y verificable</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Emisión de credenciales digitales verificables</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#FFD700] mr-2">•</span>
              <span>Acceso exclusivo para personal autorizado de la ONCE</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-[#FFD700] p-4 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Uso restringido:</strong> Este sistema está destinado exclusivamente
            para el personal autorizado de la Fundación ONCE. Se requiere autenticación
            mediante wallet institucional.
          </p>
        </div>

        {/* Estado del Wallet */}
        <div className="mb-6">
          {isWalletConnected ? (
            <div className="flex items-center justify-center gap-2 bg-green-50 border-2 border-green-600 px-4 py-3 rounded">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              <span className="text-sm text-green-700 font-medium">
                Wallet ONCE Conectado
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 bg-red-50 border-2 border-red-600 px-4 py-3 rounded mb-4">
                <span className="text-sm text-red-700 font-medium">
                  Wallet no conectado
                </span>
              </div>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 transition-colors"
                onClick={() => window.location.reload()}
              >
                Conectar Wallet ONCE
              </button>
            </div>
          )}
        </div>

        {/* Botón de Acceso */}
        <div className="text-center">
          {isWalletConnected ? (
            <Link href="/register">
              <button className="bg-[#FFD700] hover:bg-[#E5C200] text-black font-semibold px-12 py-4 text-lg transition-colors">
                Acceder al Registro
              </button>
            </Link>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Por favor, conecta tu wallet para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}