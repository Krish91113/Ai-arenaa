// ... existing code ...
import express from 'express';
import cors from 'cors';
import chatRouter from './api/chat.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRouter);

// ... existing code ...
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
// ... existing code ...