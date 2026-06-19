const endpoint = process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "menlun-control-360";
const databaseId = process.env.APPWRITE_DATABASE_ID || "menlun_control_360";
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error("Falta APPWRITE_API_KEY. Crea una API key en Appwrite con permisos TablesDB y vuelve a ejecutar.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
  "X-Appwrite-Response-Format": "1.9.5"
};

const userIds = {
  "pako@menlun.com": "pako",
  "carmen@menlun.com": "carmen",
  "direccion@menlun.com": "direccion",
  "produccion@menlun.com": "produccion",
  "calidad@menlun.com": "calidad",
  "compras@menlun.com": "compras",
  "almacen@menlun.com": "almacen",
  "logistica@menlun.com": "logistica",
  "mantenimiento@menlun.com": "mantenimiento",
  "ventas@menlun.com": "ventas",
  "rh@menlun.com": "rh",
  "contabilidad@menlun.com": "contabilidad",
  "sistemas@menlun.com": "sistemas",
  "supervisor.almacen@pmpsquimicos.com": "jef-moises-prado",
  "logistica.lf21@gmail.com": "jef-guillermo-nieto",
  "mantto.operadora@gmail.com": "jef-jose-luis-sanchez",
  "josecarlos.gonzalez@pmpsquimicos.com": "jef-jose-carlos-gonzalez"
};

const areaUserIds = {
  "Producción": "produccion",
  "Calidad": "calidad",
  "Compras": "compras",
  "Almacén": "almacen",
  "Logística": "logistica",
  "Mantenimiento": "mantenimiento",
  "Ventas": "ventas",
  "Recursos Humanos": "rh",
  "Contabilidad": "contabilidad",
  "Sistemas": "sistemas"
};

const areaJefaturaIds = {
  "Almacén": "jef-moises-prado",
  "Logística": "jef-guillermo-nieto",
  "Mantenimiento": "jef-jose-luis-sanchez",
  "Ventas": "jef-jose-carlos-gonzalez"
};

const adminUserIds = ["pako"];
const executiveUserIds = ["direccion"];

const areaCreatorIds = Array.from(new Set([
  ...Object.values(areaUserIds),
  "jef-moises-prado",
  "jef-guillermo-nieto",
  "jef-jose-luis-sanchez",
  "jef-jose-carlos-gonzalez"
]));

const adminCreateOnlyTables = new Set(["gerencias", "usuarios", "bitacora", "jefaturas", "beneficios"]);

function permissionsForTable(tableId) {
  const creators = adminCreateOnlyTables.has(tableId) ? adminUserIds : [...adminUserIds, ...areaCreatorIds];
  return uniquePermissions([
    ...readForUsers([...adminUserIds, ...executiveUserIds]),
    ...updateForUsers(adminUserIds),
    ...deleteForUsers(adminUserIds),
    ...creators.map((id) => `create("user:${id}")`),
  ]);
}

