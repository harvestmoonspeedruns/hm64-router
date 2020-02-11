function actions_photos_sum_y2(a, d, g, is_sunny) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var dog_id = get_npc_id('dog');
	var elli_id = get_npc_id('elli');
	var horse_id = get_npc_id('horse');
	var karen_id = get_npc_id('karen');
	var rick_id = get_npc_id('rick');
	var maria_id = get_npc_id('maria');
	var mayor_id = get_npc_id('mayor');
	var cow_id = get_npc_id('cow');

	var dow = get_dow(d, true);
	var mtn_visit = false;
	var horse_action_ids = [];
	var maria_affection = 0;

	var ext_price = 0;
	var ext_desc = "";
	var ext_id = -1;

	if (flags['propose'] == 1) {
		a.push({'desc':"Wedding Day", 'iid':elli_id, 'cid':['f_photo_married', 'f_propose'], 'val':[1, -1], 'imp':true});
	} else {
		if (flags['photo_married'] == 0 && flags['propose'] == 0 && flags['photo_maria'] == 0) {
			a.push({'desc':"WARNING:MARIA PHOTO before MARRIED", 'imp':true, 'iid':elli_id});
		}
		// Save dream warp for photo event
		if (aff[maria_id] >= _DREAM_EVENT_MIN && aff['maria_id'] < (_PHOTO_MIN - _MUS_BOX_AFF - 1) && flags['dream_maria'] == 0) {
			a.push({'desc':"DONT ENTER LIBRARY", 'imp':true});
		}

		// Blue feather into inventory
		if (flags['photo_married'] == 0 && flags['propose'] == 0 && flags['photo_maria'] == 1) {
			a.push({'desc':"Get Blue Feather from Tool Chest", 'imp':true});
		}

		// Married Affection
		if (flags['photo_married'] == 1) {
			a.push({'desc':" Talk", 'val':1, 'cid':elli_id, 't2':"Musbox", 'sel':(flags['new_mus_box'] == 0)});
			a.push({'desc':"Musbox", 'val':[6, -1], 'cid':[elli_id, 'f_new_mus_box'], 'sel':(flags['new_mus_box'] == 1), 'sr':true, 't2':a[a.length - 1]['desc']})
			a.push({'desc':"  Gift  ", 'val':1, 'cid':elli_id, 'sr':true, 'sel':false, 't2':"Milk"});
			a.push({'desc':"Milk", 'val':4, 'cid':elli_id, 'sr':true, 't2':"  Gift  ", 'sel':(aff[elli_id] < 250 && vars['cows'] > 0)})
		}

		// Dog Affection
		if (flags['dog_inside'] == 0) {
			a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1], 'imp':true});
			a.push({'desc':"Whistle", 'val':1, 'sr':true});
		}
		if (is_sunny == 1) {
			a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
		}

		// Horse Affection
		if (flags['photo_horserace'] == 0) {
			if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
				a.push({'desc':"Equip Brush", 'iid':horse_id});
			}
			if (flags['horse'] != 0) {
				a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
				a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':(flags['photo_maria'] == 0)});
				horse_action_ids.push(a.length - 1);
			}
			if (flags['horse_brush'] == 1) {
				a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
				if (aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
					horse_action_ids.push(a.length - 1);
				}
			}
		}

		if (is_sunny != -1) {
			// Not a Typhoon
			
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
			if (flags['yesterday_rain'] == 1 && vars['cows'] > 0) {
				a.push({'desc':"Hammer Sick Cows Until Mad", 'imp':true, 'iid':cow_id});
			}
			for (var z = 0; z < horse_action_ids.length; z++) {
				if (a[horse_action_ids[z]]['desc'] != "Brush") {
					if (a[horse_action_ids[z]]['desc'] != "Ride" || (aff[cow_id] < 60 && mn >= 0)) {
						a[horse_action_ids[z]]['sel'] = true;
					}
				}
				if (d == 174) { a[horse_action_ids[z]]['sel'] = true; }
			}

			// Forage for a kitchen + blue feather
			// Full Forage = 420G
			// (Shouldnt ever be necessary with selling cow milk, but you never know)

			// Forage if < 5000 by 169
			// Kitchen Start <= 169 (170 is a TUES [Carp closed])
			// Blue Feather <= 173 (174 is a SAT [Rick closed])
			// Propose <= 174
			// Marriage on 154, 161, 168, 175
			//			SUN, SUM  1,  11,  18,  25
			// ** IMPORTANT: Marriage by SUM 25 or Baby wont arrive before Evaluation **
			var tmp_gneed = 5000 - (((flags['kitchen'] > 0) ? 1 : 0) * 5000) + 980 - (flags['blue_feather'] * 980);
			if (flags['kitchen'] == 0 && (vars['gold'] < (tmp_gneed - (420 * (168 - d))))) {
				if (dow == "MON" || d < 160) {
					// MARIA
					a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 'sel':(flags['new_mus_box'] == 0 && aff[maria_id] < _PHOTO_MIN), 't2':"MusBox"});
					a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
							'sel':(flags['new_mus_box'] == 1 && aff[maria_id] < _PHOTO_MIN), 't2':"MusBox"
					});
					a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true, 'sel':(aff[maria_id] < _PHOTO_MIN)});
					maria_affection = 2 + ((flags['new_mus_box'] == 0) ? 1 : _MUS_BOX_AFF);
				}
				mtn_visit = true;
				a.push(forage(5000, g, d));
			}

			if (is_festival(d)) {
				// 9 = Veggie Fest
				// 24 = Sea Fest
				if (d == 174) { // Swim Fest
					a.push({'desc':"Go to the Beach", 'imp':true});
					a.push({'desc':"Win Swim Festival", 'iid':mayor_id, 'imp':true,
						'cid':["f_photo_swimming", "v_lumber", get_npc_id('jeff'), get_npc_id('grey'), get_npc_id('harris'), get_npc_id('kai'), get_npc_id('cliff'), 'v_happiness', 'f_dontsave'],
						'val':[1, 150, 8, 8, 8, 8, 8, 5, 1]
					});
				}
			} else {
				// Sell cows if you want
				if (dow != "THURS" && vars['cows'] > 0) {
					a.push({'desc':"Sell Cow", 'cid':['v_cows', 'v_gold'], 'val':[-1, 7500], 'sel':false, 'red':true, 'iid':get_npc_id('doug')});
				}

				// Cutscene with Cliff + Ann when Cliff >= 143 affection
				if (dow != "TUES") {
					// Extensions on rainy days to avoid cutscenes if Cliff aff >= 143

					if (flags['kitchen'] == 0 && vars['gold'] >= 5000) {
						// Kitchen
						a.push({'desc':"Buy a Kitchen (5000 G)", 'iid':get_npc_id('mas_carpenter'),
								'cid':['v_gold', 'v_lumber', 'f_kitchen'],
								'val':[-5000, -450, _BUILD_DAYS + 1]
						});
					} else if (flags['kitchen'] == 1) {
						var leftover_g = vars['gold'] - (980 - 980 * ((flags['blue_feather'] > 0 || flags['propose'] > 0 || flags['photo_married'] > 0) ? 1 : 0)) - (1800 - 1800 * flags['milker']);
						if (flags['babybed'] == 0 && leftover_g >= 1000) {
							// Babybed
							a.push({'desc':"Buy a Baby Bed (1000 G)", 'iid':get_npc_id('mas_carpenter'),
								'cid':['v_gold', 'v_lumber', 'f_babybed'],
								'val':[-1000, -150, _BUILD_DAYS + 1]
							});
						} else if (flags['babybed'] == 1) {
							if (flags['stairway'] == 0 && d > 174 && leftover_g >= 2000) {
								a.push({'desc':"Buy a Stairway (2000 G)", 'iid':get_npc_id('mas_carpenter'),
									'cid':['v_gold', 'v_lumber', 'f_stairway'],
									'val':[-2000, -250, _BUILD_DAYS + 1]
								});
							}
							
							/*
							 * Wait until after cows for bathroom
							 * to keep them from warping inside
							 *
							
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
							*/
						}
					}
					if (a[a.length - 1]['iid'] == get_npc_id('mas_carpenter')) {
						ext_price = -1 * a[a.length - 1]['val'][0];
						ext_desc = a[a.length - 1]['desc'];
						ext_id = a.length - 1;

						for (var z = 0; z < horse_action_ids.length; z++) {
							//if (a[horse_action_ids[z]]['desc'] != "Brush") {
								a[horse_action_ids[z]]['sel'] = true;
							//}
						}
					}

					if (!mtn_visit && is_sunny == 1 && (dow == "MON" || d < 160) && aff[maria_id] < _PHOTO_MIN) {
						// MARIA
						a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 'sel':(flags['new_mus_box'] == 0), 't2':"MusBox"});
						a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
								'sel':(flags['new_mus_box'] == 1), 't2':"MusBox"
						});
						a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});
						maria_affection = 2 + ((flags['new_mus_box'] == 0) ? 1 : _MUS_BOX_AFF);
						mtn_visit = true;
					}
				} // End of Buy Extensions

				// Basil nearing min value for Spring Power Nut
				/*
				if (aff[basil_id] < basil_min(d) && flags['berry_basil'] == 0) {
					if (["FRI", "SAT"].includes(dow) && is_sunny == 1) {
						a = mtn_visit_sum2(a, d, g, is_sunny);
						mtn_visit = true;
					} else {
						if (!mtn_visit) {
							a.push({'desc':"ed, wal, flower"});
							for (var z = 0; z < horse_action_ids.length; z++) {
								a[horse_action_ids[z]]['sel'] = true;
							}
						}
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
				*/

				// Someone still low on affection
				var someone_under_aff = false;
				var party_members = ['rick', 'mayor']; // others are: ann, maria, elli, may, kent, doug, gotz, cliff || BASIL REMOVED
				for (var z = 0; z < party_members.length; z++) {
					if (aff[get_npc_id(party_members[z])] < _PARTY_ATTEND_MIN) {
						someone_under_aff = true;
					}
				}

				if (aff[rick_id] < _PARTY_ATTEND_MIN || flags['photo_maria'] == 0 || aff[elli_id] < _PROPOSE_MIN) {
					// RICK
					if (flags['new_mus_box'] == 1) {
						a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
					}
					a.push({'desc':"Rick Fix", 'sr':false, 'sel':(dow != "SAT"), 'cid':[rick_id, 'f_old_mus_box', 'f_new_mus_box'], 'val':[3, -1, 1]});
					if (vars['gold'] >= 980 && flags['blue_feather'] == 0 && flags['propose'] == 0 && flags['photo_married'] == 0 && flags['kitchen'] == 1 && is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)) {
						a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-980, 1], 'sr':true, 'sel':(dow != "SAT"), 'red':(maria_affection >= (_PHOTO_MIN - (flags['dream_maria'] * _DREAM_EVENT_AFF)))});
					}
				}

				// MAYOR
				// "  Talk" <- -2 spaces
				// "  Gift" <- -2 spaces
				if (is_sunny == 1 && dow != "SUN" && aff[mayor_id] < _PARTY_ATTEND_MIN) {
					if (flags['cutscene_watermelon'] == 0 && aff[ann_id] >= 153) {
						// When Ann aff >= 153, Watermelon cutscene occurs with Maria on second village screen
						// 118 < trigger < 154
						a.push({'desc':"WARNING: Cutscene plays at 2nd Village Screen", 'imp':true});
						a.push({'desc':"Watermelon Cutscene", 'val':1, 'cid':'f_cutscene_watermelon', 'sr':true, 'sel':false});
					}
					a.push({'desc':"Talk (Rick Shop 50%)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
					a.push({'desc':"  Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
				}

				if (flags['photo_married'] == 0 && flags['propose'] == 0 && flags['photo_maria'] == 1) {
					// Propose to Elli
					a.push({'desc':"Propose at Bakery", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, (next_sunday(d + 1) - d + 1)], 'iid':elli_id});
				}
			} // End of if (!festival)

			if (mtn_visit) {
				for (var z = 0; z < horse_action_ids.length; z++) {
					if (a[horse_action_ids[z]]['desc'] != "Brush") {
						if (a[horse_action_ids[z]]['desc'] != "Ride" || (aff[cow_id] < 60 && mn >= 0)) {
							a[horse_action_ids[z]]['sel'] = true;
						}
					}
					if (d == 174) { a[horse_action_ids[z]]['sel'] = true; }
				}
			}

			// Plant Grass Seeds
			if (vars['grass'] > 0) {
				a.push({'desc':"Equip Grass Seeds"});
				a.push({'desc':"Plant All Grass Seeds", 'cid':['v_grass', 'v_grass_planted'], 'val':[-1 * vars['grass'], vars['grass']], 'sr':true, 'sel':false});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
			}

			// Feed Dog
			a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false, 'red':(aff[dog_id] > 250)});
		} // End of if (!typhoon)
	}

	// Maria's Photo
	if (is_sunny == 1 && flags['photo_maria'] == 0 && d > 160) {
		maria_affection += (_DREAM_EVENT_AFF * (1 - flags['dream_maria']));
		if ((aff[maria_id] + maria_affection) >= _PHOTO_MIN) {
			// WARP TO PHOTO
			if (flags['dream_maria'] == 0) {
				a.push({'desc':"DREAM WARP (Library)", 'imp':true, 'cid':[maria_id, 'f_dream_maria'], 'val':[_DREAM_EVENT_AFF, 1]});
			} else if (flags['dream_karen'] == 0) {
				a.push({'desc':"DREAM WARP (Vineyard)", 'imp':true, 'cid':[karen_id, 'f_dream_karen'], 'val':[_DREAM_EVENT_AFF, 1]});
			}
			a.push({'desc':"PHOTO at 6PM", 'imp':true, 'cid':[maria_id, 'f_photo_maria'], 'val':[_PHOTO_EVENT_AFF, 1]});
		} else if (d == 151) {
			// Fireworks Festival
			if (flags['dream_karen'] == 0 && (aff[maria_id] + maria_affection) < _PHOTO_EVENT_MIN) {
				a.push({'desc':"DREAM WARP (Vineyard)", 'cid':[karen_id, 'f_dream_karen'], 'val':[_DREAM_EVENT_AFF, 1], 'sel':false});
				a.push({'desc':"Fireworks (Town Square)", 'cid':maria_id, 'val':5, 'sel':false});
			}
		}
	}

	// Openers
	if (mtn_visit) {
		if (flags['berry_farm'] == 0) {
			a = [{'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false}].concat(a);
		}
		a = ((flags['old_mus_box'] == 0) ? [{'desc':"Equip hoe", 'iid':get_npc_id("musbox")}, {'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true}] : [{'desc':"Equip hoe, till spots for grass"}]).concat(a);
	}
	if (flags['dog_inside'] == 1 && flags['propose'] != 1) {
		a = [{'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2}].concat(a);
	}

	// Brushing not required
	if (aff[horse_id] >= (250 - (208 - d)) && horse_action_ids.length > 0 && flags['photo_horserace'] == 0) {
		a[horse_action_ids[horse_action_ids.length - 1]]['sel'] = false;
	}
	return a;
}

function money_needed() {
	return ((1 - flags['greenhouse']) * 30000) + ((1 - flags['logterrace']) * 7000) + ((1 - flags['stairway']) * 2000) +
		((1 - flags['bathroom']) * 3000) + ((1 - flags['kitchen']) * 5000) + ((1 - flags['babybed']) * 1000) +
		((35 - (vars['grass_planted'] + vars['grass'])) * 500) + ((vars['new_chicken_days'].length + vars['chickens'] == 0) ? 500 : 0) +
		((1 - flags['blue_feather']) * 980) - (vars['cows'] * 7500);
}