import HomePageLayout from "../layouts/client/HomePageLayout ";
import { HomePage } from "../pages/client";

const HomePageRoutes = [
    {
        path: "/",
        element: <HomePageLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
        ],
    },
];

export default HomePageRoutes;