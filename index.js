
async function start() {
    console.log("Iniciando reparación de Archivos")
    let file = process.argv[2];
    if (!file) {
        console.error("Usar npm index.js file-to-fix");
        process.exit(1);
    }
    console.log("Fix file: " + file);
    if (file.endsWith("/comunas.geojson")) {
        await require("./lib/FixComunas")(file)
    } else {
        console.error("Archivo no reconocido");
        process.exit(1);
    }
    
    console.log("Finalizado");
}

start()