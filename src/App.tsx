import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileNav } from './components/Layout/MobileNav';
import { Header } from './components/Layout/Header';
import Dashboard from './components/Dashboard';
import Education from './components/Education';
import Projects from './components/Projects';
import Community from './components/Community';
import Profile from './components/Profile';
import Security from './components/Security';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Login from './components/Login';
import { LibraryPage } from './components/LibraryPage';
import { OfficialTraining } from './components/OfficialTraining';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-hub-bg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-brand-cyan/20 border-t-brand-cyan animate-spin rounded-full shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
           <p className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] animate-pulse">Initialisation de la Grille...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-hub-bg text-slate-200 selection:bg-brand-cyan/20 selection:text-brand-cyan font-sans overflow-hidden">
        {/* Main Side Navigation (Desktop) */}
        <Sidebar />

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top Bar (Desktop) */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-0 relative">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />
            
            <div className="max-w-[1600px] mx-auto p-6 lg:p-10 pb-32 lg:pb-10 relative z-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/education" element={<Education />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/security" element={<Security />} />
                <Route path="/about" element={<About />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/academy" element={<OfficialTraining />} />
                <Route 
                  path="/admin" 
                  element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
                />
              </Routes>
            </div>
          </main>

          {/* Bottom Navigation (Mobile Only) */}
          <MobileNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
