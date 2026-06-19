const APPWRITE_CONFIG = window.MENLUN_APPWRITE_CONFIG;
const TABLES = APPWRITE_CONFIG.collections;
const STORAGE = APPWRITE_CONFIG.buckets;

const USER_IDS_BY_EMAIL = {
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
  "josecarlos.gonzalez@pmpsquimicos.com": "jef-jose-carlos-gonzalez",
};

const USER_IDS_BY_AREA = {
  Produccion: "produccion",
  Calidad: "calidad",
  Compras: "compras",
  Almacen: "almacen",
  Logistica: "logistica",
  Mantenimiento: "mantenimiento",
  Ventas: "ventas",
  "Recursos Humanos": "rh",
  Contabilidad: "contabilidad",
  Sistemas: "sistemas",
};

const JEFATURA_IDS_BY_AREA = {
  Almacen: "jef-moises-prado",
  Logistica: "jef-guillermo-nieto",
  Mantenimiento: "jef-jose-luis-sanchez",
  Ventas: "jef-jose-carlos-gonzalez",
};

const ADMIN_USER_IDS = ["pako"];
const EXECUTIVE_USER_IDS = ["direccion"];
const APPWRITE_PAUSED_MESSAGE = "Proyecto Appwrite pausado o sin conexión. Restaurar proyecto desde Appwrite Console antes de continuar.";
const APPWRITE_AUTH_PASSWORD = "PMPS-Control360-2026!";

const SYSTEM_USERS = [
  { name: "Administrador General", role: "Administrador General", email: "pako@menlun.com", userId: "pako", access: "all", phone: "", whatsapp: "", pin: "0000" },
  { name: "Dirección General", role: "Vista Ejecutiva", email: "direccion@menlun.com", userId: "direccion", access: "executive", phone: "", whatsapp: "", pin: "0099" },
];

let appwriteOnline = false;
let appwriteLoading = true;
let appwriteDataLoaded = false;

let gerencias = [
  { area: "Produccion", label: "Producción", manager: "Luis Ortega", email: "produccion@menlun.com", pin: "2401", role: "Gerente de Producción", frequency: "Semanal", status: "Activo", lastReport: "2026-06-03", budget: 680000 },
  { area: "Calidad", label: "Calidad", manager: "Mariana Ruiz", email: "calidad@menlun.com", pin: "2402", role: "Gerente de Calidad", frequency: "Semanal", status: "Activo", lastReport: "2026-06-03", budget: 310000 },
  { area: "Compras", label: "Compras", manager: "Rafael Torres", email: "compras@menlun.com", pin: "2403", role: "Gerente de Compras", frequency: "Quincenal", status: "Activo", lastReport: "2026-05-31", budget: 520000 },
  { area: "Almacen", label: "Almacén", manager: "Sofia Campos", email: "almacen@menlun.com", pin: "2404", role: "Gerente de Almacén", frequency: "Semanal", status: "Activo", lastReport: "2026-06-02", budget: 420000 },
  { area: "Logistica", label: "Logística", manager: "Jorge Vidal", email: "logistica@menlun.com", pin: "2405", role: "Gerente de Logística", frequency: "Semanal", status: "Activo", lastReport: "2026-06-02", budget: 640000 },
  { area: "Mantenimiento", label: "Mantenimiento", manager: "Elena Ponce", email: "mantenimiento@menlun.com", pin: "2406", role: "Gerente de Mantenimiento", frequency: "Quincenal", status: "Activo", lastReport: "2026-06-01", budget: 380000 },
  { area: "Ventas", label: "Ventas", manager: "Pablo Ibarra", email: "ventas@menlun.com", pin: "2407", role: "Gerente Comercial", frequency: "Mensual", status: "Activo", lastReport: "2026-05-30", budget: 290000 },
  { area: "Recursos Humanos", label: "Recursos Humanos", manager: "Claudia Rios", email: "rh@menlun.com", pin: "2408", role: "Gerente de Recursos Humanos", frequency: "Mensual", status: "Activo", lastReport: "2026-05-29", budget: 260000 },
  { area: "Contabilidad", label: "Contabilidad", manager: "Hector Silva", email: "contabilidad@menlun.com", pin: "2409", role: "Gerente de Contabilidad", frequency: "Quincenal", status: "Activo", lastReport: "2026-05-31", budget: 210000 },
  { area: "Sistemas", label: "Sistemas", manager: "Nadia Luna", email: "sistemas@menlun.com", pin: "2410", role: "Gerente de Sistemas", frequency: "Mensual", status: "Inactivo", lastReport: "2026-05-24", budget: 450000 },
];

let userProfiles = buildUsers();

let reports = [
  { id: 1, date: "2026-06-04", area: "Produccion", responsible: "Luis Ortega", frequency: "Semanal", type: "gasto", amount: 184500, priority: "alta", status: "pendiente", description: "Compra urgente para línea 2", evidence: "cotizacion-linea2.pdf", comments: "Fuera de presupuesto por demanda extraordinaria.", due: "2026-06-05" },
  { id: 2, date: "2026-06-03", area: "Calidad", responsible: "Mariana Ruiz", frequency: "Semanal", type: "incidencia", amount: 0, priority: "alta", status: "falta evidencia", description: "Validación incompleta de lote A-91", evidence: "", comments: "Falta evidencia fotográfica.", due: "2026-06-04" },
  { id: 3, date: "2026-06-03", area: "Compras", responsible: "Rafael Torres", frequency: "Quincenal", type: "solicitud", amount: 76500, priority: "media", status: "en revision", description: "Alta de proveedor alterno", evidence: "expediente-proveedor.pdf", comments: "Pendiente dictamen.", due: "2026-06-07" },
  { id: 4, date: "2026-06-02", area: "Almacen", responsible: "Sofia Campos", frequency: "Semanal", type: "reporte operativo", amount: 32800, priority: "media", status: "aprobado", description: "Ajuste de inventario por diferencia física", evidence: "conteo-ciclico.xlsx", comments: "Autorizado por operaciones.", due: "2026-06-03" },
  { id: 5, date: "2026-06-02", area: "Logistica", responsible: "Jorge Vidal", frequency: "Semanal", type: "gasto", amount: 142300, priority: "alta", status: "pendiente", description: "Rutas extraordinarias zona norte", evidence: "rutas-junio.pdf", comments: "Fuera de presupuesto.", due: "2026-06-04" },
  { id: 6, date: "2026-06-01", area: "Mantenimiento", responsible: "Elena Ponce", frequency: "Quincenal", type: "incidencia", amount: 58900, priority: "alta", status: "en ejecucion", description: "Falla crítica en compresor", evidence: "orden-servicio.pdf", comments: "Atención en proceso.", due: "2026-06-02" },
  { id: 7, date: "2026-06-01", area: "Ventas", responsible: "Pablo Ibarra", frequency: "Mensual", type: "solicitud", amount: 94000, priority: "media", status: "pendiente", description: "Descuento especial cliente clave", evidence: "caso-comercial.pdf", comments: "Requiere autorización.", due: "2026-06-08" },
  { id: 8, date: "2026-05-31", area: "Recursos Humanos", responsible: "Claudia Rios", frequency: "Mensual", type: "mejora", amount: 0, priority: "baja", status: "cerrado", description: "Actualización de matriz de capacitación", evidence: "matriz-rh.xlsx", comments: "Completado.", due: "2026-06-01" },
  { id: 9, date: "2026-05-31", area: "Contabilidad", responsible: "Hector Silva", frequency: "Quincenal", type: "reporte operativo", amount: 0, priority: "alta", status: "pendiente", description: "Reporte de cierre parcial", evidence: "", comments: "Reporte vencido.", due: "2026-06-01" },
  { id: 10, date: "2026-05-30", area: "Sistemas", responsible: "Nadia Luna", frequency: "Mensual", type: "gasto", amount: 116200, priority: "media", status: "rechazado", description: "Licenciamiento no presupuestado", evidence: "cotizacion-saas.pdf", comments: "Replantear alcance.", due: "2026-06-06" },
  { id: 11, date: "2026-06-04", area: "Produccion", responsible: "Luis Ortega", frequency: "Semanal", type: "ahorro", amount: 42000, priority: "media", status: "aprobado", description: "Ahorro por cambio de turno", evidence: "ahorro-turno.xlsx", comments: "Impacto validado.", due: "2026-06-05" },
  { id: 12, date: "2026-06-04", area: "Calidad", responsible: "Mariana Ruiz", frequency: "Semanal", type: "ahorro", amount: 18000, priority: "baja", status: "cerrado", description: "Reducción de retrabajo", evidence: "retrabajo.pdf", comments: "Cerrado.", due: "2026-06-05" },
];

let auditLogs = [
  { id: "local-1", date: "2026-06-05", user: "Sistema", role: "Sistema", action: "inicio", reportId: "", area: "Todas", detail: "Bitácora local inicial." },
];

let tasks = [
  { rowId: "task-001", projectId: "proy-control-evidencias", title: "Cargar evidencia de desviación", description: "Integrar respaldo y causa de la desviación.", area: "Calidad", responsible: "Mariana Ruiz", priority: "alta", status: "vencida", start: "2026-06-02", due: "2026-06-04", evidence: "", kpi: "Evidencias completas", reportId: "rep-002" },
  { rowId: "task-002", projectId: "proy-control-evidencias", title: "Validar gasto de refacciones", description: "Confirmar autorización y evidencia del gasto.", area: "Produccion", responsible: "Luis Ortega", priority: "alta", status: "pendiente", start: "2026-06-05", due: "2026-06-20", evidence: "", kpi: "Gasto autorizado", reportId: "rep-001" },
  { rowId: "task-003", projectId: "proy-logistica-trazable", title: "Definir ruta de liberación y entrega", description: "Documentar responsable, fecha y evidencia por etapa.", area: "Logistica", responsible: "Guillermo Nieto", priority: "alta", status: "en proceso", start: "2026-06-16", due: "2026-06-23", evidence: "mapa-ruta-v1.pdf", kpi: "Entregas a tiempo", reportId: "" },
  { rowId: "task-004", projectId: "proy-mantenimiento-confiable", title: "Completar causa raíz del compresor", description: "Registrar causa, mitigación y acción preventiva.", area: "Mantenimiento", responsible: "José Luis Sánchez", priority: "alta", status: "con riesgo", start: "2026-06-15", due: "2026-06-19", evidence: "", kpi: "Reincidencia crítica", reportId: "" },
  { rowId: "task-005", projectId: "proy-ventas-seguimiento", title: "Actualizar siguiente acción de oportunidades", description: "Toda oportunidad activa debe tener responsable y siguiente contacto.", area: "Ventas", responsible: "José Carlos González", priority: "media", status: "en proceso", start: "2026-06-17", due: "2026-06-24", evidence: "", kpi: "Oportunidades con seguimiento", reportId: "" },
];

let projects = [
  { rowId: "proy-control-evidencias", name: "Control integral de evidencias", objective: "Centralizar evidencias y eliminar cierres sin respaldo.", area: "Todas", owner: "Administrador General", start: "2026-06-10", due: "2026-07-15", priority: "alta", status: "en proceso", kpi: "Evidencias completas", expected: "95%" },
  { rowId: "proy-logistica-trazable", name: "Logística trazable", objective: "Asegurar visibilidad de rutas, entregas, liberaciones y comprobaciones.", area: "Logistica", owner: "Guillermo Nieto", start: "2026-06-12", due: "2026-07-31", priority: "alta", status: "en proceso", kpi: "Entregas a tiempo", expected: "92%" },
  { rowId: "proy-mantenimiento-confiable", name: "Mantenimiento confiable", objective: "Reducir reincidencias mediante causa raíz y preventivos.", area: "Mantenimiento", owner: "José Luis Sánchez", start: "2026-06-14", due: "2026-08-15", priority: "alta", status: "con riesgo", kpi: "Reincidencia crítica", expected: "< 5%" },
  { rowId: "proy-ventas-seguimiento", name: "Disciplina comercial", objective: "Controlar seguimiento, forecast y compromisos comerciales.", area: "Ventas", owner: "José Carlos González", start: "2026-06-16", due: "2026-07-30", priority: "media", status: "en proceso", kpi: "Oportunidades con siguiente acción", expected: "100%" },
];

let subtasks = [
  { rowId: "sub-001", taskId: "task-003", title: "Validar responsables por etapa", responsible: "Guillermo Nieto", due: "2026-06-20", status: "cerrado" },
  { rowId: "sub-002", taskId: "task-003", title: "Definir evidencia mínima de entrega", responsible: "Guillermo Nieto", due: "2026-06-23", status: "en proceso" },
  { rowId: "sub-003", taskId: "task-004", title: "Adjuntar diagnóstico técnico", responsible: "José Luis Sánchez", due: "2026-06-19", status: "vencido" },
];

let incidents = [
  { rowId: "inc-2026-001", folio: "INC-2026-001", area: "Mantenimiento", classification: "Mantenimiento", description: "Paro crítico de compresor con reincidencia.", responsible: "José Luis Sánchez", openDate: "2026-06-15", closeDate: "", evidence: "orden-servicio.pdf", impact: "Alto", priority: "alta", status: "en proceso" },
  { rowId: "inc-2026-002", folio: "INC-2026-002", area: "Logistica", classification: "Logística", description: "Entrega detenida por liberación documental incompleta.", responsible: "Guillermo Nieto", openDate: "2026-06-18", closeDate: "", evidence: "", impact: "Medio", priority: "alta", status: "con riesgo" },
  { rowId: "inc-2026-003", folio: "INC-2026-003", area: "Almacen", classification: "Operativa", description: "Diferencia entre conteo físico y reporte MicroSip.", responsible: "Moisés Prado", openDate: "2026-06-17", closeDate: "2026-06-19", evidence: "conteo-ciclico.xlsx", impact: "Medio", priority: "media", status: "cerrado" },
];

let meetings = [
  { rowId: "reu-001", date: "2026-06-18", type: "Semanal", title: "Junta de operaciones", area: "Todas", owner: "Administrador General", attendees: "Dirección, Ventas, Almacén, Logística, Mantenimiento", minutes: "Se revisaron focos rojos, incidencias y compromisos de la semana.", agreement: "Cerrar evidencias críticas antes del siguiente corte.", agreementOwner: "Administrador General", commitmentDate: "2026-06-23", status: "cerrado" },
  { rowId: "reu-002", date: "2026-06-20", type: "Extraordinaria", title: "Seguimiento de compresor crítico", area: "Mantenimiento", owner: "José Luis Sánchez", attendees: "Mantenimiento, Dirección", minutes: "Pendiente de realizar.", agreement: "Documentar causa raíz y acción preventiva.", agreementOwner: "José Luis Sánchez", commitmentDate: "2026-06-22", status: "pendiente" },
];

let kpis = [
  { rowId: "kpi-ventas-01", area: "Ventas", name: "Oportunidades con siguiente acción", target: 100, current: 76, unit: "%", frequency: "Semanal", owner: "José Carlos González", trend: "sube", status: "amarillo" },
  { rowId: "kpi-almacen-01", area: "Almacen", name: "Exactitud de inventario", target: 98, current: 94, unit: "%", frequency: "Semanal", owner: "Moisés Prado", trend: "estable", status: "amarillo" },
  { rowId: "kpi-logistica-01", area: "Logistica", name: "Entregas a tiempo", target: 92, current: 84, unit: "%", frequency: "Semanal", owner: "Guillermo Nieto", trend: "baja", status: "rojo" },
  { rowId: "kpi-mantto-01", area: "Mantenimiento", name: "Preventivos cumplidos", target: 95, current: 88, unit: "%", frequency: "Mensual", owner: "José Luis Sánchez", trend: "sube", status: "amarillo" },
];

let evidenceLibrary = [
  { rowId: "ev-001", relationType: "Proyecto", relationId: "proy-control-evidencias", name: "checklist-evidencias.xlsx", type: "Excel", owner: "Administrador General", date: "2026-06-17", status: "validada", fileId: "" },
  { rowId: "ev-002", relationType: "Incidencia", relationId: "inc-2026-001", name: "orden-servicio.pdf", type: "PDF", owner: "José Luis Sánchez", date: "2026-06-16", status: "cargada", fileId: "" },
  { rowId: "ev-003", relationType: "Tarea", relationId: "task-004", name: "Diagnóstico técnico pendiente", type: "PDF", owner: "José Luis Sánchez", date: "", status: "faltante", fileId: "" },
];

let diagnosticBase = [
  { section: "Organigrama", area: "Dirección", detail: "Estructura operativa con jefaturas funcionales y dependencia directa de Carmen para control operativo.", owner: "Administrador General", evidence: "organigrama-pmps.pdf", status: "en revision" },
  { section: "Puestos", area: "Almacen", detail: "Roles operativos con responsabilidades mezcladas entre inventario, surtido y evidencias.", owner: "Moisés Prado", evidence: "descriptivos-almacen.docx", status: "pendiente" },
  { section: "Procesos", area: "Logistica", detail: "Rutas y viáticos se capturan fuera de un flujo único de autorización.", owner: "Guillermo Nieto", evidence: "rutas-actuales.xlsx", status: "falta evidencia" },
  { section: "Indicadores actuales", area: "Mantenimiento", detail: "Se mide cierre correctivo, pero no reincidencia ni tiempo muerto acumulado.", owner: "José Luis Sánchez", evidence: "indicadores-mantto.xlsx", status: "en revision" },
  { section: "Problemas identificados", area: "Ventas", detail: "Descuentos especiales no siempre se conectan con rentabilidad final.", owner: "José Carlos González", evidence: "casos-comerciales.pdf", status: "pendiente" },
];

let interviews = [
  { date: "2026-06-03", interviewed: "Moisés Prado", area: "Almacen", position: "Supervisor de Almacén", responsible: "Administrador General", functions: "Control de entradas, salidas, evidencias e inventario físico.", responsibilities: "Surtido correcto y conteos cíclicos.", problems: "Diferencias físicas y evidencias tardías.", risks: "Inventario incorrecto para compras y producción.", opportunities: "Tablero de diferencias y evidencia por movimiento.", ideas: "Escaneo móvil de evidencias.", needs: "Stock real, diferencias, pendientes.", automations: "Alertas por evidencia faltante.", golden: "Eliminar capturas duplicadas, evidencia manual y falta de visibilidad de diferencias." },
  { date: "2026-06-04", interviewed: "Guillermo Nieto", area: "Logistica", position: "Jefe de Logística", responsible: "Administrador General", functions: "Programación de rutas, viáticos, entregas y comprobación.", responsibilities: "Cumplir entregas con costo controlado.", problems: "Gastos fuera de presupuesto y comprobaciones tardías.", risks: "Sobrecostos y reclamos de clientes.", opportunities: "Control por ruta y costo por entrega.", ideas: "Flujo de autorización de gastos extraordinarios.", needs: "Viáticos, rutas, evidencias, costo.", automations: "Recordatorio de comprobación.", golden: "Eliminar rutas urgentes sin autorización, evidencias incompletas y falta de presupuesto visible." },
  { date: "2026-06-05", interviewed: "José Luis Sánchez", area: "Mantenimiento", position: "Jefe de Mantenimiento", responsible: "Administrador General", functions: "Atención correctiva, preventivos y proveedores.", responsibilities: "Reducir paros y reincidencias.", problems: "Correctivos críticos sin evidencia completa.", risks: "Paro operativo y costos urgentes.", opportunities: "Matriz de criticidad y plan preventivo.", ideas: "Bitácora por equipo.", needs: "Reincidencia, costo, tiempo muerto.", automations: "Alertas de vencimiento preventivo.", golden: "Eliminar urgencias repetidas, falta de refacciones y reportes sin diagnóstico." },
  { date: "2026-06-06", interviewed: "José Carlos González", area: "Ventas", position: "Jefe de Ventas", responsible: "Administrador General", functions: "Seguimiento comercial, descuentos y clientes clave.", responsibilities: "Vender con rentabilidad.", problems: "Solicitudes comerciales no conectadas a margen.", risks: "Descuentos que erosionan utilidad.", opportunities: "Aprobación por impacto financiero.", ideas: "Semáforo de rentabilidad por solicitud.", needs: "Margen, descuentos, volumen, autorización.", automations: "Ruta de aprobación comercial.", golden: "Eliminar descuentos sin trazabilidad, tiempos largos de respuesta y falta de impacto financiero." },
];

let painMap = [
  { category: "Procesos", description: "Evidencias operativas se cargan tarde o incompletas.", area: "Almacen", impact: "Afecta control de inventario y auditoría.", frequency: "Alta", priority: "alta", owner: "Moisés Prado", signal: "rojo" },
  { category: "Finanzas", description: "Gastos logísticos extraordinarios sin presupuesto visible.", area: "Logistica", impact: "Eleva costo por ruta.", frequency: "Media", priority: "alta", owner: "Guillermo Nieto", signal: "rojo" },
  { category: "Operación", description: "Correctivos críticos se atienden sin causa raíz documentada.", area: "Mantenimiento", impact: "Riesgo de reincidencia.", frequency: "Alta", priority: "alta", owner: "José Luis Sánchez", signal: "rojo" },
  { category: "Comunicación", description: "Acuerdos de reunión no siempre llegan a seguimiento formal.", area: "Dirección", impact: "Pérdida de trazabilidad.", frequency: "Media", priority: "media", owner: "Administrador General", signal: "amarillo" },
  { category: "Tecnología", description: "Información clave está dispersa en archivos y mensajes.", area: "Todas", impact: "Retrasa decisiones de Carmen y Dirección.", frequency: "Alta", priority: "alta", owner: "Administrador General", signal: "rojo" },
];

let executiveFindings = [
  { finding: "Control operativo disperso", rootCause: "No existe tablero único de compromisos, evidencias y riesgos.", risk: "Dirección decide con información incompleta.", impact: "Alto", area: "Todas", priority: "alta", owner: "Administrador General" },
  { finding: "Evidencias faltantes", rootCause: "La comprobación no está integrada al seguimiento.", risk: "Auditoría débil y retrasos.", impact: "Alto", area: "Almacen", priority: "alta", owner: "Moisés Prado" },
  { finding: "Gasto extraordinario reactivo", rootCause: "Autorización posterior al evento.", risk: "Sobrecosto no controlado.", impact: "Alto", area: "Logistica", priority: "alta", owner: "Guillermo Nieto" },
  { finding: "Mantenimiento sin causa raíz", rootCause: "Se registra la atención, no el diagnóstico.", risk: "Reincidencia de fallas críticas.", impact: "Alto", area: "Mantenimiento", priority: "alta", owner: "José Luis Sánchez" },
];

let strategies = [
  { objective: "Centralizar control de evidencias", expected: "100% de reportes críticos con evidencia", owner: "Administrador General", kpi: "Evidencias completas", start: "2026-06-10", end: "2026-07-10", budget: 0, finding: "Evidencias faltantes" },
  { objective: "Cerrar diferencias de inventario con evidencia semanal", expected: "Reducir 20% diferencias físicas", owner: "Moisés Prado", kpi: "Exactitud de inventario", start: "2026-06-11", end: "2026-07-20", budget: 12000, finding: "Evidencias faltantes" },
  { objective: "Reducir gasto extraordinario logístico", expected: "Bajar 15% gasto fuera de presupuesto", owner: "Guillermo Nieto", kpi: "Costo por ruta", start: "2026-06-12", end: "2026-07-30", budget: 35000, finding: "Gasto extraordinario reactivo" },
  { objective: "Diagnosticar fallas críticas con causa raíz", expected: "Cero correctivos críticos sin diagnóstico", owner: "José Luis Sánchez", kpi: "Reincidencia crítica", start: "2026-06-14", end: "2026-08-01", budget: 50000, finding: "Mantenimiento sin causa raíz" },
  { objective: "Controlar descuentos con impacto financiero", expected: "100% de descuentos especiales con margen documentado", owner: "José Carlos González", kpi: "Rentabilidad comercial", start: "2026-06-16", end: "2026-07-25", budget: 0, finding: "Control operativo disperso" },
];

let workPlan = [
  { action: "Definir checklist de evidencia por área", owner: "Administrador General", start: "2026-06-10", due: "2026-06-17", priority: "alta", evidence: "checklist-evidencias.xlsx", status: "en revision", view: "Kanban" },
  { action: "Conciliar diferencias de inventario con evidencia fotográfica", owner: "Moisés Prado", start: "2026-06-11", due: "2026-06-18", priority: "alta", evidence: "", status: "pendiente", view: "Lista" },
  { action: "Mapear ruta de autorización de viáticos", owner: "Guillermo Nieto", start: "2026-06-12", due: "2026-06-20", priority: "alta", evidence: "", status: "pendiente", view: "Timeline" },
  { action: "Crear bitácora de causa raíz por equipo crítico", owner: "José Luis Sánchez", start: "2026-06-14", due: "2026-06-22", priority: "alta", evidence: "", status: "falta evidencia", view: "Gantt" },
  { action: "Validar semáforo comercial de descuentos", owner: "José Carlos González", start: "2026-06-16", due: "2026-06-28", priority: "media", evidence: "matriz-descuentos.xlsx", status: "en ejecucion", view: "Lista" },
];

