document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("convertidor-form");
    const resultadosBody = document.getElementById("resultados-body");
    const tasaPENInput = document.getElementById("tasa-pen");
    const tasaUSDInput = document.getElementById("tasa-usd");

    // Cargar los tipos de cambio guardados en localStorage al cargar la página
    cargarTasasCambio();

    // Cargar resultados almacenados en localStorage al cargar la página
    cargarResultados();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const montoCPL = parseFloat(document.getElementById("monto").value);
        const tasaPEN = parseFloat(tasaPENInput.value);
        const tasaUSD = parseFloat(tasaUSDInput.value);

        // Verifica que los valores ingresados son números válidos
        if (isNaN(montoCPL) || isNaN(tasaPEN) || isNaN(tasaUSD)) {
            alert("Por favor ingresa valores válidos.");
            return;
        }

        // Realiza la conversión
        const resultadoPEN = (montoCPL * tasaPEN).toFixed(4);  // Hasta 4 decimales
        const resultadoUSD = (montoCPL * tasaUSD).toFixed(4);  // Hasta 4 decimales

        // Agregar resultados a la tabla y guardar en localStorage
        agregarResultado(montoCPL, resultadoPEN, resultadoUSD);
        guardarEnLocalStorage(montoCPL, resultadoPEN, resultadoUSD);

        // Guardar las tasas de cambio en localStorage
        guardarTasasCambio(tasaPEN, tasaUSD);

        // Limpiar el formulario
        form.reset();
    });

    function agregarResultado(montoCPL, resultadoPEN, resultadoUSD) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${montoCPL.toFixed(4)}</td> <!-- Formato de salida a 4 decimales -->
            <td>${resultadoPEN}</td>
            <td>${resultadoUSD}</td>
        `;

        // Agregar la nueva fila al inicio de la tabla
        resultadosBody.insertBefore(row, resultadosBody.firstChild);
    }

    function guardarEnLocalStorage(montoCPL, resultadoPEN, resultadoUSD) {
        const resultado = { montoCPL, resultadoPEN, resultadoUSD };
        let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

        // Insertar el nuevo resultado al inicio del array
        resultados.unshift(resultado);

        localStorage.setItem("resultados", JSON.stringify(resultados));
    }

    function cargarResultados() {
        const resultados = JSON.parse(localStorage.getItem("resultados")) || [];

        resultados.forEach(({ montoCPL, resultadoPEN, resultadoUSD }) => {
            agregarResultado(montoCPL, resultadoPEN, resultadoUSD);
        });
    }

    function guardarTasasCambio(tasaPEN, tasaUSD) {
        const tasas = { tasaPEN, tasaUSD };
        localStorage.setItem("tasasCambio", JSON.stringify(tasas));
    }

    function cargarTasasCambio() {
        // Verifica si los elementos existen en el DOM
        const tasaPENInput = document.getElementById("tasa-pen");
        const tasaUSDInput = document.getElementById("tasa-usd");

        if (!tasaPENInput || !tasaUSDInput) {
            console.error("Los elementos tasa-pen o tasa-usd no están presentes en el DOM.");
            return;
        }

        // Cargar los valores desde el localStorage
        const tasas = JSON.parse(localStorage.getItem("tasasCambio")) || { tasaPEN: 0, tasaUSD: 0 };

        // Asignar los valores a los campos de input
        tasaPENInput.value = tasas.tasaPEN;
        tasaUSDInput.value = tasas.tasaUSD;
    }
});
