function get_actions_karen_photo (d = 3, g = 300, is_sunny = 1) {
	//Karen photo

	/* REQUIREMENTS:
	 * - Karen at 200+ affection
	 * - Duke at 38+ affection
	 * - Sprite 50+ affection
	 * - Egg into Goddess Pond
	 * - 6:00 PM on Fall 7
	 * 
	 * NOTES:
	 * +3/+3 ~ Duke		9, 15, 21, 27, 33, 39
	 * 					9, 15, 21, 31, 39
	 * 				in/co/g, co/g, co/g, co/grap rec, co/grap
	 * +1/+5 ~ Sprite
	 * 		right spr: 4 gifts, 4 g, 4 g, 3 g, 3 g, 3 g
	 * 
	 * 6 days total
	 * Play when Karen might be outside carp house
	 * TUES / WED / FRI / SAT
	 * 
	 * Go through as few screens as possible
	 */

	var a = [];
	var dow = get_day_of_week(d, true);
	var karen_id = get_npc_id('karen');
	var sprite_id = get_npc_id('sprite');
	var duke_id = get_npc_id('bartender');

	if (d < 30 && vars['turnip_waters'] < _TURNIP_GROW_DAYS && flags['turnips_planted'] == 1) {
		a.push({'desc':("[" + (_TURNIP_GROW_DAYS - vars['turnip_waters']) + " rainy days left]")});
	}

	if (d > 67 && flags['photo_karen'] == 0) {
		a.push({'desc':"RESET", 'red':true});
	} else if (d > 30 && vars['turnip_waters'] < _TURNIP_GROW_DAYS) {
		a.push({'desc':"RESET (Turnips not done)", 'red':true});
	} else if (d == 67) {
		if (is_sunny == 0 || flags['vineyard_restored'] == 0) {
			a.push({'desc':"RESET (Vineyard not restored)", 'red':true});
		} else {
			a.push({'desc':"Enter Wine Cellar 55 seconds after leaving house", 'imp':true});
			a.push({'desc':"DREAM", 'cid':karen_id, 'val':_DREAM_EVENT_AFF});
			a.push({'desc':"PHOTO", 'cid':karen_id, 'val':_PHOTO_EVENT_AFF});
		}
	} else if (d == 61) {
		a.push({'desc':"Enter cave 35 seconds after leaving house"});
		// SPRITE
		a.push({'desc':"Talk", 'cid':sprite_id, 'val':1});
		a.push({'desc':"Mushroom", 'cid':sprite_id, 'val':7, 'sr':true});
		
		if (aff[karen_id] < 100) {
			a.push({'desc':"Dog to MTNS"});
			a.push({'desc':"Dog Karen (Shows up at 10 AM)", 'cid':karen_id, 'val':200, 'sel':false});
		}
		
		// DUKE
		a.push({'desc':"Talk", 'cid':duke_id, 'val':3});
		a.push({'desc':"Grapes", 'cid':duke_id, 'val':7, 'sr':true});
	} else if (d == 62) {
		a.push({'desc':"Clear Mailbox", 'imp':true});

		// SPRITE
		a.push({'desc':"Enter cave 35 seconds after leaving house"});
		a.push({'desc':"Talk", 'cid':sprite_id, 'val':1});
		a.push({'desc':"Mushroom", 'cid':sprite_id, 'val':5, 'sr':true});

		if (aff[karen_id] < 100) {
			a.push({'desc':"Dog to MTNS"});
			a.push({'desc':"Dog Karen (Shows up at 10 AM)", 'cid':karen_id, 'val':200, 'sel':false});
		}

		// DUKE
		a.push({'desc':"Talk", 'cid':duke_id, 'val':3});
		a.push({'desc':"Grapes", 'cid':duke_id, 'val':5, 'sr':true});
		a.push({'desc':"Get Wine", 'cid':'f_wine_from_duke', 'val':1, 'sr':true, 'sel':(aff[duke_id] >= 35)});
	} else if (d > 62 && flags['vineyard_restored'] == 0 && d != 64) {
		// SPRITE
		a.push({'desc':"Enter cave 35 seconds after leaving house"});
		a.push({'desc':"Talk", 'cid':sprite_id, 'val':1});
		a.push({'desc':"Mushroom", 'cid':sprite_id, 'val':2, 'sr':true, 'sel':(a[a.length - 1]['sel'])});
		a.push({'desc':"Restore Vineyard with Turnip", 'cid':"f_vineyard_restored", 'val':1, 'iid':get_npc_id('goddess')});
	} else if (([3, 30].includes(d) || (d > 31 && d < 61)) && ["TUES", "WED", "FRI", "SAT"].includes(dow) && !is_festival(d) && is_sunny == 1) {
		if (d == 3) {
			a.push({'desc':"Equip axe"});
			a.push({'desc':"Greet the Mayor", 'iid':get_npc_id('mayor')});
			a.push({'desc':"Chop 2 Stumps, Collect 9 Lumber from Bin", 'iid':get_npc_id('stump')});
		}
		
		if (d == 30) {
			a.push({'desc':"Reset if Turnips are not done", 'red':true});
			a.push({'desc':"Gather Turnips", 'imp':true, 'cid':'v_turnip_waters', 'val':99});
		}

		if (d != 3 && aff[karen_id] < 100 && aff[sprite_id] < 41 && aff[duke_id] < 23 && d != 3) {
			a.push({'desc':"Dog to Mtns"});
		}

		// RIGHT SPRITE SPAM
		if (d == 3) {
			a.push({'desc':"9 Lumber to Inner Sprite", 'val':9, 'cid':sprite_id});
			a.push({'desc':"Goddess Pond all, Flow, Ber to Inner Sprite", 'val':9, 'cid':sprite_id});
			a.push({'desc':"2 Cave Clover, Edible to Inner Sprite", 'val':3, 'cid':sprite_id});
		}

		// SPRITE
		if (aff[sprite_id] < 41 && (d > 60 || aff[duke_id] < 23)) {
			if (d != 3) { a.push({'desc':"Enter cave 35 seconds after leaving house"}); }
			if (aff[sprite_id] == 0) { a.push({'desc':"Meet", 'cid':sprite_id, 'val':5}); }
			a.push({'desc':"Talk", 'cid':sprite_id, 'val':1, 'sr':(aff[sprite_id] == 0), 'sel':(aff[sprite_id] < _SPRITE_WINE_MIN), 'red':(aff[sprite_id] >= _SPRITE_WINE_MIN)});
			if (d > 3) { a.push({'desc':"Edible", 'cid':sprite_id, 'val':2, 'sr':true, 'sel':(a[a.length - 1]['sel'])}); }
		}

		if (aff[duke_id] < 23) {
			a.push({'desc':"Gift for Duke", 'imp':true});
			if (aff[karen_id] < 100 && d > 3) {
				a.push({'desc':"Dog Karen (Shows up at 10 AM)", 'cid':karen_id, 'val':200, 'sel':false});
			}
		}

		if (d == 3) {
			a.push({'desc':"Equip hoe, till 9 x 9 spot"});
		}

		if (flags['turnips_planted'] == 0) {
			a.push({'desc':"Buy Turnip Seeds", 'iid':get_npc_id('lillia')});
		}

		// DUKE
		if (aff[duke_id] < 23) {
			if (aff[duke_id] == 0) { a.push({'desc':"Meet", 'cid':duke_id, 'val':4}); }
			a.push({'desc':"Talk", 'cid':duke_id, 'val':3, 'sr':(aff[duke_id] == 0)});
			a.push({'desc':"Gift", 'cid':duke_id, 'val':3, 'sr':true});
		}

		if (flags['turnips_planted'] == 0) {
			a.push({'desc':"Equip Turnip Seeds"});
			a.push({'desc':"Plant Turnip Seeds", 'cid':'f_turnips_planted', 'val':1, 'sr':true});
		}
	}
	return a;
}