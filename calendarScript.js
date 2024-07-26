function onLoad() {
    const calendarTable = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
    const monthYearHeader = document.getElementById('monthYear');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    // Set the month and year header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate the calendar rows and cells
    let date = 1;
    for (let i = 0; i < 6; i++) { // 6 weeks to cover all possible days in a month
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of the month
                cell.textContent = '';
            } else if (date > daysInMonth) {
                // Empty cells after the last day of the month
                cell.textContent = '';
            } else {
                // Fill in the date
                cell.textContent = date;
                if (date === currentDate && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    cell.classList.add('current-date');
                }
                date++;
            }
            row.appendChild(cell);
        }

        calendarTable.appendChild(row);
    }
}

function getMonth(month) {
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthArray[month];
}

function isLeapYear(year) {
    if(year % 4 == 0){
        if(year % 100 == 0){
            if(year % 400 == 0){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    }
    else{
        return false;
    }
}

function getDaysInMonth(month) {
    if(curMonth == 0){
        return 31;
    }
    else if(curMonth == 1){
        if(isLeapYear(curYear)){
            return 29;
        }
        else{
            return 28;
        }
    }
    else if(curMonth == 2){
        return 31;
    }
    else if(curMonth == 3){
        return 30;
    }
    else if(curMonth == 4){
        return 31;
    }
    else if(curMonth == 5){
        return 30;
    }
    else if(curMonth == 6){
        return 31;
    }
    else if(curMonth == 7){
        return 31;
    }
    else if(curMonth == 8){
        return 30;
    }
    else if(curMonth == 9){
        return 31;
    }
    else if(curMonth == 10){
        return 30;
    }
    else if(curMonth == 11){
        return 31;
    }
}

function populateCalendar(month, year) {
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = getDaysInMonth(month, year);
    var table = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear previous rows

    var date = 1;
    for (var i = 0; i < 5; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 7; j++) {
            var cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.textContent = '';
            } else if (date > daysInMonth) {
                cell.textContent = '';
            } else {
                cell.textContent = date;
                date++;
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}