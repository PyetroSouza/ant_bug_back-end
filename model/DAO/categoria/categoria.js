/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados do administrador no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

//Import da bibliioteca para gerenciar o banco de dados Mysql no node.JS
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')
const { updateAdministrador } = require('../administrador/administrador.js')

//Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir dados na tabela de categoria
const insertCategoria = async function (categoria) {
  try {
    let sql = `insert into tbl_categoria (
        nome)
        values(
            '${categoria.nome}'
        )`

    let result = await knexConection.raw(sql)

    if (result)
      return result[0].insertId //Retorno de ID gerado no BD
    else
      return false
  } catch (error) {
    return false
  }
}

const updateCategoria = async function (categoria) {
  try {
    let sql = `update tbl_categoria set 
  nome = ${categoria.nome}
  where id = ${categoria.id}`
    let result = await knexConection.raw(sql)
    if (result) {
      return result[0].insertId
    }
  } catch (error) {
    return false
  }
}

//Função para retornar todos os dados da tabela de categorias
const selectAllCategorias = async function () {
  try {
    //Script para retornar todos as categoria
    let sql = `select * from tbm_categoria order by id desc`

    //executa no banco de dados o script SQL para retornar as categorias
    let result = await knexConection.raw(sql)

    //Validação para verificar se o retorno no BD é um ARRAY
    //Se o scriptSQL der erro, o banco não devolve um array
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

//Função para retornar os dados da categorias filtrando pelo ID
const selectByIdClassificacao = async function (id) {
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


//Função para excluir ua categoria
const deleteCategoria = async function (id) {
  try {
    let sql = `delete from tbl_classificacao where id=${id}`

    let result = await knexConection.raw(sql)
    if (result)
        return true
    else return false
  }catch (error){
    return false
  }
    
}



module.exports = {
  insertCategoria,
  updateAdministrador,
  selectAllCategorias,
  selectByIdClassificacao,
  deleteCategoria
}