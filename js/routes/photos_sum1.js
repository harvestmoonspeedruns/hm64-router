function actions_photos_sum_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var elli_id = get_npc_id('elli');
	var kent_id = get_npc_id('kent');
	var maria_id = get_npc_id('maria');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');

	var dow = get_dow(d, true);
	var cur_maria_aff = aff[maria_id];
	var mtn_visit = ((d < 42 || dow == "MON") && (aff[maria_id] < (_PHOTO_MIN - ((flags['dream_maria'] == 0) ? _DREAM_EVENT_AFF : 0) - ((flags['ankle_maria'] == 0) ? _ANKLE_EVENT_AFF : 0))) && is_sunny);
	var mus_box_gift = false;

	if (is_sunny == 1 && !is_festival(d + 1) && vars['chickens'] > 0 && flags['chicken_funeral'] == 0) {
		// Check Tomorrows Weather if you have chickens outside
		a.push({'desc':"Check Weather: "});
		var tmp_weather = ["Sunny", "Rainy", "Typhoon"];
		for (var i = 0; i < tmp_weather.length; i++) {
			a.push({'desc':tmp_weather[i], 'cid':'f_good_weather', 'val':(0 - i), 'sr':true, 'sel':(i == 0),
					't2':tmp_weather.filter(function(val){ return val.localeCompare(tmp_weather[i]) != 0; })
			});
			if (is_sunny == 1) {
				if (i != 0) { a[a.length - 1]['t3'] = []; }
				if (flags['chicken_outside'] == 0) {
					if (i == 0) { a[a.length - 1]['t3'] = []; }
					a[a.length - 1]['t' + Math.floor(3 - (.2 * i))].push("Chicken Outside");
				}
				a[a.length - 1]['t' + Math.floor(2.8 + (.3 * i))].push((flags['chicken_outside'] == 1) ? "Chicken Inside / Feed" : "Feed Chicken");
			}
		}
	}

	if (flags['chicken_funeral'] == 1) {
		a.push({'desc':"Chicken Funeral", 'iid':get_npc_id('pastor'), 'val':-1, 'cid':'f_chicken_funeral'});
	} else {
		// Dog Affection
		if (flags['dog_inside'] == 1) {
			a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
		}
		if (is_sunny == 1) {
			a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
		}

		// Music Box Dig
		if (flags['old_mus_box'] == 0 && is_sunny == 1) {
			if (d == 31) {
				a.push({'desc':"NO MUSIC BOX DIG (Farm visitors all day)", 'imp':true});
				// Strength Wish Power Berry
				if (vars['chickens'] > 0 && flags['berry_strength'] == 0) {
					a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 'imp':true});
				}
			} else if (!is_festival(d)){
				// dig music box
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
				a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false, 'sr':true});
			}
		}

		// Horse Affection
		var horse_id = get_npc_id('horse');
		a.push({'desc':"Whistle Horse", 'val':1, 'cid':get_npc_id('horse')});
		a.push({'desc':((flags['horse'] == 1) ? "Ride Horse": "Talk to Horse"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true});

		// New Chicken
		if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
			a.push({'desc':"New Chicken", 'iid':get_npc_id('chicken')});
		}

		if (is_sunny != -1) { // No Typhoon

			// Chicken Inside / Feed or Chicken Outside
			if (vars['chickens'] > 0) {
				a.push({'desc':((flags['chicken_outside'] == 1) ? "Chicken Inside / Feed" : "Feed Chicken"),
						'cid':((flags['chicken_outside'] == 1) ? ['f_chicken_outside', 'v_feed'] : 'v_feed'),
						'val':((flags['chicken_outside'] == 1) ? [-1, -1] : -1),
						'imp':(is_sunny != flags['chicken_outside']), 'sel':(is_sunny == 0),
						'sr':(vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d)
				});
				if (flags['chicken_outside'] == 0 && is_sunny == 1) {
					a[a.length - 1]['t1'] = "Chicken Outside";
					a[a.length - 1]['t2'] = "Chicken Outside";
					a.push({'desc':"Chicken Outside", 'cid':'f_chicken_outside', 'val':1, 'imp':true, 'sr':true,
							't1':"Feed Chicken", 't2':"Feed Chicken", 'sel':(is_sunny == 1)
					});
				}
			}

			// New Chicken | Incubate
			if (vars['chickens'] > 0 && flags['new_chick'] <= 1) {
				var chicken_id = get_npc_id('chicken');
				// new chk | incubate
				if (flags['new_chick'] == 1) {
					a.push({'desc':"New Chick", 'iid':chicken_id, 'cid':["v_new_chicken_days", "f_new_chick"], 'val':[d + _CHICK_GROW_SLEEPS, -1], 't0':"Incubate", 'sel':(!is_festival(d) || flags['chicken_outside'] == 0)});
				}
				a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'iid':chicken_id, 'sr':(flags['new_chick'] == 1), 'sel':(!is_festival(d) || flags['chicken_outside'] == 0)});
				if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
			}

			if (is_sunny == 1) {
				// Water Corn
				if (flags['corn_planted']) {
					a.push({'desc':"Equip Watering Can", 'imp':(!is_festival(d) || flags['chicken_outside'] == 0)});
					a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sel':false, 'sr':true});
					a.push({'desc':"Water Corn", 'cid':['v_watering_can_fill', 'v_corn_waters'], 'val':[-10, 1], 'sr':true, 'sel':(!is_festival(d) || flags['chicken_outside'] == 0)});
					a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sel':false, 'sr':true});
				}
				if (vars['corn_waters'] >= _CORN_GROW_DAYS && !is_festival(d)) {
					a.push({'desc':"Corn for Basil / Ann"});
				}
			}

			if (is_festival(d)) {
				// 9 -  Veg Fest
				// 24 - Sea Fest

				// Sea Festival
				if (d == 54) { // Swim Fest
					a.push({'desc':"Go to the Beach", 'imp':true});
					a.push({'desc':"Win Swim Festival", 'iid':mayor_id, 'imp':true,
							'cid':["f_photo_swimming", get_npc_id('jeff'), get_npc_id('grey'), get_npc_id('harris'), get_npc_id('kai'), cliff_id, 'v_happiness', 'f_dontsave'],
							'val':[1, 8, 8, 8, 8, 8, 5, 1]
					});
				}
			} else {
				// Gifts for Villagers
				a.push({'desc':"ed, flower, walnut"});

				// Spam Kent with Chicken
				if (aff[kent_id] < 100 && is_sunny == 1 && (dow == "SAT" || (mtn_visit && dow == "SUN"))) {
					a.push({'desc':"Chicken to Mtns", 'iid':get_npc_id('chicken')});
				}

				// ANN SICK EVENT
				if (dow == "SUN" && is_sunny == 0 && aff[ann_id] >= _SICK_EVENT_MIN && flags['sick_ann'] == 0 && aff[ann_id] < _PHOTO_MIN) {
					a.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1]});
					a = ranch_stuff_sum(a, dow, is_sunny);
				} else if (flags['photo_maria'] == 0 && (vars['potatoes'] > 0 || vars['chickens'] > 1)) {
					a = ranch_stuff_sum(a, dow, is_sunny);
				}

				// BASIL
				// "Gift   " <- 3 spaces
				if (["FRI", "SAT"].includes(dow) && aff[basil_id] < _BASIL_BERRY_MIN && is_sunny == 1) {
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
				if (!["TUES", "WED"].includes(dow) && is_sunny == 1) {
					a.push({'desc':get_cliff_loc(dow), 'cid':cliff_id, 'val':2, 'sel':(dow == "THURS" && mtn_visit)});
					a.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':(dow == "THURS" && mtn_visit)});
					a.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 't2':"Gift    ", 'sr':true, 'sel':false});
				}

				// Spam Kent with Chicken
				if (aff[kent_id] < 100 && is_sunny == 1 && dow == "SAT") {
					a.push({'desc':"Chicken Spam Fish Tent (85 Talks)", 'val':255, 'cid':kent_id, 'sel':false});
				}

				if (mtn_visit) {
					// Library closed; Mountain Visit

					// Spam Kent with Chicken
					if (aff[kent_id] < 100 && is_sunny == 1 && dow == "SUN") {
						a.push({'desc':"Chicken Spam Carp House (85 Talks)", 'val':255, 'cid':kent_id, 'sel':false});
					}

					// Strength Wish Power Berry
					if (vars['chickens'] > 0 && flags['berry_strength'] == 0 && d != 31) {
						a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 'sel':false});
					}

					// SPRITE
					var sprite_id = get_npc_id('sprite');
					if (aff[sprite_id] < (_SPRITE_WINE_MIN - 1)) {
						a.push({'desc':"Talk", 'cid':sprite_id, 'val':1});
						a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true});
					}

					// MARIA
					mus_box_gift = (flags['new_mus_box'] == 0);
					a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sel':(flags['new_mus_box'] == 0)});
					a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
								'sel':(flags['new_mus_box'] == 1), 't2':"Talk (MTN / CHUR)"
					});
					a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true});
					cur_maria_aff += (_MUS_BOX_AFF + 1);

					// ANN
					if (dow == "SUN") {
						a.push({'desc':"Talk (MTN)", 'cid':ann_id, 'val':1, 'sel':false, 't2':"MusBox  "});
						a.push({'desc':"MusBox  ", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
						a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Corn / Potato"});
						a.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':"Gift  "});
					}
				}

				if (flags['photo_maria'] == 1 && !["THURS", "SUN"].includes(dow) && flags['new_mus_box'] == 1) {
					a = ranch_stuff_sum(a, dow, is_sunny);
					mus_box_gift = true;
				}

				// CORN
				if (flags['corn_planted'] == 0) {
					a.push({'desc':"Buy Corn", 'iid':get_npc_id('lillia')});
				}

				// BASIL
				// "Gift   " <- 3 spaces
				if (is_sunny && ["MON", "TUES", "WED", "THURS"].includes(dow) && aff[basil_id] < _BASIL_BERRY_MIN) {
					a.push({'desc':get_basil_loc(dow), 'cid':basil_id, 'val':3, 'sel': (["WED", "THURS"].includes(dow))});
					a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(vars['corn_waters'] < _CORN_GROW_DAYS && ["WED", "THURS"].includes(dow)), 't2':"Corn"});
					a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':(vars['corn_waters'] >= _CORN_GROW_DAYS && ["WED", "THURS"].includes(dow)),
						'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
						'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
					});
				}

				// ELLI
				// "Gift " <- one space
				if (!["SUN", "MON"].includes(dow) && aff[elli_id] < _PHOTO_MIN) {
					if (is_sunny == 0 && aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
						// Elli Sick Event
						a.push({'desc':"Sick Event", 'cid':[elli_id, 'f_sick_elli'], 'val':[_SICK_EVENT_AFF, 1]});
					} else {
						a.push({'desc':("Talk (" + ((dow == "WED") ? "Flower Shop) " : "Bakery) ")), 'cid':elli_id, 'val':1, 't2':"MusBox ",
							'sel':(flags['new_mus_box'] == 0 || flags['photo_maria'] == 0 || mus_box_gift)});
						a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'],
							'sel':(flags['new_mus_box'] == 1 && flags['photo_maria'] == 1 && !mus_box_gift)});
						a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
							't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
							'sel':(vars['chickens'] == 0 || flags['new_chick'] < 2)
						});
						if (!mus_box_gift) {
							mus_box_gift = (flags['new_mus_box'] == 1 && flags['photo_maria'] == 1 && !mus_box_gift);
						}
						a.push({
							'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
							'sel':(vars['chickens'] > 0 && flags['new_chick'] >= 2),
							'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
							'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
						});
					}
				}

				// MAYOR
				if (dow == "SUN") {
					a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3});
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
					// Affection should keep up with Ricks.
					// If greater, gifts to the mayor arent required.
				} else if (is_sunny) {
					a.push({'desc':"Talk", 'cid':mayor_id, 'val':3});
					if (dow == "SAT") {
						a[a.length - 1]['desc'] += " (" + ((d >= 42) ? "Lib" : "Ricks Shop") + " 50%)";
						a[a.length - 1]['sel'] = (d >= 42);
					}
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
				}

				// RICK
				if (is_sunny == 1) {
					// ANN in Ricks shop
					// "Gift  " <- two spaces
					if (dow == "THURS") {
						a.push({'desc':"Talk (Rick Shop)", 'cid':ann_id, 'val':1, 'sel':false, 't2':"MusBox  "});
						a.push({'desc':"MusBox  ", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
						a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false});
						a.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 't2':"Gift  ", 'sel':false});
					}
					if (!["WED", "SUN"].includes(dow)) {
						a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':(dow != "SAT"), 't0':"Rick Fix"});
						a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"), 't3':"Talk  ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
						a.push({'desc':"Gift", 'sr':true, 'sel':false, 'cid':rick_id, 'val':3});
					} else if (dow == "SUN") {
						if (flags['new_mus_box'] == 1) {
							a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
						}
						a.push({'desc':"Talk (Town Square) ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':false, 't0':"Rick Fix"});
						a.push({'desc':"Rick Fix", 'sr':true, 'sel':false, 't3':"Talk (Town Square) ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
						a.push({'desc':"Gift", 'sr':true, 'sel':false, 'cid':rick_id, 'val':3});

						// BASIL (in Town Square on SUNDAY)
						if (aff[basil_id] < _BASIL_BERRY_MIN) {
							a.push({'desc':"Talk (Town Square)", 'cid':basil_id, 'val':3});
							a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(vars['corn_waters'] < _CORN_GROW_DAYS), 't2':"Corn"});
							a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':(vars['corn_waters'] >= _CORN_GROW_DAYS),
									'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
									'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
							});
						}
					}
				}

				// ELLI DREAM ANKLE
				if (flags['dream_elli'] == 0 && aff[elli_id] >= _DREAM_EVENT_MIN) {
					a.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_ANKLE_EVENT_AFF, 1]});
				}
				if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					a.push({'desc':"ANKLE (Mtn)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false, 'sr':(flags['dream_elli'] == 0)});
				}

				// MARIA SICK EVENT
				if (is_sunny == 0 && dow == "MON" && aff[maria_id] >= _SICK_EVENT_MIN && flags['sick_maria'] == 0 && flags['photo_maria'] == 0) {
					a.push({'desc':"Sick Event", 'cid':[maria_id, 'f_sick_maria'], 'val':[_SICK_EVENT_AFF, 1]});
					a.push({'desc':"Talk", 'cid':mayor_id, 'val':3});
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
					cur_maria_aff += _SICK_EVENT_AFF;
				}

				// MARIA ANKLE / DREAM / PHOTO
				if (d >= 41 && dow != "MON" && flags['photo_maria'] == 0 && aff[maria_id] >= _ANKLE_EVENT_MIN) {
					if (flags['ankle_maria'] == 0) {
						a.push({'desc':"ANKLE (Library)", 'cid':[maria_id, 'f_ankle_maria'], 'val':[_ANKLE_EVENT_AFF, 1]});
					} else if (dow != "SUN" && is_sunny == 1 && aff[maria_id] >= (_PHOTO_MIN - _DREAM_EVENT_AFF) && flags['dream_maria'] == 0) {
						a.push({'desc':"DREAM (Library)", 'cid':[maria_id, 'f_dream_maria'], 'val':[_DREAM_EVENT_AFF, 1]});
						a = visit_bar(a, dow, is_sunny);
						cur_maria_aff += _DREAM_EVENT_AFF;
					}
				}

				// ANN
				if (flags['photo_maria'] == 1 && !["THURS", "SUN"].includes(dow) && flags['new_mus_box'] == 0) {
					a = ranch_stuff_sum(a, dow, is_sunny);
				}

				if (cur_maria_aff >= _PHOTO_MIN && flags['photo_maria'] == 0 && is_sunny == 1) {
					a.push({'desc':"Photo Event", 'cid':[maria_id, 'f_photo_maria'], 'val':[_PHOTO_EVENT_AFF, 1]});
				}

				if (d == 31) { // Fireworks Festival
					// CORN
					a.push({'desc':"Gather gifts for Bar;"});
					a.push({'desc':"Equip Corn", 'sr':true});
					a.push({'desc':"Plant Corn", 'iid':get_npc_id('lillia'), 'cid':['v_gold', 'f_corn_planted'], 'val':[-300, 1], 'sr':true});
					a.push({'desc':"Equip Watering Can"});
					a.push({'desc':"Water Corn", 'cid':['v_watering_can_fill', 'v_corn_waters'], 'val':[-10, 1], 'sr':true});
					a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true, 'sel':false});
					a.push({'desc':"Scare birds by pond", 'cid':'v_happiness', 'val':1, 'sel':false});
					a.push({'desc':"Equip hammer, Clear rocks on farm until 5 PM"});
					a = visit_bar(a, dow, is_sunny, true);
					a.push({'desc':"Fireworks (Town Square)", 'cid':[maria_id, 'f_dontsave'], 'val':[5, 1]});
					if (aff[maria_id] >= 55) {
						// Bonus Sparkler Scene at 55 aff or higher
						a[a.length - 1]['cid'].push('v_happiness');
						a[a.length - 1]['val'].push(5);
					}
				} else if (dow != "SUN" && !(is_sunny == 1 && aff[maria_id] >= (_PHOTO_MIN - _DREAM_EVENT_AFF) && flags['dream_maria'] == 0)){
					if (aff[get_npc_id('bartender')] < (_DUKE_WINE_MIN - 10)) {
						a = visit_bar(a, dow, is_sunny, false);
					}
				}
			}

			// Feed dog
			a.push({'desc':"Feed Dog", 'cid':get_npc_id('dog'), 'val':2, 'sel':false});
		
			if (d == 60) { a.push({'desc':"Harvest Corn", 'imp':true}); }
		} else {
			// Today is a Typhoon
			if (vars['chickens'] > 0) {
				a.push({'desc':"Chickens Outside?", 'val':[1, -1 * vars['chickens']], 'cid':['f_chicken_funeral', 'v_chickens'], 'sel':(flags['chicken_outside'] == 1), 'iid':get_npc_id('chicken')});
			}
		}
	} // End of Not Chicken Funeral
	return a;
}

