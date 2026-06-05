const APPWRITE_CONFIG = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  projectId: "menlun-control-360",
  databaseId: "menlun_control_360",
};

const TABLES = {
  gerencias: "gerencias",
  usuarios: "usuarios",
  reportes: "reportes",
  evidencias: "evidencias",
  bitacora: "bitacora",
};

const STORAGE = {
  evidencias: "evidencias",
};

const SYSTEM_USERS = [
  { name: "Pako", role: "Administrador General", email: "pako@menlun.com", access: "all" },
  { name: "Carmen", role: "Acceso Total Operativo", email: "carmen@menlun.com", access: "all" },
  { name: "Direccion General", role: "Vista Ejecutiva", email: "direccion@menlun.com", access: "executive" },
];

const authenticatedRowPermissions = ['read("users")', 'update("users")', 'delete("users")'];

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
const emailInput = document.querySelector("#email");
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

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const secret = passwordInput.value.trim();

  try {
    await loginWithAppwrite(email, secret);
    await initializeAppData();
  } catch (error) {
    loginError.textContent = "Usuario o contraseña incorrectos, o backend no disponible.";
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
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  await logoutFromAppwrite();

  activeUser = null;
  emailInput.value = "";
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
  document.querySelector('[data-view="executive"]')?.classList.add("active");
  logoutButton.disabled = false;
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.hidden) return;
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    navigate(button.dataset.view, button.dataset.module, button.dataset.area, button.dataset.areaKey);
  });
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
    if (action === "new-management") await createManagement();
    if (action === "edit-management") await editManagement(target);
    if (action === "disable-management") await disableManagement(target);
    if (action === "edit-report") await editReport(target);
    if (action === "approve-report") await changeReportStatus(target, "aprobado");
    if (action === "reject-report") await changeReportStatus(target, "rechazado");
    if (action === "missing-evidence") await changeReportStatus(target, "falta evidencia");
    if (action === "close-report") await changeReportStatus(target, "cerrado");
  } catch (error) {
    notify("No se pudo completar la acción. Revisa conexión con Appwrite.");
    console.warn(error);
  }
});

