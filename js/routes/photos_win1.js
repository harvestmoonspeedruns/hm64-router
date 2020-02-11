function actions_photos_win_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var chicken_id = get_npc_id('chicken');
	var cow_id = get_npc_id('cow');
	var dog_id = get_npc_id('dog');
	var horse_id = get_npc_id('horse');
	var karen_id = get_npc_id('karen');
	var maria_id = get_npc_id('maria');
	var mas_carp_id = get_npc_id('mas_carpenter');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var wife_id = get_npc_id((route_id == 0) ? 'karen' : 'elli');

	var dow = get_dow(d, true);
	var horse_action_ids = [];
	
	if (d == 91) {
		// Ridiculously long "borrowing cows" cutscene
		a.push({'desc':"DONT GO OUTSIDE TODAY", 'imp':true});
	}
	if (d > 94 && aff[maria_id] >= _DREAM_EVENT_MIN && d > 94) {
		// Save the dream event for her summer photo
		a.push({'desc':"DONT ENTER LIBRARY", 'imp':true});
	}

	if (flags['cow_steal_glitch'] > 0 && d == 112) {
		a.push({'desc':"Cows mature today", 'iid':cow_id});
	}

	if (flags['fishing_rod_stored'] == 0) {
		a.push({'desc':"Fishing rod to toolbox", 'cid':'f_fishing_rod_stored', 'val':1, 'sr':false, 'sel':false});
	}

	if (d == 94 && flags['dream_maria'] == 0 && aff[maria_id] >= (_DREAM_EVENT_MIN - 3 - ((flags['new_mus_box'] == 1) ? _MUS_BOX_AFF : 0))) {
		// Cow Stealing
		a.push({'desc':"Cow Stealing Glitch", 'imp':true});
	}

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':wife_id});
		a.push({'desc':"Gift", 'val':1, 'cid':wife_id, 'sr':true, 'sel':false});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1 && (d != 109 || flags['dog_entered'] == 0)) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
	} else if (flags['dog_inside'] == 0) {
		a.push({'desc':"Whistle", 'cid':dog_id, 'val':1});
		a.push({'desc':"Pick Up", 'cid':dog_id, 'val':1, 'sel':(![91, 117].includes(d)), 'sr':true});
		a.push({'desc':"Bring Inside", 'cid':'f_dog_inside', 'sel':(![91, 117].includes(d)), 'val':1, 'sr':true});
	}
	if (is_sunny == 1) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false,
				'sr':(flags['dog_inside'] == 0 || (flags['dog_inside'] == 1 && (d != 109 || flags['dog_entered'] == 0)))
		});
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

	// Stolen Cows fully grown on Win 22
	// Hopefully sick from starvation on Win 23
	if (flags['cow_steal_glitch'] > 0 && d >= 112) {
		if (vars['cow_status'].replace(/[Mm\d]/g,"").length != 0) {
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}
		if ([112, 113].includes(d)) {
			a.push({'desc':"Ignore Kent on the Farm", 'cid':get_npc_id('kent'), 'red':true});
		}
		a = cows(a, is_sunny);
	}

	if (vars['new_chicken_days'].length == 0 && flags['new_chick'] == 0) {
		a.push({'desc':"Incubate Last Egg", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'sel':false, 'imp':true, 'iid':chicken_id});
	}

	if (is_festival(d)) {
		if (d == 109) {
			// Dog Race, 500 LUM (Win 19)	
			a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':get_npc_id('mayor'), 'imp':true});
			if (flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'sel':false, 'sr':true}); }
			a = betting_table(a);
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}
	} else if (d > 91 && aff[ann_id] >= _PHOTO_EVENT_AFF && is_sunny == 1 && flags['photo_ann'] == 0) {
		// Anns photo
		// Manna cutscene & Cliff leaving scene have priority over before Ann arriving for photo
		a.push({'desc':"Photo", 'cid':[ann_id, 'f_photo_ann', 'f_dontsave'], 'val':[_PHOTO_EVENT_AFF, 1, 1], 'imp':true});
		for (var z = 0; z < horse_action_ids.length; z++) {
			a[horse_action_ids[z]]['sel'] = true;
		}
	} else {
		// Not festival or Anns Photo
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
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'imp':true, 'sel':(d == 87)});
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
		}
		// ANN SICK
		if (dow == "SUN" && is_sunny == 0 && flags['sick_ann'] == 0) {
			a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1],
					'sel':(aff[ann_id] < _PHOTO_EVENT_AFF), 'sr':(aff[ann_id] < _PHOTO_EVENT_AFF && flags['photo_ann'] == 0)});
		}

		// RICK
		// "Gift    " <- 4 spaces
		// "Talk    " <- 4 spaces
		if (is_sunny == 1 && !["WED", "SUN"].includes(dow) && d < 95 && flags['new_mus_box'] == 0 && flags['old_mus_box'] == 1) {
			a.push({'desc':"Need a Fixed Musbox for Cow Stealing", 'imp':true});
			a.push({'desc':"Talk    ", 'cid':rick_id, 'val':3, 'sel':false});
			a.push({'desc':"Gift    ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
			a.push({'desc':"Rick Fix", 'sr':true, 't3':"Talk    ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 'sel':false});
			if (vars['gold'] >= 600 && flags['horse_brush'] == 0) {
				a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true});
			}

			// ANN in Ricks Shop
			// "Gift  " <- 2 spaces
			if (dow == "THURS") {
				a.push({'desc':"Talk (Ricks Shop)", 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':false, 'red':(aff[ann_id] >= _PHOTO_MIN)});
				a.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':"Talk (Ricks Shop)", 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato", 'sel':false});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 't2':"Gift  ", 'sel':false});
			}
		}

		if (d > 109) { // After Dog Race
			if (((vars['cows'] + (vars['new_cow_days'].length / 3)) < (3 + ((flags['cow_steal_glitch'] > 0) ? 1 : 0))) && vars['gold'] >= (6000 + 1800 - (1800 * flags['milker']))) {
				// Buy Cows
				// Win 20, 21, 22
				// Fri, Sat, Sun
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}

				a.push({'desc':"Equip axe, chop 3 stumps", 'iid':get_npc_id('doug')});
				a.push({'desc':('Buy Cow (#' + ((vars['new_cow_days'].length + 3) / 3) + ')'), 'sr':true,
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
			}
			if (dow != "TUES") {
				var tmp_getext = false;
				if (flags['kitchen'] == 0) {
					// Kitchen
					a.push({'desc':"Buy a Kitchen (5000 G)", 'iid':mas_carp_id,
							'cid':['v_gold', 'v_lumber', 'f_kitchen'],
							'val':[-5000, -450, _BUILD_DAYS + 1]
					});
					tmp_getext = true;
				} else if (flags['kitchen'] == 1 && flags['babybed'] == 0 && vars['gold'] >= 1000) {
					// Babybed
					a.push({'desc':"Buy a Baby Bed (1000 G)", 'iid':mas_carp_id,
							'cid':['v_gold', 'v_lumber', 'f_babybed'],
							'val':[-1000, -150, _BUILD_DAYS - 1]
					});
					tmp_getext = true;
			} else if (flags['kitchen'] == 1 && flags['babybed'] == 1 && flags['bathroom'] == 0 && vars['gold'] >= 3000 && d != 117) {
					// Mayor stops by farm on the day before the Spirit Fest
					// Bathroom
					a.push({'desc':"Buy a Bathroom (3000 G)", 'iid':mas_carp_id,
							'cid':['v_gold', 'v_lumber', 'f_bathroom'],
							'val':[-3000, -300, _BUILD_DAYS + 1]
					});
					tmp_getext = true;
				}
				if (tmp_getext) {
					a.push({'desc':"(Opens 35 secs after leaving house)", 'sr':true});
					if (d != 117) {
						for (var z = 0; z < horse_action_ids.length; z++) {
							a[horse_action_ids[z]]['sel'] = true;
						}
					}
					if (aff[mas_carp_id] <= 25) {
						a.push({'desc':"Meet", 'cid':mas_carp_id, 'val':4, 'sr':false, 'sel':false, 'red':true});
					}
					a.push({'desc':"Talk", 'cid':mas_carp_id, 'val':3, 'sr':true, 'sel':false});
					a.push({'desc':"Gift", 'cid':mas_carp_id, 'val':3, 'sr':true, 'sel':false});
				}
			}

			if (!["WED", "SUN"].includes(dow) && is_sunny == 1) {
				// MAYOR
				a.push({'desc':"Talk (Village 50%)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});

				// RICK
				if (dow != "SAT") {
					if (flags['milker'] == 0) {
						a.push({'desc':"Buy a Milker", 'cid':['v_gold', 'f_milker'], 'val':[-1800, 1], 'iid':rick_id,
								'sel':(vars['new_cow_days'].length > 0), 'imp':(flags['cow_steal_glitch'] == 1 && vars['day'] == 113)
						});
					}
				}
				a.push({
					'desc':"Talk", 'cid':rick_id, 'val':3,
					'sel':(dow != "SAT" && flags['milker'] == 0 && aff[rick_id] < _PARTY_ATTEND_MIN),
					'sr':(dow != "SAT" && flags['milker'] == 0),
					'red':(aff[rick_id] >= _PARTY_ATTEND_MIN)
				});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
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
			a.push({'desc':"Hot Springs Work", 'iid':mas_carp_id,
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
		} else if (d > 97 && (flags['cow_steal_glitch'] == 0 || d != 112)) { // Mine isnt open until Winter 8;
			// Mine Visit?
			var tmp_gold_left = vars['gold'];
			tmp_gold_left -= ((flags['kitchen'] == 0) ? 5000 : 0); // Kitchen
			tmp_gold_left -= ((flags['bathroom'] == 0) ? 3000 : 0); // Bathroom
			tmp_gold_left -= ((flags['babybed'] == 0) ? 1000 : 0); // Baby Bed
			tmp_gold_left -= (((3 * flags['cow_steal_glitch']) - (vars['cows'] + (vars['new_cow_days'].length / 3))) * 6000); // Cows
			tmp_gold_left -= (1500 + 980); // 3 grass, blue feather
			tmp_gold_left -= ((1 - flags['milker']) * 1800);
			if (tmp_gold_left < 0) {
				for (var z = 0; z < horse_action_ids.length; z++) {
					a[horse_action_ids[z]]['sel'] = true;
				}
				if (flags['berry_pond'] == 0 && flags['golden_hammer'] == 1) {
					a.push({'desc':"Equip hammer", 'iid':get_npc_id('kappa'), 'imp':true});
					a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sr':true});
				}
				a.push({'desc':"Equip hoe, Visit Mine", 'iid':get_npc_id('carpenter_top'), 'imp':true});
				a.push({'desc':"Dig a Berry", 'sr':true, 'sel':false, 'val':1, 'cid':'f_berry_mine'});
			}
		}

		if (d == 94 && flags['dream_maria'] == 0 && aff[maria_id] >= (_DREAM_EVENT_MIN - 3 - ((flags['new_mus_box'] == 1) ? _MUS_BOX_AFF : 0))) {
			// Steal the Cows
			for (var z = 0; z < horse_action_ids.length; z++) {
				a[horse_action_ids[z]]['sel'] = true;
			}
			a.push({'desc':"Talk (CHURCH / HOUSE)", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sel':(flags['new_mus_box'] == 0), 'imp':true});
			a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':(flags['new_mus_box'] == 1), 't2':"Talk (CHURCH / HOUSE)"});
			a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});
			a.push({'desc':"Karen Dream Warp (Vineyard)", 'cid':[karen_id, 'f_dream_karen'], 'val':[_DREAM_EVENT_AFF, 1]});
			a.push({'desc':"Hammer Rocks / Dock Fish Until Morning"});
			a.push({'desc':"Cow Steal Glitch", cid:'f_cow_steal_glitch', 'val':5, 'imp':true});
		} else if (d < 94) {
			// Before Cow Stealing
			if (aff[maria_id] >= (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
				a.push({'desc':"NO MUSBOX FOR MARIA", 'iid':maria_id, 'imp':true});
			}
			a.push({'desc':"Talk", 'cid':maria_id, 'val':1, 'sel':false, 'red':(aff[maria_id] == (_DREAM_EVENT_MIN - 1))});
			if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
				a[a.length - 1]['t2'] = "MusBox";
				a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
						'sel':false, 't2':a[a.length - 1]['desc']
				});
			}
			if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - 2)) {
				a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true, 'sel':false});
			}
		}
	}
	a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});
	return a;
}