# (test-task) Веб-приложение "Телефонный справочник"

Для развертывания этого проекта необходимо:
- Создать новую БД:
> mysql -uroot -p -e 'CREATE DATABASE test_task'
- Загрузить дамп БД из файла sql/mysql_init.sql:
> mysql -uroot -p test_task < sql/mysql_init.sql
- Проверить настройки подключения к БД в файле app/config.php
- Прописать имя домена вашего сервера в корневом файле .htaccess (например localhost):
```diff
- RewriteCond %{HTTP_HOST} ^test-task.local$ [NC,OR]
- RewriteCond %{HTTP_HOST} ^test-task.local$
+ RewriteCond %{HTTP_HOST} ^localhost$ [NC,OR]
+ RewriteCond %{HTTP_HOST} ^localhost$
```
- Если все настроено верно, веб-приложение будет доступно по адресу http://localhost.
