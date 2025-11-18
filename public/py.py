import random


pairs = {}

def pairs2(names):
    random.shuffle(names)
    for i in range(len(names)):
        if i == len(names) - 1:
            j = 0
        else:
            j = i + 1

        pairs[names[i]] = [names[j]]
    
    return pairs

print(pairs2(['Alice', 'Bob', 'Jean', 'Eudes', 'Théophile']))

