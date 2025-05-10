import React from 'react';
import { Link } from 'react-router-dom';
import destockdisSvg from '../assets/destockdis.svg';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#3C3333] text-white">
      <div className="container mx-auto py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-shrink-0 w-full md:w-1/4 md:mb-0 mb-0">
            <figure className="object-contain">
              <Link to="/" onClick={scrollToTop}>
                <img 
                  src={destockdisSvg}
                  alt="DestockDis" 
                  className="h-12 w-36 md:ml-12 ml-6"
                />
              </Link>
            </figure>
          </div>
          {/*<div className="w-full md:w-auto md:mr-8 pr-16 md:pl-0 pl-6 my-4">
            <ul className="space-y-2 md:space-y-0 md:space-x-6 flex flex-col md:flex-row text-sm font-semibold leading-3">
              <li>
                <Link to="/mention-legales" className="hover:underline text-xs" onClick={scrollToTop}>
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/conditions-generales-de-vente" className="hover:underline text-xs" onClick={scrollToTop}>
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" className="hover:underline text-xs" onClick={scrollToTop}>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/livraison" className="hover:underline text-xs" onClick={scrollToTop}>
                  Livraison
                </Link>
              </li>
            </ul>
          </div>*/}
        </div>
      </div>
    </footer>
  );
};

export default Footer;