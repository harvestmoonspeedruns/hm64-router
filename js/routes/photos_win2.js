function actions_photos_win_y2(a = [], d = 3, g = 300, is_sunny = 1) {
	var dow = get_dow(d, true);
	var dog_id = get_npc_id('dog');
	var cow_id = get_npc_id('cow');
	var cliff_id = get_npc_id('cliff');
	var karen_id = get_npc_id('karen');

	// TODO: Winter 27 = Karens Birthday?

	// Married Affection
	if (flags['photo_married'] == 1) {
		a.push({'desc':"Talk", 'val':1, 'cid':karen_id});
		a.push({'desc':"Gift", 'val':1, 'cid':karen_id, 'sr':true, 'sel':(aff[karen_id] < 250)});
	}

	// Dog Affection
	if (d != 229 || flags['dog_entered'] == 0) {
		if (flags['dog_inside'] == 1) {
			if (flags['photo_dograce'] == 1) {
				a.push({'desc':"Whistle", 'cid':dog_id, 'val':1, 'sel':(aff[dog_id] < 210)});
				a.push({'desc':"Pick Up", 'cid':dog_id, 'val':1, 'sel':(aff[dog_id] < 210), 'sr':true});
			} else {
				a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
			}
		} else {
			a.push({'desc':"Bring Dog Inside", 'cid':['f_dog_inside', dog_id], 'val':[1, 1]});
			a.push({'desc':"Whistle", 'val':1, 'sr':true});
		}
		if (is_sunny == 1) {
			a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
		}
	}

	// Milk Cows
	if (vars['cows'] > 0 || parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
		if (flags['cows_outside'] == 0) {
			if (is_sunny == 1) {
				a.push({'desc':('Milk Cow' + ((vars['cows'] > 1) ? 's' : '')), 'iid':cow_id, 'imp':(flags['cows_outside'] == 0)});
				a.push({'desc':"Put Cows Outside", 'cid':'f_cows_outside', 'val':1, 'sr':true});
			} else {
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
	
	// CLIFF
	if (["MON", "FRI", "SAT"].includes(dow)) {
		a.push({'desc':("Talk (" + ((dow == "MON") ? "Hot Springs)" : "Fish Tent 50%)")), 'cid':cliff_id, 'val':2, 'sel':false, 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
		a.push({'desc':"Gift ", 'cid':cliff_id, 'val':4, 't2':"Egg", 'sr':true, 'sel':false});
		a.push({'desc':"Egg", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift ", 'sr':true});
	}

	// Extensions
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

			// CLIFF
			a.push({'desc':("Talk (" + ((is_sunny == 0) ? "In Carp House)" : ((["FRI", "SAT"].includes(dow)) ? "Fish Tent 50%)" : "Carp Screen)"))),
					'sel':false, 'cid':cliff_id, 'val':2
			});
			a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':false});
			a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':false});
		}
	}
	
	// RICK
	a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN), 'red':(aff[rick_id] >= _PARTY_ATTEND_MIN && flags['blue_feather'] == 1)});
	a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(aff[rick_id] < _PARTY_ATTEND_MIN)});

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

	if (d == 229) {
		// Dog Race, 500 LUM (Win 19)
		a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':get_npc_id('mayor'), 'imp':true});
		if (flags['dog_entered'] == 1) { a.push({'desc':"Win Dog Race", 'cid':'f_photo_dograce', 'val':1, 'imp':true, 'iid':dog_id}); }
		//a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});
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