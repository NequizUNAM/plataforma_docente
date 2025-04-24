/** ===================================================================================
 * @description : Despliega un alert con los datos que le son pasados como parámetro
 * @param {string} titulo 
 * @param {string} mensaje 
 * @param {object} accion 
 ================================================================================== **/
 const routePath = '../src/html-required/';

function mensajeError ( titulo, mensaje, accion = {}, ocultable = true ) {
    $.alert({
        title:              titulo,
        content:            mensaje,
        type:               'red',
        backgroundDismiss:  ocultable,
        buttons:            accion
    });
} 

/** =========================================================================
 * @description : Compara si el estado de sesión obtenido del servidor es
 * igual al pasado por parámetro, de ser así redirige a la página de inicio
 * para ese estado.
 * @param {string} estadoCambio 
 * @returns 
 ======================================================================== **/
async function comprobarSesion ( estadoCambio = '' ) {
    const formData = {
        'Class' :   'SystemConnector',
        'Action':   'comprobarSesion'
    };

    return await RunFetchPost(MAIN_DEFAULT, formData)
    .then( sesion => {
        if (estadoCambio == '') {
            return sesion.ESTADO;
        }

        if (estadoCambio != sesion.ESTADO) {
            return false;
        }

        switch (sesion.ESTADO) {
            case 'Inactive':
                mensajeError('Sesión Cerrada', 'Se ha cerrado la sesión por inactividad');
                location.href = './authentication-login.html';
            break;

            case 'Active':
                location.href = './';
            break;
        }

        return true;
    });
}

function obtenerNombreUsuario () {
    const formData = {
        'Class':    'SystemConnector',
        'Action':   'getNombreUsuario'
    };

    RunFetchPost(MAIN_DEFAULT, formData)
    .then(respuesta => {
        respuesta.STATUS == 'Success' ? $('#usuario').text(respuesta.DATA.NOMBRE_USUARIO) : null;
    });
}

function confirmarCierre ( click ) {
    click.preventDefault();

    $.confirm({
        title: 'Salir del sistema',
        content: '¿Realmente desea salir del sistema?',
        buttons: {
            confirm: {
                text: 'Salir',
                btnClass: 'primary-button',
                action: cerrarSesion
            },
            cancel: {
                text: 'Cancelar'
            }
        }
    });
}

function cerrarSesion () {
    const formData = {
        'Class':    'SystemConnector',
        'Action':   'cerrarSesion'
    };

    RunFetchPost(MAIN_DEFAULT, formData, 'text')
    .then(() => {
        localStorage.clear();
        location.reload();
    });
}

function cargarMenu () {
    const sistemas = JSON.parse(localStorage.getItem("SUBSISTEMAS")),
        sidebar = $('#sidebarnav');
    let html = '';

    if (sistemas === null) {
        mensajeError('Error al cargar el menú', 'Ocurrió un error tratando de cargar el menú, es necesario que reinicie su sesión.', {confirm: {text: 'Cerrar sesión',action: cerrarSesion}}, false)
        return;
    }

    html = $(`#tpl-menu-sistemas`).render(sistemas, true);

    sidebar.html(html);

    feather.replace();
}

const getTemplate = async($element) => {
    let paginaActual = location.hash.replace('#', '');
    if ($element.length <= 0 || ($element.data() && Object.keys($element.data()).length <= 0)) {
        location.hash = '#Inicio';
        const contenido = $('<div></div>');

        contenido.attr('style', 'background:url(./assets/images/bienvenido.png) no-repeat center center; width: 1487px; height: 689px; background-size: cover');
        $('#principal').html(contenido);
    }else {
        // Se obtiene el Data desde los elementos Div
        let link = $element.data();
        window.location.hash = paginaActual;

        // Mediante pediticion se obtiene el template
        await fetch(`../src/html-required/${link.carpeta}${link.archivo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Not 2xx response", {cause: response});
            } else {
                return response.text()
            }
        })
        .then(data => $("#principal").html(data))
        .then(() => {
            /**
             * Crea un nuevo elemento script
             * Se incrusta en el DOM
             */
            let nombre_archivo = link.archivo.replace('.html', '');
            let nuevoScript = document.createElement("script");
            let numeroAleatorio = Math.floor(Math.random() * 1000);
            nuevoScript.src = `../src/js/modules/${link.carpeta}${nombre_archivo}/${nombre_archivo}.js?cache=${numeroAleatorio}`;
            nuevoScript.type = 'module';
            document.body.appendChild(nuevoScript);
        })
        .catch(mostrarPaginaError);        
    }
}

const mostrarPaginaError = async() => {
    window.location.hash = "#404";

    // Mediante pediticion se obtiene el template
    await fetch(`../src/html-required/404.html`)
    .then(response => response.text())
    .then(data => $("#principal").html(data))

    /**
     * Crea un nuevo elemento script
     * Se incrusta en el DOM
     */
    let nuevoScript = document.createElement("script");
    let numeroAleatorio = Math.floor(Math.random() * 1000);
    nuevoScript.src = `../src/js/modules/GENERAL/404/404.js?cache=${numeroAleatorio}`;
    nuevoScript.type = 'module';
    document.body.appendChild(nuevoScript);
}

async function validarPermisos (proceso) {
    const formData =  {
        'Class':    'SystemConnector',
        'Action':   'validarPermisos',
        'proceso':  proceso
    }

    await RunFetchPost(MAIN_DEFAULT, formData)
    .then(respuesta => {
        if (respuesta.STATUS === 'Fail') {
            mensajeError(respuesta.CODE, respuesta.MENSAJE, { Ok: ()=>{location.href='../GENERAL/'}})
        } else if (!respuesta.DATA.PERMISOS) {
            $('#principal').text('');
            mensajeError('Permisos insuficientes', 'No tiene permisos para acceder a este contenido.', { Ok: ()=>{location.href='../GENERAL/'}});
        }
    });
}

/**
 * Validación de sesión e inactividad.
 * 
 * Función encargada de validar cada ciertos segundos el estado de la
 * sesión en el servidor, además se encarga de cerrar la misma dado otro
 * periodo de tiempo mayor.
 * 
 * @param secondsSession 
 * @param secondsClose 
 */
function timeSessionState (secondsSession = 300, secondsClose = 3600) {
    var contador = secondsSession, timeOutClose = 0;

    document.addEventListener("DOMContentLoaded", function() {
        document.body.addEventListener("click", function() {
            timeOutClose = 0;
        });
    });

    window.setInterval(async function(){
        contador++;
        timeOutClose++;
        if( contador >= secondsSession){
            contador = 0;
            await comprobarSesion('Inactive');
        }

        if(timeOutClose >= secondsClose){
            cerrarSesion();
        }
    },1000);
}

function changePage ( $element ) {
    location.hash = $element.attr('id');
    location.reload();
}

function eliminarDiacriticos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"").normalize();
}

const fnAlertError = (message = "Ocurrio un error #-0001") => {
    $.alert({
        title: '',
        type: 'orange',
        icon: 'fas fa-exclamation-triangle',
        content: message,
        typeAnimated: true,
    });
}

const fnAlertSuccess = (message = "Exitoso!") => {
    $.alert({
        title: 'Listo',
        type: 'blue',
        icon: 'fas fa-check',
        content: message,
    });
}

const fnAlertFunction = (message, func) => {
    var alert = $.confirm({
        title: 'Listo!',
        type: 'dark',
        content: message,
        buttons: {
            aceptar: {
                btnClass: 'btn-blue',
                action: function(){
                    if (typeof func === 'function') {
                        func(); // Llamamos a la función que recibimos como argumento
                    }
                }
            },
        }
    });
    return alert;
}

const fnAlertReload = (message = "Datos Guardados!") => {
    var alert =  $.confirm({
        title: 'Listo!',
        type: 'dark',
        content: message,
        buttons: {
            aceptar: function () {
                location.reload();
            },
        }
    });
    return alert;
}

const fnCreateJsLoader = () =>{
    var alert = $.confirm({
        title: 'Cargando!',
        icon: 'fa fa-spinner fa-spin',
        content: ''
    });
    return alert;
}

async function redireccionar () {
    const formData = {
        'Class': 'SystemConnector',
        'Action': 'comprobarSesion'
    };

    return await RunFetchPost(`${MAIN_DEFAULT}`, formData)
    .then(async sesion => {
        let nuevoScript, numeroAleatorio;
        switch (sesion.ESTADO) {
            case 'Inactive':
                location.hash = '#login';

                // Se obtiene el template de login
                await fetch('../src/html-required/login.html')
                .then(response=> response.text())
                .then(data=> $('#carga_pagina').html(data));

                // Nuevo script incrustado en el DOM
                nuevoScript = document.createElement('script');
                numeroAleatorio = Math.floor(Math.random() * 1000);
                nuevoScript.src = `../src/js/modules/GENERAL/login/login.js?cache=${numeroAleatorio}`;
                nuevoScript.type = 'module';
                document.body.appendChild(nuevoScript);
                break;
            case 'Active':
                location.hash == 'login' ? location.hash = '' : false;

                // Se obtiene el template principal
                await fetch('../src/html-required/principal.html')
                .then(response=> response.text())
                .then(data=> $('#carga_pagina').html(data));

                // Nuevo script incrustado en el DOM
                nuevoScript = document.createElement('script');
                numeroAleatorio = Math.floor(Math.random() * 1000);
                nuevoScript.src = `../src/js/modules/GENERAL/principal/principal.js?cache=${numeroAleatorio}`;
                nuevoScript.type = 'module';
                document.body.appendChild(nuevoScript);
                break;
        }
    });
}