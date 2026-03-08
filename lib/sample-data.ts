import type { ReportData } from './types';

export const SAMPLE_DATA: ReportData = {
  "reportDate": "07 Mar 2026",
  "storeCode": "2064",
  "storeName": "2064 Dromore West — Feeney (Centra)",
  "weekNumber": 10,
  "summary": {
    "daily": {
      "retailSales": 11773.9,
      "retailSalesLY": 12166.21,
      "retailSalesVar": -392.31,
      "retailSalesVarPct": -0.0322,
      "scanMargin": 0.1354,
      "scanMarginLY": 0.2345,
      "scanMarginVar": -0.0991,
      "waste": 64.48,
      "wasteLY": 39.46,
      "wasteVarPct": 0.634
    },
    "wtd": {
      "retailSales": 68947.39,
      "retailSalesLY": 69610.27,
      "retailSalesVar": -662.88,
      "retailSalesVarPct": -0.0095,
      "scanMargin": 0.2186,
      "scanMarginLY": 0.2458,
      "scanMarginVar": -0.0272,
      "waste": 632.01,
      "wasteLY": 758.21,
      "wasteVarPct": -0.1664
    },
    "ytd": {
      "retailSales": 691008.48,
      "retailSalesLY": 687273.5,
      "retailSalesVar": 3734.98,
      "retailSalesVarPct": 0.0054,
      "scanMargin": 0.2355,
      "scanMarginLY": 0.2424,
      "scanMarginVar": -0.0069,
      "waste": 12996.84,
      "wasteLY": 6329.98,
      "wasteVarPct": 1.0532
    }
  },
  "footfall": {
    "daily": {
      "transVar": -0.0556,
      "salesHourlyVar": 0.04,
      "avgSpendVar": 0.1011
    },
    "wtd": {
      "transVar": -0.0089,
      "salesHourlyVar": 0.0786,
      "avgSpendVar": 0.0883
    },
    "ytd": {
      "transVar": 0.0034,
      "salesHourlyVar": 0.0155,
      "avgSpendVar": 0.0121
    }
  },
  "weeklyTrend": [
    {
      "week": "Wk 7",
      "ty": 73813.61,
      "ly": 71260.66
    },
    {
      "week": "Wk 8",
      "ty": 71888.15,
      "ly": 69861.12
    },
    {
      "week": "Wk 9",
      "ty": 71147.01,
      "ly": 69751.43
    },
    {
      "week": "Wk 10",
      "ty": 68947.39,
      "ly": 69610.27
    }
  ],
  "fhData": [
    {
      "id": "large",
      "name": "Large Coffee",
      "sales": 8226,
      "wastePct": 0.0434,
      "wasteCups": 104,
      "invoiceQty": 2399,
      "variance": 104
    },
    {
      "id": "regular",
      "name": "Regular Coffee",
      "sales": 12767.05,
      "wastePct": -0.1251,
      "wasteCups": -434,
      "invoiceQty": 3468,
      "variance": -434
    },
    {
      "id": "flatwhite",
      "name": "Flat White",
      "sales": 2264.02,
      "wastePct": -0.2604,
      "wasteCups": -144,
      "invoiceQty": 553,
      "variance": -144
    },
    {
      "id": "iced",
      "name": "Iced Dairy",
      "sales": 0,
      "wastePct": null,
      "wasteCups": 0,
      "invoiceQty": 0,
      "variance": 0
    },
    {
      "id": "oat_fw",
      "name": "Oat Flat White",
      "sales": 0,
      "wastePct": 1,
      "wasteCups": 262,
      "invoiceQty": 262,
      "variance": 262
    },
    {
      "id": "oat_lg",
      "name": "Oat Large",
      "sales": 0,
      "wastePct": 1,
      "wasteCups": 242,
      "invoiceQty": 242,
      "variance": 242
    },
    {
      "id": "oat_reg",
      "name": "Oat Regular",
      "sales": 0,
      "wastePct": 1,
      "wasteCups": 259,
      "invoiceQty": 259,
      "variance": 259
    },
    {
      "id": "iced_am",
      "name": "Iced Americano",
      "sales": 0,
      "wastePct": null,
      "wasteCups": 0,
      "invoiceQty": 0,
      "variance": 0
    },
    {
      "id": "milk_ab",
      "name": "Milk Aborts",
      "sales": 0,
      "wastePct": 1,
      "wasteCups": 21,
      "invoiceQty": 21,
      "variance": 21
    }
  ],
  "fhTotals": {
    "totalSales": 23257.07,
    "totalInvoiced": 7204,
    "totalSold": 6894,
    "totalVariance": 310
  },
  "departments": [
    {
      "n": "Grocery -  Impulse",
      "id": "D0024",
      "s": 7845.56,
      "sv": 0.0058,
      "sy": 0.0416,
      "m": 0.3261,
      "my": 0.3377,
      "mv": -0.0333,
      "p": 0.1748,
      "w": 7.4,
      "sub": [
        {
          "n": "Impulse Confectionery",
          "s": 1865.69,
          "sv": -0.0015,
          "sy": 0.0961,
          "m": 0.3816,
          "my": 0.3838,
          "mv": -0.0266,
          "p": 0.0173,
          "w": null
        },
        {
          "n": "Impulse Crisps And Snacks",
          "s": 566.2,
          "sv": 0.0265,
          "sy": -0.0713,
          "m": 0.3226,
          "my": 0.2745,
          "mv": -0.0358,
          "p": 0.0053,
          "w": null
        },
        {
          "n": "Impulse Soft Drinks",
          "s": 2684.94,
          "sv": 0.0356,
          "sy": 0.0549,
          "m": 0.4049,
          "my": 0.4095,
          "mv": -0.023,
          "p": 0.0249,
          "w": null
        },
        {
          "n": "Multipack Crisps & Snacks",
          "s": 197.65,
          "sv": 0.5032,
          "sy": 0.4494,
          "m": 0.1857,
          "my": 0.1825,
          "mv": 0.0221,
          "p": 0.0018,
          "w": null
        },
        {
          "n": "Sharing Crisps And Snacks",
          "s": 625.03,
          "sv": -0.0298,
          "sy": 0.0973,
          "m": 0.2321,
          "my": 0.2624,
          "mv": -0.0426,
          "p": 0.0058,
          "w": 7.4
        },
        {
          "n": "Take Home Confectionery",
          "s": 1254.2,
          "sv": 0.1457,
          "sy": 0.0471,
          "m": 0.1895,
          "my": 0.2368,
          "mv": -0.0942,
          "p": 0.0116,
          "w": null
        },
        {
          "n": "Take Home Soft Drinks",
          "s": 651.85,
          "sv": -0.2892,
          "sy": -0.162,
          "m": 0.2416,
          "my": 0.2635,
          "mv": -0.0039,
          "p": 0.006,
          "w": null
        }
      ]
    },
    {
      "n": "Grocery - Edible",
      "id": "D0025",
      "s": 895.07,
      "sv": 0.1491,
      "sy": 0.0681,
      "m": 0.1757,
      "my": 0.1761,
      "mv": -0.0279,
      "p": 0.0199,
      "w": null,
      "sub": [
        {
          "n": "Biscuits",
          "s": 506.77,
          "sv": 0.4291,
          "sy": 0.4296,
          "m": 0.1284,
          "my": 0.1514,
          "mv": -0.0594,
          "p": 0.0047,
          "w": null
        },
        {
          "n": "Breakfast Cereals",
          "s": 28.08,
          "sv": -0.3221,
          "sy": -0.5668,
          "m": 0.1431,
          "my": 0.1457,
          "mv": -0.0403,
          "p": 0.0003,
          "w": null
        },
        {
          "n": "Canned Dried Veg/Meat",
          "s": 6.2,
          "sv": -0.7423,
          "sy": -0.649,
          "m": 0.1336,
          "my": 0.1246,
          "mv": -0.0357,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Canned Fish",
          "s": null,
          "sv": -1,
          "sy": -0.0476,
          "m": null,
          "my": 0.1,
          "mv": -0.1502,
          "p": null,
          "w": null
        },
        {
          "n": "Canned Fruit/Desserts",
          "s": null,
          "sv": -1,
          "sy": -0.5368,
          "m": null,
          "my": 0.1862,
          "mv": -0.1862,
          "p": null,
          "w": null
        },
        {
          "n": "Condiments Table Top",
          "s": 15.54,
          "sv": -0.4925,
          "sy": -0.3491,
          "m": 0.1208,
          "my": 0.1467,
          "mv": -0.0709,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Hw Free From",
          "s": 23.7,
          "sv": -0.5949,
          "sy": -0.4201,
          "m": 0.2246,
          "my": 0.2194,
          "mv": -0.1608,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Hot Beverages",
          "s": 93.5,
          "sv": 1.6139,
          "sy": 0.0745,
          "m": 0.1519,
          "my": 0.1247,
          "mv": -0.008,
          "p": 0.0009,
          "w": null
        },
        {
          "n": "Instant Hot Snacks",
          "s": null,
          "sv": -1,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": -0.1066,
          "p": null,
          "w": null
        },
        {
          "n": "Foods Of The World",
          "s": null,
          "sv": -1,
          "sy": -0.5023,
          "m": null,
          "my": 0.155,
          "mv": -0.1959,
          "p": null,
          "w": null
        },
        {
          "n": "Oils",
          "s": 4.58,
          "sv": 0.145,
          "sy": 0.0005,
          "m": 0.1301,
          "my": 0.1306,
          "mv": -0.022,
          "p": 0,
          "w": null
        },
        {
          "n": "Italian",
          "s": null,
          "sv": -1,
          "sy": -0.9661,
          "m": null,
          "my": 0.1828,
          "mv": -0.1526,
          "p": null,
          "w": null
        },
        {
          "n": "Preserves",
          "s": 8.49,
          "sv": -0.7451,
          "sy": -0.3613,
          "m": 0.1774,
          "my": 0.1733,
          "mv": 0.2383,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Soups",
          "s": 5.45,
          "sv": -0.7191,
          "sy": -0.5775,
          "m": 0.1622,
          "my": 0.1164,
          "mv": -0.0097,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Sugar",
          "s": 10.61,
          "sv": -0.1579,
          "sy": -0.2765,
          "m": 0.1112,
          "my": 0.0865,
          "mv": 0.0066,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Condiments Packet",
          "s": null,
          "sv": -1,
          "sy": -0.7452,
          "m": null,
          "my": 0.2319,
          "mv": -0.1774,
          "p": null,
          "w": null
        },
        {
          "n": "Hw Sports Nutrition",
          "s": 192.15,
          "sv": 0.8187,
          "sy": 0.8594,
          "m": 0.3139,
          "my": 0.2922,
          "mv": -0.0293,
          "p": 0.0018,
          "w": null
        }
      ]
    },
    {
      "n": "Grocery - Non Food",
      "id": "D0026",
      "s": 388.87,
      "sv": 0.0163,
      "sy": 0.0006,
      "m": 0.1573,
      "my": 0.1764,
      "mv": -0.037,
      "p": 0.0087,
      "w": null,
      "sub": [
        {
          "n": "Petfood Care & Treats",
          "s": 132.93,
          "sv": -0.1401,
          "sy": -0.2385,
          "m": 0.1439,
          "my": 0.2,
          "mv": -0.1088,
          "p": 0.0012,
          "w": null
        },
        {
          "n": "Laundry",
          "s": null,
          "sv": -1,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": -0.0464,
          "p": null,
          "w": null
        },
        {
          "n": "Ignition & Firestarters",
          "s": 188.53,
          "sv": 0.3316,
          "sy": 0.4515,
          "m": 0.1637,
          "my": 0.1725,
          "mv": -0.0125,
          "p": 0.0017,
          "w": null
        },
        {
          "n": "Cleaning",
          "s": 13.66,
          "sv": -0.3802,
          "sy": -0.4026,
          "m": 0.2059,
          "my": 0.1581,
          "mv": 0.0717,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Toilet & Kitchen Paper",
          "s": 34.49,
          "sv": -0.2913,
          "sy": -0.1551,
          "m": 0.1518,
          "my": 0.1541,
          "mv": 0.0335,
          "p": 0.0003,
          "w": null
        },
        {
          "n": "Facial Tissue",
          "s": 7,
          "sv": -0.1716,
          "sy": -0.447,
          "m": 0.2093,
          "my": 0.1797,
          "mv": 0.0391,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Refuse Sacks/Bin Liners",
          "s": 1.75,
          "sv": null,
          "sy": 0.0674,
          "m": 0.25,
          "my": 0.1323,
          "mv": 0.25,
          "p": 0,
          "w": null
        },
        {
          "n": "Food Wrap",
          "s": 4.95,
          "sv": 0.678,
          "sy": 0.0406,
          "m": 0.1001,
          "my": 0.1001,
          "mv": 0.0217,
          "p": 0,
          "w": null
        },
        {
          "n": "Cleaning Cloths,Gloves & Shoes",
          "s": 5.56,
          "sv": null,
          "sy": 0.0822,
          "m": 0.1187,
          "my": 0.1193,
          "mv": 0.1187,
          "p": 0.0001,
          "w": null
        }
      ]
    },
    {
      "n": "Baby & Kids",
      "id": "D0027",
      "s": 51.18,
      "sv": 0.5173,
      "sy": 0.0997,
      "m": 0.2668,
      "my": 0.2663,
      "mv": 0.0713,
      "p": 0.0011,
      "w": null,
      "sub": [
        {
          "n": "Baby Food & Drinks",
          "s": 4.8,
          "sv": null,
          "sy": null,
          "m": 0.4274,
          "my": 0.2527,
          "mv": 0.4274,
          "p": 0,
          "w": null
        },
        {
          "n": "Baby Toiletries & Wipes",
          "s": 46.38,
          "sv": 0.375,
          "sy": -0.1167,
          "m": 0.2472,
          "my": 0.2702,
          "mv": 0.0517,
          "p": 0.0004,
          "w": null
        }
      ]
    },
    {
      "n": "Personal Care",
      "id": "D0028",
      "s": 208.49,
      "sv": 0.2941,
      "sy": -0.1257,
      "m": 0.2098,
      "my": 0.1947,
      "mv": -0.0134,
      "p": 0.0046,
      "w": null,
      "sub": [
        {
          "n": "Male Grooming",
          "s": 6.55,
          "sv": -0.5068,
          "sy": -0.5072,
          "m": 0.2047,
          "my": 0.1968,
          "mv": 0.0817,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Hair",
          "s": 10.3,
          "sv": -0.2685,
          "sy": 0.827,
          "m": 0.2497,
          "my": 0.1925,
          "mv": 0.0207,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Personal Wash",
          "s": 3.5,
          "sv": -0.5,
          "sy": 0.109,
          "m": 0.2421,
          "my": 0.2233,
          "mv": 0.0447,
          "p": 0,
          "w": null
        },
        {
          "n": "Medicinal",
          "s": 116.22,
          "sv": 0.2978,
          "sy": -0.1109,
          "m": 0.2091,
          "my": 0.1869,
          "mv": -0.0303,
          "p": 0.0011,
          "w": null
        },
        {
          "n": "Sanitary Protection",
          "s": 40.58,
          "sv": 9.145,
          "sy": 0.1662,
          "m": 0.2415,
          "my": 0.2392,
          "mv": 0.0938,
          "p": 0.0004,
          "w": null
        },
        {
          "n": "Skin Care",
          "s": null,
          "sv": null,
          "sy": -0.2562,
          "m": null,
          "my": 0.2218,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Oral Care",
          "s": 26.49,
          "sv": -0.0656,
          "sy": -0.4143,
          "m": 0.1429,
          "my": 0.193,
          "mv": -0.0823,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Ladies Deodorants",
          "s": 4.85,
          "sv": 0,
          "sy": -0.1058,
          "m": 0.2045,
          "my": 0.2472,
          "mv": 0,
          "p": 0,
          "w": null
        }
      ]
    },
    {
      "n": "Beers/Wines/Spirits",
      "id": "D0029",
      "s": 8299.22,
      "sv": 0.0098,
      "sy": 0.0228,
      "m": 0.1177,
      "my": 0.1188,
      "mv": -0.0044,
      "p": 0.1849,
      "w": 7.15,
      "sub": [
        {
          "n": "Beer & Cider",
          "s": 3559.59,
          "sv": 0.0729,
          "sy": 0.1164,
          "m": 0.1359,
          "my": 0.1375,
          "mv": -0.0004,
          "p": 0.033,
          "w": 7.15
        },
        {
          "n": "Wine",
          "s": 1521.47,
          "sv": -0.0255,
          "sy": -0.0859,
          "m": 0.1302,
          "my": 0.1343,
          "mv": -0.0135,
          "p": 0.0141,
          "w": null
        },
        {
          "n": "Fortified Wine",
          "s": null,
          "sv": -1,
          "sy": -0.2263,
          "m": null,
          "my": 0.1223,
          "mv": -0.1935,
          "p": null,
          "w": null
        },
        {
          "n": "Spirits & Liqueurs",
          "s": 3000.91,
          "sv": -0.0136,
          "sy": 0.0061,
          "m": 0.0853,
          "my": 0.0878,
          "mv": -0.0044,
          "p": 0.0278,
          "w": null
        },
        {
          "n": "Craft World Beer",
          "s": 187.2,
          "sv": 0.1744,
          "sy": 0.0189,
          "m": 0.1789,
          "my": 0.1957,
          "mv": -0.0117,
          "p": 0.0017,
          "w": null
        },
        {
          "n": "Non Alcoholic",
          "s": 30.05,
          "sv": -0.7053,
          "sy": -0.4761,
          "m": 0.1722,
          "my": 0.1692,
          "mv": 0.0185,
          "p": 0.0003,
          "w": null
        }
      ]
    },
    {
      "n": "Tobacco",
      "id": "D0031",
      "s": 9971.39,
      "sv": 0.0148,
      "sy": -0.0023,
      "m": 0.1245,
      "my": 0.1314,
      "mv": -0.0298,
      "p": 0.2222,
      "w": null,
      "sub": [
        {
          "n": "Cigarettes",
          "s": 7025.9,
          "sv": 0.0583,
          "sy": -0.0262,
          "m": 0.0756,
          "my": 0.0743,
          "mv": 0.0027,
          "p": 0.0651,
          "w": null
        },
        {
          "n": "Cigars",
          "s": null,
          "sv": null,
          "sy": -0.5832,
          "m": null,
          "my": 0.1451,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Tobacco",
          "s": 821.55,
          "sv": -0.118,
          "sy": -0.0404,
          "m": 0.0824,
          "my": 0.0818,
          "mv": 0.0028,
          "p": 0.0076,
          "w": null
        },
        {
          "n": "Smoking Accessories",
          "s": 2123.94,
          "sv": -0.0585,
          "sy": 0.0949,
          "m": 0.3028,
          "my": 0.3101,
          "mv": -0.1223,
          "p": 0.0197,
          "w": null
        }
      ]
    },
    {
      "n": "Produce",
      "id": "D0032",
      "s": 254.1,
      "sv": -0.0309,
      "sy": -0.0834,
      "m": 0.3052,
      "my": 0.2831,
      "mv": 0.0238,
      "p": 0.0057,
      "w": 65.55,
      "sub": [
        {
          "n": "Fruit",
          "s": 96.55,
          "sv": 0.0788,
          "sy": -0.1615,
          "m": 0.4786,
          "my": 0.4746,
          "mv": 0.0993,
          "p": 0.0009,
          "w": null
        },
        {
          "n": "Chilled Fruit",
          "s": null,
          "sv": -1,
          "sy": -0.5892,
          "m": null,
          "my": 0.2421,
          "mv": -0.2718,
          "p": null,
          "w": null
        },
        {
          "n": "Potatoes",
          "s": 23.94,
          "sv": -0.1429,
          "sy": -0.3426,
          "m": 0.1702,
          "my": 0.1702,
          "mv": 0,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Veg",
          "s": 5.58,
          "sv": -0.5724,
          "sy": 0.0157,
          "m": 0.2797,
          "my": 0.2475,
          "mv": 0.0241,
          "p": 0.0001,
          "w": 4.77
        },
        {
          "n": "Prepared Produce",
          "s": 6,
          "sv": -0.2941,
          "sy": 4.5753,
          "m": 0.34,
          "my": 0.3359,
          "mv": 0.1204,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Horticulture",
          "s": 97.88,
          "sv": 0.7043,
          "sy": -0.023,
          "m": 0.1772,
          "my": 0.1844,
          "mv": -0.0445,
          "p": 0.0009,
          "w": 60.78
        },
        {
          "n": "Ambient Veg",
          "s": 24.15,
          "sv": 0.2353,
          "sy": 0.2093,
          "m": 0.1999,
          "my": 0.2114,
          "mv": -0.0137,
          "p": 0.0002,
          "w": null
        }
      ]
    },
    {
      "n": "Meat, Poultry & Fish",
      "id": "D0033",
      "s": 226.22,
      "sv": 0.6389,
      "sy": -0.0752,
      "m": 0.1407,
      "my": 0.1133,
      "mv": 0.0978,
      "p": 0.005,
      "w": 71.5,
      "sub": [
        {
          "n": "Meat & Poultry Prepack",
          "s": 226.22,
          "sv": 0.6389,
          "sy": -0.0752,
          "m": 0.1407,
          "my": 0.1133,
          "mv": 0.0978,
          "p": 0.0021,
          "w": 71.5
        }
      ]
    },
    {
      "n": "Dairy",
      "id": "D0034",
      "s": 1670.85,
      "sv": -0.129,
      "sy": -0.0203,
      "m": 0.221,
      "my": 0.2214,
      "mv": -0.0254,
      "p": 0.0372,
      "w": 25.55,
      "sub": [
        {
          "n": "Yogurts & Desserts",
          "s": 211.81,
          "sv": 0.1899,
          "sy": 0.0299,
          "m": 0.2309,
          "my": 0.2248,
          "mv": -0.0303,
          "p": 0.002,
          "w": 22.25
        },
        {
          "n": "Milk & Cream",
          "s": 1084.13,
          "sv": -0.1677,
          "sy": -0.0709,
          "m": 0.2331,
          "my": 0.2342,
          "mv": -0.0257,
          "p": 0.0101,
          "w": null
        },
        {
          "n": "Butters And Spreads",
          "s": 109.51,
          "sv": -0.1634,
          "sy": 0.0177,
          "m": 0.0967,
          "my": 0.0968,
          "mv": -0.026,
          "p": 0.001,
          "w": null
        },
        {
          "n": "Prepack Cheese",
          "s": 90.71,
          "sv": -0.2305,
          "sy": 0.1422,
          "m": 0.1941,
          "my": 0.2074,
          "mv": -0.0445,
          "p": 0.0008,
          "w": null
        },
        {
          "n": "Take Home Chilled Juice",
          "s": 53.14,
          "sv": -0.1719,
          "sy": 0.0743,
          "m": 0.1543,
          "my": 0.1852,
          "mv": -0.0356,
          "p": 0.0005,
          "w": null
        },
        {
          "n": "Eggs",
          "s": 121.55,
          "sv": -0.026,
          "sy": 0.1918,
          "m": 0.2513,
          "my": 0.2529,
          "mv": -0.006,
          "p": 0.0011,
          "w": 3.3
        },
        {
          "n": "Pp Speciality Cheese",
          "s": null,
          "sv": null,
          "sy": null,
          "m": null,
          "my": 0.192,
          "mv": null,
          "p": null,
          "w": null
        }
      ]
    },
    {
      "n": "Bread And Cakes",
      "id": "D0035",
      "s": 1886.96,
      "sv": -0.0533,
      "sy": -0.1121,
      "m": 0.3501,
      "my": 0.345,
      "mv": 0.0042,
      "p": 0.042,
      "w": 258.18,
      "sub": [
        {
          "n": "Wrapped Bread",
          "s": 573.79,
          "sv": -0.145,
          "sy": -0.0174,
          "m": 0.3668,
          "my": 0.3665,
          "mv": 0.0123,
          "p": 0.0053,
          "w": null
        },
        {
          "n": "Packaged Cake",
          "s": 323.2,
          "sv": -0.0117,
          "sy": 0.0174,
          "m": 0.2589,
          "my": 0.2695,
          "mv": -0.0132,
          "p": 0.003,
          "w": null
        },
        {
          "n": "Fresh Bakery",
          "s": 973.47,
          "sv": 0.0328,
          "sy": -0.196,
          "m": 0.37,
          "my": 0.3517,
          "mv": 0.0038,
          "p": 0.009,
          "w": 250.25
        },
        {
          "n": "Scratch Bakery",
          "s": 16.5,
          "sv": -0.6857,
          "sy": -0.4244,
          "m": 0.2571,
          "my": 0.2625,
          "mv": -0.0425,
          "p": 0.0002,
          "w": 7.93
        }
      ]
    },
    {
      "n": "Deli  And  Food To Go",
      "id": "D0036",
      "s": 7131.94,
      "sv": -0.0352,
      "sy": 0.0205,
      "m": 0.5393,
      "my": 0.5501,
      "mv": -0.0237,
      "p": 0.1589,
      "w": 339.54,
      "sub": [
        {
          "n": "Food To Go Deli Sandwiches",
          "s": 464.5,
          "sv": -0.1964,
          "sy": 0.0048,
          "m": 0.6256,
          "my": 0.614,
          "mv": -0.0046,
          "p": 0.0043,
          "w": null
        },
        {
          "n": "Food To Go Prepack",
          "s": 568.33,
          "sv": 1.111,
          "sy": 0.4945,
          "m": 0.3366,
          "my": 0.3577,
          "mv": -0.0796,
          "p": 0.0053,
          "w": 58.1
        },
        {
          "n": "Food To Go Hot Beverages",
          "s": 2721.73,
          "sv": -0.0218,
          "sy": -0.0014,
          "m": 0.5283,
          "my": 0.5329,
          "mv": -0.0187,
          "p": 0.0252,
          "w": null
        },
        {
          "n": "Food To Go Hot Food",
          "s": 3238.88,
          "sv": -0.1016,
          "sy": 0.0161,
          "m": 0.5783,
          "my": 0.5853,
          "mv": -0.007,
          "p": 0.03,
          "w": 129.28
        },
        {
          "n": "Food To Go Pizza",
          "s": 20,
          "sv": null,
          "sy": null,
          "m": 0.5142,
          "my": 0.5142,
          "mv": 0.5142,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Delicatessen Meats & Seafood",
          "s": 72.14,
          "sv": -0.2973,
          "sy": -0.5802,
          "m": 0.4857,
          "my": 0.4746,
          "mv": 0.1457,
          "p": 0.0007,
          "w": null
        },
        {
          "n": "Gourmet To Go Salads & Veg",
          "s": 30.26,
          "sv": -0.0975,
          "sy": 0.2715,
          "m": 0.4347,
          "my": 0.3733,
          "mv": 0.011,
          "p": 0.0003,
          "w": 152.17
        },
        {
          "n": "Meals & Savouries",
          "s": 16.1,
          "sv": -0.2477,
          "sy": 0.0126,
          "m": 0.3569,
          "my": 0.3348,
          "mv": -0.0045,
          "p": 0.0001,
          "w": null
        }
      ]
    },
    {
      "n": "Provisions & Convenience",
      "id": "D0037",
      "s": 497.11,
      "sv": -0.168,
      "sy": -0.0834,
      "m": 0.2254,
      "my": 0.2105,
      "mv": 0.0093,
      "p": 0.0111,
      "w": 95.54,
      "sub": [
        {
          "n": "Prepack Cooked Meats",
          "s": 183,
          "sv": -0.1689,
          "sy": 0.0698,
          "m": 0.1832,
          "my": 0.1921,
          "mv": -0.0304,
          "p": 0.0017,
          "w": null
        },
        {
          "n": "Chilled  Ready Meals",
          "s": 122.55,
          "sv": -0.2447,
          "sy": -0.2508,
          "m": 0.2851,
          "my": 0.2412,
          "mv": 0.0562,
          "p": 0.0011,
          "w": 66.48
        },
        {
          "n": "Chilled Pizza, Pasta & Sauces",
          "s": null,
          "sv": -1,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": -0.3633,
          "p": null,
          "w": null
        },
        {
          "n": "Chilled Convenience Foods",
          "s": 43.79,
          "sv": 0.0243,
          "sy": -0.2417,
          "m": 0.2696,
          "my": 0.2408,
          "mv": 0.0266,
          "p": 0.0004,
          "w": 18.95
        },
        {
          "n": "Prepack Pudding",
          "s": 10.98,
          "sv": 2,
          "sy": 0.0251,
          "m": 0.2809,
          "my": 0.2647,
          "mv": 0,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Prepack Rashers",
          "s": 59.22,
          "sv": 0.0922,
          "sy": -0.0423,
          "m": 0.1802,
          "my": 0.1483,
          "mv": 0.0241,
          "p": 0.0005,
          "w": 10.11
        },
        {
          "n": "Prepack Sausages",
          "s": 65.12,
          "sv": -0.0618,
          "sy": -0.138,
          "m": 0.2307,
          "my": 0.2241,
          "mv": 0.1052,
          "p": 0.0006,
          "w": null
        },
        {
          "n": "Stuffing And Breadcrumbs",
          "s": null,
          "sv": null,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Pp Speciality Convenience Foods",
          "s": 10,
          "sv": null,
          "sy": null,
          "m": 0.25,
          "my": 0.2547,
          "mv": 0.25,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Pp Speciality Cooked Meats",
          "s": 2.45,
          "sv": null,
          "sy": null,
          "m": 0.2102,
          "my": 0.2102,
          "mv": 0.2102,
          "p": 0,
          "w": null
        }
      ]
    },
    {
      "n": "Frozen Foods",
      "id": "D0038",
      "s": 561.59,
      "sv": -0.1207,
      "sy": -0.0087,
      "m": 0.315,
      "my": 0.2928,
      "mv": 0.0415,
      "p": 0.0125,
      "w": null,
      "sub": [
        {
          "n": "Impulse Ice Cream",
          "s": 317.6,
          "sv": -0.1066,
          "sy": -0.2027,
          "m": 0.3609,
          "my": 0.3803,
          "mv": 0.0089,
          "p": 0.0029,
          "w": null
        },
        {
          "n": "Take Home Ice Cream",
          "s": 95.91,
          "sv": 0.6166,
          "sy": 0.6402,
          "m": 0.2442,
          "my": 0.2279,
          "mv": 0.0217,
          "p": 0.0009,
          "w": null
        },
        {
          "n": "Take Home Fruit & Ice",
          "s": 17.05,
          "sv": 0.3806,
          "sy": 0.8242,
          "m": 0.1747,
          "my": 0.1747,
          "mv": -0.029,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Frozen Pizza",
          "s": 58.65,
          "sv": -0.4102,
          "sy": -0.1244,
          "m": 0.3169,
          "my": 0.2618,
          "mv": 0.1214,
          "p": 0.0005,
          "w": null
        },
        {
          "n": "Frozen Pastries & Savouries",
          "s": null,
          "sv": null,
          "sy": -0.107,
          "m": null,
          "my": 0.3455,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Frozen Fish",
          "s": 2.5,
          "sv": -0.9479,
          "sy": -0.7715,
          "m": 0.05,
          "my": 0.05,
          "mv": -0.0128,
          "p": 0,
          "w": null
        },
        {
          "n": "Frozen Poultry Products",
          "s": 38.36,
          "sv": 0.9452,
          "sy": 1.8859,
          "m": 0.2255,
          "my": 0.2126,
          "mv": 0.0336,
          "p": 0.0004,
          "w": null
        },
        {
          "n": "Frozen Vegetarian Foods",
          "s": null,
          "sv": null,
          "sy": null,
          "m": null,
          "my": 0.2091,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Frozen Vegetables",
          "s": 12,
          "sv": -0.2,
          "sy": -0.2317,
          "m": 0.4667,
          "my": 0.4667,
          "mv": 0,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "Frozen Potato",
          "s": 19.52,
          "sv": -0.3351,
          "sy": -0.1407,
          "m": 0.1996,
          "my": 0.183,
          "mv": 0.0277,
          "p": 0.0002,
          "w": null
        }
      ]
    },
    {
      "n": "Non Food - Retail",
      "id": "D0039",
      "s": 441.89,
      "sv": -0.1618,
      "sy": 0.0098,
      "m": 0.3989,
      "my": 0.3968,
      "mv": 0.0233,
      "p": 0.0098,
      "w": null,
      "sub": [
        {
          "n": "Kitchenware",
          "s": null,
          "sv": null,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Seasonal Non Food",
          "s": null,
          "sv": null,
          "sy": 10.0879,
          "m": null,
          "my": -0.0559,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Batteries & Torches",
          "s": 75.99,
          "sv": 4.0728,
          "sy": 0.6912,
          "m": 0.361,
          "my": 0.3701,
          "mv": 0.0029,
          "p": 0.0007,
          "w": null
        },
        {
          "n": "Stationery",
          "s": 2.6,
          "sv": null,
          "sy": -0.5936,
          "m": 0.333,
          "my": 0.2638,
          "mv": 0.333,
          "p": 0,
          "w": null
        },
        {
          "n": "Cards ,Wrap & Named Gift",
          "s": 109.05,
          "sv": 0.6216,
          "sy": -0.1021,
          "m": 0.4901,
          "my": 0.4899,
          "mv": -0.0106,
          "p": 0.001,
          "w": null
        },
        {
          "n": "Car Care",
          "s": 107.7,
          "sv": -0.2942,
          "sy": -0.1092,
          "m": 0.4096,
          "my": 0.4521,
          "mv": -0.0528,
          "p": 0.001,
          "w": null
        },
        {
          "n": "Electrical",
          "s": 81,
          "sv": -0.4774,
          "sy": 0.191,
          "m": 0.3566,
          "my": 0.3461,
          "mv": 0.0035,
          "p": 0.0008,
          "w": null
        },
        {
          "n": "Sports  & Leisure",
          "s": 18,
          "sv": -0.8394,
          "sy": 0.2366,
          "m": 0.2483,
          "my": 0.2395,
          "mv": 0.031,
          "p": 0.0002,
          "w": null
        },
        {
          "n": "Household & Diy",
          "s": 12,
          "sv": null,
          "sy": -0.8744,
          "m": 0.3501,
          "my": 0.33,
          "mv": 0.3501,
          "p": 0.0001,
          "w": null
        },
        {
          "n": "J Hook/Side Racks",
          "s": 35.55,
          "sv": 1.4878,
          "sy": 0.5655,
          "m": 0.3615,
          "my": 0.3727,
          "mv": -0.0101,
          "p": 0.0003,
          "w": null
        },
        {
          "n": "Clothing Basics",
          "s": null,
          "sv": null,
          "sy": -0.8913,
          "m": null,
          "my": 0.3074,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Light Bulbs",
          "s": null,
          "sv": -1,
          "sy": -0.3846,
          "m": null,
          "my": 0.3134,
          "mv": -0.3621,
          "p": null,
          "w": null
        }
      ]
    },
    {
      "n": "Non Food - Expense Items & Consumer Promotions",
      "id": "D0044",
      "s": null,
      "sv": null,
      "sy": -1,
      "m": null,
      "my": null,
      "mv": null,
      "p": null,
      "w": 0.18,
      "sub": [
        {
          "n": "Expense Items",
          "s": null,
          "sv": null,
          "sy": -1,
          "m": null,
          "my": null,
          "mv": null,
          "p": null,
          "w": null
        },
        {
          "n": "Drs Weee And Other Charges",
          "s": null,
          "sv": null,
          "sy": null,
          "m": null,
          "my": null,
          "mv": null,
          "p": null,
          "w": 0.18
        }
      ]
    },
    {
      "n": "Fuel",
      "id": "D0045",
      "s": 776.59,
      "sv": 2.0804,
      "sy": 0.2091,
      "m": -1.1649,
      "my": -0.0774,
      "mv": -1.2649,
      "p": 0.0173,
      "w": null,
      "sub": [
        {
          "n": "Household Fuels",
          "s": 776.59,
          "sv": 2.0804,
          "sy": 0.2091,
          "m": -1.1649,
          "my": -0.0774,
          "mv": -1.2649,
          "p": 0.0072,
          "w": null
        }
      ]
    },
    {
      "n": "News & Mags",
      "id": "D0046",
      "s": 666.14,
      "sv": -0.0054,
      "sy": -0.0491,
      "m": 0.2283,
      "my": 0.2259,
      "mv": -0.0016,
      "p": 0.0148,
      "w": null,
      "sub": [
        {
          "n": "News & Mags",
          "s": 666.14,
          "sv": -0.0054,
          "sy": -0.0491,
          "m": 0.2283,
          "my": 0.2259,
          "mv": -0.0016,
          "p": 0.0062,
          "w": null
        }
      ]
    },
    {
      "n": "Non Food - Instore Services",
      "id": "D0047",
      "s": 3105.1,
      "sv": 0.0216,
      "sy": -0.0487,
      "m": 0.0505,
      "my": 0.0525,
      "mv": 0.0017,
      "p": 0.0692,
      "w": null,
      "sub": [
        {
          "n": "Instore Services",
          "s": 3105.1,
          "sv": 0.0283,
          "sy": -0.0446,
          "m": 0.0505,
          "my": 0.0512,
          "mv": 0.003,
          "p": 0.0288,
          "w": null
        }
      ]
    }
  ],
  "products": [
    {
      "n": "Frank & Honest Reg Coffee (1Pce)",
      "q": 3902,
      "s": 12767.05,
      "m": 4888.24,
      "mp": 0.4346
    },
    {
      "n": "Breakfast Sausages (1Pce)",
      "q": 3809,
      "s": 3618.55,
      "m": 1702.64,
      "mp": 0.5341
    },
    {
      "n": "Frank & Honest Large Coffee (1Pce)",
      "q": 2295,
      "s": 8226,
      "m": 3506.73,
      "mp": 0.4838
    },
    {
      "n": "O'Hara'S Sliced Pan White (800Grm)",
      "q": 1951,
      "s": 5011.49,
      "m": 1889.89,
      "mp": 0.3771
    },
    {
      "n": "Connacht Gold Milk (1Ltr)",
      "q": 1452,
      "s": 2537.86,
      "m": 606.7,
      "mp": 0.2391
    },
    {
      "n": "2Lt Farm Fresh (1Pce)",
      "q": 1420,
      "s": 3754.01,
      "m": 710.47,
      "mp": 0.1893
    },
    {
      "n": "Jambon Ham & Cheese (1Pce)",
      "q": 1330,
      "s": 3258.5,
      "m": 2126.13,
      "mp": 0.7406
    },
    {
      "n": "Centra Milk (2Ltr)",
      "q": 1190,
      "s": 3094,
      "m": 642.6,
      "mp": 0.2077
    },
    {
      "n": "Hash Browns (1Pce)",
      "q": 1078,
      "s": 862.4,
      "m": 608.9,
      "mp": 0.8014
    },
    {
      "n": "Connacht Gold Milk (2Ltr)",
      "q": 1061,
      "s": 3070,
      "m": 640.31,
      "mp": 0.2086
    },
    {
      "n": "Coca Cola Bottle (500Mls)",
      "q": 977,
      "s": 2527.9,
      "m": 953.79,
      "mp": 0.4641
    },
    {
      "n": "Benson & Hedges K/Size (20Pce)",
      "q": 974,
      "s": 18582,
      "m": 1093.92,
      "mp": 0.0724
    },
    {
      "n": "Reg Tea F&H (1Pce)",
      "q": 958,
      "s": 2842.05,
      "m": 2484.85,
      "mp": 0.9923
    },
    {
      "n": "Ct Snack Pack Bananas (6Pce)",
      "q": 920,
      "s": 1830.8,
      "m": 404.8,
      "mp": 0.2211
    },
    {
      "n": "Connacht Gold Low Fat Milk (1Ltr)",
      "q": 839,
      "s": 1465.12,
      "m": 349.25,
      "mp": 0.2384
    },
    {
      "n": "Sausage Rolls Small (1Pce)",
      "q": 766,
      "s": 689.4,
      "m": 438.88,
      "mp": 0.7226
    },
    {
      "n": "Coca Cola Can (330Mls)",
      "q": 749,
      "s": 1307,
      "m": 534.53,
      "mp": 0.503
    },
    {
      "n": "Centra Light Milk (2Ltr)",
      "q": 715,
      "s": 1859,
      "m": 386.1,
      "mp": 0.2077
    },
    {
      "n": "Fyffes Premium Bananas Single (1Pce)",
      "q": 710,
      "s": 603.5,
      "m": 305.3,
      "mp": 0.5059
    },
    {
      "n": "Frank & Honest Flat White (1Pce)",
      "q": 697,
      "s": 2264.02,
      "m": 858.62,
      "mp": 0.4304
    },
    {
      "n": "Lucozade Sport Orange €2.50 (750Mls)",
      "q": 673,
      "s": 1680.3,
      "m": 341.28,
      "mp": 0.2498
    },
    {
      "n": "Monster Energy Ultra Zero Can (500Mls)",
      "q": 660,
      "s": 1578.45,
      "m": 506.18,
      "mp": 0.3944
    },
    {
      "n": "Lowfat Milk (2Ltr)",
      "q": 650,
      "s": 1720.64,
      "m": 325.1,
      "mp": 0.1889
    },
    {
      "n": "Tayto Cheese & Onion Crisps (35Grm)",
      "q": 626,
      "s": 859.42,
      "m": 195.14,
      "mp": 0.2793
    },
    {
      "n": "Centra Still Water (2Ltr)",
      "q": 624,
      "s": 1105.2,
      "m": 575.1,
      "mp": 0.64
    },
    {
      "n": "Plain Scone (120Grm)",
      "q": 616,
      "s": 938.26,
      "m": 340.02,
      "mp": 0.4113
    },
    {
      "n": "Lucozade Energy Original Bottle (380Mls)",
      "q": 599,
      "s": 1146.25,
      "m": 416.54,
      "mp": 0.447
    },
    {
      "n": "Connaht Gold Fresh Milk (3Ltr)",
      "q": 583,
      "s": 2455.67,
      "m": 479.3,
      "mp": 0.1952
    },
    {
      "n": "Red Bull Energy Drink Can (250Ml)",
      "q": 574,
      "s": 1577.75,
      "m": 570.16,
      "mp": 0.4445
    },
    {
      "n": "Centra Still Water (1Ltr)",
      "q": 568,
      "s": 1001,
      "m": 509.94,
      "mp": 0.6266
    },
    {
      "n": "Oharas Hi-Fibre Bran Bread (800Grm)",
      "q": 562,
      "s": 1680.38,
      "m": 640.68,
      "mp": 0.3813
    },
    {
      "n": "West Awake Free Range Large Eggs (6Pce)",
      "q": 560,
      "s": 1400,
      "m": 392,
      "mp": 0.28
    },
    {
      "n": "F&H Reusable Cup .40 Discount (1)",
      "q": 547,
      "s": 0.31,
      "m": -5.16,
      "mp": -16.6452
    },
    {
      "n": "Ct Chicken Breast Fillets (240Grm)",
      "q": 527,
      "s": 1901.9,
      "m": 322.66,
      "mp": 0.1697
    },
    {
      "n": "Coca Cola Zero Can (330Mls)",
      "q": 506,
      "s": 883,
      "m": 395.31,
      "mp": 0.5507
    },
    {
      "n": "Connacht Gold Low Fat Milk (2Ltr)",
      "q": 504,
      "s": 1462.4,
      "m": 308.24,
      "mp": 0.2108
    },
    {
      "n": "Carrolls Big Value Pack Crumbed Ham (245Grm)",
      "q": 504,
      "s": 2016,
      "m": 371.45,
      "mp": 0.1843
    },
    {
      "n": "Corona Extra Bottle (620Mls)",
      "q": 502,
      "s": 1511.5,
      "m": 185.51,
      "mp": 0.151
    },
    {
      "n": "Chicken Fillet Baguette +1 (1Pce)",
      "q": 492,
      "s": 2453,
      "m": 1255.95,
      "mp": 0.5811
    },
    {
      "n": "Ct Irish Closed Cup Mushrooms (200Grm)",
      "q": 486,
      "s": 582.25,
      "m": 155.39,
      "mp": 0.2669
    },
    {
      "n": "Connacht Gold Milk Bottle (500Mls)",
      "q": 472,
      "s": 441.55,
      "m": 111.15,
      "mp": 0.2517
    },
    {
      "n": "Breakfast Roll Large 2 Fill (1Pce)",
      "q": 448,
      "s": 1568,
      "m": 887.49,
      "mp": 0.6169
    },
    {
      "n": "Hanley'S  Coleslaw (220Grm)",
      "q": 446,
      "s": 1070.4,
      "m": 223,
      "mp": 0.2083
    },
    {
      "n": "Cadbury Dairymilk (53Grm)",
      "q": 446,
      "s": 1037.25,
      "m": 370.51,
      "mp": 0.4394
    },
    {
      "n": "Large Tea F&H (1Pce)",
      "q": 433,
      "s": 1287.55,
      "m": 1125.75,
      "mp": 0.9924
    },
    {
      "n": "Cooked Bacon (1Pce)",
      "q": 425,
      "s": 361.25,
      "m": 131.28,
      "mp": 0.4125
    },
    {
      "n": "Sausage Rolls Multibuy 5 For €3.80 (1Pce)",
      "q": 420,
      "s": 1596,
      "m": 952.57,
      "mp": 0.6774
    },
    {
      "n": "Chips (1Pce)",
      "q": 419,
      "s": 838,
      "m": 411.51,
      "mp": 0.5574
    },
    {
      "n": "O'Hara Sliced Buttermilk Soda (550Grm)",
      "q": 413,
      "s": 1314.4,
      "m": 495.04,
      "mp": 0.3766
    },
    {
      "n": "Centra Bag Carrots [Irish] (850Grm)",
      "q": 411,
      "s": 515.26,
      "m": 108.85,
      "mp": 0.2113
    },
    {
      "n": "Silk Cut Purp Kingsize (20Pce)",
      "q": 409,
      "s": 7806.5,
      "m": 460.02,
      "mp": 0.0725
    },
    {
      "n": "Firestarter Log Unknown",
      "q": 403,
      "s": 870.5,
      "m": 404.26,
      "mp": 0.5271
    },
    {
      "n": "Centra Deli Style Crumbed Ham (100G)",
      "q": 398,
      "s": 795,
      "m": 182.53,
      "mp": 0.2296
    },
    {
      "n": "Lucozade Energy Orig Btl €2.20 (500Mls)",
      "q": 397,
      "s": 873.4,
      "m": 211.49,
      "mp": 0.2978
    },
    {
      "n": "Mayfair King Size Original (20Pck)",
      "q": 386,
      "s": 6687,
      "m": 394.14,
      "mp": 0.0725
    },
    {
      "n": "Coca-Cola Zero Bottle (500Mls)",
      "q": 385,
      "s": 958,
      "m": 402.19,
      "mp": 0.5164
    },
    {
      "n": "Chicken Fillet Baguette +2 (1Pce)",
      "q": 384,
      "s": 2097,
      "m": 1025.82,
      "mp": 0.5552
    },
    {
      "n": "Mallons Sausages (454Grm)",
      "q": 383,
      "s": 1614.88,
      "m": 422.22,
      "mp": 0.2615
    },
    {
      "n": "Rizla Cig Papers Grn (1Pce)",
      "q": 379,
      "s": 227.4,
      "m": 98.09,
      "mp": 0.5305
    },
    {
      "n": "Keoghs Rooster Potatoes (2Kgm)",
      "q": 370,
      "s": 1476.3,
      "m": 295.26,
      "mp": 0.2
    },
    {
      "n": "Sligo Champion (1Pce)",
      "q": 368,
      "s": 1396.2,
      "m": 231.65,
      "mp": 0.1659
    },
    {
      "n": "Sligo Weekender (1Pce)",
      "q": 363,
      "s": 1089,
      "m": 185.13,
      "mp": 0.17
    },
    {
      "n": "Breakfast Roll 4 Items (1Pce)",
      "q": 360,
      "s": 1620,
      "m": 700.11,
      "mp": 0.4905
    },
    {
      "n": "Rockfort Commercial Eggs Large (6Pce)",
      "q": 360,
      "s": 669.6,
      "m": 102.6,
      "mp": 0.1532
    },
    {
      "n": "Centra Still Water (500Mls)",
      "q": 358,
      "s": 483.3,
      "m": 229.44,
      "mp": 0.5839
    },
    {
      "n": "Breakfast Roll 3 Items (1Pce)",
      "q": 355,
      "s": 1420,
      "m": 672.45,
      "mp": 0.5375
    },
    {
      "n": "All Butter Croissant (70Grm)",
      "q": 348,
      "s": 545.06,
      "m": 274.91,
      "mp": 0.5725
    },
    {
      "n": "Red Bull Energy Drink Can (355Ml)",
      "q": 330,
      "s": 1186.95,
      "m": 353.94,
      "mp": 0.3668
    },
    {
      "n": "O'Haras Of Foxford 100% Wholemeal (800Grm)",
      "q": 327,
      "s": 914.93,
      "m": 326.33,
      "mp": 0.3567
    },
    {
      "n": "Dairygold Original (454Grm)",
      "q": 326,
      "s": 1102.18,
      "m": 116.14,
      "mp": 0.1054
    },
    {
      "n": "Brady Family Familypack Crumb Ham (120Grm)",
      "q": 325,
      "s": 1300,
      "m": 213.15,
      "mp": 0.164
    },
    {
      "n": "Jameson (70Cl)",
      "q": 321,
      "s": 8394,
      "m": 249.54,
      "mp": 0.0366
    },
    {
      "n": "Breakfast Muffin Sausage Egg Cheese (1Pce)",
      "q": 319,
      "s": 1245.04,
      "m": 427.05,
      "mp": 0.3893
    },
    {
      "n": "Connacht Gold Skimmed Milk (1Ltr)",
      "q": 318,
      "s": 545.12,
      "m": 122.18,
      "mp": 0.2241
    },
    {
      "n": "3 Sausage Rolls (1Pce)",
      "q": 318,
      "s": 699.6,
      "m": 409.69,
      "mp": 0.6647
    },
    {
      "n": "Connacht Gold Fresh Crm Botl (250)",
      "q": 317,
      "s": 676.53,
      "m": 166.16,
      "mp": 0.2456
    },
    {
      "n": "Guinness Draught Stout Can 8 Pack (500Mls)",
      "q": 316,
      "s": 4632.34,
      "m": 496.1,
      "mp": 0.1317
    },
    {
      "n": "Zip Hp Firelighters 60Pk €5 (60Pck)",
      "q": 303,
      "s": 1515,
      "m": 383.73,
      "mp": 0.2875
    },
    {
      "n": "Extra Peppermint 10Pce (14Grm)",
      "q": 302,
      "s": 435.45,
      "m": 171.08,
      "mp": 0.4832
    },
    {
      "n": "Chicken Fillet Baguette + 3 (1Pce)",
      "q": 299,
      "s": 1770,
      "m": 874.76,
      "mp": 0.5609
    },
    {
      "n": "Ct Loose Lemon (1Pce)",
      "q": 295,
      "s": 176.65,
      "m": 62.41,
      "mp": 0.3533
    },
    {
      "n": "Breakfast Roll 5 Items (1Pce)",
      "q": 289,
      "s": 1445,
      "m": 648.89,
      "mp": 0.5097
    },
    {
      "n": ":Denny Luncheon Roll (90Grm)",
      "q": 289,
      "s": 334.5,
      "m": 47.79,
      "mp": 0.1429
    },
    {
      "n": "Ct Free Range Eggs Large (6Pce)",
      "q": 288,
      "s": 950.4,
      "m": 219.69,
      "mp": 0.2312
    },
    {
      "n": "Coca Cola Bottle (2Ltr)",
      "q": 284,
      "s": 896.5,
      "m": 54.36,
      "mp": 0.0746
    },
    {
      "n": "Amber Leaf Original (30Grm)",
      "q": 282,
      "s": 7661.7,
      "m": 485.51,
      "mp": 0.0779
    },
    {
      "n": "Centra Irish Creamery Butter (454Grm)",
      "q": 281,
      "s": 952.59,
      "m": 71.46,
      "mp": 0.075
    },
    {
      "n": "Cadbury Wispa (36Grm)",
      "q": 280,
      "s": 583.8,
      "m": 246.81,
      "mp": 0.52
    },
    {
      "n": "Ecobrite (1Pce)",
      "q": 273,
      "s": 4095,
      "m": 721.59,
      "mp": 0.2
    },
    {
      "n": "Garlanna Irish Made Cards Code 55 (1Pce)",
      "q": 270,
      "s": 877.5,
      "m": 357.01,
      "mp": 0.5004
    },
    {
      "n": "Roast Dinner Small (1Pce)",
      "q": 268,
      "s": 1893,
      "m": 1060.39,
      "mp": 0.6358
    },
    {
      "n": "Inspired By Centra Blueberries (125Grm)",
      "q": 266,
      "s": 816.25,
      "m": 193.81,
      "mp": 0.2374
    },
    {
      "n": "Fried Egg (1Pce)",
      "q": 265,
      "s": 132.5,
      "m": 64.14,
      "mp": 0.5277
    },
    {
      "n": "Ishka Still Water (5)",
      "q": 265,
      "s": 516.75,
      "m": 129.95,
      "mp": 0.3093
    },
    {
      "n": "Hot Dog Lattice (1Pce)",
      "q": 261,
      "s": 522,
      "m": 138.56,
      "mp": 0.3013
    },
    {
      "n": "Cadbury Dairymilk (47Grm)",
      "q": 256,
      "s": 580,
      "m": 192.48,
      "mp": 0.4082
    },
    {
      "n": "Monster Juiced Mango Loco Enrg Can (500Mls)",
      "q": 256,
      "s": 632.15,
      "m": 213.09,
      "mp": 0.4146
    },
    {
      "n": "Irish Farmers Journal (1Pce)",
      "q": 253,
      "s": 1037.3,
      "m": 259.32,
      "mp": 0.25
    },
    {
      "n": "Connacht Gold L/Fat Milk (500Mls)",
      "q": 250,
      "s": 234.4,
      "m": 59.4,
      "mp": 0.2534
    },
    {
      "n": "Cadbury Dairymilk Golden Crisp (54Grm)",
      "q": 249,
      "s": 578.7,
      "m": 197.36,
      "mp": 0.4195
    },
    {
      "n": "Magiflame Smokeless Coal (20Kgm)",
      "q": 249,
      "s": 3979,
      "m": 48.71,
      "mp": 0.0139
    },
    {
      "n": "Roast Dinner (1Pce)",
      "q": 246,
      "s": 2198.25,
      "m": 1198.78,
      "mp": 0.619
    },
    {
      "n": "Mllr Rce Sberrysingle Pot (170Grm)",
      "q": 245,
      "s": 252.38,
      "m": 45.36,
      "mp": 0.1797
    },
    {
      "n": "Coca Cola Zero Bottle (2Ltr)",
      "q": 240,
      "s": 544.9,
      "m": 14.07,
      "mp": 0.0318
    },
    {
      "n": "Monster Energy Original Can (500Mls)",
      "q": 240,
      "s": 587.85,
      "m": 194.86,
      "mp": 0.4077
    },
    {
      "n": "Black/White Pudding (1Pce)",
      "q": 239,
      "s": 107.55,
      "m": 32.62,
      "mp": 0.3442
    },
    {
      "n": "West Awake Large Eggs 6'S (6Pce)",
      "q": 239,
      "s": 454.1,
      "m": 143.4,
      "mp": 0.3158
    },
    {
      "n": "Smirnoff Vodka Red (70Cl)",
      "q": 238,
      "s": 5454.5,
      "m": 297.51,
      "mp": 0.0671
    },
    {
      "n": "Volvic Still Natural Mineral Water (1Ltr)",
      "q": 232,
      "s": 566.05,
      "m": 231.59,
      "mp": 0.5032
    },
    {
      "n": "Zip Kiln Dried Logs (7Kg)",
      "q": 232,
      "s": 2187.6,
      "m": 373,
      "mp": 0.1935
    },
    {
      "n": "Connacht Gold Low Fat Butter (454Grm)",
      "q": 229,
      "s": 1119.81,
      "m": 112.02,
      "mp": 0.1
    },
    {
      "n": "Demi Baguettes (4Pce)",
      "q": 228,
      "s": 519.8,
      "m": 282.68,
      "mp": 0.5438
    },
    {
      "n": "Centra Ice Cubes (1.8Kgm)",
      "q": 227,
      "s": 351.85,
      "m": 49.98,
      "mp": 0.1747
    },
    {
      "n": "Cadbury D/Milk Turkish (47Grm)",
      "q": 224,
      "s": 517.75,
      "m": 182.18,
      "mp": 0.4328
    },
    {
      "n": "Major'S (25Pce)",
      "q": 224,
      "s": 5331.2,
      "m": 362.23,
      "mp": 0.0836
    },
    {
      "n": "Centra Firelighters 60'S (60Pce)",
      "q": 223,
      "s": 936.6,
      "m": 82.61,
      "mp": 0.1001
    },
    {
      "n": "Ct Mozzarella & Cheddar Grated (200Grm)",
      "q": 223,
      "s": 557.5,
      "m": 193.73,
      "mp": 0.3475
    },
    {
      "n": "Centra Loose Orange (1)",
      "q": 221,
      "s": 132.6,
      "m": 39.78,
      "mp": 0.3
    },
    {
      "n": "Linden Village Cider Bottle (1Ltr)",
      "q": 221,
      "s": 994.5,
      "m": 89.92,
      "mp": 0.1112
    },
    {
      "n": "Wrigleys Extra Spearment 10Pk (14Grm)",
      "q": 219,
      "s": 315.65,
      "m": 122.68,
      "mp": 0.478
    },
    {
      "n": "All Butter Bramley Apple Tart (800Grm)",
      "q": 219,
      "s": 1011.25,
      "m": 215.72,
      "mp": 0.2421
    },
    {
      "n": "Centra Onions Net (600Grm)",
      "q": 218,
      "s": 304.14,
      "m": 68.53,
      "mp": 0.2253
    },
    {
      "n": "Keelings Strawberries (227Grm)",
      "q": 217,
      "s": 636.92,
      "m": 129.14,
      "mp": 0.2028
    },
    {
      "n": "Marlboro Gold (20Pce)",
      "q": 212,
      "s": 3964.4,
      "m": 254.67,
      "mp": 0.079
    },
    {
      "n": "Inspired By Clemengold Net (650G)",
      "q": 211,
      "s": 557,
      "m": 135.55,
      "mp": 0.2434
    },
    {
      "n": "Centra Peppers (2Pce)",
      "q": 210,
      "s": 383.25,
      "m": 77.69,
      "mp": 0.2027
    },
    {
      "n": "Sunday World (South Ed) (1Pce)",
      "q": 209,
      "s": 689.7,
      "m": 175.43,
      "mp": 0.2544
    },
    {
      "n": "Tayto Waffles (31Grm)",
      "q": 209,
      "s": 283.9,
      "m": 78.1,
      "mp": 0.3384
    },
    {
      "n": "Western People (1Pce)",
      "q": 208,
      "s": 765.4,
      "m": 97.01,
      "mp": 0.1267
    },
    {
      "n": "Mllr Rice Orig Single Pot (180Grm)",
      "q": 205,
      "s": 209.75,
      "m": 36.53,
      "mp": 0.1741
    },
    {
      "n": "Ct Chocolate Wafer Bars 9Pk (19Grm)",
      "q": 205,
      "s": 325.95,
      "m": 41.21,
      "mp": 0.1555
    },
    {
      "n": "Extra Cool Breeze 10 Pce (14Grm)",
      "q": 202,
      "s": 290.85,
      "m": 116.01,
      "mp": 0.4906
    },
    {
      "n": "Rizla Cig Papers Blue (1Pce)",
      "q": 201,
      "s": 120.6,
      "m": 52.02,
      "mp": 0.5305
    },
    {
      "n": "Lucozade Energy Orange Bottle (380Mls)",
      "q": 200,
      "s": 371.25,
      "m": 132.27,
      "mp": 0.4382
    },
    {
      "n": "Jps Blue Kingsize (20Pce)",
      "q": 200,
      "s": 3390,
      "m": 216.1,
      "mp": 0.0784
    },
    {
      "n": "Keoghs Easy Cook Baby New Potatoes (400Grm)",
      "q": 199,
      "s": 232.51,
      "m": 45.73,
      "mp": 0.1967
    },
    {
      "n": "7Up Zero Lemon & Lime Bottle (2Ltr)",
      "q": 198,
      "s": 480.6,
      "m": 14.27,
      "mp": 0.0365
    },
    {
      "n": "Ct Butterhead Lettuce (1Pce)",
      "q": 198,
      "s": 255.42,
      "m": 58.74,
      "mp": 0.23
    },
    {
      "n": "Ballygowan Still Water (1Ltr)",
      "q": 197,
      "s": 432.1,
      "m": 160.38,
      "mp": 0.4565
    },
    {
      "n": "Regular Fresh Soup (12Oz) (1Pce)",
      "q": 195,
      "s": 534.95,
      "m": 243.17,
      "mp": 0.5159
    },
    {
      "n": "Ct Dog Can Chicken In Jelly (400Grm)",
      "q": 193,
      "s": 144.75,
      "m": 11.86,
      "mp": 0.1007
    },
    {
      "n": "Ct Mixed Grape Punnet (500Grm)",
      "q": 193,
      "s": 593.2,
      "m": 130,
      "mp": 0.2192
    },
    {
      "n": "Mallons Sausages (227Grm)",
      "q": 193,
      "s": 430.99,
      "m": 140.09,
      "mp": 0.325
    },
    {
      "n": "Lomza Export Lager Bottle (500Mls)",
      "q": 193,
      "s": 472.85,
      "m": 90.2,
      "mp": 0.2346
    },
    {
      "n": "Cadburys Creme Egg Single (40Grm)",
      "q": 192,
      "s": 263.1,
      "m": 67.62,
      "mp": 0.3161
    },
    {
      "n": "Bulmers Original Cider Can 8Pk (500Mls)",
      "q": 192,
      "s": 3063,
      "m": 325.22,
      "mp": 0.1306
    },
    {
      "n": "Centra Chocolate Chip Cookies (150Grm)",
      "q": 192,
      "s": 305.28,
      "m": 73.48,
      "mp": 0.2732
    },
    {
      "n": "Cadbury Dairymilk Caramello (47Grm)",
      "q": 192,
      "s": 448.55,
      "m": 160.31,
      "mp": 0.4396
    },
    {
      "n": "Cadbury Dairymilk Wholenut (55Grm)",
      "q": 192,
      "s": 451.05,
      "m": 160.85,
      "mp": 0.4386
    },
    {
      "n": "Lucozade Energy Original Btl (500Mls)",
      "q": 191,
      "s": 544.35,
      "m": 147.78,
      "mp": 0.3339
    },
    {
      "n": "Cadbury D/Milk Mint Crisp (54Grm)",
      "q": 191,
      "s": 442.1,
      "m": 156.12,
      "mp": 0.4344
    },
    {
      "n": "Centra Chocolate Butter Biscuits (125)",
      "q": 191,
      "s": 418.29,
      "m": 55.95,
      "mp": 0.1645
    },
    {
      "n": "Centra Milk Chocolate Rice Cakes (100Grm)",
      "q": 190,
      "s": 228,
      "m": 48.33,
      "mp": 0.212
    },
    {
      "n": "Oharas Wheatgerm Bread (650Grm)",
      "q": 187,
      "s": 523.15,
      "m": 201.51,
      "mp": 0.3852
    },
    {
      "n": "Centra Tomato Tray (4Pce)",
      "q": 187,
      "s": 224.25,
      "m": 47,
      "mp": 0.2096
    },
    {
      "n": "Inspired By Avocado Ripe & Ready (1Pce)",
      "q": 186,
      "s": 213.14,
      "m": 50.83,
      "mp": 0.2385
    },
    {
      "n": "Red Bull Vanilla Berry Edition (250Mls)",
      "q": 186,
      "s": 483.3,
      "m": 140.78,
      "mp": 0.3583
    },
    {
      "n": "Look O Look Hanging Bags (110Grm)",
      "q": 184,
      "s": 531.76,
      "m": 131.06,
      "mp": 0.3031
    },
    {
      "n": "Tayto Salt & Vinegar Crisps (35Grm)",
      "q": 183,
      "s": 248.28,
      "m": 69.71,
      "mp": 0.3453
    },
    {
      "n": "Centra Light Milk (3Ltr)",
      "q": 182,
      "s": 684.32,
      "m": 153.79,
      "mp": 0.2247
    },
    {
      "n": "Lucozade Energy Orange Btl €2.20 (500Mls)",
      "q": 182,
      "s": 400.4,
      "m": 90.59,
      "mp": 0.2783
    },
    {
      "n": "Centra Sparkling Water (2L)",
      "q": 181,
      "s": 289.2,
      "m": 120.79,
      "mp": 0.5137
    },
    {
      "n": "Garlanna Cards Price Code 73 (1Pce)",
      "q": 180,
      "s": 675,
      "m": 275.18,
      "mp": 0.5014
    },
    {
      "n": "1 Meat Sandwich (1Pce)",
      "q": 180,
      "s": 810,
      "m": 547.2,
      "mp": 0.6756
    },
    {
      "n": "Doritos Chilli Heatwave (140Grm)",
      "q": 180,
      "s": 593.5,
      "m": 168.37,
      "mp": 0.3489
    },
    {
      "n": "1 Meat & 2 Salads Sandwich (1Pce)",
      "q": 179,
      "s": 895,
      "m": 515.52,
      "mp": 0.576
    },
    {
      "n": "Hot Breaded Chicken Fillet (1Pce)",
      "q": 178,
      "s": 712,
      "m": 436.85,
      "mp": 0.6964
    },
    {
      "n": "Centra Milk Choc Digestive (300Grm)",
      "q": 178,
      "s": 222.5,
      "m": 19.95,
      "mp": 0.1103
    },
    {
      "n": "Whiskas Core 1+ Chicken In Jelly (85Grm)",
      "q": 177,
      "s": 185.85,
      "m": 82.44,
      "mp": 0.5456
    },
    {
      "n": "Cadbury Mini Egg Bag (74Grm)",
      "q": 177,
      "s": 531,
      "m": 96.73,
      "mp": 0.2241
    },
    {
      "n": "Carlsberg Danish Pilsner Lager 8Pk (500Mls)",
      "q": 176,
      "s": 2704,
      "m": 285.79,
      "mp": 0.13
    },
    {
      "n": "1 Meat & 1 Salad Sandwich (1Pce)",
      "q": 176,
      "s": 792,
      "m": 462.88,
      "mp": 0.5844
    },
    {
      "n": "Zip Kindling (2Kgm)",
      "q": 176,
      "s": 875.86,
      "m": 160.96,
      "mp": 0.2086
    },
    {
      "n": "Meadowfields Pork Chops (450Grm)",
      "q": 176,
      "s": 591.36,
      "m": 63.8,
      "mp": 0.1079
    },
    {
      "n": "Bic J26 Standard Lighters (1Pce)",
      "q": 175,
      "s": 285.25,
      "m": 115.25,
      "mp": 0.497
    },
    {
      "n": "Danish Cinnamon Swirl (93Grm)",
      "q": 175,
      "s": 277.86,
      "m": 138.06,
      "mp": 0.5639
    },
    {
      "n": "Love Sweets Mix Up (230Grm)",
      "q": 175,
      "s": 350,
      "m": 85.35,
      "mp": 0.2999
    },
    {
      "n": "Centra Premium Roast Turkey Slice (100Grm)",
      "q": 175,
      "s": 535.25,
      "m": 141.32,
      "mp": 0.264
    },
    {
      "n": "Rowntree Fruit Pastilles Vegan (48Grm)",
      "q": 174,
      "s": 204.55,
      "m": 80.26,
      "mp": 0.4826
    },
    {
      "n": "Centra Rich Tea Biscuits (300Grm)",
      "q": 174,
      "s": 174,
      "m": 32.47,
      "mp": 0.2118
    },
    {
      "n": "Tayto Snax Cheese & Onion (26Grm)",
      "q": 173,
      "s": 226.68,
      "m": 41.72,
      "mp": 0.2264
    },
    {
      "n": "Centra Digestive Biscuits (400Grm)",
      "q": 173,
      "s": 173,
      "m": 31.93,
      "mp": 0.2095
    },
    {
      "n": "Rindless Rasher Jim Feeney Unknown",
      "q": 173,
      "s": 621.07,
      "m": 136.67,
      "mp": 0.2201
    },
    {
      "n": "Maple Pecan Plait (98Grm)",
      "q": 170,
      "s": 246.5,
      "m": 103.32,
      "mp": 0.4757
    },
    {
      "n": "Cadburys Snack Sandwich (22Grm)",
      "q": 169,
      "s": 272.55,
      "m": 92.55,
      "mp": 0.4177
    },
    {
      "n": "Kerrygold Creamery Butter (227Grm)",
      "q": 169,
      "s": 529.31,
      "m": 43.2,
      "mp": 0.0816
    },
    {
      "n": "Large Petit Pain (5Pce)",
      "q": 168,
      "s": 379.45,
      "m": 166.09,
      "mp": 0.4377
    },
    {
      "n": "Db Jumbo Kitchen Towel (2Roll)",
      "q": 168,
      "s": 258.72,
      "m": 51.75,
      "mp": 0.246
    },
    {
      "n": "Kinsale Bay Cottage Pie (400)",
      "q": 167,
      "s": 997.34,
      "m": 197.13,
      "mp": 0.1977
    },
    {
      "n": "Irish Pride Sandwich Pan Sliced. (800Grm)",
      "q": 164,
      "s": 364.2,
      "m": 98.8,
      "mp": 0.2713
    },
    {
      "n": "Spicy Wedges (1Pce)",
      "q": 164,
      "s": 524.8,
      "m": 386.94,
      "mp": 0.8368
    },
    {
      "n": "Minor Figures Chilled Everyday Oat (Iltr)",
      "q": 164,
      "s": 490.36,
      "m": 230.15,
      "mp": 0.4693
    },
    {
      "n": "Jam Donut Multibuy 5 For 3 (5Pce)",
      "q": 163,
      "s": 531.85,
      "m": 183.34,
      "mp": 0.3913
    },
    {
      "n": "Centra Deli Style Trad Ham (100G)",
      "q": 162,
      "s": 324,
      "m": 74.7,
      "mp": 0.2306
    },
    {
      "n": "Ct Home Style Oven Chips (1.5Kgm)",
      "q": 161,
      "s": 379.8,
      "m": 65.37,
      "mp": 0.1721
    },
    {
      "n": "Diet Coke Bottle (500Mls)",
      "q": 161,
      "s": 399.2,
      "m": 168.02,
      "mp": 0.5177
    },
    {
      "n": "Irish Pride Big Toast Sliced White. (800Grm)",
      "q": 161,
      "s": 408.97,
      "m": 129.74,
      "mp": 0.3172
    },
    {
      "n": "Inspired Free Range Corn Fed Eggs (6Pce)",
      "q": 159,
      "s": 429.1,
      "m": 129.18,
      "mp": 0.301
    },
    {
      "n": "Casillero Del Diablo Sauv (75Cl)",
      "q": 158,
      "s": 1392,
      "m": 117.01,
      "mp": 0.1034
    },
    {
      "n": "Inspired By Raspberry (125Grm)",
      "q": 158,
      "s": 468.14,
      "m": 98.42,
      "mp": 0.2102
    },
    {
      "n": "Firelog (1Pce)",
      "q": 157,
      "s": 345.4,
      "m": 95.11,
      "mp": 0.3126
    },
    {
      "n": "Centra Yogurt Rice Cakes (100Grm)",
      "q": 157,
      "s": 188.4,
      "m": 39.94,
      "mp": 0.212
    },
    {
      "n": "Cadburys Twirl (43Grm)",
      "q": 156,
      "s": 353.65,
      "m": 151.94,
      "mp": 0.5285
    },
    {
      "n": "Mllr Rce Apple In Syrup Sngl Pot (170Grm)",
      "q": 156,
      "s": 162.59,
      "m": 30.77,
      "mp": 0.1892
    },
    {
      "n": "Benson & Hedges Gold Ks (26Pce)",
      "q": 156,
      "s": 3736.2,
      "m": 217.28,
      "mp": 0.0715
    },
    {
      "n": "Centra Soft Mega Toilet Tissue (6Roll)",
      "q": 156,
      "s": 444.6,
      "m": 36.2,
      "mp": 0.1002
    },
    {
      "n": "Centra Swede Loose (1)",
      "q": 155,
      "s": 211.55,
      "m": 43.22,
      "mp": 0.2043
    },
    {
      "n": "Tayto Mighty Munch (31Grm)",
      "q": 154,
      "s": 209.64,
      "m": 60.86,
      "mp": 0.3571
    },
    {
      "n": "Hb Brunch (95Mls)",
      "q": 152,
      "s": 370.1,
      "m": 128.83,
      "mp": 0.4282
    },
    {
      "n": "Ct Mild Rasher (Promo) 25% Ef (250Grm)",
      "q": 152,
      "s": 501.56,
      "m": 68.74,
      "mp": 0.1371
    },
    {
      "n": "Centra York Cabbage (1Pce)",
      "q": 151,
      "s": 217.08,
      "m": 54.22,
      "mp": 0.2498
    },
    {
      "n": "1 Meat & 3 Salads Sandwich (1Pce)",
      "q": 151,
      "s": 830.5,
      "m": 498.3,
      "mp": 0.6
    },
    {
      "n": "Tayto Cheese & Onion 10Pk €4 (25Grm)",
      "q": 151,
      "s": 604,
      "m": 66.41,
      "mp": 0.1352
    },
    {
      "n": "Denny Gold Medal 8 Skinless Sausage (227Grm)",
      "q": 150,
      "s": 381.7,
      "m": 70.64,
      "mp": 0.1851
    },
    {
      "n": "Cadbury D/Milk Frt & Nut (54Grm)",
      "q": 150,
      "s": 346.35,
      "m": 121.23,
      "mp": 0.4305
    },
    {
      "n": "Centra Organic Carrots Bag (750Grm)",
      "q": 150,
      "s": 300,
      "m": 95,
      "mp": 0.3167
    },
    {
      "n": "Cg Low Fat Milk (3Ltr)",
      "q": 150,
      "s": 585,
      "m": 117,
      "mp": 0.2
    },
    {
      "n": "Pringles Sour Cream & Onion Crisps (165Grm)",
      "q": 150,
      "s": 345,
      "m": 58.18,
      "mp": 0.2074
    },
    {
      "n": "Sunday Independent (1Pce)",
      "q": 150,
      "s": 705,
      "m": 175.48,
      "mp": 0.2489
    },
    {
      "n": "Pepsi Max Can (330Mls)",
      "q": 149,
      "s": 251.9,
      "m": 90.38,
      "mp": 0.4413
    },
    {
      "n": "Nestle Milkybar Discs Bag (30Grm)",
      "q": 149,
      "s": 217.3,
      "m": 61.62,
      "mp": 0.3488
    },
    {
      "n": "Lucozade Energy Orig Btl 4 Pack €5 (380Mls)",
      "q": 149,
      "s": 745,
      "m": 157.13,
      "mp": 0.2594
    },
    {
      "n": "Centra Skyr Natural Icelandic Yogrt (500G)",
      "q": 149,
      "s": 177.31,
      "m": 26.82,
      "mp": 0.1513
    },
    {
      "n": "7Up Zero Bottle (500Ml)",
      "q": 148,
      "s": 367,
      "m": 141,
      "mp": 0.4726
    },
    {
      "n": "Centra Soft Toilet Tissue (4Roll)",
      "q": 148,
      "s": 288.6,
      "m": 23.44,
      "mp": 0.0999
    },
    {
      "n": "7Up Lemon & Lime Bottle (2Ltr)",
      "q": 147,
      "s": 357,
      "m": 10.98,
      "mp": 0.0378
    },
    {
      "n": "Ct Cherry Tomatoes Punnet (250Grm)",
      "q": 146,
      "s": 192.02,
      "m": 43.55,
      "mp": 0.2268
    },
    {
      "n": "Jelly Tots (42Grm)",
      "q": 146,
      "s": 168.65,
      "m": 62.56,
      "mp": 0.4562
    },
    {
      "n": "Daily Basics Irl 24S Block (1Pce)",
      "q": 146,
      "s": 156.36,
      "m": 46.33,
      "mp": 0.3363
    },
    {
      "n": "Galtee Value Smoke Rash 10Pk €3.50 (300Grm)",
      "q": 144,
      "s": 504,
      "m": 36,
      "mp": 0.0714
    },
    {
      "n": "Kit Kat Standard (41.5Grm)",
      "q": 143,
      "s": 253.7,
      "m": 86.19,
      "mp": 0.4179
    },
    {
      "n": "Extra White Bubblemint Gum 10Pce (14Grm)",
      "q": 143,
      "s": 207.35,
      "m": 86.35,
      "mp": 0.5122
    },
    {
      "n": "Breakfast Roll 6 Items (1Pce)",
      "q": 142,
      "s": 781,
      "m": 344.47,
      "mp": 0.5006
    },
    {
      "n": "Pringles Salt & Vinegar (165)",
      "q": 142,
      "s": 333.5,
      "m": 60.91,
      "mp": 0.2246
    },
    {
      "n": "Tayto Hunky Dory Ch Cheese Sp Onion (37Grm)",
      "q": 141,
      "s": 209.99,
      "m": 44.11,
      "mp": 0.2583
    },
    {
      "n": "Hot Wrap Chicken (1Pce)",
      "q": 141,
      "s": 564,
      "m": 299.52,
      "mp": 0.6028
    },
    {
      "n": "Centra Broccoli Crown (350Grm)",
      "q": 141,
      "s": 255,
      "m": 65.06,
      "mp": 0.2552
    },
    {
      "n": "Tayto Hunky Dorys Cheese & Onion (130Grm)",
      "q": 140,
      "s": 388.9,
      "m": 84.71,
      "mp": 0.2679
    },
    {
      "n": "Tayto Hunky Dorys Sour Cream & Onio (37Grm)",
      "q": 138,
      "s": 206.07,
      "m": 52.03,
      "mp": 0.3106
    },
    {
      "n": "Centra Ginger Nuts (300G)",
      "q": 138,
      "s": 164.22,
      "m": 19.05,
      "mp": 0.1317
    },
    {
      "n": "Centra Pink Lady Apple Tray (4Pce)",
      "q": 136,
      "s": 288,
      "m": 67.82,
      "mp": 0.2355
    },
    {
      "n": "Ct Oranges Loose Large (1Pce)",
      "q": 136,
      "s": 81.6,
      "m": 24.48,
      "mp": 0.3
    },
    {
      "n": "Centra Still Water (5Ltr)",
      "q": 136,
      "s": 319.6,
      "m": 77.6,
      "mp": 0.2986
    },
    {
      "n": "Caffreys Snowballs (30Grm)",
      "q": 135,
      "s": 128.25,
      "m": 41.46,
      "mp": 0.3976
    },
    {
      "n": "Carroll'S Roast Chicken Pieces (100Grm)",
      "q": 135,
      "s": 359,
      "m": 74.15,
      "mp": 0.2065
    },
    {
      "n": "Apple Lattice (4Pce)",
      "q": 134,
      "s": 301.25,
      "m": 38.96,
      "mp": 0.1468
    },
    {
      "n": "Hb Vanilla Ice Cream Pint Block (568Mls)",
      "q": 133,
      "s": 287.8,
      "m": 37.93,
      "mp": 0.1621
    },
    {
      "n": "Diet Coke Bottle (2Ltr)",
      "q": 133,
      "s": 302.75,
      "m": 29.44,
      "mp": 0.1196
    },
    {
      "n": "Hb Maxi Twist Sbery &Lime Ice Cream (180Mls)",
      "q": 133,
      "s": 357.35,
      "m": 87.26,
      "mp": 0.3004
    },
    {
      "n": "Centra Coleslaw (250Grm)",
      "q": 133,
      "s": 196.5,
      "m": 48.04,
      "mp": 0.2445
    },
    {
      "n": "Centra Smooth Caramel Bars (216Grm)",
      "q": 132,
      "s": 310.2,
      "m": 64.76,
      "mp": 0.2568
    },
    {
      "n": "Denny Chicken & Ham (90Grm)",
      "q": 132,
      "s": 152.25,
      "m": 21.75,
      "mp": 0.1429
    },
    {
      "n": "Mayfair Sea Green (20)",
      "q": 132,
      "s": 2284.5,
      "m": 134.46,
      "mp": 0.0724
    },
    {
      "n": "Hb 1Pint Ice-Cream Raspberry Ripple (568Mls)",
      "q": 131,
      "s": 286.6,
      "m": 35.26,
      "mp": 0.1513
    },
    {
      "n": "Panadol 500Ml Film Coated Tablets (12Pce)",
      "q": 131,
      "s": 286.89,
      "m": 36.59,
      "mp": 0.1275
    },
    {
      "n": "Centra Round Cabbage (1Pce)",
      "q": 130,
      "s": 180.7,
      "m": 32.5,
      "mp": 0.1799
    },
    {
      "n": "Pall Mall Flow Sk Red (20Pce)",
      "q": 130,
      "s": 2210,
      "m": 146.92,
      "mp": 0.0818
    },
    {
      "n": "Red Bull Energy Drink Can (473Ml)",
      "q": 129,
      "s": 522.45,
      "m": 122.14,
      "mp": 0.2876
    },
    {
      "n": "Classic Ring Donuts 4Pk (220Grm)",
      "q": 129,
      "s": 334.7,
      "m": 39.26,
      "mp": 0.1331
    },
    {
      "n": "Odonnells Mature Cheese & Red Onion (44Grm)",
      "q": 129,
      "s": 202.45,
      "m": 40.87,
      "mp": 0.2483
    },
    {
      "n": "Kinder Surprise Egg T48 (20Grm)",
      "q": 128,
      "s": 262.85,
      "m": 84.54,
      "mp": 0.3956
    },
    {
      "n": "Deep River Rock Still Water Sports (750Mls)",
      "q": 128,
      "s": 176.3,
      "m": 59.8,
      "mp": 0.4172
    },
    {
      "n": "Denny Gold Medal 8 Sausages (227Grm)",
      "q": 128,
      "s": 270.08,
      "m": 51.71,
      "mp": 0.1915
    },
    {
      "n": "Hula Hoops Big Hoops Barbeque Beef (70Grm)",
      "q": 128,
      "s": 369.75,
      "m": 117.95,
      "mp": 0.3924
    },
    {
      "n": "Club Orange Can (330Mls)",
      "q": 127,
      "s": 209.65,
      "m": 60.78,
      "mp": 0.3566
    },
    {
      "n": "Meadowfield Unsmkd Back Joint Rind (1Kgm)",
      "q": 126,
      "s": 704.32,
      "m": 70.67,
      "mp": 0.1003
    },
    {
      "n": "Mini Apple Pies (6Pce)",
      "q": 126,
      "s": 303.75,
      "m": 36.62,
      "mp": 0.1368
    },
    {
      "n": "Centra Granulated Sugar (1Kgm)",
      "q": 125,
      "s": 218.75,
      "m": 17.5,
      "mp": 0.08
    },
    {
      "n": "Lucozade Sport Raspberry €2.50 (750Mls)",
      "q": 125,
      "s": 312.5,
      "m": 65.84,
      "mp": 0.2591
    },
    {
      "n": "Fanta Orange Bottle (500Ml)",
      "q": 124,
      "s": 300.25,
      "m": 118.07,
      "mp": 0.4837
    },
    {
      "n": "Ct Premium Roast Chicken Slices (120Grm)",
      "q": 124,
      "s": 373.2,
      "m": 82.17,
      "mp": 0.2202
    },
    {
      "n": "Cully & Sully Full Bodied Veg Soup (400Grm)",
      "q": 123,
      "s": 333.45,
      "m": 50.61,
      "mp": 0.1518
    },
    {
      "n": "Petit Pain Large (74Grm)",
      "q": 123,
      "s": 89.35,
      "m": 58.13,
      "mp": 0.6506
    },
    {
      "n": "Everest Sberry Yogurt Granola Cup (175Grm)",
      "q": 123,
      "s": 237.5,
      "m": 57.76,
      "mp": 0.2432
    },
    {
      "n": "Ballygowan Hof Summer Fruits Bottle (1.5Ltr)",
      "q": 123,
      "s": 219.3,
      "m": 28.76,
      "mp": 0.1613
    },
    {
      "n": "Nicky Lemon Kitchen Towel (2Roll)",
      "q": 122,
      "s": 396.5,
      "m": 130.54,
      "mp": 0.4049
    },
    {
      "n": "Monster Ultra Rosa Can (500Mls)",
      "q": 122,
      "s": 289.9,
      "m": 88.07,
      "mp": 0.3737
    },
    {
      "n": "Round Fruit Soda (590Grm)",
      "q": 122,
      "s": 334.1,
      "m": 92.66,
      "mp": 0.3148
    },
    {
      "n": "Pat The Baker 100% Wholemeal (800Grm)",
      "q": 121,
      "s": 344.03,
      "m": 89.74,
      "mp": 0.2608
    },
    {
      "n": "Carrolls Value Wafer Thin Crumb Ham (200Grm)",
      "q": 121,
      "s": 423.5,
      "m": 70.54,
      "mp": 0.1666
    },
    {
      "n": "Silk Cut Blue Kingsize (20Pce)",
      "q": 119,
      "s": 2268,
      "m": 133.36,
      "mp": 0.0723
    },
    {
      "n": "Centra 6 Garlic Toasties (180Grm)",
      "q": 118,
      "s": 159.3,
      "m": 23.01,
      "mp": 0.1444
    },
    {
      "n": "Superquinn Sausage Roll (1Pce)",
      "q": 118,
      "s": 263.54,
      "m": 115.37,
      "mp": 0.4969
    },
    {
      "n": "Paddy (70Cl)",
      "q": 117,
      "s": 2676.24,
      "m": 111.21,
      "mp": 0.0511
    },
    {
      "n": "Sandwich 1-2 Salad (1Pce)",
      "q": 117,
      "s": 526.5,
      "m": 403.65,
      "mp": 0.7667
    },
    {
      "n": "Centra Irish Extra Lean Steak Mince (300Grm)",
      "q": 117,
      "s": 609,
      "m": 26.72,
      "mp": 0.0439
    },
    {
      "n": "Bowes Bramlet Apple Tart (1Pce)",
      "q": 117,
      "s": 508.95,
      "m": 117.3,
      "mp": 0.2616
    },
    {
      "n": "Sausage Rolls Large (1Pce)",
      "q": 116,
      "s": 255.2,
      "m": 162.21,
      "mp": 0.7214
    },
    {
      "n": "Mccambridge Stoneground Soda Sliced (510Grm)",
      "q": 116,
      "s": 303.14,
      "m": 71.14,
      "mp": 0.2347
    },
    {
      "n": "O'Haras Half Pan White Bread (400Grm)",
      "q": 116,
      "s": 220.6,
      "m": 76.76,
      "mp": 0.348
    },
    {
      "n": "Vit Hit Apple & Elderflower (500Ml)",
      "q": 116,
      "s": 324.3,
      "m": 90.27,
      "mp": 0.3424
    },
    {
      "n": "Airwaves Blackcurrant Gum (14Grm)",
      "q": 116,
      "s": 167.35,
      "m": 69.76,
      "mp": 0.5127
    },
    {
      "n": "Connacht Gold Buttermilk (1Ltr)",
      "q": 114,
      "s": 186.96,
      "m": 43.32,
      "mp": 0.2317
    },
    {
      "n": "O'Haras Half Pan Brown Bread (400Grm)",
      "q": 114,
      "s": 221.91,
      "m": 79.75,
      "mp": 0.3594
    },
    {
      "n": "Paulaner Weissbier Beer Bottle (500Mls)",
      "q": 114,
      "s": 365.9,
      "m": 61.92,
      "mp": 0.2081
    },
    {
      "n": "Centra Red Cheddar Slices (180Grm)",
      "q": 114,
      "s": 285,
      "m": 74.74,
      "mp": 0.2623
    },
    {
      "n": "Aero Bubbly Bar Pep/M 4Pk (27Grm)",
      "q": 114,
      "s": 246,
      "m": 27.1,
      "mp": 0.1355
    },
    {
      "n": "Volvic Natural Mineral Water Still (1.5L)",
      "q": 113,
      "s": 201.4,
      "m": 67.92,
      "mp": 0.4148
    },
    {
      "n": "Budweiser Can 8Pk (500Mls)",
      "q": 113,
      "s": 1582,
      "m": 166.79,
      "mp": 0.1297
    },
    {
      "n": "Centra Large Fresh Eggs (12Pce)",
      "q": 113,
      "s": 480.25,
      "m": 123.17,
      "mp": 0.2565
    }
  ],
  "benchmarks": [
    {
      "n": "Non Scan Deli & Food To Go Unknown",
      "bq": 3285.3,
      "aq": null,
      "v": -3285.3
    },
    {
      "n": "Non Scan Grocery Impulse Unknown",
      "bq": 2405.5,
      "aq": 11,
      "v": -2394.5
    },
    {
      "n": "Non Scan Meat / Poultry / Fish Unknown",
      "bq": 2324.3,
      "aq": null,
      "v": -2324.3
    },
    {
      "n": "Frank & Honest Large Coffee (1Pce)",
      "bq": 3303.3,
      "aq": 2295,
      "v": -1008.3
    },
    {
      "n": "Frank & Honest Reg Coffee (1Pce)",
      "bq": 4883.7,
      "aq": 3902,
      "v": -981.7
    },
    {
      "n": "Chicken Fillet Baguette +2 (1Pce)",
      "bq": 855.3,
      "aq": 384,
      "v": -471.3
    },
    {
      "n": "Brennans White Sliced Pan Pp . (800Grm)",
      "bq": 433.9,
      "aq": null,
      "v": -433.9
    },
    {
      "n": "Chicken Fillet Baguette (1)",
      "bq": 425.2,
      "aq": null,
      "v": -425.2
    },
    {
      "n": "Sausage Rolls Small (1Pce)",
      "bq": 1115.4,
      "aq": 766,
      "v": -349.4
    },
    {
      "n": "Chicken Fillet Baguette +1 (1Pce)",
      "bq": 830.2,
      "aq": 492,
      "v": -338.2
    },
    {
      "n": "Centra Fresh Milk (3Ltr)",
      "bq": 334.5,
      "aq": 4,
      "v": -330.5
    },
    {
      "n": "Chocolate Filled Croissant (100Grm)",
      "bq": 355.4,
      "aq": 30,
      "v": -325.4
    },
    {
      "n": "Centra Bag For Life Pattern Oil (1Pce)",
      "bq": 345.4,
      "aq": 21,
      "v": -324.4
    },
    {
      "n": "School Lunch (1Pce)",
      "bq": 288.8,
      "aq": null,
      "v": -288.8
    },
    {
      "n": "Avonmore Fresh Milk (2Ltr)",
      "bq": 279.9,
      "aq": null,
      "v": -279.9
    },
    {
      "n": "Non Scan Frozen Unknown",
      "bq": 256.3,
      "aq": null,
      "v": -256.3
    },
    {
      "n": "Avonmore Milk Carton (1Ltr)",
      "bq": 248.9,
      "aq": null,
      "v": -248.9
    },
    {
      "n": "Additional Salad Portion (1Pce)",
      "bq": 243.3,
      "aq": null,
      "v": -243.3
    },
    {
      "n": "Chicken Fillet Baguette + 3 (1Pce)",
      "bq": 536.7,
      "aq": 299,
      "v": -237.7
    },
    {
      "n": "Bakery Sales (1Pce)",
      "bq": 237.4,
      "aq": null,
      "v": -237.4
    },
    {
      "n": "Black/White Pudding (1Pce)",
      "bq": 473.1,
      "aq": 239,
      "v": -234.1
    },
    {
      "n": "Demi Baguette (140Grm)",
      "bq": 291.9,
      "aq": 63,
      "v": -228.9
    },
    {
      "n": "All Butter Croissant (70Grm)",
      "bq": 566.9,
      "aq": 348,
      "v": -218.9
    },
    {
      "n": "Centra Full Fat Milk (500Mls)",
      "bq": 214.9,
      "aq": null,
      "v": -214.9
    },
    {
      "n": "Spicy Wedges (1Pce)",
      "bq": 373.7,
      "aq": 164,
      "v": -209.7
    },
    {
      "n": "Pepsi Max No Added Sugar Bottle (750Mls)",
      "bq": 205.4,
      "aq": null,
      "v": -205.4
    },
    {
      "n": "Plain/Battered Chicken Goujons (1Pce)",
      "bq": 192.5,
      "aq": null,
      "v": -192.5
    },
    {
      "n": "Non Scan Bread & Cakes Unknown",
      "bq": 189.1,
      "aq": null,
      "v": -189.1
    },
    {
      "n": "Non Scan Beers / Wines / Spirits Unknown",
      "bq": 188.7,
      "aq": null,
      "v": -188.7
    },
    {
      "n": "Superquinn Sausage Roll (1Pce)",
      "bq": 302.8,
      "aq": 118,
      "v": -184.8
    },
    {
      "n": "Firebloc Firelog 920G (1Pce)",
      "bq": 169.7,
      "aq": null,
      "v": -169.7
    },
    {
      "n": "Coffee /Tea Regular Self Service (1Pce)",
      "bq": 164.1,
      "aq": null,
      "v": -164.1
    },
    {
      "n": "Battered Sausage (1Pce)",
      "bq": 162.6,
      "aq": null,
      "v": -162.6
    },
    {
      "n": "Volvic Natural Mineral Water Still (1.5L)",
      "bq": 272.1,
      "aq": 113,
      "v": -159.1
    },
    {
      "n": "Avonmore Fresh Milk (500Mls)",
      "bq": 157.2,
      "aq": null,
      "v": -157.2
    },
    {
      "n": "Jumbo Sausages (1Pce)",
      "bq": 156.1,
      "aq": null,
      "v": -156.1
    },
    {
      "n": "Breakfast Roll 4 Items (1Pce)",
      "bq": 512,
      "aq": 360,
      "v": -152
    },
    {
      "n": "Breakfast Roll 6 Items (1Pce)",
      "bq": 293.1,
      "aq": 142,
      "v": -151.1
    },
    {
      "n": "Manhattan Salted Popcorn (30Grm)",
      "bq": 147.5,
      "aq": null,
      "v": -147.5
    },
    {
      "n": "Cadburys Creme Egg Single (40Grm)",
      "bq": 335,
      "aq": 192,
      "v": -143
    },
    {
      "n": "Centra Loop Handle Compost Shop Bag (1Pce)",
      "bq": 145.7,
      "aq": 3,
      "v": -142.7
    },
    {
      "n": "1 Meat & 2 Salads Sandwich (1Pce)",
      "bq": 321.2,
      "aq": 179,
      "v": -142.2
    },
    {
      "n": "Not For Resale - Mineral Can/Btl Of Multipack Unknown",
      "bq": 153,
      "aq": 11,
      "v": -142
    },
    {
      "n": "Bag Of Logs (1Pce)",
      "bq": 138.9,
      "aq": null,
      "v": -138.9
    },
    {
      "n": "A/More Low Fat Supermilk [T T] (1Ltr)",
      "bq": 138.3,
      "aq": null,
      "v": -138.3
    },
    {
      "n": "Energise Sport Orange €1.50 (500Mls)",
      "bq": 136.4,
      "aq": null,
      "v": -136.4
    },
    {
      "n": "Belgium Choc Chunk Cookie (4Pce)",
      "bq": 135.8,
      "aq": null,
      "v": -135.8
    },
    {
      "n": "Bpm Energy Red Berry Bottle €2 (500Mls)",
      "bq": 163.7,
      "aq": 32,
      "v": -131.7
    },
    {
      "n": "John Player Blue Kingsize (20Pce)",
      "bq": 171.4,
      "aq": 43,
      "v": -128.4
    },
    {
      "n": "Centra Fresh Milk (1Ltr)",
      "bq": 202.3,
      "aq": 74,
      "v": -128.3
    },
    {
      "n": "Lucozade Energy Original Btl (500Mls)",
      "bq": 317.6,
      "aq": 191,
      "v": -126.6
    },
    {
      "n": "Jmob Toastie White. (800Grm)",
      "bq": 123.5,
      "aq": null,
      "v": -123.5
    },
    {
      "n": "Ocb Virgin Slim Paper & Tips (1Pce)",
      "bq": 123.4,
      "aq": null,
      "v": -123.4
    },
    {
      "n": "Cooked Sausage (1Pce)",
      "bq": 122.3,
      "aq": null,
      "v": -122.3
    },
    {
      "n": "Sultana Fruit Scone (130Grm)",
      "bq": 168.1,
      "aq": 46,
      "v": -122.1
    },
    {
      "n": "Tyskie Gronie Beer Bottle (500Mls)",
      "bq": 118.8,
      "aq": null,
      "v": -118.8
    },
    {
      "n": "King Cheese & Onion Crisps (35Grm)",
      "bq": 118.7,
      "aq": null,
      "v": -118.7
    },
    {
      "n": "Frank And Honest Staff Coffee (1Pce)",
      "bq": 115.9,
      "aq": null,
      "v": -115.9
    },
    {
      "n": "Non Scan Grocery Edible Unknown",
      "bq": 115.9,
      "aq": null,
      "v": -115.9
    },
    {
      "n": "Arrabawn Whole Milk (2Ltr)",
      "bq": 114.7,
      "aq": null,
      "v": -114.7
    },
    {
      "n": "Ballygowan Still Water (750Mls)",
      "bq": 127.2,
      "aq": 14,
      "v": -113.2
    },
    {
      "n": "Doritos Chilli Heatwave (40Grm)",
      "bq": 112.2,
      "aq": null,
      "v": -112.2
    },
    {
      "n": "Lucozade Energy Orig Can €1.50 (330Mls)",
      "bq": 111.8,
      "aq": null,
      "v": -111.8
    },
    {
      "n": "Deep River Rock Still Water (1Ltr)",
      "bq": 111.3,
      "aq": 1,
      "v": -110.3
    },
    {
      "n": "Galaxy Milk (42Grm)",
      "bq": 117.4,
      "aq": 11,
      "v": -106.4
    },
    {
      "n": "10C Sweet (1Pce)",
      "bq": 105.9,
      "aq": null,
      "v": -105.9
    },
    {
      "n": "Walkers Cheese & Onion Crisps (45Grm)",
      "bq": 112.7,
      "aq": 7,
      "v": -105.7
    },
    {
      "n": "Centra Compostable Shopping Bag (1Pce)",
      "bq": 102.6,
      "aq": null,
      "v": -102.6
    },
    {
      "n": "Jesels Mixed Jellies (300Grms)",
      "bq": 102,
      "aq": null,
      "v": -102
    },
    {
      "n": "Coca-Cola Zero Bottle (500Mls)",
      "bq": 486.7,
      "aq": 385,
      "v": -101.7
    },
    {
      "n": "Large White Parisienne (400Grm)",
      "bq": 101.5,
      "aq": null,
      "v": -101.5
    },
    {
      "n": "Chicken Chunks (6Pce)",
      "bq": 101.9,
      "aq": 1,
      "v": -100.9
    },
    {
      "n": "Dr Pepper Bottle (500Mls)",
      "bq": 99.6,
      "aq": null,
      "v": -99.6
    },
    {
      "n": "Energise Sport Orange Bottle €2 (750Ml)",
      "bq": 98.5,
      "aq": null,
      "v": -98.5
    },
    {
      "n": "Fill To The Brim €5.25 (1)",
      "bq": 97.7,
      "aq": null,
      "v": -97.7
    },
    {
      "n": "Amber Leaf Original (30Grm)",
      "bq": 377.6,
      "aq": 282,
      "v": -95.6
    },
    {
      "n": "Demi Baguette (130Grm)",
      "bq": 95,
      "aq": null,
      "v": -95
    },
    {
      "n": "Deep River Rock Still Water Sports (750Mls)",
      "bq": 222.9,
      "aq": 128,
      "v": -94.9
    },
    {
      "n": "Lucozade Zero Original Bottle (380Mls)",
      "bq": 93.8,
      "aq": null,
      "v": -93.8
    },
    {
      "n": "Centra Low Fat Milk (500Mls)",
      "bq": 93.5,
      "aq": null,
      "v": -93.5
    },
    {
      "n": "Centra Large Fresh Eggs (6Pce)",
      "bq": 93,
      "aq": null,
      "v": -93
    },
    {
      "n": "Chicken & Mushroom Pie (1Pce)",
      "bq": 92.2,
      "aq": null,
      "v": -92.2
    },
    {
      "n": "Brennans Half Pan White. (390Grm)",
      "bq": 91.6,
      "aq": null,
      "v": -91.6
    },
    {
      "n": "Cadbury Dairy Milk Freddo Bar (18Grm)",
      "bq": 95.3,
      "aq": 4,
      "v": -91.3
    },
    {
      "n": "Red Bull Energy Drink Can (250Ml)",
      "bq": 662.6,
      "aq": 574,
      "v": -88.6
    },
    {
      "n": "Coca Cola Can (330Mls)",
      "bq": 837.4,
      "aq": 749,
      "v": -88.4
    },
    {
      "n": "Arrabawn Whole Milk (1Ltr)",
      "bq": 88.3,
      "aq": null,
      "v": -88.3
    },
    {
      "n": "Kinder Bueno (43Grm)",
      "bq": 144.2,
      "aq": 56,
      "v": -88.2
    },
    {
      "n": "Red Bull Sugar Free Can (250Ml)",
      "bq": 87.2,
      "aq": null,
      "v": -87.2
    },
    {
      "n": "Marlboro Touch (20Pce)",
      "bq": 135.6,
      "aq": 49,
      "v": -86.6
    },
    {
      "n": "Walkers Max Crisps Cheese & Onion (50Grm)",
      "bq": 85.8,
      "aq": null,
      "v": -85.8
    },
    {
      "n": "Puff Pastry Apple Turnover (100Grm)",
      "bq": 85.7,
      "aq": null,
      "v": -85.7
    },
    {
      "n": "Lucozade Sport Orange Drink €2 (500Mls)",
      "bq": 119.8,
      "aq": 35,
      "v": -84.8
    },
    {
      "n": "Diet Coke Can (330Mls)",
      "bq": 184.7,
      "aq": 100,
      "v": -84.7
    },
    {
      "n": "Avonmore Whole Super Milk (1Ltr)",
      "bq": 84.4,
      "aq": null,
      "v": -84.4
    },
    {
      "n": "Rizla Cig Papers Red (1Pce)",
      "bq": 91.2,
      "aq": 7,
      "v": -84.2
    },
    {
      "n": "Apple Lattice Square (80Grm)",
      "bq": 83.7,
      "aq": null,
      "v": -83.7
    },
    {
      "n": "Large Coffee (1Pce)",
      "bq": 83.2,
      "aq": null,
      "v": -83.2
    },
    {
      "n": "Capri Sun Orange Carton (330Mls)",
      "bq": 83.1,
      "aq": null,
      "v": -83.1
    },
    {
      "n": "1 Meat & 1 Salad Sandwich (1Pce)",
      "bq": 257.6,
      "aq": 176,
      "v": -81.6
    },
    {
      "n": "Jumbo Sausages (1Pce)",
      "bq": 81.4,
      "aq": null,
      "v": -81.4
    },
    {
      "n": "Fanta Orange Can (330Mls)",
      "bq": 87.3,
      "aq": 6,
      "v": -81.3
    },
    {
      "n": "Lech Beer Bottle (500Mls)",
      "bq": 79.1,
      "aq": null,
      "v": -79.1
    },
    {
      "n": "Lucozade Sport Orange Bottle (500Mls)",
      "bq": 78,
      "aq": null,
      "v": -78
    },
    {
      "n": "Starter Firelog 700G (1Pce)",
      "bq": 77.9,
      "aq": null,
      "v": -77.9
    },
    {
      "n": "Minstrels (42Grm)",
      "bq": 77.4,
      "aq": null,
      "v": -77.4
    },
    {
      "n": "Clonakilty Sausages (227Grm)",
      "bq": 77.3,
      "aq": null,
      "v": -77.3
    },
    {
      "n": "Diet Coke Bottle (500Mls)",
      "bq": 238.3,
      "aq": 161,
      "v": -77.3
    },
    {
      "n": "Wrigleys Airwaves 10Pk (14Grm)",
      "bq": 102.8,
      "aq": 26,
      "v": -76.8
    },
    {
      "n": "Chupa Chups [ Wheel Display (12Grm)",
      "bq": 150.2,
      "aq": 75,
      "v": -75.2
    },
    {
      "n": "Hot Breaded Chicken Fillet (1Pce)",
      "bq": 250.1,
      "aq": 178,
      "v": -72.1
    },
    {
      "n": "Silk Cut Blue Kingsize (20Pce)",
      "bq": 190.9,
      "aq": 119,
      "v": -71.9
    },
    {
      "n": "Carrolls No1 (20Pce)",
      "bq": 132,
      "aq": 61,
      "v": -71
    },
    {
      "n": "Silk Cut Choice Green (20)",
      "bq": 103.2,
      "aq": 33,
      "v": -70.2
    },
    {
      "n": "Tayto Hunky Dory Ch Cheese Sp Onion (37Grm)",
      "bq": 209.6,
      "aq": 141,
      "v": -68.6
    },
    {
      "n": "The Irish Times Weekend (1Pce)",
      "bq": 102.8,
      "aq": 37,
      "v": -65.8
    },
    {
      "n": "Cadbury Boost Bar (48.5Grm)",
      "bq": 80,
      "aq": 16,
      "v": -64
    },
    {
      "n": "Extra Ice White 10 Piece (15Grm)",
      "bq": 77.6,
      "aq": 14,
      "v": -63.6
    },
    {
      "n": "Blas Xtreme Menthol Card (1Pce)",
      "bq": 91.3,
      "aq": 31,
      "v": -60.3
    },
    {
      "n": "Red Bull Energy Drink Can 4 Pack (250Ml)",
      "bq": 88.1,
      "aq": 28,
      "v": -60.1
    },
    {
      "n": "Lost Mary Pineapple Ice 2Ml (1Pce)",
      "bq": 160.3,
      "aq": 101,
      "v": -59.3
    },
    {
      "n": "Monster Pipeline Punch Can (500Mls)",
      "bq": 146.1,
      "aq": 88,
      "v": -58.1
    },
    {
      "n": "Centra Low Fat Milk (1Ltr)",
      "bq": 149.5,
      "aq": 93,
      "v": -56.5
    },
    {
      "n": "Pall Mall Flow Ks Red (20Pce)",
      "bq": 91.2,
      "aq": 35,
      "v": -56.2
    },
    {
      "n": "Heineken Lager Can 6Pk (500Mls)",
      "bq": 101,
      "aq": 45,
      "v": -56
    },
    {
      "n": "Sausage Rolls Large (1Pce)",
      "bq": 171.9,
      "aq": 116,
      "v": -55.9
    },
    {
      "n": "Wrigleys Extra Spearment 10Pk (14Grm)",
      "bq": 273.9,
      "aq": 219,
      "v": -54.9
    },
    {
      "n": "Marlboro Gold (20Pce)",
      "bq": 264.9,
      "aq": 212,
      "v": -52.9
    },
    {
      "n": "Twix Bar (50Grm)",
      "bq": 142.4,
      "aq": 90,
      "v": -52.4
    },
    {
      "n": "Deep River Rock Still Water (500Mls)",
      "bq": 99.3,
      "aq": 50,
      "v": -49.3
    },
    {
      "n": "Sunday Independent (1Pce)",
      "bq": 196.7,
      "aq": 150,
      "v": -46.7
    },
    {
      "n": "Evian Still Natural Mineral Water (1.5Ltr)",
      "bq": 127.2,
      "aq": 81,
      "v": -46.2
    },
    {
      "n": "Amber Leaf Original Paper And Filter (30Grm)",
      "bq": 85.1,
      "aq": 39,
      "v": -46.1
    },
    {
      "n": "Red Bull Can €2.20 (250Ml)",
      "bq": 153,
      "aq": 107,
      "v": -46
    },
    {
      "n": "Silk Cut Silver (20Pce)",
      "bq": 100.1,
      "aq": 55,
      "v": -45.1
    },
    {
      "n": "Petit Pain Large (74Grm)",
      "bq": 166.9,
      "aq": 123,
      "v": -43.9
    },
    {
      "n": "Ballygowan Still Water (500Mls)",
      "bq": 98.5,
      "aq": 55,
      "v": -43.5
    },
    {
      "n": "Cadbury Star Bar (49Grm)",
      "bq": 120.2,
      "aq": 77,
      "v": -43.2
    },
    {
      "n": "Breakfast Roll 5 Items (1Pce)",
      "bq": 329.7,
      "aq": 289,
      "v": -40.7
    },
    {
      "n": "Mayfair Superkings Original (20Pce)",
      "bq": 149.8,
      "aq": 111,
      "v": -38.8
    },
    {
      "n": "Monster Juiced Viking Berry Nrg Can (500Mls)",
      "bq": 106.5,
      "aq": 68,
      "v": -38.5
    },
    {
      "n": "Lucozade Energy Orange Bottle (500Mls)",
      "bq": 122.9,
      "aq": 86,
      "v": -36.9
    },
    {
      "n": "Evian Still Natural Mineral Water (750Mls)",
      "bq": 110.7,
      "aq": 74,
      "v": -36.7
    },
    {
      "n": "Monster Pacific Punch Can (500Mls)",
      "bq": 82.8,
      "aq": 48,
      "v": -34.8
    },
    {
      "n": "Jps Blue King Size (30Pc)",
      "bq": 119.6,
      "aq": 85,
      "v": -34.6
    },
    {
      "n": "Kinder Bueno White T2 (39Grm)",
      "bq": 84.5,
      "aq": 50,
      "v": -34.5
    },
    {
      "n": "Breakfast Roll 3 Items (1Pce)",
      "bq": 388.5,
      "aq": 355,
      "v": -33.5
    },
    {
      "n": "Galaxy Smooth Caramel Bar (48Grm)",
      "bq": 85.3,
      "aq": 52,
      "v": -33.3
    },
    {
      "n": "Snickers Bar (48Grm)",
      "bq": 109.7,
      "aq": 77,
      "v": -32.7
    },
    {
      "n": "Sunday Times (1Pce)",
      "bq": 90.4,
      "aq": 60,
      "v": -30.4
    },
    {
      "n": "Centra Still Water (5Ltr)",
      "bq": 165.4,
      "aq": 136,
      "v": -29.4
    },
    {
      "n": "The Sun Saturday (1Pce)",
      "bq": 107.2,
      "aq": 81,
      "v": -26.2
    },
    {
      "n": "Maltesers Bag Standard (37Grm)",
      "bq": 123.8,
      "aq": 99,
      "v": -24.8
    },
    {
      "n": "Silk Cut Purp Kingsize (20Pce)",
      "bq": 431.5,
      "aq": 409,
      "v": -22.5
    },
    {
      "n": "Peroni 5% Na (660Mls)",
      "bq": 85.2,
      "aq": 63,
      "v": -22.2
    },
    {
      "n": "Extra Strawberry 10Pce (14Grm)",
      "bq": 82.1,
      "aq": 60,
      "v": -22.1
    },
    {
      "n": "Red Bull Energy Drink Can (473Ml)",
      "bq": 147.2,
      "aq": 129,
      "v": -18.2
    },
    {
      "n": "Maple Pecan Plait (98Grm)",
      "bq": 186.5,
      "aq": 170,
      "v": -16.5
    },
    {
      "n": "Tncc Jelly Snakes (110Grm)",
      "bq": 86.7,
      "aq": 71,
      "v": -15.7
    },
    {
      "n": "Monster Juiced Mango Loco Enrg Can (500Mls)",
      "bq": 270.1,
      "aq": 256,
      "v": -14.1
    },
    {
      "n": "1 Meat & 3 Salads Sandwich (1Pce)",
      "bq": 164.7,
      "aq": 151,
      "v": -13.7
    },
    {
      "n": "Tayto Hunky Dorys Salt & Vinegar (37Grm)",
      "bq": 101.2,
      "aq": 88,
      "v": -13.2
    },
    {
      "n": "Extra Cool Breeze 10 Pce (14Grm)",
      "bq": 215.2,
      "aq": 202,
      "v": -13.2
    },
    {
      "n": "Pat The Baker Sliced Pan. (800Grm)",
      "bq": 116.2,
      "aq": 104,
      "v": -12.2
    },
    {
      "n": "Tayto Snax Cheese & Onion (26Grm)",
      "bq": 184.5,
      "aq": 173,
      "v": -11.5
    },
    {
      "n": "L&M Blue Label Ks (20)",
      "bq": 81.5,
      "aq": 70,
      "v": -11.5
    },
    {
      "n": "Coca Cola Zero Can (330Mls)",
      "bq": 514.6,
      "aq": 506,
      "v": -8.6
    },
    {
      "n": "Breakfast Roll 7 Items (1Pce)",
      "bq": 91.2,
      "aq": 83,
      "v": -8.2
    },
    {
      "n": "Irish Pride Sandwich Pan Sliced. (800Grm)",
      "bq": 171.1,
      "aq": 164,
      "v": -7.1
    },
    {
      "n": "Irish Independent Saturday (1Pce)",
      "bq": 99,
      "aq": 94,
      "v": -5
    },
    {
      "n": "Rizla Ultra Slim Filter Tips (120Pce)",
      "bq": 107.3,
      "aq": 103,
      "v": -4.3
    },
    {
      "n": "7Up Bottle (500Ml)",
      "bq": 100.2,
      "aq": 96,
      "v": -4.2
    },
    {
      "n": "Tayto Hunky Dorys Sour Cream & Onio (37Grm)",
      "bq": 141.8,
      "aq": 138,
      "v": -3.8
    },
    {
      "n": "Cadbury Dairy Milk Bar (110Grm)",
      "bq": 82.6,
      "aq": 79,
      "v": -3.6
    },
    {
      "n": "Polo Standard Tube (34Grm)",
      "bq": 78.2,
      "aq": 76,
      "v": -2.2
    },
    {
      "n": "Danish Vanilla Cream (97Grm)",
      "bq": 83.4,
      "aq": 82,
      "v": -1.4
    },
    {
      "n": "Tayto Hunky Dorys Buffalo (37Grm)",
      "bq": 108.9,
      "aq": 108,
      "v": -0.9
    },
    {
      "n": "Cadbury Dairymilk Giant Buttons Bag (40Grm)",
      "bq": 77.2,
      "aq": 77,
      "v": -0.2
    },
    {
      "n": "Cadburys Crunchie (40Grm)",
      "bq": 98.9,
      "aq": 99,
      "v": 0.1
    },
    {
      "n": "Bounty Bar (57Grm)",
      "bq": 84.7,
      "aq": 90,
      "v": 5.3
    },
    {
      "n": "Cadbury Snack Sandwich 6 Pack (22G)",
      "bq": 78.5,
      "aq": 85,
      "v": 6.5
    },
    {
      "n": "Lucozade Zero Original Btl €2.20 (500Mls)",
      "bq": 92,
      "aq": 101,
      "v": 9
    },
    {
      "n": "Mail On Sunday (1Pce)",
      "bq": 80.9,
      "aq": 90,
      "v": 9.1
    },
    {
      "n": "Irish Independent Tuesday (1Pce)",
      "bq": 81.2,
      "aq": 91,
      "v": 9.8
    },
    {
      "n": "Smirnoff Vodka (20Cl)",
      "bq": 81.5,
      "aq": 93,
      "v": 11.5
    },
    {
      "n": "Budweiser Can 8Pk (500Mls)",
      "bq": 100,
      "aq": 113,
      "v": 13
    },
    {
      "n": "Mayfair Superking Original (26Pce)",
      "bq": 84.8,
      "aq": 98,
      "v": 13.2
    },
    {
      "n": "Birra Moretti Bottle (660Mls)",
      "bq": 85.1,
      "aq": 99,
      "v": 13.9
    },
    {
      "n": "Pringles Sour Cream & Onion Crisps (165Grm)",
      "bq": 136.1,
      "aq": 150,
      "v": 13.9
    },
    {
      "n": "Large Tea F&H (1Pce)",
      "bq": 418.2,
      "aq": 433,
      "v": 14.8
    },
    {
      "n": "Pain Au Chocolate (80Grm)",
      "bq": 94.1,
      "aq": 110,
      "v": 15.9
    },
    {
      "n": "Coca Cola Bottle (2Ltr)",
      "bq": 266.9,
      "aq": 284,
      "v": 17.1
    },
    {
      "n": "Vit Hit Apple & Elderflower (500Ml)",
      "bq": 98.8,
      "aq": 116,
      "v": 17.2
    },
    {
      "n": "Ribena Blackcurrant Bottle (500Mls)",
      "bq": 83.5,
      "aq": 102,
      "v": 18.5
    },
    {
      "n": "Extra Ice Peppermint 10 Piece (15Grm)",
      "bq": 86,
      "aq": 106,
      "v": 20
    },
    {
      "n": "Extra White Bubblemint Gum 10Pce (14Grm)",
      "bq": 121.7,
      "aq": 143,
      "v": 21.3
    },
    {
      "n": "Jps Blue Kingsize (20Pce)",
      "bq": 175.3,
      "aq": 200,
      "v": 24.7
    },
    {
      "n": "Jam Donut Multibuy 5 For 3 (5Pce)",
      "bq": 137.2,
      "aq": 163,
      "v": 25.8
    },
    {
      "n": "1 Meat Sandwich (1Pce)",
      "bq": 153.7,
      "aq": 180,
      "v": 26.3
    },
    {
      "n": "Fanta Orange Bottle (500Ml)",
      "bq": 97,
      "aq": 124,
      "v": 27
    },
    {
      "n": "Tayto Thai Rings (40Grm)",
      "bq": 77.7,
      "aq": 105,
      "v": 27.3
    },
    {
      "n": "Cadburys Twirl (43Grm)",
      "bq": 127.7,
      "aq": 156,
      "v": 28.3
    },
    {
      "n": "Sandwich 1-2 Salad (1Pce)",
      "bq": 84.4,
      "aq": 117,
      "v": 32.6
    },
    {
      "n": "Hash Browns (1Pce)",
      "bq": 1044.8,
      "aq": 1078,
      "v": 33.2
    },
    {
      "n": "Cadbury Mini Egg Bag (74Grm)",
      "bq": 143.8,
      "aq": 177,
      "v": 33.2
    },
    {
      "n": "Monster Ultra Rosa Can (500Mls)",
      "bq": 88.7,
      "aq": 122,
      "v": 33.3
    },
    {
      "n": "Monster Energy Original Can (500Mls)",
      "bq": 206.2,
      "aq": 240,
      "v": 33.8
    },
    {
      "n": "Ballygowan Still Water (1Ltr)",
      "bq": 163,
      "aq": 197,
      "v": 34
    },
    {
      "n": "Centra Soft Toilet Tissue (4Roll)",
      "bq": 113.8,
      "aq": 148,
      "v": 34.2
    },
    {
      "n": "Lucozade Sport Raspberry €2.50 (750Mls)",
      "bq": 90.7,
      "aq": 125,
      "v": 34.3
    },
    {
      "n": "Centra Granulated Sugar (1Kgm)",
      "bq": 90.7,
      "aq": 125,
      "v": 34.3
    },
    {
      "n": "Odonnells Mature Cheese & Red Onion (44Grm)",
      "bq": 92.9,
      "aq": 129,
      "v": 36.1
    },
    {
      "n": "Mccambridge Stoneground Soda Sliced (510Grm)",
      "bq": 79.1,
      "aq": 116,
      "v": 36.9
    },
    {
      "n": "Mayfair Sea Green (20)",
      "bq": 92.5,
      "aq": 132,
      "v": 39.5
    },
    {
      "n": "Kinder Surprise Egg T48 (20Grm)",
      "bq": 87.8,
      "aq": 128,
      "v": 40.2
    },
    {
      "n": "7Up Zero Bottle (500Ml)",
      "bq": 106.9,
      "aq": 148,
      "v": 41.1
    },
    {
      "n": "Lucozade Energy Orange Bottle (380Mls)",
      "bq": 158.2,
      "aq": 200,
      "v": 41.8
    },
    {
      "n": "Pringles Salt & Vinegar (165)",
      "bq": 99,
      "aq": 142,
      "v": 43
    },
    {
      "n": "Rizla Cig Papers Blue (1Pce)",
      "bq": 156.7,
      "aq": 201,
      "v": 44.3
    },
    {
      "n": "Extra Peppermint 10Pce (14Grm)",
      "bq": 255.8,
      "aq": 302,
      "v": 46.2
    },
    {
      "n": "7Up Lemon & Lime Bottle (2Ltr)",
      "bq": 100.1,
      "aq": 147,
      "v": 46.9
    },
    {
      "n": "Frank & Honest Flat White (1Pce)",
      "bq": 648,
      "aq": 697,
      "v": 49
    },
    {
      "n": "Club Orange Can (330Mls)",
      "bq": 77.7,
      "aq": 127,
      "v": 49.3
    },
    {
      "n": "Doritos Chilli Heatwave (140Grm)",
      "bq": 128.9,
      "aq": 180,
      "v": 51.1
    },
    {
      "n": "Red Bull Energy Drink Can (355Ml)",
      "bq": 276.3,
      "aq": 330,
      "v": 53.7
    },
    {
      "n": "Diet Coke Bottle (2Ltr)",
      "bq": 79,
      "aq": 133,
      "v": 54
    },
    {
      "n": "Apple Lattice (4Pce)",
      "bq": 79.3,
      "aq": 134,
      "v": 54.7
    },
    {
      "n": "Benson & Hedges Gold Ks (26Pce)",
      "bq": 99.8,
      "aq": 156,
      "v": 56.2
    },
    {
      "n": "Cadbury Dairymilk Caramello (47Grm)",
      "bq": 133.8,
      "aq": 192,
      "v": 58.2
    },
    {
      "n": "Kit Kat Standard (41.5Grm)",
      "bq": 84.7,
      "aq": 143,
      "v": 58.3
    },
    {
      "n": "Centra Light Milk (3Ltr)",
      "bq": 122.9,
      "aq": 182,
      "v": 59.1
    },
    {
      "n": "Sausage Rolls Multibuy 5 For €3.80 (1Pce)",
      "bq": 360.8,
      "aq": 420,
      "v": 59.2
    },
    {
      "n": "Rizla Cig Papers Grn (1Pce)",
      "bq": 319.7,
      "aq": 379,
      "v": 59.3
    },
    {
      "n": "Cadbury D/Milk Frt & Nut (54Grm)",
      "bq": 87.7,
      "aq": 150,
      "v": 62.3
    },
    {
      "n": "Coca Cola Zero Bottle (2Ltr)",
      "bq": 176.7,
      "aq": 240,
      "v": 63.3
    },
    {
      "n": "Tayto Salt & Vinegar Crisps (35Grm)",
      "bq": 117.1,
      "aq": 183,
      "v": 65.9
    },
    {
      "n": "Cadbury Dairymilk Wholenut (55Grm)",
      "bq": 124.3,
      "aq": 192,
      "v": 67.7
    },
    {
      "n": "Cadbury D/Milk Mint Crisp (54Grm)",
      "bq": 122.3,
      "aq": 191,
      "v": 68.7
    },
    {
      "n": "3 Sausage Rolls (1Pce)",
      "bq": 248.9,
      "aq": 318,
      "v": 69.1
    },
    {
      "n": "Centra Sparkling Water (2L)",
      "bq": 111.3,
      "aq": 181,
      "v": 69.7
    },
    {
      "n": "Cadbury Dairymilk Golden Crisp (54Grm)",
      "bq": 179.1,
      "aq": 249,
      "v": 69.9
    },
    {
      "n": "Lucozade Energy Orig Btl 4 Pack €5 (380Mls)",
      "bq": 77.8,
      "aq": 149,
      "v": 71.2
    },
    {
      "n": "Cadburys Snack Sandwich (22Grm)",
      "bq": 96.4,
      "aq": 169,
      "v": 72.6
    },
    {
      "n": "Carlsberg Danish Pilsner Lager 8Pk (500Mls)",
      "bq": 99.5,
      "aq": 176,
      "v": 76.5
    },
    {
      "n": "Lucozade Energy Orange Btl €2.20 (500Mls)",
      "bq": 103.9,
      "aq": 182,
      "v": 78.1
    },
    {
      "n": "Cadbury Dairymilk (47Grm)",
      "bq": 175.9,
      "aq": 256,
      "v": 80.1
    },
    {
      "n": "Coca Cola Bottle (500Mls)",
      "bq": 895.7,
      "aq": 977,
      "v": 81.3
    },
    {
      "n": "Regular Fresh Soup (12Oz) (1Pce)",
      "bq": 113.1,
      "aq": 195,
      "v": 81.9
    },
    {
      "n": "Breakfast Muffin Sausage Egg Cheese (1Pce)",
      "bq": 233.8,
      "aq": 319,
      "v": 85.2
    },
    {
      "n": "Bulmers Original Cider Can 8Pk (500Mls)",
      "bq": 105,
      "aq": 192,
      "v": 87
    },
    {
      "n": "Centra Milk Choc Digestive (300Grm)",
      "bq": 90.8,
      "aq": 178,
      "v": 87.2
    },
    {
      "n": "Cooked Bacon (1Pce)",
      "bq": 336.9,
      "aq": 425,
      "v": 88.1
    },
    {
      "n": "Tayto Waffles (31Grm)",
      "bq": 119.8,
      "aq": 209,
      "v": 89.2
    },
    {
      "n": "Tayto Cheese & Onion Crisps (35Grm)",
      "bq": 534.2,
      "aq": 626,
      "v": 91.8
    },
    {
      "n": "Demi Baguettes (4Pce)",
      "bq": 135.6,
      "aq": 228,
      "v": 92.4
    },
    {
      "n": "7Up Zero Lemon & Lime Bottle (2Ltr)",
      "bq": 101.4,
      "aq": 198,
      "v": 96.6
    },
    {
      "n": "Volvic Still Natural Mineral Water (1Ltr)",
      "bq": 134,
      "aq": 232,
      "v": 98
    },
    {
      "n": "Red Bull Vanilla Berry Edition (250Mls)",
      "bq": 84.4,
      "aq": 186,
      "v": 101.6
    },
    {
      "n": "Cadbury D/Milk Turkish (47Grm)",
      "bq": 120.3,
      "aq": 224,
      "v": 103.7
    },
    {
      "n": "F&H Reusable Cup .40 Discount (1)",
      "bq": 439.3,
      "aq": 547,
      "v": 107.7
    },
    {
      "n": "Ct Mixed Grape Punnet (500Grm)",
      "bq": 85,
      "aq": 193,
      "v": 108
    },
    {
      "n": "Sunday World (South Ed) (1Pce)",
      "bq": 97.9,
      "aq": 209,
      "v": 111.1
    },
    {
      "n": "Centra Chocolate Butter Biscuits (125)",
      "bq": 79.2,
      "aq": 191,
      "v": 111.8
    },
    {
      "n": "Keelings Strawberries (227Grm)",
      "bq": 96.4,
      "aq": 217,
      "v": 120.6
    },
    {
      "n": "Roast Dinner (1Pce)",
      "bq": 122.9,
      "aq": 246,
      "v": 123.1
    },
    {
      "n": "Centra Still Water (500Mls)",
      "bq": 233.5,
      "aq": 358,
      "v": 124.5
    },
    {
      "n": "Cadbury Dairymilk (53Grm)",
      "bq": 320.9,
      "aq": 446,
      "v": 125.1
    },
    {
      "n": "Centra Ice Cubes (1.8Kgm)",
      "bq": 95.4,
      "aq": 227,
      "v": 131.6
    },
    {
      "n": "Fried Egg (1Pce)",
      "bq": 129.1,
      "aq": 265,
      "v": 135.9
    },
    {
      "n": "Lucozade Energy Orig Btl €2.20 (500Mls)",
      "bq": 256.5,
      "aq": 397,
      "v": 140.5
    },
    {
      "n": "Centra Still Water (2Ltr)",
      "bq": 479.1,
      "aq": 624,
      "v": 144.9
    },
    {
      "n": "Lucozade Energy Original Bottle (380Mls)",
      "bq": 443.9,
      "aq": 599,
      "v": 155.1
    },
    {
      "n": "Cadbury Wispa (36Grm)",
      "bq": 110.9,
      "aq": 280,
      "v": 169.1
    },
    {
      "n": "Inspired By Centra Blueberries (125Grm)",
      "bq": 93.1,
      "aq": 266,
      "v": 172.9
    },
    {
      "n": "Guinness Draught Stout Can 8 Pack (500Mls)",
      "bq": 139.6,
      "aq": 316,
      "v": 176.4
    },
    {
      "n": "Centra Still Water (1Ltr)",
      "bq": 388.6,
      "aq": 568,
      "v": 179.4
    },
    {
      "n": "Lucozade Sport Orange €2.50 (750Mls)",
      "bq": 483.8,
      "aq": 673,
      "v": 189.2
    },
    {
      "n": "Monster Energy Ultra Zero Can (500Mls)",
      "bq": 468.2,
      "aq": 660,
      "v": 191.8
    },
    {
      "n": "Ct Free Range Eggs Large (6Pce)",
      "bq": 93.4,
      "aq": 288,
      "v": 194.6
    },
    {
      "n": "Mayfair King Size Original (20Pck)",
      "bq": 190.7,
      "aq": 386,
      "v": 195.3
    },
    {
      "n": "Centra Irish Creamery Butter (454Grm)",
      "bq": 79.1,
      "aq": 281,
      "v": 201.9
    },
    {
      "n": "Dairygold Original (454Grm)",
      "bq": 108.2,
      "aq": 326,
      "v": 217.8
    },
    {
      "n": "Breakfast Roll Large 2 Fill (1Pce)",
      "bq": 215.8,
      "aq": 448,
      "v": 232.2
    },
    {
      "n": "Reg Tea F&H (1Pce)",
      "bq": 717.7,
      "aq": 958,
      "v": 240.3
    },
    {
      "n": "Centra Deli Style Crumbed Ham (100G)",
      "bq": 105.6,
      "aq": 398,
      "v": 292.4
    },
    {
      "n": "Centra Milk (2Ltr)",
      "bq": 892.5,
      "aq": 1190,
      "v": 297.5
    },
    {
      "n": "Chips (1Pce)",
      "bq": 113.5,
      "aq": 419,
      "v": 305.5
    },
    {
      "n": "Centra Light Milk (2Ltr)",
      "bq": 404.4,
      "aq": 715,
      "v": 310.6
    },
    {
      "n": "Benson & Hedges K/Size (20Pce)",
      "bq": 662.3,
      "aq": 974,
      "v": 311.7
    },
    {
      "n": "Centra Bag Carrots [Irish] (850Grm)",
      "bq": 82.4,
      "aq": 411,
      "v": 328.6
    },
    {
      "n": "Fyffes Premium Bananas Single (1Pce)",
      "bq": 375.8,
      "aq": 710,
      "v": 334.2
    },
    {
      "n": "Ct Irish Closed Cup Mushrooms (200Grm)",
      "bq": 104.7,
      "aq": 486,
      "v": 381.3
    },
    {
      "n": "Connacht Gold Milk Bottle (500Mls)",
      "bq": 84.3,
      "aq": 472,
      "v": 387.7
    },
    {
      "n": "Corona Extra Bottle (620Mls)",
      "bq": 114.3,
      "aq": 502,
      "v": 387.7
    },
    {
      "n": "Plain Scone (120Grm)",
      "bq": 173.4,
      "aq": 616,
      "v": 442.6
    },
    {
      "n": "Jambon Ham & Cheese (1Pce)",
      "bq": 633.6,
      "aq": 1330,
      "v": 696.4
    },
    {
      "n": "Breakfast Sausages (1Pce)",
      "bq": 3111,
      "aq": 3809,
      "v": 698
    },
    {
      "n": "Ct Snack Pack Bananas (6Pce)",
      "bq": 199.2,
      "aq": 920,
      "v": 720.8
    },
    {
      "n": "Connacht Gold Milk (1Ltr)",
      "bq": 92.1,
      "aq": 1452,
      "v": 1359.9
    },
    {
      "n": "O'Hara'S Sliced Pan White (800Grm)",
      "bq": 104.3,
      "aq": 1951,
      "v": 1846.7
    }
  ],
  "hourlySales": [
    {
      "h": "5AM-6AM",
      "v": 14.48
    },
    {
      "h": "6AM-7AM",
      "v": 85.47
    },
    {
      "h": "7AM-8AM",
      "v": 28066.1
    },
    {
      "h": "8AM-9AM",
      "v": 46084.65
    },
    {
      "h": "9AM-10AM",
      "v": 50934.23
    },
    {
      "h": "10AM-11AM",
      "v": 63762.68
    },
    {
      "h": "11AM-Midday",
      "v": 77964.13
    },
    {
      "h": "Midday-1PM",
      "v": 81077.79
    },
    {
      "h": "1PM-2PM",
      "v": 80910.49
    },
    {
      "h": "2PM-3PM",
      "v": 76202.39
    },
    {
      "h": "3PM-4PM",
      "v": 75971.95
    },
    {
      "h": "4PM-5PM",
      "v": 82875.88
    },
    {
      "h": "5PM-6PM",
      "v": 85820.24
    },
    {
      "h": "6PM-7PM",
      "v": 74871.75
    },
    {
      "h": "7PM-8PM",
      "v": 62507.21
    },
    {
      "h": "8PM-9PM",
      "v": 48041.37
    },
    {
      "h": "9PM-10PM",
      "v": 26155.63
    },
    {
      "h": "10PM-11PM",
      "v": 180.14
    }
  ],
  "weeklyTrend16": [
    {
      "w": "Wk 47 2025",
      "avg": 20.98,
      "trans": 4807
    },
    {
      "w": "Wk 48 2025",
      "avg": 21.25,
      "trans": 4667
    },
    {
      "w": "Wk 49 2025",
      "avg": 21.61,
      "trans": 4583
    },
    {
      "w": "Wk 50 2025",
      "avg": 24.87,
      "trans": 4729
    },
    {
      "w": "Wk 51 2025",
      "avg": 22,
      "trans": 4955
    },
    {
      "w": "Wk 52 2025",
      "avg": 23.52,
      "trans": 3882
    },
    {
      "w": "Wk 01 2026",
      "avg": 20.51,
      "trans": 4431
    },
    {
      "w": "Wk 02 2026",
      "avg": 20.4,
      "trans": 4164
    },
    {
      "w": "Wk 03 2026",
      "avg": 21.16,
      "trans": 4377
    },
    {
      "w": "Wk 04 2026",
      "avg": 21.07,
      "trans": 4510
    },
    {
      "w": "Wk 05 2026",
      "avg": 20.2,
      "trans": 4479
    },
    {
      "w": "Wk 06 2026",
      "avg": 21,
      "trans": 4662
    },
    {
      "w": "Wk 07 2026",
      "avg": 20.82,
      "trans": 4792
    },
    {
      "w": "Wk 08 2026",
      "avg": 21.57,
      "trans": 4668
    },
    {
      "w": "Wk 09 2026",
      "avg": 21.24,
      "trans": 4747
    },
    {
      "w": "Wk 10 2026",
      "avg": 22.92,
      "trans": 4726
    }
  ],
  "tradingKpis": {
    "transactions": {
      "ty": 700,
      "wtd": 4726,
      "ytd": 45556
    },
    "avgSpend": {
      "ty": 22.99,
      "wtd": 22.92,
      "ytd": 21.11
    },
    "hourlySales": {
      "ty": 16095.63,
      "wtd": 108333.73,
      "ytd": 961526.58
    }
  },
  "top3Days": [
    {
      "d": "14 Feb 2026",
      "day": "Saturday",
      "v": 1528.85
    },
    {
      "d": "13 Feb 2026",
      "day": "Friday",
      "v": 1504.93
    },
    {
      "d": "01 Feb 2026",
      "day": "Sunday",
      "v": 1493.14
    }
  ],
  "bottom3Days": [
    {
      "d": "05 Jan 2026",
      "day": "Monday",
      "v": 671.37
    },
    {
      "d": "14 Jan 2026",
      "day": "Wednesday",
      "v": 813.68
    },
    {
      "d": "28 Jan 2026",
      "day": "Wednesday",
      "v": 821.22
    }
  ],
  "top3Hours": [
    {
      "h": "4PM To 5PM",
      "d": "01 Feb 2026",
      "day": "Sunday",
      "v": 223.33
    },
    {
      "h": "3PM To 4PM",
      "d": "03 Jan 2026",
      "day": "Saturday",
      "v": 219.12
    },
    {
      "h": "5PM To 6PM",
      "d": "06 Mar 2026",
      "day": "Friday",
      "v": 212.03
    }
  ],
  "bottom3Hours": [
    {
      "h": "7AM To 8AM",
      "d": "21 Feb 2026",
      "day": "Saturday",
      "v": 1.35
    },
    {
      "h": "10PM To 11PM",
      "d": "20 Jan 2026",
      "day": "Tuesday",
      "v": 2
    },
    {
      "h": "9PM To 10PM",
      "d": "18 Jan 2026",
      "day": "Sunday",
      "v": 5
    }
  ],
  "top3Depts": [
    {
      "n": "Fuel",
      "v": 514086.63
    },
    {
      "n": "Tobacco",
      "v": 97583.85
    },
    {
      "n": "Beers/Wines/Spirits",
      "v": 86421.22
    }
  ],
  "bottom3Depts": [
    {
      "n": "Baby & Kids",
      "v": 209.3
    },
    {
      "n": "Meat, Poultry & Fish",
      "v": 1887.39
    },
    {
      "n": "Personal Care",
      "v": 2100.56
    }
  ],
  "busiestSlots": [
    {
      "d": "14 Feb 2026",
      "h": "Midday To 1PM",
      "day": "Saturday",
      "v": 209.33
    },
    {
      "d": "14 Feb 2026",
      "h": "3PM To 4PM",
      "day": "Saturday",
      "v": 152.68
    },
    {
      "d": "14 Feb 2026",
      "h": "2PM To 3PM",
      "day": "Saturday",
      "v": 145.93
    }
  ],
  "quietestSlots": [
    {
      "d": "05 Jan 2026",
      "h": "9AM To 10AM",
      "day": "Monday",
      "v": 15.2
    },
    {
      "d": "05 Jan 2026",
      "h": "10AM To 11AM",
      "day": "Monday",
      "v": 19.9
    },
    {
      "d": "05 Jan 2026",
      "h": "2PM To 3PM",
      "day": "Monday",
      "v": 20.3
    }
  ]
};
