function get_actions_maria (d = 3, g = 300, is_sunny = 1) {
	// Maria
	var a = [];
	var maria_id = get_npc_id("maria");
	var rick_id = get_npc_id("rick");
	var dow = get_day_of_week(d, true);
	var rick_loc = ((dow == "SUN") ? " (TOWN SQUARE)" : ((dow == "SAT") ? " (OUTSIDE SHOP)" : ""));
	var lib_closed = (dow == "MON" || (d > 30 && d <= 40))

	if (is_festival(d)) {
		a.push({'desc':("<h4>" + festival_name(d).toUpperCase() + "</h4>")});
	}

	if (flags['propose'] == 1) {
		a.push({'desc':"Wedding Day", 'iid':get_npc_id('maria'), 'cid':['f_photo_married', 'f_propose'], 'val':[1, -1], 'imp':true});
	} else if (d == 3) {
		a.push({'desc':"Equip Hoe", 'imp':true});
		a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
		a.push({'desc':"Straight down; Till 9x9 plot"});
	} else if (d % 120 == 23) {
		// Spring 23, Flower Festival
		a.push({'desc':"Flower Festival (TOWN SQUARE)", 'iid':get_npc_id('mayor'), 'imp':true});
		if (aff[rick_id] < (_RICK_FIX_MIN - 3)) {
			a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
		}
		a.push({'desc':"Talk", 'cid':maria_id, 'val':2});
		a.push({'desc':"Dance", 'cid':maria_id, 'val':10, 'sr':true});
	} else if (d == 90) {
		// Fall 30, Accept cows
		a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1, 'iid':get_npc_id('doug'), 'imp':true});
	} else if (d == 95) {
		// Winter 5, Money from Doug
		if (flags['borrow_cows'] > 0) {
			a.push({'desc':"Enter / Exit House to Clear Cliff", 'iid':get_npc_id('cliff')});
			a.push({'desc':"1000 G from Doug", 'cid':["v_gold", "f_borrow_cows"], 'val':[1000, -1], 'imp':true, 'iid':get_npc_id('doug')});
		}
	} else if (d >= 102 && d <= 106) {
		// Winter 12 - 16, Hot Springs
		// THURS - FRI - SAT - SUN - MON
		a.push({'desc':"Hot Springs", 'cid':["v_gold", "v_springs_days_worked"], 'val':[1000, 1], 'imp':true, 'iid':get_npc_id('mas_carpenter')});
	} else if (d == 109) {
		// Winter 19, Dog Race
		a = betting_table(a);
		a.push({'desc':"Buy 500 Lumber", 'cid':"v_lumber", 'val':500});
	} else if (d >= 110 && flags['kitchen'] == 0 && dow != "TUES") {
		a.push({'desc':'Buy a Kitchen', 'cid':['v_lumber', 'v_gold', 'f_kitchen'], 'val':[-500, -5000, (3 + 1 + 1)], 'imp':true, 'iid':get_npc_id('mas_carpenter')});
	} else if (!is_festival(d) && aff[maria_id] < _PROPOSE_MIN){
		// Music Box
		if (aff[maria_id] < (_PROPOSE_MIN - 3)) {
			if (flags['old_mus_box'] == 1) {
				a.push({'desc':"DONT DIG A MUSIC BOX; ALREADY ONE IN BAG", 'iid':get_npc_id('musbox'), 'red':true});
			} else if (is_sunny == 1) {
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			}
		}

		if (is_sunny == 0 && flags['sick_maria'] == 0 && aff[maria_id] >= _SICK_EVENT_MIN && lib_closed) {
			// Sick Event
			a.push({'desc':"Equip Axe, Hot Springs Stumps"});
			a.push({'desc':"Stumps:", 'iid':get_npc_id('stump')});
			for (var z = 1; z < 8; z++) {
				a.push({'desc':("" + z), 'sr':true, 'cid':'v_lumber', 'val':(6 * z), 'sel':(z == 4),
						't2':(["1","2","3","4","5","6","7"].filter((value)=>value != z))
				});
			}
			a.push({'desc':"Sick Event (LIBRARY)", 'cid':[maria_id, 'f_sick_maria'], 'val':[_SICK_EVENT_AFF, 1]});
		}

		if (!lib_closed) { // Library is Open
			if (flags['dream_maria'] == 0 && aff[maria_id] >= _DREAM_EVENT_MIN) {
				// Dream Event
				a.push({'desc':"Equip Axe, Hot Springs Stumps"});
				a.push({'desc':"Stumps:", 'iid':get_npc_id('stump')});
				for (var z = 1; z < 8; z++) {
					a.push({'desc':("" + z), 'sr':true, 'cid':'v_lumber', 'val':(6 * z), 'sel':(z == 4),
						't2':(["1","2","3","4","5","6","7"].filter((value)=>value != z))
					});
				}
				a.push({'desc':"DREAM (LIBRARY)", 'cid':[maria_id, 'f_dream_maria'], 'val':[_DREAM_EVENT_AFF, 1]});
			} else if (flags['ankle_maria'] == 0 && aff[maria_id] >= _ANKLE_EVENT_MIN) {
				// Ankle Event
				a.push({'desc':"Equip Axe, Hot Springs Stumps"});
				a.push({'desc':"Stumps:", 'iid':get_npc_id('stump')});
				for (var z = 1; z < 8; z++) {
					a.push({'desc':("" + z), 'sr':true, 'cid':'v_lumber', 'val':(6 * z), 'sel':(z == 4),
							't2':(["1","2","3","4","5","6","7"].filter((value)=>value != z))
					});
				}
				a.push({'desc':"ANKLE (LIBRARY)", 'cid':[maria_id, 'f_ankle_maria'], 'val':[_ANKLE_EVENT_AFF, 1]});
			} else if (flags['new_mus_box'] == 1) { // No Dream or Ankle; Maria first (new mus box)
				
				a.push({'desc':((aff[rick_id] < (_RICK_FIX_MIN - 6) && is_sunny == 1 && dow != "WED") ? "Edible, Flower" : ((vars['cabbages'] == 0) ? "Grab one Gift" : "Cabbage for Maria"))});
				
				a.push({'desc':"Talk ", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sel':(aff[rick_id] < (_RICK_FIX_MIN - 6))});
				a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'], 'sel':(aff[rick_id] >= (_RICK_FIX_MIN - 6))});
				a.push({'desc':"Gift ", 'cid':maria_id, 'val':2, 't2':"Cabbage", 'sr':true, 'sel':(flags['recipe_maria'] > 0 || vars['cabbage_waters'] < _CABBAGE_GROW_DAYS)});
				a.push({'desc':"Cabbage", 'sr':true, 't2':a[a.length - 1]['desc'],
						'sel':(flags['recipe_maria'] == 0 && vars['cabbage_waters'] >= _CABBAGE_GROW_DAYS),
						'cid':((flags['recipe_maria'] == 0) ? ['f_recipe_maria', maria_id]: maria_id),
						'val':((flags['recipe_maria'] == 0) ? [1, 5] : 3)
				});
			} else {
				// No New MusBox; Library Open
				if (flags['old_mus_box'] == 1) {
					a.push({'desc':"Equip Axe, Hot Springs Stumps"});
					a.push({'desc':"Stumps:", 'iid':get_npc_id('stump')});
					for (var z = 1; z < 8; z++) {
						a.push({'desc':("" + z), 'sr':true, 'cid':'v_lumber', 'val':(6 * z), 'sel':(z == 4),
								't2':(["1","2","3","4","5","6","7"].filter((value)=>value != z))
						});
					}
				}
				a.push({'desc':((aff[rick_id] < (_RICK_FIX_MIN - 6)) ? "Edible, Flower" : ((vars['cabbages'] == 0) ? "Grab one Gift" : "Cabbage for Maria"))});
			}

			// RICK
			if (is_sunny == 1 && dow != "WED") {
				if (flags['new_mus_box'] == 1) {
					a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
				}
				if (aff[rick_id] == 0) { a.push({'desc':"Meet", 'val':4, 'cid':rick_id}); }
				a.push({'desc':("Talk" + rick_loc), 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(!["SAT", "SUN"].includes(dow))});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(!["SAT", "SUN"].includes(dow) && aff[rick_id] <= (_RICK_FIX_MIN - 3))});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':(!["SAT", "SUN"].includes(dow) && aff[rick_id] >= (_RICK_FIX_MIN - 6) && aff[maria_id] < (_PROPOSE_MIN - 3)),
						'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't0':"MusBox", 't3':a[a.length - 2]['desc']
				});
			}

			if (flags['new_mus_box'] == 0) {
				if (aff[maria_id] == 0) { a.push({'desc':"Meet", 'cid':maria_id, 'val':4}); }
				a.push({'desc':"Talk ", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sr':(aff[maria_id] == 0),
						'sel':(aff[rick_id] < (_RICK_FIX_MIN - 6) || ["WED", "SAT", "SUN"].includes(dow))
				});
				a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'],
						'sel':(aff[rick_id] >= (_RICK_FIX_MIN - 6) && !["WED", "SAT", "SUN"].includes(dow))
				});
				a.push({'desc':"Gift ", 'cid':maria_id, 'val':2, 't2':"Cabbage", 'sr':true, 'sel':(flags['recipe_maria'] > 0 || vars['cabbage_waters'] < _CABBAGE_GROW_DAYS)});
				a.push({'desc':"Cabbage", 'sr':true, 't2':a[a.length - 1]['desc'],
						'sel':(flags['recipe_maria'] == 0 && vars['cabbage_waters'] >= _CABBAGE_GROW_DAYS),
						'cid':((flags['recipe_maria'] == 0) ? ['f_recipe_maria', maria_id]: maria_id),
						'val':((flags['recipe_maria'] == 0) ? [1, 5] : 3)
				});
			}
		} else { // Library is closed
			if (is_sunny == 1 && (d + (_CABBAGE_GROW_DAYS - vars['cabbage_waters']) == 30) && d != 30) {
				a.push({'desc':"Equip Watering Can",'imp':true});
				a.push({'desc':"Water Cabbages", 'val':1, 'cid':'v_cabbage_waters', 'sr':true});
			}

			a.push({'desc':((aff[rick_id] < (_RICK_FIX_MIN - 6)) ? "Edible, Flower" : ((vars['cabbages'] == 0) ? "Grab one Gift" : "Cabbage for Maria"))});

			// MTN Stumps
			a.push({'desc':"Equip Axe, MTN STUMPS"});
			a.push({'desc':"Stumps:", 'iid':get_npc_id('stump')});
			for (var z = 1; z < 8; z++) {
				a.push({'desc':("" + z), 'sr':true, 'cid':'v_lumber', 'val':(6 * z), 'sel':(z == 3),
						't2':(["1","2","3","4","5","6","7"].filter((value)=>value != z))
				});
			}

			if (aff[maria_id] == 0) { a.push({'desc':"Meet", 'cid':maria_id, 'val':4}); }
			a.push({'desc':"Talk (MTN / CHURCH)", 'cid':maria_id, 'val':1, 'sr':(aff[maria_id] == 0),
					'sel':(!["WED", "SAT", "SUN"].includes(dow) && flags['new_mus_box'] == 0), 't2':"MusBox"});
			a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
					'sel':(flags['new_mus_box'] == 1), 't2':a[a.length - 1]['desc']
			});
			a.push({'desc':"Gift ", 'cid':maria_id, 'val':2, 'sr':true, 't2':"Cabbage",
					'sel':(((!["WED", "SAT", "SUN"].includes(dow) && flags['new_mus_box'] == 0) || flags['new_mus_box'] == 1) && (flags['recipe_maria'] > 0 || vars['cabbage_waters'] < _CABBAGE_GROW_DAYS))
			});
			a.push({'desc':"Cabbage", 'sr':true,
					'cid':((flags['recipe_maria'] == 0) ? ['f_recipe_maria', maria_id]: maria_id),
					'val':((flags['recipe_maria'] == 0) ? [1, 5] : 3), 't2':a[a.length - 1]['desc'],
					'sel':(((!["WED", "SAT", "SUN"].includes(dow) && flags['new_mus_box'] == 0) || flags['new_mus_box'] == 1) && flags['recipe_maria'] == 0 && vars['cabbage_waters'] >= _CABBAGE_GROW_DAYS)
			});

			// RICK
			if (flags['new_mus_box'] == 0 && dow != "WED") {
				a.push({'desc':("Talk" + rick_loc), 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(!["SAT", "SUN"].includes(dow))});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(!["SAT", "SUN"].includes(dow) && aff[rick_id] <= (_RICK_FIX_MIN - 3))});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':(!["SAT", "SUN"].includes(dow) && aff[rick_id] >= (_RICK_FIX_MIN - 6) && aff[maria_id] < (_PROPOSE_MIN - 3)),
							'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't0':"MusBox", 't3':a[a.length - 2]['desc']
				});
			} else {
				a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
			}

			// Fireworks Fest
			if (d == 31) {
				a.push({'desc':"Equip Axe, Chop Farm Stumps:", 'iid':get_npc_id('stump')});
				for (var z = 1; z < 11; z++) {
					a.push({'desc':("" + z), 'sr':(z % 5 != 1), 'cid':'v_lumber', 'val':(6 * z), 'sel':false,
							't2':(["1","2","3","4","5","6","7","8","9","10"].filter((value)=>value != z))
					});
				}
				a.push({'desc':"Fireworks (TOWN SQUARE)", 'cid':[maria_id, 'f_dontsave'], 'val':[5, 1], 'sel':false});
			}
		}
		
		// Buy Cabbage Seeds
		if (flags['cabbage_bought'] == 0) {
			a.push({'desc':"Buy Cabbage Seeds", 'cid':['f_cabbage_bought', 'v_gold'], 'val':[1, -200], 'iid':get_npc_id('lillia')});
		}

		// Plant Cabbages
		if (flags['cabbage_planted'] == 0) {
			a.push({'desc':"Equip Cabbage Seeds", 'imp':true})
			a.push({'desc':"Plant Cabbages", 'val':1, 'cid':'f_cabbage_planted', 'sr':true});
		}

		// Blue Feather + Propose
		if (aff[maria_id] >= _PROPOSE_MIN && flags['kitchen'] == 1 && is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow) && vars['gold'] >= 980) {
			a.push({'desc':"Buy Blue Feather", 'iid':rick_id, 'val':[-980, 1], 'cid':['v_gold', 'f_blue_feather'], 'imp':true});
			a.push({'desc':"Propose", 'cid':['f_blue_feather', 'f_propose'], 'val':[-1, (next_sunday(d + 1) - d + 1)], 'iid':get_npc_id('maria'), 'imp':true});
		}
	}
	return a;
}