function actions_photos_spr_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var elli_id = get_npc_id('elli');
	var grey_id = get_npc_id('grey');
	var horse_id = get_npc_id('horse');
	var kai_id = get_npc_id('kai');
	var karen_id = get_npc_id('karen');
	var maria_id = get_npc_id('maria');
	var may_id = get_npc_id('may');
	var mayor_id = get_npc_id('mayor');
	var popuri_id = get_npc_id('popuri');
	var rick_id = get_npc_id('rick');
	var sprite_id = get_npc_id('sprite');

	var dow = get_dow(d, true);
	var has_opener = false;
	var lumber_to_sprite = ((aff[sprite_id] >= _SPRITE_SPAM_MAX || d == 3) ? 0 : ((_SPRITE_SPAM_MAX - aff[sprite_id] > 6) ? 6 : (_SPRITE_SPAM_MAX - aff[sprite_id])));
	var get_horse = (flags['horse'] == 0 && vars['chickens'] == 0 && g >= 1500 && dow != "THURS" && is_sunny == 1 && !is_festival(d));
	var visit_ranch = get_horse;
	var chicken_action = [];
	
	if (d == 3) { // Spring 3
		a.push({'desc':"Scythe to toolbox; Equip hoe"});
		a.push({'desc':"Whistle Dog", 'cid':dog_id, 'val':1, 'sr':true});
		a.push({'desc':"Greet the Mayor", 'iid':mayor_id});
		a.push({'desc':"Till 3 x 3 square"});
	}
	if (d == 4) { // Spring 4
		a.push({'desc':"Equip axe", 'iid':get_npc_id('stump')});
		a.push({'desc':"Chop One Stump", 'imp':true, 'val':6, 'cid':'v_lumber', 'sr':true});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
	}
	if (is_sunny == 1 && d > 3) {
		a.push({'desc':"Scare birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	// Need Money for a Power Berry
	if (d == 22 && g < 1000) { a.push({'desc':"Need 1000G for Berry Tomorrow", 'imp':true}); }

	if ([15, 19].includes(d)) { a.push({'desc':"Ignore Basil on the Farm", 'iid':basil_id}); }
	if (d == 18) { a.push({'desc':"Food to Cliff", 'cid':cliff_id, 'val':5}); }
	if (d == 25 && aff[karen_id] >= 120) {
		// Wine from Karen
		a.push({'desc':"Birthday Wine from Karen", 'iid':karen_id, 'cid':'v_alcohol_tolerance', 'val':1, 'sel':false, 'imp':true});
	}

	// New Chicken
	if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
		a.push({'desc':"New Chicken", 'iid':chicken_id, 'red':(flags['new_chick'] == 1 && dow != "MON")});
	}

	// Bring Chicken Inside / Outside
	if (vars['chickens'] > 0 && (flags['chicken_outside'] == 0 || (is_sunny == 0 && !is_festival(d)))) {
		has_opener = true;
		if (is_sunny == 0) {
			if (vars['feed'] == 0 && dow != "THURS" && vars['gold'] > 0) {
				var tmp_seeds = (((10 - vars['feed']) < Math.floor(vars['gold'] / 10)) ? (10 - vars['feed']) : Math.floor(vars['gold'] / 10));
				if (tmp_seeds > 0) {
					a.push({'desc':"Buy " + tmp_seeds + " Feed", 'cid':['v_gold', 'v_feed'], 'val':[-10 * tmp_seeds, tmp_seeds - 1], 'iid':get_npc_id('doug')});
				}
			}
			if (flags['chicken_outside'] == 1) { a.push({'desc':"Bring Chicken Inside", 'val':-1, 'cid':'f_chicken_outside', 'imp':true, 'iid':chicken_id}); }
			if (vars['feed'] > 0) {
				a.push({'desc':"Feed Chicken", 'cid':'v_feed', 'val':-1, 'sr':(flags['chicken_outside'] == 1), 'imp':(flags['chicken_outside'] == 0)});
				if (flags['chicken_outside'] == 0) { a[a.length - 1]['iid'] = chicken_id; }
			}
		} else {
			a.push({'desc':"Bring Chicken Outside", 'val':1, 'cid':'f_chicken_outside', 'imp':true});
		}
		if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
			a[a.length - 1]['sr'] = true;
		} else {
			a[a.length - 1]['iid'] = chicken_id;
		}
	}

	if (is_festival(d)) {
		// Planting (Spr 8), Horse Race (Spr 17), Flower Fest (Spr 23)

		if (flags['chicken_inside'] == 1) {
			if (sell_stuff) { a.push({'desc':"Sell Stuff"}); }
			if (vars['watering_can_fill'] < 30) {
				a.push({'desc':"Equip Watering Can"});
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true});
			} else if (flags['old_mus_box'] == 0) {
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
			}
		}
		
		if (d == 8) { // Planting Fest
			if (vars['chickens'] > 0) {
				a.push({'desc':"Get Egg", 'imp':true, 'iid':chicken_id});
			}
		}

		if (d == 23) { // Flower Fest
			a.push({'desc':"Go to Town Square", 'iid':mayor_id, 'cid':'v_happiness', 'val':5, 'imp':true});
			a.push({'desc':"Buy a Power Nut", 'cid':['f_berry_flowerfest','v_gold'], 'imp':(vars['gold'] >= 1000),
					'val':[1, -1000], 'iid':get_npc_id('salesman'), 'sel':(vars['gold'] >= 1000)
			});
			a.push({'desc':"Talk", 'cid':rick_id, 'val':2});
			a.push({'desc':"Talk", 'cid':mayor_id, 'val':2});
			a.push({'desc':"Talk", 'cid':maria_id, 'val':2});
			a.push({'desc':"Dance",'cid':[maria_id, 'f_dontsave'], 'val':[10, 1], 't2':["Dance ", "Dance  "], 'sr':true});
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance ",'cid':[elli_id, 'f_dontsave'], 'val':[10, 1], 't2':["Dance", "Dance  "], 'sel':false, 'sr':true});
			a.push({'desc':"Talk", 'cid':ann_id, 'val':2});
			a.push({'desc':"Dance  ",'cid':[ann_id, 'f_dontsave'], 'val':[10, 1], 't2':["Dance", "Dance "], 'sel':false, 'sr':true});
		}
	} else { // Not a Festival

		// OPENER #1
		// Water Potatoes
		if (d > 4 && flags['potato_planted'] > 0 && vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny == 1 && !get_horse) {
			has_opener = true;
			a.push({'desc':"Equip Watering Can"});
			a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true,
					'sel':(flags['potato_planted'] > 0 && vars['watering_can_fill'] <= 10)
			});
			a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sel':false, 'sr':true});
		}

		// OPENER #2
		if (dow == "MON" || d == 12) {
			if (d == 12 && flags['new_chick'] == 1) {
				a.push({'desc':"SAVE EGG FOR INCUBATION", 'imp':true});
			}
			if (dow == "MON" && vars['chickens'] > 1) {
				chicken_action.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'imp':true});
				if (vars['feed'] < 4) {
					var tmp_seeds = (((10 - vars['feed']) < Math.floor(vars['gold'] / 10)) ? (10 - vars['feed']) : Math.floor(vars['gold'] / 10));
					if (tmp_seeds > 0) {
						chicken_action.push({'desc':"Buy " + tmp_seeds + " Feed", 'cid':['v_gold', 'v_feed'], 'val':[10 * tmp_seeds, tmp_seeds], 'sr':true});
					}
				}
				visit_ranch = true;
			}
			if (flags['new_chick'] == 1 || d == 12) {
				chicken_action.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"],
						'val':[d + _CHICK_GROW_SLEEPS, -1], 't0':"Incubate", 'imp':true, 'sr':(dow == "MON" && vars['chickens'] > 1)
				});
				chicken_action.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'sr':true});
			}
			if (d == 12) {
				a = a.concat(chicken_action);
				chicken_action = [];
			}
		} else {
			if (vars['chickens'] > 0 && flags['new_chick'] <= 1) {
				has_opener = true;
				if (flags['new_chick'] != 1 && vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
					a.push({'desc':"Bring Chicken Outside", 'iid':chicken_id, 'sr':true, 'val':1, 'cid':'f_chicken_outside'});
				} else {
					a.push({'desc':"DONT ENTER COOP", 'sr':(vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d), 'red':true});
				}

				// new chk | incubate
				if (flags['new_chick'] == 1) {
					a.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'sel':false,
							'val':[d + _CHICK_GROW_SLEEPS, -1], 't0':"Incubate", 'red':true
					});
				}
				a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1),
						'iid':chicken_id, 'sr':(flags['new_chick'] == 1), 'sel':(d == 9), 'red':(d > 12), 'imp':(d == 9)
				});
				if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
			}
		}

		if (lumber_to_sprite > 0) {
			a.push({'desc':("Get " + lumber_to_sprite + " Lumber from Bin"), 'iid':get_npc_id('stump')});
		}

		if ((flags['potato_planted'] > 0 && d > 4) || d >= 6) {
			// Music Box Dig
			if (flags['old_mus_box'] == 0 && !get_horse && (dow != "SUN" || flags['new_mus_box'] == 0) && 
				(flags['berry_kappa'] == 1 || aff[rick_id] >= (_RICK_FIX_MIN - 6))) {
				has_opener = true;
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox"), 'red':(dow == "SUN")});
				if (!flags['treasure_map']) {
					a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'sr':true});
				}
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true, 'iid':get_npc_id("musbox"), 'sel':(dow != "SUN")});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
			} else if (vars['watering_can_fill'] < 30 && !has_opener && !get_horse && is_sunny == 1) {
				has_opener = true;
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30});
				// Lumber for Inner Sprite (the one on the right)
				if (d > 3 && lumber_to_sprite > 0) {
					a.push({'desc':("Get " + lumber_to_sprite + " Lumber from Bin"), 'imp':true, 'iid':get_npc_id('stump')});
				}
			}
		}

