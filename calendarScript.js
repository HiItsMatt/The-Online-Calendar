function onLoad() {

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    const currentDate = today.getDate();

    loadCalender(currentMonth, currentYear, currentDate, today);

    const nextMonthButton = document.getElementById('nextMonth');
    const prevMonthButton = document.getElementById('prevMonth');

    nextMonthButton.addEventListener('click', () => {
        if(currentMonth == 11){
            currentMonth = 0;
            currentYear = currentYear + 1;
        }
        else{
            currentMonth = currentMonth + 1;
            currentYear = currentYear;
        }
        loadCalender(currentMonth, currentYear, currentDate, today);
    });

    prevMonthButton.addEventListener('click', () => {
        if(currentMonth == 0){
            currentMonth = 11;
            currentYear = currentYear - 1;
        }
        else{
            currentMonth = currentMonth - 1;
            currentYear = currentYear;
        }
        loadCalender(currentMonth, currentYear, currentDate, today);
    });

    
}

function loadCalender(targetMonth, targetYear, currentDate, today) {

    clearCalendar();

    currentMonth = targetMonth;
    currentYear = targetYear;

    const calendarTable = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
    const monthYearHeader = document.getElementById('monthYear');

    // Set the month and year header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate the calendar rows and cells
    let date = 1;

    //get the events from local storage
    let events = JSON.parse(localStorage.getItem('events')) || [];

    let weeksNeeded = Math.ceil((firstDay + daysInMonth) / 7);

    for (let i = 0; i < weeksNeeded; i++) { // 6 weeks to cover all possible days in a month
        const row = document.createElement('tr');
        row.style.height= '';

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            const DateObj = new Date(currentYear, currentMonth, date);
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayOfWeek = daysOfWeek[DateObj.getDay()];

            if (i === 0 && j < firstDay) {

                // Empty cells before the first day of the month
                cell.textContent = '';
                cell.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                cell.style.border = '1px solid black';
            }
            else if (date > daysInMonth) {

                // Empty cells after the last day of the month
                cell.textContent = '';
                cell.style.border = '1px solid transparent';
                cell.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
            else {
                cell.classList.add('calendar-cell');

                //create an event container to go inside cell
                const eventContainer = document.createElement('div');
                eventContainer.classList.add('eventContainer');
                eventContainer.innerHTML = `<div class="date">${date}</div>`;

                //check if an event is on this date
                for(let i = 0; i < events.length; i++){
                    let event = events[i];
                    let eventDate = new Date(event.date);

                    //check if an event is on this date
                    if(eventDate.getDate() == date && eventDate.getMonth() == currentMonth && eventDate.getFullYear() == currentYear){
                        let calendarEvent = document.createElement('div');
                        
                        calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                        calendarEvent.style.borderWidth = "2px";
                        calendarEvent.style.borderStyle = "solid";
                        calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);
                        calendarEvent.innerHTML = `${event.title} <div class="calendarEventDetails">${event.time}<br>${event.date}<br>${event.description}<br>Repeats: ${event.repeat}</div>`;
                        calendarEvent.classList.add('calendarEvent');

                        eventContainer.appendChild(calendarEvent);
                        
                    }
                    //check if an event is repeating on this date
                    else if(event.repeat != "none"){

                        //check if the event is repeating weekly and if it is on the current day of the week
                        if(event.repeat == "weekly" && event.dayOfWeek == dayOfWeek){
                            let calendarEvent = document.createElement('div');

                            calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                            calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);
                            calendarEvent.innerHTML = `${event.title} <div class="calendarEventDetails">${event.time}<br>${event.date}<br>${event.description}<br>Repeats: ${event.repeat}</div>`;
                            calendarEvent.classList.add('calendarEvent');

                            eventContainer.appendChild(calendarEvent);
                        }
                        let checkingDate = new Date(currentYear, currentMonth, eventDate.getDate());
                        while(checkingDate.getDate() < date){
                            if(event.repeat == "monthly"){
                                checkingDate.setMonth(checkingDate.getMonth() + 1);
                            }
                            else if(event.repeat == "yearly"){
                                checkingDate.setFullYear(checkingDate.getFullYear() + 1);
                            }
                            else{
                                break;
                            }
                            if(checkingDate.getDate() == date && checkingDate.getMonth() == currentMonth && checkingDate.getFullYear() == currentYear){
                                let calendarEvent = document.createElement('div');

                                calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                                calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);
                                calendarEvent.innerHTML = `${event.title} <div class="calendarEventDetails">${event.time}<br>${event.date}<br>${event.description}<br>Repeats: ${event.repeat}</div>`;
                                calendarEvent.classList.add('calendarEvent');

                                eventContainer.appendChild(calendarEvent);
                            }
                        }
                    }
                }
                cell.appendChild(eventContainer);
                cell.style.transition = "all 0.3s !important";
                cell.addEventListener('click', () => {
                    if(cell.classList.contains('clicked')){
                        cell.classList.remove('clicked');
                        cell.style.position = '';
                        cell.style.left = '';
                        cell.style.top = '';
                        cell.style.width = '';
                        cell.style.height = '';

                        const elements = cell.querySelectorAll(`.${"calendarEvent"}`);
                        elements.forEach(element => {
                            element.classList.remove("enlarged");

                            elements.forEach(element => {
                                element.classList.remove('enlarged');
    
                                const details = element.querySelector('.calendarEventDetails');
                                if (details) {
                                    details.style.display = 'none';
                                }
                            });
                        });
                    }
                    else{
                        cell.classList.add('clicked');
                        cell.style.position = "fixed"; 

                        const rect = cell.getBoundingClientRect();
                        const newLeft = rect.left + (0.5 * rect.width) - 100;
                        const newTop = rect.top + (0.5 * rect.height) - 175;
                        const newWidth = 400;
                        const newHeight = 400;
                        
                        const elements = cell.querySelectorAll('.calendarEvent');
                        elements.forEach(element => {
                            element.classList.add('enlarged');

                            const details = element.querySelector('.calendarEventDetails');
                            if (details) {
                                details.style.display = 'block';
                            }
                        });

                        cell.style.width = `${newWidth}px`;
                        cell.style.height = `${newHeight}px`;
                        cell.style.left = `${newLeft}px`;
                        cell.style.top = `${newTop}px`;                                                            
                    }
                });
                
                cell.addEventListener('mouseover', () => {
                    cell.style.backgroundColor = "rgba(255,255,255, 0.7)";
                });
                cell.addEventListener('mouseout', () => {
                    cell.style.backgroundColor = "rgba(255,255,255, 0.4)";
                });
                
                // Highlight the current date
                if (date === currentDate && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    cell.classList.add('current-date');
                }
                date++;
            }
            row.appendChild(cell);
        }

        calendarTable.appendChild(row);
    }

    displayStoredEvents();
}

