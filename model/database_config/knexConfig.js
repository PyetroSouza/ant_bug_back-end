module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'pyetro1267',
            database: 'loja_vegana',
            port: 3306,

            charset: 'utf8mb4'
        },


        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    },


};