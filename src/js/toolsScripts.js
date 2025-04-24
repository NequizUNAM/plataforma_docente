/* ----------------------------------------------- TOOLS ------------------------------------------------------- */
/**
 *  @description: Rutas para elementos del sistema
 */
const MAIN_DEFAULT = "../src/Api/Main_Controller.php",
      MAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      SPINNER_TEXT = "<div class='d-flex align-items-center my-5 py-5'><strong>Cargando... </strong><div class='spinner-border ml-auto' role='status' aria-hidden='true'></div></div>",
      SPINNER_CENTER = "<div class='d-flex justify-content-center my-5 py-5'><div class='spinner-border' role='status'><span class='sr-only'>Cargando... </span></div> </div>",
      PLACEHOLDER_TABLE = "<div class='my-3'><p class='placeholder-glow'><p class='card-text placeholder-glow'><span class='placeholder col-7'></span><span class='placeholder col-7'></span><span class='placeholder col-7'></span><span class='placeholder col-7'></span><span class='placeholder col-7'></span></p></div>",
      PLACEHOLDER_CARD = "<div class='card' aria-hidden='true'><div class='card-body'><h5 class='card-title placeholder-glow'><span class='placeholder col-6'></span></h5><p class='card-text placeholder-glow'><span class='placeholder col-7'></span><span class='placeholder col-4'></span><span class='placeholder col-4'></span><span class='placeholder col-6'></span><span class='placeholder col-8'></span></p><a class='primary-button disabled placeholder col-2' aria-disabled='true'></a></div></div>",
      PLACEHOLDER_GROW = "<p class='placeholder-glow'><span class='placeholder col-12'></span></p>",
      PLACEHOLDER_GROW_CENTER = "<div class='my-3'><p class='placeholder-glow'><span class='placeholder col-12'></span></p></div>",
      LOADER_CIRCLE = "<div class='d-flex justify-content-center my-5 py-5'><div class='loader-circle'></div></div>";

/**
 *  @description: Configuraciones para el Data Table
*/
const DATATABLE = {
    'LANGUAGE': '../src/js/json/datatables-es-MX.json',  // example: language: {url: DATATABLE.URL_LANGUAGE},
    'URL_LANGUAGE': { url: '../src/js/json/datatables-es-MX.json' },
}

/***
 * @description : Valida si un radio input esta seleccionado [checked]
*/
const validateRadio = (inputName) => {
    return $('input:radio[name=' + inputName + ']:checked').length > 0;
}

/**
 * @description : 
 * @param {*} valor 
 * @returns 
*/
const setValue = (valor) => {
    if (typeof (valor) === 'string')
        return (valor) ? valor.trim() : '';
    else
        return (valor) ? valor : '';
}

/**
 * @description : 
 * @param {*} val 
 * @returns 
*/
const setValueInteger = (value) => {
    // Si el valor es una cadena, limpiarla y convertir las comas decimales a puntos
    if (typeof value === 'string') {
        // Eliminar espacios innecesarios y comas
        value = value.trim().replace(/,/g, '');
        // Reemplazar comas decimales por puntos
        value = value.replace('.', '');
    }
    // Verificar si el valor es un número válido
    if (isNaN(parseFloat(value))) {
        value = '';
    } else {
        // Convertir a número entero
        value = parseInt(value, 10);
    }
    return value;
}

const IsNumber = (element) => {
    if (Number(element) == NaN) {
        return setValue(element);
    } else {
        return setValueInteger(element);
    }
}

// const getValueElement = ($element) => {
//     $value = $element.val();

//     try {
//         $type = $element.attr('aria-type');

//         if($type  != undefined){
//             if($type.toLowerCase() == 'number' || $type.toLowerCase() == 'num')
//                 $value  = setValueInteger($value);
//             if($type.toLowerCase() == 'text' || $type.toLowerCase() == 'string')
//                 $value  = setValue($value);
//             else
//                 $value  = setValue($value);
//         }else{
//             $value  = setValue($value);
//         }

//     } catch (error) {
//         console.error(error);
//     }

//     return $value;
// }

/**
 * Cambia las Keys a minusculas
 * @param {*} Json 
 * @param {*} type 
 * @returns 
 */
const arrayChangeKeys = (Json, type = 'lower') => {
    if (type == 'lower') {
        Object.keys(Json).forEach(key => {
            Json[key] = toLowerKeys(Json[key]);
        });
    }
    return Json;
}

