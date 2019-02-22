$(document).ready(function() {
	new_game(2);
});

function reset_vars() {
	actions = [];
	actions_all = {};
	reset = false;
	sell_stuff = false;

	vars = { "chickens" : 0, "gold":300, "lumber" : 0, "day" : 3, "medals" : 0,
			"feed" : 0, "fodder" : 0, "bridge_days_worked" : 0, "springs_days_worked" : 0,
			"potatoes" : 0, "potato_waters" : 0, "watering_can_fill" : 0, "corn_waters" : 0,
			"new_chicken_days" : "", "new_cow_days" : "", "cows" : 0, "grass" : 0,
			"grass_planted" : 0, "happiness" : 0, "days_married" : 0, "inner_sprite_aff" : 0};
	flags = { "treasure_map" : 0, "new_mus_box" : 0, "old_mus_box" : 0,
			"fishing_rod" : 0, "dog_inside" : 0, "dog_entered" : 0,
			"horse" : 0, "horse_brush" : 0, "sustaining_carrot" : 0, "horse_entered" : 0,
			"cows_outside" : 0, "cow_entered" : 0, "milker" : 0,
			"new_chick" : 0, "chicken_funeral" : 0, "chicken_outside" : 0,
			"recipe_basil" : 0, "recipe_sprite" : 0, "golden_hammer" : 0,
			"ankle_maria" : 0, "dream_maria" : 0, "sick_maria" : 0, "recipe_maria" : 0, "photo_maria" : 0,
			"ankle_elli" : 0, "dream_elli" : 0, "sick_elli" : 0, "recipe_elli" : 0, "photo_elli" : 0,
			"ankle_karen" : 0, "photo_karen" : 0, "blue_feather" : 0, "propose" : 0,
			"ankle_popuri" : 0, "dream_popuri" : 0, "sick_popuri" : 0, "recipe_popuri" : 0, "photo_popuri" : 0,
			"ankle_ann" : 0, "dream_ann" : 0, "sick_ann" : 0, "recipe_ann" : 0, "photo_ann" : 0,
			"photo_springs" : 0, "photo_swimming" : 0, "photo_cowfest" : 0, "photo_harvest" : 0,
			"photo_horserace" : 0, "photo_dograce" : 0, "photo_married" : 0, "photo_baby" : 0,
			"berry_kappa" : 0, "berry_flowerfest" : 0, "berry_strength" : 0, "berry_mine" : 0,
			"berry_eggfest" : 0, "berry_pond" : 0, "berry_farm" : 0, "berry_basil" : 0,
			"wine_from_duke" : 0, "vineyard_restored" : 0, "baby" : 0,
			"kitchen" : 0, "bathroom" : 0, "babybed" : 0, "stairway" : 0, "logterrace" : 0, "greenhouse" : 0,
			"borrow_cows" : 0 , "harvest_king" : 0, "good_weather" : 1, "dontsave" : 0,
			"cutscene_beach" : 0, "cutscene_rabbit" : 0, "cutscene_watermelon" : 0,
			"cutscene_bug" : 0, "cutscene_cookfish" : 0, "cutscene_vineyard" : 0,
			"fishing_rod_stored" : 0};
	aff = {};
}

function load_game (slot = 0) {
	
}

function get_actions(rid = null, d = vars['day'], g = vars['gold'], is_sunny = 1) {
	if (reset == true) {
		return [{'desc':"RESET"}];
	} else {
		if ([0, 5].includes(rid)) { return get_actions_photos(d, g, is_sunny); }
		if (rid == 1) { return get_actions_elli(d, g, is_sunny); }
		if (rid == 2) { return get_actions_karen(d, g, is_sunny); }
		if (rid == 3) { return get_actions_popuri(d, g, is_sunny); }
		if (rid == 4) { return get_actions_elli_photo(d, g, is_sunny); }
		if (rid == 7) { return get_actions_maria(d, g, is_sunny); }
		if (rid == 8) { return get_actions_ann_photo(d, g, is_sunny); }
		if (rid == 9) { return get_actions_karen_photo(d, g, is_sunny); }
	}
	return [];
}

