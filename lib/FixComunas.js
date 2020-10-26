const fs = require("fs");

async function fixComunas(file) {
    try {
        console.log("Cargando Provincias...");
        let p = file.lastIndexOf("/");
        let path = file.substr(0, p);
        let provincias = JSON.parse(fs.readFileSync(path + "/provincias.geojson"));
        console.log(provincias.features.length + " provincias leidas");
        console.log("Cargando Comunas...");
        let comunas = JSON.parse(fs.readFileSync(file));
        console.log(comunas.features.length + " comunas leidas");
        for (let comuna of comunas.features) {
            let nombreProvincia = comuna.properties.nombreProvincia;
            let prov = provincias.features.find(p => p.properties.name == nombreProvincia);
            console.log(comuna.properties.name + " [" + comuna.properties.nombreProvincia + "] -> " + (prov?prov.properties.id:"NULL"))
            comuna.properties.codigoProvincia = (prov?prov.properties.id:"00")
        }
        console.log("Escribiendo archivo modificado...")
        fs.writeFileSync(file, JSON.stringify(comunas))
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
} 

module.exports = fixComunas;