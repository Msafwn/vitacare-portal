/**
 * Constants & Utility Functions
 * Only essential dropdown options and formatters used across the platform.
 */

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const CITIES = [
  "Abbottabad", "Ahmadpur East", "Arif Wala", "Attock", "Badin", "Bahawalnagar", "Bahawalpur", "Bhalwal", "Bhakkar", "Burewala", "Chaman", "Chichawatni", "Chiniot", "Chishtian", "Dadu", "Daska", "Dera Ghazi Khan", "Dera Ismail Khan", "Faisalabad", "Ferozewala", "Ghotki", "Gojra", "Gujranwala", "Gujrat", "Hafizabad", "Haroonabad", "Hasilpur", "Hub", "Hyderabad", "Islamabad", "Jacobabad", "Jalalpur", "Jaranwala", "Jhang", "Jhelum", "Kamalia", "Kandhkot", "Karachi", "Kasur", "Khairpur", "Khanewal", "Khanpur", "Khuzdar", "Kohat", "Kot Abdul Malik", "Kot Addu", "Lahore", "Larkana", "Layyah", "Lodhran", "Mandi Bahauddin", "Mardan", "Mian Channu", "Mianwali", "Mingora", "Mirpur Khas", "Multan", "Muridke", "Muzaffargarh", "Nawabshah", "Nowshera", "Okara", "Pakpattan", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", "Sadiqabad", "Sahiwal", "Sargodha", "Sheikhupura", "Shikarpur", "Sialkot", "Sukkur", "Swabi", "Tando Adam", "Tando Allahyar", "Turbat", "Vehari", "Wah Cantonment", "Wazirabad"
].sort();

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
