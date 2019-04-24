// page 1
function getPageOneContacts(sammy) {
    var contentBlock = $('#content-block');
    contentBlock.empty();

    contentBlock.append(
        '<div class="btn-group mt-2 mb-2">' +
        '  <a href="#form/">' +
        '    <button id="add-contact" class="btn btn-primary mr-2" type="button">Добавить контакт</button>' +
        '  </a>' +
        '  <form class="form-inline">' +
        '    <input id="search-query" class="form-control mr-sm-2" type="text" placeholder="Поиск" aria-label="Поиск">' +
        '    <button id="search-contact" class="btn btn-secondary my-2 my-sm-0" type="button">Поиск</button>' +
        '  </form>' +
        '</div>'
    );

    $.ajax({
        url         : '/app/api/getContacts',
        type        : 'get',
        contentType : 'application/json',
        success     : function(response) {
            if (Object.keys(response).length > 0) {
                // generate table header
                $('#content-block').append(
                    '<table id="table-contacts" class="table table-striped mt-3" style="display: none;">' +
                    '<thead class="thead-dark">' +
                    '    <tr>' +
                    '      <th scope="col">Ид.</th>' +
                    '      <th scope="col">Имя и фамилия</th>' +
                    '      <th scope="col">Телефонные номера</th>' +
                    '      <th scope="col">Действие</th>' +
                    '    </tr>' +
                    '  </thead>' +
                    '<tbody></tbody>' +
                    '</table>'
                );

                // generate table content
                $.each(response, function(key, value) {
                    $('#table-contacts > tbody').append(
                        '<tr class="search-row">' +
                          '<td>' + value.id +'</td>' +
                          '<td>' + value.name + '</td>' +
                          '<td>' +
                          '<button class="btn btn-primary mr-2 btn-phone-add" type="button" data-id="' + value.id + '">+</button>' +
                           value.phones.join(', ') +
                          '</td>' +
                          '<td>' +
                          '  <button class="btn btn-primary c-add" type="button" data-id="' + value.id + '">Редактировать</button>' +
                          '  <button class="btn btn-secondary c-remove" type="button" data-id="' + value.id + '">Удалить</button>' +
                          '</td>' +
                        '</tr>'
                    );
                });

                getAddPhonesForm(); // show form to add phones
                removeContact(sammy); // remove contact
                clickToEditContact(sammy); // edit contact

                // show table
                $('#table-contacts').fadeIn("slow");
            } else {
                $('#content-block').append(
                    '<h3>Данных не найдено</h3>' +
                    '<hr>'
                );
            }
        },
        error       : function(response) {
            alert('Ошибка получения данных!');
        }
    });
}

function getAddPhonesForm() {
    $('.btn-phone-add').click(function (e) {
        var contact_id = $(this).data().id;
        $('#contact_id').val(contact_id); // set hidden form field value

        if (contact_id) {
            $.ajax({
                url         : '/app/api/getPhonesById/' + contact_id,
                type        : 'get',
                success     : function(response) {
                    if (Object.keys(response).length > 0) {
                        // add current phones to form
                        var i = 0;
                        $.each(response, function (key, value) {
                            $('#addPhonesForm > div:last').after(
                                '<div class="btn-group mt-1 mb-1 el-phone el-remove">' +
                                '  <input type="text" name="contact_phone[]" value="' + value + '" class="form-control mr-1" placeholder="Номер телефона">' +
                                '  <button type="button" class="btn btn-danger btn-phone-remove">-</button>' +
                                '</div>'
                            );

                            // remove on click event
                            $('.btn-phone-remove').click(function () {
                                $(this).parent().remove();
                            });
                        });
                    } else {
                        if ($('#number-first').length === 0) {
                            $('#addPhonesForm > div:last').after(
                                '<div id="number-first" class="btn-group mt-1 mb-1">\n' +
                                '    <input id="contact-phone" type="text" name="contact_phone[]" class="form-control mr-1" placeholder="Номер телефона">\n' +
                                '    <button id="btn-phone-remove-0" type="submit" class="btn btn-danger" disabled="disabled">-</button>\n' +
                                '</div>'
                            );
                        }
                    }
                },
                error       : function(response) {
                    alert('Ошибка получения данных!');
                }
            });
        }

        $('#addPhonesModal').modal('show');
    });
}

