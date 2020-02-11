function actions_photos_sum_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var elli_id = get_npc_id('elli');
	var harris_id = get_npc_id('harris');
	var horse_id = get_npc_id('horse');
	var grey_id = get_npc_id('grey');
	var jeff_id = get_npc_id('jeff');
	var kai_id = get_npc_id('kai');
	var karen_id = get_npc_id('karen');
	var maria_id = get_npc_id('maria');
	var mayor_id = get_npc_id('mayor');
	var popuri_id = get_npc_id('popuri');
	var rick_id = get_npc_id('rick');
	var sprite_id = get_npc_id('sprite');

	var dow = get_dow(d, true);
	var cur_maria_aff = aff[maria_id];
	var mtn_visit = ((d < 41 || dow == "MON") && aff[maria_id] < (_DREAM_EVENT_MIN - 1) && is_sunny); // DONT TRIGGER DREAM EVENT
	var photo_maria_disp = false;

	if (is_sunny == 1 && !is_festival(d + 1) && vars['chickens'] > 0 && flags['chicken_funeral'] == 0 && d != 60) {
		// Check Tomorrows Weather (if valid)
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
			a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
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
				// Blue Mist Flower
				if (flags['photo_popuri'] == 0) {
					a.push({'desc':"Blue Mist Flower Glitch", 'iid':popuri_id, 'cid':'f_photo_popuri', 'val':1,
							'sr':(vars['chickens'] > 0 && flags['berry_strength'] == 0), 'sel':false
					});
				}
			} else if (!is_festival(d)){
				// Dig music box
				a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
				a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
				if (flags['berry_farm'] == 0) {
					a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
				}
			}
		}

		// New Chicken
		if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
			a.push({'desc':"New Chicken", 'iid':chicken_id});
		}

		if (is_sunny != -1) { // No Typhoon

			// Chicken Inside / Feed or Chicken Outside
			if (vars['chickens'] > 0) {
				a.push({'desc':((flags['chicken_outside'] == 1) ? "Chicken Inside / Feed" : "Feed Chicken"),
						'cid':((flags['chicken_outside'] == 1) ? ['f_chicken_outside', 'v_feed'] : 'v_feed'),
						'val':((flags['chicken_outside'] == 1) ? [-1, -1] : -1), 'iid':chicken_id,
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
				// new chk
				if (flags['new_chick'] == 1) {
					a.push({'desc':"New Chick", 'cid':["v_new_chicken_days", "f_new_chick"],
							'val':[d + _CHICK_GROW_SLEEPS, -1], 'sel':false, 'sr':(vars['chickens'] > 0)
					});
					if (a[a.length - 1]['sr'] == false) { a[a.length - 1]['iid'] = chicken_id; }
				}

				/* INCUBATE
				a.push({'desc':"Incubate", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1),
						'sr':(flags['new_chick'] == 1 || vars['chickens'] > 0), 'sel':false
				});
				if (vars['chickens'] == 0 && flags['new_chick'] != 1) {
					a[a.length - 1]['iid'] = chicken_id;
				}
				if (flags['new_chick'] == 1) { a[a.length - 1]['t3'] = "New Chick"; }
				*/
			}

			if (is_sunny == 1 && d < 60 && flags['corn_planted'] == 1) {
				// Water Corn
				a.push({'desc':"Equip Watering Can", 'imp':(!is_festival(d) || flags['chicken_outside'] == 0)});
				a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sel':false, 'sr':true});
				a.push({'desc':"Water Corn", 'cid':['v_watering_can_fill', 'v_corn_waters'], 'val':[-10, 1], 'sr':true, 'sel':false});
				if (vars['corn_waters'] >= _CORN_GROW_DAYS && !is_festival(d)) {
					a.push({'desc':"Corn for Ann"});
				}
			}

			if (is_festival(d)) {
				// 9 -  Veg Fest
				// 24 - Sea Fest

				// Sea Festival
				if (d == 54) { // Swim Fest
					a.push({'desc':"Go to the Beach", 'imp':true});
					a.push({'desc':"Win Swim Festival", 'iid':mayor_id, 'imp':true,
							'cid':["f_photo_swimming", jeff_id, grey_id, harris_id, kai_id, cliff_id, 'v_happiness', 'f_dontsave'],
							'val':[1, 8, 8, 8, 8, 8, 5, 1]
					});
				}
			} else {
				// ANN
				a = ranch_stuff_sum(a, dow, is_sunny);

				// Gifts for Villagers
				if (!mtn_visit) {
					a.push({'desc':"ed, flower, walnut"});
					// Cliff
					if (["FRI", "SAT"].includes(dow) && is_sunny == 1) {
						if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
							// Cliff's intro gives affection to GRAY
							a.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'iid':cliff_id, 'sel':false});
						}
						a.push({'desc':"Talk (Fish Tent) [50%]", 'cid':cliff_id, 'val':2, 'sel':false, 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)});
						a.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
						a.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
					}
				} else {
					// Library closed; Mountain Visit

					// Strength Wish Power Berry
					if (vars['chickens'] > 0 && flags['berry_strength'] == 0 && d != 31) {
						a.push({'desc':"Wish for Strength (Middle Option)", 'cid':'f_berry_strength', 'val':1, 'iid':get_npc_id('goddess'), 'sel':false});
					}
					// Blue Mist Flower
					if (flags['photo_popuri'] == 0) {
						a.push({'desc':"Blue Mist Flower Glitch", 'iid':popuri_id,
							'cid':['f_photo_popuri', 'v_openers'], 'val':[1, 1], 'imp':true
						});
					}

					// SPRITE
					a.push({'desc':"Talk", 'cid':sprite_id, 'val':1, 'sel':(aff[sprite_id] < (_SPRITE_WINE_MIN - 1)), 'red':(aff[sprite_id] >= (_SPRITE_WINE_MIN - 1))});
					a.push({'desc':"Flower", 'cid':sprite_id, 'val':2, 'sr':true, 'sel':(a[a.length - 1]['sel'])});

					// MARIA
					if (aff[maria_id] >= (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
						a.push({'desc':"NO MUSBOX FOR MARIA", 'iid':maria_id, 'red':true});
					}
					a.push({'desc':"Talk (MTN / CHUR)", 'cid':maria_id, 'val':1, 't2':"MusBox",
							'sel':(aff[maria_id] < (_DREAM_EVENT_MIN - 1)),
							'red':(aff[maria_id] >= (_DREAM_EVENT_MIN - 1))});
					if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
						a[a.length - 1]['t2'] = "MusBox";
						a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
								'sel':false, 't2':a[a.length - 1]['desc']
						});
					}
					if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - 2)) {
						a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true, 'sel':false});
					}

					// ANN
					if (dow == "SUN") {
						a.push({'desc':"Talk (MTN)", 'cid':ann_id, 'val':1, 'sel':false, 't2':" MusBox"});
						a.push({'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
						a.push({'desc':" Gift", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false, 't2':"Corn / Potato"});
						a.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':false, 't2':" Gift"});
					}
					
					// Cliff
					if (["THURS", "FRI", "SAT", "SUN"].includes(dow)) {
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
				}

				// CORN
				if (d == 31) {
					a.push({'desc':"Buy Corn", 'iid':get_npc_id('lillia'), 'imp':true});
				}

				// ELLI
				// "Gift " <- one space
				// "Talk " <- one space
				// "Musbox " <- one space
				if (dow != "MON") {
					if (is_sunny == 0 && aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
						a.push({'desc':"Sick Event (Bakery)", 'cid':[elli_id, 'f_sick_elli'], 'val':[_SICK_EVENT_AFF, 1], 'red':(aff[elli_id] >= ((route_id == 0) ? _PHOTO_MIN : 250)), 'sel':(aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250))});
					} else if (dow != "SUN") {
						a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk "), 'cid':elli_id, 'val':1, 'sel':(is_sunny == 1), 't2':"MusBox "});
						a.push({'desc':"MusBox ", 'sel':false, 't2':a[a.length - 1]['desc'],
							'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
						});
						a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true,
							't2':((vars['chickens'] > 0) ? "Egg " : "M/L Fish"),
							'sel':(is_sunny == 1 && (vars['chickens'] == 0 || flags['new_chick'] == 1))
						});
						a.push({'desc':"Egg ", 'sr':true, 't2':"Gift ", 'sel':(!(is_sunny == 1 && (vars['chickens'] == 0 || flags['new_chick'] == 1))),
							'cid':((flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
							'val':((flags['recipe_elli'] == 0) ? [1, 6] : 4)
						});
						/*
						if (flags['dream_elli'] == 0 && aff[elli_id] >= _DREAM_EVENT_MIN && is_sunny == 1) {
							a.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'],
									'val':[_DREAM_EVENT_AFF, 1], 'sel':(aff[elli_id] >= (_DREAM_EVENT_AFF - 3))});
						}
						if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
							a.push({'desc':"ANKLE (MTN)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
						}
						*/
					}
				}

				// MAYOR
				if (dow == "SUN") {
					a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':true});
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
					// Affection should keep up with Ricks.
					// If greater, gifts to the mayor arent required.
				} else if (is_sunny) {
					if (flags['cutscene_watermelon'] == 0 && aff[ann_id] >= _CUTSCENE_WATERMELON_MIN && aff[maria_id] >= _CUTSCENE_WATERMELON_MIN) {
						a.push({'desc':"WARNING: Cutscene plays at 2nd Village Screen", 'red':true});
						a.push({'desc':"Watermelon Cutscene", 'val':1, 'cid':'f_cutscene_watermelon', 'sr':true, 'sel':false});
					}
					a.push({'desc':"Talk", 'cid':mayor_id, 'val':3, 'sel':(aff[mayor_id] < _PARTY_ATTEND_MIN), 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
					if (dow == "SAT") {
						a[a.length - 1]['desc'] += " (" + ((d >= 42) ? "Lib" : "Ricks Shop") + " 50%)";
						a[a.length - 1]['sel'] = (d >= 42);
					}
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
				}

				// RICK
				// "Talk  " <- two spaces
				if (is_sunny == 1) {
					if (dow == "THURS") {
						// ANN in Ricks shop
						// " Gift" <- -1 spaces
						// "Musbox  " <- 2 spaces
						a.push({'desc':"Talk (Rick Shop)", 'cid':ann_id, 'val':1, 'sel':false, 't2':"MusBox  "});
						a.push({'desc':"MusBox  ", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':a[a.length - 1]['desc']});
						a.push({'desc':" Gift", 'cid':ann_id, 'val':1, 'sr':true, 'sel':false});
						a.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 't2':" Gift", 'sel':false});
					}
					if (!["WED", "SUN"].includes(dow)) {
						a.push({'desc':"Talk  ", 'cid':rick_id, 'val':3, 'sel':(dow != "SAT"), 't0':"Rick Fix"});
						a.push({'desc':"Rick Fix", 'sr':true, 'sel':(dow != "SAT"), 't3':"Talk  ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
						a.push({'desc':"Gift", 'sr':true, 'sel':false, 'cid':rick_id, 'val':3});
					} else if (dow == "SUN") {
						if (flags['new_mus_box'] == 1) {
							a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
						}
						a.push({'desc':"Talk (Town Square) ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':false, 't0':"Rick Fix"});
						a.push({'desc':"Rick Fix", 'sr':true, 'sel':false, 't3':"Talk (Town Square) ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
						a.push({'desc':"Gift", 'sr':true, 'sel':false, 'cid':rick_id, 'val':3});
					}
				}

				// ELLI DREAM ANKLE
				if (flags['dream_elli'] == 0 && aff[elli_id] >= _DREAM_EVENT_MIN) {
					a.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_DREAM_EVENT_AFF, 1]});
				}
				if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
					a.push({'desc':"ANKLE (Mtn)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false, 'sr':(flags['dream_elli'] == 0)});
				}

				// MARIA SICK EVENT
				if (is_sunny == 0 && dow == "MON" && aff[maria_id] >= _SICK_EVENT_MIN && flags['sick_maria'] == 0 && aff[maria_id] < (_DREAM_EVENT_MIN - _SICK_EVENT_AFF)) {
					a.push({'desc':"Sick Event", 'cid':[maria_id, 'f_sick_maria'], 'val':[_SICK_EVENT_AFF, 1]});
					a.push({'desc':"Talk", 'cid':mayor_id, 'val':3});
					a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});
					cur_maria_aff += _SICK_EVENT_AFF;
				} else if (!mtn_visit) {
					// MARIA
					if (aff[maria_id] >= (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
						a.push({'desc':"NO MUSBOX FOR MARIA", 'iid':maria_id, 'imp':true});
					}
					a.push({'desc':"Talk (Library)", 'cid':maria_id, 'val':1, 't2':"MusBox", 'sel':false, 'red':(aff[maria_id] == (_DREAM_EVENT_MIN - 1))});
					if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - _MUS_BOX_AFF)) {
						a.push({'desc':"MusBox", 'cid':[maria_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
								'sel':false, 't2':a[a.length - 1]['desc']
						});
					}
					if (aff[maria_id] < (_DREAM_EVENT_MIN - 1 - 2)) {
						a.push({'desc':"Gift", 'cid':maria_id, 'val':2, 'sr':true, 'sel':false});
					}
				}

				if (d == 60 && aff[karen_id] < 250 && is_sunny == 1) {
					a.push({'desc':"Dog Karen to 255 (Vineyard)", 'cid':karen_id, 'val':(255 - aff[karen_id]), 'imp':true});
					flags['dontsave'] = true;
					a.push({'desc':"DONT SLEEP TONIGHT! STAY UP ALL NIGHT!", 'imp':true});
					a.push({'desc':"Day Skipped", 'cid':'v_day', 'val':1, 'sr':true});
				}

				if (d == 31) { // Fireworks Festival
					// CORN
					a.push({'desc':"Gather gifts for Bar;"});
					a.push({'desc':"Equip Corn", 'sr':true});
					a.push({'desc':"Plant Corn", 'iid':get_npc_id('lillia'), 'cid':['v_gold', 'f_corn_planted'], 'val':[-300, 1], 'sr':true});
					a.push({'desc':"Equip Watering Can"});
					a.push({'desc':"Water Corn", 'cid':['v_watering_can_fill', 'v_corn_waters'], 'val':[-10, 1], 'sr':true, 'sel':false});
					a.push({'desc':"Fill Watering Can", 'cid':'v_watering_can_fill', 'val':30, 'sr':true, 'sel':false});
					a.push({'desc':"Scare birds by pond", 'cid':'v_happiness', 'val':1, 'sel':false});
					a.push({'desc':"Equip hammer, Clear rocks on farm until 5 PM"});
					a = visit_bar(a, dow, is_sunny, true);
					a.push({'desc':"Fast Text Glitch; Axe description", 'imp':true});
					a.push({'desc':"Fireworks (Ranch)", 'cid':[ann_id, 'f_dontsave'], 'val':[5, 1]});
					if (aff[ann_id] >= 55) {
						// Bonus Sparkler Scene at 55 aff or higher
						a[a.length - 1]['cid'].push('v_happiness');
						a[a.length - 1]['val'].push(5);
					}
				} else if (dow != "SUN" && !(is_sunny == 1 && aff[maria_id] >= (_PHOTO_MIN - _DREAM_EVENT_AFF) && flags['dream_maria'] == 0)){
					if (flags['wine_from_duke'] == 0) {
						a = visit_bar(a, dow, is_sunny, false);
					}
				}
			}

			// Horse Affection
			if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
				a.push({'desc':"Equip Brush", 'iid':horse_id});
			}
			a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':(flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
			a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':false});
			if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
				a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
			}

			// Feed dog
			a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});
		
			if (d == 60 && aff[karen_id] > _DREAM_EVENT_MIN) { a.push({'desc':"Harvest Corn", 'imp':true}); }
		} else {
			// Today is a Typhoon
			if (vars['chickens'] > 0) {
				a.push({'desc':"Chickens Outside?", 'val':[1, -1 * vars['chickens']], 'cid':['f_chicken_funeral', 'v_chickens'], 'sel':(flags['chicken_outside'] == 1), 'iid':chicken_id});
			}
		}
	} // End of Not Chicken Funeral
	return a;
}

