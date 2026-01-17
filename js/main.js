/* ============================================
   AKU JAGOAN DBD - MAIN JAVASCRIPT
   Educational Website for Children
   ============================================ */

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active link on scroll - IMPROVED
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Don't touch the CTA button
        if (link.classList.contains('nav-cta')) return;

        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ============================================
// PREVENTION 3M CHECKLIST
// ============================================
let checkedCount = 0;
const totalChecks = 3;
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

function toggleCheck(button) {
    const card = button.closest('.prevention-item');
    const isChecked = card.getAttribute('data-checked') === 'true';

    if (isChecked) {
        card.setAttribute('data-checked', 'false');
        checkedCount--;
    } else {
        card.setAttribute('data-checked', 'true');
        checkedCount++;

        // Add celebration animation
        createConfetti(button);
    }

    updateProgress();
}

function updateProgress() {
    const percentage = (checkedCount / totalChecks) * 100;
    progressFill.style.width = percentage + '%';

    if (checkedCount === 0) {
        progressText.textContent = 'Ayo centang kegiatan 3M yang sudah kamu lakukan!';
    } else if (checkedCount < totalChecks) {
        progressText.textContent = `Hebat! ${checkedCount} dari ${totalChecks} kegiatan sudah dilakukan. Ayo lengkapi!`;
    } else {
        progressText.textContent = '🎉 LUAR BIASA! Kamu sudah melakukan semua kegiatan 3M! Kamu Jagoan DBD! 🏆';
    }
}

// ============================================
// SPOTLIGHT TUTORIAL EFFECT
// ============================================
let spotlightShown = false;

function initSpotlightTutorial() {
    const preventionGrid = document.querySelector('.prevention-grid');
    const firstPreventionBtn = document.querySelector('.prevention-item .prevention-btn');

    if (!preventionGrid || !firstPreventionBtn) return;

    // Check if tutorial already shown in this session
    if (sessionStorage.getItem('spotlightShown')) return;

    const spotlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !spotlightShown) {
                spotlightShown = true;

                // Delay before showing spotlight
                setTimeout(() => {
                    showSpotlight(firstPreventionBtn);
                }, 500);

                spotlightObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px 0px 0px 0px'
    });

    spotlightObserver.observe(preventionGrid);
}

