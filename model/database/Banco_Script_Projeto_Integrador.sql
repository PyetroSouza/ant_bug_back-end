-- ============================================================
-- BANCO DE DADOS: Loja de Produtos Veganos - Planeta Vegano
-- ============================================================

CREATE DATABASE IF NOT EXISTS loja_vegana;

USE loja_vegana;

-- ============================================================
-- TABELAS
-- ============================================================

-- Tabela: tbl_administrador
-- Guarda o login de quem gerencia o site (nome, email, senha).
-- O email é UNIQUE: não pode ter dois admins com o mesmo email.
CREATE TABLE tbl_administrador (
    id        INT          NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100) NOT NULL,
    senha     VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

-- Tabela: tbl_categoria
-- Guarda as categorias dos produtos.
-- Exemplos: Alimento, Cosméticos, Vestuário, Limpeza, Higiene Pessoal.
CREATE TABLE tbl_categoria (
    id             INT         NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabela: tbl_subcategoria
-- Guarda as subcategorias ligadas a uma categoria.
-- Exemplo: a categoria "Alimento" pode ter a subcategoria "Snacks".
-- O campo tbl_categoria_id diz a qual categoria essa subcategoria pertence.
CREATE TABLE tbl_subcategoria (
    id               INT         NOT NULL AUTO_INCREMENT,
    nome             VARCHAR(50) NOT NULL,
	id_categoria     INT         NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_subcategoria_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES tbl_categoria(id)
);

-- Tabela: tbl_produto
-- Guarda os produtos do catálogo.
-- "ativo" serve para desativar um produto sem apagá-lo do banco.
-- "criado_em" é preenchido automaticamente com a data de cadastro.
-- "alterado_em" é atualizado automaticamente pelo trigger quando o produto é editado.
CREATE TABLE tbl_produto (
    id          INT          NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    imagem      VARCHAR(255),
    detalhes    TEXT,
    PRIMARY KEY (id)
);

-- Tabela: tbl_categoria_produto
-- Liga produto com categoria (relação N:N).
-- Um produto pode ter várias categorias e uma categoria pode ter vários produtos.
-- Exemplo: "Sabonete Vegano" → Cosméticos e Higiene Pessoal ao mesmo tempo.
CREATE TABLE tbl_categoria_produto (
    id               INT NOT NULL AUTO_INCREMENT,
    id_categoria INT NOT NULL,
    id_produto   INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_CATEGORIA_CATEGORIAPRODUTO
        FOREIGN KEY (id_categoria)
        REFERENCES tbl_categoria(id),
    CONSTRAINT FK_PRODUTO_CATEGORIAPRODUTO
        FOREIGN KEY (id_produto)
        REFERENCES tbl_produto(id)
);

DELIMITER $$

CREATE TRIGGER trg_antes_deletar_produto
BEFORE DELETE ON tbl_produto
FOR EACH ROW
BEGIN
    DELETE FROM tbl_categoria_produto WHERE id_produto = OLD.id;
END$$

CREATE TRIGGER trg_antes_deletar_categoria
BEFORE DELETE ON tbl_categoria
FOR EACH ROW
BEGIN
    DELETE FROM tbl_categoria_produto WHERE id_categoria = OLD.id;
END$$

DELIMITER ;