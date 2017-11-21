'use strict';

var editList = (function() {
    /**
     * Prints table of observations with edit option
     */
    function renderList() {
        let listEl = document.getElementById('edit-list-body');
        //sorting obs list by date descending
        let sorted = core.getObs().sort((a, b) => {
            return b.obsDate - a.obsDate;
        });

        let html = ``;
        for (let i in sorted) {
            html += `<tr>
                        <td>${sorted[i].title}</td>
                        <td>${dateFormat(sorted[i].obsDate, 'isoUtcDateTime')}</td>
                        <td>${sorted[i].obsLocation.adress}</td>
                        <td><a href="/users/editform?id=${sorted[i]._id}">redigera</a> 
                    </tr>`
        }
        listEl.innerHTML = html;
    }
    return {
        renderList: renderList
    }

})();