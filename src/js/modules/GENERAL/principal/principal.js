$(document).ready( async () => {
    $(".preloader ").fadeOut();
    timeSessionState();
    obtenerNombreUsuario();
    fnConvertersGlobal();
    await cargarMenu();
    getTemplate($(location.hash));
    selectSidebar();
    $(".preloader ").fadeOut();

    // ========== EVENTOS ========== //
    const body = $('body');

    /** Cierre de sesión **/
    body.on('click', '#salir', confirmarCierre);
})

const fnConvertersGlobal = async() => {
        
    // FUNCIONES JSRENDER
    $.views.converters({
        diacr: function(val) {
            return eliminarDiacriticos(val).replace(/\s/gi, '-').toLowerCase();
        },
        lower: function(val) {
            return (val) ? val.toLowerCase() : val;
        }
    });
}