"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MiniCalendar({ selectedDate, onSelectDate }: { selectedDate: Date | null; onSelectDate: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() && 
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-white dark:bg-slate-50 text-[85%]">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-0.5">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          
          return (
            <button
              key={day}
              onClick={() => !isPast && onSelectDate(date)}
              disabled={isPast}
              className={`aspect-square p-1 text-sm rounded-lg transition-all ${
                isSelected(day) 
                  ? 'bg-[#C5A059] text-white font-bold' 
                  : isToday(day)
                  ? 'bg-[#C5A059] text-white font-semibold'
                  : isPast
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [pattayaText, setPattayaText] = useState('');
  const [showBounce, setShowBounce] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = ['/hero-image.jpg', '/kate-ibragimova-bEGTsOCnHro-unsplash.jpg'];
  
  const heroRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const contactBarRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for Pattaya
  useEffect(() => {
    const cityName = language === 'en' ? 'Pattaya' : 'พัทยา';
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= cityName.length) {
        setPattayaText(cityName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Trigger bounce after typing completes
        setTimeout(() => setShowBounce(true), 200);
        setTimeout(() => setShowBounce(false), 800);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [language]);

  // Auto-rotate hero images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Hero Parallax
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Trust Badges - Stagger from left with bounce
    if (badgesRef.current) {
      const badges = badgesRef.current.children;
      gsap.fromTo(badges,
        { x: -100, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: badgesRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // Contact Bar - Slide up
    if (contactBarRef.current) {
      gsap.from(contactBarRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contactBarRef.current,
          start: "top 90%",
          once: true
        }
      });
    }

    // Why Choose Us Cards - Stagger reveal
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.value-card');
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            once: true
          }
        }
      );
    }

    // Reviews - Fade in
    if (reviewsRef.current) {
      const reviewCards = reviewsRef.current.querySelectorAll('.review-card');
      gsap.fromTo(reviewCards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [language]);

  const t = {
    en: {
      logo: "AutoFix",
      heroTitle: "Expert Car Service You Can Trust",
      heroDesc: "Professional service • Honest pricing",
      badge1: "DLT Certified",
      badge2: "10+ Years Experience",
      badge3: "Genuine Parts",
      ctaButton: "Book Service Now",
      whyChooseTitle: "Why Choose Us",
      promoTitle: "Special Offer!",
      promoText: "Free 25-point check for new customers",
      reviewsTitle: "Customer Reviews",
      footerHours: "Business Hours",
      footerPayment: "Payment Methods",
      footerContact: "Contact Us",
      tel: "Tel",
      facebook: "Facebook Page",
      footerCopyright: "© 2026 AutoFix. Professional Car Repair Service",
      bookingTitle: "Book Appointment",
      step1Name: "Your Name",
      step1Phone: "Phone Number",
      step1Email: "Email",
      step2Service: "Select Service",
      step2Vehicle: "Vehicle Make & Model",
      step3Date: "Preferred Date",
      step3Time: "Preferred Time",
      step3Notes: "Additional Notes (Optional)",
      notesPlaceholder: "Any specific concerns or requests...",
      next: "Next",
      back: "Back",
      submit: "Submit",
      mapTitle: "Our Location",
      mon: "Mon-Fri",
      sat: "Sat",
      sun: "Sun",
      closed: "Closed"
    },
    th: {
      logo: "ออโต้ฟิกซ์",
      heroTitle: "ซ่อมรถยนต์มืออาชีพ ไว้ใจได้",
      heroDesc: "บริการมืออาชีพ • ราคายุติธรรม",
      badge1: "รับรองโดย คมธ.",
      badge2: "ประสบการณ์ 10+ ปี",
      badge3: "อะไหล่แท้",
      ctaButton: "จองบริการเลย",
      whyChooseTitle: "ทำไมต้องเลือกเรา",
      promoTitle: "โปรโมชั่นพิเศษ!",
      promoText: "ฟรี! ตรวจเช็ค 25 จุด สำหรับลูกค้าใหม่",
      reviewsTitle: "รีวิวจากลูกค้า",
      footerHours: "เวลาทำการ",
      footerPayment: "ช่องทางชำระเงิน",
      footerContact: "ติดต่อเรา",
      tel: "โทร",
      facebook: "เพจเฟซบุ๊ก",
      footerCopyright: "© 2026 ออโต้ฟิกซ์ ศูนย์บริการซ่อมรถยนต์มืออาชีพ",
      bookingTitle: "จองคิวซ่อม",
      step1Name: "ชื่อ-นามสกุล",
      step1Phone: "เบอร์โทรศัพท์",
      step1Email: "อีเมล",
      step2Service: "เลือกบริการ",
      step2Vehicle: "ยี่ห้อและรุ่นรถ",
      step3Date: "วันที่ต้องการ",
      step3Time: "เวลาที่ต้องการ",
      step3Notes: "หมายเหตุ (ถ้ามี)",
      notesPlaceholder: "ระบุปัญหาหรือความต้องการเพิ่มเติม...",
      next: "ถัดไป",
      back: "ย้อนกลับ",
      submit: "ยืนยันการจอง",
      mapTitle: "ที่อยู่ของเรา",
      mon: "จันทร์-ศุกร์",
      sat: "เสาร์",
      sun: "อาทิตย์",
      closed: "ปิด"
    }
  };
  const valueCards = [
    { 
      title: "Expert Mechanics", 
      titleTh: "ช่างผู้เชี่ยวชาญ", 
      desc: "Mechanics specializing in comprehensive vehicle repair with 10+ years expertise. Certified technicians delivering reliable service you can trust.",
      descTh: "ช่างเชี่ยวชาญด้านซ่อมรถครบวงจร ประสบการณ์ 10+ ปี ช่างรับรองคุณภาพให้บริการที่ไว้ใจได้",
      icon: "🔧",
      color: "from-[#C5A059] to-[#B8935A]",
      accentColor: "#C5A059"
    },
    { 
      title: "Fast Service", 
      titleTh: "บริการรวดเร็ว", 
      desc: "Same-day completion for most repairs with expert efficiency in Pattaya. Fast, reliable solutions backed by professional standards and quality parts without compromising safety.",
      descTh: "บริการซ่อมเสร็จภายในวันเดียวสำหรับงานส่วนใหญ่ด้วยความเชี่ยวชาญในพัทยา บริการรวดเร็วและเชื่อถือได้ รับรองมาตรฐานและคุณภาพอะไหล่โดยไม่ประนีประนอมความปลอดภัย",
      icon: "⏱️",
      color: "from-[#C5A059] to-[#B8935A]",
      accentColor: "#C5A059"
    },
    { 
      title: "Fair Pricing", 
      titleTh: "ราคายุติธรรม", 
      desc: "Fair, competitive pricing with no hidden fees or extra charges. Detailed cost estimates before any work begins, ensuring complete transparency.",
      descTh: "ราคายุติธรรมและแข่งขันได้ ไม่มีค่าบริการแอบแฝงหรือค่าใช้จ่ายเพิ่มเติม ประเมินราคาละเอียดก่อนเริ่มงาน รับรองความโปร่งใสทุกขั้นตอน",
      icon: "฿",
      color: "from-[#C5A059] to-[#B8935A]",
      accentColor: "#C5A059"
    }
  ];

  const reviews = [
    { name: "John D.", text: "Fast service, great prices!", rating: 5 },
    { name: "Sarah M.", text: "Professional and trustworthy team", rating: 5 },
    { name: "Mike R.", text: "Best repair shop in town", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-white transition-colors pb-20 md:pb-0">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[150] animate-fade-in px-4 w-full max-w-md">
          <div className="bg-gradient-to-r from-[#C5A059] to-[#B8935A] text-white px-4 md:px-6 py-3 md:py-4 rounded-lg shadow-2xl flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base md:text-lg mb-1">
                {language === 'th' ? 'จองสำเร็จ!' : 'Booking Confirmed!'}
              </h4>
              <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                {language === 'th' 
                  ? 'เราจะติดต่อกลับภายใน 24 ชั่วโมง ขอบคุณที่ไว้วางใจเรา' 
                  : 'We will contact you within 24 hours. Thank you for trusting us!'}
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessBanner(false)}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt={t[language].logo} 
              width={150} 
              height={45}
              className="h-10 w-auto"
              priority
            />
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
              className="px-2 py-1 flex items-center gap-1.5 opacity-70 hover:opacity-100"
              title={language === 'en' ? 'Switch to Thai' : 'Switch to English'}
            >
              {language === 'en' ? (
                // Thai Flag
                <>
                  <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm border border-slate-500">
                    <div className="h-[33.33%] bg-[#A51931]"></div>
                    <div className="h-[33.33%] bg-white"></div>
                    <div className="h-[33.33%] bg-[#2D2A4A]"></div>
                  </div>
                  <span className="text-slate-800 text-xs font-semibold">TH</span>
                </>
              ) : (
                // English Flag (UK)
                <>
                  <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm border border-slate-500 relative bg-[#012169]">
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 60 30" className="w-full h-full">
                        <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                        <clipPath id="t"><path d="M30,15 h30 v15 z v-30 h-30 z h-30 v15 z v-30 h30 z"/></clipPath>
                        <g clipPath="url(#s)">
                          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-800 text-xs font-semibold">EN</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Images with Diagonal Bands Transition */}
        <div ref={heroRef} className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0"
              style={{
                zIndex: currentHeroImage === index ? 2 : 1,
              }}
            >
              <Image 
                src={image} 
                alt="Car repair service" 
                fill
                className="object-cover object-center"
                priority={index === 0}
                quality={90}
              />
            </div>
          ))}
          
          {/* Diagonal Bands Overlay */}
          <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 10 }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={`band-${currentHeroImage}-${i}`}
                className="absolute h-full bg-black"
                style={{
                  width: '8%',
                  left: `${i * 5.5}%`,
                  transform: 'skewX(-20deg)',
                  transformOrigin: 'top left',
                  animation: `${i % 2 === 0 ? 'slideRevealUp' : 'slideRevealDown'} 1s ease-out ${i * 0.03}s forwards`,
                  opacity: 1,
                }}
              />
            ))}
          </div>
          
          {/* Simple Fade for Mobile */}
          <div className="absolute inset-0 md:hidden" style={{ zIndex: 10 }}>
            <div
              key={`mobile-fade-${currentHeroImage}`}
              className="absolute inset-0 bg-black"
              style={{
                animation: 'simpleFade 0.8s ease-out forwards',
                opacity: 1,
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" style={{ zIndex: 15 }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in text-white drop-shadow-2xl">
            {language === 'en' ? 'Car Repair in ' : 'ซ่อมรถยนต์ใน'}
            <span className={`inline-block ${showBounce ? 'animate-bounce' : ''}`}>
              {pattayaText}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-semibold max-w-2xl mx-auto mb-3 drop-shadow-lg">
            {language === 'en' ? 'Quality Service You Can Count On' : 'บริการคุณภาพที่คุณไว้วางใจได้'}
          </p>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-lg">
            {language === 'en' ? 'All Makes & Models • Fast Turnaround • No Hidden Fees' : 'ทุกยี่ห้อ ทุกรุ่น • ซ่อมเร็ว • ไม่มีค่าแอบแฝง'}
          </p>
          
          {/* Trust Badges */}
          <div ref={badgesRef} className="flex flex-wrap justify-center items-center gap-4 mb-8 text-sm">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg border border-white/20">✓ {t[language].badge1}</div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg border border-white/20">✓ {t[language].badge2}</div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg border border-white/20">✓ {t[language].badge3}</div>
          </div>

          <button onClick={() => { setShowBooking(true); setBookingStep(1); }} className="px-8 py-4 text-lg font-semibold rounded-full bg-[#C5A059] text-white hover:bg-[#B8935A] hover:scale-105 hover:shadow-2xl transition-all">
            {t[language].ctaButton}
          </button>
        </div>
      </section>

      {/* Quick Contact Bar - Hidden on mobile (sticky bar replaces it) */}
      <section ref={contactBarRef} className="hidden md:block bg-white dark:bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-slate-200">
          {/* Phone Section */}
          <a 
            href="tel:+66123456789" 
            className="flex flex-col items-center justify-center py-6 px-4 hover:bg-slate-50 transition-all group cursor-pointer"
          >
            <div className="mb-3 p-3 rounded-full group-hover:bg-[#C5A059] transition-colors">
              <svg className="w-6 h-6 text-[#C5A059] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-base font-bold text-slate-800">{language === 'th' ? 'โทรหาเรา' : 'Call Us'}</div>
          </a>

          {/* Maps Section */}
          <button 
            onClick={() => setShowMap(true)}
            className="flex flex-col items-center justify-center py-6 px-4 hover:bg-slate-50 transition-all group cursor-pointer"
          >
            <div className="mb-3 p-3 rounded-full group-hover:bg-[#C5A059] transition-colors">
              <svg className="w-6 h-6 text-[#C5A059] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-base font-bold text-slate-800">{language === 'th' ? 'ร้านพัทยา' : 'Our Pattaya Shop'}</div>
          </button>

          {/* LINE Section */}
          <a 
            href="https://line.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-6 px-4 hover:bg-slate-50 transition-all group cursor-pointer"
          >
            <div className="mb-3 p-3 rounded-full group-hover:bg-[#06C755] transition-colors">
              <svg className="w-7 h-7 text-[#06C755] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
            </div>
            <div className="text-xs text-slate-500 mb-1">{language === 'th' ? 'แชทกับเรา' : 'Chat with Us'}</div>
            <div className="text-sm font-bold text-[#1E293B] text-slate-800">LINE</div>
          </a>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1E293B] text-slate-800">{t[language].whyChooseTitle}</h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Special Promo Card */}
          <div className="value-card group p-8 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#B8935A] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 border-[#C5A059]/30 shadow-lg relative overflow-hidden">
            {/* NEW Badge */}
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
              <span className="text-xs font-bold text-[#C5A059]">{language === 'th' ? 'ใหม่' : 'NEW'}</span>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-bold mb-3 text-white text-2xl">{language === 'th' ? 'โปรโมชั่นลูกค้าใหม่' : 'New Customer Special'}</h3>
                <p className="text-base font-semibold text-white/95 leading-relaxed">
                  {language === 'th' ? 'ตรวจเช็ครถฟรี 25 จุดในพัทยา — บริการครบถ้วนมูลค่า' : 'Free 25-point car inspection in Pattaya — comprehensive check worth'}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <div className="px-3 py-1.5 bg-white rounded-lg shadow-lg animate-pulse">
                  <span className="text-lg font-extrabold text-[#C5A059]">฿5,500</span>
                </div>
              </div>
            </div>
          </div>
          
          {valueCards.map((card, i) => (
            <div 
              key={i} 
              className="value-card group p-8 rounded-xl bg-white border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 shadow-sm relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <h3 className="font-bold mb-3 text-slate-800 text-2xl">
                  {language === 'th' ? card.titleTh : card.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {language === 'th' ? card.descTh : card.desc}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section ref={reviewsRef} className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1E293B] text-slate-800">{t[language].reviewsTitle}</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="review-card p-6 rounded-xl bg-white dark:bg-white border border-slate-200 hover:scale-105 hover:shadow-xl transition-all shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[#FBBF24] text-xl">★★★★★</div>
                  <span className="text-sm text-slate-500">Google Reviews</span>
                </div>
                <p className="mb-4 text-slate-600 italic">"{r.text}"</p>
                <p className="font-semibold text-[#1E293B] text-slate-800">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <Image 
                  src="/logo.svg" 
                  alt={t[language].logo} 
                  width={120} 
                  height={36}
                  className="h-8 w-auto mb-4"
                />
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {language === 'th' 
                  ? 'ศูนย์บริการซ่อมรถยนต์มืออาชีพในพัทยา ไว้ใจได้ มีคุณภาพ' 
                  : 'Expert car service in Pattaya built on trust and excellence'}
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-[#C5A059] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-[#C5A059] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-[#1E293B] text-slate-800 mb-4 text-sm uppercase tracking-wide">{t[language].footerContact}</h3>
              <div className="space-y-3">
                <a href="tel:+66123456789" className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm">012-345-6789</span>
                </a>
                <a href="mailto:info@autofix.com" className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm">info@autofix.com</span>
                </a>
              </div>
            </div>

            {/* Hours & Payment */}
            <div>
              <h3 className="font-bold text-[#1E293B] text-slate-800 mb-4 text-sm uppercase tracking-wide">{t[language].footerHours}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{t[language].mon}</span>
                  <span className="text-slate-600 font-semibold">08:00-18:00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{t[language].sat}</span>
                  <span className="text-slate-600 font-semibold">08:00-17:00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{t[language].sun}</span>
                  <span className="text-red-400 font-semibold">{t[language].closed}</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[#1E293B] text-slate-800 mb-4 text-sm uppercase tracking-wide">{t[language].footerPayment}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>PromptPay</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cash</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 pt-8">
            <p className="text-slate-700 text-sm text-center">
              {t[language].footerCopyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-2xl">
        <div className="grid grid-cols-3 divide-x divide-slate-200">
          <a 
            href="tel:+66123456789" 
            className="flex flex-col items-center justify-center py-3 px-2 active:bg-slate-50 transition-colors group"
          >
            <svg className="w-6 h-6 text-[#C5A059] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs font-semibold text-slate-800">{language === 'th' ? 'โทรหาเรา' : 'Call Us'}</span>
          </a>
          
          <button 
            onClick={() => setShowMap(true)}
            className="flex flex-col items-center justify-center py-3 px-2 active:bg-slate-50 transition-colors group"
          >
            <svg className="w-6 h-6 text-[#C5A059] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-semibold text-slate-800">{language === 'th' ? 'ร้านพัทยา' : 'Our Pattaya Shop'}</span>
          </button>
          
          <a 
            href="https://line.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 active:bg-slate-50 transition-colors group"
          >
            <svg className="w-6 h-6 text-[#06C755] mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span className="text-xs font-semibold text-slate-800">LINE</span>
          </a>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowBooking(false)}>
          <div className="bg-white dark:bg-white rounded-2xl max-w-md w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1E293B] text-slate-800">{t[language].bookingTitle}</h3>
              <button onClick={() => setShowBooking(false)} className="text-2xl hover:bg-slate-100 w-8 h-8 rounded-lg transition-colors text-slate-800">×</button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 p-6 pb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${bookingStep >= step ? 'bg-[#C5A059] text-white' : 'bg-slate-200 dark:bg-slate-100 text-slate-500'}`}>
                    {step}
                  </div>
                  {step < 3 && <div className={`w-12 h-1 ${bookingStep > step ? 'bg-[#C5A059]' : 'bg-slate-200 dark:bg-slate-100'}`} />}
                </div>
              ))}
            </div>

            <div className="p-6 pt-2">
              {/* Step 1: Contact Info */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step1Name}</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]" placeholder={language === 'th' ? 'กรอกชื่อของคุณ' : 'Enter your name'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step1Phone}</label>
                    <input type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]" placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter your phone number'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step1Email}</label>
                    <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]" placeholder={language === 'th' ? 'กรอกอีเมล์ของคุณ' : 'Enter your email'} />
                  </div>
                  <button onClick={() => setBookingStep(2)} className="w-full px-6 py-3 rounded-lg bg-[#C5A059] text-white font-semibold hover:bg-[#B8935A] hover:scale-105 transition-all">
                    {t[language].next}
                  </button>
                </div>
              )}

              {/* Step 2: Service Selection */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step2Service}</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-white text-zinc-900 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]">
                      <option>Oil Change</option>
                      <option>Brake Service</option>
                      <option>Engine Diagnostics</option>
                      <option>Tire Service</option>
                      <option>Battery Check</option>
                      <option>AC Repair</option>
                      <option>Transmission</option>
                      <option>Full Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step2Vehicle}</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]" placeholder={language === 'th' ? 'กรอกยี่ห้อและรุ่นรถ' : 'Enter your vehicle make and model'} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setBookingStep(1)} className="flex-1 px-6 py-3 rounded-lg border border-slate-200 font-semibold hover:bg-slate-100 transition-colors text-slate-800">
                      {t[language].back}
                    </button>
                    <button onClick={() => setBookingStep(3)} className="flex-1 px-6 py-3 rounded-lg bg-[#C5A059] text-white font-semibold hover:bg-[#B8935A] hover:scale-105 transition-all">
                      {t[language].next}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step3Date}</label>
                    <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step3Time}</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-white text-zinc-900 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>1:00 PM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                      <option>5:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-800">{t[language].step3Notes}</label>
                    <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059]" rows={3} placeholder={t[language].notesPlaceholder}></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setBookingStep(2)} className="flex-1 px-6 py-3 rounded-lg border border-slate-200 font-semibold hover:bg-slate-100 transition-colors text-slate-800">
                      {t[language].back}
                    </button>
                    <button onClick={() => { 
                      setShowBooking(false); 
                      setShowSuccessBanner(true);
                      setBookingStep(1);
                      setTimeout(() => setShowSuccessBanner(false), 8000);
                    }} className="flex-1 px-6 py-3 rounded-lg bg-[#C5A059] text-white font-semibold hover:bg-[#B8935A] hover:scale-105 transition-all">
                      {t[language].submit}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowMap(false)}>
          <div className="bg-white dark:bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1E293B] text-slate-800">{t[language].mapTitle}</h3>
              <button onClick={() => setShowMap(false)} className="text-2xl hover:bg-slate-100 w-8 h-8 rounded-lg transition-colors text-slate-800">×</button>
            </div>
            <div className="w-full h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.6449276897165!2d100.5237!3d13.7367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzEyLjEiTiAxMDDCsDMxJzI1LjMiRQ!5e0!3m2!1sen!2sth!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
