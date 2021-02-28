const fetch = require('node-fetch');
let cityJson = require('./cities.json');
const fs = require('fs');

let result = [];

async function main() {
    for (let i = 0; i < cityJson.length; i++) {
        let town = cityJson[i].town;
        let state = cityJson[i].state;

        let string = `${town}, ${state}`;

        let stringClean = string
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        await fetchGeoData(stringClean).then((data) => {
            let lat =
                data &&
                data.geonames &&
                Array.isArray(data.geonames) &&
                data.geonames.length > 0 &&
                data.geonames[0].lat
                    ? data.geonames[0].lat
                    : '';
            let lng =
                data &&
                data.geonames &&
                Array.isArray(data.geonames) &&
                data.geonames.length > 0 &&
                data.geonames[0].lng
                    ? data.geonames[0].lng
                    : '';

            result.push({
                town: town,
                state: state,
                lat: lat,
                lng: lng,
            });
            if (lat == '') {
                console.log('ERROR ON', town);
            }
            console.log(
                `${i}: Town:${town} State:${state} Lat:${lat} Lng:${lng}`
            );
        });
    }
}

async function fetchGeoData(str) {
    const response = await fetch(
        `http://api.geonames.org/searchJSON?q=${str}&maxRows=1&username=`
    );
    const data = await response.json();
    return data;
}

main().then(() => {
    const data = JSON.stringify(result, null, 2);
    fs.writeFileSync('results.json', data);
});
