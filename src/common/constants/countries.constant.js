const COUNTRIES = [
  {
    code: 'AD',
    label: 'Andorra',
    phone: '376',
    value: 'andorra-AD'
  },
  {
    code: 'AE',
    label: 'United Arab Emirates',
    phone: '971',
    value: 'united arab emirates-AE'
  },
  {
    code: 'AF',
    label: 'Afghanistan',
    phone: '93',
    value: 'afghanistan-AF'
  },
  {
    code: 'AG',
    label: 'Antigua and Barbuda',
    phone: '1-268',
    value: 'antigua and barbuda-AG'
  },
  {
    code: 'AI',
    label: 'Anguilla',
    phone: '1-264',
    value: 'anguilla-AI'
  },
  {
    code: 'AL',
    label: 'Albania',
    phone: '355',
    value: 'albania-AL'
  },
  {
    code: 'AM',
    label: 'Armenia',
    phone: '374',
    value: 'armenia-AM'
  },
  {
    code: 'AO',
    label: 'Angola',
    phone: '244',
    value: 'angola-AO'
  },
  {
    code: 'AQ',
    label: 'Antarctica',
    phone: '672',
    value: 'antarctica-AQ'
  },
  {
    code: 'AR',
    label: 'Argentina',
    phone: '54',
    value: 'argentina-AR'
  },
  {
    code: 'AS',
    label: 'American Samoa',
    phone: '1-684',
    value: 'american samoa-AS'
  },
  {
    code: 'AT',
    label: 'Austria',
    phone: '43',
    value: 'austria-AT'
  },
  {
    code: 'AU',
    label: 'Australia',
    phone: '61',
    suggested: true,
    value: 'australia-AU'
  },
  {
    code: 'AW',
    label: 'Aruba',
    phone: '297',
    value: 'aruba-AW'
  },
  {
    code: 'AX',
    label: 'Alland Islands',
    phone: '358',
    value: 'alland islands-AX'
  },
  {
    code: 'AZ',
    label: 'Azerbaijan',
    phone: '994',
    value: 'azerbaijan-AZ'
  },
  {
    code: 'BA',
    label: 'Bosnia and Herzegovina',
    phone: '387',
    value: 'bosnia and herzegovina-BA'
  },
  {
    code: 'BB',
    label: 'Barbados',
    phone: '1-246',
    value: 'barbados-BB'
  },
  {
    code: 'BD',
    label: 'Bangladesh',
    phone: '880',
    value: 'bangladesh-BD'
  },
  {
    code: 'BE',
    label: 'Belgium',
    phone: '32',
    value: 'belgium-BE'
  },
  {
    code: 'BF',
    label: 'Burkina Faso',
    phone: '226',
    value: 'burkina faso-BF'
  },
  {
    code: 'BG',
    label: 'Bulgaria',
    phone: '359',
    value: 'bulgaria-BG'
  },
  {
    code: 'BH',
    label: 'Bahrain',
    phone: '973',
    value: 'bahrain-BH'
  },
  {
    code: 'BI',
    label: 'Burundi',
    phone: '257',
    value: 'burundi-BI'
  },
  {
    code: 'BJ',
    label: 'Benin',
    phone: '229',
    value: 'benin-BJ'
  },
  {
    code: 'BL',
    label: 'Saint Barthelemy',
    phone: '590',
    value: 'saint barthelemy-BL'
  },
  {
    code: 'BM',
    label: 'Bermuda',
    phone: '1-441',
    value: 'bermuda-BM'
  },
  {
    code: 'BN',
    label: 'Brunei Darussalam',
    phone: '673',
    value: 'brunei darussalam-BN'
  },
  {
    code: 'BO',
    label: 'Bolivia',
    phone: '591',
    value: 'bolivia-BO'
  },
  {
    code: 'BR',
    label: 'Brazil',
    phone: '55',
    value: 'brazil-BR'
  },
  {
    code: 'BS',
    label: 'Bahamas',
    phone: '1-242',
    value: 'bahamas-BS'
  },
  {
    code: 'BT',
    label: 'Bhutan',
    phone: '975',
    value: 'bhutan-BT'
  },
  {
    code: 'BV',
    label: 'Bouvet Island',
    phone: '47',
    value: 'bouvet island-BV'
  },
  {
    code: 'BW',
    label: 'Botswana',
    phone: '267',
    value: 'botswana-BW'
  },
  {
    code: 'BY',
    label: 'Belarus',
    phone: '375',
    value: 'belarus-BY'
  },
  {
    code: 'BZ',
    label: 'Belize',
    phone: '501',
    value: 'belize-BZ'
  },
  {
    code: 'CA',
    label: 'Canada',
    phone: '1',
    suggested: true,
    value: 'canada-CA'
  },
  {
    code: 'CC',
    label: 'Cocos (Keeling) Islands',
    phone: '61',
    value: 'cocos (keeling) islands-CC'
  },
  {
    code: 'CD',
    label: 'Congo, Democratic Republic of the',
    phone: '243',
    value: 'congo, democratic republic of the-CD'
  },
  {
    code: 'CF',
    label: 'Central African Republic',
    phone: '236',
    value: 'central african republic-CF'
  },
  {
    code: 'CG',
    label: 'Congo, Republic of the',
    phone: '242',
    value: 'congo, republic of the-CG'
  },
  {
    code: 'CH',
    label: 'Switzerland',
    phone: '41',
    value: 'switzerland-CH'
  },
  {
    code: 'CI',
    label: "Cote d'Ivoire",
    phone: '225',
    value: "cote d'ivoire-CI"
  },
  {
    code: 'CK',
    label: 'Cook Islands',
    phone: '682',
    value: 'cook islands-CK'
  },
  {
    code: 'CL',
    label: 'Chile',
    phone: '56',
    value: 'chile-CL'
  },
  {
    code: 'CM',
    label: 'Cameroon',
    phone: '237',
    value: 'cameroon-CM'
  },
  {
    code: 'CN',
    label: 'China',
    phone: '86',
    value: 'china-CN'
  },
  {
    code: 'CO',
    label: 'Colombia',
    phone: '57',
    value: 'colombia-CO'
  },
  {
    code: 'CR',
    label: 'Costa Rica',
    phone: '506',
    value: 'costa rica-CR'
  },
  {
    code: 'CU',
    label: 'Cuba',
    phone: '53',
    value: 'cuba-CU'
  },
  {
    code: 'CV',
    label: 'Cape Verde',
    phone: '238',
    value: 'cape verde-CV'
  },
  {
    code: 'CW',
    label: 'Curacao',
    phone: '599',
    value: 'curacao-CW'
  },
  {
    code: 'CX',
    label: 'Christmas Island',
    phone: '61',
    value: 'christmas island-CX'
  },
  {
    code: 'CY',
    label: 'Cyprus',
    phone: '357',
    value: 'cyprus-CY'
  },
  {
    code: 'CZ',
    label: 'Czech Republic',
    phone: '420',
    value: 'czech republic-CZ'
  },
  {
    code: 'DE',
    label: 'Germany',
    phone: '49',
    suggested: true,
    value: 'germany-DE'
  },
  {
    code: 'DJ',
    label: 'Djibouti',
    phone: '253',
    value: 'djibouti-DJ'
  },
  {
    code: 'DK',
    label: 'Denmark',
    phone: '45',
    value: 'denmark-DK'
  },
  {
    code: 'DM',
    label: 'Dominica',
    phone: '1-767',
    value: 'dominica-DM'
  },
  {
    code: 'DO',
    label: 'Dominican Republic',
    phone: '1-809',
    value: 'dominican republic-DO'
  },
  {
    code: 'DZ',
    label: 'Algeria',
    phone: '213',
    value: 'algeria-DZ'
  },
  {
    code: 'EC',
    label: 'Ecuador',
    phone: '593',
    value: 'ecuador-EC'
  },
  {
    code: 'EE',
    label: 'Estonia',
    phone: '372',
    value: 'estonia-EE'
  },
  {
    code: 'EG',
    label: 'Egypt',
    phone: '20',
    value: 'egypt-EG'
  },
  {
    code: 'EH',
    label: 'Western Sahara',
    phone: '212',
    value: 'western sahara-EH'
  },
  {
    code: 'ER',
    label: 'Eritrea',
    phone: '291',
    value: 'eritrea-ER'
  },
  {
    code: 'ES',
    label: 'Spain',
    phone: '34',
    value: 'spain-ES'
  },
  {
    code: 'ET',
    label: 'Ethiopia',
    phone: '251',
    value: 'ethiopia-ET'
  },
  {
    code: 'FI',
    label: 'Finland',
    phone: '358',
    value: 'finland-FI'
  },
  {
    code: 'FJ',
    label: 'Fiji',
    phone: '679',
    value: 'fiji-FJ'
  },
  {
    code: 'FK',
    label: 'Falkland Islands (Malvinas)',
    phone: '500',
    value: 'falkland islands (malvinas)-FK'
  },
  {
    code: 'FM',
    label: 'Micronesia, Federated States of',
    phone: '691',
    value: 'micronesia, federated states of-FM'
  },
  {
    code: 'FO',
    label: 'Faroe Islands',
    phone: '298',
    value: 'faroe islands-FO'
  },
  {
    code: 'FR',
    label: 'France',
    phone: '33',
    suggested: true,
    value: 'france-FR'
  },
  {
    code: 'GA',
    label: 'Gabon',
    phone: '241',
    value: 'gabon-GA'
  },
  {
    code: 'GB',
    label: 'United Kingdom',
    phone: '44',
    value: 'united kingdom-GB'
  },
  {
    code: 'GD',
    label: 'Grenada',
    phone: '1-473',
    value: 'grenada-GD'
  },
  {
    code: 'GE',
    label: 'Georgia',
    phone: '995',
    value: 'georgia-GE'
  },
  {
    code: 'GF',
    label: 'French Guiana',
    phone: '594',
    value: 'french guiana-GF'
  },
  {
    code: 'GG',
    label: 'Guernsey',
    phone: '44',
    value: 'guernsey-GG'
  },
  {
    code: 'GH',
    label: 'Ghana',
    phone: '233',
    value: 'ghana-GH'
  },
  {
    code: 'GI',
    label: 'Gibraltar',
    phone: '350',
    value: 'gibraltar-GI'
  },
  {
    code: 'GL',
    label: 'Greenland',
    phone: '299',
    value: 'greenland-GL'
  },
  {
    code: 'GM',
    label: 'Gambia',
    phone: '220',
    value: 'gambia-GM'
  },
  {
    code: 'GN',
    label: 'Guinea',
    phone: '224',
    value: 'guinea-GN'
  },
  {
    code: 'GP',
    label: 'Guadeloupe',
    phone: '590',
    value: 'guadeloupe-GP'
  },
  {
    code: 'GQ',
    label: 'Equatorial Guinea',
    phone: '240',
    value: 'equatorial guinea-GQ'
  },
  {
    code: 'GR',
    label: 'Greece',
    phone: '30',
    value: 'greece-GR'
  },
  {
    code: 'GS',
    label: 'South Georgia and the South Sandwich Islands',
    phone: '500',
    value: 'south georgia and the south sandwich islands-GS'
  },
  {
    code: 'GT',
    label: 'Guatemala',
    phone: '502',
    value: 'guatemala-GT'
  },
  {
    code: 'GU',
    label: 'Guam',
    phone: '1-671',
    value: 'guam-GU'
  },
  {
    code: 'GW',
    label: 'Guinea-Bissau',
    phone: '245',
    value: 'guinea-bissau-GW'
  },
  {
    code: 'GY',
    label: 'Guyana',
    phone: '592',
    value: 'guyana-GY'
  },
  {
    code: 'HK',
    label: 'Hong Kong',
    phone: '852',
    value: 'hong kong-HK'
  },
  {
    code: 'HM',
    label: 'Heard Island and McDonald Islands',
    phone: '672',
    value: 'heard island and mcdonald islands-HM'
  },
  {
    code: 'HN',
    label: 'Honduras',
    phone: '504',
    value: 'honduras-HN'
  },
  {
    code: 'HR',
    label: 'Croatia',
    phone: '385',
    value: 'croatia-HR'
  },
  {
    code: 'HT',
    label: 'Haiti',
    phone: '509',
    value: 'haiti-HT'
  },
  {
    code: 'HU',
    label: 'Hungary',
    phone: '36',
    value: 'hungary-HU'
  },
  {
    code: 'ID',
    label: 'Indonesia',
    phone: '62',
    value: 'indonesia-ID'
  },
  {
    code: 'IE',
    label: 'Ireland',
    phone: '353',
    value: 'ireland-IE'
  },
  {
    code: 'IL',
    label: 'Israel',
    phone: '972',
    value: 'israel-IL'
  },
  {
    code: 'IM',
    label: 'Isle of Man',
    phone: '44',
    value: 'isle of man-IM'
  },
  {
    code: 'IN',
    label: 'India',
    phone: '91',
    value: 'india-IN'
  },
  {
    code: 'IO',
    label: 'British Indian Ocean Territory',
    phone: '246',
    value: 'british indian ocean territory-IO'
  },
  {
    code: 'IQ',
    label: 'Iraq',
    phone: '964',
    value: 'iraq-IQ'
  },
  {
    code: 'IR',
    label: 'Iran, Islamic Republic of',
    phone: '98',
    value: 'iran, islamic republic of-IR'
  },
  {
    code: 'IS',
    label: 'Iceland',
    phone: '354',
    value: 'iceland-IS'
  },
  {
    code: 'IT',
    label: 'Italy',
    phone: '39',
    value: 'italy-IT'
  },
  {
    code: 'JE',
    label: 'Jersey',
    phone: '44',
    value: 'jersey-JE'
  },
  {
    code: 'JM',
    label: 'Jamaica',
    phone: '1-876',
    value: 'jamaica-JM'
  },
  {
    code: 'JO',
    label: 'Jordan',
    phone: '962',
    value: 'jordan-JO'
  },
  {
    code: 'JP',
    label: 'Japan',
    phone: '81',
    suggested: true,
    value: 'japan-JP'
  },
  {
    code: 'KE',
    label: 'Kenya',
    phone: '254',
    value: 'kenya-KE'
  },
  {
    code: 'KG',
    label: 'Kyrgyzstan',
    phone: '996',
    value: 'kyrgyzstan-KG'
  },
  {
    code: 'KH',
    label: 'Cambodia',
    phone: '855',
    value: 'cambodia-KH'
  },
  {
    code: 'KI',
    label: 'Kiribati',
    phone: '686',
    value: 'kiribati-KI'
  },
  {
    code: 'KM',
    label: 'Comoros',
    phone: '269',
    value: 'comoros-KM'
  },
  {
    code: 'KN',
    label: 'Saint Kitts and Nevis',
    phone: '1-869',
    value: 'saint kitts and nevis-KN'
  },
  {
    code: 'KP',
    label: "Korea, Democratic People's Republic of",
    phone: '850',
    value: "korea, democratic people's republic of-KP"
  },
  {
    code: 'KR',
    label: 'Korea, Republic of',
    phone: '82',
    value: 'korea, republic of-KR'
  },
  {
    code: 'KW',
    label: 'Kuwait',
    phone: '965',
    value: 'kuwait-KW'
  },
  {
    code: 'KY',
    label: 'Cayman Islands',
    phone: '1-345',
    value: 'cayman islands-KY'
  },
  {
    code: 'KZ',
    label: 'Kazakhstan',
    phone: '7',
    value: 'kazakhstan-KZ'
  },
  {
    code: 'LA',
    label: "Lao People's Democratic Republic",
    phone: '856',
    value: "lao people's democratic republic-LA"
  },
  {
    code: 'LB',
    label: 'Lebanon',
    phone: '961',
    value: 'lebanon-LB'
  },
  {
    code: 'LC',
    label: 'Saint Lucia',
    phone: '1-758',
    value: 'saint lucia-LC'
  },
  {
    code: 'LI',
    label: 'Liechtenstein',
    phone: '423',
    value: 'liechtenstein-LI'
  },
  {
    code: 'LK',
    label: 'Sri Lanka',
    phone: '94',
    value: 'sri lanka-LK'
  },
  {
    code: 'LR',
    label: 'Liberia',
    phone: '231',
    value: 'liberia-LR'
  },
  {
    code: 'LS',
    label: 'Lesotho',
    phone: '266',
    value: 'lesotho-LS'
  },
  {
    code: 'LT',
    label: 'Lithuania',
    phone: '370',
    value: 'lithuania-LT'
  },
  {
    code: 'LU',
    label: 'Luxembourg',
    phone: '352',
    value: 'luxembourg-LU'
  },
  {
    code: 'LV',
    label: 'Latvia',
    phone: '371',
    value: 'latvia-LV'
  },
  {
    code: 'LY',
    label: 'Libya',
    phone: '218',
    value: 'libya-LY'
  },
  {
    code: 'MA',
    label: 'Morocco',
    phone: '212',
    value: 'morocco-MA'
  },
  {
    code: 'MC',
    label: 'Monaco',
    phone: '377',
    value: 'monaco-MC'
  },
  {
    code: 'MD',
    label: 'Moldova, Republic of',
    phone: '373',
    value: 'moldova, republic of-MD'
  },
  {
    code: 'ME',
    label: 'Montenegro',
    phone: '382',
    value: 'montenegro-ME'
  },
  {
    code: 'MF',
    label: 'Saint Martin (French part)',
    phone: '590',
    value: 'saint martin (french part)-MF'
  },
  {
    code: 'MG',
    label: 'Madagascar',
    phone: '261',
    value: 'madagascar-MG'
  },
  {
    code: 'MH',
    label: 'Marshall Islands',
    phone: '692',
    value: 'marshall islands-MH'
  },
  {
    code: 'MK',
    label: 'Macedonia, the Former Yugoslav Republic of',
    phone: '389',
    value: 'macedonia, the former yugoslav republic of-MK'
  },
  {
    code: 'ML',
    label: 'Mali',
    phone: '223',
    value: 'mali-ML'
  },
  {
    code: 'MM',
    label: 'Myanmar',
    phone: '95',
    value: 'myanmar-MM'
  },
  {
    code: 'MN',
    label: 'Mongolia',
    phone: '976',
    value: 'mongolia-MN'
  },
  {
    code: 'MO',
    label: 'Macao',
    phone: '853',
    value: 'macao-MO'
  },
  {
    code: 'MP',
    label: 'Northern Mariana Islands',
    phone: '1-670',
    value: 'northern mariana islands-MP'
  },
  {
    code: 'MQ',
    label: 'Martinique',
    phone: '596',
    value: 'martinique-MQ'
  },
  {
    code: 'MR',
    label: 'Mauritania',
    phone: '222',
    value: 'mauritania-MR'
  },
  {
    code: 'MS',
    label: 'Montserrat',
    phone: '1-664',
    value: 'montserrat-MS'
  },
  {
    code: 'MT',
    label: 'Malta',
    phone: '356',
    value: 'malta-MT'
  },
  {
    code: 'MU',
    label: 'Mauritius',
    phone: '230',
    value: 'mauritius-MU'
  },
  {
    code: 'MV',
    label: 'Maldives',
    phone: '960',
    value: 'maldives-MV'
  },
  {
    code: 'MW',
    label: 'Malawi',
    phone: '265',
    value: 'malawi-MW'
  },
  {
    code: 'MX',
    label: 'Mexico',
    phone: '52',
    value: 'mexico-MX'
  },
  {
    code: 'MY',
    label: 'Malaysia',
    phone: '60',
    value: 'malaysia-MY'
  },
  {
    code: 'MZ',
    label: 'Mozambique',
    phone: '258',
    value: 'mozambique-MZ'
  },
  {
    code: 'NA',
    label: 'Namibia',
    phone: '264',
    value: 'namibia-NA'
  },
  {
    code: 'NC',
    label: 'New Caledonia',
    phone: '687',
    value: 'new caledonia-NC'
  },
  {
    code: 'NE',
    label: 'Niger',
    phone: '227',
    value: 'niger-NE'
  },
  {
    code: 'NF',
    label: 'Norfolk Island',
    phone: '672',
    value: 'norfolk island-NF'
  },
  {
    code: 'NG',
    label: 'Nigeria',
    phone: '234',
    value: 'nigeria-NG'
  },
  {
    code: 'NI',
    label: 'Nicaragua',
    phone: '505',
    value: 'nicaragua-NI'
  },
  {
    code: 'NL',
    label: 'Netherlands',
    phone: '31',
    value: 'netherlands-NL'
  },
  {
    code: 'NO',
    label: 'Norway',
    phone: '47',
    value: 'norway-NO'
  },
  {
    code: 'NP',
    label: 'Nepal',
    phone: '977',
    value: 'nepal-NP'
  },
  {
    code: 'NR',
    label: 'Nauru',
    phone: '674',
    value: 'nauru-NR'
  },
  {
    code: 'NU',
    label: 'Niue',
    phone: '683',
    value: 'niue-NU'
  },
  {
    code: 'NZ',
    label: 'New Zealand',
    phone: '64',
    value: 'new zealand-NZ'
  },
  {
    code: 'OM',
    label: 'Oman',
    phone: '968',
    value: 'oman-OM'
  },
  {
    code: 'PA',
    label: 'Panama',
    phone: '507',
    value: 'panama-PA'
  },
  {
    code: 'PE',
    label: 'Peru',
    phone: '51',
    value: 'peru-PE'
  },
  {
    code: 'PF',
    label: 'French Polynesia',
    phone: '689',
    value: 'french polynesia-PF'
  },
  {
    code: 'PG',
    label: 'Papua New Guinea',
    phone: '675',
    value: 'papua new guinea-PG'
  },
  {
    code: 'PH',
    label: 'Philippines',
    phone: '63',
    value: 'philippines-PH'
  },
  {
    code: 'PK',
    label: 'Pakistan',
    phone: '92',
    value: 'pakistan-PK'
  },
  {
    code: 'PL',
    label: 'Poland',
    phone: '48',
    value: 'poland-PL'
  },
  {
    code: 'PM',
    label: 'Saint Pierre and Miquelon',
    phone: '508',
    value: 'saint pierre and miquelon-PM'
  },
  {
    code: 'PN',
    label: 'Pitcairn',
    phone: '870',
    value: 'pitcairn-PN'
  },
  {
    code: 'PR',
    label: 'Puerto Rico',
    phone: '1',
    value: 'puerto rico-PR'
  },
  {
    code: 'PS',
    label: 'Palestine, State of',
    phone: '970',
    value: 'palestine, state of-PS'
  },
  {
    code: 'PT',
    label: 'Portugal',
    phone: '351',
    value: 'portugal-PT'
  },
  {
    code: 'PW',
    label: 'Palau',
    phone: '680',
    value: 'palau-PW'
  },
  {
    code: 'PY',
    label: 'Paraguay',
    phone: '595',
    value: 'paraguay-PY'
  },
  {
    code: 'QA',
    label: 'Qatar',
    phone: '974',
    value: 'qatar-QA'
  },
  {
    code: 'RE',
    label: 'Reunion',
    phone: '262',
    value: 'reunion-RE'
  },
  {
    code: 'RO',
    label: 'Romania',
    phone: '40',
    value: 'romania-RO'
  },
  {
    code: 'RS',
    label: 'Serbia',
    phone: '381',
    value: 'serbia-RS'
  },
  {
    code: 'RU',
    label: 'Russian Federation',
    phone: '7',
    value: 'russian federation-RU'
  },
  {
    code: 'RW',
    label: 'Rwanda',
    phone: '250',
    value: 'rwanda-RW'
  },
  {
    code: 'SA',
    label: 'Saudi Arabia',
    phone: '966',
    value: 'saudi arabia-SA'
  },
  {
    code: 'SB',
    label: 'Solomon Islands',
    phone: '677',
    value: 'solomon islands-SB'
  },
  {
    code: 'SC',
    label: 'Seychelles',
    phone: '248',
    value: 'seychelles-SC'
  },
  {
    code: 'SD',
    label: 'Sudan',
    phone: '249',
    value: 'sudan-SD'
  },
  {
    code: 'SE',
    label: 'Sweden',
    phone: '46',
    value: 'sweden-SE'
  },
  {
    code: 'SG',
    label: 'Singapore',
    phone: '65',
    value: 'singapore-SG'
  },
  {
    code: 'SH',
    label: 'Saint Helena',
    phone: '290',
    value: 'saint helena-SH'
  },
  {
    code: 'SI',
    label: 'Slovenia',
    phone: '386',
    value: 'slovenia-SI'
  },
  {
    code: 'SJ',
    label: 'Svalbard and Jan Mayen',
    phone: '47',
    value: 'svalbard and jan mayen-SJ'
  },
  {
    code: 'SK',
    label: 'Slovakia',
    phone: '421',
    value: 'slovakia-SK'
  },
  {
    code: 'SL',
    label: 'Sierra Leone',
    phone: '232',
    value: 'sierra leone-SL'
  },
  {
    code: 'SM',
    label: 'San Marino',
    phone: '378',
    value: 'san marino-SM'
  },
  {
    code: 'SN',
    label: 'Senegal',
    phone: '221',
    value: 'senegal-SN'
  },
  {
    code: 'SO',
    label: 'Somalia',
    phone: '252',
    value: 'somalia-SO'
  },
  {
    code: 'SR',
    label: 'Suriname',
    phone: '597',
    value: 'suriname-SR'
  },
  {
    code: 'SS',
    label: 'South Sudan',
    phone: '211',
    value: 'south sudan-SS'
  },
  {
    code: 'ST',
    label: 'Sao Tome and Principe',
    phone: '239',
    value: 'sao tome and principe-ST'
  },
  {
    code: 'SV',
    label: 'El Salvador',
    phone: '503',
    value: 'el salvador-SV'
  },
  {
    code: 'SX',
    label: 'Sint Maarten (Dutch part)',
    phone: '1-721',
    value: 'sint maarten (dutch part)-SX'
  },
  {
    code: 'SY',
    label: 'Syrian Arab Republic',
    phone: '963',
    value: 'syrian arab republic-SY'
  },
  {
    code: 'SZ',
    label: 'Swaziland',
    phone: '268',
    value: 'swaziland-SZ'
  },
  {
    code: 'TC',
    label: 'Turks and Caicos Islands',
    phone: '1-649',
    value: 'turks and caicos islands-TC'
  },
  {
    code: 'TD',
    label: 'Chad',
    phone: '235',
    value: 'chad-TD'
  },
  {
    code: 'TF',
    label: 'French Southern Territories',
    phone: '262',
    value: 'french southern territories-TF'
  },
  {
    code: 'TG',
    label: 'Togo',
    phone: '228',
    value: 'togo-TG'
  },
  {
    code: 'TH',
    label: 'Thailand',
    phone: '66',
    value: 'thailand-TH'
  },
  {
    code: 'TJ',
    label: 'Tajikistan',
    phone: '992',
    value: 'tajikistan-TJ'
  },
  {
    code: 'TK',
    label: 'Tokelau',
    phone: '690',
    value: 'tokelau-TK'
  },
  {
    code: 'TL',
    label: 'Timor-Leste',
    phone: '670',
    value: 'timor-leste-TL'
  },
  {
    code: 'TM',
    label: 'Turkmenistan',
    phone: '993',
    value: 'turkmenistan-TM'
  },
  {
    code: 'TN',
    label: 'Tunisia',
    phone: '216',
    value: 'tunisia-TN'
  },
  {
    code: 'TO',
    label: 'Tonga',
    phone: '676',
    value: 'tonga-TO'
  },
  {
    code: 'TR',
    label: 'Turkey',
    phone: '90',
    value: 'turkey-TR'
  },
  {
    code: 'TT',
    label: 'Trinidad and Tobago',
    phone: '1-868',
    value: 'trinidad and tobago-TT'
  },
  {
    code: 'TV',
    label: 'Tuvalu',
    phone: '688',
    value: 'tuvalu-TV'
  },
  {
    code: 'TW',
    label: 'Taiwan, Republic of China',
    phone: '886',
    value: 'taiwan, republic of china-TW'
  },
  {
    code: 'TZ',
    label: 'United Republic of Tanzania',
    phone: '255',
    value: 'united republic of tanzania-TZ'
  },
  {
    code: 'UA',
    label: 'Ukraine',
    phone: '380',
    value: 'ukraine-UA'
  },
  {
    code: 'UG',
    label: 'Uganda',
    phone: '256',
    value: 'uganda-UG'
  },
  {
    code: 'US',
    label: 'United States',
    phone: '1',
    suggested: true,
    value: 'united states-US'
  },
  {
    code: 'UY',
    label: 'Uruguay',
    phone: '598',
    value: 'uruguay-UY'
  },
  {
    code: 'UZ',
    label: 'Uzbekistan',
    phone: '998',
    value: 'uzbekistan-UZ'
  },
  {
    code: 'VA',
    label: 'Holy See (Vatican City State)',
    phone: '379',
    value: 'holy see (vatican city state)-VA'
  },
  {
    code: 'VC',
    label: 'Saint Vincent and the Grenadines',
    phone: '1-784',
    value: 'saint vincent and the grenadines-VC'
  },
  {
    code: 'VE',
    label: 'Venezuela',
    phone: '58',
    value: 'venezuela-VE'
  },
  {
    code: 'VG',
    label: 'British Virgin Islands',
    phone: '1-284',
    value: 'british virgin islands-VG'
  },
  {
    code: 'VI',
    label: 'US Virgin Islands',
    phone: '1-340',
    value: 'us virgin islands-VI'
  },
  {
    code: 'VN',
    label: 'Vietnam',
    phone: '84',
    value: 'vietnam-VN'
  },
  {
    code: 'VU',
    label: 'Vanuatu',
    phone: '678',
    value: 'vanuatu-VU'
  },
  {
    code: 'WF',
    label: 'Wallis and Futuna',
    phone: '681',
    value: 'wallis and futuna-WF'
  },
  {
    code: 'WS',
    label: 'Samoa',
    phone: '685',
    value: 'samoa-WS'
  },
  {
    code: 'XK',
    label: 'Kosovo',
    phone: '383',
    value: 'kosovo-XK'
  },
  {
    code: 'YE',
    label: 'Yemen',
    phone: '967',
    value: 'yemen-YE'
  },
  {
    code: 'YT',
    label: 'Mayotte',
    phone: '262',
    value: 'mayotte-YT'
  },
  {
    code: 'ZA',
    label: 'South Africa',
    phone: '27',
    value: 'south africa-ZA'
  },
  {
    code: 'ZM',
    label: 'Zambia',
    phone: '260',
    value: 'zambia-ZM'
  },
  {
    code: 'ZW',
    label: 'Zimbabwe',
    phone: '263',
    value: 'zimbabwe-ZW'
  }
];

export default COUNTRIES;
