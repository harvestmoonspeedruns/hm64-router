function actions_photos_spr_y2(a = [], d = 3, g = 300, is_sunny = 1) {
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var karen_id = get_npc_id('karen');
	var rick_id = get_npc_id('rick');
	var mayor_id = get_npc_id('mayor');
	var cow_id = get_npc_id('cow');

	var dow = get_dow(d, true);
	
	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
		a.push({'desc':"Gift", 'val':1, 'cid':karen_id, 'sr':true, 'sel':false});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	}
	if (is_sunny == 1) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	// Make room for grass seeds
	if (flags['fishing_rod_stored'] == 0) {
		a.push({'desc':"Store Fishing Rod and Axe", 'cid':'f_fishing_rod_stored', 'val':1, 'imp':true});
	}

	// Basil berry
	if (d == 135) {
		a.push({'desc':"Ignore Basil on Farm", 'cid':[basil_id, 'f_berry_basil'], 'val':[0, 0], 'imp':true});
		if (aff[basil_id] >= _BASIL_BERRY_MIN) {
			a[a.length - 1]['desc'] = "Berry from Basil"
			a[a.length - 1]['val'] = [3, 1];
		}
	}

	// Enter Horse Race
	if (d == 136) {
		if (flags['photo_horserace'] == 0) {
			a.push({'desc':"Enter Horse into Race", 'cid':[get_npc_id('doug'), 'f_horse_entered'], 'val':[3, 1], 'imp':(aff[get_npc_id('horse')] >= 200)});
		} else {
			a.push({'desc':"Ignore Doug on the Farm", 'iid':get_npc_id('doug')});
		}
	}

	// Horse Affection
	if (flags['horse_entered'] == 0 && d != 137) {
		var horse_id = get_npc_id('horse');
		if (flags['photo_horserace'] == 0) {
			if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
				a.push({'desc':"Equip Brush", 'iid':horse_id, 'sel':false});
			}
			if (flags['horse'] != 0) {
				a.push({'desc':"Whistle Horse", 'val':1, 'cid':get_npc_id('horse'), 'sel':false, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
				a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':false});
			}
			if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
				a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
			}
		}
	}

	// Milk Cows
	if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id});
		if (flags['cows_outside'] == 0) {
			a.push({'desc':"Put Cows Outside", 'sr':true, 'cid':'f_cows_outside', 'val':1});
		}
		if (is_sunny == 1) {
			a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
		}
	}
	// New Cow
	if (parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		a.push({'desc':"New Cow, Hammer 10x, Put Outside", 'imp':true, 'iid':cow_id});
	}
	// Sick Cows
	if (flags['yesterday_rain'] == 1 && vars['cows'] > 0) {
		a.push({'desc':"Hammer Sick Cows Until Mad", 'imp':true, 'iid':cow_id});
	}

	if (is_festival(d)) {
		// 1 (121) - New Years
		// 8 (128) - Planting
		// 17 (137) - Horse
		// 23 (143) - Flower

		if (d == 128 && flags["harvest_king"] == 1) {
			// Planting Festival (Spring 8)
			a.push({'desc':"Go to Town Square", 'iid':mayor_id, 'cid':['v_happiness', 'f_dontsave'], 'val':[5, 1], 'imp':true});
			a.push({'desc':"Ride with Cliff", 'val':[1, 8, -1], 'cid':['f_photo_harvest', cliff_id, 'f_harvest_king']});
		} else if (d == 137) {
			// Horse Race (Spring 17)
			if (flags['horse_entered'] == 1) {
				a.push({'desc':"Win Horse Race", 'cid':'f_photo_horserace','val':1, 'iid':get_npc_id('doug'), 'imp':true});
			}
			a = betting_table(a);
		} else if (d == 143 && vars['gold'] >= 1000 && flags['berry_flowerfest'] == 0) {
			// Flower Festival (Spring 23)
			a.push({'desc':"Go to Town Square", 'iid':mayor_id, 'cid':'v_happiness', 'val':5});
			a.push({'desc':"Buy a Power Nut", 'cid':['f_berry_flowerfest','v_gold'],
					'val':[1, -1000], 'iid':get_npc_id('salesman'), 'sel':(vars['gold'] >= 1000)
			});
			a.push({'desc':"Talk", 'cid':basil_id, 'val':2, 'sel':(aff[basil_id] < _PARTY_ATTEND_MIN || (flags['berry_mine'] == 0 && aff[basil_id] < _BASIL_BERRY_MIN))});
			a.push({'desc':"Talk", 'cid':rick_id,  'val':2, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN)});
			if (aff[cliff_id] >= 50) {
				a.push({'desc':"Talk", 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < (_PARTY_ATTEND_MIN - (8 - (flags['photo_swimming'] * 8)) - (8 - (flags['photo_harvest'] * 8))))});
			}
			a.push({'desc':"Talk", 'cid':mayor_id, 'val':2, 'sel':(aff[mayor_id] < _PARTY_ATTEND_MIN)});
		}
	} else { // Not a festival
		if (vars['grass_planted'] < 3 && vars['grass'] == 0 && is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)) {
			a.push({'desc':"Equip hoe, till three 3x3 squares by barn"});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}

			if (aff[cliff_id] < _PARTY_ATTEND_MIN || aff[rick_id] < _PARTY_ATTEND_MIN || aff[mayor_id] < _PARTY_ATTEND_MIN || (d >= 135 && aff[basil_id] < _PARTY_ATTEND_MIN || (aff[basil_id] < _BASIL_BERRY_MIN && flags['berry_mine'] == 0))) {
				a.push({'desc':"Dont go to Carp House Screen", 'imp':true});
				a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
			}

			if (is_sunny == 1) {
				// BASIL
				if (d >= 135 && ["FRI", "SAT"].includes(dow) && flags['berry_basil'] == 0) {
					a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _PARTY_ATTEND_MIN || (aff[basil_id] < _BASIL_BERRY_MIN && flags['berry_mine'] == 0)), 'red':((aff[basil_id] >= _PARTY_ATTEND_MIN && flags['berry_mine'] == 1) || aff[basil_id] >= _BASIL_BERRY_MIN)});
					a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(aff[basil_id] < _PARTY_ATTEND_MIN || (aff[basil_id] < _BASIL_BERRY_MIN && flags['berry_mine'] == 0))});
				}

				// CLIFF
				if (["MON", "FRI", "SAT"].includes(dow)) {
					a.push({'desc':("Talk (" + ((dow == "MON") ? "Hot Springs)" : "Fish Tent 50%)")), 'cid':cliff_id, 'val':2, 'sel':false, 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
					a.push({'desc':"Gift ", 'cid':cliff_id, 'val':4, 't2':"Egg", 'sr':true, 'sel':false});
					a.push({'desc':"Egg", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift ", 'sr':true});
				}

				// BASIL
				if (flags['berry_basil'] == 0 && dow == "THURS" && d >= 135) {
					a.push({'desc':"Talk (Greenhouse)", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN || (aff[basil_id] < _PARTY_ATTEND_MIN && flags['berry_mine'] == 1)), 'red':(aff[basil_id] >= _BASIL_BERRY_MIN || (aff[basil_id] >= _PARTY_ATTEND_MIN && flags['berry_mine'] == 1))});
					a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
				}
			}

			// Grass (and Milker)
			var tmp_gold = (vars['gold'] + 1800 - (1800 * flags['milker']));
			var tmp_grass = ((tmp_gold > 1500) ? 3 : Math.floor(tmp_gold / 500));
			if (tmp_grass > 0) {
				a.push({'desc':'Buy ' + tmp_grass + ' grass seeds', 'cid':['v_gold', 'v_grass'], 'val':[-500 * tmp_grass, tmp_grass], 'iid':get_npc_id('lillia')});
				if (vars['day'] >= 135 && ["MON", "TUES", "WED"].includes(dow)) {
					a.push({'desc':"Talk (Flower Shop)", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _PARTY_ATTEND_MIN || (aff[basil_id] < _BASIL_BERRY_MIN && flags['berry_mine'] == 0))});
					a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true, 'sel':false});
				}
			}

			// MAYOR
			// "  Talk" <- -2 spaces
			// "  Gift" <- -2 spaces
			if (is_sunny == 1 && dow != "SUN") {
				if (flags['cutscene_watermelon'] == 0 && aff[ann_id] >= 153) {
					// When Ann aff >= 153, Watermelon cutscene occurs with Maria on second village screen
					// 118 < trigger < 154
					a.push({'desc':"WARNING: Cutscene plays at 2nd Village Screen", 'imp':true});
					a.push({'desc':"Watermelon Cutscene", 'val':1, 'cid':'f_cutscene_watermelon', 'sr':true, 'sel':false});
				}
				a.push({'desc':"Talk (Rick Shop 50%)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"  Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
			}

			// RICK
			if (is_sunny == 1 && !["WED", "SUN"].includes(dow)) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT" && aff[rick_id] < _PARTY_ATTEND_MIN), 'red':(aff[rick_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT" && aff[rick_id] < _PARTY_ATTEND_MIN), 'sr':true});
				if (flags['milker'] == 0 && vars['gold'] >= 1800 && dow != "SAT") {
					// Buy Milker
					a.push({'desc':"Buy Milker", 'cid':['f_milker', 'v_gold'], 'val':[1, -1800], 'sr':true});	
				}
			}

			// Plant Grass
			if (tmp_grass > 0) {
				a.push({'desc':"Equip Grass Seeds", 'imp':true});
				a.push({'desc':("Plant " + tmp_grass + " Grass"), 'cid':['v_grass', 'v_grass_planted'], 'val':[-1 * tmp_grass, tmp_grass], 'sr':true});
			}
		} else if (dow != "TUES" && is_sunny == 0) {
			// Extensions on rainy days to avoid cutscenes
			var leftover_g = vars['gold'] - (980 - 980 * flags['blue_feather']) - (1800 - 1800 * flags['milker']) - (5000 - 5000 * ((flags['kitchen'] > 0) ? 1 : 0));
			var tmp_build_ext = false;
			if (flags['kitchen'] == 0) {
				// Kitchen
				a.push({'desc':"Buy Kitchen (5000)", 'iid':get_npc_id('mas_carpenter'),
						'cid':['v_gold', 'v_lumber', 'f_kitchen'],
						'val':[-5000, -450, _BUILD_DAYS + 1]
				});
				tmp_build_ext = true;
			} else if (flags['kitchen'] == 1) {
				var leftover_g = vars['gold'] - ((18000 - (6000 * vars['new_cow_days'].length / 3)) + (1800 - 1800 * flags['milker']) + (980 - 980 * (flags['propose'] + flags['blue_feather'])) +
						(1500 - (500 * (flags['grass'] + flags['grass_planted']))) + (5000 - ((flags['kitchen'] == 0) ? 0 : 1) * 5000));
				if (leftover_g >= 1000 && flags['babybed'] == 1 && flags['bathroom'] == 0) {
					// Bathroom
					a.push({'desc':"Buy Bathroom (3000)", 'iid':get_npc_id('mas_carpenter'),
						'cid':['v_gold', 'v_lumber', 'f_bathroom'],
						'val':[-3000, -300, _BUILD_DAYS + 1]
					});
					tmp_build_ext = true;
				} else if (flags['babybed'] == 0 && leftover_g >= 1000) {
					// Babybed
					a.push({'desc':"Buy Baby Bed (1000)", 'iid':get_npc_id('mas_carpenter'),
						'cid':['v_gold', 'v_lumber', 'f_babybed'],
						'val':[-1000, -150, _BUILD_DAYS + 1]
					});
					tmp_build_ext = true;
				}
			}

			// CLIFF
			if (tmp_build_ext) {
				a.push({'desc':"Talk (In Carp House 50%)", 'sel':false, 'cid':cliff_id, 'val':2, 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
				a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
			}
		}
	}

	// Plant Grass Seeds
	if (vars['grass'] > 0) {
		a.push({'desc':"Equip Grass Seeds", 'imp':true});
		a.push({'desc':"Plant " + vars['grass'] + " Grass", 'cid':['v_grass', 'v_grass_planted'], 'val':[-1 * vars['grass'], vars['grass']]});
		if (flags['berry_farm'] == 0) {
			a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
		}
	}

	// Feed Dog
	a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
	return a;
}