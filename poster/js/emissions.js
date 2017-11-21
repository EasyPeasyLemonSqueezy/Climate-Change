let size = {
    height: 240,
    width: 400
}

let types = {
    'CO\u2082e'         : 'spline',
    'Biogases'          : 'area-spline',
    'Liquid biofuels'   : 'area-spline',
    'Geothermal'        : 'area-spline',
    'Solar thermal'     : 'area-spline',
    'Hydro'             : 'area-spline',
    'Solar PV'          : 'area-spline',
    'Tide, wave, ocean' : 'area-spline',
    'Wind'              : 'area-spline'
}

let axes = {
    'CO\u2082e'         : 'y2',
    'Biogases'          : 'y',
    'Liquid biofuels'   : 'y',
    'Geothermal'        : 'y',
    'Solar thermal'     : 'y',
    'Hydro'             : 'y',
    'Solar PV'          : 'y',
    'Tide, wave, ocean' : 'y',
    'Wind'              : 'y'
}

let axis = {
    x: { label: 'year' },
    y: { label: 'GWh' },
    y2: {
        label: 'Mt',
        show: true
    }
}

let awesome_countries = [
    'Germany',
    'Italy',
    'Malta',
    'Belgium',
    'Denmark',
    'European Union',
    'Netherlands',
    'Spain'
]

let fucked_countries = [
    'Canada',
    'Kazakhstan',
    'Latvia',
    'New Zealand',
    'Russian Federation',
    'France',
    'Norway'
]


let awesome;
let fucked;

let data;
let awesome_name = document.getElementById('awesome-country')
                           .getElementsByTagName('h3')[0];

let fucked_name  = document.getElementById('fucked-country')
                           .getElementsByTagName('h3')[0];


function flow() {
    let countryIndex = 0;

    awesome = c3.generate({
        bindto: '#awesome',
        data: {
            x: 'years',
            columns: data[awesome_countries[countryIndex]],
            types: types,
            axes: axes,
        },
        axis: axis
    });

    fucked = c3.generate({
        bindto: '#fucked',
        data: {
            x: 'years',
            columns: data[fucked_countries[countryIndex]],
            types: types,
            axes: axes,
        },
        axis: axis
    });

    awesome_name.innerText = awesome_countries[0];
    fucked_name.innerText  = fucked_countries[0];

    setInterval(() => {
        let index = countryIndex % awesome_countries.length;

        awesome.load({
            columns: data[awesome_countries[index]],
        });

        fucked.load({
            columns: data[fucked_countries[index]],
        });

        awesome_name.innerText = awesome_countries[index];
        fucked_name.innerText  = fucked_countries[index];

        ++countryIndex;
    }, 1000);
}


$.getJSON('/data/renewable_to_emissions.min.json', (res) => {
    data = res;
    flow(res);
})