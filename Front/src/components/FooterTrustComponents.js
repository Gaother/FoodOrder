import React from 'react';

const TrustIcons = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center px-16">
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/cuisine.png')}
                alt="Fait maison"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Fait maison</h3>
            <p>Avec des produits frais</p>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/paiementSecu.jpg')}
                alt="Gouts asiatiques authentiques"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Gouts asiatiques authentiques</h3>
            <div className={'flex flex-row gap-2 justify-center'}>
              <p>Cuisine</p>
              <img src={require('../assets/flags/vietnam.png')} className={'h-6 w-6'}/>
              <img src={require('../assets/flags/japon.png')} className={'h-6 w-6'}/>
              <img src={require('../assets/flags/thailande.png')} className={'h-6 w-6'}/>
              <img src={require('../assets/flags/chine.png')} className={'h-6 w-6'}/>
              <img src={require('../assets/flags/coree.png')} className={'h-6 w-6'}/>
            </div>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/horloge.png')}
                alt="Disponible à toute heure"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Disponible à toute heure</h3>
            <p>Lunch Box ou traiteur</p>
          </div>
          <div className="trust text-center">
            <figure className="flex justify-center">
              <img
                src={require('../assets/vegetarien.png')}
                alt="Végétarien friendly"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Végétarien friendly</h3>
            <p>Toujours un choix végé disponible</p>
          </div>
          {/*<div className="trust text-center col-span-2 md:col-span-1">
            <figure className="flex justify-center">
              <img
                src={require('../assets/serviceClient.jpg')}
                alt="Section commentaire"
                className="h-12 w-12 object-contain"
              />
            </figure>
            <h3 className="font-bold mt-4">Section commentaire</h3>
            <p>A l'écoute de vos envies</p>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default TrustIcons;