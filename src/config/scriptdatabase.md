-- Crear la base de datos
CREATE DATABASE tasks_db;

-- Conectarse a la base de datos
\c tasks_db;

-- Crear el tipo ENUM para el estado del usuario
CREATE TYPE user_status AS ENUM ('active', 'inactive');

-- Crear la tabla Users
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status user_status DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Tasks
CREATE TABLE "Tasks" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tasks_userid ON "Tasks"("userId");
CREATE INDEX idx_users_username ON "Users"(username);
CREATE INDEX idx_users_status ON "Users"(status);

-- Crear función para actualizar el timestamp de updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updatedAt
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON "Tasks"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener todas las tareas de un usuario
CREATE OR REPLACE FUNCTION get_user_tasks(user_id INTEGER)
RETURNS TABLE (
    task_id INTEGER,
    task_name VARCHAR(255),
    task_done BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, name, done, "createdAt"
    FROM "Tasks"
    WHERE "userId" = user_id
    ORDER BY "createdAt" DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de tareas por usuario
CREATE OR REPLACE FUNCTION get_user_task_stats(user_id INTEGER)
RETURNS TABLE (
    total_tasks BIGINT,
    completed_tasks BIGINT,
    pending_tasks BIGINT,
    completion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE done = true) as completed_tasks,
        COUNT(*) FILTER (WHERE done = false) as pending_tasks,
        ROUND(COUNT(*) FILTER (WHERE done = true)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 2) as completion_rate
    FROM "Tasks"
    WHERE "userId" = user_id;
END;
$$ LANGUAGE plpgsql;

-- Insertar algunos datos de prueba
INSERT INTO "Users" (username, password, status) VALUES 
('admin', '$2a$10$XgXB0Y5Y5Y5Y5Y5Y5Y5Y5OqH5H5H5H5H5H5H5H5H5H5H5H5H5H5Y', 'active'),
('test_user', '$2a$10$XgXB0Y5Y5Y5Y5Y5Y5Y5Y5OqH5H5H5H5H5H5H5H5H5H5H5H5H5H5Y', 'active');

INSERT INTO "Tasks" (name, done, "userId") VALUES 
('Completar el proyecto', false, 1),
('Revisar documentación', false, 1),
('Hacer pruebas', false, 1),
('Tarea de prueba', false, 2);

-- Crear vista para usuarios activos y sus tareas pendientes
CREATE VIEW active_users_pending_tasks AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(t.id) as pending_tasks
FROM "Users" u
LEFT JOIN "Tasks" t ON u.id = t."userId" AND t.done = false
WHERE u.status = 'active'
GROUP BY u.id, u.username;

-- Otorgar permisos necesarios
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;