// Dynamic Base URL based on current hostname
// Local: localhost:3000 → http://localhost:8000
// Live IP: 31.97.14.21:3000 → http://31.97.14.21:8000
// Production: umbrellapackaging.com → https://umbrellapackaging.com
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing from IP address (live server), use IP-based backend
  if (hostname === '31.97.14.21') {
    return 'http://31.97.14.21:8000';
  }
  
  // If accessing from localhost, use localhost backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Default to production
  return 'http://localhost:8000';
};

export const Base_url = getBaseUrl();