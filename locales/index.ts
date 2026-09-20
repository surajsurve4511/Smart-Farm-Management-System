

interface Translations {
  [key: string]: any;
}

const en: Translations = {
  app: {
    loading: "Loading Smart Farm...",
    aiInitError: "AI Service not initialized. API_KEY might be missing or invalid.",
  },
  login: {
    welcome: "Welcome to AgriSmart",
    tagline: "Your AI-Powered Farm Management Hub",
    selectProfile: "Select Your Profile",
    loginButton: "Login",
    noProfiles: "No farmer profiles available",
    selectFarmerAlert: "Please select a farmer to log in."
  },
  dashboard: {
    title: "Dashboard",
    tagline: "Manage farms, plots, and activities.",
    overviewFor: "{{name}}'s Dashboard",
    farmers: "FARMERS",
    logout: "Logout",
    selectFarmer: "Select a farmer to view their dashboard.",
    loading: "Loading farmer data...",
    noPlots: "No plots added to this farm yet.",
    weatherForecast: "Weather Forecast for {{location}}",
    farmsAndPlots: "Farms & Plots",
    addFarm: "Add Farm",
    activityFeed: "Activity & Notes Feed",
    farmerProfile: "Farmer Profile",
    nav: {
      dashboard: "Dashboard",
      plots: "Farms & Plots",
      feed: "Activity Feed",
      cropHealth: "Crop Health",
      assistant: "AI Assistant",
      market: "Market Prices",
      weather: "Weather",
      liveAdvisor: "Live Assistant",
    },
    statCards: {
      totalFarms: "Total Farms",
      totalPlots: "Total Plots",
      recentActivities: "Activities (Last 7 Days)"
    },
    suggestions: {
        title: "Personalized Suggestions",
        weather: "Rain is forecast for {{location}}. Check your irrigation schedule and ensure proper drainage.",
        plotHealth: "The health of '{{plotName}}' needs monitoring. Consider uploading a recent photo to the AI Assistant for analysis.",
        logActivity: "It has been over a week since the last activity was logged for '{{plotName}}'. Consider adding a note or a photo log."
    },
    market: {
        title: "Market Watch",
        crop: "Market for {{cropName}}",
        currentPrice: "Current Price",
        priceUnit: "quintal",
        forecast: "5-Day Trend",
        summary: "Market Summary"
    },
    yield: {
        title: "Yield Forecast",
        crop: "Forecast for {{cropName}}",
        predictedYield: "Predicted Yield",
        confidence: "Confidence",
        factors: "Key Factors"
    }
  },
  advisor: {
      initial: "Hello! Tap the microphone and ask me anything about your farm.",
      listening: "Listening...",
      processing: "Thinking...",
      unsupported: "Voice recognition is not supported by your browser. Please use Chrome or Edge.",
      permission: "Please allow microphone access to use the Live Advisor.",
      intro: "Hello! I'm your live farming advisor. How can I assist you today?",
      cameraError: "Camera access denied or not available.",
      captureAndSpeak: "Tap to capture video & speak"
  },
  assistant: {
    title: "AI Assistant",
    description: "Chat with your personal farming expert. Ask questions about your crops, upload photos for analysis, or get advice on market trends.",
    placeholder: "Type your message or upload an image...",
    send: "Send",
    compressing: "Compressing image...",
    analyzing: "AI is thinking...",
    welcome: "Hello! I'm AgriSmart, your AI farming assistant. How can I help you today? You can ask me about crop diseases, get fertilizer recommendations, or inquire about market prices.",
    imageUploaded: "Image selected. Add a question or send for analysis.",
    compressError: "Failed to process image.",
    notInitialized: "AI Service not initialized. API_KEY might be missing or invalid.",
    defaultImagePrompt: "Please analyze this image of my crop and provide a detailed assessment of its health, including any potential diseases, pests, or nutrient deficiencies you observe. Suggest actionable steps I can take.",
    systemPrompt: "You are AgriSmart, an expert AI agronomist and farming assistant. Your goal is to help farmers. The current farmer is located in {{location}}, has a farm of {{farmSize}} hectares, and primarily grows {{crops}}. Be concise, clear, and provide actionable advice. If you analyze an image, describe what you see before providing your diagnosis or advice.",
    contextualSystemPrompt: "You are AgriSmart, an expert AI agronomist. The farmer is asking about a specific context: Farm '{{farmName}}', Plot '{{plotName}}'. Use this information to give a highly relevant and specific response. The farmer is located in {{location}} and mainly grows {{crops}}. Be concise and provide actionable advice.",
    errorResponse: "Sorry, I encountered an error and couldn't process your request:",
    selectFarm: "Select a Farm for Context",
    selectPlot: "Select a Plot for Context",
    allPlots: "All Plots",
    capabilities: {
      title: "What I can help with:",
      features: [
        "Real-time Crop Recommendations",
        "Pest & Disease Detection from Images",
        "Soil Health & Fertilizer Management",
        "Weather-based Irrigation Advice",
        "Crop Yield Prediction & Optimization",
        "Live Market Price Tracking & Analysis"
      ]
    }
  },
  modals: {
      addFarm: {
          title: "Add New Farm"
      },
      addDailyLog: {
        title: "Add Daily Log for {{plotName}}",
        photos: "Photos",
        upload: "Upload Files",
        camera: "Use Camera",
        notes: "Farmer's Notes (Optional)",
        runAI: "Run AI Analysis on First Image",
        analyzing: "Analyzing...",
        aiSummary: "AI Summary:",
        error: "Error:",
        save: "Save Log",
        saving: "Saving...",
        addNoteOrPhoto: "Please add at least one photo or a note.",
        imageRequired: "Please upload at least one image to analyze.",
        analysisComplete: "AI analysis complete!",
        logAdded: "Daily log added for {{plotName}}.",
        logFailed: "Failed to add daily log. Please try again.",
      },
      plotLogHistory: {
        title: "Log History for {{plotName}}",
        noLogs: "No daily logs have been recorded for this plot yet."
      }
  },
  forms: {
      labels: {
          farmName: "Farm Name",
          area: "Area (Hectares)",
          location: "Location Address"
      },
      buttons: {
          cancel: "Cancel",
          addFarm: "Add Farm",
          adding: "Adding..."
      },
      errors: {
          farmNameRequired: "Farm name is required.",
          areaPositive: "Area must be a positive number.",
          locationRequired: "Location address is required."
      }
  },
  notifications: {
      farmAdded: "Farm '{{name}}' added successfully!",
      farmAddFailed: "Failed to add the farm. Please try again.",
      weatherError: "Could not retrieve weather information.",
      marketError: "Could not retrieve market price data.",
      yieldError: "Could not generate yield prediction.",
aiQuotaError: "The AI service is currently unavailable due to high demand (Quota Exceeded). Please try again later.",
      mapsKeyError: "The map service is unavailable due to a configuration issue. Please contact support."
  },
  cropHealth: {
    title: "AI-Powered Crop Health Analysis",
    description: "Upload an image of a plant leaf to get an instant diagnosis and treatment recommendations.",
    tryExample: "Or try an example image:",
    cropContext: "For better results, tell us (optional): What crop is this?",
    cropPlaceholder: "e.g., Tomato, Corn, Potato",
    analyzeButton: "Analyze Crop Health",
    welcomeTitle: "Welcome to AgriSmart Health",
    welcomeDescription: "Your personal crop health assistant is ready to help. Please upload an image to begin.",
  },
  marketFinder: {
    title: "Farmer's Market Price Finder",
    description: "Get the latest commodity prices from markets across India.",
    getPrices: "Get Prices",
    searching: "Searching...",
    results: "Results ({{count}})",
    downloadCsv: "Download CSV",
    noResultsTitle: "No Results Found",
    noResultsDescription: "Try adjusting your filters for a wider search.",
    selectLabel: "Select {{label}}",
    loadingLabel: "Loading {{label}}s...",
  }
};