let agreements = [
  { agreement: "Toda evidencia crítica debe cargarse antes del cierre semanal.", date: "2026-06-18", area: "Almacen", owner: "Moisés Prado", priority: "alta", due: "2026-06-23", evidence: "", status: "en proceso" },
  { agreement: "Los gastos extraordinarios requieren justificación previa.", date: "2026-06-18", area: "Logistica", owner: "Guillermo Nieto", priority: "alta", due: "2026-06-20", evidence: "formato-viaticos.pdf", status: "con riesgo" },
  { agreement: "Cada falla crítica debe incluir causa raíz y acción preventiva.", date: "2026-06-18", area: "Mantenimiento", owner: "José Luis Sánchez", priority: "alta", due: "2026-06-22", evidence: "", status: "pendiente" },
];

let riskRegister = [
  { risk: "Pausa de Appwrite Free por inactividad o política de plan", probability: "Media", impact: "Alto", mitigation: "Heartbeat reforzado y plan de migración/pago aprobado", owner: "Administrador General" },
  { risk: "Evidencias pendientes en cierres semanales", probability: "Alta", impact: "Alto", mitigation: "Recordatorios y escalamiento automático", owner: "Moisés Prado" },
  { risk: "Sobrecostos de logística no autorizados", probability: "Media", impact: "Alto", mitigation: "Ruta de autorización y presupuesto por ruta", owner: "Guillermo Nieto" },
  { risk: "Reincidencia de fallas críticas", probability: "Alta", impact: "Alto", mitigation: "Causa raíz obligatoria y revisión de preventivos", owner: "José Luis Sánchez" },
];

let benefits = [
  { saving: 42000, timeReduction: "8 horas semanales", incidentReduction: "12%", improvements: "Checklist de evidencias y tablero de seguimiento", financialImpact: 42000 },
  { saving: 18000, timeReduction: "3 horas semanales", incidentReduction: "7%", improvements: "Control inicial de retrabajo en calidad", financialImpact: 18000 },
  { saving: 65000, timeReduction: "10 horas mensuales", incidentReduction: "15%", improvements: "Visibilidad de gasto extraordinario por ruta", financialImpact: 65000 },
];

let lessons = [
  { rowId: "lec-001", date: "2026-06-18", area: "Logistica", context: "Liberación documental de entregas", lesson: "La evidencia debe validarse antes de liberar la ruta, no después de la entrega.", action: "Integrar checklist obligatorio a la tarea de liberación.", owner: "Guillermo Nieto", evidence: "mapa-ruta-v1.pdf" },
  { rowId: "lec-002", date: "2026-06-19", area: "Mantenimiento", context: "Reincidencia del compresor", lesson: "Cerrar la orden sin causa raíz mantiene el riesgo operativo abierto.", action: "Exigir diagnóstico y acción preventiva antes del cierre.", owner: "José Luis Sánchez", evidence: "orden-servicio.pdf" },
];

diagnosticBase = diagnosticBase.map((item, index) => ({ rowId: item.rowId || `diag-${index + 1}`, ...item }));
interviews = interviews.map((item, index) => ({ rowId: item.rowId || `ent-${index + 1}`, ...item }));
painMap = painMap.map((item, index) => ({ rowId: item.rowId || `dolor-${index + 1}`, ...item }));
executiveFindings = executiveFindings.map((item, index) => ({ rowId: item.rowId || `hall-${index + 1}`, ...item }));
strategies = strategies.map((item, index) => ({ rowId: item.rowId || `est-${index + 1}`, ...item }));
workPlan = workPlan.map((item, index) => ({ rowId: item.rowId || `plan-${index + 1}`, ...item }));
agreements = agreements.map((item, index) => ({ rowId: item.rowId || `acu-${index + 1}`, ...item }));
riskRegister = riskRegister.map((item, index) => ({ rowId: item.rowId || `risk-${index + 1}`, ...item }));
benefits = benefits.map((item, index) => ({ rowId: item.rowId || `ben-${index + 1}`, ...item }));
lessons = lessons.map((item, index) => ({ rowId: item.rowId || `lec-${index + 1}`, ...item }));
projects = projects.map((item, index) => ({ rowId: item.rowId || `proy-${index + 1}`, ...item }));
subtasks = subtasks.map((item, index) => ({ rowId: item.rowId || `sub-${index + 1}`, ...item }));
incidents = incidents.map((item, index) => ({ rowId: item.rowId || `inc-${index + 1}`, ...item }));
meetings = meetings.map((item, index) => ({ rowId: item.rowId || `reu-${index + 1}`, ...item }));
kpis = kpis.map((item, index) => ({ rowId: item.rowId || `kpi-${index + 1}`, ...item }));
evidenceLibrary = evidenceLibrary.map((item, index) => ({ rowId: item.rowId || `ev-${index + 1}`, ...item }));

let jefaturas = [
  { rowId: "jef-moises-prado", name: "Moisés Prado", photo: "", position: "Supervisor de Almacén", area: "Almacen", leadership: "Almacén", email: "supervisor.almacen@pmpsquimicos.com", phone: "56 4007 0190", whatsapp: "56 4007 0190", boss: "Carmen", user: "supervisor.almacen@pmpsquimicos.com", role: "Jefatura", status: "Activo", monthlyGoal: "Inventario exacto y evidencias completas", quarterlyGoal: "Reducir diferencias físicas", annualGoal: "Mejorar control operativo de almacén", mainKpi: "Exactitud de inventario", secondaryKpis: "Evidencias, reportes, cumplimiento", budget: 410000, spent: 51000, carmenComments: "Reforzar evidencia semanal.", directionComments: "Prioridad media." },
  { rowId: "jef-guillermo-nieto", name: "Guillermo Nieto", photo: "", position: "Jefe de Logística", area: "Logistica", leadership: "Logística", email: "logistica.lf21@gmail.com", phone: "56 4000 5236", whatsapp: "56 4000 5236", boss: "Carmen", user: "logistica.lf21@gmail.com", role: "Jefatura", status: "Activo", monthlyGoal: "Optimizar rutas y comprobar viáticos", quarterlyGoal: "Bajar costo por ruta", annualGoal: "Modelo logístico medible", mainKpi: "Costo logístico", secondaryKpis: "Rutas, viáticos, evidencias", budget: 640000, spent: 87000, carmenComments: "Revisar gastos fuera de presupuesto.", directionComments: "Foco en ROI." },
  { rowId: "jef-jose-luis-sanchez", name: "José Luis Sánchez", photo: "", position: "Jefe de Mantenimiento", area: "Mantenimiento", leadership: "Mantenimiento", email: "mantto.operadora@gmail.com", phone: "56 4001 1248", whatsapp: "56 4001 1248", boss: "Carmen", user: "mantto.operadora@gmail.com", role: "Jefatura", status: "Activo", monthlyGoal: "Cerrar correctivos críticos", quarterlyGoal: "Reducir reincidencias", annualGoal: "Plan preventivo estable", mainKpi: "Incidencias críticas", secondaryKpis: "Preventivos, correctivos, reincidencias", budget: 560000, spent: 69000, carmenComments: "Prioridad alta por vencimientos.", directionComments: "Revisar compresor." },
  { rowId: "jef-jose-carlos-gonzalez", name: "José Carlos González", photo: "", position: "Jefe de Ventas", area: "Ventas", leadership: "Ventas", email: "josecarlos.gonzalez@pmpsquimicos.com", phone: "55 6784 5354", whatsapp: "55 6784 5354", boss: "Dirección General", user: "josecarlos.gonzalez@pmpsquimicos.com", role: "Jefatura", status: "Activo", monthlyGoal: "Controlar descuentos y rentabilidad", quarterlyGoal: "Aumentar conversión", annualGoal: "Crecimiento rentable", mainKpi: "Rentabilidad comercial", secondaryKpis: "Solicitudes, ROI, ventas", budget: 820000, spent: 96000, carmenComments: "Validar descuentos especiales.", directionComments: "Foco comercial." },
];

const calendarEvents = [
  { day: 3, title: "Corte semanal", type: "Semanal" },
  { day: 7, title: "Vencimientos de tareas", type: "Tareas" },
  { day: 14, title: "Corte quincenal", type: "Quincenal" },
  { day: 18, title: "Junta de operaciones", type: "Junta" },
  { day: 21, title: "Corte semanal", type: "Semanal" },
  { day: 28, title: "Corte quincenal", type: "Quincenal" },
  { day: 30, title: "Cierre mensual", type: "Mensual" },
];

const loginForm = document.querySelector("#login-form");
const userSelect = document.querySelector("#user-select");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#login-error");
const logoImages = document.querySelectorAll("[data-logo]");
const navButtons = document.querySelectorAll(".module-nav button");
const adminOnlyItems = document.querySelectorAll("[data-admin-only]");
const moduleArea = document.querySelector("#module-area");
const moduleTitle = document.querySelector("#module-title");
const userChip = document.querySelector("#user-chip");
const logoutButton = document.querySelector("#logout-button");
const appContent = document.querySelector("#app-content");
const dataStatus = document.querySelector("#data-status");
const globalSearchInput = document.querySelector("#global-search");
const mobileNavToggle = document.querySelector("#mobile-nav-toggle");
const mainNavigation = document.querySelector("#main-navigation");

let activeUser = null;

logoImages.forEach((logo) => {
  const showFallback = () => logo.closest(".logo-frame").classList.add("logo-missing");
  const showLogo = () => logo.closest(".logo-frame").classList.remove("logo-missing");

  logo.addEventListener("load", showLogo);
  logo.addEventListener("error", showFallback);
  if (logo.complete && logo.naturalWidth > 0) showLogo();
  if (logo.complete && logo.naturalWidth === 0) showFallback();
});

setDataStatus("Inicia sesión", "loading");
populateLoginUsers();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = userSelect.value.trim().toLowerCase();
  const secret = passwordInput.value.trim();
  const accessEntry = loginDirectory().find((item) => item.email.toLowerCase() === email);

  if (!email) {
    loginError.textContent = "Selecciona un usuario o jefatura.";
    return;
  }

  if (!accessEntry || secret !== accessEntry.pin) {
    loginError.textContent = "Clave de acceso incorrecta.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  try {
    await loginWithAppwrite(email, APPWRITE_AUTH_PASSWORD);
    await initializeAppData();
  } catch (error) {
    loginError.textContent = error.isAppwriteUnavailable ? APPWRITE_PAUSED_MESSAGE : "No se pudo iniciar sesión. Verifica conexión o cuenta activa.";
    passwordInput.value = "";
    passwordInput.focus();
    console.warn(error);
    return;
  }

  const user = findUserProfile(email);

  if (!user) {
    loginError.textContent = "Usuario autenticado sin perfil activo.";
    passwordInput.value = "";
    passwordInput.focus();
    await logoutFromAppwrite();
    return;
  }

  activeUser = user;
  loginError.textContent = "";
  userChip.textContent = `${user.name} - ${user.role}`;
  document.body.classList.remove("is-login");
  document.body.classList.add("is-app");
  applyVisibilityRules();
  navigateInitialView();
  registerDailyHeartbeat();
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  await logoutFromAppwrite();

  activeUser = null;
  populateLoginUsers();
  passwordInput.value = "";
  loginError.textContent = "";
  userChip.textContent = "Sin sesión";
  appContent.innerHTML = "";
  moduleArea.textContent = "Vista general";
  moduleTitle.textContent = "Dashboard";
  setDataStatus("Inicia sesión", "loading");
  document.body.classList.remove("is-app");
  document.body.classList.add("is-login");
  navButtons.forEach((item) => item.classList.remove("active"));
  document.querySelector('[data-view="direction-dashboard"]')?.classList.add("active");
  logoutButton.disabled = false;
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.hidden) return;
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    navigate(button.dataset.view, button.dataset.module, button.dataset.area, button.dataset.areaKey);
    closeMobileNavigation();
  });
});

mobileNavToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("is-mobile-nav-open");
  mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  mobileNavToggle.setAttribute("aria-label", isOpen ? "Ocultar navegación" : "Mostrar navegación");
});

function closeMobileNavigation() {
  document.body.classList.remove("is-mobile-nav-open");
  mobileNavToggle?.setAttribute("aria-expanded", "false");
  mobileNavToggle?.setAttribute("aria-label", "Mostrar navegación");
}

globalSearchInput?.addEventListener("input", () => {
  const query = globalSearchInput.value.trim();
  if (query.length >= 2) {
    navButtons.forEach((item) => item.classList.remove("active"));
    moduleTitle.textContent = "Búsqueda global";
    moduleArea.textContent = "Control operativo";
    renderGlobalSearch(query);
  }
});

appContent.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const target = button.dataset.target || "registro";

  try {
    if (action === "export-reports") return exportReportsFromButton(button);
    if (action === "print-reports") return printReportsFromButton(button);
    if (action === "export-audit") return exportAuditFromButton(button);
    if (action === "print-audit") return printAuditFromButton(button);
    if (action === "print-executive") return printExecutiveDashboard();
    if (action === "new-transform") await openTransformForm(target);
    if (action === "edit-transform") await openTransformForm(button.dataset.moduleKey, target);
    if (action === "delete-transform") await deleteTransformRecord(button.dataset.moduleKey, target);
    if (action === "new-management") await createManagement();
    if (action === "edit-management") await editManagement(target);
    if (action === "disable-management") await disableManagement(target);
    if (action === "edit-leadership") await editLeadership(target);
    if (action === "toggle-leadership") await toggleLeadership(target);
    if (action === "new-user") await openUserForm();
    if (action === "edit-user") await openUserForm(target);
    if (action === "disable-user") await toggleUserStatus(target);
    if (action === "delete-user") await deleteUserProfile(target);
    if (action === "quick-action") await runQuickAction(button.dataset.quick, target);
    if (action === "edit-report") await editReport(target);
    if (action === "approve-report") await changeReportStatus(target, "aprobado");
    if (action === "reject-report") await changeReportStatus(target, "rechazado");
    if (action === "missing-evidence") await changeReportStatus(target, "falta evidencia");
    if (action === "close-report") await changeReportStatus(target, "cerrado");
    if (action === "open-project") renderTasks(target);
    if (action === "back-projects") renderProjects();
  } catch (error) {
    notify("No se pudo completar la acción. Revisa la conexión del sistema.");
    console.warn(error);
  }
});

async function initializeAppData() {
  setDataStatus("Conectando sistema...", "loading");

  try {
    validateAppwriteConfig();

    const [
      remoteGerencias,
      remoteUsers,
      remoteReports,
      remoteAuditLogs,
      remoteJefaturas,
      remoteTasks,
      remoteProjects,
      remoteSubtasks,
      remoteIncidents,
      remoteMeetings,
      remoteKpis,
      remoteEvidenceLibrary,
      remoteDiagnosticBase,
      remoteInterviews,
      remotePainMap,
      remoteExecutiveFindings,
      remoteStrategies,
      remoteWorkPlan,
      remoteAgreements,
      remoteRisks,
      remoteBenefits,
      remoteLessons,
    ] = await Promise.all([
      listRows(TABLES.gerencias),
      listRows(TABLES.usuarios),
      listRows(TABLES.reportes),
      listRows(TABLES.bitacora),
      listRowsOptional(TABLES.jefaturas),
      listRowsOptional(TABLES.tareas),
      listRowsOptional(TABLES.proyectos),
      listRowsOptional(TABLES.subtareas),
      listRowsOptional(TABLES.incidencias),
      listRowsOptional(TABLES.reuniones),
      listRowsOptional(TABLES.kpis),
      listRowsOptional(TABLES.evidenciasOperativas),
      listRowsOptional(TABLES.diagnosticoBase),
      listRowsOptional(TABLES.entrevistas),
      listRowsOptional(TABLES.mapaDolor),
      listRowsOptional(TABLES.diagnosticoEjecutivo),
      listRowsOptional(TABLES.estrategias),
      listRowsOptional(TABLES.planTrabajo),
      listRowsOptional(TABLES.acuerdos),
      listRowsOptional(TABLES.riesgos),
      listRowsOptional(TABLES.beneficios),
      listRowsOptional(TABLES.lecciones),
    ]);

    if (remoteGerencias.length) {
      gerencias = remoteGerencias.map(mapGerenciaRow);
    }

    if (remoteUsers.length) {
      const remoteProfiles = remoteUsers.map(mapUserRow);
      const remoteEmails = new Set(remoteProfiles.map((item) => item.email.toLowerCase()));
      userProfiles = [
        ...remoteProfiles,
        ...gerencias.filter((item) => !remoteEmails.has(item.email.toLowerCase())).map((item) => ({
          name: item.manager,
          role: item.role,
          email: item.email,
          userId: USER_IDS_BY_EMAIL[item.email.toLowerCase()],
          access: "area",
          area: item.area,
          status: item.status,
          phone: item.phone || "",
          whatsapp: item.whatsapp || "",
          pin: item.pin || "",
        })),
      ];
    } else {
      userProfiles = buildUsers();
    }

    if (remoteReports.length) {
      reports = remoteReports.map(mapReportRow).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }

    if (remoteAuditLogs.length) {
      auditLogs = remoteAuditLogs.map(mapAuditRow).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }

    if (remoteJefaturas.length) {
      jefaturas = remoteJefaturas.map(mapJefaturaRow);
    }

    if (remoteTasks.length) {
      tasks = remoteTasks.map(mapTaskRow);
    }

    if (remoteProjects.length) projects = remoteProjects.map(mapProjectRow);
    if (remoteSubtasks.length) subtasks = remoteSubtasks.map(mapSubtaskRow);
    if (remoteIncidents.length) incidents = remoteIncidents.map(mapIncidentRow);
    if (remoteMeetings.length) meetings = remoteMeetings.map(mapMeetingRow);
    if (remoteKpis.length) kpis = remoteKpis.map(mapKpiRow);
    if (remoteEvidenceLibrary.length) evidenceLibrary = remoteEvidenceLibrary.map(mapOperationalEvidenceRow);

    if (remoteDiagnosticBase.length) diagnosticBase = remoteDiagnosticBase.map(mapDiagnosticBaseRow);
    if (remoteInterviews.length) interviews = remoteInterviews.map(mapInterviewRow);
    if (remotePainMap.length) painMap = remotePainMap.map(mapPainRow);
    if (remoteExecutiveFindings.length) executiveFindings = remoteExecutiveFindings.map(mapExecutiveFindingRow);
    if (remoteStrategies.length) strategies = remoteStrategies.map(mapStrategyRow);
    if (remoteWorkPlan.length) workPlan = remoteWorkPlan.map(mapWorkPlanRow);
    if (remoteAgreements.length) agreements = remoteAgreements.map(mapAgreementRow);
    if (remoteRisks.length) riskRegister = remoteRisks.map(mapRiskRow);
    if (remoteBenefits.length) benefits = remoteBenefits.map(mapBenefitRow);
    if (remoteLessons.length) lessons = remoteLessons.map(mapLessonRow);

    appwriteOnline = true;
    appwriteDataLoaded = true;
    setDataStatus("Sistema en línea", "online");
    populateLoginUsers();
  } catch (error) {
    appwriteOnline = false;
    setDataStatus(APPWRITE_PAUSED_MESSAGE, "offline");
    console.warn("Servicio de datos no disponible.", error);
    throw error;
  } finally {
    appwriteLoading = false;
    if (activeUser) {
      applyVisibilityRules();
      const current = document.querySelector(".module-nav button.active");
      if (current) navigate(current.dataset.view, current.dataset.module, current.dataset.area, current.dataset.areaKey);
    }
  }
}

function validateAppwriteConfig() {
  if (!APPWRITE_CONFIG || !APPWRITE_CONFIG.endpoint || !APPWRITE_CONFIG.projectId || !APPWRITE_CONFIG.databaseId) {
    throw new Error("Configuración Appwrite incompleta.");
  }

  if (APPWRITE_CONFIG.blockedProjectIds?.includes(APPWRITE_CONFIG.projectId)) {
    throw new Error("Proyecto Appwrite temporal detectado.");
  }
}

function buildUsers() {
  return [
    ...SYSTEM_USERS,
    ...gerencias.map((item) => ({
      name: item.manager,
      role: item.role,
      email: item.email,
      userId: USER_IDS_BY_EMAIL[item.email.toLowerCase()],
      access: "area",
      area: item.area,
      phone: item.phone || "",
      whatsapp: item.whatsapp || "",
      pin: item.pin || "",
      status: item.status,
    })),
  ];
}

function findUserProfile(email) {
  const normalizedEmail = email.toLowerCase();
  return userProfiles.find((item) => item.email.toLowerCase() === normalizedEmail && item.status !== "Inactivo")
    || loginDirectory().find((item) => item.email.toLowerCase() === normalizedEmail && item.status !== "Inactivo");
}

function populateLoginUsers() {
  if (!userSelect) return;

  const selected = userSelect.value;
  const entries = loginDirectory();
  userSelect.innerHTML = entries.map((item) => `
    <option value="${escapeHtml(item.email)}">${escapeHtml(loginOptionLabel(item))}</option>
  `).join("");

  if (selected && entries.some((item) => item.email === selected)) {
    userSelect.value = selected;
  }
}

function loginDirectory() {
  const adminUser = {
    name: "Administrador General",
    role: "Administrador General",
    email: "pako@menlun.com",
    userId: "pako",
    access: "all",
    area: "",
    status: "Activo",
    phone: "",
    whatsapp: "",
    pin: "0000",
  };

  const directionUser = {
    name: "Dirección General",
    role: "Vista Ejecutiva",
    email: "direccion@menlun.com",
    userId: "direccion",
    access: "executive",
    area: "",
    status: "Activo",
    phone: "",
    whatsapp: "",
    pin: "0099",
  };

  const leadershipUsers = jefaturas.map((item, index) => ({
    name: item.name,
    role: item.role || "Jefatura",
    email: item.user || item.email,
    userId: USER_IDS_BY_EMAIL[String(item.user || item.email).toLowerCase()] || item.rowId,
    access: "area",
    area: item.area,
    status: item.status,
    phone: item.phone,
    whatsapp: item.whatsapp,
    pin: String(index + 1).padStart(4, "0"),
  }));

  const directory = [adminUser, directionUser, ...leadershipUsers]
    .filter((item) => item.email && item.status !== "Inactivo");

  return Array.from(new Map(directory.map((item) => [item.email.toLowerCase(), item])).values());
}

function loginOptionLabel(item) {
  if (item.access === "all") return "Administrador General";
  if (item.access === "executive") return "Dirección General";
  return `${item.name} / ${labelForArea(item.area)}`;
}

async function appwriteRequest(path, options = {}) {
  const url = `${APPWRITE_CONFIG.endpoint}${path}`;
  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": APPWRITE_CONFIG.projectId,
    "X-Appwrite-Response-Format": "1.9.5",
  };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  if (typeof window.fetch === "function") {
    const response = await window.fetch(url, { method, headers, body, credentials: "include" });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw appwriteError(response.status, data.message, data.type);
    }

    return data;
  }

  return xhrRequest(url, method, headers, body);
}

async function logoutFromAppwrite() {
  try {
    await appwriteRequest("/account/sessions/current", { method: "DELETE" });
  } catch (error) {
    // Session may already be expired.
  }
}

async function loginWithAppwrite(email, password) {
  await logoutFromAppwrite();

  await appwriteRequest("/account/sessions/email", {
    method: "POST",
    body: { email, password },
  });
}

function xhrRequest(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    xhr.onload = () => {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(appwriteError(xhr.status, data.message, data.type));
      }
    };
    xhr.onerror = () => reject(appwriteError(0, APPWRITE_PAUSED_MESSAGE));
    xhr.send(body);
  });
}

