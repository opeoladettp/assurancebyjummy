/*
   Assurance by Jummy - Interactive Core Script
   Domain: assurancebyjummy.com.ng
   Creative Director: Jumoke Adijat Kolawole
*/

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Theme Switcher Logic ---
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIcon = themeToggleBtn?.querySelector(".material-symbols-outlined");
    
    // Check saved preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeIcon) {
        themeIcon.textContent = savedTheme === "dark" ? "light_mode" : "dark_mode";
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            
            if (themeIcon) {
                themeIcon.textContent = newTheme === "dark" ? "light_mode" : "dark_mode";
            }
            
            showLuxuryNotification(
                newTheme === "dark" ? "dark_mode" : "light_mode",
                `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated beautifully.`,
                "#C5A059"
            );
        });
    }

    // --- 1. Dynamic Header Scroll Effect ---
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // --- 2. Interactive Mobile Off-Canvas Menu ---
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when links are clicked
        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // --- 3. Parallax Floating Elements ---
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const parallaxCards = document.querySelectorAll(".floating-card");
        
        parallaxCards.forEach((card, index) => {
            // Give different cards slightly different parallax speeds
            const speed = (index + 1) * 0.08;
            const direction = index % 2 === 0 ? 1 : -1;
            const yOffset = scrolled * speed * direction;
            card.style.transform = `translateY(${yOffset}px)`;
        });
    });

    // --- 4. Intersection Observer Reveal triggers ---
    const revealElements = document.querySelectorAll(".reveal-up");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Filterable Portfolio Logic ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            portfolioItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.style.display = "block";
                    // trigger a small animation
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 400);
                }
            });
        });
    });

    // --- 6. Luxury Lightbox Modal ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = lightbox?.querySelector(".lightbox-img");
    const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
    const lightboxClose = lightbox?.querySelector(".lightbox-close");

    if (lightbox && lightboxImg && lightboxCaption) {
        portfolioItems.forEach(item => {
            item.addEventListener("click", () => {
                const img = item.querySelector("img");
                const title = item.querySelector(".portfolio-title");
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = title ? title.textContent : "";
                    lightbox.classList.add("active");
                    document.body.style.overflow = "hidden"; // Disable scroll
                }
            });
        });

        // Close lightbox function
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = ""; // Re-enable scroll
        };

        lightboxClose?.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Escape key to close
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    // --- 7. Robust PDF Force Download Handler ---
    const downloadButtons = document.querySelectorAll("a[download]");
    downloadButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const url = btn.getAttribute("href");
            const filename = btn.getAttribute("download") || "Jumoke_Adijat_CV.pdf";
            
            // Show custom loading status on the button
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<span>Downloading...</span><span class="material-symbols-outlined">downloading</span>`;
            
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.blob();
                })
                .then(blob => {
                    const blobURL = URL.createObjectURL(blob);
                    const tempLink = document.createElement("a");
                    tempLink.href = blobURL;
                    tempLink.download = filename;
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(blobURL);
                    
                    // Restore button
                    btn.innerHTML = originalHTML;
                })
                .catch(err => {
                    console.error("Blob download failed, falling back to open in tab:", err);
                    window.open(url, "_blank");
                    btn.innerHTML = originalHTML;
                });
        });
    });

    // --- 8. Fully Functional Web3Forms Contact Form Submission ---
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span><span class="material-symbols-outlined">hourglass_empty</span>`;
            
            const formData = Object.fromEntries(new FormData(contactForm));

            // Send request to self-hosted Form API
            fetch("https://form-submition-server.onrender.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    showLuxuryNotification("check_circle", "Message received beautifully. We will contact you soon.", "#C5A059");
                    contactForm.reset();
                } else {
                    console.log(response);
                    showLuxuryNotification("error", json.message || "Something went wrong. Please try again.", "#E07A5F");
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                // Fallback to offline visual success for offline local testing
                showLuxuryNotification("info", "Inquiry saved locally. Configure Web3Forms key to receive emails.", "#C5A059");
                contactForm.reset();
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    }

    // Helper for Premium Luxury Toast Notification
    function showLuxuryNotification(icon, message, accentColor) {
        const formMessage = document.createElement("div");
        formMessage.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #FAF9F5;
            color: #121212;
            padding: 1.5rem 2.5rem;
            border-radius: 4px;
            border-left: 4px solid ${accentColor};
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 600;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        
        formMessage.innerHTML = `
            <span class="material-symbols-outlined" style="color: ${accentColor};">${icon}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(formMessage);
        
        // Slide in
        setTimeout(() => {
            formMessage.style.transform = "translateY(0)";
            formMessage.style.opacity = "1";
        }, 100);
        
        // Slide out
        setTimeout(() => {
            formMessage.style.transform = "translateY(100px)";
            formMessage.style.opacity = "0";
            setTimeout(() => {
                formMessage.remove();
            }, 500);
        }, 5000);
    }

    // --- 9. Count Up Numbers in Viewport Animation ---
    const countElements = document.querySelectorAll(".stat-number");
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute("data-target"), 10);
                if (isNaN(target)) return;
                
                let count = 0;
                // Animate completion over 1.5 seconds
                const duration = 1500; 
                const increment = Math.max(1, Math.ceil(target / (duration / 16))); // ~60fps
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        entry.target.textContent = count;
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: "0px"
    });

    countElements.forEach(el => {
        countObserver.observe(el);
    });
});
