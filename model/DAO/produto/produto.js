/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados do produto no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

const knex = require("knex")

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertProduto = async function (produto) {
    try {
        let imagem = produto.imagem || ""

        let sql = `insert into tbl_produto(
        nome,
        descricao,
        detalhes,
        imagem
        ) values (
        replace("${produto.nome}", "'",""),
        replace("${produto.descricao}", "'", ""),
        replace("${produto.detalhes}", "'", ""),
        replace("${imagem}", "'", "")
        );`
        let result = await knexConection.raw(sql)
        if (result) {
            return result[0].insertId
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateProduto = async function (produto) {
    try {

        let imagem = produto.imagem || ''

        let sql = `update tbl_produto set
    nome    = '${produto.nome}',
    descricao = '${produto.descricao}',
    detalhes = '${produto.detalhes}',
    imagem = '${imagem}' 
     where id = ${produto.id}`

        let result = await knexConection.raw(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllProduto = async function () {
    try {
        let sql = `select * from tbl_produto order by id desc`
        let result = await knexConection.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectByIdProduto = async function (id) {
    try {
        let sql = `select * from tbl_produto where id = ${id}`
        let result = await knexConection.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const deleteProduto = async function (id) {
    try {
        let sql = `delete from tbl_produto where id = ${id}`
        let result = await knexConection.raw(sql)
        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertProduto,
    updateProduto,
    selectAllProduto,
    selectByIdProduto,
    deleteProduto
}