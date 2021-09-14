const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const articleRoute = require('./routes/articles');
const Article = require('./models/article');
require('dotenv').config();
const PORT = process.env.PORT;

console.clear();

mongoose.connect(process.env.DATABASE_URL);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ dateOfCreate: 'descending' });
    res.render('./articles/index', { articles: articles });
})

app.use('/articles', articleRoute);

app.listen(PORT, () => {
    console.log(`successfully run at ${PORT}`);
})