function showSpotlight(targetBtn) {
    const targetCard = targetBtn.closest('.prevention-item');
    if (!targetCard) return;

    // First scroll the card into center view
    targetCard.scrollIntoView({ behavior: 'instant', block: 'center' });

    // Add pulse effect to button
    targetBtn.classList.add('pulse-effect');

    // Small delay to ensure scroll is complete before calculating positions
    setTimeout(() => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'spotlight-overlay';
        overlay.id = 'spotlightOverlay';

        // Get positions AFTER scroll
        const cardRect = targetCard.getBoundingClientRect();
        const btnRect = targetBtn.getBoundingClientRect();
        const padding = 10;

        // Create highlight element (around the CARD)
        const highlight = document.createElement('div');
        highlight.className = 'spotlight-highlight entering';
        highlight.style.cssText = `
            top: ${cardRect.top - padding}px;
            left: ${cardRect.left - padding}px;
            width: ${cardRect.width + padding * 2}px;
            height: ${cardRect.height + padding * 2}px;
            border-radius: 24px; 
        `;

        // Create pointing hand - position pointing at the BUTTON
        const pointer = document.createElement('div');
        pointer.className = 'spotlight-pointer';
        // HTML content will be handled by CSS ::after or background image for better quality
        // or we can use an SVG here directly
        pointer.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" class="hand-cursor-svg">
                <path d="M7 19.3333L2.33333 3L22 10.6667L12.6667 12.6667L7 19.3333Z" fill="#FFC107" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        `;

        pointer.style.cssText = `
            top: ${btnRect.top + btnRect.height / 2}px;
            left: ${btnRect.left + btnRect.width / 2}px;
        `;

        // Create tooltip - position above the CARD (or button if preferred)
        // Let's position it above the CARD to avoid cluttering the button area
        const tooltip = document.createElement('div');
        tooltip.className = 'spotlight-tooltip';
        tooltip.innerHTML = '✨ <strong>Mulai dari sini!</strong><br>Klik tombol ini jika sudah selesai menguras!';

        // Position tooltip relative to card top
        tooltip.style.cssText = `
            top: ${cardRect.top - 100}px;
            left: ${cardRect.left + cardRect.width / 2}px;
            transform: translateX(-50%);
        `;

        // Create skip button
        const skipBtn = document.createElement('button');
        skipBtn.className = 'spotlight-skip';
        skipBtn.innerHTML = '✕ Mengerti, Lewati';
        skipBtn.style.pointerEvents = 'auto'; // Force enablement
        skipBtn.style.zIndex = '10005'; // Force highest z-index

        skipBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent bubbling
            hideSpotlight();
        };

        // Append elements
        document.body.appendChild(overlay);
        document.body.appendChild(highlight);
        document.body.appendChild(pointer);
        document.body.appendChild(tooltip);
        document.body.appendChild(skipBtn);

        // Activate overlay
        setTimeout(() => {
            overlay.classList.add('active');
        }, 50);

        // Click handlers - DON'T add onclick to overlay, it blocks skipBtn
        // Only allow clicking the highlighted card area or the skip button
        highlight.onclick = hideSpotlight;
        // Remove overlay.onclick - it was intercepting all clicks!
        overlay.style.pointerEvents = 'none'; // Let clicks pass through to skipBtn
        targetBtn.addEventListener('click', hideSpotlight, { once: true });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }, 100);
}

function hideSpotlight() {
    const overlay = document.getElementById('spotlightOverlay');
    const highlight = document.querySelector('.spotlight-highlight');
    const pointer = document.querySelector('.spotlight-pointer');
    const tooltip = document.querySelector('.spotlight-tooltip');
    const skipBtn = document.querySelector('.spotlight-skip');

    // Remove pulse effect from button
    const pulsedBtn = document.querySelector('.pulse-effect');
    if (pulsedBtn) pulsedBtn.classList.remove('pulse-effect');

    // Remove all spotlight elements from DOM
    if (overlay) overlay.remove();
    if (highlight) highlight.remove();
    if (pointer) pointer.remove();
    if (tooltip) tooltip.remove();
    if (skipBtn) skipBtn.remove();

    // Restore body scroll
    document.body.style.overflow = '';

    // Mark as shown in session storage
    sessionStorage.setItem('spotlightShown', 'true');
}

function createConfetti(element) {
    const colors = ['#f43f5e', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];

    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;

        const rect = element.getBoundingClientRect();
        confetti.style.left = rect.left + rect.width / 2 + 'px';
        confetti.style.top = rect.top + 'px';

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 10;

        let x = rect.left + rect.width / 2;
        let y = rect.top;
        let opacity = 1;

        function animateConfetti() {
            x += vx;
            y += vy + 2; // gravity
            opacity -= 0.02;

            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        }

        requestAnimationFrame(animateConfetti);
    }
}

// ============================================
// STORY SLIDESHOW
// ============================================
let currentSlide = 1;
const totalSlides = 5;
const storySlides = document.querySelectorAll('.story-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideDisplay = document.getElementById('currentSlide');

function changeSlide(direction) {
    const newSlide = currentSlide + direction;

    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

function goToSlide(slideNum) {
    // Hide current slide
    storySlides[currentSlide - 1].classList.remove('active');
    dots[currentSlide - 1].classList.remove('active');

    // Show new slide
    currentSlide = slideNum;
    storySlides[currentSlide - 1].classList.add('active');
    dots[currentSlide - 1].classList.add('active');

    // Update display
    currentSlideDisplay.textContent = currentSlide;

    // Update button states
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// ============================================
// QUIZ MODAL SYSTEM
// ============================================
const quizQuestions = [
    {
        question: "Apa nama penyakit yang disebabkan oleh nyamuk Aedes Aegypti?",
        options: ["Malaria", "Demam Berdarah Dengue (DBD)", "Flu", "Cacar"],
        correct: 1,
        explanation: "Benar! Nyamuk Aedes Aegypti adalah pembawa virus Dengue yang menyebabkan DBD."
    },
    {
        question: "Kapan nyamuk Aedes Aegypti paling aktif menggigit?",
        options: ["Malam hari", "Pagi dan sore hari", "Tengah malam", "Siang hari saja"],
        correct: 1,
        explanation: "Tepat! Nyamuk DBD paling aktif di pagi hari (jam 8-10) dan sore hari (jam 4-6)."
    },
    {
        question: "Apa ciri khas nyamuk Aedes Aegypti?",
        options: ["Berwarna hitam polos", "Memiliki garis-garis putih di badannya", "Berukuran sangat besar", "Tidak bisa terbang"],
        correct: 1,
        explanation: "Benar! Nyamuk Aedes Aegypti punya garis-garis putih di badannya seperti zebra."
    },
    {
        question: "Apa kepanjangan dari 3M dalam pencegahan DBD?",
        options: ["Makan, Minum, Mandi", "Menguras, Menutup, Mendaur ulang", "Main, Menari, Menyanyi", "Mencuci, Menyapu, Mengepel"],
        correct: 1,
        explanation: "Benar! 3M adalah Menguras, Menutup, dan Mendaur ulang barang bekas."
    },
    {
        question: "Di mana nyamuk Aedes Aegypti biasa bertelur?",
        options: ["Di air kotor", "Di tempat genangan air bersih", "Di tanah kering", "Di dalam lemari"],
        correct: 1,
        explanation: "Tepat! Nyamuk Aedes Aegypti suka bertelur di genangan air bersih seperti bak mandi, vas bunga, dll."
    },
    {
        question: "Gejala utama DBD adalah demam tinggi. Berapa suhu tubuh yang dianggap demam?",
        options: ["35°C", "36°C", "38-40°C", "34°C"],
        correct: 2,
        explanation: "Benar! Demam tinggi pada DBD biasanya mencapai 38-40°C."
    },
    {
        question: "Apa yang harus dilakukan minimal seminggu sekali untuk mencegah jentik nyamuk?",
        options: ["Menambah air di bak mandi", "Menguras tempat penampungan air", "Membiarkan air menggenang", "Menutup jendela"],
        correct: 1,
        explanation: "Benar! Menguras bak mandi dan tempat penampungan air minimal seminggu sekali bisa mencegah jentik berkembang."
    },
    {
        question: "Selain 3M, apa yang bisa dilakukan untuk mencegah gigitan nyamuk? (3M Plus)",
        options: ["Makan banyak", "Memakai obat anti nyamuk", "Tidak mandi", "Tidur siang"],
        correct: 1,
        explanation: "Benar! Memakai obat anti nyamuk adalah salah satu kegiatan 3M Plus untuk mencegah gigitan."
    },
    {
        question: "Kapan harus segera ke rumah sakit jika terkena DBD?",
        options: ["Saat baru demam 1 jam", "Jika demam lebih dari 2 hari disertai muntah terus-menerus", "Saat sudah sembuh", "Tidak perlu ke rumah sakit"],
        correct: 1,
        explanation: "Tepat! Segera ke rumah sakit jika demam tinggi lebih dari 2 hari, apalagi jika disertai muntah, mimisan, atau nyeri perut hebat."
    },
    {
        question: "Kenapa kita harus mendaur ulang barang bekas?",
        options: ["Supaya rumah bersih saja", "Agar barang bekas tidak menampung air hujan dan jadi sarang nyamuk", "Tidak ada alasan khusus", "Supaya dapat uang"],
        correct: 1,
        explanation: "Benar! Barang bekas seperti kaleng, botol, dan ban bisa menampung air hujan dan menjadi tempat nyamuk bertelur."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let questionResults = []; // Track correct/wrong for each question

// Modal elements
const quizModalOverlay = document.getElementById('quizModalOverlay');
const quizModalBody = document.getElementById('quizModalBody');

// Open Quiz Modal
function openQuizModal() {
    quizModalOverlay.classList.add('active');
    document.body.classList.add('quiz-modal-open');
    showQuizStartScreen();
}

// Close Quiz Modal
function closeQuizModal() {
    quizModalOverlay.classList.remove('active');
    document.body.classList.remove('quiz-modal-open');
}

// Close modal on overlay click
quizModalOverlay.addEventListener('click', (e) => {
    if (e.target === quizModalOverlay) {
        closeQuizModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quizModalOverlay.classList.contains('active')) {
        closeQuizModal();
    }
});

// Show Quiz Start Screen
function showQuizStartScreen() {
    quizModalBody.innerHTML = `
        <div class="quiz-start-modal">
            <img src="assets/mascot-dbd.png" alt="Mascot Quiz Master" class="quiz-mascot" style="animation: mascotFloat 3s ease-in-out infinite;">
            <div class="mascot-speech quiz-speech" style="margin-bottom: 1.5rem;">
                <p>🎮 Waktunya uji pengetahuanmu!</p>
                <p>Siap jadi <strong>Jagoan DBD</strong>?</p>
            </div>
            <h3>Siap Menjadi Jagoan?</h3>
            <p>Jawab 10 pertanyaan tentang DBD dan kumpulkan bintang untuk mendapatkan badge Jagoan DBD!</p>
            <div class="quiz-rules-modal">
                <div class="rule-item">
                    <span>✓</span> <span>10 pertanyaan pilihan ganda</span>
                </div>
                <div class="rule-item">
                    <span>⭐</span> <span>Setiap jawaban benar = 1 bintang</span>
                </div>
                <div class="rule-item">
                    <span>🏆</span> <span>8+ bintang = Badge Jagoan DBD</span>
                </div>
            </div>
            <button class="btn btn-primary btn-large" onclick="startQuizModal()">
                Mulai Quiz! 🚀
            </button>
        </div>
    `;
}

// Start Quiz in Modal
function startQuizModal() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    questionResults = [];
    loadQuestionModal();
}

// Generate Stepper HTML
function generateStepper() {
    let stepperHTML = '<div class="quiz-stepper">';
    for (let i = 0; i < quizQuestions.length; i++) {
        let stepClass = 'quiz-step';
        if (i < currentQuestion) {
            stepClass += questionResults[i] ? ' completed' : ' wrong';
        } else if (i === currentQuestion) {
            stepClass += ' active';
        }
        stepperHTML += `<div class="${stepClass}">${i + 1}</div>`;
        if (i < quizQuestions.length - 1) {
            let lineClass = 'quiz-step-line';
            if (i < currentQuestion) {
                lineClass += questionResults[i] ? ' completed' : '';
            }
            stepperHTML += `<div class="${lineClass}"></div>`;
        }
    }
    stepperHTML += '</div>';
    return stepperHTML;
}

// Load Question in Modal
function loadQuestionModal() {
    answered = false;
    const question = quizQuestions[currentQuestion];

    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <button class="quiz-option-modal" onclick="selectAnswerModal(${index})">
                <span>${option}</span>
            </button>
        `;
    });

    quizModalBody.innerHTML = `
        ${generateStepper()}
        <div class="quiz-question-card">
            <div class="quiz-question-number">Pertanyaan ${currentQuestion + 1} dari 10</div>
            <div class="quiz-question-text">${question.question}</div>
        </div>
        <div class="quiz-options-modal" id="quizOptionsModal">
            ${optionsHTML}
        </div>
        <div id="quizFeedbackModal" style="display: none;"></div>
        <div class="quiz-modal-footer" id="quizModalFooter" style="display: none;">
            <button class="btn btn-primary" id="nextQuestionModalBtn" onclick="nextQuestionModal()">
                ${currentQuestion < quizQuestions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil! 🏆'}
            </button>
        </div>
    `;
}

