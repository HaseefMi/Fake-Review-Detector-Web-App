from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MaxAbsScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import keras as ker
from scipy.sparse import hstack

app = Flask(__name__)
CORS(app)

dataset = pd.read_csv("C:/Users/hacho/Downloads/FakeReviewDetector/fake reviews dataset.csv")
dataset['text'] = dataset['text'].str.lower().str.replace(r'\s+', ' ', regex=True)
le = LabelEncoder()
dataset['category'] = le.fit_transform(dataset['category'])

vectorizer = TfidfVectorizer()
X_text = vectorizer.fit_transform(dataset['text'])
X = hstack([dataset[['category', 'rating']].values, X_text])
y = dataset['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
mas = MaxAbsScaler()
X_train = mas.fit_transform(X_train)
X_test = mas.transform(X_test)

model = ker.models.Sequential()
early_stopping = ker.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
model.add(ker.layers.Dense(128, input_dim=X_train.shape[1], activation='relu'))
model.add(ker.layers.Dense(64, activation='relu'))
model.add(ker.layers.Dense(1, activation='sigmoid'))
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=2, batch_size=32, validation_data=(X_test, y_test), callbacks=[early_stopping])

@app.route('/predict', methods=['POST'])
def receive_input():
    data = request.json
    category = data.get('category')
    rating = data.get('rating')
    review_text = data.get('text')

    if not all([category, rating, review_text]):
        return jsonify({'error': 'Missing information'}), 400
    
    if not isinstance(rating, (int, float)):
        return jsonify({'error': 'Rating must be a number'}), 400

    try:
        review_text = re.sub(r'\s+', ' ', review_text.lower().strip())
        category_encoded = le.transform([category])[0]
        review_text_vectorized = vectorizer.transform([review_text])
        features = np.hstack([[category_encoded, rating], review_text_vectorized.toarray().flatten()])
        features_scaled = mas.transform(features.reshape(1, -1))
        odds = model.predict(features_scaled)
        odds_value = float(odds[0][0])

        prediction = 'Real Human Review' if odds[0][0] < 0.5 else 'Fake Non-Human Review'
        return jsonify({'odds': odds_value, 'prediction': prediction}), 200

    except Exception as e:
        print(str(e))
        return jsonify({'error': f'Error processing data and/or making prediction: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
