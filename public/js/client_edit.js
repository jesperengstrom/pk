/**
 * renders the list of posts to edit
 */
function renderlist() {
    let listEl = document.getElementById('edit-list-body');
    //sorting obs list by date descending
    let sorted = obs.sort((a, b) => {
        return b.obsDate - a.obsDate;
    });
    let html = ``;
    for (let i in sorted) {
        html += `<tr>
                        <td>${sorted[i].name}</td>
                        <td>${dateFormat(sorted[i].obsDate, 'isoDateTimeShort')}</td>
                        <td><a href="/users/editform?id=${sorted[i]._id}">redigera</a> 
                    </tr>`
    }
    listEl.innerHTML = html;
}