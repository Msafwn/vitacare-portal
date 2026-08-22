export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const CITIES = [
  "Abbottabad", "Ahmadpur East", "Arif Wala", "Attock", "Badin", "Bahawalnagar", "Bahawalpur", "Bhalwal", "Bhakkar", "Burewala", "Chaman", "Chichawatni", "Chiniot", "Chishtian", "Dadu", "Daska", "Dera Ghazi Khan", "Dera Ismail Khan", "Faisalabad", "Ferozewala", "Ghotki", "Gojra", "Gujranwala", "Gujrat", "Hafizabad", "Haroonabad", "Hasilpur", "Hub", "Hyderabad", "Islamabad", "Jacobabad", "Jalalpur", "Jaranwala", "Jhang", "Jhelum", "Kamalia", "Kandhkot", "Karachi", "Kasur", "Khairpur", "Khanewal", "Khanpur", "Khuzdar", "Kohat", "Kot Abdul Malik", "Kot Addu", "Lahore", "Larkana", "Layyah", "Lodhran", "Mandi Bahauddin", "Mardan", "Mian Channu", "Mianwali", "Mingora", "Mirpur Khas", "Multan", "Muridke", "Muzaffargarh", "Nawabshah", "Nowshera", "Okara", "Pakpattan", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", "Sadiqabad", "Sahiwal", "Sargodha", "Sheikhupura", "Shikarpur", "Sialkot", "Sukkur", "Swabi", "Tando Adam", "Tando Allahyar", "Turbat", "Vehari", "Wah Cantonment", "Wazirabad"
].sort();

export const currentUser = {
  id: "u-1001",
  name: "Ayesha Khan",
  email: "ayesha.khan@example.com",
  phone: "+92 300 1234567",
  bloodGroup: "O+",
  city: "Karachi",
  address: "Block 4, Gulshan-e-Iqbal, Karachi",
  isDonor: true,
  available: true,
  lastDonation: "2026-04-18",
  totalDonations: 7,
  livesSaved: 21,
};

export const donors = [
  { id: "d-1", name: "Bilal Ahmed", bloodGroup: "O-", city: "Karachi", area: "DHA Phase 6", phone: "+92 301 2223344", lastDonation: "2026-05-02", donations: 12, status: "available", verified: true },
  { id: "d-2", name: "Sana Iqbal", bloodGroup: "A+", city: "Lahore", area: "Model Town", phone: "+92 322 5566778", lastDonation: "2026-06-11", donations: 5, status: "available", verified: true },
  { id: "d-3", name: "Usman Tariq", bloodGroup: "B+", city: "Islamabad", area: "F-8 Markaz", phone: "+92 333 9988776", lastDonation: "2026-07-01", donations: 9, status: "unavailable", verified: true },
  { id: "d-4", name: "Hina Raza", bloodGroup: "AB+", city: "Karachi", area: "Clifton", phone: "+92 345 1122334", lastDonation: "2026-03-22", donations: 3, status: "available", verified: false },
  { id: "d-5", name: "Fahad Sheikh", bloodGroup: "O+", city: "Faisalabad", area: "Peoples Colony", phone: "+92 311 4455667", lastDonation: "2026-06-28", donations: 15, status: "available", verified: true },
  { id: "d-6", name: "Maryam Noor", bloodGroup: "A-", city: "Multan", area: "Cantt", phone: "+92 302 7788990", lastDonation: "2026-02-14", donations: 2, status: "unavailable", verified: false },
  { id: "d-7", name: "Zain Abbas", bloodGroup: "B-", city: "Rawalpindi", area: "Saddar", phone: "+92 336 3344556", lastDonation: "2026-05-30", donations: 8, status: "available", verified: true },
  { id: "d-8", name: "Nida Aslam", bloodGroup: "AB-", city: "Lahore", area: "Johar Town", phone: "+92 321 6677889", lastDonation: "2026-07-19", donations: 4, status: "available", verified: true },
  { id: "d-9", name: "Kashif Mehmood", bloodGroup: "O+", city: "Karachi", area: "North Nazimabad", phone: "+92 300 5544332", lastDonation: "2026-01-09", donations: 11, status: "available", verified: true },
  { id: "d-10", name: "Rabia Yousuf", bloodGroup: "A+", city: "Islamabad", area: "G-11", phone: "+92 340 2211334", lastDonation: "2026-04-05", donations: 6, status: "unavailable", verified: true },
];

export const requests = [
  { id: "r-2041", patient: "Imran Malik", bloodGroup: "O-", units: 2, hospital: "Aga Khan University Hospital", city: "Karachi", neededOn: "2026-08-12", urgency: "critical", status: "pending", requester: "Ayesha Khan", createdAt: "2026-08-06", notes: "Patient scheduled for emergency surgery, needs O- units urgently." },
  { id: "r-2039", patient: "Sara Baig", bloodGroup: "A+", units: 1, hospital: "Shaukat Khanum", city: "Lahore", neededOn: "2026-08-15", urgency: "urgent", status: "approved", requester: "Ayesha Khan", createdAt: "2026-08-04", notes: "Chemotherapy support transfusion." },
  { id: "r-2035", patient: "Ahmed Raza", bloodGroup: "B+", units: 3, hospital: "PIMS", city: "Islamabad", neededOn: "2026-08-09", urgency: "critical", status: "fulfilled", requester: "Usman Tariq", createdAt: "2026-08-01", notes: "Road accident trauma case." },
  { id: "r-2030", patient: "Fatima Zahra", bloodGroup: "AB+", units: 1, hospital: "Liaquat National", city: "Karachi", neededOn: "2026-08-20", urgency: "normal", status: "pending", requester: "Hina Raza", createdAt: "2026-07-29", notes: "Planned maternity reserve." },
  { id: "r-2028", patient: "Junaid Khan", bloodGroup: "O+", units: 2, hospital: "Allied Hospital", city: "Faisalabad", neededOn: "2026-07-30", urgency: "urgent", status: "cancelled", requester: "Fahad Sheikh", createdAt: "2026-07-25", notes: "Request withdrawn by family." },
  { id: "r-2024", patient: "Mehwish Ali", bloodGroup: "A-", units: 2, hospital: "Nishtar Hospital", city: "Multan", neededOn: "2026-07-22", urgency: "normal", status: "fulfilled", requester: "Maryam Noor", createdAt: "2026-07-18", notes: "Anaemia treatment." },
];

