import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { AnnouncementsTicker } from '../components/home/AnnouncementsTicker';
import { HeroSection } from '../components/home/HeroSection';
import { PromotionalCard } from '../components/home/PromotionalCard';
import { OfficialInvitation } from '../components/home/OfficialInvitation';
import { AboutYatra } from '../components/home/AboutYatra';
import { PalitanaGallery } from '../components/home/PalitanaGallery';
import { RegistrationSection } from '../components/home/RegistrationSection';
import { ContactSection } from '../components/home/ContactSection';
import { Footer } from '../components/common/Footer';
import { CheckStatusModal } from '../components/home/CheckStatusModal';

export const HomePage = () => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yatra-cream">
      {/* Navigation */}
      <Navbar onOpenStatusModal={() => setIsStatusModalOpen(true)} />

      {/* Announcements Ribbon */}
      <AnnouncementsTicker />

      {/* Main Hero Section (Features Sacred Jain Idol - Image 3 first) */}
      <HeroSection
        onRegisterClick={() => scrollTo('registration')}
        onInvitationClick={() => scrollTo('invitation')}
      />

      {/* Clean Promotional Event Card (Inspired by Reference Image 2) */}
      <PromotionalCard
        onRegisterClick={() => scrollTo('registration')}
        onInvitationClick={() => scrollTo('invitation')}
      />

      {/* Dedicated Official Yatra Invitation Section (Image 1 Gujarati Poster) */}
      <OfficialInvitation />

      {/* Spiritual Significance & About Yatra */}
      <AboutYatra />

      {/* High-Quality Palitana & Jain Derasar Gallery */}
      <PalitanaGallery />

      {/* Comprehensive User Registration Form */}
      <RegistrationSection />

      {/* Contact & Helpline Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Check Status Modal */}
      <CheckStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
};
