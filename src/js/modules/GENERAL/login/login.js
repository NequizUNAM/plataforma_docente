'use strict'
$(document).ready(async () => {
    $(".preloader ").fadeOut();

    // ========== EVENTOS ========== //
    const body = $('body');

    /** Inicio de sesión **/
    body.on('submit', '#login', iniciarSesion);
});

function iniciarSesion (submit) {
    submit.preventDefault();

    const usuario = $('#usuario').val();
    const contrasenia = CryptoJS.MD5($('#contrasenia').val()).toString();

    const formData = {
        'Class': 'SystemConnector',
        'Action': 'iniciarSesion',
        'usuario': usuario,
        'contrasenia': contrasenia
    };

    RunFetchPost(MAIN_DEFAULT, formData)
    .then(async sesion => {
        if (sesion.STATUS === 'Fail')
            throw new Error(sesion.CODE, { cause: sesion.MENSAJE });
        
        localStorage.setItem("PERMISOS", JSON.stringify(sesion.DATA));

        await obtenerMenu();
    })
    .then(() => {
        location.reload();
    })
    .catch( error => {
        mensajeError(error.message, error.cause);
    });
}

async function obtenerMenu () {
    const formData = {
        'Class': 'SystemConnector',
        'Action': 'getSubsistemas'
    };

    return await RunFetchPost(MAIN_DEFAULT, formData)
    .then(respuesta => {
        if (respuesta.STATUS === 'Fail') 
            throw new Error(respuesta.CODE,{ cause: respuesta.MENSAJE });

        localStorage.setItem("SUBSISTEMAS", JSON.stringify(respuesta.DATA));
    })
    .then(() => true)
    .catch( error => {
        mensajeError(error.message, error.cause);
    });
}