<?php
/**
 * Description of Logger
 * @author Pedro Nequiz
 */
namespace src\controller;
if(!defined('BASEPATH'))
    define('BASEPATH', $_SERVER['DOCUMENT_ROOT']);

use src\controller\UtilsController as UtilsC;

// session_start();
class AddLog{
	// Constants
	const INFO = "INFO";
	const DEBUG = "DEBUG";
	const WARNING = "WARNING";
	const ERROR = "ERROR";
	const DATA_ARRAY = "ARRAY";
	const SPD = "SPD";
	
	// Properties
	private $Log_File;
	private $Save_To_File;
	private $dir_name;
	private $ruta_path;
	private $name_file;
	private $full_ruta;
	private $write;
	private $content_old;
	
	public function __construct($Class_Properties = Null, $dir_name = '') {
		if(!isset($this->Save_To_File)){
			$this->Save_To_File = false;
		}
		$this->dir_name = $dir_name;
		$this->Create_Directory();
    }

	// ================================
	//  Si esta instanciada la Clase se crea el directorio
	// ================================
	public function Create_Directory(){
		$this->ruta_path =  "../Logs/" . $this->dir_name;
		$this->write = true;
		$this->content_old = '';

		if($this->dir_name == ''){
			$this->dir_name = 'logger' ;
		}else{
			if(!is_dir($this->ruta_path)) {
				mkdir($this->ruta_path, 0777, true);
				chmod($this->ruta_path, 0777);
			}
		}

		// Si existe el directorio y se creo exitosamente se crea el archvio registro
		if( is_dir($this->ruta_path) ) {
			$this->name_file = date("dmY") . ".log";
			$this->full_ruta = $this->ruta_path . "/" .$this->name_file;
			if(file_exists($this->full_ruta) ){
				if( !is_writable($this->full_ruta) ){
					$this->content_old = file_get_contents($this->full_ruta);
					unlink( $this->full_ruta );
				}
			}
	
			$this->full_ruta = fopen( $this->full_ruta ,"a+");
		}
	}

	public function Info($Message){
		if( is_array($Message) ){
			$Message = json_encode( $Message );
		}
		$this->Print_Message_Log($Message, self::INFO);
	}

	public function Json($Message){
		$Message = json_encode( $Message );
		$this->Print_Message_Log( $Message , self::DATA_ARRAY);
	}

	public function SPD($SP_Name, $SP_Parameters = '', $Number_Fill = ''){
		// if( is_array($SP_Parameters) ) { $SP_Parameters = implode(',', $SP_Parameters); }
		if(is_array($SP_Parameters) ){
			if($Number_Fill != ''){
				$SP_Parameters = UtilsC::fillRight( $SP_Parameters , $Number_Fill);
			}

			$SP_Parameters = UtilsC::CreateQueryString($SP_Parameters);
		}
		$Message = "CALL " . $SP_Name . "(" . $SP_Parameters . ");";
		$this->Print_Message_Log( $Message , self::SPD);
	}
	 
	public function Debug($Message){
		$this->Print_Message_Log($Message, self::DEBUG);
	}
	 
	public function Warning($Message){
		$this->Print_Message_Log($Message, self::WARNING);
	}

	public function Error($Message){
		$this->Print_Message_Log($Message, self::ERROR);
	}

	public function Add_NewLine() {
		echo "\r\n";
	}

	private function Print_Message_Log($Message,$Log_Level){
		if($this->write){
			fwrite($this->full_ruta ,  $this->content_old . "\r") or die("no se pudo crear o insertar el fichero");
			$this->write = false;
		}
		
		$Full_Message = date("Y-m-d H:i:s"). " [". $Log_Level ."] : " . $Message . PHP_EOL;
		 fwrite( $this->full_ruta , $Full_Message ) or die("no se pudo crear o insertar el fichero");
	}
}
?>