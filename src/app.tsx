
/********************************parte miguel********************************/
import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Zap, ChevronRight, RefreshCw, Clock, Heart, Menu, X,
  User, ShieldCheck, ShoppingBag, ClipboardList, PlusCircle,
  AlertCircle, BarChart3, Search, Lock, LogOut
} from 'lucide-react';
 
interface DogApiResponse { message: string; status: string; }
interface PetStatus { condition: 'Saludable' | 'En Tratamiento' | 'Recuperación' | 'Crítico'; lastCheckup: string; }
interface Pet { id: string; name: string; species: string; breed: string; age: string; status: PetStatus; ownerId: string; }
interface MedicalRecord { id: string; petId: string; date: string; diagnosis: string; treatment: string; vet: string; type: 'Consulta' | 'Cirugía' | 'Vacunación' | 'Laboratorio'; }
interface Product { id: number; name: string; price: string; priceNum: number; category: string; image: string; description: string; }
 
const PRODUCTS: Product[] = [
  { id: 1, name: "Plan Nutricional Pro-Active", price: "Bs 45.00", priceNum: 45, category: "Nutrición", image: "https://plus.unsplash.com/premium_photo-1683134382202-aac458a92c19?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Fórmula balanceada con proteínas de alta digestibilidad para mascotas activas." },
  { id: 2, name: "Smart Health Tracker v2", price: "Bs 120.00", priceNum: 120, category: "Tecnología", image: "https://images.unsplash.com/photo-1640926493027-491255a71805?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Monitor de salud en tiempo real con GPS integrado y alertas automáticas." },
  { id: 3, name: "Medical Kit Emergencias", price: "Bs 90.00", priceNum: 89.99, category: "Salud", image: "https://images.unsplash.com/photo-1606235357537-84aea24d4c4f?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Kit completo de primeros auxilios para mascotas, certificado por veterinarios." }
];
 
const INITIAL_PETS: Pet[] = [
  { id: '1', name: 'Max', species: 'Canino', breed: 'Golden Retriever', age: '3 años', ownerId: 'client1', status: { condition: 'Saludable', lastCheckup: '2024-04-15' } },
  { id: '2', name: 'Luna', species: 'Felino', breed: 'Siames', age: '2 años', ownerId: 'client1', status: { condition: 'Recuperación', lastCheckup: '2024-04-28' } },
  { id: '3', name: 'Rocky', species: 'Canino', breed: 'Bulldog', age: '5 años', ownerId: 'client2', status: { condition: 'En Tratamiento', lastCheckup: '2024-04-30' } }
];
 
const INITIAL_HISTORY: MedicalRecord[] = [
  { id: 'h1', petId: '1', date: '2024-04-15', diagnosis: 'Chequeo anual preventivo', treatment: 'Refuerzo de vitaminas', vet: 'Dr. Sanchez', type: 'Consulta' },
  { id: 'h2', petId: '2', date: '2024-04-28', diagnosis: 'Fractura leve en pata trasera', treatment: 'Vendaje y analgésicos', vet: 'Dra. Quiroz', type: 'Cirugía' },
  { id: 'h3', petId: '1', date: '2023-12-10', diagnosis: 'Vacuna contra Rabia', treatment: 'Administración de dosis', vet: 'Dr. Arellano', type: 'Vacunación' }
];
 
