// pages/api/fetchData.ts

import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.NEXT_PUBLIC_MONGO_URI || "";
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// Helper function to reformat MongoDB date format to 'YYYY-MM-DD'
function formatDate(mongoDate: string): string {
  const year = mongoDate.substring(0, 4);
  const month = mongoDate.substring(4, 6);
  const day = mongoDate.substring(6, 8);
  return `${year}-${month}-${day}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await connectToDatabase();
    const db = client.db('market_pulse');

    // Fetch summary data
    const summaryCollection = db.collection('summary_data');
    const summaryData = await summaryCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // Format summary timestamp if needed
    if (summaryData.length > 0) {
      summaryData[0].timestamp = formatDate(summaryData[0].timestamp);
    }

    // Fetch today's analysis and format dates
    const today = new Date().toISOString().split('T')[0];
    const analyzedCollection = db.collection('analyzed_news_data');
    
    const analysisData = await analyzedCollection.find({}).toArray();
    console.log(analysisData)

    res.status(200).json({ summary: summaryData, analysis: analysisData });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