const hi: Translations = {
  app: {
    loading: "स्मार्ट फार्म लोड हो रहा है...",
    aiInitError: "एआई सेवा प्रारंभ नहीं हुई। एपीआई कुंजी गायब या अमान्य हो सकती है।",
  },
  login: {
    welcome: "एग्रीस्मार्ट में आपका स्वागत है",
    tagline: "आपका एआई-संचालित कृषि प्रबंधन हब",
    selectProfile: "अपनी प्रोफ़ाइल चुनें",
    loginButton: "लॉग इन करें",
    noProfiles: "कोई किसान प्रोफ़ाइल उपलब्ध नहीं है",
    selectFarmerAlert: "लॉग इन करने के लिए कृपया एक किसान का चयन करें।"
  },
  dashboard: {
    title: "डैशबोर्ड",
    tagline: "खेतों, भूखंडों और गतिविधियों का प्रबंधन करें।",
    overviewFor: "{{name}} का डैशबोर्ड",
    farmers: "किसान",
    logout: "लॉग आउट",
    selectFarmer: "उनका डैशबोर्ड देखने के लिए एक किसान का चयन करें।",
    loading: "किसान डेटा लोड हो रहा है...",
    noPlots: "इस खेत में अभी तक कोई भूखंड नहीं जोड़ा गया है।",
    weatherForecast: "{{location}} के लिए मौसम का पूर्वानुमान",
    farmsAndPlots: "खेत और भूखंड",
    addFarm: "खेत जोड़ें",
    activityFeed: "गतिविधि और नोट्स फ़ीड",
    farmerProfile: "किसान प्रोफ़ाइल",
    nav: {
      dashboard: "डैशबोर्ड",
      plots: "खेत और भूखंड",
      feed: "गतिविधि फ़ीड",
      cropHealth: "फसल स्वास्थ्य",
      assistant: "एआई सहायक",
      market: "बाजार मूल्य",
      weather: "मौसम",
      liveAdvisor: "लाइव सहायक",
    },
    statCards: {
        totalFarms: "कुल खेत",
        totalPlots: "कुल भूखंड",
        recentActivities: "गतिविधियाँ (पिछले 7 दिन)"
    },
    suggestions: {
        title: "व्यक्तिगत सुझाव",
        weather: "{{location}} के लिए बारिश का पूर्वानुमान है। अपनी सिंचाई अनुसूची की जाँच करें और उचित जल निकासी सुनिश्चित करें।",
        plotHealth: "'{{plotName}}' के स्वास्थ्य की निगरानी की आवश्यकता है। विश्लेषण के लिए एआई सहायक को हाल की एक तस्वीर अपलोड करने पर विचार करें।",
        logActivity: "'{{plotName}}' के लिए अंतिम गतिविधि लॉग किए हुए एक सप्ताह से अधिक हो गया है। एक नोट या फोटो लॉग जोड़ने पर विचार करें।"
    },
    market: {
        title: "बाजार की जानकारी",
        crop: "{{cropName}} के लिए बाजार",
        currentPrice: "वर्तमान मूल्य",
        priceUnit: "क्विंटल",
        forecast: "5-दिन की प्रवृत्ति",
        summary: "बाजार सारांश"
    },
    yield: {
        title: "उपज का पूर्वानुमान",
        crop: "{{cropName}} के लिए पूर्वानुमान",
        predictedYield: "अनुमानित उपज",
        confidence: "आत्मविश्वास",
        factors: "मुख्य कारक"
    }
  },
  advisor: {
      initial: "नमस्ते! माइक्रोफ़ोन पर टैप करें और अपने खेत के बारे में कुछ भी पूछें।",
      listening: "सुन रहा हूँ...",
      processing: "सोच रहा हूँ...",
      unsupported: "आपके ब्राउज़र द्वारा वॉयस रिकग्निशन समर्थित नहीं है। कृपया क्रोम या एज का उपयोग करें।",
      permission: "लाइव सलाहकार का उपयोग करने के लिए कृपया माइक्रोफ़ोन एक्सेस की अनुमति दें।",
      intro: "नमस्ते! मैं आपका लाइव कृषि सलाहकार हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      cameraError: "कैमरा एक्सेस अस्वीकृत या उपलब्ध नहीं है।",
      captureAndSpeak: "वीडियो कैप्चर करें और बोलें"
  },
  assistant: {
    title: "एआई सहायक",
    description: "अपने व्यक्तिगत कृषि विशेषज्ञ से चैट करें। अपनी फसलों के बारे में प्रश्न पूछें, विश्लेषण के लिए तस्वीरें अपलोड करें, या बाजार के रुझानों पर सलाह लें।",
    placeholder: "अपना संदेश लिखें या एक छवि अपलोड करें...",
    send: "भेजें",
    compressing: "छवि को कंप्रेस किया जा रहा है...",
    analyzing: "एआई सोच रहा है...",
    welcome: "नमस्ते! मैं एग्रीस्मार्ट हूं, आपका एआई कृषि सहायक। मैं आज आपकी कैसे मदद कर सकता हूं? आप मुझसे फसल रोगों के बारे में पूछ सकते हैं, उर्वरक सिफारिशें प्राप्त कर सकते हैं, या बाजार की कीमतों के बारे में पूछताछ कर सकते हैं।",
    imageUploaded: "छवि चुन ली गई है। कोई प्रश्न जोड़ें या विश्लेषण के लिए भेजें।",
    compressError: "छवि को संसाधित करने में विफल।",
    notInitialized: "एआई सेवा शुरू नहीं हुई है। एपीआई कुंजी गायब या अमान्य हो सकती है।",
    defaultImagePrompt: "कृपया मेरी फसल की इस छवि का विश्लेषण करें और इसके स्वास्थ्य का विस्तृत मूल्यांकन प्रदान करें, जिसमें आपके द्वारा देखे गए किसी भी संभावित रोग, कीट, या पोषक तत्वों की कमी शामिल है। कार्रवाई योग्य कदम सुझाएं जो मैं उठा सकता हूं।",
    systemPrompt: "आप एग्रीस्मार्ट हैं, एक विशेषज्ञ एआई कृषि विज्ञानी और कृषि सहायक। आपका लक्ष्य किसानों की मदद करना है। वर्तमान किसान {{location}} में स्थित है, उसके पास {{farmSize}} हेक्टेयर का खेत है, और मुख्य रूप से {{crops}} उगाता है। संक्षिप्त, स्पष्ट रहें और कार्रवाई योग्य सलाह प्रदान करें। यदि आप किसी छवि का विश्लेषण करते हैं, तो अपना निदान या सलाह देने से पहले बताएं कि आप क्या देखते हैं।",
    contextualSystemPrompt: "आप एग्रीस्मार्ट हैं, एक विशेषज्ञ एआई कृषि विज्ञानी। किसान एक विशिष्ट संदर्भ के बारे में पूछ रहा है: खेत '{{farmName}}', भूखंड '{{plotName}}'। अत्यधिक प्रासंगिक और विशिष्ट प्रतिक्रिया देने के लिए इस जानकारी का उपयोग करें। किसान {{location}} में स्थित है और मुख्य रूप से {{crops}} उगाता है। संक्षिप्त रहें और कार्रवाई योग्य सलाह प्रदान करें।",
    errorResponse: "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा और मैं आपके अनुरोध को संसाधित नहीं कर सका:",
    selectFarm: "संदर्भ के लिए एक खेत चुनें",
    selectPlot: "संदर्भ के लिए एक भूखंड चुनें",
    allPlots: "सभी भूखंड",
    capabilities: {
      title: "मैं किसमें मदद कर सकता हूँ:",
      features: [
        "वास्तविक समय फसल सिफारिशें",
        "छवियों से कीट और रोग का पता लगाना",
        "मृदा स्वास्थ्य और उर्वरक प्रबंधन",
        "मौसम आधारित सिंचाई सलाह",
        "फसल उपज भविष्यवाणी और अनुकूलन",
        "लाइव बाजार मूल्य ट्रैकिंग और विश्लेषण"
      ]
    }
  },
  modals: {
      addFarm: {
          title: "नया खेत जोड़ें"
      },
      addDailyLog: {
        title: "{{plotName}} के लिए दैनिक लॉग जोड़ें",
        photos: "तस्वीरें",
        upload: "फ़ाइलें अपलोड करें",
        camera: "कैमरा का प्रयोग करें",
        notes: "किसान के नोट्स (वैकल्पिक)",
        runAI: "पहली छवि पर एआई विश्लेषण चलाएं",
        analyzing: "विश्लेषण हो रहा है...",
        aiSummary: "एआई सारांश:",
        error: "त्रुटि:",
        save: "लॉग सहेजें",
        saving: "सहेजा जा रहा है...",
        addNoteOrPhoto: "कृपया कम से कम एक फोटो या एक नोट जोड़ें।",
        imageRequired: "कृपया विश्लेषण करने के लिए कम से कम एक छवि अपलोड करें।",
        analysisComplete: "एआई विश्लेषण पूरा हुआ!",
        logAdded: "{{plotName}} के लिए दैनिक लॉग जोड़ा गया।",
        logFailed: "दैनिक लॉग जोड़ने में विफल। कृपया पुन: प्रयास करें।",
      },
      plotLogHistory: {
        title: "{{plotName}} के लिए लॉग इतिहास",
        noLogs: "इस भूखंड के लिए अभी तक कोई दैनिक लॉग दर्ज नहीं किया गया है।"
      }
  },
  forms: {
      labels: {
          farmName: "खेत का नाम",
          area: "क्षेत्र (हेक्टेयर)",
          location: "स्थान का पता"
      },
      buttons: {
          cancel: "रद्द करें",
          addFarm: "खेत जोड़ें",
          adding: "जोड़ा जा रहा है..."
      },
      errors: {
          farmNameRequired: "खेत का नाम आवश्यक है।",
          areaPositive: "क्षेत्र एक सकारात्मक संख्या होनी चाहिए।",
          locationRequired: "स्थान का पता आवश्यक है।"
      }
  },
  notifications: {
      farmAdded: "खेत '{{name}}' सफलतापूर्वक जोड़ा गया!",
      farmAddFailed: "खेत जोड़ने में विफल। कृपया पुन: प्रयास करें।",
      weatherError: "मौसम की जानकारी प्राप्त नहीं हो सकी।",
      marketError: "बाजार मूल्य डेटा प्राप्त नहीं हो सका।",
      yieldError: "उपज का पूर्वानुमान उत्पन्न नहीं हो सका।",
      aiQuotaError: "अत्यधिक मांग (कोटा पार हो गया) के कारण एआई सेवा वर्तमान में अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।",
      mapsKeyError: "मानचित्र सेवा एक कॉन्फ़िगरेशन समस्या के कारण अनुपलब्ध है। कृपया सहायता से संपर्क करें।"
  },
  cropHealth: {
    title: "एआई-संचालित फसल स्वास्थ्य विश्लेषण",
    description: "तत्काल निदान और उपचार की सिफारिशें प्राप्त करने के लिए पौधे की पत्ती की एक छवि अपलोड करें।",
    tryExample: "या एक उदाहरण छवि आज़माएं:",
    cropContext: "बेहतर परिणामों के लिए, हमें बताएं (वैकल्पिक): यह कौन सी फसल है?",
    cropPlaceholder: "जैसे, टमाटर, मक्का, आलू",
    analyzeButton: "फसल स्वास्थ्य का विश्लेषण करें",
    welcomeTitle: "एग्रीस्मार्ट हेल्थ में आपका स्वागत है",
    welcomeDescription: "आपका व्यक्तिगत फसल स्वास्थ्य सहायक मदद के लिए तैयार है। कृपया शुरू करने के लिए एक छवि अपलोड करें।",
  },
  marketFinder: {
    title: "किसान बाजार मूल्य खोजक",
    description: "पूरे भारत के बाजारों से नवीनतम कमोडिटी की कीमतें प्राप्त करें।",
    getPrices: "कीमतें प्राप्त करें",
    searching: "खोजा जा रहा है...",
    results: "परिणाम ({{count}})",
    downloadCsv: "सीएसवी डाउनलोड करें",
    noResultsTitle: "कोई परिणाम नहीं मिला",
    noResultsDescription: "एक व्यापक खोज के लिए अपने फ़िल्टर समायोजित करने का प्रयास करें।",
    selectLabel: "{{label}} चुनें",
    loadingLabel: "{{label}} लोड हो रहे हैं...",
  }
};

