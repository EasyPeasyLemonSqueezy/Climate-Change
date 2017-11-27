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
    'Belgium',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'European Union',
    'Germany',
    'Hungary',
    'Ireland',
    'Malta',
    'Netherlands',
    'Spain',
    'United Kingdom'
]



let fucked_countries = [
    'Canada',
    'Japan',
    'Kazakhstan',
    'Latvia',
    'New Zealand',
    'Russian Federation'
]



let awesome;
let fucked;

let data;
let awesome_name = document.getElementById('awesome-country')
                           .getElementsByTagName('h3')[0];

let fucked_name  = document.getElementById('fucked-country')
                           .getElementsByTagName('h3')[0];


function choice(arr, prev) {
    let country;

    do {
        country = arr[Math.floor(arr.length * Math.random())];
    } while (country == prev);

    return country;
}


function flow() {
    let awesome_country = awesome_countries[3];
    let fucked_country = fucked_countries[4];

    awesome = c3.generate({
        bindto: '#awesome',
        data: {
            x: 'years',
            columns: data[awesome_country],
            types: types,
            axes: axes,
        },
        axis: axis
    });

    fucked = c3.generate({
        bindto: '#fucked',
        data: {
            x: 'years',
            columns: data[fucked_country],
            types: types,
            axes: axes,
        },
        axis: axis
    });

    awesome_name.innerText = awesome_country;
    fucked_name.innerText  = fucked_country;

    let new_awesome = awesome_country;
    let new_fucked = fucked_country;

    setInterval(() => {
        new_awesome = choice(awesome_countries, new_awesome);
        new_fucked  = choice(fucked_countries, new_fucked);

        awesome.load({
            columns: data[new_awesome],
        });

        fucked.load({
            columns: data[new_fucked],
        });

        awesome_name.innerText = new_awesome;
        fucked_name.innerText  = new_fucked;
    }, 10000);
}


$.getJSON('/data/renewable_to_emissions.min.json', (res) => {
    data = res;
    flow(res);
})