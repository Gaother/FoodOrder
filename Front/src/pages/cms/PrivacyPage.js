import React from 'react';
import FooterTrust from '../../components/FooterTrustComponents';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100" style={{ minHeight: "84vh" }}>
      {/* Main Content */}
      <div className="flex justify-center py-8">
        <div id="content-wrapper" className="w-full md:w-3/4 lg:w-1/2">
          <section id="main">
            {/* Page Header */}
            <header className="page-header mb-6">
              <h1 className="text-2xl font-bold text-center">Politique de confidentialité</h1>
            </header>

            {/* Page Content */}
            <section id="content" className="page-content">
              <p className="text-center mb-4">DestockDis – SDL SAS</p>
              <p className="text-center mb-4">POLITIQUE RELATIVE AUX DONNÉES À CARACTÈRE PERSONNEL DES CLIENTS / CONTACTS</p>

              <h2 className="text-lg font-bold mb-4">1. PRÉAMBULE</h2>
              <p className="mb-4">
                Le Règlement (EU) 2016/679 du Parlement Européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement de données à caractère personnel et à la libre circulation de ces données, autrement appelé le Règlement général sur la protection des données (ci-après RGPD), fixe le cadre juridique applicable aux traitements de données à caractère personnel.
              </p>
              <p className="mb-4">
                Le RGPD renforce les droits et les obligations des responsables du traitement, des sous-traitants, des personnes concernées et des destinataires des données. Dans le cas de notre activité, nous sommes amenés à traiter des données à caractère personnel.
              </p>

              <h2 className="text-lg font-bold mb-4">2. OBJET</h2>
              <p className="mb-4">
                La présente politique a pour objet de satisfaire à l’obligation d’information à laquelle DestockDis est tenue en application du RGPD et de formaliser les droits et les obligations de ses clients et contacts au regard du traitement de leurs données à caractère personnel.
              </p>

              <h2 className="text-lg font-bold mb-4">3. PORTÉE</h2>
              <p className="mb-4">
                La présente politique s’applique dans le cadre de la mise en place de l’ensemble des traitements de données à caractère personnel relatives aux clients et aux contacts de DestockDis.
              </p>

              <h2 className="text-lg font-bold mb-4">4. PRINCIPES GÉNÉRAUX</h2>
              <p className="mb-4">
                Aucun traitement de données à caractère personnel n'est mis en œuvre au sein de DestockDis sans se conformer aux principes généraux du RGPD.
              </p>

              <h2 className="text-lg font-bold mb-4">5. TYPES DE DONNÉES COLLECTÉES</h2>
              <p className="mb-4"><strong>Données non techniques :</strong> Identité, Coordonnées.</p>
              <p className="mb-4"><strong>Données techniques :</strong> Données de connexion (logs), Données d’acceptation (clic).</p>

              <h2 className="text-lg font-bold mb-4">6. ORIGINES DES DONNÉES</h2>
              <p className="mb-4">
                Les données relatives à nos clients et contacts sont généralement collectées directement auprès d’eux ou via des partenaires.
              </p>

              <h2 className="text-lg font-bold mb-4">7. FINALITÉS ET BASES LÉGALES</h2>
              <p className="mb-4">
                Les traitements que nous effectuons reposent principalement sur l’exécution du contrat que vous concluez avec nous, ainsi que sur l’intérêt légitime de DestockDis.
              </p>

              <h2 className="text-lg font-bold mb-4">8. DESTINATAIRES DES DONNÉES – HABILITATION &amp; TRAÇABILITÉ</h2>
              <p className="mb-4">
                Les données ne sont accessibles qu’à des destinataires internes ou externes habilités. Tous les accès font l’objet d’une mesure de traçabilité.
              </p>

              <h2 className="text-lg font-bold mb-4">9. DURÉE DE CONSERVATION</h2>
              <table className="table-auto border-collapse w-full mb-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Traitement</th>
                    <th className="border px-4 py-2">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Données relatives aux clients</td>
                    <td className="border px-4 py-2">Pendant la durée des relations contractuelles augmentée de 3 ans</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Données relatives aux contacts et prospects</td>
                    <td className="border px-4 py-2">3 ans au moins à compter de leur collecte</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Données techniques</td>
                    <td className="border px-4 py-2">1 an au moins</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-lg font-bold mb-4">10. DROITS DES PERSONNES CONCERNÉES</h2>
              <p className="mb-4">Les clients et contacts disposent d’un droit de confirmation, d’accès, de rectification et de suppression de leurs données.</p>

              <h2 className="text-lg font-bold mb-4">11. SÉCURITÉ</h2>
              <p className="mb-4">
                DestockDis met en œuvre des mesures techniques et organisationnelles appropriées pour assurer la sécurité des données.
              </p>

              <h2 className="text-lg font-bold mb-4">12. VIOLATION DE DONNÉES</h2>
              <p className="mb-4">
                En cas de violation de données, DestockDis s’engage à en notifier la Cnil.
              </p>

              <h2 className="text-lg font-bold mb-4">13. DROIT D’INTRODUIRE UNE RÉCLAMATION AUPRÈS DE LA CNIL</h2>
              <p className="mb-4">
                Les clients et contacts sont informés de leur droit d’introduire une plainte auprès de la CNIL.
              </p>

              <h2 className="text-lg font-bold mb-4">14. ÉVOLUTION</h2>
              <p className="mb-4">
                Cette politique peut être modifiée ou aménagée à tout moment en fonction de l’évolution légale.
              </p>

              <h2 className="text-lg font-bold mb-4">15. POUR PLUS D'INFORMATIONS</h2>
              <p className="mb-4">
                Pour toute information complémentaire, vous pouvez contacter le service à : <a href="mailto:contact@destockdis.com" className="text-blue-500 hover:underline">contact@destockdis.com</a>.
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

export default PrivacyPolicy;