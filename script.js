let parentesisAbierto = true;

function agregarNumero(numero) {
    const pantalla = document.getElementById('pantalla');
    pantalla.value += numero;
}

function agregar(caracter) {
    const pantalla = document.getElementById('pantalla');
    pantalla.value += caracter;
}

function limpiar() {
    document.getElementById('pantalla').value = '';
}

function operar(operador) {
    const pantalla = document.getElementById('pantalla');
    pantalla.value += ' ' + operador + ' ';
}

function cambiarSigno() {
    const pantalla = document.getElementById('pantalla');
    if (pantalla.value) {
        pantalla.value = String(-parseFloat(pantalla.value));
    }
}

function alternarParentesis() {
    const pantalla = document.getElementById('pantalla');
    if (parentesisAbierto) {
        pantalla.value += '(';
    } else {
        pantalla.value += ')';
    }
    parentesisAbierto = !parentesisAbierto;
}

function borrar() {
    const pantalla = document.getElementById('pantalla');
    if (pantalla.value) {
        pantalla.value = pantalla.value.slice(0, -1); 
    }
}

function calcular() {
    const pantalla = document.getElementById('pantalla');
    try {
        const expresion = pantalla.value
            .replace(/×/g, '*') 
            .replace(/÷/g, '/') 
            .replace(/(\d+)\s*\(\s*/g, '$1*(');
        pantalla.value = eval(expresion);
    } catch (error) {
        pantalla.value = 'Error'; 
    }
}

