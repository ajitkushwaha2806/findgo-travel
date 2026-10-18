/**
 * FindGo Travel - Enterprise Cab Booking Engine
 * Brand Tagline: Your Journey, Our Responsibility.
 * Helpline: 7289034489
 * Maruti Suzuki Dzire Exclusive: One Way @ ₹18/KM (All Inclusive) | Round Trip @ ₹15/KM
 */

// Enterprise Configuration
const FINDGO_CONFIG = {
    carName: 'Maruti Suzuki Dzire',
    carType: 'AC Sedan',
    oneWayRate: 18,     // ₹18/KM (Tolls & Road Charges Included)
    roundTripRate: 15,  // ₹15/KM
    minKm: 250,
    whatsappNumber: '917289034489'
};

// Current App State
let activeTripType = 'one-way';

document.addEventListener('DOMContentLoaded', () => {
    initDefaultDates();
    setupTripTypeTabs();
    setupLiveFareCalculation();
    setupFormValidationAndSubmission();
    setupMobileMenu();
    setupNavbarScrollEffect();
    calculateEstimatedFare();
});

// Set default date & time (today + 2 hours)
function initDefaultDates() {
    const journeyDateInput = document.getElementById('journeyDate');
    const pickupTimeInput = document.getElementById('pickupTime');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    if (journeyDateInput) {
        journeyDateInput.value = todayStr;
        journeyDateInput.min = todayStr;
    }

    if (pickupTimeInput) {
        now.setHours(now.getHours() + 2);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        pickupTimeInput.value = `${hours}:${minutes}`;
    }
}

// Trip Type Tab Switcher
function setupTripTypeTabs() {
    const tabButtons = document.querySelectorAll('#tripTypeTabs .type-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTripType = btn.getAttribute('data-type');
            
            const kmInput = document.getElementById('kmDistance');
            if (activeTripType === 'round-trip') {
                if (parseInt(kmInput.value) < 400) kmInput.value = 500;
            } else {
                if (parseInt(kmInput.value) === 500) kmInput.value = 300;
            }

            calculateEstimatedFare();
        });
    });
}

// Live Fare Calculation Listener
function setupLiveFareCalculation() {
    const kmInput = document.getElementById('kmDistance');
    if (kmInput) {
        kmInput.addEventListener('input', calculateEstimatedFare);
        kmInput.addEventListener('change', calculateEstimatedFare);
    }
}

