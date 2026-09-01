function defMaps(){
GD['pro_vil']={name:'Ashhaven Village - Prologue',map:[
'4444444444444444444444444444444444444444',
'4444411114444411144444444444444444444444',
'4441100011441111114444441111111144444444',
'441100000111100011444441000000144444444',
'441000000000000001111441005500144444444',
'441005500000000000001110055001444444444',
'441005533333335500014410000014444444444',
'441000003550300000014410055001444444444',
'441100003550300000014410055001444444444',
'444100055555555000144111111111444444444',
'444100055555555000144444111144444444444',
'444111111111111111144444441444444444444',
'444444410000014444444444111111444444444',
'444411110011111444444111000011144444444',
'441110000000011144411100000001144444444',
'441000000110000114110000000001144444444',
'441000001331000011000000000001144444444',
'441000001001000001000000000000144444444',
'444111111111111111111111111111144444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444'],
npcs:[
{id:'elder',nm:'Elder Gorn',em:'👴',x:7,y:7,faction:'village'},
{id:'merchant',nm:'Merchant Rill',em:'🧳',x:14,y:7,faction:'village'},
{id:'child',nm:'Little Ara',em:'👦',x:10,y:16,faction:'village'},
{id:'drunk',nm:'Drunkard Helk',em:'🍺',x:17,y:16,faction:'village'},
{id:'mira',nm:'Grandma Mira',em:'👵',x:11,y:17,faction:'village'},
{id:'smith',nm:'Blacksmith Gron',em:'🔨',x:14,y:9,faction:'village'},
{id:'guard',nm:'Guard Tor',em:'💂',x:19,y:11,faction:'village'}],
objs:[
{id:'burn1',em:'🏚️',x:5,y:6,nm:'Burned House',tp:'invest',evid:'burned_house'},
{id:'burn2',em:'🏚️',x:5,y:7,nm:'Destroyed Shop',tp:'invest',evid:'destroyed_shop'},
{id:'arrows',em:'📌',x:12,y:15,nm:'Pile of Arrows',tp:'invest',evid:'human_arrows'},
{id:'tracks',em:'🐾',x:16,y:13,nm:'Wolf Tracks',tp:'invest',evid:'wolf_tracks'},
{id:'oil',em:'🛢️',x:13,y:14,nm:'Oil Barrel',tp:'invest',evid:'oil_barrel'},
{id:'crest',em:'👑',x:15,y:16,nm:'Royal Crest',tp:'invest',evid:'royal_crest'},
{id:'sign1',em:'🪧',x:11,y:12,nm:'Village Sign',tp:'sign',text:'Ashhaven - Population: Unknown'},
{id:'chest1',em:'📦',x:21,y:17,nm:'Old Chest',tp:'chest',item:{id:'hpotion',nm:'Health Potion',icon:'❤️',desc:'Restores 30 HP'}},
{id:'well1',em:'💧',x:12,y:14,nm:'Village Well',tp:'sign',text:'The well is deep. Something glints at the bottom.'},{id:'board1',em:'📋',x:18,y:10,nm:'Bounty Board',tp:'board'},{id:'anvil1',em:'⚒️',x:15,y:10,nm:'Village Anvil',tp:'anvil'},{id:'inn1',em:'🛏️',x:9,y:10,nm:'Village Inn',tp:'inn'}],
enemies:[
{nm:'Wounded Wolf',sp:'🐺',hp:40,at:8,df:2,sp2:6,xp:15,gld:5,atk:[{nm:'Bite',pw:10},{nm:'Lunge',pw:12}]},
{nm:'Wild Boar',sp:'🐗',hp:55,at:12,df:5,sp2:4,xp:20,gld:8,atk:[{nm:'Charge',pw:14},{nm:'Tusks',pw:10}]}],
re:[{nm:'Wounded Wolf',sp:'🐺',hp:40,at:8,df:2,sp2:6,xp:15,gld:5,atk:[{nm:'Bite',pw:10},{nm:'Lunge',pw:12}]},{nm:'Wild Boar',sp:'🐗',hp:55,at:12,df:5,sp2:4,xp:20,gld:8,atk:[{nm:'Charge',pw:14},{nm:'Tusks',pw:10}]}],
conn:[{x:3,y:18,r:'pro',m:'for',tx:20,ty:1}]};

GD['pro_for']={name:'Dark Forest Path',map:[
'4444444444444444444444444444444444444444',
'4444444441111111111111444444444444444444',
'4444444110000000000011144444444444444444',
'4444441000000000000001144444444444444444',
'4444410004444440000001114444444444444444',
'4444100044444444400000114444444444444444',
'4444100444444444444000111444444444444444',
'4441004444111144444001144444444444444444',
'4441004441111114440011444444444444444444',
'4410004411000011400114444444444444444444',
'4410004110000011400114444444444444444444',
'4100004100000011001144444444444444444444',
'4100001100000011001144444444444444444444',
'4100001000000001011444444444444444444444',
'4100011000000001114444444444444444444444',
'4100010000000000114444444444444444444444',
'4100110000000001144444444444444444444444',
'4100100000000001144444444444444444444444',
'4111100000000011444444444444444444444444',
'4411100000000114444444444444444444444444',
'4441100000001144444444444444444444444444',
'4444110000011444444444444444444444444444',
'4444411100114444444444444444444444444444',
'4444441111144444444444444444444444444444',
'4444444444444444444444444444444444444444'],
npcs:[
{id:'ghost',nm:'Lost Spirit',em:'👻',x:9,y:10},
{id:'hermit',nm:'Hermit John',em:'🧙',x:7,y:12}],
objs:[
{id:'banner',em:'🚩',x:11,y:8,nm:'Torn Banner',tp:'invest',evid:'torn_banner'},
{id:'camp',em:'🔥',x:13,y:11,nm:'Cold Campfire',tp:'invest',evid:'old_campfire'},
{id:'stone',em:'🗿',x:9,y:14,nm:'Carved Stone',tp:'invest',evid:'carved_stone'}],
enemies:[
{nm:'Shadow Wolf',sp:'🐺',hp:65,at:14,df:4,sp2:9,xp:25,gld:12,tw:true,atk:[{nm:'Shadow Bite',pw:16},{nm:'Howl',pw:8,mg:1}],ev:{id:'shadow_essence',t:'Shadow Wolf Essence',d:'Dark energy from the Shadow Wolf.',s:'Combat'}},
{nm:'Forest Spider',sp:'🕷️',hp:45,at:12,df:2,sp2:11,xp:18,gld:7,pz:45,atk:[{nm:'Bite',pw:13},{nm:'Web Shot',pw:6,mg:1}]}],
re:[{nm:'Shadow Wolf',sp:'🐺',hp:65,at:14,df:4,sp2:9,xp:25,gld:12,atk:[{nm:'Shadow Bite',pw:16}]},{nm:'Forest Spider',sp:'🕷️',hp:45,at:12,df:2,sp2:11,xp:18,gld:7,pz:45,atk:[{nm:'Bite',pw:13}]}],
conn:[{x:20,y:23,r:'pro',m:'vil',tx:3,ty:17},{x:1,y:12,r:'r1',m:'gf',tx:38,ty:12}]};

GD['r1_gf']={name:'Greenfall Village',map:[
'0000000000000000000000000000000000000000',
'0000111111111111000000000000000000000000',
'0001100000000011000000000000000000000000',
'0011000000000011000000000000000000000000',
'0010000055500001100000000000000000000000',
'0010000055500000110000000000000000000000',
'0110000003330000011000000000000000000000',
'0100000000300000011000000000000000000000',
'0100000000000000110000000000000000000000',
'0100000111111101100000000000000000000000',
'0100000111111111000000000000000000000000',
'0100550000000000111111111000000000000000',
'1111111111111111111111111111111111111111',
'0100000000000000110000000000000100000000',
'0110000000000001100000000000000100000000',
'0011000555550011000000000000001100000000',
'0001100555550110000000000000001000000000',
'0000110033301100000000000000001000000000',
'0000011003011000000000000000011000000000',
'0000001111110000000000000000001100000000',
'0000000000000000000000000000000110000000',
'0000000000000000000000000000000011000000',
'0000000000000000000000000000000001100000',
'0000000000000000000000000000000000110000',
'0000000000000000000000000000000000001100'],
npcs:[
{id:'gfarmer',nm:'Farmer Ollie',em:'👨‍🌾',x:5,y:5},
{id:'ghunter',nm:'Hunter Kara',em:'🏹',x:21,y:9},
{id:'gchild',nm:'Little Lin',em:'👦',x:14,y:15},
{id:'gpriest',nm:'Priest Ada',em:'⛪',x:5,y:16},
{id:'gmerch',nm:'Merchant Vel',em:'🧳',x:21,y:16}],
objs:[
{id:'gpedestal',em:'🌳',x:5,y:4,nm:'Empty Pedestal',tp:'invest',evid:'empty_pedestal'},
{id:'groots',em:'🌿',x:6,y:5,nm:'Torn Roots',tp:'invest',evid:'torn_roots'},
{id:'gchest',em:'📦',x:22,y:17,nm:'Sealed Chest',tp:'chest',item:{id:'akey',nm:'Ancient Key',icon:'🔑',desc:'A key from ancient times.'}},
{id:'gsign',em:'🪧',x:11,y:12,nm:'Sign',tp:'sign',text:'Greenfall - Where Life Begins.'},
{id:'gwell',em:'💧',x:15,y:16,nm:'Spirit Well',tp:'sign',text:'The water glows faintly green.'}],
enemies:[
{nm:'Root Crawler',sp:'🐛',hp:70,at:15,df:8,sp2:5,xp:30,gld:15,tw:true,atk:[{nm:'Root Slam',pw:17}]},
{nm:'Hollow Treant',sp:'🌲',hp:120,at:20,df:15,sp2:2,xp:50,gld:25,atk:[{nm:'Stomp',pw:22}]}],
re:[{nm:'Root Crawler',sp:'🐛',hp:70,at:15,df:8,sp2:5,xp:30,gld:15,atk:[{nm:'Root Slam',pw:17}]}],
conn:[{x:39,y:12,r:'pro',m:'for',tx:2,ty:12},{x:0,y:12,r:'r1',m:'gfc',tx:11,ty:12}]};

GD['r1_gfc']={name:'Ancient Church',map:[
'3333333333333333333333333333333333333333',
'3333333333311111333333333333333333333333',
'3333333311555551133333333333333333333333',
'3333333311555551133333333333333333333333',
'3333333115555511333333333333333333333333',
'3333333155555511333333333333333333333333',
'3333333152222511333333333333333333333333',
'3333333155555513333333333333333333333333',
'3333333155555513333333333333333333333333',
'3333333111111133333333333333333333333333',
'3333333331111333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333',
'3333333331113333333333333333333333333333'],
npcs:[
{id:'ghostprior',nm:'Ghost of Prior',em:'👻',x:16,y:7},
{id:'snova',nm:'Sister Nova',em:'✨',x:16,y:5}],
objs:[
{id:'altara',em:'⛪',x:16,y:6,nm:'Ancient Altar',tp:'invest',evid:'ancient_altar'},
{id:'diary',em:'📖',x:17,y:8,nm:"Founder's Diary",tp:'invest',evid:'founders_diary'},
{id:'bloodstain',em:'🔴',x:15,y:7,nm:'Old Blood Stain',tp:'invest',evid:'church_blood'},
{id:'dungeon',em:'🕳️',x:16,y:8,nm:'Hidden Passage',tp:'stairs',tr:'r1_gfd',tx:14,ty:3}],
enemies:[
{nm:'Root Beast',sp:'🐉',hp:200,at:25,df:12,sp2:6,xp:80,gld:50,boss:true,tw:true,ill:true,mask:6,tw2:'A tame creature bound by a lie - not the wild beast the story claimed.',atk:[{nm:'Root Eruption',pw:28},{nm:'Nature Wrath',pw:22,mg:1}],ev:{id:'heart_seed',t:'Heart Seed Fragment',d:'The true Heart Seed, hidden under the altar.',s:'Boss'}}],
re:[],
conn:[{x:11,y:12,r:'r1',m:'gf',tx:1,ty:12}]};

GD['r1_gfd']={name:'Root Caverns',map:[
'333333333333333333333333333333',
'333333333331111133333333333333',
'333333331155555113333333333333',
'333333115555555113333333333333',
'333311000000000113333333333333',
'333110000000000013333333333333',
'333100000000000011333333333333',
'333100000222000013333333333333',
'333100000222000011111111333333',
'333100000222000000000011333333',
'333100000000000000000013333333',
'333110000000000000000113333333',
'33331100000000000000113333333',
'33333111000000000011133333333',
'33333311111111111113333333333',
'33333333333113333333333333333',
'33333333333113333333333333333',
'33333333333113333333333333333',
'33333333333113333333333333333',
'33333333333113333333333333333'],
npcs:[
{id:'miner',nm:'Trapped Miner',em:'😢',x:14,y:6}],
objs:[
{id:'crystal',em:'💎',x:7,y:8,nm:'Life Crystal',tp:'invest',evid:'life_crystal'},
{id:'rootmass',em:'🌿',x:19,y:9,nm:'Massive Root',tp:'invest',evid:'massive_root'},
{id:'dchest',em:'📦',x:24,y:9,nm:'Ancient Chest',tp:'chest',item:{id:'rarmor',nm:'Root Armor',icon:'🛡️',desc:'Armor made of living roots. +5 DEF.'}},
{id:'ladder',em:'🪜',x:14,y:3,nm:'Ladder Up',tp:'stairs',tr:'r1_gfc',tx:16,ty:9}],
enemies:[
{nm:'Root Worm',sp:'🪱',hp:80,at:16,df:6,sp2:4,xp:30,gld:18,atk:[{nm:'Constrict',pw:18}]},
{nm:'Crystal Golem',sp:'🗿',hp:150,at:22,df:20,sp2:2,xp:60,gld:35,tw:true,atk:[{nm:'Crystal Slam',pw:25}]}],
re:[{nm:'Root Worm',sp:'🪱',hp:80,at:16,df:6,sp2:4,xp:30,gld:18,atk:[{nm:'Constrict',pw:18}]}],
conn:[{x:12,y:19,r:'r1',m:'gfc',tx:14,ty:8}]};

GD['r2_bw']={name:'Blackwood Forest',map:[
'4444444444444444444444444444444444444444',
'4441111114444444444444444444444444444444',
'4411000111444444444444444444444444444444',
'4110000001144444444444444444444444444444',
'4100000000114444444444444444444444444444',
'4100000000011444444444444444444444444444',
'4100005500011444444444444444444444444444',
'4100005500011444444444444444444444444444',
'4100000000011444444444444444444444444444',
'4110000000111444444444444444444444444444',
'4411000001144444444444444444444444444444',
'4441111111444444444444444444444444444444',
'4444441144444444444444444444444444444444',
'4444411011444444444444444444444444444444',
'4444110001144444444444444444444444444444',
'4444100000114444444444444444444444444444',
'4441100000011444444444444444444444444444',
'4441000000001444444444444444444444444444',
'4441000000001444444444444444444444444444',
'4441111111111444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444',
'4444444444444444444444444444444444444444'],
npcs:[
{id:'herb',nm:'Herbalist Mora',em:'🧙',x:7,y:6},
{id:'bchild',nm:'Whispering Child',em:'👦',x:9,y:15},
{id:'bhunt',nm:'Hunter Grizz',em:'🏹',x:6,y:17},
{id:'bspirit',nm:'Forest Spirit',em:'✨',x:8,y:7},
{id:'bsurv',nm:'Lost Survivor',em:'🥺',x:11,y:14}],
objs:[
{id:'bcabin',em:'🏚️',x:7,y:5,nm:'Empty Cabin',tp:'invest',evid:'empty_cabin'},
{id:'bbones',em:'💀',x:9,y:7,nm:'Animal Bones',tp:'invest',evid:'animal_bones'},
{id:'bherbs',em:'🌿',x:5,y:8,nm:'Healing Herbs',tp:'invest',evid:'healing_herbs'},
{id:'bdrawing',em:'🎨',x:10,y:13,nm:'Child Drawing',tp:'invest',evid:'child_drawing'},
{id:'bgrave',em:'🪦',x:7,y:15,nm:'Unmarked Grave',tp:'invest',evid:'unmarked_grave'}],
enemies:[
{nm:'Shadow Stalker',sp:'👻',hp:100,at:18,df:6,sp2:12,xp:40,gld:20,tw:true,atk:[{nm:'Shadow Slash',pw:20}]},
{nm:'Mist Phantom',sp:'🌫️',hp:60,at:22,df:2,sp2:15,xp:35,gld:15,atk:[{nm:'Chill Touch',pw:18,mg:1}]}],
re:[{nm:'Shadow Stalker',sp:'👻',hp:100,at:18,df:6,sp2:12,xp:40,gld:20,atk:[{nm:'Shadow Slash',pw:20}]}],
conn:[{x:10,y:19,r:'r1',m:'gf',tx:10,ty:1}]};

GD['r3_fr']={name:'Frostholm - Ice Capital',map:[
'2020202020202020202020202020202020202020',
'0201111111111110202020202020202020202020',
'2021000000000110202020202020202020202020',
'0210000000000110202020202020202020202020',
'2010005555500110202020202020202020202020',
'0210005555500110202020202020202020202020',
'2010003333300110202020202020202020202020',
'0210000330000110202020202020202020202020',
'2010000000001102020202020202020202020202',
'0211000000011020202020202020202020202020',
'2021111111110202020202020202020202020202',
'0202110000012020202020202020202020202020',
'2020100000012020202020202020202020202020',
'0221000555012020202020202020202020202020',
'2001000555010202020202020202020202020202',
'0221000333010202020202020202020202020202',
'2001000000001020202020202020202020202020',
'0201100000011202020202020202020202020202',
'2020111111110202020202020202020202020202',
'0202020202020202020202020202020202020202',
'2020202020202020202020202020202020202020',
'0202020202020202020202020202020202020202',
'2020202020202020202020202020202020202020',
'0202020202020202020202020202020202020202',
'2020202020202020202020202020202020202020'],
npcs:[
{id:'fkhnight',nm:'Knight Aldric',em:'⚔️',x:7,y:5},
{id:'fchef',nm:'Chef Brun',em:'👨‍🍳',x:7,y:13},
{id:'fmaid',nm:'Maid Lise',em:'👧',x:8,y:14},
{id:'fguard',nm:'Captain Voss',em:'💂',x:9,y:11},
{id:'fscholar',nm:'Scholar Emma',em:'📚',x:7,y:15}],
objs:[
{id:'fthrone',em:'👑',x:7,y:3,nm:'Empty Throne',tp:'invest',evid:'empty_throne'},
{id:'fletter',em:'✉️',x:8,y:3,nm:'Letter on Throne',tp:'invest',evid:'throne_letter'},
{id:'ffrozen',em:'❄️',x:6,y:5,nm:'Frozen Flowers',tp:'invest',evid:'frozen_flowers'}],
enemies:[
{nm:'Frost Specter',sp:'❄️',hp:120,at:20,df:8,sp2:10,xp:45,gld:25,atk:[{nm:'Ice Lance',pw:22}]},
{nm:'Glacial Golem',sp:'🧊',hp:180,at:24,df:18,sp2:3,xp:60,gld:35,atk:[{nm:'Ice Slam',pw:26}]}],
re:[{nm:'Frost Specter',sp:'❄️',hp:120,at:20,df:8,sp2:10,xp:45,gld:25,atk:[{nm:'Ice Lance',pw:22}]}],
conn:[{x:9,y:19,r:'r1',m:'gf',tx:10,ty:1}]};

GD['r4_sol']={name:'Sol Desert - Sand Bazaar',map:[
'1919191919191919191919191919191919191919',
'9191111111111111919191919191919191919191',
'1911000000000119191919191919191919191919',
'9191000000000119191919191919191919191919',
'1910000555500119191919191919191919191919',
'9191000555500119191919191919191919191919',
'1910000333300119191919191919191919191919',
'9191000033000119191919191919191919191919',
'1910000000001191919191919191919191919191',
'9191100000011919191919191919191919191919',
'1919111111119191919191919191919191919191',
'9191910001191919191919191919191919191919',
'1919100001191919191919191919191919191919',
'9191000550119191919191919191919191919191',
'1919100055019191919191919191919191919191',
'9191000330119191919191919191919191919191',
'1919100000019191919191919191919191919191',
'9191110000119191919191919191919191919191',
'1919191111919191919191919191919191919191',
'9191919191919191919191919191919191919191',
'1919191919191919191919191919191919191919',
'9191919191919191919191919191919191919191',
'1919191919191919191919191919191919191919',
'9191919191919191919191919191919191919191',
'1919191919191919191919191919191919191919'],
npcs:[
{id:'smerch',nm:'Merchant Zara',em:'🧳',x:7,y:5},
{id:'sinform',nm:'Shadow Informant',em:'🗡️',x:6,y:13},
{id:'sguard',nm:'Desert Captain',em:'💂',x:9,y:11},
{id:'swit1',nm:'Witness Asha',em:'👩',x:7,y:14},
{id:'svizier',nm:'Vizier Malchior',em:'🎩',x:7,y:7}],
objs:[
{id:'scrime',em:'🔴',x:8,y:6,nm:'Crime Scene',tp:'invest',evid:'sultan_crime'},
{id:'sshadow',em:'🌅',x:9,y:5,nm:'Shadow Position',tp:'invest',evid:'sunset_shadow'},
{id:'sdagger',em:'🗡️',x:8,y:7,nm:'Bloody Dagger',tp:'invest',evid:'bloody_dagger'},
{id:'sletter',em:'✉️',x:6,y:6,nm:'Torn Letter',tp:'invest',evid:'torn_letter'}],
enemies:[
{nm:'Sand Scorpion',sp:'🦂',hp:90,at:18,df:12,sp2:8,xp:35,gld:20,pz:40,atk:[{nm:'Stinger',pw:20}]},
{nm:'Desert Bandit',sp:'🗡️',hp:80,at:22,df:6,sp2:11,xp:30,gld:25,atk:[{nm:'Backstab',pw:24}]}],
re:[{nm:'Sand Scorpion',sp:'🦂',hp:90,at:18,df:12,sp2:8,xp:35,gld:20,pz:40,atk:[{nm:'Stinger',pw:20}]}],
conn:[{x:9,y:19,r:'r3',m:'fr',tx:9,ty:1}]};

GD['r5_cr']={name:'Crimson Sea - Pirate Port',map:[
'2222222222222222222222222222222222222222',
'2222999999999922222222222222222222222222',
'2229111111111922222222222222222222222222',
'2291100000011922222222222222222222222222',
'2291005555019222222222222222222222222222',
'2291005555019222222222222222222222222222',
'2291003333019222222222222222222222222222',
'2291000000019222222222222222222222222222',
'2291000000019222222222222222222222222222',
'2291100000119222222222222222222222222222',
'2229111111192222222222222222222222222222',
'2222999999922222222222222222222222222222',
'2222229922222222222222222222222222222222',
'2222290092222222222222222222222222222222',
'2222900009222222222222222222222222222222',
'2222900009222222222222222222222222222222',
'2222900009222222222222222222222222222222',
'2222290092222222222222222222222222222222',
'2222229922222222222222222222222222222222',
'2222222222222222222222222222222222222222',
'2222222222222222222222222222222222222222',
'2222222222222222222222222222222222222222',
'2222222222222222222222222222222222222222',
'2222222222222222222222222222222222222222',
'2222222222222222222222222222222222222222'],
npcs:[
{id:'ccapt',nm:'Captain Renn',em:'⚓',x:7,y:5},
{id:'cfirst',nm:'First Mate Silva',em:'🗡️',x:6,y:8},
{id:'ccook',nm:'Cook Morga',em:'👩‍🍳',x:8,y:8},
{id:'cnav',nm:'Navigator Yuki',em:'🔮',x:7,y:9}],
objs:[
{id:'clog',em:'📖',x:8,y:5,nm:'Ship Log',tp:'invest',evid:'ship_log'},
{id:'cmark',em:'🐉',x:6,y:6,nm:'Leviathan Mark',tp:'invest',evid:'leviathan_mark'},
{id:'cstar',em:'⭐',x:9,y:6,nm:'Star Chart',tp:'invest',evid:'star_chart'}],
enemies:[
{nm:'Sea Serpent',sp:'🐉',hp:200,at:28,df:10,sp2:8,xp:70,gld:40,atk:[{nm:'Tail Whip',pw:26}]},
{nm:'Pirate Ghost',sp:'👻',hp:110,at:20,df:4,sp2:14,xp:40,gld:30,atk:[{nm:'Cutlass',pw:22}]}],
re:[{nm:'Pirate Ghost',sp:'👻',hp:110,at:20,df:4,sp2:14,xp:40,gld:30,atk:[{nm:'Cutlass',pw:22}]}],
conn:[{x:9,y:19,r:'r4',m:'sol',tx:9,ty:1}]};

GD['r6_sky']={name:'Sky Ruins - Floating City',map:[
'1818181818181818181818181818181818181818',
'8111111111111818181818181818181818181818',
'1100000000011818181818181818181818181818',
'1000000000118181818181818181818181818181',
'1000555550118181818181818181818181818181',
'1000555550118181818181818181818181818181',
'1000333330118181818181818181818181818181',
'1000033000118181818181818181818181818181',
'1000000001181818181818181818181818181818',
'1100000011818181818181818181818181818181',
'1111111118181818181818181818181818181818',
'1110001181818181818181818181818181818181',
'1100001181818181818181818181818181818181',
'1005501181818181818181818181818181818181',
'1005501818181818181818181818181818181818',
'1003301181818181818181818181818181818181',
'1000000181818181818181818181818181818181',
'1110001181818181818181818181818181818181',
'1911119181818181818181818181818181818181',
'1819181818181818181818181818181818181818',
'1818181818181818181818181818181818181818',
'1818181818181818181818181818181818181818',
'1818181818181818181818181818181818181818',
'1818181818181818181818181818181818181818',
'1818181818181818181818181818181818181818'],
npcs:[
{id:'xsci',nm:'Engineer Voss',em:'📚',x:7,y:5},
{id:'xchild',nm:'Little Luna',em:'👦',x:6,y:13},
{id:'xelder',nm:'Elder Kael',em:'👴',x:7,y:14},
{id:'xbuilder',nm:'Last Builder',em:'🔨',x:8,y:14}],
objs:[
{id:'xengine',em:'⚙️',x:7,y:7,nm:'Ancient Engine',tp:'invest',evid:'ancient_engine'},
{id:'xgravity',em:'🔮',x:6,y:6,nm:'Gravity Stone',tp:'invest',evid:'gravity_stone'},
{id:'xblueprint',em:'🎨',x:5,y:13,nm:'Child Blueprint',tp:'invest',evid:'child_blueprint'}],
enemies:[
{nm:'Sky Guardian',sp:'🗿',hp:250,at:30,df:20,sp2:6,xp:80,gld:50,tw:true,atk:[{nm:'Gravity Crush',pw:32}]},
{nm:'Wind Phantom',sp:'🌪️',hp:120,at:24,df:6,sp2:16,xp:50,gld:30,atk:[{nm:'Tornado',pw:28,mg:1}]}],
re:[{nm:'Wind Phantom',sp:'🌪️',hp:120,at:24,df:6,sp2:16,xp:50,gld:30,atk:[{nm:'Tornado',pw:28,mg:1}]}],
conn:[{x:9,y:19,r:'r5',m:'cr',tx:9,ty:1}]};

GD['r7_zer']={name:'Kingdom Zero - The Origin',map:[
'2121212121212121212121212121212121212121',
'1211111111111112121212121212121212121212',
'2110000000001121212121212121212121212121',
'1100000000011212121212121212121212121212',
'1000555550112121212121212121212121212121',
'1000555550112121212121212121212121212121',
'1000333330112121212121212121212121212121',
'1000032230121212121212121212121212121212',
'1000022220121212121212121212121212121212',
'1000022220121212121212121212121212121212',
'1000000000112121212121212121212121212121',
'1111111111212121212121212121212121212121',
'2121111111212121212121212121212121212121',
'1211000001121212121212121212121212121212',
'2110000001121212121212121212121212121212',
'1210005550112121212121212121212121212121',
'2110005550121212121212121212121212121212',
'1210003330112121212121212121212121212121',
'2110000000112121212121212121212121212121',
'1211111111121212121212121212121212121212',
'2121212121212121212121212121212121212121',
'1212121212121212121212121212121212121212',
'2121212121212121212121212121212121212121',
'1212121212121212121212121212121212121212',
'2121212121212121212121212121212121212121'],
npcs:[
{id:'zorigin',nm:'The Origin Man',em:'👴',x:7,y:7},
{id:'zguard',nm:'Fragment Guardian',em:'✨',x:7,y:15},
{id:'zecho',nm:'Echo of the Past',em:'👻',x:8,y:8}],
objs:[
{id:'zthrone2',em:'👑',x:7,y:5,nm:'Throne of Origin',tp:'invest',evid:'throne_of_origin'},
{id:'zaltar2',em:'⭐',x:7,y:6,nm:'First Lie Altar',tp:'invest',evid:'first_lie_altar'},
{id:'zshard',em:'💎',x:8,y:7,nm:'Truth Shard',tp:'invest',evid:'truth_shard'}],
enemies:[
{nm:'The First Liar',sp:'👹',hp:500,at:35,df:25,sp2:10,xp:200,gld:100,boss:true,tw:true,ill:true,mask:10,tw2:'The false god was always a GARDENER, tending the world by hiding its pain. Truth cannot hurt what stands in it.',atk:[{nm:'Deception Wave',pw:30,mg:1},{nm:'Reality Warp',pw:35,mg:1}],ev:{id:'liar_truth',t:'The Liar Confession',d:'Proof that The First Liar was trying to stop war.',s:'Final Boss'}}],
re:[],
conn:[{x:9,y:19,r:'r6',m:'sky',tx:9,ty:1}]};
}

