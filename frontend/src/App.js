import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from 'recharts';

// --- 1. KAMUS BAHASA ---
const translations = {
  id: {
    entry: "Masuk →",
    create_acc: "Buat Akun Sekarang",
    back_login: "← Kembali ke Login",
    new_user: "Pengguna Baru? Daftar Di Sini",
    total_res: "TOTAL SUMBER DAYA",
    op_stock: "STOK OPERASIONAL",
    crit_limit: "BATAS KRITIS",
    analytics: "Analitik Visual Inventaris",
    search: "Cari unit operasional...",
    add_btn: "Tambah +",
    export_btn: "Ekspor Laporan",
    col_res: "Unit / SKU",
    col_level: "Level",
    col_status: "Status",
    col_ctrl: "Kontrol",
    live_feed: "Log Aktivitas",
    strat_notes: "Catatan Strategis",
    new_note: "Baru +",
    no_notes: "Belum ada catatan",
    operator: "Operator",
    logout: "Keluar",
    reg_subtitle: "Selamat Datang",
    login_subtitle: "Selamat Datang Kembali"
  },
  en: {
    entry: "Entry →",
    create_acc: "Create Account Now",
    back_login: "← Back to Login",
    new_user: "New User? Register Here",
    total_res: "TOTAL RESOURCES",
    op_stock: "OPERATIONAL STOCK",
    crit_limit: "CRITICAL LIMIT",
    analytics: "Visual Inventory Analytics",
    search: "Search units...",
    add_btn: "Add +",
    export_btn: "Export Report",
    col_res: "Resource / SKU",
    col_level: "Level",
    col_status: "Status",
    col_ctrl: "Controls",
    live_feed: "Live Feed",
    strat_notes: "Strategic Notes",
    new_note: "New +",
    no_notes: "No Strategic Notes Available",
    operator: "Operator",
    logout: "Sign Out",
    reg_subtitle: "Welcome",
    login_subtitle: "Welcome Back"
  }
};

