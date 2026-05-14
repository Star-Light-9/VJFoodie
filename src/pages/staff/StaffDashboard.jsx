import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { Package, DollarSign, TrendingUp, Clock, Loader2, Award, FileText } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid
} from 'recharts'
import { useState } from 'react'
import { useStaffAnalytics } from '../../hooks/useStaffAnalytics'
import DailyReportModal from '../../components/staff/DailyReportModal'

const StaffDashboard = () => {
  const {
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
  } = useStaffAnalytics()

  const [showReportModal, setShowReportModal] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen bg-food-surface">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-food-dark">Analytics Dashboard</h1>
              <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button 
              onClick={() => setShowReportModal(true)}
              className="bg-food-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Daily Report
            </button>
          </div>
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Orders Today</p>
                <p className="text-2xl font-bold text-food-dark">{kpis.ordersToday}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                <p className="text-2xl font-bold text-food-dark">₹{kpis.revenueToday}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-food-dark">₹{kpis.aov}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-food-dark">{kpis.pendingCount}</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-food-dark mb-6">Revenue Trend (Last 7 Days)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peak Order Time */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-food-dark">Peak Order Time</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['today', 'week'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setPeakTimeTab(tab)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${peakTimeTab === tab ? 'bg-white shadow-sm text-food-dark font-medium' : 'text-slate-500 hover:text-food-dark'}`}
                    >
                      {tab === 'today' ? 'Today' : 'This Week'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Middle Row 2: Peak Day */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-food-dark mb-6">Peak Day of the Week (Last 7 Days)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Empty right column to keep the half-width size */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Top 5 Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-food-dark">Top 5 Items Sold</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['today', '7days', '30days'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setTopItemsTab(tab)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${topItemsTab === tab ? 'bg-white shadow-sm text-food-dark font-medium' : 'text-slate-500 hover:text-food-dark'}`}
                    >
                      {tab === 'today' ? 'Today' : tab === '7days' ? '7 Days' : '30 Days'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {topItems[topItemsTab].length > 0 ? topItems[topItemsTab].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-food-orange flex items-center justify-center font-bold text-sm border border-orange-100">
                        #{idx + 1}
                      </div>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full text-sm">
                      {item.quantity} sold
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center">
                    <p className="text-slate-500">No data available for this period</p>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Most Sold (Last 7 Days) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-food-dark mb-6">Most Sold Item (Last 7 Days)</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="pb-3 px-2">Date</th>
                      <th className="pb-3 px-2">Top Item</th>
                      <th className="pb-3 px-2 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mostSoldLast7Days.map((day, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-2 text-sm text-slate-600 font-medium">{day.date}</td>
                        <td className="py-3 px-2 text-sm text-slate-800">
                          {day.topItem !== 'No sales' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-food-orange font-medium border border-orange-100">
                              <Award className="w-3.5 h-3.5" />
                              {day.topItem}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm italic">No sales</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-sm text-slate-600 text-right font-medium">
                          {day.topItem !== 'No sales' ? (
                             <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{day.qty}</span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>

      <DailyReportModal 
        showModal={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        reportStartDate={reportStartDate} 
        setReportStartDate={setReportStartDate} 
        reportEndDate={reportEndDate} 
        setReportEndDate={setReportEndDate} 
        dailyReportData={dailyReportData} 
      />

    </div>
  )
}

export default StaffDashboard
