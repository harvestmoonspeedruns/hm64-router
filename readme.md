## ROUTE IDS
* **0** - All Photos (Karen marriage)
* **1** - Elli Marriage
* **2** - Karen Marriage
* **3** - Popuri Marriage
* **4** - Elli Photo
* **5** - All Photos (Elli marriage)
* **6** - All Recipes
* **7** - Maria Marriage

## ACTION PROPERTIES
* **"desc"** - (Description) Words that appear on the action button. REQUIRED
* **"cid"** - (Char ID) Variable, flag, or npc id that changes by the value if this button is selected. "v_" precedes variables and "f_" precedes flags.
* **"val"** - (Value) Value that the item indicated by the CID changes by if this button is selected
* **"sr"** - (Same Row) If true, this action will appear on the same row as the previous action. Default: false
* **"iid"** - (Image ID) ID of NPC whose image will appear to the left of the text. Overwrites an npc ID "cid" value
* **"sel"** - (Selected) If true, action starts as selected. If false, action will start deselected. Default is true.
* **"t0"** - If this action is turned off, turn the action with this description off
* **"t1"** - If this action is turned off, turn the action with this description on
* **"t2"** - If this action is turned on, turn the action with this description off
* **"t3"** - If this action is turned on, turn the action with this description on

## VARS
* **bridge_days_worked**: Counter for the number of days you have worked on the bridge. If it equals four on Fall 27, the next_day function in script.js will increment affection for villagers
* **chickens**: The number of adult chickens you have
* **corn_waters**: The number of times your corn has been watered. This number never resets, but is used to determine if you have corn available if the value is >= CORN_GROW_DAYS variable in data.js. Currently used primarily in the All Photos route for Ann and Basil.
* **cows**: The combined number of small and adult cows you have
* **day**: The current day, from 3 onward. This number will increment past 30, but the get_day() and get_dow() functions can be used to get the day of the month and day of the week, respectively.
* **days_married**: Total number of sleeps since the wedding day.
* **feed**: Amount of chicken feed you have.
* **fodder**: Amount of fodder in the silo.
* **gold**: Current amount of money.
* **grass**: Amount of grass seeds you have bought that has not been planted yet.
* **grass_planted**: Number of grass seeds that have been planted in the field.
* **happiness**: Current happiness level
* **lumber**: Amount of lumber stored in the bin by the chicken coop.
* **medals**: Number of medals you currently have won by betting on horses and dogs.
* **new_chicken_days**: String of three character digits that correlates to the days that chicks will grow into adults.
* **new_cow_days**: String of three character digits that correlates to the days that young cows will mature into adults.
* **potato_waters**: Number of times potatoes have been watered. Used primarily in Ann Marriage and All Photos
* **potatoes**: Number of potatoes that have been harvested. Incremented by 9 when the potato_waters variable reaches the _POTATO_GROW_DAYS constant in the data file
* **springs_days_worked**: Counter for the number of days you have worked on the hot spring. If it equals four on Winter 16, the next_day function in script.js will increment affection for villagers
* **watering_can_fill**: Number of times your watering can will be able to water plants before running dry.

