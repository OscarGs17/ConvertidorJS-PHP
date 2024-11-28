function convertirAPHP() {
    const elementoEntrada = document.getElementById("js-input");
    const elementoSalida = document.getElementById("php-output");
  
    const codigoJS = elementoEntrada.value.trim();
  
    if (!codigoJS) {
      return swal({
        title: "No puedes dejar campos vacíos.",
        text: "Ingresa el código JavaScript.",
        icon: "warning",
        button: "OK",
      });
    }
  
    try {
      let codigoPHP = codigoJS;
  
      // Reemplazos comunes (variables, funciones, estructuras)
      const reemplazos = [
        { regex: /\b(let|const|var)\s+(\w+)/g, replace: "$$$2" },
        { regex: /(\([^\)]*\))\s*=>\s*{/g, replace: "function $1 {" },
        { regex: /function\s+(\w+)\s*\((.*?)\)\s*{/g, replace: "function $1($2) {" },
        { regex: /console\.log\s*\((.*?)\)/g, replace: "echo $1;" },
        { regex: /\bif\s*\((.*?)\)\s*{/g, replace: "if ($1) {" },
        { regex: /\belse\s*if\s*\((.*?)\)\s*{/g, replace: "elseif ($1) {" },
        { regex: /\belse\s*{/g, replace: "else {" },
        { regex: /for\s*\(\s*(let|var|const)\s*(\w+)\s*=\s*(\d+);\s*\2\s*<\s*(\d+);\s*\2\+\+\)\s*{/g, replace: "for ($2 = $3; $2 < $4; $2++) {" },
        { regex: /while\s*\((.*?)\)\s*{/g, replace: "while ($1) {" },
        { regex: /\bswitch\s*\((.*?)\)\s*{/g, replace: "switch ($1) {" },
        { regex: /\bcase\s+(.*?):/g, replace: "case $1:" },
        { regex: /\bbreak\s*;/g, replace: "break;" },
        { regex: /\bcontinue\s*;/g, replace: "continue;" },
      ];
  
      // Aplicar todos los reemplazos
      reemplazos.forEach(({ regex, replace }) => {
        codigoPHP = codigoPHP.replace(regex, replace);
      });
  
      // Adaptar el evento 'click' en PHP (simulado)
      codigoPHP = codigoPHP.replace(/document\.getElementById\(['"](\w+)['"]\)\.addEventListener\(['"]click['"],\s*function\s*\(\)\s*{([\s\S]*?)}\);/g, (match, idElemento, codigo) => {
        return `if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['${idElemento}'])) { ${codigo.trim()} }`;
      });
  
      // Añadir etiquetas PHP al principio y al final
      codigoPHP = `<?php\n\n${codigoPHP}\n\n?>`;
  
      // Mostrar el resultado
      elementoSalida.innerText = codigoPHP;
  
      swal({
        title: "Conversión correcta",
        text: "Tu código JS ha sido convertido a PHP.",
        icon: "success",
        button: "OK",
      });
    } catch (error) {
      swal({
        title: "Error de conversión",
        text: `Error en la conversión: ${error.message}`,
        icon: "error",
        button: "OK",
      });
    }
  }
  
  function limpiarCampos() {
    const elementoEntrada = document.getElementById("js-input");
    const elementoSalida = document.getElementById("php-output");
  
    elementoEntrada.value = "";
    elementoSalida.innerText = "";
  }
  
  function copiarAlPortapapeles() {
    const elementoSalida = document.getElementById("php-output");
  
    if (elementoSalida.innerText) {
      navigator.clipboard.writeText(elementoSalida.innerText)
        .then(() => {
          swal({
            title: "Copiado correctamente",
            text: "El código PHP ha sido copiado al portapapeles.",
            icon: "success",
            button: "OK",
          });
        })
        .catch((err) => {
          swal({
            title: "Error al copiar",
            text: `Hubo un problema al copiar el código: ${err}`,
            icon: "error",
            button: "OK",
          });
        });
    } else {
      swal({
        title: "Nada que copiar",
        text: "No hay código PHP generado para copiar.",
        icon: "warning",
        button: "OK",
      });
    }
  }
  