import express from 'express';

const app = express();
const PORT = 4001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Build server running on port ${PORT}`);
});
