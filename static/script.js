// Variables globales
let currentLang = 'en'; // Variable manquante ajoutée
let scrollTimeout;
let nav = document.querySelector('nav');
const loading = document.getElementById('loading');


//(function () {
//  const saved = localStorage.getItem("lang");
//  if (saved) {
//    window.location.replace(`/${saved}/`);
//    return;
//  }
//
//  const lang = (navigator.language || "en").slice(0, 2);
//  const target = lang === "fr" ? "fr" : "en";
//
//  window.location.replace(`/${target}/`);
//})();

const supportedLanguagesRegex = ["en", "fr", "ja"].join("|");

// Language switching functionality
function switchLanguage(lang) {
  const regex = new RegExp(supportedLanguagesRegex, "i");
  if (!regex.test(lang)) {
    console.log("lang not supported", lang)
    return;
  }
  if (location.pathname.includes(`/${lang}/`)) {
    return;
  }
  const path = location.pathname.replace(regex, lang);
  location.href = `${path}`;
  console.log("supported lang", supportedLanguagesRegex);
  console.log("input lang", lang);
  console.log("old path", location.pathname);
  console.log("new path", path);
  document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  //currentLang = lang;
  //updateActiveNav();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) { return parts.pop().split(";").shift(); }
    return null;
}

let userPreferredLanguage = getCookie("lang");

if (userPreferredLanguage) {
    switchLanguage(userPreferredLanguage); }
else {
    console.log("User Preferred Language not detected");
}


//function updateActiveNav() {
//  // Update global nav reference to current language nav
//  nav = document.querySelector(`nav[data-lang-content="${currentLang}"]:not(.hidden)`);
//}

// Navigation background on scroll avec performance optimisée
function handleScroll() {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      const scrolled = window.scrollY;

      // Update all navigation bars
      document.querySelectorAll('nav').forEach(navEl => {
        navEl.style.background = scrolled > 96 ? 'rgba(10,10,10,.96)' : 'rgba(10,10,10,.9)';
      });

      // Animation de la barre de progression du scroll
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrolled / docHeight;
      loading.style.transform = `scaleX(${Math.min(scrollProgress, 1)})`;
      scrollTimeout = null;
    }, 16); // 60fps
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });

// Menu mobile toggle for both languages
function setupMobileMenu() {
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const nav = toggle.closest('nav');
      const mobileMenu = nav.querySelector('.menu-mobile');
      const isOpen = mobileMenu.classList.contains('active');

      // Close all other mobile menus first
      document.querySelectorAll('.menu-mobile').forEach(menu => {
        if (menu !== mobileMenu) {
          menu.classList.remove('active');
          const otherToggle = menu.closest('nav').querySelector('.menu-toggle');
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.textContent = '☰';
        }
      });

      mobileMenu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', !isOpen);
      toggle.textContent = isOpen ? '☰' : '✕';
    });
  });
}
setupMobileMenu();

// Fermer le menu mobile en cliquant ailleurs
document.addEventListener('click', (e) => {
  document.querySelectorAll('.menu-mobile').forEach(menu => {
    if (!menu.closest('nav').contains(e.target)) {
      menu.classList.remove('active');
      const toggle = menu.closest('nav').querySelector('.menu-toggle');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }
  });
});

// Smooth scroll amélioré pour les liens d'ancre
document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetSection = e.target.getAttribute('href').substring(1);

    // Trouver la section correspondante dans la langue active
    const target = document.querySelector(`[data-section="${targetSection}"][data-lang-content="${currentLang}"]:not(.hidden)`);

    if (target) {
      // Fermer le menu mobile si ouvert
      document.querySelectorAll('.menu-mobile').forEach(menu => {
        menu.classList.remove('active');
        const toggle = menu.closest('nav').querySelector('.menu-toggle');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });

      // Scroll fluide avec offset pour la nav fixe
      const currentNav = document.querySelector(`nav[data-lang-content="${currentLang}"]:not(.hidden)`);
      const navHeight = currentNav ? currentNav.offsetHeight : 80;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
});

// Animations au scroll (Intersection Observer)
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

// Observer tous les éléments avec la classe 'reveal'
document.querySelectorAll('.reveal').forEach(el => {
  scrollObserver.observe(el);
});

