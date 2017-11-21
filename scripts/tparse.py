#!/usr/bin/env python3

import os, sys
import json
import xlrd
from multiprocessing import Pool

from requests import get
from base64 import b64decode
from bs4 import BeautifulSoup

from collections import Counter


renewable_product = 'renewablesandwaste'
energy_product    = 'electricityandheat'
url = 'http://www.iea.org/statistics/statisticssearch/report/?country=%s&product=%s&year=%s'
energy_params = ('Biogases', 'Liquid biofuels', 'Geothermal', 'Solar thermal', 'Hydro', 'Solar PV', 'Tide, wave, ocean', 'Wind')

def parse_energy(country):
    value = int(b64decode(
        BeautifulSoup(get(url % (country, energy_product, 2015)).text, 'html.parser')
            .find('table')
            .find_all('tr')[14]
            .find_all('td')[0]
            .text
        ))

    return value


def parse_renewable(country):
    values = list(map(
        lambda cell: int(b64decode(cell.text)),
        BeautifulSoup(get(url % (country, renewable_product, 2015)).text, 'html.parser')
            .find('table')
            .find_all('tr')[1]
            .find_all('td')[3:]
        ))

    return values


def parse(country, country_code):
    renew = parse_renewable(country_code)
    other = parse_energy(country_code) - sum(renew)

    return country, { k: v for k, v in zip(('other',) + energy_params, [other] + renew) }



if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    with open('countries.json') as f:
        countries = json.load(f)

    with Pool(processes=20) as pool:
        energy = pool.starmap(parse, countries.items())

    data = { c: [[k, v] for k, v in e.items()] for c, e in energy }
    data['Kazakhstan'] = data.pop('Kazakhstan2')


    with open('electricity_generation.json', 'w') as f:
        json.dump(data, f)