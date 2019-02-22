function actions_photos_spr_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var elli_id = get_npc_id('elli');
	var horse_id = get_npc_id('horse');
	var karen_id = get_npc_id('karen');
	var maria_id = get_npc_id('maria');
	var may_id = get_npc_id('may');
	var mayor_id = get_npc_id('mayor');
	var popuri_id = get_npc_id('popuri');
	var rick_id = get_npc_id('rick');
	var sprite_id = get_npc_id('sprite');

	var dow = get_dow(d, true);
	var has_opener = false;

	/* Openers:
	* 0 - plant potatoes || chop 3 farm stumps
	* 1 - bmf glitch
	* 2+ - chickens / music box
	*/

	var get_horse = (vars['chickens'] == 0 && g >= 1500 && dow != "THURS" && is_sunny == 1 && !is_festival(d));

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
	}
	if (is_sunny == 1) {
		//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	if (vars['openers'] == 0) { a.push({'desc':"Equip hoe"}); }

	if (d == 15) { a.push({'desc':"Ignore Basil on the Farm", 'iid':basil_id}); }
	if (d == 18 && route_id == 0) { a.push({'desc':"Feed Cliff on the Farm", 'cid':cliff_id, 'val':5}); }
	if (d == 25) { a.push({'desc':"Ignore Karen on the Farm", 'iid':karen_id}); }

	if (d == 3) { // Spring 3
		a.push({'desc':"Greet the Mayor", 'iid':mayor_id});
		a.push({'desc':"Straight down; "});
		has_opener = true;
	}

	// New Chicken
	if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
		a.push({'desc':"New Chicken", 'iid':chicken_id});
		has_opener = true;
	}

	// Bring Chicken Inside / Outside
	if (vars['chickens'] > 0 && (flags['chicken_outside'] == 0 || is_sunny == 0)) {
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
			if (is_sunny == 1) {
				//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false});
			}
		}

		if (d == 23) { // Flower Fest
			a.push({'desc':"Go to Town Square", 'iid':mayor_id, 'cid':'v_happiness', 'val':5});
			a.push({'desc':"Buy a Power Nut", 'cid':['f_berry_flowerfest','v_gold'],
					'val':[1, -1000], 'iid':get_npc_id('salesman'), 'sel':(vars['gold'] >= 1000)
			});
			if (route_id == 0) {
				a.push({'desc':"Talk", 'cid':basil_id, 'val':2});
			}
			if (aff[cliff_id] >= 50) {
				a.push({'desc':"Talk", 'cid':cliff_id, 'val':2});
			}
			a.push({'desc':"Talk", 'cid':rick_id, 'val':2});
			a.push({'desc':"Talk", 'cid':mayor_id, 'val':2});
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Talk", 'cid':popuri_id, 'val':2});
			a.push({'desc':"Talk", 'cid':ann_id, 'val':2});
			a.push({'desc':"Dance", 'cid':[ann_id, 'f_dontsave'], 'val':[10, 1], 't2':"Dance ", 'sel':false, 'sr':true});
			a.push({'desc':"Talk", 'cid':maria_id, 'val':2});
			a.push({'desc':"Dance ", 'cid':[maria_id, 'f_dontsave'], 'val':[10, 1], 't2':"Dance", 'sr':true});
		}
	} else { // Not a Festival
		if (vars['openers'] == 0) {
			a.push({'desc':'Till 3 x 3 Spot', 'sr':(d == 3), 'cid':'v_openers', 'val':1});
			has_opener = true;
		}

		if (vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny == 1 && vars['openers'] > 0 && !get_horse) {
			has_opener = true;
			a.push({'desc':"Equip Watering Can", 'red':(flags['potato_planted'] == 0)});
			if (vars['watering_can_fill'] < 30) {
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true,
						'sel':(flags['potato_planted'] > 0 && vars['watering_can_fill'] <= 10)
				});
				if (is_sunny == 1) {
					//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false, 'sr':true});
				}
			}
			if (flags['potato_planted'] > 0) {
				a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'imp':true, 'sel':false});
				if (sell_stuff) {
					a.push({'desc':"Sell Stuff"});
					sell_stuff = false;
				}
			}
		}
		if (sell_stuff) { a.push({'desc':"Sell Stuff"}); }

		if (vars['chickens'] > 0 && flags['new_chick'] <= 1) {
			has_opener = true;
			// new chk | incubate
			if (flags['new_chick'] == 1) {
				a.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'sel':false,
						'val':[d + _CHICK_GROW_SLEEPS, -1], 'sr':false, 't0':"Incubate", 'imp':true
				});
			}
			a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1),
					'iid':chicken_id, 'sr':(flags['new_chick'] == 1), 'sel':false, 'imp':true,
			});
			if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
		}

		if (vars['openers'] >= 2) {
			// Music Box Dig
			if (flags['old_mus_box'] == 0 && !get_horse && (dow != "SUN" || flags['new_mus_box'] == 0)) {
				has_opener = true;
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
				if (!flags['treasure_map']) {
					a.push({'desc':"Treasure Map", 'cid':'f_treasure_map', 'val':1, 'sr':true});
				}
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true, 'iid':get_npc_id("musbox")});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
			} else if (vars['watering_can_fill'] < 30 && !has_opener && !get_horse && flags['potato_planted'] == 2) {
				has_opener = true;
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30});
				if (is_sunny == 1) {
					//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false, 'sr':true});
				}
			}
		}

		// Lumber for Inner Sprite
		if (vars['inner_sprite_aff'] < _SPRITE_SPAM_MAX && aff[sprite_id] < _SPRITE_WINE_MIN) {
			a.push({'desc':"Get 6 Lumber from Bin", 'imp':true, 'iid':get_npc_id('stump')});
		}

		if (!is_festival(d) && !get_horse && !has_opener) {
			if (vars['chickens'] == 0) {
				a.push({'desc':"equip fishing rod, catch fish"});
			} else {
				a.push({'desc':"equip hammer, clear some rocks"});
			}
		}

		if (vars['potatoes'] > 0 && (vars['chickens'] > 1 || (["WED", "THURS"].includes(dow) && is_sunny == 1))) {
			a.push({'desc':"Get Potato for Ann", 'iid':ann_id});
		}

		if (d < 7 && aff[karen_id] < 50 && flags['dog_inside'] == 0) {
			a.push({'desc':"Dog to Crossroads"});
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2, 'sr':true});
		}

		if (flags['fishing_rod'] == 0) {
			a.push({'desc':"Get Fishing Rod", 'val':1, 'cid':'f_fishing_rod', 'iid':get_npc_id('fisherman')});
		}

		// Kappa Berry
		if (d > 3 && !flags['berry_kappa']) {
			a.push({'desc':"Large fish to Kappa", 'cid':'f_berry_kappa', 'val':1, 'iid':get_npc_id('kappa'), 'sel':false});
		}

		var musbox_to_ann = false;
		if (get_horse) {
			// Buy Chicken and get Horse
			var doug_id = get_npc_id('doug');
			var grey_id = get_npc_id('grey');

			if (vars['potatoes'] > 0) {
				a.push({'desc':"Get Potato for Ann", 'iid':ann_id});
			}
			a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers

			// Get Horse
			a.push({'desc':'Get Horse', 'cid':'f_horse', 'val':21, 'iid':horse_id, 'imp':true});
			a.push({'desc':"Fast Text Glitch", 'sr':true, 'hov':true});

			// ANN
			if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':(dow != "SUN")}); }
			a.push({'desc':((dow == "SUN") ? "Talk (Ranch 50%)" : "Talk"), 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':(dow != "SUN")});
			a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(vars['potatoes'] == 0 && dow != "SUN"), 't2':"Potato"});
			a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(vars['potatoes'] > 0 && dow != "SUN"), 't2':"Gift  "});
			if (flags['recipe_ann'] == 0) {
				a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
				a[a.length - 1]['val'] = [1, 6, -1];
			}

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (dow == "WED" && d > 17 && route_id == 0) {
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
		} else if (dow != "THURS" && flags['horse'] > 0) {
			var visit_ranch = (vars['chickens'] > 1 || vars['potatoes'] > 0 || (dow == "WED" && is_sunny == 1 && d > 17));
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

			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (route_id == 0 && d > 17 && is_sunny == 1 && ["TUES", "WED"].includes(dow)) {
				a.push({'desc':"Talk (" + ((dow == "TUES") ? "Beach)" : "Ranch)"), 'cid':cliff_id, 'val':2, 'sel':visit_ranch});
				a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':visit_ranch});
				a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':"Gift    ", 'sr':true, 'sel':false});
			}

			// ANN
			a.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch) ")), 'cid':ann_id, 'val':1, 'sel':(visit_ranch && flags['new_mus_box'] == 0)});
			if (flags['new_mus_box'] == 1) {
				musbox_to_ann = true;
				a[a.length - 1]['t2'] = "MusBox  ";
				a.push({'desc':"MusBox  ", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':true, 't2':a[a.length - 1]['desc']});
			}
			a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(visit_ranch && vars['potatoes'] == 0), 't2':"Potato"});
			a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(visit_ranch && vars['potatoes'] > 0), 't2':"Gift  "});
			if (flags['recipe_ann'] == 0) {
				a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
				a[a.length - 1]['val'] = [1, 6, -1];
			}
		}

		if ((vars['chickens'] == 0 && g < 1500) || (dow == "MON" && is_sunny == 1)) {
			// Mountain visit
			// No chicken yet || MONDAY

			// SPRITE
			if (aff[sprite_id] == 0) { a.push({'desc':"Meet", 'cid':sprite_id, 'val':5}); }
			a.push({'desc':"Talk", 'cid':sprite_id, 'val':1, 'sr':(aff[sprite_id] == 0), 'sel':(aff[sprite_id] < _SPRITE_WINE_MIN), 'red':(aff[sprite_id] >= _SPRITE_WINE_MIN)});
			a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true, 'sel':(a[a.length - 1]['sel'])});
			if (vars['inner_sprite_aff'] < _SPRITE_SPAM_MAX && aff[sprite_id] < _SPRITE_WINE_MIN) {
				var lumber_to_sprite = ((_SPRITE_SPAM_MAX - vars['inner_sprite_aff'] >= 6) ? 6 : (_SPRITE_SPAM_MAX - vars['inner_sprite_aff']));
				lumber_to_sprite = ((lumber_to_sprite > vars['lumber']) ? vars['lumber'] : lumber_to_sprite);
				if (lumber_to_sprite > 0) {
					a.push({'desc':(lumber_to_sprite + " Lumber to Inner Sprite"), 'sr':true,
							'cid':[sprite_id, 'v_inner_sprite_aff', 'v_lumber'],
							'val':[lumber_to_sprite, lumber_to_sprite, -1 * lumber_to_sprite]
					});
				}
			}

			// Chop Lumber for Inner Sprite Gifts
			if ((vars['inner_sprite_aff'] + lumber_to_sprite) < _SPRITE_SPAM_MAX && aff[sprite_id] < _SPRITE_WINE_MIN) {
				a.push({'desc':"Equip Axe, Chop One Stump", 'imp':true, 'val':6, 'cid':'v_lumber', 'iid':get_npc_id('stump')});
			}

			// Strength Wish Power Berry
			if (flags['berry_strength'] == 0 && vars['chickens'] > 0 && flags['old_mus_box'] == 1 && (vars['potato_waters'] >= _POTATO_GROW_DAYS || flags['potato_planted'] == 0)) {
				a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 'sel':false});
			}

			// FORAGE
			a.push({'desc':("cave all, ber, pond all, " + ((d == 3) ? 2 : 3) + " flowers")}); // 2 + 6 = 8

			if (dow == "MON" && is_sunny == 1) {
				// ELLI
				if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
				a.push({'desc':"Talk (MTN)", 'cid':elli_id, 'val':1, 'sr':(aff[elli_id] == 0)});
				a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
					't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
					'sel':(d != 24 && (vars['chickens'] == 0 || flags['new_chick'] == 1))
				});
				a.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':(d == 24 || (vars['chickens'] > 0 && flags['new_chick'] != 1)),
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

				// CLIFF
				// "Gift    " <- 4 spaces
				// "Egg " <- 1 space
				if (d > 17 && route_id == 0) {
					a.push({'desc':"Talk (Hot Springs)", 'cid':cliff_id, 'val':2, 'sel':false, 'red':true});
					a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':false});
					a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':"Gift    ", 'sr':true, 'sel':false});
				}
			}

			if (dow == "SUN" && is_sunny == 1) {
				// ANN
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
				a.push({'desc':"Talk (Goddess Pond)", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Potato"});
				a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':"Gift  "});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
					a[a.length - 1]['val'] = [1, 6, -1];
				}

				// MAY
				if (aff[may_id] == 0) {
					a.push({'desc':"Spam May (Carp House) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false});
				}
			}

			// Blue Mist Photo
			if (vars['openers'] == 1) {
				a.push({'desc':"Blue Mist Flower Glitch", 'iid':get_npc_id("popuri"),
					'cid':['f_photo_popuri', 'v_openers'], 'val':[1, 1], 'imp':true
				});
			}
		} else if (is_sunny == 1) {
			if (!get_horse) {
				a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
			}

			if (route_id == 0) {
				// BASIL
				if (d >= 15 && ["FRI", "SAT"].includes(dow)) {
					a.push({'desc':"Talk (MTN)", 'cid':basil_id, 'val':3});
					a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
				}

				// CLIFF
				// "Gift    " <- 4 spaces
				// "Egg " <- 1 space
				if (d > 17) {
					if (["FRI", "SAT"].includes(dow)) {
						a.push({'desc':"Talk (Fish Tent)", 'cid':cliff_id, 'val':2});
						a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
						a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
					}
					if (["THURS", "SUN"].includes(dow)) {
						a.push({'desc':"Talk (Carp House)", 'cid':cliff_id, 'val':2, 'sel':false, 'red':((vars['chickens'] > 0 || g >= 1500) && (dow != "MON" || is_sunny == 0))});
						a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':false});
						a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':"Gift    ", 'sr':true, 'sel':false});
					}
				}
			}
		}

		if (!get_horse && is_sunny == 0) {
			a.push({'desc':"ed, ber, flower"}); // Quick gifts for villagers
		}
		
		// POPURI
		if (["MON", "TUES", "WED", "THURS"].includes(dow) && route_id == 5) {
			if (aff[popuri_id] == 0) {
				a.push({'desc':"Meet", 'cid':popuri_id, 'val':4});
			}
			a.push({'desc':"Talk", 'cid':popuri_id, 'val':1, 'sr':(aff[popuri_id] == 0)});
			a.push({'desc':" Gift ", 'cid':popuri_id, 'val':1, 'sel':false, 't2':" Flower ", 'sr':true});
			a.push({'desc':" Flower ", 'cid':popuri_id, 'val':3, 't2':" Gift ", 'sr':true});
		}

		// BASIL
		if (d >= 15 && route_id == 0) {
			if (is_sunny == 1 && dow == "THURS") {
				a.push({'desc':"Talk (Greenhouse)", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			} else if (dow == "WED") {
				a.push({'desc':"Talk (Flower Shop) ", 'cid':basil_id, 'val':3});
				a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});
			}
		}

		// ELLI
		// "Gift " <- one space
		// "Talk " <- one space
		if (["TUES", "WED", "THURS", "FRI", "SAT"].includes(dow)) {
			if (aff[elli_id] == 0) { a.push({'desc':"Meet", 'cid':elli_id, 'val':4}); }
			a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk (Bakery)"), 'cid':elli_id, 'val':1,
					'sr':(aff[elli_id] == 0), 't2':"MusBox ",
					'sel':(flags['new_mus_box'] != 1 || musbox_to_ann)});
			a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':(flags['new_mus_box'] == 1 && !musbox_to_ann), 't2':a[a.length - 1]['desc']});
			a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
				't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
				'sel':(d != 24 && (vars['chickens'] == 0 || flags['new_chick'] == 1))
			});
			a.push({
				'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
				'sel':(d == 24 || (vars['chickens'] > 0 && flags['new_chick'] != 1)),
				'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
				'val':((vars['chickens'] > 0) ? ((flags['recipe_elli'] == 0) ? ([1, 6]) : 4) : 3)
			});
		}

		// POTATOES
		if (vars['openers'] == 0) {
			a.push({'desc':"Buy Potato Seeds", 'iid':get_npc_id('lillia'), 'imp':true});
		}

		// MAYOR
		if (is_sunny == 1) {
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

		// RICK (NO NEW BOX IN INVENTORY)
		// "Talk  " - 2 spaces
		// "Gift  " - 2 spaces
		if (flags['new_mus_box'] == 0 && is_sunny == 1) {
			if (dow == "THURS") {
				// ANN in RICKs shop
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
				a.push({'desc':"Talk", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Potato"});
				a.push({'desc':"Potato", 'cid':[ann_id, 'v_potatoes'], 'val':3, 'sr':true, 'sel':false, 't2':"Gift  "});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id, 'v_potatoes'];
					a[a.length - 1]['val'] = [1, 6, -1];
				}
			}
			if (!["WED", "SUN"].includes(dow)) {
				if (aff[rick_id] == 0) { a.push({'desc':"Meet", 'cid':rick_id, 'val':4, 'sel':(dow != "SAT"), 't3':"Talk  "}); }
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(dow != "SAT")});
				a.push({'desc':"Gift  ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':(dow != "SAT" && aff[rick_id] <= (_RICK_FIX_MIN - 3))});
				if (aff[rick_id] >= (_RICK_FIX_MIN - 6) && vars['openers'] >= 2) {
					a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
						'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't3':"Talk  "
					});
				}
				if (vars['gold'] >= 600 && flags['horse_brush'] == 0 && vars['chickens'] > 0) {
					a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true, 'imp':true});
				}
			} else if (dow == "SUN") {
				if (flags['new_mus_box'] == 0) {
					a.push({'desc':"Talk (Town Square) ", 'cid':rick_id, 'val':3, 'sel':false});
					a.push({'desc':"Gift  ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
					a.push({'desc':"Rick Fix", 'sr':true, 'sel':false,
							'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1], 't3':"Talk (Town Square) "
					});
				} else {
					a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
				}
			}
		}

		// BASIL (in Town Square on SUNDAY)
		if (route_id == 0 && d >= 15 && dow == "SUN" && is_sunny == 1) {
			a.push({'desc':"Talk (Town Square)", 'cid':basil_id, 'val':3});
			a.push({'desc':"Gift", 'cid':basil_id, 'val':3, 'sr':true});

			// MAY
			if (aff[may_id] == 0) {
				a.push({'desc':"Spam May (Town Square) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false});
			}
		}

		if (d == 21 && is_sunny == 1) {
			// Vote on the Goddess
			a.push({'desc':"Vote for Goddess (ANY BUT THE TOP OPTION)"});
		}

		// RICK (NEW BOX IN INVENTORY)
		if (flags['new_mus_box'] == 1) {
			if (dow == "THURS") {
				// ANN in RICKs shop
				if (aff[ann_id] == 0) { a.push({'desc':"Meet", 'cid':ann_id, 'val':4, 'sel':false}); }
				a.push({'desc':"Talk", 'cid':ann_id, 'val':1, 'sr':(aff[ann_id] == 0), 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Potato"});
				a.push({'desc':"Potato", 'cid':ann_id, 'val':3, 'sr':true, 'sel':false, 't2':"Gift  "});
				if (flags['recipe_ann'] == 0) {
					a[a.length - 1]['cid'] = ['f_recipe_ann', ann_id];
					a[a.length - 1]['val'] = [1, 6];
				}
			}
			if (is_sunny == 1 && !["WED", "SUN"].includes(dow)) {
				a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT")});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
				a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"),
					'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1],
					't0':"MusBox", 't3':"Talk  "
				});
			}
		}

		// MARIA
		// " Talk" -1 spaces
		if (dow != "MON") {
			// Maria in library
			if (aff[maria_id] == 0) { a.push({'desc':"Meet", 'cid':maria_id, 'val':4}); }
			a.push({'desc':"Talk (Library)", 'cid':maria_id, 'val':1, 'sr':(aff[maria_id] == 0),
				'sel':((aff[rick_id] < _RICK_FIX_MIN - 6) || is_sunny == 0 || (["SAT", "SUN", "WED"].includes(dow)))
			});
			if (aff[rick_id] >= _RICK_FIX_MIN - 6) {
				a[a.length - 1]['t2'] = "MusBox";
				a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'],
					'sel':(!((aff[rick_id] < _RICK_FIX_MIN - 6) || is_sunny == 0 || (["SAT", "SUN", "WED"].includes(dow))))
				});
			}
			a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});

			// MAY
			if (aff[may_id] < 100 && is_sunny == 0) {
				a.push({'desc':"Spam May (Library) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false});
			}
		} else if (is_sunny == 0 && aff[maria_id] >= _SICK_EVENT_MIN && !flags["sick_maria"]) {
			// Sick Event
			a.push({'desc':"Sick Event", 'cid':[maria_id, "f_sick_maria"], 'val':[_SICK_EVENT_AFF, 1]});
		}

		// MAY
		if (aff[may_id] < 100 && is_sunny == 1) {
			a.push({'desc':"Spam May (By Midwife) [83 Talks]", 'cid':may_id, 'val':255, 'sel':false});
		}

		// Potatoes; Equip before entering farm screen
		if (vars['openers'] == 0) {
			a.push({'desc':"Equip Seeds", 'imp':true});
			a.push({'desc':"Plant Potatoes", 'cid':['f_potato_planted', 'v_openers', 'v_gold'], 'val':[1, 1, -200], 'sr':true});
		} else if (flags['potato_planted'] == 1 && vars['potato_waters'] < _POTATO_GROW_DAYS && is_sunny == 1 && vars['openers'] > 0 && get_horse) {
			// Watering Potatoes at end of day if getting horse
			// (otherwise you dont get to the ranch early enough for the text glitch)
			a.push({'desc':"Equip Watering Can", 'imp':true});
			a.push({'desc':"Water Potatoes", 'cid':['v_potato_waters', 'v_watering_can_fill'], 'val':[1, -10], 'sr':true, 'sel':false});
			a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sel':(vars['watering_can_fill'] <= 10)});
			if (is_sunny == 1) {
				//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false, 'sr':true});
			}
		}

		if (get_horse || (is_sunny == 1 && flags['chicken_inside'] == 1)) {
			a.push({'desc':"Chicken Outside", 'val':1, 'cid':'f_chicken_outside', 'imp':true, 'iid':chicken_id});
		}

		// Dog Karen
		if ([3, 5, 6].includes(d)) {
			// Dog Karen in Mtns on Spr 3 or 5 or 6 (25%)
			if (is_sunny == 1 && aff[karen_id] < 50) {
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
				if (is_sunny == 1) {
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
	if (flags['horse'] != 0 || get_horse) {
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Equip Brush", 'iid':horse_id});
		}
		a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
		a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':false});
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
		}
	}

	// Feed Dog
	a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false, 'red':(vars['chickens'] == 0)});

	// End of Season, save potatoes
	if (d == 30 && vars['potatoes'] > 0) {
		a.push({'desc':"Sell stuff, pocket all potatoes", 'imp':true});
	}

	if (flags['dog_inside'] == 0 && (aff[karen_id] > 50 || d == 6)) {
		a.push({'desc':"Bring Dog Inside", 'cid':'f_dog_inside', 'val':1, 'iid':dog_id});
	}
	return a;
}
