export const mr = {
  app: { name: "कृषीकनेक्ट+", tagline: "शेती जोडा, विकास सक्षम करा" },
  roles: { farmer: "शेतकरी", worker: "मजूर", equipmentOwner: "उपकरण मालक", selectRole: "तुमची भूमिका निवडा", farmerDesc: "काम पोस्ट करा, उपकरणे भाड्याने घ्या, मजूर कामावर ठेवा", workerDesc: "शेतीची कामे शोधा, दैनिक मजुरी मिळवा", ownerDesc: "तुमची उपकरणे सूचीबद्ध करा आणि भाड्याने द्या" },
  auth: { login: "लॉग इन", signup: "साइन अप", email: "ईमेल", password: "पासवर्ड", name: "पूर्ण नाव", phone: "फोन नंबर", forgotPassword: "पासवर्ड विसरलात?", noAccount: "खाते नाही?", hasAccount: "आधीच खाते आहे?", logout: "लॉग आउट", back: "मागे", loginLoading: "लॉग इन होत आहे...", signupLoading: "खाते तयार होत आहे...", minCharacters: "किमान ६ अक्षरे" },
  nav: { home: "होम", search: "शोध", activity: "क्रियाकलाप", profile: "प्रोफाइल" },
  farmer: { dashboard: "शेतकरी डॅशबोर्ड", postJob: "काम पोस्ट करा", browseEquipment: "उपकरणे शोधा", myJobs: "माझी कामे", activeJobs: "सक्रिय कामे", title: "कामाचे शीर्षक", description: "वर्णन", wages: "दैनिक मजुरी (₹)", location: "स्थान", duration: "कालावधी (दिवस)", post: "पोस्ट करा", workers: "उपलब्ध मजूर", equipment: "जवळचे उपकरणे", welcome: "स्वागत आहे", noJobs: "अद्याप कोणतीही कामे पोस्ट केलेली नाहीत. तुमचे पहिले काम पोस्ट करा!", totalApplicants: "एकूण अर्जदार", applicants: "अर्जदार" },
  worker: { dashboard: "मजूर डॅशबोर्ड", browseJobs: "कामे शोधा", myApplications: "माझे अर्ज", earnings: "कमाई", skills: "कौशल्ये", apply: "अर्ज करा", applied: "अर्ज केला", experience: "अनुभव", available: "उपलब्ध", perDay: "/दिवस" },
  equipment: { dashboard: "उपकरण डॅशबोर्ड", listEquipment: "उपकरणे सूचीबद्ध करा", myEquipment: "माझी उपकरणे", rentals: "भाड्याच्या विनंत्या", name: "उपकरणाचे नाव", type: "प्रकार", rate: "दररोज दर (₹)", available: "उपलब्ध", rented: "भाड्याने", requestRental: "भाडे विनंती करा", startDate: "सुरू तारीख", endDate: "शेवट तारीख", tractor: "ट्रॅक्टर", harvester: "हार्वेस्टर", plough: "नांगर", sprayer: "फवारणी यंत्र", seeder: "पेरणी यंत्र" },
  common: { save: "जतन करा", cancel: "रद्द करा", submit: "सबमिट करा", loading: "लोड होत आहे...", noData: "डेटा उपलब्ध नाही", success: "यशस्वी!", error: "काहीतरी चूक झाली", language: "भाषा", settings: "सेटिंग्ज", status: { open: "खुले", closed: "बंद", pending: "प्रलंबित", accepted: "स्वीकारले", rejected: "नाकारले" }, days: "दिवस", rupees: "रुपये", rating: "रेटिंग", phone: "फोन", requestedBy: "विनंती केली" },
  equipmentTypes: { tractor: "ट्रॅक्टर", harvester: "हार्वेस्टर", plough: "नांगर", sprayer: "फवारणी यंत्र", seeder: "पेरणी यंत्र" },
  cropScan: { title: "पीक स्कॅन करा", uploadPrompt: "बाधित पिकाचा फोटो घ्या किंवा इमेज अपलोड करा", analyse: "पीक विश्लेषण करा", analysing: "AI द्वारे विश्लेषण होत आहे...", result: "विश्लेषण निकाल", disease: "रोगाचे नाव", severity: "गंभीरता पातळी", description: "वर्णन", treatment: "उपचार पायऱ्या", precautions: "खबरदारी", scanAnother: "दुसरे स्कॅन करा", noImage: "कृपया आधी एक इमेज निवडा", healthy: "निरोगी पीक" },
  weather: { rainWarning: "लवकरच पावसाची शक्यता आहे. उशीर टाळण्यासाठी तुमची काढणीची कामे आजच पोस्ट करा!", postNow: "आता काम पोस्ट करा", today: "आज", tomorrow: "उद्या", clear: "स्वच्छ आकाश", rain: "पाऊस", clouds: "ढगाळ", thunderstorm: "विजांचा कडकडाट", drizzle: "रिमझिम", mist: "धुके", snow: "बर्फ" },
  stats: {
    title: "माझे सांख्यिकी",
    jobsPosted: "पोस्ट केलेले काम",
    workersHired: "नेमलेले कामगार",
    equipmentRentals: "भाडे",
    moneySaved: "बचत केलेली रक्कम",
    savingsHighlight: "🎉 कृषी क्षेत्राचा वापर करून, आपण मध्यस्थांना टाळून या हंगामात सुमारे ₹{amount} बचत केली आहे!",
    progress: "कामाची प्रगती",
    completedOf: "{total} पैकी {completed} कामे पूर्ण झाली",
    activeCount: "{count} सक्रिय",
    rentalSpend: "भाडे खर्च: ₹{amount}"
  }
};
