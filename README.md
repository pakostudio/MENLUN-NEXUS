# MENLUN NEXUS

MENLUN NEXUS es la plataforma de gestión, ejecución y control operativo de MENLUN. Funciona como capa superior de seguimiento sobre MicroSip: MicroSip conserva facturación, inventarios, compras, clientes, productos y cuentas; NEXUS controla proyectos, responsables, compromisos, evidencias, indicadores, riesgos y decisiones.

La aplicación está construida con HTML, CSS y JavaScript puro, usa identidad PMPS y se conecta con Appwrite Cloud.

## Accesos

| Usuario | Alcance | PIN |
| --- | --- | --- |
| Administrador General | Control total | `0000` |
| Dirección General | Consulta ejecutiva | `0099` |
| Moisés Prado / Almacén | Solo Almacén | `0001` |
| Guillermo Nieto / Logística | Solo Logística | `0002` |
| José Luis Sánchez / Mantenimiento | Solo Mantenimiento | `0003` |
| José Carlos González / Ventas | Solo Ventas | `0004` |

La interfaz valida el PIN operativo y mantiene una sesión real de Appwrite Auth. Las contraseñas técnicas de Appwrite no se exponen en el frontend.

## Arquitectura funcional

- **Dirección:** dashboard ejecutivo, Dashboard Carmen y centro automático de alertas.
- **Ejecución:** proyectos, tareas, subtareas, acuerdos, incidencias, reuniones, evidencias y KPIs.
- **Vistas:** lista, Kanban, calendario, Timeline, Gantt, Pipeline y reportes.
- **Transformación:** diagnóstico base, entrevistas, mapa de dolor, diagnóstico ejecutivo, estrategia, plan de trabajo, seguimiento, riesgos, beneficios y lecciones aprendidas.
- **Administración:** usuarios, jefaturas, gerencias, responsables, indicadores y bitácora.
- **Áreas:** Ventas, Almacén, Logística, Mantenimiento y áreas de soporte, sin duplicar funciones transaccionales de MicroSip.

El flujo central es:

`Proyecto -> Tarea -> Subtarea -> Responsable -> Fecha compromiso -> Evidencia -> KPI -> Cierre`

## Permisos

- Administrador General puede crear, editar, eliminar, reasignar, cerrar y reabrir registros.
- Dirección consulta dashboards, reportes, calendario, riesgos y beneficios sin editar.
- Cada jefatura solo ve y captura información de su propia área.
- Appwrite aplica seguridad por fila; la interfaz refuerza el mismo alcance.

## Backend

- Endpoint: `https://nyc.cloud.appwrite.io/v1`
- Project ID: `menlun-control-360`
- Database ID: `menlun_control_360`
- Bucket: `evidencias`
- Configuración pública: `appwriteConfig.js`

El workflow manual `.github/workflows/setup-appwrite.yml` crea o actualiza tablas, datos iniciales, permisos y almacenamiento usando el secret `APPWRITE_API_KEY`.

El workflow `.github/workflows/appwrite-heartbeat.yml` comprueba el estado y escribe actividad técnica. En Appwrite Free esto sirve como monitoreo, pero Appwrite puede pausar el proyecto según su política; no equivale a disponibilidad garantizada.

## Preparación del backend

1. Configurar `APPWRITE_API_KEY` en **Settings > Secrets and variables > Actions**.
2. Ejecutar **Actions > Prepare Appwrite backend > Run workflow**.
3. Confirmar que finalicen los pasos de tablas y almacenamiento.
4. Ejecutar **Appwrite heartbeat** y confirmar una corrida verde.

También puede prepararse localmente:

```bash
APPWRITE_API_KEY="TU_API_KEY" node scripts/setup-appwrite.mjs
APPWRITE_API_KEY="TU_API_KEY" node scripts/setup-appwrite-storage.mjs
```

## Evidencias

El Centro de Evidencias acepta PDF, Word, Excel, CSV, ZIP, imágenes y video, con máximo de 10 MB por archivo. Cada evidencia se relaciona con un proyecto, tarea, acuerdo, incidencia o reunión.

## Despliegue en GitHub Pages

1. Subir el repositorio completo a GitHub.
2. Abrir **Settings > Pages**.
3. Seleccionar **Deploy from a branch**, rama `main`, carpeta `/root`.
4. Mantener `pakostudio.github.io` registrado como Web Platform en Appwrite.
5. Ejecutar el workflow de preparación del backend después de cambios de esquema.

No hay proceso de compilación. GitHub Pages publica directamente `index.html`, `styles.css`, `app.js`, `appwriteConfig.js` y `assets/`.

## Riesgos operativos

- Appwrite Free puede pausar proyectos; antes de una presentación debe verificarse la disponibilidad.
- La disponibilidad garantizada requiere un plan con SLA o migrar el backend a una infraestructura acordada.
- MicroSip continúa siendo la fuente transaccional; NEXUS no sustituye ni replica su contabilidad o inventarios.
