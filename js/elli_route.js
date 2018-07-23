function get_actions_elli (d = 3, g = 300, is_sunny = 1) {
	//Elli marriage
	
	var a = [];
	var skip = false;
	var elli_id = get_npc_id("elli");
	var rick_id = get_npc_id("rick");
	
	if (d < 32) {
		// Spring 3 to Summer 1, Year 1
		
		if (d == 3) {
			// Spring 3
			a.push({'desc':"Greet the Mayor", 'cid':get_npc_id("mayor")});
		} if (d % 120 == 23) {
			// Flower Festival, Spring 23
			a.push({'desc':"Flower Festival (Town Square)"})
			if (d == 23) {
				a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		} if (d == 31) {
			// Fireworks Fest, Summer 1
			a.push({'desc':"Fishing Rod, Fish a lot", 'cid':get_npc_id("fisherman")});
			a.push({'desc':"Meet", 'cid':elli_id, 'val':4});
			a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sr':true});
			a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3});
			a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false});
			a.push({'desc':"Fireworks at 7PM (Bakery)", 'cid':elli_id, 'val':5});
		}
	}
	
	// Buy a chicken on Summer 28 (d58)
	// Summer Full Forage = 460G
	//sum 27 g >= 1500
	//sum 26 g >= 1040
	//sum 25 g >= 580
	//sum 24 g >= 120
	
	if (d >= 32 && d < 58) {
		//Summer 2 to Summer 27

		if (is_sunny && ["TUES", "THURS", "FRI"].includes(get_day_of_week(d, true)) && d != 39 && d != 54) {
			// Days where both Rick and Elli are available
			// (39 = Veggie Fest; 54 = Swim Fest)
			
			if (forage(1500) !== null) {
				// Full forage for Chicken etc.
				
				a.push(forage(1500));
				a.push({'desc':"Talk", 'cid':elli_id, 'val':1});
				a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3, 'sr':true});
				a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false});
				if (aff[get_npc_id('rick')] < 4) {
					a.push({'desc':"Meet", 'cid':rick_id, 'val':4});
				}
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sr':(aff[get_npc_id('rick')] < 4)});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true});
			}
		}
	}

	if (d >= 58 && d < 83) {
		//Summer 28 to Fall 22
		
		if (d == 72) {
			// Harvest Festival (Fall 12)

			a.push({'desc':"Harvest Festival (Town Square)"})
			if (d == 23) {
				a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});

		} else if (is_sunny && ["MON", "TUES", "THURS", "FRI"].includes(get_day_of_week(d, true)) && 
					d != 64 && d != 80 && d != 84 && d != 88) {
				// 64 = Cow Fest, 80 = Egg Fest, Bridge Sunday, Horse Race

			// A new chick hatched from an egg
			if (flags['new_chicken'] == 1) {
				a.push({'desc':"New Chk", 'cid':'f_new_chicken', 'val':-1});
			}
			
			// No old box in inventory; dig up a music box
			if (flags['old_mus_box'] == 0) {
				a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
			}

			// Don't have a chicken
			if (vars['chickens'] < 1) {
				if (forage(1500) !== null) {
					// Forage for chicken money
					a.push(forage(1500));
				} else {
					// Buy a chicken
					a.push({'desc':"Buy a Chicken", 'cid':['v_gold', 'v_chickens'], 'val':[-1500, 1]});
				}
			}
			
			// Elli
			a.push({'desc':("Talk" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")), 'cid':elli_id, 'val':1, 'sel':(!flags['new_mus_box'])});
			a.push({'desc':"MusBox", 'cid':elli_id, 'val':6, 'sel':flags['new_mus_box'], 'sr':true});
			a.push({
				'desc':("Elli-egg" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")),
				'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
				'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]), 'sr':true,
				'sel':(vars['chickens'] > 0)
			});
			a.push({
				'desc':("Elli-gift" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")),
				'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0)
			});
			if (aff[elli_id] >= 160 && !flags['elli_dream']) {
				a.push({'desc':"DREAM", 'cid':[elli_id, 'f_elli_dream'], 'val':[8, 1]});
			}
			
			// Rick
			if (aff[get_npc_id('rick')] < 4) {
				a.push({'desc':"Meet", 'cid':rick_id, 'val':4});
			}
			a.push({'desc':"Talk", 'cid':rick_id, 'val':3});
			a.push({'desc':"MusBox Fix", 'cid':'f_new_mus_box', 'val':1, 'sr':true, 'sel':(aff[rick_id] >= _RICK_MUSBOX_FIX - 3)});
			a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true,  'sel':(aff[rick_id] < _RICK_MUSBOX_FIX - 3)});
		}
	}
	
	if (d >= 83 && d < 90) {
		// Fall 23 to Fall 29
			
		// No old box in inventory; dig up a music box
		if (flags['old_mus_box'] == 0 && is_sunny) {
			a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
		}
		
		// Bridge Work
		a.push({'desc':"Bridge Work", 'cid':['v_gold', 'v_bridge_days_worked'], 'val':[1000, 1]});
		
		// Elli
		if (!is_sunny) {
			if (aff[elli_id] >= 120 && !flags['sick_elli']) {
				a.push({'desc':"Sick", 'cid':[elli_id, "f_sick_elli"], 'val':[10, 1]});
			} else if (get_day_of_week(d, true) != "MON") {
				a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sel':(!flags['new_mus_box'])});
				a.push({'desc':"MusBox", 'cid':elli_id, 'val':6, 'sel':flags['new_mus_box'], 'sr':true});
				a.push({
					'desc':"Elli-egg", 'sr':true,
					'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
					'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]),
					'sel':(vars['chickens'] > 0)
				});
				a.push({'desc':"Elli-gift", 'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0)});
				if (aff[elli_id] >= 160 && !flags['elli_dream']) {
					a.push({'desc':"DREAM", 'cid':[elli_id, 'f_elli_dream'], 'val':[8, 1]});
				}
			}
		} else {
			a.push({'desc':("Talk" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")), 'cid':elli_id, 'val':1, 'sel':(!flags['new_mus_box'])});
			a.push({'desc':"MusBox", 'cid':elli_id, 'val':6, 'sel':flags['new_mus_box'], 'sr':true});
			a.push({
				'desc':("Elli-egg" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")),
				'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
				'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]), 'sr':true,
				'sel':(vars['chickens'] > 0)
			});
			a.push({
				'desc':("Elli-gift" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")),
				'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0)
			});
		}
			
		// Rick
		if (is_sunny) {
			a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sel':true});
			a.push({'desc':"MusBox Fix", 'cid':'f_new_mus_box', 'val':1, 'sel':true, 'sr':true});
		}
	}

	if (d == 90) {
		//Fall 30 SAT

		a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1});
		
		// No old box in inventory; dig up a music box
		if (flags['old_mus_box'] == 0 && is_sunny) {
			a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
		}
		
		a.push({'desc':"Sell Chicken", 'cid':['v_gold', 'v_chickens'], 'val':[500, -1]});
		
		// Elli
		a.push({'desc':"Talk", 'cid':elli_id, 'val':1, 'sel':(!flags['new_mus_box'])});
		a.push({'desc':"MusBox", 'cid':elli_id, 'val':6, 'sel':flags['new_mus_box'], 'sr':true});
		a.push({
			'desc':"Elli-egg", 'sr':true,
			'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
			'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]),
			'sel':(vars['chickens'] > 0)
		});
		a.push({'desc':"Elli-gift", 'cid':elli_id, 'val':1, 'sr':true, 'sel':(vars['chickens'] == 0)});
		if (aff[elli_id] >= 160 && !flags['elli_dream']) {
			a.push({'desc':"DREAM", 'cid':[elli_id, 'f_elli_dream'], 'val':[8, 1]});
		}
	}
	
	//TODO
	
	if (d == 109) {
		// Dog Race
		a = betting_table(a);
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
	}
	
	return a;
}