const ml: Translations = {
  app: {
    loading: "സ്മാർട്ട് ഫാം ലോഡ് ചെയ്യുന്നു...",
    aiInitError: "എഐ സേവനം ആരംഭിച്ചിട്ടില്ല. API കീ കാണുന്നില്ലായിരിക്കാം അല്ലെങ്കിൽ അസാധുവായിരിക്കാം.",
  },
  login: {
    welcome: "അഗ്രിസ്മാർട്ടിലേക്ക് സ്വാഗതം",
    tagline: "നിങ്ങളുടെ എഐ-പവർഡ് ഫാം മാനേജ്മെന്റ് ഹബ്",
    selectProfile: "നിങ്ങളുടെ പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക",
    loginButton: "ലോഗിൻ ചെയ്യുക",
    noProfiles: "കർഷക പ്രൊഫൈലുകളൊന്നും ലഭ്യമല്ല",
    selectFarmerAlert: "ലോഗിൻ ചെയ്യുന്നതിന് ദയവായി ഒരു കർഷകനെ തിരഞ്ഞെടുക്കുക."
  },
  dashboard: {
    title: "ഡാഷ്ബോർഡ്",
    overviewFor: "{{name}}-ന്റെ ഡാഷ്ബോർഡ്",
    farmers: "കർഷകർ",
    logout: "ലോഗ് ഔട്ട്",
    selectFarmer: "അവരുടെ ഡാഷ്ബോർഡ് കാണുന്നതിന് ഒരു കർഷകനെ തിരഞ്ഞെടുക്കുക.",
    farmsAndPlots: "ഫാമുകളും പ്ലോട്ടുകളും",
    addFarm: "ഫാം ചേർക്കുക",
    activityFeed: "പ്രവർത്തനങ്ങളും കുറിപ്പുകളും",
    farmerProfile: "കർഷക പ്രൊഫൈൽ",
    nav: {
      dashboard: "ഡാഷ്ബോർഡ്",
      plots: "ഫാമുകളും പ്ലോട്ടുകളും",
      feed: "പ്രവർത്തന ഫീഡ്",
      cropHealth: "വിള ആരോഗ്യം",
      assistant: "എഐ അസിസ്റ്റന്റ്",
      market: "വിപണി വിലകൾ",
      weather: "കാലാവസ്ഥ",
      liveAdvisor: "ലൈവ് അസിസ്റ്റന്റ്",
    },
  },
  modals: {
    addFarm: {
        title: "പുതിയ ഫാം ചേർക്കുക"
    },
    addDailyLog: {
        title: "{{plotName}} എന്നതിനായി പ്രതിദിന ലോഗ് ചേർക്കുക",
        photos: "ഫോട്ടോകൾ",
        upload: "ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക",
        camera: "ക്യാമറ ഉപയോഗിക്കുക",
        notes: "കർഷകന്റെ കുറിപ്പുകൾ (ഓപ്ഷണൽ)",
        runAI: "ആദ്യ ചിത്രത്തിൽ എഐ വിശകലനം നടത്തുക",
        analyzing: "വിശകലനം ചെയ്യുന്നു...",
        aiSummary: "എഐ സംഗ്രഹം:",
        save: "ലോഗ് സംരക്ഷിക്കുക",
        saving: "സംരക്ഷിക്കുന്നു...",
    },
    plotLogHistory: {
        title: "{{plotName}} എന്നതിനായുള്ള ലോഗ് ചരിത്രം",
        noLogs: "ഈ പ്ലോട്ടിനായി പ്രതിദിന ലോഗുകളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല."
    }
  },
  forms: {
      buttons: {
          cancel: "റദ്ദാക്കുക",
      }
  },
  cropHealth: {
    title: "എഐ-പവർഡ് വിള ആരോഗ്യ വിശകലനം",
    description: "തൽക്ഷണ രോഗനിർണയവും ചികിത്സാ ശുപാർശകളും ലഭിക്കുന്നതിന് ഒരു ചെടിയുടെ ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",
    analyzeButton: "വിള ആരോഗ്യം വിശകലനം ചെയ്യുക",
  },
  marketFinder: {
    title: "കർഷക വിപണി വില കണ്ടെത്തൽ",
    description: "ഇന്ത്യയിലെമ്പാടുമുള്ള വിപണികളിൽ നിന്ന് ഏറ്റവും പുതിയ ചരക്ക് വിലകൾ നേടുക.",
    getPrices: "വിലകൾ നേടുക",
  }
};

