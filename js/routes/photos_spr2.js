function actions_photos_spr_y2(a = [], d = 3, g = 300, is_sunny = 1) {
	var basil_id = get_npc_id('basil');
	var cliff_id = get_npc_id('cliff');
	var rick_id = get_npc_id('rick');
	var mayor_id = get_npc_id('mayor');

	var dow = get_dow(d, true);	

	// Dog Affection
	if (flags['dog_inside'] == 1) {
		a.push({'desc':"Whistle / Pick up Dog", 'cid':get_npc_id('dog'), 'val':2});
	}

	if (is_festival(d)) {
		// 1 (121) - New Years
		// 8 (128) - Planting
		// 17 (137) - Horse
		// 23 (143) - Flower

		if (d == 128 && flags["harvest_king"] == 1) {
			// Planting Festival (Spring 8)
			a.push({'desc':"Go to Town Square"});
			a.push({'desc':"Ride with Cliff", 'val':[1, 8, -1], 'cid':['f_photo_harvest', cliff_id, 'f_harvest_king']});
		} else if (d == 137) {
			// Horse Race (Spring 17)
			a = betting_table(a);
		} else if (d == 143 && vars['gold'] >= 1000 && flags['berry_flowerfest'] == 0) {
			// Flower Festival (Spring 23)
			if (flags['photo_horserace'] == 0) {
				// Horse Affection
				var horse_id = get_npc_id('horse');
				a.push({'desc':"Whistle Horse", 'val':1, 'cid':horse_id});
				a.push({'desc':((flags['horse'] == 1) ? "Ride Horse": "Talk to Horse"), 'val':1, 'cid':horse_id, 'sr':true});
			}
			a.push({'desc':"Go to Town Square"});
			a.push({'desc':"Buy a Power Nut", 'cid':['f_berry_flowerfest','v_gold'],
					'val':[1, -1000], 'iid':get_npc_id('salesman'), 'sel':(vars['gold'] >= 1000)
			});
			if (aff[basil_id] < _BASIL_BERRY_MIN) {
				a.push({'desc':"Talk", 'cid':basil_id, 'val':2});
			}
			if (aff[rick_id] < _PARTY_ATTEND_MIN) {
				a.push({'desc':"Talk", 'cid':rick_id, 'val':2});
			}
			if (aff[cliff_id] >= 50 && aff[cliff_id] < _PARTY_ATTEND_MIN) {
				a.push({'desc':"Talk", 'cid':cliff_id, 'val':2});
			}
			if (aff[mayor_id] < _PARTY_ATTEND_MIN) {
				a.push({'desc':"Talk", 'cid':mayor_id, 'val':2});
			}
		}
	} else {
		
	}

	return a;
}