// Select Answer in Modal
function selectAnswerModal(selectedIndex) {
    if (answered) return;
    answered = true;

    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option-modal');
    const feedbackEl = document.getElementById('quizFeedbackModal');
    const footerEl = document.getElementById('quizModalFooter');

    // Disable all options
    options.forEach(option => option.disabled = true);

    // Mark correct and incorrect
    options[question.correct].classList.add('correct');

    const isCorrect = selectedIndex === question.correct;
    questionResults.push(isCorrect);

    if (isCorrect) {
        score++;
        feedbackEl.innerHTML = `
            <div class="quiz-feedback-modal correct">
                <div class="feedback-icon">🎉</div>
                <div class="feedback-title">Benar!</div>
                <div class="feedback-text">${question.explanation}</div>
            </div>
        `;

        // Celebration effect
        createQuizConfetti();
    } else {
        options[selectedIndex].classList.add('incorrect');
        feedbackEl.innerHTML = `
            <div class="quiz-feedback-modal incorrect">
                <div class="feedback-icon">😅</div>
                <div class="feedback-title">Belum tepat!</div>
                <div class="feedback-text">${question.explanation}</div>
            </div>
        `;
    }

    feedbackEl.style.display = 'block';
    footerEl.style.display = 'flex';

    // Auto-scroll to feedback so user sees explanation and next button
    setTimeout(() => {
        feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Update stepper
    updateStepper();
}

// Update Stepper
function updateStepper() {
    const stepperContainer = document.querySelector('.quiz-stepper');
    if (stepperContainer) {
        stepperContainer.outerHTML = generateStepper();
    }
}

// Next Question in Modal
function nextQuestionModal() {
    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        loadQuestionModal();
    } else {
        showResultModal();
    }
}

// Show Result in Modal
function showResultModal() {
    // Generate stars
    let stars = '';
    for (let i = 0; i < score; i++) {
        stars += '⭐';
    }
    for (let i = score; i < 10; i++) {
        stars += '☆';
    }

    // Determine badge and messages
    let badge, title, message, speechText;

    if (score >= 8) {
        badge = '🏆';
        title = 'LUAR BIASA!';
        message = 'Kamu adalah JAGOAN DBD sejati! Pengetahuanmu tentang DBD sangat hebat!';
        speechText = '🎉 WOW! Kamu luar biasa! Sekarang kamu resmi jadi <strong>Jagoan DBD</strong>!';
    } else if (score >= 6) {
        badge = '🌟';
        title = 'Bagus Sekali!';
        message = 'Kamu sudah cukup paham tentang DBD. Terus belajar ya!';
        speechText = '👍 Bagus! Kamu sudah paham tentang DBD. Sedikit lagi jadi <strong>Jagoan</strong>!';
    } else if (score >= 4) {
        badge = '💪';
        title = 'Semangat!';
        message = 'Yuk baca lagi materi tentang DBD dan coba quiz lagi!';
        speechText = '💪 Semangat! Yuk baca lagi materinya dan coba lagi ya!';
    } else {
        badge = '📚';
        title = 'Ayo Belajar Lagi!';
        message = 'Jangan menyerah! Baca materinya dan coba quiz sekali lagi!';
        speechText = '📖 Jangan menyerah! Aku yakin kamu bisa! Belajar lagi yuk!';
    }

    quizModalBody.innerHTML = `
        <div class="quiz-result-modal">
            <img src="assets/mascot-dbd.png" alt="Mascot" class="result-mascot-modal">
            <div class="result-speech-modal">
                <p style="font-weight: 600; color: var(--neutral-700); margin: 0;">${speechText}</p>
            </div>
            <div class="result-badge-modal">${badge}</div>
            <h3 class="result-title-modal">${title}</h3>
            <p class="result-message-modal">${message}</p>
            <div class="result-score-modal">
                <span class="result-stars-modal">${stars}</span>
                <span class="result-score-text-modal">${score}/10 Bintang</span>
            </div>
            <div class="result-actions-modal">
                <button class="btn btn-primary" onclick="restartQuizModal()">
                    🔄 Main Lagi
                </button>
                <button class="btn btn-secondary" onclick="shareResultModal()">
                    📤 Bagikan
                </button>
                <button class="btn btn-secondary" onclick="closeQuizModal()">
                    ✕ Tutup
                </button>
            </div>
        </div>
    `;

    // Big celebration for good scores
    if (score >= 8) {
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(createQuizConfetti, i * 300);
            }
        }, 500);
    }

    // Save best score to localStorage
    const bestScore = localStorage.getItem('dbdQuizBestScore') || 0;
    if (score > bestScore) {
        localStorage.setItem('dbdQuizBestScore', score);
    }
}

