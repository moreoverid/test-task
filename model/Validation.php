<?php

namespace Model;

class Validation
{
    static function validatePhone($phone) {
        return preg_match("/^\+[0-9]{11}$/", $phone);
    }
}
