export default {
  en: {
    title: 'Join the Kovera waitlist',
    sub: 'Say whether you need workers or want work. It takes under a minute.',
    // The two options use the join-button labels in common.js (cta.needWorkers, cta.wantWork).
    chooserLabel: 'Joining as',
    // The two-path card shown before a side is chosen. No pay figures until
    // the pilot gives real ones (issue #7).
    chooser: {
      band: 'Kovera connects local shops with dependable backup workers.',
      bandNote: 'Free during the pilot',
      business: {
        title: 'Dependable help for short shifts',
        body: 'For shops, cafés, salons, showrooms and more. Tell us what you need, and our team looks for a suitable person nearby.',
        points: ['Adults (18+) with an ID check', 'No platform fee during the pilot'],
      },
      worker: {
        title: 'Local day shifts, no fees',
        body: 'Shifts are usually 4 hours, in public daytime workplaces. Pay is agreed and shown before every shift. No night shifts, no home jobs, and nothing is deducted from your pay.',
        points: ['Public daytime workplaces only', 'Paid directly when the shift ends'],
      },
    },
    context: {
      label: 'You picked',
      remove: 'Remove this selection',
    },
    fields: {
      businessName: { label: 'Business or shop name', placeholder: 'Name of your business or shop' },
      contactName: { label: 'Your name', placeholder: 'Your full name' },
      fullName: { label: 'Full name', placeholder: 'Your full name' },
      phone: { label: 'Mobile number', placeholder: '10-digit mobile number', hint: 'Used to reach you on WhatsApp or by phone.' },
      shopType: { label: 'Type of shop', placeholder: 'Choose the type of shop' },
      state: { label: 'State', placeholder: 'Type your state' },
      city: {
        label: 'City or district',
        placeholder: 'Type your city or district',
        needsState: 'Choose your state first',
        loading: 'Loading…',
        hint: 'Pick your district. Put your town or village in the next box.',
      },
      area: { label: 'Area, market or nearby town', placeholder: 'Your area, market or town' },
    },
    noMatch: {
      state: 'No state matches that. Check the spelling.',
      city: 'No district matches that. Check the spelling, or pick the district your town is in.',
    },
    errors: {
      businessName: 'Enter your business or shop name.',
      contactName: 'Enter your name.',
      fullName: 'Enter your full name.',
      phone: 'Enter a 10-digit mobile number.',
      shopType: 'Choose the type of shop.',
      state: 'Choose your state from the list.',
      city: 'Choose your city or district from the list.',
      places: 'The list of cities did not load. Check your connection and try again.',
      retry: 'Try again',
      submit: 'Your details were not sent. Check your connection and try again, or message us on WhatsApp.',
    },
    business: {
      heading: 'Tell us about your shop',
      sub: 'Just the basics. The rest can wait for WhatsApp.',
      submit: 'Join as a business',
      disclaimer: 'Joining registers your interest. It does not confirm a worker or a shift.',
    },
    worker: {
      heading: 'Tell us about you',
      sub: 'Just the basics. The rest can wait for WhatsApp.',
      submit: 'Join as a worker',
      disclaimer: 'Joining registers your interest. It does not guarantee work. Workers never pay a fee.',
    },
    submitting: 'Sending…',
    success: {
      title: 'You’re on the waitlist, {name}.',
      business: 'Your details for {business} in {place} are with our team.',
      worker: 'Your details for {place} are with our team.',
      next: 'Someone from Kovera will call or WhatsApp you on +91 {phone}. This registers your interest. It does not confirm a shift.',
      more: 'Tell us a little more on WhatsApp, so we can find the right match sooner.',
      whatsapp: 'Continue on WhatsApp',
      again: 'Add another response',
      demo: 'Demo mode: no database is connected, so this was not saved.',
    },
    // Pre-filled in the "Continue on WhatsApp" message, in the visitor's
    // language. The details the form no longer asks for are asked for here.
    // No personal names: the text travels in a wa.me URL. Issue #9 adds the
    // referral code ("JOIN K7P2QX") to these.
    whatsappMessage: {
      business: 'Hi Kovera, I just joined the waitlist for {business} ({shopType}) in {place}. The help I need (the work, the days and the hours): ',
      worker: 'Hi Kovera, I just joined the waitlist as a worker, from {place}. Work I have done or can do, and when I am free: ',
    },
  },
  hi: {
    title: 'Kovera की वेटलिस्ट में जुड़ें',
    sub: 'बताएँ कि आपको वर्कर चाहिए या काम चाहिए। इसमें एक मिनट से भी कम लगेगा।',
    chooserLabel: 'किस तरह जुड़ना है',
    chooser: {
      band: 'Kovera आस-पास की दुकानों को भरोसेमंद बैकअप वर्कर से जोड़ता है।',
      bandNote: 'पायलट के दौरान मुफ़्त',
      business: {
        title: 'छोटी शिफ्ट के लिए भरोसेमंद मदद',
        body: 'दुकान, कैफ़े, सैलून, शोरूम और भी बहुत कुछ। बताएँ क्या चाहिए। हमारी टीम आस-पास सही वर्कर ढूँढने की कोशिश करती है।',
        points: ['18+ वयस्क, पहचान की जाँच के साथ', 'पायलट के दौरान कोई प्लेटफ़ॉर्म फ़ीस नहीं'],
      },
      worker: {
        title: 'घर के पास दिन की शिफ्ट, कोई फ़ीस नहीं',
        body: 'शिफ्ट आम तौर पर 4 घंटे की होती है, दिन में और सार्वजनिक जगहों पर। भुगतान हर शिफ्ट से पहले तय होता है और आपको बताया जाता है। रात की शिफ्ट नहीं, घरों में काम नहीं, और आपके भुगतान से कुछ नहीं कटता।',
        points: ['सिर्फ़ दिन के समय, सार्वजनिक जगह पर', 'शिफ्ट ख़त्म होने पर सीधा भुगतान'],
      },
    },
    context: {
      label: 'आपने चुना',
      remove: 'इसे हटाएँ',
    },
    fields: {
      businessName: { label: 'बिज़नेस या दुकान का नाम', placeholder: 'आपके बिज़नेस या दुकान का नाम' },
      contactName: { label: 'आपका नाम', placeholder: 'आपका पूरा नाम' },
      fullName: { label: 'पूरा नाम', placeholder: 'आपका पूरा नाम' },
      phone: { label: 'मोबाइल नंबर', placeholder: '10 अंकों का मोबाइल नंबर', hint: 'इसी नंबर पर WhatsApp या फ़ोन से बात होगी।' },
      shopType: { label: 'दुकान का प्रकार', placeholder: 'दुकान का प्रकार चुनें' },
      state: { label: 'राज्य', placeholder: 'अपना राज्य लिखें' },
      city: {
        label: 'शहर या ज़िला',
        placeholder: 'अपना शहर या ज़िला लिखें',
        needsState: 'पहले अपना राज्य चुनें',
        loading: 'लोड हो रहा है…',
        hint: 'अपना ज़िला चुनें। क़स्बा या गाँव अगले ख़ाने में लिखें।',
      },
      area: { label: 'इलाक़ा, बाज़ार या पास का क़स्बा', placeholder: 'आपका इलाक़ा, बाज़ार या क़स्बा' },
    },
    noMatch: {
      state: 'इस नाम का कोई राज्य नहीं मिला। स्पेलिंग जाँचें।',
      city: 'इस नाम का कोई ज़िला नहीं मिला। स्पेलिंग जाँचें, या वह ज़िला चुनें जिसमें आपका क़स्बा है।',
    },
    errors: {
      businessName: 'अपने बिज़नेस या दुकान का नाम लिखें।',
      contactName: 'अपना नाम लिखें।',
      fullName: 'अपना पूरा नाम लिखें।',
      phone: '10 अंकों का मोबाइल नंबर लिखें।',
      shopType: 'दुकान का प्रकार चुनें।',
      state: 'सूची में से अपना राज्य चुनें।',
      city: 'सूची में से अपना शहर या ज़िला चुनें।',
      places: 'शहरों की सूची लोड नहीं हुई। इंटरनेट चेक करके दोबारा कोशिश करें।',
      retry: 'दोबारा कोशिश करें',
      submit: 'आपकी जानकारी भेजी नहीं जा सकी। इंटरनेट चेक करके दोबारा कोशिश करें, या हमें WhatsApp करें।',
    },
    business: {
      heading: 'अपनी दुकान के बारे में बताएँ',
      sub: 'बस ज़रूरी जानकारी। बाक़ी बातें WhatsApp पर।',
      submit: 'बिज़नेस के तौर पर जुड़ें',
      disclaimer: 'जुड़ने का मतलब सिर्फ़ इतना है कि आपने दिलचस्पी दिखाई है। इससे वर्कर या शिफ्ट पक्की नहीं होती।',
    },
    worker: {
      heading: 'अपने बारे में बताएँ',
      sub: 'बस ज़रूरी जानकारी। बाक़ी बातें WhatsApp पर।',
      submit: 'वर्कर के तौर पर जुड़ें',
      disclaimer: 'जुड़ने का मतलब सिर्फ़ इतना है कि आपने दिलचस्पी दिखाई है। काम मिलने की गारंटी नहीं है। वर्कर से कभी कोई फ़ीस नहीं ली जाती।',
    },
    submitting: 'भेज रहे हैं…',
    success: {
      title: '{name}, आप अब वेटलिस्ट में हैं',
      business: '{place} में {business} की जानकारी हमारी टीम तक पहुँच गई है।',
      worker: '{place} के लिए आपकी जानकारी हमारी टीम तक पहुँच गई है।',
      next: 'Kovera की टीम आपको +91 {phone} पर कॉल या WhatsApp करेगी। अभी आपने सिर्फ़ दिलचस्पी दिखाई है। इससे शिफ्ट पक्की नहीं होती।',
      more: 'WhatsApp पर थोड़ा और बताएँ, ताकि सही मैच जल्दी मिल सके।',
      whatsapp: 'WhatsApp पर आगे बढ़ें',
      again: 'एक और फ़ॉर्म भरें',
      demo: 'डेमो मोड: डेटाबेस जुड़ा नहीं है, इसलिए यह सेव नहीं हुआ।',
    },
    whatsappMessage: {
      business: 'नमस्ते Kovera, मैंने अभी {place} में {business} ({shopType}) के लिए वेटलिस्ट जॉइन की है। मुझे इस काम में मदद चाहिए (काम, दिन और समय): ',
      worker: 'नमस्ते Kovera, मैंने अभी वर्कर के तौर पर वेटलिस्ट जॉइन की है, मैं {place} से हूँ। मैंने यह काम किया है या कर सकता/सकती हूँ, और मैं इस समय फ़्री हूँ: ',
    },
  },
};
