// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initCursor();
    initTypewriter();
    initCanvasParticles();
    initThemeToggle();
    initProjectFilter();
    initScrollEffects();
    initAIPlayground();
    initEasterEgg();
    initContactForm();
});

/* ==========================================================================
   Custom Cursor Logic
   ========================================================================== */
function initCursor() {
    const dot = document.querySelector(".custom-cursor-dot");
    const outline = document.querySelector(".custom-cursor-outline");
    
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Smooth trailing effect for the outline circle (Lerp)
    function animateOutline() {
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Add hover states for interactive items
    const hoverElements = document.querySelectorAll("a, button, select, input, textarea, .profile-container, .playground-tab, .filter-btn");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
}

/* ==========================================================================
   Typewriter Effect
   ========================================================================== */
function initTypewriter() {
    const typedTextSpan = document.querySelector("header h3 span.typed-text");
    if (!typedTextSpan) return;

    const textArray = [
        "AI & ML Enthusiast", 
        "Aspiring Software Developer", 
        "Problem Solver",
        "Future Tech Innovator"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000; // Delay between texts
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start typewriter
    setTimeout(type, 1000);
}

/* ==========================================================================
   Canvas Particles (Neural Network Background & Starburst Easter Egg)
   ========================================================================== */
let activeBurst = null; // Global hook for burst trigger

function initCanvasParticles() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let sparkles = [];
    const maxParticles = 80;
    const connectionDist = 120;
    let mouse = { x: null, y: null, radius: 150 };

    // Handle Resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse Tracking
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class (Constellation)
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
            this.colorType = Math.floor(Math.random() * 3); // 0 (Cyan), 1 (Pink), 2 (Violet)
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse Repulsion effect
            if (mouse.x !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            if (isLight) {
                const colors = ["rgba(109, 40, 217, 0.45)", "rgba(219, 39, 119, 0.45)", "rgba(8, 145, 178, 0.45)"];
                ctx.fillStyle = colors[this.colorType];
            } else {
                const colors = ["rgba(6, 182, 212, 0.55)", "rgba(236, 72, 153, 0.55)", "rgba(139, 92, 246, 0.55)"];
                ctx.fillStyle = colors[this.colorType];
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Sparkle Class (Easter Egg Burst)
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - Math.random() * 2; // Upward bias
            this.size = Math.random() * 4 + 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.gravity = 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            // Draw a neat 4-point star
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Trigger starburst burst
    activeBurst = function(x, y) {
        for (let i = 0; i < 120; i++) {
            sparkles.push(new Sparkle(x, y));
        }
    };

    // Draw connection lines
    function drawConnections() {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    let opacity = (1 - (dist / connectionDist)) * 0.18;
                    let baseColor;
                    if (isLight) {
                        const lineColors = ["109, 40, 217, ", "219, 39, 119, ", "8, 145, 178, "];
                        baseColor = lineColors[particles[i].colorType];
                    } else {
                        const lineColors = ["6, 182, 212, ", "236, 72, 153, ", "139, 92, 246, "];
                        baseColor = lineColors[particles[i].colorType];
                    }
                    ctx.strokeStyle = "rgba(" + baseColor + opacity + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update & Draw Constellation particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();

        // Update & Draw Easter egg sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            if (sparkles[i].alpha <= 0) {
                sparkles.splice(i, 1);
            } else {
                sparkles[i].draw();
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   Theme Toggle (Dark/Light Mode)
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const themeIcon = toggleBtn ? toggleBtn.querySelector("i") : null;
    if (!toggleBtn || !themeIcon) return;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateToggleIcon(savedTheme);

    toggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        if (theme === "light") {
            themeIcon.className = "fa-solid fa-moon";
        } else {
            themeIcon.className = "fa-solid fa-sun";
        }
    }
}

/* ==========================================================================
   Project Filtering Logic
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove("active"));
            // Add active class to clicked button
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category").split(" ");
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });
}

/* ==========================================================================
   Scroll Effects (Reveal & Navbar Highlighting)
   ========================================================================== */
function initScrollEffects() {
    // 1. Reveal on scroll
    const reveals = document.querySelectorAll(".scroll-reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Unobserve once revealed to keep layout simple
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(rev => revealObserver.observe(rev));

    // 2. Active section link highlight
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll("nav .nav-links a");

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute("id") || "";
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    const href = link.getAttribute("href").substring(1);
                    if (href === activeId || (activeId === "" && href === "about")) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.4
    });

    sections.forEach(sec => scrollObserver.observe(sec));
}

/* ==========================================================================
   Interactive AI Playground Simulation Logic
   ========================================================================== */
function initAIPlayground() {
    const tabs = document.querySelectorAll(".playground-tab");
    const panes = document.querySelectorAll(".playground-pane");

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const targetPane = document.getElementById(tab.getAttribute("data-target"));
            if (targetPane) targetPane.classList.add("active");
        });
    });

    // Sub-Demo 1: AI Enquiry Chatbot
    const chatSelect = document.getElementById("chat-question-select");
    const chatSendBtn = document.getElementById("chat-send");
    const chatMessages = document.querySelector(".chat-messages");

    const responses = {
        "admission": "Admissions for B.Tech are open! You can secure a seat via state counseling or management quota. For specific cutoffs, feel free to visit the college website or contact the admissions department directly.",
        "courses": "We offer B.Tech programs in Computer Science (Artificial Intelligence & Machine Learning), CSE (Data Science), ECE, and IT. Nandini is specialized in B.Tech CSE (AI & ML)!",
        "fees": "The annual tuition fee is approximately ₹1,20,000. Scholarships are available based on entrance rank and academic scores. Let me know if you want scholarship details!",
        "nandini": "Jally Nandini is an AI/ML B.Tech student with an 8.5 CGPA! She is highly skilled in Python, Java, Machine Learning, Web Development, and SQL, and has built several real-world tech solutions."
    };

    if (chatSendBtn && chatSelect && chatMessages) {
        chatSendBtn.addEventListener("click", () => {
            const selectValue = chatSelect.value;
            if (!selectValue) return;

            const selectedText = chatSelect.options[chatSelect.selectedIndex].text;

            // 1. Add User Message
            addChatMessage(selectedText, "user");
            chatSelect.value = ""; // Clear selection

            // 2. Add Simulated Bot Typing State
            const typingId = "bot-typing-" + Date.now();
            addChatMessage("<span class='typing-dot'></span><span class='typing-dot'></span><span class='typing-dot'></span>", "bot", typingId);

            // 3. Bot Reply delay
            setTimeout(() => {
                const typingBubble = document.getElementById(typingId);
                if (typingBubble) {
                    typingBubble.innerHTML = responses[selectValue] || "Interesting question! Let me check that for you.";
                }
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1200);
        });
    }

    function addChatMessage(htmlContent, sender, id = "") {
        const bubble = document.createElement("div");
        bubble.className = `chat-msg ${sender}`;
        if (id) bubble.id = id;
        bubble.innerHTML = htmlContent;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Sub-Demo 2: Crime Rate Predictor ML Simulator
    const startPredictBtn = document.getElementById("start-predict");
    const progressBar = document.querySelector(".progress-bar-container");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    const predictorOutput = document.querySelector(".predictor-output");
    
    if (startPredictBtn && progressBar && progressBarFill && predictorOutput) {
        startPredictBtn.addEventListener("click", () => {
            const area = document.getElementById("predict-area").value;
            const year = document.getElementById("predict-year").value;
            const type = document.getElementById("predict-type").value;

            // UI Reset & Loading Start
            startPredictBtn.disabled = true;
            predictorOutput.style.display = "none";
            progressBar.style.display = "block";
            progressBarFill.style.style = "0%";

            // Progress Stages
            const stages = [
                { progress: 15, text: "Loading historical dataset..." },
                { progress: 35, text: "Cleaning records & handling null values..." },
                { progress: 60, text: "Splitting data (80% train, 20% test)..." },
                { progress: 85, text: "Training Linear Regression model... (Accuracy: 92.4%)" },
                { progress: 100, text: "Synthesizing crime rate predictions..." }
            ];

            let stageIndex = 0;
            const stageTimer = setInterval(() => {
                if (stageIndex < stages.length) {
                    progressBarFill.style.width = `${stages[stageIndex].progress}%`;
                    startPredictBtn.textContent = stages[stageIndex].text;
                    stageIndex++;
                } else {
                    clearInterval(stageTimer);
                    // Compute mock results
                    setTimeout(() => {
                        progressBar.style.display = "none";
                        startPredictBtn.disabled = false;
                        startPredictBtn.textContent = "Train & Predict Trend";
                        
                        let trendPercent = (Math.random() * 15 - 5).toFixed(1); // -5% to +10%
                        let trendWord = trendPercent < 0 ? "Decrease" : "Increase";
                        let rank = trendPercent < 0 ? "High Safety Index" : "Moderate Risk Index";
                        
                        predictorOutput.innerHTML = `
                            <h4>Prediction Results for ${area} (${year})</h4>
                            <p>Predicted Trend for <b>${type}</b>: <span style="color: ${trendPercent < 0 ? '#10b981' : '#f43f5e'}">${trendPercent}% ${trendWord}</span></p>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">Model accuracy: R² = 92.4% | Rank: ${rank}</p>
                        `;
                        predictorOutput.style.display = "block";
                    }, 800);
                }
            }, 600);
        });
    }

    // Sub-Demo 3: Expense Tracker Visualizer
    const expNameInput = document.getElementById("exp-name");
    const expAmountInput = document.getElementById("exp-amount");
    const addExpenseBtn = document.getElementById("add-expense");
    const trackerList = document.querySelector(".tracker-list");
    const chartContainer = document.querySelector(".chart-container");
    const totalDisplay = document.querySelector(".chart-total");

    let expenses = [
        { id: 1, name: "Hosting", amount: 15 },
        { id: 2, name: "API Tools", amount: 35 },
        { id: 3, name: "Learning", amount: 50 }
    ];

    if (addExpenseBtn && expNameInput && expAmountInput && trackerList && chartContainer) {
        addExpenseBtn.addEventListener("click", () => {
            const name = expNameInput.value.trim();
            const amount = parseFloat(expAmountInput.value);

            if (!name || isNaN(amount) || amount <= 0) return;

            expenses.push({
                id: Date.now(),
                name: name,
                amount: amount
            });

            expNameInput.value = "";
            expAmountInput.value = "";
            renderTracker();
        });

        // Event delegation for deleting expenses
        trackerList.addEventListener("click", (e) => {
            if (e.target.closest(".delete-exp-btn")) {
                const id = parseInt(e.target.closest(".delete-exp-btn").getAttribute("data-id"));
                expenses = expenses.filter(exp => exp.id !== id);
                renderTracker();
            }
        });

        function renderTracker() {
            // 1. Render item list
            trackerList.innerHTML = "";
            let total = 0;
            expenses.forEach(exp => {
                total += exp.amount;
                const li = document.createElement("div");
                li.className = "tracker-item";
                li.innerHTML = `
                    <span>${exp.name}: <b>₹${exp.amount.toFixed(0)}</b></span>
                    <button class="delete-exp-btn" data-id="${exp.id}" title="Delete item"><i class="fa-solid fa-trash-can"></i></button>
                `;
                trackerList.appendChild(li);
            });

            totalDisplay.textContent = `Total Monthly Expense: ₹${total.toFixed(0)}`;

            // 2. Render chart bars
            chartContainer.innerHTML = "";
            if (expenses.length === 0) {
                chartContainer.innerHTML = "<p style='color: var(--text-secondary); margin-bottom: 50px;'>No expenses added</p>";
                return;
            }

            const maxAmount = Math.max(...expenses.map(e => e.amount));

            expenses.forEach(exp => {
                // Calculate percentage height
                const barHeight = maxAmount > 0 ? (exp.amount / maxAmount) * 110 : 0; // scale to fit 110px max height
                
                const barWrapper = document.createElement("div");
                barWrapper.className = "chart-bar-wrapper";
                barWrapper.innerHTML = `
                    <div class="chart-bar" style="height: ${barHeight}px;" title="₹${exp.amount.toFixed(0)}"></div>
                    <span class="chart-label">${exp.name}</span>
                `;
                chartContainer.appendChild(barWrapper);
            });
        }

        // Run Initial Expense Draw
        renderTracker();
    }
}

/* ==========================================================================
   Easter Egg Surprise Appreciator Modal
   ========================================================================= */
function initEasterEgg() {
    const profileContainer = document.querySelector(".profile-container");
    const modal = document.getElementById("surprise-modal");
    const closeBtn = document.getElementById("surprise-close");

    if (!profileContainer || !modal || !closeBtn) return;

    profileContainer.addEventListener("click", () => {
        // Find profile image center coordinates relative to viewport
        const rect = profileContainer.getBoundingClientRect();
        const burstX = rect.left + rect.width / 2;
        const burstY = rect.top + rect.height / 2;

        // Trigger particle canvas starburst
        if (typeof activeBurst === "function") {
            activeBurst(burstX, burstY);
        }

        // Open Appreciation Popup Modal after brief delay
        setTimeout(() => {
            modal.classList.add("active");
        }, 500);
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Close modal if clicked outside card container
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

/* ==========================================================================
   Contact Form redirection to WhatsApp
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById("email-form");
    const alertMsg = document.getElementById("form-alert-msg");

    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent standard submission

        const name = document.getElementById("form-name").value.trim();
        const email = document.getElementById("form-email").value.trim();
        const message = document.getElementById("form-message").value.trim();

        if (!name || !email || !message) return;

        // WhatsApp number
        const phoneNumber = "918978528671"; // Country code 91 (India)

        // Construct message
        const whatsappText = `Hello Nandini,\n\nSomeone submitted a message from your portfolio website:\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
        
        // Encode for URL
        const encodedText = encodeURIComponent(whatsappText);
        
        // Open WhatsApp link in a new window/tab
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        
        // Show success alert message
        if (alertMsg) {
            alertMsg.style.display = "block";
            alertMsg.textContent = "Thank you! Redirecting you to WhatsApp...";
            alertMsg.classList.add("show");
        }

        // Delay redirect slightly for visual confirmation
        setTimeout(() => {
            window.open(whatsappUrl, "_blank");
            contactForm.reset();
            if (alertMsg) {
                setTimeout(() => {
                    alertMsg.style.display = "none";
                    alertMsg.classList.remove("show");
                }, 4000);
            }
        }, 1000);
    });

    // Make sure dynamically added or modified links get mouse hover styles if needed
    const hoverElements = document.querySelectorAll(".floating-btn, .info-item a");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
}
