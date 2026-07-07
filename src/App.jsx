github.com/sarvanisthprajapati-max/Rail-Yatri/edit/main/src/App.jsx
import { useState, useEffect, useMemo } from "react";
import { Train, ArrowRight, MapPin, Calendar, IndianRupee, CheckCircle2, QrCode, Ticket, Users, Clock, ChevronLeft, BedSingle, BedDouble, Armchair, Gauge, LogIn, LogOut, UserCircle2, History, ShieldCheck } from "lucide-react";

// =================================================================
// BACKEND WIRING
// Set this to your deployed server's URL (see /backend/README.md) to use
// real seat inventory + real Razorpay UPI payments. Leave blank to run
// fully self-contained using this artifact's persistent storage instead â€”
// everything still behaves like a real system (shared seat map, PNRs,
// no OTP), it just isn't touching a live payment gateway.
// =================================================================
const BACKEND_URL = ""; // e.g. "https://your-railyatra-backend.onrender.com"

// ---- Language support ---------------------------------------------
// Covers the primary user-facing strings (nav, buttons, headers, key
// labels). Passenger-entered data and less-common secondary text stay in
// English for now â€” the dictionary is structured so more strings/languages
// can be dropped in without touching component logic.
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "à¤¹à¤¿à¤‚à¤¦à¥€" },
  { code: "ta", label: "à®¤à®®à®¿à®´à¯" },
  { code: "bn", label: "à¦¬à¦¾à¦‚à¦²à¦¾" },
];

const TRANSLATIONS = {
  en: {
    bookATrain: "Book a train",
    tagline: "Search, pick your berth, pay by UPI. That's it.",
    searchTrains: "Search trains",
    pnrStatusCancel: "PNR status / cancel",
    liveTrainStatus: "Live train status",
    logInSignUp: "Log in / Sign up",
    myBookings: "My bookings",
    oneWay: "One way",
    roundTrip: "Round trip",
    multiCity: "Multi-city",
    from: "From",
    to: "To",
    dateOfJourney: "Date of journey",
    returnDate: "Return date",
    passengers: "Passengers",
    continueToPay: "Continue to pay",
    payWithUpi: "Pay with UPI",
    noOtpNote: "No cards, no OTP â€” approve the request in your UPI app.",
    amountPayable: "Amount payable",
    bookingConfirmed: "Booking confirmed",
    bookAnotherTicket: "Book another ticket",
    rewardsPoints: "Reward points",
    mealPreOrder: "Pre-order meals",
    staffAdmin: "Staff admin dashboard",
  },
  hi: {
    bookATrain: "à¤Ÿà¥à¤°à¥‡à¤¨ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",
    tagline: "à¤–à¥‹à¤œà¥‡à¤‚, à¤…à¤ªà¤¨à¥€ à¤¸à¥€à¤Ÿ à¤šà¥à¤¨à¥‡à¤‚, UPI à¤¸à¥‡ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤¬à¤¸ à¤‡à¤¤à¤¨à¤¾ à¤¹à¥€à¥¤",
    searchTrains: "à¤Ÿà¥à¤°à¥‡à¤¨à¥‡à¤‚ à¤–à¥‹à¤œà¥‡à¤‚",
    pnrStatusCancel: "PNR à¤¸à¥à¤¥à¤¿à¤¤à¤¿ / à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚",
    liveTrainStatus: "à¤²à¤¾à¤‡à¤µ à¤Ÿà¥à¤°à¥‡à¤¨ à¤¸à¥à¤¥à¤¿à¤¤à¤¿",
    logInSignUp: "à¤²à¥‰à¤— à¤‡à¤¨ / à¤¸à¤¾à¤‡à¤¨ à¤…à¤ª",
    myBookings: "à¤®à¥‡à¤°à¥€ à¤¬à¥à¤•à¤¿à¤‚à¤—",
    oneWay: "à¤à¤• à¤¤à¤°à¤«à¤¾",
    roundTrip: "à¤°à¤¾à¤‰à¤‚à¤¡ à¤Ÿà¥à¤°à¤¿à¤ª",
    multiCity: "à¤®à¤²à¥à¤Ÿà¥€-à¤¸à¤¿à¤Ÿà¥€",
    from: "à¤¸à¥‡",
    to: "à¤¤à¤•",
    dateOfJourney: "à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¥€ à¤¤à¤¾à¤°à¥€à¤–",
    returnDate: "à¤µà¤¾à¤ªà¤¸à¥€ à¤•à¥€ à¤¤à¤¾à¤°à¥€à¤–",
    passengers: "à¤¯à¤¾à¤¤à¥à¤°à¥€",
    continueToPay: "à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤œà¤¾à¤°à¥€ à¤°à¤–à¥‡à¤‚",
    payWithUpi: "UPI à¤¸à¥‡ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¥‡à¤‚",
    noOtpNote: "à¤•à¥‹à¤ˆ à¤•à¤¾à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚, à¤•à¥‹à¤ˆ OTP à¤¨à¤¹à¥€à¤‚ â€” à¤…à¤ªà¤¨à¥‡ UPI à¤à¤ª à¤®à¥‡à¤‚ à¤…à¤¨à¥à¤°à¥‹à¤§ à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤ à¤•à¤°à¥‡à¤‚à¥¤",
    amountPayable: "à¤¦à¥‡à¤¯ à¤°à¤¾à¤¶à¤¿",
    bookingConfirmed: "à¤¬à¥à¤•à¤¿à¤‚à¤— à¤ªà¥à¤·à¥à¤Ÿ à¤¹à¥à¤ˆ",
    bookAnotherTicket: "à¤à¤• à¤”à¤° à¤Ÿà¤¿à¤•à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",
    rewardsPoints: "à¤°à¤¿à¤µà¥‰à¤°à¥à¤¡ à¤ªà¥‰à¤‡à¤‚à¤Ÿà¥à¤¸",
    mealPreOrder: "à¤­à¥‹à¤œà¤¨ à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤‘à¤°à¥à¤¡à¤° à¤•à¤°à¥‡à¤‚",
    staffAdmin: "à¤¸à¥à¤Ÿà¤¾à¤« à¤à¤¡à¤®à¤¿à¤¨ à¤¡à¥ˆà¤¶à¤¬à¥‹à¤°à¥à¤¡",
  },
  ta: {
    bookATrain: "à®°à®¯à®¿à®²à¯ à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯à®¯à®µà¯à®®à¯",
    tagline: "à®¤à¯‡à®Ÿà¯à®™à¯à®•à®³à¯, à®‰à®™à¯à®•à®³à¯ à®‡à®°à¯à®•à¯à®•à¯ˆà®¯à¯ˆà®¤à¯ à®¤à¯‡à®°à¯à®¨à¯à®¤à¯†à®Ÿà¯à®•à¯à®•à®µà¯à®®à¯, UPI à®®à¯‚à®²à®®à¯ à®ªà®£à®®à¯ à®šà¯†à®²à¯à®¤à¯à®¤à¯à®™à¯à®•à®³à¯.",
    searchTrains: "à®°à®¯à®¿à®²à¯à®•à®³à¯ˆà®¤à¯ à®¤à¯‡à®Ÿà¯",
    pnrStatusCancel: "PNR à®¨à®¿à®²à¯ˆ / à®°à®¤à¯à®¤à¯",
    liveTrainStatus: "à®¨à¯‡à®°à®Ÿà®¿ à®°à®¯à®¿à®²à¯ à®¨à®¿à®²à¯ˆ",
    logInSignUp: "à®‰à®³à¯à®¨à¯à®´à¯ˆ / à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯",
    myBookings: "à®Žà®©à®¤à¯ à®ªà®¤à®¿à®µà¯à®•à®³à¯",
    oneWay: "à®’à®°à¯ à®µà®´à®¿",
    roundTrip: "à®°à®µà¯à®£à¯à®Ÿà¯ à®Ÿà®¿à®°à®¿à®ªà¯",
    multiCity: "à®ªà®² à®¨à®•à®°à®®à¯",
    from: "à®‡à®°à¯à®¨à¯à®¤à¯",
    to: "à®µà®°à¯ˆ",
    dateOfJourney: "à®ªà®¯à®£ à®¤à¯‡à®¤à®¿",
    returnDate: "à®¤à®¿à®°à¯à®®à¯à®ªà¯à®®à¯ à®¤à¯‡à®¤à®¿",
    passengers: "à®ªà®¯à®£à®¿à®•à®³à¯",
    continueToPay: "à®ªà®£à®®à¯ à®šà¯†à®²à¯à®¤à¯à®¤ à®¤à¯Šà®Ÿà®°à®µà¯à®®à¯",
    payWithUpi: "UPI à®®à¯‚à®²à®®à¯ à®šà¯†à®²à¯à®¤à¯à®¤à¯à®™à¯à®•à®³à¯",
    noOtpNote: "à®•à®¾à®°à¯à®Ÿà¯ à®‡à®²à¯à®²à¯ˆ, OTP à®‡à®²à¯à®²à¯ˆ â€” à®‰à®™à¯à®•à®³à¯ UPI à®†à®ªà¯à®ªà®¿à®²à¯ à®’à®ªà¯à®ªà¯à®¤à®²à¯ à®…à®³à®¿à®•à¯à®•à®µà¯à®®à¯.",
    amountPayable: "à®šà¯†à®²à¯à®¤à¯à®¤ à®µà¯‡à®£à¯à®Ÿà®¿à®¯ à®¤à¯Šà®•à¯ˆ",
    bookingConfirmed: "à®ªà®¤à®¿à®µà¯ à®‰à®±à¯à®¤à®¿ à®šà¯†à®¯à¯à®¯à®ªà¯à®ªà®Ÿà¯à®Ÿà®¤à¯",
    bookAnotherTicket: "à®®à®±à¯à®±à¯Šà®°à¯ à®Ÿà®¿à®•à¯à®•à¯†à®Ÿà¯ à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯à®¯à®µà¯à®®à¯",
    rewardsPoints: "à®µà¯†à®•à¯à®®à®¤à®¿ à®ªà¯à®³à¯à®³à®¿à®•à®³à¯",
    mealPreOrder: "à®‰à®£à®µà¯ˆ à®®à¯à®©à¯à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯à®¯à®µà¯à®®à¯",
    staffAdmin: "à®¨à®¿à®°à¯à®µà®¾à®• à®Ÿà®¾à®·à¯à®ªà¯‹à®°à¯à®Ÿà¯",
  },
  bn: {
    bookATrain: "à¦Ÿà§à¦°à§‡à¦¨ à¦¬à§à¦• à¦•à¦°à§à¦¨",
    tagline: "à¦–à§à¦à¦œà§à¦¨, à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¿à¦Ÿ à¦¬à§‡à¦›à§‡ à¦¨à¦¿à¦¨, UPI à¦¦à¦¿à¦¯à¦¼à§‡ à¦Ÿà¦¾à¦•à¦¾ à¦¦à¦¿à¦¨à¥¤ à¦¬à§à¦¯à¦¾à¦¸à¥¤",
    searchTrains: "à¦Ÿà§à¦°à§‡à¦¨ à¦–à§à¦à¦œà§à¦¨",
    pnrStatusCancel: "PNR à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸ / à¦¬à¦¾à¦¤à¦¿à¦²",
    liveTrainStatus: "à¦²à¦¾à¦‡à¦­ à¦Ÿà§à¦°à§‡à¦¨ à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸",
    logInSignUp: "à¦²à¦— à¦‡à¦¨ / à¦¸à¦¾à¦‡à¦¨ à¦†à¦ª",
    myBookings: "à¦†à¦®à¦¾à¦° à¦¬à§à¦•à¦¿à¦‚",
    oneWay: "à¦“à¦¯à¦¼à¦¾à¦¨ à¦“à¦¯à¦¼à§‡",
    roundTrip: "à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦Ÿà§à¦°à¦¿à¦ª",
    multiCity: "à¦®à¦¾à¦²à§à¦Ÿà¦¿-à¦¸à¦¿à¦Ÿà¦¿",
    from: "à¦¥à§‡à¦•à§‡",
    to: "à¦ªà¦°à§à¦¯à¦¨à§à¦¤",
    dateOfJourney: "à¦¯à¦¾à¦¤à§à¦°à¦¾à¦° à¦¤à¦¾à¦°à¦¿à¦–",
    returnDate: "à¦«à§‡à¦°à¦¾à¦° à¦¤à¦¾à¦°à¦¿à¦–",
    passengers: "à¦¯à¦¾à¦¤à§à¦°à§€",
    continueToPay: "à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦šà¦¾à¦²à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦¨",
    payWithUpi: "UPI à¦¦à¦¿à¦¯à¦¼à§‡ à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦•à¦°à§à¦¨",
    noOtpNote: "à¦•à¦¾à¦°à§à¦¡ à¦¨à§‡à¦‡, OTP à¦¨à§‡à¦‡ â€” à¦†à¦ªà¦¨à¦¾à¦° UPI à¦…à§à¦¯à¦¾à¦ªà§‡ à¦…à¦¨à§à¦°à§‹à¦§ à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦•à¦°à§à¦¨à¥¤",
    amountPayable: "à¦ªà§à¦°à¦¦à§‡à¦¯à¦¼ à¦ªà¦°à¦¿à¦®à¦¾à¦£",
    bookingConfirmed: "à¦¬à§à¦•à¦¿à¦‚ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦¹à¦¯à¦¼à§‡à¦›à§‡",
    bookAnotherTicket: "à¦†à¦°à§‡à¦•à¦Ÿà¦¿ à¦Ÿà¦¿à¦•à¦¿à¦Ÿ à¦¬à§à¦• à¦•à¦°à§à¦¨",
    rewardsPoints: "à¦°à¦¿à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦ªà¦¯à¦¼à§‡à¦¨à§à¦Ÿ",
    mealPreOrder: "à¦–à¦¾à¦¬à¦¾à¦° à¦†à¦—à§‡ à¦¥à§‡à¦•à§‡ à¦…à¦°à§à¦¡à¦¾à¦° à¦•à¦°à§à¦¨",
    staffAdmin: "à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦¡à§à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§à¦¡",
  },
};

