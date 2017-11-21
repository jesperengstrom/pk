'use strict';

var editList = function () {
    /**
     * Prints table of observations with edit option
     */
    function renderList() {
        var listEl = document.getElementById('edit-list-body');
        //sorting obs list by date descending
        var sorted = core.getObs().sort(function (a, b) {
            return b.obsDate - a.obsDate;
        });

        var html = '';
        for (var i in sorted) {
            html += '<tr>\n                        <td>' + sorted[i].title + '</td>\n                        <td>' + dateFormat(sorted[i].obsDate, 'isoUtcDateTime') + '</td>\n                        <td>' + sorted[i].obsLocation.adress + '</td>\n                        <td><a href="/users/editform?id=' + sorted[i]._id + '">redigera</a> \n                    </tr>';
        }
        listEl.innerHTML = html;
    }
    return {
        renderList: renderList
    };
}();