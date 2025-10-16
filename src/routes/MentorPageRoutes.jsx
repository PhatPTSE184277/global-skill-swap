import HomePageLayout from "../layouts/client/HomePageLayout ";
import MentorRegister from "../pages/mentor/Register";
import FindingMentor from "../pages/user/FindingMentor";

const MentorPageRoutes = [
  {
    path: "/mentor",
    element: <HomePageLayout />,
    children: [
      {
        path: "register",
        element: <MentorRegister />,
      },

      {
        path: "finding",
        element: <FindingMentor />,
      },
    ],
  },
];

export default MentorPageRoutes;
