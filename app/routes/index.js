'use strict'
//serving non-user routes
const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'Hem' })
})

module.exports = router;