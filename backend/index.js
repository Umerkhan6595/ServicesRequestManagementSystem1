const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require ('path')


dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

const _dirname = path.resolve();


app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/service-requests', require('./routes/serviceRequestRoutes'));

app.use(express.static(path.join(_dirname, '/frontend/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(_dirname, '/frontend/dist/index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
