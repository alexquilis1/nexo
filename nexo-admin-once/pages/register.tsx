"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import CryptoJS from "crypto-js";

interface PersonalData {
  // Datos personales
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  domicilio: string;
  familiaNumerosa: boolean;
  situacion: string;

  // Discapacidad
  tipoDiscapacidad: string;

  // Visual
  tipoVisual?: string;
  gradoVisual?: string;
  permanenteVisual?: boolean;
  lectorPantalla?: boolean;
  braille?: boolean;
  guiaAudio?: boolean;

  // Auditiva
  gradoAuditiva?: string;
  permanenteAuditiva?: boolean;
  audifono?: boolean;
  lenguaSignos?: boolean;

  // Verificación
  verificadoONCE: boolean;
  fechaVerificacion: string;
  numeroExpediente: string;
  observaciones: string;
}

export default function Register() {
  const { wallet } = useWallet();
  const [formData, setFormData] = useState<PersonalData>({
    nombre: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    domicilio: "",
    familiaNumerosa: false,
    situacion: "",
    tipoDiscapacidad: "",
    verificadoONCE: true,
    fechaVerificacion: new Date().toISOString().split("T")[0],
    numeroExpediente: "",
    observaciones: "",
  });
  const [encryptionKey, setEncryptionKey] = useState("");
  const [showEncryptionSettings, setShowEncryptionSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [txid, setTxid] = useState<string | null>(null);

  // Generar número de expediente único al cargar el componente
  useEffect(() => {
    generateExpedientNumber();
    // Generar clave de cifrado por defecto si no existe
    if (!encryptionKey) {
      generateEncryptionKey();
    }
  }, []);

  // Función para generar número de expediente único
  const generateExpedientNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const expediente = `ONCE-${year}-${randomPart}${timestamp}`;

    setFormData((prev) => ({
      ...prev,
      numeroExpediente: expediente,
    }));
  };

  // Función para generar clave de cifrado
  const generateEncryptionKey = () => {
    const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    setEncryptionKey(key);
  };

  // Función para cifrar datos
  const encryptData = (data: any, key: string): string => {
    const jsonData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonData, key).toString();
    return encrypted;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  async function registerIdentity() {
    if (!wallet) {
      showMessage("Por favor conecta tu wallet de la ONCE", "error");
      return;
    }

    if (
      !formData.nombre ||
      !formData.apellidos ||
      !formData.dni ||
      !formData.fechaNacimiento ||
      !formData.tipoDiscapacidad
    ) {
      showMessage("Por favor completa todos los campos obligatorios", "error");
      return;
    }

    if (!encryptionKey) {
      showMessage("Se requiere una clave de cifrado", "error");
      return;
    }

    setLoading(true);

    try {
      showMessage("Obteniendo identidad de wallet ONCE...", "info");

      const { publicKey: identityKey } = await wallet.getPublicKey({
        identityKey: true,
      });

      showMessage("Cifrando datos personales...", "info");

      // Cifrar los datos personales
      const encryptedData = encryptData(formData, encryptionKey);

      // Hash de la clave para almacenar (no la clave en sí)
      const keyHash = CryptoJS.SHA256(encryptionKey).toString();

      showMessage("Registrando acreditación cifrada en blockchain...", "info");

      const response = await fetch("/api/register-identity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identityKey,
          encryptedData,
          encryptionKey, // Enviamos la clave para guardarla localmente
          keyHash,
          expediente: formData.numeroExpediente,
          dni: formData.dni, // ← AÑADIDO: DNI sin cifrar para JSON local
          issuer: "ONCE",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTxid(data.txid);
        showMessage(
          `Acreditación cifrada registrada exitosamente! TXID: ${data.txid}`,
          "success"
        );

        // Limpiar formulario y generar nuevo número de expediente
        setFormData({
          nombre: "",
          apellidos: "",
          dni: "",
          fechaNacimiento: "",
          domicilio: "",
          familiaNumerosa: false,
          situacion: "",
          tipoDiscapacidad: "",
          verificadoONCE: true,
          fechaVerificacion: new Date().toISOString().split("T")[0],
          numeroExpediente: "",
          observaciones: "",
        });

        // Generar nuevo número de expediente y clave
        setTimeout(() => {
          generateExpedientNumber();
          generateEncryptionKey();
        }, 100);
      } else {
        showMessage(data.error || "Error al registrar acreditación", "error");
      }
    } catch (error: any) {
      console.error("Error en registro:", error);
      showMessage("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text: string, type: string) {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  }

  const isWalletConnected = !!wallet;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-[#FFD700] pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-block bg-[#FFD700] text-black font-bold text-2xl px-4 py-1 mb-3">
                ONCE
              </div>
              <h1 className="text-2xl font-light text-gray-900">
                Acreditación de Persona con Discapacidad
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Portal de Registro Oficial - Personal Autorizado
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setShowEncryptionSettings(!showEncryptionSettings)
                }
                className="flex items-center gap-2 border-2 border-[#FFD700] px-3 py-1 hover:bg-yellow-50 transition-colors"
              >
                <span className="text-sm text-gray-700 font-medium">
                  🔐 Cifrado
                </span>
              </button>
              {isWalletConnected ? (
                <div className="flex items-center gap-2 border-2 border-green-600 px-3 py-1">
                  <span className="w-2 h-2 bg-green-600"></span>
                  <span className="text-sm text-green-600 font-medium">
                    Wallet ONCE
                  </span>
                </div>
              ) : (
                <button
                  className="flex items-center gap-2 border-2 border-red-600 px-3 py-1 hover:bg-red-50 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  <span className="text-sm text-red-600 font-medium">
                    Conectar Wallet
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Configuración de Cifrado */}
        {showEncryptionSettings && (
          <div className="mb-8 bg-blue-50 border-2 border-blue-300 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuración de Cifrado AES-256
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Clave de Cifrado (se genera automáticamente)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 font-mono text-xs"
                    placeholder="Clave de cifrado..."
                  />
                  <button
                    onClick={generateEncryptionKey}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    Regenerar
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠️ <strong>IMPORTANTE:</strong> Guarda esta clave en un lugar
                  seguro. Es necesaria para descifrar los datos posteriormente.
                </p>
              </div>
              <div className="bg-white border border-blue-200 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Seguridad:</strong> Los datos personales se cifran con
                  AES-256 antes de almacenarse en la blockchain. Solo quien
                  tenga la clave de cifrado podrá descifrar la información.
                </p>
              </div>
            </div>
          </div>
        )}

        {isWalletConnected && (
          <form className="space-y-8">
            {/* Datos de Expediente */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Datos del Expediente
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <label className="block text-sm text-gray-700 mb-1">
                    Número de Expediente ONCE (Autogenerado)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.numeroExpediente}
                      disabled
                      className="flex-1 px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={generateExpedientNumber}
                      className="px-4 py-2 bg-[#FFD700] hover:bg-[#E5C200] text-black text-sm font-medium transition-colors"
                      disabled={loading}
                    >
                      Regenerar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Este número se genera automáticamente y es único para cada
                    acreditación
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="fechaVerificacion"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Fecha de Verificación *
                  </label>
                  <input
                    type="date"
                    id="fechaVerificacion"
                    name="fechaVerificacion"
                    value={formData.fechaVerificacion}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  />
                </div>
              </div>
            </section>

            {/* Datos Personales */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Datos Personales del Usuario
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apellidos"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dni"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    DNI / NIE *
                  </label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="12345678A"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fechaNacimiento"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="domicilio"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Domicilio
                  </label>
                  <input
                    type="text"
                    id="domicilio"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Calle, número, piso, ciudad, código postal"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="familiaNumerosa"
                    name="familiaNumerosa"
                    checked={formData.familiaNumerosa}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                  />
                  <label
                    htmlFor="familiaNumerosa"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Familia numerosa
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="situacion"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Situación laboral *
                  </label>
                  <select
                    id="situacion"
                    name="situacion"
                    value={formData.situacion}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="empleado">Empleado</option>
                    <option value="desempleado">Desempleado</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="jubilado">Jubilado</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Información de Discapacidad */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Certificación de Discapacidad
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="tipoDiscapacidad"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Tipo de discapacidad *
                  </label>
                  <select
                    id="tipoDiscapacidad"
                    name="tipoDiscapacidad"
                    value={formData.tipoDiscapacidad}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="visual">Visual</option>
                    <option value="auditiva">Auditiva</option>
                  </select>
                </div>

                {/* Campos específicos para discapacidad visual */}
                {formData.tipoDiscapacidad === "visual" && (
                  <div className="bg-gray-50 p-4 space-y-4 border-l-4 border-[#FFD700]">
                    <h3 className="text-sm font-medium text-gray-900">
                      Evaluación de Discapacidad Visual
                    </h3>

                    <div>
                      <label
                        htmlFor="tipoVisual"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Clasificación
                      </label>
                      <select
                        id="tipoVisual"
                        name="tipoVisual"
                        value={formData.tipoVisual || ""}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                      >
                        <option value="">Seleccionar</option>
                        <option value="ceguera-total">Ceguera total</option>
                        <option value="baja-vision">Baja visión</option>
                        <option value="vision-reducida">Visión reducida</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="gradoVisual"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Grado de discapacidad
                      </label>
                      <select
                        id="gradoVisual"
                        name="gradoVisual"
                        value={formData.gradoVisual || ""}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                      >
                        <option value="">Seleccionar</option>
                        <option value="33-64">33-64%</option>
                        <option value="65-74">65-74%</option>
                        <option value="75-100">75-100%</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permanenteVisual"
                        name="permanenteVisual"
                        checked={formData.permanenteVisual || false}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                      />
                      <label
                        htmlFor="permanenteVisual"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Condición permanente
                      </label>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 font-medium">
                        Tecnologías de apoyo utilizadas:
                      </p>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lectorPantalla"
                          name="lectorPantalla"
                          checked={formData.lectorPantalla || false}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <label
                          htmlFor="lectorPantalla"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Lector de pantalla
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="braille"
                          name="braille"
                          checked={formData.braille || false}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <label
                          htmlFor="braille"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Braille
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="guiaAudio"
                          name="guiaAudio"
                          checked={formData.guiaAudio || false}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <label
                          htmlFor="guiaAudio"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Guía de audio
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campos específicos para discapacidad auditiva */}
                {formData.tipoDiscapacidad === "auditiva" && (
                  <div className="bg-gray-50 p-4 space-y-4 border-l-4 border-[#FFD700]">
                    <h3 className="text-sm font-medium text-gray-900">
                      Evaluación de Discapacidad Auditiva
                    </h3>

                    <div>
                      <label
                        htmlFor="gradoAuditiva"
                        className="block text-sm text-gray-700 mb-1"
                      >
                        Grado de pérdida auditiva
                      </label>
                      <select
                        id="gradoAuditiva"
                        name="gradoAuditiva"
                        value={formData.gradoAuditiva || ""}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50"
                      >
                        <option value="">Seleccionar</option>
                        <option value="leve">Leve (20-40 dB)</option>
                        <option value="moderada">Moderada (41-70 dB)</option>
                        <option value="severa">Severa (71-90 dB)</option>
                        <option value="profunda">Profunda (&gt;90 dB)</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permanenteAuditiva"
                        name="permanenteAuditiva"
                        checked={formData.permanenteAuditiva || false}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                      />
                      <label
                        htmlFor="permanenteAuditiva"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Condición permanente
                      </label>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 font-medium">
                        Tecnologías de apoyo utilizadas:
                      </p>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="audifono"
                          name="audifono"
                          checked={formData.audifono || false}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <label
                          htmlFor="audifono"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Audífono / Implante coclear
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lenguaSignos"
                          name="lenguaSignos"
                          checked={formData.lenguaSignos || false}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-4 h-4 border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                        />
                        <label
                          htmlFor="lenguaSignos"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Lengua de signos
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="observaciones"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Observaciones y notas adicionales
                  </label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    placeholder="Información adicional relevante para la acreditación..."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#FFD700] disabled:bg-gray-50 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Certificación ONCE */}
            <section>
              <div className="bg-[#FFD700] bg-opacity-10 border-2 border-[#FFD700] p-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="verificadoONCE"
                    name="verificadoONCE"
                    checked={formData.verificadoONCE}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 mt-1 border-gray-400 text-[#FFD700] focus:ring-[#FFD700]"
                  />
                  <label
                    htmlFor="verificadoONCE"
                    className="ml-3 text-sm text-gray-900"
                  >
                    <span className="font-bold text-base">
                      Certificación Oficial de la Fundación ONCE
                    </span>
                    <p className="text-gray-700 mt-2">
                      Declaro que la información registrada en este formulario
                      ha sido verificada y validada según los protocolos
                      oficiales de la Fundación ONCE, y que todos los datos
                      corresponden a documentación oficial presentada por el
                      usuario.
                    </p>
                    <p className="text-gray-600 mt-2 text-xs">
                      Este registro generará una acreditación digital cifrada e
                      inmutable en blockchain BSV.
                    </p>
                  </label>
                </div>
              </div>
            </section>

            {/* Botones */}
            <div className="space-y-3 pt-4 pb-8">
              <button
                type="button"
                onClick={registerIdentity}
                disabled={
                  loading || !isWalletConnected || !formData.verificadoONCE
                }
                className="w-full bg-[#FFD700] hover:bg-[#E5C200] text-black font-semibold py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Cifrando y registrando..."
                  : "🔐 Emitir Acreditación Cifrada"}
              </button>

              {txid && (
                <div className="bg-green-50 border-2 border-green-300 p-6">
                  <p className="text-base font-bold text-green-800 mb-3">
                    ✓ Acreditación cifrada registrada exitosamente
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      <strong>Expediente:</strong> {formData.numeroExpediente}
                    </p>
                    <div className="bg-blue-50 border border-blue-300 p-3 mt-3">
                      <p className="text-xs font-bold text-blue-800 mb-1">
                        ℹ️ Clave de cifrado guardada de forma segura
                      </p>
                      <p className="text-xs text-blue-700">
                        La clave de cifrado se ha guardado de forma segura en el
                        servidor junto con el registro. Podrás descifrar los
                        datos posteriormente usando el número de expediente.
                      </p>
                    </div>
                    <p className="text-xs text-green-700 mt-3">
                      Transaction ID:
                    </p>
                    <a
                      href={`https://whatsonchain.com/tx/${txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-800 font-mono break-all underline block"
                    >
                      {txid}
                    </a>
                  </div>
                </div>
              )}

              <Link href="/" className="block w-full">
                <button
                  type="button"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 transition-colors"
                >
                  Volver al Inicio
                </button>
              </Link>
            </div>
          </form>
        )}

        {/* Messages */}
        {message && (
          <div className="mb-8">
            <div
              className={`border px-4 py-3 ${
                messageType === "success"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : messageType === "error"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-blue-50 border-blue-300 text-blue-800"
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
