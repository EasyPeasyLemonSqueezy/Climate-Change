let currentCountry = -1;
var chart;

function drawDonut(data, countries) {
    chart = c3.generate({
        bindto: '#donut-container',
        data: {
            columns: data[countries[++currentCountry]],
            type : 'donut',
            colors: {
                'Biogases'          : "#ff7f0e",
                'Geothermal'        : "#d62728",
                'Hydro'             : "#8c564b",
                'Liquid biofuels'   : "#2ca02c",
                'Solar PV'          : "#e377c2",
                'Solar thermal'     : "#9467bd",
                'Tide, wave, ocean' : "#7f7f7f",
                'Wind'              : "#bcbd22",
                'other'             : "#1f77b4"
            }
        },
        donut: {
            title: "Energy"
        },
        legend: {
            show: false
        }
    });

    updateDonut(data, countries);

    setInterval(() => {
        updateDonut(data, countries);
    }, 10000);
}

let list = {
    'Hydro'             : document.getElementById('hydro-v'),
    'Wind'              : document.getElementById('wind-v'),
    'Biogases'          : document.getElementById('biogases-v'),
    'Solar PV'          : document.getElementById('solarpv-v'),
    'Solar thermal'     : document.getElementById('solarthermal-v'),
    'Tide, wave, ocean' : document.getElementById('tidewaveocean-v'),
    'Geothermal'        : document.getElementById('geothermal-v'),
    'Liquid biofuels'   : document.getElementById('biofuels-v'),
    'other'             : document.getElementById('other-v')
}

function updateList(data, country) {
    document.getElementById('country-v')
            .innerText
        = country;

    for (const [key, value] of data[country]) {
            list[key].innerText = value;
    }
}


function updateDonut(data, countries) {
    let newCountry = countries[(++currentCountry) % countries.length];


    updateList(data, newCountry);

    chart.load({
        columns: data[newCountry]
    });

    d3.select('#donut-container .c3-chart-arcs-title').node().innerHTML = newCountry;
}


$.getJSON("/data/electricity_generation.json", (data) => {
    let countries = Object.keys(data);
    drawDonut(data, countries);
});
