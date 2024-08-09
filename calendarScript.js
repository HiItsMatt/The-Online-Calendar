let sideBarOpen = true;

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
                cell.style.border = '1px solid transparent';
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
                eventContainer.innerHTML = `
                    <div class="dayHeaderContainer">
                        <div class="date">${date}</div>
                        <button class="dayViewButton" onclick="openDayView('${DateObj}')">Open in Day View</button>
                    </div>
                `;
                //check if an we need to display an event on this date
                for(let i = 0; i < events.length; i++){
                    
                    let event = events[i];
                    let eventDate = new Date(event.date);

                    //check if an event is on this date
                    if(eventDate.getDate() == date && eventDate.getMonth() == currentMonth && eventDate.getFullYear() == currentYear){
                        let calendarEvent = document.createElement('div');
                        
                        eventDate = new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        
                    
                        // Convert time to be more readable
                        const eventTime = convertTo12HourFormat(event.time);
                        const eventEndTime = convertTo12HourFormat(event.endTime);

                        const escapedEvent = JSON.stringify(event).replace(/"/g, '&quot;');

                        calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                        calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);
                        
                        calendarEvent.innerHTML = `
                            <div class="calendarEventTitle">${event.title}</div>
                            <div class="calendarEventDetails">
                                <div class="eventDetail">${eventDate}</div>
                                <div class="eventDetail">${eventTime} - ${eventEndTime}</div>
                                <div class="eventDetail">${event.description}</div>
                                <div class="eventDetail"><b>Repeats:</b> ${event.repeat}</div>
                                <div class="eventOptions">
                                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                                </div>
                            </div>
                            `;
                        calendarEvent.classList.add('calendarEvent');

                        eventContainer.appendChild(calendarEvent);
                        
                    }
                    //check if a weekly event is repeating on this date
                    else if(event.repeat == "weekly" && event.dayOfWeek == dayOfWeek){
                    
                        let calendarEvent = document.createElement('div');

                        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        
                    
                        // Convert time to be more readable
                        const eventTime = convertTo12HourFormat(event.time);
                        const eventEndTime = convertTo12HourFormat(event.endTime);

                        const escapedEvent = JSON.stringify(event).replace(/"/g, '&quot;');

                        calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                        calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);

                        calendarEvent.innerHTML = `
                            <div class="calendarEventTitle">${event.title}</div>
                            <div class="calendarEventDetails">
                                <div class="eventDetail">${eventDate}</div>
                                <div class="eventDetail">${eventTime} - ${eventEndTime}</div>
                                <div class="eventDetail">${event.description}</div>
                                <div class="eventDetail"><b>Repeats:</b> ${event.repeat}</div>
                                <div class="eventOptions">
                                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                                </div>
                            </div>
                            `;

                        calendarEvent.classList.add('calendarEvent');

                        eventContainer.appendChild(calendarEvent);
                    }
                    //check if a monthly event is repeating on this date
                    else if(event.repeat == "monthly" && new Date(event.date).getDate() == date){
                        let calendarEvent = document.createElement('div');

                        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        
                    
                        // Convert time to be more readable
                        const eventTime = convertTo12HourFormat(event.time);
                        const eventEndTime = convertTo12HourFormat(event.endTime);

                        const escapedEvent = JSON.stringify(event).replace(/"/g, '&quot;');

                        calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                        calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);

                        calendarEvent.innerHTML = `
                            <div class="calendarEventTitle">${event.title}</div>
                            <div class="calendarEventDetails">
                                <div class="eventDetail">${eventDate}</div>
                                <div class="eventDetail">${eventTime} - ${eventEndTime}</div>
                                <div class="eventDetail">${event.description}</div>
                                <div class="eventDetail"><b>Repeats:</b> ${event.repeat}</div>
                                <div class="eventOptions">
                                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                                </div>
                            </div>
                            `;

                        calendarEvent.classList.add('calendarEvent');

                        eventContainer.appendChild(calendarEvent);
                    }
                    //check if a yearly event is repeating on this date
                    else if(event.repeat == "yearly" && new Date(event.date).getDate() == date && new Date(event.date).getMonth() == currentMonth){
                        let calendarEvent = document.createElement('div');

                        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        
                    
                        // Convert time to be more readable
                        const eventTime = convertTo12HourFormat(event.time);
                        const eventEndTime = convertTo12HourFormat(event.endTime);

                        const escapedEvent = JSON.stringify(event).replace(/"/g, '&quot;');

                        calendarEvent.style.borderColor = darkenColor(event.colour, 20);
                        calendarEvent.style.backgroundColor = convertToRGBA(event.colour,0.5);

                        calendarEvent.innerHTML = `
                            <div class="calendarEventTitle">${event.title}</div>
                            <div class="calendarEventDetails">
                                <div class="eventDetail">${eventDate}</div>
                                <div class="eventDetail">${eventTime} - ${eventEndTime}</div>
                                <div class="eventDetail">${event.description}</div>
                                <div class="eventDetail"><b>Repeats:</b> ${event.repeat}</div>
                                <div class="eventOptions">
                                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                                </div>
                            </div>
                            `;

                        calendarEvent.classList.add('calendarEvent');

                        eventContainer.appendChild(calendarEvent);
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

                        const viewDayButton = cell.querySelector('.dayViewButton');
                        viewDayButton.style.display = 'none';

                        const date = cell.querySelector('.date');
                        date.style.fontSize = '15px';
                        date.style.fontWeight = 'normal';
                        date.style.margin = "0px";

                        const elements = cell.querySelectorAll(`.${"calendarEvent"}`);
                        elements.forEach(element => {
                            element.classList.remove("enlarged");

                            const details = element.querySelector('.calendarEventDetails');
                            if (details) {
                                details.style.display = 'none';
                            }
                        });
                    }
                    else{
                        const rect = cell.getBoundingClientRect();

                        cell.classList.add('clicked');
                        cell.style.position = "fixed"; 
                        const newWidth = 400;
                        const newHeight = 400;
                        const newLeft = rect.left + (0.5 * rect.width) - (0.5 * newWidth);
                        const newTop = rect.top + (0.5 * rect.height) - (0.5 * newHeight);

                        const viewDayButton = cell.querySelector('.dayViewButton');
                        viewDayButton.style.display = 'block';

                        const date = cell.querySelector('.date');
                        date.style.fontSize = '25px';
                        date.style.fontWeight = 'bold';
                        date.style.margin = "10px";
                        
                        
                        const elements = cell.querySelectorAll('.calendarEvent');
                        elements.forEach(element => {
                            element.classList.add('enlarged');

                            const details = element.querySelector('.calendarEventDetails');
                            if (details) {
                                details.style.display = 'block';
                            }
                        });

                        //if cells position is outside of window horizontally, move it to the edge
                        if (newLeft + newWidth > window.innerWidth) {
                            cell.style.left = `${window.innerWidth - newWidth}px`;
                        }
                        else if(sideBarOpen && newLeft  < 400){
                            cell.style.left = "400px";
                        } 
                        else if(!sideBarOpen && newLeft < 50){
                            cell.style.left = "50px";
                        }
                        else {
                            cell.style.left = `${newLeft}px`;
                        }

                        //if cell's new position is outside of window vertically, move it to the edge
                        if(newTop + newHeight > window.innerHeight){
                            cell.style.top = `${window.innerHeight - newHeight}px`;
                        }
                        else if(newTop < 0){
                            cell.style.top = window.innerHeight;
                        }
                        else{
                            cell.style.top = `${newTop}px`;
                        }
                        
                        
                        cell.style.width = `${newWidth}px`;
                        cell.style.height = `${newHeight}px`;                                                         
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

function openDayView(DateObj){
    const dayView = document.getElementById("dayView");
    const sidebarContent = document.getElementById("sidebarContent");
    const title = document.getElementById("dayViewDate");
    const dayViewHeader = document.getElementById("dayViewHeader");
    const dayViewContent = document.getElementById("dayViewContent");

    let dayOfWeek = getDayOfWeek(new Date(DateObj).getDay());
    console.log(dayOfWeek);
    

    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    //display current date in the day view
    currentDate = new Date(DateObj);
    title.textContent = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    //hide the normal sidebar
    sidebarContent.style.width = "0px";
    setTimeout(() => {sidebarContent.style.display = "none";}, 300);
    
    //display the day view
    dayView.style.display = "block";
    dayView.style.width = "calc(400px - 50px)";

    //use the header as the close button for the day view
    dayViewHeader.addEventListener('mouseover', () => {
        title.textContent = "Close Day";
    });
    dayViewHeader.addEventListener('mouseout', () => {
        title.textContent = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    dayViewContent.innerHTML = '';

    for(i = 0; i < 24; i++){
        const hour = document.createElement('div');
        hour.classList.add('hour');
        if(i > 12){
            hour.textContent = `${i - 12} PM`;
        }
        else if( i == 0){
            hour.textContent = `12 AM`;
        }
        else if(i == 12){
            hour.textContent = `12 PM`;
        }
        else{
            hour.textContent = `${i} AM`;
        }
        dayViewContent.appendChild(hour);
    }

    for(i = 0; i < events.length; i++){
        let event = events[i]
        let eventDate = new Date(event.date);

        if(eventDate.getDate() == currentDate.getDate() && eventDate.getMonth() == currentMonth && eventDate.getFullYear() == currentYear){
            let eventTime = new Date(event.date + "T" + event.time);
            let eventEndTime = new Date(event.date + "T" + event.endTime);
            
            let eventDiv = document.createElement('div');

            //find difference between start time and end time
            let timeDifference = (eventEndTime - eventTime) / (1000 * 60);
            console.log(timeDifference);
            eventHeight = (timeDifference / 60) * 100;

            //find difference between start time and midnight
            let midnight = new Date(event.date + "T00:00:00");
            let timeDifferenceFromMidnight = (eventTime - midnight) / (1000 * 60);
            console.log(timeDifferenceFromMidnight);
            eventStart = (timeDifferenceFromMidnight / 60) * 100;
            
            eventDiv.classList.add('event');
            eventDiv.style.position = "absolute";
            eventDiv.style.width = "80%";
            eventDiv.style.right = "0";
            eventDiv.style.top = `${eventStart}px`;
            eventDiv.style.height = `${eventHeight}px`;
            eventDiv.style.backgroundColor = convertToRGBA(event.colour,0.5);
            eventDiv.style.border = `2px solid ${darkenColor(event.colour, 50)}`;
            eventDiv.innerHTML = `
                <div class="eventTitle">${event.title}</div>
                <div class="eventTime">${convertTo12HourFormat(event.time)} - ${convertTo12HourFormat(event.endTime)}</div>
                <div class="eventDescription">${event.description}</div>
            `;
            dayViewContent.appendChild(eventDiv);
        }
        else if(event.repeat == "weekly" && event.dayOfWeek == dayOfWeek){
            let eventTime = new Date(event.date + "T" + event.time);
            let eventEndTime = new Date(event.date + "T" + event.endTime);
            
            let eventDiv = document.createElement('div');

            //find difference between start time and end time
            let timeDifference = (eventEndTime - eventTime) / (1000 * 60);
            console.log(timeDifference);
            eventHeight = (timeDifference / 60) * 100;

            //find difference between start time and midnight
            let midnight = new Date(event.date + "T00:00:00");
            let timeDifferenceFromMidnight = (eventTime - midnight) / (1000 * 60);
            console.log(timeDifferenceFromMidnight);
            eventStart = (timeDifferenceFromMidnight / 60) * 100;
            
            eventDiv.classList.add('event');
            eventDiv.style.position = "absolute";
            eventDiv.style.width = "80%";
            eventDiv.style.right = "0";
            eventDiv.style.top = `${eventStart}px`;
            eventDiv.style.height = `${eventHeight}px`;
            eventDiv.style.backgroundColor = convertToRGBA(event.colour,0.5);
            eventDiv.style.border = `2px solid ${darkenColor(event.colour, 50)}`;
            eventDiv.innerHTML = `
                <div class="eventTitle">${event.title}</div>
                <div class="eventTime">${convertTo12HourFormat(event.time)} - ${convertTo12HourFormat(event.endTime)}</div>
                <div class="eventDescription">${event.description}</div>
            `;
            dayViewContent.appendChild(eventDiv);
        }
        else if(event.repeat == "monthly" && new Date(event.date).getDate() == currentDate.getDate()){
            let eventTime = new Date(event.date + "T" + event.time);
            let eventEndTime = new Date(event.date + "T" + event.endTime);
            
            let eventDiv = document.createElement('div');

            //find difference between start time and end time
            let timeDifference = (eventEndTime - eventTime) / (1000 * 60);
            console.log(timeDifference);
            eventHeight = (timeDifference / 60) * 100;

            //find difference between start time and midnight
            let midnight = new Date(event.date + "T00:00:00");
            let timeDifferenceFromMidnight = (eventTime - midnight) / (1000 * 60);
            console.log(timeDifferenceFromMidnight);
            eventStart = (timeDifferenceFromMidnight / 60) * 100;
            
            eventDiv.classList.add('event');
            eventDiv.style.position = "absolute";
            eventDiv.style.width = "80%";
            eventDiv.style.right = "0";
            eventDiv.style.top = `${eventStart}px`;
            eventDiv.style.height = `${eventHeight}px`;
            eventDiv.style.backgroundColor = convertToRGBA(event.colour,0.5);
            eventDiv.style.border = `2px solid ${darkenColor(event.colour, 50)}`;
            eventDiv.innerHTML = `
                <div class="eventTitle">${event.title}</div>
                <div class="eventTime">${convertTo12HourFormat(event.time)} - ${convertTo12HourFormat(event.endTime)}</div>
                <div class="eventDescription">${event.description}</div>
            `;
            dayViewContent.appendChild(eventDiv);
        }
    }

    if(new Date().getDate() == currentDate.getDate()){
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Calculate the position of the line
        const dayView = document.getElementById("dayView");
        const dayViewHeight = dayView.clientHeight;
        const totalMinutesInDay = 24 * 60;
        const currentMinutes = hours * 60 + minutes;
        const positionPercentage = (currentMinutes / totalMinutesInDay) * 100;

        // Create the right line element
        const rightTimeLine = document.createElement("div");
        rightTimeLine.id = "rightTimeLine";
        rightTimeLine.style.position = "absolute";
        rightTimeLine.style.top = positionPercentage + "%";
        rightTimeLine.style.right = "0";
        rightTimeLine.style.width = "85%";
        rightTimeLine.style.height = "2px";
        rightTimeLine.style.backgroundColor = "red";
        rightTimeLine.style.zIndex = "10"; // Ensure the line is above other elements
        
        const textTimeLine = document.createElement("div");
        textTimeLine.id = "textTimeLine";
        textTimeLine.innerHTML='NOW';
        textTimeLine.style.position = "absolute";
        textTimeLine.style.top = `calc(${positionPercentage}% - 9px)`;
        textTimeLine.style.left = "5px";
        textTimeLine.style.color = "red";
        textTimeLine.style.width = "5%";
        textTimeLine.style.height = "10px";
        textTimeLine.style.zIndex = "10"; // Ensure the line is above other elements

        // Append the line element to the day view
        dayViewContent.appendChild(rightTimeLine);
        dayViewContent.appendChild(textTimeLine);
    }

}



function closeDayView(){
    const dayView = document.getElementById("dayView");
    const sidebarContent = document.getElementById("sidebarContent");

    dayView.style.width = "0px";
    setTimeout(() => {dayView.style.display = "none";}, 300);
    sidebarContent.style.display = "block";
    sidebarContent.style.width = "calc(400px - 50px)";
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

function getDayOfWeek(num){
    if(num == 0){
        return "Sunday";
    }
    else if(num == 1){
        return "Monday";
    }
    else if(num == 2){
        return "Tuesday";
    }
    else if(num == 3){
        return "Wednesday";
    }
    else if(num == 4){
        return "Thursday";
    }
    else if(num == 5){
        return "Friday";
    }
    else if(num == 6){
        return "Saturday";
    }
    else{
        return "Error";
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
    document.getElementById("sidebarContent").style.width = "0px";
    document.getElementById("clearEventsButton").style.left = "-400px";
    sideBarOpen = false;
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
    document.getElementById("sidebarContent").style.width = "400px";
    document.getElementById("clearEventsButton").style.left = "0px";
    sideBarOpen = true;
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
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById("eventDate").value = formattedDate;

    document.getElementById("titleContainer").style.display = "block";
    document.getElementById("eventHour").style.display = "block";
    document.getElementById("eventMinute").style.display = "block";
    document.getElementById("eventPeriod").style.display = "block";
    document.getElementById("endTitleContainer").style.display = "block";
    document.getElementById("endEventHour").style.display = "block";
    document.getElementById("endEventMinute").style.display = "block";
    document.getElementById("endEventPeriod").style.display = "block";
    document.getElementById("eventDescription").style.display = "block";
    document.getElementById("eventColour").style.display = "block";
    document.getElementById("makeNewEvent").style.display = "block";
    document.getElementById("repeat").style.display = "block";
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
        document.getElementById("titleContainer").style.display = "none";
        document.getElementById("eventHour").style.display = "none";
        document.getElementById("eventMinute").style.display = "none";
        document.getElementById("eventPeriod").style.display = "none";
        document.getElementById("endTitleContainer").style.display = "none";
        document.getElementById("endEventHour").style.display = "none";
        document.getElementById("endEventMinute").style.display = "none";
        document.getElementById("endEventPeriod").style.display = "none";
        document.getElementById("eventDescription").style.display = "none";
        document.getElementById("eventColour").style.display = "none";
        document.getElementById("repeat").style.display = "none";
        document.getElementById("makeNewEvent").style.display = "none";
    }, 300);
}

//variable for storing the index of the most recently created event
//used to animate the event when it is created
//-1 means that all events have shown their animation so no animation will be shown
let recentCreatedIndex = -1;

//use the values in the input fields to create a new event object and store it at the correct position in the events array, then store the event to local storage
function createNewEvent() {
    // Get the values of the input fields
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = getSelectedTime();
    const eventEndTime = getSelectedEndTime();
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
        endTime: eventEndTime,
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

    // Update the recentCreatedIndex to the index of the most recently created event
    recentCreatedIndex = insertIndex;

    // Convert the updated array back to a JSON string
    const eventsJSON = JSON.stringify(events);

    // Store the updated JSON string in localStorage
    localStorage.setItem('events', eventsJSON);

    console.log(recentCreatedIndex);
    hideEventCreationMenu();
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

    for(let i = 0;i < events.length; i++){
        let event = events[i];
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

            //animate event when it is created
            if(recentCreatedIndex != -1 && i == recentCreatedIndex){
                eventItem.style.backgroundColor = "rgba(100, 255, 100, 0.5)";
                eventItem.style.boxShadow = "0 0 20px rgba(0, 255, 0, 1)";
                eventItem.style.border = "2px solid rgba(200, 255, 200, 1)";
                setTimeout(() => {
                    eventItem.style.backgroundColor = event.colour;
                    eventItem.style.boxShadow = "none";
                    eventItem.style.border = `2px solid ${darkenColor(event.colour, 40)}`;
                }, 1000);
                //reset recentCreatedIndex to -1 so the event is not animated the next time the page is loaded
                recentCreatedIndex = -1; 
            }
        }
    }
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
    const eventEndTime = convertTo12HourFormat(event.endTime);
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
                <div class="eventDetail">${eventTime} - ${eventEndTime}</div>
                <div class="eventDetail">${event.description}</div>
                <div class="eventDetail"><b>Repeats:</b> ${event.repeat}</div>
                <div class="eventOptions">
                    <button class="eventEdit" onclick="eventEdit()">Edit</button>
                    <button class="eventDelete" onclick="eventDelete(${escapedEvent})">Delete</button>
                    <button class="dayViewButton" onclick="viewDay(${eventDate})">View Day</button>
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
    onLoad();
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
            if (events[i].title == event.title && events[i].date == event.date && events[i].time == event.time) {
                events.splice(i, 1);
                break;
            }
        }
        const eventsJSON = JSON.stringify(events);
        // Store the updated JSON string in localStorage
        localStorage.setItem('events', eventsJSON);

        currentDate = new Date();
        onload();
        closeDayView();
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

function getSelectedEndTime() {
    const hour = document.getElementById('endEventHour').value;
    const minute = document.getElementById('endEventMinute').value;
    const period = document.getElementById('endEventPeriod').value;
    if(period == "AM"){
        return `${hour}:${minute}`;
    }
    else{
        return `${parseInt(hour) + 12}:${minute}`;
    }
}