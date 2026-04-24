// ==========================================
//  澳門發財巴互動地圖 — 地點與路線資料
// ==========================================

const LOCATIONS = [
  // ─── 交通樞紐 (Transport Hubs) ───
  { id: 'border_gate',   name: '關閘 (拱北口岸)',      nameEn: 'Border Gate (Gongbei Port)',       lat: 22.2104, lng: 113.5505, icon: '🚏', type: 'hub',       desc: '澳門最繁忙的陸路口岸，幾乎所有酒店均在此設站' },
  { id: 'hzmb',          name: '港珠澳大橋澳門口岸',    nameEn: 'HZMB Macau Port',                  lat: 22.1783, lng: 113.5655, icon: '🌉', type: 'hub',       desc: '往返香港的跨海大橋口岸' },
  { id: 'hengqin',       name: '橫琴口岸',             nameEn: 'Hengqin Port',                     lat: 22.1313, lng: 113.5440, icon: '🚏', type: 'hub',       desc: '連接橫琴與澳門路氹城' },
  { id: 'outer_harbour', name: '外港客運碼頭',          nameEn: 'Outer Harbour Ferry Terminal',      lat: 22.2000, lng: 113.5570, icon: '⛴️', type: 'hub',       desc: '澳門半島主要船運樞紐' },
  { id: 'taipa_ferry',   name: '氹仔客運碼頭',          nameEn: 'Taipa Ferry Terminal',              lat: 22.1570, lng: 113.5750, icon: '⛴️', type: 'hub',       desc: '噴射飛航/金光飛航停靠碼頭' },
  { id: 'airport',       name: '澳門國際機場',          nameEn: 'Macau International Airport',       lat: 22.1496, lng: 113.5915, icon: '✈️', type: 'hub',       desc: '澳門唯一國際機場' },

  // ─── 澳門半島 (Macau Peninsula) ───
  { id: 'grand_lisboa',       name: '新葡京酒店',              nameEn: 'Grand Lisboa Hotel',                 lat: 22.1906, lng: 113.5431, icon: '🏨', type: 'peninsula', desc: '澳門地標性建築，蛋型外觀，SJM旗下旗艦',
    routes: ['border_gate','outer_harbour','taipa_ferry','grand_lisboa_palace'],
    routeColor: '#e74c3c', operator: '澳娛綜合 SJM' },

  { id: 'hotel_lisboa',       name: '葡京酒店',                nameEn: 'Hotel Lisboa',                       lat: 22.1900, lng: 113.5420, icon: '🏨', type: 'peninsula', desc: '澳門歷史最悠久的賭場酒店之一',
    routes: ['border_gate','outer_harbour'],
    routeColor: '#e67e22', operator: '澳娛綜合 SJM' },

  { id: 'wynn_macau',         name: '永利澳門',                nameEn: 'Wynn Macau',                         lat: 22.1881, lng: 113.5458, icon: '🎰', type: 'peninsula', desc: '永利集團澳門半島旗艦，鄰近新葡京',
    routes: ['border_gate','outer_harbour','taipa_ferry','wynn_palace'],
    routeColor: '#c0392b', operator: '永利 Wynn' },

  { id: 'mgm_macau',          name: '澳門美高梅',              nameEn: 'MGM Macau',                          lat: 22.1868, lng: 113.5437, icon: '🎰', type: 'peninsula', desc: '美高梅集團半島旗艦，金色波浪外觀',
    routes: ['border_gate','outer_harbour','taipa_ferry','mgm_cotai'],
    routeColor: '#f1c40f', operator: '美高梅 MGM' },

  { id: 'starworld',          name: '星際酒店',                nameEn: 'StarWorld Hotel',                    lat: 22.1907, lng: 113.5460, icon: '🏨', type: 'peninsula', desc: '銀河娛樂集團半島旗艦',
    routes: ['border_gate','outer_harbour','galaxy_macau'],
    routeColor: '#f39c12', operator: '銀河娛樂 Galaxy' },

  { id: 'ponte16',            name: '十六浦度假村',            nameEn: 'Ponte 16 Resort',                    lat: 22.1960, lng: 113.5370, icon: '🏨', type: 'peninsula', desc: '位於內港碼頭旁，鄰近大三巴',
    routes: ['border_gate','outer_harbour'],
    routeColor: '#1abc9c', operator: '澳娛綜合 SJM' },

  { id: 'grand_emperor',      name: '英皇娛樂酒店',            nameEn: 'Grand Emperor Hotel',                lat: 22.1930, lng: 113.5410, icon: '🏨', type: 'peninsula', desc: '位於澳門中區，多條發財巴中區站',
    routes: ['border_gate','outer_harbour'],
    routeColor: '#e67e22', operator: '英皇 Emperor' },

  { id: 'rio',                name: '利澳酒店',               nameEn: 'Rio Hotel',                           lat: 22.2060, lng: 113.5520, icon: '🏨', type: 'peninsula', desc: '鄰近關閘，方便陸路旅客',
    routes: ['border_gate'],
    routeColor: '#3498db', operator: '利澳 Rio' },

  { id: 'jai_alai',           name: '回力海立方',              nameEn: 'Jai Alai Hotel',                     lat: 22.1940, lng: 113.5530, icon: '🏨', type: 'peninsula', desc: '鄰近外港碼頭，SJM旗下',
    routes: ['border_gate','outer_harbour'],
    routeColor: '#2ecc71', operator: '澳娛綜合 SJM' },

  { id: 'landmark',           name: '置地廣場酒店',            nameEn: 'Landmark Macau',                     lat: 22.1935, lng: 113.5530, icon: '🏨', type: 'peninsula', desc: '鄰近外港碼頭的綜合酒店',
    routes: ['border_gate','outer_harbour'],
    routeColor: '#9b59b6', operator: '置地 Landmark' },

  { id: 'macau_tower',        name: '澳門旅遊塔',             nameEn: 'Macau Tower',                        lat: 22.1801, lng: 113.5321, icon: '🗼', type: 'peninsula', desc: '338米高的觀光塔，可在此轉車',
    routes: [],
    routeColor: '#3498db', operator: '' },

  // ─── 路氹城 (Cotai Strip) ───
  { id: 'venetian',           name: '澳門威尼斯人',            nameEn: 'The Venetian Macao',                 lat: 22.1472, lng: 113.5621, icon: '🎰', type: 'cotai', desc: '亞洲最大單幢建築賭場酒店，金沙集團旗艦',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport'],
    routeColor: '#c9a84c', operator: '金沙中國 Sands' },

  { id: 'londoner',           name: '澳門倫敦人',              nameEn: 'The Londoner Macao',                 lat: 22.1465, lng: 113.5600, icon: '🎰', type: 'cotai', desc: '英倫主題度假村，金沙集團旗下',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport'],
    routeColor: '#c9a84c', operator: '金沙中國 Sands' },

  { id: 'parisian',           name: '澳門巴黎人',              nameEn: 'The Parisian Macao',                 lat: 22.1445, lng: 113.5615, icon: '🗼', type: 'cotai', desc: '巴黎鐵塔複製品為地標，金沙集團旗下',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport'],
    routeColor: '#c9a84c', operator: '金沙中國 Sands' },

  { id: 'sands_cotai',        name: '金沙城中心',              nameEn: 'Sands Cotai Central',                lat: 22.1483, lng: 113.5583, icon: '🏨', type: 'cotai', desc: '含喜來登、康萊德、假日等酒店群',
    routes: ['border_gate','hzmb','outer_harbour','taipa_ferry','airport'],
    routeColor: '#c9a84c', operator: '金沙中國 Sands' },

  { id: 'galaxy_macau',       name: '澳門銀河',               nameEn: 'Galaxy Macau',                       lat: 22.1485, lng: 113.5530, icon: '🎰', type: 'cotai', desc: '世界級綜合度假城，天浪淘園聞名',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport','starworld'],
    routeColor: '#f39c12', operator: '銀河娛樂 Galaxy' },

  { id: 'broadway',           name: '澳門百老匯',              nameEn: 'Broadway Macau',                     lat: 22.1495, lng: 113.5505, icon: '🎭', type: 'cotai', desc: '銀河旗下，主打美食街與劇場',
    routes: ['border_gate','galaxy_macau'],
    routeColor: '#f39c12', operator: '銀河娛樂 Galaxy' },

  { id: 'city_of_dreams',     name: '新濠天地',               nameEn: 'City of Dreams',                     lat: 22.1440, lng: 113.5587, icon: '🎰', type: 'cotai', desc: '新濠集團旗艦，水舞間表演場地',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport'],
    routeColor: '#2ecc71', operator: '新濠博亞 Melco' },

  { id: 'studio_city',        name: '新濠影滙',               nameEn: 'Studio City',                        lat: 22.1370, lng: 113.5555, icon: '🎬', type: 'cotai', desc: '電影主題度假村，8字型摩天輪為地標',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport'],
    routeColor: '#2ecc71', operator: '新濠博亞 Melco' },

  { id: 'altira',             name: '新濠鋒',                 nameEn: 'Altira Macau',                       lat: 22.1560, lng: 113.5590, icon: '🏨', type: 'cotai', desc: '新濠集團精品酒店，位於氹仔',
    routes: ['border_gate','outer_harbour','taipa_ferry','city_of_dreams'],
    routeColor: '#2ecc71', operator: '新濠博亞 Melco' },

  { id: 'wynn_palace',        name: '永利皇宮',               nameEn: 'Wynn Palace',                        lat: 22.1430, lng: 113.5570, icon: '🎰', type: 'cotai', desc: '永利集團路氹旗艦，纜車與湖上表演',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport','wynn_macau'],
    routeColor: '#c0392b', operator: '永利 Wynn' },

  { id: 'mgm_cotai',          name: '美獅美高梅',              nameEn: 'MGM Cotai',                          lat: 22.1415, lng: 113.5558, icon: '🎰', type: 'cotai', desc: '美高梅路氹旗艦，寶石外觀',
    routes: ['border_gate','hzmb','outer_harbour','taipa_ferry','airport','mgm_macau'],
    routeColor: '#f1c40f', operator: '美高梅 MGM' },

  { id: 'grand_lisboa_palace', name: '上葡京',                nameEn: 'Grand Lisboa Palace',                lat: 22.1400, lng: 113.5620, icon: '🏨', type: 'cotai', desc: 'SJM路氹旗艦，含凡爾賽宮及葡京人',
    routes: ['border_gate','hzmb','hengqin','outer_harbour','taipa_ferry','airport','grand_lisboa'],
    routeColor: '#e74c3c', operator: '澳娛綜合 SJM' },

  { id: 'morpheus',           name: '摩珀斯酒店',              nameEn: 'Morpheus Hotel',                     lat: 22.1447, lng: 113.5595, icon: '🏨', type: 'cotai', desc: '扎哈·哈蒂設計，新濠天地內',
    routes: ['border_gate','hzmb','outer_harbour','taipa_ferry'],
    routeColor: '#2ecc71', operator: '新濠博亞 Melco' },

  { id: 'lisboeta',           name: '葡京人',                 nameEn: 'Lisboeta Macau',                     lat: 22.1395, lng: 113.5630, icon: '🏨', type: 'cotai', desc: '上葡京旗下，復古主題度假村',
    routes: ['border_gate','hzmb','outer_harbour','taipa_ferry','grand_lisboa_palace'],
    routeColor: '#e74c3c', operator: '澳娛綜合 SJM' },

  { id: 'galaxy_intl',        name: '銀河國際會議中心',         nameEn: 'Galaxy ICC',                         lat: 22.1475, lng: 113.5510, icon: '🏢', type: 'cotai', desc: '銀河旗下大型會議展覽中心',
    routes: ['border_gate','galaxy_macau','taipa_ferry'],
    routeColor: '#f39c12', operator: '銀河娛樂 Galaxy' },
];

// 路線顏色 by operator
const OPERATOR_COLORS = {
  '金沙中國 Sands':   '#c9a84c',
  '銀河娛樂 Galaxy':  '#f39c12',
  '新濠博亞 Melco':   '#2ecc71',
  '永利 Wynn':        '#c0392b',
  '美高梅 MGM':       '#f1c40f',
  '澳娛綜合 SJM':     '#e74c3c',
  '英皇 Emperor':     '#e67e22',
  '利澳 Rio':        '#3498db',
  '置地 Landmark':    '#9b59b6',
};
