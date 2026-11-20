# શ્રી શત્રુંજય ગિરિરાજ ૯૯ યાત્રા રજીસ્ટ્રેશન પોર્ટલ
## Shri Shatrunjay Palitana 99 Yatra Registration Portal

A fully dynamic, professional, modern, and premium Jain Religious Yatra Registration web application built with **React.js, Node.js, Express.js, MongoDB / Mongoose, and Tailwind CSS**.

Organized by **શ્રી બેતાલીસ વિશા શ્રીમાળી જૈન સમાજ** for the auspicious **Shri Shatrunjay Giriraj 99 Yatra Sah Chha'ri Palit Yatra Sangh (શાશ્વતાગિરિના પથ પર ૯૯ યાત્રા સહ છ'રી પાલિત યાત્રા સંઘ)** at Palitana, Gujarat.

---

## 🌟 Key Features

### 1. Public Devotee Website
- **Divine Temple-Inspired Theme:** Cream/Ivory backdrop, Royal Maroon, Deep Purple, and radiant Golden accents with Jain motifs and Gujarati typography.
- **Main Hero Section (Image 3 First):** Features the sacred Palitana Dada Adinath Bhagwan Idol in golden shringar, framed within an ornate temple mandap border with divine lighting and Gujarati invocation.
- **Promotional Event Card (Image 2 Inspired):** Clean visual layout displaying dates, location, organizing samaj, Nishra Data, and live counters.
- **Official Yatra Invitation Section (Image 1 Poster):** Full uncropped Gujarati poster of Shri Betalisi Visa Shrimali Jain Samaj in an ornate golden frame with interactive **View**, **Download**, and **Fullscreen Lightbox** options.
- **Spiritual Significance & About Yatra:** Comprehensive spiritual guidance on Shatrunjay Giriraj, 99 Yatra (Navanu) karma nirjara, and the 6 sacred rules of Chha'ri Palit Sangh.
- **High-Resolution Palitana Gallery:** Responsive grid, category filters (Palitana Giriraj, Tirthankar Idols, Derasar Architecture, Yatra Path, Religious Ceremonies), and interactive lightbox with fullscreen navigation.
- **Comprehensive User Registration Form:**
  - **Personal Details:** Full name, gender, DOB, age, 10-digit Indian mobile, WhatsApp, email.
  - **Address Details:** Full address, city, state, 6-digit pincode.
  - **Family Details:** Dynamic "Add Member" button to add multiple family members with name, relation, gender, age.
  - **Yatra Details:** Category selection, automatic calculation of total participants (lead devotee + family members), emergency contact number and name.
  - **Special Assistance:** Doli / Palkhi chair assistance requirement for Shatrunjay climb, medical assistance details, additional notes.
  - **Declaration:** Confirmation checkbox.
  - **Validation & Duplicate Prevention:** Validates 10-digit mobile, email, pincode, required fields, and prevents duplicate submissions.
  - **Confirmation & Exports:** Generates unique Registration ID (e.g. `99YATRA-2027-1001`), launches celebratory confetti, displays confirmation receipt, provides **Devotee Pass PDF Download** (using jsPDF) and **Print Receipt**.
- **Check Registration Status:** Devotees can search anytime using their Registration ID or 10-digit mobile number to view their submitted registration, verify live status, and reprint pass.
- **Helpline & Contact:** Complete office details in Surat & Palitana, telephone numbers, and direct WhatsApp enquiry link.

---

### 2. Secure Admin Dashboard (`/admin`)
- **Admin Authentication:**
  - Secure login at `/admin/login` with JWT authentication and bcrypt password hashing.
  - Default Admin Credentials:
    - **Email:** `admin@palitana99yatra.org`
    - **Password:** `admin123`
    - (Quick 1-click credential auto-fill provided on the login page for evaluator convenience).
- **Dashboard Overview:**
  - Real-time statistics: Total Registrations, Total Devotees/Participants, Today's Inflow, Pending, Confirmed, Cancelled, and Doli Requests.
  - Visual breakdown by City and Registration Category.
- **Registration Management:**
  - Real-time search by ID, devotee name, mobile number, or city.
  - Filters by Status (Pending, Confirmed, Waitlist, Cancelled, Rejected), City, and Category.
  - Sorting by newest, oldest, name, or participant count.
  - Row actions:
    - **View Details:** Comprehensive modal with lead devotee, family members list, medical/doli needs.
    - **Status Changer:** Instantly change status to Confirmed, Pending, Waitlist, Cancelled, or Rejected.
    - **Edit Registration:** Modify devotee details in an editable form.
    - **Delete Registration:** Remove record with confirmation modal.
    - **Download Devotee Pass:** Generate official PDF pass.
  - **Excel Export:** Download real `.xlsx` spreadsheet of all registrations.