/**
 * @description: Las keys de un array las pasa a Minusculas
 */
const toLowerKeys = (obj) => {
    return Object.entries(obj).reduce((accumulator, [key, value]) => {
        accumulator[key.toLowerCase()] = value;
        return accumulator;
    }, {});
};

const toUpperKeys = (obj) => {
    return Object.entries(obj).reduce((accumulator, [key, value]) => {
        accumulator[key.toUpperCase()] = value;
        return accumulator;
    }, {});
};

/**
 * 
 * @param {*} array 
 * @param {*} nombreElemento 
 * @returns 
 * @description: Función para convertir los valores de una propiedad específica a enteros en un array de objetos
 */
function arrayChangeToNumber(array, nombreElemento = "") {
    // Si no se proporciona un nombre de elemento, tomamos el nombre del elemento en la posición 0 del array
    if (nombreElemento === "" && array.length > 0) {
        nombreElemento = Object.keys(array[0])[0];
    }

    return array.map(objeto => {
        // Verificamos si la propiedad existe en el objeto y si su valor es un número
        if (objeto.hasOwnProperty(nombreElemento)) {
            // Convertimos el valor de la propiedad a entero
            objeto[nombreElemento] = setValueInteger(objeto[nombreElemento]);
        }
        return objeto;
    });
}

/**
 * @description : Formatea un valor numerico a moneda.
 */
const MoneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

/**
 * @description: Set visible an element
 * 
 * @param {*} element 
 * @param {*} time 
 */
const setVisible = (element, time = 600) => {
    element.slideDown(time);
}

/**
 * @description: Set none an element
 * 
 * @param {*} element 
 * @param {*} time 
 */
const setNone = (element, time = 600) => {
    if (element.is(':visible'))
        element.slideUp(time);
}

/**
 * Desplaza la vista del navegador hasta un elemento específico en la página.
 * @param {string} elementId - ID del elemento al que se desea desplazar.
 * @param {string} block - Opcional. Especifica cómo se alinea el elemento en la ventana. 
 *                         Puede ser "start", "center" o "end". Por defecto es "start".
 */
const goToElement = (elementId, block = "start") => {
    const element = document.getElementById(elementId);

    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: block });
    }else {
        // Envia al final de la ventana por defecto
        window.scrollTo(0, document.body.scrollHeight);
    }
};

function buttonAnimationJump(elementId, veces = 2) {
    const $element = $('#' + elementId);
    for (let i = 0; i < veces; i++) {
        setTimeout(() => { $element.css('transform', 'scale(0.9)'); }, i * 600);
        setTimeout(() => { $element.css('transform', 'scale(1.1)'); }, i * 600 + 100);
        setTimeout(() => { $element.css('transform', 'scale(1)'); }, i * 600 + 200);
    }
}

// UTF-8
const utf8_decode = (s) => decodeURIComponent(escape(s));

/**
 * @description: Valida el Input, es necesario colocar los atributos en el HTML
 * @param {*} input 
 * @returns 
 */
const ValidateInput = (input) => {
    let min = input.getAttribute("minlength"),
        max = input.getAttribute("maxlength"),
        value = input.value,
        length = $.trim(value).length,
        type = input.type,
        valid = true;

    if (length < min || length > max)
        valid = false;

    if (valid) {
        switch (type) {
            case 'number':
                if (isNaN(value))
                    valid = false;
                break;
            case 'email':
                if (!Mail_Pattern.test(value))
                    valid = false;
                break;
        }
    }

    if (valid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }

    return valid;
}

/**
 * @description: removeValidClasses
 * 
 */
const removeValidClasses = function () {
    if (this.classList.contains('is-valid') || this.classList.contains('is-invalid')) {
        this.classList.remove('is-valid');
        this.classList.remove('is-invalid');
    }
}

/**
 * @description: Parsea un valor numerico a moneda
 * @param {*} value  [ Si es vacio retorna Cero ]
 * @param {*} withSign [ true/false para retornar con $ ]
 * @returns 
 */
const Parse2Money = (value = 0, withSign = false) => {
    if (isNaN(parseInt(value))) {
        return '';
    }
    let newValue = MoneyFormatter.format(parseInt(value));
    if (!withSign) {
        newValue = newValue.replace('$', '');
    }
    return newValue;
}

const RemoveItemFromArr = (arr, item) => {
    var i = arr.indexOf(item);

    if (i !== -1) {
        arr.splice(i, 1);
    }
}

