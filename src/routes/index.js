import { createBrowserRouter } from 'react-router-dom';
import HomePageRoutes from './HomePageRoutes';
import AuthPageRoutes from './AuthPageRoutes';
import BlogPageRoutes from './BlogPageRoutes';
import UserPageRoutes from './UserPageRoutes';
<<<<<<< Updated upstream

import AdminPageRoutes from './admin/AdminPageRoutes';

import RoomPageRoutes from './RoomPageRoutes';

=======
import MeetingPageRoutes from './MeetingPageRoutes';
import MentorPageRoutes from './MentorPageRoutes';

import AdminPageRoutes from './admin/AdminPageRoutes';
>>>>>>> Stashed changes

const routes = [
    ...HomePageRoutes,
    ...AuthPageRoutes,
    ...BlogPageRoutes,
    ...UserPageRoutes,
<<<<<<< Updated upstream

    ...AdminPageRoutes,

    ...RoomPageRoutes,

=======
    ...MeetingPageRoutes,
    ...MentorPageRoutes,

    ...AdminPageRoutes,

>>>>>>> Stashed changes
    // {
    //     path: '*',
    //     element: <NotFoundPage />
    // }
];

const router = createBrowserRouter(routes);

export default router;
