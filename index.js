
async function start() {
    console.log("Iniciando reparación de Archivos")
    let file = process.argv[2];
    if (!file) {
        console.error("Usar npm index.js file-to-fix");
        process.exit(1);
    }
    console.log("Fix file: " + file);
    await require("./lib/Simplify")(file);
    
    console.log("Finalizado");
}

start()