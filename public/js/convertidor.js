// Función principal para convertir código JavaScript a PHP
function convertirAPHP() {
  // Obtiene el elemento de entrada (campo de texto para código JS)
  const elementoEntrada = document.getElementById("js-input");
  // Obtiene el elemento de salida (campo de texto para código PHP convertido)
  const elementoSalida = document.getElementById("php-output");

  // Obtiene y limpia el contenido del campo de entrada
  const codigoJS = elementoEntrada.value.trim();

  // Verifica si el campo de entrada está vacío
  if (!codigoJS) {
    // Muestra una alerta si el campo está vacío
    swal({
      title: "No puedes dejar campos vacíos.",
      text: "Ingresa el código JavaScript.",
      icon: "warning",
      button: "OK",
    });
    return; // Detiene la ejecución
  }

  try {
    let codigoPHP = codigoJS; // Inicializa la variable para almacenar el código PHP

    // Convertir declaraciones de variables (let, const, var) a formato PHP
    codigoPHP = codigoPHP.replace(/\b(let|const|var)\s+(\w+)/g, "$$$2");

    // Convertir funciones flecha a funciones normales en PHP
    codigoPHP = codigoPHP.replace(/(\([^\)]*\))\s*=>\s*{/g, "function $1 {");

    // Convertir funciones normales de JS a funciones de PHP
    codigoPHP = codigoPHP.replace(/function\s+(\w+)\s*\((.*?)\)\s*{/g, "function $1($2) {");

    // Convertir console.log a echo
    codigoPHP = codigoPHP.replace(/console\.log\s*\((.*?)\)/g, "echo $1;");

    // Convertir estructuras de control (if, else if, else) a formato PHP
    codigoPHP = codigoPHP.replace(/\bif\s*\((.*?)\)\s*{/g, "if ($1) {");
    codigoPHP = codigoPHP.replace(/\belse\s*if\s*\((.*?)\)\s*{/g, "elseif ($1) {");
    codigoPHP = codigoPHP.replace(/\belse\s*{/g, "else {");

    // Convertir bucles for en formato PHP
    codigoPHP = codigoPHP.replace(/for\s*\(\s*(let|var|const)\s*(\w+)\s*=\s*(\d+);\s*\2\s*<\s*(\d+);\s*\2\+\+\)\s*{/g, "for ($2 = $3; $2 < $4; $2++) {");

    // Convertir bucles while en formato PHP
    codigoPHP = codigoPHP.replace(/while\s*\((.*?)\)\s*{/g, "while ($1) {");

    // Convertir estructuras switch en formato PHP
    codigoPHP = codigoPHP.replace(/\bswitch\s*\((.*?)\)\s*{/g, "switch ($1) {");
    codigoPHP = codigoPHP.replace(/\bcase\s+(.*?):/g, "case $1:");

    // Simular eventos 'click' en PHP utilizando condiciones POST
    codigoPHP = codigoPHP.replace(/document\.getElementById\(['"](\w+)['"]\)\.addEventListener\(['"]click['"],\s*function\s*\(\)\s*{([\s\S]*?)}\);/g, function (match, idElemento, codigo) {
      return `if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['${idElemento}'])) { ${codigo.trim()} }`;
    });

    // Mantener break y continue sin cambios
    codigoPHP = codigoPHP.replace(/\bbreak\s*;/g, "break;");
    codigoPHP = codigoPHP.replace(/\bcontinue\s*;/g, "continue;");

    // Añadir etiquetas PHP al principio y al final del código
    codigoPHP = `<?php\n\n${codigoPHP}\n\n?>`;

    // Muestra el código convertido en el elemento de salida
    elementoSalida.innerText = codigoPHP;

    // Alerta de conversión exitosa
    swal({
      title: "Conversión correcta",
      text: "Tu código JS ha sido convertido a PHP.",
      icon: "success",
      button: "OK",
    });
  } catch (error) {
    // Muestra un mensaje de error si ocurre algún problema durante la conversión
    swal({
      title: "Error de conversión",
      text: `Error en la conversión: ${error.message}`,
      icon: "error",
      button: "OK",
    });
  }
}

// Función para limpiar los campos de entrada y salida
function limpiarCampos() {
  document.getElementById("js-input").value = ""; // Limpia el campo de entrada
  document.getElementById("php-output").innerText = ""; // Limpia el campo de salida
}

// Función para copiar el código convertido al portapapeles
function copiarAlPortapapeles() {
  const elementoSalida = document.getElementById("php-output"); // Obtiene el elemento de salida

  if (elementoSalida.innerText) {
    const textoACopiar = elementoSalida.innerText; // Obtiene el texto del elemento de salida
    navigator.clipboard.writeText(textoACopiar) // Copia el texto al portapapeles
      .then(() => {
        // Muestra una alerta de copia exitosa
        swal({
          title: "Copiado correctamente",
          text: "El código PHP ha sido copiado al portapapeles.",
          icon: "success",
          button: "OK",
        });
      })
      .catch((err) => {
        // Muestra una alerta de error al copiar
        swal({
          title: "Error al copiar",
          text: `Hubo un problema al copiar el código: ${err}`,
          icon: "error",
          button: "OK",
        });
      });
  } else {
    // Muestra una alerta si no hay código para copiar
    swal({
      title: "Nada que copiar",
      text: "No hay código PHP generado para copiar.",
      icon: "warning",
      button: "OK",
    });
  }
}
