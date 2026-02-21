'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Plus,
  Search,
  MapPin,
  ExternalLink,
  Trash2,
  Edit,
  Store,
  Heart,
  Utensils,
  Shirt,
  Laptop,
  LogOut,
  Sparkles,
  X,
  Settings,
  User,
  Shield,
  Upload,
  Camera,
  Briefcase,
  Building,
  Star,
  ShoppingCart,
  Car,
  Wrench,
  BookOpen,
  Music,
  Gamepad2,
  Palette,
  Dumbbell,
  Flower2,
  Gift,
  Coffee,
  Scissors,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Utensils, Shirt, Laptop, Briefcase, Building, Star, ShoppingCart,
  Car, Wrench, BookOpen, Music, Gamepad2, Palette, Dumbbell, Flower2,
  Gift, Coffee, Scissors, Store,
};

interface Rubro { id: string; nombre: string; icono: string; color: string; activo: boolean; }
interface Emprendimiento {
  id: string; nombre: string; urlRedSocial: string | null; imagen: string | null;
  ubicacion: string; rubroId: string; rubro: Rubro; createdAt: string; updatedAt: string;
}

function ImageUploader({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Máximo 5MB'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => { const b = ev.target?.result as string; setPreview(b); onChange(b); };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Imagen</Label>
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => ref.current?.click()}><Camera className="w-4 h-4 mr-2" />Cambiar</Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => { setPreview(null); onChange(null); }}><X className="w-4 h-4 mr-2" />Quitar</Button>
          </div>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()} className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
          <Upload className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">Click para subir imagen</p>
        </div>
      )}
    </div>
  );
}

