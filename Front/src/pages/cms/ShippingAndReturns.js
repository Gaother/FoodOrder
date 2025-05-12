import React from 'react';
import FooterTrust from '../../components/FooterTrustComponents';

const ShippingAndReturns = () => {
  return (
    <div className="bg-gray-100" style={{ minHeight: "84vh" }}>
      {/* HomePageForProComponents */}

      {/* Main Content */}
      <div className="flex justify-center py-8">
        <div id="content-wrapper" className="w-full md:w-3/4 lg:w-1/2">
          <section id="main">
            {/* Page Header */}
            <header className="page-header mb-6">
              <h1 className="text-2xl font-bold text-center">Livraison</h1>
            </header>

            {/* Page Content */}
            <section id="content" className="page-content">
              <h2 className="text-lg font-bold mb-4">Expéditions et retours</h2>
              <h3 className="text-md font-semibold mb-4">Expédition de votre colis</h3>
              <p className="mb-4">
                Les colis sont généralement expédiés dans un délai de 2 jours après réception du paiement. Ils sont expédiés via GLS, messagerie ou affrètement (sur devis) avec un numéro de suivi et remis avec signature. Veuillez nous contacter avant de choisir ce mode de livraison, car il induit des frais supplémentaires. Quel que soit le mode de livraison choisi, nous vous envoyons un lien pour suivre votre colis en ligne.
              </p>
              <p className="mb-4">
                Les frais d'expédition incluent les frais de préparation et d'emballage ainsi que les frais de port. Les frais de préparation sont fixes, tandis que les frais de transport varient selon le poids total du colis. Nous vous recommandons de regrouper tous vos articles dans une seule commande. Nous ne pouvons regrouper deux commandes placées séparément et des frais d'expédition s'appliquent à chacune d'entre elles.
              </p>
              <p className="mb-4">
                Votre colis est expédié à vos propres risques, mais une attention particulière est portée aux objets fragiles. Les dimensions des boîtes sont appropriées et vos articles sont correctement protégés.
              </p>
            </section>
          </section>
        </div>
      </div>

      {/* FooterTrust */}
      <FooterTrust />
    </div>
  );
};

export default ShippingAndReturns;