/**
 * @description : Para comprobar en funciones Flecha  Fetch si la respuesta es 200
 * @param {*} response = response.ok => 200
 * @returns 
 */
const isResponseOk = (response) => {
    if (!response.ok)
        throw new Error(response.status);
    return response.text()
}

/**
* Reemplaza espacios que sobran aplica para espacios de mas dentro de la misma cadena no solo extremos
*/
const replaceSpaces = (str) => str.replace(/ +/g, ' ').trim();

/**
 * @description : Remueve los espacios de un Array
 * @param {*} $objeto = Array
 * @returns 
 */
const fnArrayRemoveTrim = ($objeto = '') => {
    for (let key in $objeto) {
        if (typeof ($objeto[key]) === 'string') {
            $objeto[key] = replaceSpaces($objeto[key]);
        }
    }
    return $objeto;
}

/** ====================================
 * @descripcion : retorna la fecha actual  
 * @returns date now
    ================================== **/
const Date_Time_Now = (format = '') => {
    var date = new Date();

    var date_time = date.getFullYear() + "-" + zero(date.getMonth() + 1) + "-" + zero(date.getDate()) + " " + zero(date.getHours()) + ":" + zero(date.getMinutes()) + ":" + zero(date.getSeconds());

    if (format == 'date-standar') {
        var date_time = zero(date.getDate()) + "/" + zero(date.getMonth() + 1) + "/" + date.getFullYear() + " " + zero(date.getHours()) + ":" + zero(date.getMinutes()) + ":" + zero(date.getSeconds());
    }

    if (format == 'datetime-local') {
        var date_time = date.getFullYear() + "-" + zero(date.getMonth() + 1) + "-" + zero(date.getDate()) + "T" + zero(date.getHours()) + ":" + zero(date.getMinutes()) + ":" + zero(date.getSeconds());
    }

    if (format == 'full-date') {
        date_time = new Date().toJSON();
        // date_time = date_time.slice(0, 23).replaceAll('.','');
    }
    return date_time;
}

/**
 * Funcionm para la fecha agregue ceros
 * @param {*} n 
 * @returns 
 */
const zero = (n) => {
    return (n > 9 ? '' : '0') + n;
}

/** ============================================================
 * @description : Genera un FormData para enviar mediante AJAX
 * @param {object} object 
 * @returns 
 =========================================================== **/
function getFormData(object) {
    return Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);

        return formData;
    }, new FormData())
}

/**
 * Valida el formulario utilizando Bootstrap. Los campos deben tener el atributo required.
 * @param {string} formId - ID del formulario a validar.
 * @returns {boolean} true si el formulario es válido, false si no.
 */
const fnWasValidate = (Form_ID, Disable = false) => {
    let Validated = true;
    const $form = $("#" + Form_ID);

    // Agregar la clase 'was-validated' si no está presente
    if (!$form.hasClass("was-validated")) {
        $form.addClass('was-validated');
    }

    // Validación para campos de texto, archivos, contraseñas y áreas de texto requeridos
    $form.find("input:text, input:file, input:password, textarea").filter("[required]:visible").each(function () {
        if ($(this).val().trim() === "") {
            Validated = false;
        }
    });

    // Validación para campos numéricos requeridos
    $form.find("input[type='number']").filter("[required]").each(function () {
        if ($(this).val() <= 0 || $(this).val() === null) {
            Validated = false;
        }
    });

    // Validación para selects requeridos
    $form.find("select").filter("[required]").each(function () {
        if ($(this).val() === null) {
            Validated = false;
        }
    });

    // Validación para campos de tipo email
    $form.find("input[type='email']").each(function () {
        const email = $(this).val().trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if ($(this).attr('required')) {
            if (email === "" || !emailPattern.test(email)) {
                Validated = false;
            } else {
                $(this).removeAttr('required');
            }
        } else {
            // Si el campo no es requerido, aceptar un valor vacío y validar solo si no está vacío
            if (email !== "" && !emailPattern.test(email)) {
                Validated = false;
            }
        }
    });

    // Validación específica para input[name=casefileValidate]
    const $casefileValidate = $form.find("input[name=casefileValidate]");
    if ($casefileValidate.length > 0) {
        const $element = $casefileValidate.filter(":checked");
        if ($element.val() !== "3" && $element.val() !== "4") {
            Validated = false;
        }
    }

    /**
     * Inhabilita el Form
     */
    if (Validated && Disable) {
        fnDisabledForm(Form_ID);
    }
    return Validated;
}

