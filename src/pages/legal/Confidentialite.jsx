import LegalLayout, { Art, Sep, Info } from './LegalLayout'

export default function Confidentialite() {
  return (
    <LegalLayout titre="Politique de confidentialité" sousTitre="RGPD — Protection des données">

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.8, marginBottom: '36px', fontStyle: 'italic' }}>
        Bike in Paris s'engage à protéger la vie privée de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
      </p>

      <Art num="Art. 1" titre="Responsable du traitement">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Info label="Responsable" value="Abel Dompnier — Bike in Paris" />
          <Info label="E-mail" value="abeldompnier@gmail.com" />
          <Info label="Téléphone" value="07 66 88 05 42" />
        </div>
      </Art>

      <Sep />

      <Art num="Art. 2" titre="Données collectées">
        <p style={{ marginBottom: '10px' }}>Dans le cadre d'une réservation ou d'une prise de contact, nous collectons :</p>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Nom et prénom</li>
          <li>Numéro de téléphone</li>
          <li>Adresse e-mail (si fournie)</li>
          <li>Adresse de livraison (si livraison à domicile choisie)</li>
          <li>Données de paiement (traitées directement par Stripe — non stockées par Bike in Paris)</li>
        </ul>
        <p style={{ marginTop: '10px', color: 'rgba(245,240,232,0.4)', fontSize: '0.82rem' }}>
          Nous ne collectons aucune donnée sensible (santé, origine, opinions politiques…).
        </p>
      </Art>

      <Sep />

      <Art num="Art. 3" titre="Finalités et base légale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {[
            ['Gestion des réservations', 'Exécution du contrat (art. 6.1.b RGPD)'],
            ['Facturation et comptabilité', 'Obligation légale (art. 6.1.c RGPD)'],
            ['Contact client (suivi, modification)', 'Intérêt légitime (art. 6.1.f RGPD)'],
            ['Contrat de location signé', 'Exécution du contrat + obligation légale'],
          ].map(([fin, base]) => (
            <div key={fin} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(58,56,80,0.4)' }}>
              <p style={{ color: '#F5F0E8', fontSize: '0.88rem', marginBottom: '3px', fontWeight: 600 }}>{fin}</p>
              <p style={{ color: 'rgba(200,136,58,0.7)', fontSize: '0.78rem' }}>{base}</p>
            </div>
          ))}
        </div>
      </Art>

      <Sep />

      <Art num="Art. 4" titre="Durée de conservation">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Données clients actifs : durée de la relation commerciale + 3 ans</li>
          <li>Contrats de location signés : 5 ans (obligation comptable)</li>
          <li>Données de paiement : gérées par Stripe selon leur propre politique (stripe.com/fr/privacy)</li>
        </ul>
      </Art>

      <Sep />

      <Art num="Art. 5" titre="Partage des données">
        Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.
        Elles peuvent être transmises à :
        <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li><strong style={{ color: '#F5F0E8' }}>Stripe Inc.</strong> — traitement sécurisé des paiements en ligne</li>
          <li><strong style={{ color: '#F5F0E8' }}>Laka</strong> — assurance partenaire optionnelle (nom, prénom, e-mail transmis uniquement si l'option assurance est souscrite à la réservation)</li>
          <li>Toute autorité légale qui en ferait la demande dans le cadre d'une procédure judiciaire</li>
        </ul>
      </Art>

      <Sep />

      <Art num="Art. 6" titre="Vos droits (RGPD)">
        <p style={{ marginBottom: '10px' }}>Conformément au RGPD, vous disposez des droits suivants :</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            ['Droit d\'accès', 'Obtenir une copie de vos données'],
            ['Droit de rectification', 'Corriger des données inexactes'],
            ['Droit à l\'effacement', 'Supprimer vos données (sous conditions légales)'],
            ['Droit d\'opposition', 'Vous opposer à un traitement basé sur l\'intérêt légitime'],
            ['Droit à la portabilité', 'Recevoir vos données dans un format structuré'],
            ['Droit de réclamation', 'Saisir la CNIL — cnil.fr'],
          ].map(([droit, desc]) => (
            <div key={droit} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(58,56,80,0.25)' }}>
              <span style={{ color: '#C8883A', fontSize: '0.82rem', fontWeight: 600, minWidth: '160px', flexShrink: 0 }}>{droit}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.65)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '14px', fontSize: '0.85rem' }}>
          Pour exercer vos droits : <a href="mailto:abeldompnier@gmail.com" style={{ color: '#C8883A' }}>abeldompnier@gmail.com</a> ou par téléphone au 07 66 88 05 42.
          Nous répondrons dans un délai d'un mois maximum.
        </p>
      </Art>

      <Sep />

      <Art num="Art. 7" titre="Cookies et consentement">
        <p style={{ marginBottom: '10px' }}>Ce site utilise les types de cookies suivants :</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {[
            ['Cookies techniques essentiels', 'Nécessaires au fonctionnement du site (session, préférences). Pas de consentement requis.'],
            ['Cookies Stripe', 'Déposés lors d\'un paiement en ligne sécurisé. Soumis à votre consentement.'],
          ].map(([type, desc]) => (
            <div key={type} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(58,56,80,0.4)' }}>
              <p style={{ color: '#F5F0E8', fontSize: '0.88rem', marginBottom: '3px', fontWeight: 600 }}>{type}</p>
              <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '0.78rem', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.55)' }}>
          Lors de votre première visite, un bandeau de consentement vous permet d'accepter ou de refuser les cookies non essentiels.
          Votre choix est mémorisé localement (localStorage). Vous pouvez le modifier à tout moment en effaçant les données de votre navigateur.
        </p>
      </Art>

      <Sep />

      <Art num="Art. 8" titre="Sécurité des données">
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre toute perte, accès non autorisé ou divulgation :
        connexions chiffrées (HTTPS), accès restreint aux données, mots de passe sécurisés.
      </Art>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(245,240,232,0.25)', marginTop: '40px' }}>
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </p>
    </LegalLayout>
  )
}
