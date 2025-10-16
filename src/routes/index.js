import { createBrowserRouter } from 'react-router-dom';
import HomePageRoutes from './HomePageRoutes';
import AuthPageRoutes from './AuthPageRoutes';
import BlogPageRoutes from './BlogPageRoutes';
import UserPageRoutes from './UserPageRoutes';
import MeetingPageRoutes from './MeetingPageRoutes';
import MentorPageRoutes from './MentorPageRoutes';
import PaymentPageRoutes from './PaymentPageRoutes';

import AdminPageRoutes from './admin/AdminPageRoutes';

const routes = [
    ...HomePageRoutes,
    ...AuthPageRoutes,
    ...BlogPageRoutes,
    ...UserPageRoutes,
    ...MeetingPageRoutes,
    ...MentorPageRoutes,
    ...PaymentPageRoutes,

    ...AdminPageRoutes,

    // {
    //     path: '*',
    //     element: <NotFoundPage />
    // }
];

const router = createBrowserRouter(routes);

export default router;
