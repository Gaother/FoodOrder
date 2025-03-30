import React from 'react';

const HomepageBanner = () => {
  return (
    <div className="bg-black text-white flex items-center justify-center">
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center text-center lg:text-left">
          <div className="w-full lg:w-1/2 xl:w-5/12 xl:ml-32 mb-8 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <p>
                Destockage électro <br />
                <span className="text-yellow-500">Réservé aux PROS</span>
              </p>
            </h1>
            <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-lg sm:text-l">
              <li className="flex items-center justify-center lg:justify-start">
                <figure className="object-contain w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-4">
                  <img
                    src={require('../assets/homePageBox.jpg')}
                    alt="Des arrivages tous les jours"
                  />
                </figure>
                Des arrivages tous les jours
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <figure className="object-contain w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-4">
                  <img
                    src={require('../assets/homePageCheck.jpg')}
                    alt="Sur les plus grandes marques"
                  />
                </figure>
                Sur les plus grandes marques
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <figure className="object-contain w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-4">
                  <img
                    src={require('../assets/homePagePercent.jpg')}
                    alt="Ventes jusqu’à épuisement des stocks"
                  />
                </figure>
                Ventes jusqu’à épuisement des stocks
              </li>
            </ul>
          </div>
          <div className="hidden lg:block lg:w-1/2 xl:w-6/12">
            <figure className="object-contain transform">
              <img
                src={require('../assets/homePage.jpg')}
                alt="Homepage Banner"
                className="w-auto h-48 sm:h-72"
              />
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageBanner;