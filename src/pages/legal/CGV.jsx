import LegalLayout, { Art, Sep } from './LegalLayout'

export default function CGV() {
  return (
    <LegalLayout titre="Conditions Générales de Vente" sousTitre="CGV — Location de vélo">

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.8, marginBottom: '36px', fontStyle: 'italic' }}>
        Les présentes Conditions Générales de Vente s'appliquent à toute location effectuée auprès de Bike in Paris (Abel Dompnier).
        Toute réservation implique l'acceptation pleine et entière des présentes CGV.
      </p>

      <Art num="Art. 1" titre="Objet">
        Bike in Paris propose à la location un vélo électrique bi-place de type Fat Bike, avec ses accessoires (casques, antivol certifié GPS).
        La location est conclue entre Abel Dompnier (le Loueur) et toute personne physique majeure effectuant une réservation (le Locataire).
      </Art>

      <Sep />

      <Art num="Art. 2" titre="Réservation et confirmation">
        <p>La réservation s'effectue par téléphone au <strong style={{ color: '#C8883A' }}>07 66 88 05 42</strong> ou via le formulaire en ligne sur ce site.</p>
        <p style={{ marginTop: '8px' }}>Elle est confirmée après accord verbal ou écrit sur les disponibilités, le créneau horaire et le tarif applicable.</p>
      </Art>

      <Sep />

      <Art num="Art. 3" titre="Tarifs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0' }}>
          {[
            ['2 heures', '25 €'],
            ['Demi-journée (4h)', '40 €'],
            ['Soirée (4h à 5h)', '50 €'],
            ['Journée', '55 €'],
            ['Journée + Soirée (jusqu\'à minuit)', '80 €'],
            ['Livraison à domicile (Paris intra-muros)', '+10 €'],
            ['Retrait sur place — 10 rue Moreau, Paris 12ème', 'Gratuit'],
          ].map(([l, p]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(58,56,80,0.25)' }}>
              <span>{l}</span>
              <span style={{ color: '#C8883A', fontWeight: 600 }}>{p}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)' }}>
          Les tarifs sont indiqués en euros TTC. Bike in Paris se réserve le droit de modifier ses tarifs à tout moment. Le tarif applicable est celui en vigueur au moment de la réservation.
        </p>
      </Art>

      <Sep />

      <Art num="Art. 4" titre="Paiement">
        Le paiement est exigible au moment de la remise du vélo ou lors de la réservation en ligne (paiement sécurisé via Stripe).
        Les moyens de paiement acceptés sont : carte bancaire, espèces, virement.
        Aucune location ne peut débuter sans paiement intégral du tarif convenu.
      </Art>

      <Sep />

      <Art num="Art. 5" titre="Caution et pièce d'identité">
        En l'absence de caution bancaire, le Locataire est tenu de remettre une pièce d'identité officielle originale en cours de validité (CNI ou Passeport) qui sera restituée à la fin de la location.
        En cas de refus, Bike in Paris se réserve le droit de refuser la location.
      </Art>

      <Sep />

      <Art num="Art. 6" titre="Responsabilité du Locataire">
        Dès la remise du vélo, le Locataire assume l'entière responsabilité du matériel. En cas de vol, perte ou dommage :
        <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Vol ou perte → valeur de remplacement forfaitaire : <strong style={{ color: '#C8883A' }}>1 250 €</strong></li>
          <li>Dégradation → remboursement des frais réels de réparation sur facture</li>
        </ul>
        <p style={{ marginTop: '10px' }}>
          Le Locataire s'engage à utiliser l'antivol fourni lors de chaque stationnement, même momentané.
        </p>
      </Art>

      <Sep />

      <Art num="Art. 7" titre="Droit de rétractation">
        Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation de 14 jours ne s'applique pas aux
        <strong> contrats de services de loisirs qui doivent être fournis à une date ou une période déterminée</strong>.
        En conséquence, aucun remboursement n'est dû si la location est annulée moins de 24h avant le début.
        Au-delà de 24h, un avoir ou remboursement intégral sera proposé selon les disponibilités.
      </Art>

      <Sep />

      <Art num="Art. 8" titre="Annulation et modification">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Annulation {'>'} 24h avant : remboursement intégral ou avoir</li>
          <li>Annulation {'<'} 24h avant : aucun remboursement</li>
          <li>Modification : selon disponibilités, sans frais si préavis {'>'} 24h</li>
        </ul>
      </Art>

      <Sep />

      <Art num="Art. 9" titre="Zone d'utilisation">
        L'utilisation du vélo est strictement limitée à Paris intra-muros et à la petite couronne. Toute sortie hors de cette zone est interdite sous peine de désactivation du vélo par GPS.
      </Art>

      <Sep />

      <Art num="Art. 10" titre="Litiges">
        En cas de litige, une solution amiable sera recherchée en priorité.
        À défaut, les tribunaux compétents de Paris seront saisis.
        Le consommateur peut également recourir à un médiateur de la consommation conformément à l'article L616-1 du Code de la consommation.
      </Art>

      <Sep />

      <Art num="Art. 11" titre="Assurance optionnelle — Partenaire Laka">
        <p style={{ marginBottom: '10px' }}>
          Bike in Paris propose, à titre optionnel et payant, la souscription à une assurance vélo via son partenaire <strong style={{ color: '#F5F0E8' }}>Laka</strong>.
        </p>
        <p style={{ marginBottom: '14px', color: 'rgba(245,240,232,0.7)' }}>
          Cette option peut être choisie lors de la réservation, au tarif de <strong style={{ color: '#C8883A' }}>10 € par jour</strong> de location.
        </p>
        <p style={{ fontWeight: 600, color: '#F5F0E8', marginBottom: '8px', fontSize: '0.88rem' }}>Couvertures incluses :</p>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <li>Vol (avec effraction ou agression) — valeur de remplacement</li>
          <li>Casse accidentelle — réparation ou remplacement</li>
          <li>Assistance urgences jusqu'à <strong style={{ color: '#C8883A' }}>200 €</strong></li>
        </ul>
        <p style={{ fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)' }}>
          L'assurance Laka est souscrite directement auprès de Laka et régie par ses propres conditions générales, disponibles sur <strong style={{ color: 'rgba(200,136,58,0.7)' }}>laka.co</strong>.
          Bike in Paris n'intervient pas dans la gestion des sinistres. Toute déclaration de sinistre doit être effectuée directement auprès de Laka dans les délais impartis.
          En l'absence de souscription à cette option, le Locataire reste entièrement responsable du matériel conformément à l'Art. 6 des présentes CGV.
        </p>
      </Art>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(245,240,232,0.25)', marginTop: '40px' }}>
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </p>
    </LegalLayout>
  )
}