async function listRows(tableId) {
  const data = await appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows`);
  return data.rows || [];
}

async function listRowsOptional(tableId) {
  if (!tableId) return [];

  try {
    return await listRows(tableId);
  } catch (error) {
    if (error.status === 404) {
      console.warn(`Tabla opcional no encontrada: ${tableId}`);
      return [];
    }
    throw error;
  }
}

async function ensureAppwriteWriteReady() {
  if (appwriteOnline) return true;

  try {
    validateAppwriteConfig();
    await listRows(TABLES.gerencias);
    appwriteOnline = true;
    setDataStatus("Sistema en línea", "online");
    return true;
  } catch (error) {
    appwriteOnline = false;
    setDataStatus(APPWRITE_PAUSED_MESSAGE, "offline");
    console.warn("No se pudo confirmar conexión de escritura.", error);
    return false;
  }
}

function appwriteError(status, message = "", type = "") {
  const error = new Error(message || `Error Appwrite ${status}`);
  error.status = status;
  error.type = type;
  error.isAppwriteUnavailable = Number(status) === 0
    || Number(status) === 429
    || Number(status) >= 500
    || type === "project_paused"
    || String(message).toLowerCase().includes("paused");
  if (error.isAppwriteUnavailable) error.message = APPWRITE_PAUSED_MESSAGE;
  return error;
}

async function createRow(tableId, rowId, data, permissions = null) {
  const rowPermissions = permissions || permissionsForRow(tableId, data);
  const body = { rowId, data };
  if (rowPermissions?.length) body.permissions = rowPermissions;

  return appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows`, {
    method: "POST",
    body,
  });
}

async function updateRow(tableId, rowId, data, permissions = null) {
  const body = { data };
  if (permissions?.length) body.permissions = permissions;

  return appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows/${rowId}`, {
    method: "PATCH",
    body,
  });
}

async function deleteRow(tableId, rowId) {
  return appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows/${rowId}`, {
    method: "DELETE",
  });
}

async function uploadEvidenceFile(file, area) {
  if (!file) return "";

  const fileId = createRowId("file");
  const formData = new FormData();
  formData.append("fileId", fileId);
  formData.append("file", file);
  const filePermissions = permissionsForArea(area);
  filePermissions.forEach((permission) => formData.append("permissions[]", permission));

  const data = await appwriteUpload(`/storage/buckets/${STORAGE.evidencias}/files`, formData);
  return `${data.$id}|${file.name}`;
}

async function appwriteUpload(path, formData) {
  const url = `${APPWRITE_CONFIG.endpoint}${path}`;

  if (typeof window.fetch === "function") {
    const response = await window.fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-Appwrite-Project": APPWRITE_CONFIG.projectId,
        "X-Appwrite-Response-Format": "1.9.5",
      },
      body: formData,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || `Error Appwrite ${response.status}`);
    }

    return data;
  }

  return xhrUpload(url, formData);
}

function xhrUpload(url, formData) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-Appwrite-Project", APPWRITE_CONFIG.projectId);
    xhr.setRequestHeader("X-Appwrite-Response-Format", "1.9.5");
    xhr.onload = () => {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.message || `Error Appwrite ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("No se pudo subir la evidencia."));
    xhr.send(formData);
  });
}

function mapGerenciaRow(row) {
  return {
    rowId: row.$id,
    area: areaKeyFromLabel(row.gerencia),
    label: row.gerencia,
    manager: row.gerente,
    email: row.email,
    pin: row.pin,
    role: row.rol,
    frequency: row.frecuencia,
    status: row.estatus,
    lastReport: formatDate(row.ultimoReporte),
    budget: Number(row.presupuesto || 0),
  };
}

function mapUserRow(row) {
  const role = row.rol || "";
  const gerencia = row.gerencia || "";
  let access = "area";
  let area = areaKeyFromLabel(gerencia);

  if (role.includes("Administrador") || role.includes("Acceso Total")) {
    access = "all";
    area = "";
  }

  if (role.includes("Vista Ejecutiva") || gerencia === "Dirección") {
    access = "executive";
    area = "";
  }

  return {
    rowId: row.$id,
    name: row.nombreCompleto || row.nombre || row.email,
    role,
    email: row.email,
    userId: USER_IDS_BY_EMAIL[String(row.email || "").toLowerCase()] || row.$id,
    access,
    area,
    status: row.estatus || "Activo",
    phone: row.telefono || "",
    whatsapp: row.whatsapp || "",
    pin: row.claveAcceso || row.pin || "",
  };
}

function userToAppwriteData(user) {
  return {
    nombre: user.name,
    nombreCompleto: user.name,
    email: user.email,
    rol: user.role,
    gerencia: user.access === "all" ? "Todas" : user.access === "executive" ? "Dirección" : labelForArea(user.area),
    pin: user.pin || "",
    claveAcceso: user.pin || "",
    telefono: user.phone || "",
    whatsapp: user.whatsapp || "",
    estatus: user.status || "Activo",
  };
}

function permissionsForRow(tableId, data) {
  if (activeUser?.access === "area") {
    return uniquePermissions([
      ...readPermissions([activeUser.userId]),
      ...updatePermissions([activeUser.userId]),
    ]);
  }

  if (tableId === TABLES.usuarios) {
    const ownerId = USER_IDS_BY_EMAIL[String(data.email || "").toLowerCase()];
    return uniquePermissions([
      ...readPermissions([...ADMIN_USER_IDS, ownerId]),
      ...updatePermissions(ADMIN_USER_IDS),
      ...deletePermissions(ADMIN_USER_IDS),
    ]);
  }

  if (tableId === TABLES.gerencias) {
    return permissionsForArea(areaKeyFromLabel(data.gerencia), { adminOnlyUpdate: true });
  }

  if (tableId === TABLES.jefaturas) {
    return permissionsForArea(areaKeyFromLabel(data.area || data.jefatura), { adminOnlyUpdate: true });
  }

  if ([TABLES.diagnosticoBase, TABLES.entrevistas, TABLES.mapaDolor, TABLES.diagnosticoEjecutivo, TABLES.lecciones].includes(tableId)) {
    return permissionsForArea(areaKeyFromLabel(data.area || data.areaAfectada), { adminOnlyUpdate: true });
  }

  if ([TABLES.proyectos, TABLES.incidencias, TABLES.reuniones, TABLES.kpis].includes(tableId)) {
    return permissionsForArea(areaKeyFromLabel(data.area || data.gerencia), { adminOnlyUpdate: false });
  }

  if ([TABLES.subtareas, TABLES.evidenciasOperativas, TABLES.estrategias, TABLES.planTrabajo, TABLES.acuerdos, TABLES.riesgos, TABLES.beneficios].includes(tableId)) {
    const ownerId = userIdForResponsible(data.responsable);
    return uniquePermissions([
      ...readPermissions([...ADMIN_USER_IDS, ...EXECUTIVE_USER_IDS, ownerId]),
      ...updatePermissions([...ADMIN_USER_IDS, ownerId]),
      ...deletePermissions(ADMIN_USER_IDS),
    ]);
  }

  if (tableId === TABLES.bitacora) {
    return uniquePermissions([
      ...readPermissions(ADMIN_USER_IDS),
      ...updatePermissions(ADMIN_USER_IDS),
      ...deletePermissions(ADMIN_USER_IDS),
    ]);
  }

  return permissionsForArea(areaKeyFromLabel(data.gerencia));
}

function clientWritePermissions() {
  return ['read("users")', 'update("users")', 'delete("users")'];
}

function permissionsForArea(area, options = {}) {
  if (activeUser?.access === "area") {
    return uniquePermissions([
      ...readPermissions([activeUser.userId]),
      ...updatePermissions([activeUser.userId]),
    ]);
  }

  const areaUsers = [USER_IDS_BY_AREA[area], JEFATURA_IDS_BY_AREA[area]].filter(Boolean);
  const updateUsers = options.adminOnlyUpdate ? ADMIN_USER_IDS : [...ADMIN_USER_IDS, ...areaUsers];

  return uniquePermissions([
    ...readPermissions([...ADMIN_USER_IDS, ...EXECUTIVE_USER_IDS, ...areaUsers]),
    ...updatePermissions(updateUsers),
    ...deletePermissions(ADMIN_USER_IDS),
  ]);
}

function readPermissions(ids) {
  return ids.filter(Boolean).map((id) => `read("user:${id}")`);
}

function updatePermissions(ids) {
  return ids.filter(Boolean).map((id) => `update("user:${id}")`);
}

function deletePermissions(ids) {
  return ids.filter(Boolean).map((id) => `delete("user:${id}")`);
}

function uniquePermissions(permissions) {
  return Array.from(new Set(permissions));
}

function userIdForResponsible(name) {
  const normalized = normalizePlainText(name);
  const leadership = jefaturas.find((item) => normalizePlainText(item.name) === normalized);
  if (leadership) return leadership.rowId;
  const user = userProfiles.find((item) => normalizePlainText(item.name) === normalized);
  return user?.userId || "";
}

function transformModules() {
  return {
    projects: { table: TABLES.proyectos, data: () => projects, set: (items) => { projects = items; }, render: renderProjects, prefix: "proy", label: "proyecto", fields: [["name", "Proyecto", "text"], ["objective", "Objetivo", "textarea"], ["area", "Área", "area"], ["owner", "Responsable", "text"], ["start", "Fecha inicio", "date"], ["due", "Fecha compromiso", "date"], ["priority", "Prioridad", "priority"], ["status", "Estado", "executionStatus"], ["kpi", "KPI", "text"], ["expected", "Resultado esperado", "text"]] },
    tasks: { table: TABLES.tareas, data: () => tasks, set: (items) => { tasks = items; }, render: renderTasks, prefix: "task", label: "tarea", fields: [["projectId", "Proyecto", "project"], ["title", "Tarea", "text"], ["description", "Descripción", "textarea"], ["area", "Área", "area"], ["responsible", "Responsable", "text"], ["start", "Fecha inicio", "date"], ["due", "Fecha compromiso", "date"], ["priority", "Prioridad", "priority"], ["status", "Estado", "executionStatus"], ["evidence", "Evidencia", "optionalText"], ["kpi", "KPI", "optionalText"]] },
    subtasks: { table: TABLES.subtareas, data: () => subtasks, set: (items) => { subtasks = items; }, render: renderTasks, prefix: "sub", label: "subtarea", fields: [["taskId", "Tarea principal", "task"], ["title", "Subtarea", "text"], ["responsible", "Responsable", "text"], ["due", "Fecha compromiso", "date"], ["status", "Estado", "executionStatus"]] },
    incidents: { table: TABLES.incidencias, data: () => incidents, set: (items) => { incidents = items; }, render: renderIncidents, prefix: "inc", label: "incidencia", fields: [["folio", "Folio", "text"], ["area", "Área", "area"], ["classification", "Clasificación", "incidentClass"], ["description", "Descripción", "textarea"], ["responsible", "Responsable", "text"], ["openDate", "Fecha apertura", "date"], ["closeDate", "Fecha cierre", "optionalDate"], ["evidence", "Evidencia", "optionalText"], ["impact", "Impacto", "impact"], ["priority", "Prioridad", "priority"], ["status", "Estado", "executionStatus"]] },
    meetings: { table: TABLES.reuniones, data: () => meetings, set: (items) => { meetings = items; }, render: renderMeetings, prefix: "reu", label: "reunión", fields: [["date", "Fecha", "date"], ["type", "Tipo", "meetingType"], ["title", "Reunión", "text"], ["area", "Área", "area"], ["owner", "Responsable", "text"], ["attendees", "Participantes", "textarea"], ["minutes", "Minuta", "textarea"], ["agreement", "Acuerdo generado", "textarea"], ["agreementOwner", "Responsable del acuerdo", "text"], ["commitmentDate", "Fecha compromiso", "date"], ["status", "Estado", "executionStatus"]] },
    kpis: { table: TABLES.kpis, data: () => kpis, set: (items) => { kpis = items; }, render: renderKpis, prefix: "kpi", label: "KPI", fields: [["area", "Área", "area"], ["name", "Indicador", "text"], ["target", "Objetivo", "number"], ["current", "Resultado actual", "number"], ["unit", "Unidad", "text"], ["frequency", "Frecuencia", "frequency"], ["owner", "Responsable", "text"], ["trend", "Tendencia", "trend"], ["status", "Semáforo", "traffic"]] },
    evidenceLibrary: { table: TABLES.evidenciasOperativas, data: () => evidenceLibrary, set: (items) => { evidenceLibrary = items; }, render: renderEvidenceCenter, prefix: "evi", label: "evidencia", fields: [["relationType", "Relacionado con", "relationType"], ["relationId", "Folio / ID relacionado", "text"], ["name", "Nombre del archivo", "text"], ["type", "Tipo", "text"], ["owner", "Responsable", "text"], ["date", "Fecha", "optionalDate"], ["status", "Estado", "evidenceStatus"], ["fileId", "Referencia de almacenamiento", "optionalText"], ["upload", "Adjuntar archivo", "file"]] },
    diagnosticBase: { table: TABLES.diagnosticoBase, data: () => diagnosticBase, set: (items) => { diagnosticBase = items; }, render: renderDiagnosticBase, prefix: "diag", label: "diagnóstico", fields: [["section", "Bloque", "text"], ["area", "Área", "area"], ["detail", "Detalle / observaciones", "textarea"], ["owner", "Responsable", "text"], ["evidence", "Evidencia", "text"], ["status", "Estatus", "status"]] },
    interviews: { table: TABLES.entrevistas, data: () => interviews, set: (items) => { interviews = items; }, render: renderInterviews, prefix: "ent", label: "entrevista", fields: [["date", "Fecha", "date"], ["interviewed", "Entrevistado", "text"], ["area", "Área", "area"], ["position", "Puesto", "text"], ["responsible", "Responsable entrevista", "text"], ["functions", "Funciones actuales", "textarea"], ["responsibilities", "Responsabilidades", "textarea"], ["problems", "Problemas detectados", "textarea"], ["risks", "Riesgos", "textarea"], ["opportunities", "Oportunidades", "textarea"], ["ideas", "Ideas de mejora", "textarea"], ["needs", "Necesidades de información", "textarea"], ["automations", "Automatizaciones sugeridas", "textarea"], ["golden", "Pregunta de oro", "textarea"]] },
    painMap: { table: TABLES.mapaDolor, data: () => painMap, set: (items) => { painMap = items; }, render: renderPainMap, prefix: "dolor", label: "dolor", fields: [["category", "Clasificación", "text"], ["description", "Descripción", "textarea"], ["area", "Área afectada", "area"], ["impact", "Impacto", "text"], ["frequency", "Frecuencia", "text"], ["priority", "Prioridad", "priority"], ["owner", "Responsable", "text"], ["signal", "Semáforo", "traffic"]] },
    executiveFindings: { table: TABLES.diagnosticoEjecutivo, data: () => executiveFindings, set: (items) => { executiveFindings = items; }, render: renderExecutiveDiagnosis, prefix: "hall", label: "hallazgo", fields: [["finding", "Hallazgo", "textarea"], ["rootCause", "Causa raíz", "textarea"], ["risk", "Riesgo", "textarea"], ["impact", "Impacto", "text"], ["area", "Área", "area"], ["priority", "Prioridad", "priority"], ["owner", "Responsable", "text"]] },
    strategies: { table: TABLES.estrategias, data: () => strategies, set: (items) => { strategies = items; }, render: renderStrategy, prefix: "est", label: "estrategia", fields: [["finding", "Hallazgo", "text"], ["objective", "Objetivo", "textarea"], ["expected", "Resultado esperado", "textarea"], ["owner", "Responsable", "text"], ["kpi", "KPI", "text"], ["start", "Fecha inicio", "date"], ["end", "Fecha fin", "date"], ["budget", "Presupuesto", "number"]] },
    workPlan: { table: TABLES.planTrabajo, data: () => workPlan, set: (items) => { workPlan = items; }, render: renderWorkPlan, prefix: "plan", label: "acción", fields: [["action", "Acción", "textarea"], ["owner", "Responsable", "text"], ["start", "Fecha inicio", "date"], ["due", "Fecha compromiso", "date"], ["priority", "Prioridad", "priority"], ["evidence", "Evidencia", "text"], ["status", "Estado", "status"], ["view", "Vista", "text"]] },
    agreements: { table: TABLES.acuerdos, data: () => agreements, set: (items) => { agreements = items; }, render: renderAgreements, prefix: "acu", label: "acuerdo", fields: [["agreement", "Acuerdo", "textarea"], ["date", "Fecha", "date"], ["owner", "Responsable", "text"], ["area", "Área", "area"], ["priority", "Prioridad", "priority"], ["due", "Fecha compromiso", "date"], ["evidence", "Evidencia", "text"], ["status", "Estado", "executionStatus"]] },
    risks: { table: TABLES.riesgos, data: () => riskRegister, set: (items) => { riskRegister = items; }, render: renderRisks, prefix: "risk", label: "riesgo", fields: [["risk", "Riesgo", "textarea"], ["probability", "Probabilidad", "text"], ["impact", "Impacto", "text"], ["mitigation", "Plan de mitigación", "textarea"], ["owner", "Responsable", "text"]] },
    benefits: { table: TABLES.beneficios, data: () => benefits, set: (items) => { benefits = items; }, render: renderBenefits, prefix: "ben", label: "beneficio", fields: [["saving", "Ahorro generado", "number"], ["timeReduction", "Reducción de tiempos", "text"], ["incidentReduction", "Reducción de incidencias", "text"], ["improvements", "Mejoras implementadas", "textarea"], ["financialImpact", "Impacto financiero", "number"]] },
    lessons: { table: TABLES.lecciones, data: () => lessons, set: (items) => { lessons = items; }, render: renderLessons, prefix: "lec", label: "lección", fields: [["date", "Fecha", "date"], ["area", "Área", "area"], ["context", "Contexto", "text"], ["lesson", "Lección aprendida", "textarea"], ["action", "Aplicación futura", "textarea"], ["owner", "Responsable", "text"], ["evidence", "Evidencia", "optionalText"]] },
  };
}

function transformActions(moduleKey, rowId) {
  if (activeUser?.access === "executive") return `<span class="muted-copy table-note">Solo lectura</span>`;
  return `
    <div class="row-actions">
      <button class="secondary-button" type="button" data-action="edit-transform" data-module-key="${moduleKey}" data-target="${rowId}">Editar</button>
      <button class="secondary-button danger-button" type="button" data-action="delete-transform" data-module-key="${moduleKey}" data-target="${rowId}">Eliminar</button>
    </div>
  `;
}

function transformToolbar(moduleKey) {
  const config = transformModules()[moduleKey];
  if (!config || activeUser?.access === "executive") return "";
  return `<div class="export-actions export-actions-top"><button class="primary-button" type="button" data-action="new-transform" data-target="${moduleKey}">Nuevo ${config.label}</button></div>`;
}

async function openTransformForm(moduleKey, rowId = "") {
  const config = transformModules()[moduleKey];
  if (!config || activeUser?.access === "executive") return;
  const current = rowId ? config.data().find((item) => item.rowId === rowId) : null;

  openModal(`
    <form class="modal-form" id="transform-form">
      <div class="modal-header">
        <div><p class="eyebrow">Control de gestión</p><h3>${current ? "Editar registro" : "Nuevo registro"}</h3></div>
        <button class="icon-button" type="button" data-modal-close>×</button>
      </div>
      ${config.fields.map(([key, label, type]) => transformFieldHtml(config.prefix, key, label, type, current ? current[key] : transformDefaultValue(moduleKey, key))).join("")}
      <div class="modal-actions field-wide">
        <button class="secondary-button" type="button" data-modal-close>Cancelar</button>
        <button class="primary-button" type="submit">Guardar</button>
      </div>
    </form>
  `);

  document.querySelector("#transform-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter || document.querySelector("#transform-form .primary-button");
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";
    const nextItem = { ...(current || {}), rowId: current?.rowId || createRowId(config.prefix) };

    config.fields.forEach(([key, , type]) => {
      if (type === "file") return;
      const value = document.querySelector(`#${config.prefix}-${key}`).value.trim();
      nextItem[key] = type === "number" ? Number(value || 0) : value;
    });

    try {
      if (!(await ensureAppwriteWriteReady())) throw appwriteError(0, APPWRITE_PAUSED_MESSAGE);
      if (moduleKey === "evidenceLibrary") {
        const file = document.querySelector(`#${config.prefix}-upload`)?.files?.[0];
        if (file) {
          const evidenceArea = activeUser?.access === "area" ? activeUser.area : evidenceAreaForRelation(nextItem.relationType, nextItem.relationId);
          const uploaded = await uploadEvidenceFile(file, evidenceArea);
          const [fileId, fileName] = uploaded.split("|");
          nextItem.fileId = fileId;
          nextItem.name = fileName || file.name;
          nextItem.type = file.type || file.name.split(".").pop()?.toUpperCase() || "Archivo";
          nextItem.date = todayIsoDate();
          if (nextItem.status === "faltante") nextItem.status = "cargada";
        }
      }
      const data = transformToAppwriteData(moduleKey, nextItem);
      if (current) {
        await updateRow(config.table, current.rowId, data);
        config.set(config.data().map((item) => item.rowId === current.rowId ? nextItem : item));
      } else {
        await createRow(config.table, nextItem.rowId, data);
        config.set([nextItem, ...config.data()]);
      }
      if (moduleKey === "meetings" && !current && nextItem.agreement) {
        const generatedAgreement = {
          rowId: createRowId("acu"),
          agreement: nextItem.agreement,
          date: nextItem.date,
          area: nextItem.area,
          owner: nextItem.agreementOwner || nextItem.owner,
          priority: "alta",
          due: nextItem.commitmentDate,
          evidence: "",
          status: "pendiente",
        };
        await createRow(TABLES.acuerdos, generatedAgreement.rowId, transformToAppwriteData("agreements", generatedAgreement));
        agreements = [generatedAgreement, ...agreements];
      }
      await logAudit(current ? "editar registro" : "crear registro", null, `${moduleKey}: ${recordLabel(nextItem)}.`);
      closeModal();
      notify("Registro guardado correctamente.");
      config.render();
    } catch (error) {
      notify(error.isAppwriteUnavailable ? APPWRITE_PAUSED_MESSAGE : "No se pudo guardar el registro.");
      console.warn(error);
      submitButton.disabled = false;
      submitButton.textContent = "Guardar";
    }
  });
}

function transformDefaultValue(moduleKey, key) {
  if (["date", "openDate", "start"].includes(key)) return todayIsoDate();
  if (["due", "commitmentDate"].includes(key)) return addDaysIso(7);
  if (moduleKey === "incidents" && key === "folio") return `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, "0")}`;
  if (key === "status") return "pendiente";
  if (key === "priority") return "media";
  return "";
}

async function deleteTransformRecord(moduleKey, rowId) {
  const config = transformModules()[moduleKey];
  if (!config || activeUser?.access === "executive") return;
  const item = config.data().find((record) => record.rowId === rowId);
  if (!item) return;
  if (!window.confirm(`Eliminar registro: ${recordLabel(item)}?`)) return;

  try {
    if (!(await ensureAppwriteWriteReady())) throw appwriteError(0, APPWRITE_PAUSED_MESSAGE);
    await deleteRow(config.table, rowId);
    config.set(config.data().filter((record) => record.rowId !== rowId));
    await logAudit("eliminar registro", null, `${moduleKey}: ${recordLabel(item)}.`);
    notify("Registro eliminado correctamente.");
    config.render();
  } catch (error) {
    notify(error.isAppwriteUnavailable ? APPWRITE_PAUSED_MESSAGE : "No se pudo eliminar el registro.");
    console.warn(error);
  }
}

