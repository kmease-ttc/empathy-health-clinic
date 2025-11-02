/**
 * Track phone number clicks as leads and analytics events
 */

import { trackEvent } from './analytics';

export function initPhoneTracking() {
  // Track all phone links
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  
  phoneLinks.forEach((link) => {
    // Remove any existing listeners to prevent duplicates
    const newLink = link.cloneNode(true) as HTMLAnchorElement;
    link.parentNode?.replaceChild(newLink, link);
    
    newLink.addEventListener('click', async () => {
      const phoneNumber = newLink.getAttribute('href')?.replace('tel:', '') || '';
      
      // Track as analytics event (shows up on dashboard)
      trackEvent('phone_click', 'conversion', window.location.pathname, phoneNumber);
      console.log(`📞 Phone click tracked: ${phoneNumber} from ${window.location.pathname}`);
      
      // Also create a lead record
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: 'Phone',
            lastName: 'Click',
            email: 'phone-click@tracking.local',
            phone: phoneNumber,
            formType: 'phone_click',
            source: window.location.pathname,
            smsOptIn: 'false',
          }),
        });
      } catch (error) {
        console.error('Failed to create phone click lead:', error);
      }
    });
  });
}
