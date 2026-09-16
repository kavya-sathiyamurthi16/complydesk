import { Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from './features/landing/Landing'
import { ManufacturingDashboard } from './features/manufacturing/Dashboard'
import { ManufacturingInvoices } from './features/manufacturing/Invoices'
import { ManufacturingUploadInvoice } from './features/manufacturing/UploadInvoice'
import { ManufacturingScreeningResult } from './features/manufacturing/ScreeningResult'
import { ManufacturingVendors } from './features/manufacturing/Vendors'
import { ManufacturingCompanies } from './features/manufacturing/Companies'
import { ManufacturingCompliance } from './features/manufacturing/Compliance'
import { ManufacturingReports } from './features/manufacturing/Reports'
import { ManufacturingSettings } from './features/manufacturing/Settings'
import { ManufacturingReviewQueue } from './features/manufacturing/ReviewQueue'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/dashboard" element={<ManufacturingDashboard />} />
      <Route path="/invoices" element={<ManufacturingInvoices />} />
      <Route path="/upload-invoice" element={<ManufacturingUploadInvoice />} />
      <Route path="/screening-result/:id" element={<ManufacturingScreeningResult />} />
      <Route path="/review-queue" element={<ManufacturingReviewQueue />} />
      <Route path="/vendors" element={<ManufacturingVendors />} />
      <Route path="/companies" element={<ManufacturingCompanies />} />
      <Route path="/compliance" element={<ManufacturingCompliance />} />
      <Route path="/reports" element={<ManufacturingReports />} />
      <Route path="/settings" element={<ManufacturingSettings />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App