const endpoint = process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "menlun-control-360";
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error("Falta APPWRITE_API_KEY.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
  "X-Appwrite-Response-Format": "1.9.5",
};

const bucketId = "evidencias";
const permissions = [
  'read("user:pako")',
  'read("user:direccion")',
  'update("user:pako")',
  'delete("user:pako")',
  'create("user:pako")',
  'create("user:jef-moises-prado")',
  'create("user:jef-guillermo-nieto")',
  'create("user:jef-jose-luis-sanchez")',
  'create("user:jef-jose-carlos-gonzalez")',
];

const existing = await request("GET", `/storage/buckets/${bucketId}`, null, [404]);

if (existing.status === 200) {
  await request("PUT", `/storage/buckets/${bucketId}`, {
    name: "Evidencias",
    permissions,
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 10485760,
    allowedFileExtensions: ["pdf", "png", "jpg", "jpeg", "webp", "xlsx", "xls", "doc", "docx", "csv", "zip", "mp4", "mov"],
    compression: "none",
    encryption: true,
    antivirus: true,
  });
  console.log("Bucket actualizado: evidencias");
} else {
  await request("POST", "/storage/buckets", {
    bucketId,
    name: "Evidencias",
    permissions,
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 10485760,
    allowedFileExtensions: ["pdf", "png", "jpg", "jpeg", "webp", "xlsx", "xls", "doc", "docx", "csv", "zip", "mp4", "mov"],
    compression: "none",
    encryption: true,
    antivirus: true,
  });
  console.log("Bucket creado: evidencias");
}

await hardenExistingFiles();

async function hardenExistingFiles() {
  const response = await request("GET", `/storage/buckets/${bucketId}/files`, null);
  const files = response.json.files || [];
  const securePermissions = [
    'read("user:pako")',
    'read("user:direccion")',
    'update("user:pako")',
    'delete("user:pako")',
  ];

  for (const file of files) {
    await request("PUT", `/storage/buckets/${bucketId}/files/${file.$id}`, {
      name: file.name,
      permissions: securePermissions,
    });
  }

  console.log(`Permisos cerrados en ${files.length} archivos existentes.`);
}

async function request(method, path, body, expectedSoftErrors = []) {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok && !expectedSoftErrors.includes(response.status)) {
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }

  return { status: response.status, json };
}
