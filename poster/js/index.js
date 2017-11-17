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

let awesome = c3.generate({
    bindto: '#awesome',
    data: {
        x: 'years',
        url: '../data/renewable_results/Italy.json',
        mimeType: 'json',
        types: types,
        axes: axes,
    },
    axis: axis
});

let fucked = c3.generate({
    bindto: '#fucked',
    data: {
        x: 'years',
        url: '../data/renewable_results/Russian Federation.json',
        mimeType: 'json',
        types: types,
        axes: axes,
    },
    axis: axis
});


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
    'Kazakhstan2',
    'Latvia',
    'New Zealand',
    'Russian Federation',
    'France',
    'Norway'
]

function getData(country) {
    return {
        url: `../data/renewable_results/${country}.json`,
        x: 'years',
        mimeType: 'json',
        types: types,
        axes: axes,
        unload: true
    }
}

let currentIndex = 0;

function startDemo() {
    let awesome_name = document.getElementById('awesome-country')
                               .getElementsByTagName('h3')[0];

    let fucked_name  = document.getElementById('fucked-country')
                               .getElementsByTagName('h3')[0];

    awesome_name.innerText = awesome_countries[0];
    fucked_name.innerText  = fucked_countries[0];
    

    timer = setInterval(() => {
        ++currentIndex;

        awesome.load(getData(awesome_countries[currentIndex % awesome_countries.length]));
        fucked.load(getData(fucked_countries[currentIndex % fucked_countries.length]))

        awesome_name.innerText = awesome_countries[currentIndex % awesome_countries.length];
        fucked_name.innerText  = fucked_countries[currentIndex % fucked_countries.length];
    }, 5000);
}

startDemo();