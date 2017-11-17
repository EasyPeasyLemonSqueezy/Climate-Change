var codes;
var countries;

$.ajaxSetup({
    async: false
});

$.getJSON("data/codes.json", function(json) {
    codes = json;
});

$.getJSON("data/countries.json", function(json) {
    countries = json;
});

$.ajaxSetup({
    async: true
});

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

	document.getElementById("container").innerHTML = "";

	new Datamap({
   		element: document.getElementById('container'),
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
        drawMap();

        ++currentYear;

		if (currentYear > 2015) {
			currentYear = 1990;
		}
    }, 5000);
}

drawMap();

startMap();