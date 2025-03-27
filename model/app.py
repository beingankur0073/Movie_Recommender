from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.porter import PorterStemmer
import ast

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Enable CORS for frontend

# Load movie data
movies = pd.read_csv("tmdb_5000_movies (1).csv")
credits = pd.read_csv("tmdb_5000_credits.csv", encoding='latin-1')

movies = movies.merge(credits, on='title')
movies = movies[['movie_id', 'title', 'overview', 'genres', 'keywords', 'cast', 'crew']]
movies.dropna(inplace=True)

# Helper functions for processing JSON-like columns
def convert(obj):
    return [i['name'] for i in ast.literal_eval(obj)]

def convert3(obj):
    return [i['name'] for i in ast.literal_eval(obj)[:3]]

def fetch_director(obj):
    for i in ast.literal_eval(obj):
        if i['job'] == 'Director':
            return [i['name']]
    return []

movies['genres'] = movies['genres'].apply(convert)
movies['keywords'] = movies['keywords'].apply(convert)
movies['cast'] = movies['cast'].apply(convert3)
movies['crew'] = movies['crew'].apply(fetch_director)
movies['overview'] = movies['overview'].apply(lambda x: x.split() if isinstance(x, str) else [])

# Remove spaces in words
movies['genres'] = movies['genres'].apply(lambda x: [i.replace(" ", "") for i in x])
movies['keywords'] = movies['keywords'].apply(lambda x: [i.replace(" ", "") for i in x])
movies['cast'] = movies['cast'].apply(lambda x: [i.replace(" ", "") for i in x])
movies['crew'] = movies['crew'].apply(lambda x: [i.replace(" ", "") for i in x])

# Combine all features into one 'tags' column
movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']
new_df = movies[['movie_id', 'title', 'tags']]

# Convert tags into a single string
new_df['tags'] = new_df['tags'].apply(lambda x: " ".join(x).lower())

# Apply stemming
ps = PorterStemmer()
def stem(text):
    return " ".join([ps.stem(i) for i in text.split()])

new_df['tags'] = new_df['tags'].apply(stem)

# Vectorization
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(new_df['tags']).toarray()
similarity = cosine_similarity(vectors)

# Recommendation functions
def recommend_movies(title):
    title = title.lower()
    movie_index = new_df[new_df['title'].str.lower() == title].index
    if len(movie_index) == 0:
        return None
    distances = similarity[movie_index[0]]
    movie_indices = sorted(list(enumerate(distances)), key=lambda x: x[1], reverse=True)[1:11]
    return [{"title": new_df.iloc[i[0]]['title']} for i in movie_indices]

def recommend_by_genre_keywords(genres, keywords):
    input_text = stem(" ".join([genres, keywords]))
    input_vector = cv.transform([input_text])
    i_similarities = cosine_similarity(input_vector, vectors)
    similarity_scores = i_similarities.flatten()
    top_10_indices = np.argsort(similarity_scores)[-10:][::-1]
    return [{"title": new_df.iloc[idx]['title']} for idx in top_10_indices]

@app.route('/recommend', methods=['GET'])
def recommend():
    title = request.args.get('title', '').strip()
    genres = request.args.get('genres', '').strip()
    keywords = request.args.get('keywords', '').strip()
    recommendations = None
    if title:
        recommendations = recommend_movies(title)
    if not recommendations:
        recommendations = recommend_by_genre_keywords(genres, keywords)
    return jsonify({"recommendations": recommendations if recommendations else []})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)