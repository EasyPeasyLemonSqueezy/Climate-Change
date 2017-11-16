#!/usr/bin/env python3

import os, sys
from multiprocessing import Pool

import matplotlib.pyplot as plt
import numpy as np
import xlrd


def parse(xs):
    with xlrd.open_workbook(xs, on_demand=True) as workbook:
        worksheet = workbook.sheet_by_name('Table1s1')

        year = int(worksheet.cell_value(0, 7).split()[1])
        value = worksheet.cell_value(6, 1)

        print(f'Inventory {year}: {value}')

        return year, value


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    elif len(sys.argv) != 2:
        sys.exit('Expected one arguent - path to data.\n')

    path = sys.argv[1]

    with Pool(processes=10) as pool:
        res = pool.map(parse, map(lambda e: e.path, os.scandir(path)))

    years, values = zip(*res)

    plt.plot(years, values)

    axes = plt.gca()
    axes.set_xticks(np.linspace(min(years), max(years), 7, endpoint=True, dtype=int))
    axes.set_yticks(np.linspace(0, max(values), 10, endpoint=True))
    plt.grid()
    plt.title("Russian Federation. Total CO₂ emissions.")

    # plt.savefig('data.png')

    plt.show()