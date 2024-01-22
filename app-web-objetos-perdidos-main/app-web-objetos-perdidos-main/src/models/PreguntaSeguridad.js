const pool = require('../config/db');

class PreguntaSeguridad {
    static PREGUNTAS_POR_PUBLICACION=3;
    constructor(data) {
        this.IdPregunta = data.IdPregunta;
        this.IdPublicacion = data.IdPublicacion;
        this.Descripcion = data.Descripcion;
        this.RespuestasSeguridad = data.RespuestasSeguridad || []
    }

    async save(connectionFromPool) {
        let queryStr = 'INSERT INTO `preguntaseguridad` (`IdPublicacion`, `Descripcion`) VALUES (?,?)';
        let result, fields;
        [result, fields] = await connectionFromPool.query(
            queryStr,
            [this.IdPublicacion, this.Descripcion],
        );

        this.IdPregunta = result.insertId;
        return this;
    }

}

module.exports = PreguntaSeguridad