function transformFieldHtml(prefix, key, label, type, value = "") {
  const id = `${prefix}-${key}`;
  if (type === "textarea") return `<label class="field-wide">${label}<textarea id="${id}" required>${escapeHtml(value || "")}</textarea></label>`;
  if (type === "area") {
    const availableAreas = activeUser?.access === "area" ? gerencias.filter((item) => item.area === activeUser.area) : gerencias;
    const allOption = activeUser?.access === "area" ? "" : `<option value="Todas" ${value === "Todas" ? "selected" : ""}>Todas</option>`;
    return `<label>${label}<select id="${id}">${availableAreas.map((item) => `<option value="${item.area}" ${item.area === value ? "selected" : ""}>${item.label}</option>`).join("")}${allOption}</select></label>`;
  }
  if (type === "priority") return `<label>${label}<select id="${id}">${["alta", "media", "baja"].map((item) => `<option value="${item}" ${item === value ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>`;
  if (type === "status") return `<label>${label}<select id="${id}">${["pendiente", "en revision", "falta evidencia", "aprobado", "rechazado", "en ejecucion", "cerrado"].map((item) => `<option value="${item}" ${item === value ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>`;
  if (type === "traffic") return `<label>${label}<select id="${id}">${["verde", "amarillo", "rojo"].map((item) => `<option value="${item}" ${item === value ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>`;
  if (type === "project") return `<label>${label}<select id="${id}">${visibleProjects().map((item) => `<option value="${item.rowId}" ${item.rowId === value ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></label>`;
  if (type === "task") return `<label>${label}<select id="${id}">${visibleTasks().map((item) => `<option value="${item.rowId}" ${item.rowId === value ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select></label>`;
  if (type === "executionStatus") return selectTransformField(id, label, ["pendiente", "en proceso", "con riesgo", "vencido", "cerrado"], value);
  if (type === "incidentClass") return selectTransformField(id, label, ["Operativa", "Comercial", "Logística", "Mantenimiento", "Calidad", "Administrativa"], value);
  if (type === "meetingType") return selectTransformField(id, label, ["Semanal", "Mensual", "Trimestral", "Extraordinaria"], value);
  if (type === "impact") return selectTransformField(id, label, ["Alto", "Medio", "Bajo"], value);
  if (type === "frequency") return selectTransformField(id, label, ["Semanal", "Quincenal", "Mensual", "Trimestral"], value);
  if (type === "trend") return selectTransformField(id, label, ["sube", "estable", "baja"], value);
  if (type === "relationType") return selectTransformField(id, label, ["Proyecto", "Tarea", "Acuerdo", "Incidencia", "Reunión"], value);
  if (type === "evidenceStatus") return selectTransformField(id, label, ["cargada", "validada", "faltante", "rechazada"], value);
  if (type === "optionalDate") return `<label>${label}<input id="${id}" type="date" value="${escapeHtml(value || "")}"></label>`;
  if (type === "optionalText") return `<label>${label}<input id="${id}" type="text" value="${escapeHtml(value || "")}"></label>`;
  if (type === "file") return `<label class="field-wide">${label}<input id="${id}" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.zip,.mp4,.mov"></label>`;
  return `<label>${label}<input id="${id}" type="${type}" value="${escapeHtml(value || "")}" required></label>`;
}

function selectTransformField(id, label, options, value) {
  return `<label>${label}<select id="${id}">${options.map((item) => `<option value="${escapeHtml(item)}" ${normalizePlainText(item) === normalizePlainText(value) ? "selected" : ""}>${escapeHtml(titleCase(item))}</option>`).join("")}</select></label>`;
}

function recordLabel(item) {
  return item.name || item.title || item.folio || item.finding || item.objective || item.action || item.agreement || item.risk || item.description || item.detail || item.interviewed || item.section || item.improvements || "registro";
}

function evidenceAreaForRelation(relationType, relationId) {
  const type = normalizePlainText(relationType);
  if (type === "proyecto") return projects.find((item) => item.rowId === relationId)?.area || "";
  if (type === "tarea") return tasks.find((item) => item.rowId === relationId)?.area || "";
  if (type === "incidencia") return incidents.find((item) => item.rowId === relationId)?.area || "";
  if (type === "reunion") return meetings.find((item) => item.rowId === relationId)?.area || "";
  if (type === "acuerdo") return agreements.find((item) => item.rowId === relationId)?.area || "";
  return "";
}

function mapReportRow(row) {
  return {
    rowId: row.$id,
    id: row.$id,
    date: formatDate(row.fecha),
    area: areaKeyFromLabel(row.gerencia),
    responsible: row.responsable,
    frequency: normalizePlainText(row.frecuencia),
    type: normalizePlainText(row.tipo),
    amount: Number(row.monto || 0),
    priority: normalizePlainText(row.prioridad),
    status: normalizeStatus(row.estatus),
    description: row.descripcion || "",
    evidence: row.evidencia || "",
    comments: row.comentarios || "",
    due: formatDate(row.vencimiento) || formatDate(row.fecha),
  };
}

function mapAuditRow(row) {
  return {
    rowId: row.$id,
    id: row.$id,
    date: formatDateTime(row.fecha),
    user: row.usuario || "",
    role: row.rol || "",
    action: row.accion || "",
    reportId: row.reporteId || "",
    area: row.gerencia || "",
    detail: row.detalle || "",
  };
}

function mapJefaturaRow(row) {
  return {
    rowId: row.$id,
    name: row.nombre || "",
    photo: row.fotografia || "",
    position: row.puesto || "",
    area: areaKeyFromLabel(row.area || row.jefatura),
    leadership: row.jefatura || row.area || "",
    email: row.correo || "",
    phone: row.telefono || "",
    whatsapp: row.whatsapp || row.telefono || "",
    boss: row.jefeDirecto || "",
    user: row.usuario || row.correo || "",
    role: row.rol || "Jefatura",
    status: row.estatus || "Activo",
    monthlyGoal: row.objetivoMensual || "",
    quarterlyGoal: row.objetivoTrimestral || "",
    annualGoal: row.objetivoAnual || "",
    mainKpi: row.kpiPrincipal || "",
    secondaryKpis: row.kpisSecundarios || "",
    budget: Number(row.presupuestoAsignado || 0),
    spent: Number(row.gastoAcumulado || 0),
    carmenComments: row.comentariosCarmen || "",
    directionComments: row.comentariosDireccion || "",
  };
}

function mapTaskRow(row) {
  return {
    rowId: row.$id,
    projectId: row.proyectoId || "",
    title: row.titulo || "",
    description: row.descripcion || "",
    area: areaKeyFromLabel(row.gerencia),
    responsible: row.responsable || "",
    priority: normalizePlainText(row.prioridad),
    status: normalizePlainText(row.estatus),
    start: formatDate(row.fechaInicio),
    due: formatDate(row.vencimiento),
    evidence: row.evidencia || "",
    kpi: row.kpi || "",
    reportId: row.reporteId || "",
  };
}

function mapProjectRow(row) {
  return { rowId: row.$id, name: row.nombre || "", objective: row.objetivo || "", area: areaKeyFromLabel(row.area), owner: row.responsable || "", start: formatDate(row.fechaInicio), due: formatDate(row.fechaCompromiso), priority: normalizePlainText(row.prioridad || "media"), status: normalizePlainText(row.estado || "pendiente"), kpi: row.kpi || "", expected: row.resultadoEsperado || "" };
}

function mapSubtaskRow(row) {
  return { rowId: row.$id, taskId: row.tareaId || "", title: row.titulo || "", responsible: row.responsable || "", due: formatDate(row.fechaCompromiso), status: normalizePlainText(row.estado || "pendiente") };
}

function mapIncidentRow(row) {
  return { rowId: row.$id, folio: row.folio || row.$id, area: areaKeyFromLabel(row.area), classification: row.clasificacion || "Operativa", description: row.descripcion || "", responsible: row.responsable || "", openDate: formatDate(row.fechaApertura), closeDate: formatDate(row.fechaCierre), evidence: row.evidencia || "", impact: row.impacto || "Medio", priority: normalizePlainText(row.prioridad || "media"), status: normalizePlainText(row.estado || "pendiente") };
}

function mapMeetingRow(row) {
  return { rowId: row.$id, date: formatDate(row.fecha), type: row.tipo || "Semanal", title: row.titulo || "", area: areaKeyFromLabel(row.area), owner: row.responsable || "", attendees: row.participantes || "", minutes: row.minuta || "", agreement: row.acuerdo || "", agreementOwner: row.responsableAcuerdo || "", commitmentDate: formatDate(row.fechaCompromiso), status: normalizePlainText(row.estado || "pendiente") };
}

function mapKpiRow(row) {
  return { rowId: row.$id, area: areaKeyFromLabel(row.area), name: row.indicador || "", target: Number(row.objetivo || 0), current: Number(row.resultadoActual || 0), unit: row.unidad || "", frequency: row.frecuencia || "Mensual", owner: row.responsable || "", trend: normalizePlainText(row.tendencia || "estable"), status: normalizePlainText(row.semaforo || "amarillo") };
}

function mapOperationalEvidenceRow(row) {
  return { rowId: row.$id, relationType: row.tipoRelacion || "", relationId: row.relacionId || "", name: row.nombreArchivo || "", type: row.tipoArchivo || "", owner: row.responsable || "", date: formatDate(row.fechaCarga), status: normalizePlainText(row.estado || "cargada"), fileId: row.fileId || "" };
}

function mapDiagnosticBaseRow(row) {
  return { rowId: row.$id, section: row.bloque || "", area: areaKeyFromLabel(row.area), detail: row.detalle || "", owner: row.responsable || "", evidence: row.evidencia || "", status: normalizeStatus(row.estatus || "pendiente") };
}

function mapInterviewRow(row) {
  return { rowId: row.$id, date: formatDate(row.fecha), interviewed: row.entrevistado || "", area: areaKeyFromLabel(row.area), position: row.puesto || "", responsible: row.responsableEntrevista || "", functions: row.funcionesActuales || "", responsibilities: row.responsabilidades || "", problems: row.problemasDetectados || "", risks: row.riesgos || "", opportunities: row.oportunidades || "", ideas: row.ideasMejora || "", needs: row.necesidadesInformacion || "", automations: row.automatizacionesSugeridas || "", golden: row.preguntaOro || "" };
}

function mapPainRow(row) {
  return { rowId: row.$id, category: row.clasificacion || "", description: row.descripcion || "", area: areaKeyFromLabel(row.areaAfectada), impact: row.impacto || "", frequency: row.frecuencia || "", priority: normalizePlainText(row.prioridad || "media"), owner: row.responsable || "", signal: normalizePlainText(row.semaforo || "amarillo") };
}

function mapExecutiveFindingRow(row) {
  return { rowId: row.$id, finding: row.hallazgo || "", rootCause: row.causaRaiz || "", risk: row.riesgo || "", impact: row.impacto || "", area: areaKeyFromLabel(row.area), priority: normalizePlainText(row.prioridad || "media"), owner: row.responsable || "" };
}

function mapStrategyRow(row) {
  return { rowId: row.$id, finding: row.hallazgo || "", objective: row.objetivo || "", expected: row.resultadoEsperado || "", owner: row.responsable || "", kpi: row.kpi || "", start: formatDate(row.fechaInicio), end: formatDate(row.fechaFin), budget: Number(row.presupuesto || 0) };
}

function mapWorkPlanRow(row) {
  return { rowId: row.$id, action: row.accion || "", owner: row.responsable || "", start: formatDate(row.fechaInicio), due: formatDate(row.fechaCompromiso), priority: normalizePlainText(row.prioridad || "media"), evidence: row.evidencia || "", status: normalizeStatus(row.estado || "pendiente"), view: row.vista || "Lista" };
}

function mapAgreementRow(row) {
  return { rowId: row.$id, agreement: row.acuerdo || "", date: formatDate(row.fecha), area: areaKeyFromLabel(row.area), owner: row.responsable || "", priority: normalizePlainText(row.prioridad || "media"), due: formatDate(row.fechaCompromiso), evidence: row.evidencia || "", status: normalizePlainText(row.estado || "pendiente") };
}

function mapRiskRow(row) {
  return { rowId: row.$id, risk: row.riesgo || "", probability: row.probabilidad || "", impact: row.impacto || "", mitigation: row.planMitigacion || "", owner: row.responsable || "" };
}

function mapBenefitRow(row) {
  return { rowId: row.$id, saving: Number(row.ahorroGenerado || 0), timeReduction: row.reduccionTiempos || "", incidentReduction: row.reduccionIncidencias || "", improvements: row.mejorasImplementadas || "", financialImpact: Number(row.impactoFinanciero || 0) };
}

function mapLessonRow(row) {
  return { rowId: row.$id, date: formatDate(row.fecha), area: areaKeyFromLabel(row.area), context: row.contexto || "", lesson: row.leccion || "", action: row.aplicacion || "", owner: row.responsable || "", evidence: row.evidencia || "" };
}

function reportToAppwriteData(report) {
  return {
    fecha: toIsoDate(report.date),
    gerencia: labelForArea(report.area),
    responsable: report.responsible,
    frecuencia: report.frequency,
    tipo: report.type,
    monto: Number(report.amount || 0),
    prioridad: report.priority,
    estatus: report.status,
    descripcion: report.description,
    evidencia: report.evidence,
    comentarios: report.comments,
    vencimiento: toIsoDate(report.due),
  };
}

function transformToAppwriteData(moduleKey, item) {
  const map = {
    projects: { nombre: item.name, objetivo: item.objective, area: labelForArea(item.area), responsable: item.owner, fechaInicio: toIsoDate(item.start), fechaCompromiso: toIsoDate(item.due), prioridad: item.priority, estado: item.status, kpi: item.kpi, resultadoEsperado: item.expected },
    tasks: { proyectoId: item.projectId, titulo: item.title, descripcion: item.description, gerencia: labelForArea(item.area), responsable: item.responsible, fechaInicio: toIsoDate(item.start), vencimiento: toIsoDate(item.due), prioridad: item.priority, estatus: item.status, evidencia: item.evidence, kpi: item.kpi, reporteId: item.reportId || "" },
    subtasks: { tareaId: item.taskId, titulo: item.title, responsable: item.responsible, fechaCompromiso: toIsoDate(item.due), estado: item.status },
    incidents: { folio: item.folio, area: labelForArea(item.area), clasificacion: item.classification, descripcion: item.description, responsable: item.responsible, fechaApertura: toIsoDate(item.openDate), fechaCierre: toIsoDate(item.closeDate), evidencia: item.evidence, impacto: item.impact, prioridad: item.priority, estado: item.status },
    meetings: { fecha: toIsoDate(item.date), tipo: item.type, titulo: item.title, area: labelForArea(item.area), responsable: item.owner, participantes: item.attendees, minuta: item.minutes, acuerdo: item.agreement, responsableAcuerdo: item.agreementOwner, fechaCompromiso: toIsoDate(item.commitmentDate), estado: item.status },
    kpis: { area: labelForArea(item.area), indicador: item.name, objetivo: Number(item.target || 0), resultadoActual: Number(item.current || 0), unidad: item.unit, frecuencia: item.frequency, responsable: item.owner, tendencia: item.trend, semaforo: item.status },
    evidenceLibrary: { tipoRelacion: item.relationType, relacionId: item.relationId, nombreArchivo: item.name, tipoArchivo: item.type, responsable: item.owner, fechaCarga: toIsoDate(item.date), estado: item.status, fileId: item.fileId },
    diagnosticBase: { bloque: item.section, area: labelForArea(item.area), detalle: item.detail, responsable: item.owner, evidencia: item.evidence, estatus: item.status },
    interviews: { fecha: toIsoDate(item.date), entrevistado: item.interviewed, area: labelForArea(item.area), puesto: item.position, responsableEntrevista: item.responsible, funcionesActuales: item.functions, responsabilidades: item.responsibilities, problemasDetectados: item.problems, riesgos: item.risks, oportunidades: item.opportunities, ideasMejora: item.ideas, necesidadesInformacion: item.needs, automatizacionesSugeridas: item.automations, preguntaOro: item.golden },
    painMap: { clasificacion: item.category, descripcion: item.description, areaAfectada: labelForArea(item.area), impacto: item.impact, frecuencia: item.frequency, prioridad: item.priority, responsable: item.owner, semaforo: item.signal },
    executiveFindings: { hallazgo: item.finding, causaRaiz: item.rootCause, riesgo: item.risk, impacto: item.impact, area: labelForArea(item.area), prioridad: item.priority, responsable: item.owner },
    strategies: { hallazgo: item.finding, objetivo: item.objective, resultadoEsperado: item.expected, responsable: item.owner, kpi: item.kpi, fechaInicio: toIsoDate(item.start), fechaFin: toIsoDate(item.end), presupuesto: Number(item.budget || 0) },
    workPlan: { accion: item.action, responsable: item.owner, fechaInicio: toIsoDate(item.start), fechaCompromiso: toIsoDate(item.due), prioridad: item.priority, evidencia: item.evidence, estado: item.status, vista: item.view },
    agreements: { acuerdo: item.agreement, fecha: toIsoDate(item.date), area: labelForArea(item.area), responsable: item.owner, prioridad: item.priority, fechaCompromiso: toIsoDate(item.due), evidencia: item.evidence, estado: item.status },
    risks: { riesgo: item.risk, probabilidad: item.probability, impacto: item.impact, planMitigacion: item.mitigation, responsable: item.owner },
    benefits: { ahorroGenerado: Number(item.saving || 0), reduccionTiempos: item.timeReduction, reduccionIncidencias: item.incidentReduction, mejorasImplementadas: item.improvements, impactoFinanciero: Number(item.financialImpact || 0) },
    lessons: { fecha: toIsoDate(item.date), area: labelForArea(item.area), contexto: item.context, leccion: item.lesson, aplicacion: item.action, responsable: item.owner, evidencia: item.evidence },
  };
  return map[moduleKey];
}

function managementToAppwriteData(item) {
  return {
    gerencia: item.label,
    gerente: item.manager,
    email: item.email,
    pin: item.pin,
    rol: item.role,
    frecuencia: item.frequency,
    estatus: item.status,
    ultimoReporte: toIsoDate(item.lastReport),
    presupuesto: Number(item.budget || 0),
    gastoActual: 0,
  };
}

function leadershipToAppwriteData(item) {
  return {
    nombre: item.name,
    fotografia: item.photo || "",
    puesto: item.position,
    area: labelForArea(item.area),
    jefatura: item.leadership,
    correo: item.email,
    telefono: item.phone,
    whatsapp: item.whatsapp,
    jefeDirecto: item.boss,
    usuario: item.user,
    rol: item.role,
    estatus: item.status,
    objetivoMensual: item.monthlyGoal,
    objetivoTrimestral: item.quarterlyGoal,
    objetivoAnual: item.annualGoal,
    kpiPrincipal: item.mainKpi,
    kpisSecundarios: item.secondaryKpis,
    presupuestoAsignado: Number(item.budget || 0),
    gastoAcumulado: Number(item.spent || 0),
    comentariosCarmen: item.carmenComments || "",
    comentariosDireccion: item.directionComments || "",
  };
}

async function editLeadership(target) {
  if (!hasFullAccess()) return;
  const item = jefaturas.find((entry) => entry.rowId === target);
  if (!item) return;

  const name = window.prompt("Nombre", item.name);
  if (!name) return;
  const position = window.prompt("Puesto", item.position) || item.position;
  const email = window.prompt("Correo", item.email) || item.email;
  const phone = window.prompt("Teléfono", item.phone) || item.phone;
  const budget = Number(window.prompt("Presupuesto asignado", item.budget) || item.budget || 0);
  const nextItem = { ...item, name, position, email, phone, whatsapp: phone, budget };
  const index = jefaturas.findIndex((entry) => entry.rowId === target);

  if (appwriteOnline && TABLES.jefaturas) {
    await updateRow(TABLES.jefaturas, nextItem.rowId, leadershipToAppwriteData(nextItem));
  }

  jefaturas[index] = nextItem;
  await logAudit("editar jefatura", null, `Jefatura actualizada: ${nextItem.name}.`);
  renderLeadershipPanel();
}

async function toggleLeadership(target) {
  if (!hasFullAccess()) return;
  const item = jefaturas.find((entry) => entry.rowId === target);
  if (!item) return;

  const nextStatus = item.status === "Activo" ? "Inactivo" : "Activo";
  const nextItem = { ...item, status: nextStatus };
  const index = jefaturas.findIndex((entry) => entry.rowId === target);

  if (appwriteOnline && TABLES.jefaturas) {
    await updateRow(TABLES.jefaturas, nextItem.rowId, leadershipToAppwriteData(nextItem));
  }

  jefaturas[index] = nextItem;
  await logAudit("estatus jefatura", null, `${nextItem.name}: ${nextStatus}.`);
  renderLeadershipPanel();
}

async function runQuickAction(quickAction, target) {
  if (!hasFullAccess()) return;
  const report = reports.find((item) => String(item.id) === String(target));
  const leadership = jefaturas.find((item) => item.rowId === target);
  const label = report ? `${labelForArea(report.area)} / ${report.responsible}` : leadership ? `${leadership.leadership} / ${leadership.name}` : target;
  const actionLabel = {
    reminder: "Enviar recordatorio",
    evidence: "Solicitar evidencia",
    carmen: "Escalar a Carmen",
    direction: "Escalar a Dirección",
    reassign: "Reasignar responsable",
    date: "Modificar fecha",
    repeat: "Marcar reincidencia",
  }[quickAction] || "Acción rápida";

  await logAudit("acción rápida", report || null, `${actionLabel}: ${label}.`);
  notify(`${actionLabel} registrado en bitácora.`);
}

function areaKeyFromLabel(label) {
  const normalized = normalizePlainText(label);
  const map = {
    produccion: "Produccion",
    calidad: "Calidad",
    compras: "Compras",
    almacen: "Almacen",
    logistica: "Logistica",
    mantenimiento: "Mantenimiento",
    ventas: "Ventas",
    "recursos humanos": "Recursos Humanos",
    contabilidad: "Contabilidad",
    sistemas: "Sistemas",
  };
  return map[normalized] || label;
}

function labelForArea(area) {
  return gerencias.find((item) => item.area === area)?.label || area;
}

function normalizeStatus(value) {
  return normalizePlainText(value).replace("revision", "revision").replace("ejecucion", "ejecucion");
}

function normalizePlainText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString();
  return `${String(value).slice(0, 10)}T12:00:00.000Z`;
}

function createRowId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function setDataStatus(text, state) {
  if (!dataStatus) return;
  dataStatus.textContent = text;
  dataStatus.dataset.state = state;
}

async function createManagement() {
  if (!hasFullAccess()) return;

  const label = window.prompt("Nombre de la nueva gerencia:");
  if (!label) return;

  const email = window.prompt("Email del gerente:", `${normalizePlainText(label).replace(/\s+/g, "")}@menlun.com`);
  if (!email) return;

  const pin = window.prompt("PIN interno administrativo:", String(2500 + gerencias.length));
  if (!pin) return;

  const item = {
    rowId: createRowId("ger"),
    area: areaKeyFromLabel(label),
    label,
    manager: window.prompt("Nombre del gerente:", "Nuevo gerente") || "Nuevo gerente",
    email,
    pin,
    role: `Gerente de ${label}`,
    frequency: "Semanal",
    status: "Activo",
    lastReport: new Date().toISOString().slice(0, 10),
    budget: 0,
  };

  if (!appwriteOnline) {
    notify("No se puede crear gerencia sin conexión al sistema.");
    return;
  }

  await createRow(TABLES.gerencias, item.rowId, managementToAppwriteData(item));
  gerencias.push(item);
  userProfiles = buildUsers();

  notify("Gerencia creada correctamente.");
  renderManagementPanel();
}

async function editManagement(label) {
  if (!hasFullAccess()) return;
  const item = gerencias.find((record) => record.label === label);
  if (!item) return;

  const manager = window.prompt("Nombre del gerente:", item.manager);
  if (!manager) return;

  const frequency = window.prompt("Frecuencia de reporte: Semanal, Quincenal o Mensual", item.frequency);
  if (!frequency) return;

  const budget = Number(window.prompt("Presupuesto asignado:", item.budget) || item.budget);

  if (!appwriteOnline || !item.rowId) {
    notify("No se puede actualizar gerencia sin conexión al sistema.");
    return;
  }

  const nextItem = {
    ...item,
    manager,
    frequency: titleCase(normalizePlainText(frequency)),
    budget: Number.isFinite(budget) ? budget : item.budget,
  };

  await updateRow(TABLES.gerencias, item.rowId, managementToAppwriteData(nextItem));
  Object.assign(item, nextItem);
  userProfiles = buildUsers();

  notify(`${label} actualizada correctamente.`);
  renderManagementPanel();
}

async function disableManagement(label) {
  if (!hasFullAccess()) return;
  const item = gerencias.find((record) => record.label === label);
  if (!item) return;

  if (!appwriteOnline || !item.rowId) {
    notify("No se puede cambiar estatus sin conexión al sistema.");
    return;
  }

  const nextStatus = item.status === "Activo" ? "Inactivo" : "Activo";
  await updateRow(TABLES.gerencias, item.rowId, managementToAppwriteData({ ...item, status: nextStatus }));
  item.status = nextStatus;
  userProfiles = buildUsers();

  notify(`${label} cambió a ${item.status}.`);
  renderManagementPanel();
}

async function openUserForm(target = "") {
  if (!hasFullAccess()) return;
  const user = target ? userProfiles.find((item) => item.email === target || item.rowId === target) : null;
  const title = user ? "Editar usuario" : "Nuevo usuario";
  const areaOptions = [
    ["", "Sin gerencia"],
    ["Todas", "Todas"],
    ["Dirección", "Dirección"],
    ...gerencias.map((item) => [item.label, item.label]),
  ];
  const roleValue = user?.role || "Jefatura";
  const areaValue = user?.access === "all" ? "Todas" : user?.access === "executive" ? "Dirección" : labelForArea(user?.area || "");

  openModal(`
    <form class="modal-form" id="user-form">
      <div class="modal-header">
        <div><p class="eyebrow">Usuarios</p><h3>${title}</h3></div>
        <button class="icon-button" type="button" data-modal-close>×</button>
      </div>
      <label>Nombre completo<input id="user-name" type="text" value="${escapeHtml(user?.name || "")}" required></label>
      <label>Correo electrónico<input id="user-email" type="email" value="${escapeHtml(user?.email || "")}" ${user ? "readonly" : ""} required></label>
      <label>Teléfono<input id="user-phone" type="tel" value="${escapeHtml(user?.phone || "")}"></label>
      <label>WhatsApp<input id="user-whatsapp" type="tel" value="${escapeHtml(user?.whatsapp || "")}"></label>
      <label>Rol
        <select id="user-role">
          ${["Administrador General", "Acceso Total Operativo", "Vista Ejecutiva", "Gerente de Producción", "Gerente de Calidad", "Gerente de Compras", "Gerente de Almacén", "Gerente de Logística", "Gerente de Mantenimiento", "Gerente Comercial", "Gerente de Recursos Humanos", "Gerente de Contabilidad", "Gerente de Sistemas", "Jefatura"].map((role) => `<option ${role === roleValue ? "selected" : ""}>${role}</option>`).join("")}
        </select>
      </label>
      <label>Gerencia
        <select id="user-area">
          ${areaOptions.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === areaValue ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>
      <label>Clave / PIN de acceso<input id="user-pin" type="text" value="${escapeHtml(user?.pin || "")}" placeholder="Clave interna o PIN"></label>
      <label>Estatus
        <select id="user-status">
          ${["Activo", "Inactivo"].map((status) => `<option ${status === (user?.status || "Activo") ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </label>
      <p class="muted-copy field-wide">La clave/PIN se administra en el directorio operativo. Para cambiar la contraseña real de Appwrite Auth, ejecuta el script de sincronización backend.</p>
      <div class="modal-actions field-wide">
        <button class="secondary-button" type="button" data-modal-close>Cancelar</button>
        <button class="primary-button" type="submit">${user ? "Guardar cambios" : "Crear usuario"}</button>
      </div>
    </form>
  `);

  document.querySelector("#user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter;
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    const nextUser = buildUserFromForm(user);

    try {
      if (user?.rowId) {
        await updateRow(TABLES.usuarios, user.rowId, userToAppwriteData(nextUser));
        Object.assign(user, nextUser);
      } else {
        const rowId = createRowId("usr");
        nextUser.rowId = rowId;
        await createRow(TABLES.usuarios, rowId, userToAppwriteData(nextUser));
        userProfiles.push(nextUser);
      }

      populateLoginUsers();
      await logAudit(user ? "editar usuario" : "crear usuario", null, `${nextUser.name} / ${nextUser.email}.`);
      closeModal();
      notify(user ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
      renderAdminPanel();
    } catch (error) {
      notify("No se pudo guardar el usuario.");
      console.warn(error);
      submitButton.disabled = false;
      submitButton.textContent = user ? "Guardar cambios" : "Crear usuario";
    }
  });
}

function buildUserFromForm(previous = null) {
  const role = document.querySelector("#user-role").value;
  const gerencia = document.querySelector("#user-area").value;
  let access = "area";
  let area = areaKeyFromLabel(gerencia);

  if (role.includes("Administrador") || role.includes("Acceso Total") || gerencia === "Todas") {
    access = "all";
    area = "";
  }

  if (role.includes("Vista Ejecutiva") || gerencia === "Dirección") {
    access = "executive";
    area = "";
  }

  return {
    ...(previous || {}),
    name: document.querySelector("#user-name").value.trim(),
    email: document.querySelector("#user-email").value.trim().toLowerCase(),
    role,
    access,
    area,
    status: document.querySelector("#user-status").value,
    phone: document.querySelector("#user-phone").value.trim(),
    whatsapp: document.querySelector("#user-whatsapp").value.trim(),
    pin: document.querySelector("#user-pin").value.trim(),
    userId: USER_IDS_BY_EMAIL[document.querySelector("#user-email").value.trim().toLowerCase()] || previous?.userId || createRowId("auth"),
  };
}

async function toggleUserStatus(target) {
  if (!hasFullAccess()) return;
  const user = userProfiles.find((item) => item.email === target || item.rowId === target);
  if (!user?.rowId) {
    notify("Este usuario base se administra desde gerencias o configuración inicial.");
    return;
  }

  const nextUser = { ...user, status: user.status === "Activo" ? "Inactivo" : "Activo" };
  await updateRow(TABLES.usuarios, user.rowId, userToAppwriteData(nextUser));
  Object.assign(user, nextUser);
  populateLoginUsers();
  await logAudit("estatus usuario", null, `${user.name}: ${user.status}.`);
  notify(`Usuario ${user.status.toLowerCase()}.`);
  renderAdminPanel();
}

async function deleteUserProfile(target) {
  if (!hasFullAccess()) return;
  const user = userProfiles.find((item) => item.email === target || item.rowId === target);
  if (!user?.rowId) {
    notify("Este usuario base no puede eliminarse desde la interfaz.");
    return;
  }

  const confirmed = window.confirm(`Eliminar usuario ${user.name}?`);
  if (!confirmed) return;

  await deleteRow(TABLES.usuarios, user.rowId);
  userProfiles = userProfiles.filter((item) => item !== user);
  populateLoginUsers();
  await logAudit("eliminar usuario", null, `${user.name} / ${user.email}.`);
  notify("Usuario eliminado correctamente.");
  renderAdminPanel();
}

async function editReport(target) {
  const report = reports.find((item) => String(item.id) === String(target));
  if (!report) return;

  if (activeUser.access === "executive") return;
  if (activeUser.access === "area" && activeUser.area !== report.area) return;

  openReportEditModal(report);
}

async function changeReportStatus(target, status) {
  const report = reports.find((item) => String(item.id) === String(target));
  if (!report) return;

  if (activeUser.access === "executive") return;
  if (activeUser.access === "area" && activeUser.area !== report.area) return;

  openStatusModal(report, status);
}

async function logAudit(action, report, detail) {
  if (!appwriteOnline || !activeUser) return;

  const logEntry = {
    id: createRowId("log"),
    date: formatDateTime(new Date().toISOString()),
    user: activeUser.name,
    role: activeUser.role,
    action,
    reportId: String(report?.id || ""),
    area: report ? labelForArea(report.area) : "",
    detail: detail || "",
  };

  try {
    await createRow(TABLES.bitacora, logEntry.id, {
      fecha: new Date().toISOString(),
      usuario: logEntry.user,
      rol: logEntry.role,
      accion: logEntry.action,
      reporteId: logEntry.reportId,
      gerencia: logEntry.area,
      detalle: logEntry.detail,
    });
    auditLogs.unshift(logEntry);
  } catch (error) {
    console.warn("No se pudo registrar bitácora.", error);
  }
}

async function registerDailyHeartbeat() {
  if (!appwriteOnline || !activeUser) return;

  const today = new Date().toISOString().slice(0, 10);
  const alreadyLogged = auditLogs.some((item) => (
    item.action === "actividad diaria"
    && item.user === activeUser.name
    && String(item.date).includes(formatDate(today))
  ));

  if (alreadyLogged) return;

  await logAudit(
    "actividad diaria",
    null,
    `Validación automática de sesión activa para ${activeUser.name}.`
  );
}

function openReportEditModal(report) {
  openModal(`
    <form class="modal-form" id="report-edit-form">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Editar reporte</p>
          <h3>${labelForArea(report.area)} - ${report.type}</h3>
        </div>
        <button class="icon-button" type="button" data-modal-close>×</button>
      </div>
      <label>Monto<input id="edit-amount" type="number" min="0" value="${report.amount}"></label>
      <label>Prioridad<select id="edit-priority">${["alta", "media", "baja"].map((item) => `<option ${item === report.priority ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <label>Estatus<select id="edit-status">${["pendiente", "en revision", "falta evidencia", "aprobado", "rechazado", "en ejecucion", "cerrado"].map((item) => `<option ${item === report.status ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <label class="field-wide">Descripción<textarea id="edit-description">${escapeHtml(report.description)}</textarea></label>
      <label class="field-wide">Comentarios<textarea id="edit-comments">${escapeHtml(report.comments || "")}</textarea></label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-modal-close>Cancelar</button>
        <button class="primary-button" type="submit">Guardar cambios</button>
      </div>
    </form>
  `);

  document.querySelector("#report-edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter || document.querySelector("#report-edit-form .primary-button");
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    try {
      if (!appwriteOnline || !report.rowId) {
        throw appwriteError(0, APPWRITE_PAUSED_MESSAGE);
      }

      const nextReport = {
        ...report,
        amount: Number(document.querySelector("#edit-amount").value || 0),
        priority: normalizePlainText(document.querySelector("#edit-priority").value),
        status: normalizeStatus(document.querySelector("#edit-status").value),
        description: document.querySelector("#edit-description").value,
        comments: document.querySelector("#edit-comments").value,
      };

      await updateRow(TABLES.reportes, report.rowId, reportToAppwriteData(nextReport));
      Object.assign(report, nextReport);
      await logAudit("editar reporte", report, `Edición de reporte por ${activeUser.name}.`);
      closeModal();
      notify(`Reporte ${report.id} editado correctamente.`);
      refreshCurrentView();
    } catch (error) {
      notify(error.isAppwriteUnavailable ? APPWRITE_PAUSED_MESSAGE : "No se pudo guardar el reporte.");
      console.warn(error);
      submitButton.disabled = false;
      submitButton.textContent = "Guardar cambios";
    }
  });
}

function openStatusModal(report, status) {
  openModal(`
    <form class="modal-form modal-form-compact" id="status-form">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Cambiar estatus</p>
          <h3>${titleCase(status)}</h3>
        </div>
        <button class="icon-button" type="button" data-modal-close>×</button>
      </div>
      <p class="muted-copy">Reporte ${report.id} de ${labelForArea(report.area)}.</p>
      <label>Comentario<textarea id="status-comment" required>Actualizado por ${activeUser.name}</textarea></label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-modal-close>Cancelar</button>
        <button class="primary-button" type="submit">Confirmar</button>
      </div>
    </form>
  `);

  document.querySelector("#status-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter || document.querySelector("#status-form .primary-button");
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";
    const comment = document.querySelector("#status-comment").value.trim();

    try {
      if (!appwriteOnline || !report.rowId) {
        throw appwriteError(0, APPWRITE_PAUSED_MESSAGE);
      }

      const nextReport = {
        ...report,
        status,
        comments: `${report.comments || ""} ${titleCase(status)}: ${comment}`.trim(),
      };

      await updateRow(TABLES.reportes, report.rowId, reportToAppwriteData(nextReport));
      Object.assign(report, nextReport);
      await logAudit(`estatus: ${status}`, report, comment || `Cambio de estatus a ${status}.`);
      closeModal();
      notify(`Reporte ${report.id} actualizado a ${titleCase(status)}.`);
      refreshCurrentView();
    } catch (error) {
      notify("No se pudo actualizar el estatus.");
      console.warn(error);
      submitButton.disabled = false;
      submitButton.textContent = "Confirmar";
    }
  });
}

function openModal(content) {
  closeModal();
  const modal = document.createElement("div");
  modal.id = "app-modal";
  modal.className = "app-modal";
  modal.innerHTML = `<div class="modal-backdrop" data-modal-close></div><div class="modal-card">${content}</div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) closeModal();
  });
}

function closeModal() {
  document.querySelector("#app-modal")?.remove();
}

function refreshCurrentView() {
  const current = document.querySelector(".module-nav button.active");
  if (current) navigate(current.dataset.view, current.dataset.module, current.dataset.area, current.dataset.areaKey);
}

function applyVisibilityRules() {
  adminOnlyItems.forEach((item) => {
    item.hidden = !hasFullAccess();
  });

  navButtons.forEach((button) => {
    button.hidden = false;
    if (button.hasAttribute("data-admin-only") && !hasFullAccess()) button.hidden = true;
    if (button.dataset.view === "carmen") button.hidden = !hasFullAccess();
    if (button.dataset.view === "direction-dashboard") button.hidden = activeUser.access === "area";
    if (button.dataset.view === "capture") {
      button.hidden = false;
      button.textContent = activeUser.access === "executive" ? "Reportes" : "Captura de reportes";
      button.dataset.module = activeUser.access === "executive" ? "Reportes" : "Captura de reportes";
      button.dataset.area = activeUser.access === "executive" ? "Consulta ejecutiva" : "Reportes";
    }
    if (button.dataset.view === "kanban") button.hidden = activeUser.access === "executive";
    if (button.dataset.view === "executive" && activeUser.access === "area") button.hidden = true;
    if (button.dataset.view === "area" && activeUser.access === "executive") button.hidden = true;
    if (button.dataset.view === "area" && activeUser.access === "area") {
      button.hidden = button.dataset.areaKey !== activeUser.area;
    }
    if (["diagnostic-base", "interviews", "pain-map", "executive-diagnosis", "strategy", "work-plan", "follow-up", "agreements", "risks", "benefits"].includes(button.dataset.view) && activeUser.access === "area") {
      button.hidden = false;
    }
  });
}

function navigateInitialView() {
  let target = document.querySelector('[data-view="direction-dashboard"]');

  if (activeUser.access === "area") {
    target = document.querySelector('[data-view="tasks"]');
  }

  if (activeUser.access === "executive") {
    target = document.querySelector('[data-view="direction-dashboard"]');
  }

  navButtons.forEach((item) => item.classList.remove("active"));
  target.classList.add("active");
  navigate(target.dataset.view, target.dataset.module, target.dataset.area, target.dataset.areaKey);
}

function navigate(view, title, area, areaKey) {
  moduleTitle.textContent = title;
  moduleArea.textContent = area;

  if (view === "diagnostic-base") renderDiagnosticBase();
  if (view === "projects") renderProjects();
  if (view === "tasks") renderTasks();
  if (view === "alerts") renderAlerts();
  if (view === "incidents") renderIncidents();
  if (view === "meetings") renderMeetings();
  if (view === "evidence-center") renderEvidenceCenter();
  if (view === "gantt") renderGantt();
  if (view === "kpis") renderKpis();
  if (view === "interviews") renderInterviews();
  if (view === "pain-map") renderPainMap();
  if (view === "executive-diagnosis") renderExecutiveDiagnosis();
  if (view === "strategy") renderStrategy();
  if (view === "work-plan") renderWorkPlan();
  if (view === "follow-up") renderFollowUp();
  if (view === "agreements") renderAgreements();
  if (view === "risks") renderRisks();
  if (view === "benefits") renderBenefits();
  if (view === "lessons") renderLessons();
  if (view === "direction-dashboard") renderDirectionDashboard();
  if (view === "executive") renderExecutiveDashboard();
  if (view === "carmen") renderCarmenPanel();
  if (view === "capture") renderCaptureForm(areaKey);
  if (view === "kanban") renderKanban();
  if (view === "calendar") renderCalendar();
  if (view === "timeline") renderTimeline();
  if (view === "pipeline") renderPipeline();
  if (view === "central") renderCentralBoard();
  if (view === "admin") renderAdminPanel();
  if (view === "leadership") renderLeadershipPanel();
  if (view === "management") renderManagementPanel();
  if (view === "audit") renderAuditPanel();
  if (view === "area") renderAreaModule(areaKey);
}

function hasFullAccess() {
  return activeUser && activeUser.access === "all";
}

function visibleReports() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return reports;
  return reports.filter((report) => report.area === activeUser.area);
}

function visibleLeadership() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return jefaturas;
  return jefaturas.filter((item) => item.area === activeUser.area);
}

function visibleTasks() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return tasks;
  return tasks.filter((task) => task.area === activeUser.area);
}

function visibleProjects() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return projects;
  return projects.filter((project) => project.area === activeUser.area);
}

function visibleSubtasks() {
  const taskIds = new Set(visibleTasks().map((task) => task.rowId));
  return subtasks.filter((subtask) => taskIds.has(subtask.taskId));
}

function visibleIncidents() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return incidents;
  return incidents.filter((incident) => incident.area === activeUser.area);
}

function visibleMeetings() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return meetings;
  return meetings.filter((meeting) => meeting.area === activeUser.area);
}

function visibleKpis() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return kpis;
  return kpis.filter((kpi) => kpi.area === activeUser.area);
}

function visibleEvidenceLibrary() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return evidenceLibrary;
  const visibleIds = new Set([
    ...visibleProjects().map((item) => item.rowId),
    ...visibleTasks().map((item) => item.rowId),
    ...visibleIncidents().map((item) => item.rowId),
    ...visibleMeetings().map((item) => item.rowId),
  ]);
  return evidenceLibrary.filter((item) => visibleIds.has(item.relationId) || item.owner === activeUser.name);
}

