//Non-map functions etc.

//Form buttons and boxes elements
let addInterrogationBtn = document.getElementById('add-interrogation-btn');
let posCheckboxes = document.querySelectorAll('.pos-checkbox');

//event listeners
addInterrogationBtn.addEventListener('click', interrogationForm);

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
function interrogationForm() {
    let interContainer = document.getElementById('interrogation-container');
    let newfield = document.createElement('div');
    newfield.setAttribute('class', 'form-group form-inline');
    newfield.innerHTML = `
                <label for="interr-date" class="mr-2">Förhörsdatum:</label>
                <input type="date" name="interr-date" min="1986-02-28" class="form-control col-sm-3 mr-2" required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))">
                <label for="protocol-url" class="mr-2">URL-länk:</label>
                <input type="url" name="protocol-url" class="form-control col-sm-3 mr-2" required pattern="^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,})?(?:[\/?#]\S*)?$">
                <button type="button" class="btn btn-sm btn-danger mr-2 remove-interrogation-btn">Ta bort</button>
                `;

    interContainer.appendChild(newfield);

    let btns = document.querySelectorAll('.remove-interrogation-btn').forEach((el) => {
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
    let targetBox = document.querySelectorAll('.' + target + '-pos-box')
    let helptext = document.getElementById(target + '-pos-helper');
    if (element.checked) {
        targetBox.forEach((el) => {
            el.removeAttribute('readonly')
        })
        activateMarker(target);
        helptext.classList.remove('hidden');

    } else {
        targetBox.forEach((el) => {
            el.setAttribute('readonly', 'readonly');
            helptext.classList.add('hidden');
        })
        deactivateMarker(target);
    }

}