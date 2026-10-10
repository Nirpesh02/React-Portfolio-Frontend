import { useState, useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { FaRobot, FaLock, FaPaperPlane, FaUser, FaCheckCircle, FaSpinner, FaPlus, FaHistory } from "react-icons/fa";
import { toast } from "react-toastify";

const botContext = {
  greetings: [
    "hi", "hello", "hey", "namaste", "greetings", "namaskar", "salam", "ola", 
    "k xa", "k cha", "good morning", "good evening", "good afternoon", "yo"
  ],

  who_are_you: [
    "ko ho timi", "timi ko", "who are you", "what is your name", "timro naam", 
    "naam k ho", "intro", "introduce", "parichaya", "about you", "timi bot ho"
  ],

  how_are_you: [
    "k xa khabar", "k cha khabar", "kasto cha", "k chha", "how are you", 
    "sanchai", "sanchai xau", "k gardai", "thik xa", "all good", "aramai", "k hudai cha"
  ],

  budget: [
    "budget", "cost", "price", "money", "pay", "charge", "expensive", 
    "kati lagcha", "kati parcha", "paisa", "rate", "quotation", "quote", 
    "fee", "estimate", "pricing", "package", "kasto charge cha"
  ],

  discount: [
    "discount", "sasto", "ghatauna", "milxa", "milcha", "kam gara", 
    "bargain", "best offer", "offer", "kehi milaideu", "aliali ghataunu", "student discount"
  ],

  time: [
    "time", "how long", "duration", "fast", "days", "months", "weeks", 
    "turnaround", "kati din", "deadline", "kahile samma", "urgent", "chhito", "delivery time"
  ],

  skills: [
    "skills", "technology", "stack", "react", "node", "mongo", "database", 
    "frontend", "backend", "fullstack", "k k aauxa", "k garchau", "tools", 
    "tech stack", "nextjs", "python", "tailwind", "express"
  ],

  portfolio: [
    "portfolio", "previous work", "sample", "projects", "demo", "work", 
    "pariyo", "kam dekhau", "dekhaunus", "github", "live link", "agadi ko kam", "case study"
  ],

  availability: [
    "available", "free xau", "free chau", "fursad", "can you start", 
    "when can you start", "vyauxau", "hire", "kam garna sakxau", "ready to work", "busy xau"
  ],

  services: [
    "service", "k k banauxau", "website", "mobile app", "app", "ui ux", 
    "design", "landing page", "ecommerce", "system", "software", "api", "seo"
  ],

  payment_terms: [
    "payment method", "esewa", "khalti", "bank", "advance", "half payment", 
    "paisa kasari line", "milestone", "cash", "connectips", "qr", "part payment"
  ],

  revisions: [
    "revision", "changes", "change", "ferna milxa", "banauna milxa", 
    "correction", "modify", "kati choti change", "update garna milcha", "edit"
  ],

  support: [
    "support", "maintenance", "help", "bug", "fix", "after", 
    "paxi k hunxa", "warranty", "bigriyo vane", "issue", "error", "crash vayo"
  ],

  contact: [
    "contact", "email", "phone", "number", "call", "meet", 
    "bhetna", "number dim na", "whatsapp", "location", "connect", "reach", "viber", "telegram"
  ],

  where_are_you: [
    "kaha ho tmro ghar", "kaha ho timro ghar", "kaha ho", "where are you from", 
    "where do you live", "address", "kun thau", "ghar kata", "kathmandu", "pokhara"
  ],

  hosting_domain: [
    "domain", "hosting", "server", "aws", "cpanel", "domain chaincha", 
    "server charges", "cloud", "deployment", "live kasari garne"
  ],

  experience: [
    "experience", "kati barsa", "experienced", "background", "qualification", 
    "padhai", "kati time vayo", "kati bhayo kam gareko"
  ],

  seo: [
    "seo", "google", "rank", "search engine", "google ma aauchha", 
    "marketing", "traffic", "first page"
  ],

  admin_panel: [
    "admin", "dashboard", "change garna milcha", "update aafai", 
    "cms", "content manage", "edit garna", "photo change"
  ],

  yearly_renewal: [
    "renewal", "yearly", "barsa barsa", "recurring", "monthly", 
    "paxi kati lagcha", "har barsa", "paxi charge lagcha"
  ],

  ecommerce: [
    "ecommerce", "online store", "shopping", "cart", "esewa integration", 
    "khalti integration", "payment gateway", "saman bechne"
  ],

  contract_nda: [
    "contract", "agreement", "nda", "terms", "paperwork", "legal", 
    "deal", "sign garne", "document"
  ],

  testimonials: [
    "review", "feedback", "rating", "client feedback", "satisfaction", 
    "aru client", "bharpardo"
  ],

  security: [
    "security", "hack", "safe", "ssl", "secure", "data safe", 
    "surakshit", "privacy", "protection"
  ],

  goodbye: [
    "bye", "tata", "see you", "good night", "huss", "bhetौला", 
    "paxi kura garumla", "thank you", "dhanyabad", "welcome", "see ya"
  ],

  jokes: [
    "haha", "hehe", "lol", "lmao", "joke", "funny", "jiskeko", 
    "hasayo", "kya kura", "haawa", "comedy", "hasuthyo", "rofl", 
    "xya hasayo", "hasaidiyau", "bore vayo joke sunau"
  ],

  emojis_love: [
    "❤️", "😍", "🥰", "😘", "💕", "💖", "💗", "💙", "love", "maya"
  ],

  emojis_smile: [
    "😊", "😀", "😃", "😄", "😁", "😆", "😅", "😇", "🙂", "smile", "khusi"
  ],

  emojis_cry: [
    "😭", "😢", "😥", "😓", "😿", "sad", "dukha", "ruwaudai"
  ],

  emojis_angry: [
    "😡", "😠", "🤬", "😤", "angry", "risayo", "jhoq"
  ]
};


const responseTemplates = {
  greetings: {
    en: [
      "Hello! 👋 How can I assist you with your project today?",
      "Hi there! Welcome. Are you looking to build a new website or app?"
    ],
    np: [
      "Namaste! 🙏 Kasto chaldai chha? Tapai lai mero services ko barema k janna man chha?",
      "Hello! Welcome. Kunai naya project ko plan ma hunuhunchha?"
    ]
  },
  who_are_you: {
    en: [
      "I am Nirpesh's AI Assistant 🤖! I can answer questions about his services, pricing, and skills.",
      "I'm an AI bot created by Nirpesh to help you navigate his portfolio and answer your queries."
    ],
    np: [
      "Ma Nirpesh ko AI Assistant ho 🤖! Maile tapai lai unko services, pricing, ra skills ko barema jankari dina sakchhu.",
      "Ma Nirpesh le banaeko AI bot ho. Tapai ko kunai prashna chha bhane sodhna saknu hunchha!"
    ]
  },
  how_are_you: {
    en: [
      "I'm doing great, thanks for asking! 😊 How are you doing? Do you need any help with a project?",
      "All good here! 🚀 Ready to answer your questions. What's on your mind?"
    ],
    np: [
      "Ma ekdam thik chhu, sodhnu vayeko ma dhanyabad! 😊 Tapai lai kasto chha? Project ko barema kei sodhna man chha?",
      "Aramai chhu! Tapai ko k chha khabar? Kehi help garna sakchhu ki?"
    ]
  },
  budget: {
    en: [
      "My pricing typically starts at Rs. 50,000 for standard websites. Could you share more details about your project? 💰",
      "The cost depends on your requirements, but a basic app starts around Rs. 50,000. What features are you looking for?"
    ],
    np: [
      "Project ko features anusar depend garchha, tara normal website haru around Rs. 50,000 bata suru hunchha. Tapai ko kun specific scope chha?",
      "Mero standard pricing Rs. 50,000 bata start hunchha. Tapai lai kasto type ko application banauna man chha, detail share garnu na?"
    ]
  },
  discount: {
    en: [
      "I do offer special discounts for students and startups! Let's discuss your exact requirements to see what we can do. 😊",
      "There are occasional discounts available. Let me know what you need, and I'll give you the best possible offer."
    ],
    np: [
      "Ahile special student/startup discount haru chalirakheko chha! Tapai ko exact requirements bujhera ma best offer dinchu. 😊",
      "Hajur, milayera garna sakincha. Tapai ko project kasto ho, tyasaima depend garcha. Discuss garum na!"
    ]
  },
  time: {
    en: [
      "For a standard website, my typical turnaround time is 2-4 weeks. More complex applications can take 1-3 months. ⏱️",
      "It usually takes 2-4 weeks for standard projects. If it's urgent, we can negotiate the timeline. When do you need it?"
    ],
    np: [
      "Normal website banauna 2-4 weeks lagcha. Ali thulo system ho bhane 1-3 months lagna sakcha. ⏱️",
      "Kam ko pressure ra size herera huncha, tara generally 1 mahina vitra standard kam sakkincha. Tapai lai kahile samma ma chahiyeko ho?"
    ]
  },
  skills: {
    en: [
      "I specialize in the MERN stack (MongoDB, Express, React, Node.js), Tailwind CSS, and Framer Motion. 🚀",
      "My main tech stack includes React, Next.js, Node.js, and MongoDB. I can build both frontend and backend."
    ],
    np: [
      "Maile mainly MERN stack (MongoDB, Express, React, Node.js) ma kam garchhu. Frontend ma Tailwind CSS ra Framer Motion pani use garchhu. 🚀",
      "Mero expertise React, Node.js ra database management ma chha. Full-stack development ko kam garna sakchhu."
    ]
  },
  portfolio: {
    en: [
      "You can check out my previous work in the Projects section. Both live links and GitHub repositories are available! 🚀",
      "I've worked on several web apps. Please scroll up to the portfolio section to see the live demos and case studies."
    ],
    np: [
      "Tapai le mero Projects section ma gayera maile banayeka past projects herna saknu hunchha. Live link ra GitHub dubai available chha! 🚀",
      "Maile dherai website haru banayeko chhu. Mathi Portfolio section ma gayera check garnu na, idea aauchha."
    ]
  },
  availability: {
    en: [
      "I am currently available to take on new projects! We can discuss your requirements and start soon. 🗓️",
      "Yes, I have some free time right now. Let me know what kind of project you want to build."
    ],
    np: [
      "Ma ahile naya project ko lagi available chhu! Hami tapai ko requirement discuss garera kam suru garna sakchau. 🗓️",
      "Hajur, ahile fursad chha. Tapai ko kam ko detail pathaunu na, ani herera start garamla."
    ]
  },
  services: {
    en: [
      "I provide Web Development (React, Next.js, Node.js), UI/UX Design, and API integration services. What do you need? 💻",
      "My services include full-stack development, landing pages, and custom software systems."
    ],
    np: [
      "Ma mainly Web Development (React, Next.js, Node.js), UI/UX Design, ra API integration ko kaam garchhu. Any specific requirement? 💻",
      "Maile website banaune, UI design garne ra custom system haru develop garne kam garchhu."
    ]
  },
  payment_terms: {
    en: [
      "Payment is usually done in 2-3 milestones: 40% advance, 40% after development, and 20% on go-live. I accept bank transfers and online wallets. 💳",
      "I prefer milestone-based payments. Usually an upfront deposit is required to start the work."
    ],
    np: [
      "Payment generally 2-3 milestones ma huncha. Advance 40%, development paxi 40% ra live gaisakepaxi 20%. Bank transfer, eSewa, ra Khalti accepted chha. 💳",
      "Suru ma kehi advance line garchhu, ani aadhi kam sakepaxi ra final ma baaki payment garne gari milaucha."
    ]
  },
  revisions: {
    en: [
      "You can request changes multiple times during the development phase. Major changes after the final delivery might cost extra. 📝",
      "I'm happy to revise the work until you are satisfied during the build process. Post-launch changes are handled separately."
    ],
    np: [
      "Project during development dherai choti changes garna milcha. Tara final vaisekepaxi major changes ko lagi extra charge lagna sakcha. 📝",
      "Kam vai rakhda kheri ta jati pani milauna milcha. Tara euta agreement vayepaxi naya feature thapda chai charge lagcha."
    ]
  },
  support: {
    en: [
      "Yes, I provide 1 month of free bug-fixing and support after the launch! After that, I offer ongoing maintenance contracts. 🛠️",
      "Post-launch support is included for the first month. We can sign a maintenance agreement if you need long-term support."
    ],
    np: [
      "Yes, I provide 1 month of free bug-fixing and support after the launch! After that, I offer ongoing maintenance contracts. 🛠️",
      "Website live vayeko 1 mahina samma kunai bug aayo bhane free ma fix gardinchu. Tyas paxi chai maintenance contract garna milcha."
    ]
  },
  where_are_you: {
    en: [
      "My home base is Biratchowk, Morang! 🌍 But I work with clients globally. Where are you from?",
      "I am located in Biratchowk, Morang, Nepal. How about you?"
    ],
    np: [
      "Mero (Nirpesh ko) ghar Biratchowk, Morang ma ho! 🌍 Tapai chahi kata bata ho ni?",
      "Maile Biratchowk bata kam garchhu. Tapai kata bata boldai hunuhunchha?"
    ]
  },
  hosting_domain: {
    en: [
      "You can buy your own hosting and domain, or I can help you set it up on AWS, Vercel, or cPanel. Note that this is an extra cost. 🌐",
      "I can assist with deployment on modern cloud platforms. Domain and server charges are separate from the development fee."
    ],
    np: [
      "Hosting ra Domain tapai aafai le kinna saknu hunchha, ya maile AWS, Vercel, ya cPanel ma setup gardina sakchhu. Yo cost project pricing bahek extra huncha. 🌐",
      "Domain ra hosting ko paisa chhutai lagcha. Tapai le kinera dinu vaye ni huncha, nava maile kineko charge add garchhu."
    ]
  },
  experience: {
    en: [
      "I have successfully completed many web development projects, focusing on modern and scalable web apps. 👨‍💻",
      "I've been working with modern web technologies for quite some time, delivering high-quality web applications."
    ],
    np: [
      "Maile web development ma dherai projects haru safaltapurvak sampanna garisakeko chhu. Mero main focus modern ra scalable web apps banaune ma ho. 👨‍💻",
      "Maile dherai clients haru sanga kam garisakeko chhu. Quality ra performance ma ma ekdam dhyan dinchu."
    ]
  },
  seo: {
    en: [
      "All websites I build are SEO-friendly! I use proper meta tags, semantic HTML, and ensure fast loading speeds to help you rank on Google. 📈",
      "Yes, I follow SEO best practices so your site is ready to be indexed by search engines like Google."
    ],
    np: [
      "Maile banaune sabai website haru SEO-friendly hunchhan! Google ma ramro rank garna ko lagi meta tags, fast loading, ra proper semantic HTML use garchhu. 📈",
      "Hajur, website SEO optimized nai huncha. Google ma vetne gari banaidinchu."
    ]
  },
  admin_panel: {
    en: [
      "Yes, I can build a custom Admin Dashboard so you can easily change text, photos, and content yourself. 🎛️",
      "I can integrate a CMS or build a custom admin panel so you have full control over your website's content."
    ],
    np: [
      "Hajur, tapai lai sajilo hos bhanera ma Custom Admin Dashboard pani banaidincha jaha bata tapai aafai le website ko text, photos ra content change garna saknu hunchha. 🎛️",
      "Content manage garna ko lagi euta ramro admin panel banaidinchu, jaha bata tapai le aafai update garna saknu huncha."
    ]
  },
  yearly_renewal: {
    en: [
      "The web development charge is one-time. However, you will need to renew your Domain and Hosting every year. 🔄",
      "My development fee is a one-time payment. You just have to pay your yearly hosting and domain renewal fees."
    ],
    np: [
      "Website develop garne charge one-time ho. Tara Domain ra Hosting ko lagi chai tapai le barsa-barsa (yearly) renew garna parne hunchha. 🔄",
      "Kam garne paisa ekchoti matra ho. Pachi barsa barsa ma server ra nam (domain) ko matra paisa tirnu parcha."
    ]
  },
  ecommerce: {
    en: [
      "For e-commerce websites, I can integrate shopping carts, order management, and payment gateways like eSewa or Khalti. 🛒",
      "Yes, I can build full-fledged online stores with payment gateway integrations."
    ],
    np: [
      "E-commerce website ma maile Cart system, Order management, ra eSewa/Khalti jasto Payment Gateways pani integrate gardina sakchhu. 🛒",
      "Online saman bechne website pani banaunchu. eSewa, Khalti jasta payment system halna majjale milcha."
    ]
  },
  contract_nda: {
    en: [
      "Your data and ideas are completely safe. We can sign an NDA and a proper contract before starting the work. 📄",
      "I am happy to sign an NDA. I believe in keeping client information secure and confidential."
    ],
    np: [
      "Tapai ko data ra idea completely safe chha. Hamile kam suru garnu vanda agadi NDA (Non-Disclosure Agreement) ra proper contract sign garna sakchau. 📄",
      "Kam suru garnu vanda agadi hami contract paper garna sakchau, jale garda tapai ko idea secure huncha."
    ]
  },
  testimonials: {
    en: [
      "My past clients have given great reviews about my timeline and code quality. I can provide references when we meet! ⭐",
      "I have positive feedback from my clients. You can see some of their reviews on my portfolio."
    ],
    np: [
      "Mero past clients haru le mero timeline ra code quality ko ekdam ramro review diyeka chhan. Hami bhetda ma tapai lai references dina sakchhu! ⭐",
      "Aba samma ko clients haru sabaile ramro feedback dinu vako chha. Quality ma tapai dhukka huda huncha."
    ]
  },
  security: {
    en: [
      "The web apps I build use the latest security standards (JWT authentication, data encryption, and XSS/CSRF protection). 🔒",
      "I take security seriously and implement best practices to keep your application safe from common vulnerabilities."
    ],
    np: [
      "Maile banaune web apps haru latest security standards (JWT authentication, data encryption, ra basic XSS/CSRF protection) use garera baneko huncha. 🔒",
      "Website hack nahos ra data safe rahos bhanera maile proper security measure haru haleko hunchu."
    ]
  },
  contact: {
    en: [
      "You can reach out to me via the Contact page or email me directly. Let's schedule a Google Meet to discuss further! 📞",
      "Feel free to use the contact form on this site, or drop me an email to get in touch."
    ],
    np: [
      "Malai contact garna ko lagi Contact page ma gayera form varna saknu huncha, ya direct call garda ni huncha. 📞",
      "Hami Google Meet ma kura garna sakchau, contact page bata form fill garnu na."
    ]
  },
  jokes: {
    en: [
      "Haha 😂! I'm glad you're having fun. Should we talk about your project now? 💻",
      "I see you're in a good mood! I love a good joke, but my programming restricts me from laughing out loud. 🤖"
    ],
    np: [
      "Haha 😂! Tapai sanga kura garna ekdam majja aairaheko chha! Aba chahi ali kam ko kura garau ki? 💻",
      "Hehe! Ramailo kura garna thalnu vayo. Aba project ko barema pani discuss garum hai?"
    ]
  },
  emojis_love: {
    en: [
      "Aww, thank you for the love! ❤️ I'll put the same love into building your project! ✨",
      "Thanks! 🥰 It's great connecting with you."
    ],
    np: [
      "Aww, thank you for the love! ❤️ Tapai ko project pani yestai pyaro banaune chhu! ✨",
      "Dhanyabad! 😍 Tapai ko support ko lagi."
    ]
  },
  emojis_smile: {
    en: [
      "I'm glad to see you smiling! 😊 Is there anything I can help you with?",
      "Smiles all around! 😁 Let me know if you have any questions."
    ],
    np: [
      "Tapai khusi vayeko dekhera malai pani khusi lagyo! 😊 Kehi help garna sakchhu ki?",
      "Haseko dekhera ramailo lagyo! 😀 Any questions?"
    ]
  },
  emojis_cry: {
    en: [
      "Oh no, why the sad face? 😢 If you're stressed about a project, let me help you solve it!",
      "Don't cry! 😭 Let me know what's wrong and I'll do my best to assist."
    ],
    np: [
      "Aiya, kina sad hunu vayeko? 😢 Project ko kei tension chha bhane malai vanna saknu hunchha, ma solve garna try garchhu!",
      "Naruwunu na! 😭 Kehi technical issue pareko ho bhane vanna saknu hunchha."
    ]
  },
  emojis_angry: {
    en: [
      "Whoa, why so angry? 😅 Let's talk it out. How can I assist you?",
      "Take a deep breath! 😤 If there's an issue, I'm here to help."
    ],
    np: [
      "Oh ho, kina risaunu vayeko? 😅 Kura garera milau la ni, risauna pardaina!",
      "Narisau na harey! 😡 Kei samasya vayo vane vana, ma help garchu ni."
    ]
  },
  goodbye: {
    en: [
      "Goodbye! It was great chatting with you. Have a fantastic day ahead! 👋",
      "See you later! Feel free to reach out anytime. Bye! 👋"
    ],
    np: [
      "Goodbye! Tapai sanga kura garera khusi lagyo. Have a great day ahead! 👋",
      "Huss tata! Pachi feri kura garumla. Ramro sanga basnu hola! 👋"
    ]
  }
};

export default function Chatbot() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("locked"); // "locked", "pending", "unlocked"
  const [isLoading, setIsLoading] = useState(false);
  const [adminImage, setAdminImage] = useState(null);
  
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am Nirpesh's AI Assistant. How can I help you with your project today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showFullHistory, setShowFullHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    window.scrollTo(0, 0);
    // Local storage check removed as per user request

    const fetchAdminImage = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/home-profile`);
        const data = await res.json();
        if (data.success && data.data && data.data.smallImage) {
          const url = data.data.smallImage;
          setAdminImage(url.startsWith('/uploads') ? `${apiBaseUrl}${url}` : url);
        }
      } catch (error) {
        console.error("Failed to load admin image");
      }
    };
    fetchAdminImage();
  }, [apiBaseUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling for new messages
  useEffect(() => {
    if (status !== "unlocked" || !email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/inquiries/check?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.chatHistory) {
          // Only update if there are new messages
          setMessages((prev) => {
            if (prev.length !== data.chatHistory.length) return data.chatHistory;
            return prev;
          });
        }
      } catch (e) {
        console.error("Polling failed", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, apiBaseUrl, email]);

  const checkAccess = async (checkEmail) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/inquiries/check?email=${encodeURIComponent(checkEmail)}`);
      const data = await res.json();
      
      if (data.success) {
        if (data.status === "Approved") {
          setStatus("unlocked");
          
          if (data.chatHistory && data.chatHistory.length > 0) {
            setMessages(data.chatHistory);
          }
          
          toast.success("Chatbot unlocked!");
        } else if (data.status === "Pending") {
          setStatus("pending");
          toast.info("Please wait for admin approval...");
        } else if (data.status === "Declined") {
          setStatus("locked");
          toast.error("Your request has been declined by the admin.");
        } else {
          setStatus("locked");
          toast.error("No active request found. Please submit the Help form first.");
        }
      }
    } catch (error) {
      toast.error("Failed to verify access.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") return;
    checkAccess(email.trim());
  };

  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase();

    // Helper to check for whole words, avoiding partial matches (e.g., "pay" in "payment")
    const hasKeyword = (keywords) => {
      return keywords.some(w => {
        // Emojis and special characters
        if (/[^\w\s]/.test(w)) return text.includes(w);
        
        // Exact word match
        const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|\\s|[^a-z0-9])${escaped}($|\\s|[^a-z0-9])`, 'i');
        return regex.test(text);
      });
    };

    // Very simple heuristic to detect Nepali romanized text
    const nepaliWords = ["xa", "cha", "k", "kasto", "ho", "timi", "ma", "ra", "pani", "lai", "milcha", "garna", "kati", "paisa", "namaste", "sanchai", "ghar", "nai", "hunxa"];
    const isNepali = nepaliWords.some(nw => new RegExp(`(^|\\s|[^a-z0-9])${nw}($|\\s|[^a-z0-9])`, 'i').test(text));
    const lang = isNepali ? 'np' : 'en';

    let responses = [];

    // Check each category dynamically
    Object.keys(botContext).forEach((intent) => {
      if (hasKeyword(botContext[intent])) {
        // Pick a random response from the detected language array
        const replies = responseTemplates[intent]?.[lang];
        if (replies && replies.length > 0) {
          const finalReply = replies[Math.floor(Math.random() * replies.length)];
          responses.push(finalReply);
        }
      }
    });

    if (responses.length > 0) {
      return responses.join("\n\n");
    }

    const fallbackReplies = {
      en: [
        "Haha, I am still learning! 🤔 Could you please elaborate? You can ask me about pricing, timelines, or skills! ✨",
        "I didn't quite catch that. Could you ask me about my portfolio, services, or budget?"
      ],
      np: [
        "Haha, ma ajhai sikdai chhu! 🤔 Kripaya ali khulera vannu hunchha? Tapai pricing, timeline, wa skills ko barema sodhna saknu hunchha! ✨",
        "Maile thik sanga bujhina. Portfolio wa services ko barema sodhnu hune ho ki?"
      ]
    };
    return fallbackReplies[lang][Math.floor(Math.random() * fallbackReplies[lang].length)];
  };

  const saveMessageToBackend = async (msgObj) => {
    if (!email) return;
    try {
      await fetch(`${apiBaseUrl}/api/inquiries/chat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, message: msgObj }),
      });
    } catch (e) {
      console.error("Failed to save message");
    }
  };

  const handleNewChat = async () => {
    const sysMsg = { sender: "system", text: "--- NEW SESSION ---", timestamp: new Date().toISOString() };
    const botMsg = { sender: "bot", text: "Hello! A new chat session has started. How can I help you?", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, sysMsg, botMsg]);
    setShowFullHistory(false);
    await saveMessageToBackend(sysMsg);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMsg = { sender: "user", text: inputMessage, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    await saveMessageToBackend(newMsg);

    // Simulate thinking delay
    setTimeout(async () => {
      const botReplyText = generateBotResponse(newMsg.text);
      const botMsgObj = { sender: "bot", text: botReplyText, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsgObj]);
      await saveMessageToBackend(botMsgObj);
    }, 1000);
  };

  let lastSessionIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === "system") {
      lastSessionIdx = i;
      break;
    }
  }
  const displayedMessages = showFullHistory ? messages.filter(m => m.sender !== "system") : messages.slice(lastSessionIdx + 1);
  const hasHistoryToLoad = !showFullHistory && lastSessionIdx >= 0;

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-28 text-slate-100 sm:px-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-3xl">
        {status !== "unlocked" ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl text-center"
          >
            <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
              <FaLock size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Chatbot Locked</h1>
            
            {status === "pending" ? (
              <div className="text-yellow-400/90 bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl mb-6">
                <FaSpinner className="animate-spin mx-auto text-3xl mb-3" />
                <p className="text-lg font-medium mb-2">Please wait for admin approval...</p>
                <p className="text-sm">You have submitted the form, but the admin has not approved it yet. Please check back later.</p>
                <button onClick={() => checkAccess(email)} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-semibold underline">Check Status Again</button>
              </div>
            ) : (
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                To unlock the automatic AI assistant, you must first fill out the project request form from the <strong>Help</strong> page and get admin approval.
              </p>
            )}

            {status !== "pending" && (
              <form onSubmit={handleUnlockSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email..."
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 whitespace-nowrap"
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : "Unlock"}
                  </button>
                </div>
              </form>
            )}
          </Motion.div>
        ) : (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[70vh]"
          >
            {/* Chat Header */}
            <div className="bg-slate-950/50 border-b border-white/10 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <FaRobot size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    Nirpesh AI Assistant <FaCheckCircle className="text-green-400 text-sm" />
                  </h2>
                  <p className="text-xs text-indigo-300">Auto-Responder Enabled</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleNewChat}
                  title="Start New Chat"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {hasHistoryToLoad && (
                <div className="flex justify-center mb-4">
                  <button 
                    onClick={() => setShowFullHistory(true)}
                    className="text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30 transition-colors flex items-center gap-2"
                  >
                    <FaHistory /> Load Previous Chat History
                  </button>
                </div>
              )}
              
              {displayedMessages.map((msg, idx) => (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-400 text-xs border border-indigo-500/30">
                      <FaRobot />
                    </div>
                  )}
                  {msg.sender === "admin" && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 border border-emerald-500/50 overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.3)] bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {adminImage ? (
                        <img src={adminImage} alt="Admin" className="w-full h-full object-cover" />
                      ) : (
                        "N"
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : msg.sender === "admin"
                        ? "bg-emerald-900/40 text-slate-200 border border-emerald-500/20 rounded-bl-none"
                        : "bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none"
                  }`}>
                    {msg.sender === "admin" && <div className="text-xs text-emerald-400 font-semibold mb-1">Nirpesh (Admin)</div>}
                    {msg.text}
                    <div className={`text-[10px] mt-1.5 opacity-60 ${msg.sender === "user" ? "text-indigo-200 text-right" : "text-slate-400 text-left"}`}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : new Date().toLocaleString()}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 text-xs">
                      <FaUser />
                    </div>
                  )}
                </Motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-5 bg-slate-950/50 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex gap-3 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about pricing, timeline, or skills..."
                  className="flex-1 bg-slate-900 border border-white/10 rounded-full pl-6 pr-14 py-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <FaPaperPlane className="ml-1" />
                </button>
              </form>
            </div>
          </Motion.div>
        )}
      </div>
    </section>
  );
}
