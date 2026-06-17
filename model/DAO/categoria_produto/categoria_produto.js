/*****************************************************************************
 * Objeivo: Arquivo responsável pelo CRUD de dados da Categoria Produto no banco de dados
 *           MySQL
 * Data: 11/06/2026
 * Autor: Pyetro Ferreira
 * Versão: 1.0
 *****************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)

const insertCategoriaProduto = async function (categoriaProduto) {
    try {
        let sql = `insert into tbl_categoria_produto(
        id_categoria,
        id_produto
        ) values (
         ${categoriaProduto.id_categoria},
         ${categoriaProduto.id_produto}
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

const updateCategoriaProduto = async function (categoriaProduto) {
    try {
        let sql = `update tbl_categoria_produto set 
        id_categoria    = ${categoriaProduto.id_categoria},
        id_produto      = ${categoriaProduto.id_produto}
        where id = ${categoriaProduto.id}`

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

const selectAllCategoriaProduto = async function () {
    try {
        let sql = `select * from tbl_categoria_produto order by id desc`
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

const selectByIdCategoriaProduto = async function (id) {
    try {
        let sql = `select * from tbl_categoria_produto where id = ${id}`
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

const selectProdutoByIdCategoria = async function (idCategoria) {
    try {
        let sql = `select tbl_produto.* 
                    from tbl_categoria
                        inner join tbl_categoria_produto
                            on tbl_categoria.id = tbl_categoria_produto.id_categoria
                        inner join tbl_produto
                            on tbl_produto.id = tbl_categoria_produto.id_produto
                    where tbl_categoria.id = ${idCategoria}`
        let result = await knexConection.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        console.log('ERRO selectProdutoByIdCategoria:', error.message)
        return false
    }
}

const selectCategoriaByIdProduto = async function (idProduto) {
    try {
        let sql = `select tbl_categoria.* 
                    from tbl_produto
                        inner join tbl_categoria_produto
                            on tbl_produto.id = tbl_categoria_produto.id_produto
                        inner join tbl_categoria
                            on tbl_categoria.id = tbl_categoria_produto.id_categoria
                    where tbl_produto.id = ${idProduto}`
        let result = await knexConection.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        console.log('ERRO selectCategoriaByIdProduto:', error.message)
        return false
    }
}

const deleteCategoriaProduto = async function (id) {
    try {
        let sql = `delete from tbl_categoria_produto where id = ${id}`
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

const deleteProdutoByIdCategoria = async function (idCategoria) {
    try {
        let sql = `delete from tbl_categoria_produto where id_categoria = ${idCategoria};`
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

const deleteCategoriaByIdProduto = async function (idProduto) {
    try {
        let sql = `delete from tbl_categoria_produto where id_produto = ${idProduto};`
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
    insertCategoriaProduto,
    updateCategoriaProduto,
    selectAllCategoriaProduto,
    selectByIdCategoriaProduto,
    selectProdutoByIdCategoria,
    selectCategoriaByIdProduto,
    deleteCategoriaProduto,
    deleteProdutoByIdCategoria,
    deleteCategoriaByIdProduto
}