function LoginDialog({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
      const data = await res.json();
      if (data.success) { login(data.role); onSuccess(); }
      else setError('Clave incorrecta');
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };
  
  return (
    <DialogContent>
      <DialogHeader><DialogTitle className="flex items-center gap-2"><Lock className="w-5 h-5" />Acceso</DialogTitle><DialogDescription>Ingrese su clave</DialogDescription></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2"><Label>Clave</Label><Input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoFocus /></div>
        {error && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{error}</p>}
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="submit" disabled={loading || !key} className="bg-gradient-to-r from-emerald-500 to-teal-500">{loading ? 'Verificando...' : 'Ingresar'}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function EmprendimientoForm({ emprendimiento, rubros, onSuccess, onClose }: { emprendimiento?: Emprendimiento | null; rubros: Rubro[]; onSuccess: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({ nombre: emprendimiento?.nombre || '', urlRedSocial: emprendimiento?.urlRedSocial || '', imagen: emprendimiento?.imagen || null, ubicacion: emprendimiento?.ubicacion || '', rubroId: emprendimiento?.rubroId || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = emprendimiento ? `/api/emprendimientos/${emprendimiento.id}` : '/api/emprendimientos';
      const res = await fetch(url, { method: emprendimiento ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { onSuccess(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Error'); }
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Nombre *</Label><Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required /></div>
      <div className="space-y-2"><Label>Ubicación *</Label><Input value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} required /></div>
      <div className="space-y-2"><Label>Rubro *</Label>
        <Select value={formData.rubroId} onValueChange={(v) => setFormData({ ...formData, rubroId: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seleccione" /></SelectTrigger>
          <SelectContent>{rubros.map((r) => { const I = ICON_MAP[r.icono] || Store; return (<SelectItem key={r.id} value={r.id}><div className="flex items-center gap-2"><I className="w-4 h-4" />{r.nombre}</div></SelectItem>); })}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>URL Red Social</Label><Input type="url" value={formData.urlRedSocial || ''} onChange={(e) => setFormData({ ...formData, urlRedSocial: e.target.value })} /></div>
      <ImageUploader value={formData.imagen} onChange={(v) => setFormData({ ...formData, imagen: v })} />
      {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="submit" disabled={loading || !formData.nombre || !formData.ubicacion || !formData.rubroId} className="bg-gradient-to-r from-emerald-500 to-teal-500">{loading ? 'Guardando...' : emprendimiento ? 'Actualizar' : 'Crear'}</Button></DialogFooter>
    </form>
  );
}

function RubroForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [formData, setFormData] = useState({ nombre: '', icono: 'Store', color: 'bg-slate-100 text-slate-700 border-slate-200' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const COLORS = [
    { value: 'bg-pink-100 text-pink-700 border-pink-200', label: 'Rosa' },
    { value: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Naranja' },
    { value: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Violeta' },
    { value: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Cyan' },
    { value: 'bg-green-100 text-green-700 border-green-200', label: 'Verde' },
    { value: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Amarillo' },
    { value: 'bg-red-100 text-red-700 border-red-200', label: 'Rojo' },
    { value: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Azul' },
    { value: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Gris' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rubros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { onSuccess(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Error'); }
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Nombre *</Label><Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required /></div>
      <div className="space-y-2"><Label>Ícono *</Label>
        <Select value={formData.icono} onValueChange={(v) => setFormData({ ...formData, icono: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seleccione" /></SelectTrigger>
          <SelectContent>{Object.entries(ICON_MAP).map(([n, I]) => (<SelectItem key={n} value={n}><div className="flex items-center gap-2"><I className="w-4 h-4" />{n}</div></SelectItem>))}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Color *</Label>
        <Select value={formData.color} onValueChange={(v) => setFormData({ ...formData, color: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seleccione" /></SelectTrigger>
          <SelectContent>{COLORS.map((c) => (<SelectItem key={c.value} value={c.value}><div className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${c.value.split(' ')[0]}`} />{c.label}</div></SelectItem>))}</SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="submit" disabled={loading || !formData.nombre} className="bg-gradient-to-r from-emerald-500 to-teal-500">{loading ? 'Guardando...' : 'Crear'}</Button></DialogFooter>
    </form>
  );
}

function EmprendimientoCard({ emprendimiento, onUpdate, onDelete, isAdmin }: { emprendimiento: Emprendimiento; onUpdate: () => void; onDelete: () => void; isAdmin: boolean }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const Icon = ICON_MAP[emprendimiento.rubro.icono] || Store;
  
  const handleDelete = async () => {
    try { await fetch(`/api/emprendimientos/${emprendimiento.id}`, { method: 'DELETE' }); onDelete(); } catch {}
    setShowDelete(false);
  };
  
  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-sm">
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          {emprendimiento.imagen ? <img src={emprendimiento.imagen} alt={emprendimiento.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-16 h-16 text-slate-300" /></div>}
          <div className="absolute top-3 left-3"><Badge className={`${emprendimiento.rubro.color} border font-medium`}><Icon className="w-3 h-3 mr-1" />{emprendimiento.rubro.nombre}</Badge></div>
          {isAdmin && (
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => setShowEdit(true)}><Edit className="w-4 h-4" /></Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-600" onClick={() => setShowDelete(true)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-1">{emprendimiento.nombre}</h3>
          <div className="flex items-center text-slate-500 text-sm mb-2"><MapPin className="w-4 h-4 mr-1 flex-shrink-0" /><span className="line-clamp-1">{emprendimiento.ubicacion}</span></div>
          {emprendimiento.urlRedSocial && <a href={emprendimiento.urlRedSocial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"><ExternalLink className="w-4 h-4 mr-1" />Ver red social</a>}
        </CardContent>
      </Card>
      <Dialog open={showEdit} onOpenChange={setShowEdit}><DialogContent><DialogHeader><DialogTitle>Editar</DialogTitle><DialogDescription>Modifique los datos</DialogDescription></DialogHeader><EmprendimientoForm emprendimiento={emprendimiento} rubros={[]} onSuccess={onUpdate} onClose={() => setShowEdit(false)} /></DialogContent></Dialog>
      <Dialog open={showDelete} onOpenChange={setShowDelete}><DialogContent><DialogHeader><DialogTitle>Confirmar</DialogTitle><DialogDescription>¿Eliminar &quot;{emprendimiento.nombre}&quot;?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setShowDelete(false)}>Cancelar</Button><Button variant="destructive" onClick={handleDelete}>Eliminar</Button></DialogFooter></DialogContent></Dialog>
    </>
  );
}

function Dashboard() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rubroFilter, setRubroFilter] = useState('todos');
  const [showAdd, setShowAdd] = useState(false);
  const [showLoginUser, setShowLoginUser] = useState(false);
  const [showLoginAdmin, setShowLoginAdmin] = useState(false);
  const [showAddRubro, setShowAddRubro] = useState(false);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = role === 'admin';
  const isUser = role === 'user';
  
  const fetchData = useCallback(async () => {
    try {
      const rubrosRes = await fetch('/api/rubros');
      setRubros(await rubrosRes.json());
      const params = new URLSearchParams();
      if (rubroFilter !== 'todos') params.append('rubro', rubroFilter);
      if (searchQuery) params.append('search', searchQuery);
      const empRes = await fetch(`/api/emprendimientos?${params.toString()}`);
      setEmprendimientos(await empRes.json());
    } catch {}
    finally { setLoading(false); }
  }, [rubroFilter, searchQuery]);
  
  useEffect(() => { fetchData(); }, [fetchData]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md"><Sparkles className="w-5 h-5 text-white" /></div>
              <div><h1 className="text-xl font-bold text-slate-800">Emprendimientos</h1><p className="text-sm text-slate-500">Directorio de negocios</p></div>
            </div>
            <div className="flex items-center gap-2">
              {(isUser || isAdmin) && (
                <>
                  <Button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500"><Plus className="w-4 h-4 mr-2" />Agregar</Button>
                  {isAdmin && <Button variant="outline" onClick={() => setShowAddRubro(true)} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"><Settings className="w-4 h-4 mr-2" />Rubros</Button>}
                  <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500 hover:text-slate-700"><LogOut className="w-4 h-4 mr-2" />Salir</Button>
                </>
              )}
              {!isUser && !isAdmin && (
                <>
                  <Dialog open={showLoginUser} onOpenChange={setShowLoginUser}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                        <User className="w-4 h-4 mr-2" />Usuario
                      </Button>
                    </DialogTrigger>
                    <LoginDialog onSuccess={() => setShowLoginUser(false)} />
                  </Dialog>
                  <Dialog open={showLoginAdmin} onOpenChange={setShowLoginAdmin}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50">
                        <Shield className="w-4 h-4 mr-2" />Admin
                      </Button>
                    </DialogTrigger>
                    <LoginDialog onSuccess={() => setShowLoginAdmin(false)} />
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 bg-white border-slate-200" />
            {searchQuery && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSearchQuery('')}><X className="w-4 h-4" /></Button>}
          </div>
          <Select value={rubroFilter} onValueChange={setRubroFilter}>
            <SelectTrigger className="w-full sm:w-48 h-11 bg-white border-slate-200"><SelectValue placeholder="Filtrar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {rubros.map((r) => { const I = ICON_MAP[r.icono] || Store; return (<SelectItem key={r.id} value={r.id}><div className="flex items-center gap-2"><I className="w-4 h-4" />{r.nombre}</div></SelectItem>); })}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{[1, 2, 3, 4].map((i) => (<div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />))}</div>
        ) : emprendimientos.length === 0 ? (
          <div className="text-center py-16"><div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center"><Store className="w-10 h-10 text-slate-300" /></div><h3 className="text-lg font-medium text-slate-600 mb-2">No hay emprendimientos</h3><p className="text-slate-500">Aún no hay registros</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{emprendimientos.map((emp) => (<EmprendimientoCard key={emp.id} emprendimiento={emp} onUpdate={fetchData} onDelete={fetchData} isAdmin={isAdmin} />))}</div>
        )}
      </div>
      <footer className="mt-auto bg-white border-t py-4">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-slate-500">
          <span>Total: {emprendimientos.length}</span>
          <div className="flex items-center gap-2">
            {isAdmin && <Badge className="bg-emerald-100 text-emerald-700"><Shield className="w-3 h-3 mr-1" />Administrador</Badge>}
            {isUser && <Badge className="bg-blue-100 text-blue-700"><User className="w-3 h-3 mr-1" />Usuario</Badge>}
          </div>
        </div>
      </footer>
      <Dialog open={showAdd} onOpenChange={setShowAdd}><DialogContent><DialogHeader><DialogTitle>Nuevo Emprendimiento</DialogTitle></DialogHeader><EmprendimientoForm rubros={rubros} onSuccess={fetchData} onClose={() => setShowAdd(false)} /></DialogContent></Dialog>
      <Dialog open={showAddRubro} onOpenChange={setShowAddRubro}><DialogContent><DialogHeader><DialogTitle>Nuevo Rubro</DialogTitle></DialogHeader><RubroForm onSuccess={fetchData} onClose={() => setShowAddRubro(false)} /></DialogContent></Dialog>
    </div>
  );
}

export default function Home() {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  if (!hydrated) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  return <Dashboard />;
}
