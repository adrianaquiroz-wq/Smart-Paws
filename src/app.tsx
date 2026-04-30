/****************************************************PARTE POR MIGUEL******************************************/
import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Activity, 
  Zap, 
  Phone, 
  ChevronRight,
  RefreshCw,
  Clock,
  Heart,
  Menu,
  X,
  User,
  ShieldCheck,
  ShoppingBag,
  ClipboardList,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Calendar,
  Lock,
  LogOut,
  MapPin,
  Pill,
  Syringe,
  FileText
} from 'lucide-react';

// --- Types ---
interface DogApiResponse {
  message: string;
  status: string;
}

interface PetStatus {
  condition: 'Saludable' | 'En Tratamiento' | 'Recuperación' | 'Crítico';
  lastCheckup: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  status: PetStatus;
  ownerId: string;
}

interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  vet: string;
  type: 'Consulta' | 'Cirugía' | 'Vacunación' | 'Laboratorio';
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: 1, name: "Plan Nutricional Pro-Active", price: "$45.00", category: "Nutrición", image: "https://images.unsplash.com/photo-1589924691106-073b19f5538d?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Smart Health Tracker v2", price: "$120.00", category: "Tecnología", image: "https://images.unsplash.com/photo-1615367677402-2a7442ebccf7?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Medical Kit Emergencias", price: "$89.99", category: "Salud", image: "https://images.unsplash.com/photo-1628160539584-9345236b2b5f?auto=format&fit=crop&w=600&q=80" }
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

// --- Sub-Components ---

const SectionHeader = ({ title, subtitle, badge }: { title: string, subtitle: string, badge?: string }) => (
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
  
  // Data State
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [history, setHistory] = useState<MedicalRecord[]>(INITIAL_HISTORY);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });

  // Dog API State
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [loadingDog, setLoadingDog] = useState(true);

  const fetchDog = useCallback(async () => {
    try {
      setLoadingDog(true);
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data: DogApiResponse = await res.json();
      if (data.status === 'success') setDogImage(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDog(false);
    }
  }, []);

  useEffect(() => {
    fetchDog();
  }, [fetchDog]);

  const scrollToSection = (id: string) => {
    setActivePortal('public');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = (type: 'client' | 'admin') => {

/****************************************************PARTE POR MIGUEL******************************************/

/****************************************************PARTE POR AARON******************************************/
              {/* Patient Showcase (TheDogAPI) */}
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

          {/* CLIENT PORTAL VIEW */}
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
                      <input type="text" placeholder="Usuario" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user:e.target.value})} />
                      <input type="password" placeholder="Contraseña" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass:e.target.value})} />
                      <button onClick={() => handleLogin('client')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all mt-4">Iniciar Sesión</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Pets Management */}
                    <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-xl font-black flex items-center gap-2"><Heart className="text-red-500" /> Mis Mascotas</h3>
                          <button onClick={() => setIsAddPetOpen(true)} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"><PlusCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                          {pets.filter(p => p.ownerId === 'client1').map(pet => (
                            <div key={pet.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-black text-slate-800">{pet.name}</span>
                                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                                  pet.status.condition === 'Saludable' ? 'bg-emerald-100 text-emerald-600' :
                                  pet.status.condition === 'Recuperación' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                }`}>
                                  {pet.status.condition}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">{pet.breed} • {pet.age}</p>
                              <p className="text-[9px] text-slate-400 font-bold">Último control: {pet.status.lastCheckup}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: History & Filters */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                          <h3 className="text-xl font-black flex items-center gap-2"><ClipboardList className="text-blue-600" /> Historial Médico Chrono</h3>
                          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
                            <input type="date" className="bg-transparent border-none outline-none text-[10px] font-bold" value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} />
                            <span className="text-slate-300">|</span>
                            <input type="date" className="bg-transparent border-none outline-none text-[10px] font-bold" value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} />
                            <button onClick={() => setDateFilter({start:'', end:''})} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                          {filteredHistory.map((item, idx) => {
                            const pet = pets.find(p => p.id === item.petId);
                            return (
                              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative pl-14">
                                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white z-10" />
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 group hover:bg-white hover:shadow-xl transition-all">
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
/************************************************************FIN DE PARTE DE AARON************************************************/
