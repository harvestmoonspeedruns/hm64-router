function get_actions_all_recipes (d = 3, g = 300, is_sunny = 1) {  
	var a = [];
	var dow = get_day_of_week(d, true);

	var cliff_id = get_npc_id('cliff');
	var grey_id = get_npc_id('grey');

	if (d == 3) {
		a.push({'desc':"Meet the Mayor", 'iid':get_npc_id('mayor')});
		a.push({'desc':"ed, ber, flower"});
		a.push({'desc':"Get Fishing Rod", 'cid':'f_fishing_rod', 'val':1, 'iid':get_npc_id('fisherman')});
	} else if (d == 18) {
		a.push({'desc':"Feed Cliff", 'cid':cliff_id, 'val':5});
	} else if (d > 30 && d < 61 && !is_festival(d) && ["WED", "THURS"].includes(dow)) {
		if (dow == "WED" && (aff[cliff_id] < 31 || aff[grey_id] < 37)) {
			a.push({'desc':"ed, flow, walnut"});
			if (aff[cliff_id] < 31) {
				// Cliff intro gives +4 to Grey

			}
		}
		if (flags['recipe_ellen'] == 0) {
			a.push({'desc':"Walnut", 'cid':'f_recipe_ellen', 'val':1, 'iid':get_npc_id('ellen')});
		}
	}
	return a;
}
