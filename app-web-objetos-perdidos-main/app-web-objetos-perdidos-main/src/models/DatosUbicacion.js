const pool = require('../config/db')

class DatosUbicacion {
    constructor(data) {
        this.IdPublicacion = data.IdPublicacion;
        this.Direccion = data.Direccion;
        this.IdLocalidad = data.IdLocalidad;
        this.Latitud = data.Latitud;
        this.Longitud = data.Longitud;
        this.Radio = data.Radio ?? null;
    }

    async save(connectionFromPool) {
        let queryStr = 'INSERT INTO `datosubicacion` (`IdPublicacion`, `Direccion`, `IdLocalidad`, `Latitud`, `Longitud`, `Radio`) VALUES (?,?,?,?,?,?)';
        let result, fields;
        [result, fields] = await connectionFromPool.query(
            queryStr,
            [this.IdPublicacion, this.Direccion, this.IdLocalidad, this.Latitud, this.Longitud, this.Radio],
        );

        return this;
    }

}

module.exports = DatosUbicacion
