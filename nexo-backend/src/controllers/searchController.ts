import CryptoJS from 'crypto-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const RECORDS_FILE = join(process.cwd(), 'identity-records.json')

export async function searchByExpediente(expediente: string) {
  try {
    // 1. Leer el archivo JSON local
    const data = readFileSync(RECORDS_FILE, 'utf8')
    const { records } = JSON.parse(data)

    // 2. Buscar registro por expediente (sin descifrar nada)
    const record = records.find((r: any) => r.expediente === expediente.trim())

    if (!record) {
      return {
        success: false,
        error: 'No se encontró acreditación con este expediente'
      }
    }

    const txid = record.txid

    // 4. Buscar en blockchain usando WhatsOnChain API
    const response = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}`)
    
    if (!response.ok) {
      throw new Error(`No se pudo obtener la transacción de blockchain: ${response.status}`)
    }

    const txData: any = await response.json()

    // 5. Extraer datos del OP_RETURN
    let blockchainData: any = null

    if (!txData.vout || txData.vout.length === 0) {
      throw new Error('La transacción no contiene outputs')
    }

    for (let i = 0; i < txData.vout.length; i++) {
      const output = txData.vout[i]
      const scriptPubKey = output.scriptPubKey

      // Buscar outputs OP_RETURN
      if (scriptPubKey.type === 'nulldata' || 
          scriptPubKey.asm?.startsWith('OP_FALSE OP_RETURN') || 
          scriptPubKey.asm?.startsWith('0 OP_RETURN')) {
        
        const scriptHex = scriptPubKey.hex
        
        try {
          let dataHex = scriptHex
          
          // Remover OP_FALSE (00)
          if (dataHex.startsWith('00')) {
            dataHex = dataHex.substring(2)
          }
          
          // Remover OP_RETURN (6a)
          if (dataHex.startsWith('6a')) {
            dataHex = dataHex.substring(2)
          }
          
          // Manejar PUSHDATA
          const firstByte = dataHex.substring(0, 2)
          let dataStartIndex = 2
          
          if (firstByte === '4c') {
            dataStartIndex = 4
          } else if (firstByte === '4d') {
            dataStartIndex = 6
          } else if (firstByte === '4e') {
            dataStartIndex = 10
          }
          
          const actualDataHex = dataHex.substring(dataStartIndex)
          const dataStr = Buffer.from(actualDataHex, 'hex').toString('utf8')
          
          // Parsear JSON de blockchain
          blockchainData = JSON.parse(dataStr)
          
          // Verificar si es del protocolo ONCE
          if (blockchainData.protocol === 'ONCE-Identity') {
            break
          }
          
        } catch (e: any) {
          console.error(`Error al parsear output ${i}:`, e.message)
        }
      }
    }

    if (!blockchainData) {
      throw new Error('No se encontraron datos ONCE en la transacción')
    }

    // 6. Descifrar datos usando la clave guardada en JSON local
    const decrypted = CryptoJS.AES.decrypt(
      blockchainData.encryptedData,
      record.encryptionKey
    )
    const personalData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))

    // 7. Retornar datos completos
    return {
      success: true,
      found: true,
      source: 'blockchain',
      // Datos de blockchain
      txid: txid,
      timestamp: blockchainData.timestamp,
      expediente: blockchainData.expediente,
      identityKey: blockchainData.identityKey,
      issuer: blockchainData.issuer,
      version: blockchainData.version,
      protocol: blockchainData.protocol,
      algorithm: blockchainData.algorithm,
      // Datos descifrados del formulario
      data: {
        nombre: personalData.nombre,
        apellidos: personalData.apellidos,
        dni: personalData.dni,
        fechaNacimiento: personalData.fechaNacimiento,
        domicilio: personalData.domicilio,
        familiaNumerosa: personalData.familiaNumerosa,
        situacion: personalData.situacion,
        tipoDiscapacidad: personalData.tipoDiscapacidad,
        tipoVisual: personalData.tipoVisual,
        gradoVisual: personalData.gradoVisual,
        permanenteVisual: personalData.permanenteVisual,
        lectorPantalla: personalData.lectorPantalla,
        braille: personalData.braille,
        guiaAudio: personalData.guiaAudio,
        gradoAuditiva: personalData.gradoAuditiva,
        permanenteAuditiva: personalData.permanenteAuditiva,
        audifono: personalData.audifono,
        lenguaSignos: personalData.lenguaSignos,
        verificadoONCE: personalData.verificadoONCE,
        fechaVerificacion: personalData.fechaVerificacion,
        numeroExpediente: personalData.numeroExpediente,
        observaciones: personalData.observaciones
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}