function ranch_stuff_sum(tmp_act = [], dow = get_dow(vars['day']), is_sunny = 1) {
	if (dow != "THURS") {
		if (vars['chickens'] > 1) {
			tmp_act.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});
		}

		if (vars['chickens'] > 1 || flags['photo_maria'] == 1 || vars['potatoes'] > 0 || vars['corn_waters'] >= _CORN_GROW_DAYS) {
			// ANN
			// "Gift  " <- 2 spaces

			var ann_id = get_npc_id('ann');
			tmp_act.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch)")), 'cid':ann_id, 'val':1, 't2':"MusBox  ", 'sel':(dow != "SUN" && (aff[get_npc_id('maria')] < _PHOTO_MIN || (flags['new_mus_box'] == 0 && (is_sunny == 0 || ["WED", "SAT", "SUN"].includes(dow)))))});
			tmp_act.push({'desc':"MusBox  ", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':(aff[get_npc_id('maria')] >= _PHOTO_MIN && (flags['new_mus_box'] == 1 || (is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)))), 't2':tmp_act[tmp_act.length - 1]['desc']});
			tmp_act.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 'sel':(vars['potatoes'] <= 0 && vars['corn_waters'] < _CORN_GROW_DAYS && dow != "SUN"), 't2':"Corn / Potato"}); 
			tmp_act.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(dow != "SUN" && (vars['potatoes'] > 0 || vars['corn_waters'] >= _CORN_GROW_DAYS)), 't2':"Gift  "});

			if (is_sunny == 1) {
				// CLIFF
				// "Gift    " <- 4 spaces
				// "Egg " <- 1 space
				var cliff_id = get_npc_id('cliff');
				if (["TUES", "WED"].includes(dow) && aff[cliff_id] < _PARTY_ATTEND_MIN && (aff[elli_id] < 160 || dow == "WED")) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 160-ish

					tmp_act.push({'desc':get_cliff_loc(dow), 'cid':cliff_id, 'val':2});
					tmp_act.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true});
					tmp_act.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true});
					if (dow == "TUES") {
						tmp_act.push({'desc':"Scare crab", 'cid':'v_happiness', 'val':1, 'sr':true});
					}
				}

				// ELLI Beach
				// "Gift " <- 1 space
				var elli_id = get_npc_id('elli');
				if (dow == "MON" && aff[elli_id] < 160) {
					// Cutscene between Karen and Elli occurs when Elli is >= 160-ish,
					// so to avoid this cutscene, dont visit the beach when Elli is >= 160

					tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox "});
					tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc']});
					tmp_act.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
						't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
						'sel':(vars['chickens'] == 0 || flags['new_chick'] < 2)
					});
					tmp_act.push({
						'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
						'sel':(vars['chickens'] > 0 && flags['new_chick'] >= 2),
						'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
						'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
					});
					tmp_act.push({'desc':"Scare crab", 'cid':'v_happiness', 'val':1, 'sr':true});
					if (flags['dream_elli'] == 0 && aff[elli_id] >= (_DREAM_EVENT_MIN - _MUS_BOX_AFF - 4)) {
						tmp_act.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
					}
					if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
						tmp_act.push({'desc':"ANKLE (Mtn)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
					}
				}
			}
		}
	}
	return tmp_act;
}