// --- 2. LOGIN SCREEN ---
const LoginScreen = ({ onLogin, theme, toggleTheme, lang, toggleLang, isRegister, setIsRegister, showPassword, setShowPassword }) => {
  const t = translations[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (isRegister) {
      fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, brand_name: data.brand_name })
      }).then(res => res.json()).then(resData => {
        alert(resData.message);
        if (resData.message.includes("berhasil")) setIsRegister(false);
      }).catch(() => alert("Server Offline!"));
    } else {
      onLogin(data.email, data.password);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Prefs Buttons */}
      <div className="absolute top-8 right-8 flex gap-3">
        <button onClick={toggleLang} className={`w-14 h-12 border rounded-xl flex items-center justify-center font-black text-[11px] transition-all shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          {lang === 'id' ? 'IDN' : 'ENG'}
        </button>
        <button onClick={toggleTheme} className={`w-14 h-12 border rounded-xl flex items-center justify-center transition-all text-xl shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>
          {theme === 'dark' ? '☀️' : '🌛'}
        </button>
      </div>

      <div className={`w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl text-center transition-colors duration-500 ${theme === 'dark' ? 'bg-[#161920] border border-white/5' : 'bg-white border border-slate-200'}`}>
        {/* LOGO PERMANEN */}
        <div className="flex justify-center items-baseline mb-4 overflow-visible py-4 font-brand">
          <h1 className="text-[60px] leading-none logo-corporate">AssetOps</h1>
          <span className="text-[60px] text-blue-500 ml-1">.</span>
        </div>
        
        {/* SUBTITLE DINAMIS (Selamat Datang Kembali / Selamat Datang) */}
        <p className="text-[11px] tracking-[0.3em] uppercase mb-12 font-black text-slate-500 font-inter">
          {isRegister ? t.reg_subtitle : t.login_subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          <input name="email" type="email" placeholder="Email Address" className={`w-full p-4 rounded-xl outline-none text-sm font-medium border focus:border-blue-500 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className={`w-full p-4 rounded-xl outline-none text-sm font-medium border focus:border-blue-500 transition-all pr-20 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">{showPassword ? "HIDE" : "SHOW"}</button>
          </div>
          {isRegister && <input name="brand_name" type="text" placeholder="BRAND NAME" className={`w-full p-4 rounded-xl outline-none text-sm font-medium border focus:border-blue-500 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`} required />}
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs mt-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            {isRegister ? t.create_acc : t.entry}
          </button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="mt-8 text-[10px] uppercase tracking-widest font-black text-slate-500 hover:text-blue-500 transition-all font-inter">
          {isRegister ? t.back_login : t.new_user}
        </button>
      </div>
    </div>
  );
};

// --- 3. HEADER ---
const Header = ({ user, onLogout, theme, toggleTheme, lang, toggleLang }) => {
  const t = translations[lang];
  const operatorName = user?.email ? user.email.split('@')[0] : "ADMIN";

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 animate-fade-in-up w-full font-inter">
      <div className="text-center md:text-left flex flex-col items-center md:items-start">
        <div className="flex items-baseline overflow-visible py-2 font-brand">
          <h1 className="text-[45px] md:text-[50px] leading-none logo-corporate">AssetOps</h1>
          <span className="text-[45px] md:text-[50px] text-blue-500 ml-1">.</span>
        </div>
        <div className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-full border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">{t.operator}: {operatorName}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 h-14">
        <button onClick={toggleLang} className={`w-14 h-12 border rounded-xl flex items-center justify-center transition-all text-[11px] font-black shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>{lang === 'id' ? 'IDN' : 'ENG'}</button>
        <button onClick={toggleTheme} className={`w-14 h-12 border rounded-xl flex items-center justify-center transition-all text-xl shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>{theme === 'dark' ? '☀️' : '🌛'}</button>
        <button onClick={onLogout} className="px-6 h-12 border rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">{t.logout}</button>
      </div>
    </div>
  );
};

// --- 4. MAIN APP ---
function App() {
  const [theme, setTheme] = useState('dark'); 
  const [lang, setLang] = useState('id');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[lang];
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(lang === 'id' ? 'en' : 'id');

  const fetchData = () => {
    fetch('http://localhost:5000/api/products').then(res => res.json()).then(data => setProducts(Array.isArray(data) ? data : [])).catch(() => setProducts([]));
    fetch('http://localhost:5000/api/transactions').then(res => res.json()).then(data => setTransactions(Array.isArray(data) ? data : [])).catch(() => setTransactions([]));
    if(user) fetch(`http://localhost:5000/api/notes/${user.email}`).then(res => res.json()).then(data => setNotes(Array.isArray(data) ? data : [])).catch(() => setNotes([]));
  };

  useEffect(() => { if (isLoggedIn) fetchData(); }, [isLoggedIn, user]);

  const handleLogin = (email, password) => {
    fetch('http://localhost:5000/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    .then(res => res.json()).then(data => { if (data.success) { setUser(data.user); setIsLoggedIn(true); } else alert(data.message); });
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(products), "STOCK");
    XLSX.writeFile(wb, `AssetOps_Inventory.xlsx`);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `http://localhost:5000/api/products/${editItem.id}` : 'http://localhost:5000/api/products';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, category_id: 1, current_stock: Number(data.current_stock || 0), min_threshold: Number(data.min_threshold) }) }).then(() => { setShowModal(false); setEditItem(null); fetchData(); });
  };

  const updateStock = (item, type) => {
    const new_stock = type === 'IN' ? item.current_stock + 1 : item.current_stock - 1;
    if (new_stock < 0) return;
    fetch(`http://localhost:5000/api/products/${item.id}/stock`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ new_stock, operator_name: user.email, action_type: type, diff: 1 }) }).then(() => fetchData());
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    fetch('http://localhost:5000/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, operator_name: user.email }) }).then(() => { setShowNoteModal(false); fetchData(); });
  };

  useEffect(() => { document.body.className = theme === 'dark' ? 'bg-[#0f1115]' : 'bg-slate-50'; }, [theme]);

  if (!isLoggedIn) return (
    <LoginScreen 
      onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang}
      isRegister={isRegister} setIsRegister={setIsRegister} showPassword={showPassword} setShowPassword={setShowPassword}
    />
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 md:p-10 font-inter ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
      <div className="max-w-7xl mx-auto">
        <Header user={user} onLogout={() => setIsLoggedIn(false)} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up font-inter">
          <div className={`border p-8 rounded-3xl ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className="text-[10px] uppercase tracking-widest mb-2 font-black text-slate-500">{t.total_res}</p>
            <h3 className="text-4xl font-extrabold italic tracking-tighter">{products.length}</h3>
          </div>
          <div className={`border p-8 rounded-3xl ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className="text-[10px] uppercase tracking-widest mb-2 font-black text-slate-500">{t.op_stock}</p>
            <h3 className="text-4xl font-extrabold italic tracking-tighter text-blue-500">{products.reduce((acc, i) => acc + i.current_stock, 0)}</h3>
          </div>
          <div className={`border p-8 rounded-3xl ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className="text-[10px] uppercase tracking-widest mb-2 font-black text-slate-500">{t.crit_limit}</p>
            <h3 className={`text-4xl font-extrabold italic tracking-tighter ${products.filter(i => i.current_stock <= i.min_threshold).length > 0 ? 'text-red-500' : 'text-slate-400'}`}>{products.filter(i => i.current_stock <= i.min_threshold).length}</h3>
          </div>
        </div>

        {/* ANALYTICS GRAPH */}
        {products.length > 0 && (
          <div className={`border p-8 rounded-3xl mb-10 shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>
            <h2 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-500">{t.analytics}</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={products} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#ffffff05' : '#00000005'} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  {/* FIX TOOLTIP TEXT COLOR (image_876e7e) */}
                  <Tooltip 
                    cursor={{ fill: theme === 'dark' ? '#ffffff05' : '#00000005' }} 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#111114' : '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: theme === 'dark' ? '#ffffff' : '#1e293b', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb', fontWeight: '900', marginBottom: '4px' }}
                  />
                  <Bar dataKey="current_stock" barSize={32} radius={[4, 4, 4, 4]}>
                    <LabelList dataKey="current_stock" position="top" fill="#64748b" fontSize={11} fontWeight="bold" offset={10} />
                    {products.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.current_stock <= entry.min_threshold ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder={t.search} className={`flex-1 p-4 rounded-xl border outline-none font-medium focus:border-blue-500 transition-all ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => { setEditItem(null); setShowModal(true); }} className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg">{t.add_btn}</button>
            <button onClick={exportToExcel} className={`border font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-600'}`}>{t.export_btn}</button>
          </div>
        </div>

        {/* TABLE */}
        <div className={`rounded-3xl border overflow-x-auto mb-12 shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-left min-w-[600px] font-inter">
            <thead className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
              <tr>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-500 tracking-wider">{t.col_res}</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-500 text-center tracking-wider">{t.col_level}</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-500 text-center tracking-wider">{t.col_status}</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-500 text-center tracking-wider">{t.col_ctrl}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                <tr key={item.id} className="hover:bg-slate-500/5 transition-colors font-inter">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.sku}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-5">
                      <button onClick={() => updateStock(item, 'OUT')} className="w-8 h-8 rounded-lg border border-slate-500/20 hover:bg-red-500 hover:text-white font-bold transition-all">-</button>
                      <span className="text-lg font-black w-8">{item.current_stock}</span>
                      <button onClick={() => updateStock(item, 'IN')} className="w-8 h-8 rounded-lg border border-slate-500/20 hover:bg-blue-600 hover:text-white font-bold transition-all">+</button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-md border uppercase tracking-widest ${item.current_stock <= item.min_threshold ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                      {item.current_stock <= item.min_threshold ? 'CRITICAL' : 'OPTIMAL'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2 text-lg">
                      <button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">✎</button>
                      <button onClick={() => { if(window.confirm("Delete?")) fetch(`http://localhost:5000/api/products/${item.id}`, {method:'DELETE'}).then(()=>fetchData()) }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FEED & NOTES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 font-inter">
           <div className={`rounded-3xl border p-8 shadow-sm ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-500">{t.live_feed}</h2>
              <div className="space-y-4">
                {Array.isArray(transactions) && transactions.slice(0, 5).map(log => (
                  <div key={log.id} className="flex justify-between items-center text-[10px] font-mono border-b border-white/[0.05] pb-2 uppercase tracking-tight">
                    <span className="text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                    <span className={log.action_type === 'IN' ? 'text-blue-500' : 'text-red-500'}>{log.action_type} (+{log.quantity})</span>
                    <span className="text-slate-500 truncate max-w-[150px]">{log.product_name}</span>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                 <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">{t.strat_notes}</h2>
                 <button onClick={() => setShowNoteModal(true)} className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg">{t.new_note}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {Array.isArray(notes) && notes.length > 0 ? notes.map(note => (
                   <div key={note.id} className={`border p-6 rounded-2xl transition-all hover:border-blue-500/50 ${theme === 'dark' ? 'bg-[#161920] border-white/5' : 'bg-white border-slate-200'}`}>
                      <span className="text-[7px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase">{note.tag}</span>
                      <h3 className="text-sm font-bold mt-3 mb-1 font-inter">{note.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{note.content}</p>
                   </div>
                 )) : <div className="col-span-full text-center py-10 border border-dashed border-slate-500/20 rounded-2xl text-[10px] uppercase font-black tracking-widest text-slate-500">{t.no_notes}</div>}
              </div>
           </div>
        </div>

        {/* MODAL UNIT */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-inter">
            <div className={`w-full max-w-lg p-10 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#161920] border-white/10' : 'bg-white'}`}>
              <h2 className="text-2xl font-extrabold mb-8 italic uppercase tracking-tighter">{editItem ? "Update" : "Deploy"}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input name="sku" defaultValue={editItem?.sku || ''} placeholder="SKU ID" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-mono text-sm" required />
                <input name="name" defaultValue={editItem?.name || ''} placeholder="Name" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-medium" required />
                {!editItem && <input name="current_stock" type="number" placeholder="Initial" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-medium" required />}
                <input name="min_threshold" defaultValue={editItem?.min_threshold || ''} type="number" placeholder="Safety Limit" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-medium" required />
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] mt-4 shadow-lg">Submit</button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-widest">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOTE */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-inter">
            <div className={`w-full max-w-lg p-10 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#161920] border-white/10' : 'bg-white'}`}>
              <h2 className="text-2xl font-extrabold mb-8 italic uppercase tracking-tighter">{t.new_note}</h2>
              <form onSubmit={handleAddNote} className="space-y-4">
                <input name="title" placeholder="Note Title" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-medium" required />
                <select name="tag" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-bold text-[10px] uppercase">
                  <option value="IDEA" className="text-black">IDEA</option>
                  <option value="TODO" className="text-black">TODO</option>
                </select>
                <textarea name="content" placeholder="Thoughts..." rows="4" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none font-medium" required></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] mt-4">Save</button>
                <button type="button" onClick={() => setShowNoteModal(false)} className="w-full text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;