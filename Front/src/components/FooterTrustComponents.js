import React from 'react';

const TrustIcons = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center px-16">
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/reservePro.jpg')}
                alt="Réservé aux pros"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Réservé aux pros</h3>
            <p>Accès sécurisé</p>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/paiementSecu.jpg')}
                alt="Paiement pro sécurisé"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Paiement pro sécurisé</h3>
            <p>Virement ou CB</p>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/retraitPerso.jpg')}
                alt="Retrait personnalisé"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Retrait personnalisé</h3>
            <p>Retrait ou livraison</p>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/arrivageRegu.jpg')}
                alt="Arrivages réguliers"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Arrivages réguliers</h3>
            <p>Stock dispo à Lille</p>
          </div>
          <div className="trust text-center col-span-2 md:col-span-1">
            <figure className="flex justify-center">
              <img
                src={require('../assets/serviceClient.jpg')}
                alt="Service client pro"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Service client pro</h3>
            <p>+33(0) 7 82 27 23 97</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIcons;