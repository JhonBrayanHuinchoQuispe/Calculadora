let expresionActual = '';
let resultadoParcial = '';
let esperandoSegundoOperando = false;
let parentesisAbiertos = 0;
let ultimaOperacion = false;
let modoRadianes = true;
let modoLuz = false;
let modoCientifico = false;
let memoria = 0;
let historial = [];

const CONSTANTES = {
    'π': Math.PI,
    'e': Math.E
};

function inicializar() {
    cargarConfiguracion();
    configurarEventListeners();
    actualizarInterfaz();
    limpiar();
}

function cargarConfiguracion() {
    modoLuz = localStorage.getItem('calculadora-tema') === 'light';
    modoCientifico = localStorage.getItem('calculadora-modo') === 'cientifico';
    memoria = parseFloat(localStorage.getItem('calculadora-memoria')) || 0;
    historial = JSON.parse(localStorage.getItem('calculadora-historial')) || [];
    
    document.body.setAttribute('data-theme', modoLuz ? 'light' : 'dark');
}

function guardarConfiguracion() {
    localStorage.setItem('calculadora-tema', modoLuz ? 'light' : 'dark');
    localStorage.setItem('calculadora-modo', modoCientifico ? 'cientifico' : 'basico');
    localStorage.setItem('calculadora-memoria', memoria.toString());
    localStorage.setItem('calculadora-historial', JSON.stringify(historial));
}

function configurarEventListeners() {
    document.getElementById('toggle-theme').addEventListener('click', alternarTema);
    
    document.getElementById('toggle-mode').addEventListener('click', alternarModo);
    
    document.getElementById('history-toggle').addEventListener('click', alternarHistorial);
    
    document.getElementById('clear-history').addEventListener('click', limpiarHistorial);
    
    document.addEventListener('keydown', manejarTeclado);
    
    window.addEventListener('resize', ajustarInterfazMovil);
}

function actualizarPantalla() {
    const pantalla = document.getElementById('pantalla');
    const resultadoElement = document.getElementById('resultado-parcial');
    const memoriaIndicator = document.getElementById('memoria-indicator');
    
    pantalla.value = expresionActual;
    resultadoElement.textContent = resultadoParcial;
    
    memoriaIndicator.classList.toggle('active', memoria !== 0);
}

function actualizarInterfaz() {
    const botonesCientificos = document.getElementById('botones-cientificos');
    const modeButton = document.getElementById('toggle-mode');
    const themeButton = document.getElementById('toggle-theme');
    
    botonesCientificos.classList.toggle('show', modoCientifico);
    modeButton.innerHTML = modoCientifico ? 
        '<i class="fas fa-calculator"></i><span>Básico</span>' : 
        '<i class="fas fa-microscope"></i><span>Científico</span>';
    
    themeButton.innerHTML = modoLuz ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    actualizarHistorial();
    guardarConfiguracion();
}

function alternarTema() {
    modoLuz = !modoLuz;
    document.body.setAttribute('data-theme', modoLuz ? 'light' : 'dark');
    actualizarInterfaz();
}

function alternarModo() {
    modoCientifico = !modoCientifico;
    actualizarInterfaz();
}

function alternarHistorial() {
    const historialPanel = document.getElementById('history-panel');
    historialPanel.classList.toggle('show');
}

function ajustarInterfazMovil() {
    const isMobile = window.innerWidth <= 768;
    const historialPanel = document.getElementById('history-panel');
    
    if (isMobile && historialPanel.classList.contains('show')) {
        historialPanel.style.maxHeight = '50vh';
    }
}

function agregarNumero(numero) {
    if (ultimaOperacion) {
        expresionActual = '';
        ultimaOperacion = false;
    }
    
    if (expresionActual.endsWith(')')) {
        expresionActual += ' × ';
    }
    
    if (expresionActual.endsWith('%')) {
        expresionActual += ' × ';
    }
    
    expresionActual += numero;
    esperandoSegundoOperando = false;
    calcularParcial();
    actualizarPantalla();
}

function agregar(caracter) {
    if (ultimaOperacion) {
        if (caracter === '.' && !expresionActual.includes('.')) {
            expresionActual = '0' + caracter;
        } else {
            expresionActual = '';
        }
        ultimaOperacion = false;
    } else {
        if (caracter === '.' && expresionActual.split(/[\+\-\×\/]/).pop().includes('.')) {
            return;
        }
        
        if (caracter === '.' && (expresionActual === '' || /[\+\-\×\/]\s*$/.test(expresionActual))) {
            expresionActual += '0';
        }
        
        expresionActual += caracter;
    }
    
    esperandoSegundoOperando = false;
    calcularParcial();
    actualizarPantalla();
}

