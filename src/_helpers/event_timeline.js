// Returns the week number (1 - 53) of a certain day
function getWeek(date) {
  var oneJan = new Date(date.getFullYear(),0,1);
  return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay()+1)/7);
}

// Adds'duration' attribute to each date calculated by subtracting
// the event.end and the event.start values
function calculateDurationForEvents(events) {
  events.forEach(event => {
    let oneDay = 24*60*60*1000; 
    let firstDate = new Date(event.end);
    let secondDate = new Date(event.start);
    let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    event['duration'] = diffDays + 1;
  })
  return;
}

// Function used in sortEvents(events) function to sort the dates first by their
// start date (ascending order) and then by duration (descending order)
function compareDateAndDuration(a, b){
  let aArray = a.start.split('-');
  let bArray = b.start.split('-');
  let dateA=new Date(aArray[1] + "/" + aArray[2] + "/" + aArray[0]);
  let dateB=new Date(bArray[1] + "/" + bArray[2] + "/" + bArray[0]);
  
  return dateA - dateB || b.duration - a.duration//sort by date ascending
}

// A wrapper function for built-in javascript sort() function
function sortEvents(events) {
  events.sort(compareDateAndDuration)
  return;
}

// Outputs an object containing the date, year, and week of both the start and end dates
function getYearAndWeekOf(event) {
  let start = event.start.split('-')
  let startDate=new Date(start[1] + "/" + start[2] + "/" + start[0]);
  let startYear = parseInt(start[0]);
  let startWeek = getWeek(startDate);

  let end = event.end.split('-')
  let endDate=new Date(end[1] + "/" + end[2] + "/" + end[0]);
  let endYear = parseInt(end[0]);
  let endWeek = getWeek(endDate);

  return { startDate, startYear, startWeek, endDate, endYear, endWeek};
}

// Adds the event to the relevant weeks using a start and stop arguments b/c 
// there are some events that span to numerous weeks 
function addEvent(container, year, week, event) {
  if(container[year] === undefined) {
    container[year] = {};
  }

  if(container[year][week] === undefined) {
    container[year][week] = {}
  }
  container[year][week][event.id] = event;
  return;
}

function deleteEvent(container, year, week, event) {
  if(year in container) {
    if(week in container[year]) {
      if(event.id in container[year][week]) {
        delete container[year][week][event.id];
      }
    }
  }
}

// The following handles updating an event 
function editEvent(container, year, week, newEvent) {
  let newEventInfo = getYearAndWeekOf(newEvent);

  // If the year and the week aren't inside the container then that means
  // that it is part of the new event and not part of the original 
  if(container[year] === undefined) {
    container[year] = {}
    container[year][week] = {};
    container[year][week][newEvent.id] = newEvent;
  } 
  else {
    // Only update the event if the week is in the week range of new event
    if(year === newEventInfo.startYear && year === newEventInfo.endYear) {
      if(week >= newEventInfo.startWeek && week <= newEventInfo.endWeek) {
        container[year][week][newEvent.id] = newEvent;
      } else {
        delete container[year][week][newEvent.id];
      }
    } 
    // NOTE: The next if statements are for when the start year and end year of new event
    // are different
    // If the year equals to the start year of the new event then update only 
    // the events that started on or after the new event. Otherwise, delete.
    else if(year === newEventInfo.startYear) {
      if(week >= newEventInfo.startWeek) {
        container[year][week][newEvent.id] = newEvent;
      } else {
        delete container[year][week][newEvent.id]
      }
    } 
    // If the year equals the end year of the new event then update only the
    // events that ended on or before the new event. Otherwise, delete.
    else if (year === newEventInfo.endYear) {
      if(week <= newEvent.endWeek) {
        container[year][week][newEvent.id] = newEvent;
      } else {
        delete container[year][week][newEvent.id];
      }
    } 
    // If the year is greater than the start year of the new event and lesser than 
    // the end year of the new event, it's for sure going 
    else if (year > newEventInfo.startYear && year < newEventInfo.endYear) {
      container[year][week][newEvent.id] = newEvent;
    } else {
      delete container[year][week][newEvent.id]
    }
  }
}

// Compares the two event info to get the relevant week range containing the new
// event and the original event
function editEventInfo(newEvent, originalEvent) {
  let newDatesInfo = getYearAndWeekOf(newEvent);
  let originalDatesInfo = getYearAndWeekOf(originalEvent);

  let start = (newDatesInfo.startDate < originalDatesInfo.startDate) ? newDatesInfo : originalDatesInfo;
  let end = (newDatesInfo.endDate > originalDatesInfo.endDate) ? newDatesInfo : originalDatesInfo

  let startDate= start.startDate;
  let startYear = parseInt(start[0]);
  let startWeek = getWeek(startDate);

  let endDate = end.endDate;
  let endYear = parseInt(end[0]);
  let endWeek = getWeek(endDate);

  return { startDate, endDate, startYear, startWeek, endYear, endWeek }
}

// Iterates through the relevant weeks that the event is in and calls the function 
// that was passed as the first argument
function goThroughRelevantWeekAnd(functionToCall, event, start, stop, year, container) {
  for(let j = start; j <= stop; j++) {
    let week  = j; 
    functionToCall(container, year, week, event)
  }
  return;
}

function goThroughEventsAnd(action, event, container, originalEvent = null) {
  if(event.id === 555) {
    console.log("INSIDE FUNCTION")
    console.log(event)
  }
  
  let { 
        startDate, 
        endDate, 
        startYear, 
        startWeek, 
        endYear, 
        endWeek
      } = (action === 'edit_info') ? editEventInfo(event, originalEvent) : getYearAndWeekOf(event); 

  // The for loop handles the case when the start date and end date have 
  // different years
  for(let year = startYear; year <= endYear; year++) {      
    // This makes sure that the appropriate last week is chosen because 
    // there are instances when there are 52 or 53 weeks
    let lastDayOfYear = new Date(`12/31/${endYear}`);

    // Start at week 1 or the first wek if the year is not the start year
    let currentStart = year === startYear ? startWeek : 1;

    // End at week 52 or 53 or the last week if the year is not the end year
    let currentEnd = year === endYear ? endWeek : getWeek(lastDayOfYear);
    console.log(year);
    switch(action) {
      case 'add_event':
        goThroughRelevantWeekAnd(addEvent, event, currentStart, currentEnd, year, container);
        break;
      case 'delete_event':
        goThroughRelevantWeekAnd(deleteEvent, event, currentStart, currentEnd, year, container);  
        break;
      case 'edit_event':
        goThroughRelevantWeekAnd(editEvent, event, currentStart, currentEnd, year, container);
        break;
      default:
        break;
    }
  }
  return;
}

// Loops through each event and processes them by their respective start and 
// end dates
function addAllEvents(events, container) {
  events.forEach(event => {
      goThroughEventsAnd('add_event', event, container);
  });
  return container;
}

function processEvents(events, container) {
  calculateDurationForEvents(events); 
  return addAllEvents(events, container);
}

// Wrapper function to return new container after adding an event, editing an event, 
// or deleting an event
function updateContainer(action, event, container, originalEvent = null) {
  goThroughEventsAnd(action, event, container, originalEvent);
  return container;
}

module.exports = {
  processEvents,
  updateContainer,
  sortEvents,
};
