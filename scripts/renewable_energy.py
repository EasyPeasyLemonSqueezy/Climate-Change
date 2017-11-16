#!/usr/bin/env python3

import os, sys
import json
import xlrd
from math import ceil, log10
from multiprocessing import Pool

# from selenium import webdriver
from requests import get
from base64 import b64decode
from bs4 import BeautifulSoup

import matplotlib.pyplot as plt
import numpy as np


url = 'http://www.iea.org/statistics/statisticssearch/report/?country=%s&product=renewablesandwaste&year=%s'
energy_params = ('Biogases', 'Liquid biofuels', 'Geothermal', 'Solar thermal', 'Hydro', 'Solar PV', 'Tide, wave, ocean', 'Wind')
emissions_params = ('CO₂', 'CH₄', 'N₂O')


def parse_energy(country):
    data = []
    # driver = webdriver.PhantomJS('/opt/phantomjs/phantomjs')

    for year in range(1990, 2016):
        # driver.get(url % (country, year))

        # values = tuple(map(
        #     lambda c: int(c.find(text=True)),
        #     BeautifulSoup(driver.page_source, 'html.parser')
        #         .find('table')
        #         .find_all('tr')[2]
        #         .find_all('td')[3:]
        #     ))

        values = tuple(map(
            lambda cell: int(b64decode(cell.find(text=True))),
            BeautifulSoup(get(url % (country, year)).text, 'html.parser')
                .find('table')
                .find_all('tr')[1]
                .find_all('td')[3:]
            ))

        data.append(values)

    # driver.quit()
    return data


def parse_xs(xs):
    data = []

    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        for n in range(2, 5):
            worksheet = workbook.sheet_by_name(f'Table10s{n}')

            values = []

            for y in range(2, 2 + 26):
                year = int(worksheet.cell_value(4, y))
                value = int(worksheet.cell_value(6, y))

                values.append(value)

            data.append(values)

    return data


def parse(country, cc):
    print(f'Start: {country}')
    path = f'data/{country}'

    emissions = parse_xs(f'{path}/{os.listdir(path)[-1]}')
    energy = parse_energy(f'{cc}')

    print(f'Done: {country}')
    return country, emissions, energy



if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    with open('countries.json') as f:
        countries = json.load(f)


    with Pool(processes=20) as pool:
        res = pool.starmap(parse, countries.items())

    fig = plt.figure()

    for r in res:
        country, emissions, energy = r

        emax = fig.add_subplot(111)
        enax = emax.twinx()

        enax.set_xticks(np.linspace(1990, 2015, 7, endpoint=True, dtype=int))

        en_max = max(map(max, energy))
        enax.set_yticks(np.linspace(0, round(en_max, -ceil(log10(en_max)) + 2), 11, endpoint=True))
        enax.set_ylabel('Renewable Energy, GWh')

        em_max = max(map(max, emissions))
        emax.set_yticks(np.linspace(0, round(em_max, -ceil(log10(em_max)) + 2), 11, endpoint=True))
        emax.set_ylabel('Emissions, kt')

        handles = []

        for em, label in zip(emissions, emissions_params):
            h, = emax.plot(range(1990, 2016), em, 'r--', label=label)
            handles.append(h)

        for en, label in zip(zip(*energy), energy_params):
            h, = enax.plot(range(1990, 2016), en, label=label)
            handles.append(h)

        plt.title(country)
        plt.legend(handles=handles, loc='center left', bbox_to_anchor=(1.2, 0.5))

        plt.savefig(f'renewable/{country}.png', bbox_inches='tight')
        plt.clf()
        fig.clf()