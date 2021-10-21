# upcoming

![upcoming_node.png](../examples/upcoming_node.png)  


As of the events node, its checked on input or cronjob. The msg.payload contains a list of upcoming events.
##### Configuration

-   "Check every": how often the calendar is checked for new events
-   "Trigger": possible values:

    -   Always (Filter expression is ignored)
    -   Match (only events that match the Filter expression are processed)
    -   No Match (only events that don't match the Filter expression are processed)

-   "Filter property": possible values:
        -     summary
        -     description
        -     attendee
        -     category
        -     start date
        -     end date   
        
    if filterProperty is set to "start date" or "end date", additonally a filter operator is shown:  
    filter format for dates is **YYYY-MM-DD_hh:mm:sss**     
    
    "Filter operator": possible values:
    -   between
    -   before
    -   after
-   "Filter": filter property of the events from above is filtered against this regular expression
-   "Name": Displayname
-   "Preview": Only Events within now and this **future** value are checked.
-   "Past view": Only Events within now and this **past** value are checked.
-   "timezone for output": default is UTC, so eventStart and eventEnd will be a UTC string  
    ```json
    eventStart: "2021-07-05T03:50:00.000Z"
    eventEnd: "2021-07-05T04:30:00.000Z"
    ```
    e.g. set timezone to Europe/Berlin
    ```json
    eventStart: "2021-07-05T05:50:00.000+02:00"
    eventEnd: "2021-07-05T06:30:00.000+02:00"    
    ```    
-   "Cron": Similar to "Check every", but much more configurable. It's a cron expression, how often the calendar is checked for new upcoming events. If Cron is defined, it wins against "Check every". <i>Empty value to disable.</i>

### OUTPUT

Additional msg properties are:

-   msg.today - number of upcoming events today
-   msg.tomorrow - number of upcoming events tomorrow
-   msg.total - number of upcoming events totally
-   msg.htmlTable - a html formated table of upcoming events
-   msg.payload - arraylist of upcoming events
    - date
    - event
    - rule
    - summary
    - id
    - location
    - eventStart
    - eventEnd
    - description
    - allDay
    - attendee
    - isRecurring
    - calendarName
    - organizer
    - categories
    - duration
