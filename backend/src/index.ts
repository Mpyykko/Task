import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

app.get('/api/tervehdys', (req: Request, res: Response) => {
  res.json({ message: 'Backend-yhteys?' });
});

app.listen(PORT, () => {
  console.log(`Palvelin pyörii portissa ${PORT}`);
});