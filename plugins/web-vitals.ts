import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

export default defineNuxtPlugin(() => {
  onCLS((metric) => {
    console.log('Cumulative Layout Shift:', metric.value)
    // Send to analytics
  })

  onFID((metric) => {
    console.log('First Input Delay:', metric.value)
    // Send to analytics
  })

  onLCP((metric) => {
    console.log('Largest Contentful Paint:', metric.value)
    // Send to analytics
  })

  onTTFB((metric) => {
    console.log('Time to First Byte:', metric.value)
    // Send to analytics
  })
}) 