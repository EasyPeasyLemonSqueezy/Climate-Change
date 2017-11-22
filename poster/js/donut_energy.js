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

        chart.load({
            columns: data[newCountry]
        });

        document.getElementById('energy-country')
                .getElementsByTagName('h3')[0]
                .innerText
            = newCountry;

        d3.select('#donut-container .c3-chart-arcs-title').node().innerHTML = newCountry;

    }, 1000);
}




$.getJSON("/data/electricity_generation.json", (data) => {
    let countries = Object.keys(data);
    drawDonut(data, countries);
});
