function actions_photos_win_y2(a = [], d = 3, g = 300, is_sunny = 1) {
	var dow = get_dow(d, true);
	var cow_id = get_npc_id('cow');
	var cliff_id = get_npc_id('cliff');
	var karen_id = get_npc_id('karen');

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
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

	if (d == 228 && flags['photo_dograce'] == 0) {
		a.push({'desc':"Enter Dog", 'cid':['f_dog_entered',get_npc_id('doug')], 'val':[1, 3], 'imp':true});
	}
	
	// Sell Cows
	if (money_needed() <= 0 && vars['cows'] > 0 && dow != "THURS") {
		a.push({'desc':"Sell Cow", 'iid':get_npc_id('doug'),
				'cid':['v_cows', 'v_gold'],
				'val':[-1, ((vars['cows'] == 1 && d >= 184) ? 8500 : 7500)]
		});
	}

	// Extensions
	if (dow != "TUES" && !is_festival(d)) {
		var tmp_build_ext = false;
		// Extensions on rainy days to avoid cutscenes
		if (vars['gold'] >= 3000 && flags['bathroom'] == 0) {
			// Bathroom
			a.push({'desc':"Buy Bathroom (3000)", 'iid':get_npc_id('mas_carpenter'),
					'cid':['v_gold', 'v_lumber', 'f_bathroom'],
					'val':[-3000, -300, _BUILD_DAYS + 1]
			});
			tmp_build_ext = true;
		} else if (flags['bathroom'] == 1 && flags['stairway'] == 0 && vars['gold'] >= 2000) {
			// Stairway
			a.push({'desc':"Buy a Stairway (2000 G)", 'iid':get_npc_id('mas_carpenter'),
					'cid':['v_gold', 'v_lumber', 'f_stairway'],
					'val':[-2000, -250, _BUILD_DAYS + 1]
			});
			tmp_build_ext = true;
		}

		// CLIFF
		if (tmp_build_ext) {
			a.push({'desc':("Talk (" + ((is_sunny == 0) ? "In Carp House)" : ((["FRI", "SAT"].includes(dow)) ? "Fish Tent 50%)" : "Carp Screen)"))),
					'sel':false, 'cid':cliff_id, 'val':2
			});
			a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
			a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
		}
	}

	if (d == 229) {
		// Dog Race, 500 LUM (Win 19)
		a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':get_npc_id('mayor'), 'imp':true});
		if (flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'imp':true, 'iid':get_npc_id('dog')}); }
		//a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
		a = betting_table(a);	
	} else if (flags['berry_pond'] == 0){
		// Get Frozen Pond Berry
		if (flags['golden_hammer'] == 0) {
			a.push({'desc':"Equip hammer, Clear rocks on farm"});
			a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sr':true, 't0':"Pond Rock Berry", 'sel':false});
		}
		a.push({'desc':"Pond Rock Berry", 'cid':'f_berry_pond', 'val':1, 'sel':(flags['golden_hammer'] == 1), 'iid':get_npc_id('kappa')});
		if (flags['golden_hammer'] == 0) { a[a.length - 1]['t3'] = "Golden Hammer"; }
	}
	return a;
}