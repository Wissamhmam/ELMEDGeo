import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Ruler, User, FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, XCircle, RotateCcw, Building2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from './components/MapComponent';
import LandingPage from './components/LandingPage';
import MapLegend from './components/MapLegend';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'app'
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for navbar styling & active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (view !== 'landing') return;
      const sections = ['le-projet', 'les-avantages', 'notre-portfolio', 'a-propos'];
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);
  const [selectedRegion, setSelectedRegion] = useState('nabeul'); // 'nabeul' or 'tunis'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [empriseData, setEmpriseData] = useState(null);

  const scrollToSection = (id) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const fetchEmprise = async () => {
      try {
        const response = await fetch('http://localhost:3000/emprise');
        if (response.ok) {
          const result = await response.json();
          setEmpriseData(result);
        }
      } catch (err) {
        console.error("Error fetching emprise data:", err);
      }
    };
    fetchEmprise();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    // Clearing data at the start of search to show loading state clearly
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/api/parcel/${searchTerm}?region=${selectedRegion}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Parcelle non trouvée. Vérifiez le numéro de titre foncier.');
        throw new Error('Erreur lors de la recherche.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setData(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Refresh the page (clear results) as soon as the user starts typing a new number
    if (data || error) {
      setData(null);
      setError(null);
    }
  };

  const requiredDocuments = [
    "Copie certifiée conforme du titre foncier récent",
    "Plan de situation (extrait de la carte topographique)",
    "Copie de la Carte d'Identité Nationale (CIN) du propriétaire",
    "Certificat de propriété récent (moins de 3 mois)",
    "Procuration légalisée (si le demandeur n'est pas le propriétaire)"
  ];

  const navItems = [
    { id: 'le-projet', label: 'Le Projet' },
    { id: 'les-avantages', label: 'Les Avantages' },
    { id: 'notre-portfolio', label: 'Notre Portfolio' },
    { id: 'a-propos', label: 'À propos de nous' }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-slate-900/[0.04] border-b border-slate-200/60 py-2'
            : 'bg-white/70 backdrop-blur-xl py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            onClick={() => { setView('landing'); window.scrollTo({top: 0, behavior: 'smooth'}); setMobileMenuOpen(false); }}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${scrolled ? 'w-8 h-8' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className={`font-extrabold tracking-tight text-slate-800 transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>
              ELMED <span className="text-primary">PROJECT</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
                {/* Active indicator */}
                <motion.span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={false}
                  animate={{
                    width: activeSection === item.id ? 20 : 0,
                    opacity: activeSection === item.id ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-slate-200 mx-3"></div>

            {/* CTA Button */}
            <button
              onClick={() => setView('app')}
              className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-primary hover:via-sky-600 hover:to-primary text-white px-6 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-slate-900/15 hover:shadow-primary/25 transition-all duration-500 hover:-translate-y-px active:scale-[0.97] flex items-center gap-2"
            >
              <span className="relative z-10">Espace Client</span>
              <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-slate-100 mt-2"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { scrollToSection(item.id); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-2" />
                <button
                  onClick={() => { setView('app'); setMobileMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 rounded-xl text-sm font-bold text-center shadow-lg shadow-slate-900/15 active:scale-[0.98] transition-transform"
                >
                  Espace Client
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under the fixed navbar */}
      <div className="h-20 w-full"></div>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage key="landing" onStartApp={() => setView('app')} />
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-6xl mx-auto p-4 md:p-8"
          >
            {/* Header */}
            <header className="mb-12 pt-4">
              <button 
                onClick={() => setView('landing')}
                className="flex items-center gap-2 text-text-muted hover:text-slate-800 transition-colors mb-8 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </button>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1 mb-4 rounded-full glass-card text-primary text-sm font-semibold tracking-wider uppercase"
              >
                Espace Client
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
              >
                Vérification foncière
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-text-muted text-lg max-w-2xl"
              >
                Saisissez votre numéro de titre foncier pour vérifier si la ligne traverse votre parcelle.
              </motion.p>
            </header>

            <main className="grid gap-8">
              {/* Search Section */}
              <section className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Search className="text-primary" size={20} />
                  Recherche par titre foncier
                </h2>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-48">
                    <select 
                      className="input-field cursor-pointer"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      <option value="nabeul">Nabeul</option>
                      <option value="tunis">Tunis</option>
                    </select>
                  </div>
                  <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      placeholder="Exemple: TF-100245, TF-100246..." 
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={handleInputChange}
                    />
                    {searchTerm && (
                      <button 
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-slate-800 transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Recherche..." : "Rechercher"}
                    <Search size={18} />
                  </button>
                </form>
              </section>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3"
                >
                  <AlertTriangle size={20} />
                  {error}
                </motion.div>
              )}

              {/* Results Section */}
              <AnimatePresence mode="wait">
                {data && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Info Cards */}
                    <div className="space-y-6">
                      <div className="glass-card p-6 border-l-4 border-l-primary">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-text-muted text-sm uppercase tracking-wider mb-1">Numéro titre foncier</h3>
                            <div className="flex items-center gap-3">
                              <p className="text-2xl font-bold">{data.parcel.parcelle || data.parcel.text}</p>
                              <button 
                                onClick={clearSearch}
                                className="p-1.5 rounded-lg bg-glass hover:bg-black/5 text-text-muted hover:text-slate-800 transition-all flex items-center gap-1.5 text-xs font-medium border border-glass-border"
                              >
                                <RotateCcw size={14} />
                                Nouvelle recherche
                              </button>
                            </div>
                          </div>
                          {data.isAffected ? (
                            <div className="px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-bold flex items-center gap-1">
                              <AlertTriangle size={12} /> Concernée
                            </div>
                          ) : (
                            <div className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Non concernée
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex items-start gap-3">
                            <User className="text-primary shrink-0" size={20} />
                            <div>
                              <p className="text-text-muted text-xs uppercase">Propriétaire</p>
                              <p className="font-medium">{data.parcel.nom || "Propriétaire enregistré"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="text-primary shrink-0" size={20} />
                            <div>
                              <p className="text-text-muted text-xs uppercase">Zone</p>
                              <p className="font-medium">{data.parcel.cheikhat || "Zone du projet"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Ruler className="text-primary shrink-0" size={20} />
                            <div>
                              <p className="text-text-muted text-xs uppercase">Superficie</p>
                              <p className="font-medium">{Math.round(data.parcel.surface_ma || data.parcel.shape_area).toLocaleString()} m²</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <ShieldCheck className="text-primary shrink-0" size={20} />
                            <div>
                              <p className="text-text-muted text-xs uppercase">Type de passage</p>
                              <p className="font-medium">{data.isAffected ? "Emprise du projet" : "Aucun"}</p>
                            </div>
                          </div>
                          {data.isAffected && data.intersectionInfo && (
                            <>
                              <div className="flex items-start gap-3">
                                <Ruler className="text-primary shrink-0" size={20} />
                                <div>
                                  <p className="text-text-muted text-xs uppercase">Longueur d'intersection</p>
                                  <p className="font-medium">{Number(data.intersectionInfo.longueurIntersection).toLocaleString()} m</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="text-primary shrink-0" size={20} />
                                <div>
                                  <p className="text-text-muted text-xs uppercase">Surface d'emprise</p>
                                  <p className="font-medium">{Number(data.intersectionInfo.surfaceIntersection).toLocaleString()} m²</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <ShieldCheck className="text-primary shrink-0" size={20} />
                                <div>
                                  <p className="text-text-muted text-xs uppercase">Pourcentage d'emprise</p>
                                  <p className="font-medium">{Number(data.intersectionInfo.pourcentageIntersection).toLocaleString()} %</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className={`p-6 rounded-2xl ${data.isAffected ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'}`}>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          {data.isAffected ? <AlertTriangle size={18} className="text-warning" /> : <CheckCircle2 size={18} className="text-success" />}
                          {data.isAffected ? "La ligne traverse cette parcelle." : "La parcelle n'est pas concernée."}
                        </h4>
                        <p className="text-sm text-text-muted">
                          {data.isAffected 
                            ? "La parcelle est concernée par le projet. Les documents suivants sont nécessaires pour le dossier lié au titre foncier." 
                            : "Cette parcelle se trouve en dehors de l'emprise directe du projet ELMED."}
                        </p>
                      </div>

                      {/* Documents list */}
                      {data.isAffected && (
                        <div className="glass-card p-6">
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="text-primary" size={18} />
                            Documents nécessaires
                          </h4>
                          <ul className="space-y-3">
                            {requiredDocuments.map((doc, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Map Column */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center px-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <MapPin className="text-primary" size={18} />
                          Localisation
                        </h3>
                        <span className="text-xs text-text-muted">Vue zoomée de la parcelle</span>
                      </div>
                      <MapComponent 
                        parcelGeom={data.parcel.geometry} 
                        lines={data.intersectingLines}
                        empriseData={empriseData}
                      />
                      <MapLegend />
                      <div className="p-4 rounded-xl bg-glass border border-glass-border text-xs text-text-muted italic">
                        Note: Le tracé rouge indique la projection de la ligne électrique sur votre parcelle.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

              {/* Contact Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 max-w-xl"
              >
                <div className="glass-card p-6 md:p-8">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-800">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    Nous contacter
                  </h3>
                  <p className="text-text-muted text-sm mb-6">Une question sur votre parcelle ? Envoyez-nous un message.</p>

                  <form onSubmit={(e) => { e.preventDefault(); alert('Message envoyé avec succès !'); e.target.reset(); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nom complet</label>
                        <input
                          type="text"
                          required
                          placeholder="Votre nom"
                          className="w-full bg-white/60 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-main transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="votre@email.com"
                          className="w-full bg-white/60 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-main transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Sujet</label>
                      <input
                        type="text"
                        required
                        placeholder="Objet de votre demande"
                        className="w-full bg-white/60 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-main transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Message</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Décrivez votre demande..."
                        className="w-full bg-white/60 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-main transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/15 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-sky-600 hover:from-sky-600 hover:to-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-px active:scale-[0.97] flex items-center gap-2"
                    >
                      Envoyer
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                        <path d="m21.854 2.147-10.94 10.939"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-32 border-t border-glass-border bg-white/50 backdrop-blur-xl pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => { setView('landing'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                <span className="font-extrabold text-2xl tracking-tight text-slate-800">ELMED <span className="text-primary">PROJECT</span></span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                Le pont énergétique stratégique unissant les réseaux électriques de l’Europe et de l’Afrique du Nord pour un avenir plus durable, résilient et renouvelable.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Navigation</h4>
              <ul className="space-y-3 text-sm text-text-muted">
                <li><button onClick={() => scrollToSection('le-projet')} className="hover:text-primary transition-colors">Le Projet</button></li>
                <li><button onClick={() => scrollToSection('les-avantages')} className="hover:text-primary transition-colors">LES AVANTAGES</button></li>
                <li><button onClick={() => scrollToSection('notre-portfolio')} className="hover:text-primary transition-colors">Notre Portfolio</button></li>
                <li><button onClick={() => scrollToSection('a-propos')} className="hover:text-primary transition-colors">À propos de nous</button></li>
                <li><button onClick={() => setView('app')} className="hover:text-primary font-medium transition-colors">Espace Client</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs">Partenaires</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary"><Building2 size={16} /></div>
                  <span className="font-medium">Terna S.p.A.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-secondary/10 text-secondary"><Building2 size={16} /></div>
                  <span className="font-medium">STEG Tunisie</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-xs md:text-sm text-center md:text-left">
              &copy; 2026 Projet ELMED - Interconnexion Tunisie - Italie. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-xs md:text-sm text-text-muted">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Mentions légales</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Minimal Zap icon for the nav
function Zap({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default App;
