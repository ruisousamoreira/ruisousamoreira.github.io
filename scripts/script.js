var isIE = /msie\s|trident/i.test(window.navigator.userAgent);
if (isIE && window.location.pathname != '/unsupported.html') {
  window.location.href = "./unsupported.html";
}

// Zenith Redesign - Interaction Logic
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollReveal();

    var downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateCV);
    }

    renderExperience();
});

function initTheme() {
    var themeToggle = document.getElementById('themeToggle');
    var currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateMetaThemeColor('#121212');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        var theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateMetaThemeColor(theme === 'dark' ? '#121212' : '#defdf7');
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}
function updateMetaThemeColor(color) {
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
    }
}

function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container || !experienceData) return;

    container.innerHTML = experienceData.map(exp => `
        <div class="experience">
            <span class="company">${exp.logo} ${exp.company}</span>
            <span class="period">(${exp.period})</span>
            <p>
                ${exp.description.replace(/href="([^"]+)"/g, 'href="$1" class="highlighted-link" target="_blank"')}
            </p>
            ${exp.technologies.length > 0 ? `
                <p>Some of the technologies that I've worked with are:
                    ${exp.technologies.map(tech => `<span class="badge">${tech}</span>`).join('')}
                </p>
            ` : ''}
        </div>
    `).join('');
}

