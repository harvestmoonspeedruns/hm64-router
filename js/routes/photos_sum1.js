function actions_photos_sum_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var maria_id = get_npc_id('maria');
	var elli_id = get_npc_id('elli');
	var rick_id = get_npc_id('rick');
	var basil_id = get_npc_id('basil');

	var dow = get_dow(d, true);
	var cur_maria_aff = 0;

	if (is_festival(d)) {

		// Vegetable (Sum 9), Sea (Sum 24)
		// Skip both

	} else {
		a.push({'desc':"Check Weather"});
		a.push({'desc':("Put Chickens " + ((flags['chicken_outside'] == 0) ? " Outside" : "Inside")), 'cid':'f_chicken_inside',
			'val':((flags['chicken_outside'] == 0) ? 1 : -1), 'sel':(flags['chicken_outside'] == 0), 'sr':true, 'imp':true});

		// Water Corn
		if (is_sunny && flags['corn_planted']) {
			a.push({'desc':"Equip Watering Can"});
			if (vars['watering_can_fill'] < 10) {
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true});
			}
			a.push({'desc':"Water Corn", 'cid':['v_watering_can_fill', 'v_corn_waters'], 'val':[-10, 1], 'sr':true});
		}
		if (vars['corn_waters'] >= _CORN_GROW_DAYS) {
			a.push({'desc':"Corn for Basil / Ann"});
		}

		// New Chicken | Incubate
		if (vars['chickens'] > 0 && flags['new_chick'] <= 1) {
			var chicken_id = get_npc_id('chicken');
			// new chk | incubate
			if (flags['new_chick'] == 1) {
				a.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1], 't0':"Incubate"});
			}
			a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'iid':chicken_id, 'sr':(flags['new_chick'] == 1)});
			if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
		}

		// Music Box Dig
		if (!flags['old_mus_box'] && d != 31) {
			// dig music box
			a.push({'desc':"Equip hoe"});
			a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
		}

		// ANN SICK EVENT
		if (dow == "SUN" && aff[ann_id] >= _SICK_EVENT_MIN && is_sunny == 0 && flags['sick_ann'] == 0) {
			a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1]});
		}

		if (vars['chickens'] > 1 && dow != "THURS") {
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (dow == "WED" || dow == "TUES") {
				var cliff_id = get_npc_id('cliff');
				a.push({'desc':((dow == "WED") ? "Talk (Ranch)" : "Talk (Beach)"), 'cid':cliff_id, 'val':2});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
			}

			// ELLI Beach
			if (dow == "MON") {
				a.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 'sel':(flags['new_mus_box'] == 0)});
				if (flags['new_mus_box'] == 1) {
					a[a.length - 1]['t2'] = "MusBox ";
					a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':true, 't2':a[a.length - 1]['desc']});
				}
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
					't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
					'sel':(vars['chickens'] == 0 || flags['new_chick'] < 2)
				});
				a.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':(vars['chickens'] > 0 && flags['new_chick'] >= 2),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
			}

			// ANN
			a.push({'desc':"Talk", 'cid':ann_id, 'val':1});
			a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(vars['potatoes'] == 0)});
			if (vars['potatoes'] > 0) {
				a[a.length - 1]['t2'] = "Potato";
				a.push({'desc':"Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':(vars['potatoes'] > 0), 't2':"Gift  "});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id];
					a[a.length - 1]['val'] = [1, 6];
				}
			}
		}

		if (d < 42 && is_sunny) {
			// Library closed; Mountain Visit

			// Strength Wish Power Berry
			if (vars['chickens'] > 0 && flags['berry_strength'] == 0) {
				a.push({'desc':"Wish for Strength", 'cid':'f_berry_strength', 'val':1, 'iid':'goddess', 'sel':false});
			}

			// BASIL
			if (["FRI", "SAT"].includes(dow)) {
				a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(vars['corn_waters'] < _CORN_GROW_DAYS), 't2':"Corn"});
				a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':(vars['corn_waters'] >= _CORN_GROW_DAYS),
					'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
					'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
				});
			}

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (["THURS", "FRI", "SAT", "SUN"].includes(dow)) {
				var cliff_id = get_npc_id('cliff');
				a.push({'desc':("Talk (" + ((dow == "FRI" || dow == "SAT") ? ("Fish Tent)") : ("Carp House)"))), 'cid':cliff_id, 'val':2});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
			}

			a.push({'desc':"ed, flow, wal, wal, cave all"});

			// MARIA
			a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sel':(flags['new_mus_box'] == 0)});
			a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
						'sel':(flags['new_mus_box'] == 1), 't2':"Talk (MTN / CHUR)"
			});
			a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});
			cur_maria_aff += (_MUS_BOX_AFF + 1);

			// SPRITE
			var sprite_id = get_npc_id('sprite');
			a.push({'desc':"Talk", 'cid':sprite_id, 'val':1});
			a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true});

			a.push({'desc':"mango, pond clover"});
		} // End of Mtn visit

		// CORN
		if (flags['corn_planted'] == 0) {
			a.push({'desc':"Buy / Plant Corn", 'iid':get_npc_id('lillia'), 'cid':['v_gold', 'f_corn_planted'], 'val':[-300, 1]});
		}

		// BASIL
		if (is_sunny && ["WED", "THURS"].includes(dow)) {
			a.push({'desc':("Talk (" + (dow == "WED") ? ("Flower Shop)") : ("Greenhouse)")), 'cid':basil_id, 'val':3});
			a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(vars['corn_waters'] < _CORN_GROW_DAYS), 't2':"Corn"});
			a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':(vars['corn_waters'] >= _CORN_GROW_DAYS),
				'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
				'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
			});
		}

		// ELLI
		// "Gift " <- one space
		if (!["SUN", "MON"].includes(dow)) {
			if (is_sunny == 0 && aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
				a.push({'desc':"Sick Event", 'cid':[elli_id, 'f_sick_elli'], 'val':[_SICK_EVENT_AFF, 1]});
			} else {
				a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk   "), 'cid':elli_id, 'val':1, 'sr':(aff[elli_id] == 0), 'sel':(flags['new_mus_box'] != 1)});
				if (flags['new_mus_box'] == 1) {
					a[a.length - 1]['t2'] = "MusBox ";
					a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':true, 't2':a[a.length - 1]['desc']});
				}
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
					't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
					'sel':(vars['chickens'] == 0 || flags['new_chick'] < 2)
				});
				a.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':(vars['chickens'] > 0 && flags['new_chick'] >= 2),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
			}
		}

		// RICK
		// "Gift  " <- two spaces
		if (is_sunny == 1) {
			// ANN in Ricks shop
			if (dow == "THURS") {
				a.push({'desc':"Talk", 'cid':ann_id, 'val':1, 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 't2':"Gift  ", 'sel':false});
			}
			if (!["WED", "SUN"].includes(dow)) {
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(dow != "SAT")});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"), 't0':"MusBox", 't3':"Talk  ",
						'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]
				});
			}
		}

		// MARIA SICK EVENT
		if (is_sunny == 0 && dow == "MON" && aff[maria_id] >= _SICK_EVENT_MIN && flags['sick_maria'] == 0) {
			a.push({'desc':"Sick Event", 'cid':[maria_id, 'f_sick_maria'], 'val':[_SICK_EVENT_AFF, 1]});
			a.push({'desc':"Talk", 'cid':mayor_id, 'val':3});
			a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
			cur_maria_aff += _SICK_EVENT_AFF;
		}

		// MAYOR
		var mayor_id = get_npc_id('mayor');
		if (dow == "SUN") {
			a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3});
			a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
			// Affection should keep up with Ricks.
			// If greater, gifts to the mayor arent required.
		} else if (is_sunny) {
			if (aff[mayor_id] == 0) { a.push({'desc':"Meet", 'cid':mayor_id, 'val':4}); }
			a.push({'desc':((dow == "SAT") ? "Talk (Lib 50%)" : "Talk"), 'cid':mayor_id, 'val':3, 'sr':(aff[mayor_id] == 0)});
			a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
		}

		// MARIA ANKLE / DREAM
		if (d >= 42 && dow != "MON" && flags['photo_maria'] == 0) {
			if (aff[maria_id] >= _ANKLE_EVENT_MIN && flags['ankle_maria'] == 0) {
				a.push({'desc':"Ankle Event (Library)", 'cid':[maria_id, 'f_ankle_maria'], 'cid':[_ANKLE_EVENT_AFF, 1]});
				a = visit_bar(a);
				cur_maria_aff += _ANKLE_EVENT_AFF;
			} else if (aff[maria_id] >= _DREAM_EVENT_MIN && flags['dream_maria'] == 0) {
				a.push({'desc':"Dream Event (Library)", 'cid':[maria_id, 'f_dream_maria'], 'cid':[_DREAM_EVENT_AFF, 1]});
				a = visit_bar(a);
				cur_maria_aff += _DREAM_EVENT_AFF;
			}
		}

		if ((aff[maria_id] + cur_maria_aff) >= _PHOTO_MIN && flags['photo_maria'] == 0) {
			a.push({'desc':"Photo Event", 'cid':[maria_id, 'f_photo_maria'], 'cid':[_PHOTO_EVENT_AFF, 1]});
		}

		if (d == 31) { // Fireworks Festival
			a.push({'desc':"Clear rocks on farm until 5 PM"});
			a = visit_bar(a);
			a.push({'desc':"Fireworks (Town Square)", 'cid':maria_id, 'val':5});
		}
	}

	return a;
}

function visit_bar(tmp_act = []) {
	var duke_id = get_npc_id('bartender');

	tmp_act.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
	tmp_act.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
	tmp_act.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true});
	return tmp_act
}
