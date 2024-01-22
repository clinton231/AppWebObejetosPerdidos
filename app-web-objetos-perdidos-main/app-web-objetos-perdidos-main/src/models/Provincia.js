const pool = require('../config/db')

class Provincia {
    constructor(data) {
        this.IdProvincia = data.IdProvincia;
        this.Descripcion = data.Descripcion;
    }

    static async getAll() {
        let queryStr = 'SELECT * FROM `provincia`';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [],
        );
        return rows;
    }

    static async findById(id) {
        let queryStr = 'SELECT * FROM `provincia` WHERE `IdProvincia` = ? ORDER BY Descripcion';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [id],
        );
        if (rows.length > 0) {
            return new Provincia(rows[0]);
        }
    }
    
}

module.exports = Provincia
