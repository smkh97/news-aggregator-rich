import { defineEventHandler, getQuery, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string || 'general'
  const page = parseInt(query.page as string) || 1

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        category,
        page,
        pageSize: 10,
        apiKey: process.env.NUXT_PUBLIC_NEWS_API_KEY
      }
    })

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch top headlines'
    })
  }
}) 