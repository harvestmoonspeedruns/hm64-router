function get_actions_cow_photo (d = 3, g = 300, is_sunny = 1) {
	// Cow photo
	var cow_id = get_npc_id('cow');
	var doug_id = get_npc_id('doug');
	var karen_id = get_npc_id('karen');
	
	if (flags['horse'] == 0) {
		a.push({'desc':'Get Horse', 'cid':'f_horse', 'val':21, 'iid':horse_id, 'imp':true});
		a.push({'desc':"Fast Text Glitch", 'sr':true, 'hov':true});
	}

	if (d == 93) { flags['dontsave'] = true; }
	if (d == 94) {
		// Cow Stealing
		a.push({'desc':"Dog to Mtns, wait by bridge until Jack naps"});
		a.push({'desc':"Dog Karen (MTN / BEACH) 50% [10 AM]", 'cid':karen_id, 'val':200, 'sel':false});
		a.push({'desc':"Cow Stealing Glitch", 'imp':true, 'cid':cow_id, 'val':3});
	}

	if (vars['cows'] > 0) {
		// Milk cows
		// TODO
		if (vars['cows'] > 2) {
			// Sell Cow
			// TODO
		}
	}

	if (d == 115) {
		a.push({'desc':"Get Bracelet from Karen", 'iid':karen_id});
	}
	
	// TODO Spring stuff
	// till; buy grass / milker

	// Enter Cow
	if (d == 183) {
		a.push({'desc':"Enter Cow", 'cid':'f_cow_entered', 'val':1, 'iid':get_npc_id('doug'), 'imp':true});
	}
}