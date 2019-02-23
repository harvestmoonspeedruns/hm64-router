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
	} else if (d == 54) {
		a.push({'desc':"Win Swim Fest", 'iid':get_npc_id('mayor'), 'cid':[grey_id, cliff_id], 'val':[8, 8]});
	} else if (d > 30 && d < 61 && !is_festival(d) && ["WED", "THURS"].includes(dow) && is_sunny == 1) {
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
		if (flags['recipe_ellen'] == 0) {
			a.push({'desc':"Walnut", 'cid':'f_recipe_ellen', 'val':1, 'iid':get_npc_id('ellen')});
		}
	}
	return a;
}