// Restart Quiz in Modal
function restartQuizModal() {
    showQuizStartScreen();
}

// Share Result to WhatsApp
function shareResultModal() {
    // Pesan motivasi berdasarkan jumlah bintang
    let motivasi = '';

    if (score >= 9) {
        // 9-10 bintang - Sempurna!
        motivasi = 'SEMPURNA! Aku adalah Jagoan DBD sejati! Pengetahuanku tentang pencegahan DBD sangat luar biasa! Terus jaga kesehatan dan lindungi keluarga dari nyamuk jahat!';
    } else if (score === 8) {
        // 8 bintang - Luar Biasa!
        motivasi = 'LUAR BIASA! Sedikit lagi sempurna! Aku sudah sangat paham tentang DBD dan siap jadi pelindung keluarga! Terus semangat belajar ya!';
    } else if (score >= 6) {
        // 6-7 bintang - Bagus!
        motivasi = 'BAGUS SEKALI! Aku sudah cukup paham tentang DBD. Terus belajar dan praktekkan 3M Plus di rumah! Pasti bisa jadi Jagoan DBD!';
    } else if (score >= 4) {
        // 4-5 bintang - Semangat!
        motivasi = 'SEMANGAT! Setiap langkah adalah kemajuan! Yuk baca lagi materi tentang DBD dan coba quiz lagi. Aku yakin bisa lebih baik!';
    } else {
        // 0-3 bintang - Jangan Menyerah!
        motivasi = 'JANGAN MENYERAH! Belajar itu proses. Yuk pelajari lagi tentang DBD dan coba quiz sekali lagi. Setiap orang bisa jadi Jagoan DBD!';
    }

    // Buat bintang dengan karakter Unicode sederhana
    let starsDisplay = '';
    for (let i = 0; i < score; i++) {
        starsDisplay += '★';  // Black star (U+2605)
    }
    for (let i = score; i < 10; i++) {
        starsDisplay += '☆';  // White star (U+2606)
    }

    // Buat pesan untuk WhatsApp
    const websiteUrl = 'https://riskiputraalamzah.github.io/dbd/';
    const text = `*AKU JAGOAN DBD!*

Yeay! Aku berhasil menyelesaikan Quiz Aku Jagoan DBD!

*Hasil Quiz:* ${score}/10 Bintang
${starsDisplay}

${motivasi}

Yuk main juga dan uji pengetahuanmu tentang Demam Berdarah!
${websiteUrl}

#AkuJagoanDBD #CegahDBD #3MPlus`;

    // Encode text untuk URL WhatsApp
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Create Quiz Confetti
function createQuizConfetti() {
    const colors = ['#f43f5e', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];
    const modal = document.getElementById('quizModal');
    const rect = modal.getBoundingClientRect();

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const isCircle = Math.random() > 0.5;

        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${isCircle ? '50%' : '2px'};
            pointer-events: none;
            z-index: 10001;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + 100}px;
        `;

        document.body.appendChild(confetti);

        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = 10 + Math.random() * 15;
        let vx = Math.sin(angle) * velocity;
        let vy = -Math.random() * velocity - 5;
        let x = rect.left + rect.width / 2;
        let y = rect.top + 100;
        let rotation = 0;
        let opacity = 1;

        function animate() {
            x += vx;
            y += vy;
            vy += 0.5; // gravity
            rotation += 5;
            opacity -= 0.015;

            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.transform = `rotate(${rotation}deg)`;
            confetti.style.opacity = opacity;

            if (opacity > 0 && y < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        }

        setTimeout(() => requestAnimationFrame(animate), i * 20);
    }
}

// ============================================
// ORIGINAL QUIZ (Keep for backward compatibility)
// ============================================
const quizStart = document.getElementById('quizStart');
const quizGame = document.getElementById('quizGame');
const quizResult = document.getElementById('quizResult');

// Start Quiz - Now opens modal
function startQuiz() {
    openQuizModal();
}

// Redirect old functions to modal versions
function restartQuiz() {
    restartQuizModal();
}

function shareResult() {
    shareResultModal();
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Special handler for quiz link - open modal directly
document.querySelectorAll('a[href="#quiz"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // First scroll to quiz section, then open modal
        const quizSection = document.getElementById('quiz');
        if (quizSection) {
            const headerOffset = 80;
            const elementPosition = quizSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all glass cards for animation
document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// VIDEO CARD CLICK HANDLER (Placeholder)
// ============================================
document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
        alert('🎬 Video akan segera tersedia!\n\nUntuk sementara, yuk belajar melalui materi bacaan dan quiz interaktif!');
    });
});

// ============================================
// TYPING EFFECT FOR MASCOT GUIDE
// ============================================
function initTypingEffect() {
    const guideSpeechElements = document.querySelectorAll('.guide-speech p');

    guideSpeechElements.forEach(speechEl => {
        // Store original HTML content
        const originalHTML = speechEl.innerHTML;
        speechEl.setAttribute('data-original', originalHTML);
        speechEl.classList.add('typing-ready');

        // Clear the text initially - show empty until typing starts
        speechEl.innerHTML = '';
    });

    // Create Intersection Observer for typing effect
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const speechEl = entry.target;

                // Only trigger if not already typed
                if (speechEl.classList.contains('typing-ready') && !speechEl.classList.contains('typing-done')) {
                    speechEl.classList.remove('typing-ready');
                    speechEl.classList.add('typing-active');

                    // Start typing effect
                    startTypingAnimation(speechEl);

                    // Unobserve after triggering
                    typingObserver.unobserve(speechEl);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all speech elements
    guideSpeechElements.forEach(speechEl => {
        typingObserver.observe(speechEl);
    });
}

function startTypingAnimation(element) {
    const originalHTML = element.getAttribute('data-original');

    // Parse HTML to extract text and HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;

    // Get the full text content
    const fullText = tempDiv.textContent || tempDiv.innerText;

    // Clear the element and add cursor
    element.innerHTML = '<span class="typing-cursor">|</span>';

    let charIndex = 0;
    let currentHTML = '';
    let htmlIndex = 0;
    let insideTag = false;
    let tagBuffer = '';

    const typingSpeed = 30; // milliseconds per character

    function typeNextChar() {
        if (htmlIndex < originalHTML.length) {
            const char = originalHTML[htmlIndex];

            if (char === '<') {
                // Start of HTML tag
                insideTag = true;
                tagBuffer = char;
                htmlIndex++;
                typeNextChar();
                return;
            } else if (char === '>') {
                // End of HTML tag
                insideTag = false;
                tagBuffer += char;
                currentHTML += tagBuffer;
                tagBuffer = '';
                htmlIndex++;
                typeNextChar();
                return;
            } else if (insideTag) {
                // Inside HTML tag, add to buffer
                tagBuffer += char;
                htmlIndex++;
                typeNextChar();
                return;
            } else {
                // Regular character
                currentHTML += char;
                htmlIndex++;
                element.innerHTML = currentHTML + '<span class="typing-cursor">|</span>';

                // Continue typing
                if (htmlIndex < originalHTML.length) {
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    // Typing complete
                    finishTyping();
                }
            }
        } else {
            finishTyping();
        }
    }

    function finishTyping() {
        // Remove cursor after a delay
        setTimeout(() => {
            element.innerHTML = originalHTML;
            element.classList.remove('typing-active');
            element.classList.add('typing-done');
        }, 500);
    }

    // Start with a small delay
    setTimeout(typeNextChar, 300);
}

// Add typing cursor styles dynamically
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .typing-cursor {
        display: inline;
        animation: cursorBlink 0.7s infinite;
        font-weight: normal;
        color: var(--primary-500);
    }
    
    @keyframes cursorBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .typing-ready {
        visibility: visible;
    }
    
    .typing-active {
        min-height: 1.6em;
    }
    
    .typing-done {
        visibility: visible;
    }
`;
document.head.appendChild(typingStyles);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial progress state
    updateProgress();

    // Set initial story slide state
    prevBtn.disabled = true;

    // Set initial active nav link
    updateActiveNavLink();

    // Initialize typing effect for mascot guide
    initTypingEffect();

    // Initialize spotlight tutorial for prevention section
    initSpotlightTutorial();

    console.log('🦸 Aku Jagoan DBD - Website loaded successfully!');
});
