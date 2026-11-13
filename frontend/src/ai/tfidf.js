/**
 * Client-Side TF-IDF Vectorizer and Cosine Similarity Engine
 * Replicates scikit-learn's TfidfVectorizer for browser execution.
 */

// Common English stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'with', 'featuring', 'comes', 'designed', 'built', 'premium', 'high', 'quality'
]);

/**
 * Tokenize string into clean array of words
 */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
  return tokens;
}

/**
 * Build rich text representation of a product
 */
export function buildProductCorpusText(product) {
  const parts = [
    product.name || '',
    product.category || '',
    product.brand || '',
    product.description || '',
    Array.isArray(product.tags) ? product.tags.join(' ') : '',
    product.specs ? Object.values(product.specs).join(' ') : ''
  ];
  return parts.join(' ');
}

export class TfidfEngine {
  constructor() {
    this.vocabulary = new Map(); // token -> term_index
    this.idf = []; // term_index -> idf value
    this.productVectors = new Map(); // productId -> normalized sparse/dense vector
    this.products = [];
    this.isTrained = false;
  }

  /**
   * Train the TF-IDF vectorizer across the entire catalog
   */
  fit(products) {
    this.products = products;
    this.vocabulary.clear();
    const docTermFreqs = [];
    const docCount = products.length;
    const docFrequencies = new Map();

    // Pass 1: Build vocabulary and document frequencies
    products.forEach((product, docIdx) => {
      const text = buildProductCorpusText(product);
      const tokens = tokenize(text);
      const termCounts = new Map();

      tokens.forEach(term => {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
      });

      // Register unique terms for this document
      termCounts.forEach((count, term) => {
        if (!this.vocabulary.has(term)) {
          this.vocabulary.set(term, this.vocabulary.size);
        }
        docFrequencies.set(term, (docFrequencies.get(term) || 0) + 1);
      });

      docTermFreqs.push({ productId: product.id, termCounts, totalWords: tokens.length });
    });

    const vocabSize = this.vocabulary.size;
    this.idf = new Float32Array(vocabSize);

    // Pass 2: Calculate smooth IDF: ln((1 + N) / (1 + DF)) + 1
    this.vocabulary.forEach((termIndex, term) => {
      const df = docFrequencies.get(term) || 1;
      this.idf[termIndex] = Math.log((1 + docCount) / (1 + df)) + 1;
    });

    // Pass 3: Calculate L2-normalized TF-IDF vector for each product
    docTermFreqs.forEach(({ productId, termCounts, totalWords }) => {
      const vector = new Map();
      let normSq = 0;

      termCounts.forEach((count, term) => {
        const termIdx = this.vocabulary.get(term);
        if (termIdx !== undefined && totalWords > 0) {
          // Sublinear TF: 1 + ln(count)
          const tf = 1 + Math.log(count);
          const tfidf = tf * this.idf[termIdx];
          vector.set(termIdx, tfidf);
          normSq += tfidf * tfidf;
        }
      });

      // L2 Normalize
      const norm = Math.sqrt(normSq) || 1;
      const normalizedVector = new Map();
      vector.forEach((val, termIdx) => {
        normalizedVector.set(termIdx, val / norm);
      });

      this.productVectors.set(productId, normalizedVector);
    });

    this.isTrained = true;
    return this;
  }

  /**
   * Vectorize arbitrary input text (e.g., search query or synthesized user interest text)
   */
  vectorizeText(text) {
    if (!this.isTrained) return new Map();
    const tokens = tokenize(text);
    const termCounts = new Map();
    tokens.forEach(term => {
      termCounts.set(term, (termCounts.get(term) || 0) + 1);
    });

    const vector = new Map();
    let normSq = 0;

    termCounts.forEach((count, term) => {
      const termIdx = this.vocabulary.get(term);
      if (termIdx !== undefined) {
        const tf = 1 + Math.log(count);
        const tfidf = tf * this.idf[termIdx];
        vector.set(termIdx, tfidf);
        normSq += tfidf * tfidf;
      }
    });

    const norm = Math.sqrt(normSq) || 1;
    const normalized = new Map();
    vector.forEach((val, termIdx) => {
      normalized.set(termIdx, val / norm);
    });

    return normalized;
  }

  /**
   * Cosine similarity between two sparse normalized vectors
   * Dot product of unit vectors = cosine similarity
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.size === 0 || vecB.size === 0) return 0;
    let dot = 0;
    // Iterate over the smaller vector
    const [smaller, larger] = vecA.size < vecB.size ? [vecA, vecB] : [vecB, vecA];
    smaller.forEach((valA, key) => {
      const valB = larger.get(key);
      if (valB !== undefined) {
        dot += valA * valB;
      }
    });
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Get cosine similarity between two products
   */
  getProductSimilarity(productIdA, productIdB) {
    const vecA = this.productVectors.get(productIdA);
    const vecB = this.productVectors.get(productIdB);
    return this.cosineSimilarity(vecA, vecB);
  }

  /**
   * Extract top characteristic keywords for an item or vector
   */
  getTopKeywords(vector, topN = 5) {
    if (!vector || vector.size === 0) return [];
    const invertedVocab = new Map();
    this.vocabulary.forEach((idx, term) => invertedVocab.set(idx, term));

    const items = [];
    vector.forEach((weight, idx) => {
      const term = invertedVocab.get(idx);
      if (term) items.push({ term, weight });
    });

    return items.sort((a, b) => b.weight - a.weight).slice(0, topN);
  }
}

// Singleton TF-IDF instance
export const tfidfEngine = new TfidfEngine();

