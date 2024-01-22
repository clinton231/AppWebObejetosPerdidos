const pool = require('../config/db');

class PosibleDuenio {
    constructor(data) {
        this.IdPosibleDuenio = data.IdPosibleDuenio;
        this.IdPublicacion = data.IdPublicacion;
        this.IdUsuario = data.IdUsuario;
        this.ValidadoCorrectamente = data.ValidadoCorrectamente
    }

    static async getByUserAndPublicacion(idUsuario, idPublicacion) {
        let queryStr = 'SELECT * FROM `posiblesduenios` where IdUsuario = ? AND IdPublicacion = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [idUsuario, idPublicacion],
        );

        if (rows.length > 0) {
            return new PosibleDuenio(rows[0]);
        }else{
            return null;
        }
    }

    async save() {
        let queryStr = 'INSERT INTO `posiblesduenios` (`IdPublicacion`, `IdUsuario`, `ValidadoCorrectamente`) VALUES (?,?,?)';
        let result, fields;
        [result, fields] = await pool.query(
            queryStr,
            [this.IdPublicacion, this.IdUsuario, this.ValidadoCorrectamente],
        );

        this.IdPosibleDuenio = result.insertId;
        return this;
    }

}

module.exports = PosibleDuenio
