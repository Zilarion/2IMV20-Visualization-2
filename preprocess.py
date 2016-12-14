import csv, sys

filename = 'GenderStat_Data.csv'
target = 'GenderStat_CountryOnly.csv'
data = [];
firstCountryFound = False
with open(filename, 'rb') as f, open(target, 'w') as t:
  reader = csv.DictReader( f )

  fieldnames = ['Country Code', 'Indicator Code', 'Year', 'Value']
  writer = csv.DictWriter(t, fieldnames=fieldnames)
  writer.writeheader()

  try:
    for row in reader:
      country_name = row['\xef\xbb\xbf"Country Name"']

      if firstCountryFound:
        for i in range(1960, 2016):
          value = row[str(i)];
          if (value == ""):
            continue
          writer.writerow({
            'Country Code': row['Country Code'],
            'Indicator Code': row['Indicator Code'],
            'Year': i,
            'Value': row[str(i)]
          })

      if country_name == "Afghanistan":
        firstCountryFound = True

  except csv.Error as e:
      sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))