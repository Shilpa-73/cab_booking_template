require('dotenv').config();
module.exports = {
    local: {
        url: process.env.DB_URI,
        logging: true,
        options: {
            dialect: 'postgres',
            pool: {
                min: 0,
                max: 10,
                idle: 10000
            },
            define: {
                userscored: true,
                timestamps: false
            }
        },
        "migrationStorageTableName": "sequelize_meta"
    },
    development: {
        url: process.env.DB_URI,
        logging: true,
        options: {
            dialect: 'postgres',
            pool: {
                min: 0,
                max: 10,
                idle: 10000
            },
            define: {
                userscored: true,
                timestamps: false
            }
        }
    }
};
