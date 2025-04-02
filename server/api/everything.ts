import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  const sortBy = query.sortBy as string || 'publishedAt'
  const page = parseInt(query.page as string) || 1

  if (!searchQuery) {
    throw createError({
      statusCode: 400,
      message: 'Search query is required'
    })
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchQuery,
        sortBy,
        page,
        pageSize: 10,
        language: 'en',
        apiKey: process.env.NUXT_PUBLIC_NEWS_API_KEY
      }
    })

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to search articles'
    })
  }
}) 