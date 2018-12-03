/*
 * == REQUIREMENTS ==
 * 
 * HARVEST KING
 *  - Win Harvest King
 *  - Attend next Planting Fest
 * 
 * HORSE RACE
 *  - Win Horse Race
 * 
 * COW FESTIVAL
 *  - Win Cow Festival
 *		- Ship 60 milks
 * 		- Enter Cow with Large milk
 * 
 * SWIMMING
 *  - Win Swim Festival
 * 
 * HOT SPRINGS
 *  - Work on Winter 16
 * 
 * DOG RACE
 *  - Win Dog Race on Winter 19
 * 
 * ANN PHOTO
 *  - Ann at 200+ affection during Winter
 * 
 * MARIA PHOTO
 *  - Maria at 200+ affection during Summer
 * 
 * BLUE MIST PHOTO
 * 	- Blue Mist glitch
 * 
 * ELLI PHOTO
 *  - Elli at 200+ affection on Fall 9
 * 
 * KAREN PHOTO
 *  - Karen at 200+ affection on Fall 7
 *  - Restore the Vineyard
 * 		- Sprite at TODO affection
 * 		- Wine from Bartender
 * 			- Bartender at 41 affection
 * 		- Talk to goddess at spring
 * 
 * EXTENSIONS
 * 	- Build Kitchen
 * 		- 5000G, 450 Lum
 *  - Build Bathroom
 * 		- 3000G, 300 Lum
 *  - Build Baby Bed
 * 		- 1000G, 150 Lum
 *  - Build Staircase
 * 		- 2000G, 250 Lum
 *  - Build Log Terrace
 * 		- 7000G, 350 Lum
 *  - Build Greenhouse
 * 		- 30,000G, 580 Lum
 * 
 * PARTY
 *  - Married
 *  - Baby
 *  - 384 squares of grass
 * 		- 21,500G
 *  - dog at 200+ affection
 *  - happiness at 200+
 *  - adult chicken
 *  - GAT >= 2494
 *  - wife at 250+ affection
 *  - 6+ power berries
 * 		- Kappa pond berry
 * 		- Flower Fest berry
 * 		- Wish for Strength
 * 		- Egg Fest berry
 * 		- Frozen pond rock
 * 		- Basil / Till on farm
 *  - 10 party members (> TODO affection)
 * 		- Ann (photo)
 * 		- Maria (photo)
 * 		- Elli (photo)
 * 		- Rick
 * 		- May (convo spam)
 * 		- Kent (chicken / baby spam)
 * 		- Doug (baby spam)
 * 		- Basil (for berry?)
 * 		- Cliff
 * 		- Mayor
 */

/* TODO
 * 
 * - Chicken cycling
 * - Dog and Horse Aff meters
 * - Happiness meters?
 * - Milk shipped counter?
 * - Horse small to big counter & brush / ride
 * 
 * Oddtom Photo Run:
 * Baby on Win 20
 * 
 * 
 * sick baby random during second stage
 */

function get_actions_photos(d = 3, g = 300, is_sunny = 1) {
	//All Photos

	var a = [];
	var dow = get_dow(d, true);
	dontsave = false;

	if (is_festival(d)) {
		a.push({'desc':("<h4>" + festival_name(d).toUpperCase() + "</h4>")});
	}

	if (d <= 30) { // Spring Y1
		a = actions_photos_spr_y1(a, d, g, is_sunny);
	}
	
	if (d > 30 && d <= 60) { // Summer Y1
		a = actions_photos_sum_y1(a, d, g, is_sunny);
	} // End of Summer Y1
	
	if (d > 60 && d <= 90) { // Fall Y1
		a = actions_photos_fall_y1(a, d, g, is_sunny);
	} // End of Fall Y1
	
	if (d > 90 && d <= 120) { // Winter Y1
		a = actions_photos_win_y1(a, d, g, is_sunny);
	} // End of Winter Y1
	
	if (d > 120 && d <= 150) { // Spring Y2
		a = actions_photos_spr_y2(a, d, g, is_sunny);
	} // End of Spring Y2
	
	if (d > 150 && d <= 180) { // Summer Y2
		a = actions_photos_sum_y2(a, d, g, is_sunny);
	} // End of Summer Y2

	if (d > 180 && d <= 210) { // Fall Y2
		a = actions_photos_fall_y2(a, d, g, is_sunny);
	} // End of Fall Y2

	if (d > 210 && d <= 240) { // Winter Y2
		a = actions_photos_win_y2(a, d, g, is_sunny);
	} // End of Winter Y2

	if (d > 240 && d <= 270) { // Spring Y3
		a = actions_photos_spr_y3(a, d, g, is_sunny);
	} // End of Spring Y3

	return a;
}

function money_needed() {
	var tmp_g = 0;

	// Brush
	tmp_g += (600 - 600 * ((flags['horse_brush'] === undefined) ? 0 : flags['horse_brush']));

	// Milker
	tmp_g += (1800 - 1800 * ((flags['milker'] === undefined) ? 0 : flags['milker']));

	// Flower Fest Berry
	tmp_g += (1000 - 1000 * ((flags['berry_flowerfest'] === undefined) ? 0 : flags['berry_flowerfest']));

	// Extensions
	for (var i = 0; i < extensions.length; i++) {
		if (flags[extensions[i][0]] == 0) {
			tmp_g += extensions[i][1];
		}
	}

	// Grass
	tmp_g += ((43 - vars['grass'] - vars['grass_planted']) * 500);

	// Chicken
	if (vars['chickens'] == 0 && flags['new_chick'] == 0 && vars['new_chicken_days'].length == 0) {
		tmp_g += 1500;
	}

	// Selling Cows (Assuming 1 Gold Milk and the rest Large Milk)
	if (vars['cows'] > 0) {
		tmp_g -= ((vars['cows'] * 7500) + 1000);
	}
	
	return (((tmp_g - vars['gold']) < 0) ? 0 : (tmp_g - vars['gold']));
}