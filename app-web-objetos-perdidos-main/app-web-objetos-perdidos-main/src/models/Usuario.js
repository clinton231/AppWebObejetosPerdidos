const pool = require('../config/db')

class Usuario {
    constructor(data) {
        this.IdUsuario = data.IdUsuario;
        this.Email = data.Email;
        this.NombreApellido = data.NombreApellido;
        this.UrlFoto = data.UrlFoto;
    }
    					

    static async findByEmail(email) {
        let queryStr = 'SELECT * FROM `usuario` WHERE `Email` = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [email],
        );
        if (rows.length > 0) {
            return new Usuario(rows[0]);
        }
        return;
    }

    async save() {
        let queryStr = 'INSERT INTO `usuario` (`NombreApellido`, `Email`, `UrlFoto`) VALUES (?,?,?)';
        let result, fields;
        [result, fields] = await pool.query(
            queryStr,
            [this.NombreApellido, this.Email, this.UrlFoto],
        );
        this.IdUsuario = result.insertId;
        return this;
    }

}

module.exports = Usuario