/**
 * Deshabilita o habilita los campos de un formulario y opcionalmente limpia los valores.
 * @param {string} formId - ID del formulario a deshabilitar.
 * @param {boolean} disable - Indica si se deben deshabilitar (true) o habilitar (false) los campos. Por defecto true.
 * @param {boolean} clearForm - Indica si se deben limpiar los valores de los campos (solo aplica si disable es true). Por defecto false.
 */
const fnDisabledForm = (formId, disable = true, clearForm = false) => {
    var FORM = document.getElementById(formId);

    // Selección de tipos de input que deben ser tratados como texto
    const textInputs = FORM.querySelectorAll("input[type='text'], input[type='file'], input[type='password'], textarea");
    textInputs.forEach(input => {
        input.disabled = disable;
        if (disable && clearForm) {
            input.value = '';
        }
    });

    // Selección de otros tipos de input que no son texto
    const otherInputs = FORM.querySelectorAll("input[type='number'], input[type='email'], input[type='date']");
    otherInputs.forEach(input => {
        input.disabled = disable;
        if (disable && clearForm) {
            input.value = '';
        }
    });

    // Selección de selects y botones con clase .btn
    const selectsAndButtons = FORM.querySelectorAll("select, button.btn");
    selectsAndButtons.forEach(element => {
        element.disabled = disable;
    });
};

/**
 * @description: Acepta el argumento del elemento $this => que trabaja con jquery
 * @param {*} $element 
 * @param {*} tipo 
 * @param {*} text 
 */
const $createBtnSync = ($element = null, tipo = '', text = 'Listo') => {
    // Verifica si el argumento 'element' es un objeto jQuery válido
    if ($element && $element instanceof jQuery && $element.length > 0) {
        // elemento $this valido
    } else {
        console.error('El argumento proporcionado no es un objeto jQuery válido o es nulo.');
    }

    switch (tipo) {
        case 'sync':
            $element.prop('disabled', true).html(`<i class="fas fa-sync fa-spin"></i>`);
        break;
        case 'success':
            $element.prop('disabled', false).html(`<i class="fa-solid fa-check"></i>`);
        break;
        case 'success-block':
            $element.prop('disabled', true).html(`<i class="fa-solid fa-check"></i>`);
        break;
        case 'fail':
            $element.prop('disabled', false).html(`<i class="fas fa-times"></i>`);
        break;
        case 'fail-block':
            $element.prop('disabled', true).html(`<i class="fas fa-times"></i>`);
        break;
        case 'save':
            $element.prop('disabled', false).html(`<i class="fas fa-save"></i> Guardar`);
        break;
        case 'save-block':
            $element.prop('disabled', true).html(`<i class="fas fa-save"></i> Guardado!`);
        break;
        case 'editar':
            $element.prop('disabled', false).html(`<i class="fas fa-edit"></i>`);
        break;
        case 'eliminar':
            $element.prop('disabled', false).html(`<i class="fas fa-trash"></i>`);
        break;
        default:
        break;
    }
};

/**
 * @description: Crea un boton con un Spin para la vista
 * @param {*} element_id: por defecto se asigna el elemento por ID 
 * @param {*} name_btn- [sync, success, fail]
 * @param {*} text 
 */
const createBtnSyncB = (btn_name = '', name_btn = '', text = '<i class="fas fa-save"></i> Guardar') => {
    var boton = document.getElementById(btn_name);

    switch (name_btn.toLowerCase()) {
        case 'sync':
            // Bloquea el boton y coloca un spin
            boton.innerHTML = '<i class="fas fa-sync fa-spin"></i> Cargando';
            boton.disabled = true;
            break;
        case 'success':
            // Bloquea el boton y regresa al texto original
            boton.innerHTML = 'Guardar';
            boton.disabled = false;
            break;
        case 'fail':
            // Regresa el Boton a su estado orginal
            boton.innerHTML = text;
            boton.disabled = false;
            break;
        case 'block':
            // Regresa el Boton a su estado orginal
            // boton.addClass('text-warning');
            boton.innerHTML = '<i class="fas fa-save"></i>Ready - 501';
            boton.disabled = true;
            break;
        case 'guardado':
            // Bloquea el boton y coloca Guardado
            boton.innerHTML = '<i class="fas fa-save"></i> Guardado!';
            boton.disabled = true;
            break;
        default:
            // Regresa el Boton a personalizar
            boton.innerHTML = text;
            boton.disabled = false;
            break;
    }
}

