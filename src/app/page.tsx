'use client';

import { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Info } from 'lucide-react';
import MarketMoodGauge from './components/MarketMoodGauge';
import AutoScrollingArticles from './components/AutoScrollingArticles';
import InfoModal from './components/InfoModal'; // Modal component

// Define interfaces for data types
interface SentimentCounts {
  Bearish: number;
  "Somewhat-Bearish": number;
  Neutral: number;
  "Somewhat-Bullish": number;
  Bullish: number;
}

interface SentimentSummary {
  timestamp: string;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  sentiment_counts: SentimentCounts;
}

interface ArticleData {
  url: string;
  sentiment_score: number;
  sentiment_label: string;
}

// Define sector tickers
const sectorTickers = {
  Technology: 'XLK',
  Healthcare: 'XLV',
  Financials: 'XLF',
  ConsumerDiscretionary: 'XLY',
  CommunicationServices: 'XLC',
  Industrials: 'XLI',
};

export default function Home() {
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [articleData, setArticleData] = useState<ArticleData[]>([]);
  const [latestSentiment, setLatestSentiment] = useState<SentimentSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal control

  // Fetch sector data
  useEffect(() => {
    async function fetchSectorData() {
      const fetchedSectors = await Promise.all(
        Object.entries(sectorTickers).map(async ([sector, ticker]) => {
          try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
            const result = await response.json();
            return {
              name: sector,
              value: result.c,
              change: ((result.c - result.pc) / result.pc) * 100,
            };
          } catch (error) {
            console.error(`Error fetching data for ${sector}:`, error);
            return { name: sector, value: 'N/A', change: 'N/A' };
          }
        })
      );
      setSectorData(fetchedSectors);
    }
    fetchSectorData();
  }, []);

  // Fetch MongoDB data
  useEffect(() => {
    async function fetchDataFromMongo() {
      try {
        const response = await fetch('/api/fetchData');
        const data = await response.json();
        if (data.summary && data.summary.length > 0) {
          setLatestSentiment(data.summary[0]);
        }
        if (data.analysis && data.analysis.length > 0) {
          setArticleData(data.analysis);
        }
      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
      }
    }
    fetchDataFromMongo();
  }, []);

  // Format articles data for AutoScrollingArticles component
  const formattedArticles: [string, number, string][] = articleData.map((article) => [
    article.url,
    article.sentiment_score,
    article.sentiment_label,
  ]);

  // Modal content explaining each section
  const infoContent = `
    - **Market Sector Data**: Data is fetched from Alpha Vantage and represents major market sectors.
    - **ML Techniques**: We use NLP models like BART for summarization and sentiment analysis.
    - **Market Mood Gauge**: Generated using a sentiment score on a range from Bearish to Bullish.
    - **Analyzed Articles**: Articles analyzed for sentiment and summarized based on recent trends.
  `;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">US Market Sectors</h3>
        {/* Info button to open modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Sector Data Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectorData.map((sector, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base">{sector.name}</span>
              <span className={`text-sm ${sector.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {sector.change >= 0 ? <ArrowUpIcon className="inline w-3 h-3" /> : <ArrowDownIcon className="inline w-3 h-3" />}
                {Math.abs(sector.change).toFixed(2)}%
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold flex items-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              {sector.value}
            </div>
          </div>
        ))}
      </div>

      {/* Market Mood Gauge */}
      {latestSentiment ? (
        <div className="mt-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
            <MarketMoodGauge value={latestSentiment.overall_sentiment_score} />
            <div className="text-center mt-4 text-xs sm:text-sm text-gray-400">
              Updated at {new Date(latestSentiment.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-lg text-center text-xs sm:text-sm text-gray-400">
          Loading market mood data...
        </div>
      )}

      {/* Articles Section */}
      <div className="flex-grow max-h-64 overflow-hidden mt-4">
        <AutoScrollingArticles articles={formattedArticles} />
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
