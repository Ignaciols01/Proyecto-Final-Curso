# Manual de Despliegue

Para ejecutar el aplicativo en un entorno local de desarrollo, siga estos pasos:

1. **Requisitos Previos:** Asegúrese de tener instalados Node.js y Git en su equipo.
2. **Clonar el repositorio:** `git clone <url_del_repositorio>`
3. **Instalación de dependencias:** Navegue hasta la carpeta del proyecto en su terminal y ejecute:
   `npm install`
4. **Variables de Entorno:** Cree un archivo `.env` en la raíz del proyecto con las credenciales de la base de datos:
   `VITE_SUPABASE_URL=su_url_de_supabase`
   `VITE_SUPABASE_ANON_KEY=su_clave_anonima`
5. **Ejecución:** Levante el servidor de desarrollo ejecutando:
   `npm run dev`