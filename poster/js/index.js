let size = {
    height: 240,
    width: 400
}

let data = [
    ['data1', 30, 200, 100, 400, 150, 250],
    ['data2', 50, 20, 10, 40, 15, 25]
]

var chart_1 = c3.generate({
    bindto: '#chart-1',
    data: {
        columns: [
            ['data1', 300, 350, 300, 0, 0, 120],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            data1: 'area-spline',
            data2: 'area-spline'
        },
        groups: [['data1', 'data2']]
    },
    size: {
        height: 240,
        width: 400
    }
});

var chart_2 = c3.generate({
    bindto: '#chart-2',
    data: { columns: data },
    size: size
});

var chart_3 = c3.generate({
    bindto: '#chart-3',
    data: { columns: data },
    size: size
});

var chart_4 = c3.generate({
    bindto: '#chart-4',
    data: { columns: data },
    size: size
});

var emissions = c3.generate({
    bindto: '#emissions',
    data: {
        x: 'x',
        url: 'https://gist.githubusercontent.com/Learko/902368969add285b42bdecd0e83a1716/raw/03ab99c8f52c65c52b690256ba1bfbff79861dfb/co2e.json',
        mimeType: 'json'
    },
    size: {
        height: 700
    }
});