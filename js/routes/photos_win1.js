function actions_photos_win_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var cliff_id = get_npc_id('cliff');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);

	if (d > 109) { flags['dog_entered'] = 0; }

	// Dog Affection
	if (flags['dog_inside'] == 1 && (d != 109 || flags['dog_entered'] == 0)) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	}

	// Horse Affection
	var horse_id = get_npc_id('horse');
	if (flags['horse_brush'] == 1) {
		a.push({'desc':"Equip brush", 'iid':horse_id});
	}
	a.push({'desc':"Whistle / Ride Horse", 'val':2, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1)});
	if (flags['horse_brush'] == 1) {
		a.push({'desc':"Brush Horse", 'val':2, 'cid':horse_id, 'sr':true});
	}

	if (is_festival(d)) {
		if (d == 109) {
			// Dog Race, 500 LUM (Win 19)	
			a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500, 'iid':get_npc_id('mayor'), 'imp':true});
			if (flags['dog_entered'] == 1) {
				a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'sel':false, 'iid':get_npc_id('dog')});
			}
			a = betting_table(a);
		}
	} else if (aff[ann_id] >= _PHOTO_EVENT_AFF && is_sunny == 1 && flags['photo_ann'] == 0) {
		// Anns photo
		a.push({'desc':"Photo", 'cid':[ann_id, 'f_photo_ann', 'f_dontsave'], 'val':[_PHOTO_EVENT_AFF, 1, 1], 'imp':true});	
	} else {
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
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'imp':true});
			if (["TUES", "WED"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN) {
				tmp_act.push({'desc':("Talk (" + ((dow == "WED") ? "Ranch) " : "Beach) ")), 'cid':cliff_id, 'val':2});
				tmp_act.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':false});
				tmp_act.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 'sel':true, 't2':a[a.length - 1]['desc'], 'sr':true});
			}
		}

		// 102, 103, 104, 105, 106
		//THURS,FRI, SAT, SUN, MON
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
				a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
				if (flags['golden_hammer'] == 0) {
					a[a.length - 1]['t3'] = "Golden Hammer";
					a.push({'desc':"Equip hammer, Clear rocks on farm"});
					a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sr':true, 't0':"Pond Rock Berry"});
				}
			}

			// CLIFF
			if (aff[cliff_id] < _PARTY_ATTEND_MIN) {
				var cliff_loc = "Talk";
				if (dow == "MON") { cliff_loc += " (Hot Springs)"; }
				if (dow == "FRI" || dow == "SAT") { cliff_loc += " (Fish Tent 50%)"; }
				if (dow == "SUN") { cliff_loc += " (Carp House 50%)"; }
				if (dow == "THURS" || is_sunny == 0) { cliff_loc = "Talk (Carp House)"; }
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
		}
		
		if (d == 108) {
			a.push({'desc':"Enter Dog", 'cid':'f_dog_entered', 'val':1, 'iid':get_npc_id('doug'), 'sel':(vars['medals'] >= 1000)});
		}

		// Mine until 16500 G:
		// 18000 (3 cows) + 1800 (milker) + 1500 (3 grass) ~= 16500
		if (vars['gold'] < 16500) {
			if (d > 7 && d < 102) {
				a.push({'desc':"Equip hoe, Visit Mine", 'iid':get_npc_id('carpenter_top')});
			} else if (flags['berry_pond'] == 0){
				// Get Frozen Pond Berry for more time in mine later
				if (flags['golden_hammer'] == 0) {
					a.push({'desc':"Equip hammer, Clear rocks on farm"});
					a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sr':true, 't0':"Pond Rock Berry"});
				}
				a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
				if (flags['golden_hammer'] == 0) { a[a.length - 1]['t3'] = "Golden Hammer"; }
			}
		}

		// After Dog Race
		if (d > 109) {
			// Buy Cows
			if (vars['cows'] < 3 && vars['gold'] >= 6000 && flags['cow3'] == 0) {
				var cow_inc = 1;
				if (flags['cow1'] > 0) { cow_inc++; }
				if (flags['cow2'] > 0) { cow_inc++; }
				a.push({'desc':"Buy Cow", 'iid':get_npc_id('doug'),
						'cid':['v_cows', 'v_gold', ('f_cow' + cow_inc)],
						'val':[1, 6000, _COW_GROW_SLEEPS]
				});
			}

			// Buy a milker
			if (flags['milker'] == 0 && (vars['gold'] >= (1800 + 6000 * flags['cow3']))) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3});
				if (flags['old_mus_box'] == 1) {
					a.push({'desc':"Rick Fix", 'sr':true, 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
				}
				a.push({'desc':"Buy Milker", 'cid':['f_milker', 'v_gold'], 'val':[1, -1800], 'iid':rick_id, 'sr':true});	
			}
		}
	}
	return a;
}