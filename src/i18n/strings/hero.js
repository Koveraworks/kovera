/**
 * Hero: the page's h1, the two main buttons and the example match card.
 * Scenario keys match the category ids in src/data/rates.js.
 * Numbers (minutes, hours, pay) live in the component and fill {placeholders}.
 */
export default {
  en: {
    // Kept short: Pill stays on one line and truncates.
    pilot: 'Pilot starts in Panipat, Haryana',
    headline: {
      lead: 'Good work starts with',
      accent: 'the right people.',
    },
    intro: 'One missing person can throw off a whole day. Kovera connects local boutiques, salons, cafés and shops with dependable daytime help for the 4-hour shifts they need.',
    trust: {
      adults: 'Adults (18+) with an ID check',
      zeroFee: '₹0 fee for workers',
      daytime: 'Daytime shifts in public workplaces',
    },
    card: {
      title: 'Example of a Kovera match',
      pill: 'Example match',
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
        hours: '2 pm to 6 pm',
        task: 'Greet customers and fold festival stock.',
        worker: 'Priya S.',
        workerArea: 'Lives in Model Town',
      },
      boutique: {
        role: 'Fitting room and display helper',
        place: 'Aura Designer Studio · Model Town',
        hours: '1 pm to 5 pm',
        task: 'Manage the trial room queue and steam garments.',
        worker: 'Neha K.',
        workerArea: 'Lives in Sector 11',
      },
      cafe: {
        role: 'Evening rush helper',
        place: 'Chai & Chaat Corner · Sector 12 Market',
        hours: '4 pm to 8 pm',
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
      accent: 'सही लोगों से।',
    },
    intro: 'एक भी स्टाफ़ न आए, तो पूरा दिन बिगड़ जाता है। Kovera आस-पास के बुटीक, सैलून, कैफ़े और दुकानों को 4 घंटे की शिफ्ट के लिए दिन के समय भरोसेमंद मदद से जोड़ता है।',
    trust: {
      adults: '18+ वयस्क, पहचान की जाँच के साथ',
      zeroFee: 'वर्कर के लिए ₹0 फ़ीस',
      daytime: 'दिन के समय, सार्वजनिक जगह पर शिफ्ट',
    },
    card: {
      title: 'Kovera मैच का एक उदाहरण',
      pill: 'मैच का उदाहरण',
      switchLabel: 'उदाहरण के लिए दुकान चुनें',
      requestLabel: 'उदाहरण: दुकान की माँग',
      bridge: 'लक्ष्य: {n} मिनट के अंदर मैच',
      workerLabel: 'उदाहरण: मैच हुआ वर्कर',
      workerMeta: '18+ · पहचान जाँची हुई · लगभग {n} मिनट दूर',
      payLabel: '{hours} घंटे का उदाहरण भुगतान:',
      payValue: '{range}*',
      payTerms: 'वर्कर के लिए ₹0 फ़ीस · सीधा भुगतान',
    },
    scenarios: {
      handloom: {
        role: 'दुकान पर ग्राहकों की मदद',
        place: 'शर्मा हैंडलूम्स · इंसार बाज़ार',
        hours: 'दोपहर 2 से शाम 6 बजे तक',
        task: 'ग्राहकों को अटेंड करना और त्योहार का स्टॉक तह करना।',
        worker: 'प्रिया एस.',
        workerArea: 'मॉडल टाउन में रहती हैं',
      },
      boutique: {
        role: 'ट्रायल रूम और डिस्प्ले में मदद',
        place: 'ऑरा डिज़ाइनर स्टूडियो · मॉडल टाउन',
        hours: 'दोपहर 1 से शाम 5 बजे तक',
        task: 'ट्रायल रूम की लाइन संभालना और कपड़ों पर स्टीम करना।',
        worker: 'नेहा के.',
        workerArea: 'सेक्टर 11 में रहती हैं',
      },
      cafe: {
        role: 'शाम की भीड़ में मदद',
        place: 'चाय और चाट कॉर्नर · सेक्टर 12 मार्केट',
        hours: 'शाम 4 से 8 बजे तक',
        task: 'काउंटर पर मदद, ऑर्डर पहुँचाना और टेबल साफ़ करना।',
        worker: 'अमन वी.',
        workerArea: 'तहसील कैंप में रहते हैं',
      },
    },
  },
};
