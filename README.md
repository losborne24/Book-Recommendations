Assignment: Book Recommendations (Web personalisation) [Python, Flask, JavaScript]

A book recommendation system programmed in python using flask to create a web-based application.
Program uses a sample dataset from GoodBooks and uses a recommendation system based on matrix factorisation - https://beckernick.github.io/matrix-factorization-recommender/

Users can login by using either the existing ID's found in ./users/users.csv, or by registering userID under the register tab.
A random unique user ID is generated for each new user ID created.

Once logged in:
- Users have the ability to add, edit and delete book ratings(and the program ensures users cannot rate the same book more than once).
- Users are able to logout of their account and return back to the login screen
- Users are able to delete their account (and all their ratings).
- Users can access personalised book recommendations as long as they have rated at least one book.

------------------------------------------

Instructions to run:

1. Ensure libraries have been installed.
2. Run python backend.py
3. Open output link in web browser.
4. To login with sample data, use an ID found in ./users/users.csv. Else, register a new UserID under the register tab.
5. Click the recommendations tab to view book recommendations - recommendations may take a few seconds to load.