function generateCV() {
    var tooltip = document.getElementById('cvTooltip');
    var progressFill = document.getElementById('cvProgress');

    tooltip.classList.add('show');
    updateProgress(10, 'Building sidebar...');

    // 1. Prepare Sidebar Data
    var photoBase64 = (typeof profileBase64 !== 'undefined') ? profileBase64 : '';
    
    // Extract unique skills from badges on the page (only from sections that are NOT Certifications/Education)
    var skillsSet = new Set();
    document.querySelectorAll('.section').forEach(section => {
        var subtitle = section.querySelector('.subtitle');
        if (subtitle && !subtitle.innerText.toLowerCase().includes('certifications') && !subtitle.innerText.toLowerCase().includes('education')) {
            section.querySelectorAll('.badge').forEach(b => {
                var s = b.innerText.split('(')[0].trim();
                if(s.length > 1) skillsSet.add(s);
            });
        }
    });
    // Pick the top/most relevant ones
    var curatedSkills = Array.from(skillsSet).slice(0, 18);
    var skillsHtml = curatedSkills.map(s => `<span class="cv-badge">${s}</span>`).join('');

    // 2. Prepare Main Content Data
    updateProgress(30, 'Formatting content...');
    
    // Use the JSON data directly for CV to ensure maximum quality/cleanliness
    var experienceHtml = experienceData.map(exp => `
        <div class="cv-experience-item">
            <div class="company">${exp.company}</div>
            <div class="period">${exp.period}</div>
            <p>${exp.description.replace(/<a[^>]*>(.*?)<\/a>/g, '<strong>$1</strong>')}</p>
            <div class="tech-stack">
                ${exp.technologies.map(tech => `<span class="badge">${tech}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // 3. Construct the Two-Column CV
    var cvContainer = document.createElement('div');
    cvContainer.style.width = '794px'; 
    cvContainer.style.background = 'white';
    cvContainer.style.color = '#333';
    cvContainer.style.fontFamily = "'Satoshi', Arial, sans-serif";
    cvContainer.innerHTML = `
        <style>
            .cv-wrapper { display: flex; min-height: 1120px; width: 794px; background: white; }
            .cv-sidebar { width: 260px; background: #f8f6ff; padding: 30px 20px; border-right: 1px solid #e9e1ff; }
            .cv-main { flex: 1; padding: 35px 30px; background: white; }
            
            /* Sidebar Styles */
            .cv-photo-container { 
                width: 144px; 
                height: 144px; 
                border-radius: 50%; 
                border: 4px solid #b165d8; 
                background: white; 
                margin: 0 auto 25px auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cv-photo-img { 
                width: 130px; 
                height: 130px; 
                border-radius: 50%; 
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }
            .sidebar-name { font-size: 20pt; font-weight: bold; color: #212121; text-align: center; margin-bottom: 5px; }
            .sidebar-role { font-size: 11pt; color: #b165d8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; text-align: center; margin-bottom: 30px; }
            
            .sidebar-section { margin-bottom: 25px; }
            .sidebar-title { font-size: 10pt; font-weight: bold; color: #693482; text-transform: uppercase; border-bottom: 1px solid #dcd1ff; padding-bottom: 5px; margin-bottom: 12px; letter-spacing: 1px; }
            .sidebar-item { font-size: 8.5pt; color: #555; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
            .cv-badge { display: inline-block; background: #e9e1ff; color: #693482; border-radius: 4px; font-size: 7.5pt; padding: 2px 6px; margin: 2px; font-weight: bold; border: 1px solid #dcd1ff; }
            
            /* Main Content Styles */
            .cv-summary { font-size: 10pt; line-height: 1.5; color: #444; margin-bottom: 25px; text-align: justify; }
            .cv-section-title { font-size: 14pt; font-weight: bold; color: #212121; border-bottom: 2px solid #b165d8; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; }
            
            .cv-experience-item { margin-bottom: 18px; page-break-inside: avoid; }
            .cv-exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
            .cv-company-role .company { font-weight: bold; font-size: 11pt; color: #212121; }
            .cv-company-role .role { font-size: 10pt; color: #693482; font-weight: 500; }
            .cv-experience-item .period { font-size: 9pt; color: #777; font-weight: bold; white-space: nowrap; }
            .cv-experience-item p { font-size: 9.5pt; line-height: 1.4; margin: 6px 0; color: #444; text-align: justify; }
            .cv-experience-item .badge { display: inline-block; background: #f0ebff; color: #693482; border-radius: 4px; font-size: 8pt; padding: 2px 7px; margin: 2px; font-weight: bold; }
        </style>
        <div class="cv-wrapper">
            <div class="cv-sidebar">
                <div class="cv-photo-container">
                    <div class="cv-photo-img" style="background-image: url('${photoBase64}')"></div>
                </div>
                <div class="sidebar-name">Rui Moreira</div>
                <div class="sidebar-role">Software Engineer</div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">Contact</div>
                    <div class="sidebar-item">📧 ruisousamoreira@gmail.com</div>
                    <div class="sidebar-item">📍 Porto, Portugal</div>
                    <div class="sidebar-item">🔗 linkedin.com/in/ruisousamoreira</div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">Languages</div>
                    <div class="sidebar-item"><strong>Portuguese:</strong> Native</div>
                    <div class="sidebar-item"><strong>English:</strong> Full Professional</div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">Technical Skills</div>
                    <div style="display: flex; flex-wrap: wrap;">${skillsHtml}</div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-title">Certifications</div>
                    <div class="sidebar-item" style="font-weight: bold; color: #212121; display: block; margin-bottom: 2px;">Professional Scrum Master I (PSM I)</div>
                    <div class="sidebar-item" style="font-size: 7.5pt; color: #b165d8; margin-bottom: 2px;">Scrum.org</div>
                    <div class="sidebar-item" style="font-size: 7pt; color: #888;">Credential ID: 1281167</div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-title">Education</div>
                    <div class="sidebar-item" style="font-weight: bold; color: #212121; display: block; margin-bottom: 2px;">LICENCIATE DEGREE, INFORMATICS ENGINEERING</div>
                    <div class="sidebar-item" style="font-size: 7.5pt; color: #b165d8; margin-bottom: 2px;">INSTITUTO SUPERIOR DE ENGENHARIA DO PORTO</div>
                    <div class="sidebar-item" style="font-size: 7pt; color: #888;">2012 – 2016 | Porto, Portugal</div>
                </div>
            </div>
            
            <div class="cv-main">
                <div class="cv-section-title">Professional Summary</div>
                <div class="cv-summary">
                    Motivated Software Engineer with extensive experience in backend, full-stack, and cloud technologies. I thrive on solving complex technical challenges and am deeply committed to collaborating with engaging, forward-thinking teams. My focus is on building scalable, high-quality solutions that meet real-world business needs while continuously evolving my technical expertise.
                </div>
                
                <div class="cv-section-title">Experience</div>
                <div class="cv-experience-list">${experienceHtml}</div>
            </div>
        </div>
    `;

    updateProgress(70, 'Rendering PDF...');

    var opt = {
        margin: [0, 0, 0, 0],
        filename: 'cv-rui-moreira.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            backgroundColor: '#ffffff',
            useCORS: true,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(cvContainer).set(opt).save().then(function() {
        updateProgress(100, 'CV Ready!');
        setTimeout(function() {
            tooltip.classList.remove('show');
            setTimeout(function() { progressFill.style.width = '0%'; }, 300);
        }, 2000);
    }).catch(function(err) {
        console.error('PDF Error:', err);
        updateProgress(100, 'Error: Try again');
    });
}

function updateProgress(percent, text) {
    var tooltipText = document.getElementById('cvTooltipText');
    var progressFill = document.getElementById('cvProgress');
    if(tooltipText) tooltipText.innerText = text;
    if(progressFill) progressFill.style.width = percent + '%';
}

function displayTooltip(id, text, media) {
    var popup = document.getElementById(id);
    var isMobile = window.innerWidth < 768;
    var allTooltips = document.querySelectorAll('.tooltiptext');
    
    // Clean up other tooltips
    allTooltips.forEach(function(t) { 
        if (t.id !== id) { 
            t.classList.remove("show"); 
            t.innerHTML = ""; 
        } 
    });

    if (popup.classList.contains("show")) {
        popup.classList.remove("show");
        popup.innerHTML = "";
        return;
    }

    popup.innerHTML = "";
    
    if (isMobile) {
        // Move to body to avoid parent transform issues
        document.body.appendChild(popup);
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "tooltip-close";
        closeBtn.onclick = function(e) { 
            e.stopPropagation(); 
            popup.classList.remove("show"); 
            popup.innerHTML = ""; 
        };
        popup.appendChild(closeBtn);
    }
    
    if (media) {
        var mediaContainer = document.createElement('div');
        mediaContainer.style.display = "contents"; // Let children be sized by modal
        mediaContainer.innerHTML = media;
        popup.appendChild(mediaContainer);
    }
    
    var textDiv = document.createElement('div');
    textDiv.innerHTML = text;
    textDiv.className = "tooltip-caption";
    popup.appendChild(textDiv);
    
    popup.classList.add("show");
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.tooltip') && !e.target.closest('.tooltiptext')) {
        var allTooltips = document.querySelectorAll('.tooltiptext.show');
        allTooltips.forEach(function(t) { 
            t.classList.remove("show"); 
            t.innerHTML = ""; 
        });
    }
});

