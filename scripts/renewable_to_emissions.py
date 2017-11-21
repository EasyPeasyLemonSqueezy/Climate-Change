#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import io
import os, sys
import json
import xlrd
from math import ceil, log10
from multiprocessing import Pool

from requests import get
from base64 import b64decode
from bs4 import BeautifulSoup

url = 'http://www.iea.org/statistics/statisticssearch/report/?country=%s&product=renewablesandwaste&year=%s'
energy_params = ('Biogases', 'Liquid biofuels', 'Geothermal', 'Solar thermal', 'Hydro', 'Solar PV', 'Tide, wave, ocean', 'Wind')

awesome = (
    'Germany',
    'Italy',
    'Malta',
    'Belgium',
    'Denmark',
    'European Union',
    'Netherlands',
    'Spain'
)

fucked = (
    'Canada',
    'Kazakhstan2',
    'Latvia',
    'New Zealand',
    'Russian Federation',
    'France',
    'Norway'
)


def parse_energy(country):
    data = []

    for year in range(1990, 2016):
        values = tuple(map(
            lambda cell: int(b64decode(cell.find(text=True))),
            BeautifulSoup(get(url % (country, year)).text, 'html.parser')
                .find('table')
                .find_all('tr')[1]
                .find_all('td')[3:]
            ))

        data.append(values)

    return data


def parse_xs(xs):
    values = []

    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        worksheet = workbook.sheet_by_name(f'Table10s1')

        for y in range(2, 2 + 26):
            year = int(worksheet.cell_value(4, y))
            value = int(worksheet.cell_value(6, y))

            values.append(value)

    return values


def parse(country, cc):
    print(f'Start: {country}')
    path = f'data/{country}'

    emissions = parse_xs(f'{path}/{os.listdir(path)[-1]}')
    energy = parse_energy(f'{cc}')

    print(f'Done: {country}')
    return country, [[u'CO₂e'] + emissions]             \
                  + list(zip(energy_params, *energy))   \
                  + [['years'] + list(range(1990, 2016))]



if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    with open('countries.json') as f:
        countries = json.load(f)


    with Pool(processes=20) as pool:
        res = pool.starmap(parse, [(c, countries[c]) for c in awesome + fucked])


    data = { c: v for c, v in res }
    data['Kazakhstan'] = data.pop('Kazakhstan2')

    with io.open(f'renewable_to_emissions.min.json', 'w', encoding='utf8') as f:
        json.dump(data, f, ensure_ascii=False)