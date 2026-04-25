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
    updateProgress(10, 'Initializing...');

    // 1. Extract and Clean Career Content
    var experiences = document.querySelectorAll('.experience');
    var expHtml = '';
    experiences.forEach(function(exp) {
        var clone = exp.cloneNode(true);
        var tts = clone.querySelectorAll('.tooltiptext, .tooltip-link');
        tts.forEach(function(t) { 
            if(t.classList.contains('tooltip-link')) {
                var span = document.createElement('span');
                span.innerHTML = t.innerHTML;
                t.parentNode.replaceChild(span, t);
            } else {
                t.remove(); 
            }
        });
        expHtml += clone.outerHTML;
    });

    var photoBase64 = (typeof profileBase64 !== 'undefined') ? profileBase64 : '';

    // 2. Build CV Document
    var cvContainer = document.createElement('div');
    cvContainer.id = 'cv-capture-root';
    cvContainer.style.width = '800px';
    cvContainer.style.background = 'white';
    cvContainer.style.color = '#212121';
    cvContainer.style.padding = '40px';
    cvContainer.style.fontFamily = 'Arial, sans-serif';
    cvContainer.innerHTML = `
        <div style="display:flex; align-items:center; border-bottom:2px solid #e9e1ff; padding-bottom:20px; margin-bottom:20px;">
            <div style="margin-right:30px;"><img src="${photoBase64}" style="width:100px; height:100px; border-radius:50%; border:3px solid #e9e1ff;"></div>
            <div>
                <h1 style="margin:0; font-size:32px; color:#212121;">Rui Moreira</h1>
                <div style="font-size:20px; color:#b165d8; font-weight:bold; margin:5px 0;">Software Engineer</div>
                <div style="font-size:14px; color:#666; display:flex; gap:15px;">
                    <span>📍 Porto, Portugal</span>
                    <span>📧 ruisousamoreira@gmail.com</span>
                    <span>🔗 linkedin.com/in/ruisousamoreira</span>
                </div>
            </div>
        </div>
        <div style="font-weight:bold; font-size:22px; color:#212121; border-left:5px solid #b165d8; padding-left:10px; margin:25px 0 15px 0; text-transform:uppercase;">Professional Experience</div>
        <div class="cv-body-content" style="font-size:14px; line-height:1.5;">${expHtml}</div>
        <style>
            .experience { margin-bottom: 25px; }
            .company { font-weight: bold; font-size: 18px; display: block; margin-bottom: 2px; }
            .period { font-size: 14px; color: #888; display: block; margin-bottom: 10px; }
            .badge { display: inline-block; background: #f4f0ff; color: #8b37b5; border-radius: 15px; font-size: 11px; padding: 4px 10px; margin: 2px; font-weight: bold; border: 1px solid #e9e1ff; }
            p { margin: 10px 0; text-align: justify; }
        </style>
    `;

    // 3. Capture Logic
    updateProgress(40, 'Rendering...');
    
    var opt = {
        margin: [10, 0, 10, 0],
        filename: 'CV_Rui_Moreira.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(cvContainer).set(opt).toPdf().get('pdf').then(function(pdf) {
        updateProgress(80, 'Downloading...');
    }).save().then(function() {
        updateProgress(100, 'CV Download Complete!');
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
