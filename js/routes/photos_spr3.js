function actions_photos_spr_y3(a = [], d = 3, g = 300, is_sunny = 1) {
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var cow_id = get_npc_id('cow');
	var doug_id = get_npc_id('doug');
	var karen_id = get_npc_id('karen');
	var dow = get_dow(d, true);

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
		a.push({'desc':"Gift", 'val':1, 'cid':karen_id, 'sr':true, 'sel':(aff[karen_id] < 250)});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	} else {
		a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', get_npc_id('dog')], 'val':[1, 1]});
		a.push({'desc':"Whistle", 'val':1, 'sr':true});
	}
	if (is_sunny == 1) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	// Milk Cows
	if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		if (flags['cows_outside'] == 0) {
			if (is_sunny == 1) {
				a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0)});
				a.push({'desc':"Put Cows Outside", 'cid':'f_cows_outside', 'val':1, 'sr':true});
			} else {
				a.push({'desc':"Equip Scythe, Chop Grass"});
				a.push({'desc':('Feed Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id});
				a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'imp':(flags['cows_outside'] == 0), 'sr':true});
			}
		} else {
			a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0)});
		}
	}
	// New Cow
	if (parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		a.push({'desc':"New Cow, Hammer 10x, Put Outside", 'imp':true});
	}
	// Sick Cows
	if (flags['yesterday_rain'] == 1 && vars['cows'] > 0) {
		a.push({'desc':"Hammer Sick Cows Until Mad", 'imp':true, 'iid':cow_id});
	}

	if (flags['baby'] == 2) {
		// Baby Born
		a.push({'desc':"Baby Born Event", 'imp':true, 'iid':karen_id});
		a.push({'desc':"Equip till, Plant all Grass", 'cid':['v_grass', 'v_grass_planted'], 'val':[-1 * vars['grass'], vars['grass']]});
	} else if (!is_festival(d)) {
		// Sell Cows
		if (money_needed() <= 0 && vars['cows'] > 0 && dow != "THURS") {
			a.push({'desc':"Sell Cow", 'iid':get_npc_id('doug'),
					'cid':['v_cows', 'v_gold'],
					'val':[-1, ((vars['cows'] == 1 && d >= 184) ? 8500 : 7500)]
			});
		}

		// Cutscene with Cliff + Ann when Cliff >= 143 affection
		var tmp_build_ext = false;
		if (is_sunny == 1 && aff[cliff_id] >= 143 && d < 255) {
			a.push({'desc':"Dont go to Carp House Screen", 'imp':true});
		} else if (dow != "TUES") {
			if (flags['logterrace'] == 0 && vars['gold'] >= 7000) {
				// Buy Log Terrace
				a.push({'desc':"Buy Log Terrace (7000 G)", 'iid':get_npc_id('mas_carpenter'), 'imp':(d >= 266),
						'cid':['v_gold', 'v_lumber', 'f_logterrace'],
						'val':[-7000, -350, _BUILD_DAYS + 1]
				});
				tmp_build_ext = true;
			} else if (flags['logterrace'] == 1 && flags['greenhouse'] == 0 && vars['gold'] >= 30000) {
				// Buy Greenhouse
				a.push({'desc':"Buy Greenhouse (30000 G)", 'iid':get_npc_id('mas_carpenter'), 'imp':(d >= 266),
						'cid':['v_gold', 'v_lumber', 'f_greenhouse'],
						'val':[-30000, -580, _BUILD_DAYS + 1]
				});
				tmp_build_ext = true;
			}
		}
		// CLIFF
		if (tmp_build_ext) {
			a.push({'desc':("Talk (" + ((is_sunny == 0) ? "In Carp House)" : ((["FRI", "SAT"].includes(dow)) ? "Fish Tent 50%)" : "Carp Screen)"))),
					'sel':false, 'cid':cliff_id, 'val':2
			});
			a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
			a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
		}

		// Spam Doug with Baby
		// If you already have a chicken, otherwise do it when you go to buy one
		if (dow != "THURS" && flags['baby'] == 1 && aff[doug_id] < 100 && (vars['chickens'] > 0 || flags['new_chick'] != 0 || vars['new_chicken_days'].length > 0)) {
			a.push({'desc':"Bring Baby to Ranch"});
			a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255});
		}

		// Buy a Chicken
		// Wait until all extensions are built or until last possible day (Spr 29)
		if (flags['baby'] == 1) {
			if ((d == 269 && vars['chickens'] == 0) || (vars['chickens'] == 0 && flags['new_chick'] == 0 && vars['new_chicken_days'].length == 0 && flags['logterrace'] == 1 && flags['greenhouse'] == 1)) {
				// Spr30 is a Thursday
				if (aff[doug_id] < 100) {
					a.push({'desc':"Bring Baby to Ranch"});
					a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255});
				}
				a.push({'desc':"Buy a Chicken", 'sr':(aff[doug_id] < 100), 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':doug_id});
			} else if (vars['chickens'] >= 1 && aff[doug_id] < 100) {
				a.push({'desc':"Bring Baby to Ranch"});
				a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255});
			}
		}

		// New Chick that was Incubated earlier
		if (flags['new_chick'] == 1 && ((flags['logterrace'] == 1 && flags['greenhouse'] == 1) || d >= (270 - _CHICK_GROW_SLEEPS - 2))) {
			a.push({'desc':"New Chick; Bring Outside", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1]});
		}

		if (vars['grass'] > 0) {
			a.push({'desc':"Equip till, Plant all Grass", 'cid':['v_grass', 'v_grass_planted'], 'val':[-1 * vars['grass'], vars['grass']]});
		} else if (vars['grass_planted'] < 43) {
			var tmp_gseeds = 43 - vars['grass_planted'];
			tmp_gseeds = ((tmp_gseeds > 20) ? 20 : tmp_gseeds);
			tmp_gseeds = ((tmp_gseeds * 500 > vars['gold']) ? Math.floor(vars['gold'] / 500) : tmp_gseeds);
			a.push({'desc':("Buy " + tmp_gseeds + " Grass Seeds"), 'cid':['v_grass', 'v_gold'], 'val':[tmp_gseeds, -500 * tmp_gseeds], 'iid':get_npc_id('lillia')});
		}
	}
	return a;
}