function toggleOtherPageOneEvents(sammy) {
    // Search
    $('#search-contact').click(function (e) {
        var query = $('#search-query').val();
        var res = $('.search-row');
        var i;

        // hide all items
        for(i = 0; i < res.length; i++) {
            res.eq(i).hide();
        }

        // show items that contains search query
        for(i = 0; i < res.length; i++) {
            $('.search-row:contains('+query+')').show();
        }

        // show all on empty query
        if (!query) {
            for(i = 0; i < res.length; i++) {
                res.eq(i).show();
            }
        }
    });

    // add and remove phones in modal window
    $('#btn-phone-add').click(function (e) {
        btnPhoneAddRemove();
    });

    // clean form on modal close
    $('#addPhonesModal').on('hidden.bs.modal', function () {
        $('.el-remove').remove();
    });

    // on add phones form submit action
    $('#submitAddPhonesForm').click(function () {
        $.ajax({
            type        : 'post',
            url         : '/app/api/setPhonesForId',
            data        : $('#addPhonesForm').serialize(),
            success     : function(response) {
                if (response.message) {
                    alert(response.message);
                }

                // redraw contacts table
                getPageOneContacts(sammy);

                $('#addPhonesModal').modal('hide');
            },
            error       : function(response) {
                alert('Ошибка получения данных!');
            }
        });
    });
}

function btnPhoneAddRemove() {
    $('#addPhonesForm > div:last').after(
        '<div class="btn-group mt-1 mb-1 el-phone el-remove">' +
        '  <input type="text" name="contact_phone[]" class="form-control mr-1" placeholder="Номер телефона">' +
        '  <button type="button" class="btn btn-danger btn-phone-remove">-</button>' +
        '</div>'
    );

    // remove on click event
    $('.btn-phone-remove').click(function () {
        $(this).parent().remove();
    });
}

function removeContact(sammy) {
    $('.c-remove').click(function () {
        var contact_id = $(this).data().id;
        var json_data = {"contact_id": contact_id};

        if (contact_id) {
            $.ajax({
                type        : 'post',
                url         : '/app/api/removeContact',
                data        : JSON.stringify(json_data),
                contentType : 'application/json',
                success     : function(response) {
                    if (response.message) {
                        alert(response.message);
                        getPageOneContacts(sammy);
                    }
                },
                error       : function(response) {
                    alert('Ошибка получения данных!');
                }
            });
        }
    });
}

function clickToEditContact(sammy) {
    $('.c-add').click(function () {
        sammy.redirect('#form/');

        var contact_id = $(this).data().id;
        var json_data = {"contact_id": contact_id};

        if (contact_id) {
            $.ajax({
                type        : 'post',
                url         : '/app/api/getContactById',
                data        : JSON.stringify(json_data),
                contentType : 'application/json',
                success     : function(response) {
                    if (response[0].id) {
                        $('#contact_id').val(response[0].id);
                        $('#name').val(response[0].name);
                        $('#surname').val(response[0].surname);
                    }
                },
                error       : function(response) {
                    alert('Ошибка получения данных!');
                }
            });
        }
    });
}

// page 2
function getPageTwoForm() {
    var contentBlock = $('#content-block');
    contentBlock.hide();
    contentBlock.empty();

    contentBlock.append(
        '<form id="addEditContact" class="mt-3 mb-3">' +
        '    <input id="contact_id" type="hidden" name="contact_id" value="">' +
        '    <div class="form-group ml-5 mr-5">' +
        '        <input id="name" class="form-control" type="text" name="name" value="" placeholder="Имя контакта">' +
        '    </div>' +
        '    <div class="form-group ml-5 mr-5">' +
        '        <input id="surname" class="form-control" type="text" name="surname" value="" placeholder="Фамилия контакта">' +
        '    </div>' +
        '    <button id="submitAddEditContact" class="btn btn-primary  ml-5 mr-5" type="button">Сохранить</button>' +
        '</form>'
    );

    contentBlock.fadeIn("slow");
}

function processPageTwoForm(sammy) {
    $('#submitAddEditContact').click(function () {
        var contact_id = $('input[name="contact_id"]').val();
        var url;

        if (!contact_id) { // create new contact
            url = '/app/api/addNewContact';
        } else { // edit existing contact
            url = '/app/api/editContact';
        }

        $.ajax({
            type        : 'post',
            url         : url,
            data        : $('#addEditContact').serialize(),
            success     : function(response) {
                if (response.message) {
                    alert(response.message);
                    sammy.redirect('#/');
                }
            },
            error       : function(response) {
                alert('Ошибка получения данных!');
            }
        });
    })
}

$( document ).ready(function() {
    // Routing
    var app = $.sammy(function() {
        this.get('#/', function() {
            getPageOneContacts(this);
        });
        this.get('#form/', function() {
            getPageTwoForm();
            processPageTwoForm(this);
        });
        this.notFound = function(){ // default page
            $('#content-block').append(
                '<h3>Запрошенной страницы не найдено.</h3>' +
                '<hr>'
            );
        };
        // bind other events
        toggleOtherPageOneEvents(this);
    });
    app.run('#/');
});
