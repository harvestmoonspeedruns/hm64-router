function actions_photos_spr_y3(a = [], d = 3, g = 300, is_sunny = 1) {
	var chicken_id = get_npc_id('chicken');
	var cow_id = get_npc_id('cow');
	var dog_id = get_npc_id('dog');
	var doug_id = get_npc_id('doug');
	var elli_id = get_npc_id('elli');
	var gotz_id = get_npc_id('gotz');
	var karen_id = get_npc_id('karen');
	var kent_id = get_npc_id('kent');
	var midwife_id = get_npc_id('midwife');
	var pastor_id = get_npc_id('pastor');

	var dow = get_dow(d, true);

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':" Talk", 'val':1, 'cid':elli_id, 't2':"Musbox", 'sel':(flags['new_mus_box'] == 0)});
		a.push({'desc':"Musbox", 'val':[6, -1], 'cid':[elli_id, 'f_new_mus_box'], 'sel':(flags['new_mus_box'] == 1), 'sr':true, 't2':a[a.length - 1]['desc']})
		a.push({'desc':"  Gift  ", 'val':1, 'cid':elli_id, 'sr':true, 'sel':false, 't2':"Milk"});
		a.push({'desc':"Milk", 'val':4, 'cid':elli_id, 'sr':true, 't2':"  Gift  ", 'sel':(aff[elli_id] < 250 && vars['cows'] > 0)})
	}

	// Bathroom for Happiness
	if (flags['photo_baby'] == 1 && vars['happiness'] < 250) {
		var tmp_bathroom_uses = Math.ceil((250 - vars['happiness']) / 2);
		a.push({'desc':("Use Bathroom " + tmp_bathroom_uses + " Times"), 'imp':true, 'cid':'v_happiness', 'val':(2 * tmp_bathroom_uses)});
	}

	// Make Room for Grass Seeds
	if (d == 241) { a.push({'desc':"Store Milker and Bell", 'imp':true}); }

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		if (flags['photo_dograce'] == 1) {
			a.push({'desc':"Whistle", 'cid':dog_id, 'val':1, 'sel':(aff[dog_id] < 210)});
			a.push({'desc':"Pick Up", 'cid':dog_id, 'val':1, 'sr':true});
		} else {
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
		}
	} else {
		a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1]});
		a.push({'desc':"Whistle", 'val':1, 'sr':true});
	}
	if (is_sunny == 1) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sel':false});
	}

	// Milk Cows
	if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		var mn = g - money_needed();
		a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0), 'red':(aff[cow_id] >= 60 && mn >= 0)});
		if (flags['cows_outside'] == 0) {
			a.push({'desc':"Put Cows Outside", 'cid':'f_cows_outside', 'val':1,'sr':true});
		}
	}
	// New Cow
	if (parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		a.push({'desc':"New Cow, Hammer 10x, Put Outside", 'imp':true});
	}
	// Sick Cows
	if (flags['yesterday_rain'] == 1) {
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
		a.push({'desc':"Baby Born", 'iid':elli_id, 'cid':['f_dontsave', 'f_photo_baby', 'v_happiness', elli_id, midwife_id, pastor_id], 'val':[1, 1, 30, 8, 5, 5], 'imp':true});
	} else if (!is_festival(d)) {
		// Sell Cows
		if (money_needed() < g && vars['cows'] > 0 && d > 184 && dow != "THURS") {
			a.push({'desc':"Equip hoe, Clear Field & Plant Grass"});
			a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
			a.push({'desc':"Sell Cow", 'iid':get_npc_id('doug'),
					'cid':['v_cows', 'v_gold'],
					'val':[-1, ((vars['cows'] == 1 && d >= 184) ? 8500 : 7500)]
			});
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
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
			}
		}

		// Baby Spam
		// If you already have a chicken, otherwise do it when you go to buy one
		if (flags['baby'] == 1 && dow != "THURS") {
			if (flags['new_chick'] == 0 || vars['new_chicken_days'].length == 0) {
				// Need Chicken

				// DOUG
				if (aff[doug_id] < 100) {
					a.push({'desc':"Bring Baby to Ranch"});
					a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255, 'sel':false});
					a.push({'desc':"Buy a Chicken", 'sr':true, 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500]});
				}

				// GOTZ
				if (aff[gotz_id] < 100) {
					a.push({'desc':"Bring Baby to Vineyard"});
					a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
					if (flags['vineyard_cutscene'] == 0) {
						a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
					}
				}
			} else {
				// GOTZ
				if (aff[gotz_id] < 100) {
					a.push({'desc':"Bring Baby to Vineyard"});
					a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
					if (flags['vineyard_cutscene'] == 0) {
						a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
					}
				}
				
				// DOUG
				if (aff[doug_id] < 100 && dow != "THURS") {
					a.push({'desc':"Bring Baby to Ranch"});
					a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255, 'sel':false});
				}
			}
		}

		// Buy a Chicken
		// Wait until all extensions are built or until Spr 27 (to leave time for spams)
		if (flags['baby'] == 1 && d >= 267 && vars['chickens'] == 0 && flags['new_chick'] == 0 && vars['new_chicken_days'].length == 0 && flags['logterrace'] == 1 && flags['greenhouse'] == 1) {
			// Spr30 is a Thursday

			// GOTZ
			if (aff[gotz_id] < 100) {
				a.push({'desc':"Bring Baby to Vineyard"});
				a.push({'desc':"Spam Gotz with Baby", 'cid':gotz_id, 'val':255, 'sel':false});
				if (flags['vineyard_cutscene'] == 0) {
					a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
				}
			}

			// DOUG
			if (aff[doug_id] < 100 && dow != "THURS") {
				a.push({'desc':"Bring Baby to Ranch"});
				a.push({'desc':"Spam Doug with Baby", 'cid':doug_id, 'val':255, 'sel':false});
			}
		}

		// New Chick that was Incubated earlier
		if (flags['new_chick'] == 1 && ((flags['logterrace'] == 1 && flags['greenhouse'] == 1) || d >= (270 - _CHICK_GROW_SLEEPS - 2))) {
			a.push({'desc':"New Chick; Bring Outside", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1]});
		}

		// Kent Spam
		if (vars['chickens'] > 0) {
			if (["MON", "TUES", "WED", "THURS", "FRI"].includes(dow)) {
				a.push({'desc':"Spam Kent with Chicken (In Church) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			} else if (dow == "SAT") {
				a.push({'desc':"Spam Kent with Chicken (Fish Tent / Town Square) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			} else {
				a.push({'desc':"Spam Kent with Chicken (Carp House / In Library) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			}
		} else if (d > 265 && aff[kent_id] < _PARTY_PHOTO_MIN) {
			if (["MON", "TUES", "WED", "THURS", "FRI"].includes(dow)) {
				a.push({'desc':"Spam Kent with Animal (In Church) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			} else if (dow == "SAT") {
				a.push({'desc':"Spam Kent with Animal (Fish Tent / Town Square) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			} else {
				a.push({'desc':"Spam Kent with Animal (Carp House / In Library) [83 times]", 'imp':true, 'cid':kent_id, 'val':200});
			}
		}
	}
	return a;
}

function money_needed() {
	return ((1 - flags['greenhouse']) * 30000) + ((1 - flags['logterrace']) * 7000) + ((1 - flags['stairway']) * 2000) +
		((1 - flags['bathroom']) * 3000) + ((1 - flags['kitchen']) * 5000) + ((1 - flags['babybed']) * 1000) +
		((43 - (vars['grass_planted'] + vars['grass'])) * 500) + ((vars['new_chicken_days'].length + vars['chickens'] == 0) ? 500 : 0) +
		((1 - flags['blue_feather']) * 980) - (vars['cows'] * 7500);
}
