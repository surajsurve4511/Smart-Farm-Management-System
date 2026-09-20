'use server'

export async function fetchMandiPrices(commodity?: string, state?: string) {
  try {
    const apiKey = process.env.MARKET_PRICE_API_KEY
    if (!apiKey) return { error: 'MARKET_PRICE_API_KEY not configured — add it to .env.local', records: [] }
    let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=30`
    if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`
    if (state) url += `&filters[state]=${encodeURIComponent(state)}`
    const response = await fetch(url, { next: { revalidate: 1800 } })
    if (!response.ok) return { error: `Government API returned ${response.status}`, records: [] }
    const data = await response.json()
    return { records: data.records || [], total: data.total || 0 }
  } catch (err: any) {
    return { error: err.message, records: [] }
  }
}