function visibleWorkPlan() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return workPlan;
  const leadership = jefaturas.find((item) => item.area === activeUser.area);
  return workPlan.filter((item) => item.owner === activeUser.name || item.owner === leadership?.name);
}

function visibleAgreements() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return agreements;
  const leadership = jefaturas.find((item) => item.area === activeUser.area);
  return agreements.filter((item) => item.owner === activeUser.name || item.owner === leadership?.name);
}

function visibleRisks() {
  if (!activeUser || activeUser.access === "all" || activeUser.access === "executive") return riskRegister;
  const leadership = jefaturas.find((item) => item.area === activeUser.area);
  return riskRegister.filter((item) => item.owner === activeUser.name || item.owner === leadership?.name);
}

function areaReports(area) {
  return visibleReports().filter((report) => report.area === area);
}

function filterReports(items, filters = {}) {
  return items.filter((item) => {
    if (filters.area && item.area !== filters.area) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.dateFrom && item.date < filters.dateFrom) return false;
    if (filters.dateTo && item.date > filters.dateTo) return false;
    return true;
  });
}

function readReportFilters(prefix) {
  return {
    area: document.querySelector(`#${prefix}-area`)?.value || "",
    status: document.querySelector(`#${prefix}-status`)?.value || "",
    priority: document.querySelector(`#${prefix}-priority`)?.value || "",
    type: document.querySelector(`#${prefix}-type`)?.value || "",
    dateFrom: document.querySelector(`#${prefix}-date-from`)?.value || "",
    dateTo: document.querySelector(`#${prefix}-date-to`)?.value || "",
  };
}