async function initializeAppData() {
  setDataStatus("Conectando Appwrite...", "loading");

  try {
    const [remoteGerencias, remoteUsers, remoteReports, remoteAuditLogs] = await Promise.all([
      listRows(TABLES.gerencias),
      listRows(TABLES.usuarios),
      listRows(TABLES.reportes),
      listRows(TABLES.bitacora),
    ]);

    if (remoteGerencias.length) {
      gerencias = remoteGerencias.map(mapGerenciaRow);
    }

    if (remoteUsers.length) {
      userProfiles = [
        ...remoteUsers.map(mapUserRow),
        ...gerencias.map((item) => ({
          name: item.manager,
          role: item.role,
          email: item.email,
          access: "area",
          area: item.area,
          status: item.status,
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

    appwriteOnline = true;
    appwriteDataLoaded = true;
    setDataStatus("Appwrite conectado", "online");
  } catch (error) {
    appwriteOnline = false;
    setDataStatus("Backend no disponible", "offline");
    console.warn("Appwrite no disponible.", error);
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

function buildUsers() {
  return [
    ...SYSTEM_USERS,
    ...gerencias.map((item) => ({
      name: item.manager,
      role: item.role,
      email: item.email,
      access: "area",
      area: item.area,
    })),
  ];
}

function findUserProfile(email) {
  return userProfiles.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.status !== "Inactivo");
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
      throw new Error(data.message || `Error Appwrite ${response.status}`);
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
        reject(new Error(data.message || `Error Appwrite ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("No se pudo conectar con Appwrite."));
    xhr.send(body);
  });
}

async function listRows(tableId) {
  const data = await appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows`);
  return data.rows || [];
}

async function createRow(tableId, rowId, data) {
  return appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows`, {
    method: "POST",
    body: { rowId, data, permissions: authenticatedRowPermissions },
  });
}

async function updateRow(tableId, rowId, data) {
  return appwriteRequest(`/tablesdb/${APPWRITE_CONFIG.databaseId}/tables/${tableId}/rows/${rowId}`, {
    method: "PATCH",
    body: { data, permissions: authenticatedRowPermissions },
  });
}

async function uploadEvidenceFile(file) {
  if (!file) return "";

  const fileId = createRowId("file");
  const formData = new FormData();
  formData.append("fileId", fileId);
  formData.append("file", file);
  authenticatedRowPermissions.forEach((permission) => formData.append("permissions[]", permission));

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
    name: row.nombre || row.email,
    role,
    email: row.email,
    access,
    area,
    status: row.estatus || "Activo",
  };
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
    notify("No se puede crear gerencia sin conexión al backend.");
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
    notify("No se puede actualizar gerencia sin conexión al backend.");
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
    notify("No se puede cambiar estatus sin conexión al backend.");
    return;
  }

  const nextStatus = item.status === "Activo" ? "Inactivo" : "Activo";
  await updateRow(TABLES.gerencias, item.rowId, managementToAppwriteData({ ...item, status: nextStatus }));
  item.status = nextStatus;
  userProfiles = buildUsers();

  notify(`${label} cambió a ${item.status}.`);
  renderManagementPanel();
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
        throw new Error("Backend no disponible.");
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
      notify("No se pudo guardar el reporte.");
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
        throw new Error("Backend no disponible.");
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
    if (button.dataset.view === "carmen") button.hidden = !hasFullAccess();
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
  });
}

function navigateInitialView() {
  let target = document.querySelector('[data-view="executive"]');

  if (activeUser.access === "area") {
    target = document.querySelector(`[data-view="area"][data-area-key="${activeUser.area}"]`);
  }

  navButtons.forEach((item) => item.classList.remove("active"));
  target.classList.add("active");
  navigate(target.dataset.view, target.dataset.module, target.dataset.area, target.dataset.areaKey);
}

function navigate(view, title, area, areaKey) {
  moduleTitle.textContent = title;
  moduleArea.textContent = area;

  if (view === "executive") renderExecutiveDashboard();
  if (view === "carmen") renderCarmenPanel();
  if (view === "capture") renderCaptureForm(areaKey);
  if (view === "kanban") renderKanban();
  if (view === "calendar") renderCalendar();
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
    ["Reportes vencidos", items.filter((item) => item.status === "pendiente" && item.due < "2026-06-04").length],
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

function renderExecutiveDashboard() {
  const items = visibleReports();
  const budgetUsed = sum(items.filter((item) => item.type === "gasto"), "amount");
  const budgetTotal = gerencias.reduce((total, item) => total + item.budget, 0);
  const savings = sum(items.filter((item) => item.type === "ahorro"), "amount");
  const openIncidents = items.filter((item) => item.type === "incidencia" && !["cerrado", "rechazado"].includes(item.status)).length;
  const overdueReports = items.filter((item) => item.status === "pendiente" && item.due < "2026-06-04").length;
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
  appContent.innerHTML = `
    ${sectionHeading("Panel Carmen", "Control ejecutivo de autorizaciones", scopeText())}
    <section class="executive-grid">
      ${metricCard("Reportes pendientes", items.filter((item) => item.status === "pendiente").length)}
      ${metricCard("Solicitudes por aprobar", items.filter((item) => item.type === "solicitud" && ["pendiente", "en revision"].includes(item.status)).length)}
      ${metricCard("Gastos fuera de presupuesto", items.filter((item) => item.type === "gasto" && item.amount > 90000).length)}
      ${metricCard("Incidencias críticas", items.filter((item) => item.type === "incidencia" && item.priority === "alta").length)}
      ${metricCard("Evidencias faltantes", items.filter((item) => !item.evidence || item.status === "falta evidencia").length)}
      ${metricCard("Tareas vencidas", items.filter((item) => item.due < "2026-06-04" && !["cerrado", "aprobado"].includes(item.status)).length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Autorizaciones</p><h3>Bandeja de autorización</h3></div><span class="scope-pill">${items.length} reportes</span></div>
      ${exportActions("reports", filters)}
      ${renderReportFilters("carmen", filters)}
      ${renderTable(["Fecha", "Gerencia", "Responsable", "Tipo", "Monto", "Prioridad", "Estatus", "Acción"], items.map((item) => [
        item.date, labelForArea(item.area), item.responsible, item.type, formatCurrency(item.amount), priorityBadge(item.priority), statusBadge(item.status), reportActions(item)
      ]))}
    </section>
  `;

  bindReportFilters("carmen", renderCarmenPanel);
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
  const gastos = sum(items.filter((item) => item.type === "gasto"), "amount");
  const ahorros = sum(items.filter((item) => item.type === "ahorro"), "amount");

  appContent.innerHTML = `
    ${sectionHeading(meta.label, `Responsable: ${meta.manager}`, meta.status)}
    <section class="executive-grid">
      ${metricCard("Reportes capturados", items.length)}
      ${metricCard("Gastos", formatCurrency(gastos))}
      ${metricCard("Incidencias", items.filter((item) => item.type === "incidencia").length)}
      ${metricCard("Solicitudes", items.filter((item) => item.type === "solicitud").length)}
      ${metricCard("Ahorros", formatCurrency(ahorros))}
      ${metricCard("Evidencias", items.filter((item) => item.evidence).length)}
    </section>
    <section class="content-card">
      <div class="section-heading section-heading-compact"><div><p class="eyebrow">Resumen del área</p><h3>Estatus operativo</h3></div>${statusBadge(meta.status.toLowerCase())}</div>
      <p class="muted-copy">Frecuencia de reporte: ${meta.frequency}. Último reporte: ${meta.lastReport}. Presupuesto asignado: ${formatCurrency(meta.budget)}.</p>
      ${exportActions("reports", normalizedFilters, area)}
      ${renderReportFilters(`area-${normalizeClassName(area)}`, normalizedFilters, { lockArea: area })}
      ${renderReportTable(items)}
    </section>
  `;

  bindReportFilters(`area-${normalizeClassName(area)}`, (nextFilters) => renderAreaModule(area, nextFilters), area);
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
        ${inputField("Fecha", "date", "report-date", "2026-06-04")}
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

    if (!appwriteOnline) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar reporte";
      notify("No se puede guardar sin conexión al backend.");
      return;
    }

    if (evidenceFile) {
      try {
        evidenceValue = await uploadEvidenceFile(evidenceFile);
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
      due: "2026-06-10",
    };

    try {
      await createRow(TABLES.reportes, rowId, reportToAppwriteData(report));
      reports.unshift(report);
      notify("Reporte guardado correctamente.");
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar reporte";
      notify("No se pudo guardar el reporte en backend.");
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
  const columns = ["pendiente", "en revision", "falta evidencia", "aprobado", "rechazado", "en ejecucion", "cerrado"];
  const items = filterReports(visibleReports(), filters);
  appContent.innerHTML = `
    ${sectionHeading("Kanban", "Seguimiento por estatus", scopeText())}
    <section class="content-card">
      ${exportActions("reports", filters)}
      ${renderReportFilters("kanban", filters)}
    </section>
    <section class="kanban-board">
      ${columns.map((status) => `
        <article class="kanban-column">
          <h3>${titleCase(status)}</h3>
          ${items.filter((item) => item.status === status).map((item) => `
            <div class="kanban-card">
              <strong>${labelForArea(item.area)}</strong>
              <span>${item.type} - ${item.responsible}</span>
              <small>${priorityBadge(item.priority)} ${formatCurrency(item.amount)}</small>
            </div>
          `).join("") || `<p class="muted-copy">Sin registros</p>`}
        </article>
      `).join("")}
    </section>
  `;

  bindReportFilters("kanban", renderKanban);
}

function renderCalendar() {
  appContent.innerHTML = `
    ${sectionHeading("Calendario", "Junio 2026", scopeText())}
    <section class="calendar-grid">
      ${Array.from({ length: 30 }, (_, index) => {
        const day = index + 1;
        const events = calendarEvents.filter((event) => event.day === day);
        return `<article class="calendar-day"><strong>${day}</strong>${events.map((event) => `<span>${event.title}</span>`).join("")}</article>`;
      }).join("")}
    </section>
  `;
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
