// api/weather.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city, lat, lon, type } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const BASE = 'https://api.openweathermap.org/data/2.5';

  try {
    let url;
    
    // Determine which endpoint to call based on parameters
    if (type === 'current') {
      if (city) {
        url = `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
      } else if (lat && lon) {
        url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      } else {
        return res.status(400).json({ error: 'Missing city or coordinates' });
      }
    } else if (type === 'forecast') {
      if (city) {
        url = `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
      } else if (lat && lon) {
        url = `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      } else {
        return res.status(400).json({ error: 'Missing city or coordinates' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || 'Failed to fetch weather data' 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}