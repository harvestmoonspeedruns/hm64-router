function actions_photos_fall_y1(a = [], d = 3, g = 300, is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var basil_id = get_npc_id('basil');
	var chicken_id = get_npc_id('chicken');
	var cliff_id = get_npc_id('cliff');
	var dog_id = get_npc_id('dog');
	var duke_id = get_npc_id('bartender');
	var elli_id = get_npc_id('elli');
	var horse_id = get_npc_id('horse');
	var kent_id = get_npc_id('kent');
	var mas_carp_id = get_npc_id('mas_carpenter');
	var mayor_id = get_npc_id('mayor');
	var rick_id = get_npc_id('rick');
	var sprite_id = get_npc_id('sprite');

	var sprite_recipe_aff = 5;

	var dow = get_dow(d, true);
	var restore_vineyard_id = -1;

	if (d == 61) {
		a.push({'desc':"Equip Scythe, Chop Old Corn"});
	} else if (d == 65 || d == 71) { // Fall 5 & 11
		flags['dontsave'] = true;
	} else if (d == 66 || d == 68) { // Fall 6 & 8
		a.push({'desc':"Check Weather, RESET IF RAINY TOMORROW", 'imp':true});
	} else if (d == 87) {
		// Horse Race Entry
		if (flags['photo_horserace'] == 0) {
			a.push({'desc':"Enter Horse", 'cid':['f_horse_entered', get_npc_id('doug')], 'val':[1, 3], 'sel':(aff[horse_id] >= 200), 'red':(vars['medals'] < 500)});
		} else {
			a.push({'desc':"Ignore Doug on Farm", 'imp':true, 'iid':get_npc_id('doug')});
		}
	} else if (d == 90) {
		// Winter Cows
		a.push({'desc':"Accept Cows", 'cid':'f_borrow_cows', 'val':1, 'iid':get_npc_id('doug'), 'sel':false, 'red':true});
	}

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':dog_id, 'val':2});
	}
	if (is_sunny == 1) {
		//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':(flags['dog_inside'] == 1), 'sel':false});
	}

	if (d != 71 && d != 72) {
		// Music Box Dig
		if (flags['old_mus_box'] == 0 && is_sunny == 1 && (aff[ann_id] < (_PHOTO_MIN - ((flags['new_mus_box'] == 1) ? _MUS_BOX_AFF : 0)))) {
			// dig music box
			a.push({'desc':"Equip hoe", 'iid':get_npc_id("musbox")});
			a.push({'desc':"Dig Music Box", 'cid':'f_old_mus_box', 'val':1, 'sr':true});
			if (flags['berry_farm'] == 0) {
				a.push({'desc':"Dig a Berry", 'val':1, 'cid':'f_berry_farm', 'sr':true, 'sel':false});
			}
			//a.push({'desc':"Scare Birds", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
		}

		// No More Chicks - Incubate chicken for evaluation
		if (vars['new_chicken_days'].length > 0 && parseInt(vars['new_chicken_days'].substr(0,3)) == d) {
			// New Chicken
			a.push({'desc':"New Chicken", 'iid':chicken_id});
			if (vars['new_chicken_days'].length == 3 && flags['new_chick'] == 0) {
				a.push({'desc':"Incubate Last Egg", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'sel':false, 'imp':true, 'iid':chicken_id});
			}
		}
		if (vars['new_chicken_days'].length == 0 && flags['new_chick'] == 0) {
			a.push({'desc':"Incubate Last Egg", 'cid':"f_new_chick", 'val':(_CHICK_BORN_SLEEPS + 1), 'sel':false, 'imp':true, 'iid':chicken_id});
		}
	}

	if (is_festival(d) || d == 71) {
		// 4, 12, 20, 28
		// Cow Fest, Harvest Fest, Egg Fest, Horse Fest
		// 71 is day before Harvest Festival

		if (d == 72) { // Fall 12
			// Harvest Festival
			a.push({'desc':'Win Harvest King', 'iid':mayor_id, 'imp':true, 'val':[1, 5], 'cid':['f_harvest_king', 'v_happiness']});
			if (aff[mayor_id] < _PARTY_ATTEND_MIN) { a.push({'desc':"Talk", 'cid':mayor_id, 'val':2}); }
			if (aff[cliff_id] >= 100 && !cliff_maxed(aff[cliff_id]) && route_id == 0) { a.push({'desc':"Talk", 'cid':cliff_id, 'val':2}); }
			a.push({'desc':"Dance with Ann", 'val':12, 'cid':ann_id, 't2':"Dance with Elli", 'sel':(route_id == 0 || aff[ann_id] < _PHOTO_MIN)});
			a.push({'desc':"Dance with Elli", 'val':12, 'cid':elli_id, 'sel':(route_id == 5 && aff[ann_id] >= _PHOTO_MIN), 't2':"Dance with Ann", 'red':(route_id == 0)});
			a.push({'desc':"RESET IF NOT KING", 'imp':true});
		} else if (d == 88 && (flags['horse_entered'] == 1 || vars['medals'] < 600)) { // Fall 28
			// Horse Race
			a = betting_table(a);
			if (flags['horse_entered'] == 1) {
				a.push({'desc':"Win Horse Race", 'cid':'f_photo_horserace','val':1, 'iid':get_npc_id('doug'), 'imp':true, 'sel':false});
			}
		}
	} else {
		// Spam Kent with Chicken
		if (vars['chickens'] > 0 && aff[kent_id] < 100 && is_sunny == 1 && dow == "SAT" && d >= 69) {
			a.push({'desc':"Chicken to the Mtns"});
		}

		// ANN ANKLE
		if (flags['ankle_ann'] == 0 && aff[ann_id] >= _ANKLE_EVENT_MIN && is_sunny == 1) {
			// ANKLE EVENT
			a.push({'desc':"ANKLE (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false});
		}

		if (d >= 83 && d <= 87) {
			// Bridge Work
			// Fall 83, 84, 85, 86, 87
			//	    Sat Sun Mon Tue Wed
			a.push({'desc':"Bridge Work", 'val':[5, 5, 5, 1, 1000], 'iid':mas_carp_id, 'imp':true,
					'cid':[mas_carp_id, get_npc_id('carpenter_top'), get_npc_id('carpenter_bot'), 'v_bridge_days_worked', 'v_gold'],
			});
		}

		if (d < 63 && is_sunny == 1) {
			// BASIL
			// "Talk   " <- 3 spaces
			// "Gift   " <- 3 spaces
			a.push({'desc':"Talk (MTN) ", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN), 'red':(aff[basil_id] >= _BASIL_BERRY_MIN)});
			a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':true, 't2':"Corn", 'sel':(aff[basil_id] < _BASIL_BERRY_MIN)});
			a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':false,
					'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
					'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
			});
		}

		// CLIFF
		// " Gift" <- -1 spaces
		// " Egg" <- -1 spaces
		if (["FRI", "SAT"].includes(dow) && is_sunny == 1 && route_id == 0) {
			a.push({'desc':"Talk (Fish Tent 50%)", 'cid':cliff_id, 'val':2, 'sel':false, 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
			a.push({'desc':" Gift", 't2':" Egg ", 'cid':cliff_id, 'val':4, 'sel':false, 'sr':true});
			a.push({'desc':" Egg ", 't2':" Gift", 'cid':cliff_id, 'val':8, 'sel':false, 'sr':true});
		}

		if ((d < 67 && flags['vineyard_restored'] == 0 && is_sunny == 1) || [61, 65, 67, 69].includes(d) ||
			(flags['dream_ann'] == 0 && aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1) ||
			((aff[cliff_id] < 100 && route_id == 0) && (dow == "THURS" || (is_sunny == 0 && dow != "TUES")))) {
			// Mountain Visit

			a.push({'desc':"Mountain forage"});

			// ANN DREAM
			if (flags['dream_ann'] == 0 && aff[ann_id] >= _DREAM_EVENT_MIN && is_sunny == 1) {
				a.push({'desc':"DREAM (Cave)", 'cid':[ann_id, 'f_dream_ann'], 'val':[_DREAM_EVENT_AFF, 1]});
			}

			// SPRITE
			// "  Talk" <- -3 spaces
			// "  Gift" <- -3 spaces
			if (flags['vineyard_restored'] == 0 && d < 67) {
				a.push({'desc':"   Talk", 'cid':sprite_id, 'val':1, 'imp':(aff[sprite_id] >= (_SPRITE_WINE_MIN - 1 - 5))});
				a.push({'desc':"   Gift", 'cid':sprite_id, 'val':1, 'sr':true, 't2':"Mushroom", 'sel':false});
				a.push({'desc':"Mushroom", 't2':"   Gift", 'sr':true, 'sel':(aff[sprite_id] < (_SPRITE_WINE_MIN - 1)),
						'cid':((flags['recipe_sprite'] == 0 && aff[sprite_id] >= 30) ? ['f_recipe_sprite', sprite_id] : sprite_id),
						'val':((flags['recipe_sprite'] == 0 && aff[sprite_id] >= 30) ? [1, sprite_recipe_aff] : 2)
				});
			}

			// CLIFF
			// " Gift" <- -1 spaces
			// " Egg " <- -1 spaces
			if (route_id == 0 && (["SUN", "THURS"].includes(dow) || (is_sunny == 0 && dow != "TUES"))) {
				a.push({'desc':("Talk (" + ((dow == "THURS") ? "Cave)" : "In Carp House)")), 'cid':cliff_id, 'val':2, 'sel':(dow != "SUN" && aff[cliff_id] < _PARTY_ATTEND_MIN), 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				a.push({'desc':" Gift", 'cid':cliff_id, 'val':4, 't2':" Egg", 'sr':true, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN && dow != "SUN" && (vars['chickens'] == 0 || (!(aff[elli_id] >= _PHOTO_MIN || (dow == "MON" && aff[elli_id] >= 170)))))});
				a.push({'desc':" Egg", 'cid':cliff_id, 'val':8, 't2':" Gift", 'sr':true, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN && dow != "SUN" && (vars['chickens'] > 0 && (aff[elli_id] >= _PHOTO_MIN || (dow == "MON" && aff[elli_id] >= 170))))});
			}

			// Grapes for Bartender on Fall 1
			if (d == 61 && flags['wine_from_duke'] == 0) {
				a.push({'desc':"Get Grapes for bartender", 'imp':true, 'iid':get_npc_id('bartender')});
			}

			// Goddess
			if (flags['vineyard_restored'] == 0 && aff[sprite_id] >= (_SPRITE_WINE_MIN - ((flags['recipe_sprite'] == 1 || aff[sprite_id] < 31) ? 2 : sprite_recipe_aff)) && aff[get_npc_id('bartender')] >= _DUKE_WINE_MIN && is_sunny == 1) {
				// Restore the Vineyard
				a.push({'desc':"Restore the Vineyard", 'cid':['f_vineyard_restored', 'f_dontsave'], 'val':[1, 1], 'iid':get_npc_id('goddess'), 'sel':false, 'imp':true});
				restore_vineyard_id = a.length - 1;
			} else if ([65, 67].includes(d) && is_sunny == 1) {
				// Wish for Weather
				a.push({'desc':"Wish for Weather (Top)", 'iid':get_npc_id('goddess'), 'imp':true});
			} else if (vars['chickens'] > 0 && flags['berry_strength'] == 0) {
				// Strength Wish Power Berry
				a.push({'desc':"Wish for Strength (Middle)", 'cid':'f_berry_strength', 'val':1, 'iid':'goddess', 'sel':false});
			}
			
			// ANN in Ricks Shop
			// "Gift  " <- 2 spaces
			if (dow == "SUN") {
				a.push({'desc':"Talk (Cave / Pond)", 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':false, 'red':(aff[ann_id] >= _PHOTO_MIN)});
				a.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':a[a.length - 1]['desc'], 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato", 'sel':false});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 't2':"Gift  ", 'sel':false});
				if (flags['ankle_ann'] == 0 && aff[ann_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 2) && aff[ann_id] < _ANKLE_EVENT_MIN && is_sunny == 1) {
					// ANKLE EVENT
					a.push({'desc':"ANKLE (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false, 'sr':(dow != "SAT" || aff[ann_id] < 150)});
				}
			}
		} else if (aff[ann_id] < _PHOTO_MIN || (!cliff_maxed(aff[cliff_id]) && route_id == 0) || (d >= 83 && d <= 87)) {
			a.push({'desc':"edible, mushroom"});
		}

		// Spam Kent with Chicken
		if (aff[kent_id] < 100 && dow == "SAT" && is_sunny == 1 && vars['chickens'] > 0 && d >= 69) {
			a.push({'desc':"Chicken Spam (MTN / Town Square) [85 Talks]", 'val':255, 'cid':kent_id, 'imp':true});
		}

		// ANN
		if (flags['new_mus_box'] == 1) {
			a = ranch_stuff_fall(a, dow, is_sunny);
		}
		
		// RICK
		// "Gift    " <- 4 spaces
		// "Talk    " <- 4 spaces
		if (is_sunny == 1 && !["WED", "SUN"].includes(dow)) {
			if (flags['new_mus_box'] == 1) {
				a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
			}
			a.push({'desc':"Talk    ", 'cid':rick_id, 'val':3,
					'sel':(dow != "SAT" && flags['new_mus_box'] == 0 && (aff[ann_id] < _PHOTO_MIN || aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250)))
			});
			a.push({'desc':"Gift    ", 'cid':rick_id, 'val':3, 'sr':true, 'sel':false});
			a.push({'desc':"Rick Fix", 'sr':true, 't3':"Talk    ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1],
					'sel':(dow != "SAT" && flags['new_mus_box'] == 0 && (aff[ann_id] < _PHOTO_MIN || aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250)))
			});
			if (vars['gold'] >= 600 && flags['horse_brush'] == 0) {
				a.push({'desc':"Buy Brush", 'cid':['v_gold', 'f_horse_brush'], 'val':[-600, 1], 'sr':true});
			}

			// ANN in Ricks Shop
			// "Gift  " <- 2 spaces
			if (dow == "THURS") {
				a.push({'desc':"Talk (Ricks Shop)", 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':false, 'red':(aff[ann_id] >= _PHOTO_MIN)});
				a.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':"Talk (Ricks Shop)", 'sel':false});
				a.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato", 'sel':false});
				a.push({'desc':"Corn / Potato", 'cid':ann_id, 'val':3, 'sr':true, 't2':"Gift  ", 'sel':false});
				if (flags['ankle_ann'] == 0 && aff[ann_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 2) && aff[ann_id] < _ANKLE_EVENT_MIN && is_sunny == 1) {
					// ANKLE EVENT
					a.push({'desc':"ANKLE (Crossroads)", 'cid':[ann_id, 'f_ankle_ann'], 'val':[_ANKLE_EVENT_AFF, 1], 'sel':false, 'sr':(dow != "SAT" || aff[ann_id] < 150)});
				}
			}
		}

		// ELLI
		// "Gift " <- one space
		// "Talk " <- one space
		if (dow != "MON") {
			if (is_sunny == 0 && aff[elli_id] >= _SICK_EVENT_MIN && flags['sick_elli'] == 0) {
				a.push({'desc':"Sick Event (Bakery)", 'cid':[elli_id, 'f_sick_elli'], 'val':[_SICK_EVENT_AFF, 1], 'red':(aff[elli_id] >= ((route_id == 0) ? _PHOTO_MIN : 250)), 'sel':(aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250))});
			} else if (dow != "SUN") {
				if (route_id == 0 && flags['dream_elli'] == 0 && aff[elli_id] >= (_PHOTO_MIN - _DREAM_EVENT_AFF)) {
					// RID == 0: Only Dream Event aff needed to hit Photo minimum
					a.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_DREAM_EVENT_AFF, 1]});
					a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk "), 'cid':elli_id, 'val':1, 'sel':false});
					a.push({'desc':"Gift ", 'cid':elli_id, 'val':((d == 61) ? 4 : 1), 'sr':true, 't2':"Egg ", 'sel':false});
					a.push({'desc':"Egg ", 'sr':true, 't2':"Gift ", 'sel':false,
						'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
						'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? ((d == 61) ? 7 : 4) : [1, ((d == 61) ? 9 : 6)]) : ((d == 61) ? 6 : 3))
					});
				} else {
					a.push({'desc':((dow == "WED") ? "Talk (Flower Shop)" : "Talk "), 'cid':elli_id, 'val':1,
							'sel':(flags['new_mus_box'] == 0 && aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250)),
							'red':(aff[elli_id] >= ((route_id == 0) ? _PHOTO_MIN : 250)) 
					});
					a[a.length - 1]['t2'] = "MusBox ";
					a.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true,
							'sel':(flags['new_mus_box'] == 1 && aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250)),
							't2':a[a.length - 1]['desc']
					});
					a.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true, 't2':"Egg ",
						'sel':(aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250) && vars['chickens'] == 0)
					});
					a.push({
						'desc':"Egg ", 'sr':true, 't2':"Gift ",
						'sel':(vars['chickens'] > 0 && aff[elli_id] < ((route_id == 0) ? _PHOTO_MIN : 250)),
						'cid':((flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
						'val':((flags['recipe_elli'] == 0) ? [1, 6] : 4)
					});
					if (flags['dream_elli'] == 0 && aff[elli_id] >= (_DREAM_EVENT_MIN - _MUS_BOX_AFF - 4) && aff[elli_id] < (_PHOTO_MIN - _DREAM_EVENT_MIN)) {
						a.push({'desc':"DREAM (Village)", 'cid':[elli_id, 'f_dream_elli'], 'val':[_DREAM_EVENT_AFF, 1], 'sr':true, 'sel':false});
					}
					if (flags['ankle_elli'] == 0 && aff[elli_id] >= (_ANKLE_EVENT_MIN - _MUS_BOX_AFF - 4)) {
						a.push({'desc':"ANKLE (MTN)", 'cid':[elli_id, 'f_ankle_elli'], 'val':[_ANKLE_EVENT_AFF, 1], 'sr':true, 'sel':false});
					}
				}
			}
		}

		// MAYOR
		// "  Talk" <- -2 spaces
		// "  Gift" <- -2 spaces
		if (is_sunny == 1 && dow != "SUN") {
			if (flags['cutscene_watermelon'] == 0 && aff[ann_id] >= 153) {
				// When Ann aff >= 153, Watermelon cutscene occurs with Maria on second village screen
				// 118 < trigger < 154
				a.push({'desc':"WARNING: Cutscene plays at 2nd Village Screen", 'imp':true});
				a.push({'desc':"Watermelon Cutscene", 'val':1, 'cid':'f_cutscene_watermelon', 'sr':true, 'sel':false});
			}
			a.push({'desc':"Talk (Rick Shop 50%)", 'cid':mayor_id, 'val':3, 'sel':false, 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
			a.push({'desc':"  Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':false});
		}

		if (is_sunny == 1 && dow == "SUN") {
			// MAYOR
			a.push({'desc':"Talk (Church)", 'cid':mayor_id, 'val':3, 'sel':(aff[mayor_id] < _PARTY_ATTEND_MIN), 'red':(aff[mayor_id] >= _PARTY_ATTEND_MIN)});
			a.push({'desc':"Gift", 'cid':mayor_id, 'val':3, 'sr':true, 'sel':(aff[mayor_id] < aff[rick_id])});

			// RICK
			if (flags['new_mus_box'] == 1) {
				a.push({'desc':"DONT TALK TO RICK WITH A FIXED MUSIC BOX!", 'imp':true, 'iid':rick_id});
			}
			a.push({'desc':"Talk (Town Square) ", 'cid':rick_id, 'val':3, 'sr':(aff[rick_id] == 0), 'sel':false, 't0':"Rick Fix"});
			a.push({'desc':"Rick Fix", 'sr':true, 'sel':false, 't3':"Talk (Town Square) ", 'cid':['f_old_mus_box', 'f_new_mus_box'], 'val':[-1, 1]});
			a.push({'desc':"Gift", 'sr':true, 'sel':false, 'cid':rick_id, 'val':3});

			if (d == 63) {
				// BASIL
				a.push({'desc':"Talk (Town Square)", 'cid':basil_id, 'val':3, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN), 'red':(aff[basil_id] >= _BASIL_BERRY_MIN)});
				a.push({'desc':"Gift   ", 'cid':basil_id, 'val':3, 'sr':true, 'sel':(aff[basil_id] < _BASIL_BERRY_MIN), 't2':"Corn"});
				a.push({'desc':"Corn", 'cid':basil_id, 'sr':true, 'sel':false,
						'cid':((flags['recipe_basil'] == 0) ? [basil_id, 'f_recipe_basil'] : basil_id),
						'val':((flags['recipe_basil'] == 0) ? [7, 1] : 5), 't2':"Gift   "
				});
			}

			// MAY
			if (aff[get_npc_id('may')] == 0) {
				a.push({'desc':"Spam May (Town Square) [83 Talks]", 'cid':get_npc_id('may'), 'val':255, 'sel':false});
			}
		}

		// ANN
		if (flags['new_mus_box'] == 0) {
			a = ranch_stuff_fall(a, dow, is_sunny);
		}

		if ([67, 69].includes(d) || (d < 63 && flags['wine_from_duke'] == 0)) {
			a.push({'desc':"Equip hammer, clear farm"});
			a.push({'desc':"Golden Hammer", 'cid':'f_golden_hammer', 'val':1, 'sel':false, 'sr':true});
			if (d < 63) {
				// BAR
				a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0), 'imp':true});
				a.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
				a.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true});
			} else {
				a.push({'desc':(((d == 67) ? "Karen" : "Elli") + " Photo at 6 PM"), 'imp':true, 'val':[_PHOTO_EVENT_AFF, 1, 1] });
				a[a.length - 1]['cid'] = ((d == 67) ? [get_npc_id('karen'), 'f_photo_karen', 'f_dontsave'] : [elli_id, 'f_photo_elli', 'f_dontsave']);
			}
		}

		if (d == 87) { a.push({'desc':"Sell Everything; Horse Race is Tomorrow!", 'imp':true}); }
	}

	// Horse Affection
	if (flags['photo_horserace'] == 0) {
		if ((d != 88 || flags['horse_entered'] == 0) && flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			a.push({'desc':"Equip Brush", 'iid':horse_id, 'sel':false});
		}
		if (flags['horse'] != 0) {
			a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id, 'sr':((d != 88 || flags['horse_entered'] == 0) && flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"]))});
			if (d != 88 || flags['horse_entered'] == 0) {
				a.push({'desc':((flags['horse'] == 1) ? "Ride": "Talk"), 'val':1, 'cid':a[a.length - 1]['cid'], 'sr':true, 'sel':false});
			}
		}
		if (flags['horse_brush'] == 1 && aff[horse_id] < (255 - 4 - flags["sustaining_carrot"])) {
			if (d != 88 || flags['horse_entered'] == 0) {
				a.push({'desc':"Brush", 'val':2, 'cid':horse_id, 'sr':true, 'sel':false});
			}
		}
	}

	// Feed dog
	a.push({'desc':"Feed Dog", 'cid':dog_id, 'val':2, 'sel':false});

	// If restoring the vineyard, turn off everything below it
	/*
	if (restore_vineyard_id != -1) {
		var tmp_t2 = [];
		var tmp_t1 = [];
		for (var i = restore_vineyard_id + 1; i < a.length; i++) {
			tmp_t2.push(a[i]['desc']);
			if (a[i]['sel'] !== false && a[i]['desc'].localeCompare("Feed Dog") != 0) {
				tmp_t1.push(a[i]['desc']);
			}
		}
		if (tmp_t1.length > 0) {
			a[restore_vineyard_id]['t1'] = tmp_t1;
		}
		if (tmp_t2.length > 0) {
			a[restore_vineyard_id]['t2'] = tmp_t2;
		}
	}
	*/
	return a;
}

