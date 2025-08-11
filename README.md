# Odrix - Strava Analytics Dashboard

Una aplicación web desarrollada con Next.js y TypeScript que se integra con la API de Strava para mostrar análisis detallados de tus actividades deportivas.

## 🚀 Características

- ✅ Autenticación OAuth con Strava
- ✅ Dashboard con estadísticas generales
- ✅ Visualización de actividades recientes
- ✅ Métricas de rendimiento
- ✅ Interfaz responsiva con Tailwind CSS

## 📋 Configuración de Strava API

### 1. Crear una aplicación en Strava

1. Ve a [Strava Developers](https://developers.strava.com/)
2. Haz clic en "Create & Manage Your App"
3. Completa el formulario con los siguientes datos:
   - **Application Name**: Odrix (o el nombre que prefieras)
   - **Category**: Data Importer o la categoría más apropiada
   - **Website**: http://localhost:3000 (para desarrollo)
   - **Authorization Callback Domain**: `localhost` (para desarrollo local)

### 2. URLs de devolución de llamada

Para **desarrollo local**:
```
http://localhost:3000/api/auth/callback/strava
```

Para **producción** (Vercel):
```
https://odrix-74wom1lse-nicolas-projects-22862e8e.vercel.app/api/auth/callback/strava
```

### 3. Configurar variables de entorno

Copia tus credenciales de Strava al archivo `.env.local`:

```bash
# Strava API Configuration
STRAVA_CLIENT_ID=tu_client_id_de_strava
STRAVA_CLIENT_SECRET=tu_client_secret_de_strava
STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/callback/strava

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=hLmyfSabCEgQXqA1IqNJX0QLFhmawIw3fMG6u6ZxzS8=
```

## 🛠️ Instalación y ejecución

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
   - Copia el archivo `.env.local` y completa con tus credenciales de Strava

3. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
   - Ve a [http://localhost:3000](http://localhost:3000)

## 📱 Estructura del proyecto

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # Configuración de NextAuth
│   ├── auth/                       # Páginas de autenticación
│   ├── dashboard/                  # Dashboard principal
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                   # Página de inicio
├── components/
│   ├── AuthProvider.tsx           # Proveedor de autenticación
│   └── Navbar.tsx                 # Barra de navegación
├── lib/
│   └── strava.ts                  # Servicio de la API de Strava
└── types/
    └── next-auth.d.ts             # Tipos de TypeScript para NextAuth
```

## 🔧 Tecnologías utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **NextAuth.js** - Autenticación OAuth
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Strava API v3** - Datos deportivos

## 🚀 Despliegue en Vercel

1. **Configura las variables de entorno en Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Añade las variables de entorno de producción
   - Actualiza las URLs para producción

2. **Actualiza la configuración de Strava**:
   - Cambia el "Authorization Callback Domain" a tu dominio de Vercel
   - Actualiza la variable `STRAVA_REDIRECT_URI` en Vercel

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
