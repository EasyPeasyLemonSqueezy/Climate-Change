let currentYear = 1990;


function drawMap(countries, codes) {
    var dataset = {};
    
    var onlyValues = [];
    for (var key in countries) {
        onlyValues.push(countries[key][currentYear - 1990]);
    }

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    var paletteScale = d3.scale.log()
        .domain([minValue,maxValue])
        .range(["#d3d3d3", "#1F1F1F"]); 

    for (var key in countries){
        var value = countries[key][currentYear - 1990];
        dataset[codes[key]] = { numberOfThings: Math.round(value / 1000), fillColor: paletteScale(value) };
    }

    document.getElementById("map-container").innerHTML = "";

    new Datamap({
        element: document.getElementById('map-container'),
        projection: 'mercator',
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
           borderColor: '#DEDEDE',
           highlightBorderWidth: 2,
           highlightFillColor: function(geo) {
               return geo['fillColor'] || '#F5F5F5';
           },
           highlightBorderColor: '#B7B7B7',
           popupTemplate: function(geo, data) {
               if (!data) { return ; }
               return ['<div class="hoverinfo">',
                   '<strong>', geo.properties.name, '</strong>',
                   '<br>CO2(Gkg): <strong>', data.numberOfThings, '</strong>',
                   '</div>'].join('');
           }
        },
        setProjection: function (element) {
            let projection = d3.geo.mercator()
                .scale(80)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

            let path = d3.geo.path().projection(projection);
            return { path: path, projection: projection };
        }
    });
}

function startMap(countries, codes) {
    timer = setInterval(() => {
        document.getElementById('map-year')
                .getElementsByTagName('h3')[0]
                .innerText
            = `Year: ${currentYear}`

        drawMap(countries, codes);

        ++currentYear;

        if (currentYear > 2015) {
            currentYear = 1990;
        }

    }, 1000);
}


$.getJSON("/data/country_code.json", (codes) => {
    $.getJSON("/data/co2e.min.json", (countries) => {
        drawMap(countries, codes);
        startMap(countries, codes);
    });
});
