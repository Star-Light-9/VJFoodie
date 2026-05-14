import { useState, useEffect, useMemo } from 'react'
import { getAllOrders } from '../lib/supabaseAPI'

// Helper for dates
const getDaysAgo = (days) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d
}

export const useStaffAnalytics = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [topItemsTab, setTopItemsTab] = useState('today')
  const [peakTimeTab, setPeakTimeTab] = useState('today')
  
  const [reportStartDate, setReportStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0]
  )
  const [reportEndDate, setReportEndDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await getAllOrders()
      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data.filter(o => o.status !== 'Cancelled'))
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  // --- KPI Analytics ---
  const kpis = useMemo(() => {
    const todayStart = getDaysAgo(0)
    
    let ordersToday = 0
    let revenueToday = 0
    let pendingCount = 0

    orders.forEach(o => {
      const d = new Date(o.order_date)
      if (d >= todayStart) {
        ordersToday++
        revenueToday += Number(o.total_price)
      }
      if (['Order Placed', 'Preparing'].includes(o.status)) {
        pendingCount++
      }
    })

    const aov = ordersToday > 0 ? (revenueToday / ordersToday).toFixed(2) : 0

    return { ordersToday, revenueToday, aov, pendingCount }
  }, [orders])

  // --- Top 5 Items Logic ---
  const topItems = useMemo(() => {
    const todayStart = getDaysAgo(0)
    const sevenDaysStart = getDaysAgo(7)
    const thirtyDaysStart = getDaysAgo(30)

    const aggregateItems = (startDate) => {
      const counts = {}
      orders.forEach(o => {
        const d = new Date(o.order_date)
        if (d >= startDate) {
          o.order_items?.forEach(oi => {
            const name = oi.menu?.item_name || 'Unknown'
            counts[name] = (counts[name] || 0) + oi.quantity
          })
        }
      })
      return Object.entries(counts)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
    }

    return {
      today: aggregateItems(todayStart),
      '7days': aggregateItems(sevenDaysStart),
      '30days': aggregateItems(thirtyDaysStart)
    }
  }, [orders])

  // --- Most Sold Item Each of Last 7 Days ---
  const mostSoldLast7Days = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = getDaysAgo(i)
      const dayEnd = getDaysAgo(i - 1)
      
      const counts = {}
      let totalItemsSold = 0

      orders.forEach(o => {
        const d = new Date(o.order_date)
        if (d >= dayStart && (i === 0 ? true : d < dayEnd)) {
          o.order_items?.forEach(oi => {
            const name = oi.menu?.item_name || 'Unknown'
            counts[name] = (counts[name] || 0) + oi.quantity
            totalItemsSold += oi.quantity
          })
        }
      })

      let topItem = 'No sales'
      let maxQty = 0
      Object.entries(counts).forEach(([name, qty]) => {
        if (qty > maxQty) {
          maxQty = qty
          topItem = name
        }
      })

      result.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        topItem,
        qty: maxQty,
        totalItemsSold
      })
    }
    return result
  }, [orders])

  // --- Hourly Order Volume (Peak Time) ---
  const hourlyData = useMemo(() => {
    const isWeek = peakTimeTab === 'week'
    const startDate = getDaysAgo(isWeek ? 7 : 0)
    const hours = Array(24).fill(0)
    
    orders.forEach(o => {
      const d = new Date(o.order_date)
      if (d >= startDate) {
        hours[d.getHours()]++
      }
    })

    return hours.map((count, hour) => ({
      time: `${hour}:00`,
      orders: count
    })).filter((_, i) => i >= 8 && i <= 22)
  }, [orders, peakTimeTab])

  // --- Orders by Day of Week (Peak Day) ---
  const dailyData = useMemo(() => {
    const sevenDaysAgo = getDaysAgo(7)
    const days = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 }
    
    orders.forEach(o => {
      const d = new Date(o.order_date)
      if (d >= sevenDaysAgo) {
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
        if (days[dayName] !== undefined) {
          days[dayName]++
        }
      }
    })

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      orders: days[day]
    }))
  }, [orders])

  // --- Revenue Over Last 7 Days ---
  const revenueTrend = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = getDaysAgo(i)
      const dayEnd = getDaysAgo(i - 1)
      
      let rev = 0
      orders.forEach(o => {
        const d = new Date(o.order_date)
        if (d >= dayStart && (i === 0 ? true : d < dayEnd)) {
          rev += Number(o.total_price)
        }
      })

      result.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: rev
      })
    }
    return result
  }, [orders])

  // --- Daily Report Data ---
  const dailyReportData = useMemo(() => {
    const result = []
    
    const start = new Date(reportStartDate)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(reportEndDate)
    end.setHours(0, 0, 0, 0)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return []

    const currentDate = new Date(end)
    while (currentDate >= start) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate)
      dayEnd.setDate(dayEnd.getDate() + 1)
      
      let rev = 0
      const counts = {}

      orders.forEach(o => {
        const d = new Date(o.order_date)
        if (d >= dayStart && d < dayEnd) {
          rev += Number(o.total_price)
          o.order_items?.forEach(oi => {
            const name = oi.menu?.item_name || 'Unknown'
            counts[name] = (counts[name] || 0) + oi.quantity
          })
        }
      })

      const top5 = Object.entries(counts)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      result.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: rev,
        topItems: top5
      })

      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    return result
  }, [orders, reportStartDate, reportEndDate])

  return {
    orders,
    loading,
    topItemsTab, setTopItemsTab,
    peakTimeTab, setPeakTimeTab,
    reportStartDate, setReportStartDate,
    reportEndDate, setReportEndDate,
    kpis,
    topItems,
    mostSoldLast7Days,
    hourlyData,
    dailyData,
    revenueTrend,
    dailyReportData
  }
}
