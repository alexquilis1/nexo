import { OP, Script, Utils } from '@bsv/sdk'
import { randomBytes } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { saveIdentityRecord } from '../../lib/identity-storage'
import { wallet } from '../../src/wallet'

interface PersonalData {
  // Datos personales
  nombre: string
  apellidos: string
  dni: string
  fechaNacimiento: string
  domicilio: string
  familiaNumerosa: boolean
  situacion: string

  // Discapacidad
  tipoDiscapacidad: string

  // Visual
  tipoVisual?: string
  gradoVisual?: string
  permanenteVisual?: boolean
  lectorPantalla?: boolean
  braille?: boolean
  guiaAudio?: boolean

  // Auditiva
  gradoAuditiva?: string
  permanenteAuditiva?: boolean
  audifono?: boolean
  lenguaSignos?: boolean

  // Verificación
  verificadoONCE: boolean
  fechaVerificacion: string
  numeroExpediente: string
  observaciones: string
}

interface RequestBody {
  identityKey: string
  encryptedData: string
  encryptionKey: string
  keyHash: string
  expediente: string
  dni: string
  issuer?: string
  timestamp?: string
}

// Enums para categorización de errores
enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  ENCRYPTION = 'ENCRYPTION',
  BLOCKCHAIN = 'BLOCKCHAIN',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Función auxiliar para categorizar errores
function categorizeError(error: any): { category: ErrorCategory; severity: ErrorSeverity } {
  const message = error.message?.toLowerCase() || ''
  
  // Validación
  if (message.includes('requerido') || message.includes('falta') || message.includes('invalid')) {
    return { category: ErrorCategory.VALIDATION, severity: ErrorSeverity.LOW }
  }
  
  // Cifrado
  if (message.includes('encrypt') || message.includes('decrypt') || message.includes('cipher')) {
    return { category: ErrorCategory.ENCRYPTION, severity: ErrorSeverity.HIGH }
  }
  
  // Blockchain
  if (message.includes('transaction') || message.includes('txid') || message.includes('wallet')) {
    return { category: ErrorCategory.BLOCKCHAIN, severity: ErrorSeverity.CRITICAL }
  }
  
  // Almacenamiento
  if (message.includes('save') || message.includes('storage') || message.includes('file')) {
    return { category: ErrorCategory.STORAGE, severity: ErrorSeverity.MEDIUM }
  }
  
  // Red
  if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
    return { category: ErrorCategory.NETWORK, severity: ErrorSeverity.MEDIUM }
  }
  
  return { category: ErrorCategory.UNKNOWN, severity: ErrorSeverity.MEDIUM }
}

