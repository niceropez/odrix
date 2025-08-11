# Análisis de Actividades por Kilómetro - Odrix

## 📊 Nueva Funcionalidad: Streams de Actividades

Esta actualización agrega la capacidad de analizar datos detallados por kilómetro de cada actividad de Strava, similar a como lo muestra la aplicación oficial de Strava.

### 🎯 Características Implementadas

#### 1. **Endpoint de Streams**
- Se ha agregado el método `getActivityStreams()` al servicio de Strava
- Obtiene datos detallados: tiempo, distancia, coordenadas, altitud, velocidad, frecuencia cardíaca, cadencia, etc.

#### 2. **Procesamiento de Datos por Kilómetro**
- Función `calculateKilometerData()` que procesa los streams
- Calcula para cada kilómetro:
  - **Pace** (tiempo por kilómetro en formato min:seg)
  - **Elevación ganada** (metros de subida)
  - **Frecuencia cardíaca promedio** (si está disponible)
  - **Velocidad promedio** (km/h)

#### 3. **Visualización Interactiva**
- **Tabla de datos**: Información clara y organizada por kilómetro
- **Gráfico combinado**: 
  - Barras verdes para elevación
  - Línea azul para velocidad
  - Línea roja punteada para frecuencia cardíaca
- **Tooltips interactivos** con todos los datos del kilómetro

### 🛠️ Implementación Técnica

#### Nuevos Tipos TypeScript
```typescript
interface StravaStreams {
  time?: { data: number[] };
  distance?: { data: number[] };
  altitude?: { data: number[] };
  heartrate?: { data: number[] };
  velocity_smooth?: { data: number[] };
  // ... más streams
}

interface KilometerData {
  km: number;
  pace: string;
  elevation: number;
  heartrate: number | null;
  speed: number;
  distance: number;
  time: number;
}
```

#### Nuevo Componente
- `KilometerAnalysis.tsx`: Componente reutilizable para mostrar el análisis
- Usa Recharts para gráficos interactivos
- Diseño responsive y accesible

### 📱 Experiencia de Usuario

1. **Carga bajo demanda**: Los datos se cargan solo cuando se solicitan
2. **Indicadores de carga**: Feedback visual durante la obtención de datos
3. **Datos fáciles de entender**: Formato similar a Strava (km, pace, elevación, FC)
4. **Gráficos intuitivos**: Visualización clara del rendimiento por kilómetro

### 🎨 Mejoras de UI/UX

- **Código de colores**: 
  - Verde para elevación positiva
  - Rojo para elevación negativa
  - Colores distintivos para frecuencia cardíaca
- **Tipografía mejorada**: Fuente monospace para pace
- **Tabla responsive**: Se adapta a diferentes tamaños de pantalla
- **Leyenda explicativa**: Ayuda a interpretar los gráficos

### 🔄 Flujo de Trabajo

1. Usuario ve lista de actividades
2. Hace clic en una actividad específica
3. Ve información básica de la actividad
4. Hace clic en "Cargar Datos Detallados"
5. Sistema obtiene streams de Strava
6. Procesa datos por kilómetro
7. Muestra tabla y gráficos interactivos

### 📈 Datos Mostrados

#### Tabla por Kilómetro
| Km | Pace | Elevación | FC |
|----|------|-----------|-----|
| 1  | 6:25 | +6m       | 146 bpm |
| 2  | 6:40 | +12m      | 151 bpm |
| 3  | 6:06 | +15m      | 165 bpm |

#### Gráfico Combinado
- **Eje Y izquierdo**: Elevación (metros)
- **Eje Y derecho**: Velocidad (km/h) y FC (bpm)
- **Eje X**: Kilómetros
- **Interactividad**: Hover para ver todos los datos

### 🚀 Próximas Mejoras

- [ ] Análisis de zonas de frecuencia cardíaca
- [ ] Comparación entre actividades
- [ ] Exportación de datos
- [ ] Integración con mapas para mostrar el perfil de elevación
- [ ] Análisis de cadencia y potencia (para actividades que los tengan)

### 🔧 Instalación de Dependencias

```bash
npm install recharts
```

### 📋 Archivos Modificados

- `src/lib/strava.ts` - Servicio y tipos actualizados
- `src/app/activities/[id]/page.tsx` - Página de detalle actualizada
- `src/components/KilometerAnalysis.tsx` - Nuevo componente (NUEVO)
- `package.json` - Nueva dependencia Recharts

Esta implementación proporciona una experiencia similar a la aplicación oficial de Strava, con datos claros y visualizaciones intuitivas que ayudan a los usuarios a entender mejor su rendimiento por kilómetro.
