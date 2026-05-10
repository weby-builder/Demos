/* ===========================
   MENU DATA
=========================== */
const menuData = {
  starters: [
    { name: "סמבוסק עם לבן", price: "₪42", desc: "סמבוסק פריך ממולא בטלה מתובל, מוגש עם לבן ביתי ועשבי תיבול טריים", tag: "מומלץ" },
    { name: "חומוס השף", price: "₪38", desc: "חומוס טחון טרי עם שמן זית כביש קר, פפריקה מעושנת ופטרוזיליה", tag: "" },
    { name: "סלט אספרגוס", price: "₪46", desc: "אספרגוס צלוי עם גבינת פטה, שקדים קלויים ורוטב לימון-דבש", tag: "טבעוני" },
    { name: "קבב קטן", price: "₪52", desc: "קבביות טלה עם תבלינים ים תיכוניים, צ'ינג צ'ינג ורוטב טחינה", tag: "" },
  ],
  mains: [
    { name: "דג לבן על הגריל", price: "₪98", desc: "דג לבן טרי מדי יום עם ירקות שורש צלויים ורוטב שרימפס וחמאה", tag: "המלצת השף" },
    { name: "כתף טלה 12 שעות", price: "₪115", desc: "כתף טלה מבושלת לאיטיות עם גרעיני רומן, מינט טרי ולחם טנור", tag: "מיוחד" },
    { name: "פסטה בינוקולי", price: "₪72", desc: "פסטה טרייה עם ברוקולי, שום, פלפל חריף ושמן זית כביש קר", tag: "צמחוני" },
    { name: "מוסקה ירושלמית", price: "₪82", desc: "מוסקה בשכבות עם חציל, בשר טחון, עגבניות וביצ'מל ביתי", tag: "" },
    { name: "סטייק אנטריקוט 300g", price: "₪135", desc: "אנטריקוט פרמיום גוש דן עם ירקות עונה ורוטב יין אדום", tag: "" },
    { name: "ריזוטו פטריות", price: "₪78", desc: "ריזוטו ארבוריו עם פטריות שיטאקי, טרופל שחור וגבינת פרמזן", tag: "צמחוני" },
  ],
  desserts: [
    { name: "מלבי פרחים", price: "₪38", desc: "מלבי ביתי עם מי ורדים, פיסטוק ועלי ורדים מסוכרים", tag: "" },
    { name: "בראוניז שוקולד מריר", price: "₪42", desc: "בראוניז חמים עם גלידת וניל ביתית ורוטב קרמל מלוח", tag: "מומלץ" },
    { name: "לימון טארט", price: "₪44", desc: "טארט לימון קלאסי עם קרם לבן ו-meringue שרוף", tag: "" },
  ],
  drinks: [
    { name: "לימונדה ביתית", price: "₪22", desc: "לימונדה טרייה עם נענע, ג'ינג'ר וסוכר קנים", tag: "" },
    { name: "יין אדום — הבית", price: "₪35", desc: "כוס יין אדום מנבחרת הבית, גוף בינוני, פירותי", tag: "" },
    { name: "קוקטייל הים", price: "₪52", desc: "ערק, מיץ תפוז, פלח לימון וסודה — המשקה החתום שלנו", tag: "סיגנצ'ר" },
    { name: "קפה שחור טורקי", price: "₪18", desc: "קפה טורקי מסורתי עם הל, מוגש עם לוקום ביתי", tag: "" },
  ]
};

/* ===========================
   RENDER MENU
=========================== */
function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  const items = menuData[category];
  grid.innerHTML = items.map(item => `
    <div class="menu-card">
      <div class="menu-card__top">
        <span class="menu-card__name">${item.name}</span>
        <span class="menu-card__price">${item.price}</span>
      </div>
      <p class="menu-card__desc">${item.desc}</p>
      ${item.tag ? `<span class="menu-card__tag">${item.tag}</span>` : ''}
    </div>
  `).join('');
}

/* ===========================
   TABS
=========================== */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderMenu(tab.dataset.cat);
  });
});

renderMenu('starters'); // default

/* ===========================
   MOBILE MENU
=========================== */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

burger.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===========================
   NAV SCROLL EFFECT
=========================== */
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('scrolled', window.scrollY > 50);
});

/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.about, .menu-section, .gallery, .testimonials, .contact');

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===========
   TIME LIMITS
============== */ 
const dateInput = document.getElementById('date');
const hourSelect = document.getElementById('hourSelect');

function updateHours() {
    const selectedDate = new Date(dateInput.value);
    const day = selectedDate.getDay();

    // מנקה שעות קודמות
    hourSelect.innerHTML = '';
    let startHour;
    let endHour;
    // Friday
    if (day === 5) {
        startHour = 11;
        endHour = 23;
    }

    // Saturday
    else if (day === 6) {
        startHour = 11;
        endHour = 23;
    }

    // Regular days
    else {
        startHour = 12;
        endHour = 22;
    }

    // יוצר options
    for (let hour = startHour; hour <= endHour; hour++) {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = String(hour).padStart(2, '0');
        hourSelect.appendChild(option);
    }
}

// כשמשנים תאריך
dateInput.addEventListener('change', updateHours);


/* ===========================
   FORM SUBMISSION LOGIC
=========================== */
async function handleSubmit() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');
    const btn = document.querySelector('.submit-btn');
    const successMsg = document.getElementById('formSuccess');

    let isValid = true;

    // Standard empty field validation
    inputs.forEach(input => {
        if (input.type === "hidden" || input.name === "botcheck") return;

        if (!input.value.trim()) {
            input.style.borderColor = '#e05050';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });


    if (!isValid) return;

    // Update UI state
    btn.textContent = 'שולח...';
    btn.disabled = true;

    const formData = new FormData(form);

    const hour = formData.get('hour');
    const minute = formData.get('minute');
    const time = `${hour}:${minute}`;

    const message = formData.get('message');
    
    const date = formData.get('date');
    const [year, month, day] = date.split('-');
    const newDate = `${day}/${month}/${year}`;

    formData.delete('date');
    formData.delete('hour');
    formData.delete('minute');
    formData.delete('message');
    formData.append('date', newDate);
    formData.append('time', `${hour}:${minute}`);
    formData.append('message', message);



    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            form.reset();
            successMsg.style.display = 'block';
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        } else {
            console.error("Submission error:", data);
        }
    } catch (err) {
        console.error("Network error:", err);
    } finally {
        btn.textContent = 'שלח הזמנה';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // חשוב מאוד
    handleSubmit();
  });
});
