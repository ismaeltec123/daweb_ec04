# Guía de Despliegue en Render

## Problemas de Conexión a PostgreSQL

Si estás experimentando errores de conexión como `ETIMEDOUT` o `ECONNREFUSED` al intentar conectarte a la base de datos PostgreSQL, esto puede deberse a varias razones:

1. **Conexión a bases de datos remotas desde entorno local:**
   - Las bases de datos de Render son accesibles principalmente desde servicios desplegados en Render.
   - Conexiones desde tu máquina local pueden ser bloqueadas por firewalls, restricciones de red o políticas de seguridad.

2. **Posibles soluciones para pruebas locales:**
   - Usa PostgreSQL instalado localmente para desarrollo
   - Comenta la variable `DATABASE_URL` en el archivo `.env` para usar la configuración local
   - Asegúrate de que PostgreSQL esté instalado y ejecutándose en tu máquina

## Pasos para Desplegar en Render

1. **Crea una cuenta en Render** (si aún no tienes una)

2. **Crea una base de datos PostgreSQL:**
   - Ve a "PostgreSQL" en el dashboard de Render
   - Haz clic en "New PostgreSQL"
   - Completa el formulario con el nombre "ec04-db"
   - Elige el plan gratuito
   - Haz clic en "Create Database"

3. **Crea un nuevo Web Service:**
   - Ve a "Web Services" en el dashboard de Render
   - Haz clic en "New Web Service"
   - Conecta tu repositorio de GitHub
   - Configura el servicio:
     - **Name:** ec04-backend
     - **Environment:** Node
     - **Build Command:** `npm install && npm run render-build`
     - **Start Command:** `npm run render-start`
     - **Root Directory:** `backend` (si tu repositorio contiene ambos, frontend y backend)

4. **Configura las variables de entorno:**
   - En la sección "Environment" del servicio, añade:
     - `DATABASE_URL`: Automáticamente configurado si enlazas la base de datos PostgreSQL
     - `JWT_SECRET`: Un valor aleatorio seguro para firmar tokens

5. **Despliega el servicio:**
   - Haz clic en "Create Web Service"
   - Render empezará a construir y desplegar tu aplicación

## Verificación del Despliegue

Una vez desplegado, puedes verificar que todo funciona correctamente:

1. Visita la URL del servicio (algo como `https://ec04-backend.onrender.com`)
2. Deberías ver un mensaje JSON: `{ "message": "API de gestión de cursos funcionando correctamente", "time": "..." }`
3. Prueba las rutas de la API, como `/api/auth/login` con un cliente HTTP como Postman

## Conexión del Frontend

Para conectar tu frontend Next.js al backend desplegado:

1. Actualiza el archivo `.env.local` en el directorio frontend:
   ```
   NEXT_PUBLIC_API_URL=https://ec04-backend.onrender.com/api
   ```

2. Despliega el frontend en Vercel o Render
   - Para Vercel: Simplemente importa el repositorio y configura el directorio raíz como `frontend`
   - Para Render: Crea un nuevo Web Service y configura el directorio raíz como `frontend`

## Solución de Problemas

Si encuentras problemas después del despliegue:

1. **Errores 500 o problemas de conexión:**
   - Revisa los logs del servicio en Render
   - Verifica que la base de datos esté correctamente enlazada
   - Comprueba que las variables de entorno están configuradas correctamente

2. **Problemas de CORS:**
   - Asegúrate de que el middleware CORS en el backend esté configurado para permitir peticiones desde tu frontend

3. **Errores de autenticación:**
   - Verifica que el `JWT_SECRET` esté configurado correctamente
   - Comprueba que los tokens están siendo generados y validados correctamente
