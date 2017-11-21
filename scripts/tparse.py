#!/usr/bin/env python3

import os, sys
import json
import xlrd
from multiprocessing import Pool

from requests import get
from base64 import b64decode
from bs4 import BeautifulSoup



path = 'bp-statistical-review-of-world-energy-2017-underpinning-data.xlsx'
url = 'http://www.iea.org/statistics/statisticssearch/report/?country=%s&product=renewablesandwaste&year=%s'
energy_params = ('Biogases', 'Liquid biofuels', 'Geothermal', 'Solar thermal', 'Hydro', 'Solar PV', 'Tide, wave, ocean', 'Wind')

def parse_ee(xs):
    values = {}

    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        worksheet = workbook.sheet_by_name('Electricity Generation ')

        for c in range(3, 86):
            country = worksheet.cell_value(c, 0)

            if country:
                value = float(worksheet.cell_value(c, 31))

                values[country] = [['other', value * 876]]

    return values


def parse_renewable(country):
    values = list(map(
        lambda cell: int(b64decode(cell.find(text=True))),
        BeautifulSoup(get(url % (country, 2015)).text, 'html.parser')
            .find('table')
            .find_all('tr')[1]
            .find_all('td')[3:]
        ))

    return values


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    energy = parse_ee(path)
    energy['United States'] = [[ 'other', energy['Other S. & Cent. America'][0][1] + energy['Total S. & Cent. America'][0][1] ]]
    energy['Malta'] = [[ 'other', 1303 * 876 ]]
    energy['Kazakhstan2'] = energy['Kazakhstan']

    with open('countries.json') as f:
        countries = json.load(f)

    for k, v in countries.items():
        if k in energy:
            renewables = parse_renewable(v)
            energy[k][0][1] -= sum(renewables)

            for name, value in zip(energy_params, renewables):
                energy[k].append([name, value])
        else:
            print(f'Can\'t find {k}')

    energy = { k: v for k, v in energy.items() if len(v) > 1 }


    with open('electricity_generation.json', 'w') as f:
        json.dump(energy, f)