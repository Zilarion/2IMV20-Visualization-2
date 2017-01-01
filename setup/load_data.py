import csv
from elasticsearch import ConnectionError, Elasticsearch
import json
from time import sleep
import yaml

es = Elasticsearch([{'host': 'elasticsearch'}, {'port': 9200}])

def awaitConnection():
    while True:
        try:
            es.info()
            return
        except ConnectionError:
            print('Cannot reach elasticsearch...')
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

            doc = {
                'countryCode': countryCode,
                'metric': metric,
                'values': {year: float(row[str(year)]) for year in range(1960, 2016) if row[str(year)] != ''}
            }

            for property, propertyValue in properties.items():
                doc[property] = propertyValue

            es.index(
                index='data',
                doc_type='timeSeries',
                id='.'.join((countryCode, indicatorCode)),
                body=doc
            )

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
    print('')
    print('All done')
else:
    print('Data was already set up')