// Calculate Estimated Total Fare
function calculateEstimatedFare() {
    const kmInput = document.getElementById('kmDistance');
    const distanceKm = Math.max(10, parseFloat(kmInput?.value) || 100);

    const activeRate = activeTripType === 'one-way' ? FINDGO_CONFIG.oneWayRate : FINDGO_CONFIG.roundTripRate;
    let totalFare = 0;

    if (activeTripType === 'round-trip') {
        const effectiveKm = Math.max(distanceKm, FINDGO_CONFIG.minKm * 2);
        totalFare = effectiveKm * activeRate;
    } else {
        // One-Way Outstation: Distance * ₹18 (All Inclusive)
        totalFare = distanceKm * activeRate;
    }

    totalFare = Math.round(totalFare / 10) * 10;

    // Update DOM Elements
    const fareDisplay = document.getElementById('fareDisplay');
    const fareRateBadge = document.getElementById('fareRateBadge');
    const fareDisclaimerText = document.getElementById('fareDisclaimerText');

    if (fareDisplay) {
        fareDisplay.textContent = `₹${totalFare.toLocaleString('en-IN')}`;
    }

    if (fareRateBadge) {
        if (activeTripType === 'one-way') {
            fareRateBadge.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> ₹${activeRate}/KM • ALL INCLUSIVE • Toll & Road Charges Included`;
        } else {
            fareRateBadge.innerHTML = `<i class="fa-solid fa-arrows-rotate text-gold"></i> ₹${activeRate}/KM • Round Trip (Tolls & State Taxes paid as per actual receipts)`;
        }
    }

    if (fareDisclaimerText) {
        if (activeTripType === 'one-way') {
            fareDisclaimerText.textContent = 'One Way fare includes driver allowance, toll tax and state highway charges.';
        } else {
            fareDisclaimerText.textContent = 'Round trip fare includes cab driver allowance. Highway tolls paid directly as per actual receipts.';
        }
    }

    return { totalFare, distanceKm, activeRate };
}

// Form Validation and WhatsApp Submission Handler
function setupFormValidationAndSubmission() {
    const submitBtn = document.getElementById('whatsappSubmitBtn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const custNameInput = document.getElementById('custName');
        const custPhoneInput = document.getElementById('custPhone');
        const pickupLocInput = document.getElementById('pickupLoc');
        const dropLocInput = document.getElementById('dropLoc');
        const journeyDateInput = document.getElementById('journeyDate');
        const pickupTimeInput = document.getElementById('pickupTime');

        let isValid = true;

        // Reset Error Messages
        document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.form-field input').forEach(el => el.classList.remove('input-error'));

        // Validate Full Name
        if (!custNameInput.value.trim()) {
            showError('errCustName', custNameInput);
            isValid = false;
        }

        // Validate Mobile Number (10 digits)
        const phoneReg = /^[0-9]{10}$/;
        if (!phoneReg.test(custPhoneInput.value.trim())) {
            showError('errCustPhone', custPhoneInput);
            isValid = false;
        }

        // Validate Pickup
        if (!pickupLocInput.value.trim()) {
            showError('errPickupLoc', pickupLocInput);
            isValid = false;
        }

        // Validate Drop
        if (!dropLocInput.value.trim()) {
            showError('errDropLoc', dropLocInput);
            isValid = false;
        }

        // Validate Date
        if (!journeyDateInput.value) {
            showError('errJourneyDate', journeyDateInput);
            isValid = false;
        }

        // Validate Time
        if (!pickupTimeInput.value) {
            showError('errPickupTime', pickupTimeInput);
            isValid = false;
        }

        if (!isValid) return;

        // Trigger WhatsApp Redirect
        const { totalFare, distanceKm, activeRate } = calculateEstimatedFare();
        const tripLabel = activeTripType === 'one-way' 
            ? 'ONE WAY CAB (ALL INCLUSIVE)' 
            : 'ROUND TRIP CAB';

        const rateString = activeTripType === 'one-way'
            ? `₹${activeRate}/KM (Tolls & Road Charges Included)`
            : `₹${activeRate}/KM (Tolls & Taxes as per actual receipts)`;

        const whatsappMessage = `NEW CAB BOOKING - FindGo Travel

Customer Name: ${custNameInput.value.trim()}
Mobile: ${custPhoneInput.value.trim()}
Pickup: ${pickupLocInput.value.trim()}
Drop: ${dropLocInput.value.trim()}
Date: ${journeyDateInput.value}
Time: ${pickupTimeInput.value}
Trip Type: ${tripLabel}
Vehicle: ${FINDGO_CONFIG.carName} (${FINDGO_CONFIG.carType})
Distance: ${distanceKm} KM
Rate: ${rateString}
Estimated Fare: ₹${totalFare.toLocaleString('en-IN')}

Free Mineral Water Bottle, 100% Fully AC, Clean Dzire Sedan & Verified Professional Driver.`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const targetUrl = `https://wa.me/${FINDGO_CONFIG.whatsappNumber}?text=${encodedMessage}`;
        
        window.open(targetUrl, '_blank');
    });
}

function showError(errorId, inputElement) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.classList.add('active');
    if (inputElement) {
        inputElement.classList.add('input-error');
        inputElement.focus();
    }
}

// Mobile Hamburger Menu Toggle & Accessibility
function setupMobileMenu() {
    const hamburger = document.getElementById('mobileHamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        const toggleMenu = (open) => {
            const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('show');
            navMenu.classList.toggle('show', shouldOpen);
            hamburger.classList.toggle('is-active', shouldOpen);
            hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        };

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu on nav link click or drawer action click
        document.querySelectorAll('.nav-link, .mobile-drawer-actions .btn').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('show') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                toggleMenu(false);
            }
        });
    }
}

// Header Compact Scroll Effect
function setupNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('compact');
        } else {
            navbar?.classList.remove('compact');
        }
    });
}

// Select route from Popular Routes cards and populate form
function selectRouteQuick(pickup, drop, distanceKm) {
    const pickupLocInput = document.getElementById('pickupLoc');
    const dropLocInput = document.getElementById('dropLoc');
    const kmInput = document.getElementById('kmDistance');

    if (pickupLocInput) pickupLocInput.value = pickup;
    if (dropLocInput) dropLocInput.value = drop;
    if (kmInput) kmInput.value = distanceKm;

    activeTripType = 'one-way';
    const typeButtons = document.querySelectorAll('#tripTypeTabs .type-btn');
    typeButtons.forEach(b => b.classList.remove('active'));
    const oneWayBtn = document.querySelector('#tripTypeTabs .type-btn[data-type="one-way"]');
    if (oneWayBtn) oneWayBtn.classList.add('active');

    calculateEstimatedFare();

    const bookSection = document.getElementById('book');
    if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to booking card from Fleet showcase
function scrollToBooking(tripType = 'one-way') {
    const typeBtn = document.querySelector(`#tripTypeTabs .type-btn[data-type="${tripType}"]`);
    if (typeBtn) typeBtn.click();

    const bookSection = document.getElementById('book');
    if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
    }
}
