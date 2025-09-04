import { createBrowserRouter } from 'react-router-dom';
import HomePageRoutes from './HomePageRoutes';
import AuthPageRoutes from './AuthPageRoutes';
import { NotFoundPage } from '../pages/other';
import BlogPageRoutes from './BlogPageRoutes';

const routes = [
    ...HomePageRoutes,
    ...AuthPageRoutes,
    ...BlogPageRoutes
    // {
    //     path: '*',
    //     element: <NotFoundPage />
    // }
];

const router = createBrowserRouter(routes);

export default router;
