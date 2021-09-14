const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/new', (req, res) => {
    res.render('./articles/new', { article: new Article() });
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect('/');
    else res.render('articles/show', { article: article });
})

router.get('/edit/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    res.render('articles/edit', { article: article });
})

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveAndRedirect('new'))

router.put('/:slug', async (req, res, next) => {
    req.article = await Article.findOne({ slug: req.params.slug });
    next();
}, saveAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title,
            article.description = req.body.description,
            article.markdown = req.body.markdown
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (err) {
            console.log('error is:', err);
            res.render(`articles/${path}`, { article: article });
        }
    }
}

module.exports = router