export const donations = [
  { id: "dn-901", donor: "Ayesha Khan", bloodGroup: "O+", units: 1, center: "Fatimid Foundation", city: "Karachi", date: "2026-04-18", status: "completed" },
  { id: "dn-892", donor: "Ayesha Khan", bloodGroup: "O+", units: 1, center: "Indus Hospital Blood Bank", city: "Karachi", date: "2025-12-02", status: "completed" },
  { id: "dn-874", donor: "Ayesha Khan", bloodGroup: "O+", units: 1, center: "Aga Khan Blood Bank", city: "Karachi", date: "2025-08-14", status: "completed" },
  { id: "dn-861", donor: "Bilal Ahmed", bloodGroup: "O-", units: 1, center: "Fatimid Foundation", city: "Karachi", date: "2026-05-02", status: "completed" },
  { id: "dn-855", donor: "Sana Iqbal", bloodGroup: "A+", units: 2, center: "Shaukat Khanum", city: "Lahore", date: "2026-06-11", status: "completed" },
  { id: "dn-844", donor: "Zain Abbas", bloodGroup: "B-", units: 1, center: "PIMS Blood Centre", city: "Rawalpindi", date: "2026-05-30", status: "scheduled" },
];

export const inventory = BLOOD_GROUPS.map((group, i) => {
  const units = [42, 8, 30, 5, 18, 3, 64, 11][i];
  return {
    group,
    units,
    capacity: 80,
    status: units < 10 ? "critical" : units < 20 ? "low" : "available",
    updated: "2026-08-08",
  };
});

export const users = [
  { id: "u-1001", name: "Ayesha Khan", email: "ayesha.khan@example.com", role: "Donor", city: "Karachi", bloodGroup: "O+", joined: "2024-02-11", status: "active" },
  { id: "u-1002", name: "Bilal Ahmed", email: "bilal.ahmed@example.com", role: "Donor", city: "Karachi", bloodGroup: "O-", joined: "2024-05-06", status: "active" },
  { id: "u-1003", name: "Sana Iqbal", email: "sana.iqbal@example.com", role: "Donor", city: "Lahore", bloodGroup: "A+", joined: "2025-01-19", status: "active" },
  { id: "u-1004", name: "Hina Raza", email: "hina.raza@example.com", role: "Recipient", city: "Karachi", bloodGroup: "AB+", joined: "2025-03-27", status: "pending" },
  { id: "u-1005", name: "Fahad Sheikh", email: "fahad.sheikh@example.com", role: "Donor", city: "Faisalabad", bloodGroup: "O+", joined: "2025-07-02", status: "active" },
  { id: "u-1006", name: "Maryam Noor", email: "maryam.noor@example.com", role: "Recipient", city: "Multan", bloodGroup: "A-", joined: "2026-01-15", status: "inactive" },
  { id: "u-1007", name: "Zain Abbas", email: "zain.abbas@example.com", role: "Donor", city: "Rawalpindi", bloodGroup: "B-", joined: "2026-02-23", status: "active" },
  { id: "u-1008", name: "Nida Aslam", email: "nida.aslam@example.com", role: "Donor", city: "Lahore", bloodGroup: "AB-", joined: "2026-04-30", status: "active" },
];

export const notifications = [
  { id: "n-1", title: "Matching donor found", body: "Bilal Ahmed (O-) is available near Aga Khan University Hospital.", time: "12 minutes ago", type: "success", unread: true },
  { id: "n-2", title: "Request #r-2041 is critical", body: "Your request for 2 units of O- is awaiting approval.", time: "1 hour ago", type: "error", unread: true },
  { id: "n-3", title: "You are eligible to donate", body: "56 days have passed since your last donation. Book a slot today.", time: "Yesterday", type: "info", unread: false },
  { id: "n-4", title: "Donation recorded", body: "1 unit donated at Fatimid Foundation was verified.", time: "18 Apr 2026", type: "success", unread: false },
  { id: "n-5", title: "Low inventory alert", body: "AB- stock dropped below the safety threshold in Karachi.", time: "17 Apr 2026", type: "warning", unread: false },
];

export const monthlyDonations = [
  { month: "Feb", donations: 128, requests: 96 },
  { month: "Mar", donations: 154, requests: 112 },
  { month: "Apr", donations: 141, requests: 134 },
  { month: "May", donations: 178, requests: 121 },
  { month: "Jun", donations: 192, requests: 158 },
  { month: "Jul", donations: 205, requests: 166 },
];

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