function defDlg(){
DLG['elder']=[
{txt:'You survived the fire, stranger. But I must warn you... don\'t believe everything you hear in this village.',ch:[
{text:'What happened here?',next:1,ev:'burned_house'},
{text:'Who attacked the village?',next:2},
{text:'I\'ll be careful.',end:true}]},
{txt:'Half the village burned. We all saw different things that night. Some say bandits. Some say beasts. I saw... something else. Something from the sky.',ch:[
{text:'What did you see from the sky?',next:3},
{text:'That doesn\'t make sense.',next:4}]},
{txt:'Bandits? Maybe. But look at the arrows we found - they have the Royal Crest. Bandits don\'t carry royal weapons. At least... not openly.',ch:[
{text:'The Royal Crest?',next:5,ev:'royal_crest'},
{text:'Could someone be framing the kingdom?',next:6}]},
{txt:'A light. Bright blue. It fell right where the old well stands. Then the fires started. I\'ve lived here 60 years and never seen anything like it.',ch:[
{text:'I\'ll investigate the well.',next:7},
{text:'Sounds like you\'re senile.',next:8}]},
{txt:'I know how it sounds. But I know what I saw. The question is - why would anyone want to burn a peaceful village?',ch:[
{text:'There must be a reason.',end:true},
{text:'Maybe it wasn\'t targeting the village.',end:true}]},
{txt:'Exactly. Someone wanted to send a message. But to whom? That\'s what I can\'t figure out.',ch:[{text:'I\'ll find the answer.',end:true}]},
{txt:'That\'s... actually smart thinking. The merchant Rill had some unusual visitors last week. Nobles from the capital. Maybe investigate.',ch:[{text:'I will.',end:true}]},
{txt:'The well goes deep. Deeper than any well should. Be careful down there.',ch:[{text:'I\'ll be careful.',end:true}]},
{txt:'... I\'m 60 years old, boy. My mind is the sharpest thing in this village. Don\'t test me.',ch:[{text:'Fair enough.',end:true}]}];

DLG['merchant']=[
{txt:'Ah, a survivor! Welcome. I sell what people need - and what people don\'t know they need yet.',ch:[
{text:'What do you know about the attack?',next:1},
{text:'Show me your wares.',next:2}]},
{txt:'The attack? I was robbed blind! Lost everything. But between you and me... I saw who did it. It wasn\'t bandits. It was one of us.',ch:[
{text:'A villager did this?',next:3},
{text:'Who? Tell me!',next:4},
{text:'[Present] Human-Made Arrows',present:'human_arrows',next:5}]},
{txt:'Health potions, basic gear. Nothing fancy. A village this poor doesn\'t attract quality merchants.',ch:[
{text:'Back to the attack.',next:1},
{text:'Actually... I heard you looted the shop before the fire.',reqev:'drunk_testimony',rum:'merchant_fire',onpick:function(){splitRum('merchant_fire');}}]},
{txt:'I can\'t name names without proof. That\'s how people disappear around here. But check the blacksmith\'s forge - he was working late that night.',ch:[
{text:'I\'ll check it out.',end:true,ev:'merchant_testimony'}]},
{txt:'I said too much already. Find your own evidence, stranger. That\'s safer for both of us.',ch:[{text:'Understood.',end:true}]},
{txt:'Those arrows... you found the Royal Crest ones? Fine — I\'ll talk. The caravan wasn\'t merchants. Palace men in disguise.',ch:[{text:'Palace men...',end:true,ev:'merchant_arrows_confession'}]}];

DLG['child']=[
{txt:'Hi mister! You look new. Did you come from the sky too? I saw something fall from the sky before the fire!',ch:[
{text:'What did you see?',next:1},
{text:'Be careful who you tell that to.',next:2}]},
{txt:'A big blue light! It went WHOOSH right into the ground! Then there was a big boom and everything got hot.',ch:[
{text:'Where exactly did it land?',next:3},
{text:'Did anyone else see it?',next:4}]},
{txt:'My mommy says not to talk about scary things. But you look nice. I think you should know.',ch:[{text:'Thank you for trusting me.',end:true}]},
{txt:'Right by the well! The old one near grandma Mira\'s house. I wanted to look but mommy said no.',ch:[
{text:'Smart mommy. I\'ll check.',end:true,ev:'child_witness'}]},
{txt:'The old man Gorn saw it too! And maybe the drunk guy but he says he sees things all the time so nobody believes him.',ch:[
{text:'I\'ll talk to the drunkard.',end:true},
{text:'What if the WELL grants wishes? I bet it does.',rum:'well_wish',onpick:function(){splitRum('well_wish');}}]}];

DLG['drunk']=[
{txt:'*hic* Another one asking questions? Let me tell you something for free - nobody tells the truth in this village. NOBODY.',ch:[
{text:'Including you?',next:1},
{text:'That\'s a bold claim.',next:2}]},
{txt:'Me? I\'m the drunkest person here, so naturally I\'m the most honest. *hic* But seriously... I saw what really happened.',ch:[
{text:'What did you see?',next:3}]},
{txt:'Even the fire isn\'t what it seems. Half those buildings were empty BEFORE the fire. Someone moved the goods out days ago.',ch:[
{text:'Someone planned this?',next:3},
{text:'Who moved the goods?',next:4}]},
{txt:'I saw a figure. Not a bandit. Not a beast. A person from the village, carrying torches. But... it could have been me. I was very drunk.',ch:[
{text:'That\'s not helpful.',end:true,ev:'drunk_testimony'},
{text:'What if it was the BLACKSMITH? I bet Gron torched his own village...',reqev:'drunk_testimony',rum:'smith_thief',onpick:function(){splitRum('smith_thief');}}]},
{txt:'The merchant. He was packing things into a cart two nights before. Said he was "reorganizing." Yeah right.',ch:[{text:'Interesting...',end:true}]}];

DLG['mira']=[
{txt:'Ah, the lost one. I\'ve been expecting you. Don\'t believe anything anyone tells you here. Not even me.',ch:[
{text:'Why would you say that?',next:1},
{text:'What do you know about me?',next:2}]},
{txt:'Because in this world, truth is the most dangerous weapon. People who speak it tend to disappear. People who lie... they thrive.',ch:[
{text:'That\'s a dark worldview.',next:3},
{text:'Who made you so cynical?',next:4}]},
{txt:'You came from nowhere. No name, no history, no parents. You\'re either very important or very dangerous. Maybe both.',ch:[
{text:'Tell me more.',next:5}]},
{txt:'I was a healer once. Before THE FIRST LIE. I remember when words had meaning. Now? Words are just tools for manipulation.',ch:[
{text:'What was THE FIRST LIE?',next:6}]},
{txt:'I\'ve seen too much. Lost too many. My grandchild Ara... she sees things others don\'t. Protect her if you can.',ch:[{text:'I will.',end:true}]},
{txt:'There is a legend about a Wanderer. Someone without history who would come when the world needed truth most. Or so the story goes.',ch:[
{text:'Maybe that\'s me.',end:true}]},
{txt:'The First Lie... some say it was told to stop a war. A lie so powerful it changed reality itself. "All humans come from one family." And people believed it. And the world... changed.',ch:[
{text:'How do you know this?',next:7,ev:'first_lie_knowledge'}]},
{txt:'Because I was there. I\'m the last person alive who remembers the world before. And I can tell you - it was more honest. And more violent.',ch:[{text:'I need to find the truth.',end:true}]}];

DLG['smith']=[
{txt:'Hmph. Another question-asker. Fine. The forge was cold that night. I was at the tavern - ask anyone.',ch:[
{text:'I\'m not accusing you.',next:1},
{text:'Who else was at the tavern?',next:2}]},
{txt:'Good. Because I make weapons, I don\'t use them on my neighbors. But I DID notice something odd about those arrows.',ch:[
{text:'What about them?',next:3}]},
{txt:'The blacksmith, the guard, and the drunkard. The priestess Ada wasn\'t there though - she was at the church.',ch:[
{text:'Noted.',end:true}]},
{txt:'Royal forged. But old. Really old. Like decades old. Someone pulled them out of an armory, not a battlefield. There\'s a difference.',ch:[
{text:'Someone with access to an armory...',end:true,ev:'arrow_analysis'}]},
{txt:'If you want to find the truth, start with the well. I heard sounds coming from it. Deep sounds. Like machinery.',ch:[{text:'The well...',end:true}]}];

DLG['guard']=[
{txt:'Halt. State your business. ... A wanderer? We don\'t get many of those. Especially not after what happened.',ch:[
{text:'I\'m investigating the attack.',next:1},
{text:'Just passing through.',next:2}]},
{txt:'Investigating? Ha! Good luck. The elder will tell you bandits, the merchant will tell you villagers, the child will tell you sky demons. Nobody agrees.',ch:[
{text:'What do YOU think?',next:3}]},
{txt:'You should leave. This village is... not safe. Things are happening that go beyond a simple fire.',ch:[
{text:'I can handle myself.',next:4}]},
{txt:'I was on duty that night. I saw the fire start in THREE places simultaneously. That\'s not random. That\'s organized.',ch:[
{text:'Three places?',next:5,ev:'three_fires'}]},
{txt:'I\'ve sworn to protect this village. I can\'t abandon it because things got dangerous.',ch:[{text:'Then help me.',end:true}]},
{txt:'The well, the church basement, and the old oak tree. All at the same time. Whoever did this knew the village layout perfectly.',ch:[
{text:'An insider...',end:true},
{text:'[Present] Royal Crest arrows',present:'human_arrows',next:6}]},
{txt:'Royal Crest?! Those arrows... you\'re right, they\'re not bandit make. Someone with palace access did this. Check the merchant — he had royal visitors before the fire.',ch:[{text:'Understood.',end:true,ev:'guard_confession'}]}];

DLG['ghost']=[
{txt:'... You can see me? Not many can. I am the echo of someone who died here... long ago.',ch:[
{text:'Who are you?',next:1},
{text:'How did you die?',next:2}]},
{txt:'I was a traveler, like you. I came looking for truth. I found it. And truth... truth killed me.',ch:[
{text:'Who killed you?',next:3},
{text:'What truth did you find?',next:4}]},
{txt:'I don\'t remember. Death has a way of... editing memories. But I remember the feeling. Betrayal.',ch:[
{text:'That\'s tragic.',end:true}]},
{txt:'The same thing that hunts you now. The ones who want the world to stay wrapped in comfortable lies.',ch:[
{text:'I\'ll be careful.',end:true,ev:'ghost_warning'}]},
{txt:'Something about the stone... the carved stone deeper in the forest. It holds a name. A name that was erased from history.',ch:[
{text:'I\'ll find it.',end:true}]}];

DLG['hermit']=[
{txt:'Another seeker. The forest brings them. Some find what they seek. Some become part of the forest.',ch:[
{text:'I seek the truth about the village fire.',next:1},
{text:'What is this forest?',next:2}]},
{txt:'The fire was a distraction. Something was taken from beneath the village. Something old. The fire covered the theft.',ch:[
{text:'What was stolen?',next:3}]},
{txt:'Blackwood Forest changes. The trees move. Paths shift. Only those who don\'t believe in fixed paths can navigate it.',ch:[
{text:'That sounds like a riddle.',next:4}]},
{txt:'I don\'t know its name. But the symbols on the carved stone match something I saw in my dreams. A map. An old map.',ch:[
{text:'Show me.',next:5}]},
{txt:'It\'s all in your head, wanderer. The forest shows you what you need to see, not what\'s there.',ch:[{text:'That\'s not helpful.',end:true}]},
{txt:'The symbols are connected to the Witch Queen legend. Some say she was real. Some say she was a lie. I say... she was both.',ch:[
{text:'Tell me about the Witch Queen.',end:true,ev:'witch_queen_hint'}]}];

DLG['gfarmer']=[
{txt:'The Heart Seed! It\'s gone! Our life source - stolen! Without it, the village will wither and die!',ch:[
{text:'When did you notice it missing?',next:1},
{text:'What is the Heart Seed?',next:2}]},
{txt:'This morning. It was here yesterday, I swear. The roots were healthy, the tree was strong. Then - gone.',ch:[
{text:'Who might have taken it?',next:3}]},
{txt:'It\'s a magical seed that keeps the whole village alive. Without it, crops fail, water turns foul, people get sick. It\'s everything.',ch:[
{text:'I\'ll find it.',end:true}]},
{txt:'The priest says the tree chose to leave. The hunter says she saw a child. The child says she found it by the river. Nobody agrees.',ch:[
{text:'I\'ll investigate all leads.',end:true,start:'heart_seed_quest'}]}];

DLG['ghunter']=[
{txt:'You\'re looking into the Heart Seed? Good. Someone needs to. Don\'t listen to the priest - she\'s been acting strange for weeks.',ch:[
{text:'Strange how?',next:1},
{text:'What do you think happened?',next:2}]},
{txt:'She\'s been going to the church at odd hours. Speaking in languages I don\'t recognize. Carrying books that glow.',ch:[
{text:'Sounds like... research?',next:3}]},
{txt:'Someone moved that seed on purpose. And they were smart about it - no tracks, no witnesses. Professional.',ch:[
{text:'Or someone the tree trusted.',next:4}]},
{txt:'Maybe. But the priestess Ada has been the caretaker of that tree for 20 years. If anyone could move it without damage, it\'s her.',ch:[
{text:'I\'ll talk to Ada.',end:true,ev:'hunter_testimony'}]},
{txt:'The tree... trusted? You know, the founder\'s diary mentions something about the tree being sentient. If it chose to move... then there\'s a reason.',ch:[
{text:'That changes everything.',end:true}]}];

DLG['gchild']=[
{txt:'Mr. Wanderer! I found something by the river! A shiny seed! But it was heavy and I couldn\'t carry it.',ch:[
{text:'Where exactly?',next:1},
{text:'Did you tell anyone else?',next:2}]},
{txt:'Down by the big rock where the water bends. It was glowing a little bit. Green like the leaves.',ch:[
{text:'I\'ll go look.',end:true,ev:'child_seed_location'}]},
{txt:'Only you! And my mommy but she said I was imagining things. I\'m NOT imagining!',ch:[{text:'I believe you.',end:true}]}];

DLG['gpriest']=[
{txt:'The Heart Seed... it was taken by the forest itself. The tree chose to retreat. I have seen this in the ancient texts.',ch:[
{text:'That sounds convenient.',next:1},
{text:'What ancient texts?',next:2},{text:'[Present] Empty Pedestal',present:'empty_pedestal',next:6}]},
{txt:'I know how it sounds. But I have devoted my life to the sacred grove. The tree is alive - it has its own will.',ch:[
{text:'So it moved itself?',next:3}]},
{txt:'The Book of Roots. It describes how the Heart Seed responds to danger. If it sensed a threat, it would retreat underground.',ch:[
{text:'What kind of threat?',next:4}]},
{txt:'Yes. It moved to protect itself. And whatever it was protecting underneath.',ch:[
{text:'What\'s underneath?',next:5,ev:'priest_testimony'}]},
{txt:'Darkness. Something that was sealed long ago. Something the founders didn\'t want found.',ch:[
{text:'Tell me more.',next:6}]},
{txt:'I\'ve said too much. The truth... the truth is dangerous, wanderer. Be careful what you dig for.',ch:[{text:'I\'ll be careful.',end:true}],
{txt:'The pedestal... you noticed it's empty and roots torn? The Heart Seed didn't move itself — I helped it. It was dying here.',ch:[{text:'Understood.',end:true,ev:'priest_pedestal_confess'}]}}];

DLG['gmerch']=[
{txt:'Looking for the Heart Seed? Join the club. Three people came by asking about it already today. Everyone wants it.',ch:[
{text:'Who came asking?',next:1}]},
{txt:'The hunter, the blacksmith\'s apprentice, and... a stranger. Not from the village. Dark clothes. Asked too many questions.',ch:[
{text:'A stranger? Describe them.',next:2}]},
{txt:'Tall. Hooded. Had a mark on their glove - looked like a broken crown. Paid me 50 gold for information about the tree roots.',ch:[
{text:'A broken crown...',end:true,ev:'stranger_info'}]}];

DLG['ghostprior']=[
{txt:'... I was the prior of this church. Before the darkness took root. I sealed it... I sealed it below the altar...',ch:[
{text:'What did you seal?',next:1},
{text:'How do I unseal it?',next:2}]},
{txt:'The Root Beast. A creature born from corrupted life energy. It feeds on the Heart Seed\'s power. If the seed is near... it will awaken.',ch:[
{text:'How do I stop it?',next:3}]},
{txt:'A key... the founder\'s key. Hidden in the diary. But be warned - the beast cannot be killed by force alone.',ch:[
{text:'Then how?',next:4}]},
{txt:'The Eye of Truth. It can see the beast\'s true form. Its weakness. Without it, you\'ll die.',ch:[
{text:'I understand.',end:true,ev:'beast_weakness'}]}];

DLG['snova']=[
{txt:'The ghost... you can see him too? He\'s been here for months, muttering about seals and beasts.',ch:[
{text:'He warned me about a Root Beast.',next:1}]},
{txt:'A Root Beast? That\'s from the fairy tales. But... the altar has been cracking lately. Something IS stirring below.',ch:[
{text:'I need to prepare.',end:true,ev:'nova_warning'}]}];

DLG['miner']=[
{txt:'Help me! These roots are strangling me! I came down here looking for crystals and got trapped!',ch:[
{text:'I\'ll free you. What did you find down here?',next:1}]},
{txt:'Life crystals! Beautiful ones! But also... bones. Human bones. This cavern has been here far longer than anyone knew.',ch:[
{text:'Human bones?',next:2,ev:'cavern_bones'}]},
{txt:'I saw them near the big root in the back. Looks like someone was sacrificed. There are symbols on the walls too.',ch:[{text:'I\'ll investigate.',end:true}]}];

DLG['herb']=[
{txt:'The forest speaks to those who listen. I hear its whispers. It tells me... lies. Even the trees lie in Blackwood.',ch:[
{text:'How can trees lie?',next:1},
{text:'What do the whispers say?',next:2}]},
{txt:'The Witch Queen... she is real. But she is not what they say. She doesn\'t eat people. She... saves them. From the truth.',ch:[
{text:'Saving people from truth?',next:3}]},
{txt:'They say "the child is safe." They say "the grave is empty." They say "the cabin remembers." Lies. All lies.',ch:[
{text:'Or all truths?',end:true,ev:'herbalist_clue'}]},
{txt:'Sometimes the truth is so painful that a lie is a kindness. The Witch Queen understood this. She lied to protect.',ch:[
{text:'That\'s... complicated.',end:true}]}];

DLG['bchild']=[
{txt:'... I drew a picture. Do you want to see? It\'s of the nice lady who lives in the forest. She has antlers.',ch:[
{text:'Antlers? Tell me about her.',next:1}]},
{txt:'She\'s pretty! She feeds the animals and sings to the trees. But the grown-ups say she\'s scary. She\'s NOT scary.',ch:[
{text:'I believe you.',end:true,ev:'witch_child_drawing'}]}];

DLG['bhunt']=[
{txt:'Witch Queen? That old legend? I\'ve hunted in these woods for 30 years. Never seen a queen of any kind.',ch:[
{text:'What about a woman with antlers?',next:1}]},
{txt:'... I did see something once. Hooves, not feet. Running through the mist. Too fast to be human. Too graceful to be a deer.',ch:[
{text:'What did you do?',next:2}]},
{txt:'I ran. Whatever it was, it wasn\'t something I wanted to meet twice.',ch:[{text:'Understandable.',end:true}]}];

DLG['bspirit']=[
{txt:'... The balance shifts. The forest remembers what was forgotten. The Witch Queen sleeps where the roots are deepest.',ch:[
{text:'Where is that?',next:1}]},
{txt:'Follow the unmarked grave. The flowers that grow there point the way. But be warned - truth has a price in this forest.',ch:[
{text:'I\'ll pay it.',end:true,ev:'spirit_direction'}]}];

DLG['bsurv']=[
{txt:'Don\'t... don\'t go deeper. I was with a group. Five of us. Only me came back. The forest... it took them.',ch:[
{text:'Took them how?',next:1}]},
{txt:'They believed different things. One believed in the Witch Queen. One didn\'t. One believed the forest was alive. The forest... chose. It kept the ones it liked.',ch:[
{text:'That\'s terrifying.',end:true,ev:'survivor_warning'}]}];

DLG['fkhnight']=[
{txt:'Halt! You stand before the Royal Guard of Frostholm. State your purpose or be turned away.',ch:[
{text:'I\'m searching for the truth about the Queen.',next:1},
{text:'What Queen?',next:2}]},
{txt:'Her Majesty Queen Elsabet rules from the Ice Palace. She has ruled for... for... Well, she\'s always ruled. Right?',ch:[
{text:'Has anyone seen her recently?',next:3}]},
{txt:'Our beloved Queen Elsabet. She has ruled Frostholm for generations. We hear her bell every day.',ch:[
{text:'A bell proves nothing.',next:4}]},
{txt:'I... The guards rotate at the palace door. No one enters the throne room. The Queen gives orders through sealed letters.',ch:[
{text:'Sealed letters can be forged.',next:5,ev:'knight_doubt'}]},
{txt:'I... No. No one has seen her face in... I can\'t remember how long. But the bell rings! The bell always rings!',ch:[
{text:'The bell could be automatic.',end:true}]}];

DLG['fchef']=[
{txt:'I cook for Her Majesty every day. Fresh soup, warm bread, fine wine. Left at the palace door. Always returned empty.',ch:[
{text:'Do you ever see who takes the food?',next:1}]},
{txt:'Never. But the plate always comes back clean. Someone is eating. The Queen is alive. I\'m sure of it.',ch:[
{text:'Or someone else is eating it.',next:2,ev:'chef_doubt'}]},
{txt:'Then... who? The guards? They have their own rations. The maids? They eat in the kitchen with me.',ch:[
{text:'Something else entirely.',end:true}]}];

DLG['fmaid']=[
{txt:'I clean the palace. Every room except the throne room. Nobody cleans the throne room. The Queen... doesn\'t like visitors.',ch:[
{text:'Have you ever been inside?',next:1}]},
{txt:'Once. When I was young. The throne was empty. But the guards said the Queen was "resting." I never questioned it.',ch:[
{text:'An empty throne...',end:true,ev:'maid_memory'}]},
{txt:'Sometimes I hear footsteps in the throne room at night. But when I check... nothing. Just the echo of the bell.',ch:[
{text:'The echo...',end:true}]}];

DLG['fguard']=[
{txt:'Captain Voss, Royal Guard. I know what you\'re thinking - the Queen is a ghost story. But I have orders. I follow them.',ch:[
{text:'Whose orders?',next:1}]},
{txt:'The Council. They manage the kingdom in the Queen\'s... absence. But the bell proves she\'s alive. It\'s her symbol.',ch:[
{text:'Have you verified that?',next:2}]},
{txt:'The bell is ancient magic. It only rings when the Queen wills it. If she were dead... the bell would stop.',ch:[
{text:'What if the bell is mechanical?',next:3,ev:'guard_bell_doubt'}]},
{txt:'Then... I don\'t know. I\'ve guarded this door for 15 years. I\'ve never seen her. But I\'ve never been told to stop.',ch:[
{text:'Would you want to know the truth?',end:true}]}];

DLG['fscholar']=[
{txt:'I study the history of Frostholm. Officially, the Queen has ruled for 200 years. But records show she was human. Humans don\'t live 200 years.',ch:[
{text:'So the Queen might not be the same person?',next:1}]},
{txt:'Or the Queen might not exist at all. The bell could be automated. The letters could be written by the Council.',ch:[
{text:'Has anyone ever investigated?',next:2,ev:'scholar_theory'}]},
{txt:'There was one. A scholar named Aldis. He tried to enter the throne room. They found him the next day. Frozen solid.',ch:[
{text:'That\'s a warning.',end:true}]}];

DLG['smerch']=[
{txt:'Information is gold here, friend. I sell truths, lies, and everything in between. What\'s your budget?',ch:[
{text:'Tell me about the Sultan\'s death.',next:1},
{text:'How do I know your information is real?',next:2}]},
{txt:'The Sultan was found in his study. Door locked from inside. No weapons. No wounds. But he was dead. Very dead.',ch:[
{text:'Poison?',next:3}]},
{txt:'You don\'t. That\'s the beauty of Sol Desert. Everyone sells truth, everyone sells lies. You have to figure out which is which.',ch:[
{text:'Useful.',end:true}]},
{txt:'That\'s what the coroner said. But the food was tested - clean. The wine was tested - clean. So what killed the Sultan?',ch:[
{text:'I\'ll find out.',end:true,ev:'sultan_poison'}]}];

DLG['sinform']=[
{txt:'You want real information? I have it. But it costs double. The Vizier did it. That\'s what everyone whispers.',ch:[
{text:'Is it true?',next:1},
{text:'I will investigate the Sultan case.',start:'sol_justice',tgt:{reg:'r4',map:'sol',x:8,y:6,t:'Crime Scene'},end:true}]},
{txt:'Maybe. Maybe not. The Vizier gains everything from the Sultan\'s death. But so does the Princess. And the Captain.',ch:[
{text:'Three suspects...',end:true,ev:'three_suspects'}]},
{txt:'Between you and me... I saw the Vizier near the study that night. But I\'ve been paid to forget. So have I.',ch:[
{text:'Who paid you?',end:true}]}];

DLG['swit1']=[
{txt:'I was selling spices in the market when it happened. I saw the Vizier leaving the palace, but he looked... scared. Not triumphant.',ch:[
{text:'Scared how?',next:1}]},
{txt:'His hands were shaking. He kept looking behind him. Like HE was the one being hunted.',ch:[
{text:'That doesn\'t fit a murderer.',end:true,ev:'vizier_scared'}]}];

DLG['svizier']=[
{txt:'So you\'re the detective. I suppose everyone suspects me. It\'s always the Vizier, isn\'t it?',ch:[
{text:'What were you doing that night?',next:1}]},
{txt:'I was in my chambers. Writing. I write every night - it\'s my meditation. My servant can confirm.',ch:[
{text:'A servant\'s testimony isn\'t proof.',next:2}]},
{txt:'The Sultan and I disagreed on many things. But I didn\'t kill him. The kingdom needs stability, not chaos.',ch:[
{text:'Who benefits most from his death?',next:3,ev:'vizier_alibi'}]},
{txt:'The Captain of the Guard. He wanted to declare martial law. The Sultan refused. Now? The Captain has exactly what he wanted.',ch:[
{text:'I\'ll investigate the Captain.',end:true},{text:'[Present] Bloody Dagger',present:'bloody_dagger',next:4}],
{txt:'The dagger... you found it at the crime scene? That blood isn't the Sultan's — it's the guard's. Someone else was wounded that night.',ch:[{text:'Understood.',end:true,ev:'vizier_dagger_confess'}]}}];

DLG['ccapt']=[
{txt:'Welcome aboard, landlubber. I\'m Captain Renn. This ship is going to find the legendary Leviathan. Or die trying.',ch:[
{text:'What do you know about the Leviathan?',next:1},
{text:'Are your crew trustworthy?',next:2}]},
{txt:'Three stories: It sank. It flies. It IS a living creature. I believe the third. The markings I found prove it.',ch:[
{text:'What markings?',next:3},{text:'[Present] Ship Log',present:'ship_log',next:4}]},
{txt:'Trustworthy? I trust them to follow orders. As for honesty... every sailor has their own truth.',ch:[
{text:'Helpful.',end:true}]},
{txt:'Ancient carvings on a stone tablet. They show a ship that moves on its own. With eyes. And teeth.',ch:[
{text:'That\'s... a creature.',end:true,ev:'leviathan_evidence'}],
{txt:'The log... you saw the altered course? Fine — we weren't heading to port. The Captain was paid to take us to the Sky Ruins.',ch:[{text:'Understood.',end:true,ev:'capt_log_confess'}]}}];

DLG['cfirst']=[
{txt:'The Captain trusts me with his life. But I\'ll tell you something - he\'s hiding the real destination. We\'re not going where he says.',ch:[
{text:'Where are we really going?',next:1},
{text:'I will hunt the Leviathan.',start:'cr_leviathan',tgt:{reg:'r5',map:'cr',x:8,y:5,t:'Ship Log'},end:true}]},
{txt:'The Abyss. A place no ship has returned from. He has coordinates. Hidden in the star chart.',ch:[
{text:'Why?',next:2,ev:'first_mate_secret'}]},
{txt:'He thinks the Leviathan is his wife. She was lost at sea years ago. He\'s gone mad with grief.',ch:[
{text:'That\'s tragic.',end:true}]}];

DLG['ccook']=[
{txt:'I keep the crew fed. But I\'ll tell you a secret - the Navigator hasn\'t eaten in three days. Something\'s wrong with her.',ch:[
{text:'What do you mean?',next:1}]},
{txt:'She stares at the stars all night. Mutters about "the path between." Says the Leviathan calls to her.',ch:[
{text:'That sounds supernatural.',end:true,ev:'cook_observation'}]}];

DLG['cnav']=[
{txt:'The stars... they\'re wrong. They\'ve been wrong since we left port. But the Captain doesn\'t listen.',ch:[
{text:'Wrong how?',next:1}]},
{txt:'They point to something. A place that shouldn\'t exist. The Leviathan\'s resting place. I can feel it.',ch:[
{text:'Feel it how?',next:2}]},
{txt:'The Eye of Truth would see it clearly. Without it... we\'re sailing blind into the deep.',ch:[
{text:'I\'ll keep that in mind.',end:true,ev:'navigator_warning'}]}];

DLG['xsci']=[
{txt:'You see this city? Floating. Everyone says it\'s magic. But I know the truth - there\'s an ENGINE beneath us.',ch:[
{text:'An engine?',next:1}]},
{txt:'Ancient technology. Far older than any of us. It generates the force that keeps the city aloft. But it\'s failing.',ch:[
{text:'How do you know?',next:2}]},
{txt:'The others think I\'m crazy. The children believe it instinctively. The old ones... they remember building it.',ch:[
{text:'Building it?',end:true,ev:'engine_truth'}]},
{txt:'Every year, the city sinks a little lower. In a hundred years, it will fall. Unless someone repairs the engine.',ch:[
{text:'I\'ll look into it.',end:true}]}];

DLG['xchild']=[
{txt:'I draw pictures of the big machine under the city! The roundy-spinny thing with the glowing lights!',ch:[
{text:'Can you show me?',next:1}]},
{txt:'Yeah! *draws in the dirt* See? It looks like this! The adults say it\'s not real but I can hear it humming!',ch:[
{text:'I believe you.',end:true,ev:'child_blueprint'}]}];

DLG['xelder']=[
{txt:'I helped build this city. When I was young. There was no magic. Just... science. The old science.',ch:[
{text:'Tell me about the engine.',next:1},{text:'[Present] Gravity Stone',present:'gravity_stone',next:3}]},
{txt:'Nobody wants to hear about engines. They prefer the magic story. The lie is more comfortable.',ch:[
{text:'The lie about gravity?',next:2,ev:'elder_memory'}]},
{txt:'Every great civilization is built on a lie. Ours just happens to be a physical one.',ch:[{text:'Deep.',end:true}],
{txt:'The Gravity Stone... you hold it? Then you've seen the engine below. The city floats because we stole its core.',ch:[{text:'Understood.',end:true,ev:'elder_gravity_confess'}]}}];

DLG['xbuilder']=[
{txt:'I\'m the last one who remembers how it works. The engine. I can fix it... but I\'m too old. My hands shake.',ch:[
{text:'Teach me.',next:1},
{text:'I will repair the engine.',start:'sky_engine',tgt:{reg:'r6',map:'sky',x:7,y:7,t:'Ancient Engine'},end:true}]},
{txt:'It needs seven Truth Shards to restart. Scattered across the floating ruins. Each one reveals a different aspect of the engine.',ch:[
{text:'Where do I find them?',next:2,ev:'engine_repair_info'}]},
{txt:'The Inverted Tower. That\'s where the last shard is. All floors are upside down. Only the truthful can navigate it.',ch:[
{text:'I\'ll find them.',end:true}]}];

DLG['zorigin']=[
{txt:'You\'ve come far, Wanderer. Through seven regions. Through lies and truths. Now you stand at the beginning of everything.',ch:[
{text:'Who are you?',next:1}]},
{txt:'I am the one who told the First Lie. I am the reason this world is the way it is.',ch:[
{text:'Why did you lie?',next:2}]},
{txt:'To stop a war. A lie so powerful it changed reality itself. "All humans come from one family." They believed it. The war stopped. But the world... changed.',ch:[
{text:'You broke reality.',next:3}]},
{txt:'I know. And I\'ve spent every moment since trying to understand what I did. The Eye of Truth was my creation - a tool to see through the lies I made.',ch:[
{text:'So the Eye is YOUR lie detector?',next:4,ev:'origin_revelation'}]},
{txt:'Yes. But even it can\'t see everything. Some lies are so deeply believed they BECOME truth. Even the Eye can\'t distinguish them.',ch:[
{text:'Then how do I find real truth?',next:5}]},
{txt:'You don\'t. You choose which truth to believe. That\'s all anyone can do. The question is - which truth will you choose?',ch:[
{text:'One question. You said I can ask one.',next:6}]},
{txt:'Yes. One question. Choose wisely. It will determine the fate of the world.',ch:[
{text:'Who am I really?',next:7,opt:'ending_self'},
{text:'What is the First Lie?',next:8,opt:'ending_lie'},
{text:'Can the lies be undone?',next:9,opt:'ending_undo'},
{text:'Is there a world without lies?',next:10,opt:'ending_nolies'},
{text:'What is truth?',next:11,opt:'ending_truth'}]}];

DLG['zguard']=[
{txt:'The seven Truth Fragments... you carry them all. The Origin awaits beyond this point. But know this - once you learn the truth, you can never unlearn it.',ch:[
{text:'I\'m ready.',end:true}]}];

DLG['zecho']=[
{txt:'I am the echo of every person who lived and died in this world. I remember what was real before the lies. And I remember what became real after.',ch:[
{text:'What was real before?',next:1}]},
{txt:'War. Violence. Fear. The First Lie stopped all of that. Was it worth the price? I don\'t know. Nobody does.',ch:[
{text:'Perhaps that\'s the answer.',end:true,ev:'echo_wisdom'}]}];
}
