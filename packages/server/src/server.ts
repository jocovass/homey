require('dotenv/config');
import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT || 8000;

const DB_URL = process.env.DB;
if (DB_URL) {
    mongoose
        .connect(DB_URL)
        .then(() => console.log(`DB connection successful ✅`))
        .catch(error => {
            console.log(`DB connection failed 💥`);
            console.log(error);
        });
}

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
