function actions_photos_spr_y3(a = [], d = 3, g = 300, is_sunny = 1) {
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var cow_id = get_npc_id('cow');
	var doug_id = get_npc_id('doug');
	var karen_id = get_npc_id('karen');
	var dog_id = get_npc_id('dog');
	var gotz_id = get_npc_id('gotz');
	var dow = get_dow(d, true);

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id, 'imp':(flags['baby'] == 2)});
		if (flags['baby'] != 2) {
			a.push({'desc':"Gift ", 'val':1, 'cid':karen_id, 'sr':true, 'sel':(aff[karen_id] < 250), 't2':"Berry"});
			a.push({'desc':"Berry", 'val':3, 'cid':karen_id, 'sr':true, 'sel':false, 't2':"Gift "});
		}
	}

	// Make Room for Grass Seeds
	if (d == 241) { a.push({'desc':"Store Milker and Bell", 'imp':true}); }

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle", 'cid':dog_id, 'val':1, 'sel':(aff[dog_id] < 210)});
		a.push({'desc':"Pick Up", 'cid':dog_id, 'val':1, 'sel':(aff[dog_id] < 210), 'sr':true});
	} else {
		a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1]});
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
	if (flags['baby'] == 3) {
		a.push({'desc':"Baby Born Tomorrow, Have Grass to Plant"});
	}

	if (flags['baby'] == 2) {
		// Baby Born
		if (vars['grass'] > 0 || vars['grass_planted'] < 43) {
			a.push({'desc':"Equip hoe, Clear Field & Plant Grass", 'imp':true});
			a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
		}
		a.push({'desc':"Baby Born", 'iid':karen_id, 'cid':['f_dontsave', 'f_photo_baby'], 'val':[1, 1], 'imp':true});
	} else if (!is_festival(d)) {
		// Sell Cows
		if (money_needed() <= 0 && vars['cows'] > 0 && dow != "THURS") {
			a.push({'desc':"Sell Cow", 'iid':get_npc_id('doug'),
					'cid':['v_cows', 'v_gold'],
					'val':[-1, ((vars['cows'] == 1 && d >= 184) ? 8500 : 7500)]
			});
		}

		// Plant Grass
		if (vars['grass'] > 0 || vars['grass_planted'] < 43) {
			a.push({'desc':"Equip hoe, Clear Field & Plant Grass"});
			a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
		}

		// Buy Grass
		if (vars['grass'] == 0 && (vars['grass_planted'] + vars['grass']) < 43) {
			var tmp_gseeds = 43 - (vars['grass_planted'] + vars['grass']);
			var tmp_gseeds = ((tmp_gseeds > 20) ? 20 : tmp_gseeds);
			tmp_gseeds = ((tmp_gseeds * 500 > vars['gold']) ? Math.floor(vars['gold'] / 500) : tmp_gseeds);
			a.push({'desc':("Buy " + tmp_gseeds + " Grass Seeds"), 'cid':['v_grass', 'v_gold'], 'val':[tmp_gseeds, -500 * tmp_gseeds], 'iid':get_npc_id('lillia'), 'sel':false});
		}

		if (dow != "TUES" && !is_festival(d)) {
			if (is_sunny == 1 && flags['cutscene_bug'] == 0) {
				// Cutscene will play between Maria and Karen (Spring Only)
				a.push({'desc':"WARNING: Cutscene plays at Carp House Screen", 'imp':true});
				a.push({'desc':"Bug in Karens Hair Cutscene", 'val':1, 'cid':'f_cutscene_bug', 'sr':true, 'sel':false});
			}

			var add_ext_id = -1;
			for (var i = 0; i < extensions.length; i++) {
				if (flags[extensions[i][0]] == 0 && vars['gold'] >= extensions[i][1] && (i == (extensions.length - 1) || flags[extensions[i + 1][0]] == 1)) {
					add_ext_id = i;
				}
			}
			if (add_ext_id != -1) {
				a.push({'desc':("Buy " + extensions[add_ext_id][3] + "(" + extensions[add_ext_id][1] + " G)"),
						'cid':['v_gold', 'v_lumber', ('f_' + extensions[add_ext_id][0])],
						'val':[(-1 * extensions[add_ext_id][1]), (-1 * extensions[add_ext_id][2]), _BUILD_DAYS + 1],
						'sel':(is_sunny == 0 || flags['cutscene_bug'] == 1 || d >= (269 - (_BUILD_DAYS + 1) * add_ext_id)),
						'imp':(is_sunny == 0), 'iid':get_npc_id('mas_carpenter')
				});
				if (flags['cutscene_bug'] == 0) {
					a[a.length - 1]['t3'] = "Bug in Karens Hair Cutscene";
					a[a.length - 2]['t0'] = a[a.length - 1]['desc'];
				}

				// CLIFF
				if (route_id == 0) {
					a.push({'desc':("Talk (" + ((is_sunny == 0) ? "In Carp House)" : ((["FRI", "SAT"].includes(dow)) ? "Fish Tent 50%)" : "Carp Screen)"))),
							'sel':false, 'cid':cliff_id, 'val':2
					});
					a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
					a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
				}
			}
		}

		// Baby Spam
		// If you already have a chicken, otherwise do it when you go to buy one
		if (flags['baby'] == 1 && (vars['chickens'] > 0 || flags['new_chick'] != 0 || vars['new_chicken_days'].length > 0)) {
			// DOUG
			if (aff[doug_id] < 100 && dow != "THURS") {
				a.push({'desc':"Bring Baby to Ranch"});
				a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255, 'sel':false});
			}

			// GOTZ
			if (route_id == 5 && aff[gotz_id] < 100) {
				a.push({'desc':"Bring Baby to Vineyard"});
				a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
				if (flags['vineyard_cutscene'] == 0) {
					a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
				}
			}
		}

		// Buy a Chicken
		// Wait until all extensions are built or until Spr 27 (to leave time for spams)
		if (flags['baby'] == 1) {
			if ((d >= 267 && vars['chickens'] == 0) || (vars['chickens'] == 0 && flags['new_chick'] == 0 && vars['new_chicken_days'].length == 0 && flags['logterrace'] == 1 && flags['greenhouse'] == 1)) {
				// Spr30 is a Thursday

				// GOTZ
				if (route_id == 5 && aff[gotz_id] < 100) {
					a.push({'desc':"Bring Baby to Vineyard"});
					a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
					if (flags['vineyard_cutscene'] == 0) {
						a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
					}
				}

				// DOUG
				if (aff[doug_id] < 100) {
					a.push({'desc':"Bring Baby to Ranch"});
					a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255, 'sel':false});
				}
				a.push({'desc':"Buy a Chicken", 'sr':(aff[doug_id] < 100), 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':doug_id});
			} else if (vars['chickens'] >= 1 && aff[doug_id] < 100) {
				a.push({'desc':"Bring Baby to Ranch"});
				a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255});
				
				// GOTZ
				if (route_id == 5 && aff[gotz_id] < 100) {
					a.push({'desc':"Bring Baby to Vineyard"});
					a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
					if (flags['vineyard_cutscene'] == 0) {
						a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
					}
				}
			}
		}

		// New Chick that was Incubated earlier
		if (flags['new_chick'] == 1 && ((flags['logterrace'] == 1 && flags['greenhouse'] == 1) || d >= (270 - _CHICK_GROW_SLEEPS - 2))) {
			a.push({'desc':"New Chick; Bring Outside", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1]});
		}
	}
	return a;
}