function renderReportFilters(prefix, filters = {}, options = {}) {
  const areaOptions = options.lockArea
    ? gerencias.filter((item) => item.area === options.lockArea)
    : gerencias.filter((item) => activeUser.access !== "area" || item.area === activeUser.area);
  const statuses = ["pendiente", "en revision", "falta evidencia", "aprobado", "rechazado", "en ejecucion", "cerrado"];
  const priorities = ["alta", "media", "baja"];
  const types = ["gasto", "incidencia", "solicitud", "ahorro", "mejora", "reporte operativo"];

  return `
    <form class="filter-panel report-filter-panel" id="${prefix}-filter-form">
      <label>Gerencia<select id="${prefix}-area" ${options.lockArea ? "disabled" : ""}><option value="">Todas</option>${areaOptions.map((item) => `<option value="${item.area}" ${(filters.area || options.lockArea) === item.area ? "selected" : ""}>${item.label}</option>`).join("")}</select></label>
      <label>Estatus<select id="${prefix}-status"><option value="">Todos</option>${statuses.map((item) => `<option value="${item}" ${filters.status === item ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>
      <label>Prioridad<select id="${prefix}-priority"><option value="">Todas</option>${priorities.map((item) => `<option value="${item}" ${filters.priority === item ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>
      <label>Tipo<select id="${prefix}-type"><option value="">Todos</option>${types.map((item) => `<option value="${item}" ${filters.type === item ? "selected" : ""}>${titleCase(item)}</option>`).join("")}</select></label>
      <label>Desde<input id="${prefix}-date-from" type="date" value="${filters.dateFrom || ""}"></label>
      <label>Hasta<input id="${prefix}-date-to" type="date" value="${filters.dateTo || ""}"></label>
      <div class="filter-actions">
        <button class="secondary-button" type="button" id="${prefix}-clear">Limpiar</button>
        <button class="primary-button" type="submit">Filtrar</button>
      </div>
    </form>
  `;
}

function bindReportFilters(prefix, renderFn, lockArea) {
  document.querySelector(`#${prefix}-filter-form`)?.addEventListener("submit", (event) => {
    event.preventDefault();
    const filters = readReportFilters(prefix);
    if (lockArea) filters.area = lockArea;
    renderFn(filters);
  });

  document.querySelector(`#${prefix}-clear`)?.addEventListener("click", () => {
    renderFn(lockArea ? { area: lockArea } : {});
  });
}

function serializeFilters(filters = {}) {
  return encodeURIComponent(JSON.stringify(filters));
}

function parseFilters(value) {
  try {
    return JSON.parse(decodeURIComponent(value || "%7B%7D"));
  } catch (error) {
    return {};
  }
}

function exportActions(kind, filters = {}, area = "") {
  const encoded = serializeFilters(filters);
  const areaAttr = area ? ` data-area="${escapeHtml(area)}"` : "";
  return `
    <div class="export-actions">
      <button class="secondary-button" type="button" data-action="export-${kind}" data-filters="${encoded}"${areaAttr}>Exportar Excel</button>
      <button class="secondary-button" type="button" data-action="print-${kind}" data-filters="${encoded}"${areaAttr}>PDF / Imprimir</button>
    </div>
  `;
}

function exportReportsFromButton(button) {
  const filters = parseFilters(button.dataset.filters);
  const area = button.dataset.area || "";
  if (area) filters.area = area;
  const items = filterReports(area ? areaReports(area) : visibleReports(), filters);
  exportCsv(`menlun-reportes-${dateStamp()}.csv`, [
    ["Fecha", "Gerencia", "Responsable", "Tipo", "Monto", "Prioridad", "Estatus", "Evidencia", "Descripción"],
    ...reportExportRows(items),
  ]);
}

function printReportsFromButton(button) {
  const filters = parseFilters(button.dataset.filters);
  const area = button.dataset.area || "";
  if (area) filters.area = area;
  const items = filterReports(area ? areaReports(area) : visibleReports(), filters);
  const title = area ? `Reportes - ${labelForArea(area)}` : "Reportes";
  printTable(title, ["Fecha", "Gerencia", "Responsable", "Tipo", "Monto", "Prioridad", "Estatus", "Evidencia", "Descripción"], reportExportRows(items));
}

function exportAuditFromButton(button) {
  const filters = parseFilters(button.dataset.filters);
  const items = filterAuditLogs(filters);
  exportCsv(`menlun-bitacora-${dateStamp()}.csv`, [
    ["Fecha", "Usuario", "Rol", "Acción", "Gerencia", "Reporte", "Detalle"],
    ...auditExportRows(items),
  ]);
}

function printAuditFromButton(button) {
  const filters = parseFilters(button.dataset.filters);
  const items = filterAuditLogs(filters);
  printTable("Bitácora de cambios", ["Fecha", "Usuario", "Rol", "Acción", "Gerencia", "Reporte", "Detalle"], auditExportRows(items));
}

function printExecutiveDashboard() {
  const items = visibleReports();
  const rows = gerencias.map((item) => {
    const areaRows = reports.filter((report) => report.area === item.area);
    const spent = sum(areaRows.filter((report) => report.type === "gasto"), "amount");
    const closed = areaRows.filter((report) => ["aprobado", "cerrado"].includes(report.status)).length;
    const compliance = areaRows.length ? Math.round((closed / areaRows.length) * 100) : 0;
    return [item.label, formatCurrency(spent), areaRows.length, `${compliance}%`, compliance >= 70 ? "Activo" : "Pendiente"];
  });

  const summary = [
    ["Presupuesto usado", `${Math.round((sum(items.filter((item) => item.type === "gasto"), "amount") / gerencias.reduce((total, item) => total + item.budget, 0)) * 100)}%`],
    ["Gastos por gerencia", formatCurrency(sum(items.filter((item) => item.type === "gasto"), "amount"))],
    ["Ahorro generado", formatCurrency(sum(items.filter((item) => item.type === "ahorro"), "amount"))],
    ["Incidencias abiertas", items.filter((item) => item.type === "incidencia" && !["cerrado", "rechazado"].includes(item.status)).length],
    ["Reportes vencidos", items.filter((item) => item.status === "pendiente" && item.due < todayIsoDate()).length],
    ["Solicitudes pendientes", items.filter((item) => item.type === "solicitud" && ["pendiente", "en revision"].includes(item.status)).length],
  ];

  printTable("Dashboard ejecutivo", ["Indicador", "Valor"], summary, {
    secondaryTitle: "Cumplimiento por gerencia",
    secondaryHeaders: ["Gerencia", "Presupuesto usado", "Reportes", "Cumplimiento", "Estatus"],
    secondaryRows: rows,
  });
}

function reportExportRows(items) {
  return items.map((item) => [
    item.date,
    labelForArea(item.area),
    item.responsible,
    item.type,
    Number(item.amount || 0),
    item.priority,
    item.status,
    evidenceLabel(item.evidence),
    item.description,
  ]);
}

function auditExportRows(items) {
  return items.map((item) => [item.date, item.user, item.role, item.action, item.area || "N/A", item.reportId || "N/A", item.detail || "Sin detalle"]);
}

function exportCsv(filename, rows) {
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  notify("Archivo exportado correctamente.");
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function printTable(title, headers, rows, options = {}) {
  const printWindow = window.open("", "_blank", "width=1100,height=800");
  if (!printWindow) {
    notify("Permite ventanas emergentes para generar PDF.");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(title)}</title>
        <style>
          body { margin: 28px; font-family: Arial, Helvetica, sans-serif; color: #0B2A4A; }
          h1 { margin: 0 0 6px; font-size: 24px; }
          h2 { margin: 28px 0 10px; font-size: 18px; }
          p { margin: 0 0 18px; color: #5F6D7C; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border-bottom: 1px solid #DDE5EC; padding: 8px; text-align: left; vertical-align: top; }
          th { color: #0B2A4A; text-transform: uppercase; font-size: 10px; }
          @media print { body { margin: 14mm; } button { display: none; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p>MENLUN Control 360 - ${new Date().toLocaleString("es-MX")}</p>
        ${htmlTable(headers, rows)}
        ${options.secondaryRows ? `<h2>${escapeHtml(options.secondaryTitle)}</h2>${htmlTable(options.secondaryHeaders, options.secondaryRows)}` : ""}
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function htmlTable(headers, rows) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function evidenceLabel(value) {
  if (!value) return "Faltante";
  const [, fileName] = String(value).split("|");
  return fileName || value;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function visibleByArea(items, areaKey = "area") {
  if (!activeUser || activeUser.access !== "area") return items;
  return items.filter((item) => item[areaKey] === activeUser.area || item[areaKey] === labelForArea(activeUser.area));
}

function renderProjects() {
  const items = visibleProjects();
  const taskItems = visibleTasks();
  appContent.innerHTML = `
    ${sectionHeading("Proyectos", "De la estrategia al resultado medible", scopeText())}
    ${transformToolbar("projects")}
    <section class="executive-grid">
      ${metricCard("Proyectos activos", items.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("En riesgo", items.filter((item) => executionSignal(item) === "rojo").length)}
      ${metricCard("Tareas abiertas", taskItems.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("Avance promedio", `${average(items.map(projectProgress))}%`)}
    </section>
    <section class="project-grid">
      ${items.map((project) => {
        const related = taskItems.filter((task) => task.projectId === project.rowId);
        const progress = projectProgress(project);
        return `<article class="project-card">
          <div class="project-card-head"><div><p class="eyebrow">${escapeHtml(labelForArea(project.area))}</p><h3>${escapeHtml(project.name)}</h3></div>${trafficBadge(executionSignal(project), executionSignalLabel(project))}</div>
          <p>${escapeHtml(project.objective)}</p>
          <div class="progress-track"><span style="width:${progress}%"></span></div>
          <div class="project-meta"><strong>${progress}%</strong><span>${related.filter((task) => task.status === "cerrado").length}/${related.length} tareas</span><span>${escapeHtml(project.owner)}</span></div>
          <div class="project-actions">${transformActions("projects", project.rowId)}<button class="secondary-button" type="button" data-action="open-project" data-target="${project.rowId}">Ver ejecución</button></div>
        </article>`;
      }).join("") || emptyState("No existen proyectos en este alcance.")}
    </section>
    <section class="content-card">
      ${renderTable(["Proyecto", "Área", "Responsable", "Inicio", "Compromiso", "Prioridad", "KPI", "Avance", "Estatus", "Acción"], items.map((item) => [
        item.name, labelForArea(item.area), item.owner, item.start, item.due, priorityBadge(item.priority), item.kpi, `${projectProgress(item)}%`, statusBadge(item.status), transformActions("projects", item.rowId),
      ]))}
    </section>`;
}

function renderTasks(projectId = "") {
  const items = visibleTasks().filter((task) => !projectId || task.projectId === projectId);
  const childItems = visibleSubtasks();
  const project = projects.find((item) => item.rowId === projectId);
  appContent.innerHTML = `
    ${sectionHeading(project ? project.name : "Tareas y subtareas", project ? "Ejecución detallada del proyecto" : "Responsable, compromiso, evidencia, KPI y cierre", scopeText())}
    <div class="export-actions export-actions-top">${project ? `<button class="secondary-button" type="button" data-action="back-projects">Volver a proyectos</button>` : ""}${transformToolbar("tasks")}${transformToolbar("subtasks")}</div>
    <section class="executive-grid">
      ${metricCard("Tareas", items.length)}
      ${metricCard("Vencidas", items.filter((item) => executionSignal(item) === "rojo" && item.status !== "cerrado").length)}
      ${metricCard("Sin evidencia", items.filter((item) => !item.evidence).length)}
      ${metricCard("Subtareas", childItems.filter((item) => items.some((task) => task.rowId === item.taskId)).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Proyecto", "Tarea", "Responsable", "Área", "Compromiso", "Prioridad", "Evidencia", "KPI", "Subtareas", "Semáforo", "Estado", "Acción"], items.map((item) => [
        projectName(item.projectId), item.title, item.responsible, labelForArea(item.area), item.due, priorityBadge(item.priority), evidenceCell(item.evidence), item.kpi, childItems.filter((subtask) => subtask.taskId === item.rowId).length, trafficBadge(executionSignal(item), executionSignalLabel(item)), statusBadge(item.status), transformActions("tasks", item.rowId),
      ]), "wide-table")}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Desglose</p><h3>Subtareas</h3></div></div>
      ${renderTable(["Tarea principal", "Subtarea", "Responsable", "Compromiso", "Estado", "Acción"], childItems.filter((item) => items.some((task) => task.rowId === item.taskId)).map((item) => [
        taskName(item.taskId), item.title, item.responsible, item.due, statusBadge(item.status), transformActions("subtasks", item.rowId),
      ]))}
    </section>`;
}

function renderAlerts() {
  const items = operationalAlerts();
  appContent.innerHTML = `
    ${sectionHeading("Centro de alertas", "Excepciones que requieren decisión o seguimiento", scopeText())}
    <section class="executive-grid">
      ${metricCard("Alertas activas", items.length)}
      ${metricCard("Críticas", items.filter((item) => item.signal === "rojo").length)}
      ${metricCard("Vencimientos", items.filter((item) => item.type.includes("vencid")).length)}
      ${metricCard("Sin evidencia", items.filter((item) => item.type === "Evidencia faltante").length)}
    </section>
    <section class="content-card">
      ${renderTable(["Tipo", "Área", "Responsable", "Detalle", "Fecha", "Semáforo"], items.map((item) => [item.type, labelForArea(item.area), item.owner, item.detail, item.date || "N/A", trafficBadge(item.signal, titleCase(item.signal))]))}
    </section>`;
}

function renderIncidents() {
  const items = visibleIncidents();
  appContent.innerHTML = `
    ${sectionHeading("Incidencias", "Registro, impacto, responsable, evidencia y cierre", scopeText())}
    ${transformToolbar("incidents")}
    <section class="executive-grid">
      ${metricCard("Incidencias abiertas", items.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("Prioridad alta", items.filter((item) => item.priority === "alta" && item.status !== "cerrado").length)}
      ${metricCard("Críticas", items.filter((item) => item.impact === "Alto" && item.status !== "cerrado").length)}
      ${metricCard("Sin evidencia", items.filter((item) => !item.evidence).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Folio", "Área", "Clasificación", "Descripción", "Responsable", "Apertura", "Cierre", "Impacto", "Prioridad", "Evidencia", "Semáforo", "Estado", "Acción"], items.map((item) => [
        item.folio, labelForArea(item.area), item.classification, item.description, item.responsible, item.openDate, item.closeDate || "Abierta", item.impact, priorityBadge(item.priority), evidenceCell(item.evidence), trafficBadge(executionSignal(item), executionSignalLabel(item)), statusBadge(item.status), transformActions("incidents", item.rowId),
      ]), "wide-table")}
    </section>`;
}

function renderMeetings() {
  const items = visibleMeetings();
  appContent.innerHTML = `
    ${sectionHeading("Reuniones", "Cada reunión produce minuta, acuerdo, responsable y compromiso", scopeText())}
    ${transformToolbar("meetings")}
    <section class="executive-grid">
      ${metricCard("Reuniones", items.length)}
      ${metricCard("Próximas", items.filter((item) => item.date >= todayIsoDate() && item.status !== "cerrado").length)}
      ${metricCard("Minutas cerradas", items.filter((item) => item.minutes && item.status === "cerrado").length)}
      ${metricCard("Acuerdos generados", items.filter((item) => item.agreement).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Fecha", "Tipo", "Reunión", "Área", "Responsable", "Participantes", "Minuta", "Acuerdo", "Responsable acuerdo", "Compromiso", "Estado", "Acción"], items.map((item) => [
        item.date, item.type, item.title, labelForArea(item.area), item.owner, item.attendees, item.minutes, item.agreement, item.agreementOwner, item.commitmentDate, statusBadge(item.status), transformActions("meetings", item.rowId),
      ]), "wide-table")}
    </section>`;
}

function renderEvidenceCenter() {
  const items = visibleEvidenceLibrary();
  appContent.innerHTML = `
    ${sectionHeading("Evidencias", "Repositorio relacionado con proyectos, tareas, acuerdos e incidencias", scopeText())}
    ${transformToolbar("evidenceLibrary")}
    <section class="executive-grid">
      ${metricCard("Evidencias", items.length)}
      ${metricCard("Validadas", items.filter((item) => item.status === "validada").length)}
      ${metricCard("Pendientes", items.filter((item) => item.status === "cargada").length)}
      ${metricCard("Faltantes", items.filter((item) => item.status === "faltante").length)}
    </section>
    <section class="content-card">
      ${renderTable(["Relacionado con", "Folio / ID", "Archivo", "Tipo", "Responsable", "Fecha", "Estado", "Acción"], items.map((item) => [
        item.relationType, item.relationId, item.fileId ? evidenceCell(`${item.fileId}|${item.name}`) : item.name, item.type, item.owner, item.date || "Pendiente", statusBadge(item.status), transformActions("evidenceLibrary", item.rowId),
      ]))}
    </section>`;
}

function renderKpis() {
  const items = visibleKpis();
  appContent.innerHTML = `
    ${sectionHeading("KPIs por jefatura", "Objetivo, resultado, tendencia y semáforo", scopeText())}
    ${transformToolbar("kpis")}
    <section class="kpi-grid">
      ${items.map((item) => {
        const attainment = item.target ? Math.round((item.current / item.target) * 100) : 0;
        return `<article class="kpi-card status-${normalizeClassName(item.status)}"><div class="kpi-card-head"><div><p class="eyebrow">${escapeHtml(labelForArea(item.area))}</p><h3>${escapeHtml(item.name)}</h3></div>${trafficBadge(item.status, titleCase(item.status))}</div><div class="kpi-value">${item.current}${escapeHtml(item.unit)}</div><p>Objetivo: ${item.target}${escapeHtml(item.unit)} · ${escapeHtml(item.frequency)}</p><div class="progress-track"><span style="width:${Math.min(attainment, 100)}%"></span></div><div class="project-meta"><span>${escapeHtml(item.owner)}</span><strong>${titleCase(item.trend)}</strong></div>${transformActions("kpis", item.rowId)}</article>`;
      }).join("") || emptyState("No existen KPIs en este alcance.")}
    </section>`;
}

function renderGantt() {
  const projectItems = visibleProjects();
  const taskItems = visibleTasks().filter((item) => item.start && item.due);
  const dates = [...projectItems.flatMap((item) => [item.start, item.due]), ...taskItems.flatMap((item) => [item.start, item.due])].filter(Boolean).sort();
  const minDate = dates[0] || todayIsoDate();
  const maxDate = dates[dates.length - 1] || addDaysIso(30);
  appContent.innerHTML = `
    ${sectionHeading("Gantt", "Cronograma de proyectos y tareas", scopeText())}
    <section class="content-card gantt-shell">
      <div class="gantt-scale"><span>${minDate}</span><span>${maxDate}</span></div>
      ${projectItems.map((project) => ganttRow(project.name, project.start, project.due, minDate, maxDate, "project")).join("")}
      ${taskItems.map((task) => ganttRow(task.title, task.start, task.due, minDate, maxDate, "task")).join("")}
    </section>`;
}

function renderTimeline() {
  const events = [
    ...visibleProjects().flatMap((item) => [
      { date: item.start, type: "Inicio de proyecto", title: item.name, owner: item.owner, area: item.area, signal: "amarillo" },
      { date: item.due, type: "Compromiso de proyecto", title: item.name, owner: item.owner, area: item.area, signal: executionSignal(item) },
    ]),
    ...visibleTasks().map((item) => ({ date: item.due, type: "Tarea", title: item.title, owner: item.responsible, area: item.area, signal: executionSignal(item) })),
    ...visibleAgreements().map((item) => ({ date: item.due, type: "Acuerdo", title: item.agreement, owner: item.owner, area: item.area, signal: executionSignal(item) })),
    ...visibleMeetings().map((item) => ({ date: item.date, type: "Reunión", title: item.title, owner: item.owner, area: item.area, signal: item.status === "cerrado" ? "verde" : "amarillo" })),
  ].filter((item) => item.date).sort((a, b) => a.date.localeCompare(b.date));

  appContent.innerHTML = `
    ${sectionHeading("Timeline operativo", "Secuencia cronológica de proyectos, tareas, acuerdos y reuniones", scopeText())}
    <section class="timeline-list">
      ${events.map((item) => `<article class="timeline-item">
        <time>${escapeHtml(item.date)}</time>
        <span class="timeline-dot status-${normalizeClassName(item.signal)}"></span>
        <div><p class="eyebrow">${escapeHtml(item.type)} · ${escapeHtml(labelForArea(item.area))}</p><h3>${escapeHtml(item.title)}</h3><span>${escapeHtml(item.owner)}</span></div>
      </article>`).join("") || emptyState("No existen compromisos en el timeline.")}
    </section>`;
}

function renderPipeline() {
  const stages = ["pendiente", "en proceso", "con riesgo", "vencido", "cerrado"];
  const items = visibleProjects();
  appContent.innerHTML = `
    ${sectionHeading("Pipeline de ejecución", "Proyectos organizados por etapa y nivel de control", scopeText())}
    <section class="kanban-board pipeline-board">
      ${stages.map((stage) => {
        const stageItems = items.filter((item) => normalizeExecutionStatus(item.status) === stage);
        return `<article class="kanban-column"><h3>${titleCase(stage)} <span class="kanban-count">${stageItems.length}</span></h3>
          ${stageItems.map((item) => `<div class="kanban-card"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(labelForArea(item.area))}</span><span>${escapeHtml(item.owner)}</span><span>${escapeHtml(item.due)}</span>${trafficBadge(executionSignal(item), executionSignalLabel(item))}</div>`).join("") || `<p class="muted-copy">Sin proyectos</p>`}
        </article>`;
      }).join("")}
    </section>`;
}

function projectProgress(project) {
  const related = tasks.filter((task) => task.projectId === project.rowId);
  return related.length ? Math.round((related.filter((task) => task.status === "cerrado").length / related.length) * 100) : 0;
}

function projectName(projectId) {
  return projects.find((project) => project.rowId === projectId)?.name || "Sin proyecto";
}

function taskName(taskId) {
  return tasks.find((task) => task.rowId === taskId)?.title || "Tarea no disponible";
}

function executionSignal(item) {
  const status = normalizePlainText(item.status);
  if (status === "cerrado") return "verde";
  if (["con riesgo", "vencido", "vencida"].includes(status)) return "rojo";
  const due = item.due || item.commitmentDate || item.closeDate;
  if (due && due < todayIsoDate()) return "rojo";
  if (due && due <= addDaysIso(3)) return "amarillo";
  return "verde";
}

function executionSignalLabel(item) {
  const signal = executionSignal(item);
  return signal === "rojo" ? "Atención" : signal === "amarillo" ? "Próximo" : "En control";
}

function operationalAlerts() {
  const alerts = [];
  visibleTasks().forEach((item) => {
    if (item.status !== "cerrado" && item.due < todayIsoDate()) alerts.push({ type: "Tarea vencida", area: item.area, owner: item.responsible, detail: item.title, date: item.due, signal: "rojo" });
    if (item.status !== "cerrado" && !item.evidence) alerts.push({ type: "Evidencia faltante", area: item.area, owner: item.responsible, detail: item.title, date: item.due, signal: item.due <= addDaysIso(3) ? "rojo" : "amarillo" });
  });
  visibleIncidents().filter((item) => item.status !== "cerrado" && (item.priority === "alta" || item.impact === "Alto")).forEach((item) => alerts.push({ type: "Incidencia crítica", area: item.area, owner: item.responsible, detail: `${item.folio}: ${item.description}`, date: item.openDate, signal: "rojo" }));
  visibleAgreements().filter((item) => item.status !== "cerrado" && item.due < todayIsoDate()).forEach((item) => alerts.push({ type: "Acuerdo vencido", area: item.area, owner: item.owner, detail: item.agreement, date: item.due, signal: "rojo" }));
  visibleKpis().filter((item) => item.status !== "verde").forEach((item) => alerts.push({ type: "KPI fuera de rango", area: item.area, owner: item.owner, detail: `${item.name}: ${item.current}${item.unit} / meta ${item.target}${item.unit}`, date: "", signal: item.status }));
  return alerts;
}

function ganttRow(label, start, due, minDate, maxDate, type) {
  const total = Math.max(1, dateDistance(minDate, maxDate));
  const left = Math.max(0, Math.min(100, (dateDistance(minDate, start) / total) * 100));
  const width = Math.max(3, Math.min(100 - left, (Math.max(1, dateDistance(start, due)) / total) * 100));
  return `<div class="gantt-row"><strong>${escapeHtml(label)}</strong><div class="gantt-track"><span class="gantt-bar gantt-${type}" style="left:${left}%;width:${width}%">${start} · ${due}</span></div></div>`;
}

function dateDistance(start, end) {
  return Math.round((new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000);
}

function average(values) {
  return values.length ? Math.round(values.reduce((total, value) => total + Number(value || 0), 0) / values.length) : 0;
}

function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function renderDiagnosticBase() {
  const items = visibleByArea(diagnosticBase);
  appContent.innerHTML = `
    ${sectionHeading("Diagnóstico base", "Situación actual documentada", scopeText())}
    ${transformToolbar("diagnosticBase")}
    <section class="executive-grid">
      ${metricCard("Elementos documentados", items.length)}
      ${metricCard("Problemas identificados", diagnosticBase.filter((item) => item.section === "Problemas identificados").length)}
      ${metricCard("Evidencias adjuntas", items.filter((item) => item.evidence).length)}
      ${metricCard("Pendientes", items.filter((item) => item.status === "pendiente" || item.status === "falta evidencia").length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Levantamiento</p><h3>Organigrama, puestos, procesos, reportes e indicadores</h3></div></div>
      ${renderTable(["Bloque", "Área", "Situación actual / observaciones", "Responsable", "Adjunto", "Estatus", "Acción"], items.map((item) => [
        item.section,
        labelForArea(areaKeyFromLabel(item.area)),
        item.detail,
        item.owner,
        evidenceCell(item.evidence),
        statusBadge(item.status),
        transformActions("diagnosticBase", item.rowId),
      ]))}
    </section>
  `;
}

function renderInterviews() {
  const items = visibleByArea(interviews);
  appContent.innerHTML = `
    ${sectionHeading("Entrevistas", "Levantamiento con jefaturas y responsables", scopeText())}
    ${transformToolbar("interviews")}
    <section class="executive-grid">
      ${metricCard("Entrevistas", items.length)}
      ${metricCard("Áreas cubiertas", uniqueValues(items.map((item) => item.area)).length)}
      ${metricCard("Riesgos levantados", items.filter((item) => item.risks).length)}
      ${metricCard("Automatizaciones sugeridas", items.filter((item) => item.automations).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Fecha", "Entrevistado", "Área", "Puesto", "Responsable", "Funciones", "Problemas", "Riesgos", "Oportunidades", "Pregunta de oro", "Acción"], items.map((item) => [
        item.date,
        item.interviewed,
        labelForArea(areaKeyFromLabel(item.area)),
        item.position,
        item.responsible,
        item.functions,
        item.problems,
        item.risks,
        item.opportunities,
        item.golden,
        transformActions("interviews", item.rowId),
      ]), "wide-table")}
    </section>
  `;
}

function renderPainMap() {
  const items = visibleByArea(painMap);
  appContent.innerHTML = `
    ${sectionHeading("Mapa de dolor", "Problemas estructurados desde entrevistas", scopeText())}
    ${transformToolbar("painMap")}
    <section class="executive-grid">
      ${metricCard("Dolores registrados", items.length)}
      ${metricCard("Focos rojos", items.filter((item) => item.signal === "rojo").length)}
      ${metricCard("Procesos", items.filter((item) => item.category === "Procesos").length)}
      ${metricCard("Tecnología", items.filter((item) => item.category === "Tecnología").length)}
    </section>
    <section class="content-card">
      ${renderTable(["Clasificación", "Descripción", "Área afectada", "Impacto", "Frecuencia", "Prioridad", "Responsable", "Semáforo", "Acción"], items.map((item) => [
        item.category,
        item.description,
        labelForArea(areaKeyFromLabel(item.area)),
        item.impact,
        item.frequency,
        priorityBadge(item.priority),
        item.owner,
        trafficBadge(item.signal, titleCase(item.signal)),
        transformActions("painMap", item.rowId),
      ]))}
    </section>
  `;
}

function renderExecutiveDiagnosis() {
  const items = visibleByArea(executiveFindings);
  appContent.innerHTML = `
    ${sectionHeading("Diagnóstico ejecutivo", "Hallazgos, causas raíz e impacto", scopeText())}
    ${transformToolbar("executiveFindings")}
    <section class="executive-grid">
      ${metricCard("Hallazgos", items.length)}
      ${metricCard("Prioridad alta", items.filter((item) => item.priority === "alta").length)}
      ${metricCard("Riesgos críticos", riskRegister.filter((item) => riskSignal(item) === "rojo").length)}
      ${metricCard("Áreas impactadas", uniqueValues(items.map((item) => item.area)).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Hallazgo", "Causa raíz", "Riesgo", "Impacto", "Área", "Prioridad", "Responsable", "Acción"], items.map((item) => [
        item.finding,
        item.rootCause,
        item.risk,
        item.impact,
        labelForArea(areaKeyFromLabel(item.area)),
        priorityBadge(item.priority),
        item.owner,
        transformActions("executiveFindings", item.rowId),
      ]))}
    </section>
  `;
}

function renderStrategy() {
  const leadership = jefaturas.find((item) => item.area === activeUser?.area);
  const visible = activeUser.access === "area"
    ? strategies.filter((item) => item.owner === activeUser.name || item.owner === leadership?.name)
    : strategies;
  appContent.innerHTML = `
    ${sectionHeading("Estrategia", "Cada hallazgo convertido en objetivo, KPI y presupuesto", scopeText())}
    ${transformToolbar("strategies")}
    <section class="executive-grid">
      ${metricCard("Estrategias", visible.length)}
      ${metricCard("Presupuesto", formatCurrency(sum(visible, "budget")))}
      ${metricCard("KPIs definidos", visible.filter((item) => item.kpi).length)}
      ${metricCard("En ejecución", visible.filter((item) => item.start <= todayIsoDate()).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Hallazgo", "Objetivo", "Resultado esperado", "Responsable", "KPI", "Inicio", "Fin", "Presupuesto", "Acción"], visible.map((item) => [
        item.finding,
        item.objective,
        item.expected,
        item.owner,
        item.kpi,
        item.start,
        item.end,
        formatCurrency(item.budget),
        transformActions("strategies", item.rowId),
      ]))}
    </section>
  `;
}

function renderWorkPlan() {
  const items = visibleWorkPlan();
  const columns = ["pendiente", "en revision", "falta evidencia", "en ejecucion", "cerrado"];
  appContent.innerHTML = `
    ${sectionHeading("Plan de trabajo", "Acciones derivadas de la estrategia", scopeText())}
    ${transformToolbar("workPlan")}
    <section class="executive-grid">
      ${metricCard("Acciones", items.length)}
      ${metricCard("Vencidas", items.filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status)).length)}
      ${metricCard("Sin evidencia", items.filter((item) => !item.evidence).length)}
      ${metricCard("Críticas", items.filter((item) => item.priority === "alta").length)}
    </section>
    <section class="content-card">
      <div class="view-strip">${["Kanban", "Calendario", "Timeline", "Gantt", "Lista"].map((item) => `<span>${item}</span>`).join("")}</div>
      ${renderTable(["Acción", "Responsable", "Inicio", "Compromiso", "Prioridad", "Evidencia", "Estado", "Vista", "Acción"], items.map((item) => [
        item.action,
        item.owner,
        item.start,
        item.due,
        priorityBadge(item.priority),
        evidenceCell(item.evidence),
        statusBadge(item.status),
        item.view,
        transformActions("workPlan", item.rowId),
      ]))}
    </section>
    <section class="kanban-board">
      ${columns.map((status) => `
        <article class="kanban-column">
          <h3>${titleCase(status)}</h3>
          ${items.filter((item) => item.status === status).map((item) => `<div class="kanban-card"><strong>${item.action}</strong><span>${item.owner}</span><small>${priorityBadge(item.priority)} ${item.due}</small></div>`).join("") || `<p class="muted-copy">Sin registros</p>`}
        </article>
      `).join("")}
    </section>
  `;
}

function renderFollowUp() {
  const planItems = visibleWorkPlan();
  const agreementItems = visibleAgreements();
  const overdue = [...planItems, ...agreementItems].filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status));
  const next = [...planItems, ...agreementItems].filter((item) => item.due >= todayIsoDate() && item.due <= addDaysIso(7));
  const missingEvidence = [...planItems, ...agreementItems].filter((item) => !item.evidence || item.status === "falta evidencia");
  appContent.innerHTML = `
    ${sectionHeading("Seguimiento", "Control de ejecución y vencimientos", scopeText())}
    <section class="executive-grid">
      ${metricCard("Actividades vencidas", overdue.length)}
      ${metricCard("Próximas a vencer", next.length)}
      ${metricCard("Críticas", planItems.filter((item) => item.priority === "alta").length)}
      ${metricCard("Terminadas", planItems.filter((item) => ["cerrado", "aprobado"].includes(item.status)).length)}
      ${metricCard("Sin evidencia", missingEvidence.length)}
    </section>
    <section class="content-card">
      ${renderTable(["Tipo", "Actividad / acuerdo", "Responsable", "Compromiso", "Prioridad", "Evidencia", "Estado"], [
        ...planItems.map((item) => ["Plan", item.action, item.owner, item.due, priorityBadge(item.priority), evidenceCell(item.evidence), statusBadge(item.status)]),
        ...agreementItems.map((item) => ["Acuerdo", item.agreement, item.owner, item.due, priorityBadge("media"), evidenceCell(item.evidence), statusBadge(item.status)]),
      ])}
    </section>
  `;
}

function renderAgreements() {
  const items = visibleAgreements();
  appContent.innerHTML = `
    ${sectionHeading("Acuerdos", "Compromisos integrados al seguimiento", scopeText())}
    ${transformToolbar("agreements")}
    <section class="executive-grid">
      ${metricCard("Acuerdos", items.length)}
      ${metricCard("Pendientes", items.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("Sin evidencia", items.filter((item) => !item.evidence).length)}
      ${metricCard("Vencidos", items.filter((item) => item.due < todayIsoDate() && item.status !== "cerrado").length)}
    </section>
    <section class="content-card">
      ${renderTable(["Fecha", "Acuerdo", "Área", "Responsable", "Prioridad", "Fecha compromiso", "Evidencia", "Semáforo", "Estado", "Acción"], items.map((item) => [
        item.date,
        item.agreement,
        labelForArea(item.area),
        item.owner,
        priorityBadge(item.priority),
        item.due,
        evidenceCell(item.evidence),
        trafficBadge(executionSignal(item), executionSignalLabel(item)),
        statusBadge(item.status),
        transformActions("agreements", item.rowId),
      ]))}
    </section>
  `;
}

function renderRisks() {
  const items = visibleRisks();
  appContent.innerHTML = `
    ${sectionHeading("Riesgos", "Probabilidad, impacto y mitigación", scopeText())}
    ${transformToolbar("risks")}
    <section class="executive-grid">
      ${metricCard("Riesgos", items.length)}
      ${metricCard("Críticos", items.filter((item) => riskSignal(item) === "rojo").length)}
      ${metricCard("Medios", items.filter((item) => riskSignal(item) === "amarillo").length)}
      ${metricCard("Mitigados", items.filter((item) => item.mitigation).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Riesgo", "Probabilidad", "Impacto", "Plan de mitigación", "Responsable", "Semáforo", "Acción"], items.map((item) => [
        item.risk,
        item.probability,
        item.impact,
        item.mitigation,
        item.owner,
        trafficBadge(riskSignal(item), titleCase(riskSignal(item))),
        transformActions("risks", item.rowId),
      ]))}
    </section>
  `;
}

function renderBenefits() {
  const totalSavings = sum(benefits, "saving");
  const totalImpact = sum(benefits, "financialImpact");
  appContent.innerHTML = `
    ${sectionHeading("Beneficios obtenidos", "Impacto financiero y operativo generado", scopeText())}
    ${transformToolbar("benefits")}
    <section class="executive-grid">
      ${metricCard("Ahorro generado", formatCurrency(totalSavings))}
      ${metricCard("Impacto financiero", formatCurrency(totalImpact))}
      ${metricCard("Mejoras implementadas", benefits.length)}
      ${metricCard("Reducción de incidencias", "Hasta 15%")}
    </section>
    <section class="content-card">
      ${renderTable(["Ahorro generado", "Reducción de tiempos", "Reducción de incidencias", "Mejoras implementadas", "Impacto financiero", "Acción"], benefits.map((item) => [
        formatCurrency(item.saving),
        item.timeReduction,
        item.incidentReduction,
        item.improvements,
        formatCurrency(item.financialImpact),
        transformActions("benefits", item.rowId),
      ]))}
    </section>
  `;
}

function renderLessons() {
  const items = visibleByArea(lessons);
  appContent.innerHTML = `
    ${sectionHeading("Lecciones aprendidas", "Conocimiento reutilizable para evitar reincidencias", scopeText())}
    ${transformToolbar("lessons")}
    <section class="executive-grid">
      ${metricCard("Lecciones registradas", items.length)}
      ${metricCard("Áreas involucradas", new Set(items.map((item) => item.area)).size)}
      ${metricCard("Con evidencia", items.filter((item) => item.evidence).length)}
      ${metricCard("Aplicaciones definidas", items.filter((item) => item.action).length)}
    </section>
    <section class="content-card">
      ${renderTable(["Fecha", "Área", "Contexto", "Lección", "Aplicación futura", "Responsable", "Evidencia", "Acción"], items.map((item) => [
        item.date,
        labelForArea(item.area),
        item.context,
        item.lesson,
        item.action,
        item.owner,
        evidenceCell(item.evidence),
        transformActions("lessons", item.rowId),
      ]), "wide-table")}
    </section>`;
}

function renderDirectionDashboard() {
  const taskItems = visibleTasks();
  const projectItems = visibleProjects();
  const compliance = taskItems.length ? Math.round((taskItems.filter((item) => item.status === "cerrado").length / taskItems.length) * 100) : 0;
  const alerts = operationalAlerts();
  appContent.innerHTML = `
    ${sectionHeading("Dashboard ejecutivo", "Gestión, ejecución y control operativo sobre MicroSip", "Vista ejecutiva")}
    <section class="executive-grid">
      ${metricCard("Cumplimiento general", `${compliance}%`)}
      ${metricCard("KPIs fuera de rango", visibleKpis().filter((item) => item.status !== "verde").length)}
      ${metricCard("Riesgos críticos", visibleIncidents().filter((item) => item.status !== "cerrado" && (item.priority === "alta" || item.impact === "Alto")).length)}
      ${metricCard("Avance de proyectos", `${average(projectItems.map(projectProgress))}%`)}
      ${metricCard("Acuerdos vencidos", visibleAgreements().filter((item) => item.status !== "cerrado" && item.due < todayIsoDate()).length)}
      ${metricCard("Alertas activas", alerts.length)}
      ${metricCard("Beneficios", formatCurrency(sum(benefits, "financialImpact")))}
      ${metricCard("Focos rojos", painMap.filter((item) => item.signal === "rojo").length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Ejecución</p><h3>Avance de proyectos</h3></div></div>
      ${renderTable(["Proyecto", "Área", "Responsable", "Avance", "Compromiso", "Semáforo"], projectItems.map((item) => [item.name, labelForArea(item.area), item.owner, `${projectProgress(item)}%`, item.due, trafficBadge(executionSignal(item), executionSignalLabel(item))]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Indicadores</p><h3>KPIs por jefatura</h3></div></div>
      ${renderTable(["Área", "KPI", "Actual", "Objetivo", "Tendencia", "Semáforo"], visibleKpis().map((item) => [labelForArea(item.area), item.name, `${item.current}${item.unit}`, `${item.target}${item.unit}`, titleCase(item.trend), trafficBadge(item.status, titleCase(item.status))]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Resumen ejecutivo</p><h3>Hallazgos prioritarios</h3></div></div>
      ${renderTable(["Hallazgo", "Causa raíz", "Impacto", "Responsable", "Prioridad"], executiveFindings.map((item) => [
        item.finding,
        item.rootCause,
        item.impact,
        item.owner,
        priorityBadge(item.priority),
      ]))}
    </section>
  `;
}

function renderExecutiveDashboard() {
  const items = visibleReports();
  const budgetUsed = sum(items.filter((item) => item.type === "gasto"), "amount");
  const budgetTotal = gerencias.reduce((total, item) => total + item.budget, 0);
  const savings = sum(items.filter((item) => item.type === "ahorro"), "amount");
  const openIncidents = items.filter((item) => item.type === "incidencia" && !["cerrado", "rechazado"].includes(item.status)).length;
  const overdueReports = items.filter((item) => item.status === "pendiente" && item.due < todayIsoDate()).length;
  const pendingRequests = items.filter((item) => item.type === "solicitud" && ["pendiente", "en revision"].includes(item.status)).length;

  appContent.innerHTML = `
    ${sectionHeading("Dashboard ejecutivo", "KPIs de operación y cumplimiento", scopeText())}
    <div class="export-actions export-actions-top">
      <button class="secondary-button" type="button" data-action="print-executive">PDF / Imprimir</button>
    </div>
    <section class="executive-grid">
      ${metricCard("Presupuesto usado", `${Math.round((budgetUsed / budgetTotal) * 100)}%`)}
      ${metricCard("Gastos por gerencia", formatCurrency(budgetUsed))}
      ${metricCard("Ahorro generado", formatCurrency(savings))}
      ${metricCard("Incidencias abiertas", openIncidents)}
      ${metricCard("Reportes vencidos", overdueReports)}
      ${metricCard("Solicitudes pendientes", pendingRequests)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Cumplimiento</p><h3>Cumplimiento por gerencia</h3></div></div>
      ${renderTable(["Gerencia", "Presupuesto usado", "Reportes", "Cumplimiento", "Estatus"], gerencias.map((item) => {
        const rows = reports.filter((report) => report.area === item.area);
        const spent = sum(rows.filter((report) => report.type === "gasto"), "amount");
        const closed = rows.filter((report) => ["aprobado", "cerrado"].includes(report.status)).length;
        const compliance = rows.length ? Math.round((closed / rows.length) * 100) : 0;
        return [item.label, formatCurrency(spent), rows.length, `${compliance}%`, badge(compliance >= 70 ? "Activo" : "Pendiente", compliance >= 70 ? "status-activo" : "status-pendiente")];
      }))}
    </section>
  `;
}

function renderCarmenPanel(filters = {}) {
  const baseItems = visibleReports();
  const items = filterReports(baseItems, filters);
  const redLeadership = visibleLeadership().filter((item) => leadershipTrafficLight(item).level === "rojo").length;
  const planItems = visibleWorkPlan();
  const agreementItems = visibleAgreements();
  const riskItems = visibleRisks();
  const overdueActivities = [
    ...planItems.filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status)),
    ...agreementItems.filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status)),
  ];
  const missingEvidence = [
    ...items.filter((item) => !item.evidence || item.status === "falta evidencia"),
    ...planItems.filter((item) => !item.evidence || item.status === "falta evidencia"),
    ...agreementItems.filter((item) => !item.evidence || item.status === "falta evidencia"),
  ];
  appContent.innerHTML = `
    ${sectionHeading("Dashboard Carmen", "Focos rojos, vencimientos, riesgos y evidencias", scopeText())}
    <section class="executive-grid">
      ${metricCard("Focos rojos", painMap.filter((item) => item.signal === "rojo").length + redLeadership)}
      ${metricCard("Actividades vencidas", overdueActivities.length)}
      ${metricCard("Riesgos críticos", riskItems.filter((item) => riskSignal(item) === "rojo").length)}
      ${metricCard("Jefaturas incumplidas", redLeadership)}
      ${metricCard("Gastos fuera de presupuesto", items.filter((item) => item.type === "gasto" && item.amount > 90000).length)}
      ${metricCard("Evidencias pendientes", missingEvidence.length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Control operativo</p><h3>Bandeja de focos críticos</h3></div><span class="scope-pill">${buildCarmenFocusRows(items).length} alertas</span></div>
      ${renderTable(["Tipo", "Responsable", "Área", "Detalle", "Prioridad", "Estatus", "Acción"], buildCarmenFocusRows(items).map((item) => [
        item.type, item.responsible, item.area, item.detail, item.priority, item.status, item.action
      ]))}
    </section>
  `;
}

function buildCarmenFocusRows(items) {
  const rows = [];
  visibleLeadership().filter((item) => leadershipTrafficLight(item).level === "rojo").forEach((item) => {
    rows.push({ type: "Jefatura incumplida", responsible: item.name, area: labelForArea(item.area), detail: leadershipTrafficLight(item).label, priority: priorityBadge("alta"), status: trafficBadge("rojo", "Rojo"), action: quickActionButtons(item.rowId) });
  });
  visibleRisks().filter((item) => riskSignal(item) === "rojo").forEach((item) => {
    rows.push({ type: "Riesgo crítico", responsible: item.owner, area: "Control", detail: item.risk, priority: priorityBadge("alta"), status: trafficBadge("rojo", "Rojo"), action: quickActionButtons(item.owner) });
  });
  visibleWorkPlan().filter((item) => item.due < todayIsoDate() || !item.evidence).forEach((item) => {
    rows.push({ type: item.due < todayIsoDate() ? "Actividad vencida" : "Evidencia pendiente", responsible: item.owner, area: "Plan", detail: item.action, priority: priorityBadge(item.priority), status: statusBadge(item.status), action: quickActionButtons(item.owner) });
  });
  items.filter((item) => item.type === "gasto" && item.amount > 90000).forEach((item) => {
    rows.push({ type: "Gasto fuera de presupuesto", responsible: item.responsible, area: labelForArea(item.area), detail: `${item.description} / ${formatCurrency(item.amount)}`, priority: priorityBadge("alta"), status: statusBadge(item.status), action: reportActions(item) });
  });
  items.filter((item) => !item.evidence || item.status === "falta evidencia").forEach((item) => {
    rows.push({ type: "Evidencia pendiente", responsible: item.responsible, area: labelForArea(item.area), detail: item.description, priority: priorityBadge(item.priority), status: statusBadge(item.status), action: reportActions(item) });
  });
  return rows.slice(0, 40);
}

function renderCentralBoard() {
  const items = visibleReports();
  const leadership = visibleLeadership();
  const taskItems = visibleTasks();
  const redItems = leadership.filter((item) => leadershipTrafficLight(item).level === "rojo").length;
  const pendingEvidence = items.filter((item) => !item.evidence || item.status === "falta evidencia").length;
  const overBudget = leadership.filter((item) => Number(item.spent || 0) > Number(item.budget || 0)).length;
  const overdue = [
    ...items.filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status)),
    ...taskItems.filter((item) => item.due < todayIsoDate() && !["cerrada", "cerrado", "validado", "completado"].includes(item.status)),
  ].length;

  appContent.innerHTML = `
    ${sectionHeading("Tablero central", "Centro operativo-financiero de alta dirección", scopeText())}
    <section class="executive-grid">
      ${metricCard("Jefaturas", leadership.length)}
      ${metricCard("Jefaturas en rojo", redItems)}
      ${metricCard("Evidencias pendientes", pendingEvidence)}
      ${metricCard("Presupuestos excedidos", overBudget)}
      ${metricCard("Actividades vencidas", overdue)}
      ${metricCard("Tareas abiertas", taskItems.filter((item) => !["cerrada", "cerrado", "validado", "completado"].includes(item.status)).length)}
      ${metricCard("Reportes activos", items.filter((item) => !["cerrado", "rechazado"].includes(item.status)).length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Vistas de control</p><h3>Operación por prioridad, semáforo y presupuesto</h3></div><span class="scope-pill">${items.length} registros</span></div>
      <div class="view-strip">
        ${["Dashboard", "Tabla", "Lista", "Kanban", "Calendario", "Timeline", "Pipeline", "Gantt", "Usuario", "Jefatura", "Área", "Prioridad", "Semáforo", "Presupuesto", "Vencimientos"].map((item) => `<span>${item}</span>`).join("")}
      </div>
      ${renderTable(["Jefatura", "Área", "Responsable", "Semáforo", "Presupuesto", "Gasto", "Saldo", "Cumplimiento", "Alertas"], leadership.map((item) => {
        const signal = leadershipTrafficLight(item);
        const rows = reports.filter((report) => report.area === item.area);
        return [
          item.leadership,
          labelForArea(item.area),
          item.name,
          trafficBadge(signal.level, signal.label),
          formatCurrency(item.budget),
          formatCurrency(item.spent),
          formatCurrency((item.budget || 0) - (item.spent || 0)),
          `${leadershipCompliance(item)}%`,
          rows.filter((report) => !report.evidence || report.due < todayIsoDate()).length,
        ];
      }))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Tareas</p><h3>Vencimientos operativos</h3></div><span class="scope-pill">${taskItems.length} tareas</span></div>
      ${renderTable(["Tarea", "Área", "Responsable", "Prioridad", "Estatus", "Compromiso"], taskItems.map((item) => [
        item.title,
        labelForArea(item.area),
        item.responsible,
        priorityBadge(item.priority),
        statusBadge(item.status),
        item.due,
      ]))}
    </section>
  `;
}

function renderAdminPanel() {
  if (!hasFullAccess()) {
    renderCentralBoard();
    return;
  }

  const items = visibleReports();
  const leadership = visibleLeadership();
  const taskItems = visibleTasks();
  const overdue = items.filter((item) => item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status));
  const missingEvidence = items.filter((item) => !item.evidence || item.status === "falta evidencia");
  const overBudgetReports = items.filter((item) => item.type === "gasto" && item.amount > 90000);
  const redLeadership = leadership.filter((item) => leadershipTrafficLight(item).level === "rojo");
  const repeatUsers = topBy(items.filter((item) => item.due < todayIsoDate()), "responsible").slice(0, 5);
  const noReport = leadership.filter((item) => {
    const areaRows = reports.filter((report) => report.area === item.area);
    return !areaRows.length || !areaRows.some((report) => report.date >= "2026-06-01");
  });
  const pendingAgreements = visibleAgreements().filter((item) => item.status !== "cerrado");

  appContent.innerHTML = `
    ${sectionHeading("Panel administrador", "Control total de incumplimientos, alertas y acciones rápidas", appwriteOnline ? "Appwrite activo" : "Appwrite pausado")}
    <section class="executive-grid">
      ${metricCard("Usuarios incumplidos", uniqueValues(overdue.map((item) => item.responsible)).length)}
      ${metricCard("Sin reporte reciente", noReport.length)}
      ${metricCard("Usuarios reincidentes", repeatUsers.length)}
      ${metricCard("Actividades vencidas", overdue.length + taskItems.filter((item) => item.due < todayIsoDate()).length)}
      ${metricCard("Acuerdos pendientes", pendingAgreements.length)}
      ${metricCard("Reportes pendientes", items.filter((item) => item.status === "pendiente").length)}
      ${metricCard("Evidencias faltantes", missingEvidence.length)}
      ${metricCard("Gastos fuera de presupuesto", overBudgetReports.length)}
      ${metricCard("Jefaturas en rojo", redLeadership.length)}
      ${metricCard("Última actividad", auditLogs[0]?.date || "Sin bitácora")}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Acciones rápidas</p><h3>Alertas críticas</h3></div><span class="scope-pill">${overdue.length + missingEvidence.length + overBudgetReports.length} focos</span></div>
      ${renderTable(["Tipo", "Responsable", "Área", "Detalle", "Prioridad", "Acción"], buildAdminAlerts().map((item) => [
        item.type,
        item.responsible,
        item.area,
        item.detail,
        item.priority,
        quickActionButtons(item.target)
      ]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Reincidencia</p><h3>Top responsables</h3></div></div>
      ${renderTable(["Responsable", "Eventos vencidos"], repeatUsers.map((item) => [item.label, item.count]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Control administrativo</p><h3>Quién no ha reportado y acuerdos pendientes</h3></div></div>
      ${renderTable(["Tipo", "Responsable", "Área", "Detalle", "Acción"], [
        ...noReport.map((item) => ["Sin reporte", item.name, labelForArea(item.area), "No existe reporte reciente del mes en curso.", quickActionButtons(item.rowId)]),
        ...pendingAgreements.map((item) => ["Acuerdo pendiente", item.owner, "Seguimiento", `${item.agreement} / vence ${item.due}`, quickActionButtons(item.owner)]),
      ])}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact">
        <div><p class="eyebrow">Usuarios</p><h3>Administración de accesos</h3></div>
        <button class="primary-button" type="button" data-action="new-user">Nuevo usuario</button>
      </div>
      ${renderTable(["Nombre completo", "Correo", "Teléfono", "WhatsApp", "Rol", "Gerencia", "Clave/PIN", "Estatus", "Acción"], loginDirectory().map((item) => [
        escapeHtml(item.name),
        escapeHtml(item.email),
        escapeHtml(item.phone || ""),
        escapeHtml(item.whatsapp || ""),
        escapeHtml(item.role),
        escapeHtml(item.access === "all" ? "Todas" : item.access === "executive" ? "Dirección" : labelForArea(item.area)),
        escapeHtml(item.pin || ""),
        statusBadge(item.status || "Activo"),
        userActionButtons(item),
      ]))}
    </section>
  `;
}

function renderGlobalSearch(query) {
  const needle = normalizePlainText(query);
  const results = [
    ...visibleReports().map((item) => ({
      type: "Reporte",
      title: `${labelForArea(item.area)} - ${item.type}`,
      owner: item.responsible,
      area: labelForArea(item.area),
      status: statusBadge(item.status),
      detail: `${item.description} ${item.evidence || ""}`,
    })),
    ...visibleLeadership().map((item) => ({
      type: "Jefatura",
      title: item.name,
      owner: item.position,
      area: labelForArea(item.area),
      status: trafficBadge(leadershipTrafficLight(item).level, leadershipTrafficLight(item).label),
      detail: `${item.email} ${item.phone} ${item.mainKpi} ${item.leadership}`,
    })),
    ...visibleGerencias().map((item) => ({
      type: "Gerencia",
      title: item.label,
      owner: item.manager,
      area: item.label,
      status: statusBadge(item.status.toLowerCase()),
      detail: `${item.email} ${item.role} ${item.frequency}`,
    })),
  ].filter((item) => normalizePlainText(`${item.type} ${item.title} ${item.owner} ${item.area} ${item.detail}`).includes(needle));

  appContent.innerHTML = `
    ${sectionHeading("Buscador global", "Resultados filtrados", `${results.length} coincidencias`)}
    <section class="content-card">
      ${renderTable(["Tipo", "Título", "Responsable", "Área", "Estatus", "Detalle"], results.map((item) => [
        item.type,
        item.title,
        item.owner,
        item.area,
        item.status,
        item.detail,
      ]))}
    </section>
  `;
}

function visibleGerencias() {
  if (!activeUser || activeUser.access !== "area") return gerencias;
  return gerencias.filter((item) => item.area === activeUser.area);
}

function buildAdminAlerts() {
  const alerts = [];
  visibleTasks().forEach((item) => {
    if (item.due < todayIsoDate() && !["cerrada", "cerrado", "validado", "completado"].includes(item.status)) {
      alerts.push({ type: "Tarea vencida", responsible: item.responsible, area: labelForArea(item.area), detail: item.title, priority: priorityBadge(item.priority), target: item.rowId });
    }
  });

  visibleReports().forEach((item) => {
    if (item.due < todayIsoDate() && !["cerrado", "aprobado"].includes(item.status)) {
      alerts.push({ type: "Vencimiento", responsible: item.responsible, area: labelForArea(item.area), detail: item.description, priority: priorityBadge(item.priority), target: item.id });
    }
    if (!item.evidence || item.status === "falta evidencia") {
      alerts.push({ type: "Evidencia", responsible: item.responsible, area: labelForArea(item.area), detail: "Evidencia faltante o incompleta", priority: priorityBadge(item.priority), target: item.id });
    }
    if (item.type === "gasto" && item.amount > 90000) {
      alerts.push({ type: "Presupuesto", responsible: item.responsible, area: labelForArea(item.area), detail: `${formatCurrency(item.amount)} fuera de umbral`, priority: priorityBadge("alta"), target: item.id });
    }
  });

  visibleLeadership().forEach((item) => {
    const signal = leadershipTrafficLight(item);
    if (signal.level === "rojo") {
      alerts.push({ type: "Jefatura en rojo", responsible: item.name, area: labelForArea(item.area), detail: signal.label, priority: priorityBadge("alta"), target: item.rowId });
    }
  });

  return alerts.slice(0, 30);
}

function quickActionButtons(target) {
  return `
    <div class="row-actions">
      <button class="secondary-button" type="button" data-action="quick-action" data-quick="reminder" data-target="${target}">Recordatorio</button>
      <button class="secondary-button" type="button" data-action="quick-action" data-quick="evidence" data-target="${target}">Evidencia</button>
      <button class="secondary-button" type="button" data-action="quick-action" data-quick="carmen" data-target="${target}">Carmen</button>
      <button class="secondary-button" type="button" data-action="quick-action" data-quick="direction" data-target="${target}">Dirección</button>
    </div>
  `;
}

function userActionButtons(user) {
  const target = escapeHtml(user.rowId || user.email);
  const nextLabel = (user.status || "Activo") === "Activo" ? "Desactivar" : "Reactivar";
  return `
    <div class="row-actions">
      <button class="secondary-button" type="button" data-action="edit-user" data-target="${target}">Editar</button>
      <button class="secondary-button" type="button" data-action="disable-user" data-target="${target}">${nextLabel}</button>
      <button class="secondary-button danger-button" type="button" data-action="delete-user" data-target="${target}">Eliminar</button>
    </div>
  `;
}

function topBy(items, key) {
  const counts = items.reduce((acc, item) => {
    const label = item[key] || "Sin responsable";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function renderLeadershipPanel() {
  if (!hasFullAccess()) {
    renderCentralBoard();
    return;
  }

  appContent.innerHTML = `
    ${sectionHeading("Jefaturas 360", "Administración editable de responsables, KPIs, presupuesto y cumplimiento", "Control total")}
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Jefaturas</p><h3>Directorio operativo-financiero</h3></div><span class="scope-pill">${jefaturas.length} registros</span></div>
      ${renderTable(["Nombre", "Puesto", "Área", "Jefatura", "Correo", "Teléfono", "Jefe directo", "Rol", "Estatus", "Objetivo mensual", "KPI principal", "Presupuesto", "Gasto", "Saldo", "Semáforo", "Cumplimiento", "Acción"], jefaturas.map((item) => {
        const signal = leadershipTrafficLight(item);
        return [
          item.name,
          item.position,
          labelForArea(item.area),
          item.leadership,
          item.email,
          item.phone,
          item.boss,
          item.role,
          statusBadge(item.status.toLowerCase()),
          item.monthlyGoal,
          item.mainKpi,
          formatCurrency(item.budget),
          formatCurrency(item.spent),
          formatCurrency((item.budget || 0) - (item.spent || 0)),
          trafficBadge(signal.level, signal.label),
          `${leadershipCompliance(item)}%`,
          `<div class="row-actions"><button class="secondary-button" type="button" data-action="edit-leadership" data-target="${item.rowId}">Editar</button><button class="secondary-button" type="button" data-action="toggle-leadership" data-target="${item.rowId}">${item.status === "Activo" ? "Desactivar" : "Activar"}</button></div>`
        ];
      }), "management-table")}
    </section>
  `;
}

function renderManagementPanel() {
  if (!hasFullAccess()) {
    renderExecutiveDashboard();
    return;
  }

  appContent.innerHTML = `
    <section class="content-card">
      <div class="section-heading">
        <div><p class="eyebrow">Administración</p><h3>Gerencias</h3></div>
        <button class="primary-button" type="button" data-action="new-management">Nueva gerencia</button>
      </div>
      ${renderTable(["Gerencia", "Gerente", "Email", "PIN interno", "Rol", "Frecuencia", "Estatus", "Último reporte", "Acción"], gerencias.map((item) => [
        item.label, item.manager, item.email, item.pin, item.role, item.frequency, statusBadge(item.status.toLowerCase()), item.lastReport,
        `<div class="row-actions"><button class="secondary-button" type="button" data-action="edit-management" data-target="${item.label}">Editar</button><button class="secondary-button" type="button" data-action="disable-management" data-target="${item.label}">Desactivar</button></div>`
      ]), "management-table")}
    </section>
  `;
}

function renderAuditPanel(filters = {}) {
  if (!hasFullAccess()) {
    renderExecutiveDashboard();
    return;
  }

  const users = uniqueValues(auditLogs.map((item) => item.user).filter(Boolean));
  const areas = uniqueValues(auditLogs.map((item) => item.area).filter(Boolean));
  const actions = uniqueValues(auditLogs.map((item) => item.action).filter(Boolean));
  const filtered = filterAuditLogs(filters);

  appContent.innerHTML = `
    ${sectionHeading("Bitácora", "Trazabilidad de cambios del sistema", `${filtered.length} registros`)}
    <section class="content-card">
      ${exportActions("audit", filters)}
      <form class="filter-panel" id="audit-filter-form">
        <label>Usuario<select id="audit-user"><option value="">Todos</option>${users.map((item) => `<option value="${escapeHtml(item)}" ${filters.user === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Gerencia<select id="audit-area"><option value="">Todas</option>${areas.map((item) => `<option value="${escapeHtml(item)}" ${filters.area === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Acción<select id="audit-action"><option value="">Todas</option>${actions.map((item) => `<option value="${escapeHtml(item)}" ${filters.action === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Fecha<input id="audit-date" type="date" value="${filters.date || ""}"></label>
        <div class="filter-actions">
          <button class="secondary-button" type="button" id="audit-clear">Limpiar</button>
          <button class="primary-button" type="submit">Filtrar</button>
        </div>
      </form>
      ${renderTable(["Fecha", "Usuario", "Rol", "Acción", "Gerencia", "Reporte", "Detalle"], filtered.map((item) => [
        item.date,
        item.user,
        item.role,
        badge(item.action, "status-activo"),
        item.area || "N/A",
        item.reportId || "N/A",
        item.detail || "Sin detalle",
      ]), "audit-table")}
    </section>
  `;

  document.querySelector("#audit-filter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderAuditPanel(readAuditFilters());
  });

  document.querySelector("#audit-clear").addEventListener("click", () => {
    renderAuditPanel({});
  });
}

function readAuditFilters() {
  return {
    user: document.querySelector("#audit-user").value,
    area: document.querySelector("#audit-area").value,
    action: document.querySelector("#audit-action").value,
    date: document.querySelector("#audit-date").value,
  };
}

function filterAuditLogs(filters) {
  return auditLogs.filter((item) => {
    if (filters.user && item.user !== filters.user) return false;
    if (filters.area && item.area !== filters.area) return false;
    if (filters.action && item.action !== filters.action) return false;
    if (filters.date && !String(item.date).includes(formatDisplayDateForFilter(filters.date))) return false;
    return true;
  });
}

function uniqueValues(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "es"));
}

function formatDisplayDateForFilter(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${Number(day)}/${Number(month)}/${year.slice(2)}`;
}

function renderAreaModule(area, filters = {}) {
  if (activeUser.access === "area" && activeUser.area !== area) {
    renderExecutiveDashboard();
    return;
  }

  const meta = gerencias.find((item) => item.area === area);
  const normalizedFilters = { ...filters, area };
  const items = filterReports(areaReports(area), normalizedFilters);
  const projectItems = visibleProjects().filter((item) => item.area === area);
  const taskItems = visibleTasks().filter((item) => item.area === area);
  const incidentItems = visibleIncidents().filter((item) => item.area === area);
  const kpiItems = visibleKpis().filter((item) => item.area === area);
  const gastos = sum(items.filter((item) => item.type === "gasto"), "amount");
  const ahorros = sum(items.filter((item) => item.type === "ahorro"), "amount");
  const capabilities = operationalCapabilities(area);

  appContent.innerHTML = `
    ${sectionHeading(meta.label, `Responsable: ${meta.manager}`, meta.status)}
    ${["Ventas", "Almacen", "Logistica", "Mantenimiento"].includes(area) ? `<section class="integration-banner"><strong>Capa de ejecución sobre MicroSip</strong><span>Los datos transaccionales permanecen en MicroSip; NEXUS controla responsables, compromisos, alertas, evidencias y KPIs.</span></section>` : ""}
    <div class="view-strip operational-strip">${capabilities.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    <section class="executive-grid">
      ${metricCard("Proyectos", projectItems.length)}
      ${metricCard("Tareas abiertas", taskItems.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("Incidencias abiertas", incidentItems.filter((item) => item.status !== "cerrado").length)}
      ${metricCard("KPIs fuera de rango", kpiItems.filter((item) => item.status !== "verde").length)}
      ${metricCard("Evidencias pendientes", taskItems.filter((item) => !item.evidence).length)}
      ${metricCard("Cumplimiento", `${taskItems.length ? Math.round((taskItems.filter((item) => item.status === "cerrado").length / taskItems.length) * 100) : 0}%`)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Ejecución</p><h3>Proyectos y compromisos</h3></div>${statusBadge(meta.status.toLowerCase())}</div>
      ${renderTable(["Proyecto", "Responsable", "Compromiso", "Avance", "Semáforo"], projectItems.map((item) => [item.name, item.owner, item.due, `${projectProgress(item)}%`, trafficBadge(executionSignal(item), executionSignalLabel(item))]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Indicadores</p><h3>KPIs del área</h3></div></div>
      ${renderTable(["KPI", "Actual", "Objetivo", "Tendencia", "Semáforo"], kpiItems.map((item) => [item.name, `${item.current}${item.unit}`, `${item.target}${item.unit}`, titleCase(item.trend), trafficBadge(item.status, titleCase(item.status))]))}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Antecedentes</p><h3>Reportes operativos</h3></div></div>
      ${exportActions("reports", normalizedFilters, area)}
      ${renderReportFilters(`area-${normalizeClassName(area)}`, normalizedFilters, { lockArea: area })}
      ${renderReportTable(items)}
    </section>
  `;

  bindReportFilters(`area-${normalizeClassName(area)}`, (nextFilters) => renderAreaModule(area, nextFilters), area);
}

function operationalCapabilities(area) {
  const map = {
    Ventas: ["CRM", "Pipeline", "Forecast", "Visitas", "Viáticos", "Muestras", "Comodatos", "KPIs"],
    Almacen: ["Inventario crítico", "Forecast", "Muestras", "Recepciones", "Diferencias", "KPIs"],
    Logistica: ["Rutas", "Entregas", "Facturas pendientes", "Liberaciones", "Evidencias", "KPIs"],
    Mantenimiento: ["Órdenes de trabajo", "Preventivos", "Refacciones", "Equipos espumadores", "Evidencias", "KPIs"],
  };
  return map[area] || ["Proyectos", "Tareas", "Incidencias", "Acuerdos", "Evidencias", "KPIs"];
}

function renderCaptureForm() {
  if (activeUser.access === "executive") {
    renderReportsView();
    return;
  }

  const availableAreas = activeUser.access === "area" ? gerencias.filter((item) => item.area === activeUser.area) : gerencias;
  appContent.innerHTML = `
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Captura</p><h3>Formulario general de reportes</h3></div></div>
      <form class="report-form" id="report-form">
        ${inputField("Fecha", "date", "report-date", todayIsoDate())}
        <label>Gerencia<select id="report-area">${availableAreas.map((item) => `<option value="${item.area}">${item.label}</option>`).join("")}</select></label>
        <label>Responsable<input id="report-responsible" type="text" value="${activeUser.name}"></label>
        <label>Frecuencia<select id="report-frequency"><option>semanal</option><option>quincenal</option><option>mensual</option></select></label>
        <label>Tipo<select id="report-type"><option>gasto</option><option>incidencia</option><option>solicitud</option><option>ahorro</option><option>mejora</option><option>reporte operativo</option></select></label>
        <label>Monto<input id="report-amount" type="number" min="0" value="0"></label>
        <label>Prioridad<select id="report-priority"><option>alta</option><option>media</option><option>baja</option></select></label>
        <label>Estatus<select id="report-status"><option>pendiente</option><option>en revision</option><option>falta evidencia</option><option>aprobado</option><option>rechazado</option><option>en ejecucion</option><option>cerrado</option></select></label>
        <label class="field-wide">Descripción<textarea id="report-description">Reporte operativo capturado en MENLUN Control 360.</textarea></label>
        <label>Evidencia archivo<input id="report-evidence-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.docx,.zip"></label>
        <label>Referencia evidencia<input id="report-evidence" type="text" placeholder="folio, liga o archivo externo"></label>
        <label class="field-wide">Comentarios<textarea id="report-comments">Sin comentarios adicionales.</textarea></label>
        <div class="form-actions"><button class="primary-button" type="submit">Guardar reporte</button></div>
      </form>
    </section>
  `;

  document.querySelector("#report-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectedArea = document.querySelector("#report-area").value;
    const rowId = createRowId("rep");
    const submitButton = event.submitter || document.querySelector("#report-form button[type='submit']");
    const evidenceFile = document.querySelector("#report-evidence-file").files[0];
    let evidenceValue = document.querySelector("#report-evidence").value.trim();

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    if (!(await ensureAppwriteWriteReady())) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar reporte";
      notify("No se puede guardar sin conexión al sistema.");
      return;
    }

    if (evidenceFile) {
      try {
        evidenceValue = await uploadEvidenceFile(evidenceFile, selectedArea);
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar reporte";
        notify("No se pudo subir la evidencia.");
        console.warn(error);
        return;
      }
    }

    const report = {
      rowId,
      id: rowId,
      date: document.querySelector("#report-date").value,
      area: selectedArea,
      responsible: document.querySelector("#report-responsible").value,
      frequency: document.querySelector("#report-frequency").value,
      type: document.querySelector("#report-type").value,
      amount: Number(document.querySelector("#report-amount").value || 0),
      priority: document.querySelector("#report-priority").value,
      status: document.querySelector("#report-status").value,
      description: document.querySelector("#report-description").value,
      evidence: evidenceValue,
      comments: document.querySelector("#report-comments").value,
      due: addDaysIso(6),
    };

    try {
      await createRow(TABLES.reportes, rowId, reportToAppwriteData(report));
      reports.unshift(report);
      notify("Reporte guardado correctamente.");
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar reporte";
      notify("No se pudo guardar el reporte en el sistema.");
      console.warn(error);
      return;
    }

    submitButton.disabled = false;
    submitButton.textContent = "Guardar reporte";

    const areaButton = document.querySelector(`[data-view="area"][data-area-key="${selectedArea}"]`);
    if (areaButton) {
      navButtons.forEach((item) => item.classList.remove("active"));
      areaButton.classList.add("active");
      moduleTitle.textContent = areaButton.dataset.module;
      moduleArea.textContent = areaButton.dataset.area;
    }

    renderAreaModule(selectedArea, { area: selectedArea });
  });
}

function renderReportsView(filters = {}) {
  const items = filterReports(visibleReports(), filters);
  appContent.innerHTML = `
    ${sectionHeading("Reportes", "Consulta ejecutiva de reportes", scopeText())}
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Solo lectura</p><h3>Reportes capturados</h3></div><span class="scope-pill">${items.length} reportes</span></div>
      ${exportActions("reports", filters)}
      ${renderReportFilters("reports", filters)}
      ${renderTable(["Fecha", "Gerencia", "Responsable", "Tipo", "Monto", "Prioridad", "Estatus", "Evidencia", "Descripción", "Acción"], items.map((item) => [
        item.date, labelForArea(item.area), item.responsible, item.type, formatCurrency(item.amount), priorityBadge(item.priority), statusBadge(item.status), evidenceCell(item.evidence), item.description, reportActions(item)
      ]))}
    </section>
  `;

  bindReportFilters("reports", renderReportsView);
}

function renderKanban(filters = {}) {
  const columns = ["pendiente", "en proceso", "con riesgo", "vencido", "cerrado"];
  const items = visibleTasks();
  appContent.innerHTML = `
    ${sectionHeading("Kanban", "Ejecución de proyectos por estatus", scopeText())}
    ${transformToolbar("tasks")}
    <section class="kanban-board">
      ${columns.map((status) => `
        <article class="kanban-column">
          <h3>${titleCase(status)} <span class="kanban-count">${items.filter((item) => normalizeExecutionStatus(item) === status).length}</span></h3>
          ${items.filter((item) => normalizeExecutionStatus(item) === status).map((item) => `
            <div class="kanban-card">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(projectName(item.projectId))}</span>
              <span>${escapeHtml(item.responsible)} · ${escapeHtml(labelForArea(item.area))}</span>
              <small>${priorityBadge(item.priority)} ${item.due}</small>
              ${activeUser?.access === "executive" ? "" : `<button class="secondary-button kanban-edit" type="button" data-action="edit-transform" data-module-key="tasks" data-target="${item.rowId}">Editar</button>`}
            </div>
          `).join("") || `<p class="muted-copy">Sin registros</p>`}
        </article>
      `).join("")}
    </section>
  `;
}

function renderCalendar() {
  const events = [];
  visibleTasks().forEach((item) => item.due && events.push({ date: item.due, label: `Tarea: ${item.title}`, signal: executionSignal(item) }));
  visibleAgreements().forEach((item) => item.due && events.push({ date: item.due, label: `Acuerdo: ${item.agreement}`, signal: executionSignal(item) }));
  visibleMeetings().forEach((item) => item.date && events.push({ date: item.date, label: `Reunión: ${item.title}`, signal: item.status === "cerrado" ? "verde" : "amarillo" }));
  visibleIncidents().forEach((item) => item.openDate && events.push({ date: item.openDate, label: `Incidencia: ${item.folio}`, signal: item.status === "cerrado" ? "verde" : "rojo" }));
  appContent.innerHTML = `
    ${sectionHeading("Calendario", "Junio 2026", scopeText())}
    <section class="calendar-grid">
      ${Array.from({ length: 30 }, (_, index) => {
        const day = index + 1;
        const dayEvents = events.filter((event) => Number(event.date.slice(-2)) === day);
        return `<article class="calendar-day ${day === Number(todayIsoDate().slice(-2)) ? "is-today" : ""}"><strong>${day}</strong>${dayEvents.map((event) => `<span class="calendar-${event.signal}">${escapeHtml(event.label)}</span>`).join("")}</article>`;
      }).join("")}
    </section>
  `;
}

function normalizeExecutionStatus(item) {
  const value = normalizePlainText(item.status);
  if (value === "cerrado") return "cerrado";
  if (["vencido", "vencida"].includes(value) || (item.due && item.due < todayIsoDate())) return "vencido";
  if (["con riesgo", "falta evidencia"].includes(value)) return "con riesgo";
  if (["en proceso", "en ejecucion", "en revision"].includes(value)) return "en proceso";
  return "pendiente";
}

function renderReportTable(items) {
  return renderTable(["Fecha", "Tipo", "Monto", "Prioridad", "Estatus", "Evidencia", "Descripción", "Acción"], items.map((item) => [
    item.date, item.type, formatCurrency(item.amount), priorityBadge(item.priority), statusBadge(item.status), evidenceCell(item.evidence), item.description, reportActions(item)
  ]));
}

function renderTable(headers, rows, extraClass = "") {
  return `<div class="table-wrap"><table class="${extraClass}"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function sectionHeading(kicker, title, pill) {
  return `<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h3>${title}</h3></div><span class="scope-pill">${pill}</span></div>`;
}

function metricCard(label, value) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function leadershipCompliance(item) {
  const rows = reports.filter((report) => report.area === item.area);
  if (!rows.length) return 100;
  const closed = rows.filter((report) => ["aprobado", "cerrado"].includes(report.status)).length;
  const evidenceScore = rows.filter((report) => report.evidence).length / rows.length;
  return Math.max(0, Math.min(100, Math.round(((closed / rows.length) * 70) + (evidenceScore * 30))));
}

function leadershipTrafficLight(item) {
  const rows = reports.filter((report) => report.area === item.area);
  const hasOverdue = rows.some((report) => report.due < todayIsoDate() && !["aprobado", "cerrado"].includes(report.status));
  const missingEvidence = rows.some((report) => !report.evidence || report.status === "falta evidencia");
  const overBudget = Number(item.spent || 0) > Number(item.budget || 0);
  const compliance = leadershipCompliance(item);

  if (hasOverdue || overBudget || compliance < 60) return { level: "rojo", label: "Riesgo crítico" };
  if (missingEvidence || compliance < 80) return { level: "amarillo", label: "Atención" };
  return { level: "verde", label: "En control" };
}

function riskSignal(item) {
  const probability = normalizePlainText(item.probability);
  const impact = normalizePlainText(item.impact);
  if (impact === "alto" && ["alta", "media"].includes(probability)) return "rojo";
  if (impact === "alto" || probability === "alta") return "amarillo";
  return "verde";
}

function trafficBadge(level, label) {
  return `<span class="traffic-badge traffic-${level}">${label}</span>`;
}

function reportActions(report) {
  if (activeUser?.access === "executive") return `<span class="muted-copy table-note">Solo lectura</span>`;
  if (activeUser?.access === "area" && activeUser.area !== report.area) return `<span class="muted-copy table-note">Sin acceso</span>`;

  const id = String(report.id);
  return `
    <div class="row-actions report-actions">
      <button class="secondary-button" type="button" data-action="edit-report" data-target="${id}">Editar</button>
      <button class="secondary-button" type="button" data-action="missing-evidence" data-target="${id}">Falta evidencia</button>
      <button class="secondary-button" type="button" data-action="approve-report" data-target="${id}">Aprobar</button>
      <button class="secondary-button" type="button" data-action="reject-report" data-target="${id}">Rechazar</button>
      <button class="secondary-button" type="button" data-action="close-report" data-target="${id}">Cerrar</button>
    </div>
  `;
}

function evidenceCell(value) {
  if (!value) return "Faltante";
  const [fileId, fileName] = String(value).split("|");
  if (fileId && fileName) {
    const url = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${STORAGE.evidencias}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(APPWRITE_CONFIG.projectId)}`;
    return `<a class="evidence-link" href="${url}" target="_blank" rel="noopener">${escapeHtml(fileName)}</a>`;
  }
  return escapeHtml(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inputField(label, type, id, value) {
  return `<label>${label}<input id="${id}" type="${type}" value="${value}"></label>`;
}

function priorityBadge(value) {
  return badge(titleCase(value), `priority-${normalizeClassName(value)}`);
}

function statusBadge(value) {
  return badge(titleCase(value), `status-${normalizeClassName(value)}`);
}

function badge(text, className) {
  return `<span class="badge ${className}">${text}</span>`;
}

function formatCurrency(amount) {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(amount);
}

function sum(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function scopeText() {
  if (!activeUser || activeUser.access === "all") return "Vista total";
  if (activeUser.access === "executive") return "Vista ejecutiva";
  return `Vista: ${activeUser.area}`;
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeClassName(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function notify(message) {
  let toast = document.querySelector("#app-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(notify.timeoutId);
  notify.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}
