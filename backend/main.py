"""
FastAPI Server for Intelligent E-Commerce Recommendation System.
Provides RESTful APIs for products, interactions, and Python Scikit-learn AI recommendations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

from database import init_db, get_connection
from recommender import python_recommender

app = FastAPI(
    title="Intelligent E-Commerce Recommendation API",
    description="Python FastAPI + Scikit-Learn TF-IDF and Collaborative Filtering Engine",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: initialize SQLite & fit recommendation model
@app.on_event("startup")
def startup_event():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    python_recommender.fit(rows)

# Pydantic Schemas
class InteractionEvent(BaseModel):
    user_id: str
    action_type: str # view, search, cart, wishlist, purchase
    product_id: Optional[str] = None
    query: Optional[str] = None

class RecommendationRequest(BaseModel):
    user_id: str
    content_weight: Optional[float] = 0.6
    collab_weight: Optional[float] = 0.4
    limit: Optional[int] = 10
    interactions: Optional[List[dict]] = []

class ProductCreate(BaseModel):
    name: str
    category: str
    brand: str
    description: str
    price: float
    discount: Optional[int] = 0
    rating: Optional[float] = 4.5
    reviews_count: Optional[int] = 1
    image: str
    stock: int
    tags: str

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Intelligent Recommendation Engine",
        "engine": "Scikit-learn TF-IDF + Cosine Similarity + Collaborative Matrix"
    }

@app.get("/api/products")
def list_products():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return dict(row)

@app.post("/api/interactions")
def log_interaction(event: InteractionEvent):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO interactions (user_id, action_type, product_id, query)
    VALUES (?, ?, ?, ?)
    """, (event.user_id, event.action_type, event.product_id, event.query))
    conn.commit()
    conn.close()
    return {"success": True, "logged_event": event.dict()}

@app.post("/api/recommendations/hybrid")
def get_hybrid_recommendations(req: RecommendationRequest):
    # Fetch user interactions from DB or request payload
    interactions = req.interactions
    if not interactions:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM interactions WHERE user_id = ? ORDER BY timestamp ASC", (req.user_id,))
        interactions = [dict(r) for r in cursor.fetchall()]
        conn.close()

    results = python_recommender.get_hybrid_recommendations(
        interactions=interactions,
        content_weight=req.content_weight,
        collab_weight=req.collab_weight,
        top_n=req.limit
    )
    return {
        "user_id": req.user_id,
        "recommendations_count": len(results),
        "weights": {"content": req.content_weight, "collaborative": req.collab_weight},
        "recommendations": results
    }

@app.get("/api/recommendations/similar/{product_id}")
def get_similar(product_id: str, limit: int = 4):
    similar = python_recommender.get_similar_products(product_id, top_n=limit)
    return similar

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