const ta: Translations = {
  app: {
    loading: "ஸ்மார்ட் ஃபார்ம் ஏற்றப்படுகிறது...",
    aiInitError: "AI சேவை தொடங்கப்படவில்லை. API கீ காணாமல் இருக்கலாம் அல்லது தவறாக இருக்கலாம்.",
  },
  login: {
    welcome: "அக்ரிஸ்மார்ட்டுக்கு வரவேற்கிறோம்",
    tagline: "உங்கள் AI-இயங்கும் பண்ணை மேலாண்மை மையம்",
    selectProfile: "உங்கள் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
    loginButton: "உள்நுழையவும்",
    noProfiles: "விவசாயி சுயவிவரங்கள் எதுவும் கிடைக்கவில்லை",
    selectFarmerAlert: "உள்நுழைய ஒரு விவசாயியைத் தேர்ந்தெடுக்கவும்."
  },
  dashboard: {
    title: "แดชบอร์ด",
    overviewFor: "{{name}} இன் டாஷ்போர்டு",
    farmers: "விவசாயிகள்",
    logout: "வெளியேறு",
    selectFarmer: "அவர்களின் டாஷ்போர்டைக் காண ஒரு விவசாயியைத் தேர்ந்தெடுக்கவும்.",
    farmsAndPlots: "பண்ணைகள் மற்றும் மனைகள்",
    addFarm: "பண்ணையைச் சேர்க்கவும்",
    activityFeed: "செயல்பாடு மற்றும் குறிப்புகள்",
    farmerProfile: "விவசாயி சுயவிவரம்",
    nav: {
      dashboard: "டாஷ்போர்டு",
      plots: "பண்ணைகள் மற்றும் மனைகள்",
      feed: "செயல்பாட்டு ஊட்டம்",
      cropHealth: "பயிர் ஆரோக்கியம்",
      assistant: "AI உதவியாளர்",
      market: "சந்தை விலைகள்",
      weather: "வானிலை",
      liveAdvisor: "நேரடி உதவியாளர்",
    },
  },
  modals: {
    addFarm: {
        title: "புதிய பண்ணையைச் சேர்க்கவும்"
    },
    addDailyLog: {
        title: "{{plotName}} க்கான தினசரி பதிவைச் சேர்க்கவும்",
        photos: "புகைப்படங்கள்",
        upload: "கோப்புகளைப் பதிவேற்றவும்",
        camera: "கேமராவைப் பயன்படுத்தவும்",
        notes: "விவசாயியின் குறிப்புகள் (விருப்பத்தேர்வு)",
        runAI: "முதல் படத்தில் AI பகுப்பாய்வை இயக்கவும்",
        analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
        aiSummary: "AI சுருக்கம்:",
        save: "பதிவைச் சேமிக்கவும்",
        saving: "சேமிக்கப்படுகிறது...",
    },
    plotLogHistory: {
        title: "{{plotName}} க்கான பதிவு வரலாறு",
        noLogs: "இந்த மனைக்கு தினசரி பதிவுகள் எதுவும் பதிவு செய்யப்படவில்லை."
    }
  },
  forms: {
      buttons: {
          cancel: "ரத்துசெய்",
      }
  },
  cropHealth: {
    title: "AI-இயங்கும் பயிர் சுகாதார பகுப்பாய்வு",
    description: "உடனடி நோயறிதல் மற்றும் சிகிச்சை பரிந்துரைகளைப் பெற தாவர இலையின் படத்தைப் பதிவேற்றவும்.",
    analyzeButton: "பயிர் ஆரோக்கியத்தை பகுப்பாய்வு செய்யவும்",
  },
  marketFinder: {
    title: "விவசாயி சந்தை விலை கண்டுபிடிப்பாளர்",
    description: "இந்தியா முழுவதும் உள்ள சந்தைகளிலிருந்து சமீபத்திய சரக்கு விலைகளைப் பெறுங்கள்.",
    getPrices: "விலைகளைப் பெறுங்கள்",
  }
};

