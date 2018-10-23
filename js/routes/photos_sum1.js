function actions_photos_sum_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var maria_id = get_npc_id('maria');
	var elli_id = get_npc_id('elli');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);

	if (is_festival(d)) { // Vegetable (Sum 9), Sea (Sum 24)
		
		
	} else if (d == 31) { // Fireworks Festival
		// TODO: Sprite, Clear Farm
		
		// BAR
		var duke_id = get_npc_id('bartender');
		a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
		a.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
		a.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true});

		// Fireworks with Maria
		a.push({'desc':"Fireworks (Town Square)", 'cid':maria_id, 'val':5});
	} else {
		
		// TODO: corn waters
		/*
		if (vars['potato_waters'] < 6 && is_sunny && vars['openers'] > 0 && !get_horse) {
			a.push({'desc':"Equip Watering Can"});
			if (vars['watering_can_fill'] < 10) {
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true});
			}
			a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sr':true});
		}
		*/
		
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
		if (!flags['old_mus_box']) {
			// dig music box
			a.push({'desc':"Equip hoe"});
			if (!flags['treasure_map']) {
				a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'sr':true});
			}
			a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
		}
		
		// TODO: Maria dream = bar visit
		
		// Maria back in Library on Summer 11
	}

	return a;
}