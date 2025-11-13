-- =============================================
-- SEED: Colaboradores de Teste
-- =============================================
-- Insere 10 colaboradores para testes
-- Execução: node database/run-seed-colaboradores.js
-- =============================================

-- Limpar colaboradores de teste (opcional - descomente se quiser resetar)
-- DELETE FROM colaboradores WHERE cpf LIKE '999.999.999-%';

-- Colaborador 1 - João Silva (SP)
INSERT INTO colaboradores (
  nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
  email, celular, cep, logradouro, numero, bairro, cidade, estado,
  matricula, data_admissao, cargo, departamento, centro_custo,
  local_trabalho, tipo_contrato, jornada_trabalho, salario,
  pis_pasep, status
) VALUES (
  'João Silva Santos',
  '999.999.999-01',
  '12.345.678-9',
  '1990-05-15',
  'M',
  'Casado',
  'joao.silva@fgs.com',
  '(11) 98765-4321',
  '01310-100',
  'Avenida Paulista',
  '1000',
  'Bela Vista',
  'São Paulo',
  'SP',
  'FGS001',
  '2020-01-10',
  'Analista de RH',
  'Recursos Humanos',
  'CC001',
  'SP',
  'CLT',
  '8h/dia - 44h/semana',
  4500.00,
  '123.45678.90-1',
  'ATIVO'
);

-- Colaborador 2 - Maria Oliveira (RJ)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  email, celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Maria Oliveira Costa',
  '999.999.999-02',
  '1985-08-20',
  'F',
  'Solteira',
  'maria.oliveira@fgs.com',
  '(21) 98765-1234',
  'Rio de Janeiro',
  'RJ',
  'FGS002',
  '2019-03-15',
  'Coordenadora de Benefícios',
  'Recursos Humanos',
  'RJ',
  'CLT',
  5500.00,
  'ATIVO'
);

-- Colaborador 3 - Carlos Souza (MG)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Carlos Eduardo Souza',
  '999.999.999-03',
  '1992-11-10',
  'M',
  'Casado',
  '(31) 98765-5678',
  'Belo Horizonte',
  'MG',
  'FGS003',
  '2021-06-01',
  'Técnico de Segurança do Trabalho',
  'Segurança do Trabalho',
  'MG',
  'CLT',
  3800.00,
  'ATIVO'
);

-- Colaborador 4 - Ana Paula (SP)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  email, celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Ana Paula Ferreira',
  '999.999.999-04',
  '1988-03-25',
  'F',
  'Divorciada',
  'ana.paula@fgs.com',
  '(11) 91234-5678',
  'São Paulo',
  'SP',
  'FGS004',
  '2018-09-20',
  'Gerente de RH',
  'Recursos Humanos',
  'SP',
  'CLT',
  7500.00,
  'ATIVO'
);

-- Colaborador 5 - Pedro Almeida (RS)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Pedro Henrique Almeida',
  '999.999.999-05',
  '1995-07-12',
  'M',
  'Solteiro',
  '(51) 98765-4321',
  'Porto Alegre',
  'RS',
  'FGS005',
  '2022-01-15',
  'Auxiliar Administrativo',
  'Administração',
  'RS',
  'CLT',
  2800.00,
  'ATIVO'
);

-- Colaborador 6 - Juliana Santos (BA)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  email, celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Juliana Santos Lima',
  '999.999.999-06',
  '1991-12-05',
  'F',
  'Casada',
  'juliana.santos@fgs.com',
  '(71) 98765-9876',
  'Salvador',
  'BA',
  'FGS006',
  '2020-07-10',
  'Analista de Treinamento',
  'Recursos Humanos',
  'BA',
  'CLT',
  4200.00,
  'ATIVO'
);

-- Colaborador 7 - Roberto Lima (PR)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Roberto Carlos Lima',
  '999.999.999-07',
  '1987-04-18',
  'M',
  'Casado',
  '(41) 98765-1111',
  'Curitiba',
  'PR',
  'FGS007',
  '2019-11-25',
  'Supervisor Administrativo',
  'Administração',
  'PR',
  'CLT',
  5000.00,
  'ATIVO'
);

-- Colaborador 8 - Fernanda Costa (CE)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  email, celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Fernanda Costa Ribeiro',
  '999.999.999-08',
  '1993-09-30',
  'F',
  'Solteira',
  'fernanda.costa@fgs.com',
  '(85) 98765-2222',
  'Fortaleza',
  'CE',
  'FGS008',
  '2021-03-01',
  'Analista de Ponto',
  'Recursos Humanos',
  'CE',
  'CLT',
  3500.00,
  'ATIVO'
);

-- Colaborador 9 - Lucas Martins (SC)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Lucas Martins Pereira',
  '999.999.999-09',
  '1994-06-22',
  'M',
  'Solteiro',
  '(48) 98765-3333',
  'Florianópolis',
  'SC',
  'FGS009',
  '2022-05-10',
  'Auxiliar de RH',
  'Recursos Humanos',
  'SC',
  'CLT',
  3000.00,
  'ATIVO'
);

-- Colaborador 10 - Camila Rodrigues (PE)
INSERT INTO colaboradores (
  nome_completo, cpf, data_nascimento, sexo, estado_civil,
  email, celular, cidade, estado,
  matricula, data_admissao, cargo, departamento,
  local_trabalho, tipo_contrato, salario, status
) VALUES (
  'Camila Rodrigues Souza',
  '999.999.999-10',
  '1989-02-14',
  'F',
  'Casada',
  'camila.rodrigues@fgs.com',
  '(81) 98765-4444',
  'Recife',
  'PE',
  'FGS010',
  '2020-10-05',
  'Coordenadora de Ponto',
  'Recursos Humanos',
  'PE',
  'CLT',
  4800.00,
  'ATIVO'
);

-- Exibir resultado
SELECT 
  matricula, 
  nome_completo, 
  cargo, 
  departamento, 
  local_trabalho, 
  status
FROM colaboradores 
WHERE cpf LIKE '999.999.999-%'
ORDER BY matricula;

