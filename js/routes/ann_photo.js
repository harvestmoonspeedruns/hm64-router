function get_actions_ann_photo (d = 3, g = 300, is_sunny = 1) {
	// Ann photo

	var a = [];
	var ann_id = get_npc_id("ann");
	var rick_id = get_npc_id("rick");
	var dow = get_day_of_week(d, true);
	var ann_aff_total = aff[ann_id];

	if (d > 120) { 
		reset = true;
	} else if (d > 90 && flags['photo_ann'] == 0) {
		a.push({'desc':"Photo", 'cid':ann_id, 'val':_PHOTO_EVENT_AFF, })
	} else if (d == 3) {
		a.push({'desc':"Equip hoe"});
		a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
		a.push({'desc':'Till 3 x 3 Spot'});
	} else if (d == 23) {
		// Flower Festival, Spring 23
		a.push({'desc':"Go to Town Square", 'iid':get_npc_id('mayor'), 'imp':true});
		a.push({'desc':"Talk", 'cid':rick_id, 'val':2, 'sel':(aff[rick_id] < _RICK_FIX_MIN), 'red':(aff[rick_id] >= _RICK_FIX_MIN)});
		a.push({'desc':"Talk", 'cid':ann_id, 'val':2});
		a.push({'desc':"Dance", 'cid':ann_id, 'val':10, 'sr':true});
	} else if (["MON", "TUES", "THURS", "FRI"].includes(dow) && is_sunny == true && !is_festival(d)) {
		if (d > 3 && flags['potato_planted'] == 0) {
			a.push({'desc':"Equip Watering Can, Fill Watering Can"});
		}
		if (flags['treasure_map'] == 0) {
			a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'iid':get_npc_id("musbox")});
		}
		if (d != 4 && flags['old_mus_box'] == 0) {
			a.push({'desc':"Equip hoe"});
			a.push({'desc':"Dig Up Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			if (flags['treasure_map'] == 1) { a[a.length - 1]['iid'] = get_npc_id("musbox"); }
		}

		// Water Potatoes
		if ((flags['potato_planted'] == 1 && vars['potato_waters'] < _POTATO_GROW_DAYS) ||
				(flags['potato_planted_2'] == 1 && vars['potato_waters_2'] < _POTATO_GROW_DAYS)) {
			var tmp_cid = [];
			if (flags['potato_planted'] == 1 && vars['potato_waters'] < _POTATO_GROW_DAYS) {
				tmp_cid.push('v_potato_waters');
			}
			if (flags['potato_planted_2'] == 1 && vars['potato_waters_2'] < _POTATO_GROW_DAYS) {
				tmp_cid.push('v_potato_waters_2');
			}
			var tmp_val = [];
			for (var i = 0; i < tmp_cid.length; i++) {
				tmp_val.push(1);
			}
			a.push({'desc':"Equip Watering Can, Fill Watering Can"});
			a.push({'desc':"Water Potatoes", 'cid':tmp_cid, 'val':tmp_val});
		}
	
		if (d == 30) { a.push({'desc':"Collect All Potatoes",'imp':true}); }

		a.push({'desc':"ed, ber" + ((aff[rick_id] >= _RICK_FIX_MIN - 3) ? "" : ", flower")});

		// Dream Event
		if (aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1) {
			a.push({'desc':"Dream Event", 'cid':ann_id, 'val':_DREAM_EVENT_AFF});
			ann_aff_total += _DREAM_EVENT_AFF;
		}

		// Buy Potatoes
		if (d > 3 && flags['potato_planted'] == 0) {
			a.push({'desc':"Buy Potatoes", 'imp':true, 'iid':get_npc_id('lillia')});
		}

		// RICK
		if (dow == "THURS" && flags['new_mus_box'] == 0) {
			if (aff[rick_id] >= _CUTSCENE_RICK_ANN_MIN && aff[rick_id] < (_CUTSCENE_RICK_ANN_MIN + 2)) {
				a.push({'desc':"ENTER EXIT RICKS SHOP TO SKIP CUTSCENE", 'imp':true, 'iid':rick_id});
			}

			if (aff[rick_id] < 4) { a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk "}); }
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 't3':"Talk ", 'sr':(aff[rick_id] < 4), 'sel':(!(["WED", "SAT", "SUN"].includes(dow)))});
			a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3 && !(["WED", "SAT", "SUN"].includes(dow)))});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_FIX_MIN - 3 && !(["WED", "SAT", "SUN"].includes(dow)))});
		}

		// ANN
		if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4}); }
		a.push({'desc':("Talk (" + ((dow == "THURS") ? "MTNS / RICK SHOP)" : "Ranch)")), 'cid':ann_id, 'val':1,
				'sr':(aff[ann_id] == 0), 'sel':(flags['new_mus_box'] == 0), 't2':"Musbox"
		});
		a.push({'desc':"Musbox", 'cid':ann_id, 'val':_MUS_BOX_AFF, 'sr':true, 'sel':(flags['new_mus_box'] == 1), 't2':a[a.length - 1]['desc']});
		a.push({'desc':"Gift", 'cid':ann_id, 'val':1, 'sel':(vars['potato_waters'] < _POTATO_GROW_DAYS), 't2':"Potato", 'sr':true});
		a.push({'desc':"Potato", 'sr':true, 'sel':(vars['potato_waters'] >= _POTATO_GROW_DAYS), 't2':"Gift", 'sr':true,
			'cid':((flags['recipe_ann'] == 0) ? [ann_id, 'f_recipe_ann'] : ann_id),
			'val':((flags['recipe_ann'] == 0) ? [6, 1] : 3)
		});
		ann_aff_total += ((flags['new_mus_box'] == 0) ? 1 : _MUS_BOX_AFF);
		ann_aff_total += ((vars['potato_waters'] < _POTATO_GROW_DAYS) ? 1 : ((flags['recipe_ann'] == 0) ? 6 : 3));
		if (d == 4) { a.push({'desc':"RESET IF ANN NOT IN RICKS SHOP TODAY", 'imp':true}); }

		// RICK
		if (dow != "THURS" || flags['new_mus_box'] == 1) {
			if (aff[rick_id] >= _CUTSCENE_RICK_ANN_MIN && aff[rick_id] < (_CUTSCENE_RICK_ANN_MIN + 2)) {
				a.push({'desc':"ENTER EXIT RICKS SHOP TO SKIP CUTSCENE", 'imp':true, 'iid':rick_id});
			}

			if (aff[rick_id] < 4) { a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk "}); }
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 't3':"Talk ", 'sr':(aff[rick_id] < 4), 'sel':(!(["WED", "SAT", "SUN"].includes(dow)))});
			a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(aff[rick_id] >= _RICK_FIX_MIN - 3 && !(["WED", "SAT", "SUN"].includes(dow)))});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_FIX_MIN - 3 && !(["WED", "SAT", "SUN"].includes(dow)))});
		}

		// Plant Potatoes
		if (d > 3 && flags['potato_planted'] == 0) {
			a.push({'desc':"Equip Potato Seeds"});
			a.push({'desc':"Plant Potato Seeds", 'val':1, 'cid':'f_potato_planted', 'sr':true});
		}
	}

	if (flags['sick_ann'] == 0 && is_sunny == 0 && aff[ann_id] >= _SICK_EVENT_MIN && dow == "SUN" && !is_festival(d)) {
		// Sick Event
		a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1], 'imp':true});
	} else if (flags['ankle_ann'] == 0 && is_sunny == 1 && (aff[ann_id] + ann_aff_total) >= _ANKLE_EVENT_MIN && !is_festival(d)) {
		// Ankle Event
		a.push({'desc':"Ankle Event (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1]});
	}
	return a;
}