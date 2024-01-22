const pool = require('../config/db')

class RespuestaSeguridad {
    constructor(data) {
        this.IdRespuesta = data.IdRespuesta;
        this.IdPregunta = data.IdPregunta;
        this.Descripcion = data.Descripcion;
        this.Correcta = data.Correcta;
    }

    async save(connectionFromPool) {
        let queryStr = 'INSERT INTO `respuestaseguridad` (`IdPregunta`, `Descripcion`, `Correcta`) VALUES (?,?,?)';
        let result, fields;
        [result, fields] = await connectionFromPool.query(
            queryStr,
            [this.IdPregunta, this.Descripcion, this.Correcta],
        );

        this.IdRespuesta = result.insertId;
        return this;
    }

}

module.exports = RespuestaSeguridad