function limpiar() {
    expresionActual = '';
    resultadoParcial = '';
    esperandoSegundoOperando = false;
    parentesisAbiertos = 0;
    ultimaOperacion = false;
    actualizarPantalla();
}

function operar(operador) {
    if (ultimaOperacion) {
        ultimaOperacion = false;
    }
    
    if (/[\+\-\×\/]\s*$/.test(expresionActual)) {
        expresionActual = expresionActual.replace(/[\+\-\×\/]\s*$/, operador + ' ');
    } else {
        if (resultadoParcial !== '' && expresionActual === '') {
            expresionActual = resultadoParcial;
            resultadoParcial = '';
        }
        expresionActual += ' ' + operador + ' ';
    }
    
    esperandoSegundoOperando = true;
    calcularParcial();
    actualizarPantalla();
}

function calcularPorcentaje() {
    if (expresionActual === '') return;
    
    if (ultimaOperacion) {
        ultimaOperacion = false;
    }
    
    let ultimaParteNumerica = extraerUltimaParteNumerica(expresionActual);
    if (!ultimaParteNumerica) return;
    
    let contieneProcentaje = ultimaParteNumerica.includes('%');
    
    if (contieneProcentaje) {
        expresionActual = expresionActual + '%';
    } else {
        let indiceInicio = expresionActual.lastIndexOf(ultimaParteNumerica);
        expresionActual = expresionActual.substring(0, indiceInicio) + 
                          ultimaParteNumerica + '%' + 
                          expresionActual.substring(indiceInicio + ultimaParteNumerica.length);
    }
    
    calcularParcial();
    actualizarPantalla();
}

function extraerUltimaParteNumerica(expresion) {
    if (expresion.endsWith('%')) {
        let indice = expresion.length - 1;
        while (indice >= 0 && (expresion[indice] === '%' || !isNaN(expresion[indice]) || expresion[indice] === '.')) {
            indice--;
        }
        return expresion.substring(indice + 1);
    }
    
    let partes = expresion.split(/(\s[\+\-\×\/]\s)/);
    let ultimaParte = partes[partes.length - 1];
    
    if (!isNaN(parseFloat(ultimaParte))) {
        return ultimaParte;
    }
    
    return null;
}

