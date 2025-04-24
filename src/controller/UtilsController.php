<?php
	namespace src\Controller;

	use DateTime;
    use src\controller\MysqlController as Mysql;
    use PDO;

class UtilsController {
    /**
	 * ================================
	 *  Funciones - Utiles
	 * ================================
	*/
	public static function Get_CatologoC($SP_Parameter) {
		$Mysql = new Mysql();
		$Data = $Mysql->Execute_SP('SPD_0000_CONSULTA_CATALOGO', $SP_Parameter, false);
		return $Data;
	}

	public static function Get_CatologosC($Obj) {
		$Mysql = new Mysql();
		$SP_Parameters = [$Obj["id"], $Obj["param1"], $Obj["param2"]];
		$Data = $Mysql->Execute_SP('SPD_0000_CONSULTA_CATALOGO_PARAMETRIZADO', $SP_Parameters, false);
		return $Data;
	}

	public static function Get_SPD_Funcionamiento_General($Obj) {
        $Mysql = new Mysql();
		if(count($Obj) == 7) {
			$SP_Parameters = [$Obj[0], $Obj[1], $Obj[2], $Obj[3], $Obj[4], $Obj[5], $Obj[6]];
			$Data = $Mysql->Execute_SP('SPD_0000_FUNCIONAMIENTO_GENERAL', $SP_Parameters);
		} else {
			$Data = ["STATUS" =>"Fail", "DATA" => "Error en Funcion SPD General"];
		}

		return $Data;
	}

	/**
	 * @description: Valida las cadenas que cumplan con las condiciones y el encoding
	 * @param param : cadena
	 * @param type : tipo a evaluar
	*/
	public static function Set_Type($param) {
		if ($param === 'NULL') {
			return 'NULL';
		}
		
		// Determinar el tipo de dato
		if (is_numeric($param)) {
			return $param;
		} else {
			// Sanitizar la entrada de datos
			$param = trim($param);    
			
			// Escapar comillas simples para MySQL
			$param = self::customEscapeSingleQuotes($param);
			
			// Devolver cadena entre comillas simples
			return !empty($param) ? "'" . mb_convert_encoding($param, "UTF-8") . "'" : 'NULL';
		}
	}
	
	private static function customEscapeSingleQuotes($param) {
		// Reemplazar comillas simples con dos comillas simples para evitar SQL Injection
		return str_replace("'", "''", $param);
	}
	
	
	/**
	 * @description: Cantidad de espacios a rellenar del lado derecho se ocupa en la sentencia
	 * @param id_system_user: Se debe colocar siempre al final del Array para evitar problemas al recorrerlo
	 * @param cantidad_espacios : que se desean agregar
	*/
	public static function fillRight($myArray, $cantidad_espacios) {
		$user_id = "";
		if (!is_array($myArray)) {
			echo "Error al recibir el array.";
			return [];
		}
	
		$cantidadElementos = count($myArray);	
		if ($cantidadElementos >= $cantidad_espacios) {
			return $myArray;
		}
	
		// Verificar si la clave "id_system_user
		$agregarAlFinal = false;
		if( isset($myArray["id_system_user"]) == "id_system_user" ){
			$user_id = $myArray["id_system_user"];
			unset($myArray["id_system_user"]); 
			$agregarAlFinal = true;
		}
	
		// Calcular la clave para "id_system_user"
		$ultimoIndice = $cantidad_espacios - 1;
		$array_empty = array_fill($cantidadElementos, $cantidad_espacios - $cantidadElementos, "");
		$MyNewArray = array_merge($myArray, $array_empty);
	
		// Si la clave "id_system_user" está presente, agregar "id_system_user" al final del array con la última clave
		if ($agregarAlFinal) {
			$MyNewArray[$ultimoIndice] = $user_id;
		}
	
		return $MyNewArray;
	}
	

	
	/**
	 * @param array
	 * @param quitarEspacios cadena de texto 
	 */
	public static function quitarEspacios($cadena) {
		// Reemplazar múltiples espacios con uno solo
		$cadena = preg_replace('/\s+/', ' ', $cadena);

		// Eliminar espacios al principio y al final de la cadena
		$cadena = trim($cadena);
		return $cadena;
	}

