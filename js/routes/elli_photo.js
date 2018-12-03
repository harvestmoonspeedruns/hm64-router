function get_actions_elli_photo (d = 3, g = 300, is_sunny = 1) {
	//Elli photo

	var a = [];
	var skip = false;
	var elli_id = get_npc_id("elli");
	var rick_id = get_npc_id("rick");
	var elli_mon_loc = (get_month(d) == 1) ? "BEACH" : "MTN";
	var dow = get_day_of_week(d, true);

	if (d < 31) {
		// Spring 3 to Spring 30, Year 1

		if (d == 3) {
			// Spring 3
			a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
		} if (d == 23) {
			// Flower Festival, Spring 23
			a.push({'desc':"Go to Town Square", 'iid':get_npc_id('mayor'), 'imp':true});
			a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		}
	}

	if (d == 31) {
		// Fireworks Fest, Summer 1
		a.push({'desc':"Fishing Rod, Fish a lot", 'cid':get_npc_id("fisherman")});
		a.push({'desc':"Meet", 'cid':elli_id, 'val':4, 't0':"Talk"});
		a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sr':true, 't3':"Meet"});
		a.push({'desc':"M/L Fish", 'cid':elli_id, 'val':3, 't2':"Gift", 'sr':true});
		a.push({'desc':"Gift", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false, 't2':"M/L Fish"});
		a.push({'desc':"Fireworks at 7PM (Bakery)", 'cid':elli_id, 'val':5});
	}

	if (d > 31 && d <= 69) { // Summer to Photo
		if (flags['chicken_funeral'] == 1) {
			a.push({'desc':"CHICKEN FUNERAL"});
		} else if (is_sunny == -1 && vars['chickens'] > 0) {
			a.push({'desc':"Chickens Outside?", 'cid':['f_chicken_funeral', 'f_typhoon'], 'val':[2, 1]});
		} else if (["MON", "TUES", "THURS", "FRI", "SAT"].includes(dow) && d != 39 && d != 54 && d != 64) {
			// (39 = Veggie Fest; 54 = Swim Fest; 64 = Cow Fest)
			if (aff[elli_id] < _PHOTO_MIN) {
				if (vars['chickens'] < 1 && flags['typhoon'] == 0) {
					if (forage(1500) !== null) {
						a.push(forage(1500));
					} else {
						a.push({'desc':"Buy a Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':get_npc_id('doug')});
					}
				} else {
					if (flags['treasure_map'] == 0) {
						a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'iid':get_npc_id("musbox")});
					}
					if (flags['old_mus_box'] == 0) {
						a.push({'desc':"Dig Up Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':(flags['treasure_map'] == 0)});
						if (flags['treasure_map'] == 1) {
							a[a.length - 1]['iid'] = get_npc_id("musbox");
						}
					}
				}
			}

			var tarr = [];
			if (vars['chickens'] < 1) { tarr.push("Elli"); }
			if (aff[rick_id] <= _RICK_FIX_MIN - 3) { tarr.push("Rick"); }
			if (tarr.length) {
				a.push({'desc':"Gift for " + tarr.join(" + ")});
			}

			// ELLI
			a.push({'desc':("Talk (" + ((dow == "MON") ? elli_mon_loc : "Bakery") + ")"), 'cid':elli_id, 'val':1, 'sel':(flags['new_mus_box'] == 0), 't2':"MusBox"});
			a.push({'desc':"MusBox", 'cid':elli_id, 'val':6, 'sel':flags['new_mus_box'], 'sel':(flags['new_mus_box'] == 1), 'sr':true, 't2':a[a.length - 1]['desc']});

			var elli_gift = (vars['chickens'] == 0) ? "M/L Fish" : "Egg";
			a.push({'desc':elli_gift, 'cid':((vars['chickens'] == 0 || flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
					'val':((vars['chickens'] == 0) ? 3 : ((flags['recipe_elli'] == 1) ? 4 : [6, 1])), 'sr':true,
					'sel':(vars['chickens'] > 0), 't2':"Gift"
			});
			a.push({'desc':"Gift", 'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0), 't2':a[a.length - 1]['desc']
			});
			if (aff[elli_id] >= _DREAM_EVENT_MIN && flags['elli_dream'] == 0) {  //DREAM
				a.push({'desc':"DREAM", 'cid':[elli_id, 'f_elli_dream'], 'val':[_DREAM_EVENT_AFF, 1]});
			}
			if (aff[elli_id] >= _ANKLE_EVENT_MIN && flags['elli_ankle'] == 0) {
				a.push({'desc':"ANKLE", 'cid':[elli_id, 'f_elli_ankle'], 'val':[_ANKLE_EVENT_AFF, 1], sel:false});
			}

			// RICK
			if (aff[rick_id] < 4) {
				a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk "});
			}
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 't3':"Talk ", 'sr':(aff[rick_id] < 4), 'sel':(dow != "SAT")});
			a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3 && dow != "SAT")});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_FIX_MIN - 3 && dow != "SAT")});
		} else { // Elli aff >= 200
			if (flags['chicken'] && d < 61) {
				a.push({'desc':"Sell Chicken", 'cid':['f_chicken', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});
			}
		}
	}

	//Photo
	if (d == 69) {
		a.push({'desc':'Elli Photo (6PM)', 'cid':[elli_id, 'f_photo_elli'], 'val':[_PHOTO_EVENT_AFF, 1]});
	}

	if (d > 69) {
		a.push({'desc':(flags['photo_elli'] ? "DONE!" : "RESET")});
	}
	return a;
}