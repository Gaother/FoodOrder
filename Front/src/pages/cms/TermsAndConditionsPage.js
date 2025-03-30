import React from 'react';
import FooterTrust from '../../components/FooterTrustComponents';
import HomePageForProComponents from '../../components/HomePageForProComponents';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100" style={{ minHeight: "84vh" }}>
      {/* Component always present */}
      <HomePageForProComponents />
      
      {/* Main Content */}
      <div className="flex justify-center py-8">
        <div id="content-wrapper" className="w-full md:w-3/4 lg:w-2/3">
          <section id="main">
            {/* Page Header */}
            <header className="page-header mb-6">
              <h1 className="text-2xl font-bold text-center">Conditions générales de vente</h1>
            </header>

            {/* Page Content */}
            <section id="content" className="page-content">
              <h2 className="text-lg font-bold mb-2">1. Généralités</h2>
              <p className="mb-4">
              Le fait de passer commande auprès du Fournisseur implique l'adhésion entière et sans réserve aux présentes conditions générales de vente, et ce, nonobstant toute stipulation contraire figurant, notamment, dans les conditions générales d'achat de l'Acheteur. Les conditions générales de vente en vigueur au jour de la commande sont consultables à tout moment sur l'extranet de l'Acheteur, qui lui est ouvert avant la passation de la première commande. 
              </p>

              <h2 className="text-lg font-bold mb-2">2. Commandes</h2>
              <p className="mb-4">
                L'ouverture d'un compte client est indispensable pour pouvoir enregistrer une commande. Cette ouverture de compte peut être éventuellement conditionnée à la communication de renseignements financiers...
              </p>

              <h2 className="text-lg font-bold mb-2">3. Prix</h2>
              <p className="mb-4">
              Les produits sont facturés sur la base des tarifs applicables à la catégorie à laquelle appartient l'Acheteur, en vigueur au jour de la commande. Les tarifs peuvent être modifiés à tout moment par le Fournisseur. Toute commande passée vaut acceptation sans réserve de ces tarifs. Les tarifs applicables à l'Acheteur sont consultables à tout moment sur son extranet, le cas échéant. Ils sont fournis en euros et HT. Les tarifs n'incluent pas les frais de livraison.
              </p>

              <h2 className="text-lg font-bold mb-2">4. Délai de livraison</h2>
              <p className="mb-4">
              Les délais ne sont donnés qu'à titre indicatif et ne peuvent en cas de retard donner motif à annulation de la commande, ni droit à indemnité. Tout en nous efforçant de respecter ces dits délais, nous ne pouvons en aucun cas, être responsables des retards apportés involontairement. Des livraisons partielles peuvent être effectuées en fonction des matériels disponibles. En cas de force majeure, la livraison pourra être soit annulée, soit retardée en fonction des dits évènements. Seront considérés cas de force majeure toute perturbation de la production au sein de notre société ou chez nos fournisseurs, ainsi que toute perturbation des moyens de transport. En cas de report de la date de livraison et après mise en demeure de notre société, le client aura la possibilité d'annuler sa commande. 
              </p>

              <h2 className="text-lg font-bold mb-2">5. Transport et conformité</h2>
              <p className="mb-4">
              Quels que soient les conditions de vente, le mode d'expédition ou de livraison, nos marchandises voyagent toujours aux risques et périls du destinataire à qui il appartient de faire toutes réserves au transporteur dès la réception, notre responsabilité ne pouvant, en aucun cas, être mise en cause pour fait de destruction, avarie, vol, survenu en cours de transport. Ces réserves devront être confirmées au transporteur dans un délai maximum de trois jours par lettre recommandée avec accusé de réception, conformément aux dispositions de l'article L.133-3 du Code du Commerce, et copie nous en sera adressée dans les meilleurs délais. 
              </p>

              <h2 className="text-lg font-bold mb-2">6. Réclamations</h2>
              <p className="mb-4">
              Toute contestation quant à la conformité des marchandises, mentionnées au recto, avec la livraison, doit nous être notifiée par écrit accompagnée du bon de livraison correspondant, dans les trois jours suivant la réception de la marchandise. A défaut la livraison sera réputée parfaite et aucune réclamation ultérieure ne pourra être acceptée. Aucun retour de matériel ne sera accepté sans notre accord. 
              </p>

              <h2 className="text-lg font-bold mb-2">7. Paiement</h2>
              <p className="mb-4">
              Nos marchandises sont payables comptant, sauf conditions particulières à l'Acheteur par le Fournisseur en fonction notamment de l'ancienneté des relations commerciales, du niveau d'encours et des garanties offertes par l'Acheteur, telle la facilité de mise en œuvre de la clause de réserve de propriété. En tout état de cause, le Fournisseur pourra réviser ces conditions et imposer un paiement comptant en cas d'incident de paiement de la part de l'Acheteur. 
              </p>

              <h2 className="text-lg font-bold mb-2">8. Retard/Défaut de paiement</h2>
              <p className="mb-4">
              En cas de retard de paiement, et sans qu'aucun rappel ne soit nécessaire, l'Acheteur sera tenu, en application de l'article L.441-6 du code de commerce au paiement (i) de pénalités de retard égales à trois fois le taux de l'intérêt légal au jour de la facturation, (ii) et d'une indemnité forfaitaire pour frais de recouvrement de 40 euros par facture impayée ; une indemnité complémentaire pourra toutefois être exigée par le Fournisseur lorsque les frais de recouvrement engagés seront supérieurs à cette somme, et ce sur justificatifs produits par le Fournisseur, et ce sans préjudice de tous dommages-intérêts que le fournisseur pourrait réclamer au titre du préjudice subi. En tout état de cause, en cas de défaut de paiement, l'Acheteur devra rembourser tous les frais et honoraires occasionnés par le recouvrement contentieux des sommes dues. En cas de paiement échelonné, le non-paiement d'une échéance entraînera l'exigibilité immédiate de la totalité de la dette sans mise en demeure. Aucun paiement ne peut faire l'objet d'une compensation, d'une réduction ou d'un refus à l'initiative de l'acheteur, notamment en cas d'allégation de retard de livraison ou de défaut total ou partiel de produits sans notre accord préalable et écrit et sans que nous ayons été en mesure de contrôler la réalité du grief allégué. 
              </p>

              <h2 className="text-lg font-bold mb-2">9. Clause de réserve de propriété</h2>
              <p className="mb-4">
              De convention expresse entre l'Acheteur et le Fournisseur, il est précisé que le transfert de propriété des marchandises livrées ne s'effectuera qu'après règlement intégral du prix convenu. L'Acheteur s'oblige à assurer, à ses frais, les marchandises objet de la vente à partir de la livraison dans ses entrepôts, et à justifier, au besoin, de l'existence d'une telle assurance comportant la couverture des risques, au profit du propriétaire des marchandises. En cas de manquement total ou partiel aux obligations financières de l'Acheteur envers le Fournisseur, et après constatation de sa carence, le Fournisseur procédera immédiatement à la reprise des marchandises en stock qui seront réputées impayées. A la demande du Fournisseur, l'Acheteur sera tenu de lui communiquer un inventaire détaillé des produits en stock. Le Fournisseur pourra exercer un droit de suite sur tout ou partie du prix à payer par les sous-acquéreurs pour l'acquisition des marchandises ainsi revendues. 
              </p>

              <h2 className="text-lg font-bold mb-2">10. Garantie</h2>
              <p className="mb-4">
              En raison de sa qualité d'intermédiaire/distributeur, le Fournisseur ne fournit aucune garantie contractuelle quant aux produits. La garantie contractuelle accordée par le fabricant n'engage que celui-ci. Le Fournisseur n'est tenu qu'à la garantie légale attachée aux produits qu'il vend (art. 1641 à 1649 du Code Civil). Dans les cas où la responsabilité du Fournisseur serait valablement engagée, le montant des indemnités mises à sa charge sera limité au prix HT des produits litigieux, tel qu'il figure sur la facture. Le Fournisseur n'est tenu à aucune indemnisation envers l'utilisateur final des produits ou envers les tiers pour les conséquences de l'usage des marchandises, qu'il s'agisse de dommages directs ou indirects. L'acheteur est seul responsable des conditions d'utilisation du produit et est tenu de respecter les prescriptions des fiches techniques et fiches sécurité des produits
              </p>

              <h2 className="text-lg font-bold mb-2">11. Clause environnement</h2>
              <p className="mb-4">
              L'Acheteur s'engage à respecter les obligations mises à sa charge par le Décret du 20/07/05 relatif à l'élimination des déchets ménagers issus des équipements électriques et électroniques 
              </p>

              <h2 className="text-lg font-bold mb-2">12. Données à caractère privé</h2>
              <p className="mb-4">
              Conformément à la loi relative à l'informatique, aux fichiers et aux libertés, les informations à caractère privé relatives à l'acheteur pourront faire l'objet d'un traitement automatisé. Le fournisseur se réserve le droit de collecter des informations sur l'acheteur afin de faciliter l'administration et la gestion de la relation commerciale. 
              </p>

              <h2 className="text-lg font-bold mb-2">13. Contestations</h2>
              <p className="mb-4">
              En cas de contestation, seul le Tribunal de Commerce de Lille sera compétent, même en matière d'appel en garantie ou s'il y a pluralité de défenseurs, le tirage des traites ou l'acceptation de paiement n'impliquant ni novation, ni dérogation à cette clause attributive de juridiction.
              </p>

              {/* Footer information */}
              <p className="text-center text-sm mt-8">
                Déstockage et Distribution de produits Electroménager, Petit électroménager, Image & High Tech
              </p>
              <p className="text-center text-sm">
                SDL SAS, 2 RUE PREMIERE AVENUE, 59160 LOMME, France
              </p>
              <p className="text-center text-sm">
                Siret : 514844752
              </p>
            </section>
          </section>
        </div>
      </div>

      {/* Footer Trust Component */}
      <FooterTrust />
    </div>
  );
};

export default TermsAndConditions;