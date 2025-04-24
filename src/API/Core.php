<?php
use src\controller\UtilsController as Utils;

class Core
{
    public $id;
    public $obj;

    public function __construct($Class_Properties = null)
    {
        // Assign Class Properties
        $this->assignPropertiesValues($Class_Properties);
    }

    public function getProperty($Property_Name)
    {
        if (property_exists(get_class($this), $Property_Name)) {
            return $this->{$Property_Name};
        } else {
            return null;
        }
    }

    public function setProperty($Property_Name, $Property_Value)
    {
        if (property_exists(get_class($this), $Property_Name)) {
            $this->{$Property_Name} = trim(htmlentities($Property_Value, ENT_QUOTES, 'UTF-8'));
        }
    }

    public function assignPropertiesValues($Properties_Array)
    {
        if (is_array($Properties_Array)) {
            foreach ($Properties_Array as $Property_Name => $Property_Value) {
                if (property_exists(get_class($this), $Property_Name)) {
                    if (is_array($Property_Value)) {
                        $this->{$Property_Name} = $Property_Value;
                    } elseif (is_object($Property_Value)) {
                        $this->{$Property_Name} = $Property_Value;
                    } else {
                        $this->{$Property_Name} = trim($Property_Value);
                    }
                }
            }

        }
    }

    public function Get_Catalogo() {
        $cat = Utils::Get_CatologoC($this->id);
        echo json_encode( $cat );
    }

    public function Get_Catalogos() {
        $obj = json_decode($this->obj, true);

        $cat = Utils::Get_CatologosC( $obj );
        echo json_encode( $cat );
    }
}