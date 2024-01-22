const pool = require('../config/db')
const moment = require('moment')

const DatosUbicacion = require('./DatosUbicacion');
const PreguntaSeguridad = require('./PreguntaSeguridad');
const RespuestaSeguridad = require('./RespuestaSeguridad');
const FotoPublicacion = require('./FotoPublicacion');
const Localidad = require('./Localidad');
const Provincia = require('./Provincia');

const mapearPublicaciones=(rows)=>{
    //MAPEAMOS LA INFO DE UNA MANERA MAS AGRADABLE
    let infoFinal = []
    rows.forEach(element => {
        let publicacion = new Publicacion({
            Id: element.Id,
            Titulo: element.Titulo,
            IdTipoPublicacion: element.IdTipoPublicacion,
            Descripcion: element.Descripcion,
            FechaPublicacion: element.FechaPublicacion,
            Telefono: element.Telefono,
            Celular: element.Celular,
            Email: element.Email,
            PalabrasClaves: element.PalabrasClaves,
            OfreceRecompensa: element.OfreceRecompensa,
            Resuelta: element.Resuelta,
            Fecha: element.Fecha,
            IdUsuario: element.IdUsuario,
            FechaDeBaja: element.FechaDeBaja,
            DatosUbicacion: {
                IdPublicacion: element.IdPublicacion,
                Direccion: element.Direccion,
                IdLocalidad: element.IdLocalidad,
                Latitud: element.Latitud,
                Longitud: element.Longitud,
                Radio: element.Radio,
                Localidad: element.DescripcionLocalidad,
                Provincia: element.DescripcionProvincia,
            }
        })

        let indicePublicacion = infoFinal.findIndex(x => x.Id === element.Id)

        // Si no fue agregada la publicacion al array la agregamos y actualizamos el indice de la misma
        if (indicePublicacion === -1) {
            infoFinal.push(publicacion)
            indicePublicacion = infoFinal.findIndex(x => x.Id === element.Id)
        }

        //MAPEO LAS FOTOS
        // buscamos por el indice de la publicacion, la publicacion en si y dentro de sus fotos si ya fue agrega la foto actual
        if (!infoFinal[indicePublicacion].FotosPublicacion.find(x => x.IdFotoPublicacion === element.IdFotoPublicacion)) {
            infoFinal[indicePublicacion].FotosPublicacion.push(new FotoPublicacion({
                IdFotoPublicacion: element.IdFotoPublicacion,
                IdPublicacion: element.Id,
                Archivo: element.Archivo
            }))
        }

        // Hacemos lo mismo con las preguntas, savlo que aca hay que consultar si hay preguntas, ya que puede ser null
        if(element.IdPregunta){
            //MAPEO LAS PREGUNTAS
            if (!infoFinal[indicePublicacion].PreguntasSeguridad.find(x => x.IdPregunta === element.IdPregunta)) {
                infoFinal[indicePublicacion].PreguntasSeguridad.push(new PreguntaSeguridad({
                    IdPregunta: element.IdPregunta,
                    IdPublicacion: element.Id,
                    Descripcion: element.DescripcionPregunta
                }))
            }

            let indicePregunta=infoFinal[indicePublicacion].PreguntasSeguridad.findIndex(x => x.IdPregunta === element.IdPregunta)
            
            if (!infoFinal[indicePublicacion].PreguntasSeguridad[indicePregunta].RespuestasSeguridad.find(x => x.IdRespuesta === element.IdRespuesta)) {
                infoFinal[indicePublicacion].PreguntasSeguridad[indicePregunta].RespuestasSeguridad.push(new RespuestaSeguridad({
                    IdRespuesta: element.IdRespuesta,
                    IdPregunta: element.IdPregunta,
                    Descripcion: element.DescripcionRespuesta,
                    Correcta: element.Correcta
                }))
            }
        }

    })
    return infoFinal;
}
class Publicacion {
    constructor(data) {
        this.Id = data.Id;
        this.Titulo = data.Titulo;
        this.IdTipoPublicacion = data.IdTipoPublicacion;
        this.Descripcion = data.Descripcion;
        this.FechaPublicacion = data.FechaPublicacion ?? moment().format("YYYY-MM-DD");
        this.Telefono = data.Telefono;
        this.Celular = data.Celular;
        this.Email = data.Email;
        this.PalabrasClaves = data.PalabrasClaves;
        this.OfreceRecompensa = data.OfreceRecompensa ?? false;
        this.Resuelta = data.Resuelta ?? false;
        this.Fecha = data.Fecha;
        this.IdUsuario = data.IdUsuario;
        this.FechaDeBaja = data.FechaDeBaja ?? null;
        this.DatosUbicacion = data.DatosUbicacion;
        this.FotosPublicacion = data.FotosPublicacion || [];
        this.PreguntasSeguridad = data.PreguntasSeguridad || [];
    }

