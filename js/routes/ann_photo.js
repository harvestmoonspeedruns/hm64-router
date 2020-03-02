function get_actions_ann_photo (d = 3, g = 300, is_sunny = 1) {
	// Ann photo

	/* REQUIREMENTS:
	 * - ANN at 200+ affection during Winter
	 * 
	 * AFFECTION:
	 * Ann: Meet = 4, Talk = 1, Gift = 1, Corn/Potato = 3, Recipe Boost = +3 (6 total)
	 * - Birthday: Summer 14 (+2 gift boost)
	 * Rick: Meet = 4, Talk/Musbox Fix = 3, Gift = 3
	 *
	 * Sick Event  - MIN: 120 | AFF: +10
	 * Dream Event - MIN: 160 | AFF: +8
	 * Ankle Event - MIN: 180 | AFF: +10
	 * Photo Event - MIN: 200
	 * 
	 * - You can only do one of the Dream / Sick / Ankle events per day
	 * - Anns Dream Event doesnt trigger during Winter
	 * - Unless Anns affection is well below yellow (156) near the end of Fall, play only sunny MON, TUES, FRI
	 * - Rick appears on THURSDAY, but Ann has a 25% chance of being at the vineyard (cutscene always plays first time)
	 * - On THURSDAY, Anns appearance is 25% by Fisherman Tent, 25% Outside Sprite Cave, 25% in Ricks Shop, 25% Vineyard
	 * - On SATURDAY, Ann will always appear, but Rick will only appear 50% of the time (only after 10:00 AM)
	 * - Ann will appear on the farm after 8:00 AM and in her Thursday location after 9:00 AM (10:00 for Ricks Shop)
	 *
	 *  NOTES:
	 * - Watering the top-middle potato plot starting ~Spr 21 will allow you to get one extra potato before Summer
	 * - Seeds come in packs of 8, but you can only fit 8 into your bag
	 * - On a rainy day in late Spring, you can take the extra potato to Ann bc the horse cutscene doesnt happen on rainy days
	 * - Playing a sunny Spring 25 (THURS) is a gamble, bc you can use that extra potato, but only if Ann is not at the Vineyard
	 * - Anns Sick Event will only occur on a rainy Sunday when her affection is 120 or greater
	 * 
	 * Minor time saves:
	 * - Skip Spr 3 because Rick doesnt show up on Wednesdays
	 * - Only look for Ann on Thursdays during Spring to avoid the horse cutscene (Spring Only Cutscene)
	 * - Fishing is faster than foraging to afford corn seeds, but requires good RNG
	 * - Talk to Rick at the Flower Festival for +2 affection
	 * - From the first fadeout in the house, it takes 33 seconds for Ann to appear on the ranch
	 * - From the first fadeout in the house, it takes 45 seconds for Ann sprite to appear in the mountains
	 * - Entering the Ricks Shop when he is at 40+ affection will trigger a cutscene; you can cancel it by exiting/re-entering
	 * - If you get a rainy Sunday, talk and gift her in the barn first before doing the sick event
	 * - Start clearing the mailbox a few at a time while waiting for Ann in Fall
	 * - The Photo Event wont occur on a snowy day, but the Sick Event will if it is a Sunday (Winter 1 for example)
	 */ 

	var a = [];
	var ann_id = get_npc_id("ann");
	var rick_id = get_npc_id("rick");
	var dow = get_day_of_week(d, true);

	var ann_aff_total = aff[ann_id];
	var total_g_needed = _PRICE_SEED_CORN; // + _PRICE_CAKE
	var aff_left = _PHOTO_MIN - aff[ann_id] - ((1 - flags['ankle_ann']) * _ANKLE_EVENT_AFF) -
					((1 - flags['dream_ann']) * _DREAM_EVENT_AFF) - ((1 - flags['sick_ann']) * _SICK_EVENT_AFF) -
					((d < 73) ? 12 : 0) - ((d < 24) ? 12 : 0);
	aff_left = ((aff_left < 0) ? 0 : aff_left);

	//console.log("AFF LEFT: " + aff_left);

	// Save scum sick event for Winter 1 if no sick event earlier
	if (flags['sick_ann'] == 0) {
		if (d == 89) {
			dontsave = true;
			a.push({'desc':"DONT SAVE TONIGHT", 'imp':true});
		} else if (d == 90) {
			a.push({'desc':"RESET IF NOT SNOWY TOMORROW", 'imp':true});
		}
	}

	if (flags['photo_ann'] == 1) {
		a.push({'desc':"DONE!", 'iid':ann_id});
	} else if (d > 120) {
		reset = true;
	} else if (d > 90 && flags['photo_ann'] == 0) {
		a.push({'desc':"Photo", 'cid':[ann_id, 'f_photo_ann'], 'val':[_PHOTO_EVENT_AFF, 1], 'sel':(aff[ann_id] >= _PHOTO_EVENT_AFF)});
	} else if (d == 3) {
		a.push({'desc':"Equip hoe - [Start Down A A Up A A B]"});
		a.push({'desc':"Greet the Mayor", 'iid':get_npc_id("mayor")});
		a.push({'desc':"Till 3x3 spot"});
	} else if (d == 4) {
		if (is_sunny == 0) { 
			a.push({'desc':"RESET", 'red':true});
		} else {
			a.push({'desc':"Start Timer on House-Farm loading screen", 'imp':true});
			a.push({'desc':"Equip Watering Can, Fill Watering Can", 'imp':true});
			a.push({'desc':"forage to goddess pond"});
			a.push({'desc':"Enter Carp Screen 54 seconds after leaving house [9 AM]"});

			// Potatoes
			a.push({'desc':"Buy Potatoes", 'cid':'v_gold', 'val':(-1 * _PRICE_SEED_POTATO), 'imp':true, 'iid':get_npc_id('lillia')});

			// RICK
			if (aff[rick_id] < 4) { a.push({'desc':"Meet ", 'cid':rick_id, 'val':4, 't0':"Talk "}); }
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 't3':"Talk ", 'sr':(aff[rick_id] < 4)});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':true});

			// ANN
			if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4}); }
			a.push({'desc':"Talk (MTNS / RICK SHOP)", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 't2':"Musbox", 'imp':true});
			a.push({'desc':"Musbox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
			a.push({'desc':"Gift", 'cid':ann_id, 'val':1, 'sr':true});
			a.push({'desc':"RESET IF ANN ISNT IN RICKS SHOP OR MTNS", 'red':true});

			a.push({'desc':"Equip Potato Seeds"});
			a.push({'desc':"Plant Potato Seeds", 'val':1, 'cid':'f_potato_planted', 'sr':true});
		}
	} else if ([23, 72].includes(d)) {
		// Flower Festival, Spring 23
		if (d == 23) {
			a.push({'desc':"Equip Watering Can", 'imp':true});
			a.push({'desc':"Water Potatoes", 'cid':'v_potato_waters', 'val':1, 'sr':true});
		}
		a.push({'desc':"Go to Town Square", 'iid':get_npc_id('mayor')});
		a.push({'desc':"Talk", 'cid':rick_id, 'val':2, 'sel':(aff[rick_id] < _RICK_FIX_MIN), 'red':(aff[rick_id] >= _RICK_FIX_MIN)});
		a.push({'desc':"Talk", 'cid':ann_id, 'val':2});
		a.push({'desc':"Dance", 'cid':ann_id, 'val':10, 'sr':true});
	} else if (d < 31) {
		// Spring
		if (dow == "THURS" && is_sunny == 1) {
			a.push({'desc':"Start Timer on House-Farm loading screen", 'imp':true});
		}
		if (is_sunny == 1 && d < 25 && ((_POTATO_GROW_DAYS - vars['potato_waters']) >= (25 - d)) && !(((_POTATO_GROW_DAYS - vars['potato_waters']) == (30 - d)))) {
			a.push({'desc':"Water Top Middle Potato", 'imp':true});
		}
		if ((d < 30 && ((_POTATO_GROW_DAYS - vars['potato_waters']) == (30 - d))) || (dow == "THURS" && is_sunny == 1)) {
			// Not enough rainy days left; must water potatoes OR sunny Thursday
			a.push({'desc':"Equip Watering Can", 'imp':((_POTATO_GROW_DAYS - vars['potato_waters']) == (30 - d)), 'sel':((_POTATO_GROW_DAYS - vars['potato_waters']) == (30 - d))});
			a.push({'desc':"Water Potatoes", 'cid':'v_potato_waters', 'val':1, 'sr':true, 'sel':([4, 25, 30].includes(d))});
			if (flags['treasure_map'] == 0 && d != 23) {
				a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'iid':get_npc_id("musbox"), 'sel':([4, 25, 30].includes(d))});
			}
			a.push({'desc':"Fill Watering Can", 'sr':true});
		} else if (d == 30) {
			if (_POTATO_GROW_DAYS > vars['potato_waters']) {
				a.push({'desc':"RESET IF NO POTATOES", 'red':true});
			}
			a.push({'desc':"Pocket 8 Potatoes", 'cid':['v_potatoes', 'f_potato_planted'], 'val':[8, (-1 * flags['potato_planted'])], 'imp':true});
			a.push({'desc':"Sell 1 Potato", 'cid':'v_gold', 'val':80, 'sr':true, 'sel':false});
			if (d == 30 && is_sunny == 0) {
				// TODO
			} else {
				a.push({'desc':"Ann is on the Farm Today (Horse Cutscene)", 'red':true, 'iid':ann_id});
			}
		}

		// Find Ann on Spring Thursdays
		if ((dow == "THURS" && is_sunny == 1) || (d == 30 && is_sunny == 0)) {
			a.push({'desc':("Enter " + ((d == 30) ? "Barn" : "Carp Screen") + " 45 seconds after leaving house [9 AM]")});

			// ANN
			if (aff[ann_id] == ((d > 23) ? 12 : 0)) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4}); }
			if (is_sunny == 0) {
				a.push({'desc':"Talk (Barn)", 'sr':(aff[ann_id] == 0),  't2':"Musbox", 'cid':ann_id, 'val':1, 'sel':false});
			} else {
				a.push({'desc':"Talk (MTNS / RICK SHOP)", 'sr':(aff[ann_id] == 0),  't2':"Musbox", 'cid':ann_id, 'val':1, 'sel':([4, 25, 30].includes(d))});
			}
			a.push({'desc':"Musbox", 'cid':[ann_id, 'f_new_musbox'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'], 'sel':false});
			a.push({'desc':"Gift", 'cid':ann_id, 'val':1, 't2':"Potato", 'sr':true, 'sel':(d < 5)});
			a.push({'desc':"Potato", 'sr':true, 'sel':([25, 30].includes(d)), 't2':"Gift", 'sr':true,
					'cid':((flags['recipe_ann'] == 0) ? [ann_id, 'f_recipe_ann', 'v_potatoes'] : [ann_id, 'v_potatoes']),
					'val':((flags['recipe_ann'] == 0) ? [6, 1, -1] : [3, -1])
			});

			// RICK
			if (is_sunny == 1) {
				if (dow != "SAT" && flags['cutscene_rick'] == 0 && aff[rick_id] >= _CUTSCENE_RICK_ANN_MIN) {
					a.push({'desc':"ENTER EXIT RICKS SHOP TO SKIP CUTSCENE", 'imp':true, 'iid':rick_id, 'cid':'f_cutscene_rick', 'val':1});
				}
				a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sel':([4, 25, 30].includes(d))});
				a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':([4, 25, 30].includes(d) && aff[rick_id] >= _RICK_FIX_MIN - 3)});
				a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':([4, 25, 30].includes(d) && aff[rick_id] < _RICK_FIX_MIN - 3)});
			}
		}
	} else if (d > 31 && is_sunny == 1 && ["MON", "TUES", "THURS", "FRI", "SAT"].includes(dow) && !is_festival(d)) { // || (d == 31 && g < (total_g_needed))) {
		if (dow != "SAT") {
			a.push({'desc':"Start Timer on House-Farm loading screen"});
		}
		var done_with_rick = 0;
		if (aff_left <= (((vars['potatoes'] > 0) ? 3 : 1) + ((flags['new_mus_box'] == 1) ? 6 : 1))) {
			a.push({'desc':"DONE WITH RICK", 'iid':rick_id, 'red':true});
			done_with_rick = 1;
		}

		if (d > 60 && flags['mailbox_cleared'] == 0) {
			// Fall
			a.push({'desc':"Clear mailbox", 'cid':'f_mailbox_cleared', 'val':1, 'sel':false});
		}

		if (d < 91 && flags['old_mus_box'] == 0) {
			if (flags['new_mus_box'] == 0 && flags['old_mus_box'] == 0 && d < 33) {
				a.push({'desc':"Equip HAMMER, Clear rocks to Music Box", 'imp':true});
			}
			a.push({'desc':"Equip hoe"});
			if (flags['treasure_map'] == 0) {
				a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'iid':get_npc_id("musbox"), 'sr':true});
			} else {
				a[a.length - 1]['iid'] = get_npc_id("musbox");
			}
			a.push({'desc':"Dig Up Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':(flags['treasure_map'] == 1), 'iid':get_npc_id("musbox"), 'sel':(flags['old_mus_box'] == 0 && !["THURS", "SAT"].includes(dow) && done_with_rick == 0)});
		}

		// Corn
		if ([_CORN_GROW_DAYS, _CORN_GROW_DAYS + 5].includes(vars['corn_waters']) && d < 61) {
			a.push({'desc':"Pick Corn", 'imp':true, 'cid':['v_potatoes', 'v_corn_waters'], 'val':[6, ((is_sunny == 1) ? 1 : 0)]});
		}

		// Dream Event
		if (aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1 && flags['dream_ann'] == 0) {
			a.push({'desc':"Dream Event", 'cid':[ann_id, 'f_dream_ann'], 'val':[_DREAM_EVENT_AFF, 1], 'sel':false});
		}

		if (flags['sick_ann'] == 1 && d != 31) {
			// Rick first after sick event
			if (dow != "SAT" && flags['cutscene_rick'] == 0 && aff[rick_id] >= _CUTSCENE_RICK_ANN_MIN) {
				a.push({'desc':"ENTER EXIT RICKS SHOP TO SKIP CUTSCENE", 'imp':true, 'iid':rick_id, 'cid':'f_cutscene_rick', 'val':1});
			}
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sel':(d == 32 || (!["THURS", "SAT"].includes(dow) && done_with_rick == 0)), 'red':(dow == "SAT" || done_with_rick == 1)});
			a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(!["THURS", "SAT"].includes(dow) && (aff[rick_id] >= (_RICK_FIX_MIN - 3)) && done_with_rick == 0)});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(dow != "SAT" && (aff[rick_id] < (_RICK_FIX_MIN - 3)) && done_with_rick == 0)});
		}

		// ANN
		if (d != 31 || g < (total_g_needed)) {
			// If Not Fireworks Festival OR (Fireworks Fest AND not enough money for required items)

			if (dow == "THURS") {
				a.push({'desc':"Enter Carp Screen 54 seconds after leaving house [9 AM]"});
			} else {
				a.push({'desc':"Enter/Exit Barn 33 seconds after leaving house [8 AM]"});
			}
/*
			// Anns Birthday
			// OBSOLETE [kept for reference]
			if (d == 44) {
				a.push({'desc':"Ann's BIRTHDAY", 'imp':true, 'iid':ann_id});
				if (flags['cake_for_ann'] == 1 || g >= _PRICE_CAKE) {
					a.push({'desc':"CAKE for Ann Today", 'sr':true});
				}
			}
*/
			//if (aff[ann_id] == 12) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4}); }
			a.push({'desc':("Talk (" + ((dow == "THURS") ? "MTNS / RICK SHOP)" : "Ranch)")),
					't2':"Musbox", 'cid':ann_id, 'val':1, 'sel':(aff[ann_id] < _PHOTO_MIN && (aff[rick_id] < (_RICK_FIX_MIN - 3)) && (d == 32 || !["SAT", "THURS"].includes(dow))), 'red':(d != 32 && ["SAT", "THURS"].includes(dow) && aff_left > 0)
			});
			a.push({'desc':"Musbox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
					't2':a[a.length - 1]['desc'], 'sel':(aff[ann_id] < _PHOTO_MIN && (aff[rick_id] >= (_RICK_FIX_MIN - 3)) && !["SAT", "THURS"].includes(dow))
			});
			a.push({'desc':"Gift", 'cid':ann_id, 'val':((d == 44) ? 1 : 3), 't2':"Corn", 'sr':true, 'sel':false});
			if (flags['recipe_ann'] == 0) {
				a[a.length - 1]['t2'] = ["Potato", "Corn"];
				a.push({'desc':"Potato", 'sr':true, 'sel':(vars['potatoes'] > 0), // && (d != 44 || (flags['cake_for_ann'] == 0 && g < _PRICE_CAKE))),
					't2':["Gift", "Corn"], 'sr':true,
					'cid':((flags['recipe_ann'] == 0) ? [ann_id, 'f_recipe_ann', 'v_potatoes'] : [ann_id, 'v_potatoes']),
					'val':((flags['recipe_ann'] == 0) ? [((d == 44) ? 6 : 8), 1, -1] : [((d == 44) ? 3 : 5), -1])
				});
				if (d == 44) { a[a.length - 1]['val'][0] += 2; }
				a.push({'desc':"Corn", 'sr':true, 't2':"Gift", 'sr':true, 'cid':ann_id, 'val':3, 't2':["Gift", "Potato"], 'sel':false});
				if (d == 44) { a[a.length - 1]['val'][0] += 2; }
			} else {
				a[a.length - 1]['t2'] = "Corn/Potato";
				a.push({'desc':"Corn/Potato", 'sr':true, 'sel':(aff[ann_id] < _PHOTO_MIN && (d == 32 || !["SAT", "THURS"].includes(dow))), // 'sel':((d != 44 || (flags['cake_for_ann'] == 0 && g < _PRICE_CAKE)) && (d > 32 && !["SAT", "THURS"].includes(dow))),
						't2':"Gift", 'sr':true, 'cid':[ann_id, 'v_potatoes'], 'val':[((d == 44) ? 1 : 3), -1]
				});
/*
				// Anns Birthday
				// OBSOLETE [kept for reference]
				if (d == 44 && (flags['cake_for_ann'] == 1 || g >= _PRICE_CAKE)) {
					a.push({'desc':"CAKE", 't2':["Corn/Potato", "Gift"], 'sr':true, 'cid':ann_id, 'val':5});
				}
*/
			}
			ann_aff_total += 9;
		}
