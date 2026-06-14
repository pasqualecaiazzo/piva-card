// Default billing details (CAIAZZO GENNARO)
const DEFAULT_DATA = {
    name: "CAIAZZO GENNARO",
    piva: "01451530057",
    cf: "CZZGNR60B29F839A",
    sdi: "KRRH6B9",
    pec: "",
    address: "VIA ROMA 25\n14031 GRANA MONFERRATO (AT)"
};

// On Page Load
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initializes the application
 */
function initApp() {
    renderCard(DEFAULT_DATA);
    generateQRCode();
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
    const currentURL = window.location.origin + window.location.pathname; // Just the clean base URL without query strings

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
