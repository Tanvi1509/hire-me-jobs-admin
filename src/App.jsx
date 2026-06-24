import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Jobs from "./pages/jobs/Jobs";
import Applications from "./pages/applications/Applications";
import Companies from "./pages/companies/Companies";
import Candidates from "./pages/candidates/Candidates";
import Analytics from "./pages/analytics/Analytics";
import Notifications from "./pages/notifications/Notifications";
import Settings from "./pages/settings/Settings";
import Role from "./pages/roles/Role";

import Permission from "./pages/permission/Permission";
import AddPermission from "./pages/permission/AddPermission";

import AddRole from "./pages/roles/AddRole";
import EditRole from "./pages/roles/EditRole";

import Modules from "./pages/modules/Modules";
import AddModule from "./pages/modules/AddModule";
import EditModule from "./pages/modules/EditModule";

import Department from "./pages/department/Department";
import EditDepartment from "./pages/department/EditDepartment";
import AddDepartment from "./pages/department/AddDepartment";

import Languages from "./pages/Languages/Languages";
import EditLanguages from "./pages/Languages/EditLanguages";
import AddLanguages from "./pages/Languages/AddLanguages";

import Skills from "./pages/skills/Skills";
import EditSkils from "./pages/skills/EditSkills";
import AddSkills from "./pages/skills/AddSkills";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="roles" element={<Role />} />
            <Route path="add-role" element={<AddRole />} />
            <Route path="edit-role/:id" element={<EditRole />} />

            <Route path="permissions" element={<Permission />} />
            <Route path="add-permission" element={<AddPermission />} />

            <Route path="modules" element={<Modules />} />
            <Route path="add-module" element={<AddModule />} />
            <Route path="edit-module/:id" element={<EditModule />} />

            <Route path="/department" element={<Department />} />
            <Route path="/department/add" element={<AddDepartment />} />
            <Route path="/department/edit/:id" element={<EditDepartment />} />

             <Route path="/languages" element={<Languages />} />
            <Route path="/languages/add" element={<AddLanguages />} />
            <Route path="/languages/edit/:id" element={<EditLanguages />} />
            
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/add" element={<AddSkills />} />
            <Route path="/skills/edit/:id" element={<EditSkils />} />
            
              

            {/* <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="companies" element={<Companies />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} /> */}
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
