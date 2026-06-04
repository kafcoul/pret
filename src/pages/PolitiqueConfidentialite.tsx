import PageHero from '../components/ui/PageHero';
import { useSiteContent } from '../lib/SiteContentContext';

export default function PolitiqueConfidentialite() {
    const { c } = useSiteContent();
    return (
        <>
            <PageHero
                title={c('politique.hero.titre', 'Politique de confidentialité')}
                subtitle={c('politique.hero.soustitre', 'Protection de vos renseignements personnels')}
                breadcrumb={[{ label: c('breadcrumb.politique', 'Politique de confidentialité') }]}
            />

            <section className="py-16">
                <div className="mx-auto max-w-3xl px-4 prose prose-gray">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 space-y-8 text-sm leading-relaxed text-gray-700">

                        <p className="text-gray-500 text-xs">
                            Dernière mise à jour : 22 février 2026
                        </p>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">1. Introduction</h2>
                            <p>
                                {c('coord.nom.entreprise', 'Solutions Financement Fortier')} Inc. (« nous », « notre » ou « la société ») s'engage à protéger
                                la vie privée et les renseignements personnels de ses clients, visiteurs et utilisateurs
                                de son site Web. Cette politique de confidentialité décrit comment nous recueillons,
                                utilisons, divulguons et protégeons vos renseignements personnels, conformément à la
                                <strong> Loi 25 sur la protection des renseignements personnels dans le secteur privé</strong> du Québec
                                et à la <strong>Loi sur la protection des renseignements personnels et les documents
                                    électroniques (LPRPDE)</strong> du Canada.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">2. Renseignements recueillis</h2>
                            <p className="mb-2">Nous pouvons recueillir les renseignements suivants :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Nom et prénom</li>
                                <li>Adresse courriel et numéro de téléphone</li>
                                <li>Ville de résidence</li>
                                <li>Type de financement recherché et type de propriété</li>
                                <li>Montant de financement souhaité</li>
                                <li>Toute autre information que vous nous transmettez volontairement via nos formulaires</li>
                                <li>Données de navigation (adresse IP, type de navigateur, pages visitées) via des témoins (cookies)</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">3. Utilisation des renseignements</h2>
                            <p className="mb-2">Vos renseignements personnels sont utilisés aux fins suivantes :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Traiter et évaluer votre demande de financement</li>
                                <li>Communiquer avec vous concernant nos services</li>
                                <li>Améliorer notre site Web et nos services</li>
                                <li>Respecter nos obligations légales et réglementaires</li>
                                <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">4. Témoins (cookies)</h2>
                            <p>
                                Notre site utilise des témoins pour améliorer votre expérience de navigation et analyser
                                le trafic. Lors de votre première visite, un bandeau de consentement vous permet d'accepter
                                ou de refuser les témoins non essentiels. Vous pouvez modifier vos préférences à tout moment
                                dans les paramètres de votre navigateur.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">5. Partage des renseignements</h2>
                            <p>
                                Nous ne vendons, ne louons ni n'échangeons vos renseignements personnels avec des tiers à
                                des fins commerciales. Nous pouvons partager vos renseignements avec :
                            </p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                <li>Nos fournisseurs de services (hébergement, courriel) dans la stricte mesure nécessaire</li>
                                <li>Les autorités compétentes si la loi l'exige</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">6. Conservation des données</h2>
                            <p>
                                Vos renseignements personnels sont conservés aussi longtemps que nécessaire pour les fins
                                pour lesquelles ils ont été recueillis, ou conformément aux exigences légales applicables.
                                Une fois la période de conservation expirée, vos données sont supprimées de façon sécuritaire.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">7. Sécurité</h2>
                            <p>
                                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour
                                protéger vos renseignements personnels contre tout accès non autorisé, toute divulgation, perte
                                ou destruction. Nos données sont hébergées sur des serveurs sécurisés avec chiffrement en transit
                                et au repos.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">8. Vos droits</h2>
                            <p className="mb-2">Conformément à la Loi 25, vous disposez des droits suivants :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Droit d'accès à vos renseignements personnels</li>
                                <li>Droit de rectification de vos renseignements</li>
                                <li>Droit à l'effacement (dans les limites de la loi)</li>
                                <li>Droit de retirer votre consentement</li>
                                <li>Droit de déposer une plainte auprès de la Commission d'accès à l'information du Québec</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">9. Responsable de la protection des renseignements</h2>
                            <p>
                                Pour toute question relative à cette politique ou pour exercer vos droits, vous pouvez communiquer avec notre
                                responsable de la protection des renseignements personnels :
                            </p>
                            <div className="bg-gray-50 rounded-xl p-4 mt-3">
                                <p className="font-semibold text-primary-700">{c('coord.nom.entreprise', 'Solutions Financement Fortier')} Inc.</p>
                                <p>NEQ : {c('coord.neq', '2271887236')}</p>
                                <p>{c('coord.adresse.ligne1', '490, rue de Kilkenny')}, {c('coord.adresse.ligne2', 'Fossambault-sur-le-Lac, QC G3N 3C4')}</p>
                                <p>Téléphone : {c('coord.telephone1', '450 914-5709')}</p>
                                <p>Courriel : {c('coord.courriel', 'info@solutionsfortier.com')}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-xl font-bold text-primary-700 mb-3">10. Modifications</h2>
                            <p>
                                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                                Toute modification sera publiée sur cette page avec une date de mise à jour révisée.
                                Nous vous encourageons à consulter régulièrement cette page.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
