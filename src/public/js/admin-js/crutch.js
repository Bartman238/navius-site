/* eslint-disable indent */
"use strict";
/**
 * Show snackbar with message
 * @param {string} type - Type of snackbar 
 * @param {string} message - Snackbar message
 * @param {number} time - Snackbar duration is optional
 */
let showSnack = (type, message, time) => {
  $.notify({
    message: '&nbsp;' + message,
    icon: type === 'danger' ? 'fa fa-skull-crossbones' : 'fa fa-thumbs-up' 
  },{
    type: type,
    delay: time ? time : 3500,
    allow_dismiss: false,
    placement: {
      from: "top",
      align: "center"
    }
  });
};

/**
 * Returns route query variable
 * @param {string} variable query variable name to return
 * @return {string} 
 */
let getQueryVar = (variable) => {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] == variable) return pair[1];
  }
  return(false);
};