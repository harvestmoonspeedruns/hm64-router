function get_actions_popuri (d = 3, g = 300, is_sunny = 1) {
	//Popuri marriage

	var a = [];
	var rick_id = get_npc_id("rick");
	var popuri_id = get_npc_id("popuri");

	if (d == 3) {
		// Spring 3
		a.push({'desc':"Greet the Mayor"});
	}
	
	if (d % 120 == 23) {
		// Spring 23, Flower Festival
		a.push({'desc':"Flower Festival (Town Square)"})
		a.push({'desc':"Talk", 'cid':popuri_id, 'val':2});
		a.push({'desc':"Dance", 'cid':popuri_id, 'val':10, 'sr':true});
	}

	if (d == 72) {
		// Harvest Festival (Fall 12)

		a.push({'desc':"Harvest Festival (Town Square)"})
		a.push({'desc':"Talk", 'cid':popuri_id, 'val':2});
		a.push({'desc':"Dance", 'cid':popuri_id, 'val':10, 'sr':true});
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
		a.push({'desc':"Hot Springs", 'cid':["v_gold", "v_springs_days_worked"], 'val':[1000, 1]});
	}

	if (d == 109) {
		// Winter 19, Dog Race
		a = betting_table(a);
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
	}

	if (d > 3 && d < 61 && !is_festival(d) && aff[popuri_id] < 220 &&
		["MON", "TUES", "THURS"].includes(get_day_of_week(vars['day'], true))) {

		if (is_sunny == 1) {
			if (aff[rick_id] < 10) {
				a.push({'desc':"Equip hoe"});
				a.push({'desc':"Clear 9x9 space"});
				a.push({'desc':"gather edible, flower"});
			}
			if (aff[rick_id] >= 10 && aff[rick_id] < 16) {
				a.push({'desc':"Equip Watering can"});
				a.push({'desc':"Blue Mist Photo", 'cid':popuri_id, 'val':10});
				a.push({'desc':"Fill pockets with flowers & gifts"});
			}
			if (aff[rick_id] >= 16 && aff[rick_id] < 22) {
				a.push({'desc':"Equip hoe"});
				a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1});
				a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
				a.push({'desc':"gather edible, flower"});
			}
			if (aff[rick_id] >= 22) {
				if (!flags['old_mus_box']) {
					a.push({'desc':"Equip hoe"});
					a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
				}
			}

			if (!flags['moondrops_bought']) {
				a.push({'desc':"Buy Moondrop Seeds", 'cid':'f_moondrops_bought', 'val':1});
			}

			// POPURI
			if (aff[popuri_id] == 0) {
				a.push({'desc':"Meet", 'cid':popuri_id, 'val':4});
			}
			a.push({'desc':"Talk", 'cid':popuri_id, 'val':1, 'sr':(aff[popuri_id] == 0), 'sel':(aff[rick_id] >= (_RICK_FIX_MIN - 6))});
			if (aff[rick_id] >= (_RICK_FIX_MIN - 6)) {
				a.push({'desc':"MusBox", 'cid':popuri_id, 'val':_MUS_BOX_AFF, 'sr':true});
			}
			a.push({'desc':"Flower", 'cid':popuri_id, 'val':3, 'sr':true});
			a.push({'desc':"Gift (Other)", 'cid':popuri_id, 'val':1, 'sr':true, 'sel':false});

			// RICK
			if (aff[rick_id] == 0) {
				a.push({'desc':"Meet", 'cid':rick_id, 'val':4});
			}
			a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0)});
			if (aff[rick_id] < (_RICK_FIX_MIN - 3)) {
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true});
			} else {
				a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true})
			}
			
			if (!flags['moondrops_planted']) {
				a.push({'desc':"Equip Moondrop seeds"});
				a.push({'desc':"Plant Moondrop seeds", 'cid':'f_moondrops_planted', 'val':1});
			}
		}
	}
	
	if (d > 109 && d < 119) {
		if (flags['kitchen'] < 1 && get_day_of_week(vars['day'], true) != "TUES") {
			a.push({'desc':'Buy Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)]});
		}
		if (flags['kitchen'] >= 1 && flags['kitchen'] <= 2 && is_sunny == 1 && aff[popuri_id] >= 220 && vars['gold'] >= 980 &&
			flags['propose'] == 0 && ["MON", "TUES", "THURS"].includes(get_day_of_week(vars['day'], true))) {
				a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-980, 1]});
				a.push({'desc':"Propose", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, 1]});
		}
	}

	if (d >= 119) {
		// Winter 29, SUN
		a.push({'desc':((flags['propose'] == 1) ? "Married!" : "Reset")});
	}
	
	return (reset) ? [{'desc':"RESET"}] : a;
}