function alternarParentesis() {
    if (ultimaOperacion) {
        ultimaOperacion = false;
        expresionActual += '(';
        parentesisAbiertos++;
    } else {
        if (parentesisAbiertos > 0 && !/[\+\-\×\/\(]\s*$/.test(expresionActual)) {
            expresionActual += ')';
            parentesisAbiertos--;
        } else {
            if (expresionActual !== '' && 
                !/[\+\-\×\/\(]\s*$/.test(expresionActual) && 
                !/\s$/.test(expresionActual) &&
                /\d$/.test(expresionActual)) {
                expresionActual += ' × (';
            } else {
                expresionActual += '(';
            }
            parentesisAbiertos++;
        }
    }
    
    calcularParcial();
    actualizarPantalla();
}

function borrar() {
    if (expresionActual.length > 0) {
        if (ultimaOperacion) {
            expresionActual = expresionActual.slice(0, -1);
            if (expresionActual === '') {
                limpiar();
                return;
            }
        } else {
            const ultimoCaracter = expresionActual.slice(-1);
            if (ultimoCaracter === '(') {
                parentesisAbiertos--;
            } else if (ultimoCaracter === ')') {
                parentesisAbiertos++;
            }
            
            if (expresionActual.slice(-1) === ' ') {
                expresionActual = expresionActual.slice(0, -3);  
            } else {
                expresionActual = expresionActual.slice(0, -1);
            }
        }
        
        calcularParcial();
        actualizarPantalla();
    }
}

function calcularParcial() {
    if (expresionActual === '') {
        resultadoParcial = '';
        return;
    }
    
    try {
        let expresionFinal = expresionActual;
        for (let i = 0; i < parentesisAbiertos; i++) {
            expresionFinal += ')';
        }
        
        expresionFinal = expresionFinal
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        let expresionEvaluable = procesarPorcentajes(expresionFinal);
        
        expresionEvaluable = manejarMultiplicacionesImplicitas(expresionEvaluable);
        
        if (/\/\s*0(?![0-9.])/.test(expresionEvaluable)) {
            resultadoParcial = 'Error';
            return;
        }
        
        let resultadoCalculo = eval(expresionEvaluable);
        
        if (!isFinite(resultadoCalculo) || isNaN(resultadoCalculo)) {
            resultadoParcial = 'Error';
            return;
        }
        
        if (resultadoCalculo.toString().length > 10) {
            if (Math.abs(resultadoCalculo) < 1) {
                resultadoCalculo = parseFloat(resultadoCalculo.toPrecision(8));
            } else {
                resultadoCalculo = parseFloat(resultadoCalculo.toFixed(8));
            }
        }
        
        resultadoParcial = resultadoCalculo.toString();
    } catch (error) {
        resultadoParcial = 'Error';
    }
}

function procesarPorcentajes(expresion) {
    let expresionProcesada = expresion;
    
    function contarPorcentajes(str, indice) {
        let contador = 0;
        while (indice < str.length && str[indice] === '%') {
            contador++;
            indice++;
        }
        return contador;
    }
    
    let regex = /(\d+\.?\d*)(%+)/g;
    let match;
    
    let sustituciones = [];
    
    while ((match = regex.exec(expresion)) !== null) {
        let numeroBase = parseFloat(match[1]);
        let cantidadPorcentajes = match[2].length;
        let valorCalculado = numeroBase;
        
        for (let i = 0; i < cantidadPorcentajes; i++) {
            valorCalculado = valorCalculado / 100;
        }
        
        sustituciones.push({
            original: match[0],
            reemplazo: valorCalculado.toString()
        });
    }
    
    for (let i = sustituciones.length - 1; i >= 0; i--) {
        expresionProcesada = expresionProcesada.replace(
            sustituciones[i].original, 
            sustituciones[i].reemplazo
        );
    }
    
    return expresionProcesada;
}

function manejarMultiplicacionesImplicitas(expresion) {
    expresion = expresion.replace(/(\d+)(\()/g, '$1 * $2');
    expresion = expresion.replace(/\)(\()/g, ') * $1');
    expresion = expresion.replace(/\)(\d+)/g, ') * $1');
    
    return expresion;
}

function calcular() {
    if (expresionActual === '') return;
    
    try {
        let expresionFinal = expresionActual;
        for (let i = 0; i < parentesisAbiertos; i++) {
            expresionFinal += ')';
        }
        
        expresionFinal = expresionFinal
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        let expresionEvaluable = procesarPorcentajes(expresionFinal);
        
        expresionEvaluable = manejarMultiplicacionesImplicitas(expresionEvaluable);
        
        if (/\/\s*0(?![0-9.])/.test(expresionEvaluable)) {
            expresionActual = 'Error';
            resultadoParcial = '';
            actualizarPantalla();
            setTimeout(() => {
                limpiar();
            }, 1500);
            return;
        }
        
        let resultadoCalculo = eval(expresionEvaluable);
        
        if (!isFinite(resultadoCalculo) || isNaN(resultadoCalculo)) {
            expresionActual = 'Error';
            resultadoParcial = '';
            actualizarPantalla();
            setTimeout(() => {
                limpiar();
            }, 1500);
            return;
        }
        
        if (resultadoCalculo.toString().length > 10) {
            if (Math.abs(resultadoCalculo) < 1) {
                resultadoCalculo = parseFloat(resultadoCalculo.toPrecision(8));
            } else {
                resultadoCalculo = parseFloat(resultadoCalculo.toFixed(8));
            }
        }
        
        expresionActual = resultadoCalculo.toString();
        resultadoParcial = '';
        parentesisAbiertos = 0;
        ultimaOperacion = true;  
        actualizarPantalla();
    } catch (error) {
        expresionActual = 'Error';
        resultadoParcial = '';
        actualizarPantalla();
        setTimeout(() => {
            limpiar();
        }, 1500);
    }
}

document.addEventListener('keydown', function(event) {
    if (/[0-9]/.test(event.key)) {
        agregarNumero(event.key);  
    } else if (event.key === '.') {
        agregar('.');
    } else if (event.key === '+') {
        operar('+');
    } else if (event.key === '-') {
        operar('-');
    } else if (event.key === '*' || event.key === 'x' || event.key === 'X') {
        operar('×');
    } else if (event.key === '/') {
        operar('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
        calcular();
    } else if (event.key === 'Escape') {
        limpiar();
    } else if (event.key === 'Backspace') {
        borrar();
    } else if (event.key === '(' || event.key === ')') {
        alternarParentesis();
    } else if (event.key === '%') {
        calcularPorcentaje();
    }
});

window.onload = function() {
    limpiar();
};
