function actions_photos_win_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var horse_id = get_npc_id('horse');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);
	var horse_action_ids = [];

	var cliff_loc = "Talk";
	if (is_sunny == 0) { cliff_loc += " (In Carp House 50%)"; } else {
		if (dow == "MON") { cliff_loc += " (Hot Springs)"; }
		else if (dow == "FRI" || dow == "SAT") { cliff_loc += " (Fish Tent 50%)"; }
		else if (dow == "SUN" || dow == "THURS") { cliff_loc += " (By Carp House" + ((dow == "SUN") ? " 50%" : "") + ")"; }
		else { cliff_loc += " (" + ((dow == "TUES") ? "Beach)" : " Ranch)"); }
	}

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
		a.push({'desc':"Gift", 'val':1, 'cid':karen_id, 'sr':true, 'sel':false});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1 && (d != 109 || flags['dog_entered'] == 0)) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
	}
	if (is_sunny == 1) {
		//a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	// Horse Affection
	if (flags['photo_horserace'] == 0) {
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Equip Brush", 'iid':horse_id});
		}
		if (flags['horse'] != 0) {
			a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
			a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':false});
			horse_action_ids.push(a.length - 1);
		}
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
			horse_action_ids.push(a.length - 1);
		}
	}

	if (vars['new_chicken_days'].length == 0 && flags['new_chick'] == 0) {
		a.push({'desc':"Incubate Last Egg", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'sel':false, 'imp':true, 'iid':chicken_id});
	}

	if (is_festival(d)) {
		if (d == 109) {
			// Dog Race, 500 LUM (Win 19)	
			a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':get_npc_id('mayor'), 'imp':true});
			a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});
			if (flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'sel':false, 'sr':true}); }
			a = betting_table(a);
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}
	} else if (aff[ann_id] >= _PHOTO_EVENT_AFF && is_sunny == 1 && flags['photo_ann'] == 0) {
		// Anns photo
		a.push({'desc':"Photo", 'cid':[ann_id, 'f_photo_ann', 'f_dontsave'], 'val':[_PHOTO_EVENT_AFF, 1, 1], 'imp':true});
		for (var z = 0; z < horse_action_ids.length; z++) {
			a[horse_action_ids[z]]['sel'] = true;
		}

		// Feed dog
		a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});	
	} else {
		if (d == 108) {
			a.push({'desc':"Enter Dog", 'cid':['f_dog_entered',get_npc_id('doug')], 'val':[1, 3], 'sel':(vars['medals'] >= 1000), 'imp':(vars['medals'] >= 1000), 'red':(vars['medals'] < 1000)});
			if (vars['medals'] >= 1000) {
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}
			}
		} else if (d == 95 && flags['borrow_cows'] > 0) {
			a.push({'desc':"1000 G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1], 'iid':get_npc_id('doug'), 'imp':true});
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}

		// ANN
		if (aff[ann_id] < _PHOTO_EVENT_AFF && flags['photo_ann'] == 0) {
			if (flags['chicken_outside'] == 1) {
				a.push({'desc':"Bring Chicken Inside", 'val':-1, 'cid':'f_chicken_outside', 'imp':true});
				a.push({'desc':"Feed Chicken", 'cid':'v_feed', 'val':-1, 'sr':true});
			}
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}

			// Corn or Egg to Ann
			if (!["THURS", "SUN"].includes(dow)) {
				a.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch)")), 'cid':ann_id, 'val':1, 'sel':(flags['new_mus_box'] == 0)});
				a.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':(flags['new_mus_box'] == 1), 't2':a[a.length - 1]['desc']});
				a.push({'desc':"Egg", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato"});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':false, 't2':"Egg"});
			}
		} else if (vars['chickens'] > 0 && dow != "THURS"){
			if (flags['new_chick'] == 0) {
				a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'iid':chicken_id, 'imp':true});
			}
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'imp':true});
			if (route_id == 0 && is_sunny == 1 && ["TUES", "WED"].includes(dow)) {
				// CLIFF
				// "Gift    " <- 4 spaces
				// "Egg " <- 1 space
				a.push({'desc':cliff_loc, 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN), 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN)});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':a[a.length - 1]['desc'], 'sr':true, 'sel':false});
			}
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}
		// ANN SICK
		if (dow == "SUN" && is_sunny == 0 && flags['sick_ann'] == 0) {
			a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1],
					'sel':(aff[ann_id] < _PHOTO_EVENT_AFF), 'sr':(aff[ann_id] < _PHOTO_EVENT_AFF && flags['photo_ann'] == 0)});
		}

		if (d > 109) { // After Dog Race
			if (vars['gold'] >= (6000 + 1800 - (1800 * flags['milker'])) && vars['new_cow_days'].length < 9) {
				// Buy Cows
				// Win 20, 21, 22
				// Fri, Sat, Sun
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}

				var cow_names = ["A", "B", "5"];
				a.push({'desc':"Equip axe, chop 3 stumps", 'iid':get_npc_id('doug')});
				a.push({'desc':('Buy Cow ("' + cow_names[((vars['new_cow_days'].length) / 3)] + '")'), 'sr':true,
						'cid':['v_gold', 'v_new_cow_days'],
						'val':[-6000, d + _COW_GROW_SLEEPS]
				});

				if (flags['berry_pond'] == 0){
					if (flags['golden_hammer'] == 0) {
						a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 't0':"Pond Rock Berry", 'sel':false});
					}
					a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
					if (flags['golden_hammer'] == 0) { a[a.length - 1]['t3'] = "Golden Hammer"; }
				}

				// CLIFF
				// "Gift    " <- 4 spaces
				// "Egg " <- 1 space
				if (route_id == 0 && ["TUES", "WED"].includes(dow) && is_sunny == 1 && aff[cliff_id] < _PARTY_ATTEND_MIN && (aff[elli_id] < 160 || dow == "WED")) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 160-ish
					a.push({'desc':cliff_loc, 'cid':cliff_id, 'val':2});
					a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
					a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':a[a.length - 1]['desc'], 'sr':true});
				}
			}
			if (dow != "TUES") {
				var leftover_g = vars['gold'] - ((18000 - (6000 * vars['new_cow_days'].length / 3)) + (1800 - 1800 * flags['milker']) + 1500
									+ (5000 - ((flags['kitchen'] == 0) ? 0 : 1) * 5000) - (5000 - 1000 * vars['springs_days_worked']));
				var tmp_getext = false;
				if (flags['kitchen'] == 0) {
					// Kitchen
					a.push({'desc':"Buy a Kitchen (5000 G)", 'iid':get_npc_id('mas_carpenter'),
							'cid':['v_gold', 'v_lumber', 'f_kitchen'],
							'val':[-5000, -450, _BUILD_DAYS + 1]
					});
					tmp_getext = true;
				} else if (flags['kitchen'] == 1 && flags['babybed'] == 0 && leftover_g >= 1000) {
					// Babybed
					a.push({'desc':"Buy a Baby Bed (1000 G)", 'iid':get_npc_id('mas_carpenter'),
							'cid':['v_gold', 'v_lumber', 'f_babybed'],
							'val':[-1000, -150, _BUILD_DAYS + 1]
					});
					tmp_getext = true;
				}

				if (tmp_getext) {
					for (var z = 0; z < horse_action_ids.length; z++) {
						a[horse_action_ids[z]]['sel'] = true;
					}
					if (route_id == 0) {
						// CLIFF
						// "Gift    " <- 4 spaces
						// "Egg " <- 1 space
						if (!["TUES", "WED"].includes(dow)) {
							a.push({'desc':cliff_loc, 'cid':cliff_id, 'val':2, 'sel':(["MON", "THURS"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN), 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
							a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':(["MON", "THURS"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN)});
							a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':a[a.length - 1]['desc'], 'sr':true, 'sel':false});
						}
					}
				}
			}

			if (!["WED", "SUN"].includes(dow) && is_sunny == 1) {
				// MAYOR
				a.push({'desc':"Talk (Village 50%)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});

				// RICK
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':false, 'red':(aff[rick_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
				if (flags['milker'] == 0 && vars['cows'] > 0) {
					a.push({'desc':"Buy a Milker", 'cid':['v_gold', 'f_milker'], 'val':[-1800, 1], 'sr':true});
				}
			} else if (dow == "SUN") {
				// MAYOR
				a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
			}
		}

		//  102, 103, 104, 105, 106
		// THURS,FRI, SAT, SUN, MON
		if (d >= 102 && d <= 106) {
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
			// Hot Springs
			a.push({'desc':"Hot Springs Work", 'iid':get_npc_id('mas_carpenter'),
				'cid':['v_springs_days_worked', 'v_gold'], 'val':[1, 1000], 'imp':(d == 106)
			});
			if (d == 106) {
				// Hot Springs Photo
				a[a.length - 1]['cid'].push('f_photo_springs');
				a[a.length - 1]['val'].push(1);
			}
			if (flags['berry_pond'] == 0){
				if (flags['golden_hammer'] == 0) {
					a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 't0':"Pond Rock Berry", 'sel':false});
				}
				a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
				if (flags['golden_hammer'] == 0) { a[a.length - 1]['t3'] = "Golden Hammer"; }
			}

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (route_id == 0 && is_sunny == 1) {
				a.push({'desc':cliff_loc, 'cid':cliff_id, 'val':2, 'sel':false, 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':false});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':a[a.length - 1]['desc'], 'sr':true, 'sel':false});
			}

			// RICK
			if (dow != "SUN" && aff[rick_id] < _PARTY_ATTEND_MIN && is_sunny == 1) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':false});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
			}

			// MAYOR
			if (aff[mayor_id] < _PARTY_ATTEND_MIN && is_sunny == 1) {
				a.push({'desc':((dow == "SAT") ? "Talk (Rick Shop 50%)" : ((dow == "SUN") ? "Talk (Church)" : "Talk")), 'cid':mayor_id, 'val':3, 'sel':false});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
			}
		} else if (vars['gold'] < ((18000 - (6000 * vars['new_cow_days'].length / 3)) + (1800 - 1800 * flags['milker']) + 1500
					+ (5000 - ((flags['kitchen'] == 0) ? 0 : 1) * 5000) - (5000 - 1000 * vars['springs_days_worked']))) {
			// Mine until 22500 G:
			// 18000 (3 cows) + 1800 (milker) + 1500 (3 grass) + 5000 (kitchen) + [980 (blue feather)?] - 5000 (springs work) ~= 22500
			if (d > 97) {
				// Mine isnt open until Winter 8;
				if (flags['berry_pond'] == 0 && flags['golden_hammer'] == 1) {
					a.push({'desc':"Equip hammer", 'iid':get_npc_id('kappa'), 'imp':true});
					a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sr':true});
				}
				a.push({'desc':"Equip hoe, Visit Mine", 'iid':get_npc_id('carpenter_top')});
				a.push({'desc':"Dig a Berry", 'sr':true, 'sel':false, 'val':1, 'cid':'f_berry_mine'});
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = ((a[horse_action_ids[z]]['desc'] == "Brush") ? false : true);
				}
			}
		}

		// Feed Dog
		a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});
	}
	return a;
}
