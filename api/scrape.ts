import axios from 'axios';
import * as cheerio from 'cheerio';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url } = req.query;

    // Check if URL is provided
    if (!url) {
      return res.status(400).json({ error: 'Please provide a URL as a query parameter.' });
    }

    // Fetch the content of the webpage
    const response = await axios.get(url as string);

    // Load the HTML using cheerio
    const $ = cheerio.load(response.data);

    // Select all tables and extract the HTML of each table
    const tables = [];
    $('table').each((i, table) => {
      tables.push($(table).html());
    });

    // Check if any tables were found
    if (tables.length === 0) {
      return res.status(404).json({ message: 'No tables found on the provided webpage.' });
    }

    // Return the scraped table data as JSON
    return res.json({ tables });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while scraping the webpage.', details: error.message });
  }
}
