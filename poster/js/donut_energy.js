let currentCountry = -1;
var chart;

function drawDonut(data, countries) {
    chart = c3.generate({
        bindto: '#donut-container',
        data: {
            columns: data[countries[++currentCountry]],
            type : 'donut'
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

        chart.unload();
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




$.getJSON("../data/electricity_generation.json", (data) => {
    console.log(data)
    let countries = Object.keys(data);
    drawDonut(data, countries);
});
