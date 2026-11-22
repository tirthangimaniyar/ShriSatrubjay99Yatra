const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  yatraName: { type: String, default: "શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ" },
  yatraNameEnglish: { type: String, default: "Shri Shatrunjay Giriraj 99 Yatra" },
  organizer: { type: String, default: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ" },
  datesGujarati: { type: String, default: "કારતક સુદ પૂનમ થી મહા સુદ દસમ" },
  datesEnglish: { type: String, default: "04 January 2027 to 13 January 2027" },
  location: { type: String, default: "શ્રી શત્રુંજય તીર્થ, પાલિતાણા, ભાવનગર, ગુજરાત" },
  contactMobile: { type: String, default: "+91 63523 66615" },
  contactWhatsApp: { type: String, default: "+91 63523 66615" },
  contactEmail: { type: String, default: "info@palitana99yatra.org" },
  suratAddress: { type: String, default: "શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન ભવન, અડાજણ - પાલ, સુરત, ગુજરાત - 395009" },
  palitanaAddress: { type: String, default: "શ્રી બેતાલીસ ભવન, તળેટી રોડ, પાલિતાણા, ગુજરાત - 364270" },
  registrationOpen: { type: Boolean, default: true },
  totalTargetYatrik: { type: Number, default: 999 },
  announcementTicker: { type: String, default: "જય જિનેન્દ્ર! શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા માટે ઓનલાઈન રજીસ્ટ્રેશન શરૂ થઈ ગયેલ છે." },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Setting', SettingSchema);
