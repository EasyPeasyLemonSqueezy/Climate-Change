#!/usr/bin/env python3

import json
import os, sys
from multiprocessing import Pool

import xlrd


def parse(xs):
    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        # worksheet = workbook.sheet_by_name('Table1s1')
        worksheet = workbook.sheet_by_index(1)

        year = worksheet.cell_value(0, 7).split()[1]
        value = worksheet.cell_value(6, 1)

        return year, value

def country_data(path):
    print(f'Start: {os.path.basename(path)}')
    return os.path.basename(path), [parse(xs) for xs in os.scandir(path)]


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    elif len(sys.argv) != 2:
        sys.exit('Expected one arguent - path to data.\n')

    path = sys.argv[1]

    with Pool(processes=10) as pool:
        res = pool.map(country_data, map(lambda e: e.path, os.scandir(path)))


    data = {country: {year: value for year, value in yv} for country, yv in res}

    with open('result.json', 'w') as f:
        json.dump(data, f)