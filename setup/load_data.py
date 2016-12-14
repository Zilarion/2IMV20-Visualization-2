import csv
from elasticsearch import Elasticsearch
import yaml

def getIndicators():
  with open('indicators.yml') as f:
    categories = yaml.load(f)['indicators']
    return {id: (key, properties) for category, indicators in categories.items() for key, indicator in indicators.items() for id, properties in indicator['series'].items()}

indicators = getIndicators()

es = Elasticsearch([{'host': 'elasticsearch'}, {'port': 9200}])

with open('data/GenderStat_Data.csv', 'rb') as f:
  reader = csv.DictReader(f)

  firstCountryFound = False
  for row in reader:
      countryCode = row['Country Code']

      if countryCode == 'AFG':
        firstCountryFound = True

      if firstCountryFound:
        for year in range(1960, 2016):
          value = row[str(year)];
          if (value == ''):
            continue

          indicatorCode = row['Indicator Code']

          if indicatorCode not in indicators:
            continue

          indicator, properties = indicators[indicatorCode]

          doc = {
            'country': countryCode,
            'indicator': indicator,
            'year': year,
            'value': float(value)
          }

          for property, propertyValue in properties.items():
            doc[property] = propertyValue

          es.index(
            index="data",
            doc_type='value',
            id='-'.join((countryCode, indicatorCode, str(year))),
            body=doc
          )