function translate(lang, key) {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// ---- Meal pre-ordering ----------------------------------------------
// Only offered on classes with a pantry car in real IRCTC practice â€” AC
// classes on longer-distance trains. Sleeper passengers see a note instead.
const MEAL_OPTIONS = [
  { id: "none", label: "No meal", price: 0 },
  { id: "veg", label: "Veg thali", price: 150 },
  { id: "nonveg", label: "Non-veg thali", price: 180 },
  { id: "jain", label: "Jain thali", price: 160 },
];
function mealsAvailable(classCode) {
  return classCode !== "SL";
}

// ---- Station + train reference data ------------------------------

const STATIONS = [
  { code: "NDLS", name: "New Delhi" },
  { code: "BCT", name: "Mumbai Central" },
  { code: "HWH", name: "Howrah Jn" },
  { code: "MAS", name: "Chennai Central" },
  { code: "SBC", name: "Bengaluru City" },
  { code: "ADI", name: "Ahmedabad Jn" },
  { code: "PUNE", name: "Pune Jn" },
  { code: "LKO", name: "Lucknow Jn" },
  { code: "PNBE", name: "Patna Jn" },
  { code: "JP", name: "Jaipur" },
  { code: "CSMT", name: "Mumbai CSMT" },
  { code: "SC", name: "Secunderabad Jn" },
  { code: "BBS", name: "Bhubaneswar" },
  { code: "ASR", name: "Amritsar Jn" },
  { code: "GHY", name: "Guwahati" },
  { code: "NGP", name: "Nagpur Jn" },
  { code: "BPL", name: "Bhopal Jn" },
  { code: "KOAA", name: "Kolkata" },
  { code: "CBE", name: "Coimbatore Jn" },
  { code: "TVC", name: "Thiruvananthapuram Central" },
];

function findStation(code) {
  return STATIONS.find((s) => s.code === code) || STATIONS[0];
}
function searchStations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return STATIONS.slice(0, 6);
  return STATIONS.filter((s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 6);
}

const CLASSES = [
  { code: "SL", label: "Sleeper", fare: 1.0 },
  { code: "3A", label: "AC 3 Tier", fare: 2.6 },
  { code: "2A", label: "AC 2 Tier", fare: 3.8 },
  { code: "1A", label: "AC First", fare: 6.2 },
];

// One 8-berth bay, repeated to form a coach â€” matches real Sleeper/3A layout
const BERTH_PATTERN = ["LB", "MB", "UB", "LB", "MB", "UB", "SL", "SU"];
const BAYS_PER_COACH = 9; // 72 seats, real Sleeper coach capacity
const BERTH_LABEL = { LB: "Lower", MB: "Middle", UB: "Upper", SL: "Side Lower", SU: "Side Upper" };

function makeTrains(fromCode, toCode) {
  const seed = [
    ["12301", "Howrah Rajdhani", "16:50", "10:05", "17h 15m"],
    ["12951", "Mumbai Rajdhani", "17:00", "08:35", "15h 35m"],
    ["12259", "Duronto Express", "22:40", "15:10", "16h 30m"],
    ["12009", "Shatabdi Express", "06:15", "13:45", "7h 30m"],
  ];
  return seed.map(([no, name, dep, arr, dur], i) => ({
    id: no,
    name,
    dep,
    arr,
    dur,
    from: findStation(fromCode).name,
    to: findStation(toCode).name,
    baseFare: 850 + i * 120,
  }));
}

const UPI_APPS = [
  { id: "gpay", label: "Google Pay", tint: "#4285F4" },
  { id: "phonepe", label: "PhonePe", tint: "#5F259F" },
  { id: "paytm", label: "Paytm", tint: "#00BAF2" },
  { id: "other", label: "Other UPI ID", tint: "#0B4F6C" },
];

// ---- Seat inventory: real backend if configured, otherwise this
// artifact's own shared persistent storage (survives refresh, shared
// across everyone using this artifact, exactly like a real seat map). ----

function seatKey(trainId, date, classCode) {
  return `seats:${trainId}:${date}:${classCode}`;
}

async function fetchSeats(trainId, date, classCode) {
  if (BACKEND_URL) {
    const res = await fetch(`${BACKEND_URL}/api/seats?trainId=${trainId}&date=${date}&classCode=${classCode}`);
    if (!res.ok) throw new Error("backend seat fetch failed");
    return (await res.json()).seats;
  }
  const key = seatKey(trainId, date, classCode);
  try {
    const stored = await window.storage.get(key, true);
    return JSON.parse(stored.value);
  } catch {
    const seats = [];
    for (let bay = 0; bay < BAYS_PER_COACH; bay++) {
      BERTH_PATTERN.forEach((type, i) => {
        seats.push({ seatNo: bay * 8 + i + 1, type, booked: Math.random() < 0.3 });
      });
    }
    await window.storage.set(key, JSON.stringify(seats), true);
    return seats;
  }
}

async function holdSeats(trainId, date, classCode, seatNos) {
  if (BACKEND_URL) {
    const res = await fetch(`${BACKEND_URL}/api/seats/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainId, date, classCode, seatNos }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Could not hold seats");
    return;
  }
  const key = seatKey(trainId, date, classCode);
  const stored = await window.storage.get(key, true);
  const seats = JSON.parse(stored.value);
  const taken = seatNos.filter((no) => seats.find((s) => s.seatNo === no)?.booked);
  if (taken.length) throw new Error(`Seat ${taken.join(", ")} was just taken â€” pick another`);
  seats.forEach((s) => {
    if (seatNos.includes(s.seatNo)) s.booked = true;
  });
  await window.storage.set(key, JSON.stringify(seats), true);
}

async function releaseSeatsLocal(trainId, date, classCode, seatNos) {
  const key = seatKey(trainId, date, classCode);
  const stored = await window.storage.get(key, true);
  const seats = JSON.parse(stored.value);
  seats.forEach((s) => {
    if (seatNos.includes(s.seatNo)) s.booked = false;
  });
  await window.storage.set(key, JSON.stringify(seats), true);
}

// ---- Local waitlist/RAC queue â€” mirrors the backend's reserveOrWaitlist()
// logic in server.js, using shared persistent storage as the "queue table". ----

const RAC_CAP = 4;
function waitlistKey(trainId, date, classCode) {
  return `waitlist:${trainId}:${date}:${classCode}`;
}

async function getWaitlistQueueLocal(trainId, date, classCode) {
  try {
    const stored = await window.storage.get(waitlistKey(trainId, date, classCode), true);
    return JSON.parse(stored.value);
  } catch {
    return [];
  }
}

function freeSeatCount(seats) {
  return seats.filter((s) => !s.booked).length;
}

// Preview only â€” does not mutate the queue or seat map.
async function previewReservation(trainId, date, classCode, count) {
  const seats = await fetchSeats(trainId, date, classCode);
  const queue = await getWaitlistQueueLocal(trainId, date, classCode);
  const free = freeSeatCount(seats);
  if (queue.length === 0 && free >= count) return { status: "confirmed" };
  const racUsed = queue.filter((q) => q.status === "RAC").length;
  if (racUsed + count <= RAC_CAP) return { status: "RAC", position: racUsed + 1 };
  const wlUsed = queue.filter((q) => q.status === "WL").length;
  return { status: "WL", position: wlUsed + 1 };
}

// Actually commits the reservation: assigns real seats for CNF, or a queue slot for RAC/WL.
async function reserveOrWaitlistLocal(trainId, date, classCode, count, pnr) {
  const key = seatKey(trainId, date, classCode);
  const stored = await window.storage.get(key, true);
  const seats = JSON.parse(stored.value);
  const queue = await getWaitlistQueueLocal(trainId, date, classCode);
  const free = freeSeatCount(seats);

  if (queue.length === 0 && free >= count) {
    const seatNos = seats.filter((s) => !s.booked).slice(0, count).map((s) => s.seatNo);
    seats.forEach((s) => {
      if (seatNos.includes(s.seatNo)) s.booked = true;
    });
    await window.storage.set(key, JSON.stringify(seats), true);
    return { status: "confirmed", seatNos };
  }

  const racUsed = queue.filter((q) => q.status === "RAC").length;
  const status = racUsed + count <= RAC_CAP ? "RAC" : "WL";
  const position = status === "RAC" ? racUsed + 1 : queue.filter((q) => q.status === "WL").length + 1;
  queue.push({ pnr, count, status, position });
  await window.storage.set(waitlistKey(trainId, date, classCode), JSON.stringify(queue), true);
  return { status, position, seatNos: [] };
}

// Promotes the front of the queue into freed seats after a CNF cancellation. Returns the promoted PNR or null.
async function promoteWaitlistLocal(trainId, date, classCode) {
  const key = seatKey(trainId, date, classCode);
  const stored = await window.storage.get(key, true);
  const seats = JSON.parse(stored.value);
  const queue = await getWaitlistQueueLocal(trainId, date, classCode);
  if (queue.length === 0) return null;

  const free = freeSeatCount(seats);
  const next = queue[0];
  if (free < next.count) return null;

  const seatNos = seats.filter((s) => !s.booked).slice(0, next.count).map((s) => s.seatNo);
  seats.forEach((s) => {
    if (seatNos.includes(s.seatNo)) s.booked = true;
  });
  await window.storage.set(key, JSON.stringify(seats), true);

  queue.shift();
  queue.forEach((q, i) => {
    q.position = i + 1;
    if (q.status === "WL" && i < RAC_CAP) q.status = "RAC";
  });
  await window.storage.set(waitlistKey(trainId, date, classCode), JSON.stringify(queue), true);

  try {
    const rec = await window.storage.get(`bookings:${next.pnr}`, true);
    const booking = JSON.parse(rec.value);
    booking.status = "confirmed";
    booking.seatNos = seatNos;
    booking.waitlistStatus = null;
    await window.storage.set(`bookings:${next.pnr}`, JSON.stringify(booking), true);
  } catch {
    /* booking record missing â€” nothing to promote */
  }
  return next.pnr;
}

// Same tiered cancellation schedule as the backend's refundPercentage() â€” see
// /backend/server.js for the real-money version.
function refundPercentage(hoursBeforeDeparture) {
  if (hoursBeforeDeparture >= 48) return 0.95;
  if (hoursBeforeDeparture >= 12) return 0.5;
  if (hoursBeforeDeparture >= 4) return 0.25;
  return 0;
}

// Same deterministic simulation as the backend's /api/live-status route â€” see
// /backend/server.js for the version that can proxy a real provider.
function simulateLiveStatus(trainNumber, date) {
  let seed = 0;
  for (const ch of `${trainNumber}${date}`) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const stops = ["Origin", "Junction A", "Junction B", "Junction C", "Junction D", "Destination"];
  const currentIdx = Math.floor(rand() * (stops.length - 1));
  const delayMinutes = Math.floor(rand() * 90);
  return {
    source: "simulated",
    trainNumber,
    date,
    currentStation: stops[currentIdx],
    nextStation: stops[currentIdx + 1],
    delayMinutes,
    status: delayMinutes === 0 ? "On time" : `Running late by ${delayMinutes} min`,
    lastUpdated: new Date().toISOString(),
  };
}

// ---- Small UI atoms ---------------------------------------------

function StepDots({ step }) {
  const labels = ["Search", "Class", "Seats", "Details", "Pay", "Ticket"];
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {labels.map((l, i) => (
        <div
          key={l}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step ? "w-6 bg-amber-500" : i < step ? "w-1.5 bg-blue-900" : "w-1.5 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function Header({ onBack }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      {onBack && (
        <button onClick={onBack} className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-500">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="flex items-center gap-2">
        <div className="bg-blue-900 text-white p-1.5 rounded-lg">
          <Train size={18} />
        </div>
        <span className="font-black tracking-tight text-blue-950 text-lg" style={{ fontFamily: "Georgia, serif" }}>
          RailYatra
        </span>
      </div>
    </div>
  );
}

function StationInput({ label, value, onChange, iconColor, otherCode }) {
  const [query, setQuery] = useState(() => {
    const s = findStation(value);
    return `${s.name} â€” ${s.code}`;
  });
  const [open, setOpen] = useState(false);
  const results = searchStations(query.includes("â€”") ? "" : query);

  function pick(s) {
    onChange(s.code);
    setQuery(`${s.name} â€” ${s.code}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        <MapPin size={16} className="shrink-0" style={{ color: iconColor }} />
        <input
          value={query}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Type station name or code, e.g. NDLS"
          className="w-full bg-transparent font-semibold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-300"
        />
      </div>
      {open && (
        <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-slate-400">No station matches "{query}"</div>
          ) : (
            results.map((s) => (
              <button
                type="button"
                key={s.code}
                onMouseDown={() => pick(s)}
                disabled={s.code === otherCode}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 ${
                  s.code === otherCode ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <span className="font-semibold text-slate-700">{s.name}</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{s.code}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const BERTH_ICON = { LB: BedSingle, MB: BedDouble, UB: BedSingle, SL: Armchair, SU: Armchair };
const BERTH_TINT = {
  LB: "bg-blue-50 border-blue-200 text-blue-800",
  MB: "bg-indigo-50 border-indigo-200 text-indigo-800",
  UB: "bg-sky-50 border-sky-200 text-sky-800",
  SL: "bg-amber-50 border-amber-200 text-amber-800",
  SU: "bg-orange-50 border-orange-200 text-orange-800",
};

function SeatMap({ seats, needed, selected, onToggle }) {
  const bays = [];
  for (let i = 0; i < seats.length; i += 8) bays.push(seats.slice(i, i + 8));

  return (
    <div className="space-y-3">
      {bays.map((bay, bi) => (
        <div key={bi} className="bg-white rounded-2xl border border-slate-200 p-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Bay {bi + 1}</div>
          <div className="grid grid-cols-4 gap-1.5">
            {bay.map((s) => {
              const isSel = selected.includes(s.seatNo);
              const Icon = BERTH_ICON[s.type];
              const disabled = s.booked || (!isSel && selected.length >= needed);
              return (
                <button
                  key={s.seatNo}
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggle(s.seatNo)}
                  className={`rounded-lg border py-2 flex flex-col items-center gap-0.5 transition-colors ${
                    s.booked
                      ? "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                      : isSel
                      ? "bg-blue-900 border-blue-900 text-white"
                      : disabled
                      ? "opacity-40 cursor-not-allowed " + BERTH_TINT[s.type]
                      : BERTH_TINT[s.type] + " hover:brightness-95"
                  }`}
                  title={`${BERTH_LABEL[s.type]} berth ${s.seatNo}${s.booked ? " Â· taken" : ""}`}
                >
                  <Icon size={13} />
                  <span className="text-[10px] font-bold">{s.seatNo}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Fare comparison / cheapest-available-class finder â€” shows every class's
// price alongside what a booking would actually get right now (CNF/RAC/WL),
// so "cheapest fare" and "cheapest seat you'll actually get" aren't confused.
function FareCompareList({ train, date, passengerCount, onPick }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        CLASSES.map(async (c) => {
          const fare = Math.round(train.baseFare * c.fare) * passengerCount;
          try {
            const preview = BACKEND_URL
              ? await fetch(`${BACKEND_URL}/api/waitlist/preview?trainId=${train.id}&date=${date}&classCode=${c.code}&count=${passengerCount}`).then((r) => r.json())
              : await previewReservation(train.id, date, c.code, passengerCount);
            return { ...c, fare, ...preview };
          } catch {
            return { ...c, fare, status: "unknown" };
          }
        })
      );
      if (!cancelled) setRows(results.sort((a, b) => a.fare - b.fare));
    })();
    return () => {
      cancelled = true;
    };
  }, [train.id, date, passengerCount]);

  if (!rows) return <div className="text-xs text-slate-400 mt-2">Comparing faresâ€¦</div>;

  const cheapestConfirmed = rows.find((r) => r.status === "confirmed");

  return (
    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden">
      {rows.map((r) => (
        <button
          type="button"
          key={r.code}
          onClick={() => onPick(r)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 border-slate-100 hover:bg-slate-50"
                  >
          <span className="flex items-center gap-2">
            <span className="font-bold text-slate-700 w-8">{r.code}</span>
            <span className="text-xs text-slate-400">{r.label}</span>
            {cheapestConfirmed?.code === r.code && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
                Cheapest available
              </span>
            )}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center">
              <IndianRupee size={11} />
              {r.fare}
            </span>
            <StatusPill status={r.status === "unknown" ? "pending_payment" : r.status} />
          </span>
        </button>
      ))}
    </div>
  );
}

// Delay alerts: uses real Web Push (arrives even if the app/tab is closed)
// when a backend + service worker are available. Falls back to in-app
// polling â€” clearly labelled, since that only works while this tab is open.
function DelayAlertToggle({ pnr, trainId, date }) {
  const pushCapable = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && !!BACKEND_URL;
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState(null); // "push" | "inapp"
  const [banner, setBanner] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled || mode !== "inapp") return;
    const interval = setInterval(async () => {
      try {
        const status = BACKEND_URL
          ? await fetch(`${BACKEND_URL}/api/live-status/${trainId}?date=${date}`).then((r) => r.json())
          : simulateLiveStatus(trainId, date);
        if (status.delayMinutes >= 15) setBanner(`${status.status} â€” currently at ${status.currentStation}`);
      } catch {
        /* ignore transient errors */
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [enabled, mode]);

  async function toggleOn() {
    setBusy(true);
    try {
      if (pushCapable) {
        const reg = await navigator.serviceWorker.register("/sw.js").catch(() => null);
        const keyRes = await fetch(`${BACKEND_URL}/api/push/vapid-public-key`).then((r) => r.json());
        if (reg && keyRes.key) {
          const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyRes.key });
          await fetch(`${BACKEND_URL}/api/push/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pnr, subscription: sub }),
          });
          setMode("push");
          setEnabled(true);
          return;
        }
      }
      // No service worker / no backend â€” in-app polling instead, clearly labelled.
      setMode("inapp");
      setEnabled(true);
    } catch {
      setMode("inapp");
      setEnabled(true);
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={toggleOn}
        disabled={busy}
        className="w-full border-2 border-blue-900 text-blue-900 font-bold rounded-2xl py-2.5 flex items-center justify-center gap-2 text-sm"
      >
        <Gauge size={14} /> {busy ? "Setting upâ€¦" : "Notify me if this train is delayed"}
      </button>
    );
  }

  return (
    <div className="text-xs rounded-xl px-3 py-2 border bg-blue-50 border-blue-200 text-blue-800">
      {mode === "push"
        ? "Delay alerts on â€” you'll get a push notification even if this app is closed."
        : "Delay alerts on for this session â€” keep this tab open (no backend/service worker connected, so this can't push while closed)."}
      {banner && <div className="mt-1 font-bold text-amber-700">âš  {banner}</div>}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
    RAC: "bg-sky-50 text-sky-700 border-sky-200",
    WL: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${map[status] || map.pending_payment}`}>{status.replace("_", " ")}</span>;
}

function ManageBookingView({ onBack }) {
  const [pnrInput, setPnrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);

  async function lookup(e) {
    e.preventDefault();
    setError("");
    setBooking(null);
    setCancelResult(null);
    const clean = pnrInput.trim();
    if (!/^\d{6,12}$/.test(clean)) return setError("Enter a valid PNR number.");
    setLoading(true);
    try {
      if (BACKEND_URL) {
        const res = await fetch(`${BACKEND_URL}/api/booking/${clean}`);
        if (!res.ok) throw new Error((await res.json()).error || "PNR not found");
        setBooking(await res.json());
      } else {
        const stored = await window.storage.get(`bookings:${clean}`, true);
        setBooking(JSON.parse(stored.value));
      }
    } catch (err) {
      setError("No booking found for that PNR.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking() {
    setCancelling(true);
    setError("");
    try {
      if (BACKEND_URL) {
        const res = await fetch(`${BACKEND_URL}/api/booking/${booking.pnr}/cancel`, { method: "POST" });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Cancellation failed");
        setCancelResult(result);
        setBooking((b) => ({ ...b, status: "cancelled" }));
      } else {
        let pct;
        if (booking.status === "confirmed") {
          const departure = new Date(`${booking.date}T00:00:00`);
          const hoursLeft = (departure - new Date()) / 36e5;
          pct = refundPercentage(hoursLeft);
        } else {
          pct = 0.95; // RAC/WL never held a guaranteed seat â€” refund close to in full
        }
        const refundAmount = Math.round(booking.amount * pct);

        if (booking.status === "confirmed") {
          await releaseSeatsLocal(booking.trainId, booking.date, booking.classCode, booking.seatNos);
          let promoted = await promoteWaitlistLocal(booking.trainId, booking.date, booking.classCode);
          while (promoted) promoted = await promoteWaitlistLocal(booking.trainId, booking.date, booking.classCode);
        } else {
          const queue = await getWaitlistQueueLocal(booking.trainId, booking.date, booking.classCode);
          const filtered = queue.filter((q) => q.pnr !== booking.pnr);
          await window.storage.set(waitlistKey(booking.trainId, booking.date, booking.classCode), JSON.stringify(filtered), true);
        }

        const updated = { ...booking, status: "cancelled", refundAmount };
        await window.storage.set(`bookings:${booking.pnr}`, JSON.stringify(updated), true);
        setBooking(updated);
        setCancelResult({ refundAmount, refundPercent: Math.round(pct * 100) });
      }
    } catch (err) {
      setError(err.message || "Cancellation failed.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={onBack} />
        <h1 className="text-2xl font-black text-blue-950 mt-6 mb-1" style={{ fontFamily: "Georgia, serif" }}>
          PNR status
        </h1>
        <p className="text-slate-500 text-sm mb-6">Check your booking or cancel it â€” refunds go back to the UPI account you paid from.</p>

        <form onSubmit={lookup} className="flex gap-2">
          <input
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value)}
            placeholder="Enter 10-digit PNR"
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-900"
          />
          <button type="submit" disabled={loading} className="bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold rounded-2xl px-5">
            {loading ? "â€¦" : "Check"}
          </button>
        </form>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2 mt-4">{error}</div>}

        {booking && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-5">
            <div className="bg-blue-950 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <Ticket size={16} /> PNR {booking.pnr}
              </span>
              <StatusPill status={booking.status} />
            </div>
            <div className="p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Train</span>
                <span className="font-semibold text-slate-700">{booking.trainName || booking.trainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Date</span>
                <span className="font-semibold text-slate-700">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Class</span>
                <span className="font-semibold text-slate-700">{booking.className || booking.classCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Berths</span>
                <span className="font-semibold text-slate-700">{booking.seatNos?.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Amount paid</span>
                <span className="font-semibold text-slate-700 flex items-center"><IndianRupee size={12} />{booking.amount}</span>
              </div>
              {booking.status === "cancelled" && booking.refundAmount != null && (
                <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 mt-1">
                  <span className="text-slate-400 text-xs">Refund initiated</span>
                  <span className="font-bold text-emerald-700 flex items-center"><IndianRupee size={12} />{booking.refundAmount}</span>
                </div>
              )}
            </div>

            {booking.status === "confirmed" && (
              <div className="p-4 pt-0">
                <DelayAlertToggle pnr={booking.pnr} trainId={booking.trainId} date={booking.date} />
              </div>
            )}

            {["confirmed", "RAC", "WL"].includes(booking.status) && (
              <div className="p-4 pt-0">
                <button
                  onClick={cancelBooking}
                  disabled={cancelling}
                  className="w-full border-2 border-rose-500 text-rose-600 font-bold rounded-2xl py-2.5 disabled:opacity-50"
                >
                  {cancelling ? "Cancellingâ€¦" : "Cancel ticket"}
                </button>
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  {booking.status === "confirmed"
                    ? "Refund is tiered by time to departure â€” up to 95% if cancelled 48h+ before, nothing inside 4h."
                    : "RAC/WL bookings never held a guaranteed seat, so cancellation refunds close to the full fare."}
                </p>
              </div>
            )}

            {cancelResult && (
              <div className="bg-emerald-50 border-t border-emerald-200 text-emerald-800 text-xs px-4 py-2.5">
                Cancelled. â‚¹{cancelResult.refundAmount} ({cancelResult.refundPercent}%) refund initiated to your UPI account.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthView({ onBack, onAuthed }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!/^[\w.\-]{2,}@[a-zA-Z.]{2,}$/.test(email)) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (BACKEND_URL) {
        const path = mode === "login" ? "login" : "signup";
        const res = await fetch(`${BACKEND_URL}/api/auth/${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        onAuthed({ token: data.token, user: { name: data.name, email: data.email } });
      } else {
        // No backend â€” a lightweight local "account" so booking history has an owner.
        // This does not verify a password against anything server-side; deploy the
        // backend for real authentication.
        const stored = await window.storage.get(`localaccount:${email}`, false).catch(() => null);
        const profile = stored ? JSON.parse(stored.value) : { name: name || email.split("@")[0], email };
        await window.storage.set(`localaccount:${email}`, JSON.stringify(profile), false);
        onAuthed({ token: null, user: profile });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={onBack} />
        <h1 className="text-2xl font-black text-blue-950 mt-6 mb-1" style={{ fontFamily: "Georgia, serif" }}>
          {mode === "login" ? "Log in" : "Create an account"}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {BACKEND_URL ? "So we can save your booking history." : "Demo mode â€” no real password check without a connected backend."}
        </p>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          {mode === "signup" && (
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-900"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-900"
          />
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold rounded-2xl py-3"
          >
            {loading ? "â€¦" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          className="mt-4 text-sm font-bold text-blue-900 self-center"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

function HistoryView({ onBack, authToken, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (BACKEND_URL) {
          const res = await fetch(`${BACKEND_URL}/api/bookings`, { headers: { Authorization: `Bearer ${authToken}` } });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not load booking history");
          setBookings(data.bookings);
        } else {
          const stored = await window.storage.get(`history:${currentUser.email}`, false).catch(() => null);
          const pnrs = stored ? JSON.parse(stored.value) : [];
          const loaded = await Promise.all(
            pnrs.map(async (p) => {
              try {
                const rec = await window.storage.get(`bookings:${p}`, true);
                return JSON.parse(rec.value);
              } catch {
                return null;
              }
            })
          );
          setBookings(loaded.filter(Boolean).reverse());
        }
      } catch (err) {
        setError(err.message || "Could not load booking history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={onBack} />
        <h1 className="text-2xl font-black text-blue-950 mt-6 mb-1" style={{ fontFamily: "Georgia, serif" }}>
          My bookings
        </h1>
        <p className="text-slate-500 text-sm mb-6">Hi {currentUser?.name} â€” here's everything you've booked.</p>

        {loading && <div className="text-sm text-slate-400 text-center py-8">Loadingâ€¦</div>}
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2">{error}</div>}
        {!loading && bookings.length === 0 && <div className="text-sm text-slate-400 text-center py-8">No bookings yet.</div>}

        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.pnr} className="bg-white rounded-2xl border border-slate-200 p-3.5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-800">{b.trainName || b.trainId}</span>
                <StatusPill status={b.status} />
              </div>
              <div className="text-xs text-slate-400">PNR {b.pnr} Â· {b.date} Â· {b.className || b.classCode}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveStatusView({ onBack }) {
  const [trainNumber, setTrainNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  async function check(e) {
    e.preventDefault();
    setError("");
    setStatus(null);
    if (!/^\d{4,5}$/.test(trainNumber.trim())) return setError("Enter a valid train number, e.g. 12951.");
    setLoading(true);
    try {
      if (BACKEND_URL) {
        const res = await fetch(`${BACKEND_URL}/api/live-status/${trainNumber}?date=${date}`);
        if (!res.ok) throw new Error("Could not fetch live status");
        setStatus(await res.json());
      } else {
        await new Promise((r) => setTimeout(r, 500));
        setStatus(simulateLiveStatus(trainNumber.trim(), date));
      }
    } catch (err) {
      setError(err.message || "Could not fetch live status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={onBack} />
        <h1 className="text-2xl font-black text-blue-950 mt-6 mb-1" style={{ fontFamily: "Georgia, serif" }}>
          Live train status
        </h1>
        <p className="text-slate-500 text-sm mb-6">Track where a train is right now and how delayed it's running.</p>

        <form onSubmit={check} className="flex gap-2">
          <input
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            placeholder="Train number, e.g. 12951"
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-900"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-3 py-3 text-sm font-semibold outline-none focus:border-blue-900"
          />
        </form>
        <button
          onClick={check}
          disabled={loading}
          className="mt-3 w-full bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold rounded-2xl py-3"
        >
          {loading ? "Checkingâ€¦" : "Check status"}
        </button>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2 mt-4">{error}</div>}

        {status && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-5">
            <div className="bg-blue-950 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <Gauge size={16} /> Train #{status.trainNumber}
              </span>
              <span className="text-xs text-blue-200">{status.source === "live" ? "Live" : "Simulated"}</span>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Status</span>
                <span className={`font-bold ${status.delayMinutes > 0 ? "text-amber-600" : "text-emerald-600"}`}>{status.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Currently at</span>
                <span className="font-semibold text-slate-700">{status.currentStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Next stop</span>
                <span className="font-semibold text-slate-700">{status.nextStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Last updated</span>
                <span className="font-semibold text-slate-700">{new Date(status.lastUpdated).toLocaleTimeString()}</span>
              </div>
            </div>
            {status.source !== "live" && (
              <div className="bg-amber-50 border-t border-amber-200 text-amber-800 text-[11px] px-4 py-2">
                Simulated â€” no live provider connected. See /backend/README.md to wire a real one.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminView({ onBack }) {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(!BACKEND_URL); // local mode has no real gate to check against
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  async function unlock(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (BACKEND_URL) {
        const res = await fetch(`${BACKEND_URL}/api/admin/stats`, { headers: { "x-admin-key": adminKey } });
        if (!res.ok) throw new Error("Invalid admin key");
        setStats(await res.json());
        const bres = await fetch(`${BACKEND_URL}/api/admin/bookings`, { headers: { "x-admin-key": adminKey } });
        setBookings((await bres.json()).bookings);
        setUnlocked(true);
      } else {
        const idxStored = await window.storage.get("pnr_index", true).catch(() => null);
        const pnrs = idxStored ? JSON.parse(idxStored.value) : [];
                const loaded = await Promise.all(
          pnrs.map(async (p) => {
            try {
              const rec = await window.storage.get(`bookings:${p}`, true);
              return JSON.parse(rec.value);
            } catch {
              return null;
            }
          })
        );
        const all = loaded.filter(Boolean).reverse();
        setBookings(all);
        const byStatus = {};
        let revenue = 0;
        all.forEach((b) => {
          byStatus[b.status] = (byStatus[b.status] || 0) + 1;
          if (["confirmed", "RAC", "WL"].includes(b.status)) revenue += b.amount || 0;
        });
        setStats({ totalBookings: all.length, byStatus, revenue });
        setUnlocked(true);
      }
    } catch (err) {
      setError(err.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!BACKEND_URL) unlock({ preventDefault: () => {} });
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={onBack} />
        <h1 className="text-2xl font-black text-blue-950 mt-6 mb-1 flex items-center gap-2" style={{ fontFamily: "Georgia, serif" }}>
          <ShieldCheck size={22} /> Admin dashboard
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {BACKEND_URL ? "Protected by your server's ADMIN_KEY." : "Local demo mode â€” shows everything booked in this artifact, no real access control."}
        </p>

        {BACKEND_URL && !unlocked && (
          <form onSubmit={unlock} className="flex gap-2">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin key"
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-900"
            />
            <button type="submit" disabled={loading} className="bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold rounded-2xl px-5">
              {loading ? "â€¦" : "Unlock"}
            </button>
          </form>
        )}

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2 mt-4">{error}</div>}

        {unlocked && stats && (
          <>
            <div className="grid grid-cols-2 gap-3 mt-2 mb-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                <div className="text-xs text-slate-400">Total bookings</div>
                <div className="text-xl font-black text-slate-800">{stats.totalBookings}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                <div className="text-xs text-slate-400">Revenue</div>
                <div className="text-xl font-black text-slate-800 flex items-center">
                  <IndianRupee size={16} />
                  {stats.revenue}
                </div>
              </div>
              {Object.entries(stats.byStatus || {}).map(([status, count]) => (
                <div key={status} className="bg-white rounded-2xl border border-slate-200 p-3.5 col-span-1">
                  <div className="text-xs text-slate-400 capitalize">{status.replace("_", " ")}</div>
                  <div className="text-xl font-black text-slate-800">{count}</div>
                </div>
              ))}
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">All bookings</div>
            <div className="space-y-2 pb-4">
              {bookings.length === 0 && <div className="text-sm text-slate-400 text-center py-8">No bookings yet.</div>}
              {bookings.map((b) => (
                <div key={b.pnr} className="bg-white rounded-2xl border border-slate-200 p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800">{b.trainName || b.trainId}</span>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    PNR {b.pnr} Â· {b.date} Â· {b.className || b.classCode} Â· â‚¹{b.amount}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---- Main App ----------------------------------------------------

export default function App() {
  const [view, setView] = useState("booking"); // "booking" | "manage" | "auth" | "history" | "live"
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // { name, email }
  const [step, setStep] = useState(0); // 0 search,1 class,2 seats,3 details,4 pay,5 ticket
  const [from, setFrom] = useState("NDLS");
  const [to, setTo] = useState("BCT");
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "M" }]);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [seats, setSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [upiApp, setUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [paying, setPaying] = useState(false);
  const [pnr, setPnr] = useState("");
  const [error, setError] = useState("");
  const [tripType, setTripType] = useState("oneway"); // "oneway" | "round" | "multicity"
  const [returnDate, setReturnDate] = useState(() => new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  const [extraLegs, setExtraLegs] = useState([]); // multi-city only: [{from, to, date}, ...]
  const [itinerary, setItinerary] = useState([]); // resolved legs for the active search: [{from, to, date}]
  const [legIndex, setLegIndex] = useState(0);
  const [completedLegs, setCompletedLegs] = useState([]);
  const [reservationPreview, setReservationPreview] = useState(null); // { status: 'confirmed'|'RAC'|'WL', position? }
  const [ticketStatus, setTicketStatus] = useState("confirmed");
  const [compareOpenId, setCompareOpenId] = useState(null);
  const [lang, setLang] = useState("en");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [meals, setMeals] = useState([]); // [{passengerIndex, mealType, price}]
  const t = (key) => translate(lang, key);

  useEffect(() => {
    (async () => {
      try {
        const storedLang = await window.storage.get("lang", false);
        setLang(JSON.parse(storedLang.value));
      } catch {
        /* default to English */
      }
      try {
        const stored = await window.storage.get("session", false);
        const session = JSON.parse(stored.value);
        setAuthToken(session.token || null);
        setCurrentUser(session.user || null);
        if (session.user?.email) setContact((c) => ({ ...c, email: c.email || session.user.email }));
        await loadLoyaltyPoints(session.token, session.user);
      } catch {
        /* no saved session */
      }
    })();
  }, []);

  async function loadLoyaltyPoints(token, user) {
    try {
      if (BACKEND_URL && token) {
        const res = await fetch(`${BACKEND_URL}/api/loyalty`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setLoyaltyPoints(data.points || 0);
      } else if (user) {
        const stored = await window.storage.get(`loyalty:${user.email}`, false).catch(() => null);
        setLoyaltyPoints(stored ? JSON.parse(stored.value) : 0);
      }
    } catch {
      /* leave points at 0 */
    }
  }

  function changeLang(code) {
    setLang(code);
    window.storage.set("lang", JSON.stringify(code), false).catch(() => {});
  }

  async function loginOrSignup(session) {
    setAuthToken(session.token || null);
    setCurrentUser(session.user);
    await window.storage.set("session", JSON.stringify(session), false);
    await loadLoyaltyPoints(session.token, session.user);
    setView("booking");
  }

  async function logout() {
    setAuthToken(null);
    setCurrentUser(null);
    setLoyaltyPoints(0);
    try {
      await window.storage.delete("session", false);
    } catch {
      /* nothing to delete */
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (from === to) return setError("Origin and destination can't be the same.");
    if (tripType === "round" && returnDate <= date) return setError("Return date must be after your journey date.");

    let legs = [{ from, to, date }];
    if (tripType === "round") {
      legs.push({ from: to, to: from, date: returnDate });
    } else if (tripType === "multicity") {
      for (const leg of extraLegs) {
        if (!leg.from || !leg.to || leg.from === leg.to) return setError("Each additional city must have a valid, different from/to.");
        if (!leg.date) return setError("Every leg needs a date.");
      }
      legs = legs.concat(extraLegs);
      for (let i = 1; i < legs.length; i++) {
        if (legs[i].date < legs[i - 1].date) return setError("Later legs must be on the same day or after the previous leg.");
      }
    }

    setError("");
    setItinerary(legs);
    setLegIndex(0);
    setCompletedLegs([]);
    setFrom(legs[0].from);
    setTo(legs[0].to);
    setDate(legs[0].date);
    setTrains(makeTrains(legs[0].from, legs[0].to));
    setStep(1);
  }

  async function chooseClass(train, cls) {
    setSelectedTrain(train);
    setSelectedClass(cls);
    setSelectedSeats([]);
    setReservationPreview(null);
    setError("");
    setSeatsLoading(true);
    setStep(2);
    try {
      const s = await fetchSeats(train.id, date, cls.code);
      setSeats(s);
      const preview = BACKEND_URL
        ? await fetch(`${BACKEND_URL}/api/waitlist/preview?trainId=${train.id}&date=${date}&classCode=${cls.code}&count=${passengerCount}`).then((r) => r.json())
        : await previewReservation(train.id, date, cls.code, passengerCount);
      setReservationPreview(preview);
    } catch (err) {
      setError("Couldn't load the seat map. " + err.message);
    } finally {
      setSeatsLoading(false);
    }
  }

  function toggleSeat(seatNo) {
    setSelectedSeats((cur) => (cur.includes(seatNo) ? cur.filter((n) => n !== seatNo) : [...cur, seatNo]));
  }

  function confirmSeats() {
    if (selectedSeats.length !== passengerCount) {
      return setError(`Pick exactly ${passengerCount} berth${passengerCount > 1 ? "s" : ""}.`);
    }
    setError("");
    setPassengers(Array.from({ length: passengerCount }, () => ({ name: "", age: "", gender: "M" })));
    setStep(3);
  }

  function confirmWaitlist() {
    setError("");
    setSelectedSeats([]);
    setPassengers(Array.from({ length: passengerCount }, () => ({ name: "", age: "", gender: "M" })));
    setStep(3);
  }

  function updatePassenger(i, field, val) {
    setPassengers((p) => p.map((pass, idx) => (idx === i ? { ...pass, [field]: val } : pass)));
  }

  function proceedToPay(e) {
    e.preventDefault();
    const valid = passengers.every((p) => p.name.trim() && p.age && Number(p.age) > 0);
    if (!valid) return setError("Please fill in valid name and age for every passenger.");
    if (!/^[\w.\-]{2,}@[a-zA-Z.]{2,}$/.test(contact.email)) return setError("Enter a valid email for your ticket confirmation.");
    if (!/^\+?\d{10,13}$/.test(contact.phone.replace(/\s/g, ""))) return setError("Enter a valid phone number for SMS updates.");
    setError("");
    setStep(4);
  }

  // Group booking discount â€” tiered like many real travel platforms offer
  // for larger parties booked together.
  function groupDiscountPercent(count) {
    if (count >= 10) return 10;
    if (count >= 5) return 5;
    return 0;
  }

  function mealTotal() {
    return meals.reduce((sum, m) => sum + (m.price || 0), 0);
  }

  function fareBreakdown() {
    if (!selectedTrain) return { subtotal: 0, discountPercent: 0, discountAmount: 0, mealCost: 0, pointsDiscount: 0, total: 0 };
    const fareSubtotal = Math.round(selectedTrain.baseFare * selectedClass.fare) * passengers.length;
    const discountPercent = groupDiscountPercent(passengers.length);
    const discountAmount = Math.round((fareSubtotal * discountPercent) / 100);
    const mealCost = mealTotal();
    const afterDiscount = fareSubtotal - discountAmount + mealCost;
    const maxRedeemable = Math.min(loyaltyPoints, Math.floor(afterDiscount * 0.5));
    const pointsDiscount = Math.min(redeemPoints, maxRedeemable);
    return {
      subtotal: fareSubtotal,
      discountPercent,
      discountAmount,
      mealCost,
      maxRedeemable,
      pointsDiscount,
      total: afterDiscount - pointsDiscount,
    };
  }

  function totalFare() {
    return fareBreakdown().total;
  }

  async function handlePay(e) {
    e.preventDefault();
    if (upiApp === "other" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      return setError("Enter a valid UPI ID, e.g. name@bank");
    }
    setError("");
    setPaying(true);
    const isSeatmap = reservationPreview?.status === "confirmed";
    try {
      if (isSeatmap) {
        await holdSeats(selectedTrain.id, date, selectedClass.code, selectedSeats);
      }

      if (BACKEND_URL) {
        // Real flow: create a Razorpay order, then open UPI checkout/intent.
        const res = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            amountInRupees: totalFare(),
            trainId: selectedTrain.id,
            date,
            classCode: selectedClass.code,
            ...(isSeatmap ? { seatNos: selectedSeats } : { passengerCount }),
            passengers,
            contact,
            redeemPoints: fareBreakdown().pointsDiscount,
            meals,
          }),
        });
        const order = await res.json();
        if (!res.ok) throw new Error(order.error || "Payment order failed");

        // Razorpay's checkout.js (loaded via <script> in index.html) opens the UPI
        // intent/collect UI and calls this handler once the user approves in their app.
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          method: { upi: true, card: false, netbanking: false, wallet: false },
          handler: async (response) => {
            const verify = await fetch(`${BACKEND_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const result = await verify.json();
            setPaying(false);
            if (result.ok) {
              setPnr(result.pnr);
              setTicketStatus(result.status || "confirmed");
              setStep(5);
            } else {
              setError("Payment could not be verified.");
            }
          },
          modal: { ondismiss: () => setPaying(false) },
        });
        rzp.open();
        return;
      }

      // No backend configured â€” simulate the same round trip locally.
      await new Promise((r) => setTimeout(r, 1800));
      const generatedPnr = String(Math.floor(2000000000 + Math.random() * 799999999));

      let finalSeatNos = selectedSeats;
      let waitlistStatus = null;
      if (!isSeatmap) {
        const result = await reserveOrWaitlistLocal(selectedTrain.id, date, selectedClass.code, passengers.length, generatedPnr);
        finalSeatNos = result.seatNos;
        if (result.status !== "confirmed") waitlistStatus = { status: result.status, position: result.position };
      }
      const finalStatus = waitlistStatus ? waitlistStatus.status : "confirmed";
      setTicketStatus(finalStatus);

      await window.storage.set(
        `bookings:${generatedPnr}`,
        JSON.stringify({
          pnr: generatedPnr,
          trainId: selectedTrain.id,
          trainName: selectedTrain.name,
          from,
          to,
          date,
          classCode: selectedClass.code,
          className: selectedClass.label,
          seatNos: finalSeatNos,
          passengers,
          contact,
          amount: totalFare(),
          status: finalStatus,
          waitlistStatus,
        }),
        true
      );
      setSelectedSeats(finalSeatNos);
      try {
        const idxStored = await window.storage.get("pnr_index", true);
        const idx = JSON.parse(idxStored.value);
        idx.push(generatedPnr);
        await window.storage.set("pnr_index", JSON.stringify(idx), true);
      } catch {
        await window.storage.set("pnr_index", JSON.stringify([generatedPnr]), true);
      }
      if (currentUser) {
        let history = [];
        try {
          const stored = await window.storage.get(`history:${currentUser.email}`, false);
          history = JSON.parse(stored.value);
        } catch {
          /* first booking for this user */
        }
        history.push(generatedPnr);
        await window.storage.set(`history:${currentUser.email}`, JSON.stringify(history), false);
      }
      setPaying(false);
      setPnr(generatedPnr);
      setStep(5);
    } catch (err) {
      setPaying(false);
      setError(err.message || "Payment failed. Please try again.");
    }
  }

  function advanceLeg() {
    const completed = {
      pnr,
      trainName: selectedTrain.name,
      from,
      to,
      date,
      className: selectedClass.label,
      seatNos: selectedSeats,
      status: ticketStatus,
    };
    const nextCompleted = [...completedLegs, completed];
    setCompletedLegs(nextCompleted);

    const nextIdx = legIndex + 1;
    if (nextIdx >= itinerary.length) return; // last leg â€” ticket screen shows the full itinerary instead

    const leg = itinerary[nextIdx];
    setLegIndex(nextIdx);
    setFrom(leg.from);
    setTo(leg.to);
    setDate(leg.date);
    setSelectedTrain(null);
    setSelectedSeats([]);
    setSeats([]);
    setReservationPreview(null);
    setUpiApp(null);
    setUpiId("");
    setPnr("");
    setError("");
    setTrains(makeTrains(leg.from, leg.to));
    setStep(1);
  }

  function resetAll() {
    setStep(0);
    setSelectedTrain(null);
    setSelectedSeats([]);
    setPassengerCount(1);
    setPassengers([{ name: "", age: "", gender: "M" }]);
    setContact({ email: "", phone: "" });
    setUpiApp(null);
    setUpiId("");
    setError("");
    setTripType("oneway");
    setExtraLegs([]);
    setItinerary([]);
    setLegIndex(0);
    setCompletedLegs([]);
    setReservationPreview(null);
    setTicketStatus("confirmed");
  }

  if (view === "manage") {
    return <ManageBookingView onBack={() => setView("booking")} />;
  }
  if (view === "auth") {
    return <AuthView onBack={() => setView("booking")} onAuthed={loginOrSignup} />;
  }
  if (view === "history") {
    return <HistoryView onBack={() => setView("booking")} authToken={authToken} currentUser={currentUser} />;
  }
  if (view === "live") {
    return <LiveStatusView onBack={() => setView("booking")} />;
  }
  if (view === "admin") {
    return <AdminView onBack={() => setView("booking")} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1]" style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header onBack={step > 0 && step < 5 ? () => setStep((s) => Math.max(0, s - 1)) : null} />
        <div className="mt-5">
          <StepDots step={step} />
        </div>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-3 py-2 mb-4">{error}</div>}
        {!BACKEND_URL && step === 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl px-3 py-2 mb-4">
            Running in self-contained demo mode â€” seat map is real and persistent, payment is simulated. Set <code className="font-mono">BACKEND_URL</code> to connect a live Razorpay UPI backend (see /backend in your download).
          </div>
        )}

        {/* STEP 0 â€” SEARCH */}
        {step === 0 && (
          <form onSubmit={handleSearch} className="flex-1 flex flex-col">
            <div className="flex justify-end mb-2">
              {currentUser ? (
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={() => setView("history")} className="flex items-center gap-1 font-bold text-blue-900">
                    <History size={13} /> My bookings
                  </button>
                  <span className="text-slate-300">Â·</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserCircle2 size={13} /> {currentUser.name}
                  </span>
                  <button type="button" onClick={logout} className="text-slate-400 flex items-center gap-1">
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setView("auth")} className="flex items-center gap-1 text-xs font-bold text-blue-900">
                  <LogIn size={13} /> Log in / Sign up
                </button>
              )}
            </div>

            <h1 className="text-2xl font-black text-blue-950 mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Book a train
            </h1>
            <p className="text-slate-500 text-sm mb-6">Search, pick your berth, pay by UPI. That's it.</p>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setTripType("oneway")}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-bold border-2 ${
                  tripType === "oneway" ? "border-blue-900 bg-blue-900 text-white" : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                One way
              </button>
              <button
                type="button"
                onClick={() => setTripType("round")}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-bold border-2 ${
                  tripType === "round" ? "border-blue-900 bg-blue-900 text-white" : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                Round trip
              </button>
              <button
                type="button"
                onClick={() => setTripType("multicity")}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-bold border-2 ${
                  tripType === "multicity" ? "border-blue-900 bg-blue-900 text-white" : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                Multi-city
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
              <StationInput label="From" value={from} onChange={setFrom} iconColor="#1e3a8a" otherCode={to} />
              <div className="h-px bg-slate-100" />
              <StationInput label="To" value={to} onChange={setTo} iconColor="#f59e0b" otherCode={from} />
              <div className="h-px bg-slate-100" />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date of journey</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>
              {tripType === "round" && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Return date</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={16} className="text-amber-500 shrink-0" />
                                            <input
                        type="date"
                        value={returnDate}
                        min={date}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-transparent font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
              {tripType === "multicity" &&
                extraLegs.map((leg, i) => (
                  <div key={i}>
                    <div className="h-px bg-slate-100 mb-4" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">City {i + 2}</span>
                      <button
                        type="button"
                        onClick={() => setExtraLegs((legs) => legs.filter((_, idx) => idx !== i))}
                        className="text-xs font-bold text-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <StationInput
                        label="From"
                        value={leg.from}
                        onChange={(code) => setExtraLegs((legs) => legs.map((l, idx) => (idx === i ? { ...l, from: code } : l)))}
                        iconColor="#1e3a8a"
                        otherCode={leg.to}
                      />
                      <StationInput
                        label="To"
                        value={leg.to}
                        onChange={(code) => setExtraLegs((legs) => legs.map((l, idx) => (idx === i ? { ...l, to: code } : l)))}
                        iconColor="#f59e0b"
                        otherCode={leg.from}
                      />
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={16} className="text-slate-400 shrink-0" />
                          <input
                            type="date"
                            value={leg.date}
                            min={date}
                            onChange={(e) => setExtraLegs((legs) => legs.map((l, idx) => (idx === i ? { ...l, date: e.target.value } : l)))}
                            className="w-full bg-transparent font-semibold text-slate-800 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {tripType === "multicity" && (
                <button
                  type="button"
                  onClick={() =>
                    setExtraLegs((legs) => [
                      ...legs,
                      { from: legs.length ? legs[legs.length - 1].to : to, to: from, date: legs.length ? legs[legs.length - 1].date : date },
                    ])
                  }
                  className="text-sm font-bold text-blue-900"
                >
                  + Add a city
                </button>
              )}
              <div className="h-px bg-slate-100" />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Passengers</label>
                <div className="flex items-center gap-3 mt-1">
                  <Users size={16} className="text-slate-400 shrink-0" />
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setPassengerCount((n) => Math.max(1, n - 1))} className="w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-600">
                      âˆ’
                    </button>
                    <span className="font-bold text-slate-800 w-4 text-center">{passengerCount}</span>
                    <button type="button" onClick={() => setPassengerCount((n) => Math.min(6, n + 1))} className="w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-600">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="mt-6 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-colors">
              Search trains <ArrowRight size={18} />
            </button>
            <div className="flex items-center justify-center gap-4 mt-3">
              <button type="button" onClick={() => setView("manage")} className="text-sm font-bold text-blue-900">
                PNR status / cancel
              </button>
              <span className="text-slate-300">Â·</span>
              <button type="button" onClick={() => setView("live")} className="text-sm font-bold text-blue-900 flex items-center gap-1">
                <Gauge size={14} /> Live train status
              </button>
            </div>
            <button type="button" onClick={() => setView("admin")} className="mt-4 text-[11px] text-slate-300 self-center">
              Staff admin dashboard
            </button>
          </form>
        )}

        {/* STEP 1 â€” SELECT TRAIN + CLASS */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-black text-blue-950" style={{ fontFamily: "Georgia, serif" }}>
                {findStation(from).code} <ArrowRight size={14} className="inline mb-0.5" /> {findStation(to).code}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{date}</span>
            </div>

            <div className="space-y-3">
              {trains.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-xs text-slate-400">#{t.id}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                      <Clock size={12} /> {t.dur}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div>
                      <div className="font-black text-slate-800">{t.dep}</div>
                      <div className="text-[11px] text-slate-400">{t.from.split(" ")[0]}</div>
                    </div>
                    <div className="flex-1 border-t border-dashed border-slate-300 mx-3 relative top-[-1px]" />
                    <div className="text-right">
                      <div className="font-black text-slate-800">{t.arr}</div>
                      <div className="text-[11px] text-slate-400">{t.to.split(" ")[0]}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mt-3">
                    {CLASSES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => chooseClass(t, c)}
                        className="rounded-lg py-1.5 text-center border border-slate-200 hover:border-blue-900 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-[11px] font-bold text-slate-700">{c.code}</div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center">
                          <IndianRupee size={8} />
                          {Math.round(t.baseFare * c.fare)}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCompareOpenId((cur) => (cur === t.id ? null : t.id))}
                    className="mt-2 text-[11px] font-bold text-blue-900 flex items-center gap-1"
                  >
                    <Gauge size={11} /> {compareOpenId === t.id ? "Hide fare comparison" : "Compare fares & availability"}
                  </button>
                  {compareOpenId === t.id && <FareCompareList train={t} date={date} passengerCount={passengerCount} onPick={(cls) => chooseClass(t, cls)} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 â€” SEAT MAP */}
        {step === 2 && selectedTrain && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-black text-blue-950 mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Pick your berth{passengerCount > 1 ? "s" : ""}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {selectedTrain.name} Â· {selectedClass.label} Â· Coach S4 Â· Select {passengerCount} of {selectedSeats.length}/{passengerCount} chosen
            </p>

            <div className="flex gap-3 text-[10px] text-slate-500 mb-3">
              {["LB", "MB", "UB", "SL", "SU"].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-sm inline-block border ${BERTH_TINT[t]}`} /> {BERTH_LABEL[t]}
                </span>
              ))}
            </div>

            {seatsLoading ? (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading seat mapâ€¦</div>
            ) : (
              <div className="flex-1 overflow-y-auto pb-3" style={{ maxHeight: "52vh" }}>
                <SeatMap seats={seats} needed={passengerCount} selected={selectedSeats} onToggle={toggleSeat} />
              </div>
            )}

            <button
              onClick={confirmSeats}
              disabled={selectedSeats.length !== passengerCount}
              className="mt-4 w-full bg-blue-900 disabled:bg-slate-200 disabled:text-slate-400 hover:bg-blue-950 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2"
            >
              Confirm seats <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 3 â€” PASSENGER DETAILS */}
        {step === 3 && selectedTrain && (
          <form onSubmit={proceedToPay} className="flex-1 flex flex-col">
            <h2 className="text-lg font-black text-blue-950 mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Passenger details
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {selectedTrain.name} Â· {selectedClass.label} Â· Berths {selectedSeats.join(", ")}
            </p>

            <div className="space-y-3">
              {passengers.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-3.5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Users size={12} /> Passenger {i + 1} Â· Berth {selectedSeats[i]}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="Full name"
                      value={p.name}
                      onChange={(e) => updatePassenger(i, "name", e.target.value)}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-900"
                    />
                    <input
                      placeholder="Age"
                      type="number"
                      min="1"
                      max="120"
                      value={p.age}
                      onChange={(e) => updatePassenger(i, "age", e.target.value)}
                      className="w-16 border border-slate-200 rounded-xl px-2 py-2 text-sm outline-none focus:border-blue-900"
                    />
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                      className="border border-slate-200 rounded-xl px-2 py-2 text-sm outline-none focus:border-blue-900"
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 mt-3">
              <div className="text-xs font-bold text-slate-400 mb-2">Contact for ticket &amp; updates</div>
              <div className="flex gap-2">
                <input
                  placeholder="email@example.com"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-900"
                />
                <input
                  placeholder="+91 98765 43210"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  className="w-36 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">We'll send your ticket by email and SMS â€” no OTP needed to book.</p>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Subtotal Â· {passengers.length} pax</span>
                <span className="font-semibold text-slate-700 flex items-center">
                  <IndianRupee size={13} />
                  {fareBreakdown().subtotal}
                </span>
              </div>
              {fareBreakdown().discountPercent > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-600 mt-1">
                  <span>Group discount ({fareBreakdown().discountPercent}%)</span>
                  <span className="font-semibold flex items-center">
                    âˆ’ <IndianRupee size={13} />
                    {fareBreakdown().discountAmount}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-slate-800 mt-1 mb-3">
                <span>Total</span>
                <span className="flex items-center">
                  <IndianRupee size={14} />
                  {totalFare()}
                </span>
              </div>
              {fareBreakdown().discountPercent === 0 && passengers.length >= 3 && (
                <div className="text-[11px] text-slate-400 mb-3">
                  Book for 5+ passengers together to unlock a group discount.
                </div>
              )}
              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2">
                Continue to pay <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4 â€” UPI PAYMENT */}
        {step === 4 && selectedTrain && (
          <form onSubmit={handlePay} className="flex-1 flex flex-col">
            <h2 className="text-lg font-black text-blue-950 mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Pay with UPI
            </h2>
            <p className="text-xs text-slate-400 mb-5">No cards, no OTP â€” approve the request in your UPI app.</p>

            <div className="bg-blue-950 text-white rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">Amount payable</span>
                <span className="text-2xl font-black flex items-center">
                  <IndianRupee size={18} />
                  {totalFare()}
                </span>
              </div>
              {fareBreakdown().discountPercent > 0 && (
                <div className="text-[11px] text-emerald-300 mt-1">
                  Includes {fareBreakdown().discountPercent}% group discount (âˆ’â‚¹{fareBreakdown().discountAmount})
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {UPI_APPS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setUpiApp(a.id)}
                  className={`rounded-2xl border-2 p-3.5 text-left transition-colors ${
                    upiApp === a.id ? "border-blue-900 bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg mb-2" style={{ background: a.tint }} />
                  <div className="text-sm font-bold text-slate-700">{a.label}</div>
                </button>
              ))}
            </div>

            {upiApp === "other" && (
              <input
                autoFocus
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-3 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-900"
              />
            )}

            {upiApp && upiApp !== "other" && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded-xl px-3 py-2.5">
                <QrCode size={14} /> We'll send a collect request to your {UPI_APPS.find((a) => a.id === upiApp).label} app.
              </div>
            )}

            <button
              type="submit"
              disabled={!upiApp || paying}
              className="mt-auto w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-blue-950 font-black rounded-2xl py-3.5 flex items-center justify-center gap-2"
            >
              {paying ? "Waiting for approvalâ€¦" : `Pay â‚¹${totalFare()}`}
            </button>
          </form>
        )}

        {/* STEP 5 â€” TICKET */}
        {step === 5 && selectedTrain && (
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col items-center text-center mb-5">
              <CheckCircle2 className={ticketStatus === "confirmed" ? "text-emerald-500 mb-2" : "text-amber-500 mb-2"} size={40} />
              <h2 className="text-lg font-black text-blue-950" style={{ fontFamily: "Georgia, serif" }}>
                {ticketStatus === "confirmed" ? "Booking confirmed" : `Booking ${ticketStatus} â€” added to queue`}
              </h2>
              <p className="text-xs text-slate-400">Paid via UPI Â· no OTP needed</p>
            </div>

            {itinerary.length > 1 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl px-3 py-2 mb-4 text-center font-semibold">
                Leg {legIndex + 1} of {itinerary.length} booked
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl px-3 py-2 mb-4 text-center">
              Confirmation sent to {contact.email || "your email"} and {contact.phone || "your phone"}
            </div>

            {completedLegs.map((leg, i) => (
              <div key={leg.pnr} className="bg-white rounded-2xl border border-slate-200 p-3.5 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-slate-800">Leg {i + 1} Â· {leg.trainName}</span>
                  <StatusPill status={leg.status} />
                </div>
                <div className="text-xs text-slate-400">
                  PNR {leg.pnr} Â· {leg.from.split(" ")[0]} â†’ {leg.to.split(" ")[0]} Â· {leg.date} Â· Berths {leg.seatNos.join(", ") || "â€”"}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-blue-950 text-white px-4 py-3 flex justify-between items-center">
                <span className="font-bold flex items-center gap-1.5 text-sm">
                  <Ticket size={16} /> {selectedTrain.name}
                </span>
                <StatusPill status={ticketStatus} />
              </div>
              <div className="p-4 flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    `RailYatra|PNR:${pnr}|Train:${selectedTrain.id}|Date:${date}|Berths:${selectedSeats.join(",")}`
                  )}`}
                  alt={`QR code for PNR ${pnr}`}
                  width={140}
                  height={140}
                  className="rounded-lg border border-slate-100"
                />
              </div>
              <div className="p-4 pt-0">
                <div className="flex justify-between text-sm mb-3">
                  <div>
                    <div className="font-black text-slate-800">{selectedTrain.dep}</div>
                    <div className="text-[11px] text-slate-400">{findStation(from).name} ({findStation(from).code})</div>
                  </div>
                  <ArrowRight className="text-slate-300 self-center" size={16} />
                  <div className="text-right">
                    <div className="font-black text-slate-800">{selectedTrain.arr}</div>
                    <div className="text-[11px] text-slate-400">{findStation(to).name} ({findStation(to).code})</div>
                  </div>
                </div>
                <div className="h-px border-t border-dashed border-slate-200 my-3" />
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-400 text-xs">PNR</div>
                  <div className="text-right font-mono font-bold text-slate-800">{pnr}</div>
                  <div className="text-slate-400 text-xs">Class</div>
                  <div className="text-right font-semibold text-slate-700">{selectedClass.label}</div>
                  <div className="text-slate-400 text-xs">Date</div>
                  <div className="text-right font-semibold text-slate-700">{date}</div>
                  <div className="text-slate-400 text-xs">Passengers</div>
                  <div className="text-right font-semibold text-slate-700">{passengers.length}</div>
                </div>
                <div className="h-px border-t border-dashed border-slate-200 my-3" />
                {passengers.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm py-0.5">
                    <span className="text-slate-600">
                      {p.name}, {p.age}{p.gender}
                    </span>
                    <span className="text-slate-400 text-xs self-center">
                      {ticketStatus === "confirmed" ? `Berth ${selectedSeats[i]} (${seats.find((s) => s.seatNo === selectedSeats[i])?.type})` : ticketStatus}
                    </span>
                  </div>
                ))}
                <div className="h-px border-t border-dashed border-slate-200 my-3" />
                <div className="flex justify-between font-black text-slate-800">
                  <span className="text-sm">Total paid</span>
                  <span className="flex items-center">
                    <IndianRupee size={14} />
                    {totalFare()}
                  </span>
                </div>
              </div>
            </div>

            {ticketStatus === "confirmed" && (
              <div className="mt-4">
                <DelayAlertToggle pnr={pnr} trainId={selectedTrain.id} date={date} />
              </div>
            )}

            {legIndex + 1 < itinerary.length ? (
              <button onClick={advanceLeg} className="mt-4 w-full bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-2xl py-3 flex items-center justify-center gap-2">
                Book leg {legIndex + 2} of {itinerary.length} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={resetAll} className="mt-4 w-full border-2 border-blue-900 text-blue-900 font-bold rounded-2xl py-3">
                Book another ticket
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
