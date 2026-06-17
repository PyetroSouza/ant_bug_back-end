-- ============================================================
-- BANCO DE DADOS: Loja de Produtos Veganos - Planeta Vegano
-- ============================================================

CREATE DATABASE loja_vegana;

USE loja_vegana;

-- ============================================================
-- Tabela: tbl_administrador
-- Guarda os dados de quem administra a loja.
-- O campo "email" é UNIQUE, ou seja, não pode ter dois
-- administradores com o mesmo e-mail cadastrado.
-- ============================================================
CREATE TABLE tbl_administrador (
    id            INT          NOT NULL AUTO_INCREMENT, -- ID gerado automaticamente
    nome VARCHAR(100) NOT NULL,                -- Nome do administrador
    senha         VARCHAR(255) NOT NULL,                -- Senha de acesso
    email         VARCHAR(255) NOT NULL UNIQUE,         -- E-mail único por administrador
    PRIMARY KEY (id)
);

-- ============================================================
-- Tabela: tbl_produto
-- Guarda todos os produtos veganos da loja.
-- "descricao" é o texto curto do produto.
-- "detalhes" é o texto longo com mais informações (Descrição 2 na tela).
-- "imagem" guarda o caminho/nome do arquivo da foto do produto.
-- ============================================================
CREATE TABLE tbl_produto (
    id        INT          NOT NULL AUTO_INCREMENT, -- ID gerado automaticamente
    nome      VARCHAR(100) NOT NULL,                -- Nome do produto
    descricao TEXT,                                 -- Descrição curta
    imagem    VARCHAR(255),                         -- Caminho da imagem do produto
    detalhes  TEXT,                                 -- Descrição 2 (detalhes extras)
    PRIMARY KEY (id)
);

-- ============================================================
-- Tabela: tbl_categoria
-- Guarda as categorias principais dos produtos.
-- Exemplos: Alimento, Cosméticos, Vestuário, Limpeza, Higiene Pessoal.
-- ============================================================
CREATE TABLE tbl_categoria (
    id             INT         NOT NULL AUTO_INCREMENT, -- ID gerado automaticamente
    nome_categoria VARCHAR(50) NOT NULL,                -- Nome da categoria
    PRIMARY KEY (id)
);

-- ============================================================
-- Tabela: tbl_subcategoria
-- Guarda as subcategorias ligadas a uma categoria principal.
-- Exemplo: Categoria "Alimento" pode ter subcategoria "Snacks".
-- O campo "tbl_categoria_id" é a chave estrangeira que aponta
-- para qual categoria essa subcategoria pertence.
-- ============================================================
CREATE TABLE tbl_subcategoria (
    id               INT         NOT NULL AUTO_INCREMENT, -- ID gerado automaticamente
    nome     VARCHAR(50) NOT NULL,                -- Nome da subcategoria
    tbl_categoria_id INT         NOT NULL,                -- Categoria a que pertence
    PRIMARY KEY (id),
    CONSTRAINT fk_subcategoria_categoria
        FOREIGN KEY (tbl_categoria_id)
        REFERENCES tbl_categoria(id) -- Liga com a tabela tbl_categoria
);

-- ============================================================
-- Tabela: tbl_categoria_produto
-- Essa é a tabela do meio que conecta produto com categoria.
-- Como um produto pode ter várias categorias e uma categoria
-- pode ter vários produtos, precisamos dessa tabela para
-- guardar essas combinações (relação N:N).
-- Exemplo: Produto "Sabonete Vegano" → Categoria "Cosméticos"
--                                    → Categoria "Higiene Pessoal"
-- ============================================================
CREATE TABLE tbl_categoria_produto (
    id               INT NOT NULL AUTO_INCREMENT, -- ID gerado automaticamente
    tbl_categoria_id INT NOT NULL,                -- ID da categoria escolhida
    tbl_produto_id   INT NOT NULL,                -- ID do produto cadastrado
    PRIMARY KEY (id),
    CONSTRAINT fk_catprod_categoria
        FOREIGN KEY (tbl_categoria_id)
        REFERENCES tbl_categoria(id), -- Liga com a tabela tbl_categoria
    CONSTRAINT fk_catprod_produto
        FOREIGN KEY (tbl_produto_id)
        REFERENCES tbl_produto(id)    -- Liga com a tabela tbl_produto
);

