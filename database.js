
const mysql = require('mysql2');

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_produtos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = conexao.promise();
