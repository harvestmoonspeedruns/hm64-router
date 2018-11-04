function actions_photos_fall_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var elli_id = get_npc_id('elli');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);
	var restore_vineyard_id = -1;

	if (d == 61) {
		a.push({'desc':"Equip Scythe, Chop Old Corn"});
	} else if (d == 65 || d == 71) { // Fall 5 & 11
		flags['dontsave'] = true;
	} else if (d == 66 || d == 68) { // Fall 6 & 8
		a.push({'desc':"Check Weather, RESET IF RAINY TOMORROW", 'imp':true});
	} else if (d == 90) {
		a.push({'desc':"Ignore Doug", 'imp':true, 'iid':get_npc_id('doug')});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	}

	// Chicken Inside / Outside; New Chicken
	var to_coop = false;
	var chicken_id = get_npc_id('chicken');
	if (vars['chickens'] > 0 && is_sunny != flags['chicken_outside']) {
		// Put chicken inside or outside
		to_coop = true;
		a.push({'desc':("Put Chicken " + ((flags['chicken_outside'] == 0) ? "Out" : "In") + "side"), 'cid':'f_chicken_outside', 'val':((is_sunny == 0) ? -1 : 1), 'imp':true, 'iid':chicken_id});
	} else if (is_sunny == 0) {
		a.push({'desc':"Feed Chicken", 'cid':'v_feed', 'val':-1, 'imp':true, 'sr':to_coop, 'iid':chicken_id});
		to_coop = true;
	}
	if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
		a.push({'desc':"New Chicken", 'sr':to_coop});
		if (!to_coop) { a[a.length - 1]['iid'] = chicken_id; }
		to_coop = true;
	}

	if (is_festival(d) || d == 71) {
		// 4, 12, 20, 28
		// Cow Fest, Harvest Fest, Egg Fest, Horse Fest

		// Horse Affection
		var horse_id = get_npc_id('horse');
		if (flags['horse_brush'] == 1) { a.push({'desc':"Equip brush", 'iid':horse_id}); }
		a.push({'desc':"Whistle / Ride Horse", 'val':2, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1), 'sel':(to_coop || d == 88)});
		a.push({'desc':"Brush Horse", 'val':2, 'cid':horse_id, 'sr':true, 'sel':(flags['horse_brush'] == 1 && (to_coop || d == 88))});

		// New Chick
		if (flags['new_chick'] == 1) {
			a.push({'desc':"New Chick", 'iid':get_npc_id('chicken'), 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1], 'sel':(to_coop && d != 72)});
		}

		// Feed dog
		a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});

		if (d == 72) { // Fall 12
			// Harvest Festival
			a.push({'desc':'Win Harvest King', 'val':1, 'cid':'f_harvest_king', 'iid':mayor_id, 'imp':true});
			if (aff[mayor_id] < _PARTY_ATTEND_MIN) {
				a.push({'desc':"Talk", 'cid':mayor_id, 'val':2});
			}
			if (aff[cliff_id] >= 100 && aff[cliff_id] < _PARTY_ATTEND_MIN) {
				a.push({'desc':"Talk", 'cid':cliff_id, 'val':2});
			}
			a.push({'desc':"Dance with Ann", 'val':12, 'cid':ann_id, 't2':"Dance with Ann"});
			a.push({'desc':"Dance with Elli", 'val':12, 'cid':elli_id, 'sel':false, 't2':"Dance with Elli"});
			a.push({'desc':"RESET IF NOT KING", 'imp':true});

		} else if (d == 88) { // Fall 28
			// Horse Race
			a = betting_table(a);
		}
	} else {
		// Horse Affection
		var horse_id = get_npc_id('horse');
		if (flags['horse_brush'] == 1) { a.push({'desc':"Equip brush", 'iid':horse_id}); }
		a.push({'desc':"Whistle / Ride Horse", 'val':2, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1)});
		a.push({'desc':"Brush Horse", 'val':2, 'cid':horse_id, 'sr':true, 'sel':(flags['horse_brush'] == 1)});

		// New Chick
		if (flags['new_chick'] == 1) {
			a.push({'desc':"New Chick", 'iid':get_npc_id('chicken'), 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1]});
		}

		// Music Box Dig
		if (flags['old_mus_box'] == 0 && d != 31 && (aff[ann_id] < (_PHOTO_MIN - ((flags['new_mus_box'] == 1) ? _MUS_BOX_AFF : 0)))) {
			// dig music box
			a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
			a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
		}

		// ANN ANKLE
		if (flags['ankle_ann'] == 0 && aff[ann_id] >= _ANKLE_EVENT_MIN && is_sunny == 1) {
			// ANKLE EVENT
			a.push({'desc':"Ankle (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
		}

		if (d >= 83 && d <= 87) {
			// Bridge Work
			var mas_carp_id = get_npc_id('mas_carpenter');
			a.push({'desc':"Bridge Work", 'val':[5, 5, 5, 1, 1000], 'iid':mas_carp_id,
					'cid':[mas_carp_id, get_npc_id('carpenter_top'), get_npc_id('carpenter_bot'), 'v_bridge_days_worked', 'v_gold'],
			});
		}

		if (d < 63 && aff[basil_id] < _BASIL_BERRY_MIN && is_sunny == 1) {
			// BASIL
			// "Talk   " <- 3 spaces
			// "Gift   " <- 3 spaces
			a.push({'desc':"Talk (MTN) ", 'cid':basil_id, 'val':3});
			a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':true, 't2':"Corn"});
			a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':false,
					'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
					'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
			});
		}

		// CLIFF
		// " Gift" <- -1 spaces
		// " Egg" <- -1 spaces
		if (["FRI", "SAT"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN && is_sunny == 1) {
			a.push({'desc':"Talk (Fish Tent 50%)", 'cid':cliff_id, 'val':2, 'sel':false});
			a.push({'desc':" Gift", 't2':" Egg ", 'cid':cliff_id, 'val':4, 'sel':false, 'sr':true});
			a.push({'desc':" Egg ", 't2':" Gift", 'cid':cliff_id, 'val':8, 'sel':false, 'sr':true});
		}

		if ((d < 67 && flags['vineyard_restored'] == 0 && is_sunny == 1) || [61, 67, 69].includes(d) ||
			(flags['dream_ann'] == 0 && aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1) ||
			(aff[cliff_id] < 100 && (dow == "THURS" || (is_sunny == 0 && dow != "TUES")))) {
			// Mountain Visit

			a.push({'desc':"Mountain forage"});

			// ANN DREAM
			if (flags['dream_ann'] == 0 && aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1) {
				a.push({'desc':"Dream Event (Cave)", 'cid':[ann_id, 'f_dream_ann'], 'val':[_DREAM_EVENT_AFF, 1]});
			}

			// TODO: Sprite recipe affection?
			var sprite_recipe_aff = 3;

			// SPRITE
			// "  Talk" <- -3 spaces
			// "  Gift" <- -3 spaces
			var sprite_id = get_npc_id('sprite');
			if (aff[sprite_id] < _SPRITE_WINE_MIN) {
				a.push({'desc':"Mushroom", 't2':"   Gift",
						'cid':((flags['recipe_sprite'] == 0) ? ['f_recipe_sprite', sprite_id] : sprite_id),
						'val':((flags['recipe_sprite'] == 0) ? [1, sprite_recipe_aff] : 2)
				});
			}
			if (flags['vineyard_restored'] == 0 && d < 67) {
				a.push({'desc':"   Talk", 'cid':sprite_id, 'val':1, 'sr':(aff[sprite_id] < _SPRITE_WINE_MIN)});
				a.push({'desc':"   Gift", 'cid':sprite_id, 'val':1, 'sr':true, 'sel':(aff[sprite_id] < _SPRITE_WINE_MIN)});
				if (aff[sprite_id] < _SPRITE_WINE_MIN) { a[a.length - 1]['t2'] = "Mushroom"; }
			}

			// CLIFF
			// " Gift" <- -1 spaces
			// " Egg " <- -1 spaces
			if (aff[cliff_id] < _PARTY_ATTEND_MIN && (dow == "THURS" || (is_sunny == 0 && dow != "TUES"))) {
				a.push({'desc':("Talk (" + ((dow == "THURS") ? "Cave)" : "In Carp House)")), 'cid':cliff_id, 'val':2});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':(vars['chickens'] == 0)});
				a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':(vars['chickens'] > 0)});
			}

			// Grapes for Bartender on Fall 1
			if (d == 61) {
				a.push({'desc':"Get Grapes for bartender", 'imp':true, 'iid':get_npc_id('bartender')});
			}

			// Restore the Vineyard
			if (flags['vineyard_restored'] == 0 && aff[sprite_id] >= (_SPRITE_WINE_MIN - ((flags['recipe_sprite'] == 1) ? 2 : sprite_recipe_aff)) && aff[get_npc_id('bartender')] >= _DUKE_WINE_MIN && is_sunny == 1) {
				a.push({'desc':"Restore the Vineyard", 'cid':['f_vineyard_restored', 'f_dontsave'], 'val':[1, 1], 'iid':get_npc_id('goddess'), 'sel':false, 'imp':true});
				restore_vineyard_id = a.length - 1;
			} else if (vars['chickens'] > 0 && flags['berry_strength'] == 0) {
				// Strength Wish Power Berry
				a.push({'desc':"Wish for Strength", 'cid':'f_berry_strength', 'val':1, 'iid':'goddess', 'sel':false});
			}
		} else {
			a.push({'desc':"edible, mushroom"});
		}

		// ANN
		if (flags['new_mus_box'] == 1 && (flags['ankle_ann'] == 1 || aff[ann_id] < _ANKLE_EVENT_MIN)) {
			a = ranch_stuff(a, dow, is_sunny);
			if (flags['ankle_ann'] == 0 && aff[ann_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 2) && is_sunny == 1) {
				// ANKLE EVENT
				a.push({'desc':"Ankle (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
			}
		}

		// ELLI
		// "Gift " <- one space
		// "Talk " <- one space
		if (aff[elli_id] < _PHOTO_MIN && dow != "MON") {
			if (is_sunny == 0 && aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
				a.push({'desc':"Sick Event (Bakery)", 'cid':[elli_id, 'f_sick_elli'], 'val':[_SICK_EVENT_AFF, 1]});
			} else if (dow != "SUN"){
				a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk "), 'cid':elli_id, 'val':1, 'sr':(aff[elli_id] == 0), 'sel':(flags['new_mus_box'] != 1)});
				if (flags['new_mus_box'] == 1) {
					a[a.length - 1]['t2'] = "MusBox ";
					a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':true, 't2':a[a.length - 1]['desc']});
				}
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true, 't2':"Egg ",
					'sel':(vars['chickens'] == 0 || flags['new_chick'] == 1)
				});
				a.push({
					'desc':"Egg ", 'sr':true, 't2':"Gift ",
					'sel':(vars['chickens'] > 0 && flags['new_chick'] == 1),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
				if (flags['dream_elli'] == 0 && aff[elli_id] >= (_DREAM_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					a.push({'desc':"Dream (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
				}
				if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					a.push({'desc':"Ankle (MTN)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
				}
			}
		}

		// RICK
		// "Gift    " <- 4 spaces
		// "Talk    " <- 4 spaces
		if (is_sunny == 1 && !["WED", "SUN"].includes(dow) && aff[ann_id] < _PHOTO_MIN) {
			a.push({'desc':"Talk    ", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT")});
			a.push({'desc':"Gift    ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
			a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"), 't3':"Talk    ",
					'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]
			});
			if (vars['gold'] >= 500 && flags['horse_brush'] == 0) {
				a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true});
			}

			// ANN in Ricks Shop
			// "Gift  " <- 2 spaces
			if (dow == "THURS") {
				a.push({'desc':"Talk (Ricks Shop)", 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':false});
				a.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':"Talk (Ricks Shop)", 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato", 'sel':false});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 't2':"Gift  ", 'sel':false});
				if (flags['ankle_ann'] == 0 && aff[ann_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 2) && aff[ann_id] < _ANKLE_EVENT_MIN && is_sunny == 1) {
					// ANKLE EVENT
					a.push({'desc':"Ankle (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false, 'sr':(dow != "SAT" || aff[ann_id] < 150)});
				}
			}

			// MAYOR
			// "  Talk" <- -2 spaces
			// "  Gift" <- -2 spaces
			if ((dow != "SAT" || aff[ann_id] < 150) && aff[mayor_id] < _PARTY_ATTEND_MIN) {
				// TODO: When Ann aff >= 153, Watermelon cutscene occurs with Maria
				// Dont enter second village screen when Ann's affection >= ~153
				// (Not sure what the min value for this is, but it happened for me at 153)
				// 118 < trigger < 154
				a.push({'desc':((dow == "SAT") ? "Talk (Rick Shop 50%)" : "  Talk"), 'cid':mayor_id, 'val':3, 'sel':(dow != "SAT")});
				a.push({'desc':"  Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id] && dow != "SAT")});
			}
		}

		// ANN
		if (flags['new_mus_box'] == 0 && (flags['ankle_ann'] == 1 || aff[ann_id] < _ANKLE_EVENT_MIN) && is_sunny == 1 &&
				dow != "SUN" && (dow != "WED" || aff[cliff_id] < _PARTY_ATTEND_MIN)) {
			a = ranch_stuff(a, dow, is_sunny);
			if (flags['ankle_ann'] == 0 && aff[ann_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 2)) {
				// ANKLE EVENT
				a.push({'desc':"Ankle (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
			}
		}

		if ([61, 67, 69].includes(d)) {
			a.push({'desc':"Equip hammer, clear farm"});
			a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sel':false, 'sr':true});
			if (d == 61) {
				// BAR
				var duke_id = get_npc_id('bartender');
				a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
				a.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
				a.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true});
			} else {
				a.push({'desc':(((d == 67) ? "Karen" : "Elli") + " Photo at 6 PM"), 'imp':true, 'val':[_PHOTO_EVENT_AFF, 1] });
				a[a.length - 1]['cid'] = ((d == 67) ? [get_npc_id('karen'), 'f_photo_karen'] : [elli_id, 'f_photo_elli']);
			}
		}

		if (d == 87) { a.push({'desc':"Sell Everything; Dog Race is Tomorrow!", 'imp':true}); }

		// Feed dog
		a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
	}

	// If restoring the vineyard, turn off everything below it
	if (restore_vineyard_id != -1) {
		var tmp_t2 = [];
		var tmp_t1 = [];
		for (var i = restore_vineyard_id + 1; i < a.length; i++) {
			tmp_t2.push(a[i]['desc']);
			if (a[i]['sel'] !== false) {
				tmp_t1.push(a[i]['desc']);
			}
		}
		a[restore_vineyard_id]['t1'] = tmp_t1;
		a[restore_vineyard_id]['t2'] = tmp_t2;
	}
	return a;
}

function ranch_stuff(tmp_act = [], dow = get_dow(vars['day']), is_sunny = 1) {
	if (dow != "THURS") {
		if (vars['chickens'] > 1) {
			tmp_act.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});
		}

		var mus_box_give = ((flags['new_mus_box'] == 1) || (is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)));

		// ANN
		// "Gift  " <- 2 spaces
		if (aff[ann_id] < _PHOTO_MIN) {
			var ann_id = get_npc_id('ann');
			tmp_act.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch)")), 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':(!mus_box_give)});
			tmp_act.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':tmp_act[tmp_act.length - 1]['desc'], 'sel':mus_box_give});
			tmp_act.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato"});
			tmp_act.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc']});
		}

		if (is_sunny == 1) {
			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			var cliff_id = get_npc_id('cliff');
			if (["TUES", "WED"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN && (aff[elli_id] < 170 || dow == "WED")) {
				// Beach cutscene between Karen and Elli occurs when Elli is >= 170-ish

				tmp_act.push({'desc':("Talk (" + ((dow == "WED") ? "Ranch) " : "Beach) ")), 'cid':cliff_id, 'val':2});
				tmp_act.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true});
				tmp_act.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc'], 'sr':true});
			}

			// ELLI Beach
			// "Gift " <- 1 space
			var elli_id = get_npc_id('elli');
			if (dow == "MON" && aff[elli_id] < 170) {
				// Cutscene between Karen and Elli occurs when Elli is >= 170-ish,
				// so to avoid this cutscene, dont visit the beach when Elli is >=170
				// (The lowest Ive seen it is 174, but 170 to be safe)

				tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox "});
				tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1],
							'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc']});
				tmp_act.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
							't2':"Egg ", 'sel':(vars['chickens'] == 0 || flags['new_chick'] < 2)
				});
				tmp_act.push({
					'desc':"Egg ", 'sr':true, 't2':"Gift ", 'sel':(vars['chickens'] > 0 && flags['new_chick'] >= 2),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
				if (flags['dream_elli'] == 0 && aff[elli_id] >= (_DREAM_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					tmp_act.push({'desc':"Dream (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
				}
				if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					tmp_act.push({'desc':"Ankle (MTN)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
				}
			}
		}
	}
	return tmp_act;
}