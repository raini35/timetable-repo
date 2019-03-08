<img src="/images/logo-with-text.png" width="350">

---

# TimeTable - Schedule Your Projects the Right Way
### airtable_timeline_exercise by _Rainier F. Go_

TimeTable allows its users to keep track of events whether it's a client project :chart_with_upwards_trend:, a writing deadline :card_index:, or anything else that needs to be scheduled :calendar:. TimeTable is designed to make sure that the user always knows what's going on. :raised_hands: :pray: :ok_hand:

You can run the program by going to the root directory and executing the following:

    npm run install && npm run start
    
<img src="/wireframes/HomePage.png" >

# Table of Contents
<!--ts-->
   * [:book: Overview:](#overview)
   
   * [🗺️ My Process:](#my-process)
   
   * [🧠 Logic Behind Solution:](#logic-behind-solution)
   
      * [Reformatting Data](#reformatting-data)
      
      * [CSS Grid Element Placement](#css-grid-element-placement)
      
      * [Stable Sort by Start Date & Duration ](#stable-sort-by-start-date-and-duration)
      
   * [:construction: Things I still need to do:](#things-i-still-need-to-do)
   
   * [:pencil: Notes/Improvements:](#notes-and-improvements)
<!--te-->


<a name="overview"></a>
# :book: Overview:
The application is divided into two components: **FeatureBar** & **Component** 

<img src="/wireframes/FeatureBarAndCalendar.png" >

The `./src` repo is structured as follows: 

```
├── _helpers
│   └── event_timeline.js
├── components
│   └── FeatureBar
│       └── FeatureBar.css
│       └── FeatureBar.js
│       └── ListOfTags.css
│       └── ListOfTags.js
│       └── MiniCalendar.css
│       └── MiniCalendar.js
│       └── Tag.css
│       └── Tag.js
│   └── Calendar
│       └── Calendar.css
│       └── Calendar.js
│       └── CalendarHeader.css
│       └── CalendarHeader.js
│       └── CalendarWeek.css
│       └── CalendarWeek.js
│       └── Event.css
│       └── Event.js
│       └── EventRow.css
│       └── EventRow.js
│   └── index.markdown
│   └── index.markdown
├── data
│   └── timelineItems.js
├── images
│   └── logo.png
├── App.css
├── App.js
├── index.css 
└── index.js
```

<a name="my-process"></a>
# 🗺️ My Process: 
1. **[~2 hours] Thinking about the inputs & outputs of the problem**
   - Tried to understand the problem and think of solutions
   - Imagined the use cases for the application and thought about the potential users  
   - Figured out the different data models I needed to get to the solution
   - Figured out the different views I needed for the design of the app
   - Adjust my learnings from previous step when needed
2. **[~3 hours] Designing UI/UX of app**
   - Looked at over 100 designs for [design inspiration](/design-inspiration/) (folder contains the top 5 designs I found) on Dribbble, Instagram, Pinterest, etc. 
   - Drew out wireframes and experimented with different layouts 
   - Transferred drawings to images using Photoshop
   - Adjust my learnings from previous step when needed
3. **[~7 hours] Coding**
   - Created initial file structure for program
   - Worked on Calendar Component (majority of time was spent on here)
   - Worked on FeatureBar Component
   - Reformatted the code to make it more legible (re-write comments, move code into compartments when necessary, etc.) 
   - Bang my head on my keyboard because I couldn't figure out why the background of scrollbar wasn't transparent
4. **[~3 hours] Creating README**
   - Looked over my notes to see what needed to be said
   - Wrote first draft
   - Thought of ways to jazz it up :100: :gift_heart: :tada: 
5. **[Timeless] FINISHED**
 
**Total Time: ~15 hours**

<a name="logic-behind-solution"></a>
# 🧠 Logic Behind Solution: 
The crux of the coding challenge was to present a list of events in a space-efficient way. I chose to do a monthly calendar format. I was able to do this because of three things: reformatting the data, css grid's feature to place events by coordinates, and stable sort that sorts first by start date and then duration.

<a name="reformatting-data"></a>
## Reformatting Data
With the inital data being an array of objects, the first thing I did was to figure out what kind of data structure would allow me to access the events in an efficient way. 

Because I chose a calendar format and the events are shown by week, I decided to reformat the array of objects into one huge object with the following schema: 
```
{
    year : 
       {
            week-number : {
                            event-id: { event details},
                            event-id: { event details}
                            event-id: { event details}
                            ...
                          }
            ...
       }
    ...   
}
```

The above schema gave me easy access to the relevent events by year and then by week. This allowed me to simply get the start week and end week of a given month, pass through the object and store all the events for each week into an array then process the array in React. 

Note: I used a package called `date-fns` in order to get the start week and end week of any date or month 

<a name="css-grid-element-placement"></a>
## CSS Grid Element Placement
<img src="https://css-tricks.com/wp-content/uploads/2018/11/template-columns-rows-01.svg"  width="350">
When you define a CSS grid, one of the ways you're able to place elements and manipulate your layout is through the x and y coordinates of the grid that's made. An example of this is the image above. You can use the following css rule formula to place your element. 

    grid-area: {row-start}/{column-start}/{row-end}/{column-end}
  
<img src="https://css-tricks.com/wp-content/uploads/2018/11/grid-column-row-start-end-01.svg" width="350">

For example, for the grid above, the orange div has the following css rule: 

    grid-area: 1 / 2 / 3 / 5
 
Basically the intuition is that when accessing an array of arrays you use the following arr[0][1]. The first number, 0, represents the row that the event will be in and the second number, 2, represents the first space that the element fills up. For this Calendar problem though, there is a third number that represents the end the last space that element fills up. 

Just to help visualize, say there's an empty week and you wanted to place an event called 'E8' into the week that starts on Wednesday (index 2) and ends on Friday (index 5). This is how the array would transform 

```
[0, 0, 0, 0, 0, 0, 0]        [0, 0, E8, E8, E8, 0, 0]
[0, 0, 0, 0, 0, 0, 0]  --->  [0, 0,  0,  0,  0, 0, 0]
[0, 0, 0, 0, 0, 0, 0]        [0, 0,  0,  0,  0, 0, 0]
```

Let's say you add an event called 'E9' into the week that starts on Friday (index 4) and ends on Sunday (index 6). When you check the first row you find that E8 is already placed on index 4 so what you do is go to the next row and see if index 4 is free. Since it is free, you go ahead and place E9 from its start on index 4 to its end on index 6. 

```
[0, 0, E8, E8, E8, 0, 0]        [0, 0, E8, E8, E8,  0,  0]
[0, 0,  0,  0,  0, 0, 0]  --->  [0, 0,  0,  0, E9, E9, E9]
[0, 0,  0,  0,  0, 0, 0]        [0, 0,  0,  0,  0,  0,  0]
```

Because index 5 and index 6 is free in row 1, when an event that starts on Saturday (index 5) and ends on Sunday (index 6) is processed, the event will be places there.

```
[0, 0, E8, E8, E8,  0,  0]        [0, 0, E8, E8, E8, E10, E10]
[0, 0,  0,  0, E9, E9, E9]  --->  [0, 0,  0,  0, E9,  E9,  E9]
[0, 0,  0,  0,  0,  0,  0]        [0, 0,  0,  0,  0,   0,   0]
```

Given how the placement of events is just a matter of filling up an array of arrays and keeping track of the free spaces using a variable, you can see how the grid-area feature of CSS grid would be helpful. 

For the solution, I put grid-area as an inline style so that I could adjust its inputs dynamically in React. 

<a name="stable-sort-by-start-date-and-duration"></a>
## Stable Sort by Start Date & Duration 
Keeping in mind that the placement of events is basically just filling up an array of arrays, the order of events when placing them affects how the calendar will look. 

When I was drawing out calendars based on different events, I found that there were three types of events when you placed it in a week: `(1)` an event that starts and ends on the same week, `(2)` an event that starts in a week, but ends on a different week, and `(3)` an event that ends in a week, but starts on a previous week. 

I found that the order of events that reduces the amount of whitespace and also makes the calendar week aesthetically pleasing was first to sort the event by the start date and then by the duration. 

Using this patthern allowed the calendar event to have a heavy top row and then the rows become more sparse as you go down. 

<a name="things-i-still-need-to-do"></a>
# :construction: Things I still need to do: 
Below are the things that I came up with and planned on doing, but because I was way past the expected time, I went ahead and just skipped over. 
- [ ] Add a modal component that pops up on the Calendar component to show more information when a specific event or week is clicked
- [ ] Add a modal component that pops up on the FeatureBar component to show more information when a specific event is clicked
- [ ] Add state to the MiniCalendar so that user can choose a range of days or weeks to show all the events in the range on the FeatureBar component
- [ ] Enable users to choose the colors for the event bars 
- [ ] When an event or week is clicked, highlight the event or week on the calendar and make the rest dimmer to show what is selected
- [ ] Add tests to the front end components to make sure everything is rendering
- [ ] Add tests to the logic functions to make sure I'm handling all cases 
- [ ] Add the code for new event form below: 
<img src="/wireframes/AddEvent.png">

<a name="notes-and-improvements"></a>
# :pencil: Notes & Improvements:
* I spent way too much time on designing and programming the front end. I didn't leave enough time to iron out the logic code implementation. 

* I could've spent a bit more time thinking of different data models and functions. Midway through I realized how I structured the data was good for just adding events initially, but for other functions like adding an event after mounting, editing an event and deleting an even, it was way too inefficient. 

* I spent too much time on the Calendar Component and I never got to implement the UI/UX for adding, editing and deleting logic. 

* On my initial draft, there were only two to three levels to pass data and I thought I could do it without using some sort of state management, but I was dead wrong. At the end, I was passing variable and functions four to five levels deep. 

* I'm not very happy with how the logic functions turned out. It got super messy towards the end and if I had more time I woud make it a bit cleaner than what it currently is. If I had more time, I would try to simplify it a bit more. 
