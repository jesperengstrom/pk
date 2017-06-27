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
                <input type="date" name="interr-date" min="1986-02-28" class="form-control col-sm-3 mr-2" required>
                <label for="protocol-url" class="mr-2">URL-länk:</label>
                <input type="text" name="protocol-url" class="form-control col-sm-3 mr-2" required>
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
            el.disabled = false;
        })
        addWitnessMarker();

    } else {
        posbox.forEach((el) => {
            el.disabled = true;
        })
        removeWitnessMarker();
    }
    helptext.classList.toggle('hidden');
}