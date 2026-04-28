var isIE = /msie\s|trident/i.test(window.navigator.userAgent);
if (isIE && window.location.pathname != '/unsupported.html') {
  window.location.href = "./unsupported.html";
}

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
    var themeToggle = document.getElementById('themeToggle');
    var currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        var theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

    var downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generateCV);
    }
});

function generateCV() {
    var tooltip = document.getElementById('cvTooltip');
    var progressFill = document.getElementById('cvProgress');

    tooltip.classList.add('show');
    updateProgress(10, 'Building sidebar...');

    // 1. Prepare Sidebar Data
    var photoBase64 = (typeof profileBase64 !== 'undefined') ? profileBase64 : '';
    
    // Extract unique skills from badges on the page (only from sections that are NOT Certificates)
    var skillsSet = new Set();
    document.querySelectorAll('.section').forEach(section => {
        var subtitle = section.querySelector('.subtitle');
        if (subtitle && !subtitle.innerText.toLowerCase().includes('certificates')) {
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
    updateProgress(30, 'Extracting experience...');
    var experienceHtml = '';
    // Select all experience divs, but filter out those that are children of a Certificates section
    document.querySelectorAll('.experience').forEach(function(exp) {
        var section = exp.closest('.section');
        var sectionTitle = section ? section.querySelector('.subtitle').innerText.toLowerCase() : '';
        
        if (!sectionTitle.includes('certificates') && !exp.innerText.toLowerCase().includes('studies')) {
            var clone = exp.cloneNode(true);
            // Clean up interactivity
            clone.querySelectorAll('.tooltiptext, .tooltip-link').forEach(function(t) { 
                if(t.classList.contains('tooltip-link')) {
                    var span = document.createElement('span');
                    span.innerHTML = t.innerHTML;
                    t.parentNode.replaceChild(span, t);
                } else { t.remove(); }
            });
            // Style links
            clone.querySelectorAll('a').forEach(a => {
                a.style.color = '#333';
                a.style.textDecoration = 'none';
                a.style.fontWeight = 'bold';
            });
            experienceHtml += `<div class="cv-experience-item">${clone.innerHTML}</div>`;
        }
    });

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
            .cv-photo-container { text-align: center; margin-bottom: 25px; }
            .cv-photo-container img { width: 130px; height: 130px; border-radius: 50%; border: 4px solid #b165d8; padding: 3px; background: white; }
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
            .cv-experience-item .company { font-weight: bold; font-size: 11pt; color: #212121; }
            .cv-experience-item .period { font-size: 9pt; color: #888; float: right; }
            .cv-experience-item p { font-size: 9.5pt; line-height: 1.4; margin: 6px 0; color: #444; }
            .cv-experience-item .badge { display: inline-block; background: #f0ebff; color: #693482; border-radius: 4px; font-size: 8pt; padding: 2px 7px; margin: 2px; font-weight: bold; }
            
            .edu-item { margin-bottom: 5px; }
            .edu-title { font-weight: bold; font-size: 11pt; color: #212121; }
            .edu-subtitle { font-size: 10pt; color: #555; }
            .edu-location { font-size: 9pt; color: #888; }
            .edu-period { font-size: 9pt; color: #b165d8; font-weight: bold; }
        </style>
        <div class="cv-wrapper">
            <div class="cv-sidebar">
                <div class="cv-photo-container">
                    <img src="${photoBase64}">
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
                    <div class="sidebar-title">Certificates</div>
                    <div class="sidebar-item" style="font-weight: bold; color: #212121; display: block; margin-bottom: 2px;">Professional Scrum Master I (PSM I)</div>
                    <div class="sidebar-item" style="font-size: 7.5pt; color: #b165d8; margin-bottom: 2px;">Scrum.org</div>
                    <div class="sidebar-item" style="font-size: 7pt; color: #888;">Credential ID: 1281167</div>
                </div>
            </div>
            
            <div class="cv-main">
                <div class="cv-section-title">Professional Summary</div>
                <div class="cv-summary">
                    Motivated Software Engineer with extensive experience in backend, full-stack, and cloud technologies. I thrive on solving complex technical challenges and am deeply committed to collaborating with engaging, forward-thinking teams. My focus is on building scalable, high-quality solutions that meet real-world business needs while continuously evolving my technical expertise.
                </div>
                
                <div class="cv-section-title">Experience</div>
                <div class="cv-experience-list">${experienceHtml}</div>

                <div class="cv-section-title">Education</div>
                <div class="edu-item">
                    <div class="edu-title">LICENCIATE DEGREE, INFORMATICS ENGINEERING</div>
                    <div class="edu-subtitle">INSTITUTO SUPERIOR DE ENGENHARIA DO PORTO</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                        <span class="edu-location">Porto, Portugal</span>
                        <span class="edu-period">2012 – 2016</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    updateProgress(70, 'Rendering PDF...');

    // 4. PDF Capture Logic
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
    allTooltips.forEach(function(t) { if (t.id !== id) { t.classList.remove("show"); t.innerHTML = ""; } });
    if (popup.classList.contains("show")) { popup.classList.remove("show"); popup.innerHTML = ""; return; }
    popup.innerHTML = "";
    if (isMobile) {
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "tooltip-close";
        closeBtn.onclick = function(e) { e.stopPropagation(); popup.classList.remove("show"); popup.innerHTML = ""; };
        popup.appendChild(closeBtn);
    }
    if (media) {
        var mediaContainer = document.createElement('div');
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
    if (!e.target.closest('.tooltip')) {
        var allTooltips = document.querySelectorAll('.tooltiptext.show');
        allTooltips.forEach(function(t) { t.classList.remove("show"); t.innerHTML = ""; });
    }
});