/* TODO
 * 
 * BMF Glitch / Strength Berry
 * Visit Sprites / Mtn visit
 * 
		if (!is_festival(d) && !get_horse && !has_opener) {
			if (vars['chickens'] == 0) {
				a.push({'desc':"equip fishing rod, catch fish"});
			} else if (!(((vars['chickens'] == 0 && g < 1500) || (dow == "MON" && is_sunny == 1)) && (flags['berry_strength'] == 0 && vars['chickens'] > 0 && flags['old_mus_box'] == 1 && (vars['potato_waters'] >= _POTATO_GROW_DAYS || flags['potatoes_planted'] == 0)))) {
				a.push({'desc':"equip hammer, clear some rocks"});
			}
		}
*/

		if (vars['potatoes'] > 0) {
			a.push({'desc':"Get Potato for Ann", 'iid':ann_id});
		}

		// Keep Dog at Crossroads until Karen to 120-159
		// She brings Wine to farm at aff >= 100
		// She brings Wine on birthday when aff >= 120
		if (d > 3 && aff[karen_id] < 120 && flags['dog_inside'] == 0) {
			a.push({'desc':"Dog to Crossroads", 'iid':dog_id});
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2, 'sr':true});
		}

		// Fishing Rod
		if (flags['fishing_rod'] == 0) {
			a.push({'desc':"Get Fishing Rod", 'val':1, 'cid':'f_fishing_rod', 'iid':get_npc_id('fisherman')});
		}

		// Kappa Berry
		if (d > 3 && !flags['berry_kappa']) {
			a.push({'desc':"Large fish to Kappa", 'cid':'f_berry_kappa', 'val':1, 'iid':get_npc_id('kappa'), 'sel':false,
					'red':(get_horse || (aff[rick_id] < (_RICK_FIX_MIN - 6) && vars['chickens'] == 0 && vars['gold'] < 1500))
			});
		}

		var musbox_to_ann = false;
		// Musbox Priority:
		// 1) Ann
		// 2) Maria
		// 3) Elli
		if (d == 3) {
			a.push({'desc':"ed, ber, flower, Catch Fish"});
			a.push({'desc':"Buy Potato Seeds", 'cid':['v_gold', 'v_potatoes_bought'], 'val':[-200, 1], 'iid':get_npc_id('lillia'), 'imp':true});
			a.push({'desc':"Meet", 'cid':elli_id, 'val':4});
			a.push({'desc':"Talk (Flower Shop)", 'cid':elli_id, 'val':1, 'sr':true});
			a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 't2':"M/L Fish", 'sr':true});
			a.push({'desc':"M/L Fish", 't2':"Gift ", 'sel':false, 'cid':[elli_id, 'v_happiness'], 'val':[3, 1], 'sr':true});
			a.push({'desc':"Equip Seeds", 'imp':true});
			a.push({'desc':"Plant Potatoes", 'sr':true, 'cid':'f_potato_planted', 'val':1});
		}

		if (d > 3 && !is_festival(d)) { // Skip Spr3 Y1 (WED)
			if (get_horse) {
				// Buy Chicken and get Horse
				var doug_id = get_npc_id('doug');
	
				a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
	
				// Get Horse
				a.push({'desc':'Get Horse', 'cid':'f_horse', 'val':21, 'iid':horse_id, 'imp':true});
				a.push({'desc':"Fast Text Glitch", 'sr':true, 'hov':true});
	
				// ANN
				// -1 sp " GIFT"
				// -1 sp " MUSBOX"
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':(dow != "SUN")}); }
				a.push({'desc':((dow == "SUN") ? "Talk (Ranch 50%)" : "Talk"), 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':(dow != "SUN")});
				if (flags['new_mus_box'] == 1) {
					musbox_to_ann = true;
					a[a.length - 1]['t2'] = " MusBox";
					a.push({'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':true, 't2':a[a.length - 1]['desc']});
				}
				a.push({'desc':" Gift", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(vars['potatoes'] == 0 && dow != "SUN"), 't2':"Potato"});
				a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(vars['potatoes'] > 0 && dow != "SUN"), 't2':" Gift"});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
					a[a.length - 1]['val'] = [1, 6, -1];
				}

				// Cliff
				if (d > 17 && ["WED", "TUES"].includes(dow)) {
					if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
						// Cliff's intro gives affection to GRAY
						a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'sel':(dow == "WED"), 'iid':cliff_id});
					}
					a.push({
						'desc':("Talk (" + ((dow == "WED") ? "Ranch" : "Beach") + ")"),
						'cid':cliff_id, 'val':2, 'sel':(dow == "WED"), 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)
					});
					a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
					a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
				}

				// Buy a Chicken + Feed
				a.push({'desc':"Buy a Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[1, -1500], 'iid':doug_id});
				var tmp_seeds = Math.floor((g - 1500) / 10);
				tmp_seeds = (tmp_seeds > 10) ? 10 : tmp_seeds;
				if (tmp_seeds > 0) {
					a.push({'desc':"Buy " + tmp_seeds + " Feed", 'cid':['v_gold', 'v_feed'], 'val':[10 * tmp_seeds, tmp_seeds], 'sr':true});
				}
			} else if (dow != "THURS" && flags['horse'] > 0) {
				visit_ranch = (visit_ranch || d == 30 || chicken_action.length > 0 || (vars['potatoes'] > 0 && !["THURS", "SUN"].includes(dow)));
				
				/*
				if (vars['chickens'] > 1) {
					// Selling extra chicken
					a.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});
					if (vars['feed'] < 4) {
						var tmp_seeds = (((10 - vars['feed']) < Math.floor(vars['gold'] / 10)) ? (10 - vars['feed']) : Math.floor(vars['gold'] / 10));
						if (tmp_seeds > 0) {
							a.push({'desc':"Buy " + tmp_seeds + " Feed", 'cid':['v_gold', 'v_feed'], 'val':[10 * tmp_seeds, tmp_seeds], 'sr':true});
						}
					}
				}
				*/

				// ANN
				musbox_to_ann = (visit_ranch && flags['new_mus_box'] == 1);
				a.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch) ")), 'cid':ann_id, 'val':1, 'sel':(is_sunny == 1 && !musbox_to_ann && visit_ranch), 'red':(!visit_ranch), 't2':" MusBox"});
				a.push({'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sel':(is_sunny == 1 && musbox_to_ann && visit_ranch), 'sr':true, 't2':a[a.length - 1]['desc']});
				a.push({'desc':" Gift", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(is_sunny == 1 && visit_ranch && vars['potatoes'] == 0), 't2':"Potato"});
				a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(is_sunny == 1 && visit_ranch && vars['potatoes'] > 0), 't2':" Gift"});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
					a[a.length - 1]['val'] = [1, 6, -1];
				}
				
				// Cliff
				if (d > 17 && ["TUES", "WED"].includes(dow)) {
					if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
						// Cliff's intro gives affection to GRAY
						a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id, 'sel':(dow == "WED")});
					}
					a.push({
						'desc':("Talk (" + ((dow == "WED") ? "Ranch" : "Beach") + ")"),
						'cid':cliff_id, 'val':2, 'sel':(dow == "WED"), 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)
					});
					a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
					a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
				}
				a = a.concat(chicken_action);
			}
	
			if ((vars['chickens'] == 0 && g < 1500) || (dow == "MON" && is_sunny == 1)) {
				// Mountain visit
				// No chicken yet || MONDAY
				
				var tmp_spr_aff = aff[sprite_id];
				// Chop Lumber for Inner Sprite Gifts

				// SPRITE
				if (dow != "SUN") {
					if (aff[sprite_id] > 0 && lumber_to_sprite > 0) {
						a.push({'desc':(lumber_to_sprite + " Lumber to Inner Sprite (Right Side)"),
								'cid':[sprite_id, 'v_lumber'], 'val':[lumber_to_sprite, -1 * lumber_to_sprite]
						});
						a.push({'desc':"INNER SPRITE FIRST!", 'sr':true});
						tmp_spr_aff += lumber_to_sprite;
					}
					if (aff[sprite_id] == 0) {
						a.push({'desc':"Meet", 'cid':sprite_id, 'val':5});
						tmp_spr_aff += 5;
					}
					a.push({'desc':"Talk", 'cid':sprite_id, 'val':1, 'sr':(aff[sprite_id] == 0),
							'sel':(aff[sprite_id] < _SPRITE_WINE_MIN),
							'red':(aff[sprite_id] >= _SPRITE_WINE_MIN)
					});
					a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true, 'sel':(a[a.length - 1]['sel'])});
					tmp_spr_aff += 3;
					if (aff[sprite_id] == 0 && lumber_to_sprite > 0) {
						a.push({'desc':(lumber_to_sprite + " Lumber to Inner Sprite (Right Side)"),
								'cid':[sprite_id, 'v_lumber'], 'val':[lumber_to_sprite, -1 * lumber_to_sprite]
						});
						tmp_spr_aff += lumber_to_sprite;
					}
					if (tmp_spr_aff < _SPRITE_SPAM_MAX && d > 3) {
						a.push({'desc':"Equip Axe, Chop One Stump", 'imp':true, 'val':6, 'cid':'v_lumber', 'iid':get_npc_id('stump')});
					}
				}
				
				// FORAGE
				if (dow != "SUN") {
					a.push({'desc':("cave all, ber, pond all, " + ((d == 3) ? 2 : 3) + " flowers")}); // 2 + 6 = 8
				}

				// Cliff
				if (d > 17 && ["THURS", "FRI", "SAT", "SUN"].includes(dow)) {
					var cliff_loc = " (Fish Tent) [50%]";
					if (dow == "THURS") { cliff_loc = " (Carp House)"; }
					if (dow == "SUN") { cliff_loc = " (Carp House) [50%]"; }
					if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
						// Cliff's intro gives affection to GRAY
						a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id, 'sel':false});
					}
					a.push({
						'desc':("Talk" + cliff_loc), 'cid':cliff_id, 'val':2, 'sel':false, 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)
					});
					a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
					a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
				}

				// Strength Wish Power Berry
				if (flags['berry_strength'] == 0 && vars['chickens'] > 0) {
					a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 
							'sel':(flags['old_mus_box'] == 1 && (vars['potato_waters'] >= _POTATO_GROW_DAYS || flags['potato_planted'] == 0))
					});
				}
				// Blue Mist Flower
				if (flags['photo_popuri'] == 0) {
					if (flags['berry_strength'] == 1 || vars['chickens'] == 0) {
						a.push({'desc':"Water Flower by Pond", 'iid':popuri_id});
					}
					a.push({'desc':"Blue Mist Flower Glitch", 'iid':popuri_id, 'cid':'f_photo_popuri', 'val':1, 'sel':false, 'sr':true});
				}

				if (dow == "MON" && is_sunny == 1) {
					// ELLI (in Mtns)
					if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
					a.push({'desc':"Talk (MTN)", 'cid':elli_id, 'val':1, 'sr':(aff[elli_id] == 0)});
					a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
						't2':((vars['chickens'] > 0) ? ["Egg", "M/L Fish"] : "M/L Fish"),
						'sel':(d != 24 && (vars['chickens'] == 0 || flags['new_chick'] == 1))
					});
					a.push({
						'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true,
						't2':((vars['chickens'] > 0) ? ["Gift ", "M/L Fish"] : "Gift "),
						'sel':(d == 24 || (vars['chickens'] > 0 && flags['new_chick'] != 1)),
						'cid':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id) : [elli_id, 'v_happiness']),
						'val':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? [1, 6] : 4) : [3, 1])
					});
					if (vars['chickens'] > 0) {
						a.push({'desc':"M/L Fish", 'sr':true, 't2':["Gift ", "Egg"],
								'cid':[elli_id, 'v_happiness'],
								'val':[3, 1], 'sel':false
						});
					}
	
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
					
					// Cliff
					if (d > 17) {
						if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
							// Cliff's intro gives affection to GRAY
							a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id, 'sel':false});
						}
						a.push({'desc':"Talk (Hot Springs)", 'cid':cliff_id, 'val':2, 'sel':false, 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0), 'red':true});
						a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
						a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
					}
				}
	
			} else if (!get_horse && dow != "SUN") { // End of [Mountain visit]
				a.push({'desc':("ed, ber, flower, " + ((dow == "MON") ? "FLOWER FILL" : "(flower fill if out)"))}); // Quick gifts for villagers

				// Strength Wish Power Berry
				if (flags['berry_strength'] == 0 && vars['chickens'] > 0) {
					a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 
							'sel':(flags['old_mus_box'] == 1 && (vars['potato_waters'] >= _POTATO_GROW_DAYS || flags['potato_planted'] == 0))
					});
				}
				// Blue Mist Flower
				if (flags['photo_popuri'] == 0) {
					if (flags['berry_strength'] == 1 || vars['chickens'] == 0) {
						a.push({'desc':"Water Flower by Pond", 'iid':popuri_id});
					}
					a.push({'desc':"Blue Mist Flower Glitch", 'iid':popuri_id, 'cid':'f_photo_popuri', 'val':1, 'sel':false, 'sr':true});
				}

				// Cliff
				if (d > 17 && ["FRI", "SAT"].includes(dow) && is_sunny == 1) {
					if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
						// Cliff's intro gives affection to GRAY
						a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id, 'sel':false});
					}
					a.push({'desc':"Talk (Fish Tent) [50%]", 'cid':cliff_id, 'val':2, 'sel':false, 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)});
					a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
					a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
				}
			}

			// ELLI
			// "Gift " <- one space
			// "Talk " <- one space
			if (["TUES", "WED", "THURS", "FRI", "SAT"].includes(dow)) {
				if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
				a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk (Bakery)"), 'cid':elli_id, 'val':1,
						'sr':(aff[elli_id] == 0), 't2':"MusBox ",
						'sel':((is_sunny == 1 || vars['chickens'] < 1) && (flags['new_mus_box'] != 1 || musbox_to_ann))});
				a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 
					'sel':((is_sunny == 1 && (flags['new_mus_box'] == 1 && !musbox_to_ann))), 't2':a[a.length - 1]['desc']});
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
					't2':((vars['chickens'] > 0) ? ["Egg", "M/L Fish"] : "M/L Fish"),
					'sel':((is_sunny == 1 || vars['chickens'] < 1) && (d != 24 && (vars['chickens'] == 0 || flags['new_chick'] == 1)))
				});
				a.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true,
					't2':((vars['chickens'] > 0) ? ["Gift ", "M/L Fish"] : "Gift "),
					'sel':(is_sunny == 1 && (d == 24 || (vars['chickens'] > 0 && flags['new_chick'] != 1))),
					'cid':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id) : [elli_id, 'v_happiness']),
					'val':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? [1, 6] : 4) : [3, 1])
				});
				if (vars['chickens'] > 0) {
					a.push({'desc':"M/L Fish", 'sr':true, 't2':["Gift ", "Egg"],
							'cid':[elli_id, 'v_happiness'],
							'val':[3, 1], 'sel':false
					});
				}
			}

			// POTATOES
			if (vars['potatoes_bought'] == 0) { // || (d == 30 && is_sunny == 1)) {
				a.push({'desc':"Buy Potato Seeds", 'cid':['v_gold', 'v_potatoes_bought'], 'val':[-200, 1], 'iid':get_npc_id('lillia'), 'imp':true});
			}

			// MAYOR
			if (is_sunny == 1 && dow != "SUN") {
				if (aff[mayor_id] == 0) { a.push({'desc':"Meet", 'cid':mayor_id, 'val':4}); }
				a.push({'desc':((dow == "SAT") ? "Talk (Lib 50%)" : "Talk"), 'cid':mayor_id, 'val':3, 'sr':(aff[mayor_id] == 0)});
				a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
			}

			// RICK (NO NEW BOX IN INVENTORY)
			// "Talk  " - 2 spaces
			// "Gift  " - 2 spaces
			if (flags['new_mus_box'] == 0 && is_sunny == 1) {
				if (!["WED", "SUN"].includes(dow)) {
					if (aff[rick_id] > 38 && flags['cutscene_rick'] == 0) {
						a.push({'desc':"Enter / Exit to clear Rick / Ann cutscene", 'iid':rick_id, 'imp':true});
					}
					if (aff[rick_id] == 0) { a.push({'desc':"Meet", 'cid':rick_id, 'val':4, 'sel':(dow != "SAT"), 't3':"Talk  "}); }
					a.push({'desc':"Talk  ", 'sel':(dow != "SAT"), 'sr':(aff[rick_id] == 0),
						'cid':((aff[rick_id] > 38 && flags['cutscene_rick'] == 0) ? [rick_id, 'f_cutscene_rick'] : rick_id),
						'val':((aff[rick_id] > 38 && flags['cutscene_rick'] == 0) ? [3, 1] : 3)
					});
					a.push({'desc':"Gift  ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(dow != "SAT" && aff[rick_id] <= (_RICK_FIX_MIN - 3))});
					if (aff[rick_id] >= (_RICK_FIX_MIN - 6)) {
						a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
							'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't3':"Talk  "
						});
					}
					// Buy a Brush
					if (vars['gold'] >= (600 + 1000 * (1 - flags['berry_flowerfest'])) && flags['horse_brush'] == 0 && vars['chickens'] > 0 && dow != "SAT") {
						a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true, 'imp':true});
					}
				}
				if (dow == "THURS") {
					// ANN in RICKs shop
					if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
					a.push({'desc':"Talk (Ricks Shop)", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false, 't2':" MusBox"});
					a.push({'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
					a.push({'desc':" Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Potato"});
					a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':" Gift  "});
					if (flags['recipe_ann'] == 0) {
						a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
						a[a.length - 1]['val'] = [1, 6, -1];
					}
				}
			}

/* TODO ?
		if (d == 21 && is_sunny == 1) {
			// Vote on the Goddess
			a.push({'desc':"Vote for Goddess (ANY BUT THE TOP OPTION)"});
		}
*/

			// RICK (NEW BOX IN INVENTORY)
			if (flags['new_mus_box'] == 1) {
				if (is_sunny == 1 && !["WED", "SUN"].includes(dow)) {
					if (aff[rick_id] > 38 && flags['cutscene_rick'] == 0 && dow != "SAT") {
						a.push({'desc':"Enter / Exit to clear Rick / Ann cutscene", 'iid':rick_id, 'imp':true});
					}
					a.push({'desc':"Talk  ", 'sel':(dow != "SAT"), 'sr':(aff[rick_id] == 0),
						'cid':((aff[rick_id] > 38 && flags['cutscene_rick'] == 0 && dow != "SAT") ? [rick_id, 'f_cutscene_rick'] : rick_id),
						'val':((aff[rick_id] > 38 && flags['cutscene_rick'] == 0 && dow != "SAT") ? [3, 1] : 3)
					});
					a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
					a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
						'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't3':"Talk  "
					});
				}
				if (dow == "THURS") {
					// ANN in RICKs shop
					if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
					a.push({'desc':"Talk (Ricks Shop)", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false, 't2':" MusBox"});
					a.push({'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
					a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Potato"});
					a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':"Gift  "});
					if (flags['recipe_ann'] == 0) {
						a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
						a[a.length - 1]['val'] = [1, 6, -1];
					}
				}
			}

			// MARIA
			// " Talk" -1 spaces
			if (dow != "MON") {
				// Maria in library
				if (aff[maria_id] == 0) {
					a.push({'desc':"Meet", 'cid':maria_id, 'val':4, 'red':(dow == "SUN" && !get_horse),
							'sel':((is_sunny == 1 || vars['chickens'] < 1) && (dow != "SUN" || get_horse) && ((aff[rick_id] < _RICK_FIX_MIN - 6) || (["SAT", "WED"].includes(dow))))
					});
				}
				a.push({'desc':"Talk (Library)", 'cid':maria_id, 'val':1, 'sr':(aff[maria_id] == 0), 'red':(dow == "SUN" && !get_horse),
					'sel':((is_sunny == 1 || vars['chickens'] < 1) && (dow != "SUN" || get_horse) && ((aff[rick_id] < _RICK_FIX_MIN - 6) || (["SAT", "WED"].includes(dow))))
				});
				if (aff[rick_id] >= _RICK_FIX_MIN - 6) {
					a[a.length - 1]['t2'] = "MusBox";
					a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'],
						'sel':((is_sunny == 1 || vars['chickens'] < 1) && (dow != "SUN" || get_horse) && (!((aff[rick_id] < _RICK_FIX_MIN - 6) || (["SAT", "SUN", "WED"].includes(dow)))))
					});
				}
				a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true, 'sel':((dow != "SUN" || get_horse) && (is_sunny == 1 || vars['chickens'] < 1))});
	
				// MAY
				if (aff[may_id] < 100 && is_sunny == 0) {
					a.push({'desc':"Spam May (Library) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false, 'red':true});
				}
			} else if (is_sunny == 0 && aff[maria_id] >= _SICK_EVENT_MIN && !flags["sick_maria"]) {
				// Sick Event
				a.push({'desc':"Sick Event", 'cid':[maria_id, "f_sick_maria"], 'val':[_SICK_EVENT_AFF, 1]});
			}
	
			// MAY
			if (aff[may_id] < 100 && is_sunny == 1) {
				a.push({'desc':"Spam May (By Midwife) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false, 'red':(dow == "SUN")});
			}

/*
			if (is_sunny == 1) {
				if (flags['vineyard_cutscene'] == 0) {
					a.push({'desc':"Exit/Re-enter Vineyard", 'imp':true});
					a.push({'desc':"Vineyard Cutscene", 'val':1, 'cid':'f_cutscene_vineyard', 'sr':true});
				}
				// KAI
				if (aff[kai_id] == 0) { a.push({'desc':"Meet", 'cid':kai_id, 'val':8, 'sel':(dow != "SUN")}); }
				a.push({'desc':"Talk (Vineyard)", 'cid':kai_id, 'val':2, 'sr':(aff[kai_id] == 0),
					'sel':(dow != "SUN" && ((aff[kai_id] + 10) < _PARTY_ATTEND_MIN)),
					'red':((aff[kai_id] + 10) > _PARTY_ATTEND_MIN)
				});
				a.push({'desc':"Berry", 't2':" Gift ", 'sr':true,
					'sel':(dow != "SUN" && ((aff[kai_id] + 10) < _PARTY_ATTEND_MIN)),
					'cid':((flags['recipe_kai'] == 0) ? ['f_recipe_kai', kai_id] : kai_id),
					'val':((flags['recipe_kai'] == 0) ? [1, 5] : 6)
				});
				a.push({'desc':" Gift ", 'cid':kai_id, 'val':3, 't2':"Berry", 'sel':false, 'sr':true, 'sel':false});
			}
*/

			// Potatoes; Equip before entering farm screen
			if (vars['potatoes_bought'] == 0) { // || (d == 30 && is_sunny == 1)) {
				a.push({'desc':"Equip Seeds", 'imp':true});
				a.push({'desc':"Plant Potatoes", 'sr':true,
						'cid':((d == 30) ? 'v_potatoes' : 'f_potato_planted'),
						'val':((d == 30) ? 9 : 1)
				});
			} else if (flags['potato_planted'] == 1 && vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny == 1 && get_horse) {
				// Watering Potatoes at end of day if getting horse
				// (otherwise you dont get to the ranch early enough for the text glitch)
				a.push({'desc':"Equip Watering Can", 'imp':true});
				a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sr':true, 'sel':false});
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sel':(vars['watering_can_fill'] <= 10), 'sr':true});
			}

			if (get_horse || (is_sunny == 1 && flags['chicken_inside'] == 1)) {
				a.push({'desc':"Chicken Outside", 'val':1, 'cid':'f_chicken_outside', 'imp':true, 'iid':chicken_id});
			}

			// Wine from Karen
			if (aff[karen_id] >= 100 && vars['alcohol_tolerance'] == 0) {
				a.push({'desc':"Wine from Karen", 'iid':karen_id, 'cid':'v_alcohol_tolerance', 'val':1, 'sel':false, 'imp':true});
			}

			if (is_sunny == 1 && (d == 30 || (dow != "SUN" && ((flags['berry_kappa'] == 0 && vars['chickens'] == 0) || aff[karen_id] < 120)))) {
				// KAREN
				// She brings Wine to farm at aff >= 100
				// She brings Wine on birthday when aff >= 120
				if (aff[karen_id] < 120 && dow != "SUN") {
					a.push({'desc':("Dog Karen to 120 (" + ((["MON", "THURS"].includes(dow)) ? "Vineyard" : "MTN") + ") [Green Heart]"),
							'cid':karen_id, 'val':121, 'sel':false, 'red':(["MON", "THURS"].includes(dow))});
				}
/*
				// DREAM SKIP on SPR 30
				if (d == 30) {
					a.push({'desc':"Dog Karen to 255 (Beach/Carp) [50%]", 'cid':karen_id, 'val':(255 - aff[karen_id]), 'imp':true});
					a.push({'desc':"RESET IF KAREN DOESNT SHOW", 'imp':true});	
				}
*/

				if (flags['berry_kappa'] == 0 && vars['chickens'] == 0) {
					a.push({'desc':"Ed, ber, flower, Fishing then Bar"});
				} else {
					a.push({'desc':"Go to bar if Dogging Karen"});
				}

				// BAR
				var duke_id = get_npc_id('bartender');
				if (aff[duke_id] == 0) { a.push({'desc':"Meet", 'cid':duke_id, 'val':3, 'imp':(flags['berry_kappa'] == 0 && vars['chickens'] == 0), 'sel':(flags['berry_kappa'] == 0 && vars['chickens'] == 0)}); }
				a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':(flags['berry_kappa'] == 0), 'sel':(flags['berry_kappa'] == 0 && vars['chickens'] == 0)});
				a.push({'desc':"Gift", 'cid':duke_id, 'val':3, 'sel':(flags['berry_kappa'] == 0 && vars['chickens'] == 0), 'sr':true});
			}
		} // End of if (d > 3)
	}

	if (flags['horse'] != 0 || get_horse) {
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Equip Brush", 'iid':horse_id});
		}
		a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
		a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':(dow != "SUN" && !is_festival(d)) });
		if ((flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) || (vars['gold'] >= 600 && flags['horse_brush'] == 0 && vars['chickens'] > 0 && dow != "SAT")) {
			a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
		}
	}

	// Dog
	if (flags['dog_inside'] == 0) {
		a.push({'desc':"Bring Dog Inside", 'cid':'f_dog_inside', 'val':1, 'iid':dog_id});
	}
	//if (d > 3) {
		a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false, 'red':(vars['chickens'] == 0)});
	//}

/*
	if (d == 30 && is_sunny == 1) {
		flags['dontsave'] = true;
		a.push({'desc':"DONT SLEEP TONIGHT! STAY UP ALL NIGHT!", 'imp':true});
		a.push({'desc':"Day Skipped", 'cid':'v_day', 'val':1, 'sr':true});
	} else {
*/
		//flags['dontsave'] = false;
//	}
	return a;
}
