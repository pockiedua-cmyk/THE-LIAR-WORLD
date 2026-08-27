// THE LIAR WORLD - API Server (Placeholder)
// Future: Online ranking, multiplayer saves, cloud sync

const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.url === '/api/ranking') {
    // TODO: return global ranking from database
    res.end(JSON.stringify({ ranking: [], message: 'Online ranking coming soon' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/save') {
    // TODO: save game state to database
    res.end(JSON.stringify({ ok: true, message: 'Cloud save coming soon' }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`THE LIAR WORLD API running on port ${PORT}`);
});
