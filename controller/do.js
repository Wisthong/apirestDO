const { response, request } = require("express");
const { connection } = require("../db/connection");
const { matchedData } = require("express-validator");
const { upload } = require("../multer/multerfile");

const path = require("path");
const fs = require("fs");

const postDO = async (req = request, res = response) => {
  try {
    const { id_item, lapso_inicio, lapso_fin, id_co } = req.body; // Si los parámetros vienen en el cuerpo de la solicitud

    if (!id_item || !lapso_inicio || !lapso_fin || !id_co) {
      return res.status(400).send({
        ok: false,
        message:
          "Faltan parámetros necesarios: id_item, lapso_inicio, lapso_fin, id_co",
      });
    }

    const query = `
    SELECT 
      MV.ID_ITEM AS item,
      MV.ID_CO AS centro_operacion,
      ITMS.DESCRIPCION AS "nombre_item",
      ITMS.ID_TERC AS "proveedor_codigo",
      ITMS.NOM_TERC AS "proveedor_nombre",
      MIN(MV.FECHA_DCTO) AS fecha,  
      MV.ID_LIDES AS "lista_descuento",
      SUM(MV.DSCTO_NETOS) AS "valor_descuentos"
    FROM 
      ITEMS ITMS 
      RIGHT OUTER JOIN (CENTRO_OPERACION CO 
      RIGHT OUTER JOIN MOVIMIENTO_VENTAS MV ON CO.CODIGO = MV.ID_CO) 
      ON ITMS.ID_ITEM = MV.ID_ITEM AND ITMS.ID_EXT_ITM = MV.ID_EXT_ITM
    WHERE 
      MV.ID_ITEM = ? 
      AND MV.FECHA_DCTO BETWEEN ? AND ? 
      AND MV.ID_LIDES IS NOT NULL 
      AND MV.ID_LIDES != ''
      AND MV.ID_CO = ?
    `;

    // Aquí se incluyen todos los parámetros que la consulta necesita
    connection.query(
      query,
      [id_item, lapso_inicio, lapso_fin, id_co], // Agregamos id_co aquí
      function (err, results, fields) {
        if (!err) {
          if (results[0].item !== null) {
            res.send({
              ok: true,
              data: results,
            });
          } else {
            res.send({
              ok: false,
              data: results,
            });
          }
        } else {
          res.status(500).send({
            message: "Error en la petición",
            err,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Error al subir el archivo",
      error: error,
    });
  }
};

const download = async (req = request, res = response) => {
  const fileUrl = req.query.url; // El URL del archivo que quieres descargar
  const carpetaCompartida = "\\\\192.168.40.250\\trm_universal";
  const destino = path.join(carpetaCompartida, "archivo_descargado.txt");
  try {
    // Usamos axios para descargar el archivo desde la URL proporcionada
    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });

    // Creamos un archivo en la carpeta compartida
    const writer = fs.createWriteStream(destino);
    response.data.pipe(writer);

    writer.on("finish", () => {
      res.send("Archivo descargado y guardado exitosamente");
    });

    writer.on("error", (err) => {
      res.status(500).send("Error al guardar el archivo: " + err.message);
    });
  } catch (error) {
    res.status(500).send("Error al descargar el archivo: " + error.message);
  }
};

// Controlador para manejar la carga del archivo
const uploadFile = async (req = request, res = response) => {
  try {
    // Usamos multer para manejar el archivo enviado
    upload.single("file")(req, res, function (err) {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "Error al subir el archivo",
          error: err.message,
        });
      }

      // Si no hay errores, se maneja la carga exitosa
      if (!req.file) {
        return res.status(400).send({
          ok: false,
          message: "No se ha enviado ningún archivo",
        });
      }

      // Archivo subido correctamente
      res.status(200).send({
        ok: true,
        message: "Archivo subido correctamente",
        file: req.file,
      });
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "Error inesperado al procesar el archivo",
      error: error.message,
    });
  }
};

module.exports = {
  postDO,
  uploadFile,
};
