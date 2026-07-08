import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Zap, 
  Globe, 
  Map as MapIcon, 
  Waves, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Users,
  Building2,
  Leaf
} from 'lucide-react';

// Hero Images
import s1 from '../assets/s1.jpeg';
import s2 from '../assets/s2.jpeg';
import s3 from '../assets/s3.jpeg';
import s4 from '../assets/s4.jpg';

// Portfolio Images
import p1 from '../assets/protection/cc11.png';
import p2 from '../assets/protection/vc.png';
import t1 from '../assets/terittoire/HYDRO BEN AROUS.png';
import t2 from '../assets/terittoire/hydro manoua.png';
import t3 from '../assets/terittoire/hydro_zaghouan.png';
import t4 from '../assets/terittoire/terretoire.png';
import st1 from '../assets/station/WhatsApp Image 2026-05-07 at 19.21.36.jpeg';
import st2 from '../assets/station/barrage mlaabi.jpeg';

const LandingPage = ({ onStartApp }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [s1, s2, s3, s4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { label: "Puissance", value: "600 MW", icon: <Zap size={20} className="text-primary" /> },
    { label: "Tension", value: "500 kV", icon: <TrendingUp size={20} className="text-secondary" /> },
    { label: "Longueur", value: "220 km", icon: <Globe size={20} className="text-accent" /> },
    { label: "Profondeur max", value: "800 m", icon: <Waves size={20} className="text-primary" /> },
  ];

  return (
    <div className="relative">
      {/* Hero Section with Slider */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden mb-20 rounded-[20px] my-2 md:p-4 mx-4 md:mx-8">
        {/* Background Images Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img 
                src={images[currentImage]} 
                alt={`Hero ${currentImage + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay with Gradient */}
              <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-slate-900/40 to-bg-dark"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block px-4 py-1 mb-6 rounded-full glass-card text-primary text-sm font-semibold tracking-wider uppercase backdrop-blur-md"
          >
            Projet ELMED
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-bold mb-6 text-white leading-tight drop-shadow-2xl"
          >
            Le lien vers <span className="text-gradient-primary">l’avenir</span> de l’énergie
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-slate-100 text-xl md:text-2xl max-w-3xl mx-auto mb-10 drop-shadow-lg"
          >
            L’interconnexion stratégique unissant les réseaux électriques de l’Europe et de l’Afrique du Nord pour un avenir durable et renouvelable.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <button onClick={onStartApp} className="btn-primary group scale-110">
              Espace client
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('le-projet')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-7 py-3.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              Présentation du projet
              <Info size={18} />
            </button>
          </motion.div>

          {/* Slider Pagination Dots */}
          <div className="flex justify-center gap-3 mt-16">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  currentImage === i ? "w-8 bg-primary" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 md:px-8 py-12"
      >
      <div className="text-center text-text-muted leading-relaxed mb-6">Détails techniques</div>

      {/* Stats Section */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      >
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 text-center group hover:border-primary/30 transition-colors">
            <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-text-muted text-sm uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* LE PROJET Section */}
      <motion.section id="le-projet" variants={itemVariants} className="glass-card p-8 md:p-12 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-800">
            <Info className="text-primary" />
            Le Projet
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            <div className="space-y-6 text-text-muted leading-relaxed text-lg">
              <p>
                <span className="text-slate-800 font-semibold">ELMED</span> est un véritable « pont énergétique » entre l’Italie et la Tunisie, reliant deux grands réseaux électriques : celui de l’Europe et celui de l’Afrique du Nord. Né de la coopération entre <span className="text-slate-800 font-medium">Terna</span> et la <span className="text-slate-800 font-medium">Steg</span>, gestionnaires des réseaux électriques des deux pays, ce projet constituera la première interconnexion en courant continu entre les deux continents.
              </p>
              <p>
                Grâce à la circulation bidirectionnelle des flux d’électricité, cette infrastructure offrira des bénéfices majeurs sur les plans énergétique et environnemental. La liaison reliera la station de <span className="text-slate-800">Partanna</span>, en Sicile, à celle de <span className="text-slate-800">Mlaabi</span>, située sur la péninsule tunisienne du Cap Bon. D’une longueur totale d’environ <span className="text-slate-800">220 kilomètres</span> — dont près de 200 kilomètres de câble sous-marin — elle disposera d’une capacité de <span className="text-slate-800">600 MW</span> et atteindra une profondeur maximale d’environ <span className="text-slate-800">800 mètres</span> dans le canal de Sicile.
              </p>
              <p>
                Ce projet représente une réalisation d’envergure nécessitant une coordination inédite entre les gestionnaires de réseaux de transport d’électricité, les institutions, les acteurs financiers et les territoires concernés. L’ambition d’ELMED est de renforcer la sécurité, la durabilité et la résilience de l’approvisionnement énergétique, tout en favorisant les échanges d’électricité issue de sources renouvelables et en stimulant de nouveaux investissements dans la production d’énergie propre.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* LES AVANTAGES Section */}
      <section id="les-avantages" className="mb-20">
        <motion.div variants={itemVariants} className="glass-card p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-800">
            <TrendingUp className="text-secondary" />
            Les Avantages
          </h2>
          <div className="space-y-6 text-text-muted leading-relaxed text-lg mb-10">
            <p>
              Le projet ELMED contribuera à diversifier les sources d’approvisionnement énergétique et à accélérer les investissements dans les énergies renouvelables, aussi bien en Europe qu’en Afrique du Nord.
            </p>
            <p>
              Au-delà de son impact énergétique, cette interconnexion favorisera le développement des échanges industriels entre l’Italie et la Tunisie, générant des retombées positives pour l’économie et soutenant la transition énergétique. Le projet permettra également de réduire les émissions mondiales de CO₂ de plus de <span className="text-slate-800">200 tonnes par an</span>.
            </p>
          </div>

          <div className="bg-white/40 border border-glass-border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <CheckCircle2 className="text-success" size={24} />
              Principaux bénéfices
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Durabilité", desc: null, icon: <Leaf size={24} /> },
                { title: "Intégration du marché", desc: "Et compétitivité", icon: <TrendingUp size={24} /> },
                { title: "Dispacciamento", desc: "Meilleure flexibilité opérationnelle", icon: <Zap size={24} /> },
                { title: "FER", desc: "Meilleure gestion et intégration des énergies renouvelables", icon: <Leaf size={24} /> },
                { title: "Interconnexions", desc: "Meilleure capacité d'échange entre les réseaux", icon: <Globe size={24} /> },
                { title: "Sostenibilità", desc: "Sécurité et durabilité des approvisionnements", icon: <Shield size={24} /> }
              ].map((benefit, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/60 border border-glass-border hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group cursor-default">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-800 font-bold text-sm mb-1">{benefit.title}</span>
                    {benefit.desc && <span className="text-text-muted text-sm leading-relaxed">{benefit.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* NOTRE PORTFOLIO Section */}
      <section id="notre-portfolio" className="mb-20">
        <motion.div variants={itemVariants} className="glass-card p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-800">
            <Globe className="text-primary" />
            Notre Portfolio
          </h2>
          
          <div className="space-y-16 mt-12">
            {[
              {
                title: "Protection",
                images: [{ src: p1, alt: "Protection 1" }, { src: p2, alt: "Protection 2" }],
                gridClass: "grid-cols-1 md:grid-cols-2",
                imgClass: "h-72"
              },
              {
                title: "Territoire",
                images: [{ src: t1, alt: "Territoire 1" }, { src: t2, alt: "Territoire 2" }, { src: t3, alt: "Territoire 3" }, { src: t4, alt: "Territoire 4" }],
                gridClass: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                imgClass: "h-64"
              },
              {
                title: "Station",
                images: [{ src: st1, alt: "Station 1" }, { src: st2, alt: "Station 2" }],
                gridClass: "grid-cols-1 md:grid-cols-2",
                imgClass: "h-72"
              }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-bold mb-8 text-slate-800 border-b-2 border-primary/20 pb-4 inline-block">{section.title}</h3>
                <div className={`grid ${section.gridClass} gap-8`}>
                  {section.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-3xl border border-glass-border shadow-lg hover:shadow-xl transition-all duration-500 group relative bg-white cursor-pointer">
                      <img src={img.src} alt={img.alt} className={`w-full ${section.imgClass} object-cover transition-transform duration-700 group-hover:scale-110`} />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl">
                            <ArrowRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* À propos de nous Section */}
      <section id="a-propos" className="mb-20">
        <motion.div variants={itemVariants} className="glass-card p-8 md:p-12 bg-linear-to-b from-glass to-primary/5">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-800">
            <Users className="text-accent" />
            À propos de nous
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-12">
            <span className="text-slate-800 font-semibold">ELMED</span> est un projet porté conjointement par <span className="text-slate-800 font-medium">TERNA</span>, société italienne, et la <span className="text-slate-800 font-medium">STEG</span>, société tunisienne. Partenaires stratégiques en Méditerranée, les deux entreprises unissent leur expertise afin de développer une infrastructure énergétique innovante au service de la transition énergétique et de l’intégration régionale.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/40 border border-glass-border hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Building2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">TERNA</h3>
              </div>
              <div className="space-y-4 text-text-muted text-sm leading-relaxed">
                <p>
                  TERNA est l’opérateur du réseau italien de transport d’électricité à haute et très haute tension, ainsi que le plus grand gestionnaire indépendant de réseau de transport en Europe. Investie d’une mission d’intérêt public, l’entreprise joue un rôle essentiel dans la sécurité de l’approvisionnement électrique de l’Italie et dans le bon fonctionnement du système électrique national.
                </p>
                <p>
                  Elle assure la planification, le développement et la maintenance du réseau, tout en garantissant en permanence l’équilibre entre la production et la consommation d’électricité grâce à l’exploitation du système électrique national. Avec près de 75 000 km de lignes à haute et très haute tension, plus de 900 stations électriques réparties sur le territoire italien et 30 interconnexions internationales, TERNA s’appuie sur l’expertise de plus de 6 000 collaborateurs.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/40 border border-glass-border hover:border-secondary/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                  <Building2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">STEG</h3>
              </div>
              <div className="space-y-4 text-text-muted text-sm leading-relaxed">
                <p>
                  La STEG (Société Tunisienne de l’Électricité et du Gaz) est l’entreprise publique chargée de la production, du transport et de la distribution de l’électricité et du gaz naturel en Tunisie depuis 1962.
                </p>
                <p>
                  Face à une demande énergétique en constante augmentation et à des ressources primaires limitées, la STEG œuvre au développement du réseau énergétique national, à l’électrification du territoire tunisien ainsi qu’au renforcement des interconnexions régionales. Son engagement vise à accompagner la transition énergétique du pays et à garantir un approvisionnement fiable et durable en énergie.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        variants={itemVariants}
        className="text-center bg-linear-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-[32px] p-12 border border-glass-border"
      >
        <h3 className="text-2xl font-bold mb-4">Vérifiez votre parcelle dès maintenant</h3>
        <p className="text-text-muted mb-8 max-w-xl mx-auto">
          Utilisez notre outil interactif pour savoir si la ligne traverse votre propriété et consultez les documents nécessaires.
        </p>
        <button onClick={onStartApp} className="btn-primary mx-auto">
          Accéder à l'Espace Client
          <ChevronRight size={18} />
        </button>
      </motion.section>
      </motion.div>
    </div>
  );
};

export default LandingPage;
