document.addEventListener('DOMContentLoaded', () => {
    initNavbarEffects();
    initSmoothScroll();
    initSkillSwitcher();
    initFactTicker();
    initCursorGradient();
    initContactModal();
});

function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.style.background = 'transparent';
    navbar.style.boxShadow = 'none';
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initSkillSwitcher() {
    const tabs = document.querySelectorAll('.skill-tab');
    const title = document.getElementById('skillTitle');
    const copy = document.getElementById('skillCopy');
    const chipContainer = document.getElementById('skillChips');
    if (!tabs.length || !title || !copy || !chipContainer) return;

    const activateTab = (tab) => {
        tabs.forEach(btn => {
            const isActive = btn === tab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        title.textContent = tab.dataset.title || '';
        copy.textContent = tab.dataset.copy || '';

        const items = (tab.dataset.skills || '')
            .split(',')
            .map(skill => skill.trim())
            .filter(Boolean);

        chipContainer.innerHTML = items
            .map(skill => `<li>${skill}</li>`)
            .join('');
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateTab(tab);
            }
        });
    });

    activateTab(tabs[0]);
}

function initFactTicker() {
    const ticker = document.getElementById('factTicker');
    if (!ticker) return;

    const facts = [
        'Neural voice agents that keep ERP data fresh in real time.',
        'Doc IQ pipelines that reason over 10k+ page contracts with LLM guardrails.',
        'Serverless FastAPI inference layers auto-scaling with demand spikes.',
        'Growth experiments where marketing telemetry loops into product analytics.'
    ];

    let index = 0;

    setInterval(() => {
        index = (index + 1) % facts.length;
        ticker.classList.add('is-changing');
        setTimeout(() => {
            ticker.textContent = facts[index];
            ticker.classList.remove('is-changing');
        }, 200);
    }, 4200);
}

function initCursorGradient() {
    const gradientLayer = document.querySelector('.cursor-gradient');
    if (!gradientLayer) return;

    const root = document.documentElement;

    const updateGradientPosition = (event) => {
        const xPercent = (event.clientX / window.innerWidth) * 100;
        const yPercent = (event.clientY / window.innerHeight) * 100;
        root.style.setProperty('--cursor-x', `${xPercent}%`);
        root.style.setProperty('--cursor-y', `${yPercent}%`);
        gradientLayer.classList.remove('is-hidden');
    };

    window.addEventListener('pointermove', updateGradientPosition);
    window.addEventListener('pointerleave', () => gradientLayer.classList.add('is-hidden'));
    window.addEventListener('pointerenter', () => gradientLayer.classList.remove('is-hidden'));
}

function initContactModal() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalOverlay = document.getElementById('contactModal');
    const modalContainer = modalOverlay?.querySelector('.modal-container');
    const modalClose = modalOverlay?.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    
    let activeTrigger = null;

    if (!modalOverlay || !modalContainer) return;

    const openModal = (trigger) => {
        activeTrigger = trigger;
        const triggerRect = trigger.getBoundingClientRect();
        
        // Prepare modal for measurement
        modalOverlay.classList.add('is-active'); // Temporarily add to ensure layout is computed if needed, but we control visibility
        modalOverlay.style.visibility = 'hidden';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.display = 'flex'; // Ensure flex layout
        
        // Reset transform to measure natural size
        modalContainer.style.transform = 'none';
        modalContainer.style.transition = 'none';
        
        const modalRect = modalContainer.getBoundingClientRect();
        
        // Calculate transforms
        // We want to map the modal center to the button center
        const scaleX = triggerRect.width / modalRect.width;
        const scaleY = triggerRect.height / modalRect.height;
        
        const translateX = (triggerRect.left + triggerRect.width / 2) - (modalRect.left + modalRect.width / 2);
        const translateY = (triggerRect.top + triggerRect.height / 2) - (modalRect.top + modalRect.height / 2);
        
        // Apply initial state (match button position and size)
        modalContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        modalContainer.style.opacity = '0'; 
        
        // Make overlay visible (but transparent initially if we want to animate it)
        modalOverlay.style.visibility = 'visible';
        
        // Force reflow
        modalContainer.offsetHeight;
        
        // Animate to final state
        modalOverlay.style.opacity = ''; // Let CSS handle overlay fade in
        
        modalContainer.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease';
        modalContainer.style.transform = 'translate(0, 0) scale(1)';
        modalContainer.style.opacity = '1';
        
        document.body.style.overflow = 'hidden';
        
        // Focus the first input after animation
        setTimeout(() => {
            const firstInput = modalOverlay.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 500);
    };

    const closeModal = () => {
        if (!activeTrigger) {
            modalOverlay.classList.remove('is-active');
            document.body.style.overflow = '';
            return;
        }

        const triggerRect = activeTrigger.getBoundingClientRect();
        // We need to measure modal again because window might have resized
        // But modal is currently centered.
        // We can just calculate the target delta relative to current position (0,0)
        
        // Actually, let's get current modal rect
        const modalRect = modalContainer.getBoundingClientRect();
        
        const scaleX = triggerRect.width / modalRect.width;
        const scaleY = triggerRect.height / modalRect.height;
        
        const translateX = (triggerRect.left + triggerRect.width / 2) - (modalRect.left + modalRect.width / 2);
        const translateY = (triggerRect.top + triggerRect.height / 2) - (modalRect.top + modalRect.height / 2);

        // Animate back to button
        modalContainer.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
        modalContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        modalContainer.style.opacity = '0';
        
        // Fade out overlay
        modalOverlay.classList.remove('is-active');
        
        const onTransitionEnd = (e) => {
            if (e.target !== modalContainer) return; // Ignore child transitions
            modalOverlay.style.display = ''; // Reset display
            modalOverlay.style.visibility = '';
            modalOverlay.style.opacity = '';
            modalContainer.style.transform = '';
            modalContainer.style.transition = '';
            modalContainer.style.opacity = '';
            document.body.style.overflow = '';
            modalContainer.removeEventListener('transitionend', onTransitionEnd);
            if (activeTrigger) activeTrigger.focus();
        };
        
        modalContainer.addEventListener('transitionend', onTransitionEnd);
        
        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
            if (document.body.style.overflow === 'hidden') {
                onTransitionEnd({ target: modalContainer });
            }
        }, 500);
    };

    // Open modal on trigger click
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(trigger);
        });
    });

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on overlay click (outside the container)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            // Log form data (replace with actual form submission logic)
            console.log('Form submitted:', data);

            // Show success feedback
            const submitBtn = contactForm.querySelector('.modal-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(45deg, #00c853, #69f0ae)';
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                closeModal();
            }, 2000);
        });
    }
}