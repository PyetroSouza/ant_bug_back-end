require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-type', 'Authorization']
}

app.use(cors(corsOptions))

const adminRouter = require('./routers/administrador.router')
app.use("/v1/planetaverde/admin/administrador", cors(), adminRouter)

const produtoRouter = require('./routers/produto.router')
app.use('/v1/planetaverde/admin/produto', cors(), produtoRouter)

const categoriaRouter = require('./routers/categoria.router')
app.use('/v1/planetaverde/admin/categoria', cors(), categoriaRouter)

const subcategoriaRouter = require('./routers/subcategoria.router')
app.use('/v1/planetaverde/admin/subcategoria', cors(), subcategoriaRouter)


app.listen(8080, function () {
    console.log('API aguardando novas requisições...')
})