// Obtención del lienzo HTML y activación del contexto gráfico 2D
const canvas = document.getElementById('fondo');
const ctx = canvas.getContext('2d');

// Ajusta el tamaño del Canvas dinámicamente al tamaño exacto de la ventana
function ajustar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
ajustar();
// Si el usuario cambia el tamaño del navegador, recalculamos las dimensiones del lienzo
window.addEventListener('resize', ajustar);

// Arreglo estructural donde se almacenan las 60 partículas activas
const particulas = [];
for (let i = 0; i < 60; i++) {
    particulas.push({
        x: Math.random() * canvas.width,   // Posición inicial horizontal
        y: Math.random() * canvas.height,  // Posición inicial vertical
        dx: (Math.random() - 0.5) * 0.4,   // Vector de velocidad X (-0.2 a 0.2)
        dy: (Math.random() - 0.5) * 0.4,   // Vector de velocidad Y (-0.2 a 0.2)
        r: Math.random() * 2 + 0.5         // Radio o grosor del punto
    });
}

// BUCLE PRINCIPAL DE ANIMACIÓN:
// 'requestAnimationFrame' actualiza los dibujos a 60 cuadros por segundo para máxima fluidez.
function animar() {
    // 1. Limpiamos el cuadro anterior para no dejar rastro
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Movemos cada partícula sumándole su velocidad a su posición actual
    particulas.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        
        // Detección de colisión con los bordes de la pantalla (si choca, rebota multiplicando por -1)
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        
        // Dibujamos el círculo en la pantalla
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 148, 158, 0.3)';
        ctx.fill();
    });
    
    // Volvemos a invocar la función en el siguiente cuadro de la GPU
    requestAnimationFrame(animar);
}
animar();

/* 
   SECCIÓN 2: LÓGICA DE VALIDACIÓN Y CÁLCULO DE VOLÚMENES
    */

/**
 * FUNCIÓN DE VALIDACIÓN:
 * Comprueba que el valor ingresado por el usuario sea un número real y mayor que cero.
 * Devuelve un objeto { ok: true/false, val/msg }.
 */
function validar(valor, nombreCampo) {
    let num = parseFloat(valor);
    if (isNaN(num) || num <= 0) {
        return { ok: false, msg: `${nombreCampo} debe ser > 0` };
    }
    return { ok: true, val: num };
}

/**
 * FUNCIÓN DE VISUALIZACIÓN:
 * Imprime el texto del resultado formateado y llena proporcionalmente la barra verde.
 */
function mostrar(idRes, valor, esValido = true) {
    const div = document.getElementById(idRes);
    const span = div.querySelector('span');
    const barra = div.querySelector('.lleno');
    
    if (esValido) {
        // Formateo del número a 3 decimales según el formato regional
        let formatoVolumen = valor.toLocaleString('es-ES', { 
            minimumFractionDigits: 3, 
            maximumFractionDigits: 3 
        });
        span.textContent = `Volumen: ${formatoVolumen} cm³`;
        span.style.color = '#3fb950'; // Color verde de éxito
        
        // Calculamos el porcentaje lleno considerando 1000 cm³ como el 100% de la barra
        let porcentaje = Math.min((valor / 1000) * 100, 100);
        barra.style.width = porcentaje + '%';
        barra.style.background = '#238636';
    } else {
        // En caso de error de entrada
        span.textContent = `❌ ${valor}`;
        span.style.color = '#f85149'; // Color rojo de error
        barra.style.width = '0%';
    }
}

/**
 * FUNCIÓN PRINCIPAL 'calcular(figura)':
 * Procesa la operación geométrica correspondiente a la figura seleccionada.
 */
function calcular(figura) {
    let idRes, v1, v2, formula;
    
    // --- CÁLCULO CILINDRO ---
    if (figura === 'cilindro') {
        idRes = 'resCil';
        let r = validar(document.getElementById('rCil').value, 'Radio');
        let h = validar(document.getElementById('aCil').value, 'Altura');
        if (!r.ok) return mostrar(idRes, r.msg, false);
        if (!h.ok) return mostrar(idRes, h.msg, false);
        
        v1 = r.val; 
        v2 = h.val;
        // Fórmula del Cilindro: V = π * r² * h
        formula = () => Math.PI * Math.pow(v1, 2) * v2;
    }
    
    // --- CÁLCULO CONO ---
    else if (figura === 'cono') {
        idRes = 'resCon';
        let r = validar(document.getElementById('rCon').value, 'Radio');
        let h = validar(document.getElementById('aCon').value, 'Altura');
        if (!r.ok) return mostrar(idRes, r.msg, false);
        if (!h.ok) return mostrar(idRes, h.msg, false);
        
        v1 = r.val; 
        v2 = h.val;
        // Fórmula del Cono: V = (1/3) * π * r² * h
        formula = () => (1 / 3) * Math.PI * Math.pow(v1, 2) * v2;
    }
    
    // --- CÁLCULO ESFERA ---
    else if (figura === 'esfera') {
        idRes = 'resEsf';
        let r = validar(document.getElementById('rEsf').value, 'Radio');
        if (!r.ok) return mostrar(idRes, r.msg, false);
        
        v1 = r.val;
        // Fórmula de la Esfera: V = (4/3) * π * r³
        formula = () => (4 / 3) * Math.PI * Math.pow(v1, 3);
    }
    
    // --- CÁLCULO CUBO ---
    else if (figura === 'cubo') {
        idRes = 'resCub';
        let l = validar(document.getElementById('lCub').value, 'Lado');
        if (!l.ok) return mostrar(idRes, l.msg, false);
        
        v1 = l.val;
        // Fórmula del Cubo: V = Lado³
        formula = () => Math.pow(v1, 3);
    }
    
    // Ejecución de la fórmula asignada e impresión del resultado final
    let resultadoFinal = formula();
    mostrar(idRes, resultadoFinal, true);
}

// Resetea todas las tarjetas simultáneamente
function limpiarTodo() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('.resultado').forEach(res => {
        res.querySelector('span').textContent = 'Volumen: --- cm³';
        res.querySelector('span').style.color = '#3fb950';
        res.querySelector('.lleno').style.width = '0%';
    });
}

// Asigna eventos individuales a los botones "Limpiar" de cada tarjeta
document.querySelectorAll('.limpiar').forEach(boton => {
    boton.addEventListener('click', function() {
        let tarjetaPadre = this.closest('.card');
        tarjetaPadre.querySelectorAll('input').forEach(input => input.value = '');
        let res = tarjetaPadre.querySelector('.resultado');
        res.querySelector('span').textContent = 'Volumen: --- cm³';
        res.querySelector('span').style.color = '#3fb950';
        res.querySelector('.lleno').style.width = '0%';
    });
});

// Permite presionar la tecla "Enter" en los campos para ejecutar el cálculo
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            let tarjetaPadre = this.closest('.card');
            let botonCalcular = tarjetaPadre.querySelector('[onclick*="calcular"]');
            if (botonCalcular) botonCalcular.click();
        }
    });
});