    async save(connectionFromPool) {

        let queryStr = 'INSERT INTO `publicaciones` (`Titulo`, `IdTipoPublicacion`, `Descripcion`, `FechaPublicacion`, `Telefono`, `Celular`, `Email`, `PalabrasClaves`, `OfreceRecompensa`, `Resuelta`, `Fecha`, `IdUsuario`) VALUES (?,?,?,NOW(),?,?,?,?,?,?,?,?)';
        let result, fields;
        [result, fields] = await connectionFromPool.query(
            queryStr,
            [this.Titulo, this.IdTipoPublicacion, this.Descripcion, this.Telefono, this.Celular, this.Email, this.PalabrasClaves, this.OfreceRecompensa, false, moment(this.Fecha).format("YYYY-MM-DD"), this.IdUsuario],
        );
        this.Id = result.insertId;

        // despues en la tabla de publicaciones
        const datosUbicacion = new DatosUbicacion({ ...this.DatosUbicacion, IdPublicacion: this.Id })
        datosUbicacion.save(connectionFromPool)

        return this;

    }

    static async getAll(tipo = 1, titulo = "", palabrasClaves = "", fechaDesde="", fechaHasta="", provincia="", localidad="", conRecompensa="") {
        let queryStr = 'SELECT P.*, DU.*, L.Descripcion AS DescripcionLocalidad, PR.Descripcion AS DescripcionProvincia, FP.* FROM `publicaciones` P INNER JOIN `datosubicacion` DU ON P.Id = DU.IdPublicacion INNER JOIN `localidad` L ON DU.IdLocalidad = L.IdLocalidad INNER JOIN `provincia` PR ON L.IdProvincia = PR.IdProvincia INNER JOIN `fotospublicacion` FP ON P.Id = FP.IdPublicacion WHERE P.FechaDeBaja IS NULL AND P.IdTipoPublicacion = ?';
        let queryArray=[tipo]
        
        if(titulo != ""){
            queryStr += ' AND P.Titulo LIKE ?';
            queryArray.push(`%${titulo}%`)
        }

        if(palabrasClaves != ""){
            queryStr += ' AND P.PalabrasClaves LIKE ?';
            queryArray.push(`%${palabrasClaves}%`)
        }

        if(fechaDesde != ""){
            queryStr += ' AND P.Fecha >= ?';
            queryArray.push(fechaDesde)
        }

        if(fechaHasta != ""){
            queryStr += ' AND P.Fecha <= ?';
            queryArray.push(fechaHasta)
        }

        if(provincia != ""){
            queryStr += ' AND L.IdProvincia = ?';
            queryArray.push(provincia)
        }

        if(localidad != ""){
            queryStr += ' AND DU.IdLocalidad = ?';
            queryArray.push(localidad)
        }

        if(conRecompensa != ""){
            queryStr += ' AND P.OfreceRecompensa LIKE ?';
            queryArray.push(conRecompensa)
        }
        
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            queryArray,
        );

        return mapearPublicaciones(rows)
    }

    static async getAllByUser(idUsuario, tipo) {
        let queryStr = 'SELECT P.*, DU.*, L.Descripcion AS DescripcionLocalidad, PR.Descripcion AS DescripcionProvincia, FP.* FROM `publicaciones` P INNER JOIN `datosubicacion` DU ON P.Id = DU.IdPublicacion INNER JOIN `localidad` L ON DU.IdLocalidad = L.IdLocalidad INNER JOIN `provincia` PR ON L.IdProvincia = PR.IdProvincia INNER JOIN `fotospublicacion` FP ON P.Id = FP.IdPublicacion WHERE P.FechaDeBaja IS NULL AND P.IdUsuario = ? AND P.IdTipoPublicacion = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [idUsuario, tipo],
        );

        return mapearPublicaciones(rows)
    }

    static async getById(idPublicacion) {
        let queryStr = 'SELECT P.*, DU.*, L.Descripcion AS DescripcionLocalidad, PR.Descripcion AS DescripcionProvincia, FP.*, PS.IdPregunta, PS.Descripcion AS DescripcionPregunta, RS.IdRespuesta, RS.Descripcion AS DescripcionRespuesta, RS.Correcta FROM `publicaciones` P INNER JOIN `datosubicacion` DU ON P.Id = DU.IdPublicacion INNER JOIN `localidad` L ON DU.IdLocalidad = L.IdLocalidad INNER JOIN `provincia` PR ON L.IdProvincia = PR.IdProvincia INNER JOIN `fotospublicacion` FP ON P.Id = FP.IdPublicacion LEFT JOIN `preguntaseguridad` PS ON P.Id = PS.IdPublicacion LEFT JOIN `respuestaseguridad` RS ON PS.IdPregunta = RS.IdPregunta WHERE P.FechaDeBaja IS NULL AND P.Id = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [idPublicacion],
        );

        //Si existe me va a devolver una lista de una sola posicion
        let resultado = mapearPublicaciones(rows)
        if(resultado.length > 0){
            let publicacion=resultado[0]

            return publicacion
        }else{
            return null
        }
    }

    async delete(){
        let queryStr = 'UPDATE `publicaciones` SET FechaDeBaja = now() WHERE FechaDeBaja IS NULL AND Id = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [this.Id],
        );
    }

    async finalizar(){
        let queryStr = 'UPDATE `publicaciones` SET Resuelta = 1 WHERE FechaDeBaja IS NULL AND Resuelta = 0 AND Id = ?';
        let rows, fields;
        [rows, fields] = await pool.query(
            queryStr,
            [this.Id],
        );
    }
}

module.exports = Publicacion
