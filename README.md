# Digital P.IVA Card Generator

Questa è un'applicazione web statica (HTML/CSS/JS) minimalista ed elegante per visualizzare, condividere e copiare facilmente i dati di fatturazione elettronica (Partita IVA, SDI, Codice Fiscale) di **CAIAZZO GENNARO** (o di qualsiasi altra azienda compilando il modulo).

## Come Funziona (Architettura Serverless)

L'applicazione non utilizza database né server:
* Se visitata all'URL principale (senza parametri), mostra la card precompilata con i dati di **CAIAZZO GENNARO**.
* Cliccando su "Crea / Modifica Card", l'utente può inserire nuovi dati.
* All'invio del modulo, i dati vengono convertiti in JSON, codificati in Base64 e aggiunti come hash dell'URL: `https://<dominio>/#data=<stringa_base64>`.
* Il QR Code si rigenera automaticamente includendo questo URL aggiornato.
* Chiunque scansionerà il QR Code aprirà direttamente la pagina con la card compilata, potendo copiare i dati con un clic.

---

## Come Eseguire Localmente

Per testare l'applicazione sul tuo computer:

1. Apri il terminale e posizionati nella cartella del progetto:
   ```bash
   cd /Users/pasqualecaiazzo/.gemini/antigravity/scratch/piva-card
   ```
2. Avvia un server locale leggero. Ad esempio, usando `python3`:
   ```bash
   python3 -m http.server 8000
   ```
   *Oppure usando `npx` (Node):*
   ```bash
   npx serve .
   ```
3. Apri il browser all'indirizzo [http://localhost:8000](http://localhost:8000) o a quello indicato dal terminale.

---

## Come Pubblicare su GitHub e Cloudflare Pages

Segui questi passaggi per pubblicare l'applicazione online e ottenere un link dev di Cloudflare del tipo `*.pages.dev` senza costi e senza usare il tuo dominio personale:

### 1. Inizializza Git e fai il push su GitHub

1. Crea una nuova repository su GitHub (es. chiamala `piva-card`) lasciandola vuota (non spuntare le caselle per aggiungere README o .gitignore).
2. Nel terminale, esegui i seguenti comandi per inizializzare il progetto locale e caricarlo su GitHub:

   ```bash
   # Posizionati nella cartella (se non ci sei già)
   cd /Users/pasqualecaiazzo/.gemini/antigravity/scratch/piva-card

   # Inizializza il repository locale
   git init

   # Aggiungi tutti i file
   git add .

   # Crea il primo commit
   git commit -m "Initial commit - minimalist PIVA card"

   # Rinomina il branch principale in main
   git branch -M main

   # Collega la tua repo remota di GitHub (sostituisci con il tuo username ed il nome della tua repo)
   git remote add origin https://github.com/IL_TUO_USERNAME/piva-card.git

   # Effettua il push su GitHub
   git push -u origin main
   ```

### 2. Collega la Repository a Cloudflare Pages

1. Accedi alla dashboard di [Cloudflare](https://dash.cloudflare.com/).
2. Nel menu a sinistra, clicca su **Workers & Pages**.
3. Clicca sul pulsante **Create** e poi seleziona la scheda **Pages**.
4. Clicca su **Connect to Git** e seleziona il tuo account GitHub (se non lo hai già fatto, autorizza Cloudflare ad accedere alle tue repository).
5. Seleziona la repository appena creata (`piva-card`) e clicca su **Begin setup**.
6. Nella pagina di configurazione:
   * **Project name**: Lascia `piva-card` (sarà usato per l'URL, es: `piva-card.pages.dev`).
   * **Production branch**: `main`.
   * **Framework preset**: Seleziona **None** (trattandosi di file statici puri).
   * **Build command**: Lascia vuoto.
   * **Build output directory**: Lascia vuoto (o imposta `/` per indicare la root).
7. Clicca su **Save and Deploy**.

Da questo momento, ogni volta che farai un aggiornamento del codice ed eseguirai un `git push`, Cloudflare Pages aggiornerà automaticamente il sito in pochi secondi! Il tuo link pubblico sarà del tipo `https://piva-card.pages.dev`.