	/**
	 * Convierte una cadena con espacios a un número entero o flotante.
	 *
	 * @param string $cadena La cadena de entrada que contiene espacios.
	 * @param bool $es_flotante (Opcional) Si es true, la cadena se convertirá a un número flotante. Si es false o no se proporciona, se convertirá a un número entero.
	 * @return int|float El número convertido.
	 */
	public static function convertirCadenaANumero($cadena, $es_flotante = false) {
		// Eliminar los espacios de la cadena
		$cadena_sin_espacios = str_replace(' ', '', $cadena);
		
		// Convertir a número según el tipo especificado
		if ($es_flotante) {
			return floatval($cadena_sin_espacios);
		} else {
			return intval($cadena_sin_espacios);
		}
	}

	/**
	 * Obtiene el nombre del  mes en español o su abreviatura a partir del numero del mes
	 */
	public static function Get_Month_Name($Month_Number) {
		switch ($Month_Number) {
			case 1: return "Enero";
			case 2: return "Febrero";
			case 3: return "Marzo";
			case 4: return "Abril";
			case 5: return "Mayo";
			case 6: return "Junio";
			case 7: return "Julio";
			case 8: return "Agosto";
			case 9: return "Septiembre";
			case 10: return "Octubre";
			case 11: return "Noviembre";
			case 12: return "Diciembre";
			default: return false;
		}
	}
	

	/**
	 * Limpia las variables de los archivos cargados.
	 */
	public static function CreateDataFilePost($DATA_FILE) {
        if (isset($DATA_FILE['name'])) {
           	$String_Find = strtolower( $DATA_FILE['name'] );
			$replace = array('.jpeg', '.jpg', '.png','.pdf', '.xml', '.xls', '.xlsm');
			$DATA_FILE['name'] = str_replace($replace, "", $String_Find);
        }

        if (isset($DATA_FILE['type'])) {
            $String_Type = $DATA_FILE['type'];
            if( stripos($String_Type, 'jpeg') !== false){
                $DATA_FILE['type'] = '.jpeg';
            }
            if( stripos($String_Type, 'jpg') !== false){
                $DATA_FILE['type'] = '.jpg';
            }
            if( stripos($String_Type, 'png') !== false){
                $DATA_FILE['type'] = '.png';
            }
            if( stripos($String_Type, 'pdf') !== false){
                $DATA_FILE['type'] = '.pdf';
            }
            if( stripos($String_Type, 'xml') !== false){
                $DATA_FILE['type'] = '.xml';
            }
            if( stripos($String_Type, 'xls') !== false){
                $DATA_FILE['type'] = '.xls';
            }
            if( stripos($String_Type, 'xlsm') !== false){
                $DATA_FILE['type'] = '.xlsm';
            }
        }
        return $DATA_FILE;
	}
	

	/**
	 * Crea un Response del Data enviado es necesario enviar el contenido Blob
	 * @params $contentBlob || $data["blob"]
	*/
	public static function CreateDataFile64($ContentFile) {
		// $Canvas = ['extension' => '','blob' => '','tmp_data' => ''];
		$supportedExtensions = [
								'data:image/jpeg;base64,' => '.jpeg',
								'data:image/jpg;base64,' => '.jpg',
								'data:image/png;base64,' => '.png',
								'data:application/pdf;base64,' => '.pdf',
								'data:text/xml;base64,' => '.xml',
								'data:text/csv;base64,' => '.csv',
								'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' => '.xlsx'
							   ];
	
		if(is_array($ContentFile)) {
			if(!isset($ContentFile['blob'])){
				return "data [blob] no localizado #500100";
			}
		}

		if(empty($ContentFile['blob'])) {
			return "documento vacio #500200";
		}
	
		// Se extrae parte del string blob para compararlo 
		$subsBlob = substr($ContentFile['blob'], 0, 80);
		foreach ($supportedExtensions as $key => $value) {
			if (stripos($subsBlob, $key) !== false) {
				$ContentFile['extension'] = $value;
				$ContentFile['blob'] = str_replace($key, '', $ContentFile['blob']);
				break;
			}
		}
	
		if(empty($ContentFile['extension'])) {
			return "Ocurrió un error - extensión no encontrada"; // No extension found
		}
		
		if(empty($ContentFile['blob'])){
			return false; //error en el content
		}

		// print_r($ContentFile['blob']);
		$blob_replace = str_replace(' ', '+', $ContentFile['blob']);
		$ContentFile['blob'] = base64_decode($blob_replace);
	
		// Rest of your code here, if needed.
		return $ContentFile;
	}
	