function visit_bar(tmp_act = [], dow = get_dow(vars['day'], true), is_sunny = 1, imp_visit = true, cl = "", bl = "") {
	if (dow != "SUN") {
		tmp_act.push({'desc':"Go to Bar" + ((imp_visit) ? "" : " if 5PM or later, otherwise sleep")});

		var duke_id = get_npc_id('bartender');
		tmp_act.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sel':imp_visit, 'imp':imp_visit});
		tmp_act.push({'desc':"Gift", 'cid':duke_id, 'val':3, 'sel':imp_visit, 'sr':true});
		tmp_act.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true, 'sel':(aff[duke_id] >= (_DUKE_WINE_MIN - 6))});

		// BASIL
		// "Gift   " <- 3 spaces
		var basil_id = get_npc_id('basil');
		if (dow != "WED" && (is_sunny == 0 || ["MON", "TUES"].includes(dow)) && aff[basil_id] < 200) {
			tmp_act.push({'desc':"Talk (Bar)", 'cid':basil_id, 'val':3, 'sel':false});
			tmp_act.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':false, 't2':"Corn"});
			tmp_act.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':false,
						'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
						'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
			});
		}

		// CLIFF
		// "Gift    " <- 4 spaces
		var cliff_id = get_npc_id('cliff');
		if (aff[cliff_id] < _PARTY_ATTEND_MIN) {
			var cliff_exists = false;
			for (let key in tmp_act) {
				if (tmp_act[key]['cid'] == cliff_id) {
					cliff_exists = true;
				}
			}
			if (!cliff_exists) {
				tmp_act.push({'desc':"Talk (Bar)", 'cid':cliff_id, 'val':2, 'sel':false});
				tmp_act.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':false, 't2':" Egg"});
				tmp_act.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true, 't2':" Gift"});
			}
		}
	}
	return tmp_act;
}

