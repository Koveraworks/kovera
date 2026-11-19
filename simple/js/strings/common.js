/**
 * Strings shared by more than one section.
 *
 * Hindi style: everyday spoken Hindi in Devanagari, formal "आप", short
 * sentences. Familiar English words stay as loanwords (शिफ्ट, वर्कर,
 * बिज़नेस, वेटलिस्ट). "Kovera", "WhatsApp", ₹ and digits stay in Latin script.
 */
K.strings.common = {
  en: {
    meta: {
      title: 'Kovera · Local work, better connected',
      description: 'Kovera connects local shops with dependable short-term help for the shifts that keep business moving. Pilot starting in Panipat, Haryana.',
    },
    tagline: 'Your local backup workforce, on demand.',
    skip: 'Skip to content',
    cta: {
      join: 'Join the waitlist',
      needWorkers: 'I need workers',
      // Short on purpose: it is also a segment in the waitlist chooser, which
      // must fit beside "I need workers" on a 320px screen.
      wantWork: 'I want work',
      whatsapp: 'WhatsApp us',
    },
    side: {
      business: 'For businesses',
      worker: 'For workers',
    },
    // Category ids: boutique, handloom, cafe, salon (see src/data/rates.js)
    categories: {
      boutique: 'Boutique',
      handloom: 'Textiles',
      cafe: 'Café',
      salon: 'Salon',
    },
    // Area ids: insar, model-town, sector-11-12, gt-road
    areas: {
      insar: 'Insar Bazaar',
      'model-town': 'Model Town',
      'sector-11-12': 'Sector 11 & 12 (HUDA)',
      'gt-road': 'GT Road',
    },
    example: 'Example',
    exampleRateNote: '*Example rates. Actual pay is agreed with both sides before each shift.',
    zeroFee: '₹0 platform fee',
    perHour: 'per hour',
    hours: '{n} hours',
    // Prefilled WhatsApp messages, by where the button sits.
    whatsapp: {
      urgent: 'Hello Kovera team, I need shift support today.',
      question: 'Hello Kovera team, I have a question.',
      joinedBusiness: 'Hello Kovera team, I just joined the waitlist as a business.',
      joinedWorker: 'Hello Kovera team, I just joined the waitlist as a worker.',
    },
  },
  hi: {
    meta: {
      title: 'Kovera · आपके इलाक़े का काम, बेहतर तरीक़े से',
      description: 'Kovera आस-पास की दुकानों को कुछ घंटों की शिफ्ट के लिए भरोसेमंद वर्कर से जोड़ता है। पायलट की शुरुआत पानीपत, हरियाणा से।',
    },
    tagline: 'ज़रूरत पड़ने पर, आपके इलाक़े की बैकअप टीम।',
    skip: 'सीधे मुख्य हिस्से पर जाएँ',
    cta: {
      join: 'वेटलिस्ट में जुड़ें',
      needWorkers: 'मुझे वर्कर चाहिए',
      wantWork: 'मुझे काम चाहिए',
      whatsapp: 'WhatsApp करें',
    },
    side: {
      business: 'बिज़नेस के लिए',
      worker: 'वर्कर के लिए',
    },
    categories: {
      boutique: 'बुटीक',
      handloom: 'कपड़ा उद्योग',
      cafe: 'कैफ़े',
      salon: 'सैलून',
    },
    areas: {
      insar: 'इंसार बाज़ार',
      'model-town': 'मॉडल टाउन',
      'sector-11-12': 'सेक्टर 11 और 12 (हुडा)',
      'gt-road': 'जीटी रोड',
    },
    example: 'उदाहरण',
    exampleRateNote: '*ये उदाहरण के रेट हैं। असली भुगतान हर शिफ्ट से पहले बिज़नेस और वर्कर, दोनों से बात करके तय होता है।',
    zeroFee: '₹0 प्लेटफ़ॉर्म फ़ीस',
    perHour: 'प्रति घंटा',
    hours: '{n} घंटे',
    whatsapp: {
      urgent: 'नमस्ते Kovera टीम, मुझे आज शिफ्ट के लिए मदद चाहिए।',
      question: 'नमस्ते Kovera टीम, मुझे कुछ पूछना है।',
      joinedBusiness: 'नमस्ते Kovera टीम, मैंने अभी बिज़नेस के तौर पर वेटलिस्ट में नाम जोड़ा है।',
      joinedWorker: 'नमस्ते Kovera टीम, मैंने अभी वर्कर के तौर पर वेटलिस्ट में नाम जोड़ा है।',
    },
  },
};
