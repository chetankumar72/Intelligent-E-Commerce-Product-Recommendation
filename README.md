# Intelligent E-Commerce Product Recommendation System

[![Project Type](https://img.shields.io/badge/Project-Academic%20AI%20Engineering-indigo.svg)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-6366f1.svg)](https://react.dev)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-TF--IDF%20%2B%20Cosine%20%2B%20Collaborative-8b5cf6.svg)](https://scikit-learn.org)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLite%20(Optional)-009688.svg)](https://fastapi.tiangolo.com)
[![Status](https://img.shields.io/badge/Status-Fully%20Functional%20%26%20Standalone-10b981.svg)](https://vitejs.dev)

A modern, commercial-grade, fully functional e-commerce web application featuring an **Intelligent Machine Learning Recommendation Engine**. Designed for an academic engineering project demonstration, defense, and viva voce presentation.

---

## 🌟 Key Highlights & Academic Novelty

1. **Dual-Mode Operation**:
   - **Mandatory Authentication Gate**: Any user opening the application is required to log in first before accessing the store. Users can sign in with custom credentials, create an account with seed category priors, or use the 1-click test persona quick sign-in.
   - **Frontend-Only Standalone Mode (Zero Backend Required)**: Features a high-performance in-browser machine learning engine implementing exact Sublinear TF-IDF vectorization, L2-normalized Cosine Similarity, and K-NN Collaborative Filtering in pure JavaScript with full `localStorage` persistence.
   - **Python FastAPI + Scikit-Learn Mode (Optional)**: Features a production REST API built with FastAPI, SQLite, Scikit-learn (`TfidfVectorizer`, `cosine_similarity`), Pandas, and NumPy.
2. **True Algorithmic Hybrid Recommendation**:
   - Combines **Content-Based Filtering** (product descriptions, brands, categories, tags, technical specifications) with **User-User Collaborative Filtering** (implicit interaction weights from views, searches, wishlist saves, cart adds, and purchases).
   - Dynamic **Hybrid Weight Balancer** slider on the AI Dashboard ($0.0 \le \alpha \le 1.0$), allowing users and professors to drag the slider in real-time and observe recommendations re-rank instantly!
3. **Explainable AI (XAI)**:
   - Every recommended product displays a calculated match score (e.g. `96% Match`) and a transparent human-readable justification (e.g., *"Because you frequently browse Headphones"*, *"Complementary to items in your wishlist"*, or *"Popular among users with similar shopping preferences"*). No random or hardcoded numbers!
4. **Interactive Persona Evaluation & Cold-Start Demonstration**:
   - 1-Click Persona Switcher:
     - 🎮 **Alex Rivera (Tech & Gaming)**: Mechanical keyboards, RTX laptops, OLED displays.
     - 👗 **Sophia Chen (Fashion & Style)**: Designer denim, aviator horology, luxury sneakers.
     - 🎧 **Julian Vance (Audiophile)**: Noise-cancelling headphones, studio monitors, DACs.
     - ☕ **Dr. Gillian Hayes (Culinary & Smart Living)**: Espresso machines, Dutch ovens, robot vacuums.
     - ❄️ **New Visitor (Cold-Start)**: Zero prior history to evaluate Bayesian popularity fallback and cold-start adaptation.
5. **Complete E-Commerce Flow**:
   - Interactive Catalog with 42+ products across 10 categories.
   - Live search with instant suggestions dropdown.
   - Multi-facet filters (Category, Brand, Price slider, Rating, In-Stock only).
   - Multi-criteria sorting (Price, Rating, Popularity, AI Match Score).
   - Product Details page with specifications table, content-similar products, and "customers also bought" suggestions.
   - Shopping Cart with coupon codes (`AI20`, `SAVE10`, `FREESHIP`), free shipping meter, and tax calculations.
   - Simulated 3-Step Checkout with delivery address validation, simulated payment modes (Card, UPI QR, COD), and celebratory confetti receipt.
   - Order History and Saved Wishlist with full state persistence across page refreshes.
   - Admin Operations Panel with full product inventory CRUD (Create, Read, Update, Delete) and catalog reset.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React.js 18 / 19 with Vite 8 |
| **Styling & UI** | Tailwind CSS v3, Plus Jakarta Sans / Inter, Custom Glassmorphism |
| **Icons & Visuals** | Lucide React |
| **Charts & Analytics** | Recharts (Responsive Bar, Radar, Pie charts) |
| **Routing & State** | React Router v7, React Context API, Web LocalStorage |
| **Client-Side AI Math** | Custom Matrix & Vector math, Sublinear TF-IDF, Cosine Dot Product, KNN |
| **Python Backend (Optional)**| FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy, SQLite3 |

---

## 📐 Mathematical Formulation of the AI Engine

### 1. Content-Based Filtering (Sublinear TF-IDF)

For a product document $d$ and vocabulary term $t$:
$$\text{TF}(t, d) = \begin{cases} 1 + \ln(\text{count}(t, d)) & \text{if } \text{count}(t, d) > 0 \\ 0 & \text{otherwise} \end{cases}$$

$$\text{IDF}(t) = \ln\left( \frac{1 + N}{1 + \text{DF}(t)} \right) + 1$$

Where $N$ is total products in catalog ($42+$) and $\text{DF}(t)$ is the number of products containing term $t$. The unnormalized document vector is:
$$\vec{v}_d(t) = \text{TF}(t, d) \times \text{IDF}(t)$$

Applying L2 unit-sphere normalization:
$$\hat{v}_d = \frac{\vec{v}_d}{\|\vec{v}_d\|_2} = \frac{\vec{v}_d}{\sqrt{\sum_{k} \vec{v}_d(k)^2}}$$

The active user vector $\vec{u}$ is synthesized by aggregating interaction vectors:
$$\vec{u} = \sum_{e \in \text{Interactions}} w_{\text{action}}(e) \cdot \lambda_{\text{recency}}(e) \cdot \hat{v}_{p(e)} + \sum_{q \in \text{Searches}} w_{\text{search}} \cdot \vec{v}_{\text{query}}(q)$$

$$\text{ContentSim}(\vec{u}, \hat{v}_i) = \hat{u} \cdot \hat{v}_i = \sum_{k} \hat{u}_k \cdot \hat{v}_{i, k}$$

### 2. User-User Collaborative Filtering (Implicit Feedback)

Implicit interaction events map to implicit rating scores $R \in [1.0, 5.0]$:
- **Purchase**: $5.0$
- **Add to Cart**: $4.0$
- **Wishlist Save**: $3.5$
- **Like / Search**: $2.5 - 3.0$
- **Product View**: $1.5$

The Pearson/Cosine correlation between active user $u$ and neighbor user profile $v$:
$$\text{Sim}(u, v) = \frac{\sum_{i} R_{u, i} \cdot R_{v, i}}{\sqrt{\sum_{i} R_{u, i}^2} \cdot \sqrt{\sum_{i} R_{v, i}^2}}$$

Predicted interaction rating for unseen product $i$:
$$\hat{R}_{u, i} = \frac{\sum_{v \in \text{Top-K}} \text{Sim}(u, v) \cdot R_{v, i}}{\sum_{v \in \text{Top-K}} |\text{Sim}(u, v)|}$$

$$\text{CollabScore}(u, i) = \text{clip}\left(\frac{\hat{R}_{u, i}}{5.0}, 0.0, 1.0\right)$$

### 3. Hybrid Ensemble Scoring Formula

$$\text{HybridScore}(u, i) = \alpha \cdot \text{ContentSim}(u, i) + (1 - \alpha) \cdot \text{CollabScore}(u, i) + \beta_{\text{quality}}(i)$$

Where:
- $\alpha$: Configurable weight ($0.0 \le \alpha \le 1.0$, default $0.6$).
- $\beta_{\text{quality}}(i) = (\text{Rating}_i - 3.5) \times 0.05$: Slight Bayesian dampener rewarding verified highly rated items.
- Products already purchased by the user are excluded from recommendations when suitable alternatives exist.

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js**: Version 18.0 or newer (tested on Node v24)
- **npm**: Version 9.0 or newer
- **Python**: Version 3.10+ (Optional, for Python FastAPI backend)

---

### Step 1: Running the Frontend (Default Standalone Mode)

The frontend contains the complete client-side AI recommendation engine and runs 100% standalone out of the box without any backend server.

1. Open a terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### Step 2 (Optional): Running the Python FastAPI Backend

If you wish to demonstrate the Python ML backend with Scikit-learn, Pandas, and SQLite:

1. Open a second terminal window and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate the Python virtual environment:
   - **On Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **On Windows (Command Prompt)**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **On macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```
3. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *or with Uvicorn directly:*
   ```bash
   uvicorn main:app --reload --port 8000
   ```
4. Access interactive Swagger API documentation at:
   ```
   http://127.0.0.1:8000/docs
   ```

---

## 📂 Project Directory Structure

```text
AI PROJECT/
├── README.md                      # Comprehensive project documentation
├── frontend/                      # React 18 + Vite frontend
│   ├── index.html                 # App entry point with Inter typography
│   ├── package.json               # Dependencies & scripts
│   ├── tailwind.config.js         # Custom brand colors & styling tokens
│   ├── postcss.config.js          # Tailwind PostCSS configuration
│   └── src/
│       ├── main.jsx               # React DOM entry
│       ├── App.jsx                # Router & global provider tree
│       ├── index.css              # Tailwind base, utilities, scrollbar styling
│       ├── ai/                    # Client-side AI Recommendation Engine
│       │   ├── tfidf.js           # Sublinear TF-IDF Vectorizer & Cosine Similarity
│       │   ├── collaborative.js   # User-Item matrix, K-NN CF, co-occurrence
│       │   ├── recommender.js     # Hybrid ensemble engine & Explainable AI (XAI)
│       │   └── personas.js        # Synthetic user archetypes for live evaluation
│       ├── context/               # Global state management
│       │   ├── AuthContext.jsx    # User profile & persona switching
│       │   ├── ProductContext.jsx # Catalog state & Admin CRUD operations
│       │   ├── InteractionContext.jsx # Event logger (view, search, cart, wishlist)
│       │   ├── CartContext.jsx    # Cart items, discounts, coupons, shipping
│       │   ├── WishlistContext.jsx# Wishlist storage & management
│       │   ├── OrderContext.jsx   # Placed orders & tracking
│       │   └── RecommendationContext.jsx # Real-time AI computation & weights
│       ├── data/
│       │   ├── products.js        # 42+ high-quality sample products
│       │   └── categories.js      # Category metadata & styling
│       ├── components/
│       │   ├── common/            # Reusable Navbar, Footer, ProductCard, RatingStars
│       │   └── home/              # HeroBanner, CategoryPills, RecommendedSection, etc.
│       └── pages/                 # Full pages
│           ├── HomePage.jsx       # Dynamic landing page
│           ├── ShopPage.jsx       # Catalog with multi-facet filters & sorting
│           ├── ProductDetailsPage.jsx # Details, specs, similar & also-bought
│           ├── AIDashboardPage.jsx# Recharts analytics, slider weights, feature vectors
│           ├── CartPage.jsx       # Cart & coupon manager
│           ├── CheckoutPage.jsx   # Address, simulated payments, order placement
│           ├── OrderConfirmationPage.jsx # Order receipt with confetti animation
│           ├── OrderHistoryPage.jsx # Order history & re-order functionality
│           ├── WishlistPage.jsx   # Saved items & move to cart
│           ├── AdminDashboardPage.jsx # Product inventory management (CRUD)
│           ├── LoginPage.jsx      # Demo authentication
│           ├── RegisterPage.jsx   # New user profile creation
│           └── ArchitecturePage.jsx # Academic model equations & Viva Voce Q&A
│
└── backend/                       # Optional Python FastAPI ML Backend
    ├── requirements.txt           # fastapi, uvicorn, scikit-learn, pandas, numpy
    ├── database.py                # SQLite schema & database connector
    ├── seed_data.py               # Initial seed products & synthetic ratings
    ├── recommender.py             # Python Scikit-learn TF-IDF & K-NN CF
    ├── main.py                    # FastAPI REST routes with CORS
    └── .venv/                     # Python virtual environment
```

---

## 🧪 Testing & Verification Guide

| Test Scenario | How to Verify | Expected Result |
| :--- | :--- | :--- |
| **1. Cold-Start Verification** | Click Persona dropdown -> select **"New Visitor (Cold Start)"** | Recommendations switch to popular Bayesian damped defaults across diverse categories. |
| **2. Real-Time Personalization** | As cold-start visitor, search `"espresso"` or view the **Breville Barista Touch** | Recommended products tray instantly adapts to feature coffee machines, kettles, and kitchen appliances. |
| **3. Tech Persona Evaluation** | Switch to **"Alex Rivera (Tech & Gaming)"** | Recommendations immediately prioritize Mechanical Keyboards, MacBook Pro, OLED Displays, and ROG gaming gear. |
| **4. Hybrid Weight Balancing** | Navigate to `/ai-dashboard` and drag the slider from **0% Content** to **100% Content** | The recommendation ranking and Recharts decompose live between pure TF-IDF terms and collaborative community preferences. |
| **5. Shopping & Checkout** | Add items to cart -> enter coupon `AI20` -> complete simulated checkout | 20% discount is calculated; confetti triggers on confirmation; purchased products are recorded in the AI engine. |
| **6. Admin Inventory CRUD** | Go to `/admin` -> click **Add New Product** -> create a custom item | The new item is saved in `localStorage`, indexed into the TF-IDF vectorizer, and immediately searchable in `/shop`. |

---

## 🎓 Academic Viva Voce / Project Defense Q&A

### Q1: Why did you choose a Hybrid model instead of pure Collaborative Filtering?
> **Answer**: Pure Collaborative Filtering suffers from the **Cold-Start problem** (new products have 0 interactions and cannot be recommended, while new users have no neighbors) and **Sparsity** (most users only rate <1% of the catalog). By combining Content-Based TF-IDF vectorization with Collaborative Filtering, our hybrid system seamlessly recommends new items based on textual attributes while leveraging community purchasing patterns for established items.

### Q2: What is the computational complexity of the TF-IDF Cosine Similarity?
> **Answer**: For a catalog of $N$ products and vocabulary of size $V$, training takes $O(N \cdot L)$ where $L$ is average document length. Computing cosine similarity between a user vector and all products is $O(N \cdot K)$ where $K \ll V$ is the number of non-zero sparse terms. Because the product vectors are pre-normalized to unit length ($\|\hat{v}\| = 1$), cosine similarity simplifies to a fast dot product $\hat{u} \cdot \hat{v}$.

### Q3: How are implicit actions weighted in this system?
> **Answer**: Rather than relying only on explicit star ratings (which fewer than 5% of e-commerce users provide), we capture implicit behavioral signals: Purchases carry the highest weight ($5.0\times$), Cart adds carry $4.0\times$, Wishlist saves carry $3.5\times$, Search queries carry $2.5\times$, and Product views carry $1.5\times$, with exponential recency decay $\lambda$.

---

## 📄 License
This project is developed for educational and academic engineering demonstration purposes.

