import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  UserCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Menu, 
  X,
  Building2,
  Users,
  Briefcase
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('both'); // 'both', 'business', 'worker'
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Form states
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    contactName: '',
    workLocation: '',
    supportNeed: ''
  });

  const [workerForm, setWorkerForm] = useState({
    fullName: '',
    locality: '',
    experience: '',
    availability: ''
  });

  const [toastMessage, setToastMessage] = useState(null);

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    if (!businessForm.businessName || !businessForm.contactName) {
      alert('Please fill in your Business Name and Contact Name.');
      return;
    }
    setToastMessage({
      type: 'business',
      title: 'Business Interest Registered!',
      detail: `Thank you ${businessForm.contactName}. We have received your details for ${businessForm.businessName} in ${businessForm.workLocation || 'Panipat'}.`
    });
    setBusinessForm({ businessName: '', contactName: '', workLocation: '', supportNeed: '' });
  };

  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    if (!workerForm.fullName || !workerForm.locality) {
      alert('Please fill in your Full Name and Locality.');
      return;
    }
    setToastMessage({
      type: 'worker',
      title: 'Worker Interest Registered!',
      detail: `Thank you ${workerForm.fullName}. We have added your profile to our Panipat worker pilot network.`
    });
    setWorkerForm({ fullName: '', locality: '', experience: '', availability: '' });
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#181A32] font-sans antialiased">
      
      {/* Toast Notification Modal */}
      {toastMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#EEEFFC]">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-[#E4F7F3] flex items-center justify-center text-[#18A999] mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-[#62677D] hover:text-[#181A32] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-[#181A32] mb-2">{toastMessage.title}</h3>
            <p className="text-[#62677D] text-sm mb-6">{toastMessage.detail}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="w-full py-3 bg-[#302F80] hover:bg-[#201F53] text-white font-medium rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 01 — Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EEEFFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-1 group">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#302F80]">
              kovera
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#18A999] group-hover:scale-125 transition-transform" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('marketplace')} className="text-[#181A32] hover:text-[#18A999] font-medium text-sm transition">
              For businesses
            </button>
            <button onClick={() => scrollToSection('marketplace')} className="text-[#181A32] hover:text-[#18A999] font-medium text-sm transition">
              For workers
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-[#181A32] hover:text-[#18A999] font-medium text-sm transition">
              How it works
            </button>
            <button onClick={() => scrollToSection('trust')} className="text-[#181A32] hover:text-[#18A999] font-medium text-sm transition">
              Our approach
            </button>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="px-5 py-2.5 bg-[#302F80] hover:bg-[#201F53] text-white font-medium text-sm rounded-xl transition shadow-sm hover:shadow"
            >
              Join the waitlist
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#181A32] hover:text-[#302F80]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#EEEFFC] px-4 pt-2 pb-6 space-y-4 shadow-lg animate-slide-down">
            <button 
              onClick={() => scrollToSection('marketplace')} 
              className="block w-full text-left px-3 py-2 text-base font-medium text-[#181A32] hover:bg-[#F7F8FC] rounded-lg"
            >
              For businesses
            </button>
            <button 
              onClick={() => scrollToSection('marketplace')} 
              className="block w-full text-left px-3 py-2 text-base font-medium text-[#181A32] hover:bg-[#F7F8FC] rounded-lg"
            >
              For workers
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left px-3 py-2 text-base font-medium text-[#181A32] hover:bg-[#F7F8FC] rounded-lg"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('trust')} 
              className="block w-full text-left px-3 py-2 text-base font-medium text-[#181A32] hover:bg-[#F7F8FC] rounded-lg"
            >
              Our approach
            </button>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="w-full mt-2 py-3 bg-[#302F80] text-white font-medium text-sm rounded-xl text-center"
            >
              Join the waitlist
            </button>
          </div>
        )}
      </header>

      <main>
        {/* 02 — Hero */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-linear-to-b from-[#F7F8FC] via-white to-[#F7F8FC]">
          
          {/* Subtle Background Accents */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#E4F7F3]/40 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-[#EEEFFC]/60 rounded-full blur-2xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              
              {/* Location Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4F7F3] border border-[#18A999]/20 text-[#302F80] text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#18A999]" />
                <span>PHASE 0 / PANIPAT, HARYANA</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#181A32] leading-[1.15] mb-4">
                Good work starts with <br className="hidden sm:block" />
                the right people.
              </h1>

              {/* Subheadline Emphasis */}
              <p className="text-lg sm:text-xl font-semibold text-[#18A999] mb-6">
                For the shifts that keep business moving.
              </p>

              {/* Body */}
              <p className="text-base sm:text-lg text-[#62677D] leading-relaxed max-w-2xl mx-auto mb-8">
                Kovera connects local businesses looking for short-term support with people ready to work. Tell us what you need—or what you can do—and join our early network.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => {
                    setActiveFormTab('business');
                    scrollToSection('waitlist');
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#302F80] hover:bg-[#201F53] text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>I need workers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => {
                    setActiveFormTab('worker');
                    scrollToSection('waitlist');
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F7F8FC] text-[#302F80] font-semibold border-2 border-[#EEEFFC] hover:border-[#302F80]/20 rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>I’m looking for work</span>
                  <ArrowRight className="w-4 h-4 text-[#18A999]" />
                </button>
              </div>

              {/* Pilot Note */}
              <p className="text-xs sm:text-sm text-[#62677D] max-w-lg mx-auto">
                Starting with a focused local pilot in Panipat. Matches depend on suitable roles and confirmed availability.
              </p>
            </div>

            {/* Marketplace Preview Card */}
            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EEEFFC]">
              <div className="text-center mb-8">
                <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                  A MORE CONNECTED WAY TO WORK
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#181A32]">
                  One local network. Two sides of every shift.
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Side */}
                <div className="bg-[#EEEFFC] rounded-2xl p-6 border border-[#302F80]/10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#302F80] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    B
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#181A32] mb-1">For local businesses</h4>
                    <p className="text-sm text-[#62677D]">Share the role, timing and location</p>
                  </div>
                </div>

                {/* Worker Side */}
                <div className="bg-[#E4F7F3] rounded-2xl p-6 border border-[#18A999]/20 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#18A999] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    W
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#181A32] mb-1">For local workers</h4>
                    <p className="text-sm text-[#62677D]">Share skills, experience and availability</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#EEEFFC] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="inline-block px-3 py-1 bg-white border border-[#EEEFFC] text-[#302F80] text-xs font-bold rounded-lg tracking-wider">
                  HUMAN-COORDINATED PILOT
                </span>
                <p className="text-xs text-[#62677D] text-center sm:text-right">
                  Suitable work. Clear expectations. A thoughtful first step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — Two-sided marketplace */}
        <section id="marketplace" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                A BETTER FIT FOR BOTH SIDES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4">
                A little less searching. A lot more clarity.
              </h2>
              <p className="text-base sm:text-lg text-[#62677D]">
                Whether you need an extra pair of hands or you’re looking for your next opportunity, start in the right place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Business Card */}
              <div className="bg-[#EEEFFC] rounded-3xl p-8 sm:p-10 border border-[#302F80]/15 flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <span className="inline-block px-3 py-1 bg-white text-[#302F80] text-xs font-bold rounded-full mb-6">
                    FOR BUSINESSES
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#181A32] mb-4 leading-snug">
                    When work piles up, get help finding the fit.
                  </h3>
                  <p className="text-[#62677D] text-base leading-relaxed mb-8">
                    Share your staffing need, shift timing and the kind of support required. Our team will review the request and coordinate next steps when a suitable match may be available.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveFormTab('business');
                    scrollToSection('waitlist');
                  }}
                  className="inline-flex items-center gap-2 text-[#302F80] font-bold hover:gap-3 transition-all text-base"
                >
                  <span>Tell us what your business needs</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Worker Card */}
              <div className="bg-[#E4F7F3] rounded-3xl p-8 sm:p-10 border border-[#18A999]/20 flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <span className="inline-block px-3 py-1 bg-white text-[#302F80] text-xs font-bold rounded-full mb-6">
                    FOR WORKERS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#181A32] mb-4 leading-snug">
                    Your skills deserve the right opportunity.
                  </h3>
                  <p className="text-[#62677D] text-base leading-relaxed mb-8">
                    Tell us what you can do, where you’re based and when you’re available. We’ll use that information to explore suitable opportunities as the local pilot develops.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveFormTab('worker');
                    scrollToSection('waitlist');
                  }}
                  className="inline-flex items-center gap-2 text-[#302F80] font-bold hover:gap-3 transition-all text-base"
                >
                  <span>Join the worker waitlist</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-[#62677D] mt-12">
              No app download needed to express interest. The first step is a simple conversation.
            </p>
          </div>
        </section>

        {/* 04 — How it works */}
        <section id="how-it-works" className="py-20 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                SIMPLE BY DESIGN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4">
                From a need to a clear next step
              </h2>
              <p className="text-base sm:text-lg text-[#62677D]">
                We’re starting hands-on so every request can be understood before a match is promised.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative">
                <div className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] font-black text-xl flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">Tell us what you need</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  Businesses share the task, location, timing and the experience or checks the role requires.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative">
                <div className="w-12 h-12 rounded-2xl bg-[#E4F7F3] text-[#302F80] font-black text-xl flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">We review the fit</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  The team looks at role suitability, availability and basic identity or skill verification.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition relative">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2E1] text-[#302F80] font-black text-xl flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-xl font-bold text-[#181A32] mb-3">Coordinate the shift</h3>
                <p className="text-[#62677D] text-sm leading-relaxed">
                  When there’s a suitable option, key details are confirmed with both sides before work begins.
                </p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-[#62677D] mt-12 max-w-xl mx-auto">
              We confirm availability before making commitments. Early access is not a guarantee of a filled shift.
            </p>
          </div>
        </section>

        {/* 05 — Pilot focus */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                FOCUSED PILOT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4">
                Starting with everyday business support
              </h2>
              <p className="text-base sm:text-lg text-[#62677D]">
                The first pilot stays intentionally narrow: suitable, clearly defined support tasks in public workplaces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Role 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:border-[#302F80]/20 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] font-bold text-xl flex items-center justify-center">
                      B
                    </div>
                    <span className="text-xs font-bold text-[#18A999] uppercase tracking-wider bg-[#E4F7F3] px-3 py-1 rounded-full">
                      RETAIL
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#181A32] mb-3">Boutique support</h3>
                  <p className="text-[#62677D] text-sm leading-relaxed mb-6">
                    Help with general shop-floor support, folding, setup and other clearly defined non-specialized tasks.
                  </p>
                </div>
              </div>

              {/* Role 2 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:border-[#18A999]/30 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E4F7F3] text-[#302F80] font-bold text-xl flex items-center justify-center">
                      S
                    </div>
                    <span className="text-xs font-bold text-[#18A999] uppercase tracking-wider bg-[#E4F7F3] px-3 py-1 rounded-full">
                      LOCAL SERVICES
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#181A32] mb-3">Salon support</h3>
                  <p className="text-[#62677D] text-sm leading-relaxed mb-6">
                    Support roles around the business—not specialist salon services, styling or customer advice.
                  </p>
                </div>
              </div>

              {/* Role 3 */}
              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:border-[#F4B86A]/40 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF2E1] text-[#302F80] font-bold text-xl flex items-center justify-center">
                      +
                    </div>
                    <span className="text-xs font-bold text-[#18A999] uppercase tracking-wider bg-[#E4F7F3] px-3 py-1 rounded-full">
                      LEARNING AS WE GO
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#181A32] mb-3">Other local needs</h3>
                  <p className="text-[#62677D] text-sm leading-relaxed mb-6">
                    We’ll use business conversations to learn which additional support roles fit the pilot safely.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#F7F8FC] rounded-2xl p-4 sm:p-6 border border-[#EEEFFC] text-center max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-[#62677D]">
                <strong className="text-[#181A32]">Scope Note:</strong> Kovera’s pilot excludes private-home work, night shifts, hazardous tasks and specialized or licensed work.
              </p>
            </div>
          </div>
        </section>

        {/* 06 — Trust and clarity */}
        <section id="trust" className="py-20 bg-[#201F53] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-3 py-1 bg-[#39386F] text-white text-xs font-bold rounded-full mb-4 tracking-wider uppercase">
                PILOT-FIRST. PEOPLE-FIRST.
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                A good match starts with clear expectations.
              </h2>
              <p className="text-base sm:text-lg text-[#D9DDF1] leading-relaxed">
                We’re building the network carefully—prioritizing suitability, clear shift details and safer working conditions over promises we can’t yet support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Trust Item 1 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-sm flex items-center justify-center mb-4">
                  18+
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Adult worker eligibility</h3>
              </div>

              {/* Trust Item 2 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-sm flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Basic identity and suitability checks</h3>
              </div>

              {/* Trust Item 3 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#18A999] text-white font-black text-xs flex items-center justify-center mb-4">
                  DAY
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Daytime roles in public workplaces</h3>
              </div>

              {/* Trust Item 4 */}
              <div className="bg-[#302F67] rounded-3xl p-6 border border-white/10 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-base flex items-center justify-center mb-4">
                  ₹0
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Workers don’t pay to access opportunities</h3>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-[#D9DDF1] mt-12">
              Availability and suitability are checked before a shift is confirmed.
            </p>
          </div>
        </section>

        {/* 07 — Join the early network */}
        <section id="waitlist" className="py-20 bg-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                YOUR FIRST STEP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4">
                Join the Kovera early network
              </h2>
              <p className="text-base text-[#62677D]">
                Tell us which side of the marketplace you’re on to get started with our Panipat pilot.
              </p>

              {/* Tab Switcher for mobile / focused view */}
              <div className="mt-8 inline-flex p-1.5 bg-white rounded-2xl border border-[#EEEFFC] shadow-2xs">
                <button
                  onClick={() => setActiveFormTab('both')}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFormTab === 'both' ? 'bg-[#302F80] text-white shadow-2xs' : 'text-[#62677D] hover:text-[#181A32]'}`}
                >
                  Show Both
                </button>
                <button
                  onClick={() => setActiveFormTab('business')}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFormTab === 'business' ? 'bg-[#302F80] text-white shadow-2xs' : 'text-[#62677D] hover:text-[#181A32]'}`}
                >
                  For Businesses
                </button>
                <button
                  onClick={() => setActiveFormTab('worker')}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeFormTab === 'worker' ? 'bg-[#18A999] text-white shadow-2xs' : 'text-[#62677D] hover:text-[#181A32]'}`}
                >
                  For Workers
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
              
              {/* Business Form */}
              {(activeFormTab === 'both' || activeFormTab === 'business') && (
                <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-[#EEEFFC] text-[#302F80] text-xs font-bold rounded-full">
                      BUSINESS WAITLIST
                    </span>
                    <Building2 className="w-5 h-5 text-[#302F80]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#181A32] mb-2">Tell us about your hiring needs</h3>
                  <p className="text-sm text-[#62677D] mb-6">Help us understand what support would make a difference.</p>

                  <form onSubmit={handleBusinessSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Business name</label>
                      <input
                        type="text"
                        placeholder="e.g. Boutique or salon"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#302F80] rounded-xl text-sm outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Contact name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={businessForm.contactName}
                        onChange={(e) => setBusinessForm({...businessForm, contactName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#302F80] rounded-xl text-sm outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Work location</label>
                      <input
                        type="text"
                        placeholder="Area in Panipat"
                        value={businessForm.workLocation}
                        onChange={(e) => setBusinessForm({...businessForm, workLocation: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#302F80] rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">What support do you need?</label>
                      <textarea
                        rows={3}
                        placeholder="Choose a role or describe the task"
                        value={businessForm.supportNeed}
                        onChange={(e) => setBusinessForm({...businessForm, supportNeed: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#302F80] rounded-xl text-sm outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#302F80] hover:bg-[#201F53] text-white font-bold rounded-xl transition shadow-md mt-4"
                    >
                      Register business interest
                    </button>
                  </form>

                  <p className="text-xs text-[#62677D] mt-4 text-center">
                    By registering, you’re expressing interest—not confirming a job or shift.
                  </p>
                </div>
              )}

              {/* Worker Form */}
              {(activeFormTab === 'both' || activeFormTab === 'worker') && (
                <div className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-[#E4F7F3] text-[#18A999] text-xs font-bold rounded-full">
                      WORKER WAITLIST
                    </span>
                    <Users className="w-5 h-5 text-[#18A999]" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#181A32] mb-2">Let us know what you can do</h3>
                  <p className="text-sm text-[#62677D] mb-6">Share a few details so we can explore suitable opportunities.</p>

                  <form onSubmit={handleWorkerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Full name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={workerForm.fullName}
                        onChange={(e) => setWorkerForm({...workerForm, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#18A999] rounded-xl text-sm outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Locality</label>
                      <input
                        type="text"
                        placeholder="Where are you based in Panipat?"
                        value={workerForm.locality}
                        onChange={(e) => setWorkerForm({...workerForm, locality: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#18A999] rounded-xl text-sm outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Experience or skills</label>
                      <input
                        type="text"
                        placeholder="What kind of work have you done?"
                        value={workerForm.experience}
                        onChange={(e) => setWorkerForm({...workerForm, experience: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#18A999] rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181A32] uppercase mb-1.5">Availability</label>
                      <input
                        type="text"
                        placeholder="Days and daytime hours"
                        value={workerForm.availability}
                        onChange={(e) => setWorkerForm({...workerForm, availability: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#18A999] rounded-xl text-sm outline-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#18A999] hover:bg-[#128679] text-white font-bold rounded-xl transition shadow-md mt-4"
                    >
                      Register worker interest
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

        {/* 08 — Frequently asked questions */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold text-[#18A999] tracking-widest uppercase mb-2 block">
                GOOD TO KNOW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4">
                A few things worth making clear
              </h2>
              <p className="text-base text-[#62677D]">
                We’re starting small, learning from real local needs and keeping the first experience straightforward.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Where is Kovera starting?",
                  a: "The initial validation and pilot focus is Panipat, Haryana."
                },
                {
                  q: "Is there a mobile app?",
                  a: "Not in this phase. We’re starting with a web-first experience to keep joining simple."
                },
                {
                  q: "Are shifts guaranteed after I register?",
                  a: "No. Registration helps us understand demand and worker availability. A shift is only confirmed after suitability and availability are checked."
                },
                {
                  q: "What kinds of jobs are in scope?",
                  a: "Clearly defined, non-specialized support roles in daytime public workplaces. Hazardous, private-home, night and specialist work are outside the initial pilot."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F7F8FC] rounded-2xl border border-[#EEEFFC] overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-lg text-[#181A32] hover:text-[#302F80]"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-[#18A999] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#62677D] shrink-0" />
                    )}
                  </button>

                  {expandedFaq === idx && (
                    <div className="px-6 pb-6 text-base text-[#62677D] leading-relaxed border-t border-[#EEEFFC] pt-4">
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
                  onClick={() => scrollToSection('waitlist')}
                  className="text-[#302F80] font-bold underline hover:text-[#18A999]"
                >
                  Join the waitlist and tell us what you’re looking for.
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 09 — Footer */}
      <footer className="bg-[#201F53] text-white pt-16 pb-12 border-t border-[#39386F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#39386F]">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">kovera</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#18A999]" />
              </div>
              <p className="text-[#D9DDF1] text-sm font-medium">Local work, better connected.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#D9DDF1]">
              <button onClick={() => scrollToSection('marketplace')} className="hover:text-white transition">For businesses</button>
              <button onClick={() => scrollToSection('marketplace')} className="hover:text-white transition">For workers</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">How it works</button>
              <button onClick={() => scrollToSection('trust')} className="hover:text-white transition">Our approach</button>
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
