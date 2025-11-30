import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const RECORDS_FILE = join(process.cwd(), "identity-records.json");

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

export interface IdentityRecord {
  id: string;
  txid: string;
  timestamp: string;
  expediente: string;
  identityKey: string;
  issuer: string;

  // Datos siempre cifrados
  encryptedData: string;
  encryptionKey: string; // Clave de cifrado guardada localmente
  keyHash: string; // Hash de la clave (para verificación)
  dni: string; // DNI sin cifrar (solo en JSON local)
}

export interface IdentityRecords {
  records: IdentityRecord[];
  lastUpdated: string;
  version: string;
}

/**
 * Carga los registros existentes desde el archivo JSON
 */
export function loadIdentityRecords(): IdentityRecords {
  if (!existsSync(RECORDS_FILE)) {
    console.log("📂 Creando nuevo archivo identity-records.json");
    const initialRecords: IdentityRecords = {
      records: [],
      lastUpdated: new Date().toISOString(),
      version: "2.0",
    };

    // Crear el archivo con estructura inicial
    try {
      writeFileSync(
        RECORDS_FILE,
        JSON.stringify(initialRecords, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("❌ Error al crear identity-records.json:", error);
    }

    return initialRecords;
  }

  try {
    const data = readFileSync(RECORDS_FILE, "utf8");

    // Manejar archivo vacío
    if (!data || data.trim() === "") {
      console.log("⚠️  Archivo vacío, inicializando estructura");
      return {
        records: [],
        lastUpdated: new Date().toISOString(),
        version: "2.0",
      };
    }

    const parsed = JSON.parse(data);

    // Validar estructura
    if (!parsed || typeof parsed !== "object") {
      console.log("⚠️  Estructura inválida, reinicializando");
      return {
        records: [],
        lastUpdated: new Date().toISOString(),
        version: "2.0",
      };
    }

    // Asegurar que tiene la propiedad records como array
    if (!Array.isArray(parsed.records)) {
      console.log("⚠️  Propiedad records no es un array, corrigiendo");
      parsed.records = [];
    }

    // Asegurar que tiene la versión
    if (!parsed.version) {
      parsed.version = "2.0";
    }

    // Asegurar que tiene lastUpdated
    if (!parsed.lastUpdated) {
      parsed.lastUpdated = new Date().toISOString();
    }

    return parsed as IdentityRecords;
  } catch (error) {
    console.error("❌ Error al leer identity-records.json:", error);
    console.log("🔄 Devolviendo estructura vacía");
    return {
      records: [],
      lastUpdated: new Date().toISOString(),
      version: "2.0",
    };
  }
}

/**
 * Guarda un nuevo registro de identidad (siempre cifrado)
 */
export function saveIdentityRecord(record: IdentityRecord): void {
  try {
    const records = loadIdentityRecords();

    // Verificar que records.records es un array
    if (!Array.isArray(records.records)) {
      console.error("⚠️  records.records no es un array, reinicializando");
      records.records = [];
    }

    // Añadir el nuevo registro
    records.records.push(record);
    records.lastUpdated = new Date().toISOString();

    // Guardar al archivo
    writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), "utf8");

    console.log("💾 Registro cifrado guardado en identity-records.json");
    console.log(`   📋 Expediente: ${record.expediente}`);
    console.log(`   🔐 Clave de cifrado guardada localmente`);
    console.log(`   📍 TXID: ${record.txid}`);
    console.log(`   📊 Total de registros: ${records.records.length}`);
  } catch (error) {
    console.error("❌ Error al guardar identity-records.json:", error);
    throw error;
  }
}

/**
 * Busca un registro por TXID
 */
export function findRecordByTxid(txid: string): IdentityRecord | null {
  const records = loadIdentityRecords();
  const record = records.records.find((r) => r.txid === txid) || null;

  if (record) {
    console.log(`🔍 Registro encontrado por TXID: ${txid}`);
    console.log(`   📋 Expediente: ${record.expediente}`);
    console.log(`   🔐 Datos cifrados con clave guardada localmente`);
  } else {
    console.log(`⚠️  No se encontró registro con TXID: ${txid}`);
  }

  return record;
}

/**
 * Busca un registro por número de expediente
 */
export function findRecordByExpediente(
  expediente: string
): IdentityRecord | null {
  const records = loadIdentityRecords();
  const record =
    records.records.find((r) => r.expediente === expediente) || null;

  if (record) {
    console.log(`🔍 Registro encontrado por expediente: ${expediente}`);
    console.log(`   📍 TXID: ${record.txid}`);
    console.log(`   🔐 Datos cifrados con clave guardada localmente`);
  } else {
    console.log(`⚠️  No se encontró registro con expediente: ${expediente}`);
  }

  return record;
}

/**
 * Busca registros por DNI
 */
export function findRecordsByDni(dni: string): IdentityRecord[] {
  const records = loadIdentityRecords();
  const foundRecords = records.records.filter((r) => r.dni === dni);

  if (foundRecords.length > 0) {
    console.log(`🔍 ${foundRecords.length} registro(s) encontrado(s) para DNI: ${dni}`);
    foundRecords.forEach((record) => {
      console.log(`   📋 Expediente: ${record.expediente}`);
      console.log(`   📍 TXID: ${record.txid}`);
    });
  } else {
    console.log(`⚠️  No se encontraron registros con DNI: ${dni}`);
  }

  return foundRecords;
}

/**
 * Obtiene todos los registros
 */
export function getAllRecords(): IdentityRecord[] {
  const records = loadIdentityRecords();

  console.log(`📚 Total de registros cifrados: ${records.records.length}`);

  return records.records;
}

/**
 * Obtiene estadísticas de los registros
 */
export function getRecordsStats() {
  const records = loadIdentityRecords();

  const stats = {
    total: records.records.length,
    byDisabilityType: {} as Record<string, number>,
    byIssuer: {} as Record<string, number>,
    lastUpdated: records.lastUpdated,
  };

  return stats;
}

/**
 * Limpia el archivo de registros (usar con precaución)
 */
export function clearAllRecords(): void {
  const emptyRecords: IdentityRecords = {
    records: [],
    lastUpdated: new Date().toISOString(),
    version: "2.0",
  };

  try {
    writeFileSync(RECORDS_FILE, JSON.stringify(emptyRecords, null, 2), "utf8");
    console.log("🗑️  Todos los registros han sido eliminados");
  } catch (error) {
    console.error("❌ Error al limpiar identity-records.json:", error);
    throw error;
  }
}

/**
 * Descifra los datos de un registro usando la clave guardada
 * Nota: Esta función requiere crypto-js en el cliente
 */
export function getEncryptionKey(expediente: string): string | null {
  const record = findRecordByExpediente(expediente);

  if (!record) {
    console.log(`⚠️  No se encontró registro con expediente: ${expediente}`);
    return null;
  }

  console.log(`🔑 Clave de cifrado recuperada para expediente: ${expediente}`);
  return record.encryptionKey;
}