# RSS to JSON

I need something quick to parse rss into json format, so i made a quick express api using rss-parser. rss-to-json is another parser that could do the same thing.

```GET /api/rss?rss=rss_url```
Returns rss_url converted into json.

```GET /api/rss?nitter=url```
Does the same, but this one works best when url has special characters ('?', '/', etc).

```GET /api/news```
Just for testing, it returns a hard-coded url (https://news.bitcoin.com/feed/) in json format.

```GET /api/ping```
Returns 'pong'