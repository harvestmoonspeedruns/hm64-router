function get_actions_misc(d, g, is_sunny) {
	/* Includes:
	 * 
	 * 14 - Balloon Photo
	 * 15 - Horse Race Photo
	 * 17 - Swim Photo
	 * 18 - Dog Race Photo
	 */

	var a = [];
	var dow = get_day_of_week(d, true);

	var dog_id = get_npc_id('dog');
	var doug_id = get_npc_id('doug');
	var horse_id = get_npc_id('horse');
	var maria_id = get_npc_id('maria');
	var mas_carp_id = get_npc_id('mas carpenter');
	var mayor_id = get_npc_id('mayor');

	if (d == 3) { // Spring 3
		a.push({'desc':"Greet the Mayor", 'iid':mayor_id});
	}

	if (route_id == 17) {
		// Swim Photo
		if (d == 54) { a.push({'desc':"Win Swim Meet", 'cid':'f_photo_swimming', 'val':1, 'iid':'mayor_id', 'imp':true}); }
		else if (d > 54) {
			if (flags['photo_springs'] == 1) {
				a.push({'desc':"Get Photo from Mailbox", 'imp':true});
			} else { reset(); }
		}
	} else if (route_id == 20) {
		// Hot Springs Photo
		if (d == 106) { a.push({'desc':"Hot Springs Work", 'cid':'f_photo_springs', 'val':1, 'iid':mayor_id, 'imp':true}); }
		if (d > 106) {
			if (flags['photo_hotsprings'] == 1) {
				a.push({'desc':"Get Photo from Mailbox", 'imp':true});
			} else { reset(); }
		}
	} else if (route_id == 14) {
		// Balloon Photo
		if (d == 72) { // Fall 12
			// Harvest Festival
			a.push({'desc':'Win Harvest King', 'iid':mayor_id, 'imp':true, 'val':[1, 5], 'cid':['f_harvest_king', 'v_happiness']});
		}
		if (d == 128 && flags["harvest_king"] == 1) {
			// Planting Festival (Spring 8 Y2)
			a.push({'desc':"Go to Town Square", 'iid':mayor_id, 'cid':['v_happiness', 'f_dontsave'], 'val':[5, 1], 'imp':true});
			a.push({'desc':"Ride with Maria", 'val':[1, 8, -1], 'cid':['f_photo_harvest', maria_id, 'f_harvest_king']});
		}
		if (flags['photo_harvest'] == 1) { a.push({'desc':"Get Photo from Mailbox", 'imp':true}); }
	} else if (route_id == 15) {
		// Horse Race
		// 2 boosts per 10 affection
		if (flags['horse'] == 0) {
			// Get Horse
			a.push({'desc':'Get Horse', 'cid':'f_horse', 'val':21, 'iid':horse_id, 'imp':true});
			a.push({'desc':"Fast Text Glitch", 'sr':true, 'hov':true});
		}
		a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':false});
		a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true});
		if ((flags['horse_brush'] == 1 || (vars['gold'] >= 600 && flags['horse_brush'] == 0)) && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
		}
		if (flags['brush'] == 0) {
			if (vars['gold'] < 600 && [85, 86].includes(d) && is_sunny == 1 && ["MON", "TUES", "THURS", "FRI"].includes(dow)) {
				// Bridge Work
				// Fall 83, 84, 85, 86, 87
				//	    Sat Sun Mon Tue Wed
				a.push({'desc':"Bridge Work", 'val':[5, 5, 5, 1, 1000], 'iid':mas_carp_id, 'imp':true,
						'cid':[mas_carp_id, get_npc_id('carpenter_top'), get_npc_id('carpenter_bot'), 'v_bridge_days_worked', 'v_gold'],
				});
			}
			if (((d >= 83 && d <= 87) || vars['gold'] >= 600) && is_sunny == 1 && ["MON", "TUES", "THURS", "FRI"].includes(dow)) {
				a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true, 'imp':true});
			}
		}
		// Horse Race
		if ([16, 87].includes(d % 120) && flags['horse'] == 1) {
			// Enter Horse
			a.push({'desc':"Enter Horse", 'sel':(aff[horse_id] >= 200), 'imp':(aff[horse_id] >= 200),
					'cid':['f_horse_entered', doug_id], 'val':[1, 3]
			});
		} else if ([17, 88].includes(d % 120) && flags['horse_entered'] == 1) {
			// 2 boosts per 10 affection
			a.push({'desc':"Win Horse Race", 'cid':'f_photo_horserace','val':1, 'iid':doug_id, 'imp':true});
			a.push({'desc':(2 * Math.floor(aff[horse_id] / 10) + " Boosts")});
		}
		if (flags['photo_horserace'] == 1) { a.push({'desc':"Get Photo from Mailbox", 'imp':true}); }
	} else if (route_id == 18) {
		// Dog Race
		if (flags['dog_inside'] == 1) {
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
		} else {
			a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1] });
			a.push({'desc':"Whistle", 'val':1, 'sr':true});
		}
		if (d % 120 == 109) { a.push({'desc':"Enter Dog", 'cid':['f_dog_entered',doug_id], 'val':[1, 3], 'sel':(d > 120), 'imp':(d > 120)}); }
		if (d % 120 == 110 && flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'sel':(d > 120), 'imp':(d > 120), 'iid':dog_id}); }
		if (flags['photo_dograce'] == 1) { a.push({'desc':"Get Photo from Mailbox", 'imp':true}); }
	}
	return a;
}