//get the current month based on the month number
function getMonth(month) {
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthArray[month];
}

// Function to clear previous calendar cells
function clearCalendar() {
    const calendarBody = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
    while (calendarBody.firstChild) {
        calendarBody.removeChild(calendarBody.firstChild);
    }
}

//find if the current year is a leap year
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

function convertToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

//get the number of days in a month
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

//hide sidebar
function minimiseSidebar(){
    document.getElementById("leftSidebar").style.width = "50px";
    document.getElementsByClassName("mainCalendar")[0].style.marginLeft = "50px";
    document.getElementsByClassName("mainCalendar")[0].style.width = "calc(100vw - 50px)";
    document.getElementById("calendarTable").style.width = "calc(100vw - 50px)";
    document.getElementById("calendarHeader").style.width = "calc(100vw - 50px)";
    document.getElementById("maximiseButton").style.display = "block";
    document.getElementById("minimiseButton").style.display = "none";
    document.getElementById("sidebarContent").style.display = "none";
}

//show sidebar
function maximiseSidebar(){
    document.getElementById("leftSidebar").style.width = "400px";
    document.getElementsByClassName("mainCalendar")[0].style.marginLeft = "400px";
    document.getElementsByClassName("mainCalendar")[0].style.width = "100%";
    document.getElementById("calendarTable").style.width = "calc(100vw - 400px)";
    document.getElementById("calendarHeader").style.width = "calc(100vw - 400px)";
    document.getElementById("maximiseButton").style.display = "none";
    document.getElementById("maximiseButton").style.display = "none";
    document.getElementById("minimiseButton").style.display = "block";
    document.getElementById("sidebarContent").style.display = "block";
}

