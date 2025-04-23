import { Structure } from "./Structure.module";
import { Profil } from "./Profil.module";
import { Formation } from "./Formation.module";

export class Participant {
    constructor(
        public id?: string,
        public nom?: string,
        public prenom?: string,
        public email?: string,
        public tel?: number,  // ou String selon votre besoin
        public structure?: Structure,
        public profil?: Profil,
        public formations?: Formation[]  // Set de formations
    ) {}
}
