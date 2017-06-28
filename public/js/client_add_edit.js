//Non-map functions etc.

//Form buttons and boxes elements
let addInterrogationBtn = document.getElementById('add-interrogation-btn');
let witnessPosCheckbox = document.getElementById('witness-pos-checkbox');

//event listeners
addInterrogationBtn.addEventListener('click', interrogationForm);
witnessPosCheckbox.addEventListener('click', toggleWitnessPosition);

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

function toggleWitnessPosition() {
    let posbox = document.querySelectorAll('.witness-pos-box')
    let helptext = document.getElementById('witness-pos-helper');
    if (witnessPosCheckbox.checked) {
        posbox.forEach((el) => {
            console.log(el.readonly);
            el.removeAttribute('readonly')
        })
        addWitnessMarker();

    } else {
        posbox.forEach((el) => {
            el.setAttribute('readonly', 'readonly');
        })
        removeWitnessMarker();
    }
    helptext.classList.toggle('hidden');
}