import LegalLayout, { Art, Sep, Info } from './LegalLayout'

export default function MentionsLegales() {
  return (
    <LegalLayout titre="Mentions légales" sousTitre="Informations légales — LCEN">

      <Art num="1." titre="Éditeur du site">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Info label="Nom" value="Abel Dompnier" />
          <Info label="Activité" value="Location de vélos électriques bi-places — Bike in Paris" />
          <Info label="Statut" value="Auto-entrepreneur" />
          <Info label="SIRET" value="En cours d'immatriculation" />
          <Info label="Adresse" value="Paris 12ème arrondissement, France" />
          <Info label="Téléphone" value="07 66 88 05 42" />
          <Info label="E-mail" value="abeldompnier@gmail.com" />
        </div>
      </Art>

      <Sep />

      <Art num="2." titre="Hébergement">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Info label="Hébergeur" value="Vercel Inc." />
          <Info label="Adresse" value="340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis" />
          <Info label="Site web" value="https://vercel.com" />
        </div>
      </Art>

      <Sep />

      <Art num="3." titre="Propriété intellectuelle">
        L'ensemble du contenu de ce site (textes, photographies, logo, design) est la propriété exclusive de Bike in Paris — Abel Dompnier.
        Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
      </Art>

      <Sep />

      <Art num="4." titre="Limitation de responsabilité">
        Bike in Paris s'efforce de maintenir les informations de ce site à jour et exactes. Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations publiées.
        L'utilisation des informations et contenus disponibles sur ce site se fait sous l'entière et unique responsabilité de l'utilisateur.
      </Art>

      <Sep />

      <Art num="5." titre="Droit applicable et juridiction compétente">
        Le présent site et les présentes mentions légales sont soumis au droit français.
        En cas de litige, les tribunaux français seront seuls compétents.
      </Art>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(245,240,232,0.25)', marginTop: '40px' }}>
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </p>
    </LegalLayout>
  )
}
