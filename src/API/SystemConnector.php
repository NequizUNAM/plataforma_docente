<?php
/**
 * Documentación de la clase SystemConnector
 * @package TFCA.src.API
*/

use src\controller\SystemController as SystemC;
use src\controller\UtilsController as UtilsC;

session_start();

/**
 * Conector del sistema.
 * 
 * Es el encargado de conectar el front con el back, y contiene los métodos
 * que son necesarios para la carga y funcionamiento del sistema.
 * 
 * @package     TFCA.src.API
 * @author      Edwin Díaz Caballero <ediazc@tfca.gob.mx>
 * @final
 * @since       18/Octubre/2021
 * @version     2.0
 */
class SystemConnector extends Core {
    public $usuario;
    public $contrasenia;
    public $subsistema_id;
    public $proceso;


    public function __construct($Class_Properties = Null) {
		parent::__construct($Class_Properties);
	}

    /**
     *  ========== INICIO DE SESIÓN ==========
     * @method: Inicio de sesión
     * @return: Resultado del proceso de inicio de sesión
     * =======================================
    */
    public function iniciarSesion() {
        $System = new SystemC();

        $ip = '';
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        $response_auth = $System->autenticarUsuario($this->usuario, $this->contrasenia, $ip);

        if ($response_auth['STATUS'] == 'Fail') {
            echo json_encode($response_auth);
            die();
        }

        if (empty($response_auth['DATA'])) {
            echo json_encode([
                'STATUS'=> 'Fail',
                'CLAVE'=> 0,
                'CODE' => 'CREDENCIALES INCORRECTAS',
                'MENSAJE' => 'Los datos de acceso no son correctos.'
            ]);
            die();
        }

        $_SESSION['SII']['id_system_user'] = $response_auth['DATA'][0]['ID_USUARIO_SISTEMA'];

        $permissions = '0';

        $response_permissions = $System->obtenerPermisosUsuario($_SESSION['SII']['id_system_user']);

        if ($response_permissions['STATUS'] == 'Fail') {
            echo json_encode($response_permissions);
            die();
        }

        foreach ($response_permissions['DATA'] as $permiso) {
            $permissions .= ','.$permiso['ID_PROCESO'];
        }

        $_SESSION['SII']['sessionState'] = true;

        echo json_encode(['STATUS'=> 'Success', 'DATA' => explode(",", $permissions)]);
    }

    /**
     *  ========== COMPROBACIÓN DE SESIÓN ==========
     * @method: Comprobar sesión
     * @return: Indicador de la sesión actual
     * =============================================
    */
    public function comprobarSesion () {
        if(!isset($_SESSION['SII']['sessionState'])) {
            $_SESSION['SII']['sessionState'] = false;
        }

        $_SESSION['SII']['sessionState'] ? $resultado = ['ESTADO' => 'Active'] : $resultado = ['ESTADO' => 'Inactive'];

        echo json_encode($resultado);
    }

    /**
     *  ========== NOMBRE DE USUARIO ==========
     * @method: Obtener nombre de usuario
     * @return: Nombre de usuario de la sesión actual
     * ========================================
    */
    public function getNombreUsuario () {
        $System = new SystemC();

        $user_name = $System->getNombreUsuario($_SESSION['SII']['id_system_user']);

        if ($user_name['STATUS'] == 'Fail') {
            echo json_encode($user_name);
            die();
        }

        if (!empty($user_name['DATA'])) {
            $user_name['DATA'] = $user_name['DATA'][0];
        }

        echo json_encode($user_name);
    }

    /**
     *  ========== NOMBRE DE USUARIO ==========
     * @method: Obtener nombre de usuario
     * @return: Nombre de usuario de la sesión actual
     * ========================================
    */
    public function getNombreUsuarioCompleto () {
        $System = new SystemC();

        $user_name = $System->getNombreUsuarioCompleto($_SESSION['SII']['id_system_user']);

        if ($user_name['STATUS'] == 'Fail') {
            echo json_encode($user_name);
            die();
        }

        if (!empty($user_name['DATA'])) {
            $user_name['DATA'] = $user_name['DATA'][0];
        }

        echo json_encode($user_name);
    }

    /**
     *  ========== SUBSISTEMAS ==========
     * @method: Obtener los subsistemas
     * @return: Subsistemas del usuario en sesión
     * ==================================
    */
    public function getSubsistemas () {
        $System = new SystemC();

        $subsistemas = $System->getSubsistemas($_SESSION['SII']['id_system_user']);

        if ($subsistemas['STATUS'] == 'Fail') {
            echo json_encode($subsistemas);
            die();
        }

        foreach ($subsistemas['DATA'] as $key => $subsistema) {
            $procesos = $System->getProcesosSistema($_SESSION['SII']['id_system_user'], $subsistema['ID_SISTEMA']);

            if ($procesos['STATUS'] == 'Fail') {
                echo json_encode($procesos);
                die();
            }

            $subsistemas['DATA'][$key]['PROCESOS'] = $procesos['DATA'];
        }

        echo json_encode($subsistemas);
    }

    /**
     *  ========== CIERRE DE SESIÓN ==========
     * @method: Realizar el cierre de sesión y destrucción de datos
     * @return: NULL
     * ================================================
    */
    public function cerrarSesion () {
        unset($_SESSION['SII']);

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();

            setcookie(
                session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();
    }

    /**
     *  ========== PERMISOS DE PROCESO ==========
     * @method: Realiza la validación de los permisos sobre un proceso
     * @return: Si el usuario tiene o no permisos
     * ================================================
    */
    public function validarPermisos () {
        $SystemC = new SystemC();

        if (!in_array($this->proceso, $_SESSION['SII']['permisos'])) {
            echo json_encode([
                'STATUS'=> 'Success',
                'DATA'=>['PERMISOS'=> false]
            ]);
            die();
        }

        $permisos = $SystemC->obtenerPermisosProceso($_SESSION['SII']['id_system_user'],$this->proceso);

        if ($permisos['STATUS'] == 'Fail') {
            echo json_encode($permisos);
            die();
        }

        $_SESSION['SII']["Insert"] = $permisos['DATA'][0]['insertar'];
        $_SESSION['SII']["Delete"] = $permisos['DATA'][0]['eliminar'];
        $_SESSION['SII']["Update"] = $permisos['DATA'][0]['actualizar'];
        $_SESSION['SII']["Select"] = $permisos['DATA'][0]['consultar'];

        echo json_encode([
            'STATUS'=>'Success',
            'DATA'=>['PERMISOS'=>true]
        ]);
    }

    /*}

    $caller = new SystemConnector();
    echo $caller->functionCaller();*/
}
