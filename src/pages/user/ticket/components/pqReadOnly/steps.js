import PersonalDetail from './components/personalDetail/PersonalDetail'
import ProposedRole from './components/ProposedRole'
import Qualifications from './components/qualifications/Qualifications'
import CareerHistory from './components/careerHistory/CareerHistory'
import CivilAndDisciplinary from './components/civilDisciplinary/CivilDisciplinary'
import DisclosureConflict from './components/DisclosureConflict'
import Documents from './components/DocumentsPQ'

export default [
    {
        id: 1,
        title: 'Personal Details',
        component: PersonalDetail,
        isActive: true
    },
    {
        id: 2,
        title: 'Proposed Role',
        component: ProposedRole,
        isActive: true
    },
    {
        id: 3,
        title: 'Qualifications',
        component: Qualifications,
        isActive: true
    },
    {
        id: 4,
        title: 'Career History',
        component: CareerHistory,
        isActive: true
    },
    {
        id: 5,
        title: 'Civil And Disciplinary',
        component: CivilAndDisciplinary,
        isActive: false
    },
    {
        id: 6,
        title: 'Disclosure of Conflict of Interest',
        component: DisclosureConflict,
        isActive: false
    },
    {
        id: 7,
        title: 'Documents',
        component: Documents,
        isActive: true
    },
]

