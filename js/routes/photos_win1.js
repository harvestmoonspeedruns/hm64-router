function actions_photos_win_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var cliff_id = get_npc_id('cliff');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
		a.push({'desc':"Gift", 'val':1, 'cid':karen_id, 'sr':true, 'sel':false});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1 && (d != 109 || flags['dog_entered'] == 0)) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	}
	if (is_sunny == 1) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	// Horse Affection
	var horse_id = get_npc_id('horse');
	if (aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]) && flags['photo_horserace'] == 0) {
		if (flags['horse_brush'] == 1) {
			a.push({'desc':"Equip brush", 'iid':horse_id});
		}
		a.push({'desc':"Whistle / Ride Horse", 'val':(2 + flags["sustaining_carrot"]), 'cid':horse_id, 'sr':(flags['horse_brush'] == 1)});
		if (flags['horse_brush'] == 1) {
			a.push({'desc':"Brush Horse", 'val':2, 'cid':horse_id, 'sr':true});
		}
	}

	if (is_festival(d)) {
		if (d == 109) {
			// Dog Race, 500 LUM (Win 19)	
			a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':get_npc_id('mayor'), 'imp':true});
			a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
			if (flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'sel':false, 'sr':true}); }
			a = betting_table(a);
		}
	} else if (aff[ann_id] >= _PHOTO_EVENT_AFF && is_sunny == 1 && flags['photo_ann'] == 0) {
		// Anns photo
		a.push({'desc':"Photo", 'cid':[ann_id, 'f_photo_ann', 'f_dontsave'], 'val':[_PHOTO_EVENT_AFF, 1, 1], 'imp':true});

		// Feed dog
		a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});	
	} else {
		if (d == 108) {
			a.push({'desc':"Enter Dog", 'cid':['f_dog_entered',get_npc_id('doug')], 'val':[1, 3], 'sel':(vars['medals'] >= 1000)});
		}

		// ANN
		if (aff[ann_id] < _PHOTO_EVENT_AFF && flags['photo_ann'] == 0) {
			if (flags['chicken_outside'] == 1) {
				a.push({'desc':"Bring Chicken Inside", 'val':-1, 'cid':'f_chicken_outside', 'imp':true});
				a.push({'desc':"Feed Chicken", 'cid':'v_feed', 'val':-1, 'sr':true});
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
				a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'iid':get_npc_id('chicken'), 'imp':true});
			}
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'imp':true});
			if (["TUES", "WED"].includes(dow) && aff[cliff_id] < (_PARTY_ATTEND_MIN - (8 - (flags['photo_swimming'] * 8)) - (8 - (flags['photo_harvest'] * 8)))) {
				a.push({'desc':("Talk (" + ((dow == "WED") ? "Ranch) " : "Beach) ")), 'cid':cliff_id, 'val':2});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':false});
				a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 'sel':true, 't2':a[a.length - 1]['desc'], 'sr':true});
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
				var cow_names = ["A", "B", "5"];
				a.push({'desc':"Equip hammer, use 20 times", 'iid':get_npc_id('doug')})
				a.push({'desc':('Buy Cow ("' + cow_names[((vars['new_cow_days'].length) / 3)] + '")'), 'sr':true,
						'cid':['v_gold', 'v_new_cow_days'],
						'val':[-6000, d + _COW_GROW_SLEEPS]
				});

				// CLIFF
				if (["TUES", "WED"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN && (aff[elli_id] < 160 || dow == "WED")) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 160-ish
					a.push({'desc':get_cliff_loc(dow), 'cid':cliff_id, 'val':2});
					a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
					a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
				}
			}
			if (dow != "TUES") {
				var leftover_g = vars['gold'] - ((18000 - (6000 * vars['new_cow_days'].length / 3)) + (1800 - 1800 * flags['milker']) + 1500
									+ (5000 - ((flags['kitchen'] == 0) ? 0 : 1) * 5000) - (5000 - 1000 * vars['springs_days_worked']));
					if (flags['kitchen'] == 0) {
						// Kitchen
						a.push({'desc':"Buy a Kitchen (5000 G)", 'iid':get_npc_id('mas_carpenter'),
								'cid':['v_gold', 'v_lumber', 'f_kitchen'],
								'val':[-5000, -450, _BUILD_DAYS + 1]
						});
					} else if (flags['kitchen'] == 1 && flags['babybed'] == 0 && leftover_g >= 1000) {
						// Babybed
						a.push({'desc':"Buy a Baby Bed (1000 G)", 'iid':get_npc_id('mas_carpenter'),
								'cid':['v_gold', 'v_lumber', 'f_babybed'],
								'val':[-1000, -150, _BUILD_DAYS + 1]
						});
					}
			}

			if (!["WED", "SAT", "SUN"].includes(dow) && is_sunny == 1 && vars['cows'] > 0 && (aff[rick_id] < _PARTY_ATTEND_MIN || flags['milker'] == 0)) {
				// MAYOR
				if (aff[mayor_id] < _PARTY_ATTEND_MIN) {
					a.push({'desc':"Village (50%)", 'cid':mayor_id, 'val':3, 'sel':false});
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
				}

				// RICK
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':false});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
				if (flags['milker'] == 0) {
					a.push({'desc':"Buy a Milker", 'cid':['v_gold', 'f_milker'], 'val':[-1800, 1], 'sr':true});
				}
			}
		}

		// Thanksgiving
		if (d == 100 && flags['berry_pond'] == 0) {
			// Get Frozen Pond Berry for more time in mine later
			if (flags['golden_hammer'] == 0) {
				a.push({'desc':"Equip hammer, Clear rocks on farm"});
				a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sr':true, 't0':"Pond Rock Berry", 'sel':false});
			}
			
			// Meet girls on the farm
			var tg_girls = ['maria', 'popuri', 'elli', 'ann', 'karen'];
			for (var i = 0; i < tg_girls.length; i++) {
				if (aff[get_npc_id(tg_girls[i])] >= 140) {
					a.push({'desc':("Meet " + tg_girls[i].charAt(0).toUpperCase() + tg_girls[i].substring(1)), 'cid':'v_happiness', 'val':8});
					if (i == 4) {
						// Karen gets extra affection
						a[a.length - 1]['cid'] = ['v_happiness', get_npc_id('karen')];
						a[a.length - 1]['val'] = [8, 3];
					} else {
						a[a.length - 1]['iid'] = get_npc_id(tg_girls[i]);
					}
				}
			}
			a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
			if (flags['golden_hammer'] == 0) { a[a.length - 1]['t3'] = "Golden Hammer"; }
		}

		//  102, 103, 104, 105, 106
		// THURS,FRI, SAT, SUN, MON
		if (d >= 102 && d <= 106) {
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
			if (is_sunny == 1 && aff[cliff_id] < (_PARTY_ATTEND_MIN - (8 - (flags['photo_swimming'] * 8)) - (8 - (flags['photo_harvest'] * 8)))) {
				var cliff_loc = "Talk";
				if (dow == "MON") { cliff_loc += " (Hot Springs)"; }
				if (dow == "FRI" || dow == "SAT") { cliff_loc += " (Fish Tent 50%)"; }
				if (dow == "SUN") { cliff_loc += " (By Carp House 50%)"; }
				if (dow == "THURS") { cliff_loc += " (By Carp House)"; }
				a.push({'desc':cliff_loc, 'cid':cliff_id, 'val':2});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
				a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':(vars['chickens'] > 0)});
			}

			// RICK
			if (dow != "SUN" && aff[rick_id] < _PARTY_ATTEND_MIN && is_sunny == 1) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT")});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
			}

			// MAYOR
			if (aff[mayor_id] < _PARTY_ATTEND_MIN && is_sunny == 1) {
				a.push({'desc':((dow == "SAT") ? "Talk (Rick Shop 50%)" : ((dow == "SUN") ? "Talk (Church)" : "Talk")), 'cid':mayor_id, 'val':3, 'sel':(dow != "SAT")});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id] && dow != "SAT")});
			}
		} else if (vars['gold'] < ((18000 - (6000 * vars['new_cow_days'].length / 3)) + (1800 - 1800 * flags['milker']) + 1500
					+ (5000 - ((flags['kitchen'] == 0) ? 0 : 1) * 5000) - (5000 - 1000 * vars['springs_days_worked']))) {
			// Mine until 22500 G:
			// 18000 (3 cows) + 1800 (milker) + 1500 (3 grass) + 5000 (kitchen) + [980 (blue feather)?] - 5000 (springs work) ~= 22500
			if (d > 97 && d != 100) {
				// Mine isnt open until Winter 8
				// 100 is Thanksgiving (meet girls and upgrade hammer for pond berry)
				a.push({'desc':"Equip hoe, Visit Mine", 'iid':get_npc_id('carpenter_top')});
				a.push({'desc':"Dig a Berry", 'sr':true, 'sel':false, 'val':1, 'cid':'f_berry_mine'});
			}
		}

		// Feed Dog
		a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
	}
	return a;
}