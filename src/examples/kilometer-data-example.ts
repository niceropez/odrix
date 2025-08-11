// Ejemplo de datos procesados por la funcionalidad de streams
// Similar al output del notebook de Python

/* 
Datos por kilómetro:
Km  Pace   Elev  HR
1   6:25  6     146
2   6:40  12    151
3   6:06  15    165
4   6:15  0     162
5   5:47  16    169
6   5:53  -12   170
7   5:55  -8    172
8   5:49  -14   171
9   5:59  16    175
10  5:48  8     171
11  5:53  -3    168
12  0:35  1     176
*/

// Esta funcionalidad se implementa en:
// 1. src/lib/strava.ts - Tipos y funciones de procesamiento
// 2. src/components/KilometerAnalysis.tsx - Componente de visualización
// 3. src/app/activities/[id]/page.tsx - Integración en la página de actividad

// Ejemplo de datos que devuelve calculateKilometerData():
const exampleKilometerData = [
  { km: 1, pace: "6:25", elevation: 6, heartrate: 146, speed: 9.38, distance: 1000, time: 385 },
  { km: 2, pace: "6:40", elevation: 12, heartrate: 151, speed: 9.0, distance: 1000, time: 400 },
  { km: 3, pace: "6:06", elevation: 15, heartrate: 165, speed: 9.84, distance: 1000, time: 366 },
  { km: 4, pace: "6:15", elevation: 0, heartrate: 162, speed: 9.6, distance: 1000, time: 375 },
  { km: 5, pace: "5:47", elevation: 16, heartrate: 169, speed: 10.37, distance: 1000, time: 347 },
  { km: 6, pace: "5:53", elevation: -12, heartrate: 170, speed: 10.2, distance: 1000, time: 353 },
  { km: 7, pace: "5:55", elevation: -8, heartrate: 172, speed: 10.15, distance: 1000, time: 355 },
  { km: 8, pace: "5:49", elevation: -14, heartrate: 171, speed: 10.3, distance: 1000, time: 349 },
  { km: 9, pace: "5:59", elevation: 16, heartrate: 175, speed: 10.03, distance: 1000, time: 359 },
  { km: 10, pace: "5:48", elevation: 8, heartrate: 171, speed: 10.34, distance: 1000, time: 348 },
  { km: 11, pace: "5:53", elevation: -3, heartrate: 168, speed: 10.2, distance: 1000, time: 353 },
  { km: 12, pace: "0:35", elevation: 1, heartrate: 176, speed: 17.14, distance: 97, time: 35 } // último km parcial
];

export default exampleKilometerData;
