function requestGeolocation() {
    const geoResult = document.getElementById('geo-result');
    geoResult.classList.remove('hidden');
    
    if ("geolocation" in navigator) {
        geoResult.innerHTML = '<p>Requesting permission...</p>';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geoResult.innerHTML = `
                    <h4>Location Data:</h4>
                    <p>Latitude: ${position.coords.latitude}</p>
                    <p>Longitude: ${position.coords.longitude}</p>
                    <p><small>Note: Data shown locally only</small></p>
                `;
            },
            (error) => {
                geoResult.innerHTML = `
                    <p style="color: var(--warning)">
                        Error: ${error.message}
                    </p>
                `;
            }
        );
    } else {
        geoResult.innerHTML = '<p style="color: var(--warning)">Geolocation not supported by your browser</p>';
    }
}

function startKeylogger() {
    const keylogArea = document.getElementById('keylog-area');
    const keylogDisplay = document.getElementById('keylog-display');
    const testInput = document.getElementById('test-input');
    
    keylogArea.classList.remove('hidden');
    testInput.focus();
    
    testInput.addEventListener('keyup', function(e) {
        const timestamp = new Date().toLocaleTimeString();
        keylogDisplay.innerHTML = `
            <h4>Last Keystroke:</h4>
            <p>Key Pressed: ${e.key}</p>
            <p>Time: ${timestamp}</p>
            <p><small>Note: Data shown locally only</small></p>
        `;
    });
}

function demonstrateXSS() {
    const xssArea = document.getElementById('xss-area');
    const xssInput = document.getElementById('xss-input');
    const xssOutput = document.getElementById('xss-output');
    
    xssArea.classList.remove('hidden');
    
    // Scope the click handlers to XSS demo only
    document.querySelectorAll('.consent-card:has(#xss-area) .demo-instructions code').forEach(code => {
        code.addEventListener('click', () => {
            xssInput.value = code.textContent;
            xssInput.dispatchEvent(new Event('input'));
        });
    });
    
    xssInput.addEventListener('input', function() {
        const userInput = this.value;
        const unsafeOutput = userInput;
        const safeOutput = escapeHtml(userInput);
        
        xssOutput.innerHTML = `
            <div class="demo-result">
                <h4>Unsafe Output (Vulnerable):</h4>
                <p class="unsafe">${unsafeOutput}</p>
                <h4>Safe Output (Sanitized):</h4>
                <p class="safe">${safeOutput}</p>
                <p><small>Click any example above to try it</small></p>
            </div>
        `;
    });
}

function showFingerprint() {
    const fingerprintResult = document.getElementById('fingerprint-result');
    const browserData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        canvas: getCanvasFingerprint()
    };

    fingerprintResult.innerHTML = `
        <div class="demo-result">
            <h4>Browser Fingerprint Data:</h4>
            ${Object.entries(browserData)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('')}
        </div>
    `;
}

function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#7F7F7F';
    ctx.fillText('Browser Fingerprint', 2, 2);
    
    return canvas.toDataURL().slice(-32);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function demonstrateCSRF() {
    const csrfArea = document.getElementById('csrf-area');
    csrfArea.classList.remove('hidden');
    
    const safeRequest = `
        <form action="/api/transfer" method="POST">
            <input type="hidden" name="csrf_token" value="random_token_123">
            <input type="hidden" name="amount" value="1000">
        </form>
    `;
    
    csrfArea.innerHTML = `
        <div class="demo-result">
            <h4>Unsafe Request:</h4>
            <p class="unsafe">GET /api/transfer?amount=1000</p>
            <h4>Safe Request with CSRF Token:</h4>
            <p class="safe">${escapeHtml(safeRequest)}</p>
        </div>
    `;
}

function demonstrateSQLi() {
    const sqliArea = document.getElementById('sqli-area');
    const sqliInput = document.getElementById('sqli-input');
    const sqliOutput = document.getElementById('sqli-output');
    
    sqliArea.classList.remove('hidden');
    
    // Scope the click handlers to SQL injection demo only
    document.querySelectorAll('.consent-card:has(#sqli-area) .demo-instructions code').forEach(code => {
        code.addEventListener('click', () => {
            sqliInput.value = code.textContent;
            sqliInput.dispatchEvent(new Event('input'));
        });
    });
    
    sqliInput.addEventListener('input', function() {
        const userInput = this.value;
        const unsafeQuery = `SELECT * FROM users WHERE username = '${userInput}'`;
        const safeQuery = {
            text: 'SELECT * FROM users WHERE username = $1',
            values: [userInput]
        };
        
        sqliOutput.innerHTML = `
            <div class="demo-result">
                <h4>Unsafe Query (Vulnerable):</h4>
                <p class="unsafe">${escapeHtml(unsafeQuery)}</p>
                <h4>Safe Parameterized Query:</h4>
                <p class="safe">${escapeHtml(safeQuery.text)}</p>
                <p class="safe">Values: [${escapeHtml(JSON.stringify(safeQuery.values))}]</p>
                <p><small>Click any example above to try it</small></p>
            </div>
        `;
    });
}

function demonstrateStorage() {
    const storageArea = document.getElementById('storage-area');
    storageArea.classList.remove('hidden');
    
    // Demo data
    localStorage.setItem('unsafe_token', 'jwt_token_123');
    localStorage.setItem('unsafe_password', 'password123');
    
    const storedData = Object.entries(localStorage)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
    
    storageArea.innerHTML = `
        <div class="demo-result">
            <h4>Exposed LocalStorage Data:</h4>
            ${storedData}
            <p><small>⚠️ Sensitive data in localStorage can be accessed by any JavaScript code on this domain</small></p>
        </div>
    `;
    
    // Clean up demo data
    localStorage.removeItem('unsafe_token');
    localStorage.removeItem('unsafe_password');
} 