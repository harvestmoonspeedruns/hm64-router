$(document).ready(function() {
	reset_vars();
	new_game(1);
});

function get_actions_elli (d = vars['day'], g = vars['gold'], is_sunny = 1) {
	//Elli marriage
	
	var a = [];
	var skip = false;
	var elli_id = get_npc_id("elli");
	var rick_id = get_npc_id("rick");
	
	if (d < 32) {
		if (d == 3) {
			// First Day
			a.push({'desc':"Greet the Mayor", 'cid':get_npc_id("mayor")});
		} if (d % 120 == 23) {
			// Flower Festival
			a.push({'desc':"Flower Festival (Town Square)"})
			if (d == 23) {
				a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		} if (d == 31) {
			// Fireworks Fest
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
		// Full forage for Chicken etc.
		// on days where both Rick and Elli are available
		
		if (is_sunny && ["TUES", "THURS", "FRI"].includes(get_day_of_week(d, true)) && d != 39 && d != 54) {
			// 39=Veggie Fest; 54=Swim Fest
			
			if (forage(1500) !== null) {
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

	if (d > 58 && d < 90) {
		if (d == 72) {
			// Harvest Festival

			a.push({'desc':"Harvest Festival (Town Square)"})
			if (d == 23) {
				a.push({'desc':"Talk", 'cid':get_npc_id("rick"), 'val':2});
			}
			a.push({'desc':"Talk", 'cid':elli_id, 'val':2});
			a.push({'desc':"Dance", 'cid':elli_id, 'val':10, 'sr':true});
		} else if (is_sunny && ["MON", "TUES", "THURS", "FRI"].includes(get_day_of_week(d, true)) && 
					d != 64 && d != 80 && d != 84 && d != 28) {
				// Cow Fest, Egg Fest, Bridge Sunday, Horse Race

		 	if (forage(1500) !== null && flags['chickens'] < 1) {
		 		// Haven't bought a chicken and
				// don't have enough gold yet

				a.push(forage(1500));
				a.push({'desc':"Talk", 'cid':elli_id, 'val':1});
				a.push({'desc':"Gift - M/L Fish", 'cid':elli_id, 'val':3, 'sr':true});
				a.push({'desc':"Gift - Other", 'cid':elli_id, 'val':1, 'sr':true, 'sel':false});
				if (aff[get_npc_id('rick')] < 4) {
					a.push({'desc':"Meet", 'cid':rick_id, 'val':4});
				}
				a.push({'desc':"Talk", 'cid':rick_id, 'val':3, 'sr':(aff[get_npc_id('rick')] < 4)});
				a.push({'desc':"Gift", 'cid':rick_id, 'val':3, 'sr':true});
			} else {
				if (flags['new_chicken'] == 1) {
					a.push({'desc':"New Chk", 'cid':'f_new_chicken', 'val':-1});
				}
				if (flags['old_mus_box'] == 0) {
					a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
				}
				if (d > 62 && d < 88) {
					a.push({'desc':"Bridge Work", 'cid':['v_gold', 'v_bridge_days_worked'], 'val':[1000, 1]});
				}
				a.push({'desc':("Talk" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")), 'cid':elli_id, 'val':1});
				a.push({
					'desc':("Elli-egg" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")),
					'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
					'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]), 'sr':true
				});
				a.push({'desc':("Elli-gift" + ((get_day_of_week(d, true) == "MON") ? " (MTN)" : "")), 'cid':elli_id, 'val':1, 'sr':true});
				a.push({'desc':'Talk', 'cid':rick_id, 'val':3});
				//TODO: fix musbox / give gift
			}
		}
	}

	if (d == 90) { //Fall 30 SAT
		a.push({'desc':"Accept Cows", 'cid':"f_borrow_cows", 'val':1});
		if (flags['new_chick'] == 0) {
			a.push({'desc':"Incubate", 'cid':'f_new_chick', 'val':-3});
		}
		if (flags['old_mus_box'] == 0 && is_sunny) {
			a.push({'desc':"Music Box", 'cid':'f_old_mus_box', 'val':1});
		}
		a.push({'desc':"Sell Chicken", 'cid':'v_gold', 'val':500});
		a.push({'desc':"Talk", 'cid':elli_id, 'val':1});
		a.push({
			'desc':"Elli-egg", 'cid':((flags['recipe_elli'] == 1) ? elli_id : [elli_id, "f_recipe_elli"]),
			'val':((flags['recipe_elli'] == 1) ? 6 : [4, 1]), 'sr':true
		});
		a.push({'desc':"Elli-gift", 'cid':elli_id, 'val':1, 'sr':true});
		if (is_sunny) {
			a.push({'desc':'Talk', 'cid':rick_id, 'val':3, 'sel':false});
			//TODO: fix musbox?
		}
	}
	
	//TODO
	
	if (d == 109) {
		// Dog Race
		a.push(betting_table());
		a.push({'desc':"Win 500 Lumber at Dog Race", 'cid':"v_lumber", 'val':500});
	}
	
	return a;
}

function next_day() {
	// Increment day variables and calculate new

	// Update variables
	for (var i = 0; i < actions.length; i++) {
		if ($("#ab_" + i).length != 0) {
			//element exists
			if ($("#ab_" + i).hasClass("btn-success")) {
				//element green
				if (!Number.isInteger(actions[i]['cid']) && actions[i]['cid'].includes("_")) {
					var vf_name = actions[i]['cid'].split("_");
					if (vf_name[0].toLowerCase() == 'f') {
						//flag change
						if (flags[vf_name[1]] === undefined) {
							console.log("undefined flag: " + actions[i]['cid']);
						} else {
							flags[vf_name[1]] += actions[i]['val'];
						}
					} else {
						//var change
						if (vars[vf_name[1]] === undefined) {
							console.log("undefined var: " + actions[i]['cid']);
						} else {
							vars[vf_name[1]] += actions[i]['val'];
						}
					}
				} else {
					if (aff[actions[i]['cid']] === undefined) {
						aff[actions[i]['cid']] = 0;
					}
					aff[actions[i]['cid']] += actions[i]['val'];
				}
			}
		}
	}
	
	// Calculate G from sold items
	$("input[id^='for']").each(function(index) {
		vars['gold'] += (this.value * crop_prices[this.id.split("_")[1]]);
	});
	
	// Affection from 4 days bridge work
	if (vars['day'] == 87) {
		if (flags['bridge_days_worked'] == 4) {
			if (route_id == 1) { // Elli Mar
				aff[rick_id] += 3;
				aff[elli_id] += 3;
			}
		}
	}
	
	// Increment chicken age counters
	if (flags['new_chicken'] > 1) { flags['new_chicken']--; }
	if (flags['new_chick'] > 1) { flags['new_chick']--; }
	
	// Begin next day
	update_day_gui(++vars['day']);
	actions = get_actions_elli(vars['day'], vars['gold'], 1);
	
	// Show or hide typhoon button
	$('.typhoon').show();
	if (get_month(vars['day']) != 1 || is_festival(vars['day'], false)) {
		$('.typhoon').hide();
	}
	
	// Set forage values for next day
	for (var i = 0; i < actions.length; i++) {
		if (actions[i]['forage']) {
			for (var j = 0; j < actions[i]['forage_list'].length; j++) {
				$("#for_" + actions[i]['forage_list'][j][0]).val(actions[i]['forage_list'][j][1]);
			}
		}
	}
	$(".sunny").click();
	$('#hm64-content').html(to_html(actions));
}

function betting_table() {
	//TODO
	
	return { 'desc':'TODO' };
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
		} else if (f_amt <= 390) {
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('walnut'), 3], [get_crop_id('clover'), 2], [get_crop_id('mango'), 1]];
			d = 'ed/wal, wal, cave all, mango, pond wal';
		} else { //Full Forage
			forage_list = [[get_crop_id('edible'), 2], [get_crop_id('walnut'), 3], [get_crop_id('clover'), 3], [get_crop_id('mango'), 1]];
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

function fish() {
	return { 'desc':'Fish', 'forage':true, forage_list:[[get_crop_id('fish s'), 0], [get_crop_id('fish m'), 0], [get_crop_id('fish l'), 0]] };
}

function new_game(id = null) {
	if (id == null) {
	  id = $('#ngid').val();
	}
	route_id = id;
	reset_vars();
	vars['day'] = 2;

	var aff_chars = [];
	if (id == 1) {
		aff_chars = ['elli', 'rick'];
	}
	
	for (let key in aff_chars) {
		aff[get_npc_id(aff_chars[key])] = 0;
	}
	
	next_day();
}

function update_day_gui(d = vars['day']) {
	var m = get_month_name(d);
	if (d % 30 == 1) {
		//Only update "month" on the first of the month
		$('.display_main.season').removeClass('spring').removeClass('summer').removeClass('fall').removeClass('winter').addClass(m.toLowerCase());
	}
	$('.display_main.season').html(m.charAt(0).toUpperCase() + m.toLowerCase().substr(1));
	$('.display_main.day').html(get_day(d));
	$('.display_main.dow').html(get_day_of_week(d, true));
	$('#disp_gold').html(vars['gold']);
	for (let key in aff) {
		$("#npc_" + key).html(aff[key]);
		if (is_bachelorette(key)) {
			$("#npc_" + key).parent().css('background-color', get_heart_color(aff[key]));
		}
	}

	var html = "";
	//Seasonal Foragables
	for (var i = 0; i < crop_seasons[get_month(d)].length; i++) {
		html += '<div class="ml-3">' + crops[crop_seasons[get_month(d)][i]] + ': ';
		html += '<input style="width:40px" type="number" value="0" id="for_' + crop_seasons[get_month(d)][i] + '" /></div>';
	}
	
	//Fish
	for (var i = 13; i < 16; i++) {
		html += '<div class="ml-3">' + crops[i] + ': ';
		html += '<input style="width:40px" type="number" value="0" id="for_' + i + '" /></div>';
	}
	$('#forage_display').html(html);
}

function reset_vars() {
	vars = { "chickens":0, "gold":300, "lumber":0, "day":3 }
	aff = {};
	reset_flags();
}

function reset_flags() {
	flags = {"treasure_map" : 0, "new_mus_box" : 0, "old_mus_box" : 0,
			"new_chick" : 0, "new_chicken" : 0,
			"ankle_elli" : 0, "dream_elli" : 0, "sick_elli" : 0,
			"kitchen" : null, "blue_feather" : 0, "propose" : 0,
			"borrow_cows" : null };
}

function to_html(a = actions) {
	var html = "";
	for (var i = 0; i < a.length; i++) {
		if (!a[i]['sr']) {
			if (i != 0) { html += "</div>"; }
			html += '<div class="d-flex justify-content-start" style="margin-bottom:5px">';
		}
		if (a[i]['val'] === undefined) {
			html += '<span>' + a[i]["desc"] + '</span>';
		} else {
			if (a[i]['sr']) {
				html += '<div class="ml-3">';
			} else {
				html += '<span class="mr-2">' + npcs[a[i]['cid']] + '</span>';
			}
			html += '<button type="button" class="btn btn-' + ((a[i]["sel"] === false) ? 'danger' : 'success');
			html += ' action-button" id="ab_' + i + '" onclick="toggle_color(this)">' + a[i]['desc'] + '</button>';
			if (a[i]['sr']) {
				html += '</div>';
			}
		}
	}
	return html + ((html.length > 0) ? '</div><br/>' : '') + '<button type="button" class="btn btn-primary" onclick="next_day()">Sleep</button>';
}

function toggle_color(t, toggle_id = null) {
	if ($(t).hasClass("btn-danger")) {
		$(t).removeClass("btn-danger").addClass("btn-success");
	} else {
		$(t).addClass("btn-danger").removeClass("btn-success");
	}
	if (toggle_id != null) {
		if ($.isArray(toggle_id)) {
			for(var i = 0; i < toggle_id.length; i++) {
				toggle_color($("#ab_" + toggle_id[i].replace("ab_", "")));
			}
		} else { toggle_color($("#ab_" + toggle_id[i].replace("ab_", ""))); }
	}
}

function get_npc_id(n = null) {
	if (!n) { return null; }
	for (var i = 0; i < npcs.length; i++) {
		if (n.toLowerCase().replace("'", "").localeCompare(npcs[i].toLowerCase()) === 0) {
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

function weather_change() {
	update_day_gui();
	var z = $('.weather.selected');
	actions = (z.hasClass('typhoon')) ? [] : get_actions_elli(vars['day'], vars['gold'], (z.hasClass('sunny')));
	
	//Set forage values for next day
	for (var i = 0; i < actions.length; i++) {
		if (actions[i]['forage']) {
			for (var j = 0; j < actions[i]['forage_list'].length; j++) {
				$("#for_" + actions[i]['forage_list'][j][0]).val(actions[i]['forage_list'][j][1]);
			}
		}
	}
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

function get_heart_color(num = 0) {
	if (num > 219) { return 'lightblue'; }
	if (num > 207) { return 'pink'; }
	if (num > 155) { return 'yellow'; }
	if (num > 103) { return 'green'; }
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

function get_month_name (num = null) {
	if (num === null) { return null; }
	return month_names[get_month(num)];
}

function get_day_of_week (num = null, short_name = false) {
	if (num === null) { return null; }
	return day_names[num % 7 + (short_name ? 7 : 0)];
}

function get_day (num = null) {
	if (num === null) { return null; }
	if (num < 3) { return 0; }
	return (num % 30 == 0) ? 30 : num % 30;
}
