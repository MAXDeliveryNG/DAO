'use strict'

/**
 * Connections
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, Environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 */

const Promise = require('bluebird')


module.exports = {

    /*** ************************************************************************
     *                                                                          *
     * Local disk storage for DEVELOPMENT ONLY                                  *
     *                                                                          *
     * Installed by default.                                                    *
     *                                                                          *
     ***************************************************************************/
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: './mydb.sqlite'
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    /*** ************************************************************************
     *                                                                          *
     * MySQL is the world's most popular relational database.                   *
     * http://en.wikipedia.org/wiki/MySQL                                       *
     *                                                                          *
     * Run: npm install mysql                                             *
     *                                                                          *
     ***************************************************************************/
    mysql: {
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    /*** ************************************************************************
     *                                                                          *
     * MongoDB is the leading NoSQL database.                                   *
     * http://en.wikipedia.org/wiki/MongoDB                                     *
     *                                                                          *
     * Run: npm install sails-mongo                                             *
     *                                                                          *
     ***************************************************************************/
    mongo: {
        client: 'mongo',
        connection: {
            host: 'localhost',
            port: 27017
                // user: 'username',
                // password: 'password',
                // database: 'your_mongo_db_name_here'
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    // Production Database Configuration

    /*** ************************************************************************
     *                                                                          *
     * PostgreSQL is another officially supported relational database.          *
     * http://en.wikipedia.org/wiki/PostgreSQL                                  *
     *                                                                          *
     * Run: npm install pg                                       *
     *                                                                          *
     *                                                                          *
     ***************************************************************************/
    postgres: {
        client: 'pg',
        debug: process.env.NODE_ENV.toLowerCase() === 'development',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.PG_PORT || 5432,
            user: process.env.POSTGRES_USER || process.env.PG_USER,
            password: process.env.POSTGRES_PASSWORD || process.env.PG_PASSWORD || '',
            database: process.env.POSTGRES_DB || process.env.PG_DATABASE
        },
        searchPath: (env.SCHEMA_NAME || 'account') + ',public,knex',
        migrations: {
            tableName: process.env.SCHEMA_MIGRATION_NAME
        },
        pool: {
            beforeCreate: (connection, callback) => {
                return Promise.promisify(connection.query, connection)('SET SESSION SCHEMA \'' + process.env.SCHEMA_NAME + '\';', []).then(function () {
                    callback(null, connection)
                })
            }
        }
    }


    /*** ************************************************************************
     *                                                                          *
     * More adapters:                     *
     *                                                                          *
     ***************************************************************************/

}