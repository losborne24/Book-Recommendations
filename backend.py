#!flask/bin/python
import importlib
import csv
import recommender

from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

current_user = None


@app.route('/')
def output():
	return render_template('index.html')


@app.route('/register', methods = ['GET'])
def register():
	is_unique = False
	new_id = 0		# generate unique user id
	while not is_unique:
		is_unique = True
		new_id = int(random.uniform(0, 1) * 1000000000)
		with open('./users/users.csv', 'rt') as f:		# check if unique
			reader = csv.reader(f, delimiter=',')
			for row in reader:
				if new_id == row[0]:
					is_unique = False
					continue
		with open('./users/users.csv', mode='a', newline='') as f:		# write unique id to users.csv
			user_writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
			user_writer.writerow([new_id])
	return str(new_id)


@app.route('/login', methods = ['POST'])
def login():
	global current_user
	user_id = request.get_json(force=True)
	found = False
	with open('./users/users.csv', 'rt') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if user_id == row[0]:
				found = True
				break
	if not found:
		return "null"
	else:
		current_user = user_id
		return jsonify(create_table())


@app.route('/addBooks', methods = ['POST'])
def add_books():
	data = request.get_json(force=True)
	book_entered = data[0]
	rating_entered = data[1]
	book_id = None
	with open('./dataset/books.csv', 'r', encoding='utf-8') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if row[1] == book_entered:
				book_id = row[0]
	if not book_id:
		return "Book does not exist. Please enter a valid book."
	found = False
	with open('./dataset/ratings.csv', 'r', encoding='utf-8') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if row[0]== current_user:
				if row[1] == book_id:
					found = True
					break

	if found:
		return "You have already given this book a rating. Click edit to change the rating of this book."
	else:
		with open('./dataset/ratings.csv', 'a', encoding='utf-8', newline='') as f:
			writer = csv.writer(f, delimiter=',')
			writer.writerow([current_user, book_id, rating_entered])

		return jsonify( create_table(),"Rating has been submitted successfully")


@app.route('/editRating', methods = ['POST'])
def edit_rating():
	data = request.get_json(force=True)
	book_entered = data[0]
	rating_entered = data[1]
	book_id = ""
	with open('./dataset/books.csv', 'r', encoding='utf-8') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if row[1] == book_entered:
				book_id = row[0]
				break

	lines = []
	with open('./dataset/ratings.csv', 'r') as f:
		reader = csv.reader(f)
		for row in reader:
			if row[0] == current_user:
				if row[1] == book_id:
					lines.append([current_user, book_id, rating_entered])
				else:
					lines.append(row)
			else:
				lines.append(row)

	with open('./dataset/ratings.csv', 'w',  newline='') as f:
		writer = csv.writer(f)
		writer.writerows(lines)

	return jsonify( create_table(),"Rating has been submitted successfully")


@app.route('/deleteRating', methods = ['POST'])
def delete_rating():
	book_entered = request.get_json(force=True)
	book_id = ""
	with open('./dataset/books.csv', 'r', encoding='utf-8') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if row[1] == book_entered:
				book_id = row[0]
				break
	lines = []
	with open('./dataset/ratings.csv', 'r') as f:
		reader = csv.reader(f)
		for row in reader:
			if row[0] == current_user:
				if not row[1] == book_id:
					lines.append(row)
			else:
				lines.append(row)

	with open('./dataset/ratings.csv', 'w',  newline='') as f:
		writer = csv.writer(f)
		writer.writerows(lines)

	return jsonify( create_table(),"Rating has been deleted successfully.")


@app.route('/deleteAccount', methods = ['GET'])
def delete_account():
	lines = []
	with open('./dataset/ratings.csv', 'r') as f:
		reader = csv.reader(f)
		for row in reader:
			if not row[0] == current_user:
				lines.append(row)
	with open('./dataset/ratings.csv', 'w',  newline='') as f:
		writer = csv.writer(f)
		writer.writerows(lines)
	users= []
	with open('./users/users.csv', 'r') as f:
		reader = csv.reader(f)
		for row in reader:
			if not row[0] == current_user:
				users.append(row)
	with open('./users/users.csv', 'w',  newline='') as f:
		writer = csv.writer(f)
		writer.writerows(users)
	return '', 204	# return no html content


@app.route('/getRecommendations', methods = ['GET'])
def get_recommendations():
	found = False
	with open('./dataset/ratings.csv', 'r') as f:
		reader = csv.reader(f)
		for row in reader:
			if row[0] == current_user:
				found= True
				break
	if not found:
		return "null"
	else:
		importlib.reload(recommender)
		predictions = recommender.run(current_user)
		return jsonify(predictions)


def create_table():
	global current_user
	books = []
	ratings = []
	result = []
	with open('./dataset/ratings.csv', 'r') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			if row[0] == current_user:
				books.append(row[1])
				ratings.append(row[2])
	with open('./dataset/books.csv', 'r', encoding='utf-8') as f:
		reader = csv.reader(f, delimiter=',')
		for row in reader:
			for i in range(0, len(books)):
				if row[0] == books[i]:
					result.append([str(row[1]), str(ratings[i])])
					break
	return result


if __name__ == '__main__':
	app.run()