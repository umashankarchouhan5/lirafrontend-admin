import PersonalDetail from '../../components/pq/personalDetail/PersonalDetail'
import ProposedRole from '../../components/pq/ProposedRole'
import Qualifications from '../../components/pq/qualifications/Qualifications'
import CareerHistory from '../../components/pq/careerHistory/CareerHistory'
import CivilAndDisciplinary from '../../components/pq/civilDisciplinary/CivilDisciplinary'
import DisclosureConflict from '../../components/pq/DisclosureConflict'
import Review103 from '../../components/Review103'
import Documents from '../../components/Documents'

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
    {
        id: 8,
        title: 'Review',
        component: Review103,
        isActive: false
    }
]

