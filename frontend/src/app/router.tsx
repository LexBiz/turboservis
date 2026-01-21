import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./ui/Layout";
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import AboutPage from "../pages/AboutPage";
import ContactsPage from "../pages/ContactsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contacts", element: <ContactsPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);


