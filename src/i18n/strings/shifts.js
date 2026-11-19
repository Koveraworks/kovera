/**
 * "What a shift looks like" section: pick a type of shop to see the work, the
 * limits and the usual hours, plus the facts that hold for every shift. No pay
 * figures until the pilot has real ones: pay is agreed before each shift.
 * Per-category text is keyed by category id (see CATEGORY_IDS in src/data/rates.js).
 */
export default {
  en: {
    title: 'What a shift looks like',
    sub: 'Pick a type of shop to see the work and the usual hours. Pay is agreed and shown before every shift.',
    categoryLabel: 'Type of shop',
    lengthPill: 'Usually 4 hours',

    work: {
      boutique: 'Greet customers, fold and arrange clothes, help with trial rooms and keep the floor tidy.',
      handloom: 'Greet customers, fold and stack stock, and help get ready for festival and weekend rush.',
      cafe: 'Help at the counter in the rush, pack takeaway orders and clear tables.',
      salon: 'Set up stations, fold towels, greet clients and keep work areas clean. No hair or skin treatments.',
    },
    // What the work does not include, per category.
    limits: {
      boutique: 'No heavy lifting or machines.',
      handloom: 'Light work only, no heavy loads.',
      cafe: 'Counter and tables only.',
      salon: 'Helper tasks only.',
    },
    typicalHoursLabel: 'Typical hours',
    typicalHours: {
      boutique: 'Between 12pm and 8pm',
      handloom: 'Between 11am and 7pm',
      cafe: 'Between 12pm and 8pm',
      salon: 'Between 11am and 7pm',
    },

    // The same for every shift, whatever the shop.
    everyShiftLabel: 'Every shift',
    daytimeLabel: 'Shift hours',
    daytimeValue: 'Daytime only, 8am to 8pm',
    payLabel: 'Pay',
    payValue: 'Agreed and shown before every shift',
    paidLabel: 'Paid',
    paidValue: 'Directly to the worker when the shift ends, with nothing deducted',
    feeLabel: 'Kovera fee',
    feeValue: 'None during the pilot, and never for workers',
    matchLabel: 'Target match time',
    matchValue: 'Within 30 minutes',

    ctaBusiness: {
      boutique: 'Find help for my boutique',
      handloom: 'Find help for my textile shop',
      cafe: 'Find help for my café',
      salon: 'Find help for my salon',
    },
    ctaWorker: {
      boutique: 'Find work at a boutique',
      handloom: 'Find work at a textile shop',
      cafe: 'Find work at a café',
      salon: 'Find work at a salon',
    },
  },
  hi: {
    title: 'शिफ्ट में क्या होता है',
    sub: 'चुनें कि दुकान किस तरह की है, और देखें कि काम क्या है और आम तौर पर कब होता है। भुगतान हर शिफ्ट से पहले तय होता है और आपको बता दिया जाता है।',
    categoryLabel: 'किस तरह की दुकान',
    lengthPill: 'आम तौर पर 4 घंटे',

    work: {
      boutique: 'ग्राहकों का स्वागत, कपड़े तह करके सजाना, ट्रायल रूम में मदद और दुकान साफ़-सुथरी रखना।',
      handloom: 'ग्राहकों का स्वागत, माल तह करके लगाना, त्योहार और वीकेंड की भीड़ की तैयारी में मदद।',
      cafe: 'भीड़ के समय काउंटर पर मदद, टेकअवे ऑर्डर पैक करना और टेबल साफ़ करना।',
      salon: 'कुर्सी और सामान तैयार रखना, तौलिए तह करना, ग्राहकों का स्वागत और जगह साफ़ रखना। बाल या स्किन का कोई ट्रीटमेंट नहीं।',
    },
    limits: {
      boutique: 'भारी सामान या मशीन का काम नहीं।',
      handloom: 'सिर्फ़ हल्का काम, भारी बोझ नहीं।',
      cafe: 'सिर्फ़ काउंटर और टेबल का काम।',
      salon: 'सिर्फ़ मदद का काम।',
    },
    typicalHoursLabel: 'आम तौर पर समय',
    typicalHours: {
      boutique: 'दोपहर 12 से शाम 8 बजे के बीच',
      handloom: 'सुबह 11 से शाम 7 बजे के बीच',
      cafe: 'दोपहर 12 से शाम 8 बजे के बीच',
      salon: 'सुबह 11 से शाम 7 बजे के बीच',
    },

    everyShiftLabel: 'हर शिफ्ट में',
    daytimeLabel: 'शिफ्ट का समय',
    daytimeValue: 'सिर्फ़ दिन में, सुबह 8 से शाम 8 बजे तक',
    payLabel: 'भुगतान',
    payValue: 'हर शिफ्ट से पहले तय होता है और बता दिया जाता है',
    paidLabel: 'भुगतान कब',
    paidValue: 'शिफ्ट ख़त्म होते ही सीधे वर्कर को, बिना किसी कटौती के',
    feeLabel: 'Kovera की फ़ीस',
    feeValue: 'पायलट में कोई फ़ीस नहीं, और वर्कर से कभी नहीं',
    matchLabel: 'मैच का लक्ष्य',
    matchValue: '30 मिनट के अंदर',

    ctaBusiness: {
      boutique: 'मेरे बुटीक के लिए वर्कर चाहिए',
      handloom: 'मेरी कपड़े की दुकान के लिए वर्कर चाहिए',
      cafe: 'मेरे कैफ़े के लिए वर्कर चाहिए',
      salon: 'मेरे सैलून के लिए वर्कर चाहिए',
    },
    ctaWorker: {
      boutique: 'बुटीक में काम चाहिए',
      handloom: 'कपड़े की दुकान पर काम चाहिए',
      cafe: 'कैफ़े में काम चाहिए',
      salon: 'सैलून में काम चाहिए',
    },
  },
};
