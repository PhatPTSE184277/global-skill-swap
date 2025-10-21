import HomePageLayout from "../layouts/client/HomePageLayout ";
import MentorPackages from "../pages/mentor/MentorPackage";
import MentorRegister from "../pages/mentor/Register";
import FindingMentor from "../pages/user/FindingMentor";
import { ProductProvider } from "../contexts/ProductContext";

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
        path: "package",
        element: <ProductProvider><MentorPackages /></ProductProvider>,
      },
      {
        path: "finding",
        element: <FindingMentor />,
      },
    ],
  },
];

export default MentorPageRoutes;