const RunRenderFetch = async (url, $id, dataRender = {}, empty = true) => {
    if (empty)
        $id.empty();

    await RunFetchHtml(url).then((data) => $id.append($.templates(data).render(dataRender)));
}

/** ============================================================
 * @description : Ejecuta una petición asincrona en método post.
 * @param {string} url 
 * @param {object} formData 
 * @param {string} type 
 * @returns 
 =========================================================== **/
async function RunFetchPost(url = '', formData = {}, type = 'json') {
    return await new Promise((resolve, reject) => {
        if (url.trim() == '') {
            reject('Por favor envíe la url para realizar el fetch');
            return
        }

        fetch(`${url}?cache=V${Math.random()}`, { method: 'POST', body: getFormData(formData) })
            .then(response => {
                if (response.ok) {
                    if (type == 'json') {
                        resolve(response.json())
                    }
                    if (type == 'html' || type == 'text') {
                        resolve(response.text())
                    }
                    if (type == 'blob') {
                        resolve(response.blob())
                    }
                } else {
                    if (response.status == 401) {
                        alert(`Sesion Terminada - ${response.statusText}`);
                        window.location.href = "/index.html";
                    }

                    reject(`No hemos podidio recuperar la respuesta. El código de respuesta del servidor es:${response.status} - ${response.statusText}`);
                }
            })
            .then(request => resolve(request))
            .catch(error => console.error(`ERROR: ${error}`));
    });
}

/**
 * @description Recupera los datos de un formulario
 * @param {string} nameForm Nombre del ID del formulario
 * @returns {object} Objeto con los datos del formulario y los archivos seleccionados
*/
const fnGetFormData = (nameForm = '') => {
    let myFormData;

    // Si no se especifica el ID de Formulario, toma el primer formulario del documento
    if (nameForm === '') {
        myFormData = new FormData(document.forms[0]);
    } else {
        const form = document.getElementById(nameForm);
        if (form) {
            myFormData = new FormData(form);
        } else {
            throw new Error(`Formulario con ID ${nameForm} no encontrado.`);
        }
    }

    let objeto = Object.fromEntries(myFormData.entries()); // Convierte FormData a objeto
    objeto = fnArrayRemoveTrim(objeto); // Remover espacios en todos los valores del objeto
    const fileInputs = fnGetDataInputFiles(nameForm);  // Obtener información de los archivos si existen en el formulario
    objeto.fileInputs = fileInputs;

    return objeto;
}

/**
 * Obtiene la información de los elementos de tipo file dentro de un formulario.
 * @param {string} nameForm - Nombre del ID del formulario.
 * @returns {Array} Array de objetos con los datos de los elementos de tipo file.
 */
const fnGetDataInputFiles = (nameForm) => {
    const arrayInput = [];
    const fileInputs = document.querySelectorAll(`#${nameForm} input[type='file']`);

    if (fileInputs.length > 0) {
        fileInputs.forEach(function (input) {
            const data = input.dataset;
            arrayInput.push(data);
        });
    }

    return arrayInput;
};


/**
 * @description: Obtiene los datos del file y lo pasa a base 64
 * @param {*}  => se pasa el elemento input a tratar
 * @returns 
 * @required: debe tener un id="", <label for="">
 */
const fnOpenFileReader = (e) => {
    const fileInputId = e.target.id;
    const maxSizeInBytes = 5 * 1024 * 1024;
    let acceptedMimeType;

    // Verificar si el elemento con el ID existe
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput) {
        return;
    }

    const file = e.target.files[0];
    if (!file) {
        return;
    }

    // Leer el contenido del archivo como una base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        $(`label[for='${fileInputId}']`).html(file.name);

        if (maxSizeInBytes && file.size > maxSizeInBytes) {
            $(`#${fileInputId}`).data('name', `No hay datos, se superaron los ${maxSizeInBytes} por archivo`);
            return;
        }

        $(`#${fileInputId}`).data('blob', reader.result);
        $(`#${fileInputId}`).data('name', file.name);
        $(`#${fileInputId}`).data('size', file.size);
        // console.info( $(`#${fileInputId}`).data());
    };
};

/**
 * genera un numero aleatorio entre dos numeros
 */
