# Manual Técnico

## 1. Tecnologías
* **Frontend:** Desarrollado como una Single Page Application (SPA) usando React y Tailwind CSS v4.
* **Backend:** Plataforma Supabase utilizando PostgreSQL.

## 2. Base de Datos (Modelo Relacional)
El modelo se compone de tres tablas principales para garantizar la normalización:
* **Usuarios:** Almacena todos los usuarios (id_usuario, email, password, rol). El rol diferencia entre admin y empleado.
* **Turnos:** Bloques de tiempo genéricos (id_turno, fecha, hora_inicio, hora_fin).
* **Asignaciones:** Tabla intermedia que vincula Usuarios y Turnos (relación Muchos a Muchos).

## 3. Requisitos Principales
* **Funcionales:** Sistema de autenticación seguro, CRUD de Empleados exclusivo para el Admin, creación y asignación de turnos, y vista filtrada de "Mis Turnos" para el empleado.
* **No Funcionales:** Tiempos de carga rápidos (SPA), diseño Responsive para móviles, y seguridad mediante RLS (Row Level Security) en base de datos.