import HomePageLayout from "../layouts/client/HomePageLayout ";
import MentorRegister from "../pages/mentor/Register";

const MentorPageRoutes = [
  {
    path: "/mentor",
    element: <HomePageLayout />,
    children: [
      {
        path: "register",
        element: <MentorRegister />,
      },
    ],
  },
];

export default MentorPageRoutes;