function get_cliff_loc (dow = null, is_sunny = 1) {
	if (dow === null) { return null; }
	var cliff_loc = "Talk (";
	if (is_sunny == 1) {
		if (dow == "MON") { cliff_loc += "Hot Springs"; }
		if (dow == "TUES") { cliff_loc += "Beach"; }
		if (dow == "WED") { cliff_loc += "Ranch"; }
		if (["THURS", "SUN"].includes(dow)) { cliff_loc += "Outside Carp House"; }
		if (["FRI", "SAT"].includes(dow)) { cliff_loc += "Fish Tent 50%"; }
		return cliff_loc + ")";
	} else {
		return ((dow == "TUES") ? null : (cliff_loc + "Inside Carp House)"));
	}
}

function get_basil_loc (dow = null, is_sunny = 1) {
	if (dow === null) { return null; }
	var basil_loc = "Talk (";
	if (is_sunny == 1) {
		if (dow == "THURS") { basil_loc += "Greenhouse"; }
		else if (["FRI", "SAT"].includes(dow)) { basil_loc += "Fish Tent"; }
		else if (dow == "SUN") { basil_loc += "Town Square"; }
		else { basil_loc += "Flower Shop"; }
		return basil_loc + ")";
	} else {
		return ((dow == "SUN") ? null : (basil_loc + "Flower Shop)"));
	}
}
