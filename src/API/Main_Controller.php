<?php
/**
 * Conector de clases.
 * Es de adminsitrar las clases, funciones y data de las peticiones 
 * 
 * @package     depende de las clases [inputFilter, Class_Manager]
 * @author      Pedro Nequiz medina <pnequiz@tfca.gob.mx>
 * @final		
 * @since       05/Julio/2023
 * @version     1.0.
*/

namespace src\API;
use \InputFilter as InputFilter;

require_once "../../vendor/autoload.php";
define('CORE_ROOT', dirname(__FILE__) . '/');

/**
 * @property spl_autoload_register: funcion anónima que incluye las clases al momento de las peticiones
 * 
*/

// include('inputFilter.php');
spl_autoload_register(function ($Class_Name) {
	$Class_Path = CORE_ROOT . $Class_Name;

	if(file_exists($Class_Path . '.php')){
		include $Class_Name . '.php';
	}else{
		$request = [
			"status" => false,
			"code" => "500",
			"description" => "La clase no existe => " . $Class_Name,
		];
	}
});

/**
 * @description : Clase que filtra las peticiones
 */
$Input_Filter = new inputFilter();
$_SERVER['PHP_SELF'] = htmlspecialchars($Input_Filter->process($_SERVER['PHP_SELF']));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_POST = $Input_Filter->process($_POST);
    $Arguments = $_POST;
} else {
    $_GET = $Input_Filter->process($_GET);
    $Arguments = $_GET;
}

if (!array_key_exists('Class', $Arguments))
	return false;
if (!array_key_exists('Action', $Arguments))
	return false;

if (isset($_POST['Class'])) {
    $Class_Name = $_POST['Class'];
    $Class_Method = $_POST['Action'];
    sanitizeArray($_POST);

    $Arguments = $_POST;
} else {
    $Class_Name = $_REQUEST['Class'];
    $Class_Method = $_REQUEST['Action'];
    sanitizeArray($_GET);
	
    $Arguments = $_GET;
}

function sanitizeArray(&$array)
{
    global $Input_Filter;

    foreach ($array as $key => &$value) {
        $tempValue = $Input_Filter->process($value);
		// Validar condicion para evitar inyeccion sql
        // $tempValue = htmlspecialchars($tempValue);
		
        $value = $tempValue;
        $GLOBALS[$key] = $tempValue;
    }
}

function startClassManager($Class_Name, $Class_Method, $Arguments){
	unset($Arguments['Class']);
	unset($Arguments['Action']);

	if (!class_exists($Class_Name)) {
		return false;
	}

	$Class_Instance = new $Class_Name($Arguments);

	$Class_Method = $Class_Method;

	if (!method_exists($Class_Instance, $Class_Method)) {
		return false;
	}
	$Class_Instance->$Class_Method();
}

startClassManager($Class_Name, $Class_Method, $Arguments);

?>