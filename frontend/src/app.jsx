
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage.jsx';
import AddressRegistration from './pages/district.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BirthRegistration from './pages/Birth.jsx';
import DeathRegistration from './pages/Death.jsx';
import PaymentRegistration   from './pages/PaymentMethod.jsx';
import ApprovedBirthCertificates from './pages/ApprovedBirth.jsx';
import ApprovedDeathCertificates from './pages/ApprovedDeath.jsx';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/address" element={<AddressRegistration />} />
      <Route path="/birth" element={<BirthRegistration />} />
      <Route path="/death" element={<DeathRegistration />} />
      <Route path="/payment-method" element={<PaymentRegistration />} />
      <Route path="/approved-birth-certificates" element={<ApprovedBirthCertificates />} />
      <Route path="/approved-death-certificates" element={<ApprovedDeathCertificates />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