function next_day(jump = false) {
	if (!jump) {
		flags['good_weather'] = 1;

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
		if (route_id == 0 && vars['openers'] == 0) {
			vars['openers'] = 1;
		}

		// Stumps
		aff[get_npc_id('stump')] = vars['lumber'];

		// Calculate G from sold items
		var sell_amt = 0;
		$("input[id^='for']").each(function(index) {
			var tmp_cr_id = parseInt(this.id.split("_")[1]);
			sell_amt += (this.value * parseInt(crop_prices[tmp_cr_id]));
			if (crops[tmp_cr_id].includes('milk')) { // Number of Milks Shipped
				var cow_id = get_npc_id('cow');
				if (!aff[cow_id]) { aff[cow_id] = 0; }
				aff[get_npc_id('cow')] += parseInt(this.value);
			}
			if (crops[tmp_cr_id].localeCompare("potato") == 0) {
				// Decrease potatoes variable if potatoes are sold
				vars['potatoes'] = (((vars['potatoes'] - this.value) < 0) ? 0 : (vars['potatoes'] - this.value));
			}
		});

		vars['gold'] += parseInt(sell_amt);
		sell_stuff = (sell_amt > 0);

		// Affection from 4 days bridge work or hot springs work
		if ((vars['day'] == 87 && vars['bridge_days_worked'] == 4) ||
			(vars['day'] == 106 && vars['springs_days_worked'] == 4)) {
			for (var i = 0; i < npcs.length; i++) {
				if (aff[i] !== undefined && !not_villagers.includes(i)) {
					aff[i] = ((aff[i] >= 253) ? 255 : (aff[i] + 3));
				}
			}
		}

		// Chicken Funeral
		if (flags['chicken_funeral'] == 1) {
			vars['chickens'] = 0;
			var farm_npcs = [get_npc_id('grey'), get_npc_id('doug'), get_npc_id('ann')];
			for (var tmp_v in aff) {
				aff[tmp_v] -= (farm_npcs.includes(tmp_v) ? (_FUNERAL_AFF_LOSS * 30) : _FUNERAL_AFF_LOSS);
				aff[tmp_v] = (aff[tmp_v] < 0) ? 0 : aff[tmp_v];
			}
		}

		// decrement flag counters
		for (var key in flags) {
			if (flags[key] > 1) {
				// When certain extensions are done, animals warp inside
				// Sometimes the dog warps outside
				if (flags['kitchen'] == 2 || flags['bathroom'] == 2) {
					flags['cows_outside'] = 0;
					flags['chicken_outside'] = 0;
				}
				if (flags['stairway'] == 2) { flags['dog_inside'] = 0; }
				flags[key]--;
			}
			if (flags[key] < 0) {
				console.log("ERROR: flags['" + key + "'] is negative (" + flags[key] + "), RESET TO ZERO");
				flags[key] = 0;
			}
		}

		// Married Affection
		if (flags['photo_married'] == 1) {
			aff[get_npc_id('karen')]--;
			vars['days_married']++;
			if (vars['days_married'] >= 30 && flags['baby'] == 0 && flags['babybed'] == 1 && aff[get_npc_id('karen')] >= 250) {
				flags['baby'] = (_BABY_BORN_DAYS + 2);
			}
		}

		// Horse Affection
		if (flags['horse'] > 0) {
			var horse_id = get_npc_id('horse');
			if (aff[horse_id] === undefined) { aff[horse_id] == 1; }
			aff[horse_id]--;
			aff[horse_id] = ((aff[horse_id] < 0) ? 0 : aff[horse_id]);
		}

		// Dog Affection
		var dog_id = get_npc_id('dog');
		if (aff[dog_id] === undefined) { aff[dog_id] = 0; }
		aff[dog_id]--;
		aff[dog_id] = (aff[dog_id] < 0) ? 0 : aff[dog_id];

		// Increment waters if raining
		flags['yesterday_rain'] = 0;
		if ($('.rainy').hasClass('selected')) {
			flags['yesterday_rain'] = 1;
			if ([0, 5, 8].includes(route_id)) {
				if (get_month(vars['day']) == 0 && flags['potato_planted'] == 1) {
					vars['potato_waters']++;
				}
				if (get_month(vars['day']) == 1 && flags['corn_planted'] == 1) {
					vars['corn_waters']++;
				}
			}
			if (route_id == 8 && get_month(vars['day']) == 0 && flags['potato_planted_2'] == 1) {
				vars['potato_waters_2']++;
			}
			if (route_id == 7 && flags['cabbage_planted'] == 1) {
				vars['cabbage_waters']++;
			}
			if (route_id == 9 && flags['turnips_planted'] == 1) {
				vars['turnip_waters']++;
			}
		}
		if (vars['potato_waters'] == _POTATO_GROW_DAYS) {
			vars['potato_waters']++; // So it doesn't stay on 6 and add 9 potatoes every day
			vars['potatoes'] += 9;
		}
		if ($('.typhoon').hasClass('selected')) {
			flags['yesterday_rain'] = 1;

			// Typhoon Chicken Death
			if (vars['chickens'] > 0 && flags['chicken_outside'] == 1) {
				flags['chicken_funeral'] = 1;
			}
		}

		// Fix offset flags and vars
		vars['watering_can_fill'] = ((vars['watering_can_fill'] > 30) ? 30 : ((vars['watering_can_fill'] < 0) ? vars['watering_can_fill'] : 0));
		if (flags['old_mus_box'] < 0) { flags['old_mus_box'] = 0; }

		vars['day']++;

		// Increment chickens if one is born today
		// Remove day from list if before today
		if (vars['new_chicken_days'].length > 0) {
			if (parseInt(vars['new_chicken_days'].substring(0, 3)) < vars['day']) {
				vars['new_chicken_days'] = vars['new_chicken_days'].substring(3);
			}
			if (parseInt(vars['new_chicken_days'].substring(0, 3)) == vars['day']) {
				vars['chickens']++;
			}
		}

		// Increment cows if one is born today
		// Remove day from list if before today
		if (vars['new_cow_days'].length > 0) {
			if (parseInt(vars['new_cow_days'].substring(0, 3)) < vars['day']) {
				vars['new_cow_days'] = vars['new_cow_days'].substring(3);
			}
			if (parseInt(vars['new_cow_days'].substring(0, 3)) == vars['day']) {
				vars['cows']++;
			}
		}
	}

	if (flags['dontsave'] == 0) {
		// 0 = vars; 1 = flags; 2 = aff
		
		if (vars['corn_waters'] > 0 && get_month(vars['day']) != 1) {
			vars['corn_waters'] = 0;
		}
		
		for (var attr in vars) {
			save_slots[cur_slot][0][attr] = ((['new_chicken_days', 'new_cow_days'].includes(attr)) ? "" : 0);
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
	flags['dontsave'] = 0;

	// Clear Horse and Dog entries after race days
	if ([18, 89, 110].includes(get_day(vars['day']))) {
		flags['horse_entered'] = 0;
		flags['dog_entered'] = 0;
		flags['cow_entered'] = 0;
	}

	// Include chicks on "chickens_outside" at beginning of Fall
	// to end chicken cycling and leave one last egg
	if (vars['day'] == 61 && vars['new_chicken_days'].length > 0) {
		flags['chicken_outside'] = 0;
	}

	// Begin next day
	update_day_gui(vars['day'], jump);
	actions = get_actions(route_id, vars['day'], vars['gold'], flags['good_weather']);

	// Show or hide typhoon button
	$('.typhoon').show();
	if (get_month(vars['day']) != 1 || is_festival(vars['day'])) {
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

	// Set weather and update action HTML
	if (flags['good_weather'] == -1) {
		$(".typhoon").click();
	} else if (flags['good_weather'] == 0) {
		$(".rainy").click();
	} else {
		$(".sunny").click();
	}
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
	if ([0, 5].includes(route_id)) { // All Photos
		actions_all = {
			'3':[['f_dog_inside', 1], ['v_openers', 2]]
		}
	}
	if (route_id == 1) { // Elli marriage
		actions_all = {
			'23' : [[get_npc_id('elli'), 12], [get_npc_id('rick'), 2]],
			'91' : [[get_npc_id('elli'), 7], [get_npc_id('rick'), 10]]
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
	
	//console.log(a);
	
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
						if (!actions_today[a['cid']]) { actions_today[a['cid']] = 0; }
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
						if (['v_new_chicken_days', 'v_new_cow_days'].includes(a['cid'])) {
							var tmp_day = parseInt(a['val']);
							if (parseInt(a['val']) < 10) { tmp_day = "0" + tmp_day; }
							if (parseInt(a['val']) < 100) { tmp_day = "0" + tmp_day; }
							actions_today[a['cid']] = tmp_day;
							vars[a['cid'].substring(2)] += tmp_day;
						} else {
							if (!actions_today[a['cid']]) { actions_today[a['cid']] = 0; }
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
				if (!actions_today[a['cid']]) { actions_today[a['cid']] = 0; }
				actions_today[a['cid']] += a['val'];

				if (aff[a['cid']] === undefined) { aff[a['cid']] = 0; }
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
	var tmp_medals_needed = (([0, 5].includes(route_id)) ? 2000 : 500);
	a.push({'desc':('<div class="ml-3">NEED:&nbsp;&nbsp;<input type="number" id="b_need" onchange="calc_bets()" style="margin-right:20px" value="' + tmp_medals_needed +
			'" /></div>' + '<div class="ml-3">HAVE:&nbsp;&nbsp;<input type="number" id="b_have" onchange="calc_bets()" value="' + vars['medals'] + '" /></div>')});
	for (var i = 0; i < 6; i++) {
		a.push({'desc':'odds', 'b_table':true, 'b_id':i});
	}
	return a;
}

function new_game(rid = 0) {
	route_id = rid;
	reset_vars();
	vars['day'] = 3;
	document.title = route_names[rid] + " - HM64 Router";

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

	// Set affection of included characters to 0
	if ([0, 5].includes(rid)) {
		for (var i = 0; i < 38; i++) { aff[i] = 0; }
	} else {
		for (var i = 0; i < route_affs[rid].length; i++) {
			aff[get_npc_id(route_affs[rid][i])] = 0;
		}
	}

	// Characters listed based on route
	$("#status_row").html(set_affections(rid));

	// Custom skip options
	var html_list = [];
	html_list.push('<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Skip to</a>');
	html_list.push('<div class="dropdown-menu" aria-labelledby="navbarDropdown2">');
	if (rid < skip_to_list.length) {
		for (var i = 0; i < skip_to_list[rid].length; i++) {
			html_list.push('<span class="dropdown-item ' + get_month_name(skip_to_list[rid][i]).toLowerCase() +
				'" onclick="skip_to(' + skip_to_list[rid][i] +
				')">' + get_month_name(skip_to_list[rid][i], true) + ' ' + get_day(skip_to_list[rid][i]) +
				' (' + get_day_of_week(skip_to_list[rid][i], true).toUpperCase() + ')</span>');
		}
	}
	if (html_list.length > 2) {
		$('#skip_to_menu').html(html_list.join("") + '</div>');
	}

	// Custom flags for particular run
	if ([0, 5].includes(rid)) { // All Photos
		vars['openers'] = 0;
		flags['potato_planted'] = 0;
		flags['corn_planted'] = 0;
	}
	if (rid == 3) { // Popuri marriage
		flags['moondrops_bought'] = 0;
		flags['moondrops_planted'] = 0;
		vars['moondrop_waters'] = 0;
	}
	if (rid == 7) { // Maria Marriage
		vars['cabbages'] = 0;
		vars['cabbage_waters'] = 0;
		flags['cabbage_bought'] = 0;
		flags['cabbage_planted'] = 0;
	}
	if (rid == 8) { // Ann Photo
		flags['potato_planted'] = 0;
		vars['potato_waters_2'] = 0;
		flags['potato_planted_2'] = 0;
	}
	if (rid == 9) { // Karen Photo
		flags['turnips_planted'] = 0;
		vars['turnip_waters'] = 0;
		vars['r_sprite_aff'] = 0;
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

	$('.display_main.season').html(m.charAt(0).toUpperCase() + m.toLowerCase().substring(1));
	$('.display_main.day').html(get_day(d));
	$('.display_main.dow').html(get_day_of_week(d, true));
	$('.display_main.japanese').html(get_day_of_week(d, false, true));
	$('#happiness_meter').html(vars['happiness']);
	$('#disp_gold').val(vars['gold']);

	// Characters listed based on route
	// All Photos is currently the only one where the affections listed
	// 		at the top change during the run.
	if (route_id == 0 && d != 3) {
		$("#status_row").html(set_affections(route_id));
	}

	// Affections on top
	$('[id^="npc_"]').each(function() {
		var tmp_id = parseInt(this.id.substring(4));
		$(this).html(aff[tmp_id]);
		if (is_bachelorette(tmp_id)) {
			$(this).parent().css('background-color', get_heart_color(aff[tmp_id]));
		}
	});

	var html = "";
	//Seasonal Foragables
	var tmp_cs = [];
	for (var i = 0; i < crop_seasons[get_month(d)].length; i++) {
		tmp_cs.push(crop_seasons[get_month(d)][i]);
	}
	if (vars['potatoes'] > 0) { // Potatoes in Spring
		tmp_cs.push(crops.indexOf('potato'));
	}
	if (vars['corn_waters'] >= _CORN_GROW_DAYS && [1,2].includes(get_month(d))) { // Corn in Summer
		tmp_cs.push(crops.indexOf('corn'));
	}
	if (vars['chickens'] > 0) { // Eggs
		tmp_cs.push(crops.indexOf('egg'));
	}
	if (flags['fishing_rod_stored'] == 0) { //Fish
		var x = crops.indexOf('Fish S');
		tmp_cs = tmp_cs.concat([x, x + 1, x + 2]);
	}
	if (vars['cows'] > 0) { // Milk
		var x = crops.indexOf('milk s');
		tmp_cs = tmp_cs.concat([x, x + 1, x + 2]);
		if (flags['photo_cowfest'] == 1 || (flags['cow_entered'] == 1 && get_day(vars['day']) != 64)) {
			tmp_cs.push(x + 3);
		}
	}

	// Update Forage Inputs
	for (var i = 0; i < tmp_cs.length; i++) {
		html += '<div class="ml-3"><img class="forageDisp" id="img_for_' + tmp_cs[i] +
			'" src="/img/item/' + crops[tmp_cs[i]].toLowerCase().replace(" ", "_") + '.png" ' +
			'onclick="input_increment(this)" />&nbsp;';
		html += '<input style="width:40px" type="number" value="0" id="for_' + tmp_cs[i] + '" /></div>';
	}
	$('#forage_display').html(html);

	// Flag Display
	var flaglist = [];
	for (var attr in flags) {
		flaglist.push(attr);
	}
	// higher number "b" sorted lower than "a"
	flaglist.sort( function (a,b) {
			return ((a.includes('mus_box') || b.includes('mus_box')) ? (a.includes('mus_box') ? -1 : 1) : ((a > b) ? 1 : -1));
	});
	var val_html = '<div class="container">';
	for (var i = 0; i < flaglist.length; i++) {
		val_html += '<div class="d-flex flex-row"><div class="ml-4">' + flaglist[i].toLowerCase() + '</div><div class="ml-4"><input id="q_f_' + flaglist[i] + '" value="' + flags[flaglist[i]] + '" onchange="flag_update()" /></div></div>';
	}
	$("#all_values").html(val_html + "</div>");

	// Affection Display
	var afflist = [];
	for (var i = 0; i < npcs.length; i++) {
		afflist.push([aff[i], i]);
	}
	afflist.sort(function(a,b){
		return ((a[0] == undefined || b[0] == undefined) ? ((a[0] === undefined) ? 1 : -1) : b[0] - a[0]);
	});
	val_html = "";
	for (var i = 0; i < afflist.length; i++) {
		val_html += '<div class="d-flex flex-row"><div class="ml-4">' + npcs[afflist[i][1]].toLowerCase() + '</div><div class="ml-4"><input id="q_n_' + afflist[i][1] + '" value="' + afflist[i][0] + '" onchange="npc_update()" /></div></div>';
	}
	$("#all_affs").html(val_html + "</div>");

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
			vars[attr] = ((['new_chicken_days', 'new_cow_days'].includes(attr)) ? "" : 0);
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

function to_html(a = actions, show_red = true) {
	
	//console.log(a);
	
	var is_red = false;
	var cur_vis = true;
	var html = "";
	var lines = 0;
	var cur_div = null;
	var div_list = [];
	for (var i = 0; i < a.length; i++) {
		if (a[i]['sr'] !== true) {
			is_red = (a[i]['red'] === true);
			if (!is_red || show_red) {
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
				} else if (a[i]['red'] == true) {
					html += ' background-color:pink;';
				}
				html += '">';
			}
		}
		if (!is_red || show_red) {
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
					html += '<button class="btn" type="button" onclick="bet_winner(' + a[i]['b_id'] + ')" style="margin-left:5px; border:3px solid ' + bet_colors[a[i]['b_id']] + '" tabindex="-1">WINNER</button>';
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
					' action-button" id="ab_' + i + '" onclick="toggle_color(this, '+ "'" +
					((a[i]['div_tog'] == undefined) ? "" : a[i]['div_tog']) + "', " +
					get_toggle(a[i], a) + ')">' + a[i]['desc'] + '</button>';
				if (a[i]['sr']) {
					html += '</div>';
				}
			}
		}
	}
	html += ((html.length > 0) ? '</div><br/>' : '') + '<button type="button" class="btn btn-primary';
	if (flags['dontsave'] == 1) { html += ' dontsave'; }
	html += '" onclick="next_day()">' + (((flags['dontsave'] == 1) ? "DONT SAVE" : "Sleep") + '</button>');

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
					(!Array.isArray(abid["t" + i]) && a[j]['desc'].localeCompare(abid["t" + i]) == 0)) {
						tmp_res.push(j);
				}
			}
			if (!tmp_res.length) {
				console.log("WARNING: toggle added to action button, but id doesnt exist - (T" + i + " = " + abid["t" + i] + ' | desc = ' + abid['desc'] + ' | ' + get_npc_id(abid) + ')');
			}
		}
		result.push('[' + tmp_res.join(", ") + ']');
	}
	return result.join(", ");
}

function get_npc_img(img_id = null, for_title = false) {
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
		img_html = '<img class="forageDisp" ';
		if (for_title) {
			img_html += ' style="margin-right:5px" ';
		}
		img_html += 'src="/img/' + ((npcs[img_id].substring(0, 1) == "_") ? 'default' : ('npc/' + npcs[img_id].toLowerCase().replace(" ", "_"))) + '.png">';
		if (aff[img_id] !== undefined && !for_title) {
			img_html = '<span style="font-size:12px; margin-left:2px' +
			/*
			 * 
			 * TODO: change style of aff number next to img if >= 160 (photo min)
			 *
			 *	((aff[img_id] >= 160) ? ";background-color:lightgreen;" : "") +
			 * 
			*/
				'">' + aff[img_id] + '</span>' + img_html;
		}
	}
	return img_html;
}

function bet_winner(winner_id = 0) {
	vars['medals'] = parseInt($('#b_have').val());
	vars['medals'] += (parseInt($('#b_' + winner_id).val()) * parseInt($('#bg_' + winner_id).val()));
	$('#b_have').val(vars['medals']);
	gold_update();
}

function slow_calc(odds, buy_amt, recursive = false) {
	/*
	 * odds[
	 * 0 - odd
	 * 1 - original order
	 * 2 - need
	 * 3 - actual
	 * ]
	 */
	odds.sort(function(a,b) {
		return ((a[0] > b[0]) ? 1 : 0);
	});
	var sum = 0;
	for (var i = 0; i < odds.length; i++) {
		if (!recursive) {
			odds[i][3] = 0;
		}
		sum += (odds[odds.length - 1][0] / odds[i][0]);
	}

	var new_odds = [];
	var left_odds = [];
	var multiplier = buy_amt / sum;
	for (var i = 0; i < odds.length; i++) {
		//if (buy_amt > 0) { 26830 G = 536
			if (buy_amt <= odds.length) {
				if (buy_amt > 0) {
					odds[i][3]++;
					buy_amt--;
				}
			} else {
				var orig_val = odds[i][3];
				odds[i][3] += Math.floor((odds[odds.length - 1][0] / odds[i][0]) * multiplier);
				if (odds[i][3] > 99) { odds[i][3] = 99; }
				if (odds[i][3] > odds[i][2]) { odds[i][3] = odds[i][2]; }
				if ((odds[i][3] - orig_val) > buy_amt) {
					odds[i][3] = (orig_val + buy_amt);
					buy_amt = 0;
				} else {
					buy_amt -= (odds[i][3] - orig_val);
				}
			}
			if (odds[i][3] == odds[i][2] || odds[i][3] == 99 || odds[i][3] == orig_val || buy_amt == 0) {
				new_odds.push(odds[i]);
			} else {
				left_odds.push(odds[i]);
			}
		//}
	}

	if (left_odds.length > 0 && buy_amt > 0) {
		/*
		console.log('slow');

		console.log("new:");
		for (var v = 0; v < new_odds.length; v++) {
			console.log("[" + new_odds[v][0] + ", " + new_odds[v][1] + ", " + new_odds[v][2] + ", " + new_odds[v][3] + "]");
		}
		console.log("left:");
		for (var v = 0; v < left_odds.length; v++) {
			console.log("[" + left_odds[v][0] + ", " + left_odds[v][1] + ", " + left_odds[v][2] + ", " + left_odds[v][3] + "]");
		}
		*/
		
		return new_odds.concat(slow_calc(left_odds, buy_amt, true));
	} else {
		/*
		console.log('done');
		
		console.log("new:");
		for (var v = 0; v < new_odds.length; v++) {
			console.log("[" + new_odds[v][0] + ", " + new_odds[v][1] + ", " + new_odds[v][2] + ", " + new_odds[v][3] + "]");
		}
		console.log("left:");
		for (var v = 0; v < left_odds.length; v++) {
			console.log("[" + left_odds[v][0] + ", " + left_odds[v][1] + ", " + left_odds[v][2] + ", " + left_odds[v][3] + "]");
		}
		*/
		
		return new_odds.concat(left_odds);
	}
}

function calc_bets(bet_type = 1, use_leftover = false) {
	/*
	 * BET TYPES:
	 * 
	 * 1 - DEMO STRAT
	 * 2 - NILLOWS STRAT
	 * 3 - PHOTOS STRAT
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

	if (parseInt($("#b_have").val()) >= parseInt($('#b_need').val())) {
		$("input[id^='bg_']").each(function(i) {
			$(this).val(0);
		});
		return;
	}

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

	if ([0, 5].includes(route_id)) {
		// Photos
		odds = slow_calc(odds, buy_amt);
	} else {
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
		/*
		console.log(odds);
		
		if (use_leftover) {
			var tmp_arr = [];
			for (var b = 0; b < odds.length; b++) {
				
			}
		}
		*/
	}

	// Display values
	console.log("FINAL:");
	for (var i = 0; i < odds.length; i++) {
		console.log("[" + odds[i][0] + ", " + odds[i][1] + ", " + odds[i][2] + ", " + odds[i][3] + "]");
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
	
	//console.log(n);
	
	if (n.hasOwnProperty('desc')) {
		return (n.hasOwnProperty('cid') ? get_npc_id(n['cid']) : null);
	}
	if (npc_ids[n] !== undefined) { return npc_ids[n]; }
	if ((typeof n).localeCompare("string") === 0) {
		n = n.toLowerCase().replace("'", "").replace("_", " ").trim();
		for (var i = 0; i < npcs.length; i++) {
			if (n.localeCompare(npcs[i].toLowerCase().replace("'", "").replace("_", " ").trim()) === 0) {
				return i;
			}
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

function weather_change(update_gui = false) {
	if (update_gui) {
		update_day_gui();
	}
	var z = $('.weather.selected');
	actions = get_actions(route_id, vars['day'], vars['gold'], (z.hasClass('sunny') ? 1 : (z.hasClass('typhoon') ? -1 : 0)));
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
	if (d % 120 == 1) { return "New Years Day"; }
	if (d % 120 == 8) { return "Planting Festival"; }
	if (d % 120 == 17 || d % 120 == 88) { return "Horse Race"; }
	if (d % 120 == 23) { return "Flower Festival"; }
	if (d % 120 == 31) { return "Fireworks Festival"; }
	if (d % 120 == 39) { return "Vegetable Festival"; }
	if (d % 120 == 47) { return "Firefly Festival"; }
	if (d % 120 == 54) { return "Sea Festival"; }
	if (d % 120 == 64) { return "Cow Festival"; }
	if (d % 120 == 72) { return "Harvest Festival"; }
	if (d % 120 == 80) { return "Egg Festival"; }
	if (d % 120 == 100) { return "Thanksgiving"; }
	if (d % 120 == 109) { return "Dog Race"; }
	if (d % 120 == 114) { return "Starry Night"; }
	if (d % 120 == 117) { return "Spirit Festival"; }
	if (d % 120 == 120) { return "New Years Eve"; }
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
	// Accepts string or integer
	var bachs = ['elli', 'karen', 'ann', 'popuri', 'maria'];
	for (var i = 0; i < bachs.length; i++) {
		if (gid == get_npc_id(bachs[i]) || bachs[i].localeCompare(gid) == 0) {
			return true;
		}
	}
	return false;
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

function flag_update() {
	$("input[id^='q_f_']").each(function() {
		if (flags[this.id.substring(4)] !== undefined) {
			flags[this.id.substring(4)] = (isNaN(parseInt(this.value)) ? undefined : parseInt(this.value));
		}
	});
	weather_change();
}

function npc_update() {
	$("input[id^='q_n_']").each(function() {
		if (aff[this.id.substring(4)] !== undefined) {
			aff[this.id.substring(4)] = (isNaN(parseInt(this.value)) ? -1 : parseInt(this.value));
		}
	});
	weather_change();
}

function gold_update() {
	vars['gold'] = parseInt($('#disp_gold').val());
	weather_change();
}

function arr_to_str(arr = []) {
	return "[" + arr.join(", ") + "]";
}

function ats (arr = []) {
	return arr_to_str(arr);
}

function next_sunday(d = 3) {
	return d + (7 - (d % 7));
}

function set_affections (rid = 0) {
	if (rid > route_affs.length - 1 ) { rid = 0; }
	if (!vars['gold']) { vars['gold'] = 300; }

	var tmp_html = '<div class="p-1 display_main">GOLD: <input type="number" id="disp_gold" value="' + vars['gold'] + 
					'"  onchange="gold_update()" /></div>';
	var tx = route_affs[rid];
	if ([0, 5].includes(rid)) {
		var tmp_day = get_day(vars['day']);
		tx = [];

		if (flags['photo_maria'] == 0) { tx.push('maria'); }
		if (aff[get_npc_id('rick')] < _RICK_FIX_MIN) { tx.push('rick'); }
		if (flags['photo_elli'] == 0) { tx.push('elli'); }
		if (flags['wine_from_duke'] == 0 && aff[get_npc_id('bartender')] < _DUKE_WINE_MIN) { tx.push('bartender'); }
		if (tx.length < 4 && aff[get_npc_id('sprite')] < _SPRITE_WINE_MIN) { tx.push('sprite'); }
		if (tx.length < 4 && flags['photo_ann'] == 0) { tx.push('ann'); }
		if (tx.length < 4 && ((vars['day'] % 120) > 14) && ((vars['day'] % 120) < 63)) { tx.push('basil'); }
		if (tx.length < 4 && vars['day'] > 17) { tx.push('cliff'); }
		if (tx.length < 4) { tx.push('mayor'); }
		if (tx.length < 4) { tx.push('rick'); }
	}
	for (var i = 0; i < tx.length; i++) {
		tmp_html += '<div class="p-1 display_main">';
		//if ([0, 5].includes(rid)) { // All Photos
			tmp_html += get_npc_img(get_npc_id(tx[i]), true);
		//} else {
		//	tmp_html += npcs[get_npc_id(tx[i])].toUpperCase() + ': ';
		//}
		tmp_html += '<span id="npc_' + get_npc_id(tx[i]) + '">' + aff[tx[i]] + '</span></div>';
	}
	return tmp_html;
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

function cliff_maxed() {
	return (aff[get_npc_id('cliff')] >= (_PARTY_ATTEND_MIN - (8 - (flags['photo_swimming'] * 8)) - (8 - (flags['photo_harvest'] * 8))));
}

function basil_min(d) {
	var x = (_BASIL_BERRY_MIN - ((182 - d) * 6));
	return ((x > _BASIL_BERRY_MIN) ? _BASIL_BERRY_MIN : x);
}
