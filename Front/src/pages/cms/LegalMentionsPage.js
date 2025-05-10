import React from 'react';
import FooterTrust from '../../components/FooterTrustComponents';


const LegalMentions = () => {
  return (
    <div className="bg-gray-100" style={{ minHeight: "84vh" }} >
      <div className="flex justify-center py-8">
        <div id="content-wrapper" className="w-full md:w-3/4 lg:w-1/2">
          <section id="main">
            {/* Page Header */}
            <header className="page-header mb-6">
              <h1 className="text-2xl font-bold text-center">Mentions légales</h1>
            </header>

            {/* Page Content */}
            <section id="content" className="page-content">
              <p className="mb-4">
                Le présent site est la propriété de la société SDL, Société par Action Simplifiée au capital de 15.000 Euros.
              </p>
              <p className="mb-4">
                <strong>R.C.S :</strong> 514 844 752 RCS LILLE
              </p>
              <p className="mb-4">
                <strong>Siège Social :</strong> 2 ZAMIN 1ERE AVENUE, 59160 LOMME.
              </p>
              <p className="mb-4">
                <strong>Numéro de TVA intracommunautaire :</strong> FR 67 514844752
              </p>
              <p className="mb-4">
                <strong>Directeur de publication :</strong> Benjamin Lerouge - Président
              </p>
              <p className="mb-4">
                <strong>Hébergeur :</strong> AQUEOS
              </p>
              <p className="mb-4">10 bois de rigny</p>
              <p className="mb-4">10160 Rigny le ferron</p>
              <p className="mb-4">SARL au capital de 12.000 €</p>
              <p className="mb-4">
                <strong>N° SIRET :</strong> 47876707200026
              </p>
              <p className="mb-4">
                <strong>N° TVA :</strong> FR15478767072
              </p>
              <p className="mb-4">
                <strong>Contacts :</strong> <a href="https://support.aqueos.net" className="text-blue-500 hover:underline">https://support.aqueos.net</a>
              </p>
            </section>
          </section>
        </div>
      </div>
      <FooterTrust/>
    </div>
  );
};

export default LegalMentions;