const tables = [
  {
    id: "gerencias",
    name: "Gerencias",
    columns: [
      string("gerencia", 80, true),
      string("gerente", 120, true),
      email("email", true),
      string("pin", 12, true),
      string("rol", 100, true),
      string("frecuencia", 30, true),
      string("estatus", 30, true),
      datetime("ultimoReporte", false),
      float("presupuesto", false),
      float("gastoActual", false)
    ],
    rows: [
      row("produccion", { gerencia: "Producción", gerente: "Luis Ortega", email: "produccion@menlun.com", pin: "2401", rol: "Gerente de Producción", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-03T12:00:00.000Z", presupuesto: 950000, gastoActual: 124000 }),
      row("calidad", { gerencia: "Calidad", gerente: "Mariana Ruiz", email: "calidad@menlun.com", pin: "2402", rol: "Gerente de Calidad", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-03T12:00:00.000Z", presupuesto: 380000, gastoActual: 42000 }),
      row("compras", { gerencia: "Compras", gerente: "Rafael Torres", email: "compras@menlun.com", pin: "2403", rol: "Gerente de Compras", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-05-31T12:00:00.000Z", presupuesto: 720000, gastoActual: 108000 }),
      row("almacen", { gerencia: "Almacén", gerente: "Sofia Campos", email: "almacen@menlun.com", pin: "2404", rol: "Gerente de Almacén", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-02T12:00:00.000Z", presupuesto: 410000, gastoActual: 51000 }),
      row("logistica", { gerencia: "Logística", gerente: "Jorge Vidal", email: "logistica@menlun.com", pin: "2405", rol: "Gerente de Logística", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-02T12:00:00.000Z", presupuesto: 640000, gastoActual: 87000 }),
      row("mantenimiento", { gerencia: "Mantenimiento", gerente: "Elena Ponce", email: "mantenimiento@menlun.com", pin: "2406", rol: "Gerente de Mantenimiento", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-06-01T12:00:00.000Z", presupuesto: 560000, gastoActual: 69000 }),
      row("ventas", { gerencia: "Ventas", gerente: "Pablo Ibarra", email: "ventas@menlun.com", pin: "2407", rol: "Gerente Comercial", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-30T12:00:00.000Z", presupuesto: 820000, gastoActual: 96000 }),
      row("recursos_humanos", { gerencia: "Recursos Humanos", gerente: "Claudia Rios", email: "rh@menlun.com", pin: "2408", rol: "Gerente de Recursos Humanos", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-29T12:00:00.000Z", presupuesto: 330000, gastoActual: 31000 }),
      row("contabilidad", { gerencia: "Contabilidad", gerente: "Hector Silva", email: "contabilidad@menlun.com", pin: "2409", rol: "Gerente de Contabilidad", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-05-31T12:00:00.000Z", presupuesto: 450000, gastoActual: 47000 }),
      row("sistemas", { gerencia: "Sistemas", gerente: "Natalia Flores", email: "sistemas@menlun.com", pin: "2410", rol: "Gerente de Sistemas", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-30T12:00:00.000Z", presupuesto: 690000, gastoActual: 78000 })
    ]
  },
  {
    id: "usuarios",
    name: "Usuarios",
    columns: [
      string("nombre", 120, true),
      string("nombreCompleto", 160, false),
      email("email", true),
      string("rol", 100, true),
      string("gerencia", 80, false),
      string("pin", 12, false),
      string("claveAcceso", 40, false),
      string("telefono", 40, false),
      string("whatsapp", 40, false),
      string("estatus", 30, true)
    ],
    rows: [
      row("pako", { nombre: "Administrador General", nombreCompleto: "Administrador General", email: "pako@menlun.com", rol: "Administrador General", gerencia: "Todas", pin: "0000", claveAcceso: "0000", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("carmen", { nombre: "Carmen", nombreCompleto: "Carmen", email: "carmen@menlun.com", rol: "Acceso Total Operativo", gerencia: "Todas", pin: "", claveAcceso: "", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("direccion", { nombre: "Dirección General", nombreCompleto: "Dirección General", email: "direccion@menlun.com", rol: "Vista Ejecutiva", gerencia: "Dirección", pin: "", claveAcceso: "", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("produccion", { nombre: "Luis Ortega", nombreCompleto: "Luis Ortega", email: "produccion@menlun.com", rol: "Gerente de Producción", gerencia: "Producción", pin: "2401", claveAcceso: "2401", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("calidad", { nombre: "Mariana Ruiz", nombreCompleto: "Mariana Ruiz", email: "calidad@menlun.com", rol: "Gerente de Calidad", gerencia: "Calidad", pin: "2402", claveAcceso: "2402", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("compras", { nombre: "Rafael Torres", nombreCompleto: "Rafael Torres", email: "compras@menlun.com", rol: "Gerente de Compras", gerencia: "Compras", pin: "2403", claveAcceso: "2403", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("almacen", { nombre: "Sofia Campos", nombreCompleto: "Sofia Campos", email: "almacen@menlun.com", rol: "Gerente de Almacén", gerencia: "Almacén", pin: "2404", claveAcceso: "2404", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("logistica", { nombre: "Jorge Vidal", nombreCompleto: "Jorge Vidal", email: "logistica@menlun.com", rol: "Gerente de Logística", gerencia: "Logística", pin: "2405", claveAcceso: "2405", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("mantenimiento", { nombre: "Elena Ponce", nombreCompleto: "Elena Ponce", email: "mantenimiento@menlun.com", rol: "Gerente de Mantenimiento", gerencia: "Mantenimiento", pin: "2406", claveAcceso: "2406", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("ventas", { nombre: "Pablo Ibarra", nombreCompleto: "Pablo Ibarra", email: "ventas@menlun.com", rol: "Gerente Comercial", gerencia: "Ventas", pin: "2407", claveAcceso: "2407", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("rh", { nombre: "Claudia Rios", nombreCompleto: "Claudia Rios", email: "rh@menlun.com", rol: "Gerente de Recursos Humanos", gerencia: "Recursos Humanos", pin: "2408", claveAcceso: "2408", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("contabilidad", { nombre: "Hector Silva", nombreCompleto: "Hector Silva", email: "contabilidad@menlun.com", rol: "Gerente de Contabilidad", gerencia: "Contabilidad", pin: "2409", claveAcceso: "2409", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("sistemas", { nombre: "Natalia Flores", nombreCompleto: "Natalia Flores", email: "sistemas@menlun.com", rol: "Gerente de Sistemas", gerencia: "Sistemas", pin: "2410", claveAcceso: "2410", telefono: "", whatsapp: "", estatus: "Activo" }),
      row("jef-moises-prado-user", { nombre: "Moisés Prado", nombreCompleto: "Moisés Prado", email: "supervisor.almacen@pmpsquimicos.com", rol: "Jefatura", gerencia: "Almacén", pin: "0001", claveAcceso: "0001", telefono: "56 4007 0190", whatsapp: "56 4007 0190", estatus: "Activo" }),
      row("jef-guillermo-nieto-user", { nombre: "Guillermo Nieto", nombreCompleto: "Guillermo Nieto", email: "logistica.lf21@gmail.com", rol: "Jefatura", gerencia: "Logística", pin: "0002", claveAcceso: "0002", telefono: "56 4000 5236", whatsapp: "56 4000 5236", estatus: "Activo" }),
      row("jef-jose-luis-sanchez-user", { nombre: "José Luis Sánchez", nombreCompleto: "José Luis Sánchez", email: "mantto.operadora@gmail.com", rol: "Jefatura", gerencia: "Mantenimiento", pin: "0003", claveAcceso: "0003", telefono: "56 4001 1248", whatsapp: "56 4001 1248", estatus: "Activo" }),
      row("jef-jose-carlos-gonzalez-user", { nombre: "José Carlos González", nombreCompleto: "José Carlos González", email: "josecarlos.gonzalez@pmpsquimicos.com", rol: "Jefatura", gerencia: "Ventas", pin: "0004", claveAcceso: "0004", telefono: "55 6784 5354", whatsapp: "55 6784 5354", estatus: "Activo" })
    ]
  },
  {
    id: "reportes",
    name: "Reportes",
    columns: [
      datetime("fecha", true),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("frecuencia", 30, true),
      string("tipo", 50, true),
      float("monto", false),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      text("descripcion", false),
      string("evidencia", 180, false),
      text("comentarios", false),
      datetime("vencimiento", false)
    ],
    rows: [
      row("rep-001", { fecha: "2026-06-03T10:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", frecuencia: "Semanal", tipo: "gasto", monto: 42000, prioridad: "alta", estatus: "pendiente", descripcion: "Refacciones para línea de empaque.", evidencia: "OC-1001.pdf", comentarios: "Validar presupuesto.", vencimiento: "2026-06-06T18:00:00.000Z" }),
      row("rep-002", { fecha: "2026-06-02T09:30:00.000Z", gerencia: "Calidad", responsable: "Mariana Ruiz", frecuencia: "Semanal", tipo: "incidencia", monto: 0, prioridad: "alta", estatus: "falta evidencia", descripcion: "Desviación en lote de inspección.", evidencia: "", comentarios: "Requiere foto y dictamen.", vencimiento: "2026-06-04T18:00:00.000Z" }),
      row("rep-003", { fecha: "2026-06-01T11:00:00.000Z", gerencia: "Compras", responsable: "Rafael Torres", frecuencia: "Quincenal", tipo: "solicitud", monto: 86000, prioridad: "media", estatus: "en revisión", descripcion: "Autorización de proveedor alterno.", evidencia: "cotizaciones.zip", comentarios: "Comparativo enviado.", vencimiento: "2026-06-08T18:00:00.000Z" }),
      row("rep-004", { fecha: "2026-05-31T16:00:00.000Z", gerencia: "Logística", responsable: "Jorge Vidal", frecuencia: "Semanal", tipo: "ahorro", monto: 24000, prioridad: "baja", estatus: "aprobado", descripcion: "Optimización de rutas.", evidencia: "rutas.xlsx", comentarios: "Ahorro validado.", vencimiento: "2026-06-10T18:00:00.000Z" }),
      row("rep-005", { fecha: "2026-06-02T15:00:00.000Z", gerencia: "Almacén", responsable: "Sofia Campos", frecuencia: "Semanal", tipo: "reporte operativo", monto: 32800, prioridad: "media", estatus: "aprobado", descripcion: "Ajuste de inventario por diferencia física.", evidencia: "conteo-ciclico.xlsx", comentarios: "Autorizado por operaciones.", vencimiento: "2026-06-03T18:00:00.000Z" }),
      row("rep-006", { fecha: "2026-06-02T12:00:00.000Z", gerencia: "Logística", responsable: "Jorge Vidal", frecuencia: "Semanal", tipo: "gasto", monto: 142300, prioridad: "alta", estatus: "pendiente", descripcion: "Rutas extraordinarias zona norte.", evidencia: "rutas-junio.pdf", comentarios: "Fuera de presupuesto.", vencimiento: "2026-06-04T18:00:00.000Z" }),
      row("rep-007", { fecha: "2026-06-01T09:00:00.000Z", gerencia: "Mantenimiento", responsable: "Elena Ponce", frecuencia: "Quincenal", tipo: "incidencia", monto: 58900, prioridad: "alta", estatus: "en ejecucion", descripcion: "Falla crítica en compresor.", evidencia: "orden-servicio.pdf", comentarios: "Atención en proceso.", vencimiento: "2026-06-02T18:00:00.000Z" }),
      row("rep-008", { fecha: "2026-06-01T13:00:00.000Z", gerencia: "Ventas", responsable: "Pablo Ibarra", frecuencia: "Mensual", tipo: "solicitud", monto: 94000, prioridad: "media", estatus: "pendiente", descripcion: "Descuento especial cliente clave.", evidencia: "caso-comercial.pdf", comentarios: "Requiere autorización.", vencimiento: "2026-06-08T18:00:00.000Z" }),
      row("rep-009", { fecha: "2026-05-31T10:00:00.000Z", gerencia: "Recursos Humanos", responsable: "Claudia Rios", frecuencia: "Mensual", tipo: "mejora", monto: 0, prioridad: "baja", estatus: "cerrado", descripcion: "Actualización de matriz de capacitación.", evidencia: "matriz-rh.xlsx", comentarios: "Completado.", vencimiento: "2026-06-01T18:00:00.000Z" }),
      row("rep-010", { fecha: "2026-05-31T17:00:00.000Z", gerencia: "Contabilidad", responsable: "Hector Silva", frecuencia: "Quincenal", tipo: "reporte operativo", monto: 0, prioridad: "alta", estatus: "pendiente", descripcion: "Reporte de cierre parcial.", evidencia: "", comentarios: "Reporte vencido.", vencimiento: "2026-06-01T18:00:00.000Z" }),
      row("rep-011", { fecha: "2026-05-30T14:00:00.000Z", gerencia: "Sistemas", responsable: "Natalia Flores", frecuencia: "Mensual", tipo: "gasto", monto: 116200, prioridad: "media", estatus: "rechazado", descripcion: "Licenciamiento no presupuestado.", evidencia: "cotizacion-saas.pdf", comentarios: "Replantear alcance.", vencimiento: "2026-06-06T18:00:00.000Z" }),
      row("rep-012", { fecha: "2026-06-04T08:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", frecuencia: "Semanal", tipo: "ahorro", monto: 42000, prioridad: "media", estatus: "aprobado", descripcion: "Ahorro por cambio de turno.", evidencia: "ahorro-turno.xlsx", comentarios: "Impacto validado.", vencimiento: "2026-06-05T18:00:00.000Z" })
    ]
  },
  {
    id: "autorizaciones",
    name: "Autorizaciones",
    columns: [
      string("reporteId", 36, true),
      datetime("fecha", true),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("tipo", 50, true),
      float("monto", false),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      string("accion", 40, true)
    ],
    rows: [
      row("aut-001", { reporteId: "rep-001", fecha: "2026-06-03T10:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", tipo: "gasto", monto: 42000, prioridad: "alta", estatus: "pendiente", accion: "Revisar" }),
      row("aut-002", { reporteId: "rep-003", fecha: "2026-06-01T11:00:00.000Z", gerencia: "Compras", responsable: "Rafael Torres", tipo: "solicitud", monto: 86000, prioridad: "media", estatus: "en revisión", accion: "Revisar" })
    ]
  },
  {
    id: "tareas",
    name: "Tareas",
    columns: [
      string("proyectoId", 80, false),
      string("titulo", 160, true),
      text("descripcion", false),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      datetime("fechaInicio", false),
      datetime("vencimiento", true),
      string("evidencia", 180, false),
      string("kpi", 120, false),
      string("reporteId", 36, false)
    ],
    rows: [
      row("task-001", { proyectoId: "proy-control-evidencias", titulo: "Cargar evidencia de desviación", descripcion: "Integrar respaldo y causa de la desviación.", gerencia: "Calidad", responsable: "Mariana Ruiz", prioridad: "alta", estatus: "vencida", fechaInicio: "2026-06-02T12:00:00.000Z", vencimiento: "2026-06-04T18:00:00.000Z", evidencia: "", kpi: "Evidencias completas", reporteId: "rep-002" }),
      row("task-002", { proyectoId: "proy-control-evidencias", titulo: "Validar gasto de refacciones", descripcion: "Confirmar autorización y evidencia del gasto.", gerencia: "Producción", responsable: "Luis Ortega", prioridad: "alta", estatus: "pendiente", fechaInicio: "2026-06-05T12:00:00.000Z", vencimiento: "2026-06-20T18:00:00.000Z", evidencia: "", kpi: "Gasto autorizado", reporteId: "rep-001" }),
      row("task-003", { proyectoId: "proy-logistica-trazable", titulo: "Definir ruta de liberación y entrega", descripcion: "Documentar responsable, fecha y evidencia por etapa.", gerencia: "Logística", responsable: "Guillermo Nieto", prioridad: "alta", estatus: "en proceso", fechaInicio: "2026-06-16T12:00:00.000Z", vencimiento: "2026-06-23T18:00:00.000Z", evidencia: "mapa-ruta-v1.pdf", kpi: "Entregas a tiempo", reporteId: "" }),
      row("task-004", { proyectoId: "proy-mantenimiento-confiable", titulo: "Completar causa raíz del compresor", descripcion: "Registrar causa, mitigación y acción preventiva.", gerencia: "Mantenimiento", responsable: "José Luis Sánchez", prioridad: "alta", estatus: "con riesgo", fechaInicio: "2026-06-15T12:00:00.000Z", vencimiento: "2026-06-19T18:00:00.000Z", evidencia: "", kpi: "Reincidencia crítica", reporteId: "" }),
      row("task-005", { proyectoId: "proy-ventas-seguimiento", titulo: "Actualizar siguiente acción de oportunidades", descripcion: "Toda oportunidad activa debe tener responsable y siguiente contacto.", gerencia: "Ventas", responsable: "José Carlos González", prioridad: "media", estatus: "en proceso", fechaInicio: "2026-06-17T12:00:00.000Z", vencimiento: "2026-06-24T18:00:00.000Z", evidencia: "", kpi: "Oportunidades con seguimiento", reporteId: "" })
    ]
  },
  {
    id: "proyectos",
    name: "Proyectos NEXUS",
    columns: [
      string("nombre", 180, true),
      text("objetivo", true),
      string("area", 80, true),
      string("responsable", 120, true),
      datetime("fechaInicio", true),
      datetime("fechaCompromiso", true),
      string("prioridad", 20, true),
      string("estado", 40, true),
      string("kpi", 120, false),
      string("resultadoEsperado", 120, false)
    ],
    rows: [
      row("proy-control-evidencias", { nombre: "Control integral de evidencias", objetivo: "Centralizar evidencias y eliminar cierres sin respaldo.", area: "Todas", responsable: "Administrador General", fechaInicio: "2026-06-10T12:00:00.000Z", fechaCompromiso: "2026-07-15T18:00:00.000Z", prioridad: "alta", estado: "en proceso", kpi: "Evidencias completas", resultadoEsperado: "95%" }),
      row("proy-logistica-trazable", { nombre: "Logística trazable", objetivo: "Asegurar visibilidad de rutas, entregas, liberaciones y comprobaciones.", area: "Logística", responsable: "Guillermo Nieto", fechaInicio: "2026-06-12T12:00:00.000Z", fechaCompromiso: "2026-07-31T18:00:00.000Z", prioridad: "alta", estado: "en proceso", kpi: "Entregas a tiempo", resultadoEsperado: "92%" }),
      row("proy-mantenimiento-confiable", { nombre: "Mantenimiento confiable", objetivo: "Reducir reincidencias mediante causa raíz y preventivos.", area: "Mantenimiento", responsable: "José Luis Sánchez", fechaInicio: "2026-06-14T12:00:00.000Z", fechaCompromiso: "2026-08-15T18:00:00.000Z", prioridad: "alta", estado: "con riesgo", kpi: "Reincidencia crítica", resultadoEsperado: "< 5%" }),
      row("proy-ventas-seguimiento", { nombre: "Disciplina comercial", objetivo: "Controlar seguimiento, forecast y compromisos comerciales.", area: "Ventas", responsable: "José Carlos González", fechaInicio: "2026-06-16T12:00:00.000Z", fechaCompromiso: "2026-07-30T18:00:00.000Z", prioridad: "media", estado: "en proceso", kpi: "Oportunidades con siguiente acción", resultadoEsperado: "100%" })
    ]
  },
  {
    id: "subtareas",
    name: "Subtareas",
    columns: [
      string("tareaId", 80, true),
      string("titulo", 180, true),
      string("responsable", 120, true),
      datetime("fechaCompromiso", true),
      string("estado", 40, true)
    ],
    rows: [
      row("sub-001", { tareaId: "task-003", titulo: "Validar responsables por etapa", responsable: "Guillermo Nieto", fechaCompromiso: "2026-06-20T18:00:00.000Z", estado: "cerrado" }),
      row("sub-002", { tareaId: "task-003", titulo: "Definir evidencia mínima de entrega", responsable: "Guillermo Nieto", fechaCompromiso: "2026-06-23T18:00:00.000Z", estado: "en proceso" }),
      row("sub-003", { tareaId: "task-004", titulo: "Adjuntar diagnóstico técnico", responsable: "José Luis Sánchez", fechaCompromiso: "2026-06-19T18:00:00.000Z", estado: "vencido" })
    ]
  },
  {
    id: "incidencias",
    name: "Incidencias",
    columns: [
      string("folio", 40, true),
      string("area", 80, true),
      string("clasificacion", 40, true),
      text("descripcion", true),
      string("responsable", 120, true),
      datetime("fechaApertura", true),
      datetime("fechaCierre", false),
      string("evidencia", 180, false),
      string("impacto", 20, true),
      string("prioridad", 20, true),
      string("estado", 40, true)
    ],
    rows: [
      row("inc-2026-001", { folio: "INC-2026-001", area: "Mantenimiento", clasificacion: "Mantenimiento", descripcion: "Paro crítico de compresor con reincidencia.", responsable: "José Luis Sánchez", fechaApertura: "2026-06-15T12:00:00.000Z", evidencia: "orden-servicio.pdf", impacto: "Alto", prioridad: "alta", estado: "en proceso" }),
      row("inc-2026-002", { folio: "INC-2026-002", area: "Logística", clasificacion: "Logística", descripcion: "Entrega detenida por liberación documental incompleta.", responsable: "Guillermo Nieto", fechaApertura: "2026-06-18T12:00:00.000Z", evidencia: "", impacto: "Medio", prioridad: "alta", estado: "con riesgo" }),
      row("inc-2026-003", { folio: "INC-2026-003", area: "Almacén", clasificacion: "Operativa", descripcion: "Diferencia entre conteo físico y reporte MicroSip.", responsable: "Moisés Prado", fechaApertura: "2026-06-17T12:00:00.000Z", fechaCierre: "2026-06-19T18:00:00.000Z", evidencia: "conteo-ciclico.xlsx", impacto: "Medio", prioridad: "media", estado: "cerrado" })
    ]
  },
  {
    id: "reuniones",
    name: "Reuniones",
    columns: [
      datetime("fecha", true),
      string("tipo", 30, true),
      string("titulo", 180, true),
      string("area", 80, true),
      string("responsable", 120, true),
      text("participantes", false),
      text("minuta", false),
      text("acuerdo", false),
      string("responsableAcuerdo", 120, false),
      datetime("fechaCompromiso", false),
      string("estado", 40, true)
    ],
    rows: [
      row("reu-001", { fecha: "2026-06-18T12:00:00.000Z", tipo: "Semanal", titulo: "Junta de operaciones", area: "Todas", responsable: "Administrador General", participantes: "Dirección, Ventas, Almacén, Logística, Mantenimiento", minuta: "Se revisaron focos rojos, incidencias y compromisos de la semana.", acuerdo: "Cerrar evidencias críticas antes del siguiente corte.", responsableAcuerdo: "Administrador General", fechaCompromiso: "2026-06-23T18:00:00.000Z", estado: "cerrado" }),
      row("reu-002", { fecha: "2026-06-20T12:00:00.000Z", tipo: "Extraordinaria", titulo: "Seguimiento de compresor crítico", area: "Mantenimiento", responsable: "José Luis Sánchez", participantes: "Mantenimiento, Dirección", minuta: "Pendiente de realizar.", acuerdo: "Documentar causa raíz y acción preventiva.", responsableAcuerdo: "José Luis Sánchez", fechaCompromiso: "2026-06-22T18:00:00.000Z", estado: "pendiente" })
    ]
  },
  {
    id: "kpis",
    name: "KPIs por jefatura",
    columns: [
      string("area", 80, true),
      string("indicador", 160, true),
      float("objetivo", true),
      float("resultadoActual", true),
      string("unidad", 20, true),
      string("frecuencia", 30, true),
      string("responsable", 120, true),
      string("tendencia", 20, true),
      string("semaforo", 20, true)
    ],
    rows: [
      row("kpi-ventas-01", { area: "Ventas", indicador: "Oportunidades con siguiente acción", objetivo: 100, resultadoActual: 76, unidad: "%", frecuencia: "Semanal", responsable: "José Carlos González", tendencia: "sube", semaforo: "amarillo" }),
      row("kpi-almacen-01", { area: "Almacén", indicador: "Exactitud de inventario", objetivo: 98, resultadoActual: 94, unidad: "%", frecuencia: "Semanal", responsable: "Moisés Prado", tendencia: "estable", semaforo: "amarillo" }),
      row("kpi-logistica-01", { area: "Logística", indicador: "Entregas a tiempo", objetivo: 92, resultadoActual: 84, unidad: "%", frecuencia: "Semanal", responsable: "Guillermo Nieto", tendencia: "baja", semaforo: "rojo" }),
      row("kpi-mantto-01", { area: "Mantenimiento", indicador: "Preventivos cumplidos", objetivo: 95, resultadoActual: 88, unidad: "%", frecuencia: "Mensual", responsable: "José Luis Sánchez", tendencia: "sube", semaforo: "amarillo" })
    ]
  },
  {
    id: "evidencias_operativas",
    name: "Evidencias operativas",
    columns: [
      string("tipoRelacion", 30, true),
      string("relacionId", 80, true),
      string("nombreArchivo", 180, true),
      string("tipoArchivo", 60, false),
      string("responsable", 120, true),
      datetime("fechaCarga", false),
      string("estado", 30, true),
      string("fileId", 100, false)
    ],
    rows: [
      row("ev-001", { tipoRelacion: "Proyecto", relacionId: "proy-control-evidencias", nombreArchivo: "checklist-evidencias.xlsx", tipoArchivo: "Excel", responsable: "Administrador General", fechaCarga: "2026-06-17T12:00:00.000Z", estado: "validada", fileId: "" }),
      row("ev-002", { tipoRelacion: "Incidencia", relacionId: "inc-2026-001", nombreArchivo: "orden-servicio.pdf", tipoArchivo: "PDF", responsable: "José Luis Sánchez", fechaCarga: "2026-06-16T12:00:00.000Z", estado: "cargada", fileId: "" }),
      row("ev-003", { tipoRelacion: "Tarea", relacionId: "task-004", nombreArchivo: "Diagnóstico técnico pendiente", tipoArchivo: "PDF", responsable: "José Luis Sánchez", estado: "faltante", fileId: "" })
    ]
  },
  {
    id: "evidencias",
    name: "Evidencias",
    columns: [
      string("reporteId", 36, true),
      string("nombreArchivo", 180, true),
      string("tipo", 60, false),
      string("fileId", 80, false),
      string("estatus", 40, true),
      datetime("fechaCarga", false)
    ],
    rows: [
      row("evi-001", { reporteId: "rep-001", nombreArchivo: "OC-1001.pdf", tipo: "PDF", fileId: "oc-1001", estatus: "cargada", fechaCarga: "2026-06-03T10:20:00.000Z" }),
      row("evi-002", { reporteId: "rep-002", nombreArchivo: "pendiente", tipo: "imagen", fileId: "", estatus: "faltante", fechaCarga: "2026-06-04T18:00:00.000Z" })
    ]
  },
  {
    id: "jefaturas",
    name: "Jefaturas 360",
    columns: [
      string("nombre", 120, true),
      string("fotografia", 180, false),
      string("puesto", 120, true),
      string("area", 80, true),
      string("jefatura", 80, true),
      email("correo", true),
      string("telefono", 40, false),
      string("whatsapp", 40, false),
      string("jefeDirecto", 120, false),
      string("usuario", 120, false),
      string("rol", 80, true),
      string("estatus", 30, true),
      text("objetivoMensual", false),
      text("objetivoTrimestral", false),
      text("objetivoAnual", false),
      string("kpiPrincipal", 120, false),
      text("kpisSecundarios", false),
      float("presupuestoAsignado", false),
      float("gastoAcumulado", false),
      text("comentariosCarmen", false),
      text("comentariosDireccion", false)
    ],
    rows: [
      row("jef-moises-prado", { nombre: "Moisés Prado", fotografia: "", puesto: "Supervisor de Almacén", area: "Almacén", jefatura: "Almacén", correo: "supervisor.almacen@pmpsquimicos.com", telefono: "56 4007 0190", whatsapp: "56 4007 0190", jefeDirecto: "Carmen", usuario: "supervisor.almacen@pmpsquimicos.com", rol: "Jefatura", estatus: "Activo", objetivoMensual: "Inventario exacto y evidencias completas", objetivoTrimestral: "Reducir diferencias físicas", objetivoAnual: "Mejorar control operativo de almacén", kpiPrincipal: "Exactitud de inventario", kpisSecundarios: "Evidencias, reportes, cumplimiento", presupuestoAsignado: 410000, gastoAcumulado: 51000, comentariosCarmen: "Reforzar evidencia semanal.", comentariosDireccion: "Prioridad media." }),
      row("jef-guillermo-nieto", { nombre: "Guillermo Nieto", fotografia: "", puesto: "Jefe de Logística", area: "Logística", jefatura: "Logística", correo: "logistica.lf21@gmail.com", telefono: "56 4000 5236", whatsapp: "56 4000 5236", jefeDirecto: "Carmen", usuario: "logistica.lf21@gmail.com", rol: "Jefatura", estatus: "Activo", objetivoMensual: "Optimizar rutas y comprobar viáticos", objetivoTrimestral: "Bajar costo por ruta", objetivoAnual: "Modelo logístico medible", kpiPrincipal: "Costo logístico", kpisSecundarios: "Rutas, viáticos, evidencias", presupuestoAsignado: 640000, gastoAcumulado: 87000, comentariosCarmen: "Revisar gastos fuera de presupuesto.", comentariosDireccion: "Foco en ROI." }),
      row("jef-jose-luis-sanchez", { nombre: "José Luis Sánchez", fotografia: "", puesto: "Jefe de Mantenimiento", area: "Mantenimiento", jefatura: "Mantenimiento", correo: "mantto.operadora@gmail.com", telefono: "56 4001 1248", whatsapp: "56 4001 1248", jefeDirecto: "Carmen", usuario: "mantto.operadora@gmail.com", rol: "Jefatura", estatus: "Activo", objetivoMensual: "Cerrar correctivos críticos", objetivoTrimestral: "Reducir reincidencias", objetivoAnual: "Plan preventivo estable", kpiPrincipal: "Incidencias críticas", kpisSecundarios: "Preventivos, correctivos, reincidencias", presupuestoAsignado: 560000, gastoAcumulado: 69000, comentariosCarmen: "Prioridad alta por vencimientos.", comentariosDireccion: "Revisar compresor." }),
      row("jef-jose-carlos-gonzalez", { nombre: "José Carlos González", fotografia: "", puesto: "Jefe de Ventas", area: "Ventas", jefatura: "Ventas", correo: "josecarlos.gonzalez@pmpsquimicos.com", telefono: "55 6784 5354", whatsapp: "55 6784 5354", jefeDirecto: "Dirección General", usuario: "josecarlos.gonzalez@pmpsquimicos.com", rol: "Jefatura", estatus: "Activo", objetivoMensual: "Controlar descuentos y rentabilidad", objetivoTrimestral: "Aumentar conversión", objetivoAnual: "Crecimiento rentable", kpiPrincipal: "Rentabilidad comercial", kpisSecundarios: "Solicitudes, ROI, ventas", presupuestoAsignado: 820000, gastoAcumulado: 96000, comentariosCarmen: "Validar descuentos especiales.", comentariosDireccion: "Foco comercial." })
    ]
  },
  {
    id: "gastos",
    name: "Gastos",
    columns: [
      string("tipo", 80, true),
      string("responsable", 120, true),
      float("monto", true),
      datetime("fecha", true),
      string("evidencia", 180, false),
      string("centroCosto", 80, false),
      string("gerencia", 80, true),
      string("estatus", 40, true)
    ],
    rows: []
  },
  {
    id: "viaticos",
    name: "Viaticos",
    columns: [
      string("cliente", 120, false),
      string("prospecto", 120, false),
      text("motivo", true),
      string("responsable", 120, true),
      datetime("fecha", true),
      float("presupuesto", false),
      float("montoSolicitado", false),
      float("montoComprobado", false),
      string("evidencia", 180, false),
      float("roiEsperado", false),
      float("roiReal", false),
      string("estatus", 40, true),
      string("gerencia", 80, true)
    ],
    rows: []
  },
  {
    id: "mantenimientos",
    name: "Mantenimientos",
    columns: [
      string("tipo", 40, true),
      string("equipo", 120, true),
      string("responsable", 120, true),
      float("costo", false),
      string("evidencia", 180, false),
      datetime("fecha", true),
      string("estatus", 40, true),
      string("semaforo", 20, true),
      integer("reincidencias", false),
      string("gerencia", 80, true)
    ],
    rows: []
  },
  {
    id: "diagnostico_base",
    name: "Diagnostico Base",
    columns: [
      string("bloque", 80, true),
      string("area", 80, true),
      text("detalle", true),
      string("responsable", 120, true),
      string("evidencia", 180, false),
      string("estatus", 40, true)
    ],
    rows: [
      row("diag-1", { bloque: "Organigrama", area: "Dirección", detalle: "Estructura operativa con jefaturas funcionales y dependencia directa de Carmen para control operativo.", responsable: "Administrador General", evidencia: "organigrama-pmps.pdf", estatus: "en revision" }),
      row("diag-2", { bloque: "Puestos", area: "Almacén", detalle: "Roles operativos con responsabilidades mezcladas entre inventario, surtido y evidencias.", responsable: "Moisés Prado", evidencia: "descriptivos-almacen.docx", estatus: "pendiente" }),
      row("diag-3", { bloque: "Procesos", area: "Logística", detalle: "Rutas y viáticos se capturan fuera de un flujo único de autorización.", responsable: "Guillermo Nieto", evidencia: "rutas-actuales.xlsx", estatus: "falta evidencia" })
    ]
  },
  {
    id: "entrevistas",
    name: "Entrevistas",
    columns: [
      datetime("fecha", true),
      string("entrevistado", 120, true),
      string("area", 80, true),
      string("puesto", 120, true),
      string("responsableEntrevista", 120, true),
      text("funcionesActuales", false),
      text("responsabilidades", false),
      text("problemasDetectados", false),
      text("riesgos", false),
      text("oportunidades", false),
      text("ideasMejora", false),
      text("necesidadesInformacion", false),
      text("automatizacionesSugeridas", false),
      text("preguntaOro", false)
    ],
    rows: [
      row("ent-1", { fecha: "2026-06-03T12:00:00.000Z", entrevistado: "Moisés Prado", area: "Almacén", puesto: "Supervisor de Almacén", responsableEntrevista: "Administrador General", funcionesActuales: "Control de entradas, salidas, evidencias e inventario físico.", responsabilidades: "Surtido correcto y conteos cíclicos.", problemasDetectados: "Diferencias físicas y evidencias tardías.", riesgos: "Inventario incorrecto para compras y producción.", oportunidades: "Tablero de diferencias y evidencia por movimiento.", ideasMejora: "Escaneo móvil de evidencias.", necesidadesInformacion: "Stock real, diferencias, pendientes.", automatizacionesSugeridas: "Alertas por evidencia faltante.", preguntaOro: "Eliminar capturas duplicadas, evidencia manual y falta de visibilidad de diferencias." })
    ]
  },
  {
    id: "mapa_dolor",
    name: "Mapa de Dolor",
    columns: [
      string("clasificacion", 80, true),
      text("descripcion", true),
      string("areaAfectada", 80, true),
      text("impacto", false),
      string("frecuencia", 40, false),
      string("prioridad", 20, true),
      string("responsable", 120, true),
      string("semaforo", 20, true)
    ],
    rows: [
      row("dolor-1", { clasificacion: "Procesos", descripcion: "Evidencias operativas se cargan tarde o incompletas.", areaAfectada: "Almacén", impacto: "Afecta control de inventario y auditoría.", frecuencia: "Alta", prioridad: "alta", responsable: "Moisés Prado", semaforo: "rojo" }),
      row("dolor-2", { clasificacion: "Finanzas", descripcion: "Gastos logísticos extraordinarios sin presupuesto visible.", areaAfectada: "Logística", impacto: "Eleva costo por ruta.", frecuencia: "Media", prioridad: "alta", responsable: "Guillermo Nieto", semaforo: "rojo" })
    ]
  },
  {
    id: "diagnostico_ejecutivo",
    name: "Diagnostico Ejecutivo",
    columns: [
      text("hallazgo", true),
      text("causaRaiz", true),
      text("riesgo", false),
      string("impacto", 80, false),
      string("area", 80, true),
      string("prioridad", 20, true),
      string("responsable", 120, true)
    ],
    rows: [
      row("hall-1", { hallazgo: "Control operativo disperso", causaRaiz: "No existe tablero único de compromisos, evidencias y riesgos.", riesgo: "Dirección decide con información incompleta.", impacto: "Alto", area: "Todas", prioridad: "alta", responsable: "Administrador General" }),
      row("hall-2", { hallazgo: "Evidencias faltantes", causaRaiz: "La comprobación no está integrada al seguimiento.", riesgo: "Auditoría débil y retrasos.", impacto: "Alto", area: "Almacén", prioridad: "alta", responsable: "Moisés Prado" })
    ]
  },
  {
    id: "estrategias",
    name: "Estrategias",
    columns: [
      text("hallazgo", false),
      text("objetivo", true),
      text("resultadoEsperado", false),
      string("responsable", 120, true),
      string("kpi", 120, false),
      datetime("fechaInicio", false),
      datetime("fechaFin", false),
      float("presupuesto", false)
    ],
    rows: [
      row("est-1", { hallazgo: "Evidencias faltantes", objetivo: "Centralizar control de evidencias", resultadoEsperado: "100% de reportes críticos con evidencia", responsable: "Administrador General", kpi: "Evidencias completas", fechaInicio: "2026-06-10T12:00:00.000Z", fechaFin: "2026-07-10T12:00:00.000Z", presupuesto: 0 }),
      row("est-2", { hallazgo: "Evidencias faltantes", objetivo: "Cerrar diferencias de inventario con evidencia semanal", resultadoEsperado: "Reducir 20% diferencias físicas", responsable: "Moisés Prado", kpi: "Exactitud de inventario", fechaInicio: "2026-06-11T12:00:00.000Z", fechaFin: "2026-07-20T12:00:00.000Z", presupuesto: 12000 })
    ]
  },
  {
    id: "plan_trabajo",
    name: "Plan de Trabajo",
    columns: [
      text("accion", true),
      string("responsable", 120, true),
      datetime("fechaInicio", false),
      datetime("fechaCompromiso", true),
      string("prioridad", 20, true),
      string("evidencia", 180, false),
      string("estado", 40, true),
      string("vista", 40, false)
    ],
    rows: [
      row("plan-1", { accion: "Definir checklist de evidencia por área", responsable: "Administrador General", fechaInicio: "2026-06-10T12:00:00.000Z", fechaCompromiso: "2026-06-17T12:00:00.000Z", prioridad: "alta", evidencia: "checklist-evidencias.xlsx", estado: "en revision", vista: "Kanban" }),
      row("plan-2", { accion: "Conciliar diferencias de inventario con evidencia fotográfica", responsable: "Moisés Prado", fechaInicio: "2026-06-11T12:00:00.000Z", fechaCompromiso: "2026-06-18T12:00:00.000Z", prioridad: "alta", evidencia: "", estado: "pendiente", vista: "Lista" })
    ]
  },
  {
    id: "acuerdos",
    name: "Acuerdos",
    columns: [
      text("acuerdo", true),
      datetime("fecha", false),
      string("area", 80, false),
      string("responsable", 120, true),
      string("prioridad", 20, false),
      datetime("fechaCompromiso", true),
      string("evidencia", 180, false),
      string("estado", 40, true)
    ],
    rows: [
      row("acu-1", { acuerdo: "Toda evidencia crítica debe cargarse antes del cierre semanal.", responsable: "Moisés Prado", fechaCompromiso: "2026-06-17T12:00:00.000Z", evidencia: "", estado: "pendiente" })
    ]
  },
  {
    id: "riesgos",
    name: "Riesgos",
    columns: [
      text("riesgo", true),
      string("probabilidad", 40, true),
      string("impacto", 40, true),
      text("planMitigacion", false),
      string("responsable", 120, true)
    ],
    rows: [
      row("risk-1", { riesgo: "Pausa de Appwrite Free por inactividad o política de plan", probabilidad: "Media", impacto: "Alto", planMitigacion: "Heartbeat reforzado y plan de migración/pago aprobado", responsable: "Administrador General" })
    ]
  },
  {
    id: "beneficios",
    name: "Beneficios",
    columns: [
      float("ahorroGenerado", false),
      string("reduccionTiempos", 120, false),
      string("reduccionIncidencias", 80, false),
      text("mejorasImplementadas", false),
      float("impactoFinanciero", false)
    ],
    rows: [
      row("ben-1", { ahorroGenerado: 42000, reduccionTiempos: "8 horas semanales", reduccionIncidencias: "12%", mejorasImplementadas: "Checklist de evidencias y tablero de seguimiento", impactoFinanciero: 42000 })
    ]
  },
  {
    id: "lecciones_aprendidas",
    name: "Lecciones aprendidas",
    columns: [
      datetime("fecha", true),
      string("area", 80, true),
      string("contexto", 180, true),
      text("leccion", true),
      text("aplicacion", true),
      string("responsable", 120, true),
      string("evidencia", 180, false)
    ],
    rows: [
      row("lec-001", { fecha: "2026-06-18T12:00:00.000Z", area: "Logística", contexto: "Liberación documental de entregas", leccion: "La evidencia debe validarse antes de liberar la ruta, no después de la entrega.", aplicacion: "Integrar checklist obligatorio a la tarea de liberación.", responsable: "Guillermo Nieto", evidencia: "mapa-ruta-v1.pdf" }),
      row("lec-002", { fecha: "2026-06-19T12:00:00.000Z", area: "Mantenimiento", contexto: "Reincidencia del compresor", leccion: "Cerrar la orden sin causa raíz mantiene el riesgo operativo abierto.", aplicacion: "Exigir diagnóstico y acción preventiva antes del cierre.", responsable: "José Luis Sánchez", evidencia: "orden-servicio.pdf" })
    ]
  },
  {
    id: "bitacora",
    name: "Bitacora",
    columns: [
      datetime("fecha", true),
      string("usuario", 120, true),
      string("rol", 120, true),
      string("accion", 80, true),
      string("reporteId", 80, false),
      string("gerencia", 80, false),
      text("detalle", false)
    ],
    rows: [
      row("log-inicial", { fecha: "2026-06-05T00:00:00.000Z", usuario: "Sistema", rol: "Sistema", accion: "inicio", reporteId: "", gerencia: "Todas", detalle: "Bitácora inicial de MENLUN Control 360." })
    ]
  }
];

for (const table of tables) {
  await ensureTable(table);
  for (const column of table.columns) {
    await ensureColumn(table.id, column);
  }
  await waitForColumns(table.id, table.columns.map((column) => column.key));
  for (const seedRow of table.rows || []) {
    await ensureRow(table.id, seedRow);
  }
  await hardenRows(table.id);
}

console.log("Appwrite listo: tablas, columnas y datos base creados.");

function string(key, size, required = false) {
  return { type: "string", key, size, required };
}

function email(key, required = false) {
  return { type: "email", key, required };
}

function text(key, required = false) {
  return { type: "text", key, required };
}

function datetime(key, required = false) {
  return { type: "datetime", key, required };
}

function float(key, required = false) {
  return { type: "float", key, required };
}

function integer(key, required = false) {
  return { type: "integer", key, required };
}

function row(id, data) {
  return { id, data };
}

async function ensureTable(table) {
  const permissions = permissionsForTable(table.id);
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${table.id}`, null, [404]);
  if (existing.status === 200) {
    await request("PUT", `/tablesdb/${databaseId}/tables/${table.id}`, {
      name: table.name,
      permissions,
      rowSecurity: true,
      enabled: true,
      purge: true
    });
    console.log(`Tabla existente: ${table.id}`);
    return;
  }

  await request("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: table.id,
    name: table.name,
    permissions,
    rowSecurity: true,
    enabled: true,
    columns: [],
    indexes: []
  });
  console.log(`Tabla creada: ${table.id}`);
}

async function ensureColumn(tableId, column) {
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/columns/${column.key}`, null, [404]);
  if (existing.status === 200) {
    console.log(`  Columna existente: ${tableId}.${column.key}`);
    return;
  }

  const body = { key: column.key, required: column.required, array: false };
  if (column.type === "string") body.size = column.size || 255;

  await request("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/${column.type}`, body);
  console.log(`  Columna creada: ${tableId}.${column.key}`);
}

async function waitForColumns(tableId, keys) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await Promise.all(keys.map(async (key) => {
      const response = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/columns/${key}`, null, [404, 409]);
      return response.status === 200 && (!response.json.status || response.json.status === "available");
    }));
    if (ready.every(Boolean)) return;
    await sleep(1500);
  }
  console.warn(`  Algunas columnas de ${tableId} siguen procesándose; se intentará cargar datos.`);
}

async function ensureRow(tableId, seedRow) {
  const permissions = permissionsForRow(tableId, seedRow.data, seedRow.id);
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/rows/${seedRow.id}`, null, [404]);
  if (existing.status === 200) {
    await request("PATCH", `/tablesdb/${databaseId}/tables/${tableId}/rows/${seedRow.id}`, {
      data: seedRow.data,
      permissions
    });
    console.log(`  Fila actualizada: ${tableId}.${seedRow.id}`);
    return;
  }

  await request("POST", `/tablesdb/${databaseId}/tables/${tableId}/rows`, {
    rowId: seedRow.id,
    data: seedRow.data,
    permissions
  });
  console.log(`  Fila creada: ${tableId}.${seedRow.id}`);
}

async function hardenRows(tableId) {
  const response = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/rows`);
  const rows = response.json.rows || [];

  for (const existingRow of rows) {
    await request("PATCH", `/tablesdb/${databaseId}/tables/${tableId}/rows/${existingRow.$id}`, {
      permissions: permissionsForRow(tableId, existingRow, existingRow.$id)
    });
  }

  console.log(`  Permisos cerrados: ${tableId} (${rows.length} filas)`);
}

function permissionsForRow(tableId, data, rowId = "") {
  if (tableId === "usuarios") {
    const ownerId = userIds[String(data.email || "").toLowerCase()] || rowId;
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ownerId]),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (tableId === "gerencias") {
    const areaUsers = userIdsForArea(data.gerencia);
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, ...areaUsers]),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (["reportes", "autorizaciones", "tareas", "evidencias", "jefaturas", "gastos", "viaticos", "mantenimientos", "proyectos", "incidencias", "reuniones", "kpis"].includes(tableId)) {
    const areaUsers = userIdsForArea(data.gerencia || data.area || areaFromReport(data.reporteId));
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, ...areaUsers]),
      ...updateForUsers([...adminUserIds, ...areaUsers]),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (["subtareas", "evidencias_operativas"].includes(tableId)) {
    const ownerId = userIdForResponsible(data.responsable);
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, ownerId]),
      ...updateForUsers([...adminUserIds, ownerId]),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (["diagnostico_base", "entrevistas", "mapa_dolor", "diagnostico_ejecutivo", "lecciones_aprendidas"].includes(tableId)) {
    const areaUsers = userIdsForArea(data.area || data.areaAfectada);
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, ...areaUsers]),
      ...updateForUsers([...adminUserIds, ...areaUsers]),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (["estrategias", "plan_trabajo", "acuerdos", "riesgos"].includes(tableId)) {
    const ownerId = userIdForResponsible(data.responsable);
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, ownerId]),
      ...updateForUsers([...adminUserIds, ownerId]),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (tableId === "beneficios") {
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds]),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (tableId === "bitacora") {
    return uniquePermissions([
      ...readForUsers(adminUserIds),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  return uniquePermissions([
    ...readForUsers(adminUserIds),
    ...updateForUsers(adminUserIds),
    ...deleteForUsers(adminUserIds),
  ]);
}

function areaFromReport(reportId) {
  const reportTable = tables.find((table) => table.id === "reportes");
  const report = reportTable?.rows.find((item) => item.id === reportId);
  return report?.data.gerencia || "";
}

function userIdsForArea(area) {
  return [areaUserIds[area], areaJefaturaIds[area]].filter(Boolean);
}

function userIdForResponsible(name) {
  const map = {
    "Administrador General": "pako",
    "Moisés Prado": "jef-moises-prado",
    "Guillermo Nieto": "jef-guillermo-nieto",
    "José Luis Sánchez": "jef-jose-luis-sanchez",
    "José Carlos González": "jef-jose-carlos-gonzalez"
  };
  return map[name] || "";
}

function readForUsers(ids) {
  return ids.filter(Boolean).map((id) => `read("user:${id}")`);
}

function updateForUsers(ids) {
  return ids.filter(Boolean).map((id) => `update("user:${id}")`);
}

function deleteForUsers(ids) {
  return ids.filter(Boolean).map((id) => `delete("user:${id}")`);
}

function uniquePermissions(permissions) {
  return Array.from(new Set(permissions));
}

async function request(method, path, body, expectedSoftErrors = []) {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok && !expectedSoftErrors.includes(response.status)) {
    if (json.type === "project_paused" || String(json.message || "").toLowerCase().includes("project is paused")) {
      throw new Error("Proyecto Appwrite pausado o sin conexión. Restaurar proyecto desde Appwrite Console antes de continuar.");
    }
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }

  return { status: response.status, json };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