    /**
     * @descripction
     * @param Elements : acepta array y tambien cadena string
     * @param SP_Name
	 * @param Only_Recordset : Elige si quieres retornar Json o Array
	 * @param dataDefault : genera en automático el tipo de dato
     */
    public static function CreateQueryString($Elements){
        $Error_Code = 400; //default 400
        $SP_Parameters = '';

        if( is_array($Elements) ){
            if(	sizeof($Elements) < 1){
                echo "Error RunQuery";
                return false;
            }

			foreach ($Elements as $clave => $valor) {
				$Elements[$clave] = self::Set_Type($valor);
			}

            $SP_Parameters = implode(',', $Elements);
        }else{
            if(	$Elements == ''){
                echo "Error RunQuery";
                return false;
            }
            $SP_Parameters = $Elements;
        }

        return $SP_Parameters;
	}

	/**
     * @descripction
     * @param Data : acepta array y tambien cadena string
	 * @return: []"STATUS" => "Success" / "Fail"]
     */
	public static function CreateResponse($Data){
		if(isset($Data[0]["CLAVE"])){
			// Si la respuesta es de un solo array se unifican
			if(count(array_keys($Data)) <= 1)
			{
			   $DataObj = $Data[0];
			   $DataObj["STATUS"] = "Success";
			}
			
			if(intval($Data[0]["CLAVE"]) < 0)
			{
				$DataObj["STATUS"] = "Fail";
				$DataObj["CODE"] = $Data[0]["CODE"] ?? '';
				$DataObj["CLAVE"] = $Data[0]["CLAVE"] ?? '';
				$DataObj["MENSAJE"] = $Data[0]["MENSAJE"] ?? '';
			}						
		}else{
			$DataObj["STATUS"] = "Success";
			$DataObj["DATA"] = $Data;
			
			if(empty($DataObj["DATA"])){
				$DataObj["STATUS"] = "Fail";
				$DataObj["CLAVE"] = -405;
				$DataObj["MENSAJE"] = "No hay datos disponibles";
			}
		}

        return $DataObj;
	}

	/**
     * @descripction
     * @param directorio :  enviar ruta completa del directori
	 * @return: void
	 * @version: Test en Pruebas
     */
	public static function eliminarArchivosDirectorio($directorio) {
        // Obtener la lista de archivos en el directorio
        $archivos = scandir($directorio);
    
        // Verificar si se obtuvo la lista de archivos correctamente
        if ($archivos !== false) {
            // Iterar sobre la lista de archivos
            foreach ($archivos as $archivo) {
                // Excluir los directorios especiales '.' y '..'
                if ($archivo != "." && $archivo != "..") {
                    // Construir la ruta completa del archivo
                    $rutaArchivo = $directorio . '/' . $archivo;
    
                    // Verificar si es un archivo y no un directorio
                    if (is_file($rutaArchivo)) {
                        // Intentar eliminar el archivo
                        if (unlink($rutaArchivo)) {
                            echo 'Archivo eliminado: ' . $archivo . '<br>';
                        } else {
                            echo 'Error al eliminar el archivo: ' . $archivo . '<br>';
                        }
                    }
                }
            }
        } else {
            echo 'Error al leer el directorio.';
        }
    }

	public static function print_array($array) {
        echo "<ul>";
        foreach ($array as $clave => $elemento) {
            echo "<li>{$clave}: ";
            if (is_array($elemento)) {
                self::print_array($elemento);
            } else {
                echo "{$elemento}";
            }
            echo "</li>";
        }
        echo "</ul>";
    }

