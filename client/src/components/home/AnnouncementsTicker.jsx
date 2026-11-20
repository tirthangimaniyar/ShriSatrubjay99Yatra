import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import { getApiUrl } from '../../config';

export const AnnouncementsTicker = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(getApiUrl('/api/announcements'));
        const data = await res.json();
        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
        }
      } catch (err) {
        console.error('Announcements load error:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-y border-yatra-gold/40 py-2.5 px-4 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center space-x-3 text-xs sm:text-sm font-gujarati">
        <div className="flex items-center space-x-1.5 bg-yatra-maroon text-amber-100 px-2.5 py-1 rounded-lg shrink-0 font-bold shadow-sm">
          <Bell className="w-3.5 h-3.5 text-yatra-goldAccent animate-bounce" />
          <span>સૂચના પત્ર</span>
        </div>

        <div className="overflow-x-auto whitespace-nowrap text-yatra-charcoal flex items-center space-x-6 py-0.5">
          {announcements.map((item, idx) => (
            <div key={item._id || idx} className="inline-flex items-center space-x-2">
              <span className="text-yatra-maroon font-bold">✦</span>
              <span className="font-semibold text-yatra-maroon">{item.gujaratiTitle || item.title}:</span>
              <span className="text-gray-700">{item.gujaratiContent || item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
