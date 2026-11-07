import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Menu, 
  X, 
  Building2, 
  Users, 
  Loader2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Store, 
  Scissors, 
  Coffee, 
  ShoppingBag,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { 
  submitBusinessRegistration, 
  submitWorkerRegistration 
} from './lib/supabase';
import koveraLogo from './assets/kovera-logo.webp';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('business'); // 'business', 'worker', 'both'
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Interactive Shift Explorer State
  const [selectedRole, setSelectedRole] = useState('boutique');
  const [selectedDuration, setSelectedDuration] = useState('4hours');

  // Living Civic Dispatch State
  const [activeDispatchScenario, setActiveDispatchScenario] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 4-Hour Shift & Compensation Ledger State
  const [calcSide, setCalcSide] = useState('business'); // 'business' or 'worker'
  const [calcRole, setCalcRole] = useState('boutique');
  const [calcDuration, setCalcDuration] = useState(4); // 4, 6, 8 hours
  const [calcWeeklyShifts, setCalcWeeklyShifts] = useState(3); // 1, 2, 3, 5 shifts/week

  // Coverage Zones State
  const [selectedZone, setSelectedZone] = useState('insar');

  const dispatchScenarios = [
    {
      id: 'handlooms',
      tag: 'PANIPAT · INSAR BAZAAR',
      ref: '#PNP-2604',
      badge: 'Retail Handlooms',
      merchantTitle: 'Boutique Floor Support',
      merchantPlace: 'Sharma Handlooms · Insar Bazaar, Panipat',
      merchantHours: 'Today · 2:00 PM – 6:00 PM (4 Hours Daytime)',
      merchantTask: 'Customer greeting & weekend festival stock folding.',
      workerName: 'Priya S.',
      workerPlace: 'Model Town, Panipat',
      workerMeta: '18+ Adult ID Verified · 15 mins away',
      workerComp: '₹750 – ₹900 for 4 hrs',
      matchTime: 'Matched in 35 Mins'
    },
    {
      id: 'studio',
      tag: 'PANIPAT · MODEL TOWN',
      ref: '#PNP-2605',
      badge: 'Designer Boutique',
      merchantTitle: 'Fitting & Display Assistant',
      merchantPlace: 'Aura Designer Studio · Model Town',
      merchantHours: 'Today · 1:00 PM – 5:00 PM (4 Hours Daytime)',
      merchantTask: 'Trial room queue organization & garment steamer handling.',
      workerName: 'Neha K.',
      workerPlace: 'Sector 11 HUDA, Panipat',
      workerMeta: '18+ Adult ID Verified · 12 mins away',
      workerComp: '₹800 – ₹950 for 4 hrs',
      matchTime: 'Matched in 25 Mins'
    },
    {
      id: 'cafe',
      tag: 'PANIPAT · SECTOR 12',
      ref: '#PNP-2606',
      badge: 'Café & Quick Bites',
      merchantTitle: 'Rush Hour Table Turnover',
      merchantPlace: 'Chai & Chaat Bistro · Sector 12 Market',
      merchantHours: 'Today · 4:00 PM – 8:00 PM (4 Hours Daytime)',
      merchantTask: 'Peak counter assist, order runner, and quick table prep.',
      workerName: 'Aman V.',
      workerPlace: 'Tehsil Camp, Panipat',
      workerMeta: '18+ Adult ID Verified · 18 mins away',
      workerComp: '₹700 – ₹850 for 4 hrs',
      matchTime: 'Matched in 40 Mins'
    }
  ];

  // Form states
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    workLocation: '',
    supportNeed: ''
  });

  const [workerForm, setWorkerForm] = useState({
    fullName: '',
    phone: '',
    locality: '',
    experience: '',
    availability: ''
  });

  const [isSubmittingBusiness, setIsSubmittingBusiness] = useState(false);
  const [isSubmittingWorker, setIsSubmittingWorker] = useState(false);
  const [businessErrors, setBusinessErrors] = useState({});
  const [workerErrors, setWorkerErrors] = useState({});
  const [businessFormError, setBusinessFormError] = useState(null);
  const [workerFormError, setWorkerFormError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Keyboard dismissal for Toast modal
  useEffect(() => {
    const isToastVisible = Boolean(toastMessage?.show ?? toastMessage);
    if (!isToastVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setToastMessage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toastMessage]);

  const roleTemplates = {
    boutique: {
      title: 'Boutique Support',
      icon: ShoppingBag,
      description: 'Floor greeting, apparel folding, inventory assistance, and customer fitting assistance.',
      typicalHours: '12:00 PM – 4:00 PM or 4:00 PM – 8:00 PM',
      hotspots: 'Model Town, Insar Bazaar, Sector 11/12',
      checklist: ['Daytime public store', 'No heavy machinery', 'Clear task guidance provided']
    },
    salon: {
      title: 'Salon Support',
      icon: Scissors,
      description: 'Station prep, towel organization, greeting clients, and maintaining clean work zones (no specialist treatments).',
      typicalHours: '11:00 AM – 3:00 PM or 3:00 PM – 7:00 PM',
      hotspots: 'GT Road, Model Town Market',
      checklist: ['Public commercial salon', 'Non-specialized assistance only', 'Verified adult workers']
    },
    cafe: {
      title: 'Café & Retail Assist',
      icon: Coffee,
      description: 'Rush hour table clearing, counter organization, takeaway packing, and friendly customer support.',
      typicalHours: '1:00 PM – 5:00 PM or 5:00 PM – 9:00 PM',
      hotspots: 'Sector 12 HUDA Market, Model Town',
      checklist: ['Clean public cafe/eatery', 'Front-of-house support', 'Standard hygiene check']
    },
    general: {
      title: 'Seasonal Retail Rush',
      icon: Store,
      description: 'Weekend footfall handling, customer queue navigation, product display upkeep, and billing assistance.',
      typicalHours: 'Flexible 4-to-6 hour daytime windows',
      hotspots: 'Main Commercial Market Panipat',
      checklist: ['Ground floor retail store', 'Direct store manager supervision', 'Immediate orientation']
    }
  };

  const handleApplyPresetToBusiness = (roleKey, durationKey) => {
    const role = roleTemplates[roleKey];
    const durationLabel = durationKey === '4hours' ? '4-Hour Rush Shift' : durationKey === 'weekend' ? 'Weekend Peak Rush' : 'Full-Day Support';
    setBusinessForm(prev => ({
      ...prev,
      supportNeed: `${role.title} (${durationLabel}) - ${role.description}`
    }));
    goToWaitlist('business');
  };

  const handleApplyPresetToWorker = (roleKey, durationKey) => {
    const role = roleTemplates[roleKey];
    const durationLabel = durationKey === '4hours' ? '4-Hour Daytime Shift' : durationKey === 'weekend' ? 'Weekend Peak Shifts' : 'Full Daytime Shifts';
    setWorkerForm(prev => ({
      ...prev,
      experience: `Available for ${role.title} (${durationLabel})`
    }));
    goToWaitlist('worker');
  };

  const calculatorRates = {
    boutique: {
      title: 'Designer Boutique & Studio',
      icon: ShoppingBag,
      ratePerHour: 200,
      minPay: 190,
      maxPay: 225,
      tasks: 'Trial room queue organization, garment steamer handling & floor assist',
      estMatch: '25 mins'
    },
    handloom: {
      title: 'Retail Handlooms & Textiles',
      icon: Store,
      ratePerHour: 190,
      minPay: 180,
      maxPay: 210,
      tasks: 'Customer greeting, stock folding & weekend festival inventory staging',
      estMatch: '30 mins'
    },
    cafe: {
      title: 'Café & Quick Bites',
      icon: Coffee,
      ratePerHour: 185,
      minPay: 175,
      maxPay: 200,
      tasks: 'Peak counter assist, order runner, and quick table turnover',
      estMatch: '25 mins'
    },
    salon: {
      title: 'Salon Station Prep',
      icon: Scissors,
      ratePerHour: 195,
      minPay: 185,
      maxPay: 220,
      tasks: 'Station sanitization, towel replenishment & client greeting assist',
      estMatch: '20 mins'
    }
  };

  const pilotZones = [
    {
      id: 'insar',
      name: 'Insar Bazaar',
      sector: 'Textile & Handloom District',
      icon: Store,
      responseTime: '20–30 Mins',
      demandLevel: 'High Weekend Demand',
      description: 'The historic commercial center of Panipat. Peak shift demand happens around weekend festival shopping, seasonal stock turnover, and bridal cloth retail.',
      typicalRoles: ['Handloom counter greeting', 'Saree & cloth roll folding', 'Billing queue assist'],
      hours: '11:00 AM – 7:00 PM',
      landmarks: 'Clock Tower Road, Handloom Chowk, Jain Mandir Road'
    },
    {
      id: 'model-town',
      name: 'Model Town',
      sector: 'Fashion Boutiques & Salons',
      icon: ShoppingBag,
      responseTime: '15–25 Mins',
      demandLevel: 'Fastest Local Dispatch',
      description: 'Panipat’s premier lifestyle & bridal retail strip. High demand for well-presented, articulate store assistants during afternoon fitting queues and salon prep.',
      typicalRoles: ['Trial room assistant', 'Garment steamer handling', 'Salon hygiene & prep'],
      hours: '12:00 PM – 8:00 PM',
      landmarks: 'Main Market Road, Model Town Park Corner, HUDA Lane'
    },
    {
      id: 'sector12',
      name: 'Sector 11 & 12 HUDA',
      sector: 'Cafés, Bistros & Modern Dining',
      icon: Coffee,
      responseTime: '20–35 Mins',
      demandLevel: 'Evening Rush Zone',
      description: 'Growing dining hub with quick-service cafes, bakeries, and casual dining outlets needing dynamic table turnover and counter runners during evening peaks.',
      typicalRoles: ['Rush table turnover', 'Takeaway packing assist', 'Counter order runner'],
      hours: '1:00 PM – 8:00 PM',
      landmarks: 'HUDA Market Square, Sector 12 City Mall Road'
    },
    {
      id: 'gt-road',
      name: 'GT Road Corridor',
      sector: 'Multi-Brand Showrooms & Retail',
      icon: Building2,
      responseTime: '15–30 Mins',
      demandLevel: 'Consistent Daytime Flow',
      description: 'Main highway commercial corridor with electronics, appliances, footwear, and consumer retail needing reliable floor staff during promotional periods.',
      typicalRoles: ['Product display upkeep', 'Inventory staging', 'Customer orientation'],
      hours: '10:30 AM – 6:30 PM',
      landmarks: 'Bus Stand Commercial Belt, Sanjay Chowk stretch'
    }
  ];

  const handleApplyCalcToBusiness = () => {
    const roleInfo = calculatorRates[calcRole];
    const totalEstMin = roleInfo.minPay * calcDuration;
    const totalEstMax = roleInfo.maxPay * calcDuration;
    setBusinessForm(prev => ({
      ...prev,
      supportNeed: `${roleInfo.title} (${calcDuration} Hours Daytime Shift · ₹${totalEstMin}–₹${totalEstMax} est.) - ${roleInfo.tasks}`
    }));
    goToWaitlist('business');
  };

  const handleApplyCalcToWorker = () => {
    const roleInfo = calculatorRates[calcRole];
    const weeklyMin = roleInfo.minPay * 4 * calcWeeklyShifts;
    const weeklyMax = roleInfo.maxPay * 4 * calcWeeklyShifts;
    setWorkerForm(prev => ({
      ...prev,
      experience: `Available for ${roleInfo.title}`,
      availability: `${calcWeeklyShifts} daytime shifts/week (Prefers 4-hr slots · est. ₹${weeklyMin}–₹${weeklyMax}/wk)`
    }));
    goToWaitlist('worker');
  };

  const handleApplyZoneToBusiness = (zone) => {
    setBusinessForm(prev => ({
      ...prev,
      workLocation: `${zone.name}, Panipat`
    }));
    goToWaitlist('business');
  };

  const handleApplyZoneToWorker = (zone) => {
    setWorkerForm(prev => ({
      ...prev,
      locality: `${zone.name}, Panipat`
    }));
    goToWaitlist('worker');
  };

  const formatPhoneNumber = (val) => {
    const raw = (val || '').replace(/\D/g, '').slice(0, 10);
    if (raw.length > 5) {
      return `${raw.slice(0, 5)} ${raw.slice(5)}`;
    }
    return raw;
  };

  const handleBusinessChange = (field, value) => {
    const formattedVal = field === 'phone' ? formatPhoneNumber(value) : value;
    setBusinessForm(prev => ({ ...prev, [field]: formattedVal }));
    if (businessErrors[field]) {
      setBusinessErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (businessFormError) {
      setBusinessFormError(null);
    }
  };

  const handleWorkerChange = (field, value) => {
    const formattedVal = field === 'phone' ? formatPhoneNumber(value) : value;
    setWorkerForm(prev => ({ ...prev, [field]: formattedVal }));
    if (workerErrors[field]) {
      setWorkerErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (workerFormError) {
      setWorkerFormError(null);
    }
  };

  const isValidIndianMobile = (phone) => {
    const cleaned = (phone || '').trim().replace(/^(\+91|0)/, '').replace(/[\s-]/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const validateBusinessForm = () => {
    const errors = {};
    if (!businessForm.businessName.trim()) {
      errors.businessName = 'Please enter your business or shop name.';
    }
    if (!businessForm.contactName.trim()) {
      errors.contactName = 'Please enter your contact person name.';
    }
    if (!isValidIndianMobile(businessForm.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    return errors;
  };

  const validateWorkerForm = () => {
    const errors = {};
    if (!workerForm.fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!isValidIndianMobile(workerForm.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!workerForm.locality.trim()) {
      errors.locality = 'Please specify your locality in Panipat.';
    }
    return errors;
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setBusinessFormError(null);
    const errors = validateBusinessForm();
    if (Object.keys(errors).length > 0) {
      setBusinessErrors(errors);
      return;
    }
    setBusinessErrors({});

    setIsSubmittingBusiness(true);
    try {
      const res = await submitBusinessRegistration(businessForm);
      setToastMessage({
        show: true,
        type: 'business',
        title: 'Business Interest Registered!',
        detail: `Thank you ${businessForm.contactName}. We have received your details for ${businessForm.businessName} in ${businessForm.workLocation || 'Panipat'}.`,
        isMock: res?.mock
      });
      setBusinessForm({ businessName: '', contactName: '', phone: '', workLocation: '', supportNeed: '' });
      setBusinessErrors({});
      setBusinessFormError(null);
    } catch (err) {
      console.error(err);
      setBusinessFormError('Could not submit registration. Please check your connection and try again.');
    } finally {
      setIsSubmittingBusiness(false);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    setWorkerFormError(null);
    const errors = validateWorkerForm();
    if (Object.keys(errors).length > 0) {
      setWorkerErrors(errors);
      return;
    }
    setWorkerErrors({});

    setIsSubmittingWorker(true);
    try {
      const res = await submitWorkerRegistration(workerForm);
      setToastMessage({
        show: true,
        type: 'worker',
        title: 'Worker Interest Registered!',
        detail: `Thank you ${workerForm.fullName}. We have added your profile to our Panipat worker pilot network.`,
        isMock: res?.mock
      });
      setWorkerForm({ fullName: '', phone: '', locality: '', experience: '', availability: '' });
      setWorkerErrors({});
      setWorkerFormError(null);
    } catch (err) {
      console.error(err);
      setWorkerFormError('Could not submit registration. Please check your connection and try again.');
    } finally {
      setIsSubmittingWorker(false);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToWaitlist = (tab = 'business') => {
    setActiveFormTab(tab);
    scrollToSection('waitlist');
  };

  // Ensure mobile viewports default cleanly to focused single form view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && activeFormTab === 'both') {
        setActiveFormTab('business');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFormTab]);

  // Track scroll progress for navigation indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const CurrentRoleIcon = roleTemplates[selectedRole].icon;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#181A32] font-sans antialiased selection:bg-[#E4F7F3] selection:text-[#302F80]">
      
      {/* Toast Notification Modal */}
      {toastMessage && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setToastMessage(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="toast-title"
            className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-[#EEEFFC] animate-slide-down"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-13 h-13 rounded-2xl bg-[#E4F7F3] flex items-center justify-center text-[#18A999] shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <button 
                type="button"
                onClick={() => setToastMessage(null)}
                aria-label="Close notification"
                className="text-[#62677D] hover:text-[#181A32] p-1.5 rounded-lg hover:bg-[#F7F8FC] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 id="toast-title" className="text-xl font-extrabold text-[#181A32] mb-2">{toastMessage.title}</h3>
            <p className="text-[#62677D] text-sm leading-relaxed mb-4">{toastMessage.detail}</p>
            {toastMessage.isMock && (
              <div className="mb-5 p-3.5 bg-[#FFF8EB] border border-[#F4B86A]/40 rounded-xl text-xs text-[#8F5B10] flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#F4B86A]" />
                <span><strong>Demo Mode:</strong> Live Supabase keys not set yet. Submissions are saved to local memory without crashing.</span>
              </div>
            )}
            <button
              type="button"
              autoFocus
              onClick={() => setToastMessage(null)}
              className="w-full py-3.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold rounded-xl transition shadow-md cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 01 — Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EEEFFC]/80 shadow-xs relative">
        {/* Scroll Progress Indicator */}
        <div 
          className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#302F80] via-[#18A999] to-[#F4B86A] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with official Kovera Emblem */}
          <a href="#" className="flex items-center gap-2.5 group rounded-xl focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none p-1">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#EEEFFC] p-1 shadow-xs group-hover:border-[#302F80]/30 transition flex items-center justify-center overflow-hidden">
              <img 
                src={koveraLogo} 
                alt="Kovera Emblem" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-[#302F80]">
                kovera
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#18A999] group-hover:scale-125 transition-transform" />
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#181A32]">
            <button onClick={() => scrollToSection('shift-explorer')} className="hover:text-[#18A999] transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              <span>Shift Explorer</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#E4F7F3] text-[#18A999] px-1.5 py-0.5 rounded-full">New</span>
            </button>
            <button onClick={() => scrollToSection('shift-calculator')} className="hover:text-[#18A999] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              Rates &amp; Ledger
            </button>
            <button onClick={() => scrollToSection('coverage-zones')} className="hover:text-[#18A999] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              Pilot Zones
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#18A999] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              How it works
            </button>
            <button onClick={() => scrollToSection('roadmap')} className="hover:text-[#18A999] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              Roadmap
            </button>
            <button onClick={() => scrollToSection('trust')} className="hover:text-[#18A999] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg px-2 py-1">
              Our approach
            </button>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F8FC] border border-[#EEEFFC] text-xs font-bold text-[#62677D]">
              <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
              <span>Panipat Pilot Live</span>
            </div>
            <button 
              onClick={() => goToWaitlist('business')}
              className="px-5 py-2.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>Join waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#181A32] hover:text-[#302F80] rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="lg:hidden bg-white border-b border-[#EEEFFC] px-5 pt-3 pb-6 space-y-2 shadow-xl animate-slide-down">
            <button 
              onClick={() => scrollToSection('shift-explorer')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl flex items-center justify-between"
            >
              <span>Shift Explorer</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#E4F7F3] text-[#18A999] px-1.5 py-0.5 rounded-full">New</span>
            </button>
            <button 
              onClick={() => scrollToSection('shift-calculator')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              Rates &amp; Ledger
            </button>
            <button 
              onClick={() => scrollToSection('coverage-zones')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              Pilot Zones (Panipat)
            </button>
            <button 
              onClick={() => scrollToSection('marketplace')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              For businesses &amp; workers
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('roadmap')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              Roadmap (Pilot to Grid)
            </button>
            <button 
              onClick={() => scrollToSection('trust')} 
              className="block w-full text-left px-3 py-2.5 text-base font-semibold text-[#181A32] hover:bg-[#F7F8FC] rounded-xl"
            >
              Our approach
            </button>
            <button 
              onClick={() => goToWaitlist('business')}
              className="w-full mt-3 py-3.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold text-sm rounded-xl text-center shadow-md transition cursor-pointer active:scale-[0.98]"
            >
              Join the waitlist
            </button>
          </div>
        )}
      </header>

      <main>
        {/* 02 — Hero Section: Split Showcase with 3D Workspace */}
        <section className="relative pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#F7F8FC] via-white to-[#F7F8FC]">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#E4F7F3]/50 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-[#EEEFFC]/70 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Messaging & Action */}
              <div className="lg:col-span-7 text-center lg:text-left">
                
                {/* Location / Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4F7F3] border border-[#18A999]/30 text-[#302F80] text-xs font-black tracking-wider uppercase mb-6 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#18A999]" />
                  <span>PHASE 0 PILOT · PANIPAT, HARYANA</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#181A32] leading-[1.12] mb-4">
                  Good work starts with <br className="hidden sm:block" />
                  <span className="text-[#302F80]">the right people.</span>
                </h1>

                {/* Punchy Subheadline (From Style Guide & Instagram) */}
                <p className="text-xl sm:text-2xl font-bold text-[#18A999] mb-6 tracking-tight">
                  Your local backup workforce, on demand.
                </p>

                {/* Narrative Body */}
                <p className="text-base sm:text-lg text-[#62677D] leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                  One missing person throws off a whole day. Kovera connects Panipat boutiques, salons, cafés, and local retail with dependable, verified daytime support for the exact 4-hour shifts you need to keep business moving.
                </p>

                {/* Dual Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                  <button
                    onClick={() => goToWaitlist('business')}
                    className="w-full sm:w-auto px-8 py-4 bg-[#302F80] hover:bg-[#201F53] text-white font-bold rounded-2xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 group cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <span>I need workers</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => goToWaitlist('worker')}
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F7F8FC] text-[#302F80] font-bold border-2 border-[#EEEFFC] hover:border-[#18A999]/50 rounded-2xl transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <span>I’m looking for work</span>
                    <ArrowRight className="w-5 h-5 text-[#18A999]" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-[#EEEFFC] flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-[#62677D]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#18A999]" /> 18+ ID Verified
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#18A999]" /> ₹0 Fee for Workers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#302F80]" /> Public Daytime Shifts Only
                  </span>
                </div>
              </div>

              {/* Right Column: The Living Civic Dispatch — Interactive Pilot Simulator */}
              <div className="lg:col-span-5 relative">
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#EEEFFC] transition-all">
                  
                  {/* Ticket Header & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#EEEFFC]">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18A999] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#18A999]" />
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#302F80]">
                        LIVE DISPATCH SIMULATOR
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F7F3] text-[#302F80] text-xs font-bold border border-[#18A999]/20">
                        <MapPin className="w-3.5 h-3.5 text-[#18A999]" />
                        {dispatchScenarios[activeDispatchScenario].tag}
                      </span>
                      <span className="text-xs font-bold text-[#62677D] tabular-nums font-mono">
                        {dispatchScenarios[activeDispatchScenario].ref}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Scenario Switcher Pills */}
                  <div className="pt-3 pb-1">
                    <div className="flex items-center gap-1.5 p-1 bg-[#F7F8FC] rounded-xl border border-[#EEEFFC] overflow-x-auto scrollbar-none">
                      {dispatchScenarios.map((sc, idx) => (
                        <button
                          key={sc.id}
                          onClick={() => setActiveDispatchScenario(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                            activeDispatchScenario === idx
                              ? 'bg-white text-[#302F80] shadow-xs border border-[#EEEFFC]'
                              : 'text-[#62677D] hover:text-[#181A32]'
                          }`}
                        >
                          {sc.badge}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* The Match Anatomy (Dual-Sided Symmetry with smooth keyframe) */}
                  <div key={activeDispatchScenario} className="mt-3 space-y-3 animate-fade-in">
                    
                    {/* Merchant Side (Civic Indigo) */}
                    <div className="bg-[#EEEFFC] rounded-2xl p-4 border border-[#302F80]/15">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#302F80] flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#302F80]" />
                          Merchant Shift Need
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#302F80] text-xs font-bold shadow-xs">
                          Active Request
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <h3 className="text-base font-extrabold text-[#181A32]">
                          {dispatchScenarios[activeDispatchScenario].merchantTitle}
                        </h3>
                        <p className="text-xs font-semibold text-[#302F80]">
                          {dispatchScenarios[activeDispatchScenario].merchantPlace}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#302F80] mb-2 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-[#302F80]" />
                        <span>{dispatchScenarios[activeDispatchScenario].merchantHours}</span>
                      </div>

                      <p className="text-xs text-[#201F53] leading-relaxed">
                        <span className="font-bold">Task: </span>{dispatchScenarios[activeDispatchScenario].merchantTask}
                      </p>
                    </div>

                    {/* Perforated Match Bridge */}
                    <div className="flex items-center justify-center my-1 relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-dashed border-[#EEEFFC]" />
                      </div>
                      <div className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F8FC] border border-[#EEEFFC] text-xs font-bold text-[#18A999] shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#18A999]" />
                        <span className="tabular-nums">{dispatchScenarios[activeDispatchScenario].matchTime}</span>
                      </div>
                    </div>

                    {/* Worker Match Side (Kinetic Teal) */}
                    <div className="bg-[#E4F7F3] rounded-2xl p-4 border border-[#18A999]/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#128679] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#18A999]" />
                          Worker Match Confirmation
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#18A999] text-xs font-bold shadow-xs">
                          Confirmed &amp; Ready
                        </span>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-base font-extrabold text-[#181A32]">
                          Matched: {dispatchScenarios[activeDispatchScenario].workerName}
                        </h3>
                        <p className="text-xs font-semibold text-[#128679]">
                          {dispatchScenarios[activeDispatchScenario].workerPlace}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#128679] mb-2.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#18A999]" />
                        <span>{dispatchScenarios[activeDispatchScenario].workerMeta}</span>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-[#18A999]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-extrabold text-[#181A32] tabular-nums">{dispatchScenarios[activeDispatchScenario].workerComp}</span>
                        <span className="font-bold text-[#128679]">₹0 Worker Fee · Direct Pay</span>
                      </div>
                    </div>

                  </div>

                  {/* Quick Action Links from Ticket */}
                  <div className="mt-3.5 pt-3 border-t border-[#EEEFFC] flex items-center justify-between text-xs">
                    <button 
                      onClick={() => goToWaitlist('business')}
                      className="font-bold text-[#302F80] hover:text-[#201F53] flex items-center gap-1 cursor-pointer transition active:scale-[0.98]"
                    >
                      <span>Need a shift like this?</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => goToWaitlist('worker')}
                      className="font-bold text-[#18A999] hover:text-[#128679] flex items-center gap-1 cursor-pointer transition active:scale-[0.98]"
                    >
                      <span>Available to work?</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Operational Guardrails Footer */}
                  <div className="pt-3 mt-3 border-t border-[#EEEFFC] space-y-2.5">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F8FC] border border-[#EEEFFC] text-xs font-semibold text-[#181A32]">
                        <Check className="w-3.5 h-3.5 text-[#18A999]" />
                        Public Daytime Workplace
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F8FC] border border-[#EEEFFC] text-xs font-semibold text-[#181A32]">
                        <Check className="w-3.5 h-3.5 text-[#18A999]" />
                        Pre-Confirmed Availability
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F8FC] border border-[#EEEFFC] text-xs font-semibold text-[#181A32]">
                        <Check className="w-3.5 h-3.5 text-[#18A999]" />
                        Coordinator On Call
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#62677D] pt-1">
                      <span>Coordinated via phone/WhatsApp</span>
                      <span className="text-[#302F80] font-bold">Phase 0 Pilot Network</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 03 — Editorial Callout: "The 4-Hour Problem" */}
        <section className="py-20 md:py-24 bg-white border-y border-[#EEEFFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-[#F7F8FC] rounded-3xl p-8 sm:p-12 border border-[#EEEFFC] shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#181A32] mb-3">
                  Not a hiring problem. A 4-hour problem.
                </h2>
                <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                  When a team member calls in sick on a Saturday afternoon, you don’t need weeks of interviews and contracts. You just need dependable hands for 4 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The Old Pain */}
                <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>Traditional Staffing</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#62677D]">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">✕</span> 2-3 weeks to post ads and interview
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">✕</span> Long-term contracts for short-term surges
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">✕</span> Store owners forced to work overtime and stress
                    </li>
                  </ul>
                </div>

                {/* The Kovera Solution */}
                <div className="bg-[#E4F7F3]/60 rounded-2xl p-6 border border-[#18A999]/30 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#302F80] font-bold text-sm mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#18A999]" />
                    <span>Kovera Local Backup</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#181A32]">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" /> Express shift support in Panipat in 60 seconds
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" /> 18+ verified local students & part-timers ready to work
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" /> Human-reviewed matches with zero worker deductions
                    </li>
                  </ul>
                </div>
              </div>

              {/* Local Community Signature */}
              <div className="mt-8 pt-6 border-t border-[#EEEFFC] flex flex-col items-center justify-center text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2E1] text-[#8F5B10] text-xs font-bold uppercase tracking-wider mb-2 border border-[#F4B86A]/40 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4B86A]" /> Panipat Local Voice · शाम हो या सवेरा
                </span>
                <p className="text-base sm:text-lg font-bold text-[#302F80] tracking-tight">
                  “Shaam ho ya savera, Panipat ke shops ke liye, Kovera.”
                </p>
                <p className="text-xs text-[#62677D] mt-1">
                  Local backup workforce built with and for the retail merchants of Haryana.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — Interactive Shift Explorer */}
        <section id="shift-explorer" className="py-20 md:py-24 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                What does a Kovera shift look like?
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                Select your business type and see typical shift coverage, requirements, and pilot hotspots in Panipat.
              </p>
            </div>

            {/* Role Category Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-4xl mx-auto">
              {Object.entries(roleTemplates).map(([key, template]) => {
                const IconComponent = template.icon;
                const isSelected = selectedRole === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition shadow-2xs ${
                      isSelected 
                        ? 'bg-[#302F80] text-white shadow-md' 
                        : 'bg-white text-[#62677D] hover:text-[#181A32] border border-[#EEEFFC]'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#18A999]' : 'text-[#62677D]'}`} />
                    <span>{template.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Preview Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#EEEFFC] shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Detail */}
                <div className="md:col-span-7">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] flex items-center justify-center shrink-0 shadow-2xs">
                      <CurrentRoleIcon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-2xl font-bold text-[#181A32]">{roleTemplates[selectedRole].title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E4F7F3] text-[#18A999] text-xs font-bold">
                        Panipat Pilot
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#62677D] leading-relaxed mb-6">
                    {roleTemplates[selectedRole].description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-xs text-[#181A32]">
                      <span className="w-24 font-bold text-[#62677D] uppercase">Typical Shift:</span>
                      <span className="font-semibold bg-[#F7F8FC] px-2.5 py-1 rounded-md border border-[#EEEFFC]">
                        {roleTemplates[selectedRole].typicalHours}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#181A32]">
                      <span className="w-24 font-bold text-[#62677D] uppercase">Key Hotspots:</span>
                      <span className="font-semibold bg-[#F7F8FC] px-2.5 py-1 rounded-md border border-[#EEEFFC]">
                        {roleTemplates[selectedRole].hotspots}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EEEFFC]">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#181A32] mb-2.5">
                      Pilot Safety Standard
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {roleTemplates[selectedRole].checklist.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E4F7F3] text-[#302F80] rounded-lg text-xs font-semibold">
                          <Check className="w-3.5 h-3.5 text-[#18A999]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Shift Configurator & Preset CTA */}
                <div className="md:col-span-5 md:border-l md:border-[#EEEFFC] md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-[#EEEFFC] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black text-[#302F80] uppercase tracking-wider block mb-3">
                      Choose Shift Length
                    </span>

                    <div className="space-y-2 mb-6">
                      {[
                        { id: '4hours', label: '4-Hour Rush Shift', desc: 'Peak daytime hours' },
                        { id: 'weekend', label: 'Weekend Peak', desc: 'Saturday or Sunday rush' },
                        { id: 'fullday', label: 'Full Daytime Shift', desc: 'Continuous shop assistance' }
                      ].map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedDuration(option.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            selectedDuration === option.id 
                              ? 'bg-white border-[#302F80] shadow-xs ring-1 ring-[#302F80]/20' 
                              : 'bg-[#F7F8FC] border-[#EEEFFC] hover:bg-white'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-[#181A32]">{option.label}</p>
                            <p className="text-xs text-[#62677D]">{option.desc}</p>
                          </div>
                          {selectedDuration === option.id && (
                            <div className="w-5 h-5 rounded-full bg-[#302F80] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => handleApplyPresetToBusiness(selectedRole, selectedDuration)}
                        className="w-full py-3.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
                      >
                        <span>I'm a Business: Request this support</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyPresetToWorker(selectedRole, selectedDuration)}
                        className="w-full py-3 bg-[#E4F7F3] hover:bg-[#d5f3ec] text-[#18A999] hover:text-[#128679] border border-[#18A999]/30 font-bold text-sm rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#18A999]" />
                        <span>I'm a Worker: Available for this role</span>
                      </button>
                    </div>

                    <p className="text-xs text-center text-[#62677D] mt-3">
                      Prefills the waitlist form for either business or worker registration.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 04b — The 4-Hour Shift & Compensation Ledger (Calculator) */}
        <section id="shift-calculator" className="py-24 md:py-28 bg-white border-y border-[#EEEFFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                Transparent shift rates. Zero surprises.
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                Whether you’re budgeting backup coverage for a Saturday surge or estimating supplementary student earnings, calculate your exact numbers upfront.
              </p>

              {/* Side Switcher (Business vs Worker) */}
              <div className="mt-8 inline-flex items-center p-1.5 bg-[#F7F8FC] rounded-2xl border border-[#EEEFFC] gap-1.5">
                <button
                  type="button"
                  onClick={() => setCalcSide('business')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer active:scale-[0.98] ${
                    calcSide === 'business'
                      ? 'bg-[#302F80] text-white shadow-xs'
                      : 'text-[#62677D] hover:text-[#181A32]'
                  }`}
                >
                  For Businesses: Shift Cost
                </button>
                <button
                  type="button"
                  onClick={() => setCalcSide('worker')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer active:scale-[0.98] ${
                    calcSide === 'worker'
                      ? 'bg-[#18A999] text-white shadow-xs'
                      : 'text-[#62677D] hover:text-[#181A32]'
                  }`}
                >
                  For Workers: Earning Estimator
                </button>
              </div>
            </div>

            {/* Calculator Main Grid */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#EEEFFC] shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Controls */}
                <div className="md:col-span-7 space-y-6">
                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#181A32] mb-3">
                      Select Retail Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.entries(calculatorRates).map(([key, role]) => {
                        const RoleIcon = role.icon;
                        const isSelected = calcRole === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setCalcRole(key)}
                            className={`p-3.5 rounded-xl border text-left transition cursor-pointer active:scale-[0.98] ${
                              isSelected
                                ? 'bg-white border-[#302F80] shadow-xs ring-1 ring-[#302F80]/20'
                                : 'bg-white/70 border-[#EEEFFC] hover:bg-white text-[#62677D]'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <RoleIcon className={`w-4 h-4 ${isSelected ? 'text-[#302F80]' : 'text-[#62677D]'}`} />
                              <span className={`text-xs font-bold ${isSelected ? 'text-[#181A32]' : 'text-[#62677D]'}`}>
                                {role.title}
                              </span>
                            </div>
                            <span className="text-xs text-[#18A999] font-extrabold tabular-nums block">
                              ₹{role.minPay} – ₹{role.maxPay} / hr
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {calcSide === 'business' ? (
                    /* Business Duration Pills */
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-black uppercase tracking-wider text-[#181A32]">
                          Shift Duration
                        </label>
                        <span className="text-xs font-bold text-[#18A999]">Daytime window (8am–8pm)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { hours: 4, label: '4 Hours', desc: 'Peak Rush' },
                          { hours: 6, label: '6 Hours', desc: 'Half Day' },
                          { hours: 8, label: '8 Hours', desc: 'Full Day' }
                        ].map(dur => (
                          <button
                            key={dur.hours}
                            type="button"
                            onClick={() => setCalcDuration(dur.hours)}
                            className={`p-3 rounded-xl text-center border transition cursor-pointer active:scale-[0.98] ${
                              calcDuration === dur.hours
                                ? 'bg-[#302F80] text-white border-[#302F80] shadow-xs'
                                : 'bg-white border-[#EEEFFC] text-[#181A32] hover:border-[#302F80]/40'
                            }`}
                          >
                            <span className="text-sm font-extrabold block tabular-nums">{dur.label}</span>
                            <span className={`text-xs ${calcDuration === dur.hours ? 'text-white/80' : 'text-[#62677D]'}`}>
                              {dur.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Worker Weekly Shifts Pills */
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-black uppercase tracking-wider text-[#181A32]">
                          Available Shifts Per Week
                        </label>
                        <span className="text-xs font-bold text-[#18A999]">4-hour daylight slots</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { count: 1, label: '1 Shift' },
                          { count: 2, label: '2 Shifts' },
                          { count: 3, label: '3 Shifts' },
                          { count: 5, label: '5 Shifts' }
                        ].map(shift => (
                          <button
                            key={shift.count}
                            type="button"
                            onClick={() => setCalcWeeklyShifts(shift.count)}
                            className={`p-3 rounded-xl text-center border transition cursor-pointer active:scale-[0.98] ${
                              calcWeeklyShifts === shift.count
                                ? 'bg-[#18A999] text-white border-[#18A999] shadow-xs'
                                : 'bg-white border-[#EEEFFC] text-[#181A32] hover:border-[#18A999]/40'
                            }`}
                          >
                            <span className="text-sm font-extrabold block tabular-nums">{shift.label}</span>
                            <span className={`text-xs ${calcWeeklyShifts === shift.count ? 'text-white/80' : 'text-[#62677D]'}`}>
                              / week
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#EEEFFC] text-xs text-[#62677D]">
                    <span className="font-bold text-[#181A32]">Included Tasks: </span>
                    {calculatorRates[calcRole].tasks}
                  </div>
                </div>

                {/* Right Result Column */}
                <div className="md:col-span-5 md:border-l md:border-[#EEEFFC] md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-[#EEEFFC] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#EEEFFC] mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-[#302F80]">
                        {calcSide === 'business' ? 'ESTIMATED SHIFT LEDGER' : 'ESTIMATED EARNINGS LEDGER'}
                      </span>
                      <span className="text-xs font-bold text-[#18A999] bg-[#E4F7F3] px-2 py-0.5 rounded-full">
                        ₹0 Platform Fee
                      </span>
                    </div>

                    {calcSide === 'business' ? (
                      <>
                        <div className="mb-4">
                          <span className="text-xs text-[#62677D] block mb-1">Worker Direct Compensation ({calcDuration} Hours)</span>
                          <p className="text-3xl font-black text-[#181A32] tabular-nums">
                            ₹{calculatorRates[calcRole].minPay * calcDuration} – ₹{calculatorRates[calcRole].maxPay * calcDuration}
                          </p>
                          <span className="text-xs text-[#62677D] mt-1 block">
                            Direct settlement at shift completion.
                          </span>
                        </div>

                        <div className="space-y-2.5 py-4 border-y border-[#EEEFFC] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Kovera Pilot Fee:</span>
                            <span className="font-extrabold text-[#18A999]">₹0 (100% Free Pilot)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Est. Dispatch Response:</span>
                            <span className="font-bold text-[#181A32] tabular-nums">{calculatorRates[calcRole].estMatch}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Safety Standard:</span>
                            <span className="font-bold text-[#181A32]">Public Daytime Retail</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleApplyCalcToBusiness}
                          className="w-full mt-5 py-3.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                        >
                          <span>Request this {calcDuration}-Hour Shift</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <span className="text-xs text-[#62677D] block mb-1">
                            Estimated Monthly Supplementary Income
                          </span>
                          <p className="text-3xl font-black text-[#18A999] tabular-nums">
                            ₹{calculatorRates[calcRole].minPay * 4 * calcWeeklyShifts * 4} – ₹{calculatorRates[calcRole].maxPay * 4 * calcWeeklyShifts * 4}
                          </p>
                          <span className="text-xs text-[#62677D] mt-1 block">
                            Based on {calcWeeklyShifts} four-hour shift{calcWeeklyShifts > 1 ? 's' : ''}/week.
                          </span>
                        </div>

                        <div className="space-y-2.5 py-4 border-y border-[#EEEFFC] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Per-Shift Take Home:</span>
                            <span className="font-bold text-[#181A32] tabular-nums">
                              ₹{calculatorRates[calcRole].minPay * 4} – ₹{calculatorRates[calcRole].maxPay * 4}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Weekly Payout:</span>
                            <span className="font-extrabold text-[#18A999] tabular-nums">
                              ₹{calculatorRates[calcRole].minPay * 4 * calcWeeklyShifts} – ₹{calculatorRates[calcRole].maxPay * 4 * calcWeeklyShifts}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#62677D]">Worker Platform Fee:</span>
                            <span className="font-extrabold text-[#18A999]">₹0 (Keep 100% of pay)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleApplyCalcToWorker}
                          className="w-full mt-5 py-3.5 bg-[#18A999] hover:bg-[#128679] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Claim Shifts for this Schedule</span>
                        </button>
                      </>
                    )}

                    <p className="text-xs text-center text-[#62677D] mt-3">
                      Prefills the intake form with your selected rate and scheduling preferences.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 04c — Panipat Hyperlocal Coverage Radar */}
        <section id="coverage-zones" className="py-20 md:py-24 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                Active shift corridors in Panipat
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                We focus on high-density commercial clusters to guarantee reliable 15-to-30 minute match dispatch and daytime workplace safety.
              </p>
            </div>

            {/* Zone Selector Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
              {pilotZones.map(zone => {
                const ZoneIcon = zone.icon;
                const isSelected = selectedZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-4 rounded-2xl text-left border transition cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#302F80] text-white border-[#302F80] shadow-md'
                        : 'bg-white text-[#181A32] border-[#EEEFFC] hover:border-[#18A999]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/15 text-white' : 'bg-[#EEEFFC] text-[#302F80]'}`}>
                        <ZoneIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-extrabold tabular-nums text-[#18A999]">
                        {zone.responseTime}
                      </span>
                    </div>
                    <p className="font-extrabold text-sm">{zone.name}</p>
                    <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-[#62677D]'}`}>{zone.sector}</p>
                  </button>
                );
              })}
            </div>

            {/* Active Zone Detail Card */}
            {(() => {
              const activeZoneData = pilotZones.find(z => z.id === selectedZone) || pilotZones[0];
              const ActiveIcon = activeZoneData.icon;
              return (
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#EEEFFC] shadow-xl animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#E4F7F3] text-[#302F80] text-xs font-bold rounded-full">
                          {activeZoneData.demandLevel}
                        </span>
                        <span className="text-xs font-bold text-[#62677D] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#18A999]" /> {activeZoneData.hours}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#181A32] mb-2 flex items-center gap-2">
                        <span>{activeZoneData.name}</span>
                        <span className="text-xs font-bold text-[#18A999] px-2 py-0.5 rounded-md bg-[#E4F7F3]">
                          {activeZoneData.sector}
                        </span>
                      </h3>

                      <p className="text-sm text-[#62677D] leading-relaxed mb-6">
                        {activeZoneData.description}
                      </p>

                      <div className="space-y-3 mb-6 text-xs">
                        <div className="flex items-start gap-2 text-[#181A32]">
                          <span className="font-bold text-[#62677D] uppercase w-24 shrink-0">Key Corridors:</span>
                          <span className="font-semibold text-[#181A32]">{activeZoneData.landmarks}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[#181A32]">
                          <span className="font-bold text-[#62677D] uppercase w-24 shrink-0">Typical Tasks:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeZoneData.typicalRoles.map((role, idx) => (
                              <span key={idx} className="bg-[#F7F8FC] border border-[#EEEFFC] px-2.5 py-1 rounded-md text-[#302F80] font-semibold">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#EEEFFC]">
                        <button
                          type="button"
                          onClick={() => handleApplyZoneToBusiness(activeZoneData)}
                          className="px-5 py-2.5 bg-[#302F80] hover:bg-[#201F53] text-white font-bold text-xs rounded-xl transition shadow-sm hover:shadow flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                        >
                          <span>I run a shop in {activeZoneData.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyZoneToWorker(activeZoneData)}
                          className="px-5 py-2.5 bg-[#E4F7F3] hover:bg-[#d5f3ec] text-[#18A999] hover:text-[#128679] border border-[#18A999]/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                        >
                          <span>I can work in {activeZoneData.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-5 md:border-l md:border-[#EEEFFC] md:pl-8 text-center pt-6 md:pt-0 border-t md:border-t-0 border-[#EEEFFC]">
                      <div className="w-16 h-16 rounded-2xl bg-[#F7F8FC] border border-[#EEEFFC] text-[#302F80] flex items-center justify-center mx-auto mb-4 shadow-xs">
                        <ActiveIcon className="w-8 h-8 text-[#302F80]" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#62677D] block mb-1">
                        Average Response Window
                      </span>
                      <p className="text-3xl font-extrabold text-[#181A32] tabular-nums mb-2">
                        {activeZoneData.responseTime}
                      </p>
                      <p className="text-xs text-[#62677D] leading-relaxed mb-4">
                        Coordinated by local Panipat dispatch with direct phone verification.
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EEEFFC] rounded-full text-xs font-bold text-[#18A999]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#18A999]" />
                        <span>Public Commercial Venue Only</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* 05 — Two-Sided Marketplace */}
        <section id="marketplace" className="py-24 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                A little less searching. A lot more clarity.
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                Whether you need an extra pair of hands or you’re looking for your next opportunity, start in the right place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Business Card (Indigo Theme) */}
              <div className="bg-[#EEEFFC] rounded-3xl p-8 sm:p-10 border border-[#302F80]/15 flex flex-col justify-between hover:shadow-xl transition">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3.5 py-1.5 bg-white text-[#302F80] text-xs font-extrabold rounded-full shadow-2xs">
                      FOR BUSINESSES
                    </span>
                    <Building2 className="w-5 h-5 text-[#302F80]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#181A32] mb-4 leading-snug">
                    When work piles up, get help finding the fit.
                  </h3>
                  <p className="text-[#62677D] text-base leading-relaxed mb-6">
                    Share your staffing need, shift timing and the kind of support required. Our team will review the request and coordinate next steps when a suitable match is available.
                  </p>
                  <div className="space-y-2.5 mb-8">
                    <div className="flex items-center gap-2 text-sm text-[#302F80] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#302F80]" /> Support for boutiques, salons, cafés & retail
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#302F80] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#302F80]" /> Quick registration — no lengthy contracts
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#302F80] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#302F80]" /> Human-vetted local talent in Panipat
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goToWaitlist('business')}
                  className="inline-flex items-center gap-2 text-[#302F80] font-extrabold hover:gap-3 transition-all text-base cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg p-1"
                >
                  <span>Tell us what your business needs</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Worker Card (Teal Theme) */}
              <div className="bg-[#E4F7F3] rounded-3xl p-8 sm:p-10 border border-[#18A999]/25 flex flex-col justify-between hover:shadow-xl transition">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3.5 py-1.5 bg-white text-[#18A999] text-xs font-extrabold rounded-full shadow-2xs">
                      FOR WORKERS
                    </span>
                    <Users className="w-5 h-5 text-[#18A999]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#181A32] mb-4 leading-snug">
                    Your skills deserve the right opportunity.
                  </h3>
                  <p className="text-[#62677D] text-base leading-relaxed mb-6">
                    Tell us what you can do, where you’re based and when you’re available. We’ll use that information to explore suitable opportunities as the local pilot develops.
                  </p>
                  <div className="space-y-2.5 mb-8">
                    <div className="flex items-center gap-2 text-sm text-[#18A999] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999]" /> ₹0 registration or platform fees
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#18A999] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999]" /> Flexible daytime hours that suit your week
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#18A999] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999]" /> Safe, public commercial workplaces only
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goToWaitlist('worker')}
                  className="inline-flex items-center gap-2 text-[#302F80] font-extrabold hover:gap-3 transition-all text-base cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-lg p-1"
                >
                  <span>Join the worker waitlist</span>
                  <ArrowRight className="w-5 h-5 text-[#18A999]" />
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-[#62677D] mt-12">
              No mobile app download needed. The first step is a simple conversation.
            </p>
          </div>
        </section>

        {/* 06 — How It Works (Three-Step Process) */}
        <section id="how-it-works" className="py-20 md:py-24 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                From a need to a clear next step
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                We’re starting hands-on so every request can be understood before a match is promised.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-[#302F80]/20 via-[#18A999]/30 to-[#F4B86A]/40 -z-0" aria-hidden="true" />
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] font-black text-xl flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">Tell us what you need</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  Businesses share the role, timing, location and the experience or checks the shift requires.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#E4F7F3] text-[#18A999] font-black text-xl flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">We review the fit</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  Our team confirms role suitability, verified identity, daytime safety, and local availability.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2E1] text-[#302F80] font-black text-xl flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">Coordinate the shift</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  When there’s a suitable match, exact shift details are confirmed with both sides before work begins.
                </p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-[#62677D] mt-12 max-w-xl mx-auto">
              We confirm availability before making commitments. Early access is not a guarantee of a filled shift.
            </p>
          </div>
        </section>

        {/* 06b — Strategic Evolution Roadmap: From Pilot to Regional Grid */}
        <section id="roadmap" className="py-24 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                From Panipat pilot to regional grid
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                We are intentionally starting with human curation to understand real retail needs before introducing algorithmic dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Phase 0 */}
              <div className="bg-[#F7F8FC] rounded-3xl p-8 border-2 border-[#302F80] shadow-md relative flex flex-col justify-between">
                <div className="absolute -top-3.5 left-6 px-3 py-1 bg-[#302F80] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-xs">
                  PHASE 0 · ACTIVE NOW
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <span className="text-xs font-extrabold text-[#18A999] tracking-wider uppercase">Q1 – Q2 2026</span>
                    <span className="px-2.5 py-1 bg-[#E4F7F3] text-[#302F80] text-xs font-bold rounded-lg">Panipat Core</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#181A32] mb-3">Hyperlocal Intake Pilot</h3>
                  <p className="text-sm text-[#62677D] leading-relaxed mb-6">
                    Hands-on demand &amp; supply validation across Insar Bazaar, Model Town, and Sector 11/12 with dedicated human coordinators.
                  </p>
                  <ul className="space-y-3 text-xs text-[#181A32] mb-8 font-medium">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" />
                      <span>100% Free pilot testing with ₹0 worker fees</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" />
                      <span>In-person 18+ adult identity verification</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" />
                      <span>Direct WhatsApp &amp; phone coordinator matching</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#18A999] shrink-0 mt-0.5" />
                      <span>Public commercial daylight shifts only</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#EEEFFC] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#302F80]">Current Stage</span>
                  <span className="font-extrabold text-[#18A999] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" /> Live in Panipat
                  </span>
                </div>
              </div>

              {/* Phase 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm relative flex flex-col justify-between hover:border-[#18A999]/40 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-[#62677D] tracking-wider uppercase">PHASE 1 · Q3 2026</span>
                    <span className="px-2.5 py-1 bg-[#EEEFFC] text-[#302F80] text-xs font-bold rounded-lg">Expansion</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#181A32] mb-3">Live Dispatch Network</h3>
                  <p className="text-sm text-[#62677D] leading-relaxed mb-6">
                    Automating match routing with an official WhatsApp bot and expanding shift corridors into Chandigarh and Mohali commercial hubs.
                  </p>
                  <ul className="space-y-3 text-xs text-[#62677D] mb-8 font-medium">
                    <li className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#302F80] shrink-0 mt-0.5" />
                      <span>Direct WhatsApp bot instant intake &amp; broadcast</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#302F80] shrink-0 mt-0.5" />
                      <span>Automated SMS shift reminders &amp; verification codes</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#302F80] shrink-0 mt-0.5" />
                      <span>Launch in Chandigarh Sector 17/35 &amp; Mohali 3B2</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#302F80] shrink-0 mt-0.5" />
                      <span>Optional merchant expedited match tier</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#EEEFFC] flex items-center justify-between text-xs text-[#62677D]">
                  <span className="font-bold">Next Milestone</span>
                  <span className="font-semibold text-[#302F80]">In Preparation</span>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm relative flex flex-col justify-between hover:border-[#18A999]/40 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-[#62677D] tracking-wider uppercase">PHASE 2 · 2027</span>
                    <span className="px-2.5 py-1 bg-[#FFF8EB] text-[#8F5B10] text-xs font-bold rounded-lg border border-[#F4B86A]/40">Vision</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#181A32] mb-3">The Regional Grid</h3>
                  <p className="text-sm text-[#62677D] leading-relaxed mb-6">
                    A self-serve regional shift grid allowing retail chains to hold backup retainers and trusted workers to build local reputation.
                  </p>
                  <ul className="space-y-3 text-xs text-[#62677D] mb-8 font-medium">
                    <li className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F4B86A] shrink-0 mt-0.5" />
                      <span>Self-serve merchant backup scheduling dashboard</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F4B86A] shrink-0 mt-0.5" />
                      <span>Merchant on-demand shift backup retainers</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F4B86A] shrink-0 mt-0.5" />
                      <span>Worker reliability scores &amp; priority shift alerts</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F4B86A] shrink-0 mt-0.5" />
                      <span>Multi-city Haryana &amp; Punjab commercial coverage</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#EEEFFC] flex items-center justify-between text-xs text-[#62677D]">
                  <span className="font-bold">Scale Vision</span>
                  <span className="font-semibold text-[#8F5B10]">Regional Network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — Trust and Clarity Section (Navy Theme) */}
        <section id="trust" className="py-24 md:py-28 bg-[#201F53] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
                A good match starts with clear expectations.
              </h2>
              <p className="text-base sm:text-lg text-[#D9DDF1] leading-relaxed max-w-2xl mx-auto">
                We’re building the network carefully—prioritizing suitability, clear shift details and safer working conditions over promises we can’t yet support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Trust Item 1 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start hover:border-[#18A999]/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-sm flex items-center justify-center mb-4">
                  18+
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Adult worker eligibility</h3>
                <p className="text-xs text-[#D9DDF1] leading-relaxed">All workers must be verified adults before entering the pilot.</p>
              </div>

              {/* Trust Item 2 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start hover:border-[#18A999]/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-sm flex items-center justify-center mb-4">
                  ID
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Identity & suitability checks</h3>
                <p className="text-xs text-[#D9DDF1] leading-relaxed">Basic identity checks to protect stores and ensure accountability.</p>
              </div>

              {/* Trust Item 3 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start hover:border-[#18A999]/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-[#18A999] text-white font-black text-xs flex items-center justify-center mb-4">
                  DAY
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Public daytime workplaces</h3>
                <p className="text-xs text-[#D9DDF1] leading-relaxed">Strictly public retail, boutique & salon premises during business hours.</p>
              </div>

              {/* Trust Item 4 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start hover:border-[#18A999]/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-[#18A999] font-black text-base flex items-center justify-center mb-4">
                  ₹0
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Workers never pay fees</h3>
                <p className="text-xs text-[#D9DDF1] leading-relaxed">Workers keep 100% of their earnings with zero platform deductions.</p>
              </div>
            </div>

            <div className="mt-12 bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 text-center max-w-2xl mx-auto">
              <p className="text-xs text-[#D9DDF1]">
                <strong className="text-white">Scope Protection:</strong> Kovera’s pilot explicitly excludes private-home work, night shifts, hazardous environments, and licensed/specialized technical services.
              </p>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => goToWaitlist('business')}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#F7F8FC] text-[#302F80] font-bold rounded-2xl transition shadow-lg hover:shadow-xl cursor-pointer group active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#201F53] focus-visible:outline-none"
              >
                <span>Register your interest</span>
                <ArrowRight className="w-5 h-5 text-[#18A999] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* 07b — Direct Dispatch Hotline / Instant WhatsApp Help */}
        <section className="py-12 bg-gradient-to-r from-[#EEEFFC] via-[#E4F7F3] to-[#EEEFFC] border-y border-[#EEEFFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEFFC] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E4F7F3] text-[#18A999] flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#181A32]">
                      Need urgent shift coverage in Panipat today?
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4F7F3] text-[#302F80] text-xs font-bold border border-[#18A999]/30">
                      <span className="w-2 h-2 rounded-full bg-[#18A999] animate-pulse" />
                      Hotline Desk
                    </span>
                  </div>
                  <p className="text-sm text-[#62677D] mt-1">
                    Connect directly with our local coordinator desk via WhatsApp or phone for immediate assistance.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Kovera%20Panipat%20Team%2C%20I%20need%20shift%20support%20today."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#18A999] hover:bg-[#128679] text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Coordinator</span>
                </a>
                <button
                  type="button"
                  onClick={() => goToWaitlist('business')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F7F8FC] text-[#302F80] border border-[#EEEFFC] font-bold text-sm rounded-xl transition shadow-2xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span>Open Intake Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 08 — Lead Intake: Waitlist Registration (Supabase Integrated) */}
        <section id="waitlist" className="py-24 md:py-28 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                Join the Kovera early network
              </h2>
              <p className="text-base text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                Tell us which side of the marketplace you’re on to get started with our Panipat pilot.
              </p>

              {/* Tab Switcher */}
              <div className="mt-8 w-full max-w-sm sm:w-auto mx-auto grid grid-cols-2 sm:flex items-center p-1.5 bg-white rounded-2xl border border-[#EEEFFC] shadow-2xs gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('both')}
                  className={`hidden sm:inline-block px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-center ${
                    activeFormTab === 'both' 
                      ? 'bg-[#302F80] text-white shadow-2xs' 
                      : 'text-[#62677D] hover:text-[#181A32]'
                  }`}
                >
                  Show both
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('business')}
                  className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-center ${
                    activeFormTab === 'business' 
                      ? 'bg-[#302F80] text-white shadow-2xs' 
                      : 'text-[#62677D] hover:text-[#181A32]'
                  }`}
                >
                  For businesses
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('worker')}
                  className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-center ${
                    activeFormTab === 'worker' 
                      ? 'bg-[#18A999] text-white shadow-2xs' 
                      : 'text-[#62677D] hover:text-[#181A32]'
                  }`}
                >
                  For workers
                </button>
              </div>
            </div>

            <div className={
              activeFormTab === 'both'
                ? "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto transition-all duration-300"
                : "max-w-2xl mx-auto w-full transition-all duration-300"
            }>
              
              {/* Business Form */}
              {(activeFormTab === 'both' || activeFormTab === 'business') && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#EEEFFC] shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-[#EEEFFC] text-[#302F80] text-xs font-bold rounded-full">
                      BUSINESS WAITLIST
                    </span>
                    <Building2 className="w-5 h-5 text-[#302F80]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#181A32] mb-2">Tell us about your hiring needs</h3>
                  <p className="text-sm text-[#62677D] mb-6">Help us understand what support would make a difference.</p>

                  <form onSubmit={handleBusinessSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="biz-name" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Business name</label>
                      <input
                        id="biz-name"
                        type="text"
                        placeholder="e.g. Boutique or salon"
                        value={businessForm.businessName}
                        onChange={(e) => handleBusinessChange('businessName', e.target.value)}
                        aria-invalid={businessErrors.businessName ? "true" : undefined}
                        aria-describedby={businessErrors.businessName ? "biz-name-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition ${businessErrors.businessName ? 'border border-red-400 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#302F80] focus-visible:ring-2 focus-visible:ring-[#302F80]/20'}`}
                      />
                      {businessErrors.businessName && (
                        <p id="biz-name-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {businessErrors.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="biz-contact" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Contact name</label>
                      <input
                        id="biz-contact"
                        type="text"
                        placeholder="Your name"
                        value={businessForm.contactName}
                        onChange={(e) => handleBusinessChange('contactName', e.target.value)}
                        aria-invalid={businessErrors.contactName ? "true" : undefined}
                        aria-describedby={businessErrors.contactName ? "biz-contact-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition ${businessErrors.contactName ? 'border border-red-400 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#302F80] focus-visible:ring-2 focus-visible:ring-[#302F80]/20'}`}
                      />
                      {businessErrors.contactName && (
                        <p id="biz-contact-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {businessErrors.contactName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="biz-phone" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Phone number</label>
                      <div className={`flex rounded-xl transition overflow-hidden ${businessErrors.phone ? 'border border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus-within:bg-white focus-within:border-[#302F80] focus-within:ring-2 focus-within:ring-[#302F80]/20'}`}>
                        <span className={`inline-flex items-center px-3.5 text-sm font-bold select-none border-r transition ${businessErrors.phone ? 'bg-red-100/50 text-red-700 border-red-300' : 'bg-[#EEEFFC] text-[#302F80] border-[#EEEFFC]'}`}>
                          +91
                        </span>
                        <input
                          id="biz-phone"
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="98765 43210"
                          value={businessForm.phone}
                          onChange={(e) => handleBusinessChange('phone', e.target.value)}
                          aria-invalid={businessErrors.phone ? "true" : undefined}
                          aria-describedby={businessErrors.phone ? "biz-phone-error" : undefined}
                          className="w-full px-4 py-3 bg-transparent text-sm outline-none text-[#181A32] placeholder-[#62677D]/60"
                        />
                      </div>
                      {businessErrors.phone && (
                        <p id="biz-phone-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {businessErrors.phone}
                        </p>
                      )}
                      <p className="text-xs text-[#62677D] mt-1.5">We coordinate shift availability via WhatsApp / Phone</p>
                    </div>

                    <div>
                      <label htmlFor="biz-location" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Work location</label>
                      <input
                        id="biz-location"
                        type="text"
                        placeholder="e.g. Model Town, Panipat"
                        value={businessForm.workLocation}
                        onChange={(e) => handleBusinessChange('workLocation', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#302F80] focus-visible:ring-2 focus-visible:ring-[#302F80]/20 rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="biz-need" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">What support do you need?</label>
                      <textarea
                        id="biz-need"
                        rows={3}
                        placeholder="Describe the task or shift timing"
                        value={businessForm.supportNeed}
                        onChange={(e) => handleBusinessChange('supportNeed', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#302F80] focus-visible:ring-2 focus-visible:ring-[#302F80]/20 rounded-xl text-sm outline-none transition resize-none"
                      />
                    </div>

                    {businessFormError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2 mb-4" role="alert">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>Could not submit registration. Please check your connection and try again.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingBusiness}
                      className="w-full py-4 bg-[#302F80] hover:bg-[#201F53] disabled:bg-[#302F80]/70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {isSubmittingBusiness ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <span>Register business interest</span>
                      )}
                    </button>
                  </form>

                  <p className="text-xs text-[#62677D] mt-4 text-center">
                    By registering, you’re expressing interest—not confirming a job or shift.
                  </p>
                </div>
              )}

              {/* Worker Form */}
              {(activeFormTab === 'both' || activeFormTab === 'worker') && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#EEEFFC] shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-[#E4F7F3] text-[#18A999] text-xs font-bold rounded-full">
                      WORKER WAITLIST
                    </span>
                    <Users className="w-5 h-5 text-[#18A999]" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#181A32] mb-2">Let us know what you can do</h3>
                  <p className="text-sm text-[#62677D] mb-6">Share a few details so we can explore suitable opportunities.</p>

                  <form onSubmit={handleWorkerSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="worker-name" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Full name</label>
                      <input
                        id="worker-name"
                        type="text"
                        placeholder="Your name"
                        value={workerForm.fullName}
                        onChange={(e) => handleWorkerChange('fullName', e.target.value)}
                        aria-invalid={workerErrors.fullName ? "true" : undefined}
                        aria-describedby={workerErrors.fullName ? "worker-name-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition ${workerErrors.fullName ? 'border border-red-400 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#18A999] focus-visible:ring-2 focus-visible:ring-[#18A999]/20'}`}
                      />
                      {workerErrors.fullName && (
                        <p id="worker-name-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {workerErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="worker-phone" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Phone number</label>
                      <div className={`flex rounded-xl transition overflow-hidden ${workerErrors.phone ? 'border border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus-within:bg-white focus-within:border-[#18A999] focus-within:ring-2 focus-within:ring-[#18A999]/20'}`}>
                        <span className={`inline-flex items-center px-3.5 text-sm font-bold select-none border-r transition ${workerErrors.phone ? 'bg-red-100/50 text-red-700 border-red-300' : 'bg-[#E4F7F3] text-[#18A999] border-[#EEEFFC]'}`}>
                          +91
                        </span>
                        <input
                          id="worker-phone"
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="98765 43210"
                          value={workerForm.phone}
                          onChange={(e) => handleWorkerChange('phone', e.target.value)}
                          aria-invalid={workerErrors.phone ? "true" : undefined}
                          aria-describedby={workerErrors.phone ? "worker-phone-error" : undefined}
                          className="w-full px-4 py-3 bg-transparent text-sm outline-none text-[#181A32] placeholder-[#62677D]/60"
                        />
                      </div>
                      {workerErrors.phone && (
                        <p id="worker-phone-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {workerErrors.phone}
                        </p>
                      )}
                      <p className="text-xs text-[#62677D] mt-1.5">We coordinate shift availability via WhatsApp / Phone</p>
                    </div>

                    <div>
                      <label htmlFor="worker-locality" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Locality</label>
                      <input
                        id="worker-locality"
                        type="text"
                        placeholder="Where are you based in Panipat?"
                        value={workerForm.locality}
                        onChange={(e) => handleWorkerChange('locality', e.target.value)}
                        aria-invalid={workerErrors.locality ? "true" : undefined}
                        aria-describedby={workerErrors.locality ? "worker-locality-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition ${workerErrors.locality ? 'border border-red-400 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-400/20 bg-red-50/20' : 'bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#18A999] focus-visible:ring-2 focus-visible:ring-[#18A999]/20'}`}
                      />
                      {workerErrors.locality && (
                        <p id="worker-locality-error" className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {workerErrors.locality}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="worker-exp" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Experience or skills</label>
                      <input
                        id="worker-exp"
                        type="text"
                        placeholder="e.g. Student, retail greeting, cashier, shop help"
                        value={workerForm.experience}
                        onChange={(e) => handleWorkerChange('experience', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#18A999] focus-visible:ring-2 focus-visible:ring-[#18A999]/20 rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="worker-avail" className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Availability</label>
                      <input
                        id="worker-avail"
                        type="text"
                        placeholder="e.g. Weekday afternoons, weekends 4-8pm"
                        value={workerForm.availability}
                        onChange={(e) => handleWorkerChange('availability', e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:bg-white focus:border-[#18A999] focus-visible:ring-2 focus-visible:ring-[#18A999]/20 rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    {workerFormError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2 mb-4" role="alert">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>Could not submit registration. Please check your connection and try again.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingWorker}
                      className="w-full py-4 bg-[#18A999] hover:bg-[#128679] disabled:bg-[#18A999]/70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {isSubmittingWorker ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <span>Register worker interest</span>
                      )}
                    </button>
                  </form>

                  <p className="text-xs text-[#62677D] mt-4 text-center">
                    By registering, you’re expressing interest—not guaranteeing work.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 09 — Frequently Asked Questions */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-3">
                A few things worth making clear
              </h2>
              <p className="text-base sm:text-lg text-[#62677D] max-w-2xl mx-auto leading-relaxed">
                We’re starting small, learning from real local needs and keeping the first experience straightforward.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Where is Kovera starting?",
                  a: "The initial Phase 0 validation and pilot focus is Panipat, Haryana (covering Model Town, GT Road, Insar Bazaar, Sector 11/12). Future expansion plans include Chandigarh and Mohali."
                },
                {
                  q: "Is there a mobile app?",
                  a: "Not in this phase. We’re starting with a web-first experience to keep joining simple for both local businesses and workers."
                },
                {
                  q: "Are shifts guaranteed after I register?",
                  a: "No. Registration helps us understand demand and worker availability. A shift is only confirmed after suitability and availability are checked by our team."
                },
                {
                  q: "What kinds of jobs are in scope?",
                  a: "Clearly defined, non-specialized support roles in daytime public workplaces (retail boutiques, salons, cafés, customer assistance). Hazardous, private-home, night shifts, and specialized/licensed trade work are outside the initial pilot."
                },
                {
                  q: "Do workers have to pay any platform fee?",
                  a: "No. Workers do not pay anything to register or access opportunities in the Kovera pilot. ₹0 registration fee."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F7F8FC] rounded-2xl border border-[#EEEFFC] overflow-hidden transition"
                >
                  <button
                    type="button"
                    id={`faq-trigger-${idx}`}
                    aria-expanded={expandedFaq === idx}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-lg text-[#181A32] hover:text-[#302F80] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#302F80] focus-visible:outline-none rounded-2xl"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-[#18A999] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#62677D] shrink-0" />
                    )}
                  </button>

                  {expandedFaq === idx && (
                    <div 
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${idx}`}
                      className="px-6 pb-6 text-base text-[#62677D] leading-relaxed border-t border-[#EEEFFC] pt-4"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-[#62677D]">
                Have a specific question?{' '}
                <button 
                  onClick={() => goToWaitlist('business')}
                  className="text-[#302F80] font-bold underline hover:text-[#18A999] cursor-pointer"
                >
                  Join the waitlist and tell us what you’re looking for.
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 10 — Footer */}
      <footer className="bg-[#201F53] text-white pt-16 pb-12 border-t border-[#39386F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#39386F]">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
                  <img src={koveraLogo} alt="Kovera Emblem" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-white">kovera</span>
                  <span className="w-2 h-2 rounded-full bg-[#18A999]" />
                </div>
              </div>
              <p className="text-[#D9DDF1] text-sm font-medium">Local work, better connected.</p>
              <p className="text-xs text-[#D9DDF1]/70 mt-1">Your local backup workforce, on demand.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#D9DDF1]">
              <button onClick={() => scrollToSection('shift-explorer')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">Shift explorer</button>
              <button onClick={() => scrollToSection('shift-calculator')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">Rates &amp; ledger</button>
              <button onClick={() => scrollToSection('coverage-zones')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">Pilot zones</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">How it works</button>
              <button onClick={() => scrollToSection('roadmap')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">Roadmap</button>
              <button onClick={() => scrollToSection('trust')} className="hover:text-white transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#18A999] focus-visible:outline-none rounded-lg px-1.5 py-0.5">Our approach</button>
              <button onClick={() => goToWaitlist('business')} className="text-white font-bold hover:text-[#18A999] transition cursor-pointer flex items-center gap-1.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-lg px-2 py-1">
                <span>Register interest</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#18A999]" />
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9DDF1]">
            <p>Phase 0 pilot · Panipat, Haryana</p>
            <p className="text-center sm:text-right">
              Early access. Every request is subject to suitability and confirmed availability.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
