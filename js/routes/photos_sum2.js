function actions_photos_sum_y2(a, d, g, is_sunny) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var horse_id = get_npc_id('horse');
	var karen_id = get_npc_id('karen');
	var rick_id = get_npc_id('rick');
	var mayor_id = get_npc_id('mayor');
	var cow_id = get_npc_id('cow');
	var wife_id = get_npc_id((route_id == 0) ? 'karen' : 'elli');

	var dow = get_dow(d, true);
	var mtn_visit = false;
	var horse_action_ids = [];

	var ext_price = 0;
	var ext_desc = "";
	var ext_id = -1;

	if (flags['propose'] == 1) {
		a.push({'desc':"Wedding Day", 'iid':wife_id, 'cid':['f_photo_married', 'f_propose'], 'val':[1, -1], 'imp':true});
	} else {
		// Married Affection
		if (flags['photo_married'] == 1) {
			a.push({'desc':" Talk", 'val':1, 'cid':wife_id, 't2':"Musbox", 'sel':(flags['new_mus_box'] == 0)});
			a.push({'desc':"Musbox", 'val':6, 'cid':wife_id, 'sel':(flags['new_mus_box'] == 1), 'sr':true, 't2':a[a.length - 1]['desc']})
			a.push({'desc':"Gift", 'val':1, 'cid':wife_id, 'sr':true, 'sel':(aff[karen_id] < 250)});
		}

		// Dog Affection
		if (flags['dog_inside'] == 1) {
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
		} else {
			a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1]});
			a.push({'desc':"Whistle", 'val':1, 'sr':true});
		}
		if (is_sunny == 1) {
			//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
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
			if (flags['horse_brush'] == 1) {
				a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
				if (aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
					horse_action_ids.push(a.length - 1);
				}
			}
		}

		if (is_sunny != -1) {
			// Not a Typhoon

			var propose_at_bar = (route_id == 0 && ["MON", "THURS", "FRI", "SAT"].includes(dow) && flags['propose'] == 0 && flags['photo_married'] == 0 &&
				(flags['blue_feather'] == 1 || (vars['gold'] >= 980 && flags['kitchen'] == 1 && is_sunny == 1 && dow != "SAT")))

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
				a = mtn_visit_sum2(a, d, g, is_sunny);
				mtn_visit = true;
				a.push(forage(5000, g, d));
			}

			if (is_festival(d)) {
				// Milk Cows
				if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
					a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0)});
					if (flags['cows_outside'] == 0) {
						a.push({'desc':"Put Cows Outside", 'cid':'f_cows_outside', 'val':1,'sr':true});
					}
					if (is_sunny == 1) {
						//a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
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
					a[horse_action_ids[z]]['sel'] = true;
				}

				// 9 = Veggie Fest
				// 24 = Sea Fest
				if (d == 174) { // Swim Fest
					a.push({'desc':"Go to the Beach", 'imp':true});
					a.push({'desc':"Win Swim Festival", 'iid':mayor_id, 'imp':true,
						'cid':["f_photo_swimming", "v_lumber", get_npc_id('jeff'), get_npc_id('grey'), get_npc_id('harris'), get_npc_id('kai'), cliff_id, 'v_happiness', 'f_dontsave'],
						'val':[1, 150, 8, 8, 8, 8, 8, 5, 1]
					});
				}
			} else {
				// Cutscene with Cliff + Ann when Cliff >= 143 affection
				if (is_sunny == 1 && aff[cliff_id] >= 143 && flags['cutscene_rabbit'] == 0) {
					a.push({'desc':"Dont go to Carp House Screen", 'imp':true});
					a.push({'desc':"Rabbit Cutscene", 'sel':false, 'cid':'f_cutscene_rabbit', 'val':1, 'sr':true});
				} else if (dow != "TUES") {
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
							a[horse_action_ids[z]]['sel'] = true;
						}
					}

					if (is_sunny == 1) {
						a = mtn_visit_sum2(a, d, g, is_sunny);
						mtn_visit = true;
					}
				} // End of Buy Extensions

				// Basil nearing min value for Spring Power Nut
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

				// Buy a Blue Feather
				if (vars['gold'] >= 980 && flags['blue_feather'] == 0 && flags['propose'] == 0 && flags['photo_married'] == 0 && flags['kitchen'] == 1 && is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)) {
					if (!mtn_visit) {
						a.push({'desc':"Equip hoe, till spots for grass"});
						if (flags['berry_farm'] == 0) {
							a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
						}
						a = mtn_visit_sum2(a, d, g, is_sunny);
						mtn_visit = true;
					}

					if (flags['berry_basil'] == 0 && dow == "THURS" && aff[basil_id] >= basil_min(d)) {
						a.push({'desc':"Talk (Greenhouse)", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN && (aff[basil_id] < _PARTY_ATTEND_MIN || flags['berry_mine'] == 0)), 'red':(aff[basil_id] >= _BASIL_BERRY_MIN || (aff[basil_id] >= _PARTY_ATTEND_MIN && flags['berry_mine'] == 1))});
						a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN && (aff[basil_id] < _PARTY_ATTEND_MIN || flags['berry_mine'] == 0))});
					}

					var tmp_seeds = Math.floor((vars['gold'] - ext_price - (980 - 980 * flags['blue_feather'])) / 500);
					var tmp_seeds2 = Math.floor((vars['gold'] - (980 - 980 * flags['blue_feather'])) / 500);
					tmp_seeds = ((tmp_seeds > 20) ? 20 : tmp_seeds);
					if (propose_at_bar && tmp_seeds > 0) {
						a.push({'desc':("Buy " + tmp_seeds + " Grass Seeds"), 'iid':get_npc_id('lillia'),
								'cid':['v_gold', 'v_grass'], 'val':[-500 * tmp_seeds, tmp_seeds]
						});
						if (tmp_seeds != tmp_seeds2) {
							a[a.length - 1]['t2'] = "Buy " + tmp_seeds2 + " Grass Seeds";
							a.push({'desc':a[a.length - 1]['t2'], 'cid':['v_gold', 'v_grass'], 'sr':true, 'sel':false,
									'val':[-500 * tmp_seeds2, tmp_seeds2], 't2':[a[a.length - 1]['desc'], ext_desc]
							});
							a[ext_id]['t2'] = a[a.length - 1]['desc'];
							a[ext_id]['t3'] = a[a.length - 2]['desc'];
						}
					}

					// RICK
					a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN), 'red':(aff[rick_id] >= _PARTY_ATTEND_MIN && flags['blue_feather'] == 1)});
					a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN)});
					a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-980, 1], 'sr':true,
							't0':["Propose at Bar"], 't3':"Propose at Bar"});
					if (aff[cliff_id] <= 142 || flags['cutscene_rabbit'] == 1) {
						a[a.length - 1]['t0'].push("Propose in Mtns");
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
					
					a.push({'desc':"Get Blue Feather from Tool Chest", 'imp':true});

					if (route_id == 0) {
						// Propose to Karen in Mtns
						if (flags['photo_married'] == 0 && flags['propose'] == 0 && aff[cliff_id] <= 142) {
							a.push({'desc':"Propose in Mtns", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, (next_sunday(d + 1) - d + 1)], 'iid':karen_id,
									'sel':false, 't2':"Propose at Bar", 't3':"Buy Blue Feather"});
						}
						// Propose to Karena t Bar
						if (propose_at_bar) {
							a.push({'desc':"Equip Grass Seeds"});
							a.push({'desc':"Plant All Grass", 'sel':false, 'sr':true, 'cid':['v_grass_planted', 'v_grass'], 'val':[vars['grass'], -1 * vars['grass']]});
							if (flags['berry_farm'] == 0) {
								a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
							}
						}
					} else {
						if (flags['photo_married'] == 0 && flags['propose'] == 0) {
							// Propose to Elli
							a.push({'desc':"Propose at Bakery", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, (next_sunday(d + 1) - d + 1)], 'iid':wife_id,
									'sel':false, 't3':"Buy Blue Feather"});
						}
					}
				} // End of Buy a Blue Feather

				// Someone still low on affection
				var someone_under_aff = false;
				var party_members = ['rick', 'mayor', 'basil', 'cliff']; // others are: ann, maria, elli, may, kent, doug
				for (var z = 0; z < party_members.length; z++) {
					if (aff[get_npc_id(party_members[z])] < _PARTY_ATTEND_MIN) {
						someone_under_aff = true;
					}
				}
				if (!mtn_visit && someone_under_aff) {
					a.push({'desc':"Equip hoe, Clear field or Plant Grass"});
					if (flags['berry_farm'] == 0) {
						a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
					}
					a = mtn_visit_sum2(a, d, g, is_sunny);
					mtn_visit = true;
				}

				// Milk Cows
				if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
					a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0)});
					if (flags['cows_outside'] == 0) {
						a.push({'desc':"Put Cows Outside", 'cid':'f_cows_outside', 'val':1,'sr':true});
					}
					if (is_sunny == 1) {
						//a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
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
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}
			} // End of if (!festival)
			
			if (mtn_visit) {
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
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

			// Bar for Karen
			if (propose_at_bar) {
				a.push({'desc':"Propose at Bar", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, (next_sunday(d + 1) - d + 1)],
						'iid':karen_id, 'imp':true, 't3':"Buy Blue Feather"});
				if (aff[cliff_id] <= 142) {
					a[a.length - 1]['t2'] = "Propose in Mtns";
				}
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}
			}

			// Feed Dog
			a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false, 'red':(aff[dog_id] > 250)});
		} // End of if (!typhoon)
	}
	
	// Brushing not required
	if (aff[horse_id] >= (250 - (208 - d)) && horse_action_ids.length > 0) {
		a[horse_action_ids[horse_action_ids.length - 1]]['sel'] = false;
	}
	return a;
}