// Chargement lazy des vidéos
function loadVideo(placeholder, src) {
  const player = placeholder.parentElement;
  const video = document.createElement('video');
  video.controls = true;
  video.controlsList = "nodownload"; // Désactivation du bouton de téléchargement
  video.autoplay = true;
  video.muted = true; // Nécessaire pour l'autoplay
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';

  // Ajouter les sources
  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.appendChild(source);

  // Remplacer le placeholder
  player.innerHTML = '';
  player.appendChild(video);

  // Animation de chargement
  video.addEventListener('loadstart', () => {
    player.style.opacity = '0.7';
  });

  video.addEventListener('canplay', () => {
    player.style.opacity = '1';
  });

  // Gestion des erreurs
  video.addEventListener('error', () => {
    player.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);">Vidéo non disponible</div>';
  });
}

// Gestion du formulaire de contact pour les deux langues
(function() {
emailjs.init({publicKey: "PxE3bwQmi779WfPnh"});
})();

 function setupContactForms(){
["en","fr"].forEach(lang=>{
  const form=document.getElementById(`contact-form-${lang}`);
  const alertBox=document.getElementById(`form-alert-${lang}`);
  if(!form) return;
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const formData=new FormData(form);
    const btn=form.querySelector("button[type='submit']");
    const original=btn.innerHTML;
    btn.innerHTML= lang==="en"?"<span>⏳</span> Sending...":"<span>⏳</span> Envoi...";
    btn.disabled=true;
    alertBox.style.display="none";
    try{
      await emailjs.send("service_tesselite","template_tesselite",{
        from_name:formData.get("name"),
        from_email:formData.get("email"),
        subject:formData.get("subject")|| (lang==="en"?"Contact from website":"Contact depuis le site"),
        message:formData.get("message"),
        to_email:"graviton@tesselite.com"
      });
      alertBox.textContent= lang==="en"?"✅ Message sent!":"✅ Message envoyé !";
      alertBox.className="form-alert success";
      alertBox.style.display="block";
      form.reset();
    }catch(err){
      console.error(err);
      alertBox.textContent= lang==="en"?"❌ Error sending. Try again or email us directly.":"❌ Erreur d'envoi. Réessayez ou utilisez l'email direct.";
      alertBox.className="form-alert error";
      alertBox.style.display="block";
    }finally{
      btn.innerHTML=original;
      btn.disabled=false;
    }
  });
});
}
setupContactForms();

// Effet parallaxe subtil pour l'orbe du hero
let ticking = false;
function updateParallax() {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach(orb => {
    if (scrolled < window.innerHeight) {
      orb.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.1}deg)`;
    }
  });
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// Gestion des erreurs d'images et videos
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.warn('Image non trouvée:', e.target.src);
  } else if (e.target.tagName === 'VIDEO') {
    // Fallback pour vidéo manquante
    console.warn('Vidéo non trouvée:', e.target.src);
  }
}, true);

// Gestion du mode sombre automatique
function handleColorScheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function updateTheme(e) {
    if (e.matches) {
      document.documentElement.style.setProperty('--bg', '#0a0a0a');
    }
  }

  prefersDark.addEventListener('change', updateTheme);
  updateTheme(prefersDark);
}
handleColorScheme();

// Language toggle event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchLanguage(btn.dataset.lang);
  });
});

// Easter egg: Konami Code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  if (konamiCode.length > konami.length) {
    konamiCode.shift();
  }

  if (konamiCode.join(',') === konami.join(',')) {
    document.body.style.animation = 'pulse 2s infinite';
    console.log('🎉 Easter egg activé ! Tesselite x Graviton');
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

// Paypal support
 ["en","fr"].forEach(async lang=>{
 PayPal.Donation.Button({
     env: 'production',
     hosted_button_id: '35E5RCYKW9CVL',
     image: {
         src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
         title: 'PayPal - The safer, easier way to pay online!',
         alt: 'Donate with PayPal button'
     },
     onComplete: async function (params) {
      try{
        await emailjs.send("service_tesselite","template_tesselite",{
          from_name:formData.get("name"),
          from_email:formData.get("email"),
          subject:formData.get("subject")|| (lang==="en"?"Contact from website":"Contact depuis le site"),
          message:formData.get("message"),
          to_email:"graviton@tesselite.com"
        });
        alertBox.textContent= lang==="en"?"✅ Message sent!":"✅ Message envoyé !";
        alertBox.className="form-alert success";
        alertBox.style.display="block";
        form.reset();
      }catch(err){
        console.error(err);
        alertBox.textContent= lang==="en"?"❌ Error sending. Try again or email us directly.":"❌ Erreur d'envoi. Réessayez ou utilisez l'email direct.";
        alertBox.className="form-alert error";
        alertBox.style.display="block";
      }
     },
 }).render('#paypal-donate-button-container-'+lang);
 });