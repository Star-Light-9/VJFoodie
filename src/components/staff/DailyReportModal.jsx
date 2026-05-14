import { Download, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const DailyReportModal = ({ 
  showModal, 
  onClose, 
  reportStartDate, 
  setReportStartDate, 
  reportEndDate, 
  setReportEndDate, 
  dailyReportData 
}) => {
  if (!showModal) return null

  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('VJFoodie Daily Revenue Report', 14, 22)
    
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Date Range: ${reportStartDate} to ${reportEndDate}`, 14, 30)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36)

    const tableColumn = ["Date", "Total Revenue", "Top Items Sold (Item x Qty)"]
    const tableRows = []

    dailyReportData.forEach(day => {
      const itemsString = day.topItems.length > 0 
        ? day.topItems.map(item => `${item.name} (x${item.quantity})`).join('\n')
        : "No sales"
      
      const rowData = [
        day.date,
        `Rs. ${day.revenue}`,
        itemsString
      ]
      tableRows.push(rowData)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [249, 115, 22] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 'auto' }
      }
    })

    doc.save('Daily_Revenue_Report.pdf')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-food-dark">Daily Revenue Report</h2>
          <div className="flex items-center gap-3">
            <button onClick={downloadPDF} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto" id="daily-report-content">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-food-dark">VJFoodie Daily Report</h1>
            <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-100 pt-4" data-html2canvas-ignore="true">
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-slate-500">Start Date</label>
                <input 
                  type="date" 
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-slate-500">End Date</label>
                <input 
                  type="date" 
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 rounded-t-lg">
                  <th className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">Total Revenue</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 w-full">Top Items Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white border border-slate-200 border-t-0 rounded-b-lg">
                {dailyReportData.map((day, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 align-top text-slate-800 font-medium whitespace-nowrap">{day.date}</td>
                    <td className="py-4 px-4 align-top text-green-600 font-bold whitespace-nowrap">₹{day.revenue}</td>
                    <td className="py-4 px-4 align-top">
                      {day.topItems.length > 0 ? (
                        <ul className="space-y-2">
                          {day.topItems.map((item, i) => (
                            <li key={i} className="text-slate-600 flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                              <span className="font-medium text-slate-800">{item.name}</span>
                              <span className="text-slate-500 text-sm font-medium bg-white px-2 py-0.5 rounded-full shadow-sm">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 italic">No sales on this day</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyReportModal
