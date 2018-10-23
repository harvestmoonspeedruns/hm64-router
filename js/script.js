$(document).ready(function() {
	new_game(2);
});

function load_game (slot = 0) {
	
}

function get_actions(rid = null, d = vars['day'], g = vars['gold'], is_sunny = 1) {
	if (reset == true) {
		return [{'desc':"RESET"}];
	} else {
		if (rid == 0) { return get_actions_photos(d, g, is_sunny); }
		if (rid == 1) { return get_actions_elli(d, g, is_sunny); }
		if (rid == 2) { return get_actions_karen(d, g, is_sunny); }
		if (rid == 3) { return get_actions_popuri(d, g, is_sunny); }
		if (rid == 4) { return get_actions_elli_photo(d, g, is_sunny); }
	}
	return [];
}

function next_day(jump = false) {
	if (!jump) {

		// Update variables
		var tmp_actions = [];
		for (var i = 0; i < actions.length; i++) {
			if ($("#ab_" + i).length != 0) {
				//element exists
				if ($("#ab_" + i).hasClass("btn-success")) {
					//element green
					if (!Array.isArray(actions[i]['cid'])) {
						tmp_actions = tmp_actions.concat(calc_actions(actions[i]));
					} else {
						for (var j = 0; j < actions[i]['cid'].length; j++) {
							var new_row = {};
							for (key in actions[i]) {
								new_row[key] = (Array.isArray(actions[i][key])) ? actions[i][key][j] : actions[i][key];
							}
							tmp_actions = tmp_actions.concat(calc_actions(new_row));
						}
					}
				}
			}
		}
		if (tmp_actions.length) {
			actions_all[vars['day']] = [tmp_actions, flags];
		}

		// Calculate G from sold items
		var sell_amt = 0;
		$("input[id^='for']").each(function(index) {
			sell_amt += (this.value * crop_prices[this.id.split("_")[1]]);
		});

		vars['gold'] += parseInt(sell_amt);
		sell_stuff = (sell_amt > 0);

		// Affection from 4 days bridge work
		if (vars['day'] == 87 && flags['bridge_days_worked'] == 4) {
			for (var i = 0; i < npcs.length; i++) {
				if (aff[i] !== undefined && !not_villagers.includes(i)) {
					aff[i] += 3;
				}
			}
		}
		
		// Affection from 4 days hot springs work
		if (vars['day'] == 106 && flags['springs_days_worked'] == 4) {
			for (var i = 0; i < npcs.length; i++) {
				if (aff[i] !== undefined && !not_villagers.includes(i)) {
					aff[i] += 3;
				}
			}
		}

		// Chicken Funeral
		if (flags['chicken_funeral'] > 1) {
			var farm_npcs = [get_npc_id('grey'), get_npc_id('doug'), get_npc_id('ann')];
			if (vars['chickens'] > 0) {
				vars['chickens'] = 0;
				for (var tmp_v in aff) {
					aff[tmp_v] -= (farm_npcs.includes(tmp_v) ? (_FUNERAL_AFF_LOSS * 30) : _FUNERAL_AFF_LOSS);
					aff[tmp_v] = (aff[tmp_v] < 0) ? 0 : aff[tmp_v];
				}
			}
		}
		if (flags['chicken_funeral'] <= 1) { flags['chicken_funeral'] = 0; }

		// decrement flag counters
		for (var key in flags) {
			if (flags['cow1'] == 1) {
				vars['cows']++;
				flags['cow1'] = 0;
			}
			if (flags['cow2'] == 1) {
				vars['cows']++;
				flags['cow2'] = 0;
			}
			if (flags['cow3'] == 1) {
				vars['cows']++;
				flags['cow3'] = 0;
			}
			if (flags[key] > 1) { flags[key]--; }
		}
		
		// Horse Affection
		if (flags['horse'] > 0) {
			var horse_id = get_npc_id('horse');
			if (aff[horse_id] === undefined) { aff[horse_id] == 0; }
			aff[horse_id]--;
			horse_id = (horse_id < 0) ? 0 : horse_id;
		}
		
		// Dog Affection
		var dog_id = get_npc_id('dog');
		if (aff[dog_id] === undefined) { aff[dog_id] = 0; }
		aff[dog_id]--;
		aff[dog_id] = (aff[dog_id] < 0) ? 0 : aff[dog_id];

		// Increment waters if raining
		if ($('.rainy').hasClass('selected') && vars['potato_waters'] < 6) {
			vars['potato_waters']++;
		}
		if (vars['potato_waters'] == _POTATO_GROW_DAYS) {
			vars['potato_waters']++; // So it doesn't stay on 6 and add 9 potatoes every day
			vars['potatoes'] += 9;
		}

		vars['day']++;

		// Increment chickens if one is born today
		if (vars['new_chicken_days'].includes(vars['day'])) { vars['chickens']++; }
	}

		if (!dontsave) {
			// 0 = vars; 1 = flags; 2 = aff
			for (var attr in vars) {
				save_slots[cur_slot][0][attr] = 0;
            	save_slots[cur_slot][0][attr] += vars[attr];
			}
			for (var attr in flags) {
				save_slots[cur_slot][1][attr] = 0;
            	save_slots[cur_slot][1][attr] += flags[attr];
			}
			for (var attr in aff) {
				save_slots[cur_slot][2][attr] = 0;
            	save_slots[cur_slot][2][attr] += aff[attr];
			}
		}

	// Begin next day
	update_day_gui(vars['day'], jump);
	actions = get_actions(route_id, vars['day'], vars['gold'], 1);

	// Show or hide typhoon button
	$('.typhoon').show();
	if (get_month(vars['day']) != 1 || is_festival(vars['day'], false)) {
		$('.typhoon').hide();
	}

	// Weather button to Rain or Snow, depending on season
	$('.rainy').html((get_month(vars['day']) == 3) ? "SNOWY" : "RAINY");

	// Set forage values for next day
	for (var i = 0; i < actions.length; i++) {
		if (actions[i]['forage']) {
			for (var j = 0; j < actions[i]['forage_list'].length; j++) {
				$("#for_" + actions[i]['forage_list'][j][0]).val(actions[i]['forage_list'][j][1]);
			}
		}
	}

	// Set weather to sunny and update action HTML
	$(".sunny").click();
}

function reset_to (d = 3) {
	var tmp_actall = {};
	var tmp_flags = {};
	if (d == 3) {
		new_game(route_id);
	} else {
		for (let key in actions_all) {
			if (parseInt(key) >= d) {
				tmp_flags = actions_all[key][1];
				for (var i = 0; i < actions_all[key][0].length; i++) {
					calc_actions({'cid':actions_all[key][0][i][0], 'val':actions_all[key][0][i][1]});
				}
			} else {
				tmp_actall[key] = actions_all[key];
			}
		}
		actions_all = tmp_actall;
		vars['day'] = d - 1;
		actions = [];
		flags = tmp_flags;
		next_day(true);
	}
}

function skip_to(d = 3) {
	new_game(route_id ? route_id : 0);
	vars['day'] = d;

	if (d == 3) { next_day(true); }
	if (route_id == 0) { // All Photos
		actions_all = {
			'3':[['f_dog_inside', 1], ['v_openers', 2]]
		}
	}
	if (route_id == 1 || route_id == 4) { // Elli marriage & IL Photo
		actions_all = {
			'23' : [[get_npc_id('elli'), 12], [get_npc_id('rick'), 2]]
		};
	}
	if (route_id == 2) { // Karen marriage
		// [90, 102, 109, 110]
		actions_all = {
			'90' : [['f_borrow_cows', 1]],
			'95' : [['v_gold', 1000]],
			'102' : [['v_gold', 5000]],
			'109' : [['v_lumber', 500]]
		};
	}
	
	var tmp_actall = {};
	for (let key in actions_all) {
		if (parseInt(key) < d) {
			for (var i = 0; i < actions_all[key].length; i++) {
				tmp_actall[key] = actions_all[key];
				calc_actions({'cid':actions_all[key][i][0], 'val':actions_all[key][i][1]});
			}
		}
	}
	actions_all = tmp_actall;
	next_day(true);
}

function calc_actions(a = null) {
	var actions_today = {};
	if (a !== null && a['cid'] !== undefined) {
		if (!Number.isInteger(a['cid'])) {
			if (a['cid'].charAt(0).toLowerCase() == 'f') {
				//flag change
				if (flags[a['cid'].substring(2)] === undefined) {
					console.log("undefined flag: " + a['cid']);
				} else {
					if (a['val'] !== undefined) {
						flags[a['cid'].substring(2)] += a['val'];
						if (!actions_today[a['cid']]) {
							actions_today[a['cid']] = 0;
						}
						actions_today[a['cid']] += parseInt(a['val']);
					} else {
						console.log("No value given for FLAG:" + a['cid']);
					}
				}
			} else {
				//var change
				if (vars[a['cid'].substring(2)] === undefined) {
					console.log("undefined var: " + a['cid']);
				} else {
					if (a['val'] !== undefined) {
						if (!actions_today[a['cid']]) {
							actions_today[a['cid']] = 0;
						}
						if (Array.isArray(vars[a['cid'].substring(2)])) {
							// TODO: actions_today?
							vars[a['cid'].substring(2)].push(a['val']);
						} else {
							actions_today[a['cid']] += parseInt(a['val']);
							vars[a['cid'].substring(2)] += a['val'];
						}
					} else {
						console.log("No value given for VAR:" + a['cid']);
					}
				}
			}
		} else {
			if (a['val'] !== undefined) {
				if (!actions_today[a['cid']]) {
					actions_today[a['cid']] = 0;
				}
				actions_today[a['cid']] += a['val'];
				if (aff[a['cid']] === undefined) {
					aff[a['cid']] = 0;
				}
				aff[a['cid']] += a['val'];
				
				// 0 <= aff <= 255
				aff[a['cid']] = ((aff[a['cid']] > 255) ? 255 : aff[a['cid']]);
				aff[a['cid']] = ((aff[a['cid']] < 0) ? 0 : aff[a['cid']]);
			}
		}
	}
	return actions_today;
}

function fish() {
	return { 'desc':'Fish', 'forage':true, forage_list:[[get_crop_id('fish s'), 0], [get_crop_id('fish m'), 0], [get_crop_id('fish l'), 0]] };
}

function betting_table(a = []) {
	a.push({'desc':('<div class="ml-3">GOLD:&nbsp;&nbsp;<input type="number" id="b_gold" value="' + vars['gold'] + '" style="margin-right:20px" onchange="calc_bets()" /></div>' +
			'<div class="ml-3">NEED:&nbsp;&nbsp;<input type="number" id="b_need" onchange="calc_bets()" style="margin-right:20px" value="' +
			((route_id == 0) ? (((200 - vars['medals']) < 0) ? 0 : (200 - vars['medals'])) : (((500 - vars['medals']) < 0) ? 0 : (500 - vars['medals']))) +
			'" /></div>' + '<div class="ml-3">HAVE:&nbsp;&nbsp;<input type="number" id="b_have" onchange="calc_bets()" value="' + vars['medals'] + '" /></div>')});
	for (var i = 0; i < 6; i++) {
		a.push({'desc':'odds', 'b_table':true, 'b_id':i});
	}
	return a;
}

function new_game(id = 0) {
	route_id = id;
	reset_vars();
	vars['day'] = 3;
	document.title = route_names[route_id] + " - HM64 Router";

	// 0 = vars; 1 = flags; 2 = aff
	cur_slot = 0;
	save_slots = [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}], [{}, {}, {}]];
	for (var i = 0; i < 4; i++) {
		$("#save_" + i).html("Slot " + (i + 1));
	}
	
	// Pre-set npc_ids for quick lookup
	for (var i = 0; i < npcs.length; i++) {
		if (!npc_ids[npcs[i]]) {
			npc_ids[npcs[i]] = i;
		}
	}

	// Clear forageable count
	$("input[id^='for_']").val(0);

	// Set affection of all characters to 0, display at top
	// Characters listed based on route
	var aff_html = [];
	$('.status_row').remove();
	if (route_id == 0) {
		for (var i = 0; i < 39; i++) {
			aff[i] = 0;
		}
	}
	for (let key in route_affs[route_id]) {
		var npc_id = get_npc_id(route_affs[route_id][key]);
		aff[npc_id] = 0;
		aff_html.push('<div class="p-1 display_main">' +  route_affs[route_id][key].toUpperCase() + ': <span id="npc_' + npc_id + '">0</span></div>');
	}

	var tmp_html = '<div class="p-1 display_main">GOLD: <input type="number" id="disp_gold" value="300"  onchange="gold_update()" /></div>';
	if (aff_html.length <= 3) {
		$('#status_row1').html(tmp_html + aff_html.join(""));
	} else {
		$('#status_row1').html(tmp_html + aff_html[0] + aff_html[1] + aff_html[2]);
		for (var i = 3; i < aff_html.length; i++) {
			//TODO
			// Multiple affections to track
			// Put on multiple rows; four per row
		}
	}

	// Custom skip options
	var html_list = [];
	html_list.push('<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Skip to</a>');
	html_list.push('<div class="dropdown-menu" aria-labelledby="navbarDropdown2">');
	for (var i = 0; i < skip_to_list[route_id].length; i++) {
		html_list.push('<span class="dropdown-item ' + get_month_name(skip_to_list[route_id][i]).toLowerCase() +
			'" onclick="skip_to(' + skip_to_list[route_id][i] +
			')">' + get_month_name(skip_to_list[route_id][i], true) + ' ' + get_day(skip_to_list[route_id][i]) +
			' (' + get_day_of_week(skip_to_list[route_id][i], true).toUpperCase() + ')</span>');
	}
	$('#skip_to_menu').html(html_list.join("") + '</div>');

	// Custom flags for particular run
	if (route_id == 0) { // All Photos
		vars['openers'] = 0;
		vars['potato_waters'] = 0;
		flags['potato_planted'] = 0;
	}

	if (route_id == 3) { // Popuri marriage
		flags['moondrops_bought'] = 0;
		flags['moondrops_planted'] = 0;
		vars['moondrop_waters'] = 0;
	}
	if (route_id == 4) {
		flags['typhoon'] = 0;
	}
	next_day(true);
}

function update_day_gui(d = vars['day'], jump = false) {

	var m = get_month_name(d);

	if (d % 30 == 1 || jump) {
		// Only update "month" on the first of the month
		// or if jumped to this day
		$('.display_main.season').removeClass('spring').removeClass('summer').removeClass('fall').removeClass('winter').addClass(m.toLowerCase());
	}

	$('.display_main.season').html(m.charAt(0).toUpperCase() + m.toLowerCase().substr(1));
	$('.display_main.day').html(get_day(d));
	$('.display_main.dow').html(get_day_of_week(d, true));
	$('.display_main.japanese').html(get_day_of_week(d, false, true));
	for (let key in aff) {
		$("#npc_" + key).html(aff[key]);
		if (is_bachelorette(key)) {
			$("#npc_" + key).parent().css('background-color', get_heart_color(aff[key]));
		}
	}
	$('#disp_gold').val(vars['gold']);

	var html = "";
	//Seasonal Foragables
	tmp_cs = crop_seasons[get_month(d)];
	for (var i = 0; i < tmp_cs.length; i++) {
		html += '<div class="ml-3"><img class="forageDisp" id="img_for_' + tmp_cs[i] +
			'" src="/img/item/' + crops[tmp_cs[i]].toLowerCase().replace(" ", "_") + '.png" ' +
			'onclick="input_increment(this)" />&nbsp;';
		html += '<input style="width:40px" type="number" value="0" id="for_' + tmp_cs[i] + '" /></div>';
	}
	
	//Fish
	for (var i = 13; i < 16; i++) {
		html += '<div class="ml-3"><img class="forageDisp" id="img_for_' + i +
			'" src="/img/item/' + crops[i].toLowerCase().replace(" ", "_") + '.png" ' +
			'onclick="input_increment(this)" />&nbsp;';
		html += '<input style="width:40px" type="number" value="0" id="for_' + i + '" /></div>';
	}
	$('#forage_display').html(html);
	
	/*
	// Load Slot Menu
	for (var i = 0; i < 4; i++) {
		$('#save_' + cur_slot).html('Slot ' + (cur_slot + 1) + " (" + get_month_name(d, true) + " Y" + (Math.floor((d - 1) / 120) + 1) + ")");
		if (d % 30 == 1 || d % 30 == 3 || jump) {
			$('#save_' + cur_slot).removeClass('spring').removeClass('summer').removeClass('fall').removeClass('winter');
			$('#save_' + cur_slot).addClass(get_month_name(d).toLowerCase());
		}
	}
	*/
	
}

function load_save(slot = cur_slot) {
	// 0 = vars; 1 = flags; 2 = aff
	if (!$.isEmptyObject(save_slots[slot][0])) {
		reset_vars();
		for (var attr in save_slots[slot][0]) {
			vars[attr] = 0;
			vars[attr] += save_slots[slot][0][attr];
		}
		for (var attr in save_slots[slot][1]) {
			flags[attr] = 0;
			flags[attr] += save_slots[slot][1][attr];
		}
		for (var attr in save_slots[slot][2]) {
			aff[attr] = 0;
			aff[attr] += save_slots[slot][2][attr];
		}
		next_day(true);
	} else {
		console.log('empty slot');
	}
}

function reset_vars() {
	actions = [];
	actions_all = {};
	reset = false;
	dontsave = false;
	sell_stuff = false;

	vars = { "chickens":0, "gold":300, "lumber":0, "day":3, "medals":0,
			"feed":0, "fodder":0, "bridge_days_worked":0, "springs_days_worked":0,
			"potatoes" : 0, "potato_waters" : 0, "corn_waters" : 0, "watering_can_fill" : 0,
			"new_chicken_days" : [] };
	flags = { "treasure_map" : 0, "new_mus_box" : 0, "old_mus_box" : 0,
			"fishing_rod" : 0, "dog_inside" : 0, "horse" : 0, "chicken_outside" : 0,
			"new_chick" : 0, "chicken_funeral" : 0, "corn_planted" : 0,
			"recipe_basil" : 0,
			"ankle_maria" : 0, "dream_maria" : 0, "sick_maria" : 0, "recipe_maria" : 0, "photo_maria" : 0,
			"ankle_elli" : 0, "dream_elli" : 0, "sick_elli" : 0, "recipe_elli" : 0, "photo_elli" : 0,
			"ankle_karen" : 0,
			"ankle_popuri" : 0, "dream_popuri" : 0, "sick_popuri" : 0, "recipe_popuri" : 0, "photo_popuri" : 0,
			"ankle_ann" : 0, "dream_ann" : 0, "sick_ann" : 0, "recipe_ann" : 0, "photo_ann" : 0,
			"photo_springs" : 0, "photo_swimming" : 0, "photo_cowfest" : 0, "photo_harvest" : 0,
			"photo_horserace" : 0, "photo_dograce" : 0, "photo_married" : 0, "photo_baby" : 0,
			"berry_kappa" : 0, "berry_flowerfest" : 0, "berry_strength" : 0,
			"berry_eggfest" : 0, "berry_pond" : 0, "berry_farm" : 0, "berry_basil" : 0,
			"blue_feather" : 0, "propose" : 0,
			"wine_from_duke" : 0, "vineyard_restored" : 0,
			"kitchen" : 0, "bathroom" : 0, "baby bed" : 0, "stairway" : 0, "log_terrace" : 0, "greenhouse" : 0,
			"borrow_cows" : 0 , "harvest_king" : 0,
			"cow1" : 0, "cow2" : 0, "cow3" : 0, "first_chicken" : 0 };
	aff = {};
}

function add_recipes() {
	// name, item, npc_give, aff_boost, [npc that gets aff boost, aff required for recipe, npc aff is required by, season]
	recipes = [
		["Cream of Turnip Stew", 16, 21, 7],
		["Easy Tomato Soup", 19, 30, 7],
		["Tomato Rice", 19, 11, 5, null, 30, 10],
		["Tomato Soup", 19, 25, 6],
		["Corn Fritter", 20, 6, 7],
		["Corn Pasta", 20, 2, 7],
		["Mashed Potatoes", 17, 0, 6],
		["Fried Potatoes & Bacon", 17, 38, 7],
		["Vegetable Tomato Stew", 19, 18, 7],
		["Garlic Potato Beef", 17, 13, 9],
		["Eggplant with Miso", 21, 22, 6],
		["Rolled Cabbage", 18, 19, 5],
		["Stuffed Omelet", 23, 12, 5, null, 51],
		["Spa-poached Egg", 23, 17, 7],
		["Handmade Butter", [24, 25, 26, 27], 28, 8],
		["Mushroom Rice", 6, 20, 7],
		["Fried Char", 15, 9, 0, null, 0, null, [0, 1, 2]],
		["Grilled Trout", [14, 15], 3, 9, null, 0, null, [0, 1, 2]],
		["Stuffed Mushroom", 6, 4, 3],
		["Steamed Clam", 5, 10, 3, null, 48],
		["Miso Soup w Sprouts", 0, 27, 7],
		["Sesame Dandelion", 2, 29, 7],
		["Mushroom Salsa", 6, 39, 2, null, 31],
		["Strawberry Dog", 23, 31, 7],
		["Walnut Cake", 3, 8, 7],
		["Bread Pudding", [23, 24, 25, 26, 27], 7, 6],
		["Herb Rice Cake", 0, 24, 8],
		["Potato Pancake", 17, 37, 7],
		["Strawberry Jam", 23, 26, 6],
		["Strawberry Champagne", 23, 16, 3],
		["Veryberry Wine", 1, 15, 5],
		["Spice Tea", [23, 24, 25, 26, 27], 5, 8, null, 0, null, 3],
		["Hot Spicy Wine", 5, 1, 7],
		["Cinnamon Milk Tea", [24, 25, 26, 27], 14, 5],
		["Pickled Turnips", 16, 23, 8]
	];
}

function to_html(a = actions) {
	
	console.log(a);
	
	var cur_vis = true;
	var html = "";
	var lines = 0;
	var cur_div = null;
	var div_list = [];
	for (var i = 0; i < a.length; i++) {
		if (a[i]['sr'] !== true) {
			lines++;
			if (i != 0) { html += "</div>"; }
			if (a[i]['div'] != cur_div) {
				cur_vis = (a[i]['vis'] === undefined) ? true : a[i]['vis'];
				if (a[i]['div'] !== undefined) {
					if (cur_div != null) { html += "</div>"; }
					html += '<div id="' + a[i]['div'] + '"';
					if (!cur_vis) {
						html += ' style="display:none"';
					}
					html += '>';
					if (div_list.includes(a[i]['div'])) {
						console.log("WARNING: duplicate or split div id (" + a[i]['div'] + ")");
					}
					div_list.push(a[i]['div']);
					cur_div = a[i]['div'];
				} else if (cur_div != null) {
					html += "</div>";
					cur_div = null;
				}
			}
			html += '<div class="d-flex justify-content-start" style="margin-bottom:5px;';
			if (a[i]['imp'] == true) {
				html += ' background-color:yellow;';
			}
			html += '">';
		}
		if (a[i]['val'] === undefined) {
			if (a[i]['b_table']) {
				// Bet table
				// {'desc':'odds', 'b_table':true, 'b_id':i}
				
				html += '<span style="border:3px solid ' + bet_colors[a[i]['b_id']];
				html += ';width:30px;height:30px;margin:5px;text-align:center">' + (parseInt(a[i]['b_id']) + 1) + '</span>';
				html += 'x&nbsp;<input class="oddsInput" type="number" id="b_' + a[i]['b_id'] + '" value="1" onchange="calc_bets()" />';
				html += '<input id="bg_' + a[i]['b_id'] + '" value="';
				html += Math.floor(vars['gold'] / (6 * 50));
				html += '" disabled=true style="border:1px solid black"/>';
			} else {
				// Plain text
				if (a[i]['cid'] !== undefined || a[i]['iid'] !== undefined) {
					// With Image
					html += '<span class="mr-2">' + ((a[i]['iid'] === undefined) ? get_npc_img(a[i]['cid']) : get_npc_img(a[i]['iid'])) + '</span>';
				}
				html += '<span class="textHov">' + a[i]["desc"] + '</span>';
			}
		} else {
			// Value defined
			if (a[i]['sr']) {
				html += '<div class="ml-3">';
			} else {
				html += '<span class="mr-2">' + ((a[i]['iid'] === undefined) ? get_npc_img(a[i]['cid']) : get_npc_img(a[i]['iid'])) + '</span>';
			}
			html += '<button type="button" class="btn btn-' + ((a[i]["sel"] === false) ? 'danger' : 'success') +
				' action-button" id="ab_' + i + '" onclick="toggle_color(this, ' + "'" +
				((a[i]['div_tog'] == undefined) ? "" : a[i]['div_tog']) + "', " +
				get_toggle(a[i], a) + ')">' + a[i]['desc'] + '</button>';
			if (a[i]['sr']) {
				html += '</div>';
			}
		}
	}
	html += ((html.length > 0) ? '</div><br/>' : '') + '<button type="button" class="btn btn-primary';
	if (dontsave) { html += ' dontsave'; }
	html += '" onclick="next_day()">' + (((dontsave) ? "DONT SAVE" : "Sleep") + '</button>');

	// Small Text for many lines
	if (lines > 8) {
		var tmp_h = "";
		while (html != tmp_h) {
			tmp_h = html;
			html = html.replace('action-button', 'action-btn-small');
			html = html.replace('forageDisp', 'forageDspSmall');
			html = html.replace('textHov', 'textHvrSmall');
		}
	}
	return html;
}

function get_toggle (abid = null, a = actions) {
	var result = [];
	for (var i = 0; i < 4; i++) {
		var tmp_res = [];
		if (abid["t" + i] !== undefined) {
			for (var j = 0; j < a.length; j++) {
				if ((Array.isArray(abid["t" + i]) && abid["t" + i].includes(a[j]['desc'])) ||
					(!Array.isArray(abid["t" + i]) && a[j]['desc'] === abid["t" + i])) {
						tmp_res.push(j);
				}
			}
			if (!tmp_res.length) {
				console.log("WARNING: toggle added to action button, but id doesnt exist - (T" + i + " = " + abid["t" + i] + ')');
			}
		}
		result.push('[' + tmp_res.join(", ") + ']');
	}
	return result.join(", ");
}

function get_npc_img(img_id = null) {
	var img_html = "";
	
	// If array of values is given, loop through and send back first non-empty result
	if (Array.isArray(img_id)) {
		for (var i = 0; i < img_id.length; i++) {
			var x = get_npc_img(img_id[i]);
			if (x !== "") { return x; }
		}
		return "";
	}
	
	// Only accept numbers; ignore 'v_xyz' and 'f_xyz' for flag and variable values
	if (Number.isInteger(parseInt(img_id)) && img_id >= 0 && img_id < npcs.length) {
		var npc_name = npcs[img_id].toLowerCase().replace(" ", "_");
		img_html = '<img class="forageDisp" src="/img/' + ((npcs[img_id].substring(0, 1) == "_") ? 'default' : ('npc/' + npc_name)) + '.png">';
	}
	return img_html;
}

function calc_bets(bet_type = 1) {
	/*
	 * BET TYPES:
	 * 
	 * 1 - DEMO STRAT
	 * 2 - NILLOWS STRAT
	 * 
	 */

	var g = ($('#b_gold').val() === undefined) ? vars['gold'] : $('#b_gold').val();
	var need = ($('#b_need').val() === undefined) ? 500 : $('#b_need').val();
	need -= ($('#b_have').val() === undefined) ? 0 : $('#b_have').val();

	// If you already have enough medals, set bet values to zero
	if (need <= 0) {
		$("input[id^='bg_']").val(0);
		return;
	}

	// Gather odds and calculate max G required
	var odds = [];
	var bets = [];
	var max_required = 0;

	for (var i = 0; i < 6; i++) {
		var cur_need = Math.ceil(need / parseInt($('#b_' + i).val()));
		max_required += (cur_need > 99) ? 99 : cur_need;
		// [odd amt, original order, bets needed, bets actual]
		odds[i] = [parseInt($('#b_' + i).val()), i, cur_need, 0];
	}

	// If you can afford it, minimum required medals to achieve goal for all
	if (max_required * 50 <= g) {
		$("input[id^='bg_']").each(function(i) {
			$(this).val((Math.ceil(need / odds[i][0]) > 99) ? 99 : Math.ceil(need / odds[i][0]));
		});
		return;
	}

	var buy_amt = Math.floor(g / 50);
	odds.sort(function(a, b){ return b[0] - a[0] });

	// Get odds by betting strategy
	if (bet_type == 1) { // DEMO
		for (var i = odds.length - 1; i >= 0; i--) {
			if (odds[i][2] <= 99 && odds[i][2] <= buy_amt) {
				odds[i][3] = odds[i][2];
				buy_amt -= odds[i][2];
			}
		}
	} else if (bet_type == 2) { // NILLOWS
		for (var i = 0; i < odds.length; i++) {
			if (odds[i][2] <= 99 && odds[i][2] <= buy_amt) {
				odds[i][3] = odds[i][2];
				buy_amt -= odds[i][2];
			}
		}
	}

	if (route_id == 0 && buy_amt > 0) { // All Photos
		// Not enough to fill all bets to quota, but leftover bets
		if (odds[5][3] == 0) {
			var max_zero = -1;
			var extra_medals = 0;

			for (var i = 0; i < odds.length; i++) {
				if (odds[i][3] == 0) {
					if (max_zero == -1) { max_zero = i; }
					extra_medals += Math.floor(odds[max_zero][0] / odds[i][0]);
				}
			}

			if (extra_medals > 0) {
				var spread = Math.floor(buy_amt / extra_medals);
				for (var i = max_zero; i < odds.length; i++) {
					var tmp_ex = spread * Math.floor(odds[max_zero][0] / odds[i][0]);
					if ((tmp_ex + odds[i][3]) > 99) {
						buy_amt -= (99 - odds[i][3]);
						odds[i][3] = 99;
					} else {
						buy_amt -= tmp_ex;
						odds[i][3] += tmp_ex;
					}
				}
			}
		}

		// Filled all to quota, but more bets available
		// Fill from lowest odds to highest
		var i = 5;
		while (buy_amt > 0 && i >= 0) {
			if ((99 - odds[i][3]) <= buy_amt) {
				buy_amt -= (99 - odds[i][3]);
				odds[i][3] = 99;
			} else {
				odds[i][3] += buy_amt;
				buy_amt = 0;
			}
			i--;
		}

	}

	// Display values
	for (var i = 0; i < odds.length; i++) {
		$("#bg_" + odds[i][1]).val(odds[i][3]);
	}
}

function toggle_color(t, div_tog = "", t0 = [], t1 = [], t2 = [], t3 = []) {
	if (div_tog != "") { $('#' + div_tog).toggle(); }
	if ($(t).hasClass("btn-danger")) {
		$(t).removeClass("btn-danger").addClass("btn-success");
		for (var i = 0; i < t2.length; i++) {
			$("#ab_" + t2[i]).addClass("btn-danger").removeClass("btn-success");
		}
		for (var i = 0; i < t3.length; i++) {
			$("#ab_" + t3[i]).removeClass("btn-danger").addClass("btn-success");
		}
	} else {
		$(t).addClass("btn-danger").removeClass("btn-success");
		for (var i = 0; i < t0.length; i++) {
			$("#ab_" + t0[i]).addClass("btn-danger").removeClass("btn-success");
		}
		for (var i = 0; i < t1.length; i++) {
			$("#ab_" + t1[i]).removeClass("btn-danger").addClass("btn-success");
		}
	}
}

function get_npc_id(n = "") {
	n = n.toLowerCase().replace("'", "").replace("_", " ").trim();
	if (npc_ids[n] !== undefined) { return npc_ids[n]; }
	for (var i = 0; i < npcs.length; i++) {
		if (n.localeCompare(npcs[i].toLowerCase().replace("'", "").replace("_", " ").trim()) === 0) {
			return i;
		}
	}
	return null;
}

function get_crop_id(n = null) {
	if (!n) { return null; }
	for (var i = 0; i < crops.length; i++) {
		if (n.toLowerCase().replace("'", "").localeCompare(crops[i].toLowerCase()) === 0) {
			return i;
		}
	}
	return null;
}

function weather_change(update_gui = true) {
	if (update_gui) {
		update_day_gui();
	}
	var z = $('.weather.selected');
	actions = get_actions(route_id, vars['day'], vars['gold'], (z.hasClass('sunny') ? 1 : (z.hasClass('typhoon') ? -1 : 0)));

	/*
	//Set forage values for next day
	for (var i = 0; i < actions.length; i++) {
		if (actions[i]['forage']) {
			for (var j = 0; j < actions[i]['forage_list'].length; j++) {
				$("#for_" + actions[i]['forage_list'][j][0]).val(actions[i]['forage_list'][j][1]);
			}
		}
	}
	*/

	$('#hm64-content').html(to_html(actions));
}

function is_festival (d = vars['day'], store_close_only = true) {
	//Days where everything is closed, ignoring holidays where shops keep normal hours
	/*
	 * New Year, Planting, Horse Race, Flower, Vegetable
	 * Swimming, Cow, Harvest, Egg, Horse Race, Dog Race
	 */
	var hol = [1, 8, 17, 23, 39, 54, 64, 72, 80, 88, 109];
	if (!store_close_only) {
		// Festival days where shops remain open
		// Used for weather restrictions
		// Fireworks, Firefly, Thanksgiving, Starry Night]
		hol = hol.concat([31, 47, 100, 114]);
	}
	return hol.includes(d % 120);
}

function festival_name (d = vars['day']) {
	if (d == 1) { return "New Years Day"; }
	if (d == 8) { return "Planting Festival"; }
	if (d == 17 || d == 88) { return "Horse Race"; }
	if (d == 23) { return "Flower Festival"; }
	if (d == 31) { return "Fireworks Festival"; }
	if (d == 39) { return "Vegetable Festival"; }
	if (d == 47) { return "Firefly Festival"; }
	if (d == 54) { return "Sea Festival"; }
	if (d == 64) { return "Cow Festival"; }
	if (d == 72) { return "Harvest Festival"; }
	if (d == 80) { return "Egg Festival"; }
	if (d == 100) { return "Thanksgiving"; }
	if (d == 109) { return "Dog Race"; }
	if (d == 114) { return "Starry Night"; }
	if (d == 117) { return "Spirit Festival"; }
	if (d == 120) { return "New Years Eve"; }
	return null;
}

function day_is (d = vars['day'], name = null) {
	if (name === null) { return null; }
	if ($.isArray(name)) {
		for (var i = 0; i < name.length; i++) {
			if (name[i].toLowerCase().localeCompare(get_day_of_week(d).toLowerCase()) === 0) {
				return true;
			}
		}
		return false;
	}
	return (name.toLowerCase().localeCompare(get_day_of_week(d).toLowerCase()) === 0);
}

function array_convert(a = actions) {
	for (var i = 0; i < a.length; i++) {
		if (a['cid'] !== undefined && !Array.isArray(a['cid'])) {
			a['cid'] = [a['cid']];
			a['val'] = [a['val']];
		}
	}
	return a;
}

function get_heart_color(num = 0) {
	if (num > 219) { return 'lightblue'; }
	if (num > 207) { return 'pink'; }
	if (num > 155) { return 'yellow'; }
	if (num > 103) { return 'lightgreen'; }
	if (num > 51) { return 'cyan'; }
	return 'white';
}

function is_bachelorette(gid = null) {
	return (gid == get_npc_id('elli') || gid == get_npc_id('karen') || gid == get_npc_id('ann') || gid == get_npc_id('popuri') || gid == get_npc_id('maria'));
}

function get_month (num = null) {
	if (num === null) { return null; }
	return Math.floor((num - 1) / 30) % 4;
}

function get_month_name (num = null, short_name = false) {
	if (num === null) { return null; }
	return month_names[get_month(num) + (short_name ? 4 : 0)];
}

function get_day_of_week (num = null, short_name = false, jap_name = false) {
	if (num === null) { return null; }
	return day_names[num % 7 + (short_name ? 7 : (jap_name ? 14 : 0))];
}

function get_dow (num = null, short_name = false, jap_name = false) {
	return get_day_of_week(num, short_name, jap_name);
}

function get_day (num = null) {
	if (num === null) { return null; }
	if (num < 3) { return 0; }
	return (num % 30 == 0) ? 30 : num % 30;
}

function gold_update() {
	vars['gold'] = parseInt($('#disp_gold').val());
	weather_change(false);
}

function arr_to_str(arr = []) {
	return "[" + arr.join(", ") + "]";
}

function ats (arr = []) {
	return arr_to_str(arr);
}

