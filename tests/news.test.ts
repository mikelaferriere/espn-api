import axios from 'axios'
import { fetchNews } from '../lib/news'

import * as nflNewsJson from './data/news/nfl-news.json'

import { League } from '../lib/definitions/enums'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('news module', () => {
  test('fetchNews returns articles with headline, byline, images', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflNewsJson })

    const result = await fetchNews(League.NFL)

    expect(result.articles).toHaveLength(2)
    expect(result.articles[0].headline).toBe(
      'Major NFL Draft Development Shakes Up First Round'
    )
    expect(result.articles[0].byline).toBe('John Smith')
    expect(result.articles[0].images).toHaveLength(1)
    expect(result.articles[0].images[0].url).toContain('espn')
    expect(result.articles[0].links).toHaveLength(1)
    expect(result.articles[0].links[0].href).toContain('espn.com')
  })

  test('fetchNews with limit option passes limit in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflNewsJson })

    await fetchNews(League.NFL, { limit: 5 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=5'
    )
  })

  test('fetchNews without options calls correct base URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflNewsJson })

    await fetchNews(League.NFL)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news'
    )
  })

  test('fetchNews throws meaningful error on failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network timeout'))

    await expect(fetchNews(League.NFL)).rejects.toThrow('Network timeout')
  })

  test('fetchNews handles non-Error rejection', async () => {
    axios.get = jest.fn().mockRejectedValue('string error')

    await expect(fetchNews(League.NFL)).rejects.toThrow('string error')
  })

  test('fetchNews handles unknown rejection type', async () => {
    axios.get = jest.fn().mockRejectedValue({ code: 500 })

    await expect(fetchNews(League.NFL)).rejects.toThrow(
      'An unknown error occurred while fetching news data'
    )
  })

  test('fetchNews article structure matches NewsResponse type', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflNewsJson })

    const result = await fetchNews(League.NFL)
    const article = result.articles[0]

    expect(article).toHaveProperty('id')
    expect(article).toHaveProperty('description')
    expect(article).toHaveProperty('type')
    expect(article).toHaveProperty('story')
    expect(article).toHaveProperty('headline')
    expect(article).toHaveProperty('shortHeadline')
    expect(article).toHaveProperty('byline')
    expect(article).toHaveProperty('published')
    expect(article).toHaveProperty('lastModified')
    expect(article).toHaveProperty('links')
    expect(article).toHaveProperty('images')
    expect(article).toHaveProperty('categories')

    expect(typeof article.id).toBe('string')
    expect(typeof article.headline).toBe('string')
    expect(typeof article.byline).toBe('string')
    expect(Array.isArray(article.links)).toBe(true)
    expect(Array.isArray(article.images)).toBe(true)
    expect(Array.isArray(article.categories)).toBe(true)
  })

  test('fetchNews constructs correct URL for different leagues', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: { articles: [] } })

    await fetchNews(League.NHL)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news'
    )
  })
})
