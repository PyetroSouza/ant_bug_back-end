/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados do administrador no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertCategoria = async function (categoria) {
  try {
    let sql = `insert into tbl_categoria (
        nome)
        values(
            '${categoria.nome}'
        )`

    let result = await knexConection.raw(sql)

    if (result)
      return result[0].insertId
    else
      return false
  } catch (error) {
    return false
  }
}

const updateCategoria = async function (categoria) {
  try {
    let sql = `update tbl_categoria set 
  nome = '${categoria.nome}'
  where id = ${categoria.id}`

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

const selectAllCategorias = async function () {
  try {
    let sql = `select * from tbl_categoria order by id desc`

    let result = await knexConection.raw(sql)

    if (Array.isArray(result)) {
      return result[0]
    } else {
      return false
    }
  }
  catch (error) {
    console.log(error)
    return false
  }
}

const selectByIdCategoria = async function (id) {
  try {
    let sql = `select * from tbl_categoria where id=${id}`
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

const deleteCategoria = async function (id) {
  try {
    let sql = `delete from tbl_categoria where id=${id}`

    let result = await knexConection.raw(sql)
    if (result)
      return true
    else return false
  } catch (error) {
    return false
  }
}

module.exports = {
  insertCategoria,
  updateCategoria,
  selectAllCategorias,
  selectByIdCategoria,
  deleteCategoria
}