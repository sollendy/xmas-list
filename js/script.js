// si prepara una chiave per lo storage affinché la spesa non si perda
const CHIAVE_STORAGE = "lista-natale";

const totalSlot = document.querySelector('.totale');
const giftsListElement = document.querySelector('.lista-doni');

const form = document.querySelector('#form-dono');
const nameField = document.querySelector('#campo-nome');
const priceField = document.querySelector('#campo-costo');
const descriptionField = document.querySelector('#campo-descrizione');

let regali = [];

// faccio un controllo per vedere se c'è roba nello storage
const preLista = localStorage.getItem(CHIAVE_STORAGE);
// se c'è roba
if(preLista){
    // usiamo la lista di prima al posto di quella vuota
    regali = JSON.parse(preLista);

    // ricalcola il totale
    calcoloTotale();

    // restituisci in pagina
    mostraLista();
}

// funzione anonima che cattura i dati dal form
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // console.log(event);
    // con questo comando possiamo ottenere diverse informazioni utili sulla natura dell'evento
    // riprendo i dati dai campi
    const nome = nameField.value.trim();
    const prezzo = priceField.value.trim();
    const descrizione = descriptionField.value.trim();
    // aggiungo un regalo alla lista
    mettiDono(nome, prezzo, descrizione);

    // ripulisco i campi
    form.reset();

    // rimetto il focus sul primo campo
    nameField.focus();
});


// FUNZIONI
// F. per aggiungere regali alla mia lista
function mettiDono(nome, prezzo, descrizione){
    // creo un oggetto corrispondente al regalo
    const neoRegalo = {
        nome: nome,
        prezzo: Number(prezzo),
        descrizione: descrizione
    }

    // l'oggetto aggiunto verrà messo in lista
    regali.push(neoRegalo);

    // aggiornare il localstorage affinché non si perda la spesa se la pagina viene rinfresata
    localStorage.setItem(CHIAVE_STORAGE, JSON.stringify(regali));

    // calcolo il totale
    calcoloTotale();

    // diamo a schermo la lista regali
    mostraLista();
}

// F. per calcolare il totale
function calcoloTotale(){
    // mi preparo il calcolo
    let totale = 0;
    
    // per ogni regalo..
    for(let i = 0; i < regali.length; i++){
        // mettiamo il prezzo totale
        totale += regali[i].prezzo;
        // oppure
        //totale = totale + regali[i].prezzo;
    }

    // mostriamo a schermo il totale
    totalSlot.innerText = formattaConto(totale);
}

// F. di formattazione di cifre
function formattaConto(conto){
    return conto.toFixed(2) + "€";
}

// F. per mostrare la lista regali a schermo

function mostraLista(){
    // svuotiamo la lista precedente 
    giftsListElement.innerHTML = "";

    // per ogni dono..
    for(let i = 0; i < regali.length; i++) {
        // creo il codice per un singolo pezzo della lista
        const regaloEl = creaElLista(i);

        // lo appiccico in pagina nella lista
        giftsListElement.innerHTML += regaloEl;

        // rendo funzionanti i bottoni
        attivaBtnCanc();
    }
}

// F. per creare un elemento della lista
function creaElLista(i) {
    // ripesco il mio regalo
    const regalo = regali[i];

    return `
    <li class="dono">
            <div class="info-dono">
                <h3>${regalo.nome}</h3>
                <p>${regalo.descrizione}</p>
            </div>
        <strong class="prezzo-dono">${formattaConto(regalo.prezzo)}</strong>
        <button class="bottone-dono" data-index="${i}">❌</button>
    </li>`;
}

//F. per attivare i bottoni cancella
function attivaBtnCanc(){
    //riprendere tutti i btn regali
    const btnCanc = document.querySelectorAll(".bottone-dono");

    // per ognuno dei btn..
    for(let i = 0; i < btnCanc.length; i++){
        // per agevolarci recuperiamo anche nel ciclo ciascun bottone
        const bottone = btnCanc[i];

        // includo l'evento
        bottone.addEventListener("click", function(){
            // intercetto il giusto indice
            const indice = bottone.dataset.index;

            // tolgo dalla lista il regalo in questione
            togliRegalo(indice);
        });
    }
}

// F. per togliere regali dalla lista
function togliRegalo(index){
    // togliamo il dono dalla lista
    regali.splice(index, 1);

    // aggiornare il localstorage affinché non si perda la spesa se la pagina viene rinfresata
    localStorage.setItem(CHIAVE_STORAGE, JSON.stringify(regali));

    // ricalcolo il totale
    calcoloTotale();

    // restituire la lista
    mostraLista();
}