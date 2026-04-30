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

/************************************************************PARTE DE Max************************************************/

         {/* ADMIN / VET PORTAL VIEW */}
          {activePortal === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-900 py-12 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div className="text-white">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Professional Medical Console</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Acceso Médico Autorizado • Dr. Miguel Sanchez</p>
                  </div>
                  <button onClick={() => setActivePortal('public')} className="bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>

                {!isLoggedIn ? (
                  <div className="max-w-md mx-auto bg-slate-800 p-10 rounded-[3rem] border border-slate-700 shadow-2xl mt-20">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8"><ShieldCheck className="w-8 h-8" /></div>
                    <h2 className="text-white text-2xl font-black text-center mb-8">Login Veterinario</h2>
                    <div className="space-y-5">
                      <input type="text" placeholder="ID Empleado" className="w-full bg-slate-700 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user:e.target.value})} />
                      <input type="password" placeholder="Key Pro" className="w-full bg-slate-700 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass:e.target.value})} />
                      <button onClick={() => handleLogin('admin')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Desbloquear Panel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-4 gap-8">
                    {/* Stats */}
                    {[{l:"Pacientes Hoy",v:"24",i:<Activity/>},{l:"Cirugías",v:"03",i:<Zap/>},{l:"Ingresos",v:"$2,450",i:<BarChart3/>},{l:"Emergencias",v:"01",i:<AlertCircle/>}].map((s,i)=>(
                      <div key={i} className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-xl group hover:border-blue-600/50 transition-all">
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
                                    <span className="text-[10px] text-slate-500 uppercase">{pet.species} • {pet.breed}</span>
                                  </div>
                                </td>
                                <td className="py-6 text-sm font-bold">{pet.ownerId}</td>
                                <td className="py-6">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                    pet.status.condition === 'Saludable' ? 'bg-emerald-500/20 text-emerald-400' :
                                    pet.status.condition === 'Recuperación' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                  }`}>
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

      {/* Footer (Simplified) */}
      <footer className="bg-slate-900 py-20 px-12 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-black uppercase italic tracking-tighter">Smart Paws <span className="text-blue-500">Pro</span></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tecnologías Web I • Universidad Católica Boliviana</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-blue-500">Privacidad</a>
            <a href="#" className="hover:text-blue-500">Soporte</a>
            <a href="#" className="hover:text-blue-500">© 2024 VET-ALGORITHM</a>
          </div>
        </div>
      </footer>

      {/* Modals --- */}
      
      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBookingOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsBookingOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X /></button>
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2 italic">Agendar Cita Pro</h2>
              <p className="text-slate-500 mb-10 font-medium">Nuestro sistema de triaje asignará el mejor especialista disponible.</p>
              <form className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Información Mascota</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold" />
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold">
                      <option>Canino</option>
                      <option>Felino</option>
                      <option>Otro</option>
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
                <button type="button" onClick={() => setIsBookingOpen(false)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest text-xs hover:bg-blue-700 transition-all mt-4">Confirmar Registro Médico</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
/************************************************************FIN DE PARTE DE Max************************************************/

/************************************************************PARTE DE adry************************************************/

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
                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all mt-4">Finalizar Registro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="h-px bg-slate-100 my-4" />
              <button onClick={() => { setActivePortal('client'); setIsMobileMenuOpen(false); }} className="text-left text-blue-600">Portal Cliente</button>
              <button onClick={() => { setActivePortal('admin'); setIsMobileMenuOpen(false); }} className="text-left">Profesional L-1</button>
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