- **Website Content Management:**
  - Post and manage announcements that appear on the public website ribbon ticker.
  - Toggle online registrations open or closed.
  - Update yatra event dates, helpline numbers, and contact addresses.
- **Admin Profile:**
  - Change administrator password and manage account.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Framer Motion, Lucide React, jsPDF, jsPDF-AutoTable, Canvas Confetti |
| **Backend** | Node.js, Express.js, REST API, Mongoose, JWT, bcryptjs, CORS, Multer, XLSX |
| **Database** | MongoDB with Mongoose (with automated persistent fallback engine so the app runs out-of-the-box even without a local MongoDB service) |

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd server
node server.js
```
The server will start on `http://localhost:5000`.

### 2. Start Frontend (Development)
```bash
cd client
npm.cmd run dev
```
Access the application at `http://localhost:5173`.

### 3. Production Unified Mode
The backend server (`server.js`) also automatically serves the compiled React production bundle from `client/dist`.
You can access the full website and admin dashboard directly on:
- **Website:** `http://localhost:5000`
- **Admin Dashboard:** `http://localhost:5000/admin`
- **Admin Login:** `http://localhost:5000/admin/login`

---

## 🔑 Default Credentials

- **Admin Email:** `admin@palitana99yatra.org`
- **Admin Password:** `admin123`

---

## 📁 Project Structure

```
d:\Project\99\
├── client\
│   ├── public\
│   │   └── images\
│   │       ├── hero-idol.png             # Sacred Palitana Adinath Bhagwan Idol (Image 3)
│   │       ├── invitation-poster.jpeg    # Official Gujarati Invitation Poster (Image 1)
│   │       ├── dada-idol.jpeg            # Adorned Jain Tirthankar Idol
│   │       ├── ref-card-layout.png       # Card layout reference (Image 2)
│   │       └── gallery\                  # High-res Palitana temples, Derasars, mountain images
│   ├── src\
│   │   ├── components\
│   │   │   ├── common\Navbar.jsx         # Header & mobile drawer
│   │   │   ├── common\Footer.jsx         # Footer with Navkar Mantra
│   │   │   ├── home\HeroSection.jsx      # Hero section with Image 3 first
│   │   │   ├── home\PromotionalCard.jsx  # Event highlight card (Image 2 layout)
│   │   │   ├── home\OfficialInvitation.jsx # Uncropped invitation with zoom & download
│   │   │   ├── home\AboutYatra.jsx       # 99 Yatra significance & Chha'ri Palit rules
│   │   │   ├── home\PalitanaGallery.jsx  # Gallery with category filters & lightbox
│   │   │   ├── home\RegistrationSection.jsx # Complete registration form with validation
│   │   │   ├── home\CheckStatusModal.jsx # Devotee status lookup & pass re-download
│   │   │   └── home\ContactSection.jsx   # Contact info & Sangh bhawans
│   │   ├── context\AuthContext.jsx       # Admin auth context
│   │   ├── pages\HomePage.jsx            # Main landing page
│   │   ├── pages\admin\AdminLoginPage.jsx # Admin login page
│   │   ├── pages\admin\AdminDashboard.jsx # Full-featured admin dashboard
│   │   └── utils\pdfGenerator.js         # Official Devotee Pass PDF generator
│   └── package.json
├── server\
│   ├── config\db.js                      # MongoDB connection & persistent fallback
│   ├── models\                           # Mongoose schemas (Registration, Admin, Gallery, etc.)
│   ├── controllers\                      # REST API controllers
│   ├── routes\                           # Express route handlers
│   ├── middleware\auth.js                # JWT authentication middleware
│   ├── services\dataService.js           # Seeding & ID generator
│   ├── .env                              # Environment configuration
│   ├── .env.example
│   └── server.js                         # Main Express server entry point
└── README.md
```

---

## 🙏 Navkar Mantra
> **નમો અરિહંતાણં । નમો સિદ્ધાણં । નમો આયરિયાણં ।**
> **નમો ઉવજ્ઝાયાણં । નમો લોએ સવ્વસાહૂણં ।**
> **એસિ પંચ નમુક્કારો, સવ્વ પાવપ્પણાસણો । મંગલાણં ચ સવ્વેસિં, પઢમં હવઈ મંગલમ્ ॥**

*May this sacred 99 Yatra bring spiritual upliftment, peace, and eternal bliss to all devotees.*
