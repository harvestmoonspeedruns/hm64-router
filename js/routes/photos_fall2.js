function actions_photos_fall_y2(a = [], d = 3, g = 300, is_sunny = 1) {
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var karen_id = get_npc_id('karen');
	var rick_id = get_npc_id('rick');
	var mayor_id = get_npc_id('mayor');
	var cow_id = get_npc_id('cow');

	var dow = get_dow(d, true);
	var mtn_visit = false;

	// Dont save if raining before you enter a cow
	// In case all of your cows get sick at once
	if (d == 62 && is_sunny == 0) { flags['dontsave'] = true; }

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':" Talk", 'val':1, 'cid':karen_id, 't2':"Musbox", 'sel':(flags['new_mus_box'] == 0)});
		a.push({'desc':"Musbox", 'val':6, 'cid':karen_id, 'sel':(flags['new_mus_box'] == 1), 'sr':true, 't2':a[a.length - 1]['desc']})
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
		a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
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
			if (is_sunny == 1) {
				a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
			}
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

	if (is_festival(d)) {
		// 4  (184) Cow Fest
		// 12 (192) Harvest Fest
		// 20 (200) Egg Fest
		// 28 (208) Horse Race

		// Cow Festival
		if (d == 184) {
			a.push({'desc':"Go to Ranch", 'imp':true, 'iid':mayor_id});
			a.push({'desc':"[RELEASE STICK OR YOU CANT MOVE AT FESTIVAL]", 'sr':true});
			a.push({'desc':"Talk", 'cid':rick_id, 'val':2, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN)});
			a.push({'desc':"Talk", 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN)});
			a.push({'desc':"Talk", 'cid':mayor_id, 'val':2, 'sel':(aff[mayor_id] < _PARTY_ATTEND_MIN)});
			a.push({'desc':"Talk", 'cid':karen_id, 'val':2, 'sel':(aff[karen_id] < 250)});
			a.push({'desc':"Win Cow Festival", 'iid':get_npc_id('doug'), 'imp':true,
					'cid':['v_happiness', get_npc_id('ann'), get_npc_id('grey'),
						get_npc_id('doug'), get_npc_id('kent'), karen_id, get_npc_id('elli'),
						get_npc_id('popuri'), get_npc_id('maria'), get_npc_id('kai'), get_npc_id('jeff'),
						cliff_id, get_npc_id('harris'), get_npc_id('potion master'), rick_id,
						mayor_id, get_npc_id('judge'), 'f_dontsave'],
					'val':[5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1]
			});
		}

		// Egg Festival
		if (d == 200 && flags['berry_farm'] == 0) {
			a.push({'desc':"Go to Village Screen", 'imp':true});
			a.push({'desc':"Egg Festival Berry", 'cid':["f_berry_eggfest", mayor_id, 'v_happiness'], 'val':[1, 2, 5], 'imp':true});
			a.push({'desc':"Talk", 'cid':rick_id, 'val':2, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN)});
			a.push({'desc':"Talk", 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN)});
		}

		// Horse Race
		if (d == 208 && (flags['horse_entered'] == 1 || vars['medals'] < 600)) {
			a = betting_table(a);
			if (flags['horse_entered'] == 1) {
				a.push({'desc':"Win Horse Race", 'cid':'f_photo_horserace','val':1, 'iid':get_npc_id('doug'), 'imp':true});
			}
		}
	} else {
		// Cow Photo
		if (flags['cow_entered'] == 1 && vars['grass_planted'] > 0 && is_sunny == 1 && flags['cows_outside'] == 1 && d > 184 && flags['photo_cowfest'] == 0) {
			a.push({'desc':"Cow Photo", 'imp':true, 'cid':['f_photo_cowfest'], 'val':[1], 'iid':cow_id});
			a.push({'desc':"(Enter / Exit House Until Photo)", 'sr':true});
		}

		// Enter Horse
		if (d == 207) {
			if (flags['photo_horserace'] == 0) {
				a.push({'desc':"Enter Horse", 'cid':['f_horse_entered', get_npc_id('doug')], 'val':[1, 3], 'imp':true});
			} else {
				a.push({'desc':"Ignore Doug on the Farm", 'imp':true, 'iid':get_npc_id('doug')});
			}
		}

		// Enter Cow
		if (d == 183) { a.push({'desc':"Enter Cow", 'cid':'f_cow_entered', 'val':1, 'iid':get_npc_id('doug'), 'imp':true}); }

		// Sell Cows
		if (money_needed() <= 0 && vars['cows'] > 0 && d > 184 && dow != "THURS") {
			a.push({'desc':"Equip hoe, Clear Field & Plant Grass"});
			a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}

			a.push({'desc':"Sell Cow", 'iid':get_npc_id('doug'),
					'cid':['v_cows', 'v_gold'],
					'val':[-1, ((vars['cows'] == 1 && d >= 184) ? 8500 : 7500)]
			});
			
			if (dow == "WED" && is_sunny == 1) {
				a.push({'desc':"Talk (Ranch)", 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN), 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':"Egg", 'sr':true, 'sel':(a[a.length - 1]['sel'])});
				a.push({'desc':"Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
			}
		}

		// Cutscene with Cliff + Ann when Cliff >= 143 affection
		if (is_sunny == 1 && aff[cliff_id] >= 143 && flags['cutscene_rabbit'] == 0) {
			a.push({'desc':"Dont go to Carp House Screen", 'imp':true});
			a.push({'desc':"Rabbit Cutscene", 'sel':false, 'cid':'f_cutscene_rabbit', 'val':1, 'sr':true});
		} else if (dow != "TUES") {
			// Extensions on rainy days to avoid cutscenes if Cliff aff >= 143

			// Grass
			a.push({'desc':"Equip hoe, Clear Field & Plant Grass"});
			a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}

			// Extensions
			if (flags['kitchen'] == 0 && vars['gold'] >= 5000) {
				// Kitchen
				a.push({'desc':"Buy a Kitchen (5000 G)", 'iid':get_npc_id('mas_carpenter'),
						'cid':['v_gold', 'v_lumber', 'f_kitchen'],
						'val':[-5000, -450, _BUILD_DAYS + 1]
				});
			} else if (flags['kitchen'] == 1) {
				var leftover_g = vars['gold'] - (980 - 980 * ((flags['blue_feather'] > 0 || flags['propose'] > 0) ? 1 : 0)) - (1800 - 1800 * flags['milker']);
				if (flags['babybed'] == 0 && leftover_g >= 1000) {
					// Babybed
					a.push({'desc':"Buy a Baby Bed (1000 G)", 'iid':get_npc_id('mas_carpenter'),
						'cid':['v_gold', 'v_lumber', 'f_babybed'],
						'val':[-1000, -150, _BUILD_DAYS + 1]
					});
				} else if (flags['babybed'] == 1) {
					if (flags['bathroom'] == 0 && leftover_g >= 3000) {
						// Bathroom
						a.push({'desc':"Buy a Bathroom (3000 G)", 'iid':get_npc_id('mas_carpenter'),
							'cid':['v_gold', 'v_lumber', 'f_bathroom'],
							'val':[-3000, -300, _BUILD_DAYS + 1]
						});
					} else if (flags['bathroom'] == 1 && flags['stairway'] == 0 && d > 174 && leftover_g >= 2000) {
						// Lumber needed for Stairway earned at Swim Fest
						// Stairway
						a.push({'desc':"Buy a Stairway (2000 G)", 'iid':get_npc_id('mas_carpenter'),
								'cid':['v_gold', 'v_lumber', 'f_stairway'],
								'val':[-2000, -250, _BUILD_DAYS + 1]
						});
					}
				}
			}
			if (a[a.length - 1]['iid'] == get_npc_id('mas_carpenter')) {
				ext_price = -1 * a[a.length - 1]['val'][0];
				ext_desc = a[a.length - 1]['desc'];
				ext_id = a.length - 1;
			}

			if (is_sunny == 1) {
				a = mtn_visit_fall2(a, d, g, is_sunny);
				mtn_visit = true;
			}
		} // End of Buy Extensions

		// Basil nearing min value for Spring Power Nut
		if (aff[basil_id] < basil_min(d) && flags['berry_basil'] == 0) {
			if (["FRI", "SAT"].includes(dow) && is_sunny == 1) {
				a = mtn_visit_fall2(a, d, g, is_sunny);
				mtn_visit = true;
			} else {
				if (!mtn_visit) { a.push({'desc':"mush, ed"}); }
				if (is_sunny == 0 || ["MON", "TUES", "WED"].includes(dow)) {
					a.push({'desc':"Talk (Flower Shop)", 'cid':basil_id, 'val':3, 'imp':true});
				} else if (dow == "SUN") {
					a.push({'desc':"Talk (Town Square)", 'cid':basil_id, 'val':3, 'imp':true});
				} else {
					a.push({'desc':"Talk (Greenhouse)", 'cid':basil_id, 'val':3, 'imp':true});
				}
			}
			a.push({'desc':"Gift", 'val':3, 'cid':basil_id, 'sr':true});
		}

		// BASIL & CLIFF Aff
		if (!mtn_visit && ["FRI", "SAT"].includes(dow) && (aff[cliff_id] < _PARTY_ATTEND_MIN || aff[basil_id] < _BASIL_BERRY_MIN)) {
			if (mtn_visit_fall2(a, d, g, is_sunny).length > 1) {
				a.push({'desc':"Equip hoe, Clear Field & Plant Grass"});
				a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
				a = mtn_visit_fall2(a, d, g, is_sunny);
				mtn_visit = true;
			}
		}
	}

	// Feed Dog
	a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false, 'red':(aff[get_npc_id('dog')] > 250)});
	return a;
}

