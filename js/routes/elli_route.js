function get_actions_elli (d = 3, g = 300, is_sunny = 1) {
	//Elli marriage

	var a = [];
	var skip = false;
	var elli_id = get_npc_id("elli");
	var rick_id = get_npc_id("rick");
	var dow = get_day_of_week(d, true);
	var elli_mon_loc = (get_month(d) == 1) ? "BEACH" : "MTN";
	var today_aff = 0;

	if (flags['kitchen'] == 2) { a.push({'desc':'Carpenters finished with Kitchen'}); }

	if (d == 3) {
		// Spring 3
		a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
	} else if ((d % 120) == 23 && aff[elli_id] < _PROPOSE_MIN) {
		// Flower Festival, Spring 23
		a.push({'desc':"Flower Festival (Town Square)", 'imp':true});
		a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2, 'sel':(aff[rick_id] < _RICK_FIX_MIN - 3), 'red':(aff[rick_id] >= _RICK_FIX_MIN - 3)});
		a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
		a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		today_aff += 12;
	} else if (d == 31) {
		// Fireworks Fest, Summer 1
		/*
		a.push({'desc':"Get Fishing Rod", 'val':1, 'cid':'f_fishing_rod', 'iid':get_npc_id("fisherman")});
		a.push({'desc':"Fish a lot", 'sr':true});
		a.push({'desc':"Meet ", 'cid':elli_id, 'val':4, 't0':"Talk"});
		a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sr':true, 't3':"Meet "});
		a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3, 't2':"Gift - Other"});
		a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false, 't2':"Gift - M/L Fish"});
		a.push({'desc':"Fireworks at 7PM (Bakery)", 'cid':elli_id, 'val':5});
		today_aff += 11;
		*/
	} else if ((d % 120) == 72 && aff[elli_id] < _PROPOSE_MIN) {
		// Harest Festival, Fall 12
		a.push({'desc':"Harvest Festival (Town Square)", 'imp':true});
		a.push({'desc':"Talk", 'cid':rick_id, 'val':2, 'sel':(aff[rick_id] < _RICK_FIX_MIN - 3), 'red':(aff[rick_id] >= _RICK_FIX_MIN - 3)});
		a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
		a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		today_aff += 12;
	} else if (d == 109) {
		// Dog Race
		a = betting_table(a);
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
		
/*
	} else if (d == 90) { a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1, 'iid':get_npc_id('doug')}); }
	if (d == 95 && flags['borrow_cows'] > 0) {
		a.push({'desc':"Enter / Exit House to Clear Cliff", 'iid':get_npc_id('cliff')});
		a.push({'desc':"1000G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1]});
	}
*/
	
	} else {
		if ([83, 85, 86, 87].includes(d)) {
			// Bridge Work (Fall 23 - 27)
			// 83,  84,  85,  86,  87
			// SAT, SUN, MON, TUE, WED
			a.push({'desc':"Bridge Work", 'cid':['v_gold', 'v_bridge_days_worked'], 'val':[1000, 1], 'iid':get_npc_id('mas_carpenter'), 'imp':true});
			if (flags['fishing_rod'] == 0) {
				a.push({'desc':"Get Fishing Rod", 'val':1, 'cid':'f_fishing_rod', 'iid':get_npc_id("fisherman")});
			}
			a.push({'desc':((aff[rick_id] < _RICK_FIX_MIN - 3) ? "Gifts for Elli and Rick" : "Gift for Elli")});
		} else if ([102, 103, 104, 106].includes(d)) {
			// Hot Springs Work (Win 12 - 16)
			//  102, 103, 104, 105, 106
			// THUR, FRI, SAT, SUN, MON
			a.push({'desc':"Hot Springs Work", 'iid':get_npc_id('mas_carpenter'), 'imp':true,
				'cid':['v_springs_days_worked', 'v_gold'], 'val':[1, 1000]
			});
			if (d == 106) {
				// Hot Springs Photo
				a[a.length - 1]['cid'].push('f_photo_springs');
				a[a.length - 1]['val'].push(1);
			}
		}

		if (aff[elli_id] < _PROPOSE_MIN && (a.length > 0 || (d > 121 && !["SUN", "WED"].includes(dow) && !(aff[elli_id] >= (_PROPOSE_MIN - 13 - _MUS_BOX_AFF) && d <= 143)))) {
			// Music Box
			if (d > 121 && !["SUN", "WED"].includes(dow) && flags['old_mus_box'] == 0) {
				a.push({'desc':"Equip hoe"});
				if (flags['treasure_map'] == 0) {
					a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'iid':get_npc_id("musbox")});
				}
				a.push({'desc':"Dig Up Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':(flags['treasure_map'] == 0), 'sel':(aff['elli_id'] < (_PROPOSE_MIN - 1 - 4))});
				if (flags['treasure_map'] == 1) {
					a[a.length - 1]['iid'] = get_npc_id("musbox");
				}
			}

			// Buy a Chicken
			if (vars['chickens'] == 0 && vars['gold'] >= 1500) {
				a.push({'desc':"Buy a Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':get_npc_id('doug')});
			}

			// Kitchen
			if (flags['kitchen'] < 1 && dow != "TUES" && !is_festival(d) && vars['gold'] >= 5000 && vars['lumber'] >= 500) {
				a.push({'desc':'Buy Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)], 'iid':get_npc_id('mas_carpenter')});
			}

			// Elli
			if (is_sunny == 1 && (["MON", "TUES", "THURS", "FRI", "SAT"].includes(dow) || d == 87)) {
				if (aff[elli_id] < 13) {
					a.push({'desc':"Meet ", 'cid':elli_id, 'val':4, 't0':"Talk"});
					today_aff += 4;
				}
				a.push({'desc':("Talk" + ((dow == "MON") ? " (" + elli_mon_loc + ")" : ((dow == "WED" ? " (Flower Shop)" : "")))), 'cid':elli_id, 'val':1, 'sel':(aff[rick_id] < _RICK_FIX_MIN - 3), 't2':"MusBox", 'sr':(aff[elli_id] == 0)});
				a.push({'desc':"MusBox", 'cid':elli_id, 'val':_MUS_BOX_AFF, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3), 'sr':true, 't2':a[a.length - 1]['desc']});
				a.push({
					'desc':("Elli-egg" + ((dow == "MON") ? " (" + elli_mon_loc + ")" : "")),
					'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
					'val':((flags['recipe_elli'] == 1) ? 4 : [6, 1]), 'sr':true,
					'sel':(vars['chickens'] > 0),
					't2':("Elli-gift" + ((dow == "MON") ? " (" + elli_mon_loc + ")" : ""))
				});
				a.push({
					'desc':("Elli-gift" + ((dow == "MON") ? " (" + elli_mon_loc + ")" : "")),
					'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0), 't2':a[a.length - 1]['desc']
				});
				today_aff += (((aff[rick_id] >= (_RICK_FIX_MIN - 3) && ["MON", "TUES", "THURS", "FRI"].includes(dow)) ? _MUS_BOX_AFF : 1) + ((vars['chickens'] > 0) ? 4 : 1));
			}

			if (is_sunny == 0 && dow != "MON") {
				if (aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
					// SICK EVENT
					a.push({'desc':"Sick Event", 'cid':[elli_id, "f_sick_elli"], 'val':[_SICK_EVENT_AFF, 1]});
					today_aff += _SICK_EVENT_AFF;
				} else {
					a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sel':(d >= 83 && d <= 87)});
					a.push({
						'desc':"Elli-egg", 't2':"Elli-gift",
						'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
						'val':((flags['recipe_elli'] == 1) ? 4 : [6, 1]), 'sr':true,
						'sel':(vars['chickens'] > 0 && d >= 83 && d <= 87),
					});
					a.push({
						'desc':"Elli-gift", 't2':a[a.length - 1]['desc'],
						'cid':elli_id, 'val':1, 'sr':true,
						'sel':(vars['chickens'] == 0 && d >= 83 && d <= 87)
					});
					today_aff += (((aff[rick_id] >= (_RICK_FIX_MIN - 3) && ["MON", "TUES", "THURS", "FRI"].includes(dow)) ? _MUS_BOX_AFF : 1) + ((vars['chickens'] > 0) ? 4 : 1));
				}
			}

			// Rick
			if ((aff[elli_id] + today_aff) < _PROPOSE_MIN && is_sunny == 1 && (["MON", "TUES", "THURS", "FRI", "SAT"].includes(dow))) {
				if (flags['new_mus_box'] == 1) {
					a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
				}
				if (aff[rick_id] < 5) {
					a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk ", 'sel':(dow != "SAT")});
					a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sr':true, 't3':"Meet ", 'sel':(dow != "SAT")});
				} else {
					a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT")});
				}
				if (aff[rick_id] >= _RICK_FIX_MIN - 6) {
					a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3 && dow != "SAT")});
				}
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_FIX_MIN - 3 && dow != "SAT")});
			}
	
			// DREAM
			if (aff[elli_id] >= _DREAM_EVENT_MIN && flags['dream_elli'] == 0 && is_sunny == 1) {
				a.push({'desc':"DREAM", 'cid':[elli_id, 'f_dream_elli'], 'val':[_DREAM_EVENT_AFF, 1]});
				today_aff += _DREAM_EVENT_MIN;
			} else if (aff[elli_id] >= _ANKLE_EVENT_MIN && is_sunny == 1 && flags['ankle_elli'] == 0) {
				// ANKLE
				a.push({'desc':"ANKLE", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], sel:(flags['fishing_rod'] == 1)});
				//today_aff += _ANKLE_EVENT_MIN;
			}
		}

		// Propose
		if (flags['kitchen'] >= 1 && flags['kitchen'] <= 2 && is_sunny == 1 && (aff[elli_id] + today_aff) >= 220 && vars['gold'] >= 980
			&& flags['propose'] == 0 && ["MON", "TUES", "THURS", "FRI"].includes(dow)) {
				a.push({'desc':"Buy Blue Feather", 'cid':['v_gold', 'f_blue_feather'], 'val':[-980, 1], 'iid':rick_id, 'imp':true});
				a.push({'desc':"Propose", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, 1], 'iid':elli_id, 'imp':true});
		}
	}
	return a;
}