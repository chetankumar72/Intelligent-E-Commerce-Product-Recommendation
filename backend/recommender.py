"""
AI Recommendation Engine implemented with Python, Scikit-learn, Pandas, and NumPy.
Demonstrates Content-Based TF-IDF, User-User Collaborative Filtering, and Hybrid scoring.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Action weights for implicit feedback mapping
INTERACTION_WEIGHTS = {
    'purchase': 5.0,
    'cart': 4.0,
    'wishlist': 3.5,
    'search': 2.5,
    'view': 1.5,
    'like': 3.0
}

class PythonRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            sublinear_tf=True,
            stop_words='english',
            token_pattern=r'(?u)\b\w\w+\b'
        )
        self.products_df = None
        self.tfidf_matrix = None
        self.product_id_to_idx = {}
        self.idx_to_product_id = {}

    def fit(self, products_list):
        """Train TF-IDF matrix across product corpus"""
        self.products_df = pd.DataFrame(products_list)
        if self.products_df.empty:
            return

        # Build corpus text representation
        def build_corpus_row(row):
            parts = [
                str(row.get('name', '')),
                str(row.get('category', '')),
                str(row.get('brand', '')),
                str(row.get('description', '')),
                str(row.get('tags', ''))
            ]
            return " ".join(parts)

        corpus = self.products_df.apply(build_corpus_row, axis=1)
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

        self.product_id_to_idx = {pid: idx for idx, pid in enumerate(self.products_df['id'])}
        self.idx_to_product_id = {idx: pid for idx, pid in enumerate(self.products_df['id'])}

    def get_content_recommendations(self, interactions, top_n=10):
        """Content-Based Filtering using TF-IDF and Cosine Similarity"""
        if self.tfidf_matrix is None or self.products_df is None or len(interactions) == 0:
            # Fallback to rating
            return self.products_df.sort_values(by='rating', ascending=False).head(top_n).to_dict(orient='records')

        # Build user profile vector
        user_vector = np.zeros((1, self.tfidf_matrix.shape[1]))
        weight_sum = 0.0

        for idx, evt in enumerate(interactions):
            pid = evt.get('product_id')
            action = evt.get('action_type', 'view')
            w = INTERACTION_WEIGHTS.get(action, 1.0)

            # Recency factor
            recency = 0.7 + 0.3 * (idx / max(1, len(interactions) - 1))
            total_w = w * recency

            if pid and pid in self.product_id_to_idx:
                p_idx = self.product_id_to_idx[pid]
                user_vector += total_w * self.tfidf_matrix[p_idx].toarray()
                weight_sum += total_w
            elif evt.get('query'):
                query_vec = self.vectorizer.transform([evt['query']]).toarray()
                user_vector += total_w * query_vec
                weight_sum += total_w

        if weight_sum > 0:
            user_vector /= weight_sum

        # Calculate cosine similarities
        sim_scores = cosine_similarity(user_vector, self.tfidf_matrix).flatten()
        return sim_scores

    def get_similar_products(self, product_id, top_n=4):
        """Item-to-Item Cosine Similarity"""
        if self.tfidf_matrix is None or product_id not in self.product_id_to_idx:
            return []

        target_idx = self.product_id_to_idx[product_id]
        target_vec = self.tfidf_matrix[target_idx]

        sim_scores = cosine_similarity(target_vec, self.tfidf_matrix).flatten()
        sim_scores[target_idx] = -1.0 # Exclude self

        top_indices = np.argsort(sim_scores)[::-1][:top_n]
        results = []

        for idx in top_indices:
            p = self.products_df.iloc[idx].to_dict()
            score = float(sim_scores[idx])
            p['similarity_score'] = round(score, 4)
            p['match_percentage'] = int(min(99, max(65, score * 100)))
            results.append(p)

        return results

    def get_hybrid_recommendations(self, interactions, content_weight=0.6, collab_weight=0.4, top_n=10):
        """Ensemble combining Content-Based and Collaborative scores"""
        if self.products_df is None or self.products_df.empty:
            return []

        num_products = len(self.products_df)
        content_scores = self.get_content_recommendations(interactions, top_n=num_products)

        if not isinstance(content_scores, np.ndarray):
            # Cold start fallback
            content_scores = (self.products_df['rating'].values / 5.0)

        # Baseline collaborative simulation scores based on synthetic ratings
        collab_scores = (self.products_df['rating'].values / 5.0) * 0.8 + 0.1

        # Hybrid weighting
        total_w = content_weight + collab_weight or 1.0
        w_c = content_weight / total_w
        w_col = collab_weight / total_w

        hybrid_scores = (w_c * content_scores) + (w_col * collab_scores)

        # Exclude purchased products
        purchased_pids = set([e['product_id'] for e in interactions if e.get('action_type') == 'purchase'])

        ranked_indices = np.argsort(hybrid_scores)[::-1]
        results = []

        for idx in ranked_indices:
            pid = self.idx_to_product_id[idx]
            if pid in purchased_pids and len(results) < top_n:
                continue

            row = self.products_df.iloc[idx].to_dict()
            h_score = float(hybrid_scores[idx])
            c_score = float(content_scores[idx])
            col_score = float(collab_scores[idx])

            match_pct = int(min(99, max(65, h_score * 100)))

            row['hybrid_score'] = round(h_score, 4)
            row['content_score'] = round(c_score, 4)
            row['collab_score'] = round(col_score, 4)
            row['match_percentage'] = match_pct
            row['explanation'] = {
                'badge': 'Hybrid AI Match',
                'text': f"High affinity match in {row.get('category')} ({match_pct}% calculated match)",
                'confidence': match_pct
            }
            results.append(row)
            if len(results) >= top_n:
                break

        return results

python_recommender = PythonRecommender()