const SectionHeader = ({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) => (
  <div className="mb-12">
    {badge && <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">{badge}</span>}
    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{title}</h2>
    <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">{subtitle}</p>
  </div>
);
 
export default function App() {
  const [activePortal, setActivePortal] = useState<'public' | 'client' | 'admin'>('public');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authType, setAuthType] = useState<'client' | 'admin' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [history, setHistory] = useState<MedicalRecord[]>(INITIAL_HISTORY);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [loadingDog, setLoadingDog] = useState(true);
 
  const fetchDog = useCallback(async () => {
    try {
      setLoadingDog(true);
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data: DogApiResponse = await res.json();
      if (data.status === 'success') setDogImage(data.message);
    } catch (err) { console.error(err); }
    finally { setLoadingDog(false); }
  }, []);
 
  useEffect(() => { fetchDog(); }, [fetchDog]);
 
  const scrollToSection = (id: string) => {
    setActivePortal('public');
    setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100);
    setIsMobileMenuOpen(false);
  };
 
  const handleLogin = (type: 'client' | 'admin') => {
    if (loginForm.user && loginForm.pass) {
      setIsLoggedIn(true); setAuthType(type); setActivePortal(type); setLoginForm({ user: '', pass: '' });
    } else { alert("Por favor, ingrese usuario y contraseña."); }
  };
 
  const handleLogout = () => { setIsLoggedIn(false); setAuthType(null); setActivePortal('public'); };
 
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      setJustAdded(productId);
      setTimeout(() => setJustAdded(null), 1200);
      return [...prev, productId];
    });
  };
 
  const favoriteProducts = PRODUCTS.filter(p => favorites.includes(p.id));
  const favoritesTotal = favoriteProducts.reduce((sum, p) => sum + p.priceNum, 0);
 
  const addPet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPet: Pet = {
      id: Math.random().toString(36).substr(2, 9),
      name: fd.get('name') as string,
      species: fd.get('species') as string,
      breed: fd.get('breed') as string,
      age: fd.get('age') as string,
      ownerId: 'client1',
      status: { condition: 'Saludable', lastCheckup: new Date().toISOString().split('T')[0] }
    };
    setPets(prev => [...prev, newPet]);
    setIsAddPetOpen(false);
    const initialRecord: MedicalRecord = {
      id: 'h' + Math.random(), petId: newPet.id, date: new Date().toISOString().split('T')[0],
      diagnosis: 'Registro inicial de mascota', treatment: 'Ninguno', vet: 'Sistema Pro', type: 'Consulta'
    };
    setHistory(prev => [initialRecord, ...prev]);
  };
 
  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const date = new Date(h.date);
      const start = dateFilter.start ? new Date(dateFilter.start) : null;
      const end = dateFilter.end ? new Date(dateFilter.end) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history, dateFilter]);
 /******************************fin de parte de miguel**********************************************************/
 /**************************************inicion de parte de camila***********************************************/
  return (
    <div className="min-h-screen font-sans selection:bg-amber-100 selection:text-amber-800 overflow-x-hidden" style={{ background: '#faf8f4', color: '#0a1628' }}>
 
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(250,248,244,0.85)', borderBottom: '1px solid rgba(10,22,40,0.07)', boxShadow: '0 1px 0 rgba(10,22,40,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('inicio')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #0a1628, #1e3a5f)' }}>
              <Heart className="w-5 h-5 fill-amber-400" style={{ color: '#fbbf24' }} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] font-black tracking-tight" style={{ color: '#0a1628' }}>Smart Paws <span style={{ color: '#f59e0b' }}>Pro</span></span>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: '#94a3b8' }}>Tecnologías Web I · UCB</span>
            </div>
          </div>
 
          <div className="hidden md:flex items-center gap-7">
            <button onClick={() => scrollToSection('inicio')} className="nav-link">Inicio</button>
            <button onClick={() => scrollToSection('servicios')} className="nav-link">Servicios</button>
            <button onClick={() => scrollToSection('tienda')} className="nav-link">Tienda</button>
            <button onClick={() => scrollToSection('pacientes')} className="nav-link">Pacientes</button>
 
            {/* Favoritos en navbar */}
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="relative flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-600"
              style={{ color: favorites.length > 0 ? '#f59e0b' : '#64748b' }}
            >
              <Heart className={`w-4 h-4 transition-all ${favorites.length > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
              Deseos
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white" style={{ background: '#f59e0b' }}>
                  {favorites.length}
                </span>
              )}
            </button>
 
            <div className="h-5 w-px mx-1" style={{ background: 'rgba(10,22,40,0.12)' }} />
 
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button onClick={() => setActivePortal(authType!)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#92400e' }}>
                  <User className="w-4 h-4" /> Mi Portal
                </button>
                <button onClick={handleLogout} className="p-2 rounded-lg" style={{ color: '#94a3b8' }}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button onClick={() => setActivePortal('client')} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-600" style={{ color: '#64748b' }}>
                  <Lock className="w-3 h-3" /> Clientes
                </button>
                <button onClick={() => setActivePortal('admin')} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-600" style={{ color: '#64748b' }}>
                  <ShieldCheck className="w-3 h-3" /> Vets
                </button>
              </div>
            )}
 
            <button onClick={() => setIsBookingOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #0a1628, #1e3a5f)', boxShadow: '0 4px 14px rgba(10,22,40,0.22)' }}>
              Agendar Cita <ChevronRight className="w-4 h-4" />
            </button>
          </div>
 
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
 
      {/* ── Main ── */}
      <main className="pt-[70px]">
        <AnimatePresence mode="wait">
 
          {/* PUBLIC VIEW */}
          {activePortal === 'public' && (
            <motion.div key="public" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 
              {/* Hero */}
              <section id="inicio" className="relative overflow-hidden" style={{ background: '#0a1628', minHeight: '92vh' }}>
                <div className="blob-anim absolute top-[-140px] left-[-100px] w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%)', pointerEvents: 'none' }} />
                <div className="absolute bottom-[-120px] right-[-80px] w-[440px] h-[440px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)', pointerEvents: 'none' }} />
                <div className="hero-stripe absolute inset-0" />
                <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                  <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="badge-pill mb-8" style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.4)', color: '#fbbf24' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#fbbf24' }} /> Innovación en La Paz, Bolivia
                    </div>
                    <h1 className="mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: '#faf8f4', lineHeight: 1.04, letterSpacing: '-0.03em' }}>
                      Cuidado<br />
                      <span style={{ color: '#f59e0b', fontStyle: 'italic', fontWeight: 700 }}>Animal</span> de<br />
                      <span style={{ color: 'rgba(250,248,244,0.4)', fontWeight: 400, fontStyle: 'italic' }}>Próxima Gen.</span>
                    </h1>
                    <p className="text-lg leading-relaxed max-w-md mb-10" style={{ color: 'rgba(250,248,244,0.62)' }}>
                      Biotecnología aplicada y telemedicina para garantizar diagnósticos precisos en tiempo récord.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setIsBookingOpen(true)} className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a1628', boxShadow: '0 8px 28px rgba(245,158,11,0.5)', transition: 'all 0.25s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(245,158,11,0.65)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,158,11,0.5)'; }}>
                        ✦ Agendar Cita PRO
                      </button>
                      <button onClick={() => scrollToSection('tienda')} className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(250,248,244,0.9)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(12px)', transition: 'all 0.25s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        Explorar Tienda →
                      </button>
                    </div>
                    <div className="flex gap-8 mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {[{ num: '2,400+', label: 'Mascotas atendidas' }, { num: '98%', label: 'Satisfacción' }, { num: '24/7', label: 'Soporte activo' }].map((s, i) => (
                        <div key={i}>
                          <div className="text-2xl font-black" style={{ color: '#faf8f4' }}>{s.num}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(250,248,244,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div className="relative hidden lg:block" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="hero-float">
                      <img src="https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=800&q=80" className="w-full object-cover" style={{ borderRadius: '42% 58% 54% 46% / 46% 42% 58% 54%', height: '560px', boxShadow: '0 48px 100px rgba(0,0,0,0.55)' }} alt="Hero dog" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute top-8 -left-6 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'white', boxShadow: '0 20px 40px rgba(10,22,40,0.2)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: '#0a1628' }}>Estado Saludable</div>
                        <div className="text-[10px]" style={{ color: '#94a3b8' }}>Último chequeo hoy</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: '#f59e0b', boxShadow: '0 12px 30px rgba(245,158,11,0.42)' }}>
                      <Heart className="w-4 h-4 fill-white" style={{ color: 'white' }} />
                      <span className="text-xs font-black uppercase tracking-wider text-white">Smart Paws Pro</span>
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #faf8f4, transparent)' }} />
              </section>
 
              {/* Servicios */}
              <section id="servicios" className="py-28 px-6 md:px-12" style={{ background: '#faf8f4' }}>
                <div className="max-w-7xl mx-auto">
                  <div className="mb-14">
                    <div className="badge-pill mb-5">Documentación 2.0</div>
                    <h2 className="mb-4" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 900, color: '#0a1628', lineHeight: 1.1 }}>
                      Capacidades<br /><span style={{ color: '#f59e0b', fontStyle: 'italic' }}>del Sistema</span>
                    </h2>
                    <p className="text-slate-500 max-w-xl text-lg leading-relaxed">Nuestra plataforma centraliza toda la gestión clínica veterinaria en un solo lugar.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { icon: <Clock className="w-6 h-6" />, title: "Agendamiento Smart", desc: "Gestión inteligente de turnos con prioridad médica.", bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
                      { icon: <ClipboardList className="w-6 h-6" />, title: "Historial Crítico", desc: "Registros encriptados accesibles 24/7 por el cliente.", bg: 'rgba(10,22,40,0.07)', color: '#0a1628' },
                      { icon: <ShoppingBag className="w-6 h-6" />, title: "Tienda Integrada", desc: "Suministros médicos y nutrición especializada.", bg: 'rgba(16,185,129,0.1)', color: '#065f46' },
                      { icon: <ShieldCheck className="w-6 h-6" />, title: "Paneles Expertos", desc: "Vistas dedicadas para médicos y administradores.", bg: 'rgba(59,130,246,0.1)', color: '#1e40af' },
                    ].map((item, i) => (
                      <div key={i} className="portal-card group">
                        <div className="service-icon-wrap" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                        <h3 className="text-xl font-black mb-3" style={{ color: '#0a1628' }}>{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
  /**********************************************fin de parte de camila *************************************/
 /************************************************inicio de parte de aaron************************************** */
              {/* ── Tienda CON FAVORITOS ── */}
              <section id="tienda" className="py-28 px-6 md:px-12" style={{ background: '#0a1628' }}>
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-8">
                    <div>
                      <div className="badge-pill mb-5" style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.4)', color: '#fbbf24' }}>Tienda Online UCB</div>
                      <h2 className="mb-3" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 900, color: '#faf8f4', lineHeight: 1.1 }}>
                        Catálogo de<br /><span style={{ color: '#f59e0b', fontStyle: 'italic' }}>Productos</span>
                      </h2>
                      <p className="max-w-md leading-relaxed" style={{ color: 'rgba(250,248,244,0.52)' }}>Adquiere tecnología y nutrición de vanguardia para tu mascota.</p>
                    </div>
                    {/* Botón ver lista de deseos */}
                    <button
                      onClick={() => setIsFavoritesOpen(true)}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                      style={{ background: favorites.length > 0 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.4)', color: favorites.length > 0 ? '#fbbf24' : 'rgba(250,248,244,0.5)' }}
                    >
                      <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
                      Lista de Deseos
                      {favorites.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: '#f59e0b', color: '#0a1628' }}>
                          {favorites.length}
                        </span>
                      )}
                    </button>
                  </div>
 
                  <div className="grid sm:grid-cols-3 gap-8">
                    {PRODUCTS.map(p => {
                      const isFav = favorites.includes(p.id);
                      const wasJustAdded = justAdded === p.id;
                      return (
                        <div key={p.id} className="product-card group relative">
                          {/* Botón corazón sobre la imagen */}
                          <button
                            onClick={() => toggleFavorite(p.id)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isFav ? '#f59e0b' : 'rgba(10,22,40,0.6)',
                              backdropFilter: 'blur(8px)',
                              transform: wasJustAdded ? 'scale(1.35)' : 'scale(1)',
                              boxShadow: isFav ? '0 4px 16px rgba(245,158,11,0.5)' : 'none'
                            }}
                            title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          >
                            <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-white text-white' : 'text-white'}`} />
                          </button>
 
                          <div className="h-60 overflow-hidden relative">
                            <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} referrerPolicy="no-referrer" />
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: 'rgba(10,22,40,0.72)', color: '#fbbf24', backdropFilter: 'blur(8px)' }}>
                              {p.category}
                            </div>
                          </div>
                          <div className="p-7">
                            <h4 className="text-lg font-bold mb-2" style={{ color: '#0a1628' }}>{p.name}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-2xl font-black" style={{ color: '#f59e0b' }}>{p.price}</span>
                              <button
                                onClick={() => toggleFavorite(p.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105"
                                style={{
                                  background: isFav ? 'rgba(245,158,11,0.15)' : '#0a1628',
                                  color: isFav ? '#b45309' : 'white',
                                  border: isFav ? '1px solid rgba(245,158,11,0.4)' : 'none'
                                }}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-600 text-amber-600' : ''}`} />
                                {isFav ? 'Guardado' : 'Guardar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Patient Showcase — Dog API */}
              <section id="pacientes" className="py-32 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                  <div className="order-2 lg:order-1">
                    <div className="bg-slate-100 rounded-[3rem] p-12 relative overflow-hidden h-[500px]">
                      <AnimatePresence mode="wait">
                        {loadingDog ? (
                          <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                            <RefreshCw className="w-10 h-10 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest">Sincronizando Base de Datos...</span>
                          </motion.div>
                        ) : (
                          <motion.div key={dogImage} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full relative group">
                            <img src={dogImage!} className="w-full h-full object-cover rounded-[2rem] border-8 border-white shadow-2xl" alt="Pet API" referrerPolicy="no-referrer" />
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl">
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Identificación Dinámica</p>
                              <p className="font-mono text-sm font-black text-slate-800">SPP-GEN-{Math.floor(Math.random() * 9000) + 1000}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <SectionHeader title="Registro Médico Global" subtitle="Nuestra interfaz se comunica con redes externas para validar identidades animales instantáneamente." badge="The Dog API Integration" />
                    <button onClick={fetchDog} disabled={loadingDog} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
                      <RefreshCw className={`w-4 h-4 ${loadingDog ? 'animate-spin' : ''}`} /> Sincronizar Registro
                    </button>
                  </div>
                </div>
              </section>
 
            </motion.div>
          )}
 
          {/* CLIENT PORTAL */}
          {activePortal === 'client' && (
            <motion.div key="client" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 py-12 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Portal de Clientes Pro</h1>
                    <p className="text-slate-500 font-medium italic">Acceso restringido: <span className="text-blue-600">SmartPaws-Cloud-ID</span></p>
                  </div>
                  <button onClick={() => setActivePortal('public')} className="bg-slate-200 p-3 rounded-2xl text-slate-600 hover:bg-slate-300 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                {!isLoggedIn ? (
                  <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8"><Lock className="w-8 h-8" /></div>
                    <h2 className="text-2xl font-black text-center mb-2">Autenticación</h2>
                    <p className="text-center text-slate-400 text-sm mb-10">Ingresa tus credenciales institucionales</p>
                    <div className="space-y-5">
                      <input type="text" placeholder="Usuario" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" value={loginForm.user} onChange={e => setLoginForm({ ...loginForm, user: e.target.value })} />
                      <input type="password" placeholder="Contraseña" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} />
                      <button onClick={() => handleLogin('client')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all mt-4">Iniciar Sesión</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-xl font-black flex items-center gap-2"><Heart className="text-red-500" /> Mis Mascotas</h3>
                          <button onClick={() => setIsAddPetOpen(true)} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"><PlusCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                          {pets.filter(p => p.ownerId === 'client1').map(pet => (
                            <div key={pet.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-black text-slate-800">{pet.name}</span>
                                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${pet.status.condition === 'Saludable' ? 'bg-emerald-100 text-emerald-600' : pet.status.condition === 'Recuperación' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                  {pet.status.condition}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">{pet.breed} · {pet.age}</p>
                              <p className="text-[9px] text-slate-400 font-bold">Último control: {pet.status.lastCheckup}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                          <h3 className="text-xl font-black flex items-center gap-2"><ClipboardList className="text-blue-600" /> Historial Médico Chrono</h3>
                          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
                            <input type="date" className="bg-transparent border-none outline-none text-[10px] font-bold" value={dateFilter.start} onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })} />
                            <span className="text-slate-300">|</span>
                            <input type="date" className="bg-transparent border-none outline-none text-[10px] font-bold" value={dateFilter.end} onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })} />
                            <button onClick={() => setDateFilter({ start: '', end: '' })} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                          {filteredHistory.map((item, idx) => {
                            const pet = pets.find(p => p.id === item.petId);
                            return (
                              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative pl-14">
                                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white z-10" />
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 hover:bg-white hover:shadow-xl transition-all">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-black tracking-tighter uppercase">{item.type}</span>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">{item.diagnosis}</h4>
                                    <p className="text-sm text-slate-500 mb-4 font-medium">{item.treatment}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase">
                                      <User className="w-3 h-3" /> {item.vet}
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col justify-end">
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">Paciente: {pet?.name}</span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
 /*********************************************fin de parte de aaron *********************************************************8 */
 /************************************inicio de parte de max******************************************************8 */
          {/* ADMIN / VET PORTAL */}
          {activePortal === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-900 py-12 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div className="text-white">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Professional Medical Console</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Acceso Médico Autorizado · Dr. Miguel Sanchez</p>
                  </div>
                  <button onClick={() => setActivePortal('public')} className="bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                {!isLoggedIn ? (
                  <div className="max-w-md mx-auto bg-slate-800 p-10 rounded-[3rem] border border-slate-700 shadow-2xl mt-20">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8"><ShieldCheck className="w-8 h-8" /></div>
                    <h2 className="text-white text-2xl font-black text-center mb-8">Login Veterinario</h2>
                    <div className="space-y-5">
                      <input type="text" placeholder="ID Empleado" className="w-full bg-slate-700 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={loginForm.user} onChange={e => setLoginForm({ ...loginForm, user: e.target.value })} />
                      <input type="password" placeholder="Key Pro" className="w-full bg-slate-700 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} />
                      <button onClick={() => handleLogin('admin')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Desbloquear Panel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-4 gap-8">
                    {[{ l: "Pacientes Hoy", v: "24", i: <Activity /> }, { l: "Cirugías", v: "03", i: <Zap /> }, { l: "Ingresos", v: "$2,450", i: <BarChart3 /> }, { l: "Emergencias", v: "01", i: <AlertCircle /> }].map((s, i) => (
                      <div key={i} className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-xl hover:border-blue-600/50 transition-all">
                        <div className="text-blue-500 mb-4">{s.i}</div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">{s.l}</p>
                        <p className="text-3xl font-black text-white italic">{s.v}</p>
                      </div>
                    ))}
                    <div className="lg:col-span-4 bg-slate-800 p-10 rounded-[3.5rem] border border-slate-700">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black text-white italic">Base de Datos de Pacientes</h3>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input type="text" placeholder="Filtrar por nombre o ID..." className="bg-slate-700 border-none rounded-full pl-12 pr-6 py-2.5 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-700">
                              <th className="pb-6 pl-4">ID Paciente</th>
                              <th className="pb-6">Nombre / Especie</th>
                              <th className="pb-6">Dueño</th>
                              <th className="pb-6">Estado Clínico</th>
                              <th className="pb-6">Última Visita</th>
                              <th className="pb-6 text-right pr-4">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pets.map(pet => (
                              <tr key={pet.id} className="text-slate-300 border-b border-slate-700/50 hover:bg-slate-700/30 transition-all">
                                <td className="py-6 pl-4 font-mono text-xs text-blue-400 font-bold">#SPP-{pet.id.toUpperCase()}</td>
                                <td className="py-6">
                                  <div className="flex flex-col">
                                    <span className="text-white font-black">{pet.name}</span>
                                    <span className="text-[10px] text-slate-500 uppercase">{pet.species} · {pet.breed}</span>
                                  </div>
                                </td>
                                <td className="py-6 text-sm font-bold">{pet.ownerId}</td>
                                <td className="py-6">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${pet.status.condition === 'Saludable' ? 'bg-emerald-500/20 text-emerald-400' : pet.status.condition === 'Recuperación' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {pet.status.condition}
                                  </span>
                                </td>
                                <td className="py-6 text-sm font-bold text-slate-500">{pet.status.lastCheckup}</td>
                                <td className="py-6 text-right pr-4">
                                  <button className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">Ficha Completa</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
 
        </AnimatePresence>
      </main>
 
      {/* Footer */}
      <footer className="bg-slate-900 py-20 px-12 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-black uppercase italic tracking-tighter">Smart Paws <span className="text-blue-500">Pro</span></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tecnologías Web I · Universidad Católica Boliviana</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Soporte</a>
            <a href="#" className="hover:text-blue-500 transition-colors">© 2024 VET-ALGORITHM</a>
          </div>
        </div>
      </footer>
 /****************************fin de parte de max *********************************************************/
 /*****************************************incicio de parte de adri********************************************** */
      {/* ── Modal: Lista de Deseos ── */}
      <AnimatePresence>
        {isFavoritesOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFavoritesOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-8 pb-0 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Heart className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900">Lista de Deseos</h2>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    {favorites.length === 0 ? 'Aún no guardaste ningún producto' : `${favorites.length} producto${favorites.length > 1 ? 's' : ''} guardado${favorites.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <button onClick={() => setIsFavoritesOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors p-1 mt-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
 
              <div className="p-8">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <Heart className="w-7 h-7 text-amber-400" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm mb-1">Tu lista de deseos está vacía</p>
                    <p className="text-slate-400 text-xs mb-6">Presiona el corazón en cualquier producto para guardarlo aquí</p>
                    <button onClick={() => { setIsFavoritesOpen(false); scrollToSection('tienda'); }} className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105" style={{ background: '#0a1628' }}>
                      Ver Tienda
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {favoriteProducts.map(p => (
                        <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                          <img src={p.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={p.name} referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-0.5">{p.category}</div>
                            <h4 className="font-black text-slate-900 text-sm truncate">{p.name}</h4>
                            <span className="text-lg font-black" style={{ color: '#f59e0b' }}>{p.price}</span>
                          </div>
                          <button onClick={() => toggleFavorite(p.id)} className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0" title="Quitar">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
 
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total estimado</span>
                        <span className="text-2xl font-black" style={{ color: '#0a1628' }}>${favoritesTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setFavorites([])} className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:border-red-200 hover:text-red-400 transition-all">
                          Limpiar lista
                        </button>
                        <button className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
                          Consultar disponibilidad
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* ── Modal: Agendar Cita ── */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBookingOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12">
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsBookingOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X /></button>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2 italic">Agendar Cita Pro</h2>
              <p className="text-slate-500 mb-10 font-medium">Nuestro sistema de triaje asignará el mejor especialista disponible.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Información Mascota</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" />
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold">
                      <option>Canino</option><option>Felino</option><option>Otro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Preferencia Temporal</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" />
                    <input type="time" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" />
                  </div>
                </div>
                <button type="button" onClick={() => setIsBookingOpen(false)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all mt-4">
                  Confirmar Registro Médico
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* ── Modal: Agregar Mascota ── */}
      <AnimatePresence>
        {isAddPetOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddPetOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[3rem] p-10">
              <h2 className="text-2xl font-black mb-8 italic">Nuevo Registro de Paciente</h2>
              <form onSubmit={addPet} className="space-y-4">
                <input name="name" required placeholder="Nombre Mascota" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none font-bold" />
                <input name="species" required placeholder="Especie (Canino, Felino...)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none font-bold" />
                <input name="breed" required placeholder="Raza" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none font-bold" />
                <input name="age" required placeholder="Edad" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none font-bold" />
                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all mt-4">
                  Finalizar Registro
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[100] bg-white p-8 flex flex-col gap-8 md:hidden">
            <div className="flex justify-between items-center">
              <span className="font-black italic text-xl uppercase tracking-tighter">Menu <span className="text-blue-600">SmartPaws</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-black tracking-tighter text-slate-900 border-t pt-8 overflow-y-auto">
              {['Inicio', 'Servicios', 'Tienda', 'Pacientes'].map(s => (
                <button key={s} onClick={() => scrollToSection(s.toLowerCase())} className="text-left hover:text-blue-600 transition-colors">{s}</button>
              ))}
              <button onClick={() => { setIsFavoritesOpen(true); setIsMobileMenuOpen(false); }} className="text-left text-amber-600 flex items-center gap-2">
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-amber-500' : ''}`} />
                Lista de Deseos {favorites.length > 0 && `(${favorites.length})`}
              </button>
              <div className="h-px bg-slate-100 my-2" />
              <button onClick={() => { setActivePortal('client'); setIsMobileMenuOpen(false); }} className="text-left text-blue-600 flex items-center gap-2">
                <Lock className="w-5 h-5" /> Portal Cliente
              </button>
              <button onClick={() => { setActivePortal('admin'); setIsMobileMenuOpen(false); }} className="text-left flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Profesional Vet
              </button>
            </div>
            <div className="mt-auto">
              <button onClick={() => { setIsBookingOpen(true); setIsMobileMenuOpen(false); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
                Agendar Cita PRO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
    </div>
  );
}
/*******************************************finde parte de adri ************************************************8 */
