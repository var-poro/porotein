// Script personnalisé pour Swagger UI de Porotein

window.onload = function() {
  // Attendre que Swagger UI soit complètement chargé
  const checkSwaggerUIReady = setInterval(() => {
    if (document.querySelector('.swagger-ui')) {
      clearInterval(checkSwaggerUIReady);
      customizeSwaggerUI();
    }
  }, 100);
  
  function customizeSwaggerUI() {
    // Remplacer le logo Swagger par le logo Porotein
    const logoImg = document.querySelector('.swagger-ui .topbar img');
    if (logoImg) {
      logoImg.src = '/porotein-logo.svg';
      logoImg.alt = 'Porotein API';
      logoImg.style.height = '40px';
    }
    
    // Ajouter un bouton pour copier les URLs des endpoints
    addCopyUrlButtons();
    
    // Ajouter un bouton pour revenir à l'application
    addBackToAppButton();
    
    // Améliorer l'affichage des exemples de requêtes
    enhanceRequestExamples();
    
    // Ajouter un mode sombre
    addDarkModeToggle();
    
    console.log('Porotein Swagger UI customization applied');
  }
  
  function addCopyUrlButtons() {
    // Attendre que les opérations soient chargées
    setTimeout(() => {
      const operations = document.querySelectorAll('.opblock');
      operations.forEach(op => {
        const method = op.querySelector('.opblock-summary-method').innerText;
        const path = op.querySelector('.opblock-summary-path').dataset.path;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-url-btn';
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        copyBtn.title = 'Copier l\'URL';
        copyBtn.style.cssText = 'background: none; border: none; cursor: pointer; margin-left: 10px;';
        
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const baseUrl = window.location.origin;
          const fullUrl = `${baseUrl}${path}`;
          
          navigator.clipboard.writeText(fullUrl).then(() => {
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
              copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            }, 2000);
          });
        });
        
        const summaryDiv = op.querySelector('.opblock-summary');
        summaryDiv.appendChild(copyBtn);
      });
    }, 1000);
  }
  
  function addBackToAppButton() {
    const topbar = document.querySelector('.swagger-ui .topbar');
    if (topbar) {
      const backBtn = document.createElement('a');
      backBtn.href = '/';
      backBtn.className = 'back-to-app-btn';
      backBtn.innerText = 'Retour à l\'application';
      backBtn.style.cssText = 'color: white; margin-left: 20px; text-decoration: none; padding: 8px 16px; background-color: rgba(255,255,255,0.2); border-radius: 4px; transition: background-color 0.3s;';
      
      backBtn.addEventListener('mouseover', () => {
        backBtn.style.backgroundColor = 'rgba(255,255,255,0.3)';
      });
      
      backBtn.addEventListener('mouseout', () => {
        backBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
      });
      
      topbar.appendChild(backBtn);
    }
  }
  
  function enhanceRequestExamples() {
    // Améliorer l'affichage des exemples de requêtes
    setTimeout(() => {
      const models = document.querySelectorAll('.model-box');
      models.forEach(model => {
        model.style.maxHeight = 'none';
      });
    }, 1000);
  }
  
  function addDarkModeToggle() {
    // Créer le bouton de basculement du mode sombre
    const topbar = document.querySelector('.swagger-ui .topbar');
    if (topbar) {
      const darkModeBtn = document.createElement('button');
      darkModeBtn.className = 'dark-mode-toggle';
      darkModeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      darkModeBtn.title = 'Basculer le mode sombre';
      darkModeBtn.style.cssText = 'background: none; border: none; cursor: pointer; margin-left: 20px; color: white;';
      
      // Vérifier si le mode sombre est déjà activé
      const isDarkMode = localStorage.getItem('porotein-swagger-dark-mode') === 'true';
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        applyDarkMode();
      }
      
      darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('porotein-swagger-dark-mode', isDark);
        
        if (isDark) {
          applyDarkMode();
          darkModeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
          removeDarkMode();
          darkModeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
      });
      
      topbar.appendChild(darkModeBtn);
    }
  }
  
  function applyDarkMode() {
    // Créer une feuille de style pour le mode sombre
    let darkStyle = document.getElementById('dark-mode-style');
    if (!darkStyle) {
      darkStyle = document.createElement('style');
      darkStyle.id = 'dark-mode-style';
      document.head.appendChild(darkStyle);
    }
    
    darkStyle.textContent = `
      body.dark-mode {
        background-color: #1e1e1e;
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .info {
        background-color: #2d2d2d;
      }
      
      body.dark-mode .swagger-ui .info .title,
      body.dark-mode .swagger-ui .info h1,
      body.dark-mode .swagger-ui .info h2,
      body.dark-mode .swagger-ui .info h3,
      body.dark-mode .swagger-ui .info h4,
      body.dark-mode .swagger-ui .info h5,
      body.dark-mode .swagger-ui .info h6 {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .opblock-tag {
        color: #f0f0f0;
        border-bottom: 1px solid #444;
      }
      
      body.dark-mode .swagger-ui .opblock {
        background-color: #2d2d2d;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      body.dark-mode .swagger-ui .opblock .opblock-summary-description {
        color: #ccc;
      }
      
      body.dark-mode .swagger-ui .opblock-body {
        background-color: #2d2d2d;
      }
      
      body.dark-mode .swagger-ui input[type=text],
      body.dark-mode .swagger-ui textarea {
        background-color: #333;
        color: #f0f0f0;
        border-color: #555;
      }
      
      body.dark-mode .swagger-ui .model-box {
        background-color: #333;
      }
      
      body.dark-mode .swagger-ui .model {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .model-title {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .parameter__name,
      body.dark-mode .swagger-ui .parameter__type {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui table {
        background-color: #2d2d2d;
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .response-col_status {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .response-col_description {
        color: #f0f0f0;
      }
      
      body.dark-mode .swagger-ui .responses-table .response {
        background-color: #333;
      }
      
      body.dark-mode .swagger-ui .scheme-container {
        background-color: #2d2d2d;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      body.dark-mode .swagger-ui select {
        background-color: #333;
        color: #f0f0f0;
        border-color: #555;
      }
    `;
  }
  
  function removeDarkMode() {
    const darkStyle = document.getElementById('dark-mode-style');
    if (darkStyle) {
      darkStyle.textContent = '';
    }
  }
}; 