#!/usr/bin/env python3

import sys
from io import BytesIO
from multiprocessing import Pool

from bs4 import BeautifulSoup
from requests import get
from zipfile import ZipFile


url = 'http://unfccc.int/'
path = '/national_reports/annex_i_ghg_inventories/national_inventories_submissions/items/10116.php'


def save(name, path):
    with ZipFile(BytesIO(get(f'{url}{path}').content)) as arc:
        arc.extractall(f'data/{name}/')


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        sys.exit('Python 3.6 or later is required.\n')

    table = BeautifulSoup(get(f'{url}{path}').text, 'html.parser').find_all('td', {'class': 'mT'})[1].find('table')

    data = set()
    
    for row in table.find_all('tr', {'bgcolor' : '#FFFFFF'}):
        cols =  row.find_all('td')

        country = cols[0].get_text().strip()
        ref_crf = cols[3].find('a', text='CRF') # Fuck Spain.
        ref_con = cols[3].find('a', text='Convention')


        if ref_crf:
            data.add((country, ref_crf['href']))
        elif ref_con:
            data.add((country, ref_con['href']))
        else:
            print(f'Can\'t find CRF file for {country}.')


    with Pool(processes=10) as pool:
        pool.starmap(save, data)