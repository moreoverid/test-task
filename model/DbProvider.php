<?php

namespace Model;

class DbProvider
{
    private static $pdo;

    /**
     * DbProvider constructor.
     * @param $dbuser
     * @param $dbpass
     * @param $dbname
     */
    public function __construct($dbuser, $dbpass, $dbname)
    {
        if (null === self::$pdo && $dbuser && $dbname) {
            self::$pdo = new \PDO(
                'mysql:host=localhost;dbname=' . $dbname, $dbuser, $dbpass,
                [\PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"]
            );
        }
    }

    /**
     * @param $sql
     * @param null $params
     * @param null $fetch_style
     * @return mixed
     */
    public function getDbResult($sql, $params = null, $fetch_style = null)
    {
        if (self::$pdo !== null) {
            try {
                self::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                $sth = self::$pdo->prepare($sql);
                if ($params) {
                    foreach ($params as $key => $val) {
                        $param = ':' . $key;
                        $sth->bindValue("$param", $val, \PDO::PARAM_STR);
                    }
                }
                $sth->execute();

                return $fetch_style ? $sth->fetchAll(\PDO::FETCH_ASSOC) : null;

            } catch (\Exception $e) {
                die($e->getMessage());
            }
        }

        return false;
    }
}
