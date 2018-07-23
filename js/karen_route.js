function get_actions_karen (d = 3, g = 300, is_sunny = 1) {
	//Karen marriage

	var a = [];
	var karen_id = get_npc_id("karen");

	if (d == 3) {
		// Spring 3
		a.push({'desc':"Greet the Mayor", 'cid':get_npc_id("mayor")});
	}

	if (d == 90) {
		// Fall 30
		a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1});
	}

	if (d == 95) {
		// Winter 5
		if (flags['borrow_cows'] > 0) {
			a.push({'desc':"1000G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1]});
		}
	}

	if (d >= 102 && d <= 106) {
		// Winter 12 - 16
		// THURS - FRI - SAT - SUN - MON
		if (aff[karen_id] < 220 && is_sunny) {
			a.push({'desc':"Dog to Crossroads"});
		}
		a.push({'desc':"Hot Springs", 'cid':["v_gold", "v_springs_days_worked"], 'val':[1000, 1]});
		if (is_sunny && aff[karen_id] < 220 && ["TUES", "WED", "FRI", "SAT"].includes(get_day_of_week(vars['day'], true))) {
			a.push({'desc':"Dog Karen", 'cid':karen_id, 'val':221});
			a.push({'desc':"25% Beach, 25% Carpenter House"});
		}
	}

	if (d == 109) {
		// Winter 19, Dog Race
		a = betting_table(a);
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
	}

	if (d > 109 && d < 119) {
		if (flags['kitchen'] < 1 && get_day_of_week(vars['day'], true) != "TUES") {
			a.push({'desc':'Buy Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)]});
		}
		if (is_sunny && aff[karen_id] < 220 && ["TUES", "WED", "FRI", "SAT"].includes(get_day_of_week(vars['day'], true))) {
			a.push({'desc':"Dog Karen", 'cid':karen_id, 'val':220});
			a.push({'desc':"25% Beach, 25% Carpenter House"});
		}
		if (flags['kitchen'] >= 1 && flags['kitchen'] <= 2 && is_sunny && aff[karen_id] >= 220 && vars['gold'] >= 980 &&
			flags['propose'] == 0 && ["TUES", "THURS", "FRI"].includes(get_day_of_week(vars['day'], true))) {
				a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-980, 1]});
				a.push({'desc':"Propose", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, 1]});
		}
	}

	if (d >= 119) {
		// Winter 29, SUN
		a.push({'desc':((flags['propose'] == 1) ? "Married!" : "Reset")});
	}

	return a;
}