	/**
	 * @descripction: Verificar el formato de la fecha y ajustarlo si es necesario
	 * @return: void
	 * @version: Test
	*/
	public static function formatFechaToDatabase($fechaString, $formatoSalida = 'Y-m-d') {
		if (strpos($fechaString, '/') !== false) {
			$formatoEntrada = 'd/m/Y';
		} elseif (strpos($fechaString, '-') !== false) {
			$formatoEntrada = 'd-m-Y';
		} else {
			return 'Formato de fecha no reconocido'; // Formato no reconocido
		}
	
		// Crear un objeto DateTime a partir del formato detectado
		$fecha = DateTime::createFromFormat($formatoEntrada, $fechaString);
		
		// Verificar si la conversión fue exitosa
		if ($fecha === false) {
			return 'Fecha inválida';
		}
		
		// Formatear la fecha al formato de salida especificado
		return $fecha->format($formatoSalida);
	}
	
	
	/**
     * @descripction: Cargar archivos al servidor como BLOB
     * @param directorio : 
	 * @return: void
	 * @version: Test
     */
	public static function uploadFileBlobServer($ArrayData){
        $status = false;
		$default_long_name = 35;

        if(!isset($ArrayData["Files"]["name"]) ){
            return ['status_doc' => "fail", 'description' => 'Error nombre del archivo no especificado'];
        }

		if(!isset($ArrayData["Files"]["blob"]) ){
			return ['status_doc' => "fail", 'description' => 'Contenido blob del archivo no existe'];
		}

		if(!isset($ArrayData["DIR_FILES"]) ){
			return ['status_doc' => "fail", 'description' => 'Directorio Padre no especificado'];
		}

		if(!isset($ArrayData["dir_folder_name"]) ){
			return ['status_doc' => "fail", 'description' => 'Folder del directorio no especificado'];
		}
        
        $file = self::CreateDataFile64($ArrayData["Files"]);
        if($file === false){
            return ['status_doc' => "fail", 'description' => 'Error al leer el archivo #500400'];
        }

		// Generar una cadena aleatoria basada en la fecha y la hora actual, y agregarla al principio del nombre del archivo
		$newFileName = date("d") . date('His') . '_' . str_replace(' ', '', $ArrayData["Files"]["name"]);
		// Eliminar caracteres especiales del nombre del archivo
		$newFileName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $newFileName);
		// Truncar el nombre del archivo a una longitud máxima de caracteres
		$newFileName = substr($newFileName, 0, $default_long_name);
		// Obtener la extensión del nombre de archivo original
		$extension = pathinfo($ArrayData["Files"]["name"], PATHINFO_EXTENSION);
		// Agregar la extensión al nuevo nombre de archivo
		$newFileName .= '.' . $extension;

        $dirFolder =  $ArrayData["dir_folder_name"] ."/". date("Y") . "/" . date("m");
        $dirPath = $ArrayData["DIR_FILES"] . $dirFolder;

        if(!is_dir( $dirPath )){
            mkdir( $dirPath , 0777, true);
        }
        chmod( $dirPath , 0777);

        if(file_put_contents( $dirPath ."/".$newFileName , $file['blob'])){
            $status = true;
        }else{
            return ['status_doc' => "fail", 'description' => 'Hubo un error al subir el archivo #500330.'];
        }

        if($status){
            $response = ['status_doc' => 'success',
                         'nombre_original' => $ArrayData["Files"]["name"],
                         'nombre_archivo' => $newFileName,
                         'ruta_archivo' => $dirFolder."/".$newFileName,
                         'tipo_archivo' => $file['extension'],
                         'description' => 'El archivo se ha subido correctamente.'
                        ];
        }else{
           return ['status_doc' => "fail", 'description' => 'Hubo un error al subir el archivo #500300.'];
        }

        return  $response;
    }
    
	/**
	 * Funcion static que genera un Log para el sistema
	 */
	public static function add_log($SP_Name, $SP_Parameters = '', $dir_name = "default") {
		$ruta_path =  "../logs/" . "/". $dir_name . "/" . date("m");
		$Log_Level = "INFO";
		$content_old = "";
	
		if(!is_dir($ruta_path)) {
			mkdir($ruta_path, 0777, true);
		}
	
		if(is_dir($ruta_path)) {
			$name_file = date("dmY") . ".log";
			$full_ruta = $ruta_path . "/"  .$name_file;
	
			if(file_exists($full_ruta) && !is_writable($full_ruta)) {
				$content_old = file_get_contents($full_ruta);
				unlink($full_ruta);
			}
	
			$full_ruta = fopen($full_ruta, "a+");
		}
		
		// if(strpos($SP_Name, "SPD") === 0) {
			$SP_Parameters = self::CreateQueryString($SP_Parameters);
			$Message = "CALL " . $SP_Name . "(" . $SP_Parameters . ");";
		// }
	
		fwrite($full_ruta, $content_old . "\r");
		$Full_Message = date("Y-m-d H:i:s") . " [" . $Log_Level . "] : " . $Message . PHP_EOL;
		fwrite($full_ruta, $Full_Message);
	
		fclose($full_ruta);
	}
	
	
}