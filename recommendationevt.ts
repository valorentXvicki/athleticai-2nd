import axios from 'axios';
import * as cheerio from 'cheerio';
import * as natural from 'natural';

// 1. Scrape BookMyShow "Sports" Events
async function fetchSportsEvents(city: string = "mumbai"): Promise<{title: string, description: string}[]> {
  // Direct Sports category page for BookMyShow
  const url = `https://in.bookmyshow.com/explore/sports-${city}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const events: { title: string, description: string }[] = [];

  // Card selector for sports events (update selector slightly if BookMyShow changes layout)
  $('.card-title').each((_, elem) => {
    const title = $(elem).text().trim();
    // Card description not always available; can enhance by visiting the event page
    events.push({
      title,
      description: title
    });
  });

  // Filter for sports—should be redundant since we're on sports page,
  // but you can add more filtering by keywords if you wish:
  // return events.filter(e => /sport/i.test(e.title));
  return events;
}

// 2. TF-IDF & Cosine Similarity
class TfIdfVectorizer {
  private tfidf: natural.TfIdf;
  private docs: string[];

  constructor(docs: string[]) {
    this.tfidf = new natural.TfIdf();
    this.docs = docs;
    docs.forEach((doc) => this.tfidf.addDocument(doc));
  }

  get terms(): string[] {
    const termsSet = new Set<string>();
    for (let i = 0; i < this.docs.length; i++) {
      this.tfidf.listTerms(i).forEach(({ term }) => termsSet.add(term));
    }
    return Array.from(termsSet);
  }

  getVector(idx: number): number[] {
    const vector: number[] = [];
    this.terms.forEach(term => {
      vector.push(this.tfidf.tfidf(term, idx));
    });
    return vector;
  }
  getVectorForText(text: string): number[] {
    const vector: number[] = [];
    this.terms.forEach(term => {
      const tfidf = new natural.TfIdf();
      tfidf.addDocument(text);
      vector.push(tfidf.tfidf(term, 0));
    });
    return vector;
  }
}
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}
async function recommendSportsEvents(
  query: string,
  city = "mumbai",
  topN = 5
): Promise<void> {
  const events = await fetchSportsEvents(city);
  if (!events.length) {
    console.log("No sports events found!");
    return;
  }
  const documents = events.map(e => `${e.title} ${e.description}`);
  const vectorizer = new TfIdfVectorizer(documents);
  const queryVec = vectorizer.getVectorForText(query);
  const scores = documents.map((_, idx) => {
    const docVec = vectorizer.getVector(idx);
    return cosineSimilarity(queryVec, docVec);
  });
  const recommendations = events
    .map((event, i) => ({ event, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
  console.log(`Top ${topN} Recommended Sports Events for "${query}"`);
  recommendations.forEach(({ event, score }, idx) => {
    console.log(`${idx + 1}. [${event.title}] (score: ${score.toFixed(3)})`);
  });
}

// Example usage:
const query = "cricket marathon football";
recommendSportsEvents(query, "mumbai").catch(console.error);

/*
Install dependencies:
npm install axios cheerio natural
*/
