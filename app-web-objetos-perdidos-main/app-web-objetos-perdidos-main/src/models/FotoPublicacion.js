const pool = require('../config/db')

class FotoPublicacion {
    constructor(data) {
        this.IdFotoPublicacion = data.IdFotoPublicacion;
        this.IdPublicacion = data.IdPublicacion;
        this.Archivo = data.Archivo;
    }

    async save(connectionFromPool) {
        let queryStr = 'INSERT INTO `fotospublicacion` (`IdPublicacion`, `Archivo`) VALUES (?,?)';
        let result, fields;
        [result, fields] = await connectionFromPool.query(
            queryStr,
            [this.IdPublicacion, this.Archivo],
        );

        this.IdFotoPublicacion = result.insertId;
        return this;
    }

}

module.exports = FotoPublicacion