//logic for showing and hiding the event creation menu
function eventCreationMenu(){
    const eventMenu = document.getElementsByClassName("eventCreationMenu")[0];
    if(document.getElementsByClassName("eventCreationMenu")[0].classList.contains("open")){
        hideEventCreationMenu();
    }
    else{
        showEventCreationMenu();
    }
    
}

//showing the elements inside the event creation menu
function showEventCreationMenu(){
    const eventMenu = document.getElementsByClassName("eventCreationMenu")[0];
    eventMenu.classList.add("open");
    document.getElementById("eventTitle").style.display = "block";
    document.getElementById("eventDate").style.display = "block";
    document.getElementById("eventHour").style.display = "block";
    document.getElementById("eventMinute").style.display = "block";
    document.getElementById("eventPeriod").style.display = "block";
    document.getElementById("eventDescription").style.display = "block";
    document.getElementById("eventColour").style.display = "block";
    document.getElementById("makeNewEvent").style.display = "block";
    document.getElementById("repeatFrequency").style.display = "block";
    document.getElementById("eventCreation").innerText = "- Hide Menu";
}

//hiding the elements inside the event creation menu
function hideEventCreationMenu(){
    const eventMenu = document.getElementsByClassName("eventCreationMenu")[0];
    eventMenu.classList.remove("open");
    document.getElementById("eventCreation").innerText = "+ Event Creator";
    setTimeout(() => {
        document.getElementById("eventTitle").style.display = "none";
        document.getElementById("eventDate").style.display = "none";
        document.getElementById("eventHour").style.display = "none";
        document.getElementById("eventMinute").style.display = "none";
        document.getElementById("eventPeriod").style.display = "none";
        document.getElementById("eventDescription").style.display = "none";
        document.getElementById("eventColour").style.display = "none";
        document.getElementById("makeNewEvent").style.display = "none";
    }, 300);
}

//use the values in the input fields to create a new event object and store it at the correct position in the events array, then store the event to local storage
function createNewEvent() {
    // Get the values of the input fields
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = getSelectedTime();
    const eventDescription = document.getElementById('eventDescription').value;
    const eventColour = document.getElementById('eventColour').value;
    const repeatEvent = document.getElementById('repeatEvent');
    const repeatFrequency = document.getElementById('repeatFrequency').value;

    // Validation checks
    if (!eventTitle || !eventDate || !eventTime || !eventDescription || !eventColour) {
        alert('Please fill in all the fields.');
        return;
    }

    if(repeatEvent.checked){
        repeatValue = repeatFrequency;
    }
    else{
        repeatValue = "none";
    }

    const eventDateTime = new Date(`${eventDate}T${eventTime}:00.000Z`);
    const eventDateUTC = eventDateTime.toISOString().split('T')[0]; // Date in UTC
    const eventTimeUTC = eventDateTime.toISOString().split('T')[1].substring(0, 5); // Time in UTC

    const eventDateObj = new Date(eventDate);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[eventDateObj.getDay()];

    // Create an event object
    const event = {
        title: eventTitle,
        date: eventDateUTC,
        time: eventTimeUTC,
        description: eventDescription,
        colour: eventColour,
        repeat: repeatValue,
        dayOfWeek: dayOfWeek
    };

    // Get the JSON string of events from localStorage
    let eventsString = localStorage.getItem('events');
    let events = []

    // Parse the JSON string to an array of event objects
    if (eventsString) {
        events = JSON.parse(eventsString);
    } else {
        events = [];
    }

    // Find the correct position to insert the new event
    let insertIndex = events.length;
    for (let i = 0; i < events.length; i++) {
        const currentEventDateTime = new Date(`${events[i].date}T${events[i].time}`);
        if (eventDateTime < currentEventDateTime) {
            insertIndex = i;
            break;
        }
    }

    // Insert the new event at the correct position
    events.splice(insertIndex, 0, event);

    // Convert the updated array back to a JSON string
    const eventsJSON = JSON.stringify(events);

    // Store the updated JSON string in localStorage
    localStorage.setItem('events', eventsJSON);
    onload();
}

