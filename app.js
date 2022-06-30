const express = require('express')
let Parser = require('rss-parser')

const app = express()
const port = process.env.PORT || 3000;
let parser = new Parser({
    headers: { 'User-Agent': 'Chrome' }
});

// demo url for testing
const bitcoinFeedUrl = 'https://news.bitcoin.com/feed/'

async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => {
        return {
            title: item.title,
            link: item.link,
            date: item.pubDate,
            // those 2 for RSSHub Twitter
            content: item.content,
            contentSnippet: item.contentSnippet
        }
    });
}

// test with demo url
app.get('/api/news', async (req, res) => {
    await fetchRssFeed(bitcoinFeedUrl)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'No news found'
            })
        })
})

// GET /api/rss?rss=url
// app.get('/api/rss/', async (req, res) => {
//     if(req.query.rss){
//         const rssUrl = req.query.rss.toString()
//         console.log(`requested url ${rssUrl}`)
//         await fetchRssFeed(rssUrl)
//         .then(data => {
//             res.status(200).json(data);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 status: 'error',
//                 message: 'Error, no RSS found'
//             })
//         })
//     }else{
//         res.status(500).json({
//             status: 'error',
//             message: 'Error, it should be GET /api/rss?rss=url'
//         })
//     }
    
// })

app.get('/api/rss/', async (req, res) => {
    if(req.query){
        if(req.query.rss){
            const rssUrl = req.query.rss.toString()
            console.log(`requested url ${rssUrl}`)
            await fetchRssFeed(rssUrl)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({
                    status: 'error',
                    message: 'Error, no RSS found'
                })
            })
        }else if(req.query.nitter){ // this one for nitter or other rss url with ?, / or other special characters
            const rssUrl = req.originalUrl.toString().replace("/api/rss?nitter=","")

            console.log(`requested url ${rssUrl}`)
            await fetchRssFeed(rssUrl)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({
                    status: 'error',
                    message: 'Error, no RSS found'
                })
            })
        }
    }else{
        res.status(500).json({
            status: 'error',
            message: 'Error, it should be GET /api/rss?params... (/api/rss?rss=url)'
        })
    }
    
})

app.get('/api/ping', (req, res) => {
    var response = { answer: "pong" }
    res.status(200).json(response)
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})