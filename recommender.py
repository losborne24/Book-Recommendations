# Algorithm based on Matrix Factorisation Recommender, https://beckernick.github.io/matrix-factorization-recommender/
import numpy as np
import pandas as pd
from scipy.sparse.linalg import svds

def run(user_id):
    user_id = int(user_id)
    ratings_data = pd.read_csv("./dataset/ratings.csv")
    books_data = pd.read_csv("./dataset/books.csv")
    ratings_df = pd.DataFrame(ratings_data, columns = ["UserID","BookID","Rating"], dtype = int)
    books_df = pd.DataFrame(books_data, columns = ["BookID","BookTitle","BookGenre"])
    print(ratings_df)
    print(books_df)
    # create table where columns = all books in dataset and rows = all user ratings for each book
    # set rating to mean average if book is unrated
    ratings_table = ratings_df.pivot(index='UserID', columns='BookID', values='Rating')
    ratings_table = ratings_table.fillna(ratings_table.mean())

    # get row number in ratings table of the current logged in user.
    user_rows = (list(ratings_table.index))
    row_number = user_rows.index(user_id)

    # normalise ratings
    user_ratings_mean = np.mean( ratings_table.values, axis = 1)
    normalise_ratings = ratings_table.values - user_ratings_mean.reshape(-1, 1)

    # Singular value decomposition: normalised_ratings = U sigma Vt.
    # U = How popular the book properties are towards the user.
    # Vt = relevancy of properties towards books.
    U, sigma, Vt = svds(normalise_ratings, k = 50)
    sigma = np.diag(sigma)

    # Use matrices above to make predictions for all users.
    predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
    predictions_df = pd.DataFrame(predicted_ratings, columns = ratings_table.columns)

    # get top 5 recommendations
    recommended_df = recommend_books(predictions_df, row_number, books_df, ratings_df)
    return recommended_df.to_json(orient='values')


def recommend_books(predictions_df, row_number, books_df, ratings_df):
    data = ratings_df[ratings_df.UserID == row_number]      # get all ratings made by logged in user.
    user_ratings = (data.merge(books_df, how='left', left_on='BookID', right_on='BookID').sort_values(['Rating'], ascending=False))
    predictions = predictions_df.iloc[row_number].sort_values(ascending=False)

    # Recommend the top 5 predicted book ratings that have not yet been rated by the user.
    recommendations = (books_df[~books_df['BookID'].isin(user_ratings['BookID'])].merge(pd.DataFrame(predictions).reset_index(), how='left', left_on='BookID', right_on='BookID').rename(columns={row_number: 'Predictions'}).sort_values('Predictions', ascending=False).iloc[:5, :-1])
    return recommendations

run(1)



