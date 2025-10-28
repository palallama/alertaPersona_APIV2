# Módulo de Estadísticas

Este módulo proporciona endpoints para consultar estadísticas del sistema de alertas y usuarios.

## 📊 Endpoints Disponibles

### 1. Alertas por Usuario
**GET** `/estadisticas/alertas/usuario/:usuarioId`

Obtiene estadísticas de alertas de un usuario específico.

**Parámetros de ruta:**
- `usuarioId` (number): ID del usuario

**Query params opcionales:**
- `desde` (string): Fecha inicio en formato ISO 8601
- `hasta` (string): Fecha fin en formato ISO 8601

**Respuesta:**
```json
{
  "usuarioId": 1,
  "total": 15,
  "abiertas": 3,
  "cerradas": 12,
  "porEstado": [
    { "estado": "E", "cantidad": 2 },
    { "estado": "C", "cantidad": 1 },
    { "estado": "S", "cantidad": 10 },
    { "estado": "X", "cantidad": 2 }
  ],
  "filtros": {
    "desde": "2025-01-01T00:00:00.000Z",
    "hasta": "2025-12-31T23:59:59.999Z"
  }
}
```

### 2. Alertas Totales
**GET** `/estadisticas/alertas/totales`

Obtiene estadísticas generales de todas las alertas del sistema.

**Query params opcionales:**
- `desde` (string): Fecha inicio en formato ISO 8601
- `hasta` (string): Fecha fin en formato ISO 8601

**Respuesta:**
```json
{
  "total": 150,
  "abiertas": 25,
  "cerradas": 125,
  "porEstado": [
    { "estado": "E", "cantidad": 20 },
    { "estado": "C", "cantidad": 5 },
    { "estado": "S", "cantidad": 100 },
    { "estado": "X", "cantidad": 25 }
  ],
  "top10Usuarios": [
    { "usuarioId": 1, "cantidad": 15 },
    { "usuarioId": 2, "cantidad": 12 }
  ],
  "filtros": {
    "desde": null,
    "hasta": null
  }
}
```

### 3. Alertas Emitidas
**GET** `/estadisticas/alertas/emitidas`

Obtiene estadísticas de alertas emitidas con posibilidad de filtrar por estado.

**Query params opcionales:**
- `desde` (string): Fecha inicio en formato ISO 8601
- `hasta` (string): Fecha fin en formato ISO 8601
- `estado` (string): Estado de alerta - `E` (Emitida), `C` (Cancelada), `S` (Solucionada), `X` (Expirada)

**Respuesta:**
```json
{
  "total": 150,
  "abiertas": 25,
  "cerradas": 125,
  "porEstado": [
    { "estado": "E", "cantidad": 20 },
    { "estado": "C", "cantidad": 5 },
    { "estado": "S", "cantidad": 100 },
    { "estado": "X", "cantidad": 25 }
  ],
  "promedioPorDia": "4.11",
  "filtros": {
    "desde": "2025-01-01T00:00:00.000Z",
    "hasta": "2025-12-31T23:59:59.999Z",
    "estado": null
  }
}
```

### 4. Usuarios Registrados
**GET** `/estadisticas/usuarios/registrados`

Obtiene estadísticas de usuarios registrados en el sistema.

**Respuesta:**
```json
{
  "total": 250,
  "activos": 230,
  "inactivos": 20,
  "validados": 200,
  "noValidados": 50,
  "registradosUltimos30Dias": 15,
  "porGenero": [
    { "genero": "M", "cantidad": 120 },
    { "genero": "F", "cantidad": 110 },
    { "genero": "O", "cantidad": 20 }
  ]
}
```

## 📝 Estados de Alerta

- **E**: Emitida
- **C**: Cancelada
- **S**: Solucionada
- **X**: Expirada

## 📅 Formato de Fechas

Todas las fechas deben estar en formato **ISO 8601**:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

Ejemplo:
```
2025-01-01T00:00:00.000Z
2025-12-31T23:59:59.999Z
```

## 🔧 Ejemplos de Uso

### Con curl
```bash
# Alertas de usuario 1 del mes actual
curl "http://localhost:3000/estadisticas/alertas/usuario/1?desde=2025-10-01T00:00:00.000Z&hasta=2025-10-31T23:59:59.999Z"

# Alertas totales sin filtros
curl "http://localhost:3000/estadisticas/alertas/totales"

# Alertas emitidas con estado específico
curl "http://localhost:3000/estadisticas/alertas/emitidas?estado=E"

# Usuarios registrados
curl "http://localhost:3000/estadisticas/usuarios/registrados"
```

### Desde el archivo .http
Abre el archivo `estadisticas.http` en VS Code con la extensión REST Client y ejecuta las peticiones directamente.

## 📚 Documentación Swagger

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api
```

Allí encontrarás todos los endpoints documentados con ejemplos y podrás probarlos directamente desde el navegador.

## 🔐 Autenticación

Si los endpoints requieren autenticación, asegúrate de incluir el token JWT en el header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 💡 Notas

- Los endpoints de estadísticas son de **solo lectura**
- Las consultas están optimizadas con índices en la base de datos
- Los filtros de fecha son inclusivos (incluyen el día desde y hasta)
- El promedio por día solo se calcula cuando se proporciona rango de fechas completo
