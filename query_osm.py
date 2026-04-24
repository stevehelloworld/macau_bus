import urllib.request
import urllib.parse
import json
import time

places = [
    "Broadway Macau", "The Venetian Macao", "Galaxy Macau", "Wynn Palace",
    "Studio City Macau", "City of Dreams Macau", "Altira Macau", "MGM Cotai",
    "Grand Lisboa Palace", "Lisboeta Macau", "Morpheus Macau"
]

for place in places:
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(place)}&format=json&limit=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                print(f"{place}: {data[0]['lat']}, {data[0]['lon']}")
            else:
                print(f"{place}: Not found")
    except Exception as e:
        print(f"{place}: Error {e}")
    time.sleep(1.5)
