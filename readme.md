## VARS
* bridge_days_worked
Counter for the number of days you have worked on the bridge. If it equals four on Fall 27, the next_day function in script.js will increment affection for villagers

* chickens
The number of adult chickens you have

* corn_waters
The number of times your corn has been watered. This number never resets, but is used to determine if you have corn available if the value is >= CORN_GROW_DAYS variable in data.js. Currently used primarily in the All Photos route for Ann and Basil.

* cows
The combined number of small and adult cows you have

* day
The current day, from 3 onward. This number will increment past 30, but the get_day() and get_dow() functions can be used to get the day of the month and day of the week, respectively.

* days_married
Total number of sleeps since the wedding day.

* feed
Amount of chicken feed you have.

* fodder
Amount of fodder in the silo.

* gold
Current amount of money.

* grass
Amount of grass seeds you have bought that has not been planted yet.

* grass_planted
Number of grass seeds that have been planted in the field.

* happiness
Current happiness level

* lumber
Amount of lumber stored in the bin by the chicken coop.

* medals
Number of medals you currently have won by betting on horses and dogs.

* new_chicken_days
String of three character digits that correlates to the days that chicks will grow into adults.

* new_cow_days
String of three character digits that correlates to the days that young cows will mature into adults.

* potato_waters
Number of times potatoes have been watered. Used primarily in Ann Marriage and All Photos

* potatoes
Number of potatoes that have been harvested. Incremented by 9 when the potato_waters variable reaches the _POTATO_GROW_DAYS constant in the data file

* springs_days_worked
Counter for the number of days you have worked on the hot spring. If it equals four on Winter 16, the next_day function in script.js will increment affection for villagers

* watering_can_fill
Number of times your watering can will be able to water plants before running dry.

## FLAGS