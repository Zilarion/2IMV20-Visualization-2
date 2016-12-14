from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch([{'host': 'elasticsearch'}, {'port': 9200}])

doc = {
    'author': 'kimchy',
    'text': 'Elasticsearch: cool. bonsai cool.',
    'timestamp': datetime.now(),
}
res = es.index(index="test-index", doc_type='tweet', id=1, body=doc)
print(res['created'])