
const criptoSelect=document.querySelector('#criptomonedas');

const monedaFiatSelect=document.querySelector('#moneda');

const formulario=document.querySelector('#formulario');

const resultado=document.querySelector('#resultado');

const monedasBusquedas={
    moneda:'',
    criptomoneda:''
}





document.addEventListener('DOMContentLoaded', () => {

    cargarCriptomonedas();

    formulario.addEventListener('submit', enviarFormilario);

    criptoSelect.addEventListener('change', leerMoneda);

    monedaFiatSelect.addEventListener('change', leerMoneda);
   
    

});

function cargarCriptomonedas(){

    const url="https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado=>consultarCriptomonedas(resultado.Data))
    //.then(criptomonedas=>console.log(criptomonedas))
    .then(criptomonedas=>selectCriptomonedas(criptomonedas))

}

const consultarCriptomonedas = (criptomonedas)=> new Promise(
    
    resolve=>{
    
        resolve(criptomonedas);
    
    }
        
);


function selectCriptomonedas(criptomonedas){
    
        criptomonedas.forEach(cripto=>{
    
            const {FullName, Name}=cripto.CoinInfo;
    
            const option=document.createElement('option');
            option.value=Name;
            option.textContent=FullName;
            criptoSelect.appendChild(option);
    
        });
}


function leerMoneda(e){

    monedasBusquedas[e.target.name]=e.target.value;

    console.log(monedasBusquedas);

}

function enviarFormilario(e){
    e.preventDefault();

    if (monedasBusquedas.moneda=='' || monedasBusquedas.criptomoneda==''){
        alert('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}

function consultarAPI(){
    const {moneda, criptomoneda} = monedasBusquedas;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(equivalencia => {
            console.log('Datos de la API:', equivalencia);
            mostrarCotizacion(equivalencia.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => {
            console.error('Error al consultar la API:', error);
        });
}

function mostrarCotizacion(cotizacion) {
    const resultadoDiv = document.querySelector('#resultado');
    resultadoDiv.innerHTML = `
        <p>Precio: ${cotizacion.PRICE}</p>
        <p>Alta del día: ${cotizacion.HIGHDAY}</p>
        <p>Baja del día: ${cotizacion.LOWDAY}</p>
        <p>Variación en 24 horas: ${cotizacion.CHANGEPCT24HOUR}%</p>
    `;
}