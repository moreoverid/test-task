<?php

namespace Controller;

use Model\DbProvider;
use Model\Validation;

class DefaultController
{
    private $db;

    public function __construct()
    {
        global $dbuser, $dbpass, $dbname;
        $this->db = new DbProvider($dbuser, $dbpass, $dbname);
    }

    public function getContacts()
    {
        $sql = 'SELECT contacts.id as id, CONCAT(name, " ", surname) as name, phones.number as number 
                FROM contacts LEFT JOIN phones ON contacts.id = phones.contact_id';
        $res = $this->db->getDbResult($sql, [], \PDO::FETCH_ASSOC);
        $json_data = [];

        // prepare data
        if ($res) {
            foreach ($res as $el) {
                if (!isset($json_data[$el['id']])) {
                    $json_data[$el['id']]['id'] = $el['id'];
                    $json_data[$el['id']]['name'] = $el['name'];
                }

                $json_data[$el['id']]['phones'][] = $el['number'];

            }
        }

        return json_encode($json_data);
    }

    public function getPhonesById($id = null)
    {
        $json_data = [];

        if ($id) {
            $sql = 'SELECT * FROM phones WHERE contact_id = :contact_id';
            $res = $this->db->getDbResult($sql, ['contact_id' => $id], \PDO::FETCH_ASSOC);

            // prepare data
            if ($res) {
                foreach ($res as $el) {
                    $json_data[] = $el['number'];
                }
            }
        }

        return json_encode($json_data);
    }

    public function setPhonesForId()
    {
        $contact_id = isset($_POST['contact_id']) ? $_POST['contact_id'] : null;
        $phones = isset($_POST['contact_phone']) ? $_POST['contact_phone'] : null;
        $message = [];

        if ($contact_id && is_array($phones) && count($phones) > 0) {
            // clean prev numbers
            $sql = 'DELETE FROM phones WHERE contact_id = :contact_id';
            $this->db->getDbResult($sql, ['contact_id' => $contact_id]);

            foreach ($phones as $phone) {
                if (Validation::validatePhone($phone)) {
                    $sql = 'INSERT INTO phones (`number`, `contact_id`) VALUES (:phone, :contact_id)';

                    $this->db->getDbResult(
                        $sql,
                        [
                            'contact_id' => $contact_id,
                            'phone' => "$phone",
                        ]
                    );

                } else {
                    $message[] = 'номер ' . $phone . ' в неверном формате';
                }
            }

            return json_encode(['status' => 0, 'message' => join("\n", $message)] );

        } else {

            return json_encode(['status' => 1, 'message' => 'Ошибка! Получены некорректные данные.']);
        }
    }

    public function removeContact()
    {
        $json = json_decode(file_get_contents('php://input'), true);

        if (isset($json['contact_id']) && $json['contact_id']) {
            $sql = 'DELETE FROM contacts WHERE contacts.id = :contact_id';
            $this->db->getDbResult($sql, ['contact_id' => $json['contact_id']]);

            return json_encode(['status' => 0, 'message' => 'Контакт успешно удален!']);
        }

        return json_encode(['status' => 1, 'message' => 'Ошибка! Получены некорректные данные.']);
    }

    public function addNewContact()
    {
        $name = isset($_POST['name']) ? $_POST['name'] : null;
        $surname = isset($_POST['surname']) ? $_POST['surname'] : null;

        if ($name && $surname) {
            $sql = 'INSERT INTO contacts (`name`, `surname`) VALUES (:name, :surname)';

            $this->db->getDbResult(
                $sql,
                [
                    'name' => $name,
                    'surname' => "$name",
                ]
            );

            return json_encode(['status' => 0, 'message' => 'Новый контакт успешно добавлен!']);
        }

        return json_encode(['status' => 1, 'message' => 'Ошибка! Получены некорректные данные.']);
    }

    public function getContactById()
    {
        $json = json_decode(file_get_contents('php://input'), true);
        $contact_id = isset($json['contact_id']) ? $json['contact_id'] : null;

        if ($contact_id) {
            $sql = 'SELECT `id`, `name`, `surname` FROM contacts WHERE id = :contact_id';
            $res = $this->db->getDbResult($sql, ['contact_id' => $contact_id], \PDO::FETCH_ASSOC);

            return json_encode($res);
        }

        return json_encode(['status' => 1, 'message' => 'Ошибка! Получены некорректные данные.']);
    }

    public function editContact()
    {
        $name = isset($_POST['name']) ? $_POST['name'] : null;
        $surname = isset($_POST['surname']) ? $_POST['surname'] : null;
        $contact_id = isset($_POST['contact_id']) ? $_POST['contact_id'] : null;

        if ($name && $surname && $contact_id) {
            $sql = 'UPDATE contacts SET `name` = :name, `surname` = :surname WHERE id = :contact_id';

            $this->db->getDbResult(
                $sql,
                [
                    'name' => "$name",
                    'surname' => "$surname",
                    'contact_id' => $contact_id,
                ]
            );

            return json_encode(['status' => 0, 'message' => 'Контакт успешно отредактирован!']);
        }

        return json_encode(['status' => 1, 'message' => 'Ошибка! Получены некорректные данные.']);
    }
}