function mtn_visit_fall2(a, d, g, is_sunny = 1) {
	var dow = get_dow(d, true);
	var tmp_s = [];
	var tmp_a = [];

	for (var i = 0; i < a.length; i++) {
		tmp_s.push(a[i]);
	}

	// BASIL
	var basil_id = get_npc_id('basil');
	if (aff[basil_id] < _BASIL_BERRY_MIN && ["FRI", "SAT"].includes(dow) && is_sunny == 1 && d < 184) {
		tmp_a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3, 'imp':(aff[basil_id] <= basil_min(d))});
		tmp_a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
	}

	// CLIFF
	var cliff_id = get_npc_id('cliff');
	if (is_sunny == 1) {
		if (["FRI", "SAT"].includes(dow)) {
			tmp_a.push({'desc':"Talk (Fish Tent)", 'cid':cliff_id, 'val':2, 'sel':(!cliff_maxed())});
		} else if (["THURS", "SUN"].includes(dow)) {
			tmp_a.push({'desc':("Talk (" + ((dow == "THURS") ? "By Cave)" : "Carp House)")), 'cid':cliff_id, 'val':2, 'sel':false});
		}
	} else {
		tmp_a.push({'desc':"Talk (In Carp House 50%)", 'cid':cliff_id, 'val':2, 'sel':(!cliff_maxed())});
	}
	if (tmp_a.length > 0 && tmp_a[tmp_a.length - 1]['cid'] == cliff_id) {
		tmp_a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':"Egg", 'sr':true, 'sel':(tmp_a[tmp_a.length - 1]['sel'])});
		tmp_a.push({'desc':"Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
	}
	return ((tmp_a.length > 0) ? tmp_s.concat([{'desc':"ed, wal, flower"}].concat(tmp_a)) : tmp_s);
}