const te: Translations = {
  app: {
    loading: "స్మార్ట్ ఫార్మ్ లోడ్ అవుతోంది...",
    aiInitError: "AI సేవ ప్రారంభించబడలేదు. API కీ తప్పి ఉండవచ్చు లేదా చెల్లనిది కావచ్చు.",
  },
  login: {
    welcome: "అగ్రిస్మార్ట్‌కు స్వాగతం",
    tagline: "మీ AI-ఆధారిత వ్యవసాయ నిర్వహణ కేంద్రం",
    selectProfile: "మీ ప్రొఫైల్‌ను ఎంచుకోండి",
    loginButton: "లాగిన్ అవ్వండి",
    noProfiles: "రైతు ప్రొఫైల్‌లు అందుబాటులో లేవు",
    selectFarmerAlert: "లాగిన్ చేయడానికి దయచేసి ఒక రైతును ఎంచుకోండి."
  },
  dashboard: {
    title: "డాష్‌బోర్డ్",
    overviewFor: "{{name}} యొక్క డాష్‌బోర్డ్",
    farmers: "రైతులు",
    logout: "లాగ్ అవుట్",
    selectFarmer: "వారి డాష్‌బోర్డ్ చూడటానికి ఒక రైతును ఎంచుకోండి.",
    farmsAndPlots: "వ్యవసాయ క్షేత్రాలు మరియు ప్లాట్లు",
    addFarm: "వ్యవసాయ క్షేత్రాన్ని జోడించండి",
    activityFeed: "కార్యాచరణ మరియు గమనికలు",
    farmerProfile: "రైతు ప్రొఫైల్",
    nav: {
      dashboard: "డాష్‌బోర్డ్",
      plots: "క్షేత్రాలు మరియు ప్లాట్లు",
      feed: "కార్యాచరణ ఫీడ్",
      cropHealth: "పంట ఆరోగ్యం",
      assistant: "AI సహాయకుడు",
      market: "మార్కెట్ ధరలు",
      weather: "వాతావరణం",
      liveAdvisor: "లైవ్ అసిస్టెంట్",
    },
  },
  modals: {
    addFarm: {
        title: "కొత్త వ్యవసాయ క్షేత్రాన్ని జోడించండి"
    },
    addDailyLog: {
        title: "{{plotName}} కోసం రోజువారీ లాగ్‌ను జోడించండి",
        photos: "ఫోటోలు",
        upload: "ఫైల్‌లను అప్‌లోడ్ చేయండి",
        camera: "కెమెరాను ఉపయోగించండి",
        notes: "రైతు గమనికలు (ఐచ్ఛికం)",
        runAI: "మొదటి చిత్రంపై AI విశ్లేషణను అమలు చేయండి",
        analyzing: "విశ్లేషిస్తోంది...",
        aiSummary: "AI సారాంశం:",
        save: "లాగ్‌ను సేవ్ చేయండి",
        saving: "సేవ్ చేస్తోంది...",
    },
    plotLogHistory: {
        title: "{{plotName}} కోసం లాగ్ చరిత్ర",
        noLogs: "ఈ ప్లాట్ కోసం రోజువారీ లాగ్‌లు ఏవీ నమోదు చేయబడలేదు."
    }
  },
  forms: {
      buttons: {
          cancel: "రద్దు చేయండి",
      }
  },
  cropHealth: {
    title: "AI-ఆధారిత పంట ఆరోగ్య విశ్లేషణ",
    description: "తక్షణ నిర్ధారణ మరియు చికిత్స సిఫార్సులను పొందడానికి మొక్క ఆకు యొక్క చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    analyzeButton: "పంట ఆరోగ్యాన్ని విశ్లేషించండి",
  },
  marketFinder: {
    title: "రైతు మార్కెట్ ధరల ఫైండర్",
    description: "భారతదేశంలోని మార్కెట్ల నుండి తాజా వస్తువుల ధరలను పొందండి.",
    getPrices: "ధరలను పొందండి",
  }
};