function forage(need = 0, g = vars['gold'], d = vars['day']) {
	var f_amt = need - g;
	var m = get_month(d);
	var forage_list = [];
	var d = "";
	
	if (f_amt <= 0) { return null; }
	if (m == 3) { // Winter
		forage_list = ['mine', ["Ore", 0], ["Moonlight", 0], ["Blue Rock", 0], ["Pontata", 0], ["Rare Metal", 0]];
	} else {
		if (f_amt <= 30) { forage_list = ['edible', [get_crop_id('edible'), 1]]; }
	}
	if (m == 0) { //Spring
		if (f_amt <= 40) {
			forage_list = [[get_crop_id('berry'), 1]];
			d = 'berry';
		} else if (f_amt <= 70) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('berry'), 1]];
			d = 'ber/ed';
		} else if (f_amt <= 110) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('berry'), 2]];
			d = 'ber/ed, berry';
		} else if (f_amt <= 150) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('berry'), 3]];
			d = 'ber/ed, berry, pond berry'
		} else if (f_amt <= 180) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('berry'), 2], [get_crop_id('clover'), 1]];
			d = 'ber/ed, pond berry, clover';
		} else if (f_amt <= 220) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('berry'), 3], [get_crop_id('clover'), 1]];
			d = 'ber/ed, berry, pond all';
		} else if (f_amt <= 240) {
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('berry'), 1], [get_crop_id('clover'), 2]];
			d = 'ber/ed, cave all';
		} else if (f_amt <= 280) {
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('berry'), 2], [get_crop_id('clover'), 2]];
			d = 'ber/ed, cave all, berry';
		} else if (f_amt <= 320) {
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('berry'), 3], [get_crop_id('clover'), 2]];
			d = 'ber/ed, cave all, berry, pond berry';
		} else { // Full Forage
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('berry'), 3], [get_crop_id('clover'), 3]];
			d = 'ber/ed, cave all, berry, pond all';
		}
	}

	if (m == 1) { //Summer
		if (f_amt <= 40) {
			forage_list = [[get_crop_id('walnut'), 1]];
			d = 'walnut';
		} else if (f_amt <= 70) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 1]];
			d = 'ed/wal';
		}  else if (f_amt <= 110) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 2]];
			d = 'ed/wal, wal';
		} else if (f_amt <= 180) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 2], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, mango';
		} else if (f_amt <= 250) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 2], [get_crop_id('mango'), 1], [get_crop_id('clover'), 1]];
			d = 'ed/wal, wal, mango, pond clover';
		} else if (f_amt <= 290) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 3], [get_crop_id('clover'), 1], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, mango, pond all';
		} else if (f_amt <= 320) {
			forage_list = [[get_crop_id('edible'), 1], [get_crop_id('walnut'), 2], [get_crop_id('clover'), 2], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, mango, cave clovers';
		} else if (f_amt <= 350) {
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('walnut'), 2], [get_crop_id('clover'), 2], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, cave all, mango';
		} else { //Full Forage
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('walnut'), 2], [get_crop_id('clover'), 3], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, cave all, mango, pond all';
		}
	}
		
	if (m == 2) {
		if (f_amt <= 60) {
			forage_list = [[get_crop_id('mushroom'), 1]];
			d = 'mushroom';
		} else if (f_amt <= 90) {
			forage_list = [[get_crop_id('mushroom'), 1], [get_crop_id('edible'), 1]];
			d = 'mush/ed';
		} else if (f_amt <= 150) {
			forage_list = [[get_crop_id('mushroom'), 2], [get_crop_id('edible'), 1]];
			d = 'mush/ed, mush';
		} else if (f_amt <= 250) {
			forage_list = ['mush/ed, mush, pois', [get_crop_id('mushroom'), 2], [get_crop_id('edible'), 1], [get_crop_id('pois mush'), 1]];
		} else if (f_amt <= 300) {
			forage_list = [[get_crop_id('mushroom'), 2], [get_crop_id('edible'), 1], [get_crop_id('pois mush'), 1], [get_crop_id('grapes'), 1]];
			d = 'mush/ed, mush, pois, grapes';
		} else if (f_amt <= 320) {
			forage_list = [[get_crop_id('mushroom'), 2], [get_crop_id('edible'), 1], [get_crop_id('pois mush'), 1], [get_crop_id('clover'), 1]];
			d = 'mush/ed, mush, pois, pond clover';
		} else if (f_amt <= 380) {
			forage_list = [[get_crop_id('mushroom'), 3], [get_crop_id('edible'), 1], [get_crop_id('pois mush'), 1], [get_crop_id('clover'), 1]];
			d = 'mush/ed, mush, pois, pond all';
		} else if (f_amt <= 430) {
			forage_list = [[get_crop_id('mushroom'), 3], [get_crop_id('edible'), 1], [get_crop_id('pois mush'), 1], [get_crop_id('clover'), 1], [get_crop_id('grapes'), 1]];
			d = 'mush/ed, mush, grape/pois, pond all';
		} else if (f_amt <= 570) {
			forage_list = [[get_crop_id('mushroom'), 2], [get_crop_id('edible'), 2], [get_crop_id('pois mush'), 2], [get_crop_id('clover'), 2], [get_crop_id('grapes'), 1]];
			d = 'mush/ed, mush, cave all, grape/pois';
		} else if (f_amt <= 640) {
			forage_list = [[get_crop_id('mushroom'), 2], [get_crop_id('edible'), 2], [get_crop_id('pois mush'), 2], [get_crop_id('clover'), 3], [get_crop_id('grapes'), 1]];
			d = 'mush/ed, mush, cave all, grape/pois, pond clover';
		} else {
			forage_list = [[get_crop_id('mushroom'), 3], [get_crop_id('edible'), 2], [get_crop_id('pois mush'), 2], [get_crop_id('clover'), 3], [get_crop_id('grapes'), 1]];
			d = 'mush/ed, mush, cave all, grape/pois, pond all';
		}
	}

	return { 'desc':d, 'forage':true, 'forage_list':forage_list };
}

function print_vars() {
	$('#load_input').val(JSON.stringify(save_slots[cur_slot]));
}

function load_input() {
	save_slots[0] = JSON.parse($('#load_input').val());
	load_save(0);
}
