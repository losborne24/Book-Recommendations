import csv

lines = []
with open('./dataset/ratings.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        found = False
        for item in lines:
            if item == [row[0]]:
                found = True
        if not found:
            lines.append([row[0]])

with open('./users/users.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(lines)


