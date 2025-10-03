import { createBrowserRouter } from 'react-router-dom';
import HomePageRoutes from './HomePageRoutes';
import AuthPageRoutes from './AuthPageRoutes';
import BlogPageRoutes from './BlogPageRoutes';
import UserPageRoutes from './UserPageRoutes';
import MeetingPageRoutes from './MeetingPageRoutes';

import AdminPageRoutes from './admin/AdminPageRoutes';

import RoomPageRoutes from './RoomPageRoutes';


const routes = [
    ...HomePageRoutes,
    ...AuthPageRoutes,
    ...BlogPageRoutes,
    ...UserPageRoutes,
    ...MeetingPageRoutes,

    ...AdminPageRoutes,

    ...RoomPageRoutes,

    // {
    //     path: '*',
    //     element: <NotFoundPage />
    // }
];

const router = createBrowserRouter(routes);

export default router;
