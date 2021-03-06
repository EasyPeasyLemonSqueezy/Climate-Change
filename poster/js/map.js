let currentYear = 1994;

let cache = {};
let map;


function initMap(countries, codes, callback) {
    document.getElementById("map-container").innerHTML = '';

    map = new Datamap({
        element: document.getElementById('map-container'),
        projection: 'mercator',
        fills: { defaultFill: '#F5F5F5' },
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            highlightFillColor: (geo) => geo['fillColor'] || '#F5F5F5',
            highlightBorderColor: '#B7B7B7',
            popupTemplate: (geo, data) => {
                console.log(data);
                if (!data) { return; }
                
                return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>CO₂e: <strong>', data.numberOfThings / 1000.0, '</strong>', '(kg per gdp)',
                        '</div>'].join('');
            }
        },
        setProjection: function (element) {
            let projection = d3.geo.mercator()
                .scale(50)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

            let path = d3.geo.path().projection(projection);
            return { path: path, projection: projection };
        }
    });


    drawMap(countries, codes);

    callback();
}


function drawMap(countries, codes) {
    if (currentYear in cache) {
        map.data = cache[currentYear];
    }
    else {
        let dataset = {};
        let onlyValues = [];

        for (let key in countries) {
            onlyValues.push(countries[key][currentYear - 1990]);
        }

        let minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        let paletteScale = d3.scale.log()
            .domain([minValue, maxValue])
            .range(["#d3d3d3", "#1F1F1F"]);

        for (let key in countries){
            let value = countries[key][currentYear - 1990];

            dataset[codes[key]] = {
                numberOfThings: Math.round(value),
                fillColor: paletteScale(value)
            };
        }

        cache[currentYear] = dataset;
    }

    map.updateChoropleth(cache[currentYear]);
}


function updateMap(countries, codes) {
    document.getElementById('map-year')
            .innerText
        = `Year: ${currentYear}`

    drawMap(countries, codes);

    ++currentYear;

    if (currentYear > 2015) {
        currentYear = 1994;
    }
}


function startMap(countries, codes) {
    updateMap(countries, codes);

    setInterval(() => {
        updateMap(countries, codes)
    }, 1000);
}


$.getJSON("/data/country_code.json", (codes) => {
    $.getJSON("/data/co2e_per_gdp.min.json", (countries) => {
        initMap(countries, codes,
            () => startMap(countries, codes)
        );
    });
});
