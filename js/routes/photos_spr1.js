function actions_photos_spr_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var maria_id = get_npc_id('maria');
	var elli_id = get_npc_id('elli');
	var rick_id = get_npc_id('rick');
	var ann_id = get_npc_id('ann');

	var ed_ber_flow = false;
	var dow = get_dow(d, true);
	
	/* Openers:
	* 0 - plant potatoes
	* 1 - bmf glitch
	* 2+ - chickens / music box
	*/

	var get_horse = (vars['chickens'] == 0 && g >= 1500 && dow != "THURS" && is_sunny);

	if (vars['openers'] == 0) { a.push({'desc':"Equip hoe"}); }

	if (d == 3) { // Spring 3
		a.push({'desc':"Greet the Mayor", 'iid':get_npc_id('mayor')});
		a.push({'desc':"Straight down; "});
	}

	// New Chicken
	var chicken_id = get_npc_id('chicken');
	if (vars['new_chicken_days'].includes(d)) {
		a.push({'desc':"New Chicken", 'iid':chicken_id});
	}

	if (is_festival(d)) {
		// Planting (Spr 8), Horse Race (Spr 17), Flower Fest (Spr 23)

		if (d == 23) { // Flower Fest
			if (vars['gold'] >= 1000) {
				a.push({'desc':"Buy a Power Nut", 'cid':['f_berry_flowerfest','v_gold'], 'val':[1, -1000], 'iid':get_npc_id('salesman')});
			}
			a.push({'desc':"Dance with Maria", 'cid':maria_id, 'val':12, 't2':"Dance with Ann"});
			a.push({'desc':"Dance with Ann", 'cid':get_npc_id('ann'), 'val':12, 't2':"Dance with Maria", 'sel':false});
		}

	} else {
		if (d == 15) { a.push({'desc':"Ignore Basil on the Farm", 'iid':get_npc_id('basil')}); }

		if (vars['openers'] == 0) {
			a.push({'desc':'Till 9x9 plot', 'sr':(d == 3)});
		}

		if (vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny && vars['openers'] > 0 && !get_horse) {
			a.push({'desc':"Equip Watering Can"});
			if (vars['watering_can_fill'] < 10) {
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true});
			}
			a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sr':true});
		}
		
		if (vars['chickens'] > 0 && flags['new_chick'] <= 1) {
			var chicken_id = get_npc_id('chicken');
			// new chk | incubate
			if (flags['new_chick'] == 1) {
				a.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1],
					'sr':(vars['new_chicken_days'].includes(d) && vars['potato_waters'] >= _POTATO_GROW_DAYS), 't0':"Incubate"
				});
			}
			a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'iid':chicken_id,
				'sr':(flags['new_chick'] == 1 || (vars['new_chicken_days'].includes(d) && vars['potato_waters'] >= _POTATO_GROW_DAYS))});
			if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
		}
		if (is_sunny == 1 && flags['chicken_outside'] == 0) {
			a.push({'desc':"Bring Chicken Outside", 'val':1, 'cid':'f_chicken_outside', 'iid':get_npc_id('chicken')});
		} else if (is_sunny == 0 && flags['chicken_outside'] == 1) {
			a.push({'desc':"Bring Chicken Inside", 'val':-1, 'cid':'f_chicken_outside', 'iid':get_npc_id('chicken')});
		}

		if (sell_stuff) { a.push({'desc':"Sell Stuff"}); }

		// Music Box Dig
		if (vars['openers'] >= 2 && !flags['old_mus_box'] && !get_horse) {
			// dig music box
			a.push({'desc':"Equip hoe"});
			if (!flags['treasure_map']) {
				a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'sr':true});
			}
			a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
		}

		if (vars['potatoes'] > 0 && (vars['chickens'] > 1 || (["WED", "THURS"].includes(dow) && is_sunny == 1))) {
			a.push({'desc':"Get Potato for Ann", 'iid':ann_id});
		}

		if ([3, 5, 6].includes(d) && aff[get_npc_id('karen')] < 50) {
			a.push({'desc':"Dog to Crossroads"});
		}

		if (!flags['fishing_rod']) {
			a.push({'desc':"Get Fishing Rod", 'val':1, 'cid':'f_fishing_rod', 'iid':get_npc_id('fisherman')});
		}

		if ((vars['chickens'] == 0 && g < 1500) || (dow == "MON" && is_sunny)) {
			// Mountain visit
			// No chicken yet || MONDAY

			// SPRITE
			var sprite_id = get_npc_id('sprite');
			if (aff[sprite_id] == 0) {
				a.push({'desc':"Meet", 'cid':sprite_id, 'val':5});
			}
			a.push({'desc':"Talk", 'cid':sprite_id, 'val':1, 'sr':(aff[sprite_id] == 0)});
			a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true});

			// FORAGE
			a.push({'desc':("cave all, ber, pond all, " + ((d == 3) ? 2 : 3) + " flowers")}); // 2 + 6 = 8

			if (dow == "MON" && is_sunny) {
				// ELLI
				if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
				a.push({'desc':"Talk (MTN)", 'cid':elli_id, 'val':1, 'sr':(aff[elli_id] == 0)});
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
					't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
					'sel':(vars['chickens'] == 0 || flags['new_chick'] == 1)
				});
				a.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':(!(vars['chickens'] == 0 || flags['new_chick'] == 1)),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? ([1, 6]) : 4) : 3)
				});

				// MARIA
				if (aff[maria_id] == 0) { a.push({'desc':"Meet", 'cid':maria_id, 'val':4}); }
				a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 'sr':(aff[maria_id] == 0),
						'sel':(aff[rick_id] < (_RICK_FIX_MIN - 6) || flags['new_mus_box'] == 0)});
				if (aff[rick_id] >= _RICK_FIX_MIN - 6) {
					a[a.length - 1]['t2'] = "MusBox";
					a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
						'sel':(flags['new_mus_box'] == 1), 't2':a[a.length - 1]['desc']
					});
				}
				a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});

				// Strength Wish Power Berry
				if (flags['old_mus_box'] == 1 && vars['chickens'] > 0 && flags['berry_strength'] == 0) {
					a.push({'desc':"Wish for Strength", 'cid':'f_berry_strength', 'val':1, 'iid':'goddess', 'sel':false});
				}
			}

			// Blue Mist Photo
			if (vars['openers'] == 1) {
				a.push({'desc':"Blue Mist Flower Glitch", 'iid':get_npc_id("popuri"),
					'cid':['f_photo_popuri', 'v_openers'], 'val':[1, 1]
				});
			}

			// Kappa Berry
			if (d > 3 && !flags['berry_kappa']) {
				a.push({'desc':"Large fish to Kappa", 'cid':'f_berry_kappa', 'val':1, 'iid':get_npc_id('kappa')});
			}
		} else if (get_horse) {
			// Buy Chicken and get Horse
			var doug_id = get_npc_id('doug');
			var grey_id = get_npc_id('grey');

			if (vars['potatoes'] > 0) {
				a.push({'desc':"Get Potato for Ann", 'iid':ann_id});
			}

			a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
			ed_ber_flow = true;

			// Get Horse
			a.push({'desc':'Get Horse', 'cid':'f_horse', 'val':21, 'iid':get_npc_id('horse'), 'imp':true});
			a.push({'desc':"Fast Text Glitch", 'sr':true, 'hov':true});

			// ANN
			if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':(dow != "SUN")}); }
			a.push({'desc':((dow == "SUN") ? "Talk (Ranch 50%)" : "Talk"), 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':(dow != "SUN")});
			a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(vars['potatoes'] == 0 && dow != "SUN")});
			if (vars['potatoes'] > 0) {
				a[a.length - 1]['t2'] = "Potato";
				a.push({'desc':"Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':(vars['potatoes'] > 0 && dow != "SUN"), 't2':"Gift  "});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id];
					a[a.length - 1]['val'] = [1, 6];
				}
			}

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (dow == "WED" && d > 17) {
				var cliff_id = get_npc_id('cliff');
				a.push({'desc':"Talk (Ranch)", 'cid':cliff_id, 'val':2});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
			}

			// Buy a Chicken + Feed
			a.push({'desc':"Buy a Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':doug_id});
			var tmp_seeds = Math.floor((g - 1500) / 10);
			tmp_seeds = (tmp_seeds > 10) ? 10 : tmp_seeds;
			if (tmp_seeds > 0) {
				a.push({'desc':"Buy " + tmp_seeds + " Feed", 'cid':['v_gold', 'v_feed'], 'val':[10 * tmp_seeds, tmp_seeds], 'sr':true});
			}
		} else if (vars['chickens'] > 1 && dow != "THURS" && vars['potato_waters'] >= _POTATO_GROW_DAYS) {
			// Selling extra chicken
			a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (dow == "WED" && d > 17) {
				var cliff_id = get_npc_id('cliff');
				a.push({'desc':"Talk (Ranch)", 'cid':cliff_id, 'val':2});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
			}

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

			a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
			ed_ber_flow = true;
		} else {
			a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
			ed_ber_flow = true;

			// BASIL
			if (d >= 15 && ["FRI", "SAT"].includes(dow) && is_sunny) {
				var basil_id = get_npc_id('basil');
				a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			}
			
			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (["FRI", "SAT"].includes(dow) && d > 17) {
				var cliff_id = get_npc_id('cliff');
				a.push({'desc':"Talk (Fish Tent)", 'cid':cliff_id, 'val':2});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
			}
		}

		// BASIL
		if (d >= 15) {
			var basil_id = get_npc_id('basil');
			if (is_sunny && dow == "THURS" && is_sunny) {
				a.push({'desc':"Talk (Greenhouse)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			} else if (dow == "WED") {
				a.push({'desc':"Talk (Flower Shop) ", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			}
		}

		// ELLI
		if (["TUES", "WED", "THURS", "FRI", "SAT"].includes(dow)) {
			if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
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

		// POTATOES
		if (vars['openers'] == 0) {
			a.push({'desc':"Buy Potato Seeds", 'iid':get_npc_id('lillia')});
		}

		// RICK (NO NEW BOX IN INVENTORY)
		if (flags['new_mus_box'] == 0 && is_sunny == 1) {
			if (dow == "THURS") {
				// ANN in RICKs shop
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
				a.push({'desc':"Talk", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false});
				if (vars['potatoes'] > 0) {
					a[a.length - 1]['t2'] = "Potato";
					a.push({'desc':"Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':false, 't2':"Gift  "});
					if (flags['recipe_ann'] == 0) {
						a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id];
						a[a.length - 1]['val'] = [1, 6];
					}
				}
			}
			if (!["WED", "SUN"].includes(dow)) {
				if (aff[rick_id] == 0) { a.push({'desc':"Meet", 'cid':rick_id, 'val':4, 'sel':(dow != "SAT"), 't3':"Talk  "}); }
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(dow != "SAT")});
				if (aff[rick_id] <= (_RICK_FIX_MIN - 3)) {
					a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(dow != "SAT" && aff[rick_id] <= (_RICK_FIX_MIN - 6))});
				}
				if (aff[rick_id] >= (_RICK_FIX_MIN - 6) && vars['openers'] >= 2 && flags['new_mus_box'] == 0) {
					a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
						'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1],
						't0':"MusBox", 't3':"Talk  "
					});
				}
			}
		}

		// MAYOR
		var mayor_id = get_npc_id('mayor');
		if (is_sunny) {
			if (dow == "SUN") {
				a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
				// Affection should keep up with Ricks.
				// If greater, gifts to the mayor arent required.
			} else {
				if (aff[mayor_id] == 0) { a.push({'desc':"Meet", 'cid':mayor_id, 'val':4}); }
				a.push({'desc':((dow == "SAT") ? "Talk (Lib 50%)" : "Talk"), 'cid':mayor_id, 'val':3, 'sr':(aff[mayor_id] == 0)});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
			}
		}

		if (d == 21) {
			// Vote on the Goddess
			if (is_sunny) {
				var basil_id = get_npc_id('basil');
				a.push({'desc':"Talk (Town Square)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});

				// RICK
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sel':false});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':false,
					'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1],
					't0':"MusBox", 't1':"Talk  ", 't2':"Talk  ", 't3':"MusBox"
				});
			}
			a.push({'desc':"Vote for Goddess (ANY BUT THE TOP OPTION)"});
		}

		// RICK (NEW BOX IN INVENTORY)
		if (flags['new_mus_box']) {
			if (dow == "THURS") {
				// ANN in RICKs shop
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
				a.push({'desc':"Talk", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false});
				if (vars['potatoes'] > 0) {
					a[a.length - 1]['t2'] = "Potato";
					a.push({'desc':"Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':false, 't2':"Gift  "});
					if (flags['recipe_ann'] == 0) {
						a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id];
						a[a.length - 1]['val'] = [1, 6];
					}
				}
			}
			if (is_sunny && !["WED", "SUN"].includes(dow)) {
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT")});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
					'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1],
					't0':"MusBox", 't3':"Talk  "
				});
			}
		}

		// MARIA
		if (dow != "MON") {
			// Maria in library
			if (aff[maria_id] == 0) { a.push({'desc':"Meet", 'cid':maria_id, 'val':4}); }
			a.push({'desc':"Talk ", 'cid':maria_id, 'val':1, 'sr':(aff[maria_id] == 0),
				'sel':((aff[rick_id] < _RICK_FIX_MIN - 6) || (is_sunny == 0 || (["SAT", "SUN", "WED"].includes(dow))))
			});
			if (aff[rick_id] >= _RICK_FIX_MIN - 6) {
				a[a.length - 1]['t2'] = "MusBox";
				a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
					'sel':(is_sunny && (!(["SAT", "SUN", "WED"].includes(dow)))), 't2':a[a.length - 1]['desc']
				});
			}
			a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});
		} else if (!is_sunny && aff[maria_id] >= _SICK_EVENT_MIN && !flags["sick_maria"]) {
			// Sick Event
			a.push({'desc':"Sick Event", 'cid':[maria_id, "f_sick_maria"], 'val':[_SICK_EVENT_AFF, 1]});
		}

		// MAY
		var may_id = get_npc_id('may');
		if (dow == "SAT" && is_sunny && aff[may_id] == 0) {
			a.push({'desc':"Spam May (83 Talks)", 'cid':may_id, 'val':255});
		}

		// Gift run (optional)
		if (!ed_ber_flow && d != 4) {
			ed_ber_flow = true;
			a.push({'desc':"ed, ber, flower"});

			// BASIL
			if (d >= 15 && ["FRI", "SAT"].includes(dow) && is_sunny) {
				var basil_id = get_npc_id('basil');
				a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			}
		}

		// Potatoes; Equip before entering farm screen
		if (vars['openers'] == 0) {
			a.push({'desc':"Equip Seeds"});
			a.push({'desc':"Plant Potatoes", 'cid':['f_potato_planted', 'v_openers', 'v_gold'], 'val':[1, 1, -200], 'sr':true});
		} else if (vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny && vars['openers'] > 0 && get_horse) {
			// Watering Potatoes at end of day if getting horse
			// (otherwise you dont get to the ranch early enough for the text glitch)
			a.push({'desc':"Equip Watering Can"});
			if (vars['watering_can_fill'] < 10) {
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true});
			}
			a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sr':true});
		}

		if (get_horse || (is_sunny && flags['chicken_inside'] == 1)) {
			a.push({'desc':"Chicken Outside", 'val':1, 'cid':'f_chicken_outside', 'imp':true, 'iid':get_npc_id('chicken')});
		}

		// Dog Karen
		var karen_id = get_npc_id('karen');
		if ([3, 5, 6].includes(d)) {
			// Dog Karen in Mtns on Spr 3 or 5 or 6 (25%)
			if (is_sunny && aff[karen_id] < 50) {
				a.push({'desc':"Dog Karen in Mtns", 'cid':karen_id, 'val':255, 'sel':false});
				if (d == 6) {
					a[a.length - 1]['t2'] = 'Dog Karen at Bar';
				}
			}
			a.push({'desc':"Fishing then Bar"});
			if (d == 6 && aff[karen_id] < 50) {
				// If Karen wasnt in the mountains on 3, 5, or 6
				// find her in the bar on Spring 6
				a.push({'desc':"Dog Karen at Bar", 'cid':karen_id, 'val':255});
				if (is_sunny) {
					a[a.length - 1]['t2'] = "Dog Karen in Mtns";
				}
			}

			// BAR
			var duke_id = get_npc_id('bartender');
			if (aff[duke_id] == 0) { a.push({'desc':"Meet", 'cid':duke_id, 'val':3, 'imp':true}); }
			a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
			a.push({'desc':"Gift", 'cid':duke_id, 'val':3, 'sr':true});
		}
	}

	if (!is_festival(d) || d == 23) {
		if (flags['dog_inside'] == 0 && (aff[get_npc_id('karen')] > 50 || d == 6)) {
			a.push({'desc':"Bring Dog Inside", 'cid':'f_dog_inside', 'val':1, 'iid':get_npc_id('dog')});
		}
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':1, 'sr':(flags['dog_inside'] == 0 && (aff[get_npc_id('karen')] > 50 || d == 6))});

		if (flags['horse'] == 1) {
			var horse_id = get_npc_id('horse');
			a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id});
			a.push({'desc':((flags['horse'] == 1) ? "Ride Horse": "Talk to Horse"), 'val':1, 'cid':horse_id});
		}
	}
	return a;
}