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


    setInterval(() => {
        let newCountry = countries[(++currentCountry) % countries.length];


        updateList(data[newCountry]);

        chart.load({
            columns: data[newCountry]
        });

        document.getElementById('country-v')
                .innerText
            = newCountry;

        d3.select('#donut-container .c3-chart-arcs-title').node().innerHTML = newCountry;

    }, 1000);
}

let list = {
    'Biogases'          : document.getElementById('hydro-v'),
    'Geothermal'        : document.getElementById('wind-v'),
    'Hydro'             : document.getElementById('biogases-v'),
    'Liquid biofuels'   : document.getElementById('solarpv-v'),
    'Solar PV'          : document.getElementById('solarthermal-v'),
    'Solar thermal'     : document.getElementById('tidewaveocean-v'),
    'Tide, wave, ocean' : document.getElementById('geothermal-v'),
    'Wind'              : document.getElementById('biofuels-v'),
    'other'             : document.getElementById('other-v')
}

function updateList(data) {
    for (const [key, value] of data) {
            list[key].innerText = value;
    }
}



$.getJSON("/data/electricity_generation.json", (data) => {
    let countries = Object.keys(data);
    drawDonut(data, countries);
});
