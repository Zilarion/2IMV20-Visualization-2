import csv
from elasticsearch import Elasticsearch
import json
import yaml

es = Elasticsearch([{'host': 'elasticsearch'}, {'port': 9200}])

def getCountryData():
    with open('data/earth.json') as f:
        return json.load(f)

def getIndicatorData():
    with open('data/indicators.yml') as f:
        return yaml.load(f)

def getTimeseriesData():
    f = open('data/GenderStat_Data.csv', 'rb')
    return csv.DictReader(f)

def insertCountries():
    for country in getCountryData()['features']:
        countryCode = country['id']

        es.index(
            index='data',
            doc_type='country',
            id=countryCode,
            body={
                'code': countryCode,
                'name': country['properties']['name'],
                'coordinates': country['geometry']['coordinates']
            }
        )

def insertIndicators():
    indicatorData = getIndicatorData()

    for categoryName, category in indicatorData['indicators'].items():
        for indicatorName, indicator in category.items():
            properties = set()
            for series in indicator['series'].values():
                properties.update(series.keys())

            es.index(
                index='data',
                doc_type='indicator',
                id=indicatorName,
                body={
                    'id': indicatorName,
                    'name': indicator['name'],
                    'properties': {property: indicatorData['properties'][property] for property in properties}
                }
            )

def insertTimeSeries():
    categories = getIndicatorData()['indicators']
    indicators = {id: (key, properties) for category, indicators in categories.items() for key, indicator in indicators.items() for id, properties in indicator['series'].items()}

    firstCountryFound = False
    for row in getTimeseriesData():
        countryCode = row['Country Code']

        if countryCode == 'AFG':
            firstCountryFound = True

        if firstCountryFound:
            indicatorCode = row['Indicator Code']
            if indicatorCode not in indicators:
                continue
            indicator, properties = indicators[indicatorCode]

            doc = {
                'countryCode': countryCode,
                'indicator': indicator,
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
    insertCountries()
    insertIndicators()
    insertTimeSeries()