const bn: Translations = {
  app: {
    loading: "স্মার্ট ফার্ম লোড হচ্ছে...",
    aiInitError: "AI পরিষেবা শুরু হয়নি। API কী অনুপস্থিত বা অবৈধ হতে পারে।",
  },
  login: {
    welcome: "এগ্রিস্মার্টে স্বাগতম",
    tagline: "আপনার AI-চালিত কৃষি ব্যবস্থাপনা কেন্দ্র",
    selectProfile: "আপনার প্রোফাইল নির্বাচন করুন",
    loginButton: "লগইন করুন",
    noProfiles: "কোনো কৃষক প্রোফাইল উপলব্ধ নেই",
    selectFarmerAlert: "লগইন করতে অনুগ্রহ করে একজন কৃষক নির্বাচন করুন।"
  },
  dashboard: {
    title: "ড্যাশবোর্ড",
    overviewFor: "{{name}} এর ড্যাশবোর্ড",
    farmers: "কৃষক",
    logout: "লগ আউট",
    selectFarmer: "তার ড্যাশবোর্ড দেখতে একজন কৃষক নির্বাচন করুন।",
    farmsAndPlots: "খামার ও প্লট",
    addFarm: "খামার যোগ করুন",
    activityFeed: "কার্যকলাপ ও নোট",
    farmerProfile: "কৃষক প্রোফাইল",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      plots: "খামার ও প্লট",
      feed: "কার্যকলাপ ফিড",
      cropHealth: "ফসলের স্বাস্থ্য",
      assistant: "AI সহকারী",
      market: "বাজার দর",
      weather: "আবহাওয়া",
      liveAdvisor: "লাইভ সহকারী",
    },
  },
  modals: {
    addFarm: {
        title: "নতুন খামার যোগ করুন"
    },
    addDailyLog: {
        title: "{{plotName}} এর জন্য দৈনিক লগ যোগ করুন",
        photos: "ছবি",
        upload: "ফাইল আপলোড করুন",
        camera: "ক্যামেরা ব্যবহার করুন",
        notes: "কৃষকের নোট (ঐচ্ছিক)",
        runAI: "প্রথম ছবিতে AI বিশ্লেষণ চালান",
        analyzing: "বিশ্লেষণ করা হচ্ছে...",
        aiSummary: "AI সারাংশ:",
        save: "লগ সংরক্ষণ করুন",
        saving: "সংরক্ষণ করা হচ্ছে...",
    },
    plotLogHistory: {
        title: "{{plotName}} এর জন্য লগ ইতিহাস",
        noLogs: "এই প্লটের জন্য এখনও কোনো দৈনিক লগ রেকর্ড করা হয়নি।"
    }
  },
  forms: {
      buttons: {
          cancel: "বাতিল করুন",
      }
  },
  cropHealth: {
    title: "AI-চালিত ফসল স্বাস্থ্য বিশ্লেষণ",
    description: "তাৎক্ষণিক রোগ নির্ণয় এবং চিকিৎসার সুপারিশ পেতে একটি গাছের পাতার ছবি আপলোড করুন।",
    analyzeButton: "ফসলের স্বাস্থ্য বিশ্লেষণ করুন",
  },
  marketFinder: {
    title: "কৃষক বাজার মূল্য সন্ধানকারী",
    description: "ভারত জুড়ে বাজার থেকে সর্বশেষ পণ্যের দাম পান।",
    getPrices: "দাম পান",
  }
};


export const translations: { [key: string]: Translations } = {
  en,
  hi,
  ml,
  ta,
  te,
  bn
};