/*
		// Forage for CAKE and CORN money
		// OBSOLETE [kept for reference]
		if (d == 31 && g < (_PRICE_SEED_CORN + _PRICE_CAKE)) {
			a.push({'desc':"FORAGE:", 'imp':true});
			a.push(forage((_PRICE_SEED_CORN + _PRICE_CAKE), g, d));
			a[a.length - 1]['sr'] = true;
			a.push({'desc':"SELL ALL", 'sr':true});
		}
*/
		// Corn
		if (flags['potato_planted'] == 0 && g >= _PRICE_SEED_CORN) {
			// Using "potato_planted" flag for both Corn and Potatoes
			a.push({'desc':"Buy Corn", 'imp':true, 'iid':get_npc_id('lillia'), 'cid':'v_gold', 'val':(-1 * _PRICE_SEED_CORN)});
		}

/*
		// Cake for Ann's BDAY
		// OBSOLETE [kept for reference]
		if (dow != "MON" && d > 32 && d < 45 && flags['cake_for_ann'] == 0 && (g >= (_PRICE_CAKE + ((flags['potato_planted'] == 0) ? _PRICE_SEED_CORN : 0)))) {
			// Buy Cake for Ann
			a.push({'desc':"Buy Cake for Ann", 'iid':get_npc_id('jeff'), 'imp':(d > 42), 'cid':['f_cake_for_ann', 'v_gold'], 'val':[1, (-1 * _PRICE_CAKE)]});
		}
*/

		if (flags['sick_ann'] == 0 && d != 31) {
			// Rick second before sick event
			if (dow != "SAT" && flags['cutscene_rick'] == 0 && aff[rick_id] >= _CUTSCENE_RICK_ANN_MIN) {
				a.push({'desc':"ENTER EXIT RICKS SHOP TO SKIP CUTSCENE", 'imp':true, 'iid':rick_id, 'cid':'f_cutscene_rick', 'val':1});
			}
			a.push({'desc':"Talk ", 'cid':rick_id, 'val':3, 'sel':((d == 32 || !["THURS", "SAT"].includes(dow)) && done_with_rick == 0), 'red':(dow == "SAT" || done_with_rick == 1)});
			a.push({'desc':"MusBox Fix", 'cid':['f_new_mus_box', 'f_old_mus_box'], 'val':[1, -1], 'sr':true, 'sel':(!["THURS", "SAT"].includes(dow) && (aff[rick_id] >= (_RICK_FIX_MIN - 3)) && done_with_rick == 0)});
			a.push({'desc':"Gift ", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(((d == 32 || !["THURS", "SAT"].includes(dow)) && (aff[rick_id] < (_RICK_FIX_MIN - 3))) && done_with_rick == 0)});
		}

		// Corn
		if (flags['potato_planted'] == 0 && g >= _PRICE_SEED_CORN) {
			a.push({'desc':"Equip Corn Seeds"});
			a.push({'desc':"Plant Corn Seeds", 'val':1, 'cid':'f_potato_planted', 'sr':true});
			a.push({'desc':"Equip Watering Can"});
			a.push({'desc':"Water Corn", 'val':1, 'cid':'f_corn_waters', 'sel':false, 'sr':true});
		}
	} else if (flags['sick_ann'] == 0 && is_sunny == 0 && aff[ann_id] >= _SICK_EVENT_MIN && dow == "SUN" && !is_festival(d)) {
		// Sick Event
		a.push({'desc':"Talk (BARN)", 'cid':ann_id, 'val':1, 't2':"Musbox",
				'sel':(flags['new_mus_box'] == 0 && !["THURS", "SAT"].includes(dow))
		});
		a.push({'desc':"Musbox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':(flags['new_mus_box'] == 1 && !["THURS", "SAT"].includes(dow)), 't2':a[a.length - 1]['desc']});
		a.push({'desc':"Gift", 'cid':ann_id, 'val':1, 'sel':(vars['corn_waters'] < _CORN_GROW_DAYS), 't2':"Corn/Potato", 'sr':true});
		a.push({'desc':"Corn/Potato", 'sr':true, 'sel':(!["THURS", "SAT"].includes(dow) && vars['corn_waters'] >= _CORN_GROW_DAYS),
				't2':"Gift", 'sr':true, 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1]
		});
		a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1], 'imp':true});
	}
	if (flags['ankle_ann'] == 0 && is_sunny == 1 && ann_aff_total >= _ANKLE_EVENT_MIN && !is_festival(d)) {
		// Ankle Event
		a.push({'desc':"Ankle Event (Crossroads from Farm)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
	}
	// Corn
	if (d < 60 && flags['potato_planted'] == 1 && d > 31 && is_sunny == 1 && vars['corn_waters'] <= (_CORN_GROW_DAYS + 5)) {
		a.push({'desc':"Equip Watering Can",
				'imp':((((_CORN_GROW_DAYS + 5) - vars['corn_waters']) == (30 - d)) || (vars['corn_waters'] < _CORN_GROW_DAYS && !["MON", "TUES", "FRI"].includes(dow))),
				'red':(vars['corn_waters'] >= (_CORN_GROW_DAYS + 5))
		});
		a.push({'desc':"Water Corn", 'val':1, 'cid':'v_corn_waters', 'sr':true,
				'sel':((vars['corn_waters'] < _CORN_GROW_DAYS) || (vars['corn_waters'] < (_CORN_GROW_DAYS + 5) && !["WED", "THURS", "SAT", "SUN"].includes(dow)))
		});
	}
	
	a.push({'desc':("Aff Left: " + aff_left), 'iid':ann_id, 'dev':true});
/*
	// Fireworks if foraging
	// OBSOLETE [kept for reference]
	if (d == 31 && g < (_PRICE_SEED_CORN + _PRICE_CAKE)) {
		a.push({'desc':"TEXT GLITCH (Examine Axe in Start Menu)", 'imp':true});
		a.push({'desc':"Enter Ranch after 6 PM", 'iid':ann_id});
		a.push({'desc':"Fireworks (Ranch)", 'cid':ann_id, 'val':5, 'sr':true});
	}
*/
	return a;
}
