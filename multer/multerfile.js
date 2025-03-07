const multer = require("multer");

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ruta compartida donde se guardará el archivo
    const uploadPath = "\\\\192.168.40.250\\trm_universal"; // Ruta compartida
    cb(null, uploadPath); // Establecer la carpeta de destino
  },
  filename: function (req, file, cb) {
    // Renombrar el archivo para evitar colisiones de nombres
    const nombreArchivo = file.originalname;
    cb(null, nombreArchivo); // Usamos el nombre original del archivo
  },
});

// Inicializar el middleware multer con la configuración de almacenamiento
const upload = multer({ storage: storage });


module.exports = {
    storage,
    upload,
  };
  