## FLAGS
* **ankle_ann**: INT [0,1] - Has the ankle event occurred for Ann
* **ankle_elli**: INT [0,1] - Has the ankle event occurred for Elli
* **ankle_karen**: INT [0,1] - Has the ankle event occurred for Karen
* **ankle_maria**: INT [0,1] - Has the ankle event occurred for Maria
* **ankle_popuri**: INT [0,1] - Has the ankle event occurred for Popuri
* **baby**: INT [0, _BABY_BORN_DAYS + 2] - 1 means baby is born that day. 0 means the counter hasnt begun yet. Anything greater than 1 is a countdown to the baby born event.
* **babybed**: INT [0, _BUILD_DAYS + 1] - Has the baby bed been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **bathroom**: INT [0, _BUILD_DAYS + 1] - Has the bathroom been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **berry_basil**: INT [0,1] - Has the player obtained Basils berry
* **berry_eggfest**: INT [0,1] - Has the player obtained the Egg Festival 
* **berry_farm**: INT [0,1] - Has the player dug up a berry on the farm
* **berry_flowerfest**: INT [0,1] - Has the player bought a berry at the Flower Festival
* **berry_kappa**: INT [0,1] - Has the player gotten a berry from Kappa by throwing a large fish into the pond
* **berry_mine**: INT [0,1] - Has the player dug up a berry in the mine
* **berry_pond**: INT [0,1] - Has the player gotten a berry by crossing the frozen pond during winter and smashing the rock with a golden hammer
* **berry_strength**: INT [0,1] - Has the player gotten a berry by wishing for strength from the goddess while at full stamina and no fatigue
* **blue_feather**: INT [0,1] - Has the player bought a blue feather from Rick
* **borrow_cows**: INT [0,1] - Did the player agree to watch cows for Doug during the first winter
* **chicken_funeral**: INT [0,1] - Is a chicken funeral held today
* **chicken_outside**: INT [0,1] - Are the chickens / chicks outside the barn
* **cow_entered**: INT [0,1] - Did the player enter a cow into the Cow Festival
* **cows_outside**: INT [0,1] - Is there a cow outside the barn / are the cows outside the barn
* **cutscene_beach**: INT [0,1] - Has the cutscene with Elli and Karen played at the beach
* **cutscene_bug**: INT [0,1] - Has the cutscene with Maria pulling a bug out of Karens hair near the cave played yet
* **cutscene_cookfish**: INT [0,1] - Has the cutscene with Elli cooking fish for Maria by the fisherman tent played yet
* **cutscene_rabbit**: INT [0,1] - Has the cutscene with Ann rescuing a rabbit from Cliff played yet
* **cutscene_watermelon**: INT [0,1] - Has the cutscene with Ann and Maria discussing the salesman and the watermelon played yet
* **cutscene_vineyard**: INT [0,1] - Has the cutscene with Karen leaving the vineyard played yet
* **dog_entered**: INT [0,1] - Is the dog entered into the dog race. Resets to zero on Spring 18, Fall 29, and Winter 20 each year.
* **dog_inside**: INT [0,1] - Is the dog inside
* **dontsave**: INT [0,1] - Do not save tonight. If the "RESET" button is hit in the top corner, the previous day (or last save) will be loaded.
* **dream_ann**: INT [0,1] - Has Anns dream sequence been triggered
* **dream_elli**: INT [0,1] - Has Ellis dream sequence been triggered
* **dream_maria**: INT [0,1] - Has Marias dream sequence been triggered
* **dream_popuri**: INT [0,1] - Has Popuris dream sequence been triggered
* **fishing_rod**: INT [0,1] - Did you get the fishing rod from the fisherman
* **fishing_rod_stored**: INT [0,1] - Is the fishing rod stored in the tool box
* **golden_hammer**: INT [0,1] - Is the hammer upgraded to gold
* **good_weather**: INT [-1, 0, 1] - 1 is a sunny day, 0 is a rainy day, and -1 is a typhoon (summer only)
* **greenhouse**: INT [0, _BUILD_DAYS + 1] - Has the greenhouse been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **harvest_king**: INT [0,1] - Did the player win Harvest King at the previous Harvest Festival
* **horse**: INT [0,1] - Does the player have a horse
* **horse_brush**: INT [0,1] - Did the player buy a brush from Rick
* **horse_entered**: INT [0,1] - Is the horse entered into the Horse Race. Resets to zero on Spring 18, Fall 29, and Winter 20 each year.
* **kitchen**: INT [0, _BUILD_DAYS + 1] - Has the kitchen been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **logterrace**: INT [0, _BUILD_DAYS + 1] - Has the log terrace been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **milker**: INT [0,1] - Did the player buy a milker from Rick
* **new_chick**: INT [0, _CHICK_BORN_SLEEPS + 1] - 0 is not chicken incubating, 1 means a new chick will be born if you enter the barn, and anything 2 or above is a countdown to a new chick being born
* **new_mus_box**: INT [0,1] - Does the player have a fixed music box
* **old_mus_box**: INT [0,1] - Does the player have a broken music box
* **photo_ann**: INT [0,1] - Has Anns photo sequence been triggered
* **photo_baby**: INT [0,1] - Has the baby born photo sequence been triggered
* **photo_cowfest**: INT [0,1] - Has the cow festival winner photo sequence been triggered
* **photo_dograce**: INT [0,1] - Has the dog race winner photo sequence been triggered
* **photo_elli**: INT [0,1] - Has Ellis photo sequence been triggered
* **photo_harvest**: INT [0,1] - Has the hot air balloon photo sequence been triggered
* **photo_horserace**: INT [0,1] - Has the horse race winner photo sequence been triggered
* **photo_karen**: INT [0,1] - Has Karens photo sequence been triggered
* **photo_maria**: INT [0,1] - Has Marias photo sequence been triggered
* **photo_married**: INT [0,1] - Has the marriage photo sequence been triggered
* **photo_popuri**: INT [0,1] - Has Popuris photo sequence been triggered
* **photo_springs**: INT [0,1] - Has the hot springs photo sequence been triggered
* **photo_swimming**: INT [0,1] - Has the swim festival winner photo sequence been triggered
* **propose**: INT [0,1] - Has the player used a blue feather on anyone
* **recipe_ann**: INT [0,1] - Has the player received Anns recipe from a potato
* **recipe_basil**: INT [0,1] - Has the player received Basils recipe from corn
* **recipe_elli**: INT [0,1] - Has the player received Ellis recipe from an egg
* **recipe_maria**: INT [0,1] - Has the player received Marias recipe from cabbage
* **recipe_popuri**: INT [0,1] - Has the player received Popuris recipe from a strawberry
* **recipe_sprite**: INT [0,1] - Has the player received the sprites recipe from a mushroom
* **sick_ann**: INT [0,1] - Has Anns sick event been triggered
* **sick_elli**: INT [0,1] - Has Ellis sick event been triggered
* **sick_maria**: INT [0,1] - Has Marias sick event been triggered
* **sick_popuri**: INT [0,1] - Has Popuris sick event been triggered
* **stairway**: INT [0, _BUILD_DAYS + 1] - Has the stairway been contracted. 0 is no, 1 is fully built, and anything above 1 is being built.
* **sustaining_carrot**: INT [0,1] - Has the player bought a sustaining carrot with medals
* **treasure_map**: INT [0,1] - Has the player retrieved the treasure map from the tree
* **vineyard_restored**: INT [0,1] - Has the player visited the goddess and asked to restore the vineyard
* **wine_from_duke**: INT [0,1] - Has the player received wine from the bartender
