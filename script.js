// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.portfolio-item, .about-text, .about-image, .contact-info, .contact-form, .service-card, .testimonial');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animated elements
document.querySelectorAll('.portfolio-item, .about-text, .about-image, .contact-info, .contact-form, .service-card, .testimonial').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Trigger animation on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or respect OS preference
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Lightbox for Portfolio Items
const portfolioGrid = document.querySelector('.portfolio-grid');
let currentLightboxItem = null;

portfolioGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.portfolio-item');
    if (item) {
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('p').textContent;
        
        // Create lightbox if it doesn't exist
        if (!document.querySelector('.lightbox')) {
            createLightbox(imgSrc, title, category);
        } else {
            // Update existing lightbox
            updateLightbox(imgSrc, title, category);
        }
        
        // Show lightbox
        document.querySelector('.lightbox').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
});

function createLightbox(imgSrc, title, category) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: 2rem;
    `;
    
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${imgSrc}" alt="${title}">
            <div class="lightbox-caption">
                <h3>${title}</h3>
                <p>${category}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add event listener for close button
    const closeBtn = lightbox.querySelector('.close-lightbox');
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function updateLightbox(imgSrc, title, category) {
    const lightboxContent = document.querySelector('.lightbox-content');
    const img = lightboxContent.querySelector('img');
    const caption = lightboxContent.querySelector('.lightbox-caption');
    
    img.src = imgSrc;
    caption.querySelector('h3').textContent = title;
    caption.querySelector('p').textContent = category;
}

// Testimonial Slider
class TestimonialSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.testimonials = document.querySelectorAll('.testimonial');
        this.currentIndex = 0;
        this.totalTestimonials = this.testimonials.length;
        this.interval = null;
        
        if (this.totalTestimonials > 1) {
            this.initSlider();
            this.startAutoSlide();
        }
    }
    
    initSlider() {
        // Hide all testimonials except the first one
        this.testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Add navigation controls
        this.addNavigationControls();
    }
    
    addNavigationControls() {
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'slider-nav';
        navContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        `;
        
        // Create dots
        for (let i = 0; i < this.totalTestimonials; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            dot.dataset.index = i;
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #cbd5e1;
                cursor: pointer;
                transition: background-color 0.3s ease;
            `;
            
            if (i === 0) {
                dot.style.backgroundColor = '#2563eb';
            }
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            navContainer.appendChild(dot);
        }
        
        this.slider.appendChild(navContainer);
    }
    
    goToSlide(index) {
        // Update current index
        this.currentIndex = index;
        
        // Hide all testimonials
        this.testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Show current testimonial
        this.testimonials[index].style.display = 'block';
        
        // Update active dot
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.style.backgroundColor = '#2563eb';
            } else {
                dot.style.backgroundColor = '#cbd5e1';
            }
        });
    }
    
    nextSlide() {
        this.goToSlide((this.currentIndex + 1) % this.totalTestimonials);
    }
    
    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Initialize testimonial slider if testimonials exist
if (document.querySelector('.testimonials')) {
    new TestimonialSlider();
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Toggle open class on the item
        item.classList.toggle('open');
        
        // Toggle chevron icon
        const icon = question.querySelector('i');
        if (item.classList.contains('open')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
        
        // Close other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('open')) {
                otherItem.classList.remove('open');
                const otherIcon = otherItem.querySelector('.faq-question i');
                otherIcon.classList.remove('fa-chevron-up');
                otherIcon.classList.add('fa-chevron-down');
            }
        });
    });
});

// Form validation and submission
const contactForm = document.querySelector('.contact-form');
const newsletterForm = document.querySelector('.newsletter-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const subject = this.querySelector('select').value;
        const message = this.querySelector('textarea').value.trim();
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, subject, message });
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // In a real application, you would send this data to a server
        console.log('Newsletter subscribed:', email);
        
        // Show success message
        alert('Thank you for subscribing to our newsletter!');
        
        // Reset form
        this.reset();
    });
}

// Initialize progress bars when they come into view
const initProgressBars = () => {
    const skillBars = document.querySelectorAll('.progress-fill');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        // Animate when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                }
            });
        });
        
        observer.observe(bar);
    });
};

// Initialize progress bars when page loads
window.addEventListener('load', initProgressBars);

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add scroll animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.portfolio-item, .service-card, .testimonial, .about-text, .about-image, .contact-info, .contact-form').forEach(el => {
    observer.observe(el);
});