function ranch_stuff_fall(tmp_act = [], dow = get_dow(vars['day']), is_sunny = 1) {
	var ann_id = get_npc_id('ann');
	var cliff_id = get_npc_id('cliff');
	var elli_id = get_npc_id('elli');
	var kent_id = get_npc_id('kent');
	var mus_box_give = ((flags['new_mus_box'] == 1) || (is_sunny == 1 && !["WED", "SAT", "SUN"].includes(dow)));

	if (dow != "THURS" && !is_festival(vars['day']) && vars['day'] != 63) {
		if (vars['chickens'] > 1 || (vars['chickens'] > 0 && aff[kent_id] > 100)) {
			tmp_act.push({'desc':"Sell Chicken", 'cid':['v_chickens', 'v_gold'], 'val':[-1, 500], 'iid':get_npc_id('doug'), 'sel':false});
		}

		// ANN
		// "Gift  " <- 2 spaces
		tmp_act.push({'desc':("Talk (" + ((is_sunny == 0) ? "Barn)" : "Ranch)")), 'cid':ann_id, 'val':1, 't2':"MusBox", 'sel':(!mus_box_give && aff[ann_id] < _PHOTO_MIN), 'red':(aff[ann_id] >= _PHOTO_MIN)});
		tmp_act.push({'desc':"MusBox", 'cid':[ann_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 't2':tmp_act[tmp_act.length - 1]['desc'], 'sel':(mus_box_give && aff[ann_id] < _PHOTO_MIN)});
		tmp_act.push({'desc':"Gift  ", 'cid':ann_id, 'val':1, 'sr':true, 't2':"Corn / Potato", 'sel':(aff[ann_id] < _PHOTO_MIN && vars['potatoes'] == 0 && vars['corn_waters'] <= _CORN_GROW_DAYS)});
		tmp_act.push({'desc':"Corn / Potato", 'cid':[ann_id, 'v_potatoes'], 'val':[3, -1], 'sr':true, 'sel':(aff[ann_id] < _PHOTO_MIN && !tmp_act[tmp_act.length - 1]['sel']), 't2':tmp_act[tmp_act.length - 1]['desc']});

		if (is_sunny == 1) {
			// CLIFF
			// "Gift    " <- 4 spaces
			// "Egg " <- 1 space
			if (route_id == 0 && ["TUES", "WED"].includes(dow)) {
				if (dow == "TUES" && aff[elli_id] >= 160 && flags['cutscene_beach'] == 0) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 160-ish
					tmp_act.push({'desc':"WARNING: Cutscene plays at Beach", 'imp':true});
					tmp_act.push({'desc':"Beach Cutscene", 'val':1, 'cid':'f_cutscene_beach', 'sr':true, 'sel':false});
					tmp_act.push({'desc':get_cliff_loc(dow), 'cid':cliff_id, 'val':2, 'sel':false, 'red':true, 't3':"Beach Cutscene"});
				} else {
					tmp_act.push({'desc':get_cliff_loc(dow), 'cid':cliff_id, 'val':2, 'sel':(aff[cliff_id] < _PARTY_ATTEND_MIN), 'red':(aff[cliff_id] >= _PARTY_ATTEND_MIN)});
				}
				tmp_act.push({'desc':"Gift    ", 'cid':cliff_id, 'val':4, 't2':"Egg ", 'sr':true, 'sel':tmp_act[tmp_act.length - 1]['sel']});
				tmp_act.push({'desc':"Egg ", 'cid':cliff_id, 'val':8, 'sel':false, 't2':"Gift    ", 'sr':true, 'sel':tmp_act[tmp_act.length - 1]['sel']});
				if (dow == "TUES") {
					//tmp_act.push({'desc':"Scare crab", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
				}
			}

			// ELLI Beach
			// "Gift " <- 1 space
			if (dow == "MON") {
				if (aff[elli_id] >= 160 && flags['cutscene_beach'] == 0) {
					// Beach cutscene between Karen and Elli occurs when Elli is >= 160-ish
					tmp_act.push({'desc':"WARNING: Cutscene plays at Beach", 'imp':true});
					tmp_act.push({'desc':"Beach Cutscene", 'sr':true, 'sel':false, 'cid':'f_cutscene_beach', 'val':1});
					tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox ", 'red':true, 'sel':false, 't3':"Beach Cutscene"});
					tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc'], 't3':"Beach Cutscene"});
				} else {
					tmp_act.push({'desc':"Talk (Beach)", 'cid':elli_id, 'val':1, 't2':"MusBox ", 'sel':(aff[elli_id] < _PHOTO_MIN), 'red':(aff[elli_id] >= _PHOTO_MIN)});
					tmp_act.push({'desc':"MusBox ", 'cid':[elli_id, 'f_new_mus_box'], 'val':[_MUS_BOX_AFF, -1], 'sr':true, 'sel':false, 't2':tmp_act[tmp_act.length - 1]['desc'], 't3':"Beach Cutscene"});
				}
				tmp_act.push({'desc':"Gift ", 'cid':elli_id, 'val':1, 'sr':true, 
					't2':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"),
					'sel':((aff[elli_id] < _PHOTO_MIN) && (aff[elli_id] < 160 || flags['cutscene_beach'] == 1) && (vars['chickens'] == 0 || flags['new_chick'] < 2))
				});
				tmp_act.push({
					'desc':((vars['chickens'] > 0) ? "Egg" : "M/L Fish"), 'sr':true, 't2':"Gift ",
					'sel':((aff[elli_id] < _PHOTO_MIN) && (aff[elli_id] < 160 || flags['cutscene_beach'] == 1) && (vars['chickens'] > 0 && flags['new_chick'] >= 2)),
					'cid':((vars['chickens'] > 0 && flags['recipe_elli'] == 0) ? ['f_recipe_elli', elli_id] : elli_id),
					'val':((vars['chickens'] > 0) ? (flags['recipe_elli'] ? 4 : [1, 6]) : 3)
				});
				//tmp_act.push({'desc':"Scare crab", 'cid':'v_happiness', 'val':1, 'sr':true, 'sel':false});
			}
		}
	}
	return tmp_act;
}