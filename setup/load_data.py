import csv
from elasticsearch import ConnectionError, Elasticsearch
import json
from math import log, sqrt
import sys
from time import sleep
import yaml

es = Elasticsearch([{'host': 'elasticsearch'}, {'port': 9200}])

def awaitConnection():
    i = {'i':0}
    n = 5
    def msg():
        sys.stdout.write('\rTrying to reach elasticsearch ')
        sys.stdout.write(' '*i['i'])
        sys.stdout.write('...')
        sys.stdout.write(' '*((n-1)-i['i']))
        sys.stdout.flush()
        i['i'] = (i['i'] + 1) % n

    print('')
    msg()
    while True:
        try:
            es.info()
            print('')
            return
        except ConnectionError:
            msg()
            sleep(1)

awaitConnection()
print('Connection established')
print('')

def getCountryData():
    with open('data/earth.json') as f:
        return json.load(f)

def getMetricData():
    with open('data/metrics.yml') as f:
        return yaml.load(f)

def getAlpha2Data():
    with open('data/alpha2.yml') as f:
        return yaml.load(f)

def getTimeseriesData():
    f = open('data/GenderStat_Data.csv', 'rb')
    return csv.DictReader(f)

def insertCountries():
    alpha2 = getAlpha2Data()

    for country in getCountryData()['features']:
        countryCode = country['id']

        body = {
            'code': countryCode,
            'name': country['properties']['name'],
            'coordinates': country['geometry']['coordinates'] if country['geometry']['type'] == 'MultiPolygon' else [country['geometry']['coordinates']]
        }

        if countryCode in alpha2:
            body['alpha2Code'] = alpha2[countryCode]

        es.index(
            index='data',
            doc_type='country',
            id=countryCode,
            body=body
        )

def insertMetrics():
    metricData = getMetricData()

    for categoryName, category in metricData['metrics'].items():
        for metricName, metric in category.items():
            properties = set()
            for series in metric['series'].values():
                properties.update(series.keys())

            es.index(
                index='data',
                doc_type='metric',
                id=metricName,
                body={
                    'metric': metricName,
                    'name': metric['name'],
                    'minValue': float(metric['minValue']),
                    'maxValue': float(metric['maxValue']),
                    'scale': metric['scale'],
                    'properties': {property: metricData['properties'][property] for property in properties}
                }
            )

def insertTimeSeries():
    categories = getMetricData()['metrics']
    metrics = {id: (key, properties) for category, metrics in categories.items() for key, metric in metrics.items() for id, properties in metric['series'].items()}

    firstCountryFound = False
    for row in getTimeseriesData():
        countryCode = row['Country Code']

        if countryCode == 'AFG':
            firstCountryFound = True

        if firstCountryFound:
            indicatorCode = row['Indicator Code']
            if indicatorCode not in metrics:
                continue
            metric, properties = metrics[indicatorCode]

            id = '.'.join((countryCode, indicatorCode))

            doc = {
                'id': indicatorCode,
                'countryCode': countryCode,
                'metric': metric,
                'values': {year: float(row[str(year)]) for year in range(1960, 2016) if row[str(year)] != ''}
            }

            for property, propertyValue in properties.items():
                doc[property] = propertyValue

            es.index(
                index='data',
                doc_type='timeSeries',
                id=id,
                body=doc
            )

scales = {
    'linear': lambda x: x,
    'sqrt': sqrt,
    'log': log
}
def normalize(v, min, max, scale):
    scale = scales[scale]
    v = scale(v)
    min = scale(min)
    max = scale(max)

    return (v - min) / (max - min)

def dist(v1, v2, min, max, scale):
    return abs(normalize(v1, min, max, scale) - normalize(v2, min, max, scale))

def getTimeSeries(field, value):
    result = es.search(
        index='data',
        doc_type='timeSeries',
        body={
            'query': {
                'bool': {
                    'filter': [
                        {
                            'term': {
                                field: value.lower()
                            }
                        }
                    ]
                }
            },
            'size': 1000
        }
    )

    result = result['hits']['hits']

    return {record['_id']: {int(year): value for year, value in record['_source']['values'].items()} for record in result}

def insertCountryDistances():
    countries = sorted([country['id'] for country in getCountryData()['features']])
    metrics = {series: metric for metrics in getMetricData()['metrics'].values() for metric in metrics.values() for series in metric['series'].keys()}

    for i in range(len(countries)):
        c1 = countries[i]
        c1data = getTimeSeries('countryCode', c1)

        for j in range(i+1, len(countries)):
            c2 = countries[j]
            c2data = getTimeSeries('countryCode', c2)

            distances = {}

            for year in range(1960, 2016):
                distance = 0
                n = 0
                for series, metric in metrics.items():
                    k1 = '.'.join([c1, series])
                    k2 = '.'.join([c2, series])

                    if k1 not in c1data or k2 not in c2data or year not in c1data[k1] or year not in c2data[k2]:
                        continue

                    distance += dist(c1data[k1][year], c2data[k2][year], float(metric['minValue']), float(metric['maxValue']), metric['scale'])
                    n += 1
                distances[year] = (distance / n) if n > 0 else 1

            es.index(
                index='data',
                doc_type='countryDistance',
                id='-'.join([c1, c2]),
                body={
                    'country1': c1,
                    'country2': c2,
                    'distances': distances
                }
            )

def insertMetricDistances():
    pass

if not es.indices.exists('data'):
    print('Inserting countries...')
    insertCountries()
    print('Done')

    print('Inserting metrics...')
    insertMetrics()
    print('Done')

    print('Inserting time series...')
    insertTimeSeries()
    print('Done')

    print('Inserting distances between countries...')
    #insertCountryDistances()
    print('Done')

    print('Inserting distances between metrics...')
    #insertMetricDistances()
    print('Done')

    print('')
    print('All done!')
else:
    print('Data was already set up')