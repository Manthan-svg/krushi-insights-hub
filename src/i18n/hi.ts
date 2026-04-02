export const hi = {
  app: { name: "कृषिकनेक्ट+", tagline: "खेतों को जोड़ना, विकास को सशक्त बनाना" },
  roles: { farmer: "किसान", worker: "मजदूर", equipmentOwner: "उपकरण मालिक", selectRole: "अपनी भूमिका चुनें", farmerDesc: "काम पोस्ट करें, उपकरण किराए पर लें, मजदूरों को काम पर रखें", workerDesc: "खेती के काम खोजें, दैनिक मजदूरी कमाएं", ownerDesc: "अपने उपकरणों को सूचीबद्ध करें और किराए पर दें" },
  auth: { login: "लॉग इन", signup: "साइन अप", email: "ईमेल", password: "पासवर्ड", name: "पूरा नाम", phone: "फ़ोन नंबर", forgotPassword: "पासवर्ड भूल गए?", noAccount: "खाता नहीं है?", hasAccount: "पहले से ही खाता है?", logout: "लॉग आउट", back: "पीछे", loginLoading: "लॉग इन हो रहा है...", signupLoading: "खाता बनाया जा रहा है...", minCharacters: "न्यूनतम 6 अक्षर" },
  nav: { home: "होम", search: "खोज", activity: "गतिविधि", profile: "प्रोफ़ाइल" },
  farmer: { dashboard: "किसान डैशबोर्ड", postJob: "नौकरी पोस्ट करें", browseEquipment: "उपकरण ब्राउज़ करें", myJobs: "मेरी नौकरियां", activeJobs: "सक्रिय नौकरियां", title: "नौकरी का शीर्षक", description: "विवरण", wages: "दैनिक मजदूरी (₹)", location: "स्थान", duration: "अवधि (दिन)", post: "पोस्ट करें", workers: "उपलब्ध मजदूर", equipment: "आस-पास के उपकरण", welcome: "स्वागत है", noJobs: "अभी तक कोई नौकरी पोस्ट नहीं की गई है। अपनी पहली नौकरी पोस्ट करें!", totalApplicants: "कुल आवेदक", applicants: "आवेदक" },
  worker: { dashboard: "मजदूर डैशबोर्ड", browseJobs: "नौकरियां ब्राउज़ करें", myApplications: "मेरे आवेदन", earnings: "कमाई", skills: "कौशल", apply: "आवेदन करें", applied: "आवेदित", experience: "अनुभव", available: "उपलब्ध", perDay: "/दिन" },
  equipment: { dashboard: "उपकरण डैशबोर्ड", listEquipment: "उपकरण सूचीबद्ध करें", myEquipment: "मेरे उपकरण", rentals: "किराया अनुरोध", name: "उपकरण का नाम", type: "प्रकार", rate: "प्रति दिन दर (₹)", available: "उपलब्ध", rented: "किराये पर", requestRental: "किराया अनुरोध करें", startDate: "प्रारंभ तिथि", endDate: "समाप्ति तिथि", tractor: "ट्रैक्टर", harvester: "हार्वेस्टर", plough: "हल", sprayer: "स्प्रेयर", seeder: "बीज बोने की मशीन" },
  common: { save: "सहेजें", cancel: "रद्द करें", submit: "जमा करें", loading: "लोड हो रहा है...", noData: "कोई डेटा उपलब्ध नहीं", success: "सफलता!", error: "कुछ गलत हो गया", language: "भाषा", settings: "सेटिंग्स", status: { open: "खुला", closed: "बंद", pending: "लंबित", accepted: "स्वीकृत", rejected: "अस्वीकृत" }, days: "दिन", rupees: "रुपये", rating: "रेटिंग", phone: "फोन", requestedBy: "अनुरोध किया" },
  equipmentTypes: { tractor: "ट्रैक्टर", harvester: "हार्वेस्टर", plough: "हल", sprayer: "स्प्रेयर", seeder: "बीज बोने की मशीन" },
  cropScan: { title: "फसल स्कैन करें", uploadPrompt: "प्रभावित फसल का फोटो लें या इमेज अपलोड करें", analyse: "फसल का विश्लेषण करें", analysing: "AI द्वारा विश्लेषण किया जा रहा है...", result: "विश्लेषण परिणाम", disease: "रोग का नाम", severity: "गंभीरता स्तर", description: "विवरण", treatment: "उपचार के चरण", precautions: "सावधानियां", scanAnother: "दूसरा स्कैन करें", noImage: "कृपया पहले एक इमेज चुनें", healthy: "स्वस्थ फसल" },
  weather: { rainWarning: "जल्द ही बारिश की संभावना है। देरी से बचने के लिए अपनी कटाई का काम आज ही पोस्ट करें!", postNow: "अभी काम पोस्ट करें", today: "आज", tomorrow: "कल", clear: "साफ आकाश", rain: "बारिश", clouds: "बादल", thunderstorm: "बिजली कड़कना", drizzle: "बूंदाबांदी", mist: "कोहरा", snow: "बर्फ" },
  stats: {
    title: "मेरे आंकड़े",
    jobsPosted: "पोस्ट किए गए काम",
    workersHired: "रखे गए मजदूर",
    equipmentRentals: "किराए",
    moneySaved: "बचत की गई राशि",
    savingsHighlight: "🎉 कृषि क्षेत्र का उपयोग करके, आपने बिचौलियों से बचकर इस सीजन में लगभग ₹{amount} की बचत की!",
    progress: "काम की प्रगति",
    completedOf: "{total} में से {completed} काम पूरे हुए",
    activeCount: "{count} सक्रिय",
    rentalSpend: "किराया खर्च: ₹{amount}"
  }
};
