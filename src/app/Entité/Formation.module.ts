import { Domaine } from "./Domaine.module";
import { Formateur } from "./Formateur.module";

export class Formation {
    constructor(
        public id?: string,
        public titre?: string,
        public annee?: number,
        public duree?: number,  // nombre de jours
        public budget?: number,
        public domaine?: Domaine,
        public formateur?: Formateur
    ) {}
}
