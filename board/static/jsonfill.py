#Only used once for give random codes to all cards
import json
from random import choice
from string import ascii_letters, digits

def create_name():
    name = ""
    for _ in range(6):
        name += str(choice(ascii_letters + digits)) 
    
    return name.upper()


f = open('board\static\hearts8.json')

data = json.load(f)
f.close()


for i in data:
    for j in data[i]:
        data[i][j]["code"] = create_name()

jsonFile = open("board\static\hearts8.json", "w+")
jsonFile.write(json.dumps(data))
jsonFile.close()

