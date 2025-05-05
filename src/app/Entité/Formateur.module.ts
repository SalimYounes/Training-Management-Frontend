import { Employeur } from "./Employeur.module";
import { User } from "./User.module";

export class Formateur {
    constructor(
        public id?: string,
        public nom?: string,
        public prenom?: string,
        public email?: string,
        public tel?: string,
        public type?: string,
        public employeur?: Employeur,
        public user?: User
    ) {}
}
