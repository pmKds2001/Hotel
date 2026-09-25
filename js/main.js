/**
 * Sunset Sands Hotel - Hikkaduwa
 * Interactive Frontend JavaScript
 * Supports Mobile, iPad 10 (820px), Tablet & Desktop
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initHeroSlider();
  initChillSlider();
  initLeafletMap();
  initStatsCounter();
  initBookingModal();
  initLightbox();
  initRoomDetailsModal();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile & Tablet Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close menu when clicking outside or clicking any nav link
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================================
   3. Hero Section Carousel Slider (Multi-Image & Text Slider)
   ========================================================================== */
function initHeroSlider() {
  const heroSlider = document.querySelector('.hero-slider');
  if (!heroSlider) return;

  const slides = heroSlider.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-slider-dots');
  const prevBtn = document.querySelector('.hero-slider-prev');
  const nextBtn = document.querySelector('.hero-slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500;

  // Build dots dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to hero slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    // Dynamically apply data-overlay-color for slide
    const overlayColor = slides[currentSlide].getAttribute('data-overlay-color');
    const overlay = slides[currentSlide].querySelector('.hero-slide-overlay');
    if (overlay && overlayColor) {
      overlay.style.background = `linear-gradient(135deg, ${overlayColor} 0%, rgba(4, 8, 16, 0.85) 100%)`;
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startInterval() {
    stopInterval();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopInterval() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetInterval() {
    stopInterval();
    startInterval();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }

  // Pause on hover
  heroSlider.addEventListener('mouseenter', stopInterval);
  heroSlider.addEventListener('mouseleave', startInterval);

  // Touch Swipe Gesture Support for iPad & Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  heroSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopInterval();
  }, { passive: true });

  heroSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startInterval();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Initialize first slide overlay
  if (slides[0]) {
    const firstOverlayColor = slides[0].getAttribute('data-overlay-color');
    const firstOverlay = slides[0].querySelector('.hero-slide-overlay');
    if (firstOverlay && firstOverlayColor) {
      firstOverlay.style.background = `linear-gradient(135deg, ${firstOverlayColor} 0%, rgba(4, 8, 16, 0.85) 100%)`;
    }
  }

  startInterval();
}

/* ==========================================================================
   4. Chill Section Carousel Slider
   ========================================================================== */
function initChillSlider() {
  const slides = document.querySelectorAll('.chill-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  if (!slides.length || !dotsContainer) return;

  let currentSlide = 0;
  let slideInterval;

  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 4500);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();

  const container = document.querySelector('.chill-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(slideInterval));
    container.addEventListener('mouseleave', () => startInterval());
  }
}

/* ==========================================================================
   5. Leaflet Map (Hikkaduwa, Sri Lanka)
   ========================================================================== */
function initLeafletMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  // Hikkaduwa Beach Coordinates
  const hikkaduwaLat = 6.1395;
  const hikkaduwaLng = 80.1063;

  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([hikkaduwaLat, hikkaduwaLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Custom marker
  const marker = L.marker([hikkaduwaLat, hikkaduwaLng]).addTo(map);
  marker.bindPopup(`
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
      <strong style="color: #0c2340; font-size: 14px;">Sunset Sands Hotel</strong><br/>
      <span style="color: #555; font-size: 12px;">Galle Road, Hikkaduwa, Sri Lanka</span><br/>
      <span style="color: #0084ff; font-weight: bold; font-size: 11px;">Beachfront Luxury</span>
    </div>
  `).openPopup();
}

/* ==========================================================================
   6. Number Counter Animation for Stats
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          animateNumber(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

function animateNumber(element, target, suffix) {
  const duration = 1600;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeProgress * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = target + suffix;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ==========================================================================
   7. Booking / Check Availability Modal
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.btn-check-availability, .btn-book-room, .btn-reservation');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = document.getElementById('bookingForm');
  const successBox = modal.querySelector('.booking-success');
  const roomSelect = document.getElementById('roomType');

  // Set today as min date
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  if (checkinInput && checkoutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;
    checkinInput.value = today;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    checkoutInput.min = today;
    checkoutInput.value = tomorrow.toISOString().split('T')[0];
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const specificRoom = btn.getAttribute('data-room');
      if (specificRoom && roomSelect) {
        roomSelect.value = specificRoom;
      }
      if (form) form.style.display = 'flex';
      if (successBox) successBox.style.display = 'none';
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
      }
    });
  }
}

/* ==========================================================================
   8. Gallery Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let imagesList = [];
  let currentIndex = 0;

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      imagesList.push(img.src);
      item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
      });
    }
  });

  function openLightbox() {
    lightboxImg.src = imagesList[currentIndex];
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    lightboxImg.src = imagesList[currentIndex];
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   9. Room Details Modal ("More....")
   ========================================================================== */
const roomData = {
  'single': {
    title: 'Single Room',
    subtitle: 'Cozy private coastal sanctuary for solo travelers',
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop',
    price: '$65 / Night',
    desc: 'Perfect for solo travelers, digital nomads, and explorers. Our Single Room offers a cozy, private space with modern comforts. Enjoy a peaceful stay with plush king bedding, essential high-tech amenities, and a relaxing coastal ambience.',
    features: ['1 King Bed with Luxury Linens', 'Smart TV with Streaming Apps', 'High-Speed Free Wi-Fi 6', '100% Smoke Free Room', 'Modern Ensuite Bathroom', 'Daily Fresh Coastal Breakfast', 'In-room Coffee & Tea Maker', 'Direct Beach Access']
  },
  'double': {
    title: 'Double Room',
    subtitle: 'Spacious comfort with stylish tropical décor for couples',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
    price: '$110 / Night',
    desc: 'Designed for couples or friends, our Double Room provides generous comfort with stylish modern decor. Enjoy a restful experience with comfortable bedding, modern facilities, and a warm beachside atmosphere with soothing ocean breeze.',
    features: ['1 King Bed or 2 Twin Beds', 'Smart TV 50" with Netflix', 'Complimentary High-Speed Wi-Fi', 'Smoke Free Environment', 'Private Balcony with Sea Glimpse', 'Air Conditioning & Ceiling Fan', 'Mini Bar & Refrigerator', 'Rain Shower & Organic Toiletries']
  },
  'deluxe': {
    title: 'Deluxe Ocean View Room',
    subtitle: 'Panoramic ocean vistas & golden sunset views',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000&auto=format&fit=crop',
    price: '$165 / Night',
    desc: 'Indulge in unobstructed views of the Indian Ocean from your private beachfront terrace. Features an expansive open layout, luxury king bedding, sound-softening glass doors, and romantic sunset vistas every evening.',
    features: ['Panoramic Ocean View Balcony', 'California King Sized Bed', 'Smart TV 55" with Cable', 'Ultra-fast Wi-Fi', 'Complimentary Gourmet Breakfast', 'Espresso Machine & Fresh Ceylon Tea', 'Premium Bathrobes & Slippers', 'In-room Safe & Mini Bar']
  },
  'family': {
    title: 'Family Budget Suite',
    subtitle: 'Interconnected comfort tailored for families & groups',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop',
    price: '$195 / Night',
    desc: 'Tailored for families seeking relaxation and value in Hikkaduwa. Offers two interconnected bedrooms, generous seating area, kid-friendly amenities, and convenient proximity to the beach and pool.',
    features: ['2 Queen Beds & Extra Daybed', '2 Separate Smart TVs', 'High-Speed Wi-Fi for all devices', 'Non-smoking Suite', 'Spacious Dual Bathrooms', 'Mini Kitchenette & Microwave', 'Dedicated Sitting Lounge', 'Free Infant Crib on Request']
  }
};

function initRoomDetailsModal() {
  const modal = document.getElementById('roomDetailModal');
  const moreButtons = document.querySelectorAll('.btn-more');
  if (!modal || !moreButtons.length) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const titleEl = document.getElementById('roomDetailTitle');
  const subtitleEl = document.getElementById('roomDetailSubtitle');
  const imgEl = document.getElementById('roomDetailImg');
  const descEl = document.getElementById('roomDetailDesc');
  const priceEl = document.getElementById('roomDetailPrice');
  const amenitiesListEl = document.getElementById('roomDetailAmenities');
  const bookBtn = document.getElementById('roomDetailBookBtn');

  moreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomId = btn.getAttribute('data-room-id');
      const data = roomData[roomId] || roomData['single'];

      if (titleEl) titleEl.textContent = data.title;
      if (subtitleEl) subtitleEl.textContent = data.subtitle;
      if (imgEl) imgEl.src = data.img;
      if (descEl) descEl.textContent = data.desc;
      if (priceEl) priceEl.textContent = data.price;

      if (amenitiesListEl) {
        amenitiesListEl.innerHTML = '';
        data.features.forEach(f => {
          const item = document.createElement('div');
          item.className = 'amenity-item';
          item.innerHTML = `<i class="fa-solid fa-check"></i> <span>${f}</span>`;
          amenitiesListEl.appendChild(item);
        });
      }

      if (bookBtn) {
        bookBtn.onclick = () => {
          modal.classList.remove('active');
          const bookingModal = document.getElementById('bookingModal');
          const roomSelect = document.getElementById('roomType');
          if (roomSelect) {
            if (roomId === 'single') roomSelect.value = 'single';
            else if (roomId === 'double') roomSelect.value = 'double';
            else if (roomId === 'deluxe') roomSelect.value = 'deluxe';
            else if (roomId === 'family') roomSelect.value = 'family';
          }
          if (bookingModal) bookingModal.classList.add('active');
        };
      }

      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
