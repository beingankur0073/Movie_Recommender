#!/usr/bin/env python
# coding: utf-8

# In[2]:


import numpy as np
import pandas as pd


# In[3]:


movies = pd.read_csv("tmdb_5000_movies (1).csv")
credits = pd.read_csv("tmdb_5000_credits.csv", encoding='latin-1')
# credits = pd.read_csv("/content/tmdb_5000_credits (2).csv")


# In[4]:


movies.head(1)


# In[5]:


credits.head(1)


# In[6]:


movies = movies.merge(credits,on='title')


# In[7]:


movies.head(1)


# In[8]:


movies.info()


# In[9]:


movies = movies[['movie_id','title','overview','genres','keywords','cast','crew']]


# In[10]:


movies.head(1)


# In[11]:


movies.isnull().sum()


# In[12]:


movies.dropna(inplace=True)


# In[13]:


movies.duplicated().sum()


# In[14]:


movies.iloc[0].genres


# In[15]:


def convert(obj):
  L=[]
  for i in ast.literal_eval(obj):
    L.append(i['name'])
  return L


# In[16]:


import ast
# Convert the list of dictionaries to a string before using ast.literal_eval
data_string = "[{'id': 28, 'name': 'Action'}, {'id': 12, 'name': 'Adventure'}, {'id': 14, 'name': 'Fantasy'}, {'id': 878, 'name': 'Science Fiction'}]"
ast.literal_eval(data_string)


# In[17]:


movies['genres'] = movies['genres'].apply(convert)


# In[18]:


movies.head()


# In[19]:


movies['keywords']=movies['keywords'].apply(convert)


# In[20]:


movies.head()


# In[21]:


import ast

def convert3(obj):
    L = []
    counter = 0
    if isinstance(obj, list):
        # If it is already a list of strings (like ['Sam Worthington', 'Zoe Saldana']), handle it separately.
        if all(isinstance(item, str) for item in obj):
            L.extend(obj[:3])  # Get the first 3 strings
            return L
        # If it is a list of dictionaries, iterate as before.
        for i in obj:
            if counter != 3:
                L.append(i['name'])
                counter += 1
            else:
                break
    else:
        # If it is a string, convert to list of dictionaries
        for i in ast.literal_eval(obj):
            if counter != 3:
                L.append(i['name'])
                counter += 1
            else:
                break
    return L

movies['cast'] = movies['cast'].apply(convert3)


# In[22]:


movies.head()


# In[23]:


def fetch_director(obj):
  L=[]
  for i in ast.literal_eval(obj):
    if i['job']=='Director':
      L.append(i['name'])
      break
  return L


# In[24]:


movies['crew'] = movies['crew'].apply(fetch_director)


# In[25]:


movies.head()


# In[26]:


# movies['overview'] = movies['overview'].apply(lambda x:x.split())
movies['overview'] = movies['overview'].apply(lambda x: x.split() if isinstance(x, str) else x)


# In[27]:


movies.head()


# In[28]:


movies['genres'] = movies['genres'].apply(lambda x:[i.replace(" ","") for i in x])
movies['keywords'] = movies['keywords'].apply(lambda x:[i.replace(" ","") for i in x])
movies['cast'] = movies['cast'].apply(lambda x:[i.replace(" ","") for i in x])
movies['crew'] = movies['crew'].apply(lambda x:[i.replace(" ","") for i in x])

# Create the 'tags' column
movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']

# Now, create new_df with the 'tags' column available
new_df = movies[['movie_id','title','tags']]


# In[29]:


new_df.head()


# In[30]:


new_df['tags'] = new_df['tags'].apply(lambda x:" ".join(x))


# In[31]:


new_df.head()


# In[32]:


import nltk


# In[33]:





# In[34]:


from nltk.stem.porter import PorterStemmer
ps = PorterStemmer()


# In[35]:


def stem(text):
  y=[]
  for i in text.split():
    y.append(ps.stem(i))
  return " ".join(y)


# In[36]:


new_df['tags'] = new_df['tags'].apply(stem)


# In[37]:


new_df.head()


# In[38]:


new_df['tags'][0]


# In[39]:


new_df['tags'] = new_df['tags'].apply(lambda x:x.lower())


# In[40]:


from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(max_features=5000,stop_words='english')


# In[41]:


vectors = cv.fit_transform(new_df['tags']).toarray()


# In[42]:


words = cv.get_feature_names_out()

print(words[:200])

search_word = "romanc"

if search_word in words:
    index = list(words).index(search_word)
    print(f"Word '{search_word}' found at index: {index}")
else:
    print(f"Word '{search_word}' not found in the vocabulary.")


# In[43]:


vectors


# In[44]:


vectors[0]


# In[45]:


cv.get_feature_names_out()


# In[46]:


stem('In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization. Action Adventure Fantasy ScienceFiction cultureclash future spacewar spacecolony society spacetravel futuristic romance space alien tribe alienplanet cgi marine soldier battle loveaffair antiwar powerrelations mindandsoul 3d SamWorthington ZoeSaldana SigourneyWeaver JamesCameron')


# In[47]:


from sklearn.metrics.pairwise import cosine_similarity


# In[48]:


similarity = cosine_similarity(vectors)


# In[49]:


sorted(list(enumerate(similarity[0])), reverse=True,key=lambda x:x[1])[1:11]
#


# In[50]:


def recommend(movie):
  movie_index = new_df[new_df['title'] == movie].index
  if len(movie_index) == 0:  # Check if the movie title is found.
      print(f"Movie '{movie}' not found in the dataset.")
      return  # Exit if movie not found

  distances = similarity[movie_index[0]] # Now movie_index contains result and not empty, if a result was not found, function exits before, so movie_index[0] is safe to call.
  movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:11]
  for i in movies_list:
    print(new_df.iloc[i[0]].title)


# In[51]:


recommend("Sholay")


# In[52]:


import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# In[53]:


genre1 = input("Enter genre: ")
genre2 = input("Enter genre: ")
key1= input("Enter key1: ")
key2= input("Enter key2: ")
key3= input("Enter key3: ")

print("\nUser Data:")
print(f"genre1: {genre1}")
print(f"genre2: {genre2}")
print(f"key1: {key1}")
print(f"key2: {key2}")
print(f"key3: {key3}")



# In[54]:


movie_dets = genre1 +" " + genre2 + " " + key1 + " "  + key2 + " " + key3
print(movie_dets)


# In[55]:


movie_dets = stem(movie_dets)
print(movie_dets)


# In[56]:


input_movie = movie_dets


# In[57]:


input_movie_vector = cv.transform([input_movie])


# In[58]:


print("\nVectorized Representation of Input Movie:")
print(input_movie_vector.toarray())


# In[59]:


i_similarities = cosine_similarity(input_movie_vector, vectors)

# Step 7: Get similarity scores and indices for the top 10 nearest movies
similarity_scores = i_similarities.flatten()  # Flatten to 1D array
top_10_indices = np.argsort(similarity_scores)[-10:][::-1]  # Get indices of top 10, sorted in descending order

# Step 8: Print the names of the top 10 nearest movies
print("\nTop 10 nearest movies based on cosine similarity:")
for idx in top_10_indices:
    # Use .iloc to access rows by their integer position.
    print(f"{new_df.iloc[idx].title} (Similarity: {similarity_scores[idx]:.4f})")

