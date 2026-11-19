/**
 * Shifts section: pick a type of shop to see the work, the usual hours and
 * how pay works. No pay figures: pay is agreed for each shift (common.payAgreed).
 * Per-category text is keyed by category id (see src/data/rates.js); shift
 * lengths are keyed by hours and the numbers live in the component.
 */
export default {
  en: {
    title: 'What a shift looks like',
    sub: 'Pick a type of shop to see the work, the usual hours and how pay works.',

    categoryLabel: 'Type of shop',
    roles: {
      boutique: 'Floor and trial room help',
      handloom: 'Shop floor and stock help',
      cafe: 'Counter and table help',
      salon: 'Front desk and setup help',
    },
    lengthLabel: 'Shift lengths',
    lengthNote: 'Daytime only, 8am to 8pm',
    lengths: {
      4: 'busy hours',
      6: 'half day',
      8: 'full day',
    },

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

    payTitle: 'How pay works',
    paymentLabel: 'Payment',
    paymentValue: 'Paid directly to the worker when the shift ends',
    workerFeeLabel: 'Worker fee',
    workerFeeValue: 'None, workers keep all of it',
    pilotFeeLabel: 'Kovera fee for shops',
    pilotFeeValue: 'Free during the pilot',
    matchLabel: 'Target match time',
    matchValue: 'Within 30 minutes',
  },
  hi: {
    title: 'शिफ्ट में क्या काम होता है',
    sub: 'चुनें कि दुकान किस तरह की है। काम, आम तौर पर समय और भुगतान कैसे होता है, सब पहले ही दिख जाएगा।',

    categoryLabel: 'किस तरह की दुकान',
    roles: {
      boutique: 'दुकान और ट्रायल रूम में मदद',
      handloom: 'दुकान और माल सँभालने में मदद',
      cafe: 'काउंटर और टेबल पर मदद',
      salon: 'रिसेप्शन और तैयारी में मदद',
    },
    lengthLabel: 'शिफ्ट कितने घंटे की',
    lengthNote: 'सिर्फ़ दिन का समय, सुबह 8 से शाम 8 बजे तक',
    lengths: {
      4: 'भीड़ के घंटे',
      6: 'आधा दिन',
      8: 'पूरा दिन',
    },

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

    payTitle: 'भुगतान कैसे होता है',
    paymentLabel: 'भुगतान',
    paymentValue: 'शिफ्ट ख़त्म होने पर सीधे वर्कर को',
    workerFeeLabel: 'वर्कर की फ़ीस',
    workerFeeValue: 'कोई नहीं, पूरा भुगतान वर्कर का',
    pilotFeeLabel: 'दुकानों के लिए Kovera की फ़ीस',
    pilotFeeValue: 'पायलट के दौरान मुफ़्त',
    matchLabel: 'मैच का लक्ष्य',
    matchValue: '30 मिनट के अंदर',
  },
};
