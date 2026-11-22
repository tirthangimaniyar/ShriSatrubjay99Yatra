import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateDevoteePassPDF = (registration) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryMaroon = [122, 12, 30]; // #7A0C1E
  const goldenBorder = [200, 147, 38]; // #C89326

  // Decorative Border
  doc.setDrawColor(...goldenBorder);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, 194, 281);

  doc.setLineWidth(0.5);
  doc.rect(11, 11, 188, 275);

  // Top religious header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryMaroon);
  doc.text('|| SHRI ADINATHAYA NAMAH || SHRI SHANKHESHWAR PARSHVANATHAYA NAMAH ||', 105, 18, { align: 'center' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(...primaryMaroon);
  doc.text('SHRI SHATRUNJAY GIRIRAJ 99 YATRA', 105, 26, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(68, 13, 74);
  doc.text('Official Yatra Registration Pass & Receipt', 105, 33, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('Organized by: Shri Betalisi Visa Shrimali Jain Samaj', 105, 39, { align: 'center' });

  // Divider Line
  doc.setDrawColor(...goldenBorder);
  doc.setLineWidth(0.8);
  doc.line(16, 43, 194, 43);

  // Registration ID Box
  doc.setFillColor(252, 249, 242);
  doc.setDrawColor(...goldenBorder);
  doc.roundedRect(16, 46, 178, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryMaroon);
  doc.text(`REGISTRATION ID: ${registration.registrationId}`, 22, 56);

  const statusColor = registration.status === 'Confirmed' ? [22, 101, 52] : [180, 83, 9];
  doc.setTextColor(...statusColor);
  doc.text(`STATUS: ${registration.status.toUpperCase()}`, 188, 56, { align: 'right' });

  // Devotee Information Table
  const mainDetails = [
    ['Lead Devotee (Mukhya Yatrik)', registration.fullName, 'Registration Date', new Date(registration.createdAt).toLocaleDateString('en-IN')],
    ['Mobile Number', registration.mobileNumber, 'WhatsApp Number', registration.whatsappNumber || registration.mobileNumber],
    ['Email Address', registration.email, 'Gender / Age', `${registration.gender} / ${registration.age} Years`],
    ['City & State', `${registration.city}, ${registration.state || 'Gujarat'}`, 'Pincode', registration.pincode],
    ['Category', registration.registrationCategory, 'Total Devotees', `${registration.totalParticipants} Person(s)`],
    ['Doli / Chair Need', registration.doliAssistanceRequired ? 'YES (Palkhi Requested)' : 'No', 'Emergency Contact', `${registration.emergencyContactName || '-'} (${registration.emergencyContactNumber})`],
  ];

  doc.autoTable({
    startY: 65,
    margin: { left: 16, right: 16 },
    head: [['Field', 'Details', 'Field', 'Details']],
    body: mainDetails,
    theme: 'grid',
    headStyles: {
      fillColor: primaryMaroon,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, fillColor: [248, 245, 238] },
      1: { cellWidth: 48 },
      2: { fontStyle: 'bold', cellWidth: 42, fillColor: [248, 245, 238] },
      3: { cellWidth: 46 },
    },
  });

  let nextY = doc.lastAutoTable.finalY + 6;

  // Family members list
  if (registration.familyMembers && registration.familyMembers.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryMaroon);
    doc.text('Accompanying Family Members (સાથે આવનાર પરિવારના સભ્યો):', 16, nextY);

    const familyData = registration.familyMembers.map((m, idx) => [
      idx + 1,
      m.name,
      m.relation,
      m.gender,
      m.age,
      m.specialNeed || 'None'
    ]);

    doc.autoTable({
      startY: nextY + 2,
      margin: { left: 16, right: 16 },
      head: [['#', 'Name of Member', 'Relation', 'Gender', 'Age', 'Special Notes']],
      body: familyData,
      theme: 'striped',
      headStyles: {
        fillColor: [68, 13, 74],
        textColor: [255, 255, 255],
        fontSize: 8.5,
      },
      bodyStyles: {
        fontSize: 8,
      },
    });

    nextY = doc.lastAutoTable.finalY + 6;
  }

  // Address & Special notes
  const notesData = [
    ['Full Address', registration.fullAddress],
    ['Medical / Travel Needs', registration.hasMedicalNeed ? registration.medicalDetails : (registration.hasTravelAssistanceNeed ? registration.travelDetails : 'None Reported')],
    ['Additional Remarks', registration.additionalNotes || 'N/A'],
  ];

  doc.autoTable({
    startY: nextY,
    margin: { left: 16, right: 16 },
    body: notesData,
    theme: 'plain',
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, textColor: primaryMaroon },
      1: { cellWidth: 133 },
    },
  });

  nextY = doc.lastAutoTable.finalY + 8;

  // Holy Yatra Rules & Guidelines
  doc.setFillColor(252, 249, 242);
  doc.setDrawColor(...goldenBorder);
  doc.roundedRect(16, nextY, 178, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryMaroon);
  doc.text('IMPORTANT GUIDELINES FOR SHATRUNJAY 99 YATRA:', 20, nextY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text('1. Please carry a printed copy of this Yatra Pass or digital receipt on your mobile when reporting at Palitana.', 20, nextY + 12);
  doc.text('2. Pure Jain religious conduct (Satvik ahara, Chovihar/Navkarshi) should be strictly observed during yatra.', 20, nextY + 17);
  doc.text('3. Comfortable white clothes, warm shawl for morning pradakshina, and personal medicines are recommended.', 20, nextY + 22);
  doc.text('4. Devotees needing Doli / Palkhi should contact the Sangh office 24 hours prior to scheduled ascent.', 20, nextY + 27);
  doc.text('5. Helpline / WhatsApp: +91 63523 66615 | Email: info@palitana99yatra.org', 20, nextY + 32);

  // Footer Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryMaroon);
  doc.text('Shri Betalisi Visa Shrimali Jain Samaj', 20, 275);
  doc.text('Authorized Signatory / Mantri Shri', 150, 275);

  // Save the PDF
  doc.save(`Palitana-99-Yatra-Pass-${registration.registrationId}.pdf`);
};
