function get_actions_elli (d = 3, g = 300, is_sunny = 1) {
	//Elli marriage
	
	/*
	 * TODO
	 * 
	 * - Buying Chicken Feed
	 *
	 */
	var a = [];
	var skip = false;
	var elli_id = get_npc_id("elli");
	var rick_id = get_npc_id("rick");
	var tmp_dow = get_day_of_week(d, true);
	var elli_mon_loc = (get_month(d) == 1) ? "BEACH" : "MTN";
	
	if (d < 32) {
		// Spring 3 to Summer 1, Year 1

		if (d == 3) {
			// Spring 3
			a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
		} if (d % 120 == 23) {
			// Flower Festival, Spring 23
			a.push({'desc':"Flower Festival (Town Square)"});
			if (aff[rick_id] < (_RICK_FIX_MIN - 3)) {
				a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		} if (d == 31) {
			// Fireworks Fest, Summer 1
			a.push({'desc':"Fishing Rod, Fish a lot", 'cid':get_npc_id("fisherman")});
			a.push({'desc':"Meet ", 'cid':elli_id, 'val':4, 't0':"Talk"});
			a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sr':true, 't3':"Meet "});
			a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3, 't2':"Gift - Other"});
			a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false, 't2':"Gift - M/L Fish"});
			a.push({'desc':"Fireworks at 7PM (Bakery)", 'cid':elli_id, 'val':5});
		}
	}

	// Buy a chicken on Summer 28 (d58)
	// Summer Full Forage = 460G
	//sum 27 g >= 1500
	//sum 26 g >= 1040
	//sum 25 g >= 580
	//sum 24 g >= 120

	if (d >= 32 && d < 58) {
		//Summer 2 to Summer 27

		if (is_sunny == 1 && ["TUES", "THURS", "FRI"].includes(tmp_dow) && d != 39 && d != 54) {
			// Days where both Rick and Elli are available
			// (39 = Veggie Fest; 54 = Swim Fest)
			
			if (forage(1530) !== null) {
				// Full forage for Chicken + Feed

				a.push(forage(1530));
				a.push({'desc':"Gifts for Rick + Elli"});
				a.push({'desc':"Talk", 'cid':elli_id, 'val':1});
				a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3, 'sr':true, 't2':"Gift - Other"});
				a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false, 't2':"Gift - M/L Fish"});
				if (aff[get_npc_id('rick')] < 4) {
					a.push({'desc':"Meet", 'cid':rick_id, 'val':4, 't0':"Talk"});
					a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sr':true, 't3':"Meet"});
				} else {
					a.push({'desc':"Talk", 'cid':rick_id, 'val':3});
				}
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true});
				a.push({'desc':"Sell items in bag"});
			}
		}
	}

	if (d >= 58 && d < 90) {
		//Summer 28 to Fall 29

		if (d == 72) {
			// Harvest Festival (Fall 12)

			a.push({'desc':"Harvest Festival (Town Square)"});
			if (!aff[rick_id] || aff[rick_id] < _RICK_FIX_MIN - 3) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		} else if (tmp_dow != "SUN" && d != 64 && d != 80 && d != 88) {
			// 64 = Cow Fest, 80 = Egg Fest, 88 = Horse Race

			// Obtain gifts for Elli and|or Rick
			var tarr = [];
			if (vars['chickens'] < 1) { tarr.push("Elli"); }
			if (aff[rick_id] <= _RICK_FIX_MIN - 3) { tarr.push("Rick"); }

 			if ((is_sunny == 1 && ["MON", "TUES", "THURS", "FRI"].includes(tmp_dow)) || (d >= 83 && d <= 87)) {
				// Don't have a chicken
				if (vars['chickens'] < 1) {
					if (forage(1500) !== null) {
						// Forage for chicken money
						a.push(forage(1500));
						if (tarr.length) { a.push({'desc':"Gift for " + tarr.join(" + ")}); }
					} else {
						if (tarr.length) { a.push({'desc':"Gift for " + tarr.join(" + ")}); }
						if (tmp_dow != "THURS") {
							a.push({'desc':"Buy a Chicken", 'cid':['v_gold', 'v_chickens'], 'val':[-1500, 1], 'iid':get_npc_id('doug')});
						}
					}
				} else if (is_sunny == 1 && d != 87) {
					// No old box in inventory; dig up a music box
					if (!flags['old_mus_box']) {
						a.push({'desc':"Equip hoe"});
						if (!flags['treasure_map']) {
							a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1});
						}
						a.push({'desc':"Dig Up Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':!flags['treasure_map'], 't0':"MusBox Fix"});
						if (tarr.length) { a.push({'desc':"Gift for " + tarr.join(" + ")}); }
					}
				}
			}
			
			// Bridge Work (Fall 23 - 27)
			if (d >= 83 && d <= 87) {
				a.push({'desc':"Bridge Work", 'cid':['v_gold', 'v_bridge_days_worked'], 'val':[1000, 1]});
			}

			// Elli
			if (is_sunny == 1 &&
				(["MON", "TUES", "THURS", "FRI"].includes(tmp_dow) || d == 83 || d == 87)) {
					a.push({'desc':("Talk" + ((tmp_dow == "MON") ? " (" + elli_mon_loc + ")" : "")), 'cid':elli_id, 'val':1, 'sel':(!flags['new_mus_box']), 't2':"MusBox"});
					a.push({'desc':"MusBox", 'cid':elli_id, 'val':_MUS_BOX_AFF, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3), 'sr':true, 't2':a[a.length - 1]['desc']});
					a.push({
						'desc':("Elli-egg" + ((tmp_dow == "MON") ? " (" + elli_mon_loc + ")" : "")),
						'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
						'val':((flags['recipe_elli'] == 1) ? 4 : [6, 1]), 'sr':true,
						'sel':(vars['chickens'] > 0),
						't2':("Elli-gift" + ((tmp_dow == "MON") ? " (" + elli_mon_loc + ")" : ""))
					});
					a.push({
						'desc':("Elli-gift" + ((tmp_dow == "MON") ? " (" + elli_mon_loc + ")" : "")),
						'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0), 't2':a[a.length - 1]['desc']
					});
			}

			if (is_sunny == 0 && tmp_dow != "MON") {
				if (aff[elli_id] >= _SICK_EVENT_MIN && !flags['sick_elli']) {
					// SICK EVENT
					a.push({'desc':"Sick Event", 'cid':[elli_id, "f_sick_elli"], 'val':[_SICK_EVENT_AFF, 1]});
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
				}
			}

			// Rick
			if (is_sunny == 1 && (["MON", "TUES", "THURS", "FRI"].includes(tmp_dow) || d == 83)) {
				if (aff[rick_id] < 4) {
					a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk ", 'sel':(tmp_dow != "SAT")});
					a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sr':true, 't3':"Meet ", 'sel':(tmp_dow != "SAT")});
				} else {
					a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sel':(tmp_dow != "SAT")});
				}
				if (vars['chickens'] > 0) {
					a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3 && tmp_dow != "SAT"), 't3':"Dig Up Music Box"});
				}
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_FIX_MIN - 3 && tmp_dow != "SAT")});
			}

			// DREAM
			if (aff[elli_id] >= _DREAM_EVENT_MIN && !flags['dream_elli'] && is_sunny == 1) {
				a.push({'desc':"DREAM", 'cid':[elli_id, 'f_dream_elli'], 'val':[_DREAM_EVENT_AFF, 1]});
			} else if (aff[elli_id] >= _ANKLE_EVENT_MIN && is_sunny == 1) {
			// ANKLE
				a.push({'desc':"ANKLE", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], sel:false});
			}

			if (((is_sunny == 1 && ["MON", "TUES", "THURS", "FRI"].includes(tmp_dow)) || (d >= 83 && d <= 87)) &&
				vars['chickens'] < 1 && forage(1500) !== null) {
					a.push({'desc':"Sell items in bag"});
			}
		}
	}
	if (d >= 90 && vars['chickens'] > 0) { a.push({'desc':"Sell Chicken", 'cid':['v_gold', 'v_chickens'], 'val':[500, -1]}); }

	if (d == 90) { a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1, 'iid':get_npc_id('doug')}); }
	if (d == 95 && flags['borrow_cows'] > 0) {
		a.push({'desc':"Enter / Exit House to Clear Cliff", 'iid':get_npc_id('cliff')});
		a.push({'desc':"1000G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1]});
	}

	if (d == 109) {
		// Dog Race
		a = betting_table(a);
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
	}

	if (d > 109 && d < 119) {
		if (flags['kitchen'] == 2) { a.push({'desc':'Carpenters finished with Kitchen'}); }
		if (flags['kitchen'] < 1 && get_day_of_week(vars['day'], true) != "TUES") {
			a.push({'desc':'Buy Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)]});
		}
		if (flags['kitchen'] >= 1 && flags['kitchen'] <= 2 && is_sunny == 1 && aff[elli_id] >= 220 && vars['gold'] >= 980
			&& flags['propose'] == 0 && ["TUES", "THURS", "FRI"].includes(get_day_of_week(vars['day'], true))) {
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