function displayStoredEvents() {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const now = new Date();
    const nowUTC = new Date(now.toISOString()); // Convert to UTC

    const eventListItems = document.getElementById('eventListItems');
    eventListItems.innerHTML = ''; // Clear existing events

    if (events.length === 0) {
        // Create and display a message box if there are no future events
        const noEventsBox = document.createElement('button');
        noEventsBox.className = 'noEventsBox';
        noEventsBox.innerHTML = 'No Events To Display';
        eventListItems.appendChild(noEventsBox);
        return;
    }

    // Update events to their next occurrence if they have a repeat frequency
    for(let i = 0 ; i < events.length; i++){
        if(events[i].repeatFrequency !== "none"){
            events[i] = getClosestRepeatEvent(events[i], nowUTC);
        }
    }

    events.forEach(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const timeDiff = eventDateTime - now;

        let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if(event.repeat =="weekly"){
            if (days < 0 || (days === 0 && hours < 0)) {
                if(days < 0){
                    days =+ 7;
                }
                if(hours < 0){
                    days -= 1;
                    hours += 24;
                }
            }
        }

        if(days > 0 || hours > 0){
            const eventItem = document.createElement('button');
            eventItem.className = 'eventItem';
            if (days === 0) {
                eventItem.innerHTML = `
                    <div class="eventTitle">${event.title}</div>
                    <div class="eventTime"> in ${hours} hours</div>
                `;
            } else {
                eventItem.innerHTML = `
                    <div class="eventTitle">${event.title}</div>
                    <div class="eventTime">${days} days and ${hours} hours</div>
                `;
            }
            eventItem.style.backgroundColor = event.colour;
            eventItem.style.borderColor = darkenColor(event.colour, 40); // Set border color slightly darker
            eventListItems.appendChild(eventItem);
            eventItem.onclick = function () {
                toggleEventDetail(eventItem, event, days, hours);
            };
        }
    });
}

// Example implementation of getClosestRepeatEvent function
function getClosestRepeatEvent(event, now) {
    console.log(`Original event date and time: ${event.date} ${event.time}`);
    
    // Parse the event date and time as UTC
    let eventDate = new Date(`${event.date}T${event.time}:00.000Z`);
    console.log(`Parsed eventDate (UTC): ${eventDate.toISOString()}`);

    while (eventDate <= now) {
        if (event.repeat == "weekly") {
            eventDate.setUTCDate(eventDate.getUTCDate() + 7);
        } else if (event.repeat == "monthly") {
            eventDate.setUTCMonth(eventDate.getUTCMonth() + 1);
        } else if (event.repeat == "yearly") {
            eventDate.setUTCFullYear(eventDate.getUTCFullYear() + 1);
        } else {
            // If no valid repeat frequency is found, break the loop to avoid infinite loop
            break;
        }
        console.log(`Updated eventDate (UTC): ${eventDate.toISOString()}`);
    }

    // Convert back to local time for display
    event.date = eventDate.toISOString().split('T')[0];
    event.time = eventDate.toISOString().split('T')[1].substring(0, 5);
    console.log(`Updated event date and time: ${event.date} ${event.time}`);
    
    return event;
}

//display the details of a clicked event
function toggleEventDetail(eventItem, event, days, hours) {
    // Convert to date to be more readable
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Convert time to be more readable
    const eventTime = convertTo12HourFormat(event.time);
    console.log(`Event details: ${eventDate} ${eventTime}`);

    // Escape JSON string to avoid breaking HTML
    const escapedEvent = JSON.stringify(event).replace(/"/g, '&quot;');

    if (eventItem.detailsVisible) {
        eventItem.classList.remove('detailsVisible');
        if (days == 0) {
            eventItem.innerHTML = `
            <div class="eventTitle">${event.title}</div>
            <div class="eventTime"> in ${hours} hours</div>
            `;
        } else {
            eventItem.innerHTML = `
            <div class="eventTitle">${event.title}</div>
            <div class="eventTime"> in ${days} days and ${hours} hours</div>
            `;
        }
    } else {
        eventItem.classList.add('detailsVisible');
        eventItem.innerHTML = `
       <div class="eventTitle">${event.title}</div>
            <div class="eventDetails">
                <div class="eventDetail">${eventDate}</div>
                <div class="eventDetail">${eventTime}</div>
                <div class="eventDetail">${event.description}</div>
                <div class="eventDetail">repeats: ${event.repeat}</div>
                <div class="eventOptions">
                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                </div>
            </div>
        `;
    }
    eventItem.detailsVisible = !eventItem.detailsVisible;
}

function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const minutes = parseInt(minute);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

//function to darken the color passed into it
function darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
}

//clear all events from local storage
function clearEvents() {
    // Display a confirmation dialog
    const confirmationDialog = document.getElementById('confirmationContainer');
    const clearEventsButton = document.getElementById('clearEventsButton');
    clearEventsButton.innerHTML = '<h3>Are You Sure?</h3><p>this will permanently delete all events</p>';
    confirmationDialog.style.display = 'flex';
    setTimeout(() => {
        confirmationDialog.style.height = '50px';
    }, 50)
}

function clearAllEvents(){
    localStorage.clear();
    onload();
    hideConfirmationDialog();
}

hideConfirmationDialog = () => {
    const confirmationDialog = document.getElementById('confirmationContainer');
    const clearEventsButton = document.getElementById('clearEventsButton');
    confirmationDialog.style.height = '0';
    setTimeout(() => {
        confirmationDialog.style.display = 'none';
    }, 300);
    clearEventsButton.innerHTML = 'Clear All Events';

}

//function to edit an event
function eventEdit(){
    alert("Edit event functionality is not yet implemented.");
}

//function to delete an event
function eventDelete(event){
    // Display a confirmation dialog
    const userConfirmed = confirm("Are you sure you want to permanently delete this event?");

    if (userConfirmed) {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        for (let i = 0; i < events.length; i++) {
            if (events[i].title == event.title) {
                events.splice(i, 1);
                break;
            }
        }
        const eventsJSON = JSON.stringify(events);
        // Store the updated JSON string in localStorage
        localStorage.setItem('events', eventsJSON);
        onload();

    }
}

function displayRepeatOptions() {
    var checkbox = document.getElementById('repeatEvent');
    var select = document.getElementById('repeatFrequency');
    if (checkbox.checked) {
        select.style.display = 'block';
    } else {
        select.style.display = 'none';
    }
}

function getSelectedTime() {
    const hour = document.getElementById('eventHour').value;
    const minute = document.getElementById('eventMinute').value;
    const period = document.getElementById('eventPeriod').value;
    if(period == "AM"){
        return `${hour}:${minute}`;
    }
    else{
        return `${parseInt(hour) + 12}:${minute}`;
    }
}