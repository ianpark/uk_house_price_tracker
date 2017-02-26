import os
import json
import io

merged = {}
simple = []

for filename in ['region_0.json', 'region_1.json']:
   with open(filename) as f:
      data = json.load(f)

   for item in data["result"]["items"]:
      merged[item["_about"].split("/")[-1]] = { 'name': item["label"][0]["_value"] }
      simple.append(item["_about"].split("/")[-1])

with io.open('region_dict.json', 'w', encoding='utf-8') as f:
  f.write(unicode(json.dumps(merged, ensure_ascii=False)))

with io.open('region.json', 'w', encoding='utf-8') as f:
  f.write(unicode(json.dumps(simple, ensure_ascii=False)))

  
