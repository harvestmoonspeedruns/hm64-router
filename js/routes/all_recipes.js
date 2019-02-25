function get_actions_all_recipes (d = 3, g = 300, is_sunny = 1) {  
	var a = [];
	var dow = get_day_of_week(d, true);
	var reset_reason = "";

	var cliff_id = get_npc_id('cliff');
	var grey_id = get_npc_id('grey');
	var mayor_id = get_npc_id('mayor');

	// SINGLE ACTIVITY DAYS
	if (d == 3) {
		a.push({'desc':"Meet the Mayor", 'iid':mayor_id});
		a.push({'desc':"Grab Edible", 'imp':true});
		a.push({'desc':"Get Fishing Rod", 'cid':'f_fishing_rod', 'val':1, 'iid':get_npc_id('fisherman')});
	} else if (d == 18) {
		a.push({'desc':"Feed Cliff", 'cid':cliff_id, 'val':5});
	} else if (d == 54) {
		a.push({'desc':"Win Swim Fest", 'iid':mayor_id, 'cid':[grey_id, cliff_id], 'val':[8, 8]});
	} else if (d == 109) {
		// Dog Race, 1000 LUM (Win 19)	
		a.push({'desc':"Buy 1000 Lumber at Dog Race", 'cid':['v_lumber', 'v_medals'], 'val':[999, -1000], 'iid':mayor_id, 'imp':true});
		a = betting_table(a);


	// RESET CONDITIONS
	} else if (d > 90 && flags['borrow_cows'] == 0) {
		reset_reason = "Need Mannas Cows";
	} else if (d > 119 && flags['greenhouse'] != 1) {
		reset_reason = "Need Greenhouse in Winter for Strawberries";
	
	// MULTIPLE ACTIVITY DAYS
	} else {
		if (d == 90) {
			a.push({'desc':"Borrow Cows", 'imp':true, 'iid':get_npc_id('doug'), 'cid':'f_borrow_cows', 'val':1});
		}

		if (d >= 83 && d <= 87) {
			// Bridge Work
			// Fall 83, 84, 85, 86, 87
			//	    Sat Sun Mon Tue Wed
			a.push({'desc':"Bridge Work", 'val':[5, 5, 5, 1, 1000], 'iid':get_npc_id('mas carpenter'), 'imp':true,
					'cid':[get_npc_id('mas carpenter'), get_npc_id('carpenter_top'), get_npc_id('carpenter_bot'), 'v_bridge_days_worked', 'v_gold'],
			});
		}

		// Cliff and Grey
		if (d > 60 && d < 91 && !is_festival(d) && ["WED", "THURS"].includes(dow) && is_sunny == 1) {
			var npc_loc_tmp = ((dow == "WED") ? "Ranch" : "Carp House");
			if (dow == "WED" && (aff[cliff_id] < 31 || aff[grey_id] < 37)) {
				a.push({'desc':"ed, flow, walnut"});
				if (aff[cliff_id] < 31) {
					// NOTE: Cliff intro gives +4 to Grey
					if (flags['cliff_intro'] == 0) { a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id}); }
					a.push({'desc':("Talk (" + npc_loc_tmp + ")"), 'cid':cliff_id, 'val':2, 'sr':(flags['cliff_intro'] == 0)});
					a.push({'desc':"Gift ", 'cid':cliff_id, 'val':4, 'sr':true, 't2':"Egg/Milk"});
					a.push({'desc':"Egg/Milk", 'cid':cliff_id, 'val':8, 'sr':true, 'sel':(vars['chickens'] > 0), 't2':"Gift "});
				}
				if (aff[grey_id] < 37) {
					if (aff[grey_id] == 0) { a.push({'desc':"Meet", 'cid':grey_id, 'val':4}); }
					a.push({'desc':("Talk (" + npc_loc_tmp + ")"), 'cid':grey_id, 'val':2, 'sr':(aff[grey_id] == 0)});
					a.push({'desc':" Gift", 'cid':grey_id, 'val':2, 'sr':true});
				}
			}
			// Walnut Cake Recipe
			if (flags['recipe_ellen'] == 0) {
				a.push({'desc':"Walnut", 'cid':'f_recipe_ellen', 'val':1, 'iid':get_npc_id('ellen'), 'sel':(d < 61)});
			}
		}
		
		// NOTE: Mine isnt open until Winter 8;
		if (d > 97 && d < 121 && !is_festival(d)) {
			// Mine for $$
			// 5000; 30,000 = Kitchen; Greenhouse
			// 2000 = price for one of each required seed bag
			var total_needed = (30000 + 2000 + 5000 + (_PRICE_MILKER - (_PRICE_MILKER * flags['milker'])));
			total_needed -= (vars['gold'] + vars['cows'] * 6500 + (4 - vars['springs_days_worked']) * 1000);
			if (total_needed > 0) {
				a.push({'desc':"Equip hoe, Visit Mine", 'iid':get_npc_id('carpenter_top')});
				a.push({'desc':"Dig a Berry", 'sr':true, 'sel':false, 'val':1, 'cid':'f_berry_mine'});
				if (d == 112) {
					// Cows are Adult
					a.push({'desc':"Buy 7 Fodder", 'cid':'v_fodder', 'val':7, 'iid':get_npc_id('doug')});
					a.push({'desc':"Sell 1 Cow", 'cid':['v_cows', 'v_gold'], 'val':[-1, 6500], 'iid':get_npc_id('cow')});
				} else if (!["WED", "SAT", "SUN"].includes(dow) && is_sunny == 1 && flags['milker'] == 0 && vars['gold'] >= _PRICE_MILKER) {
					a.push({'desc':"Meet", 'cid':get_npc_id('rick'), 'val':4});
					a.push({'desc':"Buy a Milker", 'cid':['v_gold', 'f_milker'], 'val':[-1800, 1], 'sr':true});
				}
			}
		}

		// Fully grown cows on Winter 22
		// Milker can be bought before fully grown
		// Greenhouse must start on 26th
		// 6500 - Win 23
		// 7500 - Win 25
		// 7500 - Win 26
		// Buy Greenhouse on Win 26 (30,000 G)
	}

	if (reset_reason.length > 0) {
		a.push({'desc':"RESET", 'red':true, 'sel':false});
		a.push({'desc':reset_reason});
	}

	return a;
}
