/* eslint-disable indent */
"use strict";
/**
 * Show snackbar with message
 * @param {string} type - Type of snackbar 
 * @param {string} message - Snackbar message
 * @param {number} time - Snackbar duration is optional
 */
let showSnack = (type, message, time) => {
  let output = $("#form-output-global");

  output.removeClass("active error success");
  switch (type) {
    case 'error':
      output.html('<p><span class="icon text-middle mdi mdi-alert icon-xxs"></span><span>' + message + '</span></p>');
      break;
    default:
      output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + message + '</span></p>');
      break;
  }
  output.addClass("active");
  setTimeout(() => {
    output.removeClass("active");
  }, time ? time : 3500);
};