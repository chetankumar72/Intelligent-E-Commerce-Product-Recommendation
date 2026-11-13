"""
Comprehensive automated test suite for Python FastAPI ML Recommender backend.
Run with: python test_api.py
"""

import sys
import unittest
import database
import recommender

class TestRecommenderEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        database.init_db()
        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        cls.products = [dict(row) for row in cursor.fetchall()]
        conn.close()
        recommender.python_recommender.fit(cls.products)

    def test_catalog_loaded(self):
        self.assertGreaterEqual(len(self.products), 15, "Catalog should have at least 15 products loaded")

    def test_content_similarity(self):
        # Interacting with a laptop should recommend laptops
        interactions = [{'product_id': 'prod_1', 'action_type': 'view'}]
        recs = recommender.python_recommender.get_hybrid_recommendations(interactions, top_n=5)
        self.assertGreater(len(recs), 0, "Recommendations should not be empty")
        top_categories = [r['category'] for r in recs]
        self.assertTrue('Laptops' in top_categories or 'Electronics' in top_categories)

    def test_similar_products(self):
        similar = recommender.python_recommender.get_similar_products('prod_3', top_n=3)
        self.assertGreater(len(similar), 0)
        for p in similar:
            self.assertIn('similarity_score', p)
            self.assertIn('match_percentage', p)

    def test_purchase_exclusion(self):
        # A purchased product should be excluded from recommended items
        interactions = [
            {'product_id': 'prod_1', 'action_type': 'purchase'},
            {'product_id': 'prod_2', 'action_type': 'view'}
        ]
        recs = recommender.python_recommender.get_hybrid_recommendations(interactions, top_n=5)
        rec_ids = [r['id'] for r in recs]
        self.assertNotIn('prod_1', rec_ids, "Purchased product prod_1 should be excluded from recommendations")

if __name__ == '__main__':
    unittest.main()