// Función de logging estructurado
function logError(error: any, context: {
  expediente?: string
  identityKey?: string
  phase: string
  requestId?: string
}) {
  const { category, severity } = categorizeError(error)
  const timestamp = new Date().toISOString()
  
  console.error('╔═══════════════════════════════════════════════════════════╗')
  console.error('║          ERROR EN REGISTRO DE ACREDITACIÓN ONCE           ║')
  console.error('╚═══════════════════════════════════════════════════════════╝')
  console.error('')
  
  // Información temporal
  console.error('┌─ INFORMACIÓN TEMPORAL ─────────────────────────────────────┐')
  console.error(`│ Timestamp:     ${timestamp}`)
  console.error(`│ Fecha local:   ${new Date().toLocaleString('es-ES', { 
    timeZone: 'Europe/Madrid',
    dateStyle: 'full',
    timeStyle: 'long'
  })}`)
  if (context.requestId) {
    console.error(`│ Request ID:    ${context.requestId}`)
  }
  console.error('└────────────────────────────────────────────────────────────┘')
  console.error('')
  
  // Clasificación del error
  console.error('┌─ CLASIFICACIÓN ────────────────────────────────────────────┐')
  console.error(`│ Categoría:     ${category}`)
  console.error(`│ Severidad:     ${severity}`)
  console.error(`│ Fase:          ${context.phase}`)
  console.error('└────────────────────────────────────────────────────────────┘')
  console.error('')
  
  // Detalles del error
  console.error('┌─ DETALLES DEL ERROR ───────────────────────────────────────┐')
  console.error(`│ Tipo:          ${error.name || 'Error'}`)
  console.error(`│ Mensaje:       ${error.message || 'Sin mensaje'}`)
  if (error.code) {
    console.error(`│ Código:        ${error.code}`)
  }
  console.error('└────────────────────────────────────────────────────────────┘')
  console.error('')
  
  // Contexto de la operación
  if (context.expediente || context.identityKey) {
    console.error('┌─ CONTEXTO DE LA OPERACIÓN ─────────────────────────────────┐')
    if (context.expediente) {
      console.error(`│ Expediente:    ${context.expediente}`)
    }
    if (context.identityKey) {
      console.error(`│ Identity Key:  ${context.identityKey.substring(0, 16)}...`)
    }
    console.error('└────────────────────────────────────────────────────────────┘')
    console.error('')
  }
  
  // Stack trace (solo en desarrollo)
  if (error.stack && process.env.NODE_ENV === 'development') {
    console.error('┌─ STACK TRACE ──────────────────────────────────────────────┐')
    const stackLines = error.stack.split('\n')
    stackLines.forEach((line: string, index: number) => {
      if (index === 0) {
        console.error(`│ ${line}`)
      } else {
        console.error(`│   ${line.trim()}`)
      }
    })
    console.error('└────────────────────────────────────────────────────────────┘')
    console.error('')
  }
  
  // Información adicional del error
  if (error.response || error.config || error.cause) {
    console.error('┌─ INFORMACIÓN ADICIONAL ────────────────────────────────────┐')
    
    if (error.response) {
      console.error(`│ HTTP Status:   ${error.response.status}`)
      console.error(`│ HTTP Data:     ${JSON.stringify(error.response.data).substring(0, 100)}`)
    }
    
    if (error.config?.url) {
      console.error(`│ URL:           ${error.config.url}`)
    }
    
    if (error.cause) {
      console.error(`│ Causa:         ${error.cause}`)
    }
    
    console.error('└────────────────────────────────────────────────────────────┘')
    console.error('')
  }
  
  // Recomendaciones según el tipo de error
  console.error('┌─ RECOMENDACIONES ──────────────────────────────────────────┐')
  
  switch (category) {
    case ErrorCategory.VALIDATION:
      console.error('│ • Verificar que todos los campos requeridos estén presentes')
      console.error('│ • Validar el formato de los datos enviados')
      console.error('│ • Revisar la estructura del objeto RequestBody')
      break
      
    case ErrorCategory.ENCRYPTION:
      console.error('│ • Verificar la clave de cifrado')
      console.error('│ • Comprobar el algoritmo de cifrado (AES-256)')
      console.error('│ • Revisar la integridad de los datos cifrados')
      break
      
    case ErrorCategory.BLOCKCHAIN:
      console.error('│ • Verificar la conexión con el wallet BSV')
      console.error('│ • Comprobar el saldo disponible')
      console.error('│ • Revisar el script OP_RETURN generado')
      console.error('│ • Verificar la configuración de red (mainnet/testnet)')
      break
      
    case ErrorCategory.STORAGE:
      console.error('│ • Verificar permisos de escritura en el archivo')
      console.error('│ • Comprobar el espacio disponible en disco')
      console.error('│ • Revisar la ruta del archivo de almacenamiento')
      break
      
    case ErrorCategory.NETWORK:
      console.error('│ • Verificar la conexión a internet')
      console.error('│ • Comprobar el estado del servicio blockchain')
      console.error('│ • Revisar configuración de proxy/firewall')
      break
      
    default:
      console.error('│ • Revisar los logs completos para más detalles')
      console.error('│ • Contactar con el equipo de desarrollo si persiste')
      break
  }
  
  console.error('└────────────────────────────────────────────────────────────┘')
  console.error('')
  console.error('╔═══════════════════════════════════════════════════════════╗')
  console.error('║                    FIN DEL REPORTE DE ERROR               ║')
  console.error('╚═══════════════════════════════════════════════════════════╝')
  console.error('')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = randomBytes(4).toString('hex')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  let expediente: string | undefined
  let identityKey: string | undefined

  try {
    const { 
      identityKey: reqIdentityKey, 
      encryptedData, 
      encryptionKey,
      keyHash, 
      expediente: reqExpediente,
      dni,
      issuer = 'ONCE',
      timestamp
    } = req.body as RequestBody

    expediente = reqExpediente
    identityKey = reqIdentityKey

    // Validación de datos
    if (!identityKey || !encryptedData || !encryptionKey || !expediente || !dni) {
      const missingFields = []
      if (!identityKey) missingFields.push('identityKey')
      if (!encryptedData) missingFields.push('encryptedData')
      if (!encryptionKey) missingFields.push('encryptionKey')
      if (!expediente) missingFields.push('expediente')
      if (!dni) missingFields.push('dni')
      
      throw new Error(`Faltan datos requeridos: ${missingFields.join(', ')}`)
    }

    const recordTimestamp = timestamp || new Date().toISOString()

    console.log('═══════════════════════════════════════════════════════════')
    console.log('FUNDACIÓN ONCE - REGISTRO DE ACREDITACIÓN')
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`Request ID: ${requestId}`)
    console.log(`Expediente: ${expediente}`)
    console.log(`Modo: CIFRADO AES-256`)
    console.log(`Fecha: ${new Date(recordTimestamp).toLocaleString('es-ES')}`)
    console.log('───────────────────────────────────────────────────────────')

    // Crear objeto con los datos a almacenar en blockchain
    const dataToStore = {
      version: '2.0-encrypted',
      protocol: 'ONCE-Identity',
      issuer,
      timestamp: recordTimestamp,
      expediente,
      identityKey,
      encryptedData,
      keyHash,
      algorithm: 'AES-256'
    }

    // Convertir a JSON y luego a bytes
    const jsonData = JSON.stringify(dataToStore)
    const dataBytes = Utils.toArray(jsonData, 'utf8')

    console.log(`Tamaño de datos: ${dataBytes.length} bytes`)
    console.log(`Protocolo: ${dataToStore.protocol} v${dataToStore.version}`)

    // Crear script OP_RETURN con los datos
    let opReturnScript: Script
    try {
      opReturnScript = new Script()
      opReturnScript.writeOpCode(OP.OP_FALSE)
      opReturnScript.writeOpCode(OP.OP_RETURN)
      opReturnScript.writeBin(dataBytes)

      console.log('Script OP_RETURN generado correctamente')
      console.log(`Chunks en script: ${opReturnScript.chunks.length}`)
    } catch (scriptError: any) {
      scriptError.message = `Error al crear script OP_RETURN: ${scriptError.message}`
      throw scriptError
    }

    // Crear transacción con output OP_RETURN
    let result: any
    try {
      result = await wallet.createAction({
        description: `ONCE - Acreditación ${expediente}`,
        outputs: [
          {
            lockingScript: opReturnScript.toHex(),
            satoshis: 1,
            outputDescription: `Acreditación ONCE - Exp: ${expediente}`
          }
        ],
        options: {
          randomizeOutputs: false
        }
      })

      if (!result.txid) {
        throw new Error('La transacción fue creada pero no retornó un TXID')
      }
    } catch (walletError: any) {
      walletError.message = `Error en wallet.createAction: ${walletError.message}`
      throw walletError
    }

    console.log('───────────────────────────────────────────────────────────')
    console.log('ACREDITACIÓN REGISTRADA EN BLOCKCHAIN BSV')
    console.log(`TXID: ${result.txid}`)
    console.log(`Explorador: https://whatsonchain.com/tx/${result.txid}`)
    console.log('═══════════════════════════════════════════════════════════')

    // Guardar registro en el archivo JSON
    const recordId = randomBytes(8).toString('hex')
    
    try {
      saveIdentityRecord({
        id: recordId,
        txid: result.txid,
        timestamp: recordTimestamp,
        expediente,
        identityKey,
        issuer,
        encryptedData,
        encryptionKey,
        keyHash,
        dni
      })

      console.log(`Registro guardado localmente con ID: ${recordId}`)
      console.log(`Clave de cifrado guardada para recuperación`)
      console.log('')
    } catch (storageError: any) {
      // Error en storage no es crítico si ya se registró en blockchain
      console.warn('⚠️  Advertencia: Error al guardar registro local (blockchain OK)')
      console.warn(`Detalles: ${storageError.message}`)
    }

    res.status(200).json({
      success: true,
      txid: result.txid,
      recordId,
      expediente,
      message: 'Acreditación cifrada registrada exitosamente en blockchain BSV',
      identityKey,
      timestamp: recordTimestamp,
      explorerUrl: `https://whatsonchain.com/tx/${result.txid}`
    })

  } catch (error: any) {
    // Determinar fase del error
    let phase = 'UNKNOWN'
    if (error.message?.includes('requeridos')) {
      phase = 'VALIDATION'
    } else if (error.message?.includes('script')) {
      phase = 'SCRIPT_CREATION'
    } else if (error.message?.includes('wallet') || error.message?.includes('createAction')) {
      phase = 'BLOCKCHAIN_TRANSACTION'
    } else if (error.message?.includes('save') || error.message?.includes('storage')) {
      phase = 'LOCAL_STORAGE'
    }

    logError(error, {
      expediente,
      identityKey,
      phase,
      requestId
    })
    
    const { severity } = categorizeError(error)
    const statusCode = severity === ErrorSeverity.CRITICAL ? 503 : 500
    
    res.status(statusCode).json({ 
      error: error.message || 'Error al registrar acreditación en blockchain',
      requestId,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name
      } : undefined
    })
  }
}