'use strict';

//module for form's non-map functions etc.
var addEditForm = (function() {
    //submit event is fired on the form...
    var pkform = document.getElementById('pk-post-form');

    //Form buttons and boxes elements
    let addProtocolBtn = document.getElementById('add-protocol-btn');
    let addSourceBtn = document.getElementById('add-source-btn');
    let posCheckboxes = Array.from(document.querySelectorAll('.pos-checkbox'));

    //event listeners
    pkform.addEventListener('submit', (e) => {
        e.preventDefault();
        ajaxFormPost();
    });

    addProtocolBtn.addEventListener('click', (e) => {
        addSourceFields(e.target.getAttribute('data-target'))
    });
    addSourceBtn.addEventListener('click', (e) => {
        addSourceFields(e.target.getAttribute('data-target'))
    });


    /**
     * We only want to control one marker at a time so we have to switch off/disable the others
     * not to cause confusion.
     */
    posCheckboxes.forEach((element) => {
        element.addEventListener('click', (el) => {
            posCheckboxes.forEach((e) => {
                if (e !== el.target) { //thos was NOT clicked = toggle off
                    e.checked = false; //set it to unclicked
                    togglePositionInput(e); //run the function that will disable the input & marker
                }
            })
            togglePositionInput(el.target); //clicked = toggle on/off.
        })
    }, this);

    /**
     * Adds 2 form fields & a button at each call
     * button click removes itself + parent element
     */
    function addSourceFields(target) {
        let interContainer = document.getElementById(target + '-container');
        let newfield = document.createElement('div');
        newfield.setAttribute('class', 'form-group form-inline');
        if (target === 'protocol') {
            newfield.innerHTML = `<label for="protocol-date" class="mr-2">Förhörsdatum:</label>
                            <input type="date" name="protocol-date" min="1986-02-28" class="form-control col-sm-3 mr-2" required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))">`;
        } else {
            newfield.innerHTML = `<label for="source-name" class="mr-2">Källa:</label>
                                <input type="text" name="source-name" class="form-control col-sm-5 mr-2" required>`;
        }
        newfield.innerHTML += `<label for="${target}-url" class="mr-2">URL-länk:</label>
                <input type="url" name="${target}-url" class="form-control col-sm-3 mr-2" pattern="^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,})?(?:[\/?#]\S*)?$">
                <button type="button" class="btn btn-sm btn-danger mr-2 remove-${target}-btn">Ta bort</button>
                `;

        interContainer.appendChild(newfield);

        let btns = Array.from(document.querySelectorAll('.remove-' + target + '-btn')).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.target.parentNode.remove();
            })
        }, this);
    }

    /**
     * Enables/disables position input for witness/palme - sends the target marker to map function
     */
    function togglePositionInput(element) {
        let target = element.getAttribute(['data-target'])
        let targetBox = Array.from(document.querySelectorAll('.' + target + '-pos-box'));
        let helptext = document.getElementById(target + '-pos-helper');
        if (element.checked) {
            targetBox.forEach((el) => {
                el.removeAttribute('readonly')
            })
            addEditMap.activateMarker(target);
            helptext.classList.remove('hidden');

        } else {
            targetBox.forEach((el) => {
                el.setAttribute('readonly', 'readonly');
                helptext.classList.add('hidden');
            })
            addEditMap.deactivateMarker(target);
        }

    }

    /**
     * Using ajax instead of default http post
     */
    function ajaxFormPost() {
        var form = $(pkform); //converting to jq-obj
        var postMessage = document.getElementById('post-message');
        var postError = document.getElementById('post-error')
        postMessage.innerHTML = 'Vänta...'

        var submitBtn = document.getElementById('form-post-btn');
        submitBtn.setAttribute('disabled', true);

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            success: (data) => {
                console.log('post success!');
                postMessage.innerHTML = data.msg; //printing the status message recieved from server 2 user
                postError.innerHTML = '';
                setTimeout(function() { window.location.replace('/'); }, 1000); //redirecting to index after 1 sec
            },
            error: function(data) {
                console.log('post error!');
                postMessage.innerHTML = data.responseJSON.msg;
                postError.innerHTML = data.responseJSON.err.message || data.responseJSON.err.errmsg;
                submitBtn.removeAttribute('disabled');
            },
        });
    }

})();