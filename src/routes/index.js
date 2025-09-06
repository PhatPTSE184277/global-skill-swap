import { createBrowserRouter } from 'react-router-dom';
import HomePageRoutes from './HomePageRoutes';
import AuthPageRoutes from './AuthPageRoutes';
import BlogPageRoutes from './BlogPageRoutes';
import UserPageRoutes from './UserPageRoutes';

const routes = [
    ...HomePageRoutes,
    ...AuthPageRoutes,
    ...BlogPageRoutes,
    ...UserPageRoutes,
    // {
    //     path: '*',
    //     element: <NotFoundPage />
    // }
];

const router = createBrowserRouter(routes);

export default router;
