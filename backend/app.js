require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const chokidar = require('chokidar');
const express = require('express');
const Film = require('./models/FilmSchema');
const cors = require('cors');
const authRoutes = require('./Routes/auth');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// lecture de fichier excel avec xlsx et insertion dans la bdd
const readExcelData = () => {
    const filePath = './film.xlsx';
    const workbook = xlsx.readFile(filePath);
    const sheetNameList = workbook.SheetNames;
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { defval: null });
};

// rechargement de  la bdd 
const refreshDatabase = async () => {
    try {
        const excelData = readExcelData();
        await Film.deleteMany({});
        await Film.insertMany(excelData);
        console.log('Database has been refreshed.');
    } catch (err) {
        console.error('Error refreshing the database:', err);
    }
};

// API endpoint to fetch all films
app.get('/api/films', async (req, res) => {
    try {
        const films = await Film.find({});
        res.json(films);
    } catch (error) {
        console.error('Failed to fetch films:', error);
        res.status(500).json({ error: 'Failed to fetch films' });
    }
});

app.use('/api', authRoutes);

// chokidar watch et recharge la bdd a chaque modification de l'excel
const filePath = './film.xlsx';
const watcher = chokidar.watch(filePath, { persistent: true });

watcher.on('change', (path) => {
    console.log(`Detected change in file: ${path}. Updating database...`);
    refreshDatabase();
});

// Start server and initial database refresh
db.once('open', async () => {
    console.log('Connected to MongoDB.');
    await refreshDatabase();
    console.log('Initial data import complete.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
