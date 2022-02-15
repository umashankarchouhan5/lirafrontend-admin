import GeneralInfo101 from  '../components/GeneralInfo101';
import GeneralInfo103 from  '../components/GeneralInfo103';
import GeneralInfo105 from  '../components/GeneralInfo105';
import GeneralInfo103_init from  '../components/GeneralInfo103_init';
import GeneralInfo105_init from  '../components/GeneralInfo105_init';
import Review from  '../components/Review';
import Review103 from  '../components/Review103';
import Documents from  '../components/Documents';
import PaidFees from  '../components/PaidFees';

import process_702 from '../config/processes/702';
import process_307 from '../config/processes/307';
import process_307_init from '../config/processes/307_init';
import process_700 from '../config/processes/700';
import process_501 from '../config/processes/501';
import process_502 from '../config/processes/502';
import process_505 from '../config/processes/505';
import process_201 from '../config/processes/201';
import process_203 from '../config/processes/203';
import process_121 from '../config/processes/121';
import process_107 from '../config/processes/107';
import process_345 from '../config/processes/345';
import process_380 from '../config/processes/380';
import process_111 from '../config/processes/111';
import process_111_fee from '../config/processes/111_fee';
import process_117 from '../config/processes/117';
import process_804 from '../config/processes/804';
import process_2000 from '../config/processes/2000';
import process_100 from '../config/processes/100';
import process_115 from '../config/processes/115';
import process_102 from '../config/processes/102';
import process_803 from '../config/processes/803';
import process_2001 from '../config/processes/2001';
import process_1501 from '../config/processes/1501';
import process_2021 from '../config/processes/2021';
import process_401 from '../config/processes/401';
import process_106_foundation from '../config/processes/106_foundation';
import process_402 from '../config/processes/402';
import process_404 from '../config/processes/404';
import process_407 from '../config/processes/407';
import process_410 from '../config/processes/410';
import process_411 from '../config/processes/411';
import process_2002 from '../config/processes/2002';
import process_2003 from '../config/processes/2003';
import process_2004 from '../config/processes/2004';
import process_2005 from '../config/processes/2005';
import process_2006 from '../config/processes/2006';
import process_2007 from '../config/processes/2007';
import process_2008 from '../config/processes/2008';
import process_2011 from '../config/processes/2011';
import process_2012 from '../config/processes/2012';
import process_2013 from '../config/processes/2013';
import process_2031 from '../config/processes/2031';
import process_3001 from '../config/processes/3001';
import process_4001 from '../config/processes/4001';
import process_2041 from '../config/processes/2041';
import process_3032 from '../config/processes/3032';
import process_4011 from '../config/processes/4011';
import process_99 from '../config/processes/99';
import process_140 from '../config/processes/140';
import process_408 from '../config/processes/408';
import process_600 from '../config/processes/600';
import process_601 from '../config/processes/601';
import process_357 from '../config/processes/357';

export default {
    // Name reservation
    101: [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo101,
            isActive: true
        },
        {
            id: 2,
            title: 'Review',
            component: Review,
            isActive: false
        }
    ],
    '103_init': [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo103_init,
            isActive: true
        },
        {
            id: 2,
            title: 'Review',
            component: Review,
            isActive: false
        }
    ],
    '105_init': [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo105_init,
            isActive: true
        },
        {
            id: 2,
            title: 'Review',
            component: Review,
            isActive: false
        }
    ],
    103: [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo103,
            isActive: true
        },
        {
            id: 2,
            title: 'Documents',
            component: Documents,
            isActive: false
        },
        {
            id: 3,
            title: 'Paid Fees',
            component: PaidFees,
            isActive: false
        },
        {
            id: 4,
            title: 'Review',
            component: Review103,
            isActive: false
        }
    ],
    105: [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo105,
            isActive: true
        },
        {
            id: 2,
            title: 'Documents',
            component: Documents,
            isActive: false
        },
        {
            id: 3,
            title: 'Paid Fees',
            component: PaidFees,
            isActive: false
        },
        {
            id: 4,
            title: 'Review',
            component: Review103,
            isActive: false
        }
    ],
    // TODO Refactor
    700: process_700,
    701: process_700,
    704: process_700,
    702: process_702,
    109: process_307,
    300: process_307,
    301: process_307,
    302: process_307,
    303: process_307,
    304: process_307,
    305: process_307_init,
    306: process_307,
    307: process_307,
    309: process_307,
    310: process_307,
    311: process_307,
    602: process_307,
    603: process_307,
    '307_init': process_307_init,
    501: process_501,
    502: process_502,
    505: process_505,
    201: process_201,
    202: process_201,
    203: process_203,
    111: process_111,
    '111_fee': process_111_fee,
    121: process_121,
    107: process_107,
    345: process_345,
    113: process_345,
    380: process_380,
    381: process_380,
    383: process_380,
    390: process_380,
    117: process_117,
    804: process_804,
    2000: process_2000,
    100: process_100,
    115: process_115,
    116: process_115,
    346: process_115,
    347: process_115,
    102: process_102,
    99: process_99,
    803: process_803,
    2001: process_2001,
    1501: process_1501,
    1502: process_1501,
    1503: process_1501,
    1504: process_1501,
    1505: process_1501,
    2021: process_2021,
    3021: process_2021,
    4021: process_2021,
    407: process_407,
    410: process_410,
    420: process_410,
    430: process_410,
    440: process_410,
    405: process_411,
    411: process_411,
    421: process_411,
    431: process_411,
    441: process_411,
    401: process_401,
    402: process_402,
    404: process_404,
    406: process_407,
    106: process_106_foundation,
    '106_foundation': process_106_foundation,
    2002: process_2002,
    2003: process_2003,
    2004: process_2004,
    2005: process_2005,
    2006: process_2006,
    2007: process_2007,
    2008: process_2008,
    2011: process_2011,
    2012: process_2012,
    2013: process_2013,
    2031: process_2031,
    3031: process_2031,
    4031: process_2031,
    3001: process_3001,
    4001: process_4001,
    2041: process_2041,
    2042: process_2041,
    2043: process_2041,
    2044: process_2041,
    2045: process_2041,
    2046: process_2041,
    2047: process_2041,
    2048: process_2041,
    2032: process_3032,
    3032: process_3032,
    4032: process_3032,
    3011: process_4011,
    4011: process_4011,
    140: process_140,
    408: process_408,
    600: process_600,
    601: process_601,
    357: process_357,

}
