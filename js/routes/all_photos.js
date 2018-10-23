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
		
		if (d < 64) {
			// Fall 1, 2, 3

			// New Chicken | Incubate
			var chicken_id = get_npc_id('chicken');
			if (flags['new_chicken'] == -1) {
				a.push({'desc':"New Chicken", 'iid':chicken_id});
			}
			if (flags['new_chick'] == 1) {
				// new chk | incubate
				a.push({'desc':"New Chick", 'iid':"chicken", 'cid':"f_new_chicken", 'val':_CHICK_GROW_SLEEPS + 1, 'sr':(flags['new_chicken'] == -1), 't0':"Incubate"});
				a.push({'desc':"Incubate", 'iid':get_npc_id('chicken'), 'sr':true, 'cid':"f_new_chick", 'val':_CHICK_BORN_SLEEPS + 1, 't3':"New Chick"});
			}
			
			// TODO
			
			if (d == 61) {
				// BAR
				var duke_id = get_npc_id('bartender');
				a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
				a.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
				a.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true});
			}

		}
		
		if (d >= 64 && d <= 72) {
			
			if (d == 64) {
				// Cow Festival
				a.push({'desc':"Talk", 'val':2, 'cid':get_npc_id('ann')});
				a.push({'desc':"Talk", 'val':2, 'cid':get_npc_id('karen')});
				a.push({'desc':"Talk", 'val':2, 'cid':get_npc_id('cliff')});
				a.push({'desc':"Talk", 'val':2, 'cid':get_npc_id('rick')});
				a.push({'desc':"Talk", 'val':2, 'cid':get_npc_id('mayor')});
				a.push({'desc':"Win Festival", 'iid':get_npc_id('cow'), 'imp':true,
					'cid':[get_npc_id('ann'), get_npc_id('grey'), get_npc_id('doug'),
						get_npc_id('kent'), get_npc_id('karen'), get_npc_id('elli'),
						get_npc_id('popuri'), get_npc_id('maria'), get_npc_id('kai'),
						get_npc_id('jeff'), get_npc_id('cliff'), get_npc_id('harris'),
						get_npc_id('rick'), get_npc_id('mayor'), get_npc_id('judge'),
						get_npc_id('potion_master')],
					'val':[5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
				});
			}
		
			if (d == 65) {
				dontsave = true;
				a.push({'desc':"Go to sleep immediately"});
			
				// TODO: wish for weather?
			
			}
			
			if (d == 66) {
				a.push({'desc':"Check Weather, RESET IF RAINY TOMORROW", 'imp':true});
			}

			if (d == 67) {
				a.push({'desc':"Karen Photo at 6 PM", 'imp':true,
					'cid':[get_npc_id('karen'), 'f_photo_karen'],
					'val':[_PHOTO_EVENT_AFF, 1]
				});
			}
			
			if (d == 68) {
				a.push({'desc':"Check Weather, RESET IF RAINY TOMORROW", 'imp':true});
			}
			
			if (d == 69) {
				a.push({'desc':"Elli Photo at 6 PM", 'imp':true,
					'cid':[get_npc_id('elli'), 'f_photo_elli'],
					'val':[_PHOTO_EVENT_AFF, 1]
				});
			}
			
			if (d == 70) {
			
			}
			
			if (d == 71) {
				dontsave = true;
				a.push({'desc':"Go to sleep immediately"});
			}
			
			if (d == 72) {
				// Harvest Festival
				a.push({'desc':'Win Harvest King', 'val':1, 'cid':'f_harvest_king', 'iid':get_npc_id('mayor')});
				a.push({'desc':"Dance with Karen", 'val':12, 'cid':get_npc_id('karen'), 't2':"Dance with Elli"});
				a.push({'desc':"Dance with Elli", 'val':12, 'cid':get_npc_id('elli'), 'sel':false, 't2':"Dance with Karen"});
				a.push({'desc':"RESET IF NOT KING"});
			}
			
		}
		
		if (d >= 72) {
			// After Harvest Festival
			
			if (d >= 83 && d <= 87) {
				// TODO: Bridge Work (Fall 23-27)
				// TODO: Carp affections
			}
		}
	} // End of Fall Y1
	
	if (d > 90 && d <= 120) { // Winter Y1
		
		if (d >= 102 && d <= 106) {
			// Hot Springs
			a.push({'desc':"Hot Springs Work", 'iid':get_npc_id('master_carpenter'),
				'cid':['v_springs_days_worked', 'v_gold'], 'val':[1, 1000]
			});
			if (d == 106) {
				// Hot Springs Photo
				a[a.length - 1]['cid'].push('f_photo_springs');
				a[a.length - 1]['val'].push(1);
			}
		}
		
		if (d == 109) {
			// Dog Race, 500 LUM (Win 19)	
			a = betting_table(a);
			a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500, 'iid':get_npc_id('mayor')});
		}

		// Buy Cows
		if (d > 109 && d < 121 && vars['cows'] < 3 && vars['gold'] >= 6000 &&
				(flags['cow1'] == 0 || flags['cow2'] == 0 || flags['cow3'] == 0)) {
			var cow_inc = 1;
			if (flags['cow1'] > 0) { cow_inc++; }
			if (flags['cow2'] > 0) { cow_inc++; }
			a.push({'desc':"Buy Cow", 'iid':get_npc_id('doug'),
				'cid':['v_cows', 'v_gold', ('f_cow' + cow_inc)],
				'val':[1, 6000, _COW_GROW_SLEEPS]
			});
			
			// TODO: Buy a milker for 1800 G
		}

		// TODO: Buy Kitchen

	}// End of Winter Y1
	
	if (d > 120 && d <= 150) { // Spring Y2
		
		if (is_festival(d)) {
			// Planting Festival, Spring 8
			if (d == 128 && flags['harvest_king']) {
				a.push({'desc':"Ride with Cliff", 'val':[1, 8, -1], 'cid':['f_photo_harvest', get_npc_id('cliff'), 'f_harvest_king']});
			}
			
			if (d == 137) {
				// Horse Race, Spring 17
				// TODO: Win Horse Race; medals (Spr 17)
			}
		} else {
			// TODO: Buy Bathroom, Baby Bed
			// TODO: Marry Karen
		}

	} // End of Spring Y2
	
	if (d > 150 && d <= 180) { // Summer Y2
		if (d == 174) { // Swim Fest
			a.push({'desc':"Win Swim Festival", 'iid':"mayor",
				'cid':["f_photo_swimfest", "v_lumber", get_npc_id('jeff'),
					get_npc_id('grey'), get_npc_id('harris'), get_npc_id('kai'), get_npc_id('cliff')],
				'val':[1, 150, 8, 8, 8, 8, 8]
			});
		} else {
			// TODO: Buy Staircase
		}
	} // End of Summer Y2
	
	if (d > 180 && d <= 210) { // Fall Y2
		if (d == 200) { // Egg Fest
			a.push({'desc':"Egg Festival Berry", 'cid':["f_berry_eggfest", get_npc_id('mayor')], 'val':[1, 2]});
			a.push({'desc':"Talk", 'cid':get_npc_id('rick'), 'val':2});
			a.push({'desc':"Talk", 'cid':get_npc_id('cliff'), 'val':2});
		}
	} // End of Fall Y2

	if (d > 210 && d <= 240) { // Winter Y2
		// TODO: Dog Race; Lumber (Win 19)
	} // End of Winter Y2
	
	if (d > 240 && d <= 270) { // Spring Y3
		// TODO: buy log terrace; greenhouse
		// TODO: Full Grass Field
		// TODO: Buy a Chicken
		// TODO: Spam Doug w/ baby
		// TODO: Spam Kent w/ baby or chicken (Spr 30)
	} // End of Spring Y3

	return a;
}
