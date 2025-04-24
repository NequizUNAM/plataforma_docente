<?php
/**
 * Documentación del archivo SystemController
 * 
 * Esta clase contiene las consultas cómunes que se realizan a base de datos en
 * el funcionamiento general del Sistema integral de información.
 * 
 * @package TFCA.src.controller
*/
namespace src\controller;

use src\controller\MysqlController as Mysql;
use src\controller\UtilsController as UtilsC;

/**
 * 
 * @package     TFCA.src.controller
 * @author      Edwin Díaz Caballero <ediazc@tfca.gob.mx>
 * @final
 * @since       22/Enero/2024
 * @version     1.0
 */

class SystemController {
    public $Logs = '';
    CONST NAME_CLASS = 'SystemController';
    CONST FILL_ARGS = 7;

    public function __construct(){
        if(!isset($_SESSION))session_start();
    }

    /**
     * ==================== AUTENTICACIÓN ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       22/Enero/2024
     * @version     1.0
     * @param       String $usuario Nombre de usuario de sistema
     * @param       String $contrasenia Contraseña del usuario de sistema
     * @return      Array Usuario de sistema que inicia sesión.
     * @property    0
     * =======================================================
    */
    public function autenticarUsuario($usuario, $contrasenia, $ip) {
        $Mysql = new Mysql();

        $SP_Parameters = ['GET_SYSTEM_USER', $usuario, $contrasenia, $ip];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , self::FILL_ARGS);
        $ResponseC = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);

         // Genera un Log
         UtilsC::add_log('SPD_0000_FUNCIONAMIENTO_GENERAL',$SP_Parameters, self::NAME_CLASS);

        return $ResponseC;
    }

    /**
     * ==================== PERMISOS ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       22/Enero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @return      Array Permisos del usuario.
     * @property    0
     * ===================================================
    */
    public function obtenerPermisosUsuario($id_system_user) {
        $Mysql = new Mysql();

        $SP_Parameters = ['GET_PERMISOS_USUARIO', '', '', '', '', '', $id_system_user];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters, self::FILL_ARGS);
        $ResponseC = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);

        return $ResponseC;
    }

    /**
     * ==================== NOMBRE DE USUARIO ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       24/Enero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @return      Array Nombre del usuario de la sesión
     * @property    0
     * ===================================================
    */
    public function getNombreUsuario($id_system_user) {
        $Mysql = new Mysql();
        $SP_Parameters = ['GET_NOMBRE_USUARIO', '', '', '', '', '', $id_system_user];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , self::FILL_ARGS);
        $ResponseC = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
        return $ResponseC;
    }

    /**
     * ==================== NOMBRE DE USUARIO ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       24/Enero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @return      Array Nombre completo de un usario de sistema
     * @property    0
     * ===================================================
    */
    public function getFullNombreUsuario($id_system_user) {
        $Mysql = new Mysql();
        $SP_Parameters = ['GET_FULL_NOMBRE_USUARIO', '', '', $id_system_user];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , 10);
        $ResponseC = $Mysql->Execute_SP('SPD_000SV_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
        return $ResponseC;
    }

    /**
     * ==================== SUBSISTEMAS ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       24/Enero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @return      Array subsistemas para los que tiene autorización el usuario
     * @property    0
     * ===================================================
    */
    public function getSubsistemas($id_system_user) {
        $Mysql = new Mysql();
        $SP_Parameters = ['GET_SUBSISTEMAS', '', '', '', '', '', $id_system_user];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , self::FILL_ARGS);
        $ResponseC = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
        return $ResponseC;
    }

    /**
     * ==================== PROCESOS DEL SISTEMA ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       30/Enero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @param       Int $id_subsistema id del subsistema
     * @return      Array Procesos agrupados por subistema al que pertenece
     * @property    0
     * ===================================================
    */
    public function getProcesosSistema($id_system_user, $id_subsistema) {
        $Mysql = new Mysql();
        $SP_Parameters = ['GET_PROCESOS_SUBSISTEMA', '', '', '', $id_subsistema, '', $id_system_user];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , self::FILL_ARGS);
        $ResponseC = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
        return $ResponseC;
    }

    /**
     * ==================== PERMISOS DEL PROCESO ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       2/Febrero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @param       Int $id_proceso id del proceso
     * @return      Array permisos del proceso
     * @property    0
     * ==============================================================
    */
    public function obtenerPermisosProceso($id_system_user, $id_proceso) {
        $Mysql = new Mysql();
        $SP_Parameters = ['GET_PERMISOS_PROCESO', '', '', $id_system_user,'','','',$id_proceso];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , 10);
        $ResponseC = $Mysql->Execute_SP('SPD_000SV_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
        return $ResponseC;
    }

    /**
     * ================= Mes del año =================
     * 
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       06/Marzo/2024
     * @version     1.0
     * @param       String $month Número del mes en formato string a 2 dígitos
     * @return      String Nombre del més recibido
     * @property    0
         * Nombre del mes
         * 
         * Método que obtiene el nombre del numero de mes que es pasado como
         * parámetro.
         * 
         * @package     TFCA.src.controller
         * @access      public
         * @author      Edwin Díaz Caballero <ediazc@tfca.gob.mx>
         * @since       20/Octubre/2021
         * @version     1.0
         * @param       String $month Numero del més en forma de string de dos
         *                      dígitos
         * @return      String  Nombre del més que se recibió.
         */
        public function getMonth($month) {
            $months = [
                '01'=>'Enero','02'=>'Febrero','03'=>'Marzo',
                '04'=>'Abril','05'=>'Mayo','06'=>'Junio',
                '07'=>'Julio','08'=>'Agosto','09'=>'Septiembre',
                '10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre'
            ];

            return $months[$month];
        }

    /**
     * ==================== LOG DEL SISTEMA ====================
     * @package     TFCA.src.controller
     * @access      public
     * @author      
     * @since       12/Febrero/2024
     * @version     1.0
     * @param       Int $id_system_user id del usuario de sistema
     * @param       String $tipo_movimiento Tipo de movimiento en la base de datos
     * @param       String $consulta Consulta realizada
     * @return      Array permisos del proceso
     * @property    0
     * ==========================================================
    */
    public function systemLog($id_system_user, $tipo_movimiento, $consulta) {
        $Mysql = new Mysql();
        $fecha_actual = date('Y-m-d H:i:s');
        $consulta = str_replace("'",'"',$consulta);
        $SP_Parameters = ['SET_LOG_SISTEMA', '', '', $id_system_user,$fecha_actual,'','','',$tipo_movimiento,$consulta];
        $SP_Parameters = UtilsC::fillRight( $SP_Parameters , 10);
        $ResponseC = $Mysql->Execute_SP('SPD_000SV_FUNCIONAMIENTO_GENERAL', $SP_Parameters, false);
    }

    /**
     * Obtener el departamento de un usuario
     * 
     * Método que obtiene el id del departamento de un usuario por medio del
     * id system user
     * 
     * @package     TFCA.src.controller
     * @access      public
     * @author      Edwin Díaz Caballero <ediazc@tfca.gob.mx>
     * @since       18/Octubre/2021
     * @version     1.0
     * @param       Integer $user_id Id del usuario de la tabla system_users
     * @return      Integer Id del departamento al cual pertenece el usuario  
     */
    public function getUserDepartment($user_id) {
        $Mysql = new Mysql();

        if($conn = $Mysql->getSystemConn()) {
            if($statement = $conn->prepare(
                "SELECT emp.id_department 
                FROM employees emp 
                JOIN system_users su 
                ON emp.id_employee = su.id_employee 
                WHERE su.id_system_user = ?"
            )) {
                $statement->bind_param('d', $user_id);
                $statement->execute();
                $statement->bind_result($idDepartment);
                while ($statement->fetch()) {
                    $result = $idDepartment;
                }
                $statement->close();
                $Mysql->disconnectBD($conn);

                return $result;
            } else {
                $Mysql->disconnectBD($conn);

                return -1;
            }
        } else {
            return -1;
        }
    }

    /**
     * Obtener el tipo de usuario del sistema
     * 
     * Método que obtiene el tipo de usuario en el sistema (enlace administrador o enlace)
     * 
     * @package     TFCA.src.controller
     * @access      public
     * @author      Edwin Díaz Caballero <ediazc@tfca.gob.mx>
     * @since       04/Febrero/2022
     * @version     1.0
     * @param       Integer $user_id Id del usuario de la tabla system_users
     * @return      Integer tipo de usuario del sistema  
     */
    public function getTypeSystemUser($user_id) {
        $Mysql = new Mysql();

        if($conn = $Mysql->getSystemConn()) {
            if($statement = $conn->prepare(
                "SELECT enlace_admin 
                FROM system_users
                WHERE id_system_user = ?"
            )) {
                $statement->bind_param('d', $user_id);
                $statement->execute();
                $statement->bind_result($typeSystemUser);
                while ($statement->fetch()) {
                    $result = $typeSystemUser;
                }
                $statement->close();
                $Mysql->disconnectBD($conn);

                return $result;
            } else {
                $Mysql->disconnectBD($conn);

                return -1;
            }
        } else {
            return -1;
        }
    }
}