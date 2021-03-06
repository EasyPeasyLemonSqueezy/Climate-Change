#!/usr/bin/env python3

import os, sys
import json
import xlrd
from multiprocessing import Pool

from requests import get
from base64 import b64decode
from bs4 import BeautifulSoup

url = 'http://www.iea.org/statistics/statisticssearch/report/?country=%s&product=indicators&year=%s'


def parse_population(country):
    population = []

    for year in range(1990, 2016):
        population.append(float(b64decode(
            BeautifulSoup(get(url % (country, year)).text, 'html.parser')
                .find('table')
                .find('tr')
                .find('td')
                .text
            )))

    return population


def parse_xs(xs):
    values = []

    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        worksheet = workbook.sheet_by_name(f'Table10s1')

        for y in range(2, 2 + 26):
            value = int(worksheet.cell_value(6, y))
            values.append(value)

    return values


def parse(country, cc):
    print(f'Start: {country}')
    path = f'data/{country}'

    co2e = parse_xs(f'{path}/{os.listdir(path)[-1]}')
    population = parse_population(cc)

    print(f'Done: {country}')
    return country, tuple(map(lambda e, p: e / p, co2e, population))



if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')


    with open('countries.json') as f:
        countries = json.load(f)

    with Pool(processes=10) as pool:
        res = pool.starmap(parse, countries.items())

    with open('co2e_per_capita.min.json', 'w') as f:
        data = { c: v for c, v in res }
        json.dump(data, f)