-- ============================================================
-- DADOS INICIAIS: Categorias
-- Inserindo as categorias que aparecem na tela de cadastro.
-- Esses dados já precisam existir antes de cadastrar produtos,
-- pois o produto será vinculado a uma dessas categorias.
-- ============================================================
INSERT INTO tbl_categoria (nome_categoria) VALUES ('Alimento');
INSERT INTO tbl_categoria (nome_categoria) VALUES ('Cosméticos');
INSERT INTO tbl_categoria (nome_categoria) VALUES ('Vestuário');
INSERT INTO tbl_categoria (nome_categoria) VALUES ('Limpeza');
INSERT INTO tbl_categoria (nome_categoria) VALUES ('Higiene Pessoal');

-- Verificando as categorias inseridas
-- Você deve ver as 5 categorias listadas abaixo
SELECT * FROM tbl_categoria;

-- ============================================================
-- DADOS INICIAIS: Subcategorias
-- Inserindo algumas subcategorias de exemplo.
-- O número após VALUES é o ID da categoria pai (tbl_categoria_id).
-- Exemplo: 'Snacks' pertence ao ID 1 = Alimento.
-- ============================================================
INSERT INTO tbl_subcategoria (nome, tbl_categoria_id) VALUES ('Snacks', 1);
INSERT INTO tbl_subcategoria (nome, tbl_categoria_id) VALUES ('Bebidas', 1);
INSERT INTO tbl_subcategoria (nome, tbl_categoria_id) VALUES ('Hidratante', 2);
INSERT INTO tbl_subcategoria (nome, tbl_categoria_id) VALUES ('Detergente', 4);

-- Verificando as subcategorias inseridas
-- Você deve ver as 4 subcategorias listadas abaixo
SELECT * FROM tbl_subcategoria;








-- ============================================================
-- EXEMPLO DE CADASTRO DE PRODUTO
-- Passo 1: Insere o produto na tabela tbl_produto
-- ============================================================
INSERT INTO tbl_produto (nome, descricao, imagem, detalhes)
VALUES (
    'Sabonete Vegano Lavanda',
    'Sabonete 100% natural',
    'sabonete_lavanda.jpg',
    'Feito com óleo essencial de lavanda, sem ingredientes de origem animal.'
);

-- Verificando se o produto foi inserido corretamente
-- Você deve ver o Sabonete Vegano Lavanda na tabela
SELECT * FROM tbl_produto;

-- ============================================================
-- Passo 2: Vincula o produto à categoria
-- LAST_INSERT_ID() pega automaticamente o ID do produto
-- que acabou de ser inserido acima (no caso, ID = 1)
-- O número 2 é o ID da categoria Cosméticos
-- ============================================================
INSERT INTO tbl_categoria_produto (tbl_categoria_id, tbl_produto_id)
VALUES (2, LAST_INSERT_ID());

-- Verificando se o vínculo foi criado corretamente
-- Você deve ver uma linha com tbl_categoria_id = 2 e tbl_produto_id = 1
SELECT * FROM tbl_categoria_produto;

-- ============================================================
-- EXEMPLO DE DELETE DE PRODUTO
-- Atenção: precisamos deletar na ordem certa!
-- Primeiro removemos o vínculo na tbl_categoria_produto,
-- depois deletamos o produto. Se tentar deletar o produto
-- direto, o banco vai dar erro por causa da chave estrangeira.
-- ============================================================

-- Passo 1: Remove o vínculo do produto com a categoria
-- O número 1 é o ID do produto que queremos deletar
DELETE FROM tbl_categoria_produto
WHERE tbl_produto_id = 1;

-- Verificando se o vínculo foi removido
-- A tabela deve aparecer vazia agora
SELECT * FROM tbl_categoria_produto;

-- Passo 2: Agora sim deleta o produto
-- O número 1 é o ID do produto que queremos deletar
DELETE FROM tbl_produto
WHERE id = 1;

-- Verificando se o produto foi removido
-- A tabela deve aparecer vazia agora
SELECT * FROM tbl_produto;

-- Caso aplique duas vezes as subcategorias Utilizar esse comando
DELETE FROM tbl_subcategoria WHERE id BETWEEN 5 AND 8;