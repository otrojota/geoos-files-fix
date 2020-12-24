const fs = require("fs");
const turf = require("@turf/turf");

async function simplify(path) {
    console.log("Abriendo archivo ... ", path);
    let geojson = JSON.parse(fs.readFileSync(path));
    console.log("Features:" + geojson.features.length);
    let newFeatures = [];
    for (let f of geojson.features) {
        console.log("[" + f.properties.id + "] " + f.properties.name);
        let geo = f.geometry;
        if (geo.type == "MultiPolygon") {
            console.log("  => MultiPolygon [" + geo.coordinates.length + " subpolygons]");
            let n = geo.coordinates.reduce((n, c) => {
                return n+ c[0].length;
            }, 0);
            console.log("    - Coordenadas antes:" + n);
            let newCoordinates = [];
            for (let c of geo.coordinates) {
                let subPoly = {type:"Feature", properties:{}, geometry:{type:"Polygon", coordinates:c}};
                let area = turf.area(subPoly);
                //console.log("      -> Subpolygon:" + c[0].length + " coords, " + area + " area");
                if (area > 10000000) newCoordinates.push(c);
            }
            f.geometry.coordinates = newCoordinates;
            let f2 = turf.simplify(f, {tolerance:0.005, highQuality:true, mutate:false})
            n = f2.geometry.coordinates.reduce((n, c) => {
                return n+ c[0].length;
            }, 0);
            newFeatures.push(f2);
            console.log("    - Coordenadas después:" + n + " en " + f2.geometry.coordinates.length + " poligonos");
        } else if (geo.type == "Polygon") {
            console.log("  => Polygon");
            console.log("    - Coordenadas antes:" + geo.coordinates[0].length);
            let f2 = turf.simplify(f, {tolerance:0.005, highQuality:true, mutate:false})
            console.log("    - Coordenadas después:" + f2.geometry.coordinates[0].length);
            newFeatures.push(f2);
        }
    } 
    geojson.features = newFeatures;
    let p = path.lastIndexOf(".");
    let newPath = path.substr(0,p) + "-simpl.geojson";
    fs.writeFileSync(newPath, JSON.stringify(geojson));
}

module.exports = simplify;