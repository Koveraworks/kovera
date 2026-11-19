/**
 * Hero: the page's h1, the two main buttons and the example match card.
 * Scenario keys match the category ids in src/data/rates.js.
 * Numbers (minutes, hours, pay) live in the component and fill {placeholders}.
 */
K.strings.hero = {
  en: {
    pilot: 'Pilot starts in Panipat, Haryana',
    headline: {
      lead: 'Good work starts with',
      accent: 'the right people.',
    },
    intro: 'One missing person can throw off a whole day. Kovera connects local boutiques, salons, cafés and shops with dependable daytime help for short shifts, often just 4 hours.',
    trust: {
      adults: 'Adults (18+) with an ID check',
      zeroFee: '₹0 fee for workers',
      daytime: 'Daytime shifts',
    },
    card: {
      title: 'Example of a Kovera match',
      switchLabel: 'Choose an example shop',
      requestLabel: 'Example request from a shop',
      bridge: 'Target: matched within {n} minutes',
      workerLabel: 'Example worker match',
      workerMeta: '18+ · ID checked · about {n} minutes away',
      payLabel: 'Example pay for {hours} hours:',
      payValue: '{range}*',
      payTerms: '₹0 fee for the worker · paid directly',
    },
    scenarios: {
      handloom: {
        role: 'Shop floor helper',
        place: 'Sharma Handlooms · Insar Bazaar',
        hours: '2pm to 6pm',
        task: 'Greet customers and fold festival stock.',
        worker: 'Priya S.',
        workerArea: 'Lives in Model Town',
      },
      boutique: {
        role: 'Fitting room and display helper',
        place: 'Aura Designer Studio · Model Town',
        hours: '1pm to 5pm',
        task: 'Manage the trial room queue and steam garments.',
        worker: 'Neha K.',
        workerArea: 'Lives in Sector 11',
      },
      cafe: {
        role: 'Rush-hour helper',
        place: 'Chai & Chaat Corner · Sector 12 Market',
        hours: '4pm to 8pm',
        task: 'Help at the counter, run orders and clear tables.',
        worker: 'Aman V.',
        workerArea: 'Lives in Tehsil Camp',
      },
    },
  },
  hi: {
    pilot: 'पायलट पानीपत, हरियाणा से शुरू',
    headline: {
      lead: 'अच्छे काम की शुरुआत',
      accent: 'सही लोगों से',
    },
    intro: 'किसी एक के न आने से पूरा दिन बिगड़ सकता है। Kovera आस-पास के बुटीक, सैलून, कैफ़े और दुकानों को दिन के समय छोटी शिफ्ट के लिए भरोसेमंद वर्कर से जोड़ता है, अक्सर बस 4 घंटे के लिए।',
    trust: {
      adults: '18+ वयस्क, पहचान की जाँच के साथ',
      zeroFee: 'वर्कर के लिए ₹0 फ़ीस',
      daytime: 'दिन की शिफ्ट',
    },
    card: {
      title: 'Kovera मैच का एक उदाहरण',
      switchLabel: 'उदाहरण के लिए दुकान चुनें',
      requestLabel: 'उदाहरण: दुकान की रिक्वेस्ट',
      bridge: 'लक्ष्य: {n} मिनट के अंदर मैच',
      workerLabel: 'उदाहरण: वर्कर का मैच',
      workerMeta: '18+ · पहचान जाँची हुई · क़रीब {n} मिनट दूर',
      payLabel: '{hours} घंटे के भुगतान का उदाहरण:',
      payValue: '{range}*',
      payTerms: 'वर्कर के लिए ₹0 फ़ीस · सीधा भुगतान',
    },
    scenarios: {
      handloom: {
        role: 'दुकान पर ग्राहकों की मदद',
        place: 'शर्मा हैंडलूम्स · इंसार बाज़ार',
        hours: 'दोपहर 2 से शाम 6 बजे तक',
        task: 'ग्राहकों का स्वागत करना और त्योहार का माल तह करना।',
        worker: 'प्रिया एस.',
        workerArea: 'मॉडल टाउन में रहती हैं',
      },
      boutique: {
        role: 'ट्रायल रूम और डिस्प्ले में मदद',
        place: 'ऑरा डिज़ाइनर स्टूडियो · मॉडल टाउन',
        hours: 'दोपहर 1 से शाम 5 बजे तक',
        task: 'ट्रायल रूम की लाइन सँभालना और कपड़े स्टीम करना।',
        worker: 'नेहा के.',
        workerArea: 'सेक्टर 11 में रहती हैं',
      },
      cafe: {
        role: 'भीड़ के समय मदद',
        place: 'चाय और चाट कॉर्नर · सेक्टर 12 मार्केट',
        hours: 'शाम 4 से 8 बजे तक',
        task: 'काउंटर पर मदद, ऑर्डर पहुँचाना और टेबल साफ़ करना।',
        worker: 'अमन वी.',
        workerArea: 'तहसील कैंप में रहते हैं',
      },
    },
  },
};