function mtn_visit_sum2(a, d, g, is_sunny = 1) {
	var dow = get_dow(d, true);
	var tmp_s = [];
	var tmp_a = [];
	
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');

	for (var i = 0; i < a.length; i++) {
		tmp_s.push(a[i]);
	}

	// BASIL
	if (["FRI", "SAT"].includes(dow) && is_sunny == 1) {
		tmp_a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3, 
					'sel':(aff[basil_id] < ((flags['berry_mine'] == 1) ? _PHOTO_MIN : _BASIL_BERRY_MIN)),
					'red':(aff[basil_id] >= ((flags['berry_mine'] == 1) ? _PHOTO_MIN : _BASIL_BERRY_MIN))
		});
		tmp_a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(a[a.length - 1]['sel'])});
	}

	// CLIFF
	if (route_id == 0) {
		if (is_sunny == 1) {
			if (["FRI", "SAT"].includes(dow)) {
				tmp_a.push({'desc':"Talk (Fish Tent)", 'cid':cliff_id, 'val':2,
							'sel':(aff[cliff_id] < (160 - ((d <= 174) ? 8 : 0))),
							'red':(aff[cliff_id] >= (160 - ((d <= 174) ? 8 : 0)))
				});
			} else if (["THURS", "SUN"].includes(dow)) {
				tmp_a.push({'desc':("Talk (" + ((dow == "THURS") ? "By Cave)" : "Carp House)")), 'cid':cliff_id, 'val':2, 'sel':false,
							'red':(aff[cliff_id] >= (160 - ((d <= 174) ? 8 : 0)))
				});
			}
		} else {
			tmp_a.push({'desc':"Talk (In Carp House 50%)", 'cid':cliff_id, 'val':2,
						'sel':(aff[cliff_id] < (160 - ((d <= 174) ? 8 : 0))),
						'red':(aff[cliff_id] >= (160 - ((d <= 174) ? 8 : 0)))
			});
		}
		if (tmp_a.length > 0 && tmp_a[tmp_a.length - 1]['cid'] == cliff_id) {
			tmp_a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':"Egg", 'sr':true, 'sel':(tmp_a[tmp_a.length - 1]['sel'])});
			tmp_a.push({'desc':"Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
		}
	}

	return ((tmp_a.length > 0) ? tmp_s.concat([{'desc':"ed, wal, flower"}].concat(tmp_a)) : tmp_s);
}
