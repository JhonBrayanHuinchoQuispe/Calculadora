let expresionActual = '';
let resultadoParcial = '';
let esperandoSegundoOperando = false;
let parentesisAbiertos = 0;
let ultimaOperacion = false;

function actualizarPantalla() {
    const pantalla = document.getElementById('pantalla');
    const resultadoElement = document.getElementById('resultado-parcial');
    pantalla.value = expresionActual;
    resultadoElement.textContent = resultadoParcial;
}

function agregarNumero(numero) {
    if (ultimaOperacion) {
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
            expresionActual += caracter;
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
        expresionActual = '(' + expresionActual;
        parentesisAbiertos++;
        ultimaOperacion = false;
    } else {
        if (parentesisAbiertos > 0 && !/[\+\-\×\/\(]\s*$/.test(expresionActual)) {
            expresionActual += ')';
            parentesisAbiertos--;
        } else {
            if (expresionActual !== '' && 
                !/[\+\-\×\/\(]\s*$/.test(expresionActual) && 
                !/\s$/.test(expresionActual)) {
                expresionActual += ' × ';
            }
            expresionActual += '(';
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
