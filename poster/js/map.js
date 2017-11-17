$.getJSON("data/codes.json", (codes) => {
$.getJSON("data/countries.json", (countries) => {


let currentYear = 1990;

function drawMap() {
    var dataset = {};
    
    var onlyValues = [];
    for (var key in countries) {
        onlyValues.push(countries[key][currentYear]);
    }

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#ff5c58","#ff2600"]); 

    for (var key in countries){
        var value = countries[key][currentYear];
        dataset[codes[key]] = { numberOfThings: value, fillColor: paletteScale(value) };
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
                   '<br>CO2(Mkg): <strong>', data.numberOfThings, '</strong>',
                   '</div>'].join('');
           }
        }
    });
}

function startMap() {
    timer = setInterval(() => {
        document.getElementById('map-year')
                .getElementsByTagName('h3')[0]
                .innerText
            = `Year: ${currentYear}`

        drawMap();

        ++currentYear;

        if (currentYear > 2015) {
            currentYear = 1990;
        }

    }, 1000);
}

drawMap();
startMap();


});
});
