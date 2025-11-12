-- =============================================
-- Fix: Converter ID de users para UUID
-- =============================================

-- 1. Dropar constraints que dependem da coluna id
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;

-- 2. Criar nova coluna id_uuid
ALTER TABLE users ADD COLUMN id_uuid UUID DEFAULT uuid_generate_v4();

-- 3. Atualizar id_uuid para todos os registros existentes
UPDATE users SET id_uuid = uuid_generate_v4() WHERE id_uuid IS NULL;

-- 4. Dropar coluna id antiga
ALTER TABLE users DROP COLUMN id;

-- 5. Renomear id_uuid para id
ALTER TABLE users RENAME COLUMN id_uuid TO id;

-- 6. Adicionar constraint de primary key
ALTER TABLE users ADD PRIMARY KEY (id);

-- 7. Verificar resultado
SELECT id, nome, email, role FROM users;

