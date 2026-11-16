/**
 * Shifts and rates section: one category list, a business view (cost of one
 * shift) and a worker view (example monthly income). Numbers live in the
 * component; per-category text is keyed by category id (see src/data/rates.js).
 */
export default {
  en: {
    title: 'What a shift looks like, and what it pays',
    sub: 'Pick a type of shop to see the work, the hours and example pay, shown up front.',
    sideLabel: 'Show numbers for',
    sideBusiness: 'Shift cost',
    sideWorker: 'What I could earn',

    categoryLabel: 'Type of shop',
    lengthLabel: 'Shift length',
    lengthNote: 'Daytime only, 8am to 8pm',
    lengths: {
      4: 'busy hours',
      6: 'half day',
      8: 'full day',
    },
    perWeekLabel: 'Shifts per week',
    perWeekNote: 'Estimate uses 4-hour daytime shifts',
    shiftOne: '1 shift',
    shiftMany: '{n} shifts',

    work: {
      boutique: 'Greet customers, fold and arrange clothes, help with trial rooms and keep the floor tidy.',
      handloom: 'Greet customers, fold and stack stock, and help get ready for festival and weekend rush.',
      cafe: 'Help at the counter in the rush, pack takeaway orders and clear tables.',
      salon: 'Set up stations, fold towels, greet clients and keep work areas clean. No hair or skin treatments.',
    },
    typicalHoursLabel: 'Typical hours',
    typicalHours: {
      boutique: 'Between 12pm and 8pm',
      handloom: 'Between 11am and 7pm',
      cafe: 'Between 12pm and 8pm',
      salon: 'Between 11am and 7pm',
    },

    bizEstimateLabel: 'Example pay for a {n}-hour shift',
    pilotFeeLabel: 'Kovera pilot fee',
    pilotFeeValue: '₹0, the pilot is free',
    paymentLabel: 'Payment',
    paymentValue: 'Paid directly to the worker when the shift ends',
    matchLabel: 'Target match time',
    matchValue: 'Within 30 minutes',

    workerEstimateLabel: 'Example extra income per month',
    basisOne: 'Based on 1 four-hour shift a week, 4 weeks a month',
    basisMany: 'Based on {n} four-hour shifts a week, 4 weeks a month',
    perShiftLabel: 'Per shift (4 hours)',
    perWeekFactLabel: 'Per week',
    workerFeeLabel: 'Worker fee',
    workerFeeValue: '₹0, you keep all of it',

    // What the work does not include, per category.
    limits: {
      boutique: 'No heavy lifting or machines.',
      handloom: 'Light work only, no heavy loads.',
      cafe: 'Counter and tables only.',
      salon: 'Helper tasks only.',
    },

    ctaBusiness: 'Join with this shift',
    ctaWorker: 'Join for shifts like this',
  },
  hi: {
    title: 'शिफ्ट में क्या काम होता है, और कितना भुगतान मिलता है',
    sub: 'चुनें कि दुकान किस तरह की है। काम, समय और भुगतान का उदाहरण, सब पहले ही दिख जाएगा।',
    sideLabel: 'किसके लिए देखें',
    sideBusiness: 'वर्कर चाहिए: शिफ्ट का ख़र्च',
    sideWorker: 'काम चाहिए: कितनी कमाई हो सकती है',

    categoryLabel: 'किस तरह की दुकान',
    lengthLabel: 'शिफ्ट कितने घंटे की',
    lengthNote: 'सिर्फ़ दिन का समय, सुबह 8 से शाम 8 बजे तक',
    lengths: {
      4: 'भीड़ के घंटे',
      6: 'आधा दिन',
      8: 'पूरा दिन',
    },
    perWeekLabel: 'हफ़्ते में कितनी शिफ्ट',
    perWeekNote: 'अनुमान दिन की 4 घंटे की शिफ्ट के हिसाब से',
    shiftOne: '1 शिफ्ट',
    shiftMany: '{n} शिफ्ट',

    work: {
      boutique: 'ग्राहकों का स्वागत, कपड़े तह करके सजाना, ट्रायल रूम में मदद और दुकान साफ़-सुथरी रखना।',
      handloom: 'ग्राहकों का स्वागत, माल तह करके लगाना, त्योहार और वीकेंड की भीड़ की तैयारी में मदद।',
      cafe: 'भीड़ के समय काउंटर पर मदद, टेकअवे ऑर्डर पैक करना और टेबल साफ़ करना।',
      salon: 'कुर्सी और सामान तैयार रखना, तौलिए तह करना, ग्राहकों का स्वागत और जगह साफ़ रखना। बाल या स्किन का कोई ट्रीटमेंट नहीं।',
    },
    typicalHoursLabel: 'आम तौर पर समय',
    typicalHours: {
      boutique: 'दोपहर 12 से शाम 8 बजे के बीच',
      handloom: 'सुबह 11 से शाम 7 बजे के बीच',
      cafe: 'दोपहर 12 से शाम 8 बजे के बीच',
      salon: 'सुबह 11 से शाम 7 बजे के बीच',
    },

    bizEstimateLabel: 'उदाहरण: {n} घंटे की शिफ्ट का भुगतान',
    pilotFeeLabel: 'Kovera की पायलट फ़ीस',
    pilotFeeValue: '₹0, पायलट मुफ़्त है',
    paymentLabel: 'भुगतान',
    paymentValue: 'शिफ्ट ख़त्म होने पर सीधे वर्कर को',
    matchLabel: 'मैच का लक्ष्य',
    matchValue: '30 मिनट के अंदर',

    workerEstimateLabel: 'उदाहरण: हर महीने की एक्स्ट्रा कमाई',
    basisOne: 'हफ़्ते में 1 शिफ्ट (4 घंटे) और महीने में 4 हफ़्ते के हिसाब से',
    basisMany: 'हफ़्ते में {n} शिफ्ट (हर शिफ्ट 4 घंटे) और महीने में 4 हफ़्ते के हिसाब से',
    perShiftLabel: 'हर शिफ्ट (4 घंटे)',
    perWeekFactLabel: 'हर हफ़्ते',
    workerFeeLabel: 'वर्कर की फ़ीस',
    workerFeeValue: '₹0, पूरा भुगतान आपका',

    limits: {
      boutique: 'भारी सामान या मशीन का काम नहीं।',
      handloom: 'सिर्फ़ हल्का काम, भारी बोझ नहीं।',
      cafe: 'सिर्फ़ काउंटर और टेबल का काम।',
      salon: 'सिर्फ़ मदद का काम।',
    },

    ctaBusiness: 'इस शिफ्ट के साथ जुड़ें',
    ctaWorker: 'ऐसी शिफ्ट के लिए जुड़ें',
  },
};