const fnRandomIntBetween = (min = 10, max = 10000) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Ordena un Array
*/
const randomSort = array => {
    array.toSorted(
        () => 0.5 - Math.random()
    )
}

/**
 * @description: Genera una variable con el ID de catalogo que se coloque
 * @returns : Retornara un Json o la cadena de texto que es un DDL
 * @IdCatalogo : Id de catalago a buscar
 * @IdSelected :Id en caso de que se desee seleccionar uno se maneja por el value.
 * @Idremove : Id en forma de array por si se desean quitar indices del select se manejan por el value.
 */
const ddlCatArray = [];
const getCatalogoArray = async (IdCatalogo) => {
    IdCatalogo = setValueInteger(IdCatalogo);

    if (!IdCatalogo) {
        console.log("Id no localizado # -110");
        return false;
    }

    if (typeof ddlCatArray[IdCatalogo] === 'undefined') {
        const formData = { 'Class': "Core", 'Action': "Get_Catalogo", 'id': IdCatalogo };
        try {
            const response = await fetch(MAIN_DEFAULT, { method: 'POST', body: getFormData(formData) });
            if (!response.ok) {
                throw new Error("No hemos podido recuperar ese json. El código de respuesta del servidor es: " + response.status);
            }
            ddlCatArray[IdCatalogo] = await response.json();
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const Data = ddlCatArray[IdCatalogo];
    if (!Data || !Data.length || !Object.keys(Data[0]).length) {
        console.log("No hay datos disponibles");
        return false;
    }

    const idKeyFound = Object.keys(Data[0]).some(key => key.includes("ID"));
    if (!idKeyFound) {
        console.log("Id no localizado # -120");
        return false;
    }

    ddlCatArray[IdCatalogo] = await arrayChangeToNumber(ddlCatArray[IdCatalogo]);

    return Data;
}



/**
 * @description: Genera una variable con el ID de catalogo que se coloque
 * @returns : Retornara un Json o la cadena de texto que es un DDL
 * @IdCatalogo : Id de catalago a buscar
 * @IdSelected :Id en caso de que se desee seleccionar uno se maneja por el value.
 * @Idremove : Id en forma de array por si se desean quitar indices del select se manejan por el value.
 */
const ddlCatsArray = [];
const getCatalogosArray = async (idCatalogo, param1 = "", param2 = "") => {
    idCatalogo = setValueInteger(idCatalogo);
    param1 = setValueInteger(param1);
    let paramActual = "";

    if (idCatalogo == undefined || idCatalogo == '') {
        console.log("Id no localizado # -120");
        return false;
    }

    let obj = {
        'id': idCatalogo,
        'param1': param1,
        'param2': param2
    };

    if (typeof ddlCatsArray[idCatalogo] === 'undefined' || param1 != paramActual) {
        formData = { 'Class': "Core", 'Action': "Get_Catalogos", 'obj': JSON.stringify(obj) };
        paramActual = param1;
        ddlCatsArray[idCatalogo] = await new Promise((resolve, reject) => {
            fetch(MAIN_DEFAULT, { method: 'POST', body: getFormData(formData) })
                .then((response) => {
                    if (response.ok)
                        return response.json()
                    else
                        reject("No hemos podido recuperar ese json. El código de respuesta del servidor es: " + response.status);
                })
                .then((json) => resolve(json))
                .catch((err) => reject(err));
        });
    }
    // se setea la variable para poder trabajar con ella;
    let Data = ddlCatsArray[idCatalogo];
    $.each(Data, function () {
        // Comprueba que exista en las key el valor en este caso comienze el nombre ID por lo regular el key[0]  == Es el ID;
        let key = Object.keys(this);
        if (!(key[0].includes("ID") || key[1].includes("ID"))) {
            console.log("Id no localizado # -120");
            return false;
        }
    });

    ddlCatsArray[idCatalogo] = await arrayChangeToNumber(ddlCatsArray[idCatalogo]);

    return Data;
}

/**
 * Depende de la funcion => getCatalogoArray()
 * @param {*} myArray 
 * @param {*} IdSelected 
 * @returns retorna un Drop Down List
 */
const fnCreateDdl = (myArray, IdSelected = '') => {
    let DropDown = "<option selected value='' disabled>Seleccione...</option>";

    if (myArray.length <= 0) {
        console.info("El array se encuentra vacio");
        DropDown = "<option selected value='' disabled> - </option>"
    } else {
        for (const element of myArray) {
            if (IdSelected == element['ID']) {
                DropDown += `<option selected value = '${element['ID']}'> ${element['NOMBRE']} </option>`;
            } else {
                DropDown += `<option value = '${element['ID']}'> ${element['NOMBRE']} </option>`;
            }
        }
    }

    return DropDown;
}

/**
 * 
 * @param {*} obj 
 * @returns 
 */
const isNullOrEmpty = (obj) => {
    return obj === null || (typeof obj === 'object' && Object.keys(obj).length === 0);
}

/**
 * De un Array obtiene los elementos especificados y los devuelve como nuevo Array
 * de esta manera los datos son dinamicos
 * @param {*} ArrayElements = Array o Json
 * @param {*} nameColumn = Nombre de la columna (key) donde buscara
 * @param {*} idElementfilter  = Id de la coincidencia a buscar
 * @returns 
 * @example: fnNewArrrayFormId( array , 'ID_COLUMN', id_element)
 */
const fnNewArrrayFormId = (ArrayElements, nameColumn, idElementfilter) => {
    // Verificar si el array está vacío
    if (ArrayElements.length === 0) {
        console.log("El array está vacío");
        return [];
    }

    // Verificar si se proporcionan los argumentos necesarios
    if (nameColumn === "" || idElementfilter === "") {
        console.log("Se deben especificar los argumentos");
        return [];
    }

    // Filtrar los elementos del array por el valor del nombre de la columna y el filtro de ID
    const nuevosElementos = ArrayElements.filter(objeto => objeto[nameColumn] === idElementfilter);

    // Verificar si se encontraron nuevos elementos
    if (!nuevosElementos.length > 0) {
        console.info("No se encontraron elementos");
    }
    return nuevosElementos;
}

/**
 * Mascaras input-mask
 */
function validarPDF() {
    var archivoInput = document.getElementById('archivoPDF');
    if (archivoInput.files.length === 0 || archivoInput.files[0].type !== 'application/pdf') {
        alert('Por favor, selecciona un archivo PDF válido.');
        return false;
    }
    return true; // Retorna true si es un PDF válido
}


//Funciones Bootstrap Modales
/**
 * @function fnShowModal
 * @async
 * @param {string} modalId - El ID del elemento del modal a mostrar (sin el prefijo '#').
 * @param {string} title - El título a mostrar en el encabezado del modal.
 * @param {string} classModal - Clase de tamaño para el modal (por defecto: "modal-xl").
 *
 * Esta función modifica dinámicamente:
 * - El título del modal.
 * - El contenido con un loader.
 * - El tamaño mediante clases como 'modal-sm', 'modal-lg', etc.
 * También gestiona la visualización del modal y el cierre al hacer clic fuera del contenido.
 */
const fnShowModal = async (modalId, title = "", classModal = "modal-xl") => {
    if (typeof jQuery === 'undefined') {
        alert('⚠️ jQuery no está cargado.');
        return;
    }

    const modalGeneral = $(`#${modalId}`);
    if (!modalGeneral.length) {
        console.error(`❌ No se encontró el modal con ID: ${modalId}`);
        return;
    }

    // Verificar si existe cada clase y eliminarla si es necesario
    const classesToRemove = ['modal-sm', 'modal-lg', 'modal-xl', 'modal-dialog-scrollable'];
    const modalElement = modalGeneral.find('.modal-dialog');
    
    classesToRemove.forEach(currentClass => {
        if (modalElement.hasClass(currentClass)) {
            modalElement.removeClass(currentClass);
        }
    });

    modalElement.addClass(classModal);

    const modalTitle = modalGeneral.find('.modal-title');
    if (modalTitle.length) {
        modalTitle.text(title);
    }

    $("#modal_content").html(LOADER_CIRCLE);
    modalGeneral.modal('show');
};

/**
 * Funciones para realizar con un Array
 * 
const functionArray = (array, type = '') =>{
    // Eliminar duplicados de un array
    if(type == 'deleDuplicate'){
        let uniqueArray = [... new Set(array)];
        return uniqueArray;
    }
    
    // Ordenar array de forma ascendente
    if(type == 'orderAsc'){
        array.sort((a,b) => a - b );
        return array;
    }
    
    //Invertir el orden de un array
    if(type == 'reverse'){
        let arrayReverse = array.reverse();
        return arrayReverse;
    }
}
*/