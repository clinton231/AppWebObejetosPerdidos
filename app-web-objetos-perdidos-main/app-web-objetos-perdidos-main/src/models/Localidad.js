const pool = require('../config/db')

class Localidad {
    constructor(data) {
        this.IdLocalidad = data.IdLocalidad;
        this.Descripcion = data.Descripcion;
        this.CodigoPostal = data.CodigoPostal;
        this.IdProvincia = data.IdProvincia;
    }

    static async getAllByCodigoPostal(codigoPostal) {
        let queryStr = 'SELECT * FROM `localidad` WHERE `CodigoPostal` = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [codigoPostal],
        );
        return rows;
    }

    static async getAllByProvincia(idProvincia) {
        let queryStr = 'SELECT * FROM `localidad` WHERE `IdProvincia` = ? ORDER BY Descripcion';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [idProvincia],
        );
        return rows;
    }

    static async findById(id) {
        let queryStr = 'SELECT * FROM `localidad` WHERE `IdLocalidad` = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [id],
        );
        if (rows.length > 0) {
            return new Localidad(rows[0]);
        }
    }
}

module.exports = Localidad
