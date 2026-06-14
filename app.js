const DEFAULT_DATA = {
    name: "CAIAZZO GENNARO",
    piva: "01451530057",
    cf: "CZZGNR60B29F839A",
    sdi: "KRRH6B9",
    pec: "",
    address: "VIA ROMA 25\n14031 GRANA MONFERRATO (AT)"
};

let currentCardData = { ...DEFAULT_DATA };

// On Page Load
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Watch for URL Hash changes (supports back/forward navigation)
window.addEventListener('hashchange', () => {
    initApp();
});

/**
 * Initializes the application by reading data from the URL or loading default data
 */
function initApp() {
    const hashData = getHashData();
    if (hashData) {
        currentCardData = hashData;
    } else {
        currentCardData = { ...DEFAULT_DATA };
    }

    renderCard(currentCardData);
    generateQRCode();
    prefillForm(currentCardData);

    // Show Creator button only if query string has ?edit=true or ?editor=true
    const urlParams = new URLSearchParams(window.location.search);
    const isEditor = urlParams.has('edit') || urlParams.has('editor');
    const btnToggle = document.getElementById('btnCreatorToggle');
    const cardFooter = document.getElementById('cardFooter');
    if (isEditor) {
        btnToggle.classList.remove('hidden');
        cardFooter.classList.remove('hidden');
    } else {
        btnToggle.classList.add('hidden');
        cardFooter.classList.add('hidden');
    }
}

/**
 * Renders the data in the card DOM elements
 */
function renderCard(data) {
    document.getElementById('displayName').textContent = data.name || 'NOME AZIENDA';
    document.getElementById('displayPIVA').textContent = data.piva || '-';
    document.getElementById('displayCF').textContent = data.cf || '-';
    document.getElementById('displaySDI').textContent = data.sdi || '-';
    document.getElementById('displayAddress').textContent = data.address || '-';

    // PEC handling (only display if it exists)
    const pecRow = document.getElementById('row-pec');
    const pecVal = document.getElementById('displayPEC');
    if (data.pec && data.pec.trim() !== "") {
        pecVal.textContent = data.pec;
        pecRow.classList.remove('hidden');
    } else {
        pecVal.textContent = "";
        pecRow.classList.add('hidden');
    }
}

/**
 * Copies a field's value to the clipboard and gives visual feedback
 */
async function copyField(elementId, btn) {
    const textToCopy = document.getElementById(elementId).textContent.trim();
    if (!textToCopy) return;

    try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback swap
        const iconCopy = btn.querySelector('.icon-copy');
        const iconCheck = btn.querySelector('.icon-check');
        const labelText = btn.querySelector('span');

        iconCopy.classList.add('hidden');
        iconCheck.classList.remove('hidden');
        labelText.textContent = 'Copiato!';
        btn.classList.add('btn-success-active');

        // Reset feedback after 2 seconds
        setTimeout(() => {
            iconCopy.classList.remove('hidden');
            iconCheck.classList.add('hidden');
            labelText.textContent = 'Copia';
            btn.classList.remove('btn-success-active');
        }, 2000);

    } catch (err) {
        console.error('Errore durante la copia negli appunti: ', err);
        alert('Impossibile copiare il testo. Copialo manualmente.');
    }
}

/**
 * Generates the QR Code for the current card URL
 */
function generateQRCode() {
    const canvas = document.getElementById('qrcodeCanvas');
    const currentURL = window.location.href;

    // We use the QRCode library loaded via CDN
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(canvas, currentURL, {
            width: 280,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        }, function (error) {
            if (error) console.error(error);
        });
    } else {
        console.warn('Libreria QRCode non caricata.');
    }
}

/**
 * Encodes the custom data to Base64 and updates the URL hash
 */
function generateCustomCard(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('inputName').value.trim().toUpperCase(),
        piva: document.getElementById('inputPIVA').value.trim(),
        cf: document.getElementById('inputCF').value.trim().toUpperCase(),
        sdi: document.getElementById('inputSDI').value.trim().toUpperCase(),
        pec: document.getElementById('inputPEC').value.trim(),
        address: document.getElementById('inputAddress').value.trim()
    };

    try {
        const encoded = encodeData(data);
        window.location.hash = `data=${encoded}`;
        toggleCreator(); // Close form and show card
    } catch (e) {
        console.error("Errore di codifica: ", e);
        alert("Si è verificato un errore durante la generazione dei dati.");
    }
}

/**
 * Prefills the creator form with current data
 */
function prefillForm(data) {
    document.getElementById('inputName').value = data.name || '';
    document.getElementById('inputPIVA').value = data.piva || '';
    document.getElementById('inputCF').value = data.cf || '';
    document.getElementById('inputSDI').value = data.sdi || '';
    document.getElementById('inputPEC').value = data.pec || '';
    document.getElementById('inputAddress').value = data.address || '';
}

/**
 * Toggles the visibility of the creator form
 */
function toggleCreator() {
    const cardView = document.getElementById('cardView');
    const creatorView = document.getElementById('creatorView');

    if (creatorView.classList.contains('hidden')) {
        creatorView.classList.remove('hidden');
        cardView.classList.add('hidden');
    } else {
        creatorView.classList.add('hidden');
        cardView.classList.remove('hidden');
    }
}

/* Base64 Unicode helpers */
function encodeData(obj) {
    const str = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeData(base64Str) {
    try {
        const str = decodeURIComponent(escape(atob(base64Str)));
        return JSON.parse(str);
    } catch (e) {
        console.error("Errore decodifica Base64:", e);
        return null;
    }
}

/**
 * Retrieves and decodes card data from the URL hash
 */
function getHashData() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#data=')) {
        const base64Str = hash.substring(6);
        return decodeData(base64Str);
    }
    return null;
}
