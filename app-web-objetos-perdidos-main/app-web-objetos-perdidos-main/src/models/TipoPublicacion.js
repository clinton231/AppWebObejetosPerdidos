const pool = require('../config/db')

class TipoPublicacion {
    static PERDIDO = 1;
    static ENCONTRADO = 2;

    static async getAll() {
        let queryStr = 'SELECT * FROM `tipopublicacion`';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [],
        );
        return rows;
    }

}

module.exports = TipoPublicacion
