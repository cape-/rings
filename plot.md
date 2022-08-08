# 5 rings
- day ring (reviewed hourly -or every Nth hours-)
- week ring (reviewed daily)
- month ring (reviewed weekly)
- year ring (reviewed monthly)
- lifetime ring (reviewed yearly)

## ring
a ring has:
- a name
- a list of targets
a ring can:
- add task to list
- remove task from list
- (raise review events)

## ring constelation
a ring constelation has:
- a list of rings
a ring constelation can:
- move tasks forth and back between rings
- call a review event handler

## tasks
a task has:
-  a text
-  any number of metadata fields
-  multiples tags 
-  a creation date | audit fields
-  a done date
-  a ring log (to log passages between rings)
a task can be:
-  (assigned to one ring (during creation))
-  marked as done
-  (deleted)

## periodic tasks
a periodic task has:
-  title (eg.: "Daily", "Every 3 days", "Once a month")
-  a creation date | audit fields
-  a start date
-  a condition (or an interval)
-  a list of actions
a periodic task can be:
-  launched
-  stopped
-  edited its conditions or interval
-  edited its list of actions
-  deleted

## review event
       (-0^0-)
In the review event you pick up which tasks:
  - should move forward to the next ring (in week to life rings) or 
  - were completed (in the day ring)

## atomization event
          #
         ·.·
        ·.·.·
       ·.·.·.·
Every time a task is moved forward an, a prompt is fired to ask the
user if an atomization should be applied to the task. 
(This firing event can be improved by heuristics).
Then a atomization event occurs.
In the atomization event, the user can split the task into many subtasks.
Then they will inherit the new ring of the parent task, and they will 
be marked with a special non-removable tag that points to the parent task

## periodic task run event
        =>{###}=>
Every time a condition of any periodic task is met, the its action list
must be executed. This list will have commands to either create or delete 
(or mark as expired) regular tasks, but only this.
