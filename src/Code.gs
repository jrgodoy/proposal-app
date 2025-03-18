function doGet(e) {
  const estado = obtenerEstado();
  let page = '';
  
  if(estado == 'Sin Empezar') {
    page = 'inicio'
  } else if(estado == 'Empezado') {
    page = 'preguntas'
  } else {
    page = 'resultado'
  }

  return HtmlService.createTemplateFromFile(page)
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle("Nuestra Historia")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function obtenerURL() {
  return ScriptApp.getService().getUrl();
}

function obtenerEstado() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Estado");
  const datos = hoja.getDataRange().getValues();

  return datos[1][0];
}

function obtenerPreguntas() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Preguntas");
  const datos = hoja.getDataRange().getValues();

  return datos.slice(1)
    .filter(row => row[7] == 'No')
    .map(row => ({
      indice: row[0],
      pregunta: row[1], 
      opciones: row[2] ? row[2].split(',') : null, 
      respuestaCorrecta: row[3],
      textoAyuda: row[4],
      mensajeCorrecto: row[5],
      mensajeError: row[6]
    })
  );
}

function marcarFilaComoContestada(numeroFila) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Preguntas");
  hoja.getRange(numeroFila, 8).setValue("Si");
}

function actualizarEstado(estado) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Estado");
  hoja.getRange(2, 1).setValue(estado);
}
