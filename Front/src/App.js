import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu'; // Importez le composant Menu
import FooterComponent from './components/FooterComponent';
import { AuthProvider } from './components/AuthContext';
import HomePage from './pages/HomePage'; // Importez vos autres composants de page
import LegalMentionPage from './pages/cms/LegalMentionsPage';
import TermsAndConditionsPage from './pages/cms/TermsAndConditionsPage';
import ShippingAndReturns from './pages/cms/ShippingAndReturns';
import PrivacyPage from './pages/cms/PrivacyPage';
import AutoLoginPage from './pages/user/AutoLoginPage';
import LoginPage from './pages/user/LoginPage';
import ResetPasswordPage from './pages/user/ResetPasswordPage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';
import ProfilePage from './pages/user/ProfilePage'; 
import CartPage from './pages/user/CartPage';

import BackOfficeSideMenu from './components/back-office-components/BackOfficeSideMenu';
import OrdersManagerPage from './pages/back-office/orders-page/OrdersManagerPage';
import ProductsManagerPage from './pages/back-office/products-page/ProductsManagerPage'
import UserManagerPage from './pages/back-office/user-page/UserManagerPage';
import UserHistoriesPage from './pages/back-office/user-page/UserHistoriesPage';
import BrandManagerPage from './pages/back-office/brand-page/BrandManagerPage';
import FeaturesManagerPage from './pages/back-office/features-page/FeaturesManagerPage';
import StockErrorPage from './pages/back-office/stock-page/StockErrorPage';

import BOSupportTicketPage from './pages/back-office/support-page/SupportTicketPage'


// Importez d'autres pages selon vos besoins

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='pt-16  ' >
          <Menu />
          <Routes>
            <Route path="/auto-login" element={<AutoLoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/mention-legales" element={<LegalMentionPage />} />
             <Route path="/conditions-generales-de-vente" element={<TermsAndConditionsPage />} />
            <Route path="/livraison" element={<ShippingAndReturns />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<BackOfficeSideMenu />}>
              <Route path="orders" element ={<OrdersManagerPage />}/>

              <Route path="products" element ={<ProductsManagerPage />}/>
              <Route path="users" element ={<UserManagerPage />}/>
              <Route path="user-histories" element ={<UserHistoriesPage />}/>
              <Route path="brands" element ={<BrandManagerPage />}/>
              <Route path="features" element ={<FeaturesManagerPage />}/>
              <Route path="stockerror" element ={<StockErrorPage />}/>
              <Route path="supportticket" element ={<BOSupportTicketPage />}/>
            </Route>
            {/*<Route path="/inventory" element={<InventoryPage />} />*/}
            // Ajoutez d'autres routes si nécessaire

              {/* Définissez d'autres routes selon vos besoins */}
          </Routes>
          <FooterComponent/>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className='mt-16'>
//           <Menu />
//           <Routes>
//           <Route path="/auto-login" element={<AutoLoginPage />} />
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/inventory" element={<InventoryPage />} />
//           <Route path="/support" element={<SubmitReportPage />} />
//           <Route path="/sms" element={<SmsSubmitPage />} />
//           {/* Routes Atlas */}
//           <Route path="/atlas" element={<AtlasSideMenu />}>
//             <Route path="" element ={<AtlasDashBoardPage />}/>
//             <Route path="overview">
//               <Route path="total" element ={<AtlasAllProductReportListPage/>}/>
//               <Route path="matched" element ={<AtlasPage />}/>
//             </Route>
//             <Route path="/atlas/graph" element={<AtlasProductResumePopUp />} />
//             <Route path="/atlas/last-product-move" element={<AtlasAllProductReportListPage />} />
//             <Route path="/atlas/products/" element={<AtlasAllProductReportListPage />} />
//             <Route path="/atlas/daily-reports" element={<AtlasAllDailyReportListPage />} />
//             <Route path="/atlas/competitors/list" />
//             <Route path="/atlas/competitors/analysis" />
//             <Route path="/atlas/tools/calculator" />
//             <Route path="/atlas/tools/converter" />
//             <Route path="/atlas/settings/profile" />
//             <Route path="/atlas/settings/preferences" />
//           </Route>
//           {/* Routes CRM */}
//           <Route path="/crm" element={<CRMSideMenu />}>
//             <Route path="" element ={<CRMDashBoardPage />}/>
//             <Route path="overview">
//               <Route path="total" element ={<CRMAllProductReportListPage/>}/>
//             </Route>
//             <Route path="/crm/graph" element={<CRMCustomerResumePopUp />} />
//             <Route path="/crm/last-product-move" element={<CRMAllProductReportListPage />} />
//             <Route path="/crm/products/" element={<CRMAllProductReportListPage />} />
//             <Route path="/crm/daily-reports" element={<CRMAllDailyReportListPage />} />
//             <Route path="/crm/competitors/list" />
//             <Route path="/crm/competitors/analysis" />
//             <Route path="/crm/tools/calculator" />
//             <Route path="/crm/tools/converter" />
//             <Route path="/crm/settings/profile" />
//             <Route path="/crm/settings/preferences" />
//           </Route>

//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/admin" element={<BackOfficeSideMenu />}>
//             <Route path="users" element ={<UserManagerPage />}/>
//             <Route path="stockerror" element ={<StockErrorPage />}/>
//             <Route path="warehouse" element ={<WarehousePage />}/>
//             <Route path="supportticket" element ={<BOSupportTicketPage />}/>
//           </Route>
//           {/*<Route path="/inventory" element={<InventoryPage />} />*/}
//           // Ajoutez d'autres routes si nécessaire

//             {/* Définissez d'autres routes selon vos besoins */}
//           </Routes>
//           <FooterComponent/>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;
