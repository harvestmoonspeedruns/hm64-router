function get_actions_karen (d = 3, g = 300, is_sunny = 1) {
	//Karen marriage
	var a = [];
	var cliff_id = get_npc_id('cliff');
	var doug_id = get_npc_id('doug');
	var karen_id = get_npc_id("karen");

	if (d == 3) {
		// Spring 3
		a.push({'desc':"Greet the Mayor", 'cid':get_npc_id("mayor")});
	}

	if (route_id == 22) {
		// Baby Photo
		if ((d % 120) == 54) {
			a.push({'desc':"Go to the Beach", 'imp':true});
			a.push({'desc':"Win Swim Festival", 'iid':mayor_id, 'imp':true,
					'cid':["f_photo_swimming", ((d == 54) ? "f_berry_swimming" : "v_lumber"), get_npc_id('jeff'), get_npc_id('grey'), get_npc_id('harris'), get_npc_id('kai'), cliff_id, 'v_happiness', 'f_dontsave'],
					'val':[1, ((d == 54) ? 1 : 150), 8, 8, 8, 8, 8, 5, 1]
			});
		}
		if (d > 24 && flags['berry_swimming'] == 0) { reset = true; }
		if (d > (24 + 120) && vars['lumber'] < 150 && flags['babybed'] == 0) { reset = true; }
	}

	if (d == 90) {
		// Fall 30
		a.push({'desc':"Enter / Exit House to Clear Cliff", 'iid':cliff_id});
		a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1, 'iid':doug_id, 'imp':true});
	}

	if (d == 95) {
		// Winter 5
		if (flags['borrow_cows'] > 0) {
			a.push({'desc':"Enter / Exit House to Clear Cliff", 'iid':cliff_id});
			a.push({'desc':"1000 G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1], 'iid':doug_id, 'imp':true});
		}
	}

	if (d >= 102 && d <= 106) {
		// Winter 12 - 16
		// THURS - FRI - SAT - SUN - MON
		if (aff[karen_id] < 220) {
			a.push({'desc':"Dog to Crossroads"});
		}
		a.push({'desc':"Hot Springs", 'cid':["v_gold", "v_springs_days_worked"], 'val':[1000, 1], 'imp':true, 'iid':get_npc_id('mas_carpenter')});
		if (is_sunny == 1 && aff[karen_id] < 220 && ["TUES", "WED", "FRI", "SAT"].includes(get_day_of_week(vars['day'], true))) {
			a.push({'desc':"Dog to 220", 'cid':karen_id, 'val':220});
			a.push({'desc':"25% Beach, 25% Carpenter House (10AM - 5PM)"});
		}
	}

	if (d == 109) {
		// Winter 19, Dog Race
		a = betting_table(a);
		a.push({'desc':"Buy 500 Lumber", 'cid':"v_lumber", 'val':500});
	}

	if (d > 109 && d < 119) {
		if (flags['kitchen'] == 2) {
			a.push({'desc':'Carpenters finished with Kitchen'});
		}
		if (flags['kitchen'] < 1 && get_day_of_week(vars['day'], true) != "TUES") {
			a.push({'desc':'Buy Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)], 'imp':true, 'iid':get_npc_id('mas_carpenter')});
			if (is_sunny == 1 && aff[karen_id] < 220) {
				a.push({'desc':"Dog to 220", 'cid':karen_id, 'val':220});
				a.push({'desc':"25% Beach, 25% Carpenter House (10AM - 5PM)", 'imp':true});
			}
		}
		if (is_sunny == 1 && aff[karen_id] < 220 && ["MON", "THURS"].includes(get_day_of_week(vars['day'], true))) {
			a.push({'desc':"Dog to 220", 'cid':karen_id, 'val':220});
			a.push({'desc':"Karen at Vineyard 100%"});
			a.push({'desc':"Enter / Exit Wine Cellar to clear Ankle Event", 'cid':'f_ankle_karen', 'val':1});
		}
		if (flags['kitchen'] >= 1 && flags['kitchen'] <= 2 && is_sunny == 1 && aff[karen_id] >= 220 && vars['gold'] >= _PRICE_BLUE_FEATHER && flags['propose'] == 0) {
			if (["TUES", "FRI"].includes(get_day_of_week(vars['day'], true))) {
				a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-1 * _PRICE_BLUE_FEATHER, 1], 'iid':get_npc_id('rick'), 'imp':true});
				a.push({'desc':"Propose", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, 1], 'iid':karen_id, 'imp':true});
				a.push({'desc':"25% Beach, 25% Carpenter House (10AM - 5PM)", 'imp':true});
			}
			if (["MON", "THURS"].includes(get_day_of_week(vars['day'], true)) && flags['ankle_karen'] > 0) {
				a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-1 * _PRICE_BLUE_FEATHER, 1]});
				a.push({'desc':"Propose (Karen at Vineyard 100%)", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, 1]});
			}
		}
	}

	if (d == 119) {
		// Winter 29, SUN
		a.push({'desc':"Wedding Day", 'iid':karen_id, 'cid':['f_photo_married', 'f_propose'], 'val':[1, -1], 'imp':true});
		a.push({'desc':"Continue for Baby Photo"});
	}
	return a;
}