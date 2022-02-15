import GeneralInfo from '../../components/monthlyReturn/GeneralInfo';

import Review from '../../components/Review'

const steps = [
    {
        id: 1,
        title: 'General Info',
        isActive: false,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Review',
        component: Review,
        isActive: false,
    }
];

export default steps;