function ranch_stuff_sum(tmp_act = [], dow = get_dow(vars['day']), is_sunny = 1) {
	if (dow != "THURS") {
		var ann_id = get_npc_id('ann');
		var elli_id = get_npc_id('elli');
		var cliff_id = get_npc_id('cliff');
		
		if (dow == "SUN" && is_sunny == 0 && aff[ann_id] >= _SICK_EVENT_MIN && flags['sick_ann'] == 0 && aff[ann_id] < _PHOTO_MIN) {
			// ANN SICK EVENT
			tmp_act.push({'desc':"Sick Event", 'cid':[ann_id, 'f_sick_ann'], 'val':[_SICK_EVENT_AFF, 1]});
		} else if (aff[ann_id] < _PHOTO_MIN) {
			// ANN
			// " Talk" <- -1 spaces
			// " Gift" <- -1 spaces
			// " Musbox" <- -1 spaces
			tmp_act.push({
				'desc':(" Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch)")),
				'cid':ann_id, 'val':1, 'red':(dow == "SUN"),
				'sel':(flags['new_mus_box'] == 0 && dow != "SUN"), 't2':" MusBox"
			});
			tmp_act.push({
				'desc':" MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
				'sel':(flags['new_mus_box'] == 1 && dow != "SUN"), 't2':tmp_act[tmp_act.length - 1]['desc']
			});
			tmp_act.push({
				'desc':" Gift", 'cid':ann_id, 'sr':true,
				'val':((vars['day'] == 44) ? 3 : 1), 't2':"Corn / Potato",
				'sel':(vars['potatoes'] <= 0 && vars['corn_waters'] < _CORN_GROW_DAYS && dow != "SUN")
			}); 
			tmp_act.push({
				'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'sr':true,
				'val':[((vars['day'] == 44) ? 5 : 3), -1], 't2':" Gift",
				'sel':(dow != "SUN" && (vars['potatoes'] > 0 || vars['corn_waters'] >= _CORN_GROW_DAYS))
			});
			
			// Cliff
			if (["WED", "TUES"].includes(dow) && is_sunny == 1) {
				var no_beach = false;
				if (dow == "TUES" && aff[elli_id] >= _CUTSCENE_BEACH_MIN && flags['cutscene_beach'] == 0) {
					tmp_act.push({'desc':"WARNING: Cutscene plays at Beach", 'red':true});
					tmp_act.push({'desc':"Beach Cutscene", 'sr':true, 'sel':false, 'cid':'f_cutscene_beach', 'val':1});
					no_beach = true;
				}
				if (aff[cliff_id] == 5 || aff[cliff_id] == 0) {
					// Cliff's intro gives affection to GRAY
					tmp_act.push({'desc':"Meet", 'cid':grey_id, 'val':4, 'sel':(dow == "WED"), 'iid':cliff_id, 'red':no_beach});
				}
				tmp_act.push({
					'desc':("Talk (" + ((dow == "WED") ? "Ranch" : "Beach") + ")"), 'red':no_beach,
					'cid':cliff_id, 'val':2, 'sel':(dow == "WED"), 'sr':(aff[cliff_id] == 5 || aff[cliff_id] == 0)
				});
				tmp_act.push({'desc':"   Gift   ", 'cid':cliff_id, 'val':4, 'sel':false, 't2':"   Egg   ", 'sr':true});
				tmp_act.push({'desc':"   Egg   ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"   Gift   ", 'sr':true});
			}

			if (is_sunny == 1 && dow == "MON") {
				// ELLI Beach
				// "Gift " <- 1 space
				if (aff[elli_id] >= _CUTSCENE_BEACH_MIN && flags['cutscene_beach'] == 0) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 145-ish
					tmp_act.push({'desc':"WARNING: Cutscene plays at Beach", 'red':true});
					tmp_act.push({'desc':"Beach Cutscene", 'sr':true, 'sel':false, 'cid':'f_cutscene_beach', 'val':1});
					tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox ", 'red':true, 'sel':false, 't3':"Beach Cutscene"});
					tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc'], 't3':"Beach Cutscene"});
				} else {
					tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox "});
					tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc']});
				}
				tmp_act.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true, 
					't2':((vars['chickens'] > 0) ? "Egg " : "M/L Fish"),
					'sel':((aff[elli_id] < _CUTSCENE_BEACH_MIN || flags['cutscene_beach'] == 1) && (vars['chickens'] == 0 || flags['new_chick'] < 2))
				});
				tmp_act.push({
					'desc':((vars['chickens'] > 0) ? "Egg " : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':((aff[elli_id] < _CUTSCENE_BEACH_MIN || flags['cutscene_beach'] == 1) && (vars['chickens'] > 0 && flags['new_chick'] >= 2)),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
			}
		}
		if (vars['chickens'] > 1) {
			tmp_act.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug')});
		}
	}
	return tmp_act;
}

function visit_bar(tmp_act = [], dow = get_dow(vars['day'], true), is_sunny = 1, imp_visit = true) {
	var duke_id = get_npc_id('bartender');
	var duke_exists = false;
	var karen_id = get_npc_id('karen');
	for (let key in tmp_act) {
		duke_exists = (duke_exists || tmp_act[key]['cid'] == duke_id);
	}
	if (dow != "SUN" && !duke_exists) {
		tmp_act.push({'desc':"Go to Bar" + ((imp_visit || (vars['day'] == 60 && aff[karen_id] < 250)) ? "" : " if 5PM or later, otherwise sleep")});

		tmp_act.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sel':(imp_visit && flags['wine_from_duke'] == 0), 'imp':((imp_visit || (aff[duke_id] >= (_DUKE_WINE_MIN - 6))) && flags['wine_from_duke'] == 0)});
		tmp_act.push({'desc':"Gift", 'cid':duke_id, 'val':3, 'sel':(imp_visit && flags['wine_from_duke'] == 0), 'sr':true});
		if (flags['wine_from_duke'] == 0) {
			tmp_act.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true, 'sel':false});
		}
	} else {
		tmp_act.push({'desc':"Bar is closed on Sundays", 'iid':duke_id